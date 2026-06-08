#!/usr/bin/env node
/* Harvest Quora engagement metrics (answer count, follower count) for all
   quora_question URLs in data.json via HTML scraping.
   No API available — we fetch the HTML and parse visible metrics.
   Rate limit: 1 req per 2s (Quora is aggressive with blocking).
   Output: quora_data.json + urls/quora_top_questions.md */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

// ---- HTTP GET with redirect following ----
function get(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error('Too many redirects'));
    const proto = url.startsWith('https') ? https : http;
    const req = proto.get(url, {
      headers: {
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'identity',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let loc = res.headers.location;
        if (loc.startsWith('/')) loc = new URL(url).origin + loc;
        res.resume(); // drain response
        return resolve(get(loc, redirects + 1));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 429) return reject(new Error('RATE_LIMITED'));
        if (res.statusCode === 403) return reject(new Error('FORBIDDEN'));
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
        resolve(data);
      });
    });
    req.on('error', reject);
    req.setTimeout(20000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ---- Extract metrics from HTML ----
function extractMetrics(html) {
  const metrics = { answers: null, followers: null, views: null };

  // Method 1: Look for answer count patterns
  // "X answers" or "X Answers" in various formats
  const answerPatterns = [
    /(\d[\d,]*)\s*(?:A|a)nswers?/g,
    /"answerCount"\s*:\s*(\d+)/g,
    /answer_count['"]\s*:\s*(\d+)/g,
    /(\d[\d,]*)\s*उत्तर/g, // Hindi
  ];
  for (const pat of answerPatterns) {
    let m;
    while ((m = pat.exec(html)) !== null) {
      const n = parseInt(m[1].replace(/,/g, ''), 10);
      if (n > 0 && (metrics.answers === null || n > metrics.answers)) {
        metrics.answers = n;
      }
    }
  }

  // Method 2: Look for follower count
  const followerPatterns = [
    /(\d[\d,]*)\s*(?:F|f)ollowers?/g,
    /"followerCount"\s*:\s*(\d+)/g,
    /follower_count['"]\s*:\s*(\d+)/g,
  ];
  for (const pat of followerPatterns) {
    let m;
    while ((m = pat.exec(html)) !== null) {
      const n = parseInt(m[1].replace(/,/g, ''), 10);
      if (n > 0 && (metrics.followers === null || n > metrics.followers)) {
        metrics.followers = n;
      }
    }
  }

  // Method 3: Look for view count
  const viewPatterns = [
    /(\d[\d,]*[KkMm]?)\s*(?:V|v)iews?/g,
    /"viewCount"\s*:\s*(\d+)/g,
  ];
  for (const pat of viewPatterns) {
    let m;
    while ((m = pat.exec(html)) !== null) {
      let raw = m[1].replace(/,/g, '');
      let n;
      if (raw.match(/[Kk]$/)) n = parseFloat(raw) * 1000;
      else if (raw.match(/[Mm]$/)) n = parseFloat(raw) * 1000000;
      else n = parseInt(raw, 10);
      if (n > 0 && (metrics.views === null || n > metrics.views)) {
        metrics.views = Math.round(n);
      }
    }
  }

  // Method 4: Try JSON-LD structured data
  const jsonLdMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
  if (jsonLdMatch) {
    for (const block of jsonLdMatch) {
      const jsonStr = block.replace(/<script[^>]*>/, '').replace(/<\/script>/i, '');
      try {
        const ld = JSON.parse(jsonStr);
        if (ld.answerCount != null) metrics.answers = parseInt(ld.answerCount, 10);
        if (ld.upvoteCount != null) metrics.views = parseInt(ld.upvoteCount, 10);
        // Check for mainEntity with acceptedAnswer or suggestedAnswer arrays
        if (ld.mainEntity) {
          if (ld.mainEntity.answerCount != null) metrics.answers = parseInt(ld.mainEntity.answerCount, 10);
          if (Array.isArray(ld.mainEntity.suggestedAnswer)) {
            metrics.answers = Math.max(metrics.answers || 0, ld.mainEntity.suggestedAnswer.length);
          }
        }
      } catch { /* ignore */ }
    }
  }

  return metrics;
}

(async () => {
  // Load data.json
  const dataPath = path.join(ROOT, 'data.json');
  if (!fs.existsSync(dataPath)) { console.error('data.json not found'); process.exit(1); }
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  // Filter quora questions
  const quoraItems = (data.items || []).filter(i =>
    i.type === 'quora_question' && i.url
  );
  console.error(`Found ${quoraItems.length} Quora questions to harvest`);

  const questions = [];
  let success = 0, failed = 0, partial = 0;

  for (let idx = 0; idx < quoraItems.length; idx++) {
    const item = quoraItems[idx];

    try {
      console.error(`  [${idx + 1}/${quoraItems.length}] Fetching: ${(item.title || item.url).slice(0, 70)}`);
      const html = await get(item.url);
      const metrics = extractMetrics(html);

      const hasData = metrics.answers !== null || metrics.followers !== null;

      questions.push({
        url: item.url,
        title: item.title || '',
        answers: metrics.answers,
        followers: metrics.followers,
        views: metrics.views,
        theme: item.theme || 'general',
        lanes: item.lanes || [],
        scraped: hasData,
      });

      if (hasData) {
        success++;
        console.error(`    ✓ answers=${metrics.answers ?? '?'} followers=${metrics.followers ?? '?'} views=${metrics.views ?? '?'}`);
      } else {
        partial++;
        console.error(`    ~ No structured metrics found (page may be JS-rendered)`);
      }
    } catch (err) {
      console.error(`    ✗ ${err.message}`);
      failed++;

      // Add with null metrics so we track the attempt
      questions.push({
        url: item.url,
        title: item.title || '',
        answers: null,
        followers: null,
        views: null,
        theme: item.theme || 'general',
        lanes: item.lanes || [],
        scraped: false,
        error: err.message,
      });

      // On error, sleep briefly and continue
      await sleep(50);
    }

    // Brief sleep between requests
    await sleep(50);
  }

  // Sort by answers descending (nulls last)
  questions.sort((a, b) => (b.answers || 0) - (a.answers || 0));

  // ---- Theme aggregation ----
  const themeMap = new Map();
  for (const q of questions) {
    const t = themeMap.get(q.theme) || { theme: q.theme, questions: 0, totalAnswers: 0, scraped: 0 };
    t.questions++;
    t.totalAnswers += q.answers || 0;
    if (q.scraped) t.scraped++;
    themeMap.set(q.theme, t);
  }
  const themeStats = [...themeMap.values()].sort((a, b) => b.totalAnswers - a.totalAnswers);

  // ---- Write outputs ----
  const wr = (rel, s) => {
    const p = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, s);
    console.error('wrote', rel);
  };

  // JSON output
  wr('quora_data.json', JSON.stringify({
    generated: new Date().toISOString(),
    count: questions.length,
    successCount: success,
    partialCount: partial,
    failedCount: failed,
    questions,
    themeStats,
  }, null, 2));

  // Markdown: top questions
  const fmt = n => n != null ? Number(n).toLocaleString('en-IN') : '—';
  let md = `# Quora Deep-Dive — ${questions.length} questions scraped for engagement\n\n`;
  md += `Generated ${new Date().toISOString().slice(0, 10)}. ${success} with full metrics, ${partial} partial, ${failed} failed.\n\n`;
  md += `## Theme Summary\n\n| Theme | Questions | Total Answers | Scraped |\n|---|--:|--:|--:|\n`;
  md += themeStats.map(t => `| ${t.theme} | ${t.questions} | ${fmt(t.totalAnswers)} | ${t.scraped}/${t.questions} |`).join('\n');
  md += '\n\n';
  md += `## Top questions by answer count\n\n| Answers | Followers | Title | Theme |\n|--:|--:|---|---|\n`;
  md += questions.filter(q => q.answers != null).slice(0, 60).map(q =>
    `| ${fmt(q.answers)} | ${fmt(q.followers)} | [${(q.title || '').replace(/\|/g, '/').slice(0, 80)}](${q.url}) | ${q.theme} |`
  ).join('\n');
  md += '\n';

  wr('urls/quora_top_questions.md', md);

  console.error(`\n=== DONE: ${success} success, ${partial} partial, ${failed} failed out of ${questions.length} questions ===`);
})();
