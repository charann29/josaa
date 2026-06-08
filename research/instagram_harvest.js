#!/usr/bin/env node
/* Harvest Instagram engagement metrics (follower count, post count, bio)
   for instagram_account URLs in data.json via HTML scraping.
   Instagram is the hardest platform to scrape — expect partial results.
   Rate limit: 1 req per 3s.
   Output: instagram_data.json + urls/instagram_accounts.md */

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
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'identity',
        'Cache-Control': 'no-cache',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let loc = res.headers.location;
        if (loc.startsWith('/')) loc = new URL(url).origin + loc;
        res.resume();
        return resolve(get(loc, redirects + 1));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 429) return reject(new Error('RATE_LIMITED'));
        if (res.statusCode === 403) return reject(new Error('FORBIDDEN'));
        if (res.statusCode === 401) return reject(new Error('LOGIN_REQUIRED'));
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
        resolve(data);
      });
    });
    req.on('error', reject);
    req.setTimeout(20000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ---- Extract username from URL ----
function extractUsername(url) {
  const m = url.match(/instagram\.com\/([a-zA-Z0-9._]+)/);
  return m ? m[1] : null;
}

// ---- Parse K/M suffixed numbers ----
function parseCount(str) {
  if (!str) return null;
  str = str.trim().replace(/,/g, '');
  if (str.match(/[Kk]$/)) return Math.round(parseFloat(str) * 1000);
  if (str.match(/[Mm]$/)) return Math.round(parseFloat(str) * 1000000);
  if (str.match(/[Bb]$/)) return Math.round(parseFloat(str) * 1000000000);
  const n = parseInt(str, 10);
  return isNaN(n) ? null : n;
}

// ---- Extract metrics from HTML ----
function extractMetrics(html, username) {
  const metrics = { followers: null, following: null, posts: null, bio: null, fullName: null, isVerified: null };

  // Method 1: JSON-LD / embedded JSON in <script> tags
  // Instagram often embeds profile data in window._sharedData or similar
  const sharedDataMatch = html.match(/window\._sharedData\s*=\s*(\{[\s\S]*?\});\s*<\/script>/);
  if (sharedDataMatch) {
    try {
      const sd = JSON.parse(sharedDataMatch[1]);
      const user = sd?.entry_data?.ProfilePage?.[0]?.graphql?.user
        || sd?.entry_data?.ProfilePage?.[0]?.user;
      if (user) {
        metrics.followers = user.edge_followed_by?.count ?? user.follower_count ?? null;
        metrics.following = user.edge_follow?.count ?? user.following_count ?? null;
        metrics.posts = user.edge_owner_to_timeline_media?.count ?? user.media_count ?? null;
        metrics.bio = user.biography || null;
        metrics.fullName = user.full_name || null;
        metrics.isVerified = user.is_verified ?? null;
        return metrics;
      }
    } catch { /* ignore */ }
  }

  // Method 2: Look for __additionalData or similar script patterns
  const additionalMatch = html.match(/window\.__additionalDataLoaded\s*\([^,]+,\s*(\{[\s\S]*?\})\s*\)\s*;/);
  if (additionalMatch) {
    try {
      const ad = JSON.parse(additionalMatch[1]);
      const user = ad?.graphql?.user || ad?.user;
      if (user) {
        metrics.followers = user.edge_followed_by?.count ?? user.follower_count ?? null;
        metrics.following = user.edge_follow?.count ?? user.following_count ?? null;
        metrics.posts = user.edge_owner_to_timeline_media?.count ?? user.media_count ?? null;
        metrics.bio = user.biography || null;
        metrics.fullName = user.full_name || null;
        metrics.isVerified = user.is_verified ?? null;
        return metrics;
      }
    } catch { /* ignore */ }
  }

  // Method 3: Regex patterns on the raw HTML / embedded JSON
  // Look for edge_followed_by or follower_count in any script
  const followerPatterns = [
    /"edge_followed_by"\s*:\s*\{\s*"count"\s*:\s*(\d+)/,
    /"follower_count"\s*:\s*(\d+)/,
    /followerCount['"]\s*:\s*(\d+)/,
  ];
  for (const pat of followerPatterns) {
    const m = html.match(pat);
    if (m) { metrics.followers = parseInt(m[1], 10); break; }
  }

  const postPatterns = [
    /"edge_owner_to_timeline_media"\s*:\s*\{\s*"count"\s*:\s*(\d+)/,
    /"media_count"\s*:\s*(\d+)/,
  ];
  for (const pat of postPatterns) {
    const m = html.match(pat);
    if (m) { metrics.posts = parseInt(m[1], 10); break; }
  }

  const bioPatterns = [
    /"biography"\s*:\s*"([^"]{0,500})"/,
  ];
  for (const pat of bioPatterns) {
    const m = html.match(pat);
    if (m) { metrics.bio = m[1].replace(/\\n/g, ' ').replace(/\\u[\dA-Fa-f]{4}/g, ''); break; }
  }

  const namePatterns = [
    /"full_name"\s*:\s*"([^"]{0,200})"/,
  ];
  for (const pat of namePatterns) {
    const m = html.match(pat);
    if (m) { metrics.fullName = m[1]; break; }
  }

  // Method 4: Meta tag description often has follower count
  // e.g., "12.5K Followers, 500 Following, 340 Posts - See Instagram photos..."
  const metaMatch = html.match(/<meta[^>]*content="([\d,.]+[KkMm]?)\s*Followers?,\s*([\d,.]+[KkMm]?)\s*Following,\s*([\d,.]+[KkMm]?)\s*Posts?/i);
  if (metaMatch) {
    if (metrics.followers === null) metrics.followers = parseCount(metaMatch[1]);
    if (metrics.following === null) metrics.following = parseCount(metaMatch[2]);
    if (metrics.posts === null) metrics.posts = parseCount(metaMatch[3]);
  }

  // Method 5: og:description meta
  const ogMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*?)"/i);
  if (ogMatch) {
    const desc = ogMatch[1];
    const fMatch = desc.match(/([\d,.]+[KkMm]?)\s*Followers?/i);
    if (fMatch && metrics.followers === null) metrics.followers = parseCount(fMatch[1]);
    const pMatch = desc.match(/([\d,.]+[KkMm]?)\s*Posts?/i);
    if (pMatch && metrics.posts === null) metrics.posts = parseCount(pMatch[1]);
  }

  return metrics;
}

(async () => {
  // Load data.json
  const dataPath = path.join(ROOT, 'data.json');
  if (!fs.existsSync(dataPath)) { console.error('data.json not found'); process.exit(1); }
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  // Filter instagram accounts + posts
  const igItems = (data.items || []).filter(i =>
    (i.type === 'instagram_account' || i.type === 'instagram_post') && i.url && i.url.includes('instagram.com')
  );
  console.error(`Found ${igItems.length} Instagram items to harvest`);

  if (igItems.length === 0) {
    console.error('No Instagram items found in data.json');
    // Write empty output
    const wr = (rel, s) => {
      const p = path.join(ROOT, rel);
      fs.mkdirSync(path.dirname(p), { recursive: true });
      fs.writeFileSync(p, s);
      console.error('wrote', rel);
    };
    wr('instagram_data.json', JSON.stringify({ generated: new Date().toISOString(), count: 0, accounts: [] }, null, 2));
    wr('urls/instagram_accounts.md', '# Instagram Accounts\n\nNo Instagram items found in dataset.\n');
    process.exit(0);
  }

  const accounts = [];
  let success = 0, failed = 0;

  for (let idx = 0; idx < igItems.length; idx++) {
    const item = igItems[idx];
    const username = extractUsername(item.url);

    try {
      console.error(`  [${idx + 1}/${igItems.length}] Fetching: ${username || item.url}`);
      const html = await get(item.url);
      const metrics = extractMetrics(html, username);

      const hasData = metrics.followers !== null || metrics.posts !== null;

      accounts.push({
        url: item.url,
        username: username || '',
        fullName: metrics.fullName || '',
        followers: metrics.followers,
        following: metrics.following,
        posts: metrics.posts,
        bio: metrics.bio || '',
        isVerified: metrics.isVerified,
        theme: item.theme || 'general',
        lanes: item.lanes || [],
        scraped: hasData,
      });

      if (hasData) {
        success++;
        console.error(`    ✓ followers=${metrics.followers ?? '?'} posts=${metrics.posts ?? '?'} ${metrics.fullName || ''}`);
      } else {
        console.error(`    ~ No structured metrics found (login wall likely)`);
      }
    } catch (err) {
      console.error(`    ✗ ${err.message}`);
      failed++;

      accounts.push({
        url: item.url,
        username: username || '',
        fullName: '',
        followers: null,
        following: null,
        posts: null,
        bio: '',
        isVerified: null,
        theme: item.theme || 'general',
        lanes: item.lanes || [],
        scraped: false,
        error: err.message,
      });

      // Long wait on rate limit / login wall
      if (err.message === 'RATE_LIMITED' || err.message === 'LOGIN_REQUIRED') {
        console.error(`    Waiting 20s...`);
        await sleep(20000);
      }
    }

    // Rate limit: 1 request per 3 seconds
    await sleep(3200);
  }

  // Sort by followers descending
  accounts.sort((a, b) => (b.followers || 0) - (a.followers || 0));

  // ---- Write outputs ----
  const wr = (rel, s) => {
    const p = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, s);
    console.error('wrote', rel);
  };

  wr('instagram_data.json', JSON.stringify({
    generated: new Date().toISOString(),
    count: accounts.length,
    successCount: success,
    failedCount: failed,
    accounts,
  }, null, 2));

  // Markdown
  const fmt = n => n != null ? Number(n).toLocaleString('en-IN') : '—';
  let md = `# Instagram Deep-Dive — ${accounts.length} accounts scraped\n\n`;
  md += `Generated ${new Date().toISOString().slice(0, 10)}. ${success} with metrics, ${failed} failed.\n\n`;
  md += `> ⚠️ Instagram aggressively blocks scraping. Results may be partial.\n\n`;
  md += `## Accounts by follower count\n\n| Followers | Posts | Username | Name | Bio | Theme |\n|--:|--:|---|---|---|---|\n`;
  md += accounts.map(a =>
    `| ${fmt(a.followers)} | ${fmt(a.posts)} | [@${a.username}](${a.url}) | ${(a.fullName || '').slice(0, 30)} | ${(a.bio || '').replace(/\|/g, '/').slice(0, 50)} | ${a.theme} |`
  ).join('\n');
  md += '\n';

  wr('urls/instagram_accounts.md', md);

  console.error(`\n=== DONE: ${success} scraped, ${failed} failed out of ${accounts.length} accounts ===`);
})();
