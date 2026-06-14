
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

    $(function () {

        /* ── Select2 init ──────────────────────────── */
        const $explorer = $('.eapcet-explorer');

        $('#year').select2({ width: '100%', placeholder: 'Choose Year', dropdownParent: $explorer });
        $('#college').select2({ width: '100%', placeholder: 'First select a year', dropdownParent: $explorer,
            matcher: function (params, data) {
                if (!$.trim(params.term)) return data;
                if (!data.text) return null;
                const q = params.term.toLowerCase();
                if (data.text.toLowerCase().includes(q) || (data.id && data.id.toLowerCase().includes(q))) return data;
                return null;
            }
        });
        $('#branch').select2({ width: '100%', placeholder: 'First select a college', dropdownParent: $explorer });

        /* ── Validation helpers ────────────────────── */
        function clearErrors() {
            $('#yearGroup, #collegeGroup, #branchGroup').removeClass('ee-error');
        }

        function showError(groupId) {
            $('#' + groupId).addClass('ee-error');
        }

        /* Clear error on each field when user makes a selection */
        $('#year').on('change',   function () { $('#yearGroup').removeClass('ee-error'); });
        $('#college').on('change', function () { $('#collegeGroup').removeClass('ee-error'); });
        $('#branch').on('change',  function () { $('#branchGroup').removeClass('ee-error'); });

        /* ── Step pills ────────────────────────────── */
        function setStep(n) {
            ['step1Pill','step2Pill','step3Pill','step4Pill'].forEach(function (id, i) {
                $('#' + id).toggleClass('active', i < n);
            });
        }

        /* ── Year change ───────────────────────────── */
        $('#year').on('change', function () {
            const year = $(this).val();
            $('#resultsSection').hide();
            $('#visualInsights').hide();
            clearCharts();

            if (!year) {
                $('#college').val(null).trigger('change').prop('disabled', true)
                    .empty().append('<option value="">First select a year</option>');
                $('#branch').val(null).trigger('change').prop('disabled', true)
                    .empty().append('<option value="">First select a college</option>');
                setStep(1);
                return;
            }

            setStep(1);
            $('#collegeLoading').addClass('show');
            $('#college').prop('disabled', true).empty().append('<option value="">Loading colleges…</option>');
            $('#branch').prop('disabled', true).empty().append('<option value="">First select a college</option>');

            $.ajax({
                url: 'fetch_colleges.php',
                data: { year: year },
                success: function (html) {
                    $('#college').empty()
                        .append('<option value="">Select College</option>')
                        .append(html)
                        .prop('disabled', false);
                    setStep(2);
                },
                complete: function () { $('#collegeLoading').removeClass('show'); }
            });
        });

        /* ── College change ────────────────────────── */
        $('#college').on('change', function () {
            const college = $(this).val();
            const year    = $('#year').val();
            $('#resultsSection').hide();
            $('#visualInsights').hide();
            clearCharts();

            if (!college || !year) {
                $('#branch').prop('disabled', true).empty().append('<option value="">First select a college</option>');
                return;
            }

            setStep(2);
            $('#branchLoading').addClass('show');
            $('#branch').prop('disabled', true).empty().append('<option value="">Loading branches…</option>');

            $.ajax({
                url: 'fetch_branches.php',
                data: { year: year, college: college },
                success: function (html) {
                    $('#branch').empty()
                        .append('<option value="">Select Branch</option>')
                        .append(html)
                        .prop('disabled', false);
                    setStep(3);
                },
                complete: function () { $('#branchLoading').removeClass('show'); }
            });
        });

        /* ── Branch change ─────────────────────────── */
        $('#branch').on('change', function () {
            $('#resultsSection').hide();
            $('#visualInsights').hide();
            clearCharts();
            if ($(this).val()) setStep(3);
        });

        /* ── Form submit (JS validation only) ─────── */
        $('#searchForm').on('submit', function (e) {
            e.preventDefault();  /* always prevent - novalidate is set but belt-and-suspenders */

            const year    = $('#year').val();
            const college = $('#college').val();
            const branch  = $('#branch').val();

            /* JS validation - no native browser tooltip involved */
            clearErrors();
            let valid = true;
            if (!year)    { showError('yearGroup');    valid = false; }
            if (!college) { showError('collegeGroup'); valid = false; }
            if (!branch)  { showError('branchGroup');  valid = false; }
            if (!valid) return;  /* stop here - no page shift, no viewport scroll */

            /* Loading state */
            const $btn = $('#searchBtn');
            $btn.prop('disabled', true);
            $('#searchBtnText').text('Loading…');
            $('#searchSpinner').css('display', 'inline-block');

            $('#resultsSection').stop(true).fadeIn(300);

            if ($.fn.DataTable.isDataTable('#resultsTable')) {
                $('#resultsTable').DataTable().destroy();
                $('#resultsTable tbody').empty();
            }

            $('#resultsTable').DataTable({
                ajax: {
                    url: 'fetch_results.php',
                    data: { year: year, college: college, branch: branch },
                    dataSrc: 'data'
                },
                columns: [
                    { data: 'rollno' },
                    { data: 'rank',
                      render: function (d) { return '<span class="ee-rank-badge">' + d + '</span>'; }
                    },
                    { data: 'cand_name' },
                    { data: 'gender',
                      render: function (d) {
                          const icon = (d === 'M' || d === 'Male') ? '♂' : '♀';
                          return icon + ' ' + d;
                      }
                    },
                    { data: 'region' },
                    { data: 'category' },
                    { data: 'seat_category',
                      render: function (d) { return '<span class="ee-cat-pill">' + d + '</span>'; }
                    }
                ],
                order: [[1, 'asc']],
                pageLength: 25,
                responsive: true,
                scrollX: false,
                language: {
                    processing: '<div style="padding:1rem;color:#476966;font-family:DM Sans,sans-serif;font-size:.88rem;">Loading allotment data…</div>',
                    search: '',
                    searchPlaceholder: 'Search candidates…',
                    lengthMenu: 'Show _MENU_ per page',
                    zeroRecords: '<div style="text-align:center;padding:2.5rem 1rem;color:#94b8b4;font-family:DM Sans,sans-serif;">🔍 No allotment records found for this selection.</div>'
                },
                initComplete: function (settings, json) {
                    const count = json && json.data ? json.data.length : 0;
                    $('#resultsCount').text(count.toLocaleString());
                    const yearText   = $('#year option:selected').text();
                    const branchText = $('#branch option:selected').text();
                    $('#resultsSubtitle').text(branchText + ' · ' + yearText + ' · sorted by rank');

                    $btn.prop('disabled', false);
                    $('#searchBtnText').text('Show Allotment Data');
                    $('#searchSpinner').css('display', 'none');

                    setStep(4);
                    if (json && json.data) updateVisualInsights(json.data);

                    if (window.innerWidth < 768) {
                        $('html, body').animate({ scrollTop: $('#resultsSection').offset().top - 16 }, 400);
                    }
                }
            });
        });

        /* ── Charts ────────────────────────────────── */
        let genderChart = null, categoryChart = null;

        function clearCharts() {
            if (genderChart)   { genderChart.destroy();   genderChart   = null; }
            if (categoryChart) { categoryChart.destroy(); categoryChart = null; }
            $('#totalSeats, #topRank, #closingRank').text('-');
            $('#categoryRanksTable tbody').empty();
        }

        function updateVisualInsights(rows) {
            clearCharts();
            if (!rows || rows.length === 0) return;

            const ranks = rows.map(r => parseInt(r.rank)).filter(Boolean);
            $('#totalSeats').text(rows.length.toLocaleString());
            $('#topRank').text(Math.min(...ranks).toLocaleString());
            $('#closingRank').text(Math.max(...ranks).toLocaleString());

            const COLORS = ['#25ebd7','#f59e0b','#10b981','#ef4444','#5cf6e7'];

            const gCount = {};
            rows.forEach(r => { gCount[r.gender] = (gCount[r.gender] || 0) + 1; });
            genderChart = new Chart(document.getElementById('genderChart'), {
                type: 'doughnut',
                data: {
                    labels: Object.keys(gCount),
                    datasets: [{ data: Object.values(gCount), backgroundColor: COLORS, borderWidth: 2, borderColor: '#fff', hoverBorderWidth: 0 }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false, cutout: '65%',
                    plugins: { legend: { position: 'bottom', labels: { font: { family: 'DM Sans', size: 12 }, padding: 12 } } }
                }
            });

            const catCount = {};
            rows.forEach(r => { catCount[r.seat_category] = (catCount[r.seat_category] || 0) + 1; });
            categoryChart = new Chart(document.getElementById('categoryChart'), {
                type: 'bar',
                data: {
                    labels: Object.keys(catCount),
                    datasets: [{
                        label: 'Seats',
                        data: Object.values(catCount),
                        backgroundColor: Object.keys(catCount).map((_, i) => COLORS[i % COLORS.length] + 'cc'),
                        borderRadius: 6,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#f1f9f8' }, ticks: { font: { family: 'DM Sans', size: 11 }, stepSize: 1 } },
                        x: { grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 11 } } }
                    }
                }
            });

            const catClose = {};
            rows.forEach(r => {
                const rk = parseInt(r.rank);
                if (!catClose[r.seat_category] || rk > catClose[r.seat_category]) catClose[r.seat_category] = rk;
            });
            const $tbody = $('#categoryRanksTable tbody').empty();
            Object.entries(catClose).sort((a, b) => a[1] - b[1]).forEach(([cat, rank]) => {
                $tbody.append('<tr><td>' + cat + '</td><td class="ee-rank-hl">' + rank.toLocaleString() + '</td></tr>');
            });

            $('#visualInsights').stop(true).fadeIn(400);
        }

    }); // end ready
    