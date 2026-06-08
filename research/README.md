# JoSAA / CSAB Counselling Co-pilot — Research

Deep SERP + community research mined by a 33-agent live-web research fleet.
**Every URL was returned by a live web-search agent; unverifiable links were dropped.**

## How to use

- **Start here:** open `dashboard/index.html` in a browser — searchable/filterable view of every URL + the problem stress-test verdict.
- Re-generate everything after the fleet finishes: `node build.js` (or `node build.js path/to/data.json`).

## Contents

| Folder / file | What's in it |
|---|---|
| `dashboard/index.html` | Interactive dashboard: KPIs, charts by pain-point & platform, stress-test verdict, searchable URL table |
| `urls/all_urls.csv` | Every URL with platform, pain-point, engage-flag, note (spreadsheet-ready) |
| `urls/by_theme.md` | All URLs grouped by pain-point (choice-filling, float/freeze/slide, predictor spam, …) |
| `urls/by_platform.md` | All URLs grouped by platform (Reddit, YouTube, Quora, Instagram, Telegram, Discord, forums) |
| `urls/youtube_videos.csv` | YouTube Data API harvest — videos with **real view/like/comment counts**, channel, date |
| `urls/youtube_top_videos.md` | Top videos by views (Data API) |
| `urls/youtube_channels.md` | Channels ranked by total views — your key influencers / engagement targets |
| `youtube_data.json` | Raw YouTube Data API harvest |
| `engagement/engagement_venues.md` | Only the venues where you can post/comment/promote |
| `competitors/competitors.md` | Teardown of 8 competitors: model, pricing, complaints, exploitable gaps |
| `validation/stress_test.md` | Is this a good problem? score/10, TAM, demand, willingness-to-pay, kill criteria |
| `validation/serp_demand.md` | SERP keywords, "People Also Ask", existing apps, demand signals |
| `survey/survey_bank.md` | Validation surveys (student + parent) + Mom-Test interview script + community seed-questions |
| `data.json` | Raw aggregated machine-readable data |

## Pain-points mined

choice-filling order · float/freeze/slide · predictor distrust & lead-gen spam · branch-vs-college ·
private/state deposit forfeiture · quota/category/gender pool · percentile-vs-rank · scams & misinformation ·
documents & reporting · registration friction · exam-center logistics · loans & scholarships · drop-year · branch-change

## YouTube deep harvest

`youtube_harvest.js` sweeps ~34 pain-point queries via the YouTube Data API v3 and enriches every
video with real statistics. Run it with the key in the environment:

```
YT_KEY="<your-youtube-data-api-key>" node youtube_harvest.js && node build.js
```

> ⚠️ **Quota:** the first run hit the project's daily Search quota after ~35 calls (got 50 enriched
> videos). The YouTube Data API default is 10,000 units/day and search.list costs 100 units/call.
> To go deeper: (a) wait for the quota reset (midnight Pacific Time) and re-run, or (b) request a
> quota increase in Google Cloud Console → APIs & Services → YouTube Data API v3 → Quotas.
> Each daily run adds ~50–80 more enriched videos; `build.js` merges them into the dashboard automatically.
