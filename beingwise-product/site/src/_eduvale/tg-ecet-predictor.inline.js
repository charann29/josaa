
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

  // ── State ──────────────────────────────────────────────
  var allResults   = [];
  var filteredData = [];
  var currentPage  = 1;
  var pageSize     = 20;   // works well for both table (desktop) and cards (mobile)
  var sortKey      = 'rank';
  var userRank     = 0;

  // ── Select2 branch filter ──────────────────────────────
  $('#branchFilter').select2({
    theme: 'default',
    width: '100%',
    placeholder: 'Search B.Tech branches… (required)',
    allowClear: true,
    ajax: {
      url: 'get_branches.php',
      dataType: 'json',
      delay: 200,
      data: function (p) { return { q: p.term || '' }; },
      processResults: function (d) { return { results: d }; }
    },
    minimumInputLength: 0
  });

  // ── Form submit ────────────────────────────────────────
  document.getElementById('tgecetForm').addEventListener('submit', function (e) {
    e.preventDefault();

    var valid = true;

    // Validate rank
    var rankVal = parseInt(document.getElementById('ecet-rank').value, 10);
    var rankErr = document.getElementById('rankError');
    if (!rankVal || rankVal < 1) {
      document.getElementById('ecet-rank').classList.add('input-error');
      rankErr.classList.add('visible');
      valid = false;
    } else {
      document.getElementById('ecet-rank').classList.remove('input-error');
      rankErr.classList.remove('visible');
    }

    // Validate branches (at least 1 selected)
    var selectedBranches = $('#branchFilter').val();
    var branchErr = document.getElementById('branchError');
    var branchContainer = document.querySelector('.tgecet-root .select2-container--default .select2-selection--multiple');
    if (!selectedBranches || selectedBranches.length === 0) {
      if (branchContainer) branchContainer.classList.add('select2-error');
      branchErr.classList.add('visible');
      valid = false;
    } else {
      if (branchContainer) branchContainer.classList.remove('select2-error');
      branchErr.classList.remove('visible');
    }

    if (!valid) return;

    userRank = rankVal;
    showResultsLoading();

    var formData = new FormData(this);

    fetch('get_results.php', { method: 'POST', body: formData })
      .then(function (r) { return r.json(); })
      .then(function (response) {
        if (!response.data || !Array.isArray(response.data)) throw new Error('Bad response');

        allResults   = response.data;
        filteredData = allResults.slice();

        renderCategoryChips(response.eligible_categories || []);
        applySort();
        renderResults();

        document.getElementById('resultsSection').classList.remove('hidden');
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
      })
      .catch(function () {
        showResultsError();
        document.getElementById('resultsSection').classList.remove('hidden');
      });
  });

  // ── Loading / error states ─────────────────────────────
  function showResultsLoading() {
    document.getElementById('resultsSection').classList.remove('hidden');
    document.getElementById('resultTableBody').innerHTML =
      '<tr><td colspan="8"><div class="tgecet-state-box"><div class="tgecet-spinner"></div><p>Crunching branch ranks for you…</p></div></td></tr>';
    document.getElementById('resultCardList').innerHTML =
      '<div class="tgecet-state-box"><div class="tgecet-spinner"></div><p>Crunching branch ranks for you…</p></div>';
    document.getElementById('ecetPagination').innerHTML = '';
    document.getElementById('resultCountBadge').textContent = '…';
  }

  function showResultsError() {
    var errHtml = '<div class="tgecet-state-box"><span class="state-icon">⚠️</span><p>Failed to load results. Please try again.</p></div>';
    document.getElementById('resultTableBody').innerHTML = '<tr><td colspan="8">' + errHtml + '</td></tr>';
    document.getElementById('resultCardList').innerHTML  = errHtml;
  }

  // ── Category chips ─────────────────────────────────────
  function renderCategoryChips(cats) {
    var wrap = document.getElementById('eligibleCategoryChips');
    if (!cats.length) {
      wrap.innerHTML = '<span style="color:var(--e-text-light);font-size:0.85rem">No categories matched</span>';
      return;
    }
    wrap.innerHTML = cats.map(function (c) {
      return '<span class="tgecet-cat-chip">' + escHtml(c) + '</span>';
    }).join('');
  }

  // ── Live search ────────────────────────────────────────
  document.getElementById('cardSearch').addEventListener('input', function () {
    var q = this.value.toLowerCase().trim();
    filteredData = allResults.filter(function (r) {
      return (r.college_name || '').toLowerCase().includes(q) ||
             (r.college_code || '').toLowerCase().includes(q) ||
             (r.branch_name  || '').toLowerCase().includes(q) ||
             (r.branch_code  || '').toLowerCase().includes(q) ||
             (r.matched_category || '').toLowerCase().includes(q);
    });
    currentPage = 1;
    applySort();
    renderResults();
  });

  // ── Sort ───────────────────────────────────────────────
  document.querySelectorAll('.tgecet-sort-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.tgecet-sort-btn').forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      sortKey     = this.dataset.sort;
      currentPage = 1;
      applySort();
      renderResults();
    });
  });

  function applySort() {
    filteredData.sort(function (a, b) {
      if (sortKey === 'rank')    return (a.closing_rank || 0) - (b.closing_rank || 0);
      if (sortKey === 'college') return (a.college_name || '').localeCompare(b.college_name || '');
      return 0;
    });
  }

  // ── Render results (both table + cards) ───────────────
  function renderResults() {
    var total = filteredData.length;
    document.getElementById('resultCountBadge').textContent = total + ' result' + (total !== 1 ? 's' : '');
    document.getElementById('resultsTitle').textContent = total ? 'Predicted Colleges' : 'No Matches Found';

    if (!total) {
      var emptyHtml = '<div class="tgecet-state-box"><span class="state-icon">😕</span><p>No colleges found for your inputs. Try a different branch or category.</p></div>';
      document.getElementById('resultTableBody').innerHTML = '<tr><td colspan="8">' + emptyHtml + '</td></tr>';
      document.getElementById('resultCardList').innerHTML  = emptyHtml;
      document.getElementById('ecetPagination').innerHTML = '';
      return;
    }

    var start  = (currentPage - 1) * pageSize;
    var page   = filteredData.slice(start, start + pageSize);

    // Desktop table rows
    document.getElementById('resultTableBody').innerHTML = page.map(function (r, i) {
      return buildTableRow(r, start + i + 1);
    }).join('');

    // Mobile cards
    document.getElementById('resultCardList').innerHTML = page.map(function (r) {
      return buildCard(r);
    }).join('');

    // Card expand/collapse
    document.querySelectorAll('.tgecet-result-card').forEach(function (card) {
      card.addEventListener('click', function () {
        this.classList.toggle('expanded');
      });
    });

    renderPagination(total);
  }

  // ── Desktop: table row ─────────────────────────────────
  function buildTableRow(r, idx) {
    var cr          = parseInt(r.closing_rank, 10) || 0;
    var profileUrl  = '//tools/tg-college-directorycollege-profile/' + encodeURIComponent(r.college_code || '');

    return '<tr>' +
      '<td class="tgecet-tbl-sr">' + idx + '</td>' +
      '<td><span class="tgecet-tbl-college-code">' + escHtml(r.college_code || '-') + '</span></td>' +
      '<td><div class="tgecet-tbl-college-name">' + escHtml(r.college_name || '-') + '</div></td>' +
      '<td><span class="tgecet-tbl-branch-code">' + escHtml(r.branch_code || '-') + '</span></td>' +
      '<td><div class="tgecet-tbl-branch-name">' + escHtml(r.branch_name || '-') + '</div></td>' +
      '<td class="td-rank">' + cr.toLocaleString('en-IN') + '</td>' +
      '<td><span class="tgecet-tbl-category">' + escHtml(r.matched_category || '-') + '</span></td>' +
      '<td class="td-action">' +
        '<a class="tgecet-tbl-view-btn" href="' + profileUrl + '" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">View ↗</a>' +
      '</td>' +
    '</tr>';
  }

  // ── Mobile: card ───────────────────────────────────────
  function buildCard(r) {
    var cr         = parseInt(r.closing_rank, 10) || 0;
    var profileUrl = '//tools/tg-college-directorycollege-profile/' + encodeURIComponent(r.college_code || '');

    return '<div class="tgecet-result-card" tabindex="0" role="button" aria-expanded="false">' +
      '<div class="tgecet-card-summary">' +
        '<span class="tgecet-code-badge">' + escHtml(r.college_code || '-') + '</span>' +
        '<span class="tgecet-branch-badge">' + escHtml(r.branch_code || '-') + '</span>' +
        '<div class="tgecet-closing-rank">' +
          cr.toLocaleString('en-IN') +
          '<span class="rank-label">Branch Rank</span>' +
        '</div>' +
        '<svg class="tgecet-expand-btn" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>' +
      '</div>' +
      '<div class="tgecet-card-detail">' +
        '<div class="tgecet-detail-grid">' +
          '<div class="tgecet-detail-field"><label>College Name</label><span>' + escHtml(r.college_name || '-') + '</span></div>' +
          '<div class="tgecet-detail-field"><label>Branch Name</label><span>' + escHtml(r.branch_name || '-') + '</span></div>' +
          '<div class="tgecet-detail-field"><label>Seat Category</label><span class="tgecet-seat-cat-tag">' + escHtml(r.matched_category || '-') + '</span></div>' +
          '<div class="tgecet-detail-field"><label>Your Rank</label><span style="color:var(--e-violet);font-family:\'Bricolage Grotesque\',sans-serif;font-size:1rem;font-weight:800;">' + userRank.toLocaleString('en-IN') + '</span></div>' +
        '</div>' +
        '<div class="tgecet-detail-footer">' +
          '<a class="tgecet-view-college-btn" href="' + profileUrl + '" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">View College Profile ↗</a>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  // ── Pagination ─────────────────────────────────────────
  function renderPagination(total) {
    var pages = Math.ceil(total / pageSize);
    if (pages <= 1) { document.getElementById('ecetPagination').innerHTML = ''; return; }

    var html = '';
    html += '<button class="tgecet-page-btn" ' + (currentPage === 1 ? 'disabled' : '') + ' data-page="' + (currentPage - 1) + '">‹</button>';

    var start = Math.max(1, currentPage - 2);
    var end   = Math.min(pages, currentPage + 2);
    for (var i = start; i <= end; i++) {
      html += '<button class="tgecet-page-btn ' + (i === currentPage ? 'active' : '') + '" data-page="' + i + '">' + i + '</button>';
    }
    html += '<button class="tgecet-page-btn" ' + (currentPage === pages ? 'disabled' : '') + ' data-page="' + (currentPage + 1) + '">›</button>';

    document.getElementById('ecetPagination').innerHTML = html;

    document.querySelectorAll('.tgecet-page-btn[data-page]').forEach(function (btn) {
      if (!btn.disabled) {
        btn.addEventListener('click', function () {
          currentPage = parseInt(this.dataset.page, 10);
          renderResults();
          document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    });
  }

  // ── FAQ accordion ──────────────────────────────────────
  document.querySelectorAll('.tgecet-faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item   = this.closest('.tgecet-faq-item');
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.tgecet-faq-item').forEach(function (i) { i.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
      this.setAttribute('aria-expanded', String(!isOpen));
    });
    q.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); }
    });
  });

  // ── Utility ────────────────────────────────────────────
  function escHtml(str) {
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

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
