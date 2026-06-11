
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

/* ══════════════════════════════════════════════════════
   AP EAPCET — Custom Dropdown + DataTable Logic
══════════════════════════════════════════════════════ */
(function () {
'use strict';
 
/* ── Helpers ─────────────────────────────────────── */
const byId  = id  => document.getElementById(id);
 
/* ── State ───────────────────────────────────────── */
let selectedCollege = { value: '', label: '' };
let selectedBranch  = { value: '', label: '' };
let dt = null;
 
/* ══ Generic dropdown factory ══════════════════════ */
function makeDropdown(cfg) {
  const { triggerId, panelId, searchId, listId, emptyId, hiddenId, displayId } = cfg;
 
  const trigger    = byId(triggerId);
  const panel      = byId(panelId);
  const searchInp  = byId(searchId);
  const listEl     = byId(listId);
  const emptyEl    = byId(emptyId);
  const hiddenInp  = byId(hiddenId);
  const displayEl  = byId(displayId);
 
  function open() {
    if (trigger.disabled || trigger.classList.contains('disabled')) return;
    trigger.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
    panel.classList.add('open');
    searchInp.value = '';
    filterOptions('');
    setTimeout(() => searchInp.focus(), 50);
  }
 
  function close() {
    trigger.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
    panel.classList.remove('open');
  }
 
  function filterOptions(q) {
    const lower = q.toLowerCase().trim();
    const opts  = listEl.querySelectorAll('.eap-dd-option');
    let visible = 0;
    opts.forEach(opt => {
      const match = opt.dataset.label.toLowerCase().includes(lower);
      opt.classList.toggle('hidden', !match);
      if (match) visible++;
    });
    emptyEl.classList.toggle('show', visible === 0 && opts.length > 0);
  }
 
  function selectOption(value, label) {
    hiddenInp.value = value;
    displayEl.textContent = label;
    // FIX: Removed Bootstrap conflicting class
    displayEl.classList.remove('eap-placeholder');
    listEl.querySelectorAll('.eap-dd-option').forEach(o => {
      o.classList.toggle('selected', o.dataset.value === value);
    });
    close();
    if (cfg.onChange) cfg.onChange(value, label);
  }
 
  function clearSelection(placeholder) {
    hiddenInp.value = '';
    displayEl.textContent = placeholder;
    // FIX: Added custom class instead of Bootstrap's
    displayEl.classList.add('eap-placeholder');
    listEl.querySelectorAll('.eap-dd-option').forEach(o => o.classList.remove('selected'));
  }
 
  function enable()  { trigger.disabled = false; trigger.classList.remove('disabled'); }
  function disable() { trigger.disabled = true;  trigger.classList.add('disabled'); close(); }
 
  function setOptions(items) {
    listEl.innerHTML = '';
    items.forEach(item => {
      const el = document.createElement('div');
      el.className        = 'eap-dd-option';
      el.dataset.value    = item.value;
      el.dataset.label    = item.label;
      el.setAttribute('role', 'option');
      el.innerHTML = item.html || escHtml(item.label);
      listEl.appendChild(el);
    });
    emptyEl.classList.remove('show');
    bindOptionClicks();
  }
 
  function bindOptionClicks() {
    listEl.querySelectorAll('.eap-dd-option').forEach(opt => {
      opt.addEventListener('click', () => selectOption(opt.dataset.value, opt.dataset.label));
    });
  }
 
  /* Events */
  trigger.addEventListener('click', () => {
    panel.classList.contains('open') ? close() : open();
  });
  trigger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    if (e.key === 'Escape') close();
  });
  searchInp.addEventListener('input', () => filterOptions(searchInp.value));
  searchInp.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
 
  bindOptionClicks();
 
  return { open, close, enable, disable, setOptions, clearSelection, selectOption };
}
 
/* ── Escape HTML ─────────────────────────────────── */
function escHtml(s) {
  if (!s) return '';
  return s.toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
 
/* ── Close dropdowns on outside click ───────────── */
document.addEventListener('click', e => {
  if (!e.target.closest('#college-dd-wrap')) collegeDd && collegeDd.close();
  if (!e.target.closest('#branch-dd-wrap'))  branchDd  && branchDd.close();
});
 
/* ── College dropdown ─────────────────────────────── */
const collegeDd = makeDropdown({
  triggerId: 'eap-college-trigger',
  panelId:   'college-panel',
  searchId:  'college-search',
  listId:    'college-list',
  emptyId:   'college-empty',
  hiddenId:  'college-value',
  displayId: 'college-display',
  onChange: (value, label) => {
    selectedCollege = { value, label };
    selectedBranch  = { value: '', label: '' };
    branchDd.disable();
    branchDd.clearSelection('Loading branches…');
    loadBranches(value);
  }
});
 
/* ── Branch dropdown ─────────────────────────────── */
const branchDd = makeDropdown({
  triggerId: 'eap-branch-trigger',
  panelId:   'branch-panel',
  searchId:  'branch-search',
  listId:    'branch-list',
  emptyId:   'branch-empty',
  hiddenId:  'branch-value',
  displayId: 'branch-display',
  onChange: (value, label) => {
    selectedBranch = { value, label };
  }
});
 
/* ── Load branches via AJAX ──────────────────────── */
function loadBranches(collegeCode) {
  byId('eapLoaderBar').classList.add('show');
 
  fetch('get_branches.php?college_code=' + encodeURIComponent(collegeCode))
    .then(r => {
      if (!r.ok) throw new Error('Network error');
      return r.json();
    })
    .then(json => {
      if (json && json.status === 'ok' && Array.isArray(json.data) && json.data.length > 0) {
        const items = json.data.map(b => ({
          value: b.branch_code,
          label: b.branch_name + ' (' + b.branch_code + ')',
          html: escHtml(b.branch_name)
                + ' <span style="opacity:.6;font-size:.85em;margin-left:.4em;font-weight:600">('
                + escHtml(b.branch_code) + ')</span>'
        }));
        branchDd.setOptions(items);
        branchDd.clearSelection('Select a branch…');
        branchDd.enable();
      } else {
        branchDd.setOptions([]);
        branchDd.clearSelection('No branches found');
      }
    })
    .catch(() => {
      branchDd.setOptions([]);
      branchDd.clearSelection('Failed to load branches');
    })
    .finally(() => {
      byId('eapLoaderBar').classList.remove('show');
    });
}
 
/* ── DataTable (lazy init) ───────────────────────── */
function ensureDataTable() {
  if (dt) return;
  dt = new DataTable('#resultsTable', {
    responsive: true,
    processing: false,
    serverSide: false,
    pageLength: 25,
    lengthMenu: [10, 25, 50, 100],
    order: [[0, 'asc']],
    columns: [
      {
        data: 'rank',
        defaultContent: '—',
        type: 'num',
        render: v => (v != null && v !== '')
          ? '<span class="eap-rank">' + parseFloat(v) + '</span>'
          : '<span style="color:var(--text-3)">—</span>'
      },
      { data: 'cand_name', defaultContent: '—' },
      {
        data: 'category',
        defaultContent: '—',
        render: v => v && v !== '—' ? '<span class="eap-badge eap-badge-blue">' + escHtml(v) + '</span>' : '—'
      },
      {
        data: 'gender',
        defaultContent: '—',
        render: v => {
          if (!v || v === '—') return '—';
          const m = v[0].toUpperCase() === 'M';
          return '<span class="eap-badge ' + (m ? 'eap-badge-blue' : 'eap-badge-rose') + '">' + escHtml(v) + '</span>';
        }
      },
      { data: 'region', defaultContent: '—' },
      {
        data: 'alloted_category',
        defaultContent: '—',
        render: v => v && v !== '—' ? '<span class="eap-badge eap-badge-green">' + escHtml(v) + '</span>' : '—'
      },
      {
        data: 'phase',
        defaultContent: '—',
        render: v => v && v !== '—' ? '<span class="eap-badge eap-badge-amber">Phase ' + escHtml(v) + '</span>' : '—'
      },
      { data: 'college', defaultContent: '—' },
      { data: 'branch', defaultContent: '—' }
    ],
    columnDefs: [
      { targets: 0, responsivePriority: 1 },
      { targets: 1, responsivePriority: 2 },
      { targets: 2, responsivePriority: 3 },
      { targets: 3, responsivePriority: 4 },
      { targets: 4, responsivePriority: 5 },
      { targets: 5, responsivePriority: 6 },
      { targets: 6, responsivePriority: 7 },
      { targets: 7, responsivePriority: 100 },
      { targets: 8, responsivePriority: 101 }
    ],
    language: {
      emptyTable:   'No allotment records found.',
      zeroRecords:  'No matching records — try a different search.',
      info:         'Showing _START_–_END_ of _TOTAL_',
      infoEmpty:    '0 records',
      search:       '',
      searchPlaceholder: 'Search by name, category…'
    }
  });
}
 
/* ── Fetch Button ─────────────────────────────────── */
byId('fetchBtn').addEventListener('click', function () {
  const cVal = byId('college-value').value.trim();
  const bVal = byId('branch-value').value.trim();
 
  if (!cVal) { alert('Please select a college.'); return; }
  if (!bVal) { alert('Please select a branch.');  return; }
 
  /* Show results card + spinner */
  const card    = byId('resultsCard');
  const spinner = byId('eapSpinner');
  const tWrap   = byId('eapTableWrap');
  const empty   = byId('eapEmptyState');
  const selInfo = byId('selectionInfo');
  const btn     = byId('fetchBtn');
 
  card.style.display    = 'block';
  spinner.classList.add('show');
  tWrap.style.display   = 'none';
  empty.style.display   = 'none';
  selInfo.style.display = 'none';
  btn.disabled          = true;
 
  /* Update selection info */
  byId('selColText').textContent    = selectedCollege.label || cVal;
  byId('selBranchText').textContent = selectedBranch.label  || bVal;
  byId('resultCount').textContent   = '…';
 
  const form = new FormData();
  form.append('college_code', cVal);
  form.append('branch_code',  bVal);
 
  fetch('fetch_results.php', { method: 'POST', body: form })
    .then(r => {
      if (!r.ok) throw new Error('Server error ' + r.status);
      return r.json();
    })
    .then(json => {
      const rows = (json && Array.isArray(json.data)) ? json.data : [];
 
      spinner.classList.remove('show');
      selInfo.style.display = 'block';
 
      if (rows.length === 0) {
        empty.style.display   = 'flex';
        byId('eapEmptyMsg').textContent = 'No allotments found for the selected college and branch.';
        byId('resultCount').textContent = '0 records';
        return;
      }
 
      byId('resultCount').textContent = rows.length.toLocaleString() + ' records';
      
      // CRITICAL: Unhide the table wrapper BEFORE drawing so widths calculate correctly
      tWrap.style.display = 'block';
 
      ensureDataTable();
 
      /* Clear existing data and load new rows */
      dt.clear();
      dt.rows.add(rows);
      dt.draw();
    })
    .catch(err => {
      spinner.classList.remove('show');
      empty.style.display = 'flex';
      byId('eapEmptyMsg').textContent = 'Something went wrong while fetching data. Please try again.';
      byId('resultCount').textContent = 'Error';
      console.error('Fetch error:', err);
    })
    .finally(() => {
      btn.disabled = false;
      /* Scroll to results on mobile */
      if (window.innerWidth < 768) {
        setTimeout(() => byId('resultsCard').scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    });
});
 
/* ── FAQ accordion ────────────────────────────────── */
document.querySelectorAll('.eap .eap-faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item   = q.closest('.eap-faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.eap .eap-faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});
 
})(); /* end IIFE */
