
(function () {
  'use strict';
  var toggle     = document.getElementById('evhToggle');
  var mobileMenu = document.getElementById('evhMobile');
  var backdrop   = document.getElementById('evhBackdrop');
  var closeBtn   = document.getElementById('evhMobClose');
  if (!toggle || !mobileMenu) return;
 
  function openMenu() {
    mobileMenu.classList.add('is-open');
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    document.body.style.overflow = '';
  }
 
  toggle.addEventListener('click', function () {
    mobileMenu.classList.contains('is-open') ? closeMenu() : openMenu();
  });
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);
 
  // Accordion
  mobileMenu.querySelectorAll('.evh-mob-acc').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var sub = this.nextElementSibling;
      var isOpen = sub.classList.toggle('is-open');
      this.classList.toggle('is-expanded', isOpen);
      this.setAttribute('aria-expanded', String(isOpen));
    });
  });
 
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
})();

;

(function () {

    // ── Guard 1: run init logic only once per page ────────────────────────────
    if (window.__eduScrollInit) return;
    window.__eduScrollInit = true;

    // ── Guard 2: remove duplicate <style> tags (PHP included multiple times) ──
    // The id="edu-scroll2top-style" deduplicates in most parsers, but JS
    // handles any edge cases (e.g. document.write, AJAX injection).
    document.querySelectorAll('#edu-scroll2top-style').forEach(function (el, i) {
        if (i > 0) el.remove();
    });

    // ── Init: safe whether DOM has loaded or not ──────────────────────────────
    function init() {

        var btn = document.getElementById('eduScroll2Top');
        if (!btn) return; // silently bail — DOM element missing

        var THRESHOLD = 300;  // px scrolled before button appears
        var ticking   = false;

        // ── Show / hide — rAF-throttled for smooth 60 fps handling ────────────
        function updateVisibility() {
            btn.classList.toggle('visible', window.scrollY > THRESHOLD);
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(updateVisibility);
        }, { passive: true });

        // ── Smooth scroll to top ──────────────────────────────────────────────
        btn.addEventListener('click', function (e) {
            spawnRipple(e);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // ── Ripple helper ─────────────────────────────────────────────────────
        function spawnRipple(e) {
            var el     = btn;
            var d      = Math.max(el.offsetWidth, el.offsetHeight);
            var rect   = el.getBoundingClientRect();
            var ripple = document.createElement('span');

            ripple.className  = 'edu-scroll-ripple';
            ripple.style.cssText = [
                'width:'  + d + 'px',
                'height:' + d + 'px',
                'left:'   + (e.clientX - rect.left  - d / 2) + 'px',
                'top:'    + (e.clientY - rect.top   - d / 2) + 'px'
            ].join(';');

            el.appendChild(ripple);
            ripple.addEventListener('animationend', function () { ripple.remove(); });
        }
    }

    // Run immediately if DOM is ready, otherwise wait for it.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

}());

;

(function () {

    // ── Guard 1: one init per page ────────────────────────────────────────────
    if (window.__evShareInit) return;
    window.__evShareInit = true;

    // ── Guard 2: remove duplicate <style> tags ────────────────────────────────
    // Handles edge cases where the PHP include fires despite the define() guard
    // (e.g. output buffering, AJAX injection, opcode cache quirks).
    document.querySelectorAll('#ev-share-button-style').forEach(function (el, i) {
        if (i > 0) el.remove();
    });

    // ── Init ──────────────────────────────────────────────────────────────────
    function init() {
        var btn = document.getElementById('evFloatingShare');
        if (!btn) return;

        /*
         * Config priority (highest → lowest):
         *   1. data-share-* attributes on the <button> (set from PHP variables)
         *   2. window.shareButtonConfig (legacy JS approach)
         *   3. Page defaults (<title>, <meta description>, location.href)
         */
        var legacy = window.shareButtonConfig || {};
        var meta   = document.querySelector('meta[name="description"]');

        var cfg = {
            title: btn.dataset.shareTitle || legacy.title || document.title,
            text:  btn.dataset.shareText  || legacy.text  || (meta ? meta.content : '') || '',
            url:   btn.dataset.shareUrl   || legacy.url   || window.location.href
        };

        // ── Share logic ───────────────────────────────────────────────────────

        function share() {
            if (navigator.share) {
                navigator.share({ title: cfg.title, text: cfg.text, url: cfg.url })
                    .then(function ()    { feedback(true,  false); })
                    .catch(function (err) {
                        // AbortError = user cancelled the native sheet — not an error
                        if (err.name !== 'AbortError') { clipboardFallback(); }
                    });
            } else {
                clipboardFallback();
            }
        }

        function clipboardFallback() {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(cfg.url)
                    .then(function ()  { feedback(true,  true); })
                    .catch(function () { legacyFallback(); });
            } else {
                legacyFallback();
            }
        }

        /*
         * execCommand('copy') is deprecated but remains the only option in
         * very old browsers and non-secure contexts (http://). Using <textarea>
         * rather than <input> avoids iOS selection issues with long URLs.
         */
        function legacyFallback() {
            var ta = document.createElement('textarea');
            ta.value = cfg.url;
            ta.style.cssText = 'position:absolute;left:-9999px;top:-9999px;opacity:0;';
            ta.setAttribute('readonly', '');
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            var ok = false;
            try { ok = document.execCommand('copy'); } catch (_) {}
            document.body.removeChild(ta);
            feedback(ok, true);
        }

        // ── Feedback: icon swap + toast ───────────────────────────────────────

        var _resetTimer = null;

        function feedback(success, wasCopy) {
            // Clear any in-flight reset so rapid clicks don't conflict
            clearTimeout(_resetTimer);

            // Remove existing state classes first, then force a reflow so the
            // browser registers the removal before we add the new class —
            // this restarts the CSS @keyframes animation cleanly.
            btn.classList.remove('ev-success', 'ev-error');
            void btn.offsetWidth; // intentional synchronous reflow

            btn.classList.add(success ? 'ev-success' : 'ev-error');

            showToast(
                success
                    ? (wasCopy ? 'Link copied to clipboard!' : 'Shared successfully!')
                    : 'Could not share. Please copy the URL manually.'
            );

            _resetTimer = setTimeout(function () {
                btn.classList.remove('ev-success', 'ev-error');
            }, 2300);
        }

        // ── Toast ─────────────────────────────────────────────────────────────

        var _toastEl    = null;
        var _hideTimer  = null;

        function showToast(msg) {
            // Dismiss any existing toast immediately before creating a new one
            if (_toastEl) {
                _toastEl.remove();
                _toastEl = null;
            }
            clearTimeout(_hideTimer);

            var el = document.createElement('div');
            el.className   = 'ev-share-toast';
            el.textContent = msg;
            // aria-live lets screen readers announce the toast without focus change
            el.setAttribute('role',      'status');
            el.setAttribute('aria-live', 'polite');
            document.body.appendChild(el);
            _toastEl = el;

            // Trigger fade-out animation, THEN remove from DOM after it completes
            _hideTimer = setTimeout(function () {
                if (!_toastEl) return;
                _toastEl.classList.add('ev-toast-out');
                _toastEl.addEventListener('animationend', function () {
                    if (_toastEl) { _toastEl.remove(); _toastEl = null; }
                }, { once: true });
            }, 2700);
        }

        // ── Event: click (keyboard is already handled natively by <button>) ───
        btn.addEventListener('click', share);
    }

    // Works correctly whether this script runs before or after DOM is parsed
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

}());

;

// Feedback Modal JavaScript
(function() {
    'use strict';
      // Configuration
    const CONFIG = {
        minTimeOnSite: 1000000, // 100 seconds
        maxTimeOnSite: 2000000, // 200 seconds
        minPageViews: 1, // Changed from 2 to 1 (no longer requires multiple pages)
        storageKey: 'feedbackModalState',
        sessionKey: 'feedbackSession'
    };
    
    // Track user engagement
    let sessionData = {
        startTime: Date.now(),
        pageViews: 1,
        pages: [window.location.pathname],
        modalShown: false
    };
    
    // Load existing session data
    function loadSessionData() {
        try {
            const stored = sessionStorage.getItem(CONFIG.sessionKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                sessionData = { ...sessionData, ...parsed };
                
                // Count current page view if different
                const currentPage = window.location.pathname;
                if (!sessionData.pages.includes(currentPage)) {
                    sessionData.pageViews++;
                    sessionData.pages.push(currentPage);
                }
            }
        } catch (e) {
            console.warn('Failed to load session data:', e);
        }
    }
    
    // Save session data
    function saveSessionData() {
        try {
            sessionStorage.setItem(CONFIG.sessionKey, JSON.stringify(sessionData));
        } catch (e) {
            console.warn('Failed to save session data:', e);
        }
    }    // Check if user has already interacted with modal
    function hasUserInteracted() {
        try {
            const state = localStorage.getItem(CONFIG.storageKey);
            if (state) {
                const parsed = JSON.parse(state);
                
                // Check if user clicked "Maybe Later" - show again after 1 hour
                if (parsed.dismissed === 'later' && parsed.timestamp) {
                    const hoursSince = (Date.now() - parsed.timestamp) / (1000 * 60 * 60);
                    return hoursSince < 1;
                }
                
                // Check if user just closed modal - show again after 60 seconds
                if (parsed.action === 'closed' && parsed.timestamp) {
                    const secondsSince = (Date.now() - parsed.timestamp) / 1000;
                    return secondsSince < 60;
                }
                
                // Check if user left a review - show again after 7 days
                if (parsed.action === 'review' && parsed.timestamp) {
                    const daysSince = (Date.now() - parsed.timestamp) / (1000 * 60 * 60 * 24);
                    return daysSince < 7;
                }
            }
            return false;
        } catch (e) {
            return false;
        }
    }
    
    // Check if engagement criteria are met
    function shouldShowModal() {
        if (sessionData.modalShown || hasUserInteracted()) return false;
        
        const timeOnSite = Date.now() - sessionData.startTime;
        const hasMinTime = timeOnSite >= CONFIG.minTimeOnSite;
        const hasMaxTime = timeOnSite <= CONFIG.maxTimeOnSite;
        const hasMinPages = sessionData.pageViews >= CONFIG.minPageViews;
        
        return hasMinTime && hasMaxTime && hasMinPages;
    }
    
    // Show the modal
    function showFeedbackModal() {
        const modal = document.getElementById('feedbackModal');
        if (modal && !sessionData.modalShown) {
            sessionData.modalShown = true;
            saveSessionData();
            
            modal.style.display = 'flex';
            // Small delay for smooth animation
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            // Focus management for accessibility
            const closeBtn = modal.querySelector('.feedback-modal-close');
            if (closeBtn) closeBtn.focus();
        }
    }
      // Close modal function (global scope)
    window.closeFeedbackModal = function() {
        const modal = document.getElementById('feedbackModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            
            // Track that user closed the modal (show again in 60 seconds)
            try {
                localStorage.setItem(CONFIG.storageKey, JSON.stringify({
                    action: 'closed',
                    timestamp: Date.now()
                }));
            } catch (e) {
                console.warn('Failed to save close action:', e);
            }
            
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    };
    
    // Handle feedback button click
    window.handleFeedbackClick = function(action) {
        // Track the action
        try {
            localStorage.setItem(CONFIG.storageKey, JSON.stringify({
                action: action,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.warn('Failed to save feedback action:', e);
        }
        
        // Close modal
        window.closeFeedbackModal();
    };
    
    // Dismiss modal with preference
    window.dismissFeedbackModal = function(preference) {
        try {
            localStorage.setItem(CONFIG.storageKey, JSON.stringify({
                dismissed: preference,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.warn('Failed to save dismissal preference:', e);
        }
        
        window.closeFeedbackModal();
    };
      // Initialize
    function init() {
        loadSessionData();
        
        // Check periodically if modal should be shown
        const checkInterval = setInterval(() => {
            if (shouldShowModal()) {
                showFeedbackModal();
                clearInterval(checkInterval);
            }
        }, 5000); // Check every 5 seconds
        
        // Stop checking after max time
        setTimeout(() => {
            clearInterval(checkInterval);
        }, CONFIG.maxTimeOnSite + 10000);
        
        // Save session data on page unload
        window.addEventListener('beforeunload', saveSessionData);
        
        // Note: Modal can only be closed via the close button (X) or action buttons
        // ESC key and outside click functionality removed per requirements
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

;

(function () {
    'use strict';

    window.addEventListener('pageshow', function (e) {
        if (e.persisted) reset();
    });

    function reset() {
        document.getElementById('ep-loading').style.display = 'none';
        var btn = document.getElementById('submitBtn');
        if (btn) btn.disabled = false;
    }
    reset();

    var form = document.getElementById('predictor-form');
    if (form) {
        form.addEventListener('submit', function () {
            document.getElementById('ep-loading').style.display = 'flex';
            document.getElementById('submitBtn').disabled = true;
            setTimeout(reset, 30000);
        });
    }

    var cfg = {
        plugins: ['remove_button', 'dropdown_input'],
        create: false,
        maxItems: null,
        hidePlaceholder: true,
        closeAfterSelect: false,
        onDropdownOpen:  function () { if (window.innerWidth <= 768) document.body.style.overflow = 'hidden'; },
        onDropdownClose: function () { document.body.style.overflow = ''; }
    };

    new TomSelect('#branches', Object.assign({}, cfg, { placeholder: 'All branches (or select specific ones)…', maxOptions: 1000 }));
    new TomSelect('#colleges', Object.assign({}, cfg, { placeholder: 'All colleges (or select specific ones)…', maxOptions: 1000 }));
})();

function epFaq(i) {
    var item = document.getElementById('faq-' + i);
    var open = item.classList.contains('open');
    document.querySelectorAll('#ep .faq-item.open').forEach(function (el) { el.classList.remove('open'); });
    if (!open) item.classList.add('open');
}

;

/* BeingWise client-side predictor (replaces results.php POST) */
(function(){
  var form = document.getElementById('predictor-form');
  if (!form) return;
  var DATA_URL = "/data/tg-eapcet.json";
  var STATE = "TS";
  // prevent any .php navigation on this page
  form.setAttribute('action','#');
  function mount(){
    var host = document.getElementById('bw-results');
    if (host) return host;
    host = document.createElement('section');
    host.id = 'bw-results';
    host.style.cssText = 'max-width:1100px;margin:28px auto 60px;padding:0 16px;font-family:inherit';
    form.closest('section, .container, .ep-card, div') ? form.parentNode.appendChild(host) : document.body.appendChild(host);
    var anchor = form.closest('section') || form.parentElement;
    anchor.parentNode.insertBefore(host, anchor.nextSibling);
    return host;
  }
  function genTokens(g){ return g === 'FEMALE' ? ['GIRLS','GEN'] : ['GEN']; }
  function keysFor(cat, reg, g){
    var out = [], gt = genTokens(g), regs = [reg]; if (reg !== 'UR') regs.push('UR');
    gt.forEach(function(t){ regs.forEach(function(r){ out.push(cat+'_'+t+'_'+r); }); });
    return out;
  }
  function wavg(hist){
    if (!hist || !hist.length) return null;
    var sw=0, sv=0;
    for (var i=0;i<hist.length;i++){ var w=hist.length-i; sw+=w; sv+=w*hist[i].rank; }
    return Math.round(sv/sw);
  }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    var host = mount();
    var rank = parseInt((document.getElementById('rank')||{}).value, 10);
    var cat  = (document.getElementById('category')||{}).value || 'OC';
    var reg  = (document.getElementById('region')||{}).value || 'UR';
    var gen  = (document.getElementById('gender')||{}).value || 'MALE';
    if (!rank || rank < 1){ host.innerHTML = '<p style="color:#b4232a">Enter a valid rank.</p>'; host.scrollIntoView({behavior:'smooth'}); return; }
    host.innerHTML = '<p style="opacity:.7">Crunching official closing ranks…</p>';
    var data;
    try { var r = await fetch(DATA_URL, {cache:'force-cache'}); if (!r.ok) throw 0; data = await r.json(); }
    catch(_) {
      host.innerHTML = '<div style="border:1px solid #e7d9c4;background:#fdf9f0;border-radius:14px;padding:22px 24px">'
        + '<strong style="font-size:1.05rem">Cutoff data for this exam is being finalised.</strong>'
        + '<p style="margin:.5rem 0 0;opacity:.8">The predictor UI is live; the official closing-rank dataset is loading in soon. Check back shortly.</p></div>';
      host.scrollIntoView({behavior:'smooth'}); return;
    }
    var cands = keysFor(cat, reg, gen);
    var rows = [];
    data.forEach(function(rec){
      var close = rec.close||{}, worst = rec.closingWorst||{}, fin = rec.final2025||{}, hist = rec.history||{};
      var key = null;
      for (var i=0;i<cands.length;i++){ if (close[cands[i]] != null){ key = cands[i]; break; } }
      if (!key) return;
      var c = close[key], w = worst[key]!=null?worst[key]:c, f = fin[key];
      var ceiling = Math.round(w * 1.10);
      if (rank > ceiling) return;
      var band = rank <= c ? ['High','#2c6a47'] : rank <= (f||w) ? ['Good','#bd7a18'] : rank <= w ? ['Fair','#c0492b'] : ['Reach','#8a8a8a'];
      rows.push({ inst: rec.inst, branch: rec.branchFull||rec.branch, seat: key, wavg: wavg(hist[key]), fin: f, close: c, band: band, hist: hist[key]||[] });
    });
    rows.sort(function(a,b){ return (a.close||9e9) - (b.close||9e9); });
    if (!rows.length){
      host.innerHTML = '<div style="border:1px solid #e7d9c4;background:#fdf9f0;border-radius:14px;padding:22px 24px">'
        + '<strong>No matching seats for rank '+esc(rank)+' ('+esc(cat)+' / '+esc(reg)+' / '+esc(gen)+').</strong>'
        + '<p style="margin:.5rem 0 0;opacity:.8">Try a wider region (UR) or check another category. The dataset currently covers categories with published closing ranks.</p></div>';
      host.scrollIntoView({behavior:'smooth'}); return;
    }
    // Curate: never dump the full list (Wall of Options). Show the strongest set,
    // hide the rest behind one toggle.
    var CAP = 24, hidden = Math.max(0, rows.length - CAP);
    var planURL = '/plan?rank=' + encodeURIComponent(rank) + '&state=' + STATE + '&cat=' + encodeURIComponent(cat);
    // Handoff CTA — the reason a predictor exists is to feed the solver.
    var cta = '<div style="display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:space-between;'
      + 'border:1px solid rgba(35,71,240,.22);background:#eef2fe;border-radius:14px;padding:16px 20px;margin:0 0 18px">'
      + '<div style="max-width:560px"><strong style="font-size:1rem">Knowing you can get in is step one.</strong>'
      + '<div style="opacity:.82;font-size:.9rem;margin-top:2px">Now build the <b>exact order to freeze</b> on the portal &mdash; Dream / Likely / Secure, with a safety floor so you never end with nothing.</div></div>'
      + '<a href="' + planURL + '" style="white-space:nowrap;background:#181d26;color:#fff;font-weight:600;text-decoration:none;padding:12px 20px;border-radius:999px">Build my freeze list &rarr;</a>'
      + '</div>';
    var shownN = Math.min(CAP, rows.length);
    var h = '<h2 style="font-weight:800;margin:0 0 6px">'+(hidden?('Top '+shownN+' of '+rows.length):rows.length)+' colleges you can realistically target</h2>'
      + '<p style="opacity:.7;margin:0 0 16px">Rank '+esc(rank)+' &middot; '+esc(cat)+' &middot; '+esc(reg)+' &middot; '+esc(gen)+'. Ranked by official closing rank.</p>'
      + cta
      + '<div style="overflow:auto;border:1px solid #e7d9c4;border-radius:14px">'
      + '<table class="table table-hover align-middle mb-0" style="min-width:760px"><thead style="background:#faf6ef">'
      + '<tr><th>COLLEGE</th><th>BRANCH</th><th>SEAT CATEGORY</th><th class="text-end">WEIGHTED AVG RANK</th><th class="text-end">2025 FINAL CUTOFF</th><th>TRENDS</th></tr></thead><tbody>';
    rows.forEach(function(r, i){
      var extra = i >= CAP;
      h += '<tr' + (extra?' class="bw-extra" style="display:none"':'') + '>'
        + '<td>'+esc(r.inst)+'</td>'
        + '<td>'+esc(r.branch)+'<div><span style="font-size:.72rem;font-weight:700;color:'+r.band[1]+'">'+r.band[0]+' chance</span></div></td>'
        + '<td><code>'+esc(r.seat)+'</code></td>'
        + '<td class="text-end">'+(r.wavg!=null?esc(r.wavg):'&ndash;')+'</td>'
        + '<td class="text-end">'+(r.fin!=null?esc(r.fin):'&ndash;')+'</td>'
        + '<td>'+(r.hist.length?'<button type="button" class="btn btn-sm btn-outline-secondary" data-bwt="'+i+'">Trends</button>':'&ndash;')+'</td>'
        + '</tr>';
      if (r.hist.length){
        h += '<tr id="bwt-'+i+'" style="display:none"><td colspan="6" style="background:#fbfaf7">'
          + '<div style="display:flex;flex-wrap:wrap;gap:8px">'
          + r.hist.map(function(p){ return '<span style="font-size:.78rem;border:1px solid #e7d9c4;border-radius:8px;padding:4px 9px"><b>'+esc(p.label.replace(/_/g,' '))+'</b>: '+esc(p.rank)+'</span>'; }).join('')
          + '</div></td></tr>';
      }
    });
    h += '</tbody></table></div>';
    if (hidden) h += '<div style="text-align:center;margin-top:16px"><button type="button" id="bw-more" class="btn btn-outline-secondary">Show all '+rows.length+' colleges</button></div>';
    host.innerHTML = h;
    host.querySelectorAll('[data-bwt]').forEach(function(btn){
      btn.addEventListener('click', function(){ var row = document.getElementById('bwt-'+btn.getAttribute('data-bwt')); if (row) row.style.display = row.style.display==='none'?'table-row':'none'; });
    });
    var more = document.getElementById('bw-more');
    if (more) more.addEventListener('click', function(){ host.querySelectorAll('.bw-extra').forEach(function(el){ el.style.display='table-row'; }); more.style.display='none'; });
    host.scrollIntoView({behavior:'smooth'});
  });
})();
