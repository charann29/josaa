/* ============================================================
   JoSAA Choice-Filling Engine  —  Vinay (BOORA VINAY)
   Locomotor (walking) disability  -> RESTRICTION SAFETY IS #1
   ------------------------------------------------------------
   Run order tomorrow (after login + choice-filling OTP):
     1) josaaProbe()      -> shows page structure, counts. Touches nothing.
     2) josaaDryRun()     -> matches all 464 queue items vs the page,
                             flags restricted/unfound. Touches nothing.
     3) josaaRemoveAll()  -> removes EVERY existing filled choice.
     4) josaaFill()       -> adds queue top->bottom, one by one,
                             AUTO-DECLINES any restricted choice,
                             verifies each add, STOPS on any anomaly.
   Nothing is ever locked by this script. Vinay locks manually.
   ============================================================ */

(function () {
  // ---- 0. SAFETY ----
  // (A) ORTHO_RX = restrictions that bar VINAY's condition (orthopedic / locomotor /
  //     walking / leg / arm / limb / lower-extremity). These are AUTO-DECLINED.
  const ORTHO_RX = /(orthopaed|orthoped|locomotor|walking|both legs|one leg|lower limb|lower extremit|upper limb|one arm|both arms|muscular|cerebral palsy|leprosy|dwarf|acid attack|musculoskeletal|physically handicap|loco motor)/i;
  // (B) GENERIC_RX = some other restriction popup appeared (not clearly his condition,
  //     e.g. vision / colour-blindness). We DO NOT guess — we DECLINE and FLAG for
  //     manual review so Vinay decides case by case.
  const GENERIC_RX = /(restriction|not given to|not suitable|cannot be allotted|debarred|not allowed|handicap|disabilit)/i;
  // Second guard: institute codes known to bar walking-disabled candidates.
  const RESTRICT_INST = new Set(['307','308','316','318','303','326','304','327','453','432','439','371','325']);

  window._josaa = window._josaa || { log: [], added: 0, skipped: [], failed: [], restricted: [], otherRestrict: [] };

  // classify a dialog message: 'ortho' (his condition), 'other' (some restriction), or null
  function classify(m) {
    if (ORTHO_RX.test(m)) return 'ortho';
    if (GENERIC_RX.test(m)) return 'other';
    return null;
  }

  // ---- 1. Override native dialogs so a restriction can NEVER be accepted ----
  if (!window._josaaDialogsHooked) {
    window.confirm = function (msg) {
      const m = String(msg || '');
      const c = classify(m);
      if (c) {                              // ANY restriction prompt -> DECLINE (never add)
        window._josaa._lastRestricted = m;
        window._josaa._lastKind = c;        // 'ortho' = his condition, 'other' = review
        return false;
      }
      return true;                          // normal "add this choice?" -> accept
    };
    window.alert = function (msg) {
      const m = String(msg || '');
      const c = classify(m);
      if (c) { window._josaa._lastRestricted = m; window._josaa._lastKind = c; }
      // swallow alerts so they don't block the loop
    };
    window._josaaDialogsHooked = true;
  }

  const wait = (ms) => new Promise(r => setTimeout(r, ms));
  const L = (s) => { window._josaa.log.push(s); console.log(s); };

  // ---- 2. DOM helpers (defensive: try known IDs, else search) ----
  function availRows() {
    let c = document.querySelector('#avlChoiceContainer') ||
            document.querySelector('[id*="avlChoice"]') ||
            document.querySelector('[id*="available"]');
    return c ? Array.from(c.querySelectorAll('tr')).filter(r => r.cells && r.cells.length >= 4) : [];
  }
  function filledRows() {
    let c = document.querySelector('#filledChoiceContainer') ||
            document.querySelector('[id*="filledChoice"]') ||
            document.querySelector('[id*="filled"]');
    return c ? Array.from(c.querySelectorAll('tr')).filter(r => r.cells && r.cells.length >= 4) : [];
  }
  const cellTxt = (r, i) => (r.cells[i] ? r.cells[i].innerText.trim() : '');
  function findAvail(ic, bc) {
    return availRows().find(r => cellTxt(r, 0) === String(ic) && cellTxt(r, 2) === String(bc));
  }
  function btnIn(row) {
    return row.querySelector('input[type=button],input[type=submit],button,a.btn,img[onclick],[onclick]');
  }

  // ---- 3. PROBE: report structure, never modifies ----
  window.josaaProbe = function () {
    const a = availRows(), f = filledRows();
    L('--- PROBE ---');
    L('available rows: ' + a.length + ' | filled rows: ' + f.length);
    if (a[0]) L('sample available row cells: ' + Array.from(a[0].cells).map((c,i)=>i+':'+c.innerText.trim().slice(0,18)).join(' | '));
    if (f[0]) L('sample filled row cells: '    + Array.from(f[0].cells).map((c,i)=>i+':'+c.innerText.trim().slice(0,18)).join(' | '));
    L('QUEUE loaded: ' + (window.QUEUE ? window.QUEUE.length : 'NOT LOADED'));
    return { available: a.length, filled: f.length, queue: window.QUEUE ? window.QUEUE.length : 0 };
  };

  // ---- 4. DRY RUN: match every queue item, flag issues. No clicks ----
  window.josaaDryRun = function () {
    if (!window.QUEUE) { L('QUEUE not loaded!'); return; }
    let found = 0, notfound = [], pre = [];
    window.QUEUE.forEach(q => {
      if (RESTRICT_INST.has(String(q.ic))) { pre.push(q.rank + ' ' + q.inst + ' (pre-flagged restricted inst)'); return; }
      const row = findAvail(q.ic, q.bc);
      if (row) found++; else notfound.push(q.rank + ' ' + q.ic + '/' + q.bc + ' ' + q.branch);
    });
    L('--- DRY RUN ---');
    L('matched on page: ' + found + ' / ' + window.QUEUE.length);
    L('pre-flagged restricted institutes in queue: ' + pre.length);
    L('NOT FOUND on page (' + notfound.length + '):'); notfound.slice(0, 40).forEach(L);
    return { found, notfound, pre };
  };

  // ---- 5. REMOVE ALL existing filled choices ----
  window.josaaRemoveAll = async function () {
    L('--- REMOVE ALL ---');
    let guard = 0;
    while (filledRows().length > 0 && guard < 1000) {
      const before = filledRows().length;
      const row = filledRows()[filledRows().length - 1]; // remove from bottom up
      const b = btnIn(row);
      if (!b) { L('no remove btn on a filled row -> STOP, do manually'); break; }
      b.click();
      await wait(450);
      if (filledRows().length >= before) { // didn't drop; try once more then stop
        await wait(800);
        if (filledRows().length >= before) { L('remove not registering -> STOP for manual check'); break; }
      }
      guard++;
    }
    L('remaining filled after removeAll: ' + filledRows().length);
    return filledRows().length;
  };

  // ---- 6. FILL one by one, verifying each, stopping on anomaly ----
  window.josaaFill = async function (startRank = 1, maxToAdd = 9999) {
    if (!window.QUEUE) { L('QUEUE not loaded!'); return; }
    L('--- FILL from rank ' + startRank + ' ---');
    let done = 0;
    for (const q of window.QUEUE) {
      if (q.rank < startRank) continue;
      if (done >= maxToAdd) { L('reached maxToAdd=' + maxToAdd + ' -> pausing'); break; }

      // hard guard: never even attempt a known restricted institute
      if (RESTRICT_INST.has(String(q.ic))) {
        window._josaa.skipped.push(q); L('SKIP(restricted-inst) #' + q.rank + ' ' + q.inst); continue;
      }
      const row = findAvail(q.ic, q.bc);
      if (!row) { window._josaa.failed.push(q); L('NOT FOUND #' + q.rank + ' ' + q.ic + '/' + q.bc + ' ' + q.branch + ' -> STOP (go one by one)'); break; }

      const before = filledRows().length;
      window._josaa._lastRestricted = null;
      const b = btnIn(row);
      if (!b) { window._josaa.failed.push(q); L('NO ADD BTN #' + q.rank + ' -> STOP'); break; }
      window._josaa._lastKind = null;
      b.click();
      await wait(550);

      if (window._josaa._lastRestricted) {            // a restriction popup was caught -> declined
        if (window._josaa._lastKind === 'ortho') {     // his condition -> auto-skip, keep going
          window._josaa.restricted.push({ q, msg: window._josaa._lastRestricted });
          L('ORTHO-RESTRICTED-DECLINED #' + q.rank + ' ' + q.inst + ' | ' + q.branch);
          continue;
        }
        // some OTHER restriction -> declined but STOP for manual review (don't guess)
        window._josaa.otherRestrict.push({ q, msg: window._josaa._lastRestricted });
        L('OTHER-RESTRICTION (declined) #' + q.rank + ' ' + q.inst + ' | ' + q.branch +
          '\n   message: ' + window._josaa._lastRestricted +
          '\n   -> STOPPED. Review: if it does NOT affect Vinay, add manually then resume josaaFill(' + (q.rank + 1) + ')');
        break;
      }
      if (filledRows().length === before + 1) {        // success
        window._josaa.added++; done++;
        if (q.rank % 20 === 0) L('  ...added through #' + q.rank + ' (filled=' + filledRows().length + ')');
        continue;
      }
      // anomaly: neither restricted nor added -> STOP for manual one-by-one
      await wait(700);
      if (filledRows().length === before + 1) { window._josaa.added++; done++; continue; }
      window._josaa.failed.push(q);
      L('ANOMALY #' + q.rank + ' ' + q.inst + ' | ' + q.branch + ' (filled did not increment) -> STOPPING');
      break;
    }
    L('FILL paused. added=' + window._josaa.added + ' restricted-declined=' + window._josaa.restricted.length +
      ' skipped=' + window._josaa.skipped.length + ' failed=' + window._josaa.failed.length +
      ' | filled-now=' + filledRows().length);
    return window._josaa;
  };

  window.josaaReport = function () {
    const s = window._josaa;
    L('=== REPORT ===  added=' + s.added + ' | ortho-declined=' + s.restricted.length +
      ' | other-restriction=' + s.otherRestrict.length + ' | skipped-inst=' + s.skipped.length +
      ' | failed=' + s.failed.length + ' | filled-now=' + filledRows().length);
    if (s.restricted.length) L('Ortho-restricted (auto-declined): ' + s.restricted.map(r => r.q.rank).join(','));
    if (s.otherRestrict.length) L('Other-restriction (need review): ' + s.otherRestrict.map(r => r.q.rank).join(','));
    if (s.failed.length) L('Failed/needs manual: ' + s.failed.map(r => r.rank).join(','));
    return s;
  };

  L('Engine loaded. Next: load QUEUE, then josaaProbe() -> josaaDryRun() -> josaaRemoveAll() -> josaaFill().');
})();
