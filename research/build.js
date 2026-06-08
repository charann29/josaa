#!/usr/bin/env node
/* Build research deliverables from the workflow journal (or final data.json).
   Usage: node build.js [journal.jsonl|data.json]
   Re-runnable: safe on partial data, regenerates everything. */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = process.argv[2] ||
  '/Users/charan/.claude/projects/-Users-charan-Desktop-josaa/a9f69c10-7b8d-4a24-882a-6f4afe742b1a/subagents/workflows/wf_65db54dd-355/journal.jsonl';

// ---- Collect results ----
let results = [];
if (SRC.endsWith('.json') && !SRC.endsWith('.jsonl')) {
  const obj = JSON.parse(fs.readFileSync(SRC, 'utf8'));
  // final shape { community, competitors, engagement, serp, stress, survey }
  for (const k of ['community', 'engagement', 'serp']) (obj[k] || []).forEach(r => results.push(r));
  (obj.competitors || []).forEach(r => results.push({ __competitor: r }));
  if (obj.stress) results.push({ __stress: obj.stress });
  if (obj.survey) results.push({ __survey: obj.survey });
} else {
  const lines = fs.readFileSync(SRC, 'utf8').split('\n').filter(Boolean);
  for (const ln of lines) {
    let o; try { o = JSON.parse(ln); } catch { continue; }
    if (o.type !== 'result' || !o.result) continue;
    const r = o.result;
    if (Array.isArray(r.items)) results.push(r);
    else if (r.business_model !== undefined) results.push({ __competitor: r });
    else if (r.verdict !== undefined) results.push({ __stress: r });
    else if (r.markdown !== undefined) results.push({ __survey: r });
  }
}

// ---- Partition ----
const urlResults = results.filter(r => Array.isArray(r.items));
const competitors = results.filter(r => r.__competitor).map(r => r.__competitor);
const stress = (results.find(r => r.__stress) || {}).__stress || null;
const survey = (results.find(r => r.__survey) || {}).__survey || null;

// ---- Dedupe URLs globally ----
const seen = new Map();
for (const res of urlResults) {
  for (const it of (res.items || [])) {
    if (!it.url) continue;
    const key = it.url.split('#')[0].replace(/\/$/, '');
    if (!seen.has(key)) seen.set(key, { ...it, lanes: new Set([res.lane]) });
    else seen.get(key).lanes.add(res.lane);
  }
}
// ---- Merge YouTube Data API harvest (real view counts) if present ----
let ytVideos = [], ytChannels = [];
const ytPath = path.join(ROOT, 'youtube_data.json');
if (fs.existsSync(ytPath)) {
  try {
    const yt = JSON.parse(fs.readFileSync(ytPath, 'utf8'));
    ytVideos = yt.videos || [];
    ytChannels = yt.channelStats || [];
    const fmt = n => Number(n).toLocaleString('en-IN');
    for (const v of ytVideos) {
      const key = v.url.split('#')[0].replace(/\/$/, '');
      const note = `${fmt(v.views)} views · ${fmt(v.comments)} comments · ${v.channel} · ${(v.publishedAt || '').slice(0, 10)}`;
      if (!seen.has(key)) seen.set(key, { url: v.url, title: v.title, type: 'youtube_video', theme: v.theme || 'general', can_engage: true, note, views: v.views, comments: v.comments, lanes: new Set(['youtube_api']) });
      else { const e = seen.get(key); e.views = v.views; e.comments = v.comments; e.note = (e.note ? e.note + ' · ' : '') + note; }
    }
  } catch (e) { console.error('yt merge failed', e.message); }
}

// ---- Merge Reddit harvest if present ----
let redditThreads = [], redditSubs = [];
const redditPath = path.join(ROOT, 'reddit_data.json');
if (fs.existsSync(redditPath)) {
  try {
    const rd = JSON.parse(fs.readFileSync(redditPath, 'utf8'));
    redditThreads = rd.threads || [];
    redditSubs = rd.subredditStats || [];
    const fmt = n => Number(n).toLocaleString('en-IN');
    for (const t of redditThreads) {
      const key = t.url.split('#')[0].replace(/\/$/, '');
      const note = `r/${t.subreddit} · ${fmt(t.score)} upvotes · ${fmt(t.num_comments)} comments`;
      if (seen.has(key)) {
        const e = seen.get(key);
        e.score = t.score;
        e.comments = t.num_comments;
        e.upvote_ratio = t.upvote_ratio;
        e.note = (e.note ? e.note + ' · ' : '') + note;
      }
    }
  } catch (e) { console.error('reddit merge failed', e.message); }
}

// ---- Merge Quora harvest if present ----
let quoraQuestions = [], quoraThemes = [];
const quoraPath = path.join(ROOT, 'quora_data.json');
if (fs.existsSync(quoraPath)) {
  try {
    const qd = JSON.parse(fs.readFileSync(quoraPath, 'utf8'));
    quoraQuestions = qd.questions || [];
    quoraThemes = qd.themeStats || [];
    const fmt = n => n != null ? Number(n).toLocaleString('en-IN') : '—';
    for (const q of quoraQuestions) {
      if (!q.scraped) continue;
      const key = q.url.split('#')[0].replace(/\/$/, '');
      const note = `${fmt(q.answers)} answers · ${fmt(q.views)} views`;
      if (seen.has(key)) {
        const e = seen.get(key);
        e.answers = q.answers;
        e.followers = q.followers;
        e.views = q.views;
        e.note = (e.note ? e.note + ' · ' : '') + note;
      }
    }
  } catch (e) { console.error('quora merge failed', e.message); }
}

// ---- Merge Instagram harvest if present ----
let igAccounts = [];
const igPath = path.join(ROOT, 'instagram_data.json');
if (fs.existsSync(igPath)) {
  try {
    const ig = JSON.parse(fs.readFileSync(igPath, 'utf8'));
    igAccounts = ig.accounts || [];
    const fmt = n => n != null ? Number(n).toLocaleString('en-IN') : '—';
    for (const a of igAccounts) {
      if (!a.scraped) continue;
      const key = a.url.split('#')[0].replace(/\/$/, '');
      const note = `@${a.username} · ${fmt(a.followers)} followers · ${fmt(a.posts)} posts`;
      if (seen.has(key)) {
        const e = seen.get(key);
        e.followers = a.followers;
        e.posts = a.posts;
        e.note = (e.note ? e.note + ' · ' : '') + note;
      }
    }
  } catch (e) { console.error('instagram merge failed', e.message); }
}

const items = [...seen.values()].map(i => ({ ...i, lanes: [...i.lanes] }));

// ---- Helpers ----
const THEME_LABEL = {
  choice_filling: 'Choice-filling order & locking',
  float_freeze_slide: 'Float / Freeze / Slide',
  predictor_spam: 'Predictor distrust & lead-gen spam',
  branch_vs_college: 'Branch vs College agony',
  deposit_forfeiture: 'Private/state deposit forfeiture',
  quota_category: 'Quota / category / gender pool',
  percentile_rank: 'Percentile vs rank / normalization',
  scams_misinfo: 'Scams & misinformation',
  documents: 'Documents & reporting',
  registration: 'Exam registration friction',
  exam_center: 'Exam center logistics',
  loans_scholarships: 'Loans & scholarships',
  drop_year: 'Drop-year decision',
  branch_change: 'Branch change',
  general: 'General / cross-cutting',
};
const TYPE_LABEL = {
  reddit_thread: 'Reddit', youtube_video: 'YouTube (video)', youtube_channel: 'YouTube (channel)',
  quora_question: 'Quora', instagram_account: 'Instagram', telegram_channel: 'Telegram',
  telegram_group: 'Telegram', discord: 'Discord', forum_thread: 'Forum', tweet: 'X/Twitter',
  article: 'Article', app: 'App', other: 'Other',
};
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const csvCell = s => '"' + String(s == null ? '' : s).replace(/"/g, '""').replace(/\n/g, ' ') + '"';
const groupBy = (arr, fn) => arr.reduce((m, x) => { const k = fn(x) || 'general'; (m[k] = m[k] || []).push(x); return m; }, {});

function w(rel, content) {
  const p = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
  console.log('wrote', rel, '(' + content.length + ' bytes)');
}

// ---- 1. URL catalog: CSV ----
const csvHead = ['url', 'title', 'platform', 'theme', 'can_engage', 'note', 'views', 'score_likes', 'comments_answers', 'followers'].map(csvCell).join(',');
const csvRows = items.map(i => [
  i.url, i.title, i.type, i.theme, i.can_engage, i.note,
  i.views || '', i.score || '', i.comments || i.answers || '', i.followers || ''
].map(csvCell).join(','));
w('urls/all_urls.csv', [csvHead, ...csvRows].join('\n') + '\n');

// ---- 2. URL catalog: by theme (markdown) ----
const byTheme = groupBy(items, i => i.theme);
let md = `# JoSAA Co-pilot — Master URL Catalog (by pain-point)\n\n`;
md += `**${items.length} unique verified URLs** mined by the research fleet. Generated ${new Date().toISOString().slice(0, 10)}.\n\n`;
md += `> Every link below was returned by a live web-search agent. Links an agent could not verify were dropped.\n\n`;
md += `## Index\n` + Object.keys(byTheme).sort((a, b) => byTheme[b].length - byTheme[a].length)
  .map(t => `- [${THEME_LABEL[t] || t}](#${(THEME_LABEL[t] || t).toLowerCase().replace(/[^a-z0-9]+/g, '-')}) — ${byTheme[t].length}`).join('\n') + '\n\n';
for (const t of Object.keys(byTheme).sort((a, b) => byTheme[b].length - byTheme[a].length)) {
  md += `## ${THEME_LABEL[t] || t}\n\n`;
  for (const i of byTheme[t]) {
    md += `- [${i.title || i.url}](${i.url}) — _${TYPE_LABEL[i.type] || i.type}_${i.can_engage ? ' · 💬 can engage' : ''}\n  ${i.note || ''}\n`;
  }
  md += '\n';
}
w('urls/by_theme.md', md);

// ---- 3. URL catalog: by platform ----
const byType = groupBy(items, i => TYPE_LABEL[i.type] || i.type);
let mdp = `# Master URL Catalog (by platform)\n\n**${items.length} unique URLs.**\n\n`;
for (const t of Object.keys(byType).sort((a, b) => byType[b].length - byType[a].length)) {
  mdp += `## ${t} (${byType[t].length})\n\n`;
  for (const i of byType[t]) mdp += `- [${i.title || i.url}](${i.url}) — ${THEME_LABEL[i.theme] || i.theme}${i.can_engage ? ' · 💬' : ''}\n`;
  mdp += '\n';
}
w('urls/by_platform.md', mdp);

// ---- 4. Engagement venues (can_engage = true) ----
const eng = items.filter(i => i.can_engage);
const engByType = groupBy(eng, i => TYPE_LABEL[i.type] || i.type);
let mde = `# Engagement Venues — where you can post / comment / promote\n\n`;
mde += `**${eng.length} venues** flagged as places to engage students/parents directly.\n\n`;
mde += `> Always read each community's self-promotion rules before posting. Lead with help, not pitch.\n\n`;
for (const t of Object.keys(engByType).sort((a, b) => engByType[b].length - engByType[a].length)) {
  mde += `## ${t} (${engByType[t].length})\n\n`;
  for (const i of engByType[t]) mde += `- [${i.title || i.url}](${i.url})\n  ${i.note || ''}\n`;
  mde += '\n';
}
w('engagement/engagement_venues.md', mde);

// ---- 5. Competitors ----
if (competitors.length) {
  let mdc = `# Competitor Teardown\n\n${competitors.length} competitors analyzed.\n\n`;
  for (const c of competitors) {
    mdc += `## ${c.name}\n\n`;
    if (c.url) mdc += `**Site:** ${c.url}\n\n`;
    mdc += `**Business model:** ${c.business_model || '—'}\n\n`;
    mdc += `**Pricing:** ${c.pricing || '—'}\n\n`;
    if (c.offerings?.length) mdc += `**Offerings:**\n` + c.offerings.map(x => `- ${x}`).join('\n') + '\n\n';
    if (c.complaints?.length) mdc += `**User complaints:**\n` + c.complaints.map(x => `- ${x}`).join('\n') + '\n\n';
    if (c.gaps?.length) mdc += `**Gaps we can exploit:**\n` + c.gaps.map(x => `- ${x}`).join('\n') + '\n\n';
    if (c.evidence_urls?.length) mdc += `**Evidence:**\n` + c.evidence_urls.map(x => `- ${x}`).join('\n') + '\n\n';
    mdc += '---\n\n';
  }
  w('competitors/competitors.md', mdc);
}

// ---- 6. Stress test ----
if (stress) {
  let mds = `# Problem Stress-Test — Is this a good problem?\n\n`;
  mds += `## Verdict\n\n${stress.verdict}\n\n**Score: ${stress.score_10}/10**\n\n`;
  const sec = (t, a) => a?.length ? `## ${t}\n\n` + a.map(x => `- ${x}`).join('\n') + '\n\n' : '';
  mds += sec('Market size signals (TAM)', stress.tam_signals);
  mds += sec('Demand evidence', stress.demand_evidence);
  mds += sec('Willingness-to-pay evidence', stress.wtp_evidence);
  mds += sec('Risks', stress.risks);
  mds += sec('Kill criteria (when to walk away)', stress.kill_criteria);
  mds += sec('Evidence URLs', stress.evidence_urls);
  w('validation/stress_test.md', mds);
}

// ---- 7. SERP / demand (items whose lane came from serp) ----
const serpItems = items.filter(i => (i.lanes || []).some(l => /paa|demand|app|trend|serp|keyword/i.test(l || '')));
if (serpItems.length) {
  let mdq = `# SERP & Demand Signals\n\n${serpItems.length} keyword/PAA/app/demand items.\n\n`;
  for (const i of serpItems) mdq += `- **${i.title || i.url}** — ${i.note || ''}\n  ${i.url}\n`;
  w('validation/serp_demand.md', mdq);
}

// ---- 8. Survey bank ----
if (survey?.markdown) w('survey/survey_bank.md', survey.markdown);

// ---- 9. data.json (raw aggregate) ----
w('data.json', JSON.stringify({ generated: new Date().toISOString(), counts: {
  urls: items.length, competitors: competitors.length, engagement: eng.length,
}, items, competitors, stress, survey }, null, 2));

// ---- 10. HTML dashboard ----
const themeCounts = Object.entries(byTheme).map(([k, v]) => [THEME_LABEL[k] || k, v.length]).sort((a, b) => b[1] - a[1]);
const typeCounts = Object.entries(byType).map(([k, v]) => [k, v.length]).sort((a, b) => b[1] - a[1]);
const rowsJson = JSON.stringify(items.map(i => ({
  u: i.url, t: i.title, p: TYPE_LABEL[i.type] || i.type, th: THEME_LABEL[i.theme] || i.theme, e: !!i.can_engage, n: i.note,
  vi: i.views || 0, sc: i.score || 0, co: i.comments || i.answers || 0, fo: i.followers || 0
})));
const bar = (data, color) => data.map(([k, v]) => {
  const max = Math.max(...data.map(d => d[1]), 1);
  return `<div class="bar"><span class="bl">${esc(k)}</span><span class="bt" style="width:${Math.round(v / max * 100)}%;background:${color}"></span><span class="bv">${v}</span></div>`;
}).join('');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>JoSAA Co-pilot — Research Dashboard</title><style>
:root{--bg:#0b1020;--card:#141b2e;--ink:#e8edf7;--mut:#94a3b8;--ac:#5b8cff;--ac2:#22c55e;--ac3:#f59e0b;--bd:#243049}
*{box-sizing:border-box}body{margin:0;font:15px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;background:var(--bg);color:var(--ink)}
header{padding:28px 24px;border-bottom:1px solid var(--bd);background:linear-gradient(180deg,#10182e,#0b1020)}
h1{margin:0 0 4px;font-size:24px}.sub{color:var(--mut);font-size:14px}
.wrap{max-width:1200px;margin:0 auto;padding:24px}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-bottom:22px}
.kpi{background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px}
.kpi .n{font-size:30px;font-weight:700}.kpi .l{color:var(--mut);font-size:13px;margin-top:2px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:22px}
@media(max-width:820px){.grid{grid-template-columns:1fr}}
.card{background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px}
.card h2{margin:0 0 12px;font-size:15px;letter-spacing:.3px;text-transform:uppercase;color:var(--mut)}
.bar{display:grid;grid-template-columns:180px 1fr 58px;align-items:center;gap:8px;margin:6px 0}
.bl{font-size:13px;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bt{height:14px;border-radius:7px;display:inline-block}.bv{font-size:12px;color:var(--mut);text-align:right}
.verdict{border-left:4px solid var(--ac2);padding:12px 16px;background:#0f1b14;border-radius:8px;margin-bottom:10px}
.score{font-size:40px;font-weight:800;color:var(--ac2)}
.controls{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0 12px}
.controls input,.controls select{background:var(--card);border:1px solid var(--bd);color:var(--ink);padding:9px 12px;border-radius:10px;font-size:14px}
.controls input{flex:1;min-width:220px}
table{width:100%;border-collapse:collapse;font-size:13.5px}
th,td{text-align:left;padding:9px 10px;border-bottom:1px solid var(--bd);vertical-align:top}
th{color:var(--mut);font-weight:600;position:sticky;top:0;background:var(--card);cursor:pointer}
td a{color:var(--ac);text-decoration:none}td a:hover{text-decoration:underline}
.tag{display:inline-block;font-size:11px;padding:2px 8px;border-radius:20px;background:#1c2742;color:#cbd5e1;white-space:nowrap}
.eng{color:var(--ac2)}.foot{color:var(--mut);font-size:12px;margin:30px 0 10px;text-align:center}
.pill{font-size:12px;color:var(--mut)}
</style></head><body>
<header><div class="wrap"><h1>JoSAA / CSAB Counselling Co-pilot — Research Dashboard</h1>
<div class="sub">Problem stress-test &amp; SERP/community mining · generated ${new Date().toISOString().slice(0, 10)} · all links live-verified</div></div></header>
<div class="wrap">
<div class="kpis">
<div class="kpi"><div class="n">${items.length}</div><div class="l">Unique verified URLs</div></div>
<div class="kpi"><div class="n">${eng.length}</div><div class="l">Engagement venues</div></div>
<div class="kpi"><div class="n">${themeCounts.length}</div><div class="l">Pain-points covered</div></div>
<div class="kpi"><div class="n">${competitors.length}</div><div class="l">Competitors torn down</div></div>
<div class="kpi"><div class="n">${stress ? stress.score_10 + '/10' : '—'}</div><div class="l">Problem score</div></div>
</div>
${stress ? `<div class="card" style="margin-bottom:22px"><h2>Problem stress-test verdict</h2>
<div class="verdict">${esc(stress.verdict)}</div>
<div class="score">${stress.score_10}/10</div>
<div class="grid" style="margin-top:14px">
<div><b class="pill">DEMAND</b><ul>${(stress.demand_evidence || []).map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
<div><b class="pill">WILLINGNESS TO PAY</b><ul>${(stress.wtp_evidence || []).map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
</div></div>` : ''}

${ytVideos.length ? `<div class="card" style="margin-bottom:22px"><h2>YouTube deep-dive — ${ytVideos.length} videos via Data API (real view counts)</h2>
<div class="grid">
<div><b class="pill">TOP CHANNELS BY VIEWS</b>${bar(ytChannels.slice(0, 10).map(c => [c.channel + ' (' + c.videos + ')', c.views]), 'var(--ac2)')}</div>
<div><b class="pill">MOST-VIEWED VIDEOS</b><ol style="margin:6px 0 0;padding-left:18px;font-size:13px">${ytVideos.slice(0, 10).map(v => `<li><a href="${v.url}" target="_blank" rel="noopener">${esc((v.title || '').slice(0, 70))}</a> — <span class="pill">${Number(v.views).toLocaleString('en-IN')} views</span></li>`).join('')}</ol></div>
</div></div>` : ''}

${redditThreads.length ? `<div class="card" style="margin-bottom:22px"><h2>Reddit deep-dive — ${redditThreads.length} threads (real comment & upvote counts)</h2>
<div class="grid">
<div><b class="pill">TOP SUBREDDITS BY COMMENTS</b>${bar(redditSubs.slice(0, 10).map(s => ['r/' + s.subreddit + ' (' + s.threads + ' threads)', s.totalComments]), 'var(--ac3)')}</div>
<div><b class="pill">MOST-DISCUSSED THREADS</b><ol style="margin:6px 0 0;padding-left:18px;font-size:13px">${redditThreads.slice(0, 10).map(t => `<li><a href="${t.url}" target="_blank" rel="noopener">${esc((t.title || '').slice(0, 70))}</a> — <span class="pill">r/${t.subreddit} · ${Number(t.num_comments).toLocaleString('en-IN')} comments · ${Number(t.score).toLocaleString('en-IN')} score</span></li>`).join('')}</ol></div>
</div></div>` : ''}

${igAccounts.length ? `<div class="card" style="margin-bottom:22px"><h2>Instagram deep-dive — ${igAccounts.length} accounts & metrics</h2>
<div class="grid">
<div><b class="pill">TOP ACCOUNTS BY FOLLOWERS</b>${bar(igAccounts.filter(a => a.followers != null).slice(0, 10).map(a => ['@' + a.username, a.followers]), 'var(--ac)')}</div>
<div><b class="pill">SCRAPED ACCOUNTS</b><ol style="margin:6px 0 0;padding-left:18px;font-size:13px">${igAccounts.filter(a => a.scraped).slice(0, 10).map(a => `<li><a href="${a.url}" target="_blank" rel="noopener">${a.username}</a> — <span class="pill">${Number(a.followers).toLocaleString('en-IN')} followers · ${Number(a.posts).toLocaleString('en-IN')} posts</span></li>`).join('')}</ol></div>
</div></div>` : ''}

${quoraQuestions.length && quoraQuestions.some(q => q.scraped) ? `<div class="card" style="margin-bottom:22px"><h2>Quora deep-dive — ${quoraQuestions.length} questions</h2>
<div class="grid">
<div><b class="pill">TOP THEMES BY ANSWERS</b>${bar(quoraThemes.slice(0, 10).map(t => [t.theme, t.totalAnswers]), 'var(--ac2)')}</div>
<div><b class="pill">MOST ANSWERED QUESTIONS</b><ol style="margin:6px 0 0;padding-left:18px;font-size:13px">${quoraQuestions.filter(q => q.answers != null).slice(0, 10).map(q => `<li><a href="${q.url}" target="_blank" rel="noopener">${esc((q.title || '').slice(0, 70))}</a> — <span class="pill">${q.answers} answers · ${q.views || 0} views</span></li>`).join('')}</ol></div>
</div></div>` : ''}

<div class="grid">
<div class="card"><h2>URLs by pain-point</h2>${bar(themeCounts, 'var(--ac)')}</div>
<div class="card"><h2>URLs by platform</h2>${bar(typeCounts, 'var(--ac3)')}</div>
</div>
<div class="card"><h2>All URLs (${items.length}) — search &amp; filter</h2>
<div class="controls">
<input id="q" placeholder="Search title / note / url…">
<select id="fp"><option value="">All platforms</option>${typeCounts.map(([k]) => `<option>${esc(k)}</option>`).join('')}</select>
<select id="ft"><option value="">All pain-points</option>${themeCounts.map(([k]) => `<option>${esc(k)}</option>`).join('')}</select>
<select id="fe"><option value="">All</option><option value="1">💬 Can engage only</option></select>
</div>
<div style="max-height:620px;overflow:auto"><table id="tbl"><thead><tr>
<th data-k="t">Title</th><th data-k="p">Platform</th><th data-k="th">Pain-point</th><th data-k="e">Engage</th>
<th data-k="vi">Views</th><th data-k="sc">Upvotes/Likes</th><th data-k="co">Comments/Answers</th><th data-k="fo">Followers</th>
<th data-k="n">Note</th>
</tr></thead><tbody id="tb"></tbody></table></div>
</div>
<div class="foot">Built from the research fleet's journal · ${items.length} links · re-run <code>node research/build.js</code> to refresh</div>
</div>
<script>
const DATA=${rowsJson};
const tb=document.getElementById('tb'),q=document.getElementById('q'),fp=document.getElementById('fp'),ft=document.getElementById('ft'),fe=document.getElementById('fe');
let sortK=null,sortDir=1;
function render(){
  let r=DATA.filter(d=>{
    const s=(q.value||'').toLowerCase();
    if(s&&!((d.t||'')+(d.n||'')+(d.u||'')).toLowerCase().includes(s))return false;
    if(fp.value&&d.p!==fp.value)return false;
    if(ft.value&&d.th!==ft.value)return false;
    if(fe.value&&!d.e)return false;
    return true;});
  if(sortK)r.sort((a,b)=>((a[sortK]||0)>(b[sortK]||0)?1:-1)*sortDir);
  tb.innerHTML=r.map(d=>'<tr><td><a href="'+d.u+'" target="_blank" rel="noopener">'+esc(d.t||d.u)+'</a></td>'+
    '<td><span class="tag">'+esc(d.p)+'</span></td><td>'+esc(d.th)+'</td>'+
    '<td class="eng">'+(d.e?'💬':'')+'</td>'+
    '<td>'+(d.vi?Number(d.vi).toLocaleString('en-IN'):'—')+'</td>'+
    '<td>'+(d.sc?Number(d.sc).toLocaleString('en-IN'):'—')+'</td>'+
    '<td>'+(d.co?Number(d.co).toLocaleString('en-IN'):'—')+'</td>'+
    '<td>'+(d.fo?Number(d.fo).toLocaleString('en-IN'):'—')+'</td>'+
    '<td>'+esc(d.n||'')+'</td></tr>').join('');
}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
[q,fp,ft,fe].forEach(el=>el.addEventListener('input',render));
document.querySelectorAll('th').forEach(th=>th.addEventListener('click',()=>{const k=th.dataset.k;sortDir=(sortK===k)?-sortDir:1;sortK=k;render();}));
render();
</script></body></html>`;
w('dashboard/index.html', html);

console.log('\n=== SUMMARY ===');
console.log('URLs:', items.length, '| engage:', eng.length, '| competitors:', competitors.length, '| stress:', !!stress, '| survey:', !!survey);
