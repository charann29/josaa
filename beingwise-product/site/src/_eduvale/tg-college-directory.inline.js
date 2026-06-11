
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

    $(document).ready(function() {

      // Test if filter chips exist
      setTimeout(() => {
        const chips = $('.filter-chip');
      }, 1000);

      // College Directory App
      const CollegeDirectory = {
        allColleges: [], // Area to districts mapping
        areaMapping: {
          'HYDERABAD_AREA': ['MEDAK', 'RANGAREDDY', 'SANGAREDDY', 'HYDERABAD', 'MEDCHAL', 'YADADRI BHUVANAGIRI'],
          'KHAMMAM_AREA': ['BHADRADRI KOTHAGUDEM', 'KHAMMAM'],
          'WARANGAL_AREA': ['HANAMKONDA', 'WARANGAL', 'JANGAON'],
          'KARIMNAGAR_AREA': ['JAGTIAL', 'KARIMNAGAR', 'MANCHERIAL', 'PEDDAPALLI', 'RAJANNA SIRICILLA', 'SIDDIPET'],
          'MAHABUBNAGAR_AREA': ['MAHABUBNAGAR', 'WANAPARTHY'],
          'NALGONDA_AREA': ['NALGONDA', 'SURYAPET'],
          'NIZAMABAD_AREA': ['NIZAMABAD']
        },

        // Helper function to get display name for area
        getAreaDisplayName(areaCode) {
          return areaCode.replace('_AREA', ' AREA');
        },

        // Initialize the app
        init() {
          this.bindEvents();
          this.loadColleges();
          // Note: URL filters will be loaded after colleges are loaded and UI is ready
        },
        saveFilterState() {
          const filterState = {
            exam: $('.filter-chip[data-filter="exam"].active').data('value'),
            education: $('.filter-chip[data-filter="education"].active').data('value'),
            college_type: $('.filter-chip[data-filter="college_type"].active').data('value'),
            fee: $('#feeFilter').val(),
            districts: $('#districtFilter').val()
          };
          localStorage.setItem('collegeDirectoryFilters', JSON.stringify(filterState));
        },
        loadFilterState() {
          try {
            const savedState = localStorage.getItem('collegeDirectoryFilters');
            if (savedState) {
              const filterState = JSON.parse(savedState);

              // Restore exam filter (safely with default)
              const examValue = filterState.exam || 'all';
              $(`.filter-chip[data-filter="exam"]`).removeClass('active');
              $(`.filter-chip[data-filter="exam"][data-value="${examValue}"]`).addClass('active');
              // Restore education filter (safely with default)
              const educationValue = filterState.education || 'all';
              $(`.filter-chip[data-filter="education"]`).removeClass('active');
              $(`.filter-chip[data-filter="education"][data-value="${educationValue}"]`).addClass('active');

              // Restore college type filter (safely with default)
              const collegeTypeValue = filterState.college_type || 'all';
              $(`.filter-chip[data-filter="college_type"]`).removeClass('active');
              $(`.filter-chip[data-filter="college_type"][data-value="${collegeTypeValue}"]`).addClass('active');

              // Restore fee filter
              if (filterState.fee) {
                $('#feeFilter').val(filterState.fee);
              }

              // Restore district selection with retry mechanism
              if (filterState.districts && filterState.districts.length > 0) {
                const setDistrictValues = (attempts = 0) => {
                  // Try to get tomSelect instance
                  const tomSelect = $('#districtFilter')[0]?.tomselect || this.districtTomSelect;

                  if (tomSelect) {
                    try {
                      // Clear first to avoid issues
                      tomSelect.clear();

                      // Wait a bit before setting values
                      setTimeout(() => {
                        tomSelect.setValue(filterState.districts);
                      }, 50);
                    } catch (err) {
                      // Silent error handling
                    }
                  } else if (attempts < 5) {
                    // Retry a few times with increasing delay
                    setTimeout(() => setDistrictValues(attempts + 1), 100 * (attempts + 1));
                  }
                };

                // Start trying to set values
                setDistrictValues();
              }

              // Apply filters after a delay to ensure all filters are set
              setTimeout(() => {
                this.applyFilters();
                this.updateFilterCount();
              }, 300);
            }
          } catch (e) {
            // If error, reset to defaults
            this.resetFilters();
          }
        },

        async loadColleges() {
          try {
            this.showSkeletonLoading(); // Show skeleton instead of basic loading

            const response = await fetch('api/get_all_colleges.php');

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
              this.allColleges = data.data;
              this._originalColleges = [...this.allColleges];
              this.assignOriginalRanks();
              this.renderColleges();
              // Only load filters after data is loaded
              if (window.location.search) {
                this.loadFiltersFromURL();
              } else {
                this.loadFilterState();
              }
            } else {
              throw new Error(data.error || 'Failed to load colleges');
            }
          } catch (error) {
            // Enhanced error state with retry option
            $('#collegesGrid').html(`
              <div class="loading-state">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                <p><strong>Unable to load colleges</strong></p>
                <p style="color: #6b7280; margin-top: 0.5rem;">Please check your connection and try again</p>
                <button class="filter-btn primary" onclick="CollegeDirectory.loadColleges()" style="margin-top: 1rem;">
                  🔄 Retry Loading
                </button>
              </div>
            `);
            // Fallback to show a few sample colleges for demo
            this.loadSampleData();
          }
        }, // Fallback sample data for testing
        loadSampleData() {
          this.allColleges = [{
              college_code: 'OUCESF',
              name: 'University College of Engineering, Osmania University',
              location: 'Hyderabad',
              district_name: 'Hyderabad',
              district_code: 'HYD',
              type: 'University',
              co_education: 'CO-ED',
              fee: 25000,
              affiliated_to: 'Osmania University',
              established_year: 1929,
              naac_grade: 'A+',
              nba_accreditation: 'Y',
              nirf_rank: '15',
              overall_score: 95.5,
              grade: 'A++',
              eamcet_available: 'Y',
              ecet_available: 'N'
            },
            {
              college_code: 'JNTU01',
              name: 'JNTUH College of Engineering',
              location: 'Hyderabad',
              district_name: 'Hyderabad',
              district_code: 'HYD',
              type: 'Government Autonomous',
              co_education: 'CO-ED',
              fee: 30000,
              affiliated_to: 'JNTUH',
              established_year: 1965,
              naac_grade: 'A',
              nba_accreditation: 'Y',
              nirf_rank: '25',
              overall_score: 92.0,
              grade: 'A+',
              eamcet_available: 'Y',
              ecet_available: 'Y'
            },
            {
              college_code: 'WOCOLL',
              name: 'Women\'s Engineering College',
              location: 'Hyderabad',
              district_name: 'Hyderabad',
              district_code: 'HYD',
              type: 'Private College',
              co_education: 'GIRLS',
              fee: 45000,
              affiliated_to: 'JNTUH',
              established_year: 1990,
              naac_grade: 'B+',
              nba_accreditation: 'Y',
              nirf_rank: '35',
              overall_score: 85.0,
              grade: 'A',
              eamcet_available: 'Y',
              ecet_available: 'Y'
            },
            {
              college_code: 'PRVUNI',
              name: 'Modern Private University',
              location: 'Medak',
              district_name: 'MEDAK',
              district_code: 'MDK',
              type: 'Private University',
              co_education: 'CO-ED',
              fee: 85000,
              affiliated_to: 'Self',
              established_year: 2010,
              naac_grade: 'B',
              nba_accreditation: 'N',
              nirf_rank: '70',
              overall_score: 78.5,
              grade: 'B+',
              eamcet_available: 'Y',
              ecet_available: 'Y'
            }
          ];

          // CRITICAL FIX: Set original colleges backup immediately after loading sample data
          this._originalColleges = [...this.allColleges]; // Assign original ranks to sample data
          this.assignOriginalRanks();
          this.renderColleges();
        },

        // Assign original ranks to preserve ranking across filters and sorting
        assignOriginalRanks() {
          const skipRankCodes = ['JNTHMT', 'OUCESF', 'OUCTSF', 'OUCT', 'KUWLSF', 'KUCESF'];
          let rank = 1;

            this.allColleges.forEach(college => {
            
                if (
                    college.eamcet_available !== 'Y' &&
                    college.ecet_available !== 'Y'
                ) {
                    college.originalRank = null;
                    return;
                }
            
                college.originalRank = rank;
                rank++;
            });
            
        },
        // Bind event handlers
        bindEvents() {
          // College details modal
          $(document).on('click', '.btn-details', (e) => {
            const code = $(e.target).data('code');
            this.showCollegeDetails(code);
          });

          // Floating filter button
          $('#floatingFilterBtn').click(() => {
            this.openFilterModal();
          });
          // Filter modal close handlers
          $('#filterModalClose').click((e) => {
            e.preventDefault();
            e.stopPropagation();
            this.closeFilterModal();
          });

          $('#filterModalOverlay').click((e) => {
            if (e.target === e.currentTarget) {
              this.closeFilterModal();
            }
          });
          // Prevent modal from closing when clicking inside the modal content
          // but allow filter chip events to bubble through
          $('#filterModal').click((e) => {
            // Don't stop propagation for filter chips - let them handle their own events
            if (!$(e.target).hasClass('filter-chip') && !$(e.target).closest('.filter-chip').length) {
              e.stopPropagation();
            }
          });

          // ESC key to close modal
          $(document).keydown((e) => {
            if (e.key === 'Escape' && $('#filterModal').hasClass('show')) {
              this.closeFilterModal();
            }
          }); // Apply filters button
          $('#applyFiltersBtn').click(() => {
            this.applyFilters();
            this.updateFilterCount();
            this.closeFilterModal();
          });

          // Reset filters button (modal button) - Direct handler like Apply button
          $('#resetFiltersBtn').click(() => {
            this.resetFilters();
          });

          // Reset filters button (inline buttons) - Event delegation for dynamically added buttons
          $(document).on('click', '.reset-filters-inline', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.resetFilters();
          }); // FIXED: Single, reliable filter chip event handler
          $(document).on('click', '.filter-chip', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const $chip = $(this);
            const filterType = $chip.data('filter');
            const value = $chip.data('value'); // Validate filter data
            if (!filterType || value === undefined) {
              return;
            }

            // Toggle active state for chips in the same group
            $(`.filter-chip[data-filter="${filterType}"]`).removeClass('active');
            $chip.addClass('active');

            // Apply filters immediately with error handling
            try {
              CollegeDirectory.applyFilters();
              CollegeDirectory.updateFilterCount();
            } catch (error) {
              // Try to recover by resetting filters
              setTimeout(() => {
                CollegeDirectory.resetFilters();
              }, 100);
            }
          }); // Fee and district filter changes with better error handling
          $('#feeFilter, #districtFilter').on('change', function() {
            try {
              CollegeDirectory.applyFilters();
              CollegeDirectory.updateFilterCount();
            } catch (error) {
              // Silent error handling - try to reset filters if there's an issue
            }
          });

          // Initialize Tom Select for district filter
          try {
            const tomSelect = new TomSelect('#districtFilter', {
              plugins: ['remove_button'],
              placeholder: 'Choose districts or select entire regions...',
              optgroupField: 'optgroup',
              render: {
                option: function(data) {
                  // Add special class for "All" region options
                  const isRegionAll = data.value && data.value.startsWith('_') && data.value.endsWith('_all');
                  if (isRegionAll) {
                    return `<div class="option region-all-option">
                                    <i class="bi bi-check-all"></i> ${data.text}
                                </div>`;
                  }
                  return `<div class="option">${data.text}</div>`;
                },
                item: function(data) {
                  // Hide "All Region" options from the selected items display
                  const isRegionAll = data.value && data.value.startsWith('_') && data.value.endsWith('_all');
                  if (isRegionAll) {
                    return '<div style="display:none;"></div>'; // Hide these items
                  }
                  return `<div class="item">${data.text}</div>`;
                }
              },
              onInitialize: function() {
                // Store reference to tomSelect in CollegeDirectory
                CollegeDirectory.districtTomSelect = this;
                // Only update filter count here, do not load filters from URL
                setTimeout(() => {
                  CollegeDirectory.updateFilterCount();
                }, 200);
              },
              /**
               * Smart District Selection Logic - IMPROVED VERSION
               * 
               * This onChange handler implements the smart selection behavior for district filter:
               * 1. When "All [Region]" is selected, it automatically selects all districts in that region
               * 2. When individual districts are selected, it removes "All [Region]" selection
               * 3. When "All [Region]" is removed, it removes all districts in that region
               * 
               * "All [Region]" options are identified by their special value format: _regionname_all
               * These options are hidden from the selected items display for a cleaner UI
               */
              onChange: function(values) {
                try {
                  if (!Array.isArray(values)) {
                    values = values ? [values] : [];
                  }

                  // Track selection changes by comparing with previous state
                  const previousValues = this.previousValues || [];
                  this.previousValues = [...values];

                  // Identify what was added or removed since last change
                  const added = values.filter(v => !previousValues.includes(v));
                  const removed = previousValues.filter(v => !values.includes(v));

                  // Working copy of values that will be modified based on smart selection logic
                  let finalValues = [...values];
                  let needUpdate = false;

                  // CASE 1: "All Region" option was selected
                  if (added.length) {
                    // Filter for any "All Region" options that were just added
                    const regionAllAdded = added.filter(v => v && v.startsWith('_') && v.endsWith('_all'));

                    if (regionAllAdded.length > 0) {
                      // Process each "All Region" option that was added
                      regionAllAdded.forEach(regionAll => {
                        // Extract region name from the value (e.g., "_hyderabad_all" → "hyderabad")
                        const region = regionAll.replace('_', '').replace('_all', '');

                        // Get all individual districts under this region
                        const districtOptions = [];
                        $(`optgroup[data-region="${region}"] option:not(.region-all)`).each(function() {
                          const optVal = $(this).val();
                          if (optVal) districtOptions.push(optVal);
                        });

                        // Remove the "All Region" option from final values (hide it from selection)
                        finalValues = finalValues.filter(v => v !== regionAll);

                        // Add all individual districts from this region instead
                        districtOptions.forEach(district => {
                          if (!finalValues.includes(district)) {
                            finalValues.push(district);
                          }
                        });

                        needUpdate = true;
                      });
                    }

                    // CASE 2: Individual district was selected after "All Region"
                    const individualDistricts = added.filter(v => v && (!v.startsWith('_') || !v.endsWith('_all')));

                    if (individualDistricts.length > 0) {
                      individualDistricts.forEach(district => {
                        // Find which region this district belongs to
                        let belongsToRegion = null;
                        $('optgroup[data-region]').each(function() {
                          const region = $(this).data('region');
                          if ($(this).find(`option[value="${district}"]`).length) {
                            belongsToRegion = region;
                            return false; // Break the loop
                          }
                        });

                        if (belongsToRegion) {
                          const regionAllValue = `_${belongsToRegion}_all`;

                          // Remove region "All" option if present (individual selection overrides "All")
                          if (finalValues.includes(regionAllValue)) {
                            finalValues = finalValues.filter(v => v !== regionAllValue);
                            needUpdate = true;
                          }
                        }
                      });
                    }
                  }

                  // CASE 3: "All Region" option was manually removed
                  if (removed.length) {
                    const regionAllRemoved = removed.filter(v => v && v.startsWith('_') && v.endsWith('_all'));

                    if (regionAllRemoved.length > 0) {
                      regionAllRemoved.forEach(regionAll => {
                        const region = regionAll.replace('_', '').replace('_all', '');

                        // Get all individual districts under this region
                        const districtOptions = [];
                        $(`optgroup[data-region="${region}"] option:not(.region-all)`).each(function() {
                          const optVal = $(this).val();
                          if (optVal) districtOptions.push(optVal);
                        });

                        // Remove all district options from this region
                        districtOptions.forEach(district => {
                          finalValues = finalValues.filter(v => v !== district);
                        });

                        needUpdate = true;
                      });
                    }
                  }

                  // Update the selection if needed
                  if (needUpdate) {
                    this.previousValues = [...finalValues];
                    this.setValue(finalValues, true);
                    return; // Exit early to prevent recursive calls
                  }

                  // Apply filters and update count with a small delay to prevent race conditions
                  clearTimeout(this.filterTimeout);
                  this.filterTimeout = setTimeout(() => {
                    try {
                      CollegeDirectory.applyFilters();
                      CollegeDirectory.updateFilterCount();
                    } catch (error) {
                      // Silent error handling
                    }
                  }, 100);
                } catch (error) {
                  // Silent error handling
                }
              }
            });

            // Store reference to tomSelect
            this.districtTomSelect = tomSelect;

            // Handle "Reset All Districts" click
            $('#allDistrictsReset').on('click', (e) => {
              e.preventDefault();
              if (tomSelect) {
                tomSelect.clear();
              }
              CollegeDirectory.applyFilters();
              CollegeDirectory.updateFilterCount();
            });
          } catch (e) {
            // Silent error handling for Tom Select initialization
          }
        }, // Open filter modal
        openFilterModal() {
          $('#filterModalOverlay').addClass('show');
          $('#filterModal').addClass('show');
          $('body').addClass('modal-open');

          // Enhanced mobile support
          if (window.innerWidth <= 768) {
            // Prevent body scrolling on mobile
            document.body.style.position = 'fixed';
            document.body.style.top = `-${window.scrollY}px`;
            document.body.style.width = '100%';

            // Ensure modal layout and scrolling work properly
            setTimeout(() => {
              const modal = document.querySelector('.filter-modal');
              const modalBody = document.querySelector('.filter-modal-body');
              const modalFooter = document.querySelector('.filter-modal-footer');

              if (modal && modalBody && modalFooter) {
                // Force layout calculation
                modal.offsetHeight;

                // Ensure proper scroll setup
                modalBody.scrollTop = 0;

                // Small delay to ensure smooth scrolling activation
                setTimeout(() => {
                  // Touch scroll behavior activation
                  modalBody.style.transform = 'translateZ(0)';
                  modalBody.scrollTop = 1;
                  modalBody.scrollTop = 0;

                  // Ensure footer is visible by checking scroll height
                  const scrollHeight = modalBody.scrollHeight;
                  const clientHeight = modalBody.clientHeight;
                  if (scrollHeight > clientHeight) {
                    // Content is scrollable - ensure footer is accessible
                    modalBody.style.paddingBottom = '1rem';
                  }
                }, 100);
              }
            }, 150);
          }

          // Focus management for accessibility (after layout is stable)
          setTimeout(() => {
            $('#filterModalClose').focus();
          }, 300);
        },

        // Close filter modal
        closeFilterModal() {
          $('#filterModalOverlay').removeClass('show');
          $('#filterModal').removeClass('show');
          $('body').removeClass('modal-open');

          // Restore body scrolling on mobile
          if (window.innerWidth <= 768) {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
          }

          // Return focus to floating button
          $('#floatingFilterBtn').focus();
        },
        updateFilterCount() {
          let count = 0;

          // Count active exam filters
          if ($('.filter-chip[data-filter="exam"].active').data('value') !== 'all') count++;

          // Count active education filters
          if ($('.filter-chip[data-filter="education"].active').data('value') !== 'all') count++;

          // Count active college type filters
          if ($('.filter-chip[data-filter="college_type"].active').data('value') !== 'all') count++;

          // Count fee filter
          if ($('#feeFilter').val() !== 'all') count++;

          // Count district filters
          const districts = $('#districtFilter').val();
          if (districts && districts.length > 0) count++; // Update floating filter button badge
          $('#floatingFilterBtn').attr('data-filter-count', count);

          // Update filter status summary
          const $filterStatus = $('#filterStatusSummary');
          const $filterText = $filterStatus.find('.filter-status-text');

          if (count > 0) {
            // Build filter summary text
            const filterParts = [];

            // Add exam filter
            const examFilter = $('.filter-chip[data-filter="exam"].active').data('value');
            if (examFilter !== 'all') {
              filterParts.push(examFilter === 'eamcet' ? 'EAPCET' : 'ECET');
            }

            // Add education filter
            const educationFilter = $('.filter-chip[data-filter="education"].active').data('value');
            if (educationFilter !== 'all') {
              filterParts.push("Women's Only");
            }

            // Add college type filter
            const collegeType = $('.filter-chip[data-filter="college_type"].active').data('value');
            if (collegeType !== 'all') {
              const types = {
                'government': 'Government',
                'autonomous': 'Autonomous',
                'private_university': 'Private University',
                'private_college': 'Private College'
              };
              filterParts.push(types[collegeType]);
            }

            // Add fee filter
            const feeFilter = $('#feeFilter').val();
            if (feeFilter !== 'all') {
              filterParts.push(`Under ₹${parseInt(feeFilter).toLocaleString()}`);
            }

            // Add districts filter
            const districts = $('#districtFilter').val();
            if (districts && districts.length > 0) {
              const areaNames = districts
                .filter(d => !d.startsWith('_') && !d.endsWith('_all'))
                .map(area => this.getAreaDisplayName(area));
              if (areaNames.length > 0) {
                filterParts.push(`${areaNames.join(', ')}`);
              }
            }

            // Construct final text
            const finalText = `Showing ${this.filteredColleges ? this.filteredColleges.length : this.allColleges.length} colleges - ${filterParts.join(' • ')}`;
            $filterText.text(finalText);
            $filterStatus.fadeIn(200);
          } else {
            $filterStatus.fadeOut(200);
          }

          // Save filter state
          this.saveFilterState();

          // Update URL with current filter state
          this.updateURLFromFilters();
        },
        applyFilters() {
          // CRITICAL FIX: Always ensure we have original data to filter from
          if (!this._originalColleges || this._originalColleges.length === 0) {
            if (this.allColleges && this.allColleges.length > 0) {
              this._originalColleges = [...this.allColleges];
            } else {
              return;
            }
          }

          // Get current filter values with better error handling
          const selectedExam = $('.filter-chip[data-filter="exam"].active').data('value') || 'all';
          const selectedEducation = $('.filter-chip[data-filter="education"].active').data('value') || 'all';
          const selectedCollegeType = $('.filter-chip[data-filter="college_type"].active').data('value') || 'all';
          const selectedFee = $('#feeFilter').val() || 'all';
          let selectedDistricts = $('#districtFilter').val() || [];

          // Update SEO titles first
          if (window.seoTitleGenerator) {
            window.seoTitleGenerator.updatePageMetadata({
              exam: selectedExam,
              education: selectedEducation,
              college_type: selectedCollegeType,
              fee: selectedFee,
              districts: selectedDistricts
            });
          }

          // Ensure selectedDistricts is an array
          if (!Array.isArray(selectedDistricts)) {
            selectedDistricts = selectedDistricts ? [selectedDistricts] : [];
          }

          // Process region-based district selection
          const regionsToInclude = [];
          const processedDistricts = [];

          selectedDistricts.forEach(district => {
            if (district && district.startsWith('_') && district.endsWith('_all')) {
              // This is a region "All" option
              const region = district.replace('_', '').replace('_all', '');
              regionsToInclude.push(region);
            } else if (district) {
              processedDistricts.push(district);
            }
          });

          // Get all individual districts for selected regions
          if (regionsToInclude.length > 0) {
            regionsToInclude.forEach(region => {
              $(`optgroup[data-region="${region}"] option:not(.region-all)`).each(function() {
                const districtValue = $(this).val();
                if (districtValue && !processedDistricts.includes(districtValue)) {
                  processedDistricts.push(districtValue);
                }
              });
            });
          }

          // FIXED: Always filter from original data source
          const filteredColleges = this._originalColleges.filter(college => {
            try {
                // Exam filter
                if (selectedExam === 'all') {
                    // Show only colleges that accept EAMCET or ECET
                    if (
                        college.eamcet_available !== 'Y' &&
                        college.ecet_available !== 'Y'
                    ) {
                        return false;
                    }
                } else {
                    if (selectedExam === 'eamcet' && college.eamcet_available !== 'Y') {
                        return false;
                    }
                
                    if (selectedExam === 'ecet' && college.ecet_available !== 'Y') {
                        return false;
                    }
                }

              // Education/Gender filter
              if (selectedEducation === 'womens' && college.co_education !== 'GIRLS') return false;

              // College Type filter
              if (selectedCollegeType !== 'all') {
                const collegeType = college.type || '';

                if (selectedCollegeType === 'government') {
                  // Include: University, Government (SF), Government, Government Autonomous
                  if (!['University', 'Government (SF)', 'Government', 'Government Autonomous'].includes(collegeType)) {
                    return false;
                  }
                } else if (selectedCollegeType === 'autonomous') {
                  // Include: Autonomous, Private University, University, Government Autonomous
                  if (!['Autonomous', 'Private University', 'University', 'Government Autonomous'].includes(collegeType)) {
                    return false;
                  }
                } else if (selectedCollegeType === 'private_university') {
                  // Include only: Private University
                  if (collegeType !== 'Private University') {
                    return false;
                  }
                } else if (selectedCollegeType === 'private_college') {
                  // Include only: Private College
                  if (collegeType !== 'Private College') {
                    return false;
                  }
                }
              }

              // Fee filter
              if (selectedFee !== 'all') {
                const feeLimit = parseInt(selectedFee);
                if (isNaN(feeLimit) || !college.fee || college.fee > feeLimit) return false;
              } // Area filter
              if (selectedDistricts.length > 0) {
                const collegeDist = college.district_name ? college.district_name.toUpperCase() : '';
                // Check if college's district is in any of the selected areas
                const isInSelectedArea = selectedDistricts.some(area =>
                  this.areaMapping[area]?.includes(collegeDist)
                );
                if (!isInSelectedArea) return false;
              }
              return true;
            } catch (error) {
              return true; // Include college if there's an error
            }
          });

          // CRITICAL FIX: Create a new filtered copy for display, keep original intact
          this.filteredColleges = filteredColleges;
          this.renderFilteredColleges();

          // Show "no results" message if no colleges match the filters
          if (filteredColleges.length === 0) {
            $('#collegesGrid').html(`
              <div class="no-results">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                <p><strong>No colleges match your filters</strong></p>
                <p style="color: #6b7280; margin-top: 0.5rem;">Try changing or removing some filters</p>
                <button class="filter-btn primary reset-filters-inline" style="margin-top: 1rem;">
                  🔄 Reset Filters
                </button>
              </div>            `);
          }
        },

        // NEW METHOD: Render filtered colleges without modifying original data
        renderFilteredColleges() {
          const grid = $('#collegesGrid');
          const collegesToRender = this.filteredColleges || this.allColleges;

          if (collegesToRender.length === 0) {
            grid.html(`
              <div class="loading-state">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                <p><strong>No colleges available</strong></p>
                <p style="color: #6b7280; margin-top: 0.5rem;">Please try again later</p>
              </div>
            `);
            return;
          }

          // Generate HTML for colleges using the existing structure
          let html = '';
          const tileGradients = [
            'tile-gradient-1', 'tile-gradient-2', 'tile-gradient-3', 'tile-gradient-4', 'tile-gradient-5',
            'tile-gradient-6', 'tile-gradient-7', 'tile-gradient-8', 'tile-gradient-9', 'tile-gradient-10'
          ];
          const skipRankCodes = ['JNTHMT', 'OUCESF', 'OUCTSF', 'OUCT', 'KUWLSF', 'KUCESF'];

          collegesToRender.forEach((college, index) => {
            const colorClass = tileGradients[index % tileGradients.length];
            const skipRank = skipRankCodes.includes(college.college_code);

            // Use the original rank from when colleges were first loaded
            const originalRank = skipRank ? '' : college.originalRank;

            const collegeHtml = this.generateCollegeCard(college, colorClass, originalRank);
            html += collegeHtml;
          });

          grid.html(html);
        }, // Reset all filters to default - FIXED VERSION
        resetFilters() {
          // Show loading state briefly for feedback
          const $grid = $('#collegesGrid');
          $grid.html(`
            <div class="loading-state">
              <div class="loading-spinner"></div>
              <p>Resetting filters...</p>
            </div>
          `);

          // Reset exam filter
          $(`.filter-chip[data-filter="exam"]`).removeClass('active');
          $(`.filter-chip[data-filter="exam"][data-value="all"]`).addClass('active');

          // Reset education filter
          $(`.filter-chip[data-filter="education"]`).removeClass('active');
          $(`.filter-chip[data-filter="education"][data-value="all"]`).addClass('active');

          // Reset college type filter
          $(`.filter-chip[data-filter="college_type"]`).removeClass('active');
          $(`.filter-chip[data-filter="college_type"][data-value="all"]`).addClass('active');

          // Reset fee filter
          $('#feeFilter').val('all');

          // Reset district filter
          try {
            if (this.districtTomSelect) {
              this.districtTomSelect.clear();
            } else {
              const tomSelect = $('#districtFilter')[0]?.tomselect;
              if (tomSelect) {
                tomSelect.clear();
              }
            }
          } catch (e) {
            // Fallback: try to clear via jQuery
            $('#districtFilter').val([]).trigger('change');
          }

          // CRITICAL FIX: Clear filtered colleges and show all original data
          this.filteredColleges = null;

          // Ensure original colleges are available
          if (this._originalColleges && this._originalColleges.length > 0) {
            // Render all original colleges
            this.renderColleges();
          } else {
            // If no backup exists, reload from API or sample data
            this.loadColleges();
            return; // Exit early as loadColleges will handle rendering
          } // Clear localStorage filters
          localStorage.removeItem('collegeDirectoryFilters');

          // Clear URL parameters
          const url = new URL(window.location);
          url.search = '';
          window.history.replaceState(null, '', url.pathname);

          // Update filter count (should be 0)
          this.updateFilterCount(); // Close modal if open
          this.closeFilterModal();

          // Apply the reset with a small delay for feedback
          setTimeout(() => {
            this.applyFilters();
            this.updateFilterCount();
          }, 500);
        },

        // Show enhanced loading state
        showLoadingState() {
          const grid = $('#collegesGrid');
          grid.html(`
            <div class="loading-state">
              <div class="loading-spinner"></div>
              <p>Loading colleges...</p>
            </div>
          `);
        },

        // Show skeleton loading for better UX
        showSkeletonLoading() {
          const grid = $('#collegesGrid');
          let skeletonHtml = '';
          for (let i = 0; i < 6; i++) {
            skeletonHtml += '<div class="skeleton-card"></div>';
          }
          grid.html(skeletonHtml);
        },

        // Render college cards
        renderColleges() {
          const grid = $('#collegesGrid');

          if (this.allColleges.length === 0) {
            grid.html(`
              <div class="loading-state">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                <p><strong>No colleges available</strong></p>
                <p style="color: #6b7280; margin-top: 0.5rem;">Please try again later</p>
              </div>
            `);
            return;
          }

          // Generate HTML for colleges using the existing structure
          let html = '';
          const tileGradients = [
            'tile-gradient-1', 'tile-gradient-2', 'tile-gradient-3', 'tile-gradient-4', 'tile-gradient-5',
            'tile-gradient-6', 'tile-gradient-7', 'tile-gradient-8', 'tile-gradient-9', 'tile-gradient-10'
          ];
          const skipRankCodes = ['JNTHMT', 'OUCESF', 'OUCTSF', 'OUCT', 'KUWLSF', 'KUCESF'];

          this.allColleges.forEach((college, index) => {
            const colorClass = tileGradients[index % tileGradients.length];
            const skipRank = skipRankCodes.includes(college.college_code);

            // Use the original rank from when colleges were first loaded
            const originalRank = skipRank ? '' : college.originalRank;

            const collegeHtml = this.generateCollegeCard(college, colorClass, originalRank);
            html += collegeHtml;
          });

          grid.html(html);
        },

        // Generate individual college card HTML
        generateCollegeCard(college, colorClass, rank) {
          const fee = college.fee ? college.fee.toLocaleString() : 'N/A';
          const naacDisplay = (college.naac_grade && college.naac_grade.toUpperCase() !== 'N') ? `NAAC "<b>${college.naac_grade}</b>" Grade` : 'No NAAC';
          const nbaDisplay = college.nba_accreditation === 'Y' ?
            '<i class="fas fa-check-circle tile-icon" aria-hidden="true"></i> NBA Accredited' :
            'No NBA';
          const feeDisplay = college.fee ?
            `<b>Fee </b><i class="fas fa-rupee-sign tile-icon" aria-hidden="true"></i> ${fee}` :
            'N/A';

          return `
            <div class="${colorClass} box">
              <!-- Desktop Layout -->
              <table class="college-table desktop-layout"><tbody>
                <tr>
                  ${rank ? `<td rowspan="3" class="rank-cell"><h2>${rank}</h2></td>` : '<td rowspan="3" class="rank-cell"></td>'}
                  <td colspan="4" class="college-name-cell"><h3>${college.name} [${college.college_code}]</h3></td>
                </tr>
                <tr>
                  <td class="info-cell"><p><b>Estd: </b><i class="fas fa-calendar tile-icon" aria-hidden="true"></i> ${college.established_year || 'N/A'}</p></td>
                  <td class="info-cell"><p><b>Affiliation: </b><i class="fas fa-university tile-icon" aria-hidden="true"></i> ${college.affiliated_to || 'N/A'}</p></td>
                  <td class="info-cell"><p><b>Type: </b>${college.type || 'N/A'}</p></td>
                  <td class="info-cell">
                    <p><i class="fas fa-map-marker-alt tile-icon" aria-hidden="true"></i> ${college.location || 'N/A'}, ${college.district_name || 'N/A'}</p>
                  </td>
                </tr>
                <tr>
                  <td class="grade-cell">${college.grade ? `<h3>${college.grade}</h3>` : ''}</td>
                  <td class="info-cell"><p>${nbaDisplay}</p></td>
                  <td class="info-cell"><p>${naacDisplay}</p></td>
                  <td class="info-cell"><p>${feeDisplay}</p></td>
                  <td class="button-cell"><button class="button btn btn-primary btn-sm btn-details" data-code="${college.college_code}" data-bs-toggle="modal" data-bs-target="#collegeDetailsModal">View More</button></td>
                </tr>
              </tbody></table>              <!-- Mobile Layout -->
              <table class="college-table mobile-layout" style="margin-bottom: 20px;"><tbody>
                <!-- Row 1: BeingWise Rank | College name [Code] -->
                <tr class="mobile-row">
                  <td class="rank-cell-mobile-clean">${rank ? `<div class="rank-display-clean"><h2>${rank}</h2><small>BeingWise Rank</small></div>` : '<div class="rank-display-clean"><span>--</span><small>BeingWise Rank</small></div>'}</td>
                  <td colspan="2" class="college-name-cell-mobile-clean"><h3>${college.name} [${college.college_code}]</h3></td>
                </tr>
                <!-- Row 2: BeingWise Rating | Type | Affiliation -->
                <tr class="mobile-row">
                  <td class="grade-cell-mobile-clean">${college.grade ? `<div class="grade-display-clean"><h3>${college.grade}</h3><small>BeingWise Rating</small></div>` : '<div class="grade-display-clean"><span>N/A</span><small>BeingWise Rating</small></div>'}</td>
                  <td class="info-cell-mobile-clean">
                    <p><b>Type:</b> ${college.type || 'N/A'}</p>
                  </td>
                  <td class="info-cell-mobile-clean">
                    <p><b>Affiliation:</b> <i class="fas fa-university tile-icon" aria-hidden="true"></i> ${college.affiliated_to || 'N/A'}</p>
                  </td>
                </tr>
                <!-- Row 3: Estd | Location | Fee -->
                <tr class="mobile-row">
                  <td class="info-cell-mobile-clean">
                    <p><b>Estd:</b> <i class="fas fa-calendar tile-icon" aria-hidden="true"></i> ${college.established_year || 'N/A'}</p>
                  </td>
                  <td class="info-cell-mobile-clean">
                    <p><b>Location:</b> <i class="fas fa-map-marker-alt tile-icon" aria-hidden="true"></i> ${college.location || 'N/A'}, ${college.district_name || 'N/A'}</p>
                  </td>
                  <td class="info-cell-mobile-clean">
                    <p><b>Fee:</b> <i class="fas fa-rupee-sign tile-icon" aria-hidden="true"></i> ${fee}</p>
                  </td>
                </tr>
                <!-- Row 4: NAAC | NBA | View More -->
                <tr class="mobile-row">
                  <td class="info-cell-mobile-clean">
                    <p><b>NAAC:</b> ${college.naac_grade || 'N/A'}</p>
                  </td>
                  <td class="info-cell-mobile-clean">
                    <p><b>NBA:</b> ${college.nba_accreditation === 'Y' ? '<i class="fas fa-check-circle" style="color: #10b981;"></i> Yes' : '<i class="fas fa-times-circle" style="color: #ef4444;"></i> No'}</p>
                  </td>
                  <td class="info-cell-mobile-clean">
                    <button class="button btn btn-primary btn-sm btn-details mobile-view-more-clean" data-code="${college.college_code}" data-bs-toggle="modal" data-bs-target="#collegeDetailsModal">View More</button>
                  </td>
                </tr>              </tbody></table>
            </div>
          `;
        },

        // Show college details modal
        showCollegeDetails(code) {
          $('#collegeDetailsContent').html('<div class="text-center py-5"><div class="spinner-border"></div></div>');

          $.get('get_college_details.php?college_code=' + code)
            .done(data => $('#collegeDetailsContent').html(data))
            .fail(() => $('#collegeDetailsContent').html('<div class="text-danger">Failed to load details.</div>'));
        }, // NEW: URL Parameter Management for Filter State        // Parse URL parameters and apply filters on page load
        loadFiltersFromURL() {
          try {
            const urlParams = new URLSearchParams(window.location.search);

            // Check if URL has search params
            if (!window.location.search) {
              this.renderColleges();
              return;
            }

            // Get filter parameters from URL
            const exam = urlParams.get('exam');
            const education = urlParams.get('education');
            const college_type = urlParams.get('college_type');
            const fee = urlParams.get('fee');

            // Handle districts with both array and comma-separated formats
            let districts;
            if (urlParams.getAll('districts[]').length > 0) {
              districts = urlParams.getAll('districts[]');
            } else if (urlParams.get('districts')) {
              districts = urlParams.get('districts').split(',').map(d => d.trim());
            }

            // Track if any filters were found in URL
            let hasURLFilters = false;

            // Apply exam filter
            if (exam && ['all', 'eamcet', 'ecet'].includes(exam)) {
              $(`.filter-chip[data-filter="exam"]`).removeClass('active');
              $(`.filter-chip[data-filter="exam"][data-value="${exam}"]`).addClass('active');
              hasURLFilters = true;
            }

            // Apply education filter
            if (education && ['all', 'womens'].includes(education)) {
              $(`.filter-chip[data-filter="education"]`).removeClass('active');
              $(`.filter-chip[data-filter="education"][data-value="${education}"]`).addClass('active');
              hasURLFilters = true;
            }

            // Apply college type filter
            if (college_type && ['all', 'government', 'autonomous', 'private_university', 'private_college'].includes(college_type)) {
              $(`.filter-chip[data-filter="college_type"]`).removeClass('active');
              $(`.filter-chip[data-filter="college_type"][data-value="${college_type}"]`).addClass('active');
              hasURLFilters = true;
            }

            // Apply fee filter
            if (fee && ['all', '50000', '75000', '100000', '125000', '160000'].includes(fee)) {
              $('#feeFilter').val(fee);
              hasURLFilters = true;
            }

            // Apply district filter - TomSelect should be ready now
            if (districts && districts.length > 0 && this.districtTomSelect) {
              try {
                // Validate districts exist in options
                const validDistricts = districts.filter(district =>
                  $(`#districtFilter option[value="${district}"]`).length > 0
                );

                if (validDistricts.length > 0) {
                  this.districtTomSelect.setValue(validDistricts);
                  hasURLFilters = true;
                }
              } catch (e) {
                console.error('Error setting district values:', e);
              }
            }

            // Apply filters if URL parameters were found
            if (hasURLFilters) {
              setTimeout(() => {
                this.applyFilters();
                this.updateFilterCount();
              }, 100);
            } else {
              this.renderColleges();
            }
          } catch (e) {
            console.error('Error loading filters from URL:', e);
            this.renderColleges();
          }
        },

        // Update URL parameters when filters change
        updateURLFromFilters() {
          try {
            const url = new URL(window.location);
            const params = url.searchParams;

            // Clear existing filter parameters
            params.delete('exam');
            params.delete('education');
            params.delete('college_type');
            params.delete('fee');
            params.delete('districts');
            params.delete('districts[]'); // Clear array format too

            // Get current filter values
            const selectedExam = $('.filter-chip[data-filter="exam"].active').data('value');
            const selectedEducation = $('.filter-chip[data-filter="education"].active').data('value');
            const selectedCollegeType = $('.filter-chip[data-filter="college_type"].active').data('value');
            const selectedFee = $('#feeFilter').val();
            let selectedDistricts = $('#districtFilter').val() || [];

            // Add non-default filters to URL
            if (selectedExam && selectedExam !== 'all') {
              params.set('exam', selectedExam);
            }

            if (selectedEducation && selectedEducation !== 'all') {
              params.set('education', selectedEducation);
            }

            if (selectedCollegeType && selectedCollegeType !== 'all') {
              params.set('college_type', selectedCollegeType);
            }

            if (selectedFee && selectedFee !== 'all') {
              params.set('fee', selectedFee);
            }

            // Handle districts - filter out region "all" options
            const validDistricts = (Array.isArray(selectedDistricts) ? selectedDistricts : [selectedDistricts])
              .filter(d => d && !d.startsWith('_') && !d.endsWith('_all'));

            if (validDistricts.length > 0) {
              // Add each district as a separate parameter
              validDistricts.forEach(district => {
                params.append('districts[]', district);
              });
            }

            // Update URL without reloading the page
            const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
            window.history.pushState({}, '', newUrl);

          } catch (e) {
            console.error('Error updating URL filters:', e);
          }
        },

        // ...existing code...
      }; // Initialize the app
      CollegeDirectory.init();
      window.CollegeDirectory = CollegeDirectory;
    });
  
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
