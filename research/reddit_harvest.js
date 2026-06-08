#!/usr/bin/env node
/* Harvest Reddit engagement metrics (score, num_comments, upvote_ratio) for all
   reddit_thread URLs in data.json via Reddit's public JSON API.
   No API key needed — just append .json to any thread URL.
   Rate limit: 1 req/sec (Reddit allows ~60/min unauthenticated).
   Output: reddit_data.json + urls/reddit_top_threads.md */

const https = require('https');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// Global session cookies store
let globalCookies = new Map();

function updateCookies(setCookieHeaders) {
  if (!setCookieHeaders) return;
  for (const header of setCookieHeaders) {
    const parts = header.split(';');
    const cookie = parts[0].trim();
    const eqIdx = cookie.indexOf('=');
    if (eqIdx !== -1) {
      const name = cookie.slice(0, eqIdx);
      const value = cookie.slice(eqIdx + 1);
      globalCookies.set(name, value);
    }
  }
}

function getCookieHeaderString() {
  const arr = [];
  for (const [name, value] of globalCookies.entries()) {
    arr.push(`${name}=${value}`);
  }
  return arr.join('; ');
}

// Low-level HTTP request helper
function request(url, headers = {}, method = 'GET') {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method,
      headers: {
        'User-Agent': UA,
        ...headers
      }
    };
    const proto = url.startsWith('https') ? https : require('http');
    const req = proto.request(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let loc = res.headers.location;
        if (loc.startsWith('/')) loc = parsed.origin + loc;
        updateCookies(res.headers['set-cookie']);
        return resolve(request(loc, headers, method));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.end();
  });
}

async function get(jsonUrl) {
  const threadUrl = jsonUrl.replace(/\.json$/, '/');
  
  // Try fetching directly with existing cookies
  let cookiesStr = getCookieHeaderString();
  let headers = { 'Accept': 'application/json' };
  if (cookiesStr) headers['Cookie'] = cookiesStr;

  let res = await request(jsonUrl, headers);
  
  if (res.statusCode === 403) {
    console.error(`    [INFO] Encountered 403. Solving JS challenge...`);
    const resHtml = await request(threadUrl);
    updateCookies(resHtml.headers['set-cookie']);

    const tokenMatch = resHtml.body.match(/name="token" value="([^"]+)"/);
    const challengeMatch = resHtml.body.match(/await\s*\(async\s*e\s*=>\s*e\s*\+\s*e\)\s*\("([^"]+)"\)/);
    
    if (!tokenMatch || !challengeMatch) {
      throw new Error(`Failed to bypass bot protection (could not find challenge details in HTML). StatusCode: ${resHtml.statusCode}`);
    }

    const token = tokenMatch[1];
    const challengeStr = challengeMatch[1];
    const solution = challengeStr + challengeStr;

    const challengeUrl = `${threadUrl}?solution=${solution}&js_challenge=1&token=${token}`;
    
    const resChallenge = await request(challengeUrl, {
      'Cookie': getCookieHeaderString(),
      'Referer': threadUrl
    });
    
    updateCookies(resChallenge.headers['set-cookie']);

    // Try JSON again
    cookiesStr = getCookieHeaderString();
    headers = { 'Accept': 'application/json' };
    if (cookiesStr) headers['Cookie'] = cookiesStr;

    res = await request(jsonUrl, headers);
  }

  if (res.statusCode === 429) throw new Error('RATE_LIMITED');
  if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}`);

  try {
    return JSON.parse(res.body);
  } catch (e) {
    throw new Error('JSON parse failed: ' + res.body.slice(0, 200));
  }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ---- Normalize Reddit URL for .json fetch ----
function toJsonUrl(url) {
  // Remove trailing slash, query params, and hash
  let clean = url.split('?')[0].split('#')[0].replace(/\/$/, '');
  // Handle mobile URLs
  clean = clean.replace('://m.reddit.com', '://www.reddit.com');
  // Ensure it's a thread URL (has /comments/)
  if (!clean.includes('/comments/')) return null;
  return clean + '.json';
}

(async () => {
  // Load data.json
  const dataPath = path.join(ROOT, 'data.json');
  if (!fs.existsSync(dataPath)) { console.error('data.json not found'); process.exit(1); }
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  // Filter reddit threads (not subreddit links)
  const redditItems = (data.items || []).filter(i =>
    i.type === 'reddit_thread' && i.url && i.url.includes('/comments/')
  );
  console.error(`Found ${redditItems.length} Reddit threads to harvest`);

  const threads = [];
  let success = 0, failed = 0;

  for (let idx = 0; idx < redditItems.length; idx++) {
    const item = redditItems[idx];
    const jsonUrl = toJsonUrl(item.url);
    if (!jsonUrl) {
      console.error(`  [SKIP] Not a thread URL: ${item.url}`);
      failed++;
      continue;
    }

    try {
      console.error(`  [${idx + 1}/${redditItems.length}] Fetching: ${item.title || item.url}`);
      const json = await get(jsonUrl);

      // Reddit returns an array: [listing of post, listing of comments]
      const postData = json?.[0]?.data?.children?.[0]?.data;
      if (!postData) {
        console.error(`    ⚠ No post data found`);
        failed++;
        continue;
      }

      threads.push({
        url: item.url,
        title: postData.title || item.title,
        subreddit: postData.subreddit || '',
        author: postData.author || '',
        score: postData.score || 0,
        upvote_ratio: postData.upvote_ratio || 0,
        num_comments: postData.num_comments || 0,
        created_utc: postData.created_utc || 0,
        created_date: postData.created_utc ? new Date(postData.created_utc * 1000).toISOString().slice(0, 10) : '',
        flair: postData.link_flair_text || '',
        is_locked: !!postData.locked,
        is_archived: !!postData.archived,
        theme: item.theme || 'general',
        lanes: item.lanes || [],
      });
      success++;
      console.error(`    ✓ score=${postData.score} comments=${postData.num_comments} ratio=${postData.upvote_ratio}`);
    } catch (err) {
      console.error(`    ✗ ${err.message}`);
      failed++;

      // If rate limited, wait longer and retry once
      if (err.message === 'RATE_LIMITED') {
        console.error(`    Waiting 10s for rate limit...`);
        await sleep(10000);
        try {
          const json = await get(jsonUrl);
          const postData = json?.[0]?.data?.children?.[0]?.data;
          if (postData) {
            threads.push({
              url: item.url,
              title: postData.title || item.title,
              subreddit: postData.subreddit || '',
              author: postData.author || '',
              score: postData.score || 0,
              upvote_ratio: postData.upvote_ratio || 0,
              num_comments: postData.num_comments || 0,
              created_utc: postData.created_utc || 0,
              created_date: postData.created_utc ? new Date(postData.created_utc * 1000).toISOString().slice(0, 10) : '',
              flair: postData.link_flair_text || '',
              is_locked: !!postData.locked,
              is_archived: !!postData.archived,
              theme: item.theme || 'general',
              lanes: item.lanes || [],
            });
            success++;
            failed--; // Undo the earlier fail count
            console.error(`    ✓ (retry) score=${postData.score} comments=${postData.num_comments}`);
          }
        } catch (e2) {
          console.error(`    ✗ (retry failed) ${e2.message}`);
        }
      }
    }

    // Rate limit: 1 request per second
    await sleep(1100);
  }

  // Sort by num_comments descending
  threads.sort((a, b) => b.num_comments - a.num_comments);

  // ---- Subreddit aggregation ----
  const subMap = new Map();
  for (const t of threads) {
    const s = subMap.get(t.subreddit) || { subreddit: t.subreddit, threads: 0, totalScore: 0, totalComments: 0 };
    s.threads++;
    s.totalScore += t.score;
    s.totalComments += t.num_comments;
    subMap.set(t.subreddit, s);
  }
  const subredditStats = [...subMap.values()].sort((a, b) => b.totalComments - a.totalComments);

  // ---- Write outputs ----
  const wr = (rel, s) => {
    const p = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, s);
    console.error('wrote', rel);
  };

  // JSON output
  wr('reddit_data.json', JSON.stringify({
    generated: new Date().toISOString(),
    count: threads.length,
    successCount: success,
    failedCount: failed,
    subreddits: subredditStats.length,
    threads,
    subredditStats,
  }, null, 2));

  // Markdown: top threads
  const fmt = n => Number(n).toLocaleString('en-IN');
  let md = `# Reddit Deep-Dive — ${threads.length} threads with real engagement data\n\n`;
  md += `Generated ${new Date().toISOString().slice(0, 10)}. Sorted by comment count.\n\n`;
  md += `## Subreddit Summary\n\n| Subreddit | Threads | Total Score | Total Comments |\n|---|--:|--:|--:|\n`;
  md += subredditStats.map(s => `| r/${s.subreddit} | ${s.threads} | ${fmt(s.totalScore)} | ${fmt(s.totalComments)} |`).join('\n');
  md += '\n\n';
  md += `## Top threads by comments\n\n| Comments | Score | Title | Subreddit | Date |\n|--:|--:|---|---|---|\n`;
  md += threads.slice(0, 80).map(t =>
    `| ${fmt(t.num_comments)} | ${fmt(t.score)} | [${(t.title || '').replace(/\|/g, '/').slice(0, 80)}](${t.url}) | r/${t.subreddit} | ${t.created_date} |`
  ).join('\n');
  md += '\n\n';
  md += `## Top threads by score (upvotes)\n\n| Score | Comments | Title | Subreddit | Date |\n|--:|--:|---|---|---|\n`;
  const byScore = [...threads].sort((a, b) => b.score - a.score);
  md += byScore.slice(0, 50).map(t =>
    `| ${fmt(t.score)} | ${fmt(t.num_comments)} | [${(t.title || '').replace(/\|/g, '/').slice(0, 80)}](${t.url}) | r/${t.subreddit} | ${t.created_date} |`
  ).join('\n');
  md += '\n';

  wr('urls/reddit_top_threads.md', md);

  console.error(`\n=== DONE: ${success} threads enriched, ${failed} failed, ${subredditStats.length} subreddits ===`);
})();
