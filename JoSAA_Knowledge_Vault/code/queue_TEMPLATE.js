/* ============================================================
   QUEUE TEMPLATE  (input format for josaa_fill_engine.js)
   ------------------------------------------------------------
   The automation engine is GENERIC. It fills WHATEVER ordered
   list you put in window.QUEUE — it contains NO specific options.
   Replace the example rows below with any student's list, in
   priority order. (The scoring brain josaa_pipeline.py can
   generate this; or build it by hand; or upload a CSV/JSON.)

   Schema per row:
     rank   : 1-based priority position
     ic     : institute code  (as shown on the portal)
     bc     : branch code     (as shown on the portal)
     inst   : institute name  (for logs / human readout)
     branch : branch name     (for logs / human readout)
     reach  : optional tag (SAFE/LIKELY/BORDERLINE/OUT) — display only
   ============================================================ */
window.QUEUE = [
  { rank: 1, ic: "<INST_CODE>", bc: "<BRANCH_CODE>", inst: "<Institute name>", branch: "<Branch name>", reach: "SAFE" },
  { rank: 2, ic: "<INST_CODE>", bc: "<BRANCH_CODE>", inst: "<Institute name>", branch: "<Branch name>", reach: "LIKELY" },
  // ... any number of rows, in priority order ...
];
console.log("QUEUE loaded:", window.QUEUE.length, "choices");
