#!/usr/bin/env python3
"""
JoSAA priority-list pipeline  (the scoring/reachability engine we built for Vinay)
=================================================================================
This is the reusable core IP: profile -> reachability -> points -> filters ->
ordered list -> back-tested outcome. Generalised with a STUDENT config block so
it works for any candidate (the SaaS uses this engine; see vault note 12).

Input : extracted JoSAA ORCR JSON files  {year}_{round}_{page}.json
        each record has institute{code,name,type}, branch{code,name},
        quota (HS/OS/AI), category, seatPool, closingRank, year.
Output: ordered CSV/XLSX + JSON queue (for the Chrome-extension fill engine).

Run:  python3 josaa_pipeline.py /path/to/_extract/data
"""
import json, glob, sys, bisect
from collections import defaultdict

# ============================ STUDENT PROFILE (edit per candidate) ============
STUDENT = {
    "home_inst_code": "228",          # NIT Warangal (home-state NIT) -> HS quota here
    "pools": {                         # category -> the rank to test against closingRank
        "OBC-NCL(PwD)": 388,
        "General PwD": 940,
    },
    "seat_pool": "Gender-Neutral",     # male -> no female-only
}
YEARS = [2023, 2024, 2025]

# ============================ FILTERS =========================================
import re
NE_RX = re.compile(r"agartala|arunachal|manipur|meghalaya|mizoram|nagaland|sikkim|silchar|"
                   r"assam|tezpur|shillong|aizawl|imphal|kohima|kokrajar|nirjuli|"
                   r"north[- ]?eastern|nerist|guwahati|tripura", re.I)
RESTRICT_INST = {"307","308","316","318","303","326","304","327","453","432","439","371","325"}  # orthopedic-restricted
COLD_INST     = {"225","416","437","210","306","227","403"}  # J&K + Himachal + Uttarakhand
BIHAR_INST    = {"214","322","441","446"}
DEMOTE_PENALTY = 500   # unsuitable branches pushed below all engineering

def is_demoted_branch(bn):
    n = bn.lower()
    if any(k in n for k in ["mining","ceramic","industrial design","food","bio medical","biomedical","bio-medical"]):
        return True
    if re.match(r"^(physics|chemistry|mathematics|life science|geology|engineering physics)\b", n.strip()) \
       and "computing" not in n and "scientific comput" not in n:
        return True
    return False

# ============================ SCORING TABLES =================================
def branch_score(n):
    n = n.lower()
    if "computer science" in n and ("artificial" in n or "data" in n): return 97
    if "computer science" in n: return 100
    if "artificial intelligence" in n or "data science" in n or "computational and data" in n: return 95
    if "mathematics and computing" in n: return 92
    if "information technology" in n: return 90
    if "electronics" in n and "vlsi" in n: return 86
    if "electronics and communication" in n: return 84
    if "electrical" in n: return 78
    if "electronics" in n: return 80
    if "instrumentation" in n: return 68
    if "mechanical" in n: return 66
    if "production" in n or "industrial" in n: return 62
    if "chemical" in n: return 58
    if "civil" in n: return 52
    if "metallurg" in n or "material" in n or "ceramic" in n: return 46
    if "mining" in n: return 40
    if "bio" in n: return 38
    if any(x in n for x in ["physics","chemistry","mathematics","life science","geology"]): return 33
    return 50

# institute-level (career rating, culture rating) 1-10  (reputation-based, directional)
CC = {"228":(9.2,9.3),"226":(9.5,9.2),"211":(9.3,9.0),"223":(8.7,8.5),"206":(8.5,8.3),"230":(8.4,8.2),
 "202":(8.3,8.3),"204":(8.3,8.0),"220":(8.0,8.0),"229":(8.1,7.9),"203":(7.9,7.9),"201":(7.7,7.7),
 "208":(7.6,7.7),"219":(7.6,7.6),"216":(7.3,7.4),"210":(7.0,7.3),"207":(7.4,6.8),"231":(7.0,6.8),
 "209":(6.9,7.0),"215":(6.7,6.8),"214":(7.0,7.0),"225":(6.5,6.5),"227":(6.3,6.3),"232":(8.0,8.2),
 "309":(8.6,7.8),"311":(7.8,7.3),"310":(7.6,7.2),"301":(7.9,7.5),"321":(7.6,7.0),"320":(7.3,6.8),
 "315":(7.8,7.0),"317":(6.9,6.7),"302":(7.0,6.5),"323":(7.0,6.6),"324":(7.0,6.5),"306":(6.8,6.4),
 "305":(6.7,6.3),"319":(6.6,6.3),"314":(6.8,6.4),"322":(6.5,6.2),"421":(7.6,9.4),"402":(8.0,8.0),
 "422":(8.0,8.0),"435":(7.8,6.8),"423":(6.8,9.0),"424":(7.0,6.8),"420":(7.0,6.7),"405":(6.3,6.3),
 "451":(6.8,6.8),"416":(6.5,6.8),"428":(5.8,6.3),"437":(5.5,6.0),"444":(5.0,5.5),"438":(5.3,6.0),
 "426":(6.3,6.5),"406":(5.5,6.0),"434":(5.5,5.8),"403":(5.3,6.0),"410":(6.0,6.2),"407":(5.8,6.0),
 "449":(5.5,5.8),"443":(6.0,6.0),"409":(6.3,6.2),"430":(6.0,6.3),"431":(6.0,6.2),"445":(5.8,5.5),
 "447":(5.5,5.3),"408":(5.5,5.3),"448":(5.3,5.2),"446":(5.3,5.2),"404":(4.0,4.5),"433":(4.2,4.5),
 "442":(4.0,4.3),"440":(6.0,6.0),"441":(6.0,6.0),"427":(5.0,5.5)}
DEF = {"NIT":(7.0,7.2),"IIIT":(6.6,6.3),"GFTI":(5.5,5.8)}

NIRF = {"226":9,"223":13,"211":17,"206":21,"228":28,"202":42,"230":44,"208":49,"402":51,"214":53,
 "232":54,"201":55,"204":62,"207":65,"229":66,"225":73,"421":74,"410":79,"203":81,"219":82,
 "220":85,"216":86,"301":96,"210":97,"215":99,"309":125,"209":125,"311":125,"422":125,"431":125}

# institute distance from Telangana (km, approx) for a small proximity nudge
DIST = {"228":0,"421":140,"231":250,"317":300,"320":430,"230":450,"216":560,"215":560,"211":690,
 "209":700,"223":720,"310":620,"206":880,"226":850,"203":780,"424":780,"202":1400,"204":1100,
 "207":1500,"220":1500,"219":1100,"208":1300,"201":1600,"210":1650,"229":1000,"232":1450,
 "309":1100,"311":820,"301":1000,"315":1200,"321":620,"302":1350,"420":500,"423":1500,"428":1300,
 "402":1100,"405":1000,"422":1600}

# ============================ WEIGHTS (vault note 05) ========================
W = dict(brand=0.18, career=0.24, nirf=0.16, branch=0.22, pref=0.12, culture=0.08)
# Charan's preferred institute order (post-Warangal) for the UserPref pointer:
PREF = ["421","226","211","223","204","206","202","230","220","229","207","219","203","208","201",
 "210","209","216","232","231","227","215","225","301","311","310","321","302","323","324","320",
 "314","305","306","317","319","309","315","214","402","420","451","423","424","407","426","428",
 "408","440","410","447","416","448","406","438","403","437","444","405","434","427","443","449",
 "409","435","445","404","431","430","433","442","422","322","441","446"]

# ============================ LOAD DATA ======================================
def load(data_dir):
    store = defaultdict(lambda: defaultdict(dict)); meta = {}
    for fn in glob.glob(f"{data_dir}/2*_*_*.json"):
        try: j = json.load(open(fn))
        except Exception: continue
        for d in j.get("data", []):
            if d.get("seatPool") != STUDENT["seat_pool"]: continue
            c = d.get("closingRank")
            if c is None: continue
            t = d["institute"]["type"]
            if t not in ("NIT","IIIT","GFTI"): continue
            ic, bc = d["institute"]["code"], d["branch"]["code"]
            meta[(ic,bc)] = (t, d["institute"]["name"], d["branch"]["name"])
            y = d.get("year") or int(fn.split("/")[-1].split("_")[0])
            key = (d["quota"], d.get("category"))
            store[(ic,bc)][key][y] = max(store[(ic,bc)][key].get(y,0), c)
    return store, meta

def quota_for(t, ic):
    return "HS" if (t=="NIT" and ic==STUDENT["home_inst_code"]) else ("OS" if t=="NIT" else "AI")

def reach(store, ic, bc, t):
    q = quota_for(t, ic); yc = 0; anyd = False
    for y in YEARS:
        clear = False
        for cat, rank in STUDENT["pools"].items():
            cl = store[(ic,bc)].get((q,cat),{}).get(y)
            if cl is not None:
                anyd = True
                if rank <= cl: clear = True
        if clear: yc += 1
    if not anyd: return "No-data"
    return ["OUT","BORDERLINE","LIKELY","SAFE"][yc]

# ============================ BUILD & SCORE ==================================
def build(data_dir):
    store, meta = load(data_dir)
    # brand from CSE General-GN cutoff
    csegn = {}
    for (ic,bc),(t,inm,bn) in meta.items():
        if "computer science and engineering" in bn.lower() and "artificial" not in bn.lower():
            dd = store[(ic,bc)].get(("OS" if t=="NIT" else "AI","General")) or {}
            v = [dd.get(y) for y in YEARS if dd.get(y)]
            if v: csegn[ic] = min(csegn.get(ic,9e9), round(sum(v)/len(v)))
    order = sorted(csegn, key=lambda k: csegn[k]); brank = {ic:i for i,ic in enumerate(order)}
    prefidx = {ic:i for i,ic in enumerate(PREF)}
    def brand(ic): return max(0,100-brank.get(ic,len(order)+20)*1.4)
    def nirf(ic):
        r = NIRF.get(ic)
        return 3 if r is None else (100-r if r<=100 else 10)
    def pref(ic):
        i = prefidx.get(ic); return max(0,100-i*1.3) if i is not None else 0
    def prox(ic): return max(0,(1600-DIST.get(ic,1300))/160.0)
    def cc(ic,t): return CC.get(ic, DEF[t])

    rows = []
    for (ic,bc),(t,inm,bn) in meta.items():
        if NE_RX.search(inm) or ic in RESTRICT_INST or ic in COLD_INST: continue
        if "architect" in bn.lower() or "planning" in bn.lower(): continue
        car,cul = cc(ic,t); tilt = 8 if t=="NIT" else (0 if t=="IIIT" else -8)
        pts = (W["brand"]*brand(ic) + W["career"]*car*10 + W["nirf"]*nirf(ic)
               + W["branch"]*branch_score(bn) + W["pref"]*pref(ic) + W["culture"]*cul*10
               + tilt + prox(ic)*0.6)
        rows.append(dict(ic=ic,bc=bc,t=t,inst=inm,branch=bn,car=car,cul=cul,nirf=NIRF.get(ic),
                         pts=pts, reach=reach(store,ic,bc,t),
                         demoted=is_demoted_branch(bn)))

    # ---- ordering rules (vault note 05/07) ----
    HOME = STUDENT["home_inst_code"]
    def in_block(r):  # home NIT engineering block + biotech
        return r["ic"]==HOME and (branch_score(r["branch"])>=45 or "bio" in r["branch"].lower())
    # Mechanical naturally ranks above Chemical (branch 66 > 58). Only tweak: pull
    # home Biotech UP to just below Chemical (else it sinks on branch score 38).
    chem_min = min([r["pts"] for r in rows if r["ic"]==HOME and "chemical" in r["branch"].lower()] or [0])
    for r in rows:
        if r["ic"]==HOME and "bio" in r["branch"].lower(): r["pts"] = chem_min - 0.001

    uoh = next((r for r in rows if r["ic"]=="421" and "computer science and engineering" in r["branch"].lower()), None)
    def tier(r):
        if in_block(r): return (0, -r["pts"])
        base = 1e6 if r["ic"] in BIHAR_INST else 0
        pen  = DEMOTE_PENALTY if r["demoted"] else 0
        return (2, base + pen - r["pts"])
    for r in rows: r["tier"] = tier(r)
    # anchor UoH CSE around rank 85 among normal seats
    if uoh:
        nblock = sum(1 for r in rows if in_block(r))
        pool = sorted([r for r in rows if r["tier"][0]==2 and r is not uoh and not r["demoted"]
                       and r["ic"] not in BIHAR_INST], key=lambda r:r["tier"][1])
        idx = max(1, 85 - nblock - 1)
        uoh["tier"] = (2, -((pool[idx-1]["pts"]+pool[idx]["pts"])/2))
    rows.sort(key=lambda r:(r["tier"][0], r["tier"][1], r["branch"]))
    for i,r in enumerate(rows,1): r["rank"]=i
    # percentile across post-home pool
    post = [r for r in rows if not in_block(r)]
    pv = sorted(r["pts"] for r in post); n=len(pv)
    for r in rows:
        r["pct"] = 100.0 if in_block(r) else round(100*bisect.bisect_right(pv,r["pts"])/n,1)
    lo,hi = min(r["pts"] for r in rows), max(r["pts"] for r in rows)
    for r in rows: r["points"] = round(100*(r["pts"]-lo)/(hi-lo),1)
    return rows, store, meta

# ============================ OUTCOME SIMULATION =============================
def simulate(rows, store):
    for y in YEARS:
        for r in rows:
            q = quota_for(r["t"], r["ic"])
            ok = any((store[(r["ic"],r["bc"])].get((q,cat),{}).get(y) is not None
                      and rank <= store[(r["ic"],r["bc"])].get((q,cat),{}).get(y))
                     for cat,rank in STUDENT["pools"].items())
            if ok:
                print(f"  if {y} -> #{r['rank']} {r['inst']} | {r['branch']} ({r['reach']})"); break

# ============================ MAIN ==========================================
if __name__ == "__main__":
    data_dir = sys.argv[1] if len(sys.argv)>1 else "_extract/data"
    rows, store, meta = build(data_dir)
    json.dump([{k:r[k] for k in ("rank","ic","bc","inst","branch","reach","points","pct")} for r in rows],
              open("priority_list.json","w"), ensure_ascii=False, indent=0)
    print(f"Built {len(rows)} choices -> priority_list.json")
    print("Predicted allotment (back-test):"); simulate(rows, store)
