#!/usr/bin/env node
/* Harvest JoSAA/counselling videos via YouTube Data API v3.
   Reads key from env YT_KEY. Quota-aware (search=100 units, videos=1 unit; ~10k/day).
   Output: youtube_data.json + urls/youtube_*.{csv,md}. */
const https = require('https');
const fs = require('fs');
const path = require('path');
const KEY = process.env.YT_KEY;
if (!KEY) { console.error('Set YT_KEY env var'); process.exit(1); }
const ROOT = __dirname;

const get = (url) => new Promise((res, rej) => {
  https.get(url, (r) => { let d = ''; r.on('data', c => d += c); r.on('end', () => { try { res(JSON.parse(d)); } catch (e) { rej(e); } }); }).on('error', rej);
});
const sleep = ms => new Promise(r => setTimeout(r, ms));

// query -> pain-point theme
const QUERIES = [
  ['JoSAA choice filling', 'choice_filling', 3],
  ['JoSAA choice filling order', 'choice_filling', 3],
  ['JoSAA choice filling strategy', 'choice_filling', 2],
  ['JoSAA best preference order', 'choice_filling', 2],
  ['JoSAA counselling 2025', 'choice_filling', 3],
  ['JoSAA counselling 2024', 'choice_filling', 2],
  ['JoSAA counselling 2026', 'choice_filling', 2],
  ['JoSAA float freeze slide', 'float_freeze_slide', 3],
  ['JoSAA freeze or float', 'float_freeze_slide', 2],
  ['JoSAA seat allotment', 'choice_filling', 2],
  ['JoSAA mock allotment', 'choice_filling', 2],
  ['JoSAA seat upgrade', 'float_freeze_slide', 2],
  ['JoSAA withdrawal', 'documents', 1],
  ['JoSAA business rules', 'float_freeze_slide', 1],
  ['CSAB special round counselling', 'choice_filling', 2],
  ['JoSAA common mistakes', 'choice_filling', 2],
  ['JEE college predictor', 'predictor_spam', 2],
  ['JoSAA rank predictor', 'predictor_spam', 2],
  ['NIT branch vs college', 'branch_vs_college', 2],
  ['IIT vs NIT which is better', 'branch_vs_college', 2],
  ['CSE vs core branch engineering', 'branch_vs_college', 1],
  ['JoSAA document verification reporting', 'documents', 2],
  ['JoSAA registration guide', 'registration', 2],
  ['JoSAA gender neutral female supernumerary seats', 'quota_category', 1],
  ['JoSAA home state quota NIT', 'quota_category', 1],
  ['JEE percentile to rank', 'percentile_rank', 1],
  ['VIT counselling choice filling', 'deposit_forfeiture', 2],
  ['SRM counselling admission', 'deposit_forfeiture', 1],
  ['COMEDK counselling', 'deposit_forfeiture', 1],
  ['MHT CET counselling choice filling', 'deposit_forfeiture', 2],
  ['WBJEE counselling', 'deposit_forfeiture', 1],
  ['KCET counselling option entry', 'deposit_forfeiture', 1],
  ['engineering admission scam fake counselling', 'scams_misinfo', 1],
  ['JoSAA closing rank analysis', 'choice_filling', 1],
];

const SEARCH_BUDGET = 85; // max search.list calls (~8500 units)
let searchCalls = 0;

async function searchAll(q, theme, maxPages) {
  const ids = new Map();
  let token = '';
  for (let p = 0; p < maxPages; p++) {
    if (searchCalls >= SEARCH_BUDGET) { console.error('search budget hit'); break; }
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(q)}` +
      `&type=video&maxResults=50&regionCode=IN&order=relevance&key=${KEY}` + (token ? `&pageToken=${token}` : '');
    const j = await get(url); searchCalls++;
    if (j.error) { console.error('ERR', q, JSON.stringify(j.error).slice(0, 200)); break; }
    for (const it of (j.items || [])) if (it.id?.videoId) ids.set(it.id.videoId, { theme, query: q });
    token = j.nextPageToken;
    if (!token) break;
    await sleep(120);
  }
  return ids;
}

(async () => {
  const all = new Map(); // videoId -> {theme, query}
  for (const [q, theme, pages] of QUERIES) {
    const got = await searchAll(q, theme, pages);
    for (const [id, meta] of got) if (!all.has(id)) all.set(id, meta);
    console.error(`q="${q}" total unique so far=${all.size} searchCalls=${searchCalls}`);
    if (searchCalls >= SEARCH_BUDGET) break;
  }

  // Enrich in batches of 50
  const idList = [...all.keys()];
  const videos = [];
  for (let i = 0; i < idList.length; i += 50) {
    const batch = idList.slice(i, i + 50);
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${batch.join(',')}&key=${KEY}`;
    const j = await get(url);
    if (j.error) { console.error('videos ERR', JSON.stringify(j.error).slice(0, 200)); continue; }
    for (const v of (j.items || [])) {
      const meta = all.get(v.id) || {};
      videos.push({
        videoId: v.id,
        url: `https://www.youtube.com/watch?v=${v.id}`,
        title: v.snippet?.title,
        channel: v.snippet?.channelTitle,
        channelId: v.snippet?.channelId,
        publishedAt: v.snippet?.publishedAt,
        views: +(v.statistics?.viewCount || 0),
        likes: +(v.statistics?.likeCount || 0),
        comments: +(v.statistics?.commentCount || 0),
        duration: v.contentDetails?.duration,
        theme: meta.theme,
        query: meta.query,
      });
    }
    await sleep(80);
  }
  videos.sort((a, b) => b.views - a.views);

  // Channel aggregation
  const chMap = new Map();
  for (const v of videos) {
    const c = chMap.get(v.channelId) || { channel: v.channel, channelId: v.channelId, videos: 0, views: 0, comments: 0 };
    c.videos++; c.views += v.views; c.comments += v.comments; chMap.set(v.channelId, c);
  }
  const channels = [...chMap.values()].sort((a, b) => b.views - a.views);

  // Write outputs
  const wr = (rel, s) => { const p = path.join(ROOT, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); console.error('wrote', rel); };
  wr('youtube_data.json', JSON.stringify({ generated: new Date().toISOString(), count: videos.length, channels: channels.length, videos, channelStats: channels }, null, 2));

  const cc = s => '"' + String(s == null ? '' : s).replace(/"/g, '""').replace(/\n/g, ' ') + '"';
  const head = ['url', 'title', 'channel', 'publishedAt', 'views', 'likes', 'comments', 'duration', 'theme', 'query'].map(cc).join(',');
  const rows = videos.map(v => [v.url, v.title, v.channel, v.publishedAt, v.views, v.likes, v.comments, v.duration, v.theme, v.query].map(cc).join(','));
  wr('urls/youtube_videos.csv', [head, ...rows].join('\n') + '\n');

  const fmt = n => n.toLocaleString('en-IN');
  let md = `# YouTube Deep-Dive — ${videos.length} videos via YouTube Data API\n\nGenerated ${new Date().toISOString().slice(0, 10)}. Sorted by view count.\n\n`;
  md += `## Top 100 videos by views\n\n| Views | Title | Channel | Published | Comments |\n|--:|---|---|---|--:|\n`;
  md += videos.slice(0, 100).map(v => `| ${fmt(v.views)} | [${(v.title || '').replace(/\|/g, '/')}](${v.url}) | ${v.channel} | ${(v.publishedAt || '').slice(0, 10)} | ${fmt(v.comments)} |`).join('\n');
  wr('urls/youtube_top_videos.md', md + '\n');

  let mc = `# YouTube Channels in the JoSAA-counselling space (${channels.length})\n\nRanked by total views across harvested videos. These are your key influencers / engagement targets.\n\n| Total views | Videos | Channel |\n|--:|--:|---|\n`;
  mc += channels.slice(0, 80).map(c => `| ${fmt(c.views)} | ${c.videos} | [${c.channel}](https://www.youtube.com/channel/${c.channelId}) |`).join('\n');
  wr('urls/youtube_channels.md', mc + '\n');

  console.error(`\n=== DONE: ${videos.length} videos, ${channels.length} channels, ${searchCalls} search calls (~${searchCalls * 100} units) ===`);
})();
