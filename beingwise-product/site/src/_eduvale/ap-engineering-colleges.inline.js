
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
  'use strict';

  /* ---- COPY PROTECTION ---- */
  var table = document.getElementById('apecTable');
  if (table) {
    ['copy','cut','contextmenu','dragstart'].forEach(function(ev) {
      table.addEventListener(ev, function(e) { e.preventDefault(); });
    });
    table.addEventListener('selectstart', function(e) { e.preventDefault(); });
  }

  /* ---- MOBILE: ROW ACCORDION TOGGLE ---- */
  window.apecToggleRow = function (tr) {
    if (!tr) return;
    var isExpanded = tr.classList.toggle('is-expanded');
    var btn = tr.querySelector('.apec-mob-expander');
    if (btn) btn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  };

  /* ---- DROPDOWN REFERENCES ---- */
  var sel         = document.getElementById('apecSelect');
  var trigger     = document.getElementById('apecTrigger');
  var panel       = document.getElementById('apecPanel');
  var searchInput = document.getElementById('apecSearch');
  var clearBtn    = document.getElementById('apecClear');
  var optList     = document.getElementById('apecList');
  var metaEl      = document.getElementById('apecMeta');
  var noResult    = document.getElementById('apecNoResult');

  var isOpen = false;
  var focusIdx = -1;

  function openPanel() {
    if (isOpen) return;
    panel.hidden = false;
    sel.setAttribute('aria-expanded', 'true');
    trigger.setAttribute('aria-expanded', 'true');
    isOpen = true;
    searchInput.value = '';
    clearBtn.hidden = true;
    filterOptions('');
    searchInput.focus();
  }

  function closePanel() {
    if (!isOpen) return;
    panel.hidden = true;
    sel.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-expanded', 'false');
    isOpen = false;
    focusIdx = -1;
    removeFocus();
  }

  function removeFocus() {
    optList.querySelectorAll('.apec-select__opt.is-focused')
      .forEach(function(o) { o.classList.remove('is-focused'); });
  }

  function filterOptions(q) {
    var term = q.toLowerCase().trim();
    var opts = optList.querySelectorAll('.apec-select__opt');
    var count = 0;
    opts.forEach(function(o) {
      var s = o.getAttribute('data-search') || '';
      var match = !term || s.indexOf(term) !== -1;
      o.hidden = !match;
      if (match) count++;
    });
    metaEl.textContent = count + (count === 1 ? ' branch group' : ' branch groups') + (term ? ' match' : ' available');
    noResult.hidden = count > 0;
    focusIdx = -1;
    removeFocus();
  }

  function getVisible() {
    return Array.from(optList.querySelectorAll('.apec-select__opt:not([hidden])'));
  }

  function setFocus(idx) {
    var visible = getVisible();
    removeFocus();
    if (idx >= 0 && idx < visible.length) {
      visible[idx].classList.add('is-focused');
      visible[idx].scrollIntoView({ block: 'nearest' });
      focusIdx = idx;
    }
  }

  function selectSlug(slug) {
    window.location.href = slug
      ? '//tools/ap-engineering-colleges' + slug
      : '//tools/ap-engineering-colleges';
  }

  /* Trigger click */
  if (trigger) {
    trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      isOpen ? closePanel() : openPanel();
    });
    trigger.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault(); openPanel();
      }
    });
  }

  /* Search input */
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      filterOptions(this.value);
      clearBtn.hidden = !this.value;
    });
    searchInput.addEventListener('keydown', function(e) {
      var visible = getVisible();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocus(Math.min(focusIdx + 1, visible.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocus(Math.max(focusIdx - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (focusIdx >= 0 && visible[focusIdx]) {
          selectSlug(visible[focusIdx].getAttribute('data-slug'));
        }
      } else if (e.key === 'Escape') {
        closePanel(); if (trigger) trigger.focus();
      }
    });
  }

  /* Clear button */
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      searchInput.value = '';
      clearBtn.hidden = true;
      filterOptions('');
      searchInput.focus();
    });
  }

  /* Option list */
  if (optList) {
    optList.addEventListener('click', function(e) {
      var opt = e.target.closest('.apec-select__opt');
      if (opt) selectSlug(opt.getAttribute('data-slug'));
    });
    optList.addEventListener('mousemove', function(e) {
      var opt = e.target.closest('.apec-select__opt');
      if (opt) {
        var visible = getVisible();
        var i = visible.indexOf(opt);
        if (i !== focusIdx) setFocus(i);
      }
    });
  }

  /* Click outside to close */
  document.addEventListener('click', function(e) {
    if (sel && !sel.contains(e.target)) closePanel();
  });

  /* ---- TABLE FILTER ---- */
  window.apecFilterTable = function(query) {
    var q = query.toLowerCase().trim();
    var rows = document.querySelectorAll('#apecTbody tr');
    var visible = 0;
    rows.forEach(function(r) {
      var s = r.getAttribute('data-searchable') || '';
      var show = !q || s.indexOf(q) !== -1;
      r.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    var fe = document.getElementById('apecFilterEmpty');
    if (fe) fe.hidden = visible > 0;
  };

  /* ---- TABLE SORT ---- */
  var sortDir = { 4: true };
  window.apecSort = function(colIdx, numeric) {
    var tbody = document.getElementById('apecTbody');
    if (!tbody) return;

    if (sortDir[colIdx] === undefined) {
      sortDir[colIdx] = true;
    } else {
      sortDir[colIdx] = !sortDir[colIdx];
    }
    var asc = sortDir[colIdx];

    var rows = Array.from(tbody.querySelectorAll('tr'));
    rows.sort(function(a, b) {
      var ac = a.cells[colIdx], bc = b.cells[colIdx];
      var av = ac ? ac.innerText.replace(/,/g, '').trim() : '';
      var bv = bc ? bc.innerText.replace(/,/g, '').trim() : '';
      if (numeric) {
        var an = (av === '—' || av === '–' || av === '') ? 9999999 : (parseFloat(av) || 0);
        var bn = (bv === '—' || bv === '–' || bv === '') ? 9999999 : (parseFloat(bv) || 0);
        return asc ? an - bn : bn - an;
      }
      return asc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    rows.forEach(function(r) { tbody.appendChild(r); });

    /* Renumber visible rows */
    var n = 1;
    rows.forEach(function(r) {
      if (r.style.display === 'none') return;
      var cell = r.cells[0];
      if (!cell) return;
      var el = cell.querySelector('.apec-rank, .apec-rank-plain');
      if (el) el.textContent = n;
      n++;
    });

    /* Update active sort header and arrow classes */
    var ths = document.querySelectorAll('#apec .apec-table th');
    ths.forEach(function(th) {
      th.classList.remove('th-active-sort', 'sort-asc', 'sort-desc');
    });
    if (ths[colIdx]) {
      ths[colIdx].classList.add('th-active-sort');
      ths[colIdx].classList.add(asc ? 'sort-asc' : 'sort-desc');
    }
  };

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
