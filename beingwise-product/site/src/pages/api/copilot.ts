import type { APIRoute } from 'astro';

// Runs on-demand (serverless) so the Gemini key stays server-side, never in the
// browser. Two modes:
//   instruct — apply the student's natural-language request, return the new order
//   review   — the student just dragged/moved a card; critique THAT move and
//              return the order the Copilot would actually recommend.
// In both modes the Copilot has strong opinions and pushes back on bad choices.
export const prerender = false;

const MODEL = 'gemini-2.5-flash';
const endpoint = (key: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(key)}`;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

type Item = { inst: string; branch: string; tag?: string; close?: number };

export const POST: APIRoute = async ({ request }) => {
  const key = import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) return json({ verdict: 'good', message: "The Copilot isn't configured yet (missing GEMINI_API_KEY).", order: [] }, 500);

  let body: any;
  try { body = await request.json(); } catch { return json({ verdict: 'good', message: 'Bad request.', order: [] }, 400); }

  const mode: 'instruct' | 'review' = body?.mode === 'review' ? 'review' : 'instruct';
  const instruction: string = (body?.instruction || '').toString().slice(0, 500).trim();
  const current: Item[] = Array.isArray(body?.current) ? body.current.slice(0, 60) : [];
  const pool: Item[] = Array.isArray(body?.pool) ? body.pool.slice(0, 200) : [];
  const { rank, category, state } = body || {};
  if (!instruction && mode === 'instruct') return json({ verdict: 'good', message: 'Tell me what to change about your list.', order: [] }, 400);

  const exam = state === 'AP' ? 'AP EAPCET' : 'TS EAMCET';
  const sys =
    `You are the BeingWise Decision Copilot — a sharp, honest senior ${exam} counsellor for an Indian engineering aspirant ` +
    `(rank ${rank}, category ${category}). You have STRONG OPINIONS and you are NOT a yes-man. Your job is to get this student ` +
    `the best seat their rank can reach, NOT to agree with them.\n` +
    `How you think:\n` +
    `- Tiers: "Dream" closes better than the student (a stretch), "Likely" closes near them, "Secure" closes worse (their safe floor).\n` +
    `- The student STUDIES the branch they rank higher, for four years and a career. CSE/IT usually place better than core branches at the same college; a bigger-name college does NOT rescue a weak or low-demand branch.\n` +
    `- Allotment scans top-to-bottom and stops at the first match, so order is the real decision. A Secure backup ranked above a still-winnable better college throws that better seat away.\n` +
    `- Always keep at least 2 Secure options as a floor unless the student explicitly insists otherwise — then warn them.\n` +
    `- Consider local region and fee-reimbursement realities when relevant.\n` +
    `Voice: direct, warm, specific. Name actual colleges/branches from the data. Push back plainly when a choice is a mistake ("I wouldn't — Vasavi CSE places higher than MGIT Mechanical; keep CSE on top"). Praise genuinely good moves in one line; never flatter. Never invent colleges — use only the POOL.`;

  const reviewTask =
    `The student just made this move: "${instruction}". Their CURRENT order is below.\n` +
    `Give your honest verdict on THIS move. In "order", return the ordering YOU would recommend (it can match their order if the move was good, or differ if you'd fix it).`;
  const instructTask =
    `The student asked: "${instruction}". Apply it sensibly. If it is a mistake (e.g. removing their whole safe floor, burying a strong CSE seat under a backup), still help but PUSH BACK in your message and keep them protected. In "order", return the new recommended ordering.`;

  const prompt =
    `POOL (the only colleges you may use):\n${JSON.stringify(pool)}\n\n` +
    `CURRENT ORDER:\n${JSON.stringify(current.map((c) => ({ inst: c.inst, branch: c.branch, tag: c.tag })))}\n\n` +
    `${mode === 'review' ? reviewTask : instructTask}\n\n` +
    `Return JSON only.`;

  const payload = {
    systemInstruction: { parts: [{ text: sys }] },
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.35,
      maxOutputTokens: 2048,
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          verdict: { type: 'string', enum: ['good', 'caution', 'bad'] },
          message: { type: 'string' },
          order: {
            type: 'array',
            items: { type: 'object', properties: { inst: { type: 'string' }, branch: { type: 'string' } }, required: ['inst', 'branch'] },
          },
        },
        required: ['verdict', 'message', 'order'],
      },
    },
  };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  try {
    const r = await fetch(endpoint(key), {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!r.ok) {
      console.error('[copilot] gemini', r.status, await r.text());
      return json({ verdict: 'good', message: "I couldn't reach my brain just now — try again, or move the rows yourself.", order: [] }, 200);
    }
    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    let out: any;
    try { out = JSON.parse(text); } catch { out = {}; }
    return json({
      verdict: ['good', 'caution', 'bad'].includes(out.verdict) ? out.verdict : 'good',
      message: out.message || 'Noted.',
      order: Array.isArray(out.order) ? out.order : [],
    }, 200);
  } catch (e: any) {
    clearTimeout(timer);
    console.error('[copilot] error', e?.message);
    return json({ verdict: 'good', message: "I couldn't reach my brain just now — try again, or move the rows yourself.", order: [] }, 200);
  }
};
