/**
 * PAC Live Data Calculator - Main UI Overlay
 *
 * Core overlay creation, drag/resize, and UI binding.
 * Uses PAC.UI.CSS from styles.js for styling.
 */
(function() {
  'use strict';

  // Shorthand references to namespace
  var Data = PAC.Data;
  var Utils = PAC.Utils;
  var State = PAC.State;
  var Calc = PAC.Calc;
  var state = PAC.State.state;

  // Local runtime variables
  var extractionInterval = null;
  var isMinimized = false;
  var currentPollSpeed = 500;
  var liveTrackingActive = false;
  var isConnected = false;
  var lastPoolData = null;
  var lastCurrentHash = '';
  var lastTeamFingerprint = '';

  // Local references to commonly used data
  var POKEMON_DATA = Data.POKEMON_DATA;
  var EVOLUTION_CHAINS = Data.EVOLUTION_CHAINS;
  var POKEMON_TO_BASE = Data.POKEMON_TO_BASE;
  var WILD_POKEMON = Data.WILD_POKEMON;
  var RARITY_INFO = Data.RARITY_INFO;
  var POOL_RARITIES = Data.POOL_RARITIES;
  var RARITY_COLORS = Data.RARITY_COLORS;
  var POOL_COPIES = Data.POOL_COPIES;
  var BASE_GAME_POOLS = Data.BASE_GAME_POOLS;
  var SHOP_ODDS = Data.SHOP_ODDS;
  var BASE_WILD_COUNTS = Data.BASE_WILD_COUNTS;
  var PVE_STAGES = Data.PVE_STAGES;

  // Local references to utility functions
  var getBaseForm = Utils.getBaseForm;
  var getEvolutionFamily = Utils.getEvolutionFamily;
  var isWildPokemon = Utils.isWildPokemon;
  var getEvolutionCost = Utils.getEvolutionCost;
  var getEvolutionData = Utils.getEvolutionData;
  var getEvolutionChain = Utils.getEvolutionChain;
  var isBaseForm = Utils.isBaseForm;
  var typesMatch = Utils.typesMatch;
  var identifyPokemonByTypesAndRarity = Utils.identifyPokemonByTypesAndRarity;
  var extractPokemonFromPanel = Utils.extractPokemonFromPanel;
  var detectActivePortalPokemon = Utils.detectActivePortalPokemon;
  var checkPokemonAvailability = Utils.checkPokemonAvailability;

  // Local references to state functions
  var saveRollHistory = State.saveRollHistory;
  var loadRollHistory = State.loadRollHistory;
  var clearRollHistory = State.clearRollHistory;
  var savePlayerName = State.savePlayerName;
  var loadPlayerName = State.loadPlayerName;
  var saveTeamTargets = State.saveTeamTargets;
  var loadTeamTargets = State.loadTeamTargets;

  // Local references to calculator functions
  var calculateWildCounts = Calc.calculateWildCounts;
  var calculateTotalPool = Calc.calculateTotalPool;
  var calculate = Calc.calculate;

  // Debug mode
  var DEBUG_MODE = PAC.DEBUG_MODE;

  // ═══════════════════════════════════════════════════════════════════════════
  // ROOM EXTRACTION (via page context injection)
  // ═══════════════════════════════════════════════════════════════════════════

  function injectExtractor() {
    // Inject into page context to access game state
    var script = document.createElement('script');
    script.src = chrome.runtime.getURL('content/extractor.js');
    script.onload = function() {
      if (DEBUG_MODE) console.log('🎮 PAC Calculator: Extractor loaded');
      this.remove();
    };
    script.onerror = function() {
      console.error('🎮 PAC Calculator: Failed to load extractor');
    };
    (document.head || document.documentElement).appendChild(script);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // POKEMON AUTOCOMPLETE COMPONENT
  // ═══════════════════════════════════════════════════════════════════════════

  function setupAutocomplete() {
    var input = document.getElementById('pacTargetPokemon');
    var dropdown = document.getElementById('pacAutocompleteDropdown');
    var errorMsg = document.getElementById('pacRarityError');

    var selectedPokemon = null;
    var debounceTimer; // OPTIMIZATION: Debounce timer

    // Filter on input WITH DEBOUNCE
    input.addEventListener('input', function(e) {
      clearTimeout(debounceTimer);

      debounceTimer = setTimeout(function() {
        var query = e.target.value.toUpperCase().trim();

        if (query.length < 2) {
          dropdown.classList.add('hidden');
          errorMsg.classList.add('hidden');
          return;
        }

        // Filter matches
        var matches = Object.entries(POKEMON_DATA)
          .filter(function(entry) { return entry[0].includes(query); })
          .slice(0, 15); // Limit to 15 results

        if (matches.length === 0) {
          dropdown.classList.add('hidden');
          errorMsg.textContent = 'No pokemon found matching "' + query + '"';
          errorMsg.classList.remove('hidden');
          return;
        }

        // Build dropdown
        dropdown.innerHTML = matches
          .map(function(entry) {
            var name = entry[0];
            var data = entry[1];
            var rarity = data.rarity || 'common';
            var info = RARITY_INFO[rarity] || { label: rarity, color: '#666' };
            var baseForm = getBaseForm(name);
            var isEvolved = baseForm !== name;
            var evolutionText = isEvolved ? ' <span style="color: #64b5f6; font-size: 10px;">(\u2190 ' + baseForm + ')</span>' : '';
            return '<div class="pac-dropdown-item" data-name="' + name + '" data-rarity="' + rarity + '" data-baseform="' + baseForm + '">' +
              '<span class="pac-pokemon-name">' + name + evolutionText + '</span>' +
              '<span class="pac-pokemon-rarity" style="background: ' + info.color + '; color: ' + (rarity === 'legendary' || rarity === 'uncommon' ? '#000' : '#fff') + '">' + info.label + '</span>' +
            '</div>';
          }).join('');

        dropdown.classList.remove('hidden');
        errorMsg.classList.add('hidden');

        // Position dropdown to the right of the selector container
        var selectorRect = input.closest('.pac-pokemon-selector').getBoundingClientRect();
        var panelRect = document.getElementById('pac-calc-overlay').getBoundingClientRect();
        dropdown.style.top = selectorRect.top + 'px';
        dropdown.style.left = (panelRect.right + 8) + 'px';
        dropdown.style.maxHeight = Math.min(400, window.innerHeight - selectorRect.top - 20) + 'px';
      }, 100); // OPTIMIZATION: 100ms delay - imperceptible to user
    });

    // Use event delegation for dropdown clicks (outside input handler to avoid duplicates)
    dropdown.addEventListener('click', function(e) {
      var item = e.target.closest('.pac-dropdown-item');
      if (item) {
        selectPokemon(item);
      }
    });

    // Selection handler
    function selectPokemon(item) {
      var name = item.dataset.name;
      var rarity = item.dataset.rarity;
      var baseForm = item.dataset.baseform || name;

      // Check if rarity is in pool
      if (!POOL_RARITIES.includes(rarity)) {
        errorMsg.textContent = name + ' is ' + RARITY_INFO[rarity].label + ' - not available in shop pools';
        errorMsg.classList.remove('hidden');
        input.value = '';
        state.targetPokemon = '';
        state.targetPokemonDisplayName = '';
        state.evolutionFamily = [];
        state.targetIsWild = false;
        var wildCheckbox = document.getElementById('pacTargetWild');
        if (wildCheckbox) wildCheckbox.checked = false;
        selectedPokemon = null;
        // Hide portal warning
        var portalWarning = document.getElementById('pacPortalWarning');
        if (portalWarning) portalWarning.style.display = 'none';
        dropdown.classList.add('hidden');
        return;
      }

      // Clear previous evolution family display
      var familySection = document.getElementById('pacEvolutionFamily');
      if (familySection) {
        familySection.classList.add('hidden');
      }

      // Auto-adjust rarity if different
      if (rarity !== state.targetRarity) {
        state.targetRarity = rarity;
        document.getElementById('pacRarity').value = rarity;
      }

      // Auto-adjust evolution stars based on maxStars from EVOLUTION_CHAINS
      var evolutionChain = EVOLUTION_CHAINS[baseForm];
      if (evolutionChain && evolutionChain[0] && evolutionChain[0].maxStars) {
        var targetEvoStars = evolutionChain[0].maxStars;
        // Set the dropdown value to "twoStar" or "threeStar"
        var evoValue = targetEvoStars === 3 ? 'threeStar' : 'twoStar';
        state.targetEvo = evoValue;
        document.getElementById('pacEvo').value = evoValue;
        if (DEBUG_MODE) console.log('🌟 Auto-set evolution to ' + targetEvoStars + '★ (max for ' + baseForm + ')');
      }

      // Valid selection - store base form and evolution family
      input.value = name;
      state.targetPokemon = baseForm;  // Store BASE FORM for tracking
      state.targetPokemonDisplayName = name;  // What user searched
      state.targetPokemonRarity = rarity;
      state.evolutionFamily = getEvolutionFamily(baseForm);  // Cache family
      selectedPokemon = { name: name, rarity: rarity, baseForm: baseForm };

      // Auto-detect wild Pokemon
      var isWild = isWildPokemon(baseForm);
      state.targetIsWild = isWild;
      var wildCheckbox = document.getElementById('pacTargetWild');
      if (wildCheckbox) {
        wildCheckbox.checked = isWild;
      }

      if (DEBUG_MODE) console.log('🎯 Selected:', { name: name, baseForm: baseForm, family: state.evolutionFamily, isWild: isWild });

      // Check portal/regional availability
      updateAvailabilityWarnings();

      dropdown.classList.add('hidden');
      errorMsg.classList.add('hidden');
      updateDisplay();
    }

    // Clear selection if rarity changes
    document.getElementById('pacRarity').addEventListener('change', function() {
      if (selectedPokemon && selectedPokemon.rarity !== state.targetRarity) {
        input.value = '';
        state.targetPokemon = '';
        state.targetPokemonRarity = null;
        state.targetIsWild = false;
        var wildCheckbox = document.getElementById('pacTargetWild');
        if (wildCheckbox) wildCheckbox.checked = false;
        var rarityLabel = RARITY_INFO[state.targetRarity].label;
        errorMsg.textContent = selectedPokemon ? selectedPokemon.name + ' is not a ' + rarityLabel + ' pokemon' : '';
        if (selectedPokemon) errorMsg.classList.remove('hidden');
        selectedPokemon = null;
      }
    });

    // Close dropdown on outside click
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.pac-pokemon-selector')) {
        dropdown.classList.add('hidden');
      }
    });

    // Allow clearing with backspace
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Backspace' && input.value.length === 0) {
        state.targetPokemon = '';
        state.targetPokemonRarity = null;
        state.targetIsWild = false;
        var wildCheckbox = document.getElementById('pacTargetWild');
        if (wildCheckbox) wildCheckbox.checked = false;
        selectedPokemon = null;
        errorMsg.classList.add('hidden');
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UI CREATION
  // ═══════════════════════════════════════════════════════════════════════════

  function createOverlay() {
    // Inject CSS from styles module
    PAC.UI.injectStyles();

    // Create overlay HTML
    const overlay = document.createElement('div');
    overlay.id = 'pac-calc-overlay';
    overlay.innerHTML = `
      <!-- Resize Handles -->
      <div class="pac-resize-handle pac-resize-nw" data-resize="nw"></div>
      <div class="pac-resize-handle pac-resize-ne" data-resize="ne"></div>
      <div class="pac-resize-handle pac-resize-sw" data-resize="sw"></div>
      <div class="pac-resize-handle pac-resize-se" data-resize="se"></div>
      <div class="pac-resize-handle pac-resize-n" data-resize="n"></div>
      <div class="pac-resize-handle pac-resize-s" data-resize="s"></div>
      <div class="pac-resize-handle pac-resize-w" data-resize="w"></div>
      <div class="pac-resize-handle pac-resize-e" data-resize="e"></div>
      
      <div id="pac-calc-header">
        <div id="pac-calc-title">
          <span class="pac-status-dot" id="pacStatusDot"></span>
          <span>PAC Live Data v3.2.2</span>
        </div>
        <div id="pac-calc-controls">
          <button class="pac-ctrl-btn" id="pacHelpBtn" title="Help & Features" style="font-size: 10px; padding: 2px 6px;">?</button>
          <button class="pac-ctrl-btn" id="pacExpBtn" title="Experimental Features" style="font-size: 10px; padding: 2px 6px;">EXP</button>
          <button class="pac-ctrl-btn" id="pacClearBtn" title="Clear All" style="font-size: 10px; padding: 2px 6px;">CLR</button>
          <button class="pac-ctrl-btn" id="pacMinBtn" title="Minimize">−</button>
          <button class="pac-ctrl-btn" id="pacCloseBtn" title="Close">×</button>
        </div>
      </div>
      
      <div id="pac-calc-body">
        <div class="pac-section">
          <div class="pac-section-title">🎯 Target</div>
          <div class="pac-row">
            <div class="pac-field">
              <label>Level</label>
              <select id="pacLevel">
                ${[1,2,3,4,5,6,7,8,9].map(l => `<option value="${l}" ${l===7?'selected':''}>Lv ${l}</option>`).join('')}
              </select>
            </div>
            <div class="pac-field">
              <label>Rarity</label>
              <select id="pacRarity">
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare" selected>Rare</option>
                <option value="epic">Epic</option>
                <option value="ultra">Ultra</option>
              </select>
            </div>
            <div class="pac-field">
              <label>Evo</label>
              <select id="pacEvo">
                <option value="twoStar">2★</option>
                <option value="threeStar" selected>3★</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="pac-section">
          <div class="pac-section-title">📊 Pool State</div>
          <div class="pac-row">
            <div class="pac-field">
              <label>Owned</label>
              <input type="number" id="pacOwned" value="0" min="0">
            </div>
            <div class="pac-field">
              <label>Scouted</label>
              <input type="number" id="pacScouted" value="0" min="0">
            </div>
          </div>
          <div class="pac-row">
            <div class="pac-field">
              <label>Target Pokemon (Auto-Scout)</label>
              <div class="pac-pokemon-selector">
                <input 
                  type="text" 
                  id="pacTargetPokemon" 
                  class="pac-autocomplete-input" 
                  placeholder="Type to search..."
                  autocomplete="off"
                >
                <div id="pacRarityError" class="hidden"></div>
                <div id="pacPortalWarning" class="pac-portal-warning hidden" style="color: #ff9800; font-size: 11px; margin-top: 4px; padding: 4px 8px; background: rgba(255, 152, 0, 0.15); border-radius: 4px; display: none;"></div>
              
              <!-- Evolution Family Display (v2.5.0) -->
              <div id="pacEvolutionFamily" class="pac-evolution-family hidden">
                <div class="pac-family-title">Evolution Family</div>
                <div id="pacFamilyBreakdown" class="pac-family-breakdown">
                  <!-- Dynamically populated -->
                </div>
                <div class="pac-family-total">
                  Total: <span id="pacFamilyTotal">0</span> copies
                </div>
              </div>
</div>
            </div>
          </div>
          <div class="pac-toggle-row">
            <label class="pac-toggle">
              <input type="checkbox" id="pacDitto" disabled>
              <span>Ditto (Stage 6+)</span>
            </label>
            <label class="pac-toggle">
              <input type="checkbox" id="pacAutoScout" checked>
              <span>Auto-Scout</span>
            </label>
          </div>
          
          <!-- Live Tracking Controls -->
          <div class="pac-row">
            <div class="pac-field">
              <label>Your In-Game Name (for flash alerts)</label>
              <input type="text" id="pacPlayerName" placeholder="Enter your name..." autocomplete="off">
            </div>
          </div>
          
          <div class="pac-live-controls">
            <button class="pac-live-toggle" id="pacLiveToggle">
              <span class="pac-live-status" id="pacLiveStatus">OFF</span>
              <span>Live Tracking</span>
            </button>
            <select id="pacPollSpeed" class="pac-speed-select">
              <option value="10">Ultra Giga Computer God (10ms)</option>
              <option value="30">Very Fast (30ms)</option>
              <option value="100">Fast (100ms)</option>
              <option value="350" selected>Normal (350ms)</option>
              <option value="500">Slow (500ms)</option>
              <option value="1000">Slower (1s)</option>
            </select>
          </div>
          
          <div class="pac-row">
            <button id="pacNewGame" class="pac-new-game-btn">
              🔄 NEW GAME - Reinject Extractor
            </button>
          </div>
          
          <div class="pac-live-indicator" id="pacLiveIndicator" style="display: none;">
            <span id="pacStageDisplay" class="pac-stage-display">Stage —</span>
            <span class="pac-live-divider">|</span>
            <span>🟢 Live:</span>
            <span id="pacLiveCount">0</span>
            <span>units tracked</span>
          </div>
          
          <!-- Game Detection Display -->
          <div id="pacDetectionPanel" class="pac-detection-panel" style="margin-top: 12px; padding: 12px; background: rgba(0,0,0,0.3); border-radius: 8px; display: none;">
            <div style="margin-bottom: 8px;">
              <span style="font-weight: 600; color: #64b5f6;">🌍 Regional Pokemon</span>
              <span id="pacRegionalStatus" style="font-size: 11px; color: #888; margin-left: 8px;">(Hover icon to detect)</span>
            </div>
            <div id="pacRegionalList" style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 12px; min-height: 24px;">
              <span style="color: #666; font-size: 11px;">Not detected yet</span>
            </div>
            
            <div style="margin-bottom: 8px;">
              <span style="font-weight: 600; color: #64b5f6;">🎯 Add Picks</span>
              <span id="pacAddPicksStatus" style="font-size: 11px; color: #888; margin-left: 8px;">(Hover icon to detect)</span>
            </div>
            <div id="pacAddPicksList" style="display: flex; flex-wrap: wrap; gap: 4px; min-height: 24px;">
              <span style="color: #666; font-size: 11px;">Not detected yet</span>
            </div>
            
            <button id="pacResetDetection" style="margin-top: 8px; padding: 4px 12px; background: rgba(239,68,68,0.2); border: 1px solid rgba(239,68,68,0.4); border-radius: 6px; color: #ef4444; font-size: 11px; cursor: pointer;">🔄 Redetect</button>
            <div style="margin-top: 6px; font-size: 10px; color: #666;">Click a Pokemon to confirm if multiple matches shown</div>
          </div>
        </div>
        
        <div class="pac-collapsible" id="pacWildSection">
          <button class="pac-collapse-btn">🌿 Wild Mechanics</button>
          <div class="pac-collapse-content">
            <div class="pac-toggle-row" style="margin-top: 8px;">
              <label class="pac-toggle">
                <input type="checkbox" id="pacTargetWild">
                <span>Target is Wild</span>
              </label>
              <label class="pac-toggle">
                <input type="checkbox" id="pacPVE">
                <span>PvE Round</span>
              </label>
            </div>
            <div class="pac-row" style="margin-top: 8px;">
              <div class="pac-field">
                <label>Wild Stars <span style="font-size: 10px; opacity: 0.7;">(Auto)</span></label>
                <input type="number" id="pacWildOwned" value="0" min="0">
              </div>
              <div class="pac-field">
                <label>Scouted Copies <span style="font-size: 10px; opacity: 0.7;">(Auto)</span></label>
                <input type="number" id="pacWildScouted" value="0" min="0">
              </div>
            </div>
          </div>
        </div>
        
        <div class="pac-results">
          <div class="pac-result-row">
            <span class="pac-result-label">Per Refresh:</span>
            <span class="pac-result-value" id="pacPerRefresh">0.00%</span>
          </div>
          <div class="pac-confidence-control">
            <label for="pacConfidenceSlider">
              <span>Confidence</span>
              <span id="pacConfidenceValue">75</span>%
            </label>
            <input type="range" id="pacConfidenceSlider" min="50" max="99" value="75" step="1">
          </div>
          <div class="pac-result-row">
            <span class="pac-result-label" id="pacConfidenceLabel">75% Confidence:</span>
            <span class="pac-result-value" id="pacConfidence">0 rolls</span>
          </div>
          <div class="pac-result-row">
            <span class="pac-result-label" id="pacConfidenceGoldLabel">Gold (75%):</span>
            <span class="pac-result-value" id="pacGoldConfidence">0g</span>
          </div>
        </div>
        
        <div id="pacStatusWild" class="pac-status-msg"></div>
        <div id="pacStatusPool" class="pac-status-msg"></div>
      </div>
      
      <div id="pac-calc-footer" class="pac-footer">
        <span>Pool: <span id="pacPoolInfo">0/0</span></span>
        <span>Rate: <span id="pacRateInfo">0</span>%</span>
      </div>
      
      <!-- Team Tracker Side Panel -->
      <div id="pac-team-panel" class="pac-team-panel">
        <button id="pacTeamToggle" class="pac-team-toggle" title="Team Tracker">
          <span class="pac-team-arrow">→</span>
        </button>
        <div class="pac-team-content">
          <div class="pac-team-header">
            <h3>🎯 Team Tracker</h3>
            <button id="pacTeamClose" class="pac-team-close">×</button>
          </div>
          <div id="pacSynergyBar" class="pac-synergy-bar">
            <!-- Synergy buttons will be populated dynamically -->
          </div>
          <div id="pacMonoPanel" class="pac-mono-panel">
            <div class="pac-mono-header" id="pacMonoHeader">
              <div class="pac-mono-header-title">
                <span>🎯 MONO TYPE</span>
              </div>
              <span class="pac-mono-arrow">▶</span>
            </div>
            <div class="pac-mono-content">
              <div class="pac-mono-grid" id="pacMonoGrid">
                <!-- Type buttons populated dynamically -->
              </div>
              <div id="pacMonoStatus" class="pac-mono-status">Select a type to block others</div>
              <button id="pacMonoClear" class="pac-mono-clear" style="display: none;">✕ Clear Mono-Type</button>
              <div class="pac-mono-wheel-section">
                <button id="pacMonoSpinBtn" class="pac-mono-spin-btn">🎰 Spin</button>
                <div class="pac-mono-wheel-display">
                  <span id="pacMonoWheelType" class="pac-mono-wheel-type" style="background: #666; color: #fff;">???</span>
                </div>
              </div>
              <div class="pac-mono-wheel-label">or spin the wheel for a random type!</div>
            </div>
            <div id="pacDraftPanel" class="pac-draft-panel">
              <div class="pac-draft-header">
                <span class="pac-draft-header-title">🎲 RANDOM DRAFT</span>
                <button id="pacDraftToggle" class="pac-draft-toggle">Start</button>
              </div>
              <div id="pacDraftStatus" class="pac-draft-status">
                Spinning...
              </div>
            </div>
            <div id="pacCopycatPanel" class="pac-copycat-panel">
              <div class="pac-copycat-header">
                <span class="pac-copycat-header-title">🐱 COPYCAT</span>
                <button id="pacCopycatToggle" class="pac-copycat-toggle">Start</button>
              </div>
              <div id="pacCopycatStatus" class="pac-copycat-status">
                Only contested Pokemon allowed!
              </div>
            </div>
            <div id="pacMlgPanel" class="pac-mlg-panel">
              <div class="pac-mlg-header">
                <span class="pac-mlg-header-title">🔥 MLG MODE</span>
                <button id="pacMlgToggle" class="pac-mlg-toggle">Start</button>
              </div>
              <div id="pacMlgStatus" class="pac-mlg-status">
                360 NO SCOPE 🎯
              </div>
            </div>
          </div>
          <div id="pacTeamList" class="pac-team-list">
            <!-- Team targets will be added here -->
          </div>
          <div class="pac-team-combined">
            <div class="pac-team-combined-title">Combined Probability</div>
            <div class="pac-team-combined-stats">
              <div class="pac-team-stat">
                <span class="pac-team-stat-label">Hit any:</span>
                <span id="pacTeamCombinedProb" class="pac-team-stat-value">0%</span>
              </div>
              <div class="pac-team-stat">
                <span class="pac-team-stat-label">Expected:</span>
                <span id="pacTeamCombinedRolls" class="pac-team-stat-value">0 rolls</span>
              </div>
            </div>
          </div>
          <div class="pac-team-add-section">
            <input type="text" id="pacTeamAddInput" placeholder="Type Pokemon name..." autocomplete="off" class="pac-team-input">
            <button id="pacTeamAddBtn" class="pac-team-add-btn">Add</button>
          </div>
        </div>
      </div>
      
      <!-- Counter Intelligence Side Panel -->
      <div id="pac-current-panel" class="pac-team-panel">
        <button id="pacCurrentToggle" class="pac-team-toggle pac-current-toggle" title="Counter Intelligence" style="top: calc(50% - 60px);">
          <span class="pac-team-arrow">→</span>
        </button>
        <div class="pac-team-content">
          <div class="pac-team-header">
            <h3>🕵️ Counter Intelligence</h3>
            <button id="pacCurrentClose" class="pac-team-close">×</button>
          </div>
          <div id="pacIntelPlayers" class="pac-intel-players">
            <div class="pac-intel-empty">Waiting for game data...</div>
          </div>
        </div>
      </div>
      
      <!-- Settings & Accessibility Side Panel -->
      <div id="pac-settings-panel" class="pac-team-panel">
        <button id="pacSettingsToggle" class="pac-team-toggle pac-settings-toggle" title="Customization & Accessibility" style="top: calc(50% + 60px);">
          <span class="pac-team-arrow">→</span>
        </button>
        <div class="pac-settings-content">
          <div class="pac-team-header">
            <h3>⚙️ Customization</h3>
            <button id="pacSettingsClose" class="pac-team-close">×</button>
          </div>
          
          <div class="pac-settings-section">
            <div class="pac-settings-section-title">🎨 Colors</div>
            <div class="pac-settings-row">
              <span class="pac-settings-label">Background</span>
              <input type="color" id="pacSettingsBgColor" class="pac-settings-color-input" value="#1a1a2e">
            </div>
            <div class="pac-settings-row">
              <span class="pac-settings-label">Text</span>
              <input type="color" id="pacSettingsTextColor" class="pac-settings-color-input" value="#e0e0e0">
            </div>
            <div class="pac-settings-row">
              <span class="pac-settings-label">Buttons/Inputs</span>
              <input type="color" id="pacSettingsAccentColor" class="pac-settings-color-input" value="#4caf50">
            </div>
          </div>
          
          <div class="pac-settings-section">
            <div class="pac-settings-section-title">✨ Flash Alert Colors</div>
            <div class="pac-settings-row">
              <span class="pac-settings-label">Target Flash</span>
              <input type="color" id="pacSettingsTargetFlash" class="pac-settings-color-input" value="#fbbf24">
            </div>
            <div class="pac-settings-row">
              <span class="pac-settings-label">Team Flash</span>
              <input type="color" id="pacSettingsTeamFlash" class="pac-settings-color-input" value="#FF1493">
            </div>
            <div class="pac-settings-row" style="flex-direction: column; align-items: flex-start; gap: 6px;">
              <span class="pac-settings-label">Flash Speed</span>
              <div class="pac-settings-slider-row">
                <input type="range" id="pacSettingsFlashSpeed" class="pac-settings-slider" min="100" max="1000" step="50" value="250">
                <span id="pacSettingsFlashSpeedValue" class="pac-settings-value">250ms</span>
              </div>
            </div>
            <div class="pac-settings-row" style="margin-top: 8px;">
              <span class="pac-settings-label">⚠️ Disable Flashing (Epilepsy)</span>
              <label class="pac-settings-switch">
                <input type="checkbox" id="pacSettingsDisableFlash">
                <span class="pac-settings-switch-slider"></span>
              </label>
            </div>
          </div>
          
          <div class="pac-settings-section">
            <div class="pac-settings-section-title">📝 Accessibility</div>
            <div class="pac-settings-row" style="flex-direction: column; align-items: flex-start; gap: 6px;">
              <span class="pac-settings-label">Font Size</span>
              <div class="pac-settings-slider-row">
                <input type="range" id="pacSettingsFontSize" class="pac-settings-slider" min="10" max="32" step="1" value="12">
                <span id="pacSettingsFontSizeValue" class="pac-settings-value">12px</span>
              </div>
            </div>
          </div>
          
          <div class="pac-settings-section">
            <div class="pac-settings-section-title">👁️ Preview</div>
            <div class="pac-settings-preview" id="pacSettingsPreview">
              <div class="pac-settings-preview-text">Sample Text</div>
              <div class="pac-settings-preview-flashes">
                <span class="pac-settings-flash-preview target" id="pacPreviewTargetFlash">Target</span>
                <span class="pac-settings-flash-preview team" id="pacPreviewTeamFlash">Team</span>
              </div>
            </div>
          </div>
          
          <button id="pacSettingsReset" class="pac-settings-btn reset">↺ Reset to Defaults</button>
        </div>
      </div>
      
      <!-- Shop History / Roll Luck Tracker Side Panel -->
      <div id="pac-history-panel" class="pac-team-panel">
        <button id="pacHistoryToggle" class="pac-team-toggle pac-history-toggle" title="Shop History / Roll Luck" style="top: calc(50% + 120px);">
          <span class="pac-team-arrow">→</span>
        </button>
        <div class="pac-history-content">
          <div class="pac-team-header">
            <h3>🎰 Roll Luck</h3>
            <button id="pacHistoryClose" class="pac-team-close">×</button>
          </div>
          
          <!-- Tab Buttons -->
          <div class="pac-analytics-tabs">
            <button class="pac-analytics-tab active" data-tab="live">📊 Live</button>
            <button class="pac-analytics-tab analytics-btn" data-tab="analytics">📈 Analytics</button>
            <button class="pac-analytics-tab fishing-btn" data-tab="fishing">🎣 Fishing</button>
          </div>
          
          <!-- Live Tab Content -->
          <div class="pac-analytics-content active" id="pacLiveTab">
            <div class="pac-history-disclaimer">
              ⚠️ Best accuracy at 30ms polling
            </div>
            
            <div class="pac-history-players" id="pacHistoryPlayers">
              <div class="pac-history-empty">No rolls tracked yet.<br>Rolls are detected when Live Tracking is ON.</div>
            </div>
            
            <button id="pacHistoryClear" class="pac-settings-btn reset" style="margin-top: 12px; flex-shrink: 0;">🗑️ Clear Session</button>
          </div>
          
          <!-- Analytics Tab Content -->
          <div class="pac-analytics-content" id="pacAnalyticsTab">
            <div class="pac-analytics-disclaimer">
              ⚠️ Refreshing may miss some shop data. Data persists across sessions.
            </div>
            
            <div class="pac-analytics-panel" id="pacAnalyticsPanel">
              <div class="pac-analytics-section">
                <div class="pac-analytics-title">🎲 Overall Luck Score</div>
                <div class="pac-luck-gauge" id="pacLuckGauge">
                  <div class="pac-luck-score neutral" id="pacLuckScore">—</div>
                  <div style="flex: 1;">
                    <div class="pac-luck-gauge-bar">
                      <div class="pac-luck-gauge-marker" id="pacLuckMarker" style="left: 50%;"></div>
                    </div>
                    <div class="pac-luck-gauge-labels">
                      <span>Unlucky</span>
                      <span>Average</span>
                      <span>Lucky</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="pac-analytics-section">
                <div class="pac-analytics-title">📊 Rarity Hit Rates</div>
                <div class="pac-rarity-charts" id="pacRarityCharts">
                  <!-- Filled by JS -->
                </div>
              </div>
              
              <div class="pac-analytics-section">
                <div class="pac-analytics-title">📈 Rolls by Level</div>
                <div class="pac-level-grid" id="pacLevelGrid">
                  <!-- Filled by JS -->
                </div>
              </div>
              
              <div class="pac-analytics-section">
                <div class="pac-analytics-title">🔥 Luckiest Pokemon</div>
                <div class="pac-top-pokemon-grid" id="pacLuckyPokemon">
                  <!-- Filled by JS -->
                </div>
              </div>
              
              <div class="pac-analytics-section">
                <div class="pac-analytics-title">❄️ Unluckiest Pokemon</div>
                <div class="pac-top-pokemon-grid" id="pacUnluckyPokemon">
                  <!-- Filled by JS -->
                </div>
              </div>
              
              <div class="pac-analytics-section">
                <div class="pac-analytics-title">🟣 Ditto</div>
                <div class="pac-ditto-section" id="pacDittoStats">
                  <div class="pac-history-empty">No Ditto seen yet</div>
                </div>
              </div>
              
              <div class="pac-analytics-section">
                <div class="pac-analytics-title">🌿 Wild Pokemon</div>
                <div class="pac-wild-section" id="pacWildPokemon">
                  <div class="pac-history-empty">No wild Pokemon seen yet</div>
                </div>
              </div>
              
              <div class="pac-analytics-section">
                <div class="pac-analytics-title">📝 Summary</div>
                <div class="pac-narrative" id="pacNarrativeSummary">
                  <p>No data to analyze yet. Start rolling to see your luck story!</p>
                </div>
              </div>
            </div>
            
            <button id="pacAnalyticsClear" class="pac-settings-btn reset" style="margin-top: 12px; flex-shrink: 0;">🗑️ Clear All History</button>
          </div>
          
          <!-- Fishing Tab Content -->
          <div class="pac-analytics-content" id="pacFishingTab">
            <div class="pac-fishing-disclaimer">
              ⚠️ Fishing requires a free bench slot or the catch is lost!
            </div>
            
            <div class="pac-fishing-panel">
              <div class="pac-fishing-section">
                <div class="pac-fishing-title">🎣 Rod Selection</div>
                <div class="pac-fishing-rod-select">
                  <button class="pac-rod-btn active" data-rod="none">None</button>
                  <button class="pac-rod-btn" data-rod="old">Old Rod</button>
                  <button class="pac-rod-btn" data-rod="good">Good Rod</button>
                  <button class="pac-rod-btn" data-rod="super">Super Rod</button>
                </div>
                <div class="pac-fishing-rod-info">
                  <span class="pac-rod-synergy">Water (3) → Old Rod</span>
                  <span class="pac-rod-synergy">Water (6) → Good Rod</span>
                  <span class="pac-rod-synergy">Water (9) → Super Rod</span>
                </div>
              </div>
              
              <div class="pac-fishing-section">
                <div class="pac-fishing-title">🎰 Catch Rates</div>
                <div class="pac-fishing-odds" id="pacFishingOdds">
                  <div class="pac-fishing-no-rod">Select a rod to see catch rates</div>
                </div>
              </div>
              
              <div class="pac-fishing-section">
                <div class="pac-fishing-title">🐟 Fishable Pokemon</div>
                <div class="pac-fishing-toggle-row">
                  <label class="pac-fishing-checkbox">
                    <input type="checkbox" id="pacMantykeToggle">
                    <span>Mantine/Mantyke on board <span style="color: #888; font-size: 10px;">(auto-detects)</span></span>
                  </label>
                </div>
                <div class="pac-fishing-pool" id="pacFishingPool">
                  <div class="pac-fishing-no-rod">Select a rod to see fishable Pokemon</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Create autocomplete dropdown as separate floating element
    const dropdown = document.createElement('div');
    dropdown.id = 'pacAutocompleteDropdown';
    dropdown.className = 'hidden';
    document.body.appendChild(dropdown);
    
    // Create refresh blocker overlay
    const refreshBlocker = document.createElement('div');
    refreshBlocker.id = 'pac-refresh-blocker';
    refreshBlocker.innerHTML = `
      <div class="blocker-title">⚠️ TARGET FOUND ⚠️</div>
      <div class="blocker-pokemon" id="blockerPokemonName">—</div>
      <button class="blocker-dismiss" id="blockerDismiss" title="Dismiss">×</button>
    `;
    document.body.appendChild(refreshBlocker);
    
    return overlay;
  }
  // ═══════════════════════════════════════════════════════════════════════════
  // DRAG FUNCTIONALITY
  // ═══════════════════════════════════════════════════════════════════════════

  function setupDrag(overlay) {
    const header = document.getElementById('pac-calc-header');
    const footer = document.getElementById('pac-calc-footer');
    let isDragging = false;
    let startX, startY, initialX, initialY;
    let activeHandle = null;

    function startDrag(e, handle) {
      isDragging = true;
      activeHandle = handle;
      startX = e.clientX;
      startY = e.clientY;
      const rect = overlay.getBoundingClientRect();
      initialX = rect.left;
      initialY = rect.top;
      handle.style.cursor = 'grabbing';
    }

    header.addEventListener('mousedown', (e) => startDrag(e, header));
    footer.addEventListener('mousedown', (e) => startDrag(e, footer));
    
    // Double-click header to reset size
    header.addEventListener('dblclick', (e) => {
      e.preventDefault();
      overlay.style.width = '380px';
      overlay.style.height = '';
      overlay.style.maxHeight = '';
      overlay.classList.remove('width-resized');
      savePosition();
      if (DEBUG_MODE) console.log('📐 Reset to default size');
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      // Calculate new position
      let newLeft = initialX + dx;
      let newTop = initialY + dy;
      
      // Get overlay dimensions
      const rect = overlay.getBoundingClientRect();
      
      // Boundary constraints - keep at least 100px visible on screen
      const minVisible = 100;
      const maxLeft = window.innerWidth - minVisible;
      const maxTop = window.innerHeight - minVisible;
      const minLeft = minVisible - rect.width;
      const minTop = 0; // Don't allow dragging above viewport
      
      newLeft = Math.max(minLeft, Math.min(maxLeft, newLeft));
      newTop = Math.max(minTop, Math.min(maxTop, newTop));
      
      overlay.style.left = newLeft + 'px';
      overlay.style.top = newTop + 'px';
      overlay.style.right = 'auto';
      
      // Update team dropdown position if it's open
      if (window.updateTeamDropdownPosition) {
        window.updateTeamDropdownPosition();
      }
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        if (activeHandle) {
          activeHandle.style.cursor = 'move';
        }
        activeHandle = null;
        savePosition();
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RESIZE FUNCTIONALITY
  // ═══════════════════════════════════════════════════════════════════════════

  function setupResize(overlay) {
    const handles = overlay.querySelectorAll('.pac-resize-handle');
    
    let isResizing = false;
    let currentHandle = null;
    let startX, startY, startWidth, startHeight, startLeft, startTop;
    
    const MIN_WIDTH = 280;
    const MAX_WIDTH = 600;
    const MIN_HEIGHT = 200;
    const DEFAULT_WIDTH = 380;
    
    handles.forEach(handle => {
      handle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        isResizing = true;
        currentHandle = handle.dataset.resize;
        
        startX = e.clientX;
        startY = e.clientY;
        
        const rect = overlay.getBoundingClientRect();
        startWidth = rect.width;
        startHeight = rect.height;
        startLeft = rect.left;
        startTop = rect.top;
        
        if (DEBUG_MODE) console.log(`📐 Resize start: ${currentHandle}`);
      });
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;
      
      // Calculate new dimensions based on handle
      switch (currentHandle) {
        case 'se':
          newWidth = startWidth + dx;
          newHeight = startHeight + dy;
          break;
        case 'sw':
          newWidth = startWidth - dx;
          newHeight = startHeight + dy;
          newLeft = startLeft + dx;
          break;
        case 'ne':
          newWidth = startWidth + dx;
          newHeight = startHeight - dy;
          newTop = startTop + dy;
          break;
        case 'nw':
          newWidth = startWidth - dx;
          newHeight = startHeight - dy;
          newLeft = startLeft + dx;
          newTop = startTop + dy;
          break;
        case 'n':
          newHeight = startHeight - dy;
          newTop = startTop + dy;
          break;
        case 's':
          newHeight = startHeight + dy;
          break;
        case 'e':
          newWidth = startWidth + dx;
          break;
        case 'w':
          newWidth = startWidth - dx;
          newLeft = startLeft + dx;
          break;
      }
      
      // Apply constraints
      newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));
      newHeight = Math.max(MIN_HEIGHT, newHeight);
      
      // Recalculate left/top if width was constrained
      if (currentHandle.includes('w')) {
        newLeft = startLeft + startWidth - newWidth;
      }
      if (currentHandle.includes('n')) {
        newTop = startTop + startHeight - newHeight;
      }
      
      // Viewport bounds
      if (newTop < 0) newTop = 0;
      if (newLeft < 10) newLeft = 10;
      
      // Apply
      overlay.style.width = newWidth + 'px';
      overlay.style.height = newHeight + 'px';
      overlay.style.maxHeight = 'none';
      overlay.style.left = newLeft + 'px';
      overlay.style.top = newTop + 'px';
      overlay.style.right = 'auto';
      
      // Toggle side panels based on width
      if (Math.abs(newWidth - DEFAULT_WIDTH) > 10) {
        overlay.classList.add('width-resized');
      } else {
        overlay.classList.remove('width-resized');
      }
    });
    
    document.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        currentHandle = null;
        overlay.style.maxHeight = '';
        savePosition();
        if (DEBUG_MODE) console.log('📐 Resize complete');
      }
    });
    
    if (DEBUG_MODE) console.log('📐 Resize initialized');
  }

  function savePosition() {
    const overlay = document.getElementById('pac-calc-overlay');
    const rect = overlay.getBoundingClientRect();
    localStorage.setItem('pac-calc-position', JSON.stringify({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    }));
  }

  function loadPosition() {
    const saved = localStorage.getItem('pac-calc-position');
    if (saved) {
      const pos = JSON.parse(saved);
      const overlay = document.getElementById('pac-calc-overlay');
      overlay.style.left = pos.left + 'px';
      overlay.style.top = pos.top + 'px';
      overlay.style.right = 'auto';
      
      // Load saved dimensions
      if (pos.width && pos.width >= 280 && pos.width <= 600) {
        overlay.style.width = pos.width + 'px';
        // Hide side panels if not at default width
        if (Math.abs(pos.width - 380) > 10) {
          overlay.classList.add('width-resized');
        }
      }
      if (pos.height && pos.height >= 200) {
        overlay.style.height = pos.height + 'px';
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // COLLAPSIBLE SECTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  function setupCollapsibles() {
    document.querySelectorAll('.pac-collapse-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const content = btn.nextElementSibling;
        content.classList.toggle('expanded');
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UI BINDINGS
  // ═══════════════════════════════════════════════════════════════════════════

  function bindUI() {
    // Minimize/Close buttons
    document.getElementById('pacMinBtn').addEventListener('click', () => {
      const body = document.getElementById('pac-calc-body');
      const overlay = document.getElementById('pac-calc-overlay');
      isMinimized = !isMinimized;
      body.classList.toggle('minimized');
      overlay.classList.toggle('minimized');
      document.getElementById('pacMinBtn').textContent = isMinimized ? '+' : '−';
    });

    document.getElementById('pacCloseBtn').addEventListener('click', () => {
      document.getElementById('pac-calc-overlay').style.display = 'none';
    });

    // Clear ALL button - reset everything
    document.getElementById('pacClearBtn').addEventListener('click', () => {
      if (DEBUG_MODE) console.log('🧹 CLEAR ALL - Wiping all state...');
      
      // Clear main target
      state.targetPokemon = '';
      state.targetPokemonDisplayName = '';
      state.targetPokemonRarity = null;
      state.evolutionFamily = [];
      state.targetIsWild = false;
      state.copiesTaken = 0;
      state.copiesOwned = 0;
      document.getElementById('pacTargetPokemon').value = '';
      document.getElementById('pacScouted').value = 0;
      document.getElementById('pacTargetWild').checked = false;
      const portalWarning = document.getElementById('pacPortalWarning');
      if (portalWarning) portalWarning.style.display = 'none';
      
      // Clear evolution family display
      const familySection = document.getElementById('pacEvolutionFamily');
      if (familySection) familySection.classList.add('hidden');
      const familyBreakdown = document.getElementById('pacFamilyBreakdown');
      if (familyBreakdown) familyBreakdown.innerHTML = '';
      const familyTotal = document.getElementById('pacFamilyTotal');
      if (familyTotal) familyTotal.textContent = '0';
      
      // Clear team targets
      state.teamTargets = [];
      localStorage.removeItem('pac_teamTargets');
      updateTeamDisplay();
      
      // Clear detection
      resetGameDetection();
      
      // Clear wild tracking
      state.wildUnitsOwned = 0;
      state.wildUnitsTaken = { common: 0, uncommon: 0, rare: 0, epic: 0, ultra: 0 };
      document.getElementById('pacWildOwned').value = 0;
      document.getElementById('pacWildScouted').value = 0;
      
      // Reset Ditto (disabled until stage 6)
      state.dittoEnabled = false;
      const dittoCheckbox = document.getElementById('pacDitto');
      if (dittoCheckbox) dittoCheckbox.checked = false;
      
      // Reset mono-type mode
      if (state.monoTypeEnabled) {
        clearMonoType();
      }
      
      // Reset random draft mode
      if (state.randomDraftEnabled) {
        stopRandomDraft();
      }
      
      // Reset copycat mode
      if (state.copycatEnabled) {
        stopCopycat();
      }
      
      // Reset MLG mode
      if (state.mlgModeEnabled) {
        stopMlgMode();
      }
      
      // Update display
      updateDisplay();
      
      if (DEBUG_MODE) console.log('✅ All state cleared');
    });

    // Help button - open help modal
    document.getElementById('pacHelpBtn').addEventListener('click', () => {
      openHelpModal();
    });

    // New Game button - reinject extractor for next match
    document.getElementById('pacNewGame').addEventListener('click', () => {
      if (DEBUG_MODE) console.log('🔄 NEW GAME - Wiping state and reinjecting...');
      
      // Send reset to extractor to clear cached room
      window.postMessage({ type: 'PAC_RESET' }, '*');
      
      // Clear all cached data
      lastPoolData = null;
      lastCurrentHash = '';
      lastTeamFingerprint = '';
      expandedIntelPlayers.clear();
      isConnected = false;
      
      // Reset main calculator scouted values
      state.copiesTaken = 0;
      document.getElementById('pacScouted').value = 0;
      
      // Reset wild units owned (will be auto-recalculated)
      state.wildUnitsOwned = 0;
      const wildOwnedInput = document.getElementById('pacWildOwned');
      if (wildOwnedInput) wildOwnedInput.value = 0;
      
      // Reset team target copiesTaken (they'll recalculate from fresh data)
      state.teamTargets.forEach(target => {
        target.copiesTaken = 0;
      });
      
      // Clear Counter Intelligence panel
      const intelContainer = document.getElementById('pacIntelPlayers');
      if (intelContainer) {
        intelContainer.innerHTML = '<div class="pac-intel-empty">Waiting for game data...</div>';
      }
      
      // Clear evolution family display
      const familySection = document.getElementById('pacEvolutionFamily');
      if (familySection) {
        familySection.classList.add('hidden');
      }
      const familyBreakdown = document.getElementById('pacFamilyBreakdown');
      if (familyBreakdown) {
        familyBreakdown.innerHTML = '';
      }
      const familyTotal = document.getElementById('pacFamilyTotal');
      if (familyTotal) {
        familyTotal.textContent = '0';
      }
      
      // Reset connection indicator
      document.getElementById('pacStatusDot').classList.remove('connected');
      document.getElementById('pacLiveIndicator').style.display = 'none';
      
      // Reset stage tracking
      state.currentStage = null;
      state.pveRoundEnabled = false;
      const pveCheckbox = document.getElementById('pacPVE');
      if (pveCheckbox) pveCheckbox.checked = false;
      const stageDisplay = document.getElementById('pacStageDisplay');
      if (stageDisplay) {
        stageDisplay.textContent = 'Stage —';
        stageDisplay.classList.remove('pve');
      }
      
      // Reset Ditto (disabled until stage 6)
      state.dittoEnabled = false;
      const dittoCheckboxNew = document.getElementById('pacDitto');
      if (dittoCheckboxNew) dittoCheckboxNew.checked = false;
      
      // Reset mono-type mode
      if (state.monoTypeEnabled) {
        clearMonoType();
      }
      
      // Reset random draft mode
      if (state.randomDraftEnabled) {
        stopRandomDraft();
      }
      
      // Reset copycat mode
      if (state.copycatEnabled) {
        stopCopycat();
      }
      
      // Reset MLG mode
      if (state.mlgModeEnabled) {
        stopMlgMode();
      }
      
      // Clear flash states
      const overlay = document.getElementById('pac-calc-overlay');
      const teamPanel = document.getElementById('pac-team-panel');
      overlay.classList.remove('target-in-shop', 'team-target-in-shop');
      if (teamPanel) teamPanel.classList.remove('team-target-in-shop');
      
      // Clear target highlighters
      clearTargetHighlighters();
      
      // Reset shop slot mapping for highlighting
      state.previousPlayerShop = null;
      state.shopSlotMapping = [];
      
      // Reset portal/regional detection for new game
      resetGameDetection();
      
      // Hide refresh blocker if showing and clear dismissed tracker
      hideRefreshBlocker();
      state.refreshBlockerDismissed = null;
      
      // Update team display (will show 0 values)
      updateTeamDisplay();
      
      // Reinject extractor
      injectExtractor();
      
      showNotification('Game reset! Extractor reinjected.', 'success');
    });

    // Inputs
    const inputs = {
      'pacLevel': 'level',
      'pacRarity': 'targetRarity',
      'pacEvo': 'targetEvo',
      'pacOwned': 'copiesOwned',
      'pacScouted': 'copiesTaken',
      'pacWildOwned': 'wildUnitsOwned'
      // 'pacWildScouted' removed - now per-rarity auto-tracked
    };

    Object.entries(inputs).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el) {
        // Use both 'input' (real-time) and 'change' (on blur) for best responsiveness
        const handleInputChange = (e) => {
          const value = e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value;
          state[key] = value;
          updateDisplay();
          // Re-render fishing tab if visible (wild stars affect Remoraid chance)
          if (state.shopHistoryPanelExpanded && state.analyticsTab === 'fishing') {
            renderFishingTab();
          }
        };
        el.addEventListener('input', handleInputChange);
        el.addEventListener('change', handleInputChange);
      }
    });

    // Checkboxes
    const checkboxes = {
      'pacDitto': 'dittoEnabled',
      'pacAutoScout': 'autoScout',
      'pacTargetWild': 'targetIsWild',
      'pacPVE': 'pveRoundEnabled'
    };

    Object.entries(checkboxes).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', (e) => {
          state[key] = e.target.checked;
          updateDisplay();
          // Re-render fishing tab if visible (PVE affects wild boost)
          if (state.shopHistoryPanelExpanded && state.analyticsTab === 'fishing') {
            renderFishingTab();
          }
        });
      }
    });

    // Confidence slider
    const confidenceSlider = document.getElementById('pacConfidenceSlider');
    const confidenceValue = document.getElementById('pacConfidenceValue');
    const confidenceLabel = document.getElementById('pacConfidenceLabel');
    const confidenceGoldLabel = document.getElementById('pacConfidenceGoldLabel');
    
    if (confidenceSlider) {
      confidenceSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        state.confidencePercent = value;
        confidenceValue.textContent = value;
        confidenceLabel.textContent = `${value}% Confidence:`;
        confidenceGoldLabel.textContent = `Gold (${value}%):`;
        updateDisplay();
      });
    }

    // Round Add Picks
    const round5Check = document.getElementById('pacRound5');
    const round5Input = document.getElementById('pacRound5Input');
    const round5Picks = document.getElementById('pacRound5Picks');
    
    if (round5Check) {
      round5Check.addEventListener('change', (e) => {
        state.round5Enabled = e.target.checked;
        round5Input.classList.toggle('hidden', !e.target.checked);
        updateDisplay();
      });
    }
    
    if (round5Picks) {
      round5Picks.addEventListener('change', (e) => {
        state.round5AddPicks = Math.max(0, parseInt(e.target.value) || 0);
        updateDisplay();
      });
    }
    
    const round8Check = document.getElementById('pacRound8');
    const round8Input = document.getElementById('pacRound8Input');
    const round8Picks = document.getElementById('pacRound8Picks');
    
    if (round8Check) {
      round8Check.addEventListener('change', (e) => {
        state.round8Enabled = e.target.checked;
        round8Input.classList.toggle('hidden', !e.target.checked);
        updateDisplay();
      });
    }
    
    if (round8Picks) {
      round8Picks.addEventListener('change', (e) => {
        state.round8AddPicks = Math.max(0, parseInt(e.target.value) || 0);
        updateDisplay();
      });
    }
    
    const round11Check = document.getElementById('pacRound11');
    const round11Input = document.getElementById('pacRound11Input');
    const round11Picks = document.getElementById('pacRound11Picks');
    
    if (round11Check) {
      round11Check.addEventListener('change', (e) => {
        state.round11Enabled = e.target.checked;
        round11Input.classList.toggle('hidden', !e.target.checked);
        updateDisplay();
      });
    }
    
    if (round11Picks) {
      round11Picks.addEventListener('change', (e) => {
        state.round11AddPicks = Math.max(0, parseInt(e.target.value) || 0);
        updateDisplay();
      });
    }

    // Portal Regionals
    const portalInputs = {
      'pacPortalCommon2': ['common', 'twoStar'],
      'pacPortalCommon3': ['common', 'threeStar'],
      'pacPortalUncommon2': ['uncommon', 'twoStar'],
      'pacPortalUncommon3': ['uncommon', 'threeStar'],
      'pacPortalRare2': ['rare', 'twoStar'],
      'pacPortalRare3': ['rare', 'threeStar'],
      'pacPortalEpic2': ['epic', 'twoStar'],
      'pacPortalEpic3': ['epic', 'threeStar'],
      'pacPortalUltra2': ['ultra', 'twoStar'],
      'pacPortalUltra3': ['ultra', 'threeStar']
    };
    
    Object.entries(portalInputs).forEach(([id, [rarity, evo]]) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', (e) => {
          state.portalRegionals[rarity][evo] = Math.max(0, parseInt(e.target.value) || 0);
          updateDisplay();
        });
      }
    });

    // Player name input
    const playerNameInput = document.getElementById('pacPlayerName');
    if (playerNameInput) {
      playerNameInput.addEventListener('input', (e) => {
        state.playerName = e.target.value.trim();
        // Save to localStorage for persistence
        try {
          localStorage.setItem('pac_playerName', state.playerName);
        } catch (err) {
          if (DEBUG_MODE) console.warn('Failed to save playerName to localStorage:', err);
        }
      });
    }

    // Setup autocomplete
    setupAutocomplete();
    
    // Live tracking toggle
    document.getElementById('pacLiveToggle').addEventListener('click', () => {
      liveTrackingActive = !liveTrackingActive;
      const toggleBtn = document.getElementById('pacLiveToggle');
      const statusText = document.getElementById('pacLiveStatus');
      
      if (liveTrackingActive) {
        toggleBtn.classList.add('active');
        statusText.textContent = 'ON';
        startLiveExtraction();
      } else {
        toggleBtn.classList.remove('active');
        statusText.textContent = 'OFF';
        stopLiveExtraction();
      }
    });
    
    // Poll speed selector
    document.getElementById('pacPollSpeed').addEventListener('change', (e) => {
      currentPollSpeed = parseInt(e.target.value);
      // Restart extraction if already active
      if (liveTrackingActive && extractionInterval) {
        stopLiveExtraction();
        startLiveExtraction();
      }
    });
  }
  
  function stopLiveExtraction() {
    if (extractionInterval) {
      clearInterval(extractionInterval);
      extractionInterval = null;
    }
    isConnected = false;
    document.getElementById('pacStatusDot').classList.remove('connected');
    document.getElementById('pacLiveIndicator').style.display = 'none';
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DISPLAY UPDATE
  // ═══════════════════════════════════════════════════════════════════════════

  function formatPercent(val, decimals = 2) {
    if (val === 0) return '0.' + '0'.repeat(decimals) + '%';
    if (val < Math.pow(10, -decimals)) return '<0.' + '0'.repeat(decimals - 1) + '1%';
    return val.toFixed(decimals) + '%';
  }

  function formatRolls(val) {
    if (!isFinite(val)) return '∞';
    return Math.ceil(val) + ' rolls';
  }

  function formatGold(val) {
    if (!isFinite(val)) return '∞g';
    return Math.ceil(val) + 'g';
  }

  function updateDisplay() {
    const r = calculate();
    
    // Main results - show MAXED or UNAVAILABLE if applicable
    const perRefreshEl = document.getElementById('pacPerRefresh');
    if (r.notAvailable) {
      perRefreshEl.textContent = '0%';
      perRefreshEl.style.color = '#ef4444';
    } else if (r.isMaxed) {
      perRefreshEl.textContent = 'MAXED ✓';
      perRefreshEl.style.color = '#4caf50';
    } else {
      perRefreshEl.textContent = formatPercent(
        state.dittoEnabled ? r.perRefreshWithDitto : r.perRefresh, 2
      );
      perRefreshEl.style.color = ''; // Reset to default
    }
    
    // Dynamic confidence
    document.getElementById('pacConfidence').textContent = (r.isMaxed || r.notAvailable) ? '—' : formatRolls(r.expectedForConfidence);
    document.getElementById('pacGoldConfidence').textContent = (r.isMaxed || r.notAvailable) ? '—' : formatGold(r.goldForConfidence);
    
    // Footer
    document.getElementById('pacPoolInfo').textContent = r.notAvailable ? 'N/A' : (r.isMaxed ? 'MAXED' : `${r.targetCopies}/${r.maxTargetCopies}`);
    document.getElementById('pacRateInfo').textContent = r.notAvailable ? '0' : r.rarityChance.toFixed(0);
    
    // Status messages
    const wildStatus = document.getElementById('pacStatusWild');
    const poolStatus = document.getElementById('pacStatusPool');
    wildStatus.className = 'pac-status-msg';
    poolStatus.className = 'pac-status-msg';
    wildStatus.textContent = '';
    poolStatus.textContent = '';
    
    if (r.wildTargetImpossible) {
      wildStatus.textContent = `❌ No Wild ${state.targetRarity} ${state.targetEvo === 'twoStar' ? '2★' : '3★'} exist`;
      wildStatus.className = 'pac-status-msg error';
    } else if (state.targetIsWild && r.wildBoost === 0) {
      wildStatus.textContent = '⚠️ Need PVE or Wild owned';
      wildStatus.className = 'pac-status-msg warning';
    }
    
    // Show impossible/danger/maxed status for main target
    if (r.isMaxed && state.targetPokemon) {
      poolStatus.textContent = `✓ MAXED (${r.copiesOwned}/${r.copiesNeeded})`;
      poolStatus.className = 'pac-status-msg success';
    } else if (r.isImpossible && state.targetPokemon) {
      const available = r.targetCopies + r.copiesOwned;
      poolStatus.textContent = `✗ IMPOSSIBLE - Only ${available}/${r.copiesNeeded} available`;
      poolStatus.className = 'pac-status-msg error';
    } else if (r.isDanger && state.targetPokemon) {
      const available = r.targetCopies + r.copiesOwned;
      poolStatus.textContent = `⚠ DANGER - Only ${available}/${r.copiesNeeded} available`;
      poolStatus.className = 'pac-status-msg warning';
    } else if (r.targetCopies === 0) {
      poolStatus.textContent = '❌ Pool depleted!';
      poolStatus.className = 'pac-status-msg error';
    } else if (r.targetCopies <= 3) {
      poolStatus.textContent = `⚠️ Only ${r.targetCopies} copies left`;
      poolStatus.className = 'pac-status-msg warning';
    }
    
    // Update team panel if it exists
    if (state.teamTargets.length > 0) {
      updateTeamDisplay();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // REFRESH BLOCKER (v3.0.2 personal)
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Show the refresh blocker overlay positioned over the game's refresh button
   */
  function showRefreshBlocker(pokemonName) {
    if (!state.refreshBlockerEnabled) return;
    
    const blocker = document.getElementById('pac-refresh-blocker');
    const refreshBtn = document.querySelector('button.bubbly.blue.refresh-button');
    
    if (!blocker || !refreshBtn) {
      if (DEBUG_MODE) console.log('❌ Blocker: Missing elements', { blocker: !!blocker, refreshBtn: !!refreshBtn });
      return;
    }
    
    // Get refresh button position and size
    const rect = refreshBtn.getBoundingClientRect();
    
    // Make blocker bigger than the button (extra padding)
    const padding = 20;
    const width = rect.width + (padding * 2);
    const height = rect.height + (padding * 2);
    
    // Position blocker over refresh button
    blocker.style.left = `${rect.left - padding}px`;
    blocker.style.top = `${rect.top - padding}px`;
    blocker.style.width = `${width}px`;
    blocker.style.height = `${height}px`;
    blocker.style.minWidth = '150px';
    blocker.style.minHeight = '80px';
    
    // Update pokemon name
    const nameEl = document.getElementById('blockerPokemonName');
    if (nameEl) nameEl.textContent = pokemonName;
    
    // Show blocker
    blocker.classList.add('visible');
    state.refreshBlockerVisible = true;
    state.refreshBlockerTrigger = pokemonName;
    
    if (DEBUG_MODE) console.log(`🛑 BLOCKER: Showing for ${pokemonName}`);
  }
  
  /**
   * Hide the refresh blocker overlay
   */
  function hideRefreshBlocker(userDismissed = false) {
    const blocker = document.getElementById('pac-refresh-blocker');
    if (blocker) {
      blocker.classList.remove('visible');
    }
    
    // If user dismissed, remember this Pokemon so we don't show again
    if (userDismissed && state.refreshBlockerTrigger) {
      state.refreshBlockerDismissed = state.refreshBlockerTrigger;
      if (DEBUG_MODE) console.log(`🟢 BLOCKER: User dismissed ${state.refreshBlockerDismissed}`);
    } else {
      // Target left shop naturally - clear dismissed tracker
      state.refreshBlockerDismissed = null;
      if (DEBUG_MODE) console.log('🟢 BLOCKER: Hidden (target left shop)');
    }
    
    state.refreshBlockerVisible = false;
    state.refreshBlockerTrigger = null;
  }
  
  /**
   * Setup blocker dismiss button
   */
  function setupRefreshBlocker() {
    const dismissBtn = document.getElementById('blockerDismiss');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        hideRefreshBlocker(true); // User dismissed - don't show again for this Pokemon
      });
    }
    
    // Also hide on clicking the blocker itself (but not the dismiss button)
    const blocker = document.getElementById('pac-refresh-blocker');
    if (blocker) {
      blocker.addEventListener('click', (e) => {
        if (e.target === blocker || e.target.classList.contains('blocker-title') || e.target.classList.contains('blocker-pokemon')) {
          // Don't dismiss on body click - only X button
        }
      });
    }
    
    if (DEBUG_MODE) console.log('🛑 Refresh blocker initialized');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MONO-TYPE MODE (Experimental)
  // ═══════════════════════════════════════════════════════════════════════════

  const MONO_TYPE_LIST = [
    'water', 'fire', 'grass', 'electric', 'ice', 'fighting', 
    'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 
    'ghost', 'dragon', 'dark', 'steel', 'fairy', 'normal'
  ];

  const MONO_TYPE_COLORS = {
    water: '#6390F0', fire: '#EE8130', grass: '#7AC74C', electric: '#F7D02C',
    ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1', ground: '#E2BF65',
    flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A', rock: '#B6A136',
    ghost: '#735797', dragon: '#6F35FC', dark: '#705746', steel: '#B7B7CE',
    fairy: '#D685AD', normal: '#A8A77A'
  };

  function setupMonoTypePanel() {
    const grid = document.getElementById('pacMonoGrid');
    const header = document.getElementById('pacMonoHeader');
    const panel = document.getElementById('pacMonoPanel');
    const clearBtn = document.getElementById('pacMonoClear');
    
    if (!grid || !header) return;
    
    // Populate grid with type buttons
    grid.innerHTML = MONO_TYPE_LIST.map(type => {
      const color = MONO_TYPE_COLORS[type] || '#888';
      const textColor = ['electric', 'ice', 'ground', 'steel', 'normal'].includes(type) ? '#333' : '#fff';
      return `<button class="pac-mono-btn" data-type="${type}" style="background: ${color}; color: ${textColor};">${type}</button>`;
    }).join('');
    
    // Header click to expand/collapse
    header.addEventListener('click', () => {
      panel.classList.toggle('expanded');
    });
    
    // Type button clicks
    grid.querySelectorAll('.pac-mono-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        selectMonoType(type);
      });
    });
    
    // Clear button
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        clearMonoType();
      });
    }
    
    // Spin wheel button
    const spinBtn = document.getElementById('pacMonoSpinBtn');
    if (spinBtn) {
      spinBtn.addEventListener('click', () => {
        spinMonoTypeWheel();
      });
    }
    
    if (DEBUG_MODE) console.log('🎯 Mono-type panel initialized');
  }
  
  let monoWheelSpinning = false;
  
  function spinMonoTypeWheel() {
    if (monoWheelSpinning) return;
    monoWheelSpinning = true;
    
    const spinBtn = document.getElementById('pacMonoSpinBtn');
    const wheelType = document.getElementById('pacMonoWheelType');
    
    if (spinBtn) spinBtn.disabled = true;
    if (wheelType) wheelType.classList.add('spinning');
    
    // Randomly determine final type
    const finalType = MONO_TYPE_LIST[Math.floor(Math.random() * MONO_TYPE_LIST.length)];
    
    // Spin parameters
    const totalSpins = 25 + Math.floor(Math.random() * 15); // 25-40 type changes
    let currentSpin = 0;
    let currentIndex = Math.floor(Math.random() * MONO_TYPE_LIST.length);
    
    // Calculate delays - start fast, slow down
    function getDelay(spin, total) {
      const progress = spin / total;
      // Ease out - starts at 50ms, ends around 300ms
      return 50 + (progress * progress * 250);
    }
    
    function doSpin() {
      currentSpin++;
      
      // On last few spins, make sure we land on the final type
      let displayType;
      if (currentSpin >= totalSpins - 3) {
        // Final approach - step toward final type
        const remaining = totalSpins - currentSpin;
        const finalIndex = MONO_TYPE_LIST.indexOf(finalType);
        if (remaining === 0) {
          displayType = finalType;
        } else {
          // Get a type that's not the final one yet
          do {
            currentIndex = (currentIndex + 1) % MONO_TYPE_LIST.length;
          } while (currentIndex === finalIndex && remaining > 0);
          displayType = MONO_TYPE_LIST[currentIndex];
        }
      } else {
        // Normal spinning
        currentIndex = (currentIndex + 1) % MONO_TYPE_LIST.length;
        displayType = MONO_TYPE_LIST[currentIndex];
      }
      
      // Update wheel display
      if (wheelType) {
        const color = MONO_TYPE_COLORS[displayType] || '#888';
        const textColor = ['electric', 'ice', 'ground', 'steel', 'normal'].includes(displayType) ? '#333' : '#fff';
        wheelType.style.background = color;
        wheelType.style.color = textColor;
        wheelType.textContent = displayType.toUpperCase();
      }
      
      if (currentSpin < totalSpins) {
        setTimeout(doSpin, getDelay(currentSpin, totalSpins));
      } else {
        // Done spinning - select the type
        setTimeout(() => {
          if (wheelType) wheelType.classList.remove('spinning');
          if (spinBtn) spinBtn.disabled = false;
          monoWheelSpinning = false;
          
          // Select the final type
          selectMonoType(finalType);
          showNotification(`🎰 Wheel landed on ${finalType.toUpperCase()}!`, 'success');
        }, 500);
      }
    }
    
    // Start the spin
    doSpin();
  }

  function selectMonoType(type) {
    state.monoTypeEnabled = true;
    state.monoTypeSelected = type;
    
    // Update UI
    const grid = document.getElementById('pacMonoGrid');
    const status = document.getElementById('pacMonoStatus');
    const clearBtn = document.getElementById('pacMonoClear');
    
    if (grid) {
      grid.querySelectorAll('.pac-mono-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.type === type);
      });
    }
    
    if (status) {
      status.textContent = `Blocking non-${type.toUpperCase()} Pokemon`;
      status.classList.add('active');
    }
    
    if (clearBtn) {
      clearBtn.style.display = 'block';
    }
    
    showNotification(`🎯 Mono-type: ${type.toUpperCase()}`, 'success');
    if (DEBUG_MODE) console.log(`🎯 Mono-type selected: ${type}`);
    
    // Update blockers immediately
    updateMonoTypeBlockers();
  }

  function clearMonoType() {
    state.monoTypeEnabled = false;
    state.monoTypeSelected = null;
    
    // Update UI
    const grid = document.getElementById('pacMonoGrid');
    const status = document.getElementById('pacMonoStatus');
    const clearBtn = document.getElementById('pacMonoClear');
    
    if (grid) {
      grid.querySelectorAll('.pac-mono-btn').forEach(btn => {
        btn.classList.remove('selected');
      });
    }
    
    if (status) {
      status.textContent = 'Select a type to block others';
      status.classList.remove('active');
    }
    
    if (clearBtn) {
      clearBtn.style.display = 'none';
    }
    
    // Clear all blockers
    clearMonoTypeBlockers();
    
    showNotification('Mono-type cleared', 'info');
    if (DEBUG_MODE) console.log('🎯 Mono-type cleared');
  }

  function clearMonoTypeBlockers() {
    document.querySelectorAll('.pac-mono-blocker').forEach(blocker => {
      blocker.remove();
    });
  }

  function updateMonoTypeBlockers() {
    if (!state.monoTypeEnabled || !state.monoTypeSelected) {
      clearMonoTypeBlockers();
      return;
    }
    
    // Find shop slot elements
    const shopContainer = document.querySelector('ul.game-pokemons-store');
    if (!shopContainer) {
      return;
    }
    
    const shopSlots = shopContainer.querySelectorAll('div.my-box.clickable.game-pokemon-portrait');
    if (!shopSlots.length) {
      return;
    }
    
    // Clear existing blockers
    clearMonoTypeBlockers();
    
    // Read types directly from each slot's synergy icons
    shopSlots.forEach((slot) => {
      // Get synergy icons - they're inside ul.game-pokemon-portrait-types > li > img.synergy-icon
      const synergyIcons = slot.querySelectorAll('img.synergy-icon');
      const types = Array.from(synergyIcons).map(icon => icon.alt?.toLowerCase()).filter(Boolean);
      
      if (types.length === 0) return;
      
      // Check if any type matches the selected mono-type
      const hasType = types.includes(state.monoTypeSelected);
      
      if (!hasType) {
        // Get slot position
        const rect = slot.getBoundingClientRect();
        
        // Create blocker as fixed element on body (not child of slot)
        // This prevents tooltip from triggering since we're not hovering the slot
        const blocker = document.createElement('div');
        blocker.className = 'pac-mono-blocker';
        blocker.innerHTML = '🚫';
        blocker.title = `Not ${state.monoTypeSelected.toUpperCase()} type`;
        
        // Position exactly over the slot
        blocker.style.top = (rect.top - 5) + 'px';
        blocker.style.left = (rect.left - 5) + 'px';
        blocker.style.width = (rect.width + 10) + 'px';
        blocker.style.height = (rect.height + 10) + 'px';
        
        document.body.appendChild(blocker);
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RANDOM DRAFT CHALLENGE (Experimental)
  // ═══════════════════════════════════════════════════════════════════════════

  function setupRandomDraftPanel() {
    const toggleBtn = document.getElementById('pacDraftToggle');
    if (!toggleBtn) return;
    
    toggleBtn.addEventListener('click', () => {
      if (state.randomDraftEnabled) {
        stopRandomDraft();
      } else {
        startRandomDraft();
      }
    });
    
    if (DEBUG_MODE) console.log('🎲 Random Draft panel initialized');
  }

  function startRandomDraft() {
    state.randomDraftEnabled = true;
    state.randomDraftChosenSlot = null;
    state.randomDraftLastShop = null;
    
    const toggleBtn = document.getElementById('pacDraftToggle');
    const statusEl = document.getElementById('pacDraftStatus');
    
    if (toggleBtn) {
      toggleBtn.textContent = 'Stop';
      toggleBtn.classList.add('active');
    }
    
    showNotification('🎲 Random Draft started!', 'success');
    if (DEBUG_MODE) console.log('🎲 Random Draft started');
    
    // Trigger first spin if shop is visible
    triggerRandomDraftSpin();
  }

  function stopRandomDraft() {
    state.randomDraftEnabled = false;
    state.randomDraftChosenSlot = null;
    state.randomDraftSpinning = false;
    state.randomDraftLastShop = null;
    
    const toggleBtn = document.getElementById('pacDraftToggle');
    const statusEl = document.getElementById('pacDraftStatus');
    
    if (toggleBtn) {
      toggleBtn.textContent = 'Start';
      toggleBtn.classList.remove('active');
    }
    
    if (statusEl) {
      statusEl.classList.remove('active');
    }
    
    clearRandomDraftOverlays();
    showNotification('🎲 Random Draft stopped', 'info');
    if (DEBUG_MODE) console.log('🎲 Random Draft stopped');
  }

  function clearRandomDraftOverlays() {
    document.querySelectorAll('.pac-draft-blocker, .pac-draft-spin-highlight, .pac-draft-chosen-highlight').forEach(el => el.remove());
  }

  function getShopSlots() {
    const shopContainer = document.querySelector('ul.game-pokemons-store');
    if (!shopContainer) return [];
    return Array.from(shopContainer.querySelectorAll('div.my-box.clickable.game-pokemon-portrait'));
  }

  function triggerRandomDraftSpin() {
    if (!state.randomDraftEnabled || state.randomDraftSpinning) return;
    
    const shopSlots = getShopSlots();
    if (shopSlots.length === 0) {
      if (DEBUG_MODE) console.log('🎲 No shop slots found, waiting...');
      return;
    }
    
    // Clear any existing overlays
    clearRandomDraftOverlays();
    
    state.randomDraftSpinning = true;
    state.randomDraftChosenSlot = null;
    
    const statusEl = document.getElementById('pacDraftStatus');
    if (statusEl) {
      statusEl.textContent = '🎰 Spinning...';
      statusEl.classList.add('active');
    }
    
    // Determine final slot
    const finalSlotIndex = Math.floor(Math.random() * shopSlots.length);
    
    // Spin parameters
    const totalSpins = 15 + Math.floor(Math.random() * 10); // 15-25 slot changes
    let currentSpin = 0;
    let currentIndex = Math.floor(Math.random() * shopSlots.length);
    
    // Create spin highlight element
    const spinHighlight = document.createElement('div');
    spinHighlight.className = 'pac-draft-spin-highlight';
    document.body.appendChild(spinHighlight);
    
    function getDelay(spin, total) {
      const progress = spin / total;
      // Ease out - starts at 60ms, ends around 250ms
      return 60 + (progress * progress * 190);
    }
    
    function doSpin() {
      currentSpin++;
      
      // Get current slots (may have changed)
      const currentShopSlots = getShopSlots();
      if (currentShopSlots.length === 0) {
        spinHighlight.remove();
        state.randomDraftSpinning = false;
        return;
      }
      
      // Determine which slot to highlight
      let displayIndex;
      if (currentSpin >= totalSpins) {
        // Final slot
        displayIndex = Math.min(finalSlotIndex, currentShopSlots.length - 1);
      } else if (currentSpin >= totalSpins - 3) {
        // Final approach - step toward final slot
        const remaining = totalSpins - currentSpin;
        if (remaining === 0) {
          displayIndex = Math.min(finalSlotIndex, currentShopSlots.length - 1);
        } else {
          do {
            currentIndex = (currentIndex + 1) % currentShopSlots.length;
          } while (currentIndex === finalSlotIndex && remaining > 0);
          displayIndex = currentIndex;
        }
      } else {
        // Normal spinning
        currentIndex = (currentIndex + 1) % currentShopSlots.length;
        displayIndex = currentIndex;
      }
      
      // Position highlight over current slot
      const slot = currentShopSlots[displayIndex];
      if (slot) {
        const rect = slot.getBoundingClientRect();
        spinHighlight.style.top = (rect.top - 8) + 'px';
        spinHighlight.style.left = (rect.left - 8) + 'px';
        spinHighlight.style.width = (rect.width + 16) + 'px';
        spinHighlight.style.height = (rect.height + 16) + 'px';
      }
      
      if (currentSpin < totalSpins) {
        setTimeout(doSpin, getDelay(currentSpin, totalSpins));
      } else {
        // Done spinning
        setTimeout(() => {
          spinHighlight.remove();
          state.randomDraftSpinning = false;
          state.randomDraftChosenSlot = displayIndex;
          
          // Store current shop state to detect purchases
          state.randomDraftLastShop = currentShopSlots.length;
          
          // Apply chosen highlight and blockers
          applyRandomDraftSelection(displayIndex);
          
          if (statusEl) {
            statusEl.textContent = `✅ Buy slot ${displayIndex + 1}!`;
          }
          
          showNotification(`🎲 Buy slot ${displayIndex + 1}!`, 'success');
          if (DEBUG_MODE) console.log(`🎲 Random Draft chose slot ${displayIndex + 1}`);
        }, 300);
      }
    }
    
    // Start the spin
    doSpin();
  }

  function applyRandomDraftSelection(chosenIndex) {
    const shopSlots = getShopSlots();
    if (shopSlots.length === 0) return;
    
    // Clear any existing overlays
    clearRandomDraftOverlays();
    
    shopSlots.forEach((slot, index) => {
      const rect = slot.getBoundingClientRect();
      
      if (index === chosenIndex) {
        // Chosen slot - green highlight
        const highlight = document.createElement('div');
        highlight.className = 'pac-draft-chosen-highlight';
        highlight.style.top = (rect.top - 8) + 'px';
        highlight.style.left = (rect.left - 8) + 'px';
        highlight.style.width = (rect.width + 16) + 'px';
        highlight.style.height = (rect.height + 16) + 'px';
        document.body.appendChild(highlight);
      } else {
        // Other slots - red blocker
        const blocker = document.createElement('div');
        blocker.className = 'pac-draft-blocker';
        blocker.innerHTML = '❌';
        blocker.title = 'Random Draft - not your pick!';
        blocker.style.top = (rect.top - 5) + 'px';
        blocker.style.left = (rect.left - 5) + 'px';
        blocker.style.width = (rect.width + 10) + 'px';
        blocker.style.height = (rect.height + 10) + 'px';
        document.body.appendChild(blocker);
      }
    });
  }

  function updateRandomDraftBlockers() {
    if (!state.randomDraftEnabled) return;
    
    const shopSlots = getShopSlots();
    
    // Check if shop changed (purchase made or refresh)
    if (state.randomDraftChosenSlot !== null) {
      // If fewer slots than before, player bought something
      if (state.randomDraftLastShop !== null && shopSlots.length < state.randomDraftLastShop) {
        if (DEBUG_MODE) console.log('🎲 Purchase detected, re-spinning...');
        // Clear and re-spin after brief delay
        clearRandomDraftOverlays();
        state.randomDraftChosenSlot = null;
        state.randomDraftLastShop = null;
        
        const statusEl = document.getElementById('pacDraftStatus');
        if (statusEl) {
          statusEl.textContent = '🎰 Spinning...';
        }
        
        setTimeout(() => {
          triggerRandomDraftSpin();
        }, 500);
        return;
      }
      
      // If more slots than before, shop refreshed
      if (state.randomDraftLastShop !== null && shopSlots.length > state.randomDraftLastShop) {
        if (DEBUG_MODE) console.log('🎲 Shop refresh detected, re-spinning...');
        clearRandomDraftOverlays();
        state.randomDraftChosenSlot = null;
        state.randomDraftLastShop = null;
        
        setTimeout(() => {
          triggerRandomDraftSpin();
        }, 300);
        return;
      }
      
      // Update positions of existing overlays (in case of scroll/resize)
      applyRandomDraftSelection(state.randomDraftChosenSlot);
      state.randomDraftLastShop = shopSlots.length;
    } else if (!state.randomDraftSpinning && shopSlots.length > 0) {
      // No chosen slot and not spinning - trigger new spin
      triggerRandomDraftSpin();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // COPYCAT CHALLENGE (Experimental)
  // ═══════════════════════════════════════════════════════════════════════════

  function setupCopycatPanel() {
    const toggleBtn = document.getElementById('pacCopycatToggle');
    if (!toggleBtn) return;
    
    toggleBtn.addEventListener('click', () => {
      if (state.copycatEnabled) {
        stopCopycat();
      } else {
        startCopycat();
      }
    });
    
    if (DEBUG_MODE) console.log('🐱 Copycat panel initialized');
  }

  function startCopycat() {
    state.copycatEnabled = true;
    
    const toggleBtn = document.getElementById('pacCopycatToggle');
    const statusEl = document.getElementById('pacCopycatStatus');
    
    if (toggleBtn) {
      toggleBtn.textContent = 'Stop';
      toggleBtn.classList.add('active');
    }
    
    if (statusEl) {
      statusEl.classList.add('active');
    }
    
    showNotification('🐱 Copycat started! Only buy what others have!', 'success');
    if (DEBUG_MODE) console.log('🐱 Copycat started');
    
    // Update blockers immediately
    updateCopycatBlockers();
  }

  function stopCopycat() {
    state.copycatEnabled = false;
    
    const toggleBtn = document.getElementById('pacCopycatToggle');
    const statusEl = document.getElementById('pacCopycatStatus');
    
    if (toggleBtn) {
      toggleBtn.textContent = 'Start';
      toggleBtn.classList.remove('active');
    }
    
    if (statusEl) {
      statusEl.classList.remove('active');
    }
    
    clearCopycatBlockers();
    showNotification('🐱 Copycat stopped', 'info');
    if (DEBUG_MODE) console.log('🐱 Copycat stopped');
  }

  function clearCopycatBlockers() {
    document.querySelectorAll('.pac-copycat-blocker').forEach(el => el.remove());
  }

  function getOtherPlayersPokemon() {
    // Get all Pokemon that OTHER players have on their boards/benches
    const otherPlayersPokemon = new Set();
    
    if (!lastPoolData || !state.playerName) {
      return otherPlayersPokemon;
    }
    
    const allBoards = lastPoolData.playerBoards || {};
    const allBenches = lastPoolData.playerBenches || {};
    
    // Get all player names except self
    const otherPlayers = new Set([
      ...Object.keys(allBoards),
      ...Object.keys(allBenches)
    ]);
    otherPlayers.delete(state.playerName);
    
    // Collect all Pokemon from other players
    otherPlayers.forEach(playerName => {
      const board = allBoards[playerName] || [];
      const bench = allBenches[playerName] || [];
      
      [...board, ...bench].forEach(unit => {
        const unitName = typeof unit === 'string' ? unit : unit?.name;
        if (unitName) {
          const baseName = unitName.toUpperCase();
          
          // Get the base form and full evolution family
          const baseForm = getBaseForm(baseName);
          const family = getEvolutionFamily(baseForm);
          
          // Add all members of the evolution family
          family.forEach(name => otherPlayersPokemon.add(name));
        }
      });
    });
    
    return otherPlayersPokemon;
  }

  function updateCopycatBlockers() {
    if (!state.copycatEnabled) {
      clearCopycatBlockers();
      return;
    }
    
    // Find shop slot elements
    const shopContainer = document.querySelector('ul.game-pokemons-store');
    if (!shopContainer) return;
    
    const shopSlots = shopContainer.querySelectorAll('div.my-box.clickable.game-pokemon-portrait');
    if (!shopSlots.length) return;
    
    // Get the player's shop data directly from lastPoolData
    const playerShop = lastPoolData?.playerShops?.[state.playerName] || [];
    const shopMapping = playerShop
      .filter(name => name && name !== 'DEFAULT')
      .map(name => name.toUpperCase());
    
    if (shopMapping.length === 0) return;
    
    // Get Pokemon that other players have
    const contestedPokemon = getOtherPlayersPokemon();
    
    // Clear existing blockers
    clearCopycatBlockers();
    
    // Get status element for count
    const statusEl = document.getElementById('pacCopycatStatus');
    let blockedCount = 0;
    
    // Check each shop slot using shopMapping
    shopSlots.forEach((slot, index) => {
      const pokemonName = shopMapping[index];
      
      // Skip empty slots
      if (!pokemonName) return;
      
      // Check if this Pokemon (or its evolution family) is contested
      const baseForm = getBaseForm(pokemonName);
      const family = getEvolutionFamily(baseForm);
      
      // Check if any evolution family member is in contested set
      const isContested = family.some(name => contestedPokemon.has(name));
      
      if (!isContested) {
        // Block this slot - nobody else has this Pokemon
        const rect = slot.getBoundingClientRect();
        
        const blocker = document.createElement('div');
        blocker.className = 'pac-copycat-blocker';
        blocker.innerHTML = `<span>🚫</span><span class="pac-copycat-blocker-text">Uncontested</span>`;
        blocker.title = `No other player has ${pokemonName}`;
        
        blocker.style.top = (rect.top - 5) + 'px';
        blocker.style.left = (rect.left - 5) + 'px';
        blocker.style.width = (rect.width + 10) + 'px';
        blocker.style.height = (rect.height + 10) + 'px';
        
        document.body.appendChild(blocker);
        blockedCount++;
      }
    });
    
    // Update status with count
    if (statusEl) {
      const availableCount = shopSlots.length - blockedCount;
      if (contestedPokemon.size === 0) {
        statusEl.textContent = '⚠️ No player data yet - open Counter Intel';
      } else if (availableCount === 0) {
        statusEl.textContent = '😿 No contested Pokemon in shop!';
      } else if (blockedCount === 0) {
        statusEl.textContent = '😺 All Pokemon are contested!';
      } else {
        statusEl.textContent = `🐱 ${availableCount} contested, ${blockedCount} blocked`;
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MLG MODE (Experimental) - 420 NO SCOPE
  // ═══════════════════════════════════════════════════════════════════════════

  const MLG_TEXTS = [
    'MOM GET THE CAMERA',
    'GET REKT',
    '360 NO SCOPE',
    'SHREKT',
    'OH BABY A TRIPLE',
    'WOMBO COMBO',
    'DAMN SON',
    'WOW',
    'SMOKE WEED EVERYDAY',
    'BLAZEIT',
    'AIRHORN',
    'SNIPED',
    'GIT GUD',
    'REKT',
    'EZ',
    'OHHHHH',
    'ILLUMINATI CONFIRMED'
  ];

  function setupMlgPanel() {
    const toggleBtn = document.getElementById('pacMlgToggle');
    if (!toggleBtn) return;
    
    toggleBtn.addEventListener('click', () => {
      if (state.mlgModeEnabled) {
        stopMlgMode();
      } else {
        startMlgMode();
      }
    });
    
    if (DEBUG_MODE) console.log('🔥 MLG panel initialized');
  }

  function startMlgMode() {
    state.mlgModeEnabled = true;
    state.mlgLastBoardSnapshot = null;  // Reset so we don't trigger immediately
    
    const toggleBtn = document.getElementById('pacMlgToggle');
    const statusEl = document.getElementById('pacMlgStatus');
    
    if (toggleBtn) {
      toggleBtn.textContent = 'Stop';
      toggleBtn.classList.add('active');
    }
    
    if (statusEl) {
      statusEl.classList.add('active');
    }
    
    // Epic entrance effect
    triggerMlgText('BLAZEIT 420', window.innerWidth / 2, window.innerHeight / 2);
    triggerMlgIlluminati(10);
    triggerMlgHitmarkers(15);
    triggerMlgDoritos(10);
    triggerMlgWeed(10);
    triggerMlgScreenShake();
    setTimeout(() => triggerMlgAirhorn(), 300);
    setTimeout(() => triggerMlg360Text(), 500);
    
    showNotification('🔥 MLG MODE ACTIVATED - 360 NO SCOPE', 'success');
    if (DEBUG_MODE) console.log('🔥 MLG Mode started');
  }

  function stopMlgMode() {
    state.mlgModeEnabled = false;
    
    const toggleBtn = document.getElementById('pacMlgToggle');
    const statusEl = document.getElementById('pacMlgStatus');
    
    if (toggleBtn) {
      toggleBtn.textContent = 'Start';
      toggleBtn.classList.remove('active');
    }
    
    if (statusEl) {
      statusEl.classList.remove('active');
    }
    
    // Clear any MLG overlays
    document.querySelectorAll('.pac-mlg-hitmarker, .pac-mlg-text, .pac-mlg-lensflare, .pac-mlg-illuminati, .pac-mlg-dorito, .pac-mlg-sample, .pac-mlg-360, .pac-mlg-airhorn, .pac-mlg-weed, .pac-mlg-snoop').forEach(el => el.remove());
    
    showNotification('MLG Mode deactivated', 'info');
    if (DEBUG_MODE) console.log('🔥 MLG Mode stopped');
  }

  function triggerMlgHitmarker(x, y) {
    if (!state.mlgModeEnabled) return;
    
    const hitmarker = document.createElement('div');
    hitmarker.className = 'pac-mlg-hitmarker';
    hitmarker.style.left = (x - 30) + 'px';
    hitmarker.style.top = (y - 30) + 'px';
    document.body.appendChild(hitmarker);
    
    setTimeout(() => hitmarker.remove(), 300);
  }

  function triggerMlgHitmarkers(count = 3) {
    if (!state.mlgModeEnabled) return;
    
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        triggerMlgHitmarker(x, y);
      }, i * 100);
    }
  }

  function triggerMlgText(text, x, y) {
    if (!state.mlgModeEnabled) return;
    
    const textEl = document.createElement('div');
    textEl.className = 'pac-mlg-text';
    textEl.textContent = text || MLG_TEXTS[Math.floor(Math.random() * MLG_TEXTS.length)];
    textEl.style.left = (x - 150) + 'px';
    textEl.style.top = (y - 30) + 'px';
    document.body.appendChild(textEl);
    
    setTimeout(() => textEl.remove(), 1000);
  }

  function triggerMlgLensFlare(x, y) {
    if (!state.mlgModeEnabled) return;
    
    const flare = document.createElement('div');
    flare.className = 'pac-mlg-lensflare';
    flare.style.left = (x - 100) + 'px';
    flare.style.top = (y - 100) + 'px';
    document.body.appendChild(flare);
    
    setTimeout(() => flare.remove(), 800);
  }

  function triggerMlgIlluminati(count = 5) {
    if (!state.mlgModeEnabled) return;
    
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const triangle = document.createElement('div');
        triangle.className = 'pac-mlg-illuminati';
        
        // Random start position
        triangle.style.left = (Math.random() * (window.innerWidth - 160)) + 'px';
        triangle.style.top = (Math.random() * (window.innerHeight - 140)) + 'px';
        
        // Random fly direction
        const flyX = (Math.random() - 0.5) * 400;
        const flyY = (Math.random() - 0.5) * 400;
        triangle.style.setProperty('--fly-x', flyX + 'px');
        triangle.style.setProperty('--fly-y', flyY + 'px');
        
        document.body.appendChild(triangle);
        
        setTimeout(() => triangle.remove(), 2000);
      }, i * 150);
    }
  }

  function triggerMlgDoritos(count = 5) {
    if (!state.mlgModeEnabled) return;
    
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const dorito = document.createElement('div');
        dorito.className = 'pac-mlg-dorito';
        dorito.textContent = '🔺';
        dorito.style.left = (Math.random() * window.innerWidth) + 'px';
        dorito.style.top = '-100px';
        document.body.appendChild(dorito);
        
        setTimeout(() => dorito.remove(), 2000);
      }, i * 200);
    }
  }

  function triggerMlgSampleText() {
    if (!state.mlgModeEnabled) return;
    
    const sample = document.createElement('div');
    sample.className = 'pac-mlg-sample';
    sample.textContent = 'SAMPLE TEXT';
    sample.style.left = (Math.random() * (window.innerWidth - 200)) + 'px';
    sample.style.top = (Math.random() * (window.innerHeight - 50)) + 'px';
    document.body.appendChild(sample);
    
    setTimeout(() => sample.remove(), 2000);
  }

  function triggerMlg360Text() {
    if (!state.mlgModeEnabled) return;
    
    const text = document.createElement('div');
    text.className = 'pac-mlg-360';
    text.textContent = '360';
    text.style.left = (Math.random() * (window.innerWidth - 150)) + 'px';
    text.style.top = (Math.random() * (window.innerHeight - 100)) + 'px';
    document.body.appendChild(text);
    
    setTimeout(() => text.remove(), 2000);
  }

  function triggerMlgAirhorn() {
    if (!state.mlgModeEnabled) return;
    
    const horn = document.createElement('div');
    horn.className = 'pac-mlg-airhorn';
    horn.textContent = '📯';
    horn.style.left = (Math.random() * (window.innerWidth - 100)) + 'px';
    horn.style.top = (Math.random() * (window.innerHeight - 100)) + 'px';
    document.body.appendChild(horn);
    
    setTimeout(() => horn.remove(), 800);
  }

  function triggerMlgWeed(count = 5) {
    if (!state.mlgModeEnabled) return;
    
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const leaf = document.createElement('div');
        leaf.className = 'pac-mlg-weed';
        leaf.textContent = '🍀';
        leaf.style.left = (Math.random() * window.innerWidth) + 'px';
        leaf.style.top = (window.innerHeight - 100) + 'px';
        document.body.appendChild(leaf);
        
        setTimeout(() => leaf.remove(), 3000);
      }, i * 150);
    }
  }

  function triggerMlgSnoop() {
    if (!state.mlgModeEnabled) return;
    
    const snoop = document.createElement('div');
    snoop.className = 'pac-mlg-snoop';
    snoop.textContent = '🐕';
    snoop.style.left = (Math.random() * (window.innerWidth - 150)) + 'px';
    snoop.style.top = (Math.random() * (window.innerHeight - 150)) + 'px';
    document.body.appendChild(snoop);
    
    setTimeout(() => snoop.remove(), 2000);
  }

  function triggerMlgScreenShake() {
    if (!state.mlgModeEnabled) return;
    
    document.body.classList.add('pac-mlg-shake');
    setTimeout(() => document.body.classList.remove('pac-mlg-shake'), 500);
  }

  function triggerMlgCombo() {
    if (!state.mlgModeEnabled) return;
    
    // Full chaos
    triggerMlgScreenShake();
    triggerMlgHitmarkers(15);
    triggerMlgText(null, window.innerWidth / 2, window.innerHeight / 2);
    triggerMlgLensFlare(window.innerWidth / 2, window.innerHeight / 2);
    triggerMlgIlluminati(8);
    triggerMlgDoritos(15);
    triggerMlg360Text();
    triggerMlgAirhorn();
    triggerMlgWeed(10);
    triggerMlgSnoop();
  }

  // Hook for target found in shop
  function triggerMlgTargetFound(slotElement) {
    if (!state.mlgModeEnabled || !slotElement) return;
    
    const rect = slotElement.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    triggerMlgHitmarker(x, y);
    triggerMlgText('SNIPED', x, y - 50);
    triggerMlgLensFlare(x, y);
    triggerMlgScreenShake();
  }

  // EVOLUTION DETECTED - 10 seconds of pure chaos
  function triggerMlgEvolutionChaos(starLevel) {
    if (!state.mlgModeEnabled) return;
    
    const is3Star = starLevel === 3;
    
    const texts = [
      'OH BABY A TRIPLE',
      'MOM GET THE CAMERA',
      'WOMBO COMBO',
      'SHREKT',
      '360 NO SCOPE',
      'DAMN SON',
      'SMOKE WEED EVERYDAY',
      'GET REKT',
      'EZ CLAP',
      'SNIPED',
      'OHHHHH',
      'REKT',
      'GIT GUD',
      'BLAZEIT',
      'ILLUMINATI CONFIRMED',
      'WOW',
      'AIRHORN'
    ];
    
    // Initial big hit - ALL THE EFFECTS
    triggerMlgScreenShake();
    triggerMlgText(is3Star ? 'OH BABY A TRIPLE!!!' : 'EVOLVED!!!', window.innerWidth / 2, window.innerHeight / 2);
    triggerMlgIlluminati(8);
    triggerMlgHitmarkers(20);
    triggerMlg360Text();
    triggerMlgAirhorn();
    triggerMlgWeed(15);
    triggerMlgDoritos(10);
    triggerMlgSnoop();
    triggerMlgLensFlare(window.innerWidth / 2, window.innerHeight / 2);
    
    // 10 seconds of chaos
    const duration = 10000;
    const interval = 100;  // Fast chaos
    let elapsed = 0;
    
    const chaosInterval = setInterval(() => {
      elapsed += interval;
      
      if (elapsed >= duration || !state.mlgModeEnabled) {
        clearInterval(chaosInterval);
        return;
      }
      
      // Multiple random effects each tick
      const effectCount = is3Star ? 3 : 2;
      for (let e = 0; e < effectCount; e++) {
        const effect = Math.floor(Math.random() * 11);
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        switch(effect) {
          case 0:
            triggerMlgHitmarker(x, y);
            break;
          case 1:
            triggerMlgText(texts[Math.floor(Math.random() * texts.length)], x, y);
            break;
          case 2:
            triggerMlgLensFlare(x, y);
            break;
          case 3:
            triggerMlgDoritos(2);
            break;
          case 4:
            if (Math.random() > 0.3) triggerMlgScreenShake();
            break;
          case 5:
            triggerMlgIlluminati(3);
            break;
          case 6:
            triggerMlg360Text();
            break;
          case 7:
            triggerMlgAirhorn();
            break;
          case 8:
            triggerMlgWeed(5);
            break;
          case 9:
            triggerMlgSnoop();
            break;
          case 10:
            triggerMlgHitmarkers(5);
            break;
        }
      }
    }, interval);
    
    // Scheduled bursts throughout the 10 seconds
    setTimeout(() => {
      triggerMlgDoritos(15);
      triggerMlgIlluminati(10);
      triggerMlgText('WOMBO COMBO', window.innerWidth / 2, window.innerHeight / 3);
    }, 1000);
    
    setTimeout(() => {
      triggerMlgHitmarkers(25);
      triggerMlgScreenShake();
      triggerMlgText('MOM GET THE CAMERA', window.innerWidth / 2, window.innerHeight / 2);
    }, 2500);
    
    setTimeout(() => {
      triggerMlg360Text();
      triggerMlgAirhorn();
      triggerMlgIlluminati(15);
      triggerMlgWeed(20);
    }, 4000);
    
    setTimeout(() => {
      triggerMlgText('SMOKE WEED EVERYDAY', window.innerWidth / 2, window.innerHeight / 2);
      triggerMlgDoritos(20);
      triggerMlgSnoop();
      triggerMlgScreenShake();
    }, 5500);
    
    setTimeout(() => {
      triggerMlgIlluminati(20);
      triggerMlgHitmarkers(30);
      triggerMlgText('ILLUMINATI CONFIRMED', window.innerWidth / 2, window.innerHeight / 2);
    }, 7000);
    
    setTimeout(() => {
      triggerMlgText(is3Star ? 'OH BABY A TRIPLE' : 'GET REKT', window.innerWidth / 2, window.innerHeight / 2);
      triggerMlgDoritos(25);
      triggerMlgWeed(25);
      triggerMlgAirhorn();
      triggerMlgScreenShake();
      triggerMlgIlluminati(10);
    }, 8500);
  }

  // Detect evolutions by comparing board snapshots
  function checkForEvolutions(currentBoard, currentBench) {
    if (!state.mlgModeEnabled) return;
    
    const currentUnits = [...currentBoard, ...currentBench];
    
    // Build snapshot: { "PIKACHU": maxStars }
    const currentSnapshot = {};
    currentUnits.forEach(unit => {
      if (unit.name) {
        const name = unit.name.toUpperCase();
        const stars = unit.stars || 1;
        if (!currentSnapshot[name] || currentSnapshot[name] < stars) {
          currentSnapshot[name] = stars;
        }
      }
    });
    
    // Compare with previous snapshot
    if (state.mlgLastBoardSnapshot) {
      Object.entries(currentSnapshot).forEach(([name, stars]) => {
        const prevStars = state.mlgLastBoardSnapshot[name] || 0;
        if (stars > prevStars && prevStars > 0) {
          // Evolution detected! Stars went up
          triggerMlgEvolutionChaos(stars);
        } else if (stars >= 2 && prevStars === 0) {
          // New 2★ or 3★ appeared (could be from combining)
          // Check if we had the base form before
          const baseForm = getBaseForm(name);
          if (state.mlgLastBoardSnapshot[baseForm] || state.mlgLastBoardSnapshot[name.replace(/[^A-Z]/g, '')]) {
            triggerMlgEvolutionChaos(stars);
          }
        }
      });
    }
    
    // Save current snapshot for next comparison
    state.mlgLastBoardSnapshot = currentSnapshot;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TARGET SHOP HIGHLIGHTERS (v3.1.2 - Accessibility)
  // ═══════════════════════════════════════════════════════════════════════════

  function clearTargetHighlighters() {
    document.querySelectorAll('.pac-target-highlighter, .pac-team-highlighter').forEach(el => el.remove());
  }

  // Updates the slot mapping - filters out DEFAULT (empty) slots
  // so indices match the DOM which also removes purchased slots
  function updateShopSlotMapping(currentShop) {
    state.shopSlotMapping = currentShop
      .filter(name => name && name !== 'DEFAULT')
      .map(name => name.toUpperCase());
  }

  function updateTargetHighlighters(playerShop) {
    // Clear existing highlighters
    clearTargetHighlighters();
    
    if (!playerShop || playerShop.length === 0) return;
    
    // Update the slot mapping (handles purchase shifts)
    updateShopSlotMapping(playerShop);
    
    // Find shop slot elements
    const shopContainer = document.querySelector('ul.game-pokemons-store');
    if (!shopContainer) return;
    
    const shopSlots = shopContainer.querySelectorAll('div.my-box.clickable.game-pokemon-portrait');
    if (!shopSlots.length) return;
    
    // Build list of target pokemon names (uppercase)
    const mainTargetFamily = [];
    if (state.targetPokemon && state.evolutionFamily) {
      mainTargetFamily.push(...state.evolutionFamily);
    } else if (state.targetPokemon) {
      mainTargetFamily.push(state.targetPokemon.toUpperCase());
    }
    
    // Build list of team target pokemon names
    const teamTargetFamilies = [];
    for (const target of state.teamTargets) {
      if (!target.enabled) continue;
      const baseForm = getBaseForm(target.pokemon);
      const family = getEvolutionFamily(baseForm);
      teamTargetFamilies.push(...family);
    }
    
    // No targets set - nothing to highlight
    if (mainTargetFamily.length === 0 && teamTargetFamilies.length === 0) return;
    
    // Check if Ditto is in shop (use mapping, not raw array)
    const dittoInShop = state.shopSlotMapping.includes('DITTO');
    
    // Get custom colors from settings
    const targetColor = state.customSettings.targetFlashColor || '#fbbf24';
    const teamColor = state.customSettings.teamFlashColor || '#FF1493';
    const disableFlash = state.customSettings.disableFlash || false;
    
    // Read pokemon name from each slot using the corrected mapping
    shopSlots.forEach((slot, index) => {
      // Use the slot mapping instead of raw playerShop array
      const pokemonName = state.shopSlotMapping[index];
      
      // Skip empty slots (null means purchased)
      if (!pokemonName) return;
      
      // Check if this pokemon is a main target or team target
      const isMainTarget = mainTargetFamily.includes(pokemonName) || (dittoInShop && pokemonName === 'DITTO' && mainTargetFamily.length > 0);
      const isTeamTarget = teamTargetFamilies.includes(pokemonName) || (dittoInShop && pokemonName === 'DITTO' && teamTargetFamilies.length > 0);
      
      if (!isMainTarget && !isTeamTarget) return;
      
      // Get slot position
      const rect = slot.getBoundingClientRect();
      
      // Create highlighter overlay
      const highlighter = document.createElement('div');
      
      if (isMainTarget) {
        highlighter.className = 'pac-target-highlighter';
        if (isTeamTarget) highlighter.classList.add('also-team');
        highlighter.style.setProperty('--pac-target-color', targetColor);
        highlighter.style.setProperty('--pac-target-color-bg', targetColor + '73'); // 45% opacity
      } else {
        highlighter.className = 'pac-team-highlighter';
        highlighter.style.setProperty('--pac-team-color', teamColor);
        highlighter.style.setProperty('--pac-team-color-bg', teamColor + '73'); // 45% opacity
      }
      
      // Add no-animate class if epilepsy mode is on
      if (disableFlash) {
        highlighter.classList.add('no-animate');
      }
      
      // Position over the slot
      highlighter.style.top = (rect.top - 4) + 'px';
      highlighter.style.left = (rect.left - 4) + 'px';
      highlighter.style.width = (rect.width + 8) + 'px';
      highlighter.style.height = (rect.height + 8) + 'px';
      
      document.body.appendChild(highlighter);
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LIVE EXTRACTION LOOP
  // ═══════════════════════════════════════════════════════════════════════════

  function startLiveExtraction() {
    // Inject the extractor script into page context
    injectExtractor();
    
      // ═══════════════════════════════════════════════════════════════════════════
  // EVOLUTION FAMILY UI UPDATE (v2.5.0)
  // ═══════════════════════════════════════════════════════════════════════════

  function updateFamilyBreakdown(breakdown, total) {
    const container = document.getElementById('pacFamilyBreakdown');
    const familySection = document.getElementById('pacEvolutionFamily');
    
    if (!container || !familySection) return;
    
    if (breakdown.length === 0) {
      familySection.classList.add('hidden');
      return;
    }
    
    familySection.classList.remove('hidden');
    
    container.innerHTML = breakdown.map(item => `
      <div class="pac-family-row">
        <span class="pac-family-name">${item.name}</span>
        <span class="pac-family-calc">${item.count} × ${item.cost} = ${item.weighted}</span>
      </div>
    `).join('');
    
    document.getElementById('pacFamilyTotal').textContent = total;
  }

  // Listen for extraction responses via postMessage
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'PAC_EXTRACT_RESPONSE') {
        const data = event.data.data;
        
        if (data && data.totalUnits > 0) {
          if (!isConnected) {
            isConnected = true;
            document.getElementById('pacStatusDot').classList.add('connected');
            if (DEBUG_MODE) console.log('🎮 PAC Calculator: Connected to game!', data);
          }
          
          lastPoolData = data;
          
          // Update live indicator
          document.getElementById('pacLiveIndicator').style.display = 'flex';
          document.getElementById('pacLiveCount').textContent = data.totalUnits;
          
          // Auto-scout if enabled and target pokemon specified
          if (state.autoScout && state.targetPokemon) {
            const targetName = state.targetPokemon.toUpperCase();
            let count = 0;
            
            // Evolution family aggregation (v2.5.0)
            if (state.evolutionFamily && state.evolutionFamily.length > 0) {
              const breakdown = [];
              let totalWeighted = 0;
              
              state.evolutionFamily.forEach(formName => {
                const formCount = data.pokemonCounts[formName] || 0;
                if (formCount > 0) {
                  const cost = getEvolutionCost(formName);
                  const weighted = formCount * cost;
                  totalWeighted += weighted;
                  
                  breakdown.push({
                    name: formName,
                    count: formCount,
                    cost: cost,
                    weighted: weighted
                  });
                }
              });
              
              count = totalWeighted;
              
              // Update visual breakdown
              updateFamilyBreakdown(breakdown, totalWeighted);
            } else {
              // Fallback to old behavior
              Object.entries(data.pokemonCounts).forEach(([name, c]) => {
                if (name.toUpperCase() === targetName) {
                  count += c;
                }
              });
            }
            
            // Update scouted field if changed
            if (count !== state.copiesTaken) {
              state.copiesTaken = count;
              document.getElementById('pacScouted').value = count;
            }
          }
          
          // Check if target is in player's own shop (FLASH ALERT)
          const overlay = document.getElementById('pac-calc-overlay');
          const teamPanel = document.getElementById('pac-team-panel');
          
          // Track what triggered blocker
          let blockerTriggerPokemon = null;
          
          // Store shop data for mono-type blocking
          if (data.playerShops) {
            state.lastShopData = data.playerShops;
            
            // Track only YOUR shop for Roll Luck history
            if (state.playerName && data.playerShops[state.playerName]) {
              const shop = data.playerShops[state.playerName];
              if (shop && shop.length > 0) {
                const playerLevel = data.playerLevels ? data.playerLevels[state.playerName] : null;
                trackShopRoll(state.playerName, shop, playerLevel);
              }
            }
          }
          
          // Only check if player name is manually entered
          if (data.playerShops && state.playerName && state.targetPokemon) {
            const playerShop = data.playerShops[state.playerName];
            let targetInShop = false;
            
            if (playerShop && playerShop.length > 0) {
              // Check if Ditto is in shop (Ditto can be ANY Pokemon)
              const dittoInShop = playerShop.includes('DITTO');
              
              // Check if any evolution family member is in shop
              let foundPokemon = null;
              if (state.evolutionFamily && state.evolutionFamily.length > 0) {
                foundPokemon = state.evolutionFamily.find(formName => 
                  playerShop.includes(formName)
                );
                targetInShop = !!foundPokemon;
              } else if (state.targetPokemonDisplayName) {
                const upperName = state.targetPokemonDisplayName.toUpperCase();
                if (playerShop.includes(upperName)) {
                  foundPokemon = upperName;
                  targetInShop = true;
                }
              }
              
              // Flash if target OR Ditto in shop
              if (dittoInShop && !targetInShop) {
                foundPokemon = 'DITTO';
                targetInShop = true;
              }
              
              if (foundPokemon) blockerTriggerPokemon = foundPokemon;
            }
            
            if (targetInShop) {
              // Trigger MLG effects when target newly found (wasn't flashing before)
              if (!overlay.classList.contains('target-in-shop') && state.mlgModeEnabled) {
                triggerMlgText('SNIPED', window.innerWidth / 2, window.innerHeight / 3);
                triggerMlgHitmarkers(5);
                triggerMlgScreenShake();
                setTimeout(() => triggerMlgLensFlare(window.innerWidth / 2, window.innerHeight / 2), 150);
              }
              overlay.classList.add('target-in-shop');
            } else {
              overlay.classList.remove('target-in-shop');
            }
          } else {
            overlay.classList.remove('target-in-shop');
          }
          
          // Check if ANY team target is in player's shop (TEAM PANEL FLASH)
          if (teamPanel && data.playerShops && state.playerName && state.teamTargets.length > 0) {
            const playerShop = data.playerShops[state.playerName];
            let teamTargetInShop = false;
            
            if (playerShop && playerShop.length > 0) {
              // Check if Ditto is in shop (Ditto can be ANY Pokemon)
              const dittoInShop = playerShop.includes('DITTO');
              
              // Check if any team target or their evolutions are in shop
              let foundTeamPokemon = null;
              for (const target of state.teamTargets) {
                if (!target.enabled) continue;
                const baseForm = getBaseForm(target.pokemon);
                const family = getEvolutionFamily(baseForm);
                const found = family.find(formName => playerShop.includes(formName));
                if (found) {
                  foundTeamPokemon = found;
                  teamTargetInShop = true;
                  break;
                }
              }
              
              // Flash if any team target OR Ditto in shop
              if (dittoInShop && !teamTargetInShop) {
                foundTeamPokemon = 'DITTO';
                teamTargetInShop = true;
              }
              
              if (foundTeamPokemon && !blockerTriggerPokemon) {
                blockerTriggerPokemon = foundTeamPokemon;
              }
            }
            
            if (teamTargetInShop) {
              // Trigger MLG effects when team target newly found
              if (!teamPanel.classList.contains('team-target-in-shop') && state.mlgModeEnabled) {
                triggerMlgText('GET REKT', window.innerWidth / 2, window.innerHeight / 2);
                triggerMlgHitmarkers(3);
              }
              teamPanel.classList.add('team-target-in-shop');
              overlay.classList.add('team-target-in-shop');  // Also add to overlay for minimized flash
            } else {
              teamPanel.classList.remove('team-target-in-shop');
              overlay.classList.remove('team-target-in-shop');
            }
          } else if (teamPanel) {
            teamPanel.classList.remove('team-target-in-shop');
            overlay.classList.remove('team-target-in-shop');
          }
          
          // REFRESH BLOCKER - show if target found, not already showing, and not dismissed
          if (blockerTriggerPokemon && !state.refreshBlockerVisible) {
            // Only show if this isn't the Pokemon user already dismissed
            if (blockerTriggerPokemon !== state.refreshBlockerDismissed) {
              showRefreshBlocker(blockerTriggerPokemon);
            }
          } else if (!blockerTriggerPokemon && state.refreshBlockerVisible) {
            // Target left shop (purchased or rolled away) - hide blocker
            hideRefreshBlocker();
          } else if (!blockerTriggerPokemon && state.refreshBlockerDismissed) {
            // No target in shop anymore - clear dismissed tracker for next roll
            state.refreshBlockerDismissed = null;
          }
          
          // MONO-TYPE BLOCKERS - update when shop changes
          if (state.monoTypeEnabled && state.monoTypeSelected) {
            updateMonoTypeBlockers();
          }
          
          // RANDOM DRAFT - update when shop changes
          if (state.randomDraftEnabled) {
            updateRandomDraftBlockers();
          }
          
          // COPYCAT - update when shop or other players change
          if (state.copycatEnabled) {
            updateCopycatBlockers();
          }
          
          // TARGET HIGHLIGHTERS - show colored overlay on targets in shop
          if (data.playerShops && state.playerName) {
            const playerShop = data.playerShops[state.playerName];
            if (playerShop && (state.targetPokemon || state.teamTargets.length > 0)) {
              updateTargetHighlighters(playerShop);
            } else {
              clearTargetHighlighters();
            }
          } else {
            clearTargetHighlighters();
          }
          
          // Auto-set player level from DOM
          if (data.localPlayerLevel && data.localPlayerLevel !== state.level) {
            state.level = data.localPlayerLevel;
            document.getElementById('pacLevel').value = data.localPlayerLevel;
          }
          
          // Auto-set current stage and PVE round status
          if (data.currentStage && data.currentStage !== state.currentStage) {
            state.currentStage = data.currentStage;
            const isPveRound = PVE_STAGES.has(data.currentStage);
            
            // Always update PVE state and checkbox when stage changes
            state.pveRoundEnabled = isPveRound;
            const pveCheckbox = document.getElementById('pacPVE');
            if (pveCheckbox) {
              pveCheckbox.checked = isPveRound;
              // Force visual update by dispatching change event
              pveCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
            }
            
            // Re-render fishing tab if visible (PvE affects wild boost)
            if (state.shopHistoryPanelExpanded && state.analyticsTab === 'fishing') {
              renderFishingTab();
            }
            
            // Update stage display
            const stageDisplay = document.getElementById('pacStageDisplay');
            if (stageDisplay) {
              stageDisplay.textContent = `Stage ${data.currentStage}`;
              stageDisplay.classList.toggle('pve', isPveRound);
            }
            
            // Auto-enable Ditto at stage 6+
            if (data.currentStage >= 6 && !state.dittoEnabled) {
              state.dittoEnabled = true;
              const dittoCheckbox = document.getElementById('pacDitto');
              if (dittoCheckbox) {
                dittoCheckbox.checked = true;
              }
              if (DEBUG_MODE) console.log('🎭 Ditto enabled at stage', data.currentStage);
            }
          }
          
          // Auto-count wild units owned by player
          if (state.playerName && (data.playerBoards || data.playerBenches)) {
            const playerBoard = data.playerBoards?.[state.playerName] || [];
            const playerBench = data.playerBenches?.[state.playerName] || [];
            const playerUnits = [...playerBoard, ...playerBench];
            
            // Count total STARS on wild Pokemon (game counts stars for +1% per star boost)
            let wildStars = 0;
            playerUnits.forEach(unit => {
              if (unit.name && isWildPokemon(unit.name)) {
                wildStars += unit.stars || 1;
              }
            });
            
            // Update if changed
            if (wildStars !== state.wildUnitsOwned) {
              state.wildUnitsOwned = wildStars;
              const wildOwnedInput = document.getElementById('pacWildOwned');
              if (wildOwnedInput) {
                wildOwnedInput.value = wildStars;
              }
              // Re-render fishing tab if visible (wild affects Remoraid chance)
              if (state.shopHistoryPanelExpanded && state.analyticsTab === 'fishing') {
                renderFishingTab();
              }
            }
            
            // MLG Mode - Check for evolutions (3-of-a-kind upgrades)
            if (state.mlgModeEnabled) {
              checkForEvolutions(playerBoard, playerBench);
            }
            
            // ═══════════════════════════════════════════════════════════════════════════
            // FISHING AUTO-DETECT: Mantine/Mantyke, Remoraid, Octillery
            // ═══════════════════════════════════════════════════════════════════════════
            let hasMantineOrMantyke = false;
            let hasOctillery = false;
            let remoraidsOwned = 0;
            
            playerUnits.forEach(unit => {
              if (!unit.name) return;
              const upperName = unit.name.toUpperCase();
              
              // Check for Mantine or Mantyke
              if (upperName === 'MANTINE' || upperName === 'MANTYKE') {
                hasMantineOrMantyke = true;
              }
              
              // Check for Octillery (locks out Remoraid fishing)
              if (upperName === 'OCTILLERY') {
                hasOctillery = true;
              }
              
              // Count Remoraid
              if (upperName === 'REMORAID') {
                remoraidsOwned += 1;
              }
            });
            
            // Update fishing state
            if (state.fishingMantyke !== hasMantineOrMantyke) {
              state.fishingMantyke = hasMantineOrMantyke;
              const mantykeToggle = document.getElementById('pacMantykeToggle');
              if (mantykeToggle) {
                mantykeToggle.checked = hasMantineOrMantyke;
              }
            }
            
            if (state.fishingOctilleryLocked !== hasOctillery) {
              state.fishingOctilleryLocked = hasOctillery;
            }
            
            if (state.fishingRemoraidsOwned !== remoraidsOwned) {
              state.fishingRemoraidsOwned = remoraidsOwned;
            }
            
            // Always re-render fishing tab when visible (ensures live updates)
            if (state.shopHistoryPanelExpanded && state.analyticsTab === 'fishing') {
              renderFishingTab();
            }
            
            // Auto-count wild COPIES on OTHER players' boards (for pool depletion)
            // 1★ = 1 copy, 2★ = 3 copies, 3★ = 9 copies
            // Track per-rarity to avoid cross-contamination
            const wildCopiesScoutedByRarity = { common: 0, uncommon: 0, rare: 0, epic: 0, ultra: 0 };
            const allBoards = data.playerBoards || {};
            const allBenches = data.playerBenches || {};
            
            Object.keys(allBoards).forEach(playerName => {
              if (playerName !== state.playerName) {
                const board = allBoards[playerName] || [];
                board.forEach(unit => {
                  if (unit.name && isWildPokemon(unit.name)) {
                    const baseForm = getBaseForm(unit.name);
                    const pokemonData = POKEMON_DATA[baseForm];
                    const rarity = pokemonData?.rarity;
                    if (rarity && wildCopiesScoutedByRarity.hasOwnProperty(rarity)) {
                      const stars = unit.stars || 1;
                      const copies = stars === 3 ? 9 : stars === 2 ? 3 : 1;
                      wildCopiesScoutedByRarity[rarity] += copies;
                    }
                  }
                });
              }
            });
            
            Object.keys(allBenches).forEach(playerName => {
              if (playerName !== state.playerName) {
                const bench = allBenches[playerName] || [];
                bench.forEach(unit => {
                  if (unit.name && isWildPokemon(unit.name)) {
                    const baseForm = getBaseForm(unit.name);
                    const pokemonData = POKEMON_DATA[baseForm];
                    const rarity = pokemonData?.rarity;
                    if (rarity && wildCopiesScoutedByRarity.hasOwnProperty(rarity)) {
                      const stars = unit.stars || 1;
                      const copies = stars === 3 ? 9 : stars === 2 ? 3 : 1;
                      wildCopiesScoutedByRarity[rarity] += copies;
                    }
                  }
                });
              }
            });
            
            // Update if changed (compare total for simple change detection)
            const newTotal = Object.values(wildCopiesScoutedByRarity).reduce((a, b) => a + b, 0);
            const oldTotal = Object.values(state.wildUnitsTaken).reduce((a, b) => a + b, 0);
            if (newTotal !== oldTotal) {
              state.wildUnitsTaken = { ...wildCopiesScoutedByRarity };
              const wildScoutedInput = document.getElementById('pacWildScouted');
              if (wildScoutedInput) {
                wildScoutedInput.value = newTotal;
              }
            }
          }
          
          // Update Counter Intelligence panel with all player data
          if (data.playerBoards || data.playerBenches || data.playerShops) {
            updateCounterIntelDisplay();
          }
          
          // Always recalculate
          updateDisplay();
          
          // Always re-render fishing tab if visible (live updates)
          if (state.shopHistoryPanelExpanded && state.analyticsTab === 'fishing') {
            renderFishingTab();
          }
        } else {
          if (isConnected) {
            isConnected = false;
            document.getElementById('pacStatusDot').classList.remove('connected');
            document.getElementById('pacLiveIndicator').style.display = 'none';
            if (DEBUG_MODE) console.log('🎮 PAC Calculator: Disconnected');
          }
        }
      }
    });

    // Wait for extractor to load, then start polling
    setTimeout(() => {
      // Request extraction at selected speed
      extractionInterval = setInterval(() => {
        window.postMessage({ type: 'PAC_EXTRACT_REQUEST' }, '*');
      }, currentPollSpeed);
      
      // Initial request
      window.postMessage({ type: 'PAC_EXTRACT_REQUEST' }, '*');
    }, 1000);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // KEYBOARD SHORTCUT
  // ═══════════════════════════════════════════════════════════════════════════

  function setupKeyboardShortcut() {
    document.addEventListener('keydown', (e) => {
      // Shift+Alt+P to toggle overlay
      if (e.shiftKey && e.altKey && e.key === 'P') {
        e.preventDefault();
        const overlay = document.getElementById('pac-calc-overlay');
        if (overlay) {
          overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
        }
      }
      
      // Shift+Alt+R to reset overlay position to center
      if (e.shiftKey && e.altKey && (e.key === 'R' || e.key === 'r')) {
        e.preventDefault();
        const overlay = document.getElementById('pac-calc-overlay');
        if (overlay) {
          overlay.style.left = '50%';
          overlay.style.top = '50%';
          overlay.style.right = 'auto';
          overlay.style.transform = 'translate(-50%, -50%)';
          // Clear saved position
          localStorage.removeItem('pac-calc-position');
          showNotification('Position reset to center', 'info');
        }
      }
      
      // Shift+Alt+Y to unlock experimental features (when pending)
      if (e.shiftKey && e.altKey && (e.key === 'Y' || e.key === 'y')) {
        e.preventDefault();
        if (state.experimentalPending) {
          activateExperimentalMode();
        }
      }
    });
  }
  
  /**
   * Activate experimental mode after ALT+SHIFT+Y confirmation
   */
  function activateExperimentalMode() {
    state.experimentalMode = true;
    state.experimentalPending = false;
    state.refreshBlockerEnabled = true;
    
    const expBtn = document.getElementById('pacExpBtn');
    if (expBtn) {
      expBtn.classList.remove('pending');
      expBtn.classList.add('active');
      expBtn.title = 'Experimental Features ACTIVE';
    }
    
    // Show synergy bar
    const synergyBar = document.getElementById('pacSynergyBar');
    if (synergyBar) {
      synergyBar.classList.add('visible');
    }
    
    // Show mono-type panel
    const monoPanel = document.getElementById('pacMonoPanel');
    if (monoPanel) {
      monoPanel.classList.add('visible');
    }
    
    showNotification('🧪 Experimental features activated!', 'success');
    if (DEBUG_MODE) console.log('🧪 Experimental mode activated');
  }
  
  /**
   * Deactivate experimental mode
   */
  function deactivateExperimentalMode() {
    state.experimentalMode = false;
    state.experimentalPending = false;
    state.refreshBlockerEnabled = false;
    state.monoTypeEnabled = false;
    state.monoTypeSelected = null;
    state.randomDraftEnabled = false;
    state.randomDraftChosenSlot = null;
    state.randomDraftSpinning = false;
    state.copycatEnabled = false;
    state.mlgModeEnabled = false;
    hideRefreshBlocker();
    clearMonoTypeBlockers();
    clearRandomDraftOverlays();
    clearCopycatBlockers();
    clearTargetHighlighters();
    // Clear MLG overlays
    document.querySelectorAll('.pac-mlg-hitmarker, .pac-mlg-text, .pac-mlg-lensflare, .pac-mlg-illuminati, .pac-mlg-dorito, .pac-mlg-sample, .pac-mlg-360, .pac-mlg-airhorn, .pac-mlg-weed, .pac-mlg-snoop').forEach(el => el.remove());
    
    const expBtn = document.getElementById('pacExpBtn');
    if (expBtn) {
      expBtn.classList.remove('pending', 'active');
      expBtn.title = 'Experimental Features';
    }
    
    // Hide synergy bar
    const synergyBar = document.getElementById('pacSynergyBar');
    if (synergyBar) {
      synergyBar.classList.remove('visible');
    }
    
    // Hide mono-type panel
    const monoPanel = document.getElementById('pacMonoPanel');
    if (monoPanel) {
      monoPanel.classList.remove('visible', 'expanded');
    }
    
    // Reset draft panel UI
    const draftToggle = document.getElementById('pacDraftToggle');
    const draftStatus = document.getElementById('pacDraftStatus');
    if (draftToggle) {
      draftToggle.textContent = 'Start';
      draftToggle.classList.remove('active');
    }
    if (draftStatus) {
      draftStatus.classList.remove('active');
    }
    
    // Reset copycat panel UI
    const copycatToggle = document.getElementById('pacCopycatToggle');
    const copycatStatus = document.getElementById('pacCopycatStatus');
    if (copycatToggle) {
      copycatToggle.textContent = 'Start';
      copycatToggle.classList.remove('active');
    }
    if (copycatStatus) {
      copycatStatus.classList.remove('active');
    }
    
    // Reset MLG panel UI
    const mlgToggle = document.getElementById('pacMlgToggle');
    const mlgStatus = document.getElementById('pacMlgStatus');
    if (mlgToggle) {
      mlgToggle.textContent = 'Start';
      mlgToggle.classList.remove('active');
    }
    if (mlgStatus) {
      mlgStatus.classList.remove('active');
    }
    
    showNotification('Experimental features deactivated', 'info');
    if (DEBUG_MODE) console.log('🧪 Experimental mode deactivated');
  }
  
  /**
   * Setup experimental button handler
   */
  function setupExperimentalButton() {
    const expBtn = document.getElementById('pacExpBtn');
    if (!expBtn) return;
    
    expBtn.addEventListener('click', () => {
      if (state.experimentalMode) {
        // Already active - deactivate
        deactivateExperimentalMode();
      } else if (state.experimentalPending) {
        // Cancel pending
        state.experimentalPending = false;
        expBtn.classList.remove('pending');
        showNotification('Experimental activation cancelled', 'info');
      } else {
        // Start pending - wait for ALT+SHIFT+Y
        state.experimentalPending = true;
        expBtn.classList.add('pending');
        showNotification('Enable with hotkeys', 'info');
      }
    });
  }

  // Prevent keyboard events from bubbling to game when typing in calculator
  function setupInputProtection() {
    const overlay = document.getElementById('pac-calc-overlay');
    const teamPanel = document.getElementById('pac-team-panel');
    const currentPanel = document.getElementById('pac-current-panel');
    
    const panels = [overlay, teamPanel, currentPanel].filter(Boolean);
    
    panels.forEach(panel => {
      // Stop all keyboard events from reaching the game
      ['keydown', 'keyup', 'keypress'].forEach(eventType => {
        panel.addEventListener(eventType, (e) => {
          // Only stop propagation if we're in an input field
          const target = e.target;
          const isInput = target.tagName === 'INPUT' || 
                         target.tagName === 'TEXTAREA' || 
                         target.tagName === 'SELECT' ||
                         target.isContentEditable;
          
          if (isInput) {
            e.stopPropagation();
          }
        }, true); // Use capture phase to catch events early
      });
    });
    
    if (DEBUG_MODE) console.log('🛡️ Input protection enabled - keyboard events won\'t reach game');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PORTAL/REGIONAL DETECTION (v3.0.2)
  // ═══════════════════════════════════════════════════════════════════════════
  

  let lastKnownStage = null;
  
  /**
   * Sync detected Pokemon to pool calculation counts
   * This bridges the detection system with the probability calculations
   */
  function syncDetectionToPools() {
    // Reset all detection-based counts first
    // (We'll recalculate from scratch based on resolved slots)
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'ultra'];
    
    // Track counts from detection
    const detectedRegionals = { normal: {}, wild: {} };
    const detectedAdditional = { normal: {}, wild: {} };
    
    rarities.forEach(r => {
      detectedRegionals.normal[r] = { twoStar: 0, threeStar: 0 };
      detectedRegionals.wild[r] = { twoStar: 0, threeStar: 0 };
      detectedAdditional.normal[r] = { twoStar: 0, threeStar: 0 };
      detectedAdditional.wild[r] = { twoStar: 0, threeStar: 0 };
    });
    
    // Process regional slots
    state.regionalSlots.forEach(slot => {
      if (!slot.resolved) return;
      
      const pokemon = slot.resolved;
      const data = POKEMON_DATA[pokemon];
      if (!data) return;
      
      const rarity = data.rarity;
      if (!rarities.includes(rarity)) return;
      
      const isWild = data.types.includes('wild');
      const baseForm = getBaseForm(pokemon);
      const evolutionChain = EVOLUTION_CHAINS[baseForm];
      const maxStars = evolutionChain?.[0]?.maxStars || 3;
      const starType = maxStars === 2 ? 'twoStar' : 'threeStar';
      
      if (isWild) {
        detectedRegionals.wild[rarity][starType]++;
      } else {
        detectedRegionals.normal[rarity][starType]++;
      }
    });
    
    // Process additional slots
    state.additionalSlots.forEach(slot => {
      if (!slot.resolved) return;
      
      const pokemon = slot.resolved;
      const data = POKEMON_DATA[pokemon];
      if (!data) return;
      
      const rarity = data.rarity;
      if (!rarities.includes(rarity)) return;
      
      const isWild = data.types.includes('wild');
      const baseForm = getBaseForm(pokemon);
      const evolutionChain = EVOLUTION_CHAINS[baseForm];
      const maxStars = evolutionChain?.[0]?.maxStars || 3;
      const starType = maxStars === 2 ? 'twoStar' : 'threeStar';
      
      if (isWild) {
        detectedAdditional.wild[rarity][starType]++;
      } else {
        detectedAdditional.normal[rarity][starType]++;
      }
    });
    
    // Update state with detected counts
    // Regional Pokemon → portalRegionals (normal) and wildRegionals (wild)
    rarities.forEach(r => {
      state.portalRegionals[r].twoStar = detectedRegionals.normal[r].twoStar;
      state.portalRegionals[r].threeStar = detectedRegionals.normal[r].threeStar;
      state.wildRegionals[r].twoStar = detectedRegionals.wild[r].twoStar;
      state.wildRegionals[r].threeStar = detectedRegionals.wild[r].threeStar;
    });
    
    // Additional Pokemon → round checkboxes + add picks count (normal) and wildAddPicks (wild)
    // Count non-wild add picks by rarity
    const normalAddPickCounts = {
      uncommon: detectedAdditional.normal.uncommon.twoStar + detectedAdditional.normal.uncommon.threeStar,
      rare: detectedAdditional.normal.rare.twoStar + detectedAdditional.normal.rare.threeStar,
      epic: detectedAdditional.normal.epic.twoStar + detectedAdditional.normal.epic.threeStar
    };
    
    // Enable round checkboxes and set counts based on detected add picks
    if (normalAddPickCounts.uncommon > 0) {
      state.round5Enabled = true;
      state.round5AddPicks = normalAddPickCounts.uncommon;
      const checkbox = document.getElementById('pacRound5');
      if (checkbox) checkbox.checked = true;
      const inputDiv = document.getElementById('pacRound5Input');
      if (inputDiv) inputDiv.classList.remove('hidden');
      const input = document.getElementById('pacRound5Picks');
      if (input) input.value = normalAddPickCounts.uncommon;
    }
    
    if (normalAddPickCounts.rare > 0) {
      state.round8Enabled = true;
      state.round8AddPicks = normalAddPickCounts.rare;
      const checkbox = document.getElementById('pacRound8');
      if (checkbox) checkbox.checked = true;
      const inputDiv = document.getElementById('pacRound8Input');
      if (inputDiv) inputDiv.classList.remove('hidden');
      const input = document.getElementById('pacRound8Picks');
      if (input) input.value = normalAddPickCounts.rare;
    }
    
    if (normalAddPickCounts.epic > 0) {
      state.round11Enabled = true;
      state.round11AddPicks = normalAddPickCounts.epic;
      const checkbox = document.getElementById('pacRound11');
      if (checkbox) checkbox.checked = true;
      const inputDiv = document.getElementById('pacRound11Input');
      if (inputDiv) inputDiv.classList.remove('hidden');
      const input = document.getElementById('pacRound11Picks');
      if (input) input.value = normalAddPickCounts.epic;
    }
    
    // Wild add picks
    state.wildAddPicks.uncommon = detectedAdditional.wild.uncommon.twoStar + detectedAdditional.wild.uncommon.threeStar;
    state.wildAddPicks.rare = detectedAdditional.wild.rare.twoStar + detectedAdditional.wild.rare.threeStar;
    state.wildAddPicks.epic = detectedAdditional.wild.epic.twoStar + detectedAdditional.wild.epic.threeStar;
    
    if (DEBUG_MODE) {
      console.log('🔄 Synced detection to pools:', {
        portalRegionals: state.portalRegionals,
        wildRegionals: state.wildRegionals,
        round5: { enabled: state.round5Enabled, picks: state.round5AddPicks },
        round8: { enabled: state.round8Enabled, picks: state.round8AddPicks },
        round11: { enabled: state.round11Enabled, picks: state.round11AddPicks },
        wildAddPicks: state.wildAddPicks
      });
    }
    
    // Recalculate probabilities
    updateDisplay();
  }
  
  function setupPortalDetection() {
    
    // Show the detection panel
    function showDetectionPanel() {
      const panel = document.getElementById('pacDetectionPanel');
      if (panel) panel.style.display = 'block';
    }
    
    // Generate unique slot key from rarity + types
    function slotKey(rarity, types) {
      return `${rarity}:${[...types].sort().join(',')}`;
    }
    
    // Extract slots from panel (returns array of {rarity, types, matches})
    function extractSlotsFromPanel(panelDiv, isRegional) {
      const portraits = panelDiv.querySelectorAll('.game-pokemon-portrait');
      const slots = [];
      
      portraits.forEach(p => {
        const bgColor = p.style.backgroundColor;
        const rarity = RARITY_COLORS[bgColor] || 'unknown';
        const typeIcons = p.querySelectorAll('.synergy-icon');
        const types = Array.from(typeIcons).map(icon => icon.alt.toLowerCase());
        
        // Find matching Pokemon
        const matches = identifyPokemonByTypesAndRarity(rarity, types, isRegional);
        
        if (matches.length > 0) {
          let resolved = null;
          
          if (matches.length === 1) {
            // Single match - auto-resolve
            resolved = matches[0];
          } else {
            // Multiple matches - find which ones are TRUE base forms
            // A Pokemon is a base form if getBaseForm(name) === name
            const baseForms = matches.filter(name => {
              const base = getBaseForm(name);
              return base === name;
            });
            
            const evolvedForms = matches.filter(name => {
              const base = getBaseForm(name);
              return base !== name;
            });
            
            if (baseForms.length === 1 && evolvedForms.length > 0) {
              // Clear winner - only one base form, rest are evolutions
              resolved = baseForms[0];
              if (DEBUG_MODE) console.log(`🔄 Auto-resolved to base form: ${resolved}`, { baseForms, evolvedForms });
            } else if (baseForms.length > 1) {
              // Multiple base forms (e.g., Pidgey, Starly, Taillow) - user must choose
              if (DEBUG_MODE) console.log(`❓ Multiple base forms, user must choose:`, baseForms);
            } else if (baseForms.length === 0 && evolvedForms.length > 0) {
              // All are evolved forms - pick the one with lowest evolution stage
              // This shouldn't normally happen, but handle it gracefully
              if (DEBUG_MODE) console.log(`⚠️ No base forms found, showing all:`, matches);
            }
          }
          
          slots.push({
            rarity,
            types,
            matches,
            resolved
          });
        }
      });
      
      return slots;
    }
    
    // Get resolved Pokemon names from slots
    function getResolvedNames(slots) {
      return slots
        .filter(s => s.resolved)
        .map(s => s.resolved);
    }
    
    // Render slots as clickable chips
    function renderSlots(slots, containerId, slotType) {
      const container = document.getElementById(containerId);
      if (!container) return;
      
      if (slots.length === 0) {
        container.innerHTML = '<span style="color: #666; font-size: 11px;">Not detected yet</span>';
        return;
      }
      
      const html = slots.map((slot, slotIndex) => {
        if (slot.resolved) {
          // Resolved - show single confirmed chip
          const data = POKEMON_DATA[slot.resolved] || {};
          const rarity = data.rarity || 'unknown';
          return `<span class="pac-pokemon-chip ${rarity}" style="opacity: 1;">${slot.resolved}</span>`;
        } else {
          // Unresolved - show all matches as clickable
          return slot.matches.map(name => {
            const data = POKEMON_DATA[name] || {};
            const rarity = data.rarity || 'unknown';
            return `<span class="pac-pokemon-chip ${rarity}" style="opacity: 0.6; cursor: pointer; border: 1px dashed rgba(255,255,255,0.3);" data-slot-type="${slotType}" data-slot-index="${slotIndex}" data-pokemon="${name}">${name}?</span>`;
          }).join('');
        }
      }).join('');
      
      container.innerHTML = html;
      
      // Add click handlers for unresolved chips
      container.querySelectorAll('[data-pokemon]').forEach(chip => {
        chip.addEventListener('click', () => {
          const type = chip.dataset.slotType;
          const index = parseInt(chip.dataset.slotIndex);
          const pokemon = chip.dataset.pokemon;
          resolveSlot(type, index, pokemon);
        });
      });
    }
    
    // Resolve a slot to a specific Pokemon
    function resolveSlot(slotType, slotIndex, pokemonName) {
      const slots = slotType === 'regional' ? state.regionalSlots : state.additionalSlots;
      if (slots[slotIndex]) {
        slots[slotIndex].resolved = pokemonName;
        
        // Update the active arrays
        if (slotType === 'regional') {
          state.activeRegionalPokemon = getResolvedNames(state.regionalSlots);
          updateRegionalDisplay();
        } else {
          state.activeAdditionalPokemon = getResolvedNames(state.additionalSlots);
          updateAddPicksDisplay();
        }
        
        // Sync to pool calculations
        syncDetectionToPools();
        
        updateAvailabilityWarnings();
        if (DEBUG_MODE) console.log(`✅ Resolved ${slotType} slot ${slotIndex} to ${pokemonName}`);
      }
    }
    
    // Update regional display
    function updateRegionalDisplay() {
      const statusEl = document.getElementById('pacRegionalStatus');
      if (statusEl) {
        const resolved = state.regionalSlots.filter(s => s.resolved).length;
        const total = state.regionalSlots.length;
        statusEl.textContent = total > 0 ? `(${resolved}/${total} confirmed)` : '(Hover icon to detect)';
      }
      renderSlots(state.regionalSlots, 'pacRegionalList', 'regional');
    }
    
    // Update add picks display
    function updateAddPicksDisplay() {
      const statusEl = document.getElementById('pacAddPicksStatus');
      if (statusEl) {
        const resolved = state.additionalSlots.filter(s => s.resolved).length;
        const total = state.additionalSlots.length;
        statusEl.textContent = total > 0 ? `(${resolved}/${total} confirmed)` : '(Hover icon to detect)';
      }
      renderSlots(state.additionalSlots, 'pacAddPicksList', 'additional');
    }
    
    // Merge new slots into existing (avoid duplicates)
    function mergeSlots(existing, newSlots, isRegional = false) {
      // For regionals: if the count changed significantly, it's likely a new region - replace entirely
      if (isRegional && existing.length > 0 && newSlots.length > 0) {
        const existingKeys = new Set(existing.map(s => slotKey(s.rarity, s.types)));
        const newKeys = new Set(newSlots.map(s => slotKey(s.rarity, s.types)));
        
        // Count how many slots are completely new (not in existing)
        let newCount = 0;
        newKeys.forEach(key => {
          if (!existingKeys.has(key)) newCount++;
        });
        
        // If more than half are new, or counts are very different, replace entirely
        if (newCount > newSlots.length / 2 || Math.abs(existing.length - newSlots.length) > 2) {
          if (DEBUG_MODE) console.log('🔄 Region change detected - replacing slots entirely');
          return newSlots;
        }
      }
      
      // Otherwise merge (add new, keep existing)
      const existingKeys = new Set(existing.map(s => slotKey(s.rarity, s.types)));
      
      newSlots.forEach(slot => {
        const key = slotKey(slot.rarity, slot.types);
        if (!existingKeys.has(key)) {
          existing.push(slot);
          existingKeys.add(key);
        }
      });
      
      return existing;
    }
    
    // Attach icon listeners
    function attachListeners() {
      // Regional icon
      if (!state.regionalListenerAttached) {
        const regionalIcon = document.querySelector('img[data-tooltip-id="game-regional-pokemons"]');
        if (regionalIcon) {
          regionalIcon.addEventListener('mouseenter', () => {
            setTimeout(() => {
              const div = document.querySelector('.game-regional-pokemons');
              if (div) {
                const newSlots = extractSlotsFromPanel(div, true);
                if (newSlots.length > 0) {
                  state.regionalSlots = mergeSlots(state.regionalSlots, newSlots, true);
                  state.activeRegionalPokemon = getResolvedNames(state.regionalSlots);
                  if (DEBUG_MODE) console.log('🌍 Regional slots:', state.regionalSlots);
                  updateRegionalDisplay();
                  syncDetectionToPools();
                  updateAvailabilityWarnings();
                }
              }
            }, 150);
          });
          state.regionalListenerAttached = true;
          if (DEBUG_MODE) console.log('👁️ Regional icon listener attached');
        }
      }
      
      // Additional icon
      if (!state.additionalListenerAttached) {
        const additionalIcon = document.querySelector('img[data-tooltip-id="game-additional-pokemons"]');
        if (additionalIcon) {
          additionalIcon.addEventListener('mouseenter', () => {
            setTimeout(() => {
              const div = document.querySelector('.game-additional-pokemons');
              if (div) {
                const newSlots = extractSlotsFromPanel(div, false);
                if (newSlots.length > 0) {
                  state.additionalSlots = mergeSlots(state.additionalSlots, newSlots);
                  state.activeAdditionalPokemon = getResolvedNames(state.additionalSlots);
                  if (DEBUG_MODE) console.log('🎯 Additional slots:', state.additionalSlots);
                  updateAddPicksDisplay();
                  syncDetectionToPools();
                  updateAvailabilityWarnings();
                }
              }
            }, 150);
          });
          state.additionalListenerAttached = true;
          if (DEBUG_MODE) console.log('👁️ Additional icon listener attached');
        }
      }
      
      // Reset button
      const resetBtn = document.getElementById('pacResetDetection');
      if (resetBtn && !resetBtn.dataset.listenerAttached) {
        resetBtn.addEventListener('click', resetGameDetection);
        resetBtn.dataset.listenerAttached = 'true';
      }
    }
    
    // Check for new game (stage reset)
    function checkForNewGame() {
      const stage = state.currentStage;
      if (stage && lastKnownStage && lastKnownStage > 5 && stage <= 2) {
        // Stage dropped from mid-game to start - new game!
        if (DEBUG_MODE) console.log(`🆕 New game detected (stage ${lastKnownStage} → ${stage})`);
        resetGameDetection();
        
        // Reset Ditto (new game starts below stage 6)
        state.dittoEnabled = false;
        const dittoCheckbox = document.getElementById('pacDitto');
        if (dittoCheckbox) dittoCheckbox.checked = false;
      }
      lastKnownStage = stage;
    }
    
    // Poll loop
    function pollLoop() {
      attachListeners();
      checkForNewGame();
      
      // Show panel if we have data or live tracking is on
      const liveStatus = document.getElementById('pacLiveStatus');
      if (liveStatus?.textContent === 'ON' || state.regionalSlots.length > 0 || state.additionalSlots.length > 0) {
        showDetectionPanel();
      }
    }
    
    setInterval(pollLoop, 2000);
    pollLoop();
    
    if (DEBUG_MODE) console.log('👁️ Game detection system initialized');
  }
  
  /**
   * Update availability warnings for tracked Pokemon
   */
  function updateAvailabilityWarnings() {
    // Update main target warning
    if (state.targetPokemon) {
      const availability = checkPokemonAvailability(
        state.targetPokemon, 
        state.activeRegionalPokemon, 
        state.activeAdditionalPokemon
      );
      
      const warningEl = document.getElementById('pacPortalWarning');
      if (warningEl) {
        if (!availability.available) {
          warningEl.textContent = `⚠️ ${availability.reason}`;
          warningEl.style.display = 'block';
        } else {
          warningEl.style.display = 'none';
        }
      }
    }
    
    // Update team target warnings
    state.teamTargets.forEach(target => {
      const availability = checkPokemonAvailability(
        target.pokemon,
        state.activeRegionalPokemon,
        state.activeAdditionalPokemon
      );
      
      const row = document.querySelector(`[data-target-id="${target.id}"]`);
      if (row) {
        const warningIcon = row.querySelector('.availability-warning');
        if (!availability.available) {
          if (!warningIcon) {
            const icon = document.createElement('span');
            icon.className = 'availability-warning';
            icon.textContent = '⚠️';
            icon.title = availability.reason;
            icon.style.cssText = 'margin-left: 4px; cursor: help;';
            row.querySelector('.team-pokemon-name')?.appendChild(icon);
          }
        } else if (warningIcon) {
          warningIcon.remove();
        }
      }
    });
  }
  
  /**
   * Reset detection for new game
   */
  function resetGameDetection() {
    state.activeRegionalPokemon = [];
    state.activeAdditionalPokemon = [];
    state.regionalSlots = [];
    state.additionalSlots = [];
    
    // Reset listener flags so they re-attach to new DOM elements
    state.regionalListenerAttached = false;
    state.additionalListenerAttached = false;
    
    // Reset pool calculation state
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'ultra'];
    rarities.forEach(r => {
      state.portalRegionals[r] = { twoStar: 0, threeStar: 0 };
      state.wildRegionals[r] = { twoStar: 0, threeStar: 0 };
    });
    state.wildAddPicks = { uncommon: 0, rare: 0, epic: 0 };
    
    // Reset round checkboxes and counts
    state.round5Enabled = false;
    state.round5AddPicks = 8;
    state.round8Enabled = false;
    state.round8AddPicks = 8;
    state.round11Enabled = false;
    state.round11AddPicks = 8;
    
    // Reset shop history / roll luck tracker
    clearShopHistory();
    
    // Reset UI elements
    const regionalList = document.getElementById('pacRegionalList');
    const addPicksList = document.getElementById('pacAddPicksList');
    const regionalStatus = document.getElementById('pacRegionalStatus');
    const addPicksStatus = document.getElementById('pacAddPicksStatus');
    
    if (regionalList) regionalList.innerHTML = '<span style="color: #666; font-size: 11px;">Not detected yet</span>';
    if (addPicksList) addPicksList.innerHTML = '<span style="color: #666; font-size: 11px;">Not detected yet</span>';
    if (regionalStatus) regionalStatus.textContent = '(Hover icon to detect)';
    if (addPicksStatus) addPicksStatus.textContent = '(Hover icon to detect)';
    
    // Recalculate
    updateDisplay();
    
    if (DEBUG_MODE) console.log('🔄 Game detection reset');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SYNERGY BAR (Experimental Feature)
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Get all unique synergy types from POKEMON_DATA
   */
  function getAllSynergies() {
    const synergies = new Set();
    Object.values(POKEMON_DATA).forEach(data => {
      if (data.types) {
        data.types.forEach(type => synergies.add(type));
      }
    });
    // Sort alphabetically
    return Array.from(synergies).sort();
  }
  
  /**
   * Get all base pool Pokemon of a specific synergy type
   */
  function getPokemonBySynergy(synergyType) {
    const results = [];
    
    for (const [name, data] of Object.entries(POKEMON_DATA)) {
      // Must have the synergy type
      if (!data.types || !data.types.includes(synergyType)) continue;
      
      // Must be a base form
      const baseForm = getBaseForm(name);
      if (baseForm !== name) continue;
      
      // Must be in pool rarities (not legendary, unique, special, hatch)
      if (!POOL_RARITIES.includes(data.rarity)) continue;
      
      // Must be in base pool (not regional-only or additional-only)
      // regional-only means: regional=true AND additional=false AND not in base pool
      // We want Pokemon that are either:
      // 1. regional=false AND additional=false (pure base pool)
      // 2. regional=true AND additional=true (available via both)
      // We exclude:
      // - regional=true AND additional=false (regional-only)
      // - regional=false AND additional=true (add-pick-only)
      
      if (data.regional && !data.additional) continue; // Regional-only
      if (!data.regional && data.additional) continue; // Add-pick-only
      
      results.push({
        name,
        rarity: data.rarity,
        types: data.types,
        isWild: data.types.includes('wild')
      });
    }
    
    return results;
  }
  
  /**
   * Populate the synergy bar with buttons
   */
  function populateSynergyBar() {
    const bar = document.getElementById('pacSynergyBar');
    if (!bar) return;
    
    const synergies = getAllSynergies();
    
    bar.innerHTML = synergies.map(synergy => {
      const count = getPokemonBySynergy(synergy).length;
      return `<button class="pac-synergy-btn" data-synergy="${synergy}">${synergy} (${count})</button>`;
    }).join('');
    
    // Add click handlers
    bar.querySelectorAll('.pac-synergy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const synergy = btn.dataset.synergy;
        addSynergyToTeamTracker(synergy);
      });
    });
    
    // Mouse wheel horizontal scroll
    bar.addEventListener('wheel', (e) => {
      e.preventDefault();
      bar.scrollLeft += e.deltaY;
    }, { passive: false });
    
    if (DEBUG_MODE) console.log(`🎨 Synergy bar populated with ${synergies.length} synergies`);
  }
  
  /**
   * Add all Pokemon of a synergy type to team tracker
   */
  function addSynergyToTeamTracker(synergyType) {
    const pokemon = getPokemonBySynergy(synergyType);
    
    if (pokemon.length === 0) {
      showNotification(`No base pool Pokemon found for ${synergyType}`, 'warning');
      return;
    }
    
    let addedCount = 0;
    let skippedCount = 0;
    
    pokemon.forEach(pkmn => {
      // Check if already in team tracker
      const exists = state.teamTargets.some(t => 
        t.pokemon.toUpperCase() === pkmn.name.toUpperCase()
      );
      
      if (exists) {
        skippedCount++;
        return;
      }
      
      // Get evolution data
      const baseForm = pkmn.name;
      const evolutionChain = EVOLUTION_CHAINS[baseForm];
      const maxStars = evolutionChain?.[0]?.maxStars || 3;
      const evo = maxStars === 3 ? 'threeStar' : 'twoStar';
      
      // Add to team tracker
      state.teamTargets.push({
        id: Date.now() + Math.random(),
        pokemon: baseForm,
        displayName: baseForm.charAt(0) + baseForm.slice(1).toLowerCase(),
        rarity: pkmn.rarity,
        evo: evo,
        isWild: pkmn.isWild,
        enabled: true,
        copiesTaken: 0
      });
      
      addedCount++;
    });
    
    // Save to localStorage
    localStorage.setItem('pac_teamTargets', JSON.stringify(state.teamTargets));
    
    // Update display
    updateTeamDisplay();
    
    showNotification(`Added ${addedCount} ${synergyType} Pokemon (${skippedCount} already tracked)`, 'success');
    if (DEBUG_MODE) console.log(`🎨 Added ${addedCount} ${synergyType} Pokemon to team tracker`);
  }


  // ═══════════════════════════════════════════════════════════════════════════
  // TEAM TRACKER PANEL (v2.8.0)
  // ═══════════════════════════════════════════════════════════════════════════
  
  function setupTeamPanel() {
    const panel = document.getElementById('pac-team-panel');
    const toggleBtn = document.getElementById('pacTeamToggle');
    const closeBtn = document.getElementById('pacTeamClose');
    const addInput = document.getElementById('pacTeamAddInput');
    const addBtn = document.getElementById('pacTeamAddBtn');
    
    // Toggle panel
    toggleBtn.addEventListener('click', () => {
      // Close current panel if open
      if (state.currentPanelExpanded) {
        const currentPanel = document.getElementById('pac-current-panel');
        state.currentPanelExpanded = false;
        currentPanel.classList.remove('expanded');
      }
      // Close settings panel if open
      if (state.settingsPanelExpanded) {
        const settingsPanel = document.getElementById('pac-settings-panel');
        state.settingsPanelExpanded = false;
        settingsPanel.classList.remove('expanded');
      }
      // Close history panel if open
      if (state.shopHistoryPanelExpanded) {
        const historyPanel = document.getElementById('pac-history-panel');
        state.shopHistoryPanelExpanded = false;
        historyPanel.classList.remove('expanded');
      }
      
      state.teamPanelExpanded = !state.teamPanelExpanded;
      panel.classList.toggle('expanded', state.teamPanelExpanded);
    });
    
    closeBtn.addEventListener('click', () => {
      state.teamPanelExpanded = false;
      panel.classList.remove('expanded');
      // Hide dropdown if open
      const dropdown = document.getElementById('pacTeamDropdown');
      if (dropdown) {
        dropdown.classList.add('hidden');
      }
    });
    
    // Setup autocomplete for team add input
    setupTeamAutocomplete(addInput);
    
    // Add Pokemon via button
    addBtn.addEventListener('click', () => {
      const pokemon = addInput.value.trim();
      if (pokemon) {
        addTeamTarget(pokemon);
        addInput.value = '';
      }
    });
    
    // Add Pokemon via Enter key
    addInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const pokemon = addInput.value.trim();
        if (pokemon) {
          addTeamTarget(pokemon);
          addInput.value = '';
        }
      }
    });
    
    // Initial render
    updateTeamDisplay();
  }
  
  function setupCurrentPanel() {
    const panel = document.getElementById('pac-current-panel');
    const toggleBtn = document.getElementById('pacCurrentToggle');
    const closeBtn = document.getElementById('pacCurrentClose');
    
    if (!panel || !toggleBtn || !closeBtn) {
      console.error('Current panel elements not found');
      return;
    }
    
    // Toggle panel
    toggleBtn.addEventListener('click', () => {
      // Close team panel if open
      if (state.teamPanelExpanded) {
        const teamPanel = document.getElementById('pac-team-panel');
        state.teamPanelExpanded = false;
        teamPanel.classList.remove('expanded');
      }
      // Close settings panel if open
      if (state.settingsPanelExpanded) {
        const settingsPanel = document.getElementById('pac-settings-panel');
        state.settingsPanelExpanded = false;
        settingsPanel.classList.remove('expanded');
      }
      // Close history panel if open
      if (state.shopHistoryPanelExpanded) {
        const historyPanel = document.getElementById('pac-history-panel');
        state.shopHistoryPanelExpanded = false;
        historyPanel.classList.remove('expanded');
      }
      
      state.currentPanelExpanded = !state.currentPanelExpanded;
      panel.classList.toggle('expanded', state.currentPanelExpanded);
    });
    
    closeBtn.addEventListener('click', () => {
      state.currentPanelExpanded = false;
      panel.classList.remove('expanded');
    });
    
    // Initial render
    updateCounterIntelDisplay();
  }
  
  function setupSettingsPanel() {
    const panel = document.getElementById('pac-settings-panel');
    const toggleBtn = document.getElementById('pacSettingsToggle');
    const closeBtn = document.getElementById('pacSettingsClose');
    const resetBtn = document.getElementById('pacSettingsReset');
    
    if (!panel || !toggleBtn || !closeBtn) {
      console.error('Settings panel elements not found');
      return;
    }
    
    // Toggle panel
    toggleBtn.addEventListener('click', () => {
      // Close other panels if open
      if (state.teamPanelExpanded) {
        const teamPanel = document.getElementById('pac-team-panel');
        state.teamPanelExpanded = false;
        teamPanel.classList.remove('expanded');
      }
      if (state.currentPanelExpanded) {
        const currentPanel = document.getElementById('pac-current-panel');
        state.currentPanelExpanded = false;
        currentPanel.classList.remove('expanded');
      }
      if (state.shopHistoryPanelExpanded) {
        const historyPanel = document.getElementById('pac-history-panel');
        state.shopHistoryPanelExpanded = false;
        historyPanel.classList.remove('expanded');
      }
      
      state.settingsPanelExpanded = !state.settingsPanelExpanded;
      panel.classList.toggle('expanded', state.settingsPanelExpanded);
    });
    
    closeBtn.addEventListener('click', () => {
      state.settingsPanelExpanded = false;
      panel.classList.remove('expanded');
    });
    
    // Color inputs
    const bgColorInput = document.getElementById('pacSettingsBgColor');
    const textColorInput = document.getElementById('pacSettingsTextColor');
    const accentColorInput = document.getElementById('pacSettingsAccentColor');
    const targetFlashInput = document.getElementById('pacSettingsTargetFlash');
    const teamFlashInput = document.getElementById('pacSettingsTeamFlash');
    const flashSpeedInput = document.getElementById('pacSettingsFlashSpeed');
    const flashSpeedValue = document.getElementById('pacSettingsFlashSpeedValue');
    const fontSizeInput = document.getElementById('pacSettingsFontSize');
    const fontSizeValue = document.getElementById('pacSettingsFontSizeValue');
    const disableFlashInput = document.getElementById('pacSettingsDisableFlash');
    
    // Apply saved settings on load
    loadCustomSettings();
    
    // Color change handlers
    bgColorInput.addEventListener('input', (e) => {
      state.customSettings.backgroundColor = e.target.value;
      applyCustomSettings();
      saveCustomSettings();
    });
    
    textColorInput.addEventListener('input', (e) => {
      state.customSettings.textColor = e.target.value;
      applyCustomSettings();
      saveCustomSettings();
    });
    
    accentColorInput.addEventListener('input', (e) => {
      state.customSettings.accentColor = e.target.value;
      applyCustomSettings();
      saveCustomSettings();
    });
    
    targetFlashInput.addEventListener('input', (e) => {
      state.customSettings.targetFlashColor = e.target.value;
      applyCustomSettings();
      saveCustomSettings();
    });
    
    teamFlashInput.addEventListener('input', (e) => {
      state.customSettings.teamFlashColor = e.target.value;
      applyCustomSettings();
      saveCustomSettings();
    });
    
    flashSpeedInput.addEventListener('input', (e) => {
      state.customSettings.flashSpeed = parseInt(e.target.value);
      flashSpeedValue.textContent = e.target.value + 'ms';
      applyCustomSettings();
      saveCustomSettings();
    });
    
    fontSizeInput.addEventListener('input', (e) => {
      state.customSettings.fontSize = parseInt(e.target.value);
      fontSizeValue.textContent = e.target.value + 'px';
      applyCustomSettings();
      saveCustomSettings();
    });
    
    // Epilepsy toggle handler
    disableFlashInput.addEventListener('change', (e) => {
      state.customSettings.disableFlash = e.target.checked;
      applyCustomSettings();
      saveCustomSettings();
      
      // Update preview flash buttons
      const targetPreview = document.getElementById('pacPreviewTargetFlash');
      const teamPreview = document.getElementById('pacPreviewTeamFlash');
      if (targetPreview) targetPreview.classList.toggle('disabled', e.target.checked);
      if (teamPreview) teamPreview.classList.toggle('disabled', e.target.checked);
    });
    
    // Reset button
    resetBtn.addEventListener('click', () => {
      state.customSettings = {
        backgroundColor: '#dce8ec',
        textColor: '#000000',
        accentColor: '#00bcd4',
        targetFlashColor: '#2bff00',
        teamFlashColor: '#0033ff',
        flashSpeed: 250,
        fontSize: 12,
        disableFlash: false
      };
      
      // Update inputs
      bgColorInput.value = state.customSettings.backgroundColor;
      textColorInput.value = state.customSettings.textColor;
      accentColorInput.value = state.customSettings.accentColor;
      targetFlashInput.value = state.customSettings.targetFlashColor;
      teamFlashInput.value = state.customSettings.teamFlashColor;
      flashSpeedInput.value = state.customSettings.flashSpeed;
      flashSpeedValue.textContent = state.customSettings.flashSpeed + 'ms';
      fontSizeInput.value = state.customSettings.fontSize;
      fontSizeValue.textContent = state.customSettings.fontSize + 'px';
      disableFlashInput.checked = state.customSettings.disableFlash;
      
      // Reset preview flash buttons
      const targetPreview = document.getElementById('pacPreviewTargetFlash');
      const teamPreview = document.getElementById('pacPreviewTeamFlash');
      if (targetPreview) targetPreview.classList.remove('disabled');
      if (teamPreview) teamPreview.classList.remove('disabled');
      
      applyCustomSettings();
      saveCustomSettings();
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SHOP HISTORY / ROLL LUCK TRACKER
  // ═══════════════════════════════════════════════════════════════════════════
  
  function setupHistoryPanel() {
    const panel = document.getElementById('pac-history-panel');
    const toggleBtn = document.getElementById('pacHistoryToggle');
    const closeBtn = document.getElementById('pacHistoryClose');
    const clearBtn = document.getElementById('pacHistoryClear');
    const analyticsClearBtn = document.getElementById('pacAnalyticsClear');
    const tabBtns = document.querySelectorAll('.pac-analytics-tab');
    
    if (!panel || !toggleBtn || !closeBtn) {
      console.error('History panel elements not found');
      return;
    }
    
    // Tab switching
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        state.analyticsTab = targetTab;
        
        // Update tab button states
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update content visibility
        document.getElementById('pacLiveTab').classList.toggle('active', targetTab === 'live');
        document.getElementById('pacAnalyticsTab').classList.toggle('active', targetTab === 'analytics');
        document.getElementById('pacFishingTab').classList.toggle('active', targetTab === 'fishing');
        
        // Render analytics when switching to that tab
        if (targetTab === 'analytics') {
          renderAnalytics();
        }
        
        // Render fishing when switching to that tab
        if (targetTab === 'fishing') {
          renderFishingTab();
        }
      });
    });
    
    // Toggle panel
    toggleBtn.addEventListener('click', () => {
      // Close other panels if open
      if (state.teamPanelExpanded) {
        const teamPanel = document.getElementById('pac-team-panel');
        state.teamPanelExpanded = false;
        teamPanel.classList.remove('expanded');
      }
      if (state.currentPanelExpanded) {
        const currentPanel = document.getElementById('pac-current-panel');
        state.currentPanelExpanded = false;
        currentPanel.classList.remove('expanded');
      }
      if (state.settingsPanelExpanded) {
        const settingsPanel = document.getElementById('pac-settings-panel');
        state.settingsPanelExpanded = false;
        settingsPanel.classList.remove('expanded');
      }
      
      state.shopHistoryPanelExpanded = !state.shopHistoryPanelExpanded;
      panel.classList.toggle('expanded', state.shopHistoryPanelExpanded);
      
      // Render appropriate tab content when panel opens
      if (state.shopHistoryPanelExpanded) {
        if (state.analyticsTab === 'analytics') {
          renderAnalytics();
        } else if (state.analyticsTab === 'fishing') {
          renderFishingTab();
        }
      }
    });
    
    closeBtn.addEventListener('click', () => {
      state.shopHistoryPanelExpanded = false;
      panel.classList.remove('expanded');
    });
    
    // Clear session button (just current session display, keeps localStorage)
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        clearShopHistory();
      });
    }
    
    // Clear ALL history button (clears localStorage too)
    if (analyticsClearBtn) {
      analyticsClearBtn.addEventListener('click', () => {
        clearRollHistory();  // This clears localStorage
        updateHistoryDisplay();
        renderAnalytics();
        if (DEBUG_MODE) console.log('🗑️ All roll history cleared from localStorage');
      });
    }
  }
  
  function clearShopHistory() {
    state.shopHistoryByPlayer = {};
    clearRollHistory();  // Also clear localStorage
    updateHistoryDisplay();
    renderAnalytics();
    if (DEBUG_MODE) console.log('🗑️ Shop history cleared');
  }
  
  function trackShopRoll(playerName, shopArray, playerLevel) {
    if (!state.shopTrackingEnabled || !shopArray || shopArray.length === 0) return;
    
    const level = playerLevel || 7;  // Default to 7 if unknown
    
    // Initialize player data if needed
    if (!state.shopHistoryByPlayer[playerName]) {
      state.shopHistoryByPlayer[playerName] = {
        rollsByLevel: {},    // { level: { rollCount, pokemonSeen: {} } }
        currentLevel: level,
        lastSnapshot: []
      };
    }
    
    const playerData = state.shopHistoryByPlayer[playerName];
    
    // Update current level
    playerData.currentLevel = level;
    
    // Initialize level bucket if needed
    if (!playerData.rollsByLevel[level]) {
      playerData.rollsByLevel[level] = {
        rollCount: 0,
        pokemonSeen: {}
      };
    }
    
    const levelData = playerData.rollsByLevel[level];
    
    // Get current shop names (filter out empty/null slots and DEFAULT placeholders)
    const currentShop = shopArray.filter(n => n && n !== 'DEFAULT');
    
    // Skip if empty shop
    if (currentShop.length === 0) return;
    
    // If first shop for this player, track it as the initial shop (free shop at game start)
    if (!playerData.lastSnapshot || playerData.lastSnapshot.length === 0) {
      // Track initial shop as roll #1
      levelData.rollCount++;
      currentShop.forEach(name => {
        if (name) {
          const upperName = name.toUpperCase();
          levelData.pokemonSeen[upperName] = (levelData.pokemonSeen[upperName] || 0) + 1;
        }
      });
      playerData.lastSnapshot = currentShop;
      
      // Update display and save
      updateHistoryDisplay();
      saveRollHistory();
      
      if (state.analyticsTab === 'analytics' && state.shopHistoryPanelExpanded) {
        renderAnalytics();
      }
      
      if (DEBUG_MODE) console.log(`🎰 ${playerName} (Lv${level}) Initial shop:`, currentShop);
      return;
    }
    
    // Compare with previous shop - count how many are NEW (not in previous)
    const previousSet = new Set(playerData.lastSnapshot);
    const newPokemon = currentShop.filter(name => !previousSet.has(name));
    
    // A real roll typically changes 4-5 slots (all new Pokemon)
    // A purchase only removes 1 slot (0-1 new Pokemon)
    // Threshold: Need at least 3 new Pokemon to count as a roll
    const isRealRoll = newPokemon.length >= 3;
    
    if (isRealRoll) {
      levelData.rollCount++;
      
      // Count each Pokemon seen in the new shop AT THIS LEVEL
      currentShop.forEach(name => {
        if (name) {
          const upperName = name.toUpperCase();
          levelData.pokemonSeen[upperName] = (levelData.pokemonSeen[upperName] || 0) + 1;
        }
      });
      
      // Update display and save to localStorage
      updateHistoryDisplay();
      saveRollHistory();
      
      // Real-time analytics update if analytics tab is active
      if (state.analyticsTab === 'analytics' && state.shopHistoryPanelExpanded) {
        renderAnalytics();
      }
      
      if (DEBUG_MODE) console.log(`🎰 ${playerName} (Lv${level}) Roll #${levelData.rollCount}:`, currentShop);
    }
    
    // Always update snapshot
    playerData.lastSnapshot = currentShop;
  }
  
  // Calculate expected seen across all levels a player rolled at
  function calculateExpectedForPlayer(pokemonName, playerData) {
    const pokeData = POKEMON_DATA[pokemonName];
    if (!pokeData) return 0;
    
    const rarity = pokeData.rarity;
    
    // Only pool rarities can be calculated (unique/legendary don't appear in normal shops)
    if (!['common', 'uncommon', 'rare', 'epic', 'ultra'].includes(rarity)) return 0;
    
    // Get dynamic species counts from current pool state
    const totalPool = calculateTotalPool();
    const poolData = totalPool[rarity];
    if (!poolData) return 0;
    
    // Total species = 2★ species + 3★ species
    const species = poolData.twoStarSpecies + poolData.threeStarSpecies;
    if (species === 0) return 0;
    
    let totalExpected = 0;
    
    // Sum expected across all levels they rolled at
    Object.entries(playerData.rollsByLevel).forEach(([lvl, levelData]) => {
      const level = parseInt(lvl);
      // Use SHOP_ODDS directly (capped at level 9)
      const cappedLevel = Math.min(Math.max(level, 1), 9);
      const odds = SHOP_ODDS[cappedLevel];
      const rate = (odds[rarity] || 0) / 100;  // Convert from percentage to decimal
      
      // Expected for this level = rolls × 6 slots × (rarity_rate / species_count)
      totalExpected += levelData.rollCount * 6 * (rate / species);
    });
    
    return totalExpected;
  }
  
  // Get total seen for a Pokemon across all levels
  function getTotalSeenForPlayer(pokemonName, playerData) {
    let total = 0;
    Object.values(playerData.rollsByLevel).forEach(levelData => {
      total += levelData.pokemonSeen[pokemonName] || 0;
    });
    return total;
  }
  
  // Get total rolls for a player across all levels
  function getTotalRollsForPlayer(playerData) {
    let total = 0;
    Object.values(playerData.rollsByLevel).forEach(levelData => {
      total += levelData.rollCount;
    });
    return total;
  }
  
  function updateHistoryDisplay() {
    const container = document.getElementById('pacHistoryPlayers');
    if (!container) return;
    
    const players = Object.keys(state.shopHistoryByPlayer);
    
    if (players.length === 0) {
      container.innerHTML = '<div class="pac-history-empty">No rolls tracked yet.<br>Rolls are detected when Live Tracking is ON.</div>';
      return;
    }
    
    // Sort players - current player first, then alphabetically
    players.sort((a, b) => {
      if (a === state.playerName) return -1;
      if (b === state.playerName) return 1;
      return a.localeCompare(b);
    });
    
    // Build accordion HTML
    let html = '';
    players.forEach(playerName => {
      const playerData = state.shopHistoryByPlayer[playerName];
      const isCurrentPlayer = playerName === state.playerName;
      const rollCount = getTotalRollsForPlayer(playerData);
      const playerLevel = playerData.currentLevel || 7;
      
      // Get all unique Pokemon seen across all levels
      const allPokemonSeen = new Set();
      Object.values(playerData.rollsByLevel).forEach(levelData => {
        Object.keys(levelData.pokemonSeen).forEach(name => allPokemonSeen.add(name));
      });
      
      // Calculate luck data for this player using per-level expectations
      const luckData = [];
      allPokemonSeen.forEach(name => {
        const seen = getTotalSeenForPlayer(name, playerData);
        const expected = calculateExpectedForPlayer(name, playerData);
        if (expected > 0.1) {
          const diff = ((seen - expected) / expected) * 100;
          luckData.push({ name, seen, expected, diff });
        }
      });
      
      luckData.sort((a, b) => b.diff - a.diff);
      
      const lucky = luckData.filter(d => d.diff > 30);
      const unlucky = luckData.filter(d => d.diff < -30);
      
      // Summary icons
      const luckyCount = lucky.length;
      const unluckyCount = unlucky.length;
      
      // Build levels breakdown string
      const levelBreakdown = Object.entries(playerData.rollsByLevel)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .map(([lvl, data]) => `L${lvl}:${data.rollCount}`)
        .join(' ');
      
      html += `
        <div class="pac-history-player ${isCurrentPlayer ? 'current-player' : ''}">
          <div class="pac-history-player-header" data-player="${playerName}">
            <span class="pac-history-player-name">${isCurrentPlayer ? '⭐ ' : ''}${playerName}</span>
            <span class="pac-history-player-summary">
              <span class="pac-history-level">Lv${playerLevel}</span>
              <span class="pac-history-rolls">${rollCount}🎰</span>
              ${luckyCount > 0 ? `<span class="pac-history-lucky-count">🍀${luckyCount}</span>` : ''}
              ${unluckyCount > 0 ? `<span class="pac-history-unlucky-count">😤${unluckyCount}</span>` : ''}
              <span class="pac-history-expand-icon">▼</span>
            </span>
          </div>
          <div class="pac-history-player-content" style="display: none;">
            <div class="pac-history-level-breakdown">${levelBreakdown}</div>
            ${rollCount === 0 ? '<div class="pac-history-empty">No rolls yet</div>' : `
              ${lucky.length > 0 ? `
                <div class="pac-history-section lucky">
                  <div class="pac-history-section-title">🍀 Lucky</div>
                  <div class="pac-history-list">
                    ${lucky.slice(0, 5).map(d => `
                      <div class="pac-history-item">
                        <span class="pac-history-pokemon">${d.name}</span>
                        <div class="pac-history-stats-row">
                          <span class="pac-history-seen">${d.seen}x</span>
                          <span class="pac-history-expected">(${d.expected.toFixed(1)})</span>
                          <span class="pac-history-diff positive">+${Math.round(d.diff)}%</span>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
              ${unlucky.length > 0 ? `
                <div class="pac-history-section unlucky">
                  <div class="pac-history-section-title">😤 Unlucky</div>
                  <div class="pac-history-list">
                    ${unlucky.slice(-5).reverse().map(d => `
                      <div class="pac-history-item">
                        <span class="pac-history-pokemon">${d.name}</span>
                        <div class="pac-history-stats-row">
                          <span class="pac-history-seen">${d.seen}x</span>
                          <span class="pac-history-expected">(${d.expected.toFixed(1)})</span>
                          <span class="pac-history-diff negative">${Math.round(d.diff)}%</span>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
              ${lucky.length === 0 && unlucky.length === 0 ? '<div class="pac-history-empty">All rolls within normal range</div>' : ''}
            `}
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
    
    // Attach click handlers for accordion
    container.querySelectorAll('.pac-history-player-header').forEach(header => {
      header.addEventListener('click', () => {
        const player = header.closest('.pac-history-player');
        const content = player.querySelector('.pac-history-player-content');
        const icon = header.querySelector('.pac-history-expand-icon');
        
        const isExpanded = content.style.display !== 'none';
        content.style.display = isExpanded ? 'none' : 'block';
        icon.textContent = isExpanded ? '▼' : '▲';
        player.classList.toggle('expanded', !isExpanded);
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FISHING TAB (v3.2.1)
  // ═══════════════════════════════════════════════════════════════════════════

  const FISHING_ODDS = {
    old:   { common: 35, uncommon: 10, rare: 0,  epic: 0,  special: 55, specialName: 'Magikarp' },
    good:  { common: 25, uncommon: 30, rare: 10, epic: 0,  special: 35, specialName: 'Feebas' },
    super: { common: 5,  uncommon: 25, rare: 25, epic: 10, special: 35, specialName: 'Wishiwashi' }
  };

  // Get all water-type Pokemon that can be fished based on current settings
  function getFishableWaterPokemon() {
    const fishable = {
      common: [],
      uncommon: [],
      rare: [],
      epic: []
    };
    
    // Track if user might have water regionals/add-picks
    let hasWaterRegionals = false;
    let hasWaterAddPicks = false;
    
    Object.entries(POKEMON_DATA).forEach(([name, data]) => {
      // Skip non-water types
      if (!data.types || !data.types.includes('water')) return;
      
      // Skip special pool (Magikarp, Feebas, etc. - they're special catches)
      if (data.rarity === 'special') return;
      
      // Skip hatch-only Pokemon
      if (data.rarity === 'hatch') return;
      
      // Skip unique Pokemon (can't be fished from normal pool)
      if (data.rarity === 'unique') return;
      
      // Skip unknown rarity
      if (data.rarity === 'unknown') return;
      
      // Skip ultra rarity (0% chance on all rods)
      if (data.rarity === 'ultra') return;
      
      // Only include if this IS the base form (skip evolutions)
      const baseForm = getBaseForm(name);
      if (baseForm !== name) return;
      
      const isRegional = data.regional === true;
      const isAdditional = data.additional === true;
      
      // Track that water regionals/add-picks exist
      if (isRegional) hasWaterRegionals = true;
      if (isAdditional) hasWaterAddPicks = true;
      
      // Only show BASE POOL Pokemon (not regional, not add-pick)
      // We can't know which specific regionals/add-picks the user has
      if (isRegional || isAdditional) return;
      
      // Get base form name for display
      const displayName = formatPokemonName(name);
      
      // Add to appropriate rarity group
      if (fishable[data.rarity]) {
        fishable[data.rarity].push({
          name: displayName,
          source: 'base'
        });
      }
    });
    
    // Sort each rarity group alphabetically
    Object.keys(fishable).forEach(rarity => {
      fishable[rarity].sort((a, b) => a.name.localeCompare(b.name));
    });
    
    // Add flags for UI note
    fishable.hasWaterRegionals = hasWaterRegionals;
    fishable.hasWaterAddPicks = hasWaterAddPicks;
    
    return fishable;
  }

  function formatPokemonName(name) {
    // Convert UPPERCASE to Title Case
    return name.charAt(0) + name.slice(1).toLowerCase();
  }

  function setupFishingTab() {
    // Rod button click handlers
    const rodBtns = document.querySelectorAll('.pac-rod-btn');
    rodBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const rod = btn.dataset.rod;
        state.fishingRod = rod;
        
        // Update button states
        rodBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Re-render fishing content
        renderFishingTab();
      });
    });
    
    // Mantyke toggle
    const mantykeToggle = document.getElementById('pacMantykeToggle');
    if (mantykeToggle) {
      mantykeToggle.addEventListener('change', () => {
        state.fishingMantyke = mantykeToggle.checked;
        renderFishingTab();
      });
    }
  }

  function renderFishingTab() {
    const oddsContainer = document.getElementById('pacFishingOdds');
    const poolContainer = document.getElementById('pacFishingPool');
    const mantykeToggle = document.getElementById('pacMantykeToggle');
    
    if (!oddsContainer || !poolContainer) return;
    
    // Sync checkbox with state (but don't auto-enable - let user control it)
    if (mantykeToggle) {
      mantykeToggle.checked = state.fishingMantyke;
    }
    
    const rod = state.fishingRod;
    
    // If no rod selected, show placeholder
    if (rod === 'none') {
      oddsContainer.innerHTML = '<div class="pac-fishing-no-rod">Select a rod to see catch rates</div>';
      poolContainer.innerHTML = '<div class="pac-fishing-no-rod">Select a rod to see fishable Pokemon</div>';
      return;
    }
    
    const odds = FISHING_ODDS[rod];
    
    // ═══════════════════════════════════════════════════════════════════════════
    // REMORAID PRE-ROLL CALCULATION
    // Remoraid = (33% if Mantine) OR (wildChance based on wild stars)
    // BUT if Octillery on board, Remoraid is LOCKED (0% effective)
    // ═══════════════════════════════════════════════════════════════════════════
    
    const MANTINE_REMORAID_RATE = 0.33;
    const isOctilleryLocked = state.fishingOctilleryLocked;
    
    // Get wild chance from state (same calc as main panel - based on stars)
    const wildBoost = state.pveRoundEnabled 
      ? (0.05 + (state.wildUnitsOwned * 0.01)) 
      : (state.wildUnitsOwned * 0.01);
    
    // Calculate Remoraid pre-roll chance (OR logic, not AND)
    // P(Remoraid) = 1 - P(miss Mantine) × P(miss Wild)
    let remoaidChance = 0;
    if (state.fishingMantyke && wildBoost > 0) {
      // Both active: OR logic
      remoaidChance = 1 - ((1 - MANTINE_REMORAID_RATE) * (1 - wildBoost));
    } else if (state.fishingMantyke) {
      // Mantine only
      remoaidChance = MANTINE_REMORAID_RATE;
    } else if (wildBoost > 0) {
      // Wild only
      remoaidChance = wildBoost;
    }
    // else: 0% (neither active)
    
    // Store the "potential" chance for display, but effective chance is 0 if Octillery locked
    const potentialRemoaidChance = remoaidChance;
    const effectiveRemoaidChance = isOctilleryLocked ? 0 : remoaidChance;
    
    // Factor for adjusting standard pool odds (use EFFECTIVE chance)
    const nonRemoaidFactor = 1 - effectiveRemoaidChance;
    
    // ═══════════════════════════════════════════════════════════════════════════
    // RENDER ODDS TABLE WITH REMORAID SECTION
    // ═══════════════════════════════════════════════════════════════════════════
    
    // Build Remoraid breakdown string
    let remoaidBreakdown = '';
    if (state.fishingMantyke && wildBoost > 0) {
      remoaidBreakdown = `Mantine 33% OR Wild ${(wildBoost * 100).toFixed(0)}%`;
    } else if (state.fishingMantyke) {
      remoaidBreakdown = 'Mantine 33%';
    } else if (wildBoost > 0) {
      remoaidBreakdown = `Wild ${(wildBoost * 100).toFixed(0)}%`;
    } else {
      remoaidBreakdown = 'Need Mantine or Wild synergy';
    }
    
    // Get Remoraid count
    const remoraidsOwned = state.fishingRemoraidsOwned || 0;
    
    // Calculate adjusted odds for standard pool
    const adjCommon = (odds.common * nonRemoaidFactor).toFixed(1);
    const adjUncommon = (odds.uncommon * nonRemoaidFactor).toFixed(1);
    const adjRare = (odds.rare * nonRemoaidFactor).toFixed(1);
    const adjEpic = (odds.epic * nonRemoaidFactor).toFixed(1);
    const adjSpecial = (odds.special * nonRemoaidFactor).toFixed(1);
    
    // Build Remoraid section based on state
    let remoaidSectionHtml = '';
    if (isOctilleryLocked) {
      // Octillery on board - fishing locked
      remoaidSectionHtml = `
        <div class="pac-fishing-remoraid-section" style="background: rgba(244, 67, 54, 0.15); border: 1px solid #f44336; border-radius: 6px; padding: 8px; margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; color: #f44336;">🔒 Remoraid Fishing LOCKED</span>
            <span style="font-weight: 700; font-size: 14px; color: #f44336;">0%</span>
          </div>
          <div style="font-size: 10px; color: #f44336; margin-top: 4px;">Octillery on board — no more Remoraid fishing</div>
          <div style="font-size: 9px; color: #888; margin-top: 4px;">💰 Sell Octillery to unlock again</div>
        </div>
      `;
    } else {
      // Normal Remoraid fishing
      const remoaidStatusText = remoraidsOwned > 0 
        ? `<span style="margin-left: 8px; font-size: 11px; color: #aaa;">(${remoraidsOwned}/3 owned)</span>`
        : '';
      
      remoaidSectionHtml = `
        <div class="pac-fishing-remoraid-section" style="background: ${remoaidChance > 0 ? 'rgba(255, 152, 0, 0.15)' : 'rgba(100,100,100,0.1)'}; border: 1px solid ${remoaidChance > 0 ? '#ff9800' : '#555'}; border-radius: 6px; padding: 8px; margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; color: ${remoaidChance > 0 ? '#ff9800' : '#888'};">🐟 Remoraid Pre-Roll${remoaidStatusText}</span>
            <span style="font-weight: 700; font-size: 16px; color: ${remoaidChance > 0 ? '#ff9800' : '#666'};">${(remoaidChance * 100).toFixed(1)}%</span>
          </div>
          <div style="font-size: 10px; color: #aaa; margin-top: 4px;">${remoaidBreakdown}${state.fishingMantyke ? ' <span style="color: #4caf50;">✓ Auto-detected</span>' : ''}</div>
          ${remoaidChance > 0 ? '<div style="font-size: 9px; color: #888; margin-top: 4px;">💰 Sell for gold to keep fishing | Octillery on board = no more Remoraid</div>' : ''}
        </div>
      `;
    }
    
    // Build standard pool header text
    let standardPoolText = '';
    if (isOctilleryLocked) {
      standardPoolText = 'Standard pool (Remoraid locked):';
    } else if (effectiveRemoaidChance > 0) {
      standardPoolText = `If Remoraid misses → Standard pool (×${(nonRemoaidFactor * 100).toFixed(0)}%):`;
    } else {
      standardPoolText = 'Standard pool:';
    }
    
    let oddsHtml = `
      ${remoaidSectionHtml}
      
      <div style="font-size: 10px; color: #888; margin-bottom: 6px;">${standardPoolText}</div>
      
      <table class="pac-fishing-odds-table">
        <tr>
          <th>Rarity</th>
          <th>Base</th>
          <th>${effectiveRemoaidChance > 0 ? 'Adjusted' : 'Chance'}</th>
        </tr>
        <tr>
          <td class="rarity-common">Common</td>
          <td style="color: #666;">${odds.common}%</td>
          <td>${adjCommon}%</td>
        </tr>
        <tr>
          <td class="rarity-uncommon">Uncommon</td>
          <td style="color: #666;">${odds.uncommon}%</td>
          <td>${adjUncommon}%</td>
        </tr>
        <tr>
          <td class="rarity-rare">Rare</td>
          <td style="color: #666;">${odds.rare}%</td>
          <td>${adjRare}%</td>
        </tr>
        <tr>
          <td class="rarity-epic">Epic</td>
          <td style="color: #666;">${odds.epic}%</td>
          <td>${adjEpic}%</td>
        </tr>
        <tr>
          <td class="rarity-special">✨ Special</td>
          <td style="color: #666;">${odds.special}%</td>
          <td>${adjSpecial}%</td>
        </tr>
      </table>
      <div class="pac-fishing-special-note">
        ✨ Special: ${odds.specialName}
      </div>
    `;
    oddsContainer.innerHTML = oddsHtml;
    
    // ═══════════════════════════════════════════════════════════════════════════
    // RENDER FISHABLE POKEMON WITH ADJUSTED TOOLTIPS
    // ═══════════════════════════════════════════════════════════════════════════
    
    // Get fishable Pokemon
    const fishable = getFishableWaterPokemon();
    
    // Filter by rod tier (can only catch rarities with >0% chance)
    const availableRarities = [];
    if (odds.common > 0) availableRarities.push('common');
    if (odds.uncommon > 0) availableRarities.push('uncommon');
    if (odds.rare > 0) availableRarities.push('rare');
    if (odds.epic > 0) availableRarities.push('epic');
    
    // Render fishable Pokemon grouped by rarity
    let poolHtml = '';
    
    // Add Remoraid at top if there's any chance (and not locked by Octillery)
    if (remoaidChance > 0 && !isOctilleryLocked) {
      const remoaidCountText = remoraidsOwned > 0 ? ` (${remoraidsOwned}/3 held)` : '';
      poolHtml += `
        <div class="pac-fishing-rarity-group">
          <div class="pac-fishing-rarity-label" style="color: #ff9800;">🐟 Remoraid (${(remoaidChance * 100).toFixed(1)}%)${remoaidCountText}</div>
          <div class="pac-fishing-pokemon-list">
            <span class="pac-fishing-pokemon" style="border-color: #ff9800; background: rgba(255,152,0,0.1);">Remoraid<span class="pac-fish-tooltip">🐟 Remoraid: ${(remoaidChance * 100).toFixed(1)}%<br><span style="font-size:10px;color:#666;">${remoaidBreakdown}<br>Sell for gold or evolve to Octillery</span></span></span>
          </div>
        </div>
      `;
    }
    
    availableRarities.forEach(rarity => {
      const pokemon = fishable[rarity];
      if (pokemon.length === 0) return;
      
      const baseRarityChance = FISHING_ODDS[rod][rarity];
      const adjustedRarityChance = baseRarityChance * nonRemoaidFactor;
      const perPokemonChance = pokemon.length > 0 ? (adjustedRarityChance / pokemon.length) : 0;
      const basePerPokemon = pokemon.length > 0 ? (baseRarityChance / pokemon.length) : 0;
      
      poolHtml += `
        <div class="pac-fishing-rarity-group">
          <div class="pac-fishing-rarity-label ${rarity}">${rarity.charAt(0).toUpperCase() + rarity.slice(1)} (${adjustedRarityChance.toFixed(1)}%)</div>
          <div class="pac-fishing-pokemon-list">
            ${pokemon.map(p => `<span class="pac-fishing-pokemon">${p.name}<span class="pac-fish-tooltip">🎣 ${p.name}: ${perPokemonChance.toFixed(2)}%${effectiveRemoaidChance > 0 ? '<br><span style="font-size:10px;color:#666;">Base: ' + basePerPokemon.toFixed(2) + '% × ' + (nonRemoaidFactor * 100).toFixed(0) + '% non-Remoraid</span>' : ''}</span></span>`).join('')}
          </div>
        </div>
      `;
    });
    
    if (poolHtml === '') {
      poolHtml = '<div class="pac-fishing-no-rod">No fishable Pokemon at this rod tier</div>';
    } else {
      // Add note about regionals/add-picks
      poolHtml += `
        <div class="pac-fishing-note">
          💡 Water-type regionals and add-picks in your pool are also fishable!
        </div>
      `;
    }
    
    poolContainer.innerHTML = poolHtml;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ANALYTICS RENDERING (v3.2.1)
  // ═══════════════════════════════════════════════════════════════════════════

  function renderAnalytics() {
    const players = Object.keys(state.shopHistoryByPlayer);
    if (players.length === 0) {
      renderEmptyAnalytics();
      return;
    }
    
    // Aggregate all data across all players
    const aggregated = aggregateAllPlayerData();
    
    // Render each section
    renderLuckGauge(aggregated);
    renderRarityCharts(aggregated);
    renderLevelGrid(aggregated);
    renderTopPokemon(aggregated);
    renderDittoSection(aggregated);
    renderWildSection(aggregated);
    renderNarrativeSummary(aggregated);
  }
  
  function renderEmptyAnalytics() {
    document.getElementById('pacLuckScore').textContent = '—';
    document.getElementById('pacLuckScore').className = 'pac-luck-score neutral';
    document.getElementById('pacLuckMarker').style.left = '50%';
    document.getElementById('pacRarityCharts').innerHTML = '<div class="pac-history-empty">No data yet</div>';
    document.getElementById('pacLevelGrid').innerHTML = '<div class="pac-history-empty">No data yet</div>';
    document.getElementById('pacLuckyPokemon').innerHTML = '<div class="pac-history-empty">No data yet</div>';
    document.getElementById('pacUnluckyPokemon').innerHTML = '<div class="pac-history-empty">No data yet</div>';
    document.getElementById('pacDittoStats').innerHTML = '<div class="pac-history-empty">No Ditto seen yet</div>';
    document.getElementById('pacWildPokemon').innerHTML = '<div class="pac-history-empty">No wild Pokemon seen yet</div>';
    document.getElementById('pacNarrativeSummary').innerHTML = '<p>No data to analyze yet. Start rolling to see your luck story!</p>';
  }
  
  function aggregateAllPlayerData() {
    const result = {
      totalRolls: 0,
      rollsByLevel: {},       // { level: count }
      rarityStats: {},        // { rarity: { seen, expected } } - NON-WILD ONLY
      pokemonStats: {},       // { name: { seen, expected, rarity, isWild } }
      wildStats: {            // Wild Pokemon separate
        seen: 0,
        pokemon: {}           // { name: { seen, rarity } }
      },
      dittoStats: {           // Ditto tracking
        seen: 0,
        expected: 0
      },
      luckScore: 0
    };
    
    // Initialize rarities (for non-wild only)
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'ultra'];
    rarities.forEach(r => {
      result.rarityStats[r] = { seen: 0, expected: 0 };
    });
    
    Object.values(state.shopHistoryByPlayer).forEach(playerData => {
      Object.entries(playerData.rollsByLevel).forEach(([level, levelData]) => {
        const lvl = parseInt(level);
        result.rollsByLevel[lvl] = (result.rollsByLevel[lvl] || 0) + levelData.rollCount;
        result.totalRolls += levelData.rollCount;
        
        // Calculate expected for each rarity at this level DIRECTLY (non-wild)
        // Expected = rolls × 6 slots × (rarity_rate / 100)
        const cappedLevel = Math.min(Math.max(lvl, 1), 9);
        const odds = SHOP_ODDS[cappedLevel];
        rarities.forEach(rarity => {
          const rate = (odds[rarity] || 0) / 100;
          result.rarityStats[rarity].expected += levelData.rollCount * 6 * rate;
        });
        
        // Aggregate Pokemon seen
        Object.entries(levelData.pokemonSeen).forEach(([name, count]) => {
          const pokeData = POKEMON_DATA[name];
          const rarity = pokeData ? pokeData.rarity : 'unknown';
          const isWild = isWildPokemon(name);
          const isDitto = name === 'DITTO';
          
          // Track Ditto separately (always lucky!)
          if (isDitto) {
            result.dittoStats.seen += count;
          } else if (isWild) {
            // Track wild Pokemon separately
            result.wildStats.seen += count;
            if (!result.wildStats.pokemon[name]) {
              result.wildStats.pokemon[name] = { seen: 0, rarity };
            }
            result.wildStats.pokemon[name].seen += count;
          } else {
            // Track non-wild Pokemon
            if (!result.pokemonStats[name]) {
              result.pokemonStats[name] = {
                seen: 0,
                expected: 0,
                rarity,
                isWild: false
              };
            }
            result.pokemonStats[name].seen += count;
            
            // Track by rarity (seen count) - non-wild only
            if (result.rarityStats[rarity]) {
              result.rarityStats[rarity].seen += count;
            }
          }
        });
      });
    });
    
    // Calculate expected values for each individual non-wild Pokemon
    Object.entries(result.pokemonStats).forEach(([name, stats]) => {
      let totalExpected = 0;
      Object.values(state.shopHistoryByPlayer).forEach(playerData => {
        totalExpected += calculateExpectedForPlayer(name, playerData);
      });
      stats.expected = totalExpected;
    });
    
    // Calculate overall luck score based on RARITY TOTALS (more accurate)
    // This accounts for Pokemon that were expected but never seen
    let totalExpected = 0;
    let totalSeen = 0;
    
    rarities.forEach(rarity => {
      const stats = result.rarityStats[rarity];
      if (stats.expected > 0) {
        totalExpected += stats.expected;
        totalSeen += stats.seen;
      }
    });
    
    // Luck score = overall deviation from expected
    result.luckScore = totalExpected > 0 ? ((totalSeen - totalExpected) / totalExpected) * 100 : 0;
    
    return result;
  }
  
  function renderLuckGauge(data) {
    const score = data.luckScore;
    const scoreEl = document.getElementById('pacLuckScore');
    const markerEl = document.getElementById('pacLuckMarker');
    
    // Format score
    const displayScore = score >= 0 ? `+${score.toFixed(0)}%` : `${score.toFixed(0)}%`;
    scoreEl.textContent = displayScore;
    
    // Set color class
    scoreEl.className = 'pac-luck-score';
    if (score > 10) scoreEl.classList.add('lucky');
    else if (score < -10) scoreEl.classList.add('unlucky');
    else scoreEl.classList.add('neutral');
    
    // Position marker - map score to 0-100% position
    // Score of -50 = 0%, score of 0 = 50%, score of +50 = 100%
    // Clamp between 5% and 95% for visual clarity
    const markerPos = Math.max(5, Math.min(95, 50 + (score * 0.8)));
    markerEl.style.left = markerPos + '%';
  }
  
  function renderRarityCharts(data) {
    const container = document.getElementById('pacRarityCharts');
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'ultra'];
    
    let html = '';
    rarities.forEach(rarity => {
      const stats = data.rarityStats[rarity];
      if (!stats || stats.expected < 0.5) return;
      
      const diff = ((stats.seen - stats.expected) / stats.expected) * 100;
      const diffClass = diff > 5 ? 'positive' : diff < -5 ? 'negative' : '';
      const diffStr = diff >= 0 ? `+${diff.toFixed(0)}%` : `${diff.toFixed(0)}%`;
      
      // Percentage-based bars - expected is always 100%, actual scales relative
      const ratio = stats.seen / stats.expected;
      const maxRatio = Math.max(ratio, 1.5); // Cap at 150% for visual balance
      const expectedWidth = (1 / maxRatio) * 100;
      const actualWidth = Math.min(ratio / maxRatio, 1) * 100;
      const actualClass = diff > 5 ? 'over' : diff < -5 ? 'under' : '';
      
      html += `
        <div class="pac-rarity-chart">
          <div class="pac-rarity-chart-title">
            <span>${rarity.charAt(0).toUpperCase() + rarity.slice(1)}</span>
            <span class="pac-rarity-chart-diff ${diffClass}">${diffStr}</span>
          </div>
          <div class="pac-chart-horizontal">
            <div class="pac-chart-row">
              <span class="pac-chart-row-label">Exp</span>
              <div class="pac-chart-bar-h expected" style="width: ${expectedWidth}%;">
                <span class="pac-chart-bar-value">${stats.expected.toFixed(0)}</span>
              </div>
            </div>
            <div class="pac-chart-row">
              <span class="pac-chart-row-label">Act</span>
              <div class="pac-chart-bar-h actual ${actualClass}" style="width: ${actualWidth}%;">
                <span class="pac-chart-bar-value">${stats.seen}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    
    if (html === '') {
      html = '<div class="pac-history-empty">Not enough data yet</div>';
    }
    
    container.innerHTML = html;
  }
  
  function renderLevelGrid(data) {
    const container = document.getElementById('pacLevelGrid');
    const levels = Object.entries(data.rollsByLevel)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
    
    if (levels.length === 0) {
      container.innerHTML = '<div class="pac-history-empty">No rolls tracked</div>';
      return;
    }
    
    let html = '';
    levels.forEach(([level, count]) => {
      html += `
        <div class="pac-level-card">
          <div class="pac-level-card-header">Level ${level}</div>
          <div class="pac-level-card-rolls">${count}</div>
          <div class="pac-level-card-label">rolls</div>
        </div>
      `;
    });
    
    // Add total
    html += `
      <div class="pac-level-card" style="background: #e3f2fd;">
        <div class="pac-level-card-header">Total</div>
        <div class="pac-level-card-rolls">${data.totalRolls}</div>
        <div class="pac-level-card-label">rolls</div>
      </div>
    `;
    
    container.innerHTML = html;
  }
  
  function renderTopPokemon(data) {
    const luckyContainer = document.getElementById('pacLuckyPokemon');
    const unluckyContainer = document.getElementById('pacUnluckyPokemon');
    
    // Build sorted list
    const pokemonList = Object.entries(data.pokemonStats)
      .filter(([name, stats]) => stats.expected > 0.5)
      .map(([name, stats]) => ({
        name,
        seen: stats.seen,
        expected: stats.expected,
        diff: ((stats.seen - stats.expected) / stats.expected) * 100
      }))
      .sort((a, b) => b.diff - a.diff);
    
    // Top 4 lucky
    const lucky = pokemonList.filter(p => p.diff > 10).slice(0, 4);
    if (lucky.length > 0) {
      luckyContainer.innerHTML = lucky.map(p => `
        <div class="pac-top-pokemon-card">
          <span class="pac-top-pokemon-name">${p.name}</span>
          <div class="pac-top-pokemon-stats">
            <div class="pac-top-pokemon-seen">${p.seen}× seen</div>
            <div class="pac-top-pokemon-diff positive">+${p.diff.toFixed(0)}%</div>
          </div>
        </div>
      `).join('');
    } else {
      luckyContainer.innerHTML = '<div class="pac-history-empty">No notably lucky Pokemon yet</div>';
    }
    
    // Top 4 unlucky
    const unlucky = pokemonList.filter(p => p.diff < -10).slice(-4).reverse();
    if (unlucky.length > 0) {
      unluckyContainer.innerHTML = unlucky.map(p => `
        <div class="pac-top-pokemon-card">
          <span class="pac-top-pokemon-name">${p.name}</span>
          <div class="pac-top-pokemon-stats">
            <div class="pac-top-pokemon-seen">${p.seen}× seen</div>
            <div class="pac-top-pokemon-diff negative">${p.diff.toFixed(0)}%</div>
          </div>
        </div>
      `).join('');
    } else {
      unluckyContainer.innerHTML = '<div class="pac-history-empty">No notably unlucky Pokemon yet</div>';
    }
  }
  
  function renderDittoSection(data) {
    const container = document.getElementById('pacDittoStats');
    if (!container) return;
    
    const dittoSeen = data.dittoStats.seen;
    const totalRolls = data.totalRolls;
    
    if (dittoSeen === 0) {
      container.innerHTML = '<div class="pac-history-empty">No Ditto seen yet</div>';
      return;
    }
    
    // Calculate hit rate (Ditto per roll)
    const hitRate = totalRolls > 0 ? (dittoSeen / totalRolls * 100).toFixed(1) : 0;
    
    // Fun message based on Ditto count
    let message = '';
    if (dittoSeen >= 5) {
      message = '🎉 Ditto loves you!';
    } else if (dittoSeen >= 3) {
      message = '✨ Nice Ditto luck!';
    } else if (dittoSeen >= 1) {
      message = '👀 Spotted!';
    }
    
    const html = `
      <div class="pac-ditto-stats-card">
        <div class="pac-ditto-count">
          <span class="pac-ditto-number">${dittoSeen}</span>
          <span class="pac-ditto-label">Ditto${dittoSeen !== 1 ? 's' : ''} found</span>
        </div>
        <div class="pac-ditto-rate">
          <span class="pac-ditto-rate-value">${hitRate}%</span>
          <span class="pac-ditto-rate-label">of rolls</span>
        </div>
        ${message ? `<div class="pac-ditto-message">${message}</div>` : ''}
      </div>
    `;
    
    container.innerHTML = html;
  }
  
  function renderWildSection(data) {
    const container = document.getElementById('pacWildPokemon');
    if (!container) return;
    
    const wildData = data.wildStats;
    const wildPokemon = Object.entries(wildData.pokemon)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.seen - a.seen);
    
    if (wildPokemon.length === 0) {
      container.innerHTML = '<div class="pac-history-empty">No wild Pokemon seen yet</div>';
      return;
    }
    
    // Group by rarity
    const byRarity = {};
    wildPokemon.forEach(p => {
      if (!byRarity[p.rarity]) byRarity[p.rarity] = [];
      byRarity[p.rarity].push(p);
    });
    
    let html = `<div class="pac-wild-total">Total wild hits: <strong>${wildData.seen}</strong></div>`;
    
    html += '<div class="pac-wild-pokemon-grid">';
    wildPokemon.slice(0, 8).forEach(p => {
      const rarityClass = p.rarity || 'common';
      html += `
        <div class="pac-wild-pokemon-card ${rarityClass}">
          <span class="pac-wild-pokemon-name">${p.name}</span>
          <span class="pac-wild-pokemon-count">${p.seen}×</span>
        </div>
      `;
    });
    html += '</div>';
    
    if (wildPokemon.length > 8) {
      html += `<div class="pac-wild-more">+${wildPokemon.length - 8} more</div>`;
    }
    
    container.innerHTML = html;
  }
  
  function renderNarrativeSummary(data) {
    const container = document.getElementById('pacNarrativeSummary');
    
    if (data.totalRolls < 5) {
      container.innerHTML = '<p>Not enough data yet. Keep rolling to see your luck story!</p>';
      return;
    }
    
    const score = data.luckScore;
    let narrative = '';
    
    // Opening statement
    if (score > 20) {
      narrative += `<p>🍀 <span class="pac-narrative-highlight lucky">Running hot!</span> Your targets are hitting ${score.toFixed(0)}% above expected rates.</p>`;
    } else if (score > 5) {
      narrative += `<p>📈 <span class="pac-narrative-highlight lucky">Slightly lucky</span> — your hit rates are ${score.toFixed(0)}% above average.</p>`;
    } else if (score < -20) {
      narrative += `<p>😤 <span class="pac-narrative-highlight unlucky">Rough session!</span> Your hit rates are ${Math.abs(score).toFixed(0)}% below expected.</p>`;
    } else if (score < -5) {
      narrative += `<p>📉 <span class="pac-narrative-highlight unlucky">Slightly unlucky</span> — your hit rates are ${Math.abs(score).toFixed(0)}% below average.</p>`;
    } else {
      narrative += `<p>⚖️ <span class="pac-narrative-highlight neutral">Running about average</span> — the RNG is treating you fairly.</p>`;
    }
    
    // Roll distribution
    const levels = Object.entries(data.rollsByLevel).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
    if (levels.length > 0) {
      const topLevel = levels[0];
      narrative += `<p>You've rolled <span class="pac-narrative-highlight neutral">${data.totalRolls} times</span> total, mostly at <span class="pac-narrative-highlight neutral">Level ${topLevel[0]}</span> (${topLevel[1]} rolls).</p>`;
    }
    
    // Rarity highlights
    const rarityHighlights = [];
    Object.entries(data.rarityStats).forEach(([rarity, stats]) => {
      if (stats.expected > 5) {
        const diff = ((stats.seen - stats.expected) / stats.expected) * 100;
        if (Math.abs(diff) > 15) {
          const adjective = diff > 0 ? 'lucky' : 'unlucky';
          rarityHighlights.push({ rarity, diff, adjective });
        }
      }
    });
    
    if (rarityHighlights.length > 0) {
      const highlight = rarityHighlights.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))[0];
      const rarityName = highlight.rarity.charAt(0).toUpperCase() + highlight.rarity.slice(1);
      narrative += `<p>Your ${rarityName} drops are <span class="pac-narrative-highlight ${highlight.adjective}">${Math.abs(highlight.diff).toFixed(0)}% ${highlight.diff > 0 ? 'above' : 'below'}</span> expected rates.</p>`;
    }
    
    // Pokemon highlights
    const pokemonList = Object.entries(data.pokemonStats)
      .filter(([name, stats]) => stats.expected > 1)
      .map(([name, stats]) => ({
        name,
        seen: stats.seen,
        expected: stats.expected,
        diff: ((stats.seen - stats.expected) / stats.expected) * 100
      }))
      .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
    
    if (pokemonList.length > 0) {
      const top = pokemonList[0];
      if (Math.abs(top.diff) > 30) {
        const adjective = top.diff > 0 ? 'lucky' : 'unlucky';
        const verb = top.diff > 0 ? 'appeared' : 'is avoiding you';
        narrative += `<p><span class="pac-narrative-highlight ${adjective}">${top.name}</span> ${verb} — ${top.seen}× seen vs ${top.expected.toFixed(1)} expected (${top.diff > 0 ? '+' : ''}${top.diff.toFixed(0)}%).</p>`;
      }
    }
    
    // Ditto mention
    if (data.dittoStats && data.dittoStats.seen > 0) {
      const dittoRate = (data.dittoStats.seen / data.totalRolls * 100).toFixed(1);
      narrative += `<p>🟣 <span class="pac-narrative-highlight lucky">Ditto appeared ${data.dittoStats.seen}×</span> (${dittoRate}% of rolls)!</p>`;
    }
    
    // Wild Pokemon mention
    if (data.wildStats && data.wildStats.seen > 0) {
      const wildCount = Object.keys(data.wildStats.pokemon).length;
      narrative += `<p>🌿 You've hit <span class="pac-narrative-highlight neutral">${data.wildStats.seen} wild Pokemon</span> (${wildCount} unique species).</p>`;
    }
    
    container.innerHTML = narrative;
  }

  function loadCustomSettings() {
    try {
      const saved = localStorage.getItem('pac_customSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        state.customSettings = { ...state.customSettings, ...parsed };
        
        // Update input values
        document.getElementById('pacSettingsBgColor').value = state.customSettings.backgroundColor;
        document.getElementById('pacSettingsTextColor').value = state.customSettings.textColor;
        document.getElementById('pacSettingsAccentColor').value = state.customSettings.accentColor || '#4caf50';
        document.getElementById('pacSettingsTargetFlash').value = state.customSettings.targetFlashColor;
        document.getElementById('pacSettingsTeamFlash').value = state.customSettings.teamFlashColor;
        document.getElementById('pacSettingsFlashSpeed').value = state.customSettings.flashSpeed;
        document.getElementById('pacSettingsFlashSpeedValue').textContent = state.customSettings.flashSpeed + 'ms';
        document.getElementById('pacSettingsFontSize').value = state.customSettings.fontSize;
        document.getElementById('pacSettingsFontSizeValue').textContent = state.customSettings.fontSize + 'px';
        document.getElementById('pacSettingsDisableFlash').checked = state.customSettings.disableFlash;
        
        // Update preview flash buttons if disabled
        if (state.customSettings.disableFlash) {
          const targetPreview = document.getElementById('pacPreviewTargetFlash');
          const teamPreview = document.getElementById('pacPreviewTeamFlash');
          if (targetPreview) targetPreview.classList.add('disabled');
          if (teamPreview) teamPreview.classList.add('disabled');
        }
        
        if (DEBUG_MODE) console.log('✅ Loaded custom settings from localStorage');
      }
      applyCustomSettings();
    } catch (err) {
      if (DEBUG_MODE) console.warn('Failed to load custom settings:', err);
    }
  }
  
  function saveCustomSettings() {
    try {
      localStorage.setItem('pac_customSettings', JSON.stringify(state.customSettings));
      if (DEBUG_MODE) console.log('✅ Saved custom settings to localStorage');
    } catch (err) {
      if (DEBUG_MODE) console.warn('Failed to save custom settings:', err);
    }
  }
  
  function applyCustomSettings() {
    const overlay = document.getElementById('pac-calc-overlay');
    if (!overlay) return;
    
    const settings = state.customSettings;
    
    // Apply CSS variables
    overlay.style.setProperty('--pac-bg-color', settings.backgroundColor);
    overlay.style.setProperty('--pac-text-color', settings.textColor);
    overlay.style.setProperty('--pac-target-flash', settings.targetFlashColor);
    overlay.style.setProperty('--pac-team-flash', settings.teamFlashColor);
    overlay.style.setProperty('--pac-flash-speed', settings.flashSpeed + 'ms');
    overlay.style.setProperty('--pac-font-size', settings.fontSize + 'px');
    
    // Apply to preview
    const preview = document.getElementById('pacSettingsPreview');
    if (preview) {
      preview.style.setProperty('--pac-bg-color', settings.backgroundColor);
      preview.style.setProperty('--pac-text-color', settings.textColor);
      preview.style.setProperty('--pac-target-flash', settings.targetFlashColor);
      preview.style.setProperty('--pac-team-flash', settings.teamFlashColor);
      preview.style.setProperty('--pac-font-size', settings.fontSize + 'px');
    }
    
    // Update dynamic style for animations
    updateDynamicFlashStyles();
  }
  
  function updateDynamicFlashStyles() {
    const settings = state.customSettings;
    let dynamicStyle = document.getElementById('pac-dynamic-styles');
    
    if (!dynamicStyle) {
      dynamicStyle = document.createElement('style');
      dynamicStyle.id = 'pac-dynamic-styles';
      document.head.appendChild(dynamicStyle);
    }
    
    // If flashing is disabled (epilepsy mode), use static styles instead
    if (settings.disableFlash) {
      dynamicStyle.textContent = `
        /* Epilepsy mode - disable all flashing animations */
        #pac-calc-overlay.target-in-shop,
        #pac-calc-overlay.target-in-shop::before,
        .pac-team-panel.team-target-in-shop,
        #pac-calc-overlay.minimized.target-in-shop,
        #pac-calc-overlay.minimized.target-in-shop #pac-calc-header,
        #pac-calc-overlay.minimized.team-target-in-shop,
        #pac-calc-overlay.minimized.team-target-in-shop #pac-calc-header,
        #pac-calc-overlay.minimized.target-in-shop.team-target-in-shop,
        #pac-calc-overlay.minimized.target-in-shop.team-target-in-shop #pac-calc-header {
          animation: none !important;
        }
        
        /* Static highlight for target in shop */
        #pac-calc-overlay.target-in-shop {
          border-color: ${settings.targetFlashColor} !important;
          box-shadow: 0 0 20px ${settings.targetFlashColor}66 !important;
        }
        
        /* Static highlight for team target in shop */
        .pac-team-panel.team-target-in-shop {
          border-color: ${settings.teamFlashColor} !important;
          box-shadow: 0 0 20px ${settings.teamFlashColor}66 !important;
        }
        
        /* Apply custom background and text color to main overlay */
        #pac-calc-overlay {
          background: linear-gradient(135deg, ${settings.backgroundColor} 0%, ${adjustColor(settings.backgroundColor, -20)} 100%) !important;
          font-size: ${settings.fontSize}px !important;
        }
        
        #pac-calc-overlay .pac-body {
          font-size: ${settings.fontSize}px !important;
          color: ${settings.textColor} !important;
        }
        
        /* COMPREHENSIVE FONT SIZE - Apply to everything */
        #pac-calc-overlay,
        #pac-calc-overlay *,
        #pac-calc-overlay .pac-section,
        #pac-calc-overlay .pac-section-title,
        #pac-calc-overlay .pac-label,
        #pac-calc-overlay .pac-input,
        #pac-calc-overlay .pac-result-value,
        #pac-calc-overlay .pac-result-label,
        #pac-calc-overlay .pac-header-title,
        #pac-calc-overlay .pac-toggle,
        #pac-calc-overlay .pac-collapse-btn,
        #pac-calc-overlay .pac-team-header h3,
        #pac-calc-overlay .pac-team-stat-label,
        #pac-calc-overlay .pac-team-stat-value,
        #pac-calc-overlay .pac-team-combined-title,
        #pac-calc-overlay .pac-mono-status,
        #pac-calc-overlay .pac-mono-wheel-label,
        #pac-calc-overlay label,
        #pac-calc-overlay span,
        #pac-calc-overlay div,
        #pac-calc-overlay input,
        #pac-calc-overlay select,
        #pac-calc-overlay button,
        #pac-calc-overlay p {
          font-size: ${settings.fontSize}px !important;
        }
        
        /* Override ALL text colors throughout the extension */
        #pac-calc-overlay,
        #pac-calc-overlay .pac-section,
        #pac-calc-overlay .pac-section-title,
        #pac-calc-overlay .pac-label,
        #pac-calc-overlay .pac-input,
        #pac-calc-overlay .pac-result-value,
        #pac-calc-overlay .pac-result-label,
        #pac-calc-overlay .pac-header-title,
        #pac-calc-overlay .pac-toggle,
        #pac-calc-overlay .pac-collapse-btn,
        #pac-calc-overlay .pac-team-header h3,
        #pac-calc-overlay .pac-team-stat-label,
        #pac-calc-overlay .pac-team-stat-value,
        #pac-calc-overlay .pac-team-combined-title,
        #pac-calc-overlay .pac-mono-status,
        #pac-calc-overlay .pac-mono-wheel-label,
        #pac-calc-overlay label,
        #pac-calc-overlay span,
        #pac-calc-overlay div {
          color: ${settings.textColor} !important;
        }
        
        /* Keep some semantic colors but adjust others */
        #pac-calc-overlay .pac-section-title {
          color: ${adjustColor(settings.textColor, 30)} !important;
        }
        
        /* Input fields - use accent color for borders */
        #pac-calc-overlay input[type="text"],
        #pac-calc-overlay input[type="number"],
        #pac-calc-overlay select {
          background: ${adjustColor(settings.backgroundColor, -15)} !important;
          color: ${settings.textColor} !important;
          border: 2px solid ${settings.accentColor} !important;
          font-size: ${settings.fontSize}px !important;
        }
        
        /* BUTTONS - use accent color (excluding status indicators) */
        #pac-calc-overlay button:not(#pacExpBtn):not(#pacClrBtn):not(.pac-live-toggle):not(.pac-ctrl-btn),
        #pac-calc-overlay .pac-collapse-btn,
        #pac-calc-overlay .pac-reinject-btn,
        #pac-calc-overlay .pac-team-add-btn,
        #pac-calc-overlay .pac-mono-spin-btn,
        #pac-calc-overlay .pac-mono-clear {
          background: linear-gradient(135deg, ${settings.accentColor} 0%, ${adjustColor(settings.accentColor, -20)} 100%) !important;
          color: ${getContrastColor(settings.accentColor)} !important;
          border: 1px solid ${adjustColor(settings.accentColor, 20)} !important;
          font-size: ${settings.fontSize}px !important;
        }
        
        /* STATUS INDICATOR BUTTONS - preserve functional colors */
        /* Live Toggle - red when off, green when on */
        #pac-calc-overlay .pac-live-toggle {
          background: rgba(244, 67, 54, 0.15) !important;
          border: 2px solid rgba(244, 67, 54, 0.4) !important;
          color: ${settings.textColor} !important;
        }
        #pac-calc-overlay .pac-live-toggle.active {
          background: rgba(76, 175, 80, 0.25) !important;
          border: 2px solid rgba(76, 175, 80, 0.5) !important;
          box-shadow: 0 0 10px rgba(76, 175, 80, 0.3) !important;
        }
        #pac-calc-overlay .pac-live-toggle .pac-live-status {
          background: rgba(244, 67, 54, 0.3) !important;
          color: #ff5252 !important;
        }
        #pac-calc-overlay .pac-live-toggle.active .pac-live-status {
          background: rgba(76, 175, 80, 0.3) !important;
          color: #4caf50 !important;
        }
        
        /* EXP Button - neutral, gold pending, gold active */
        #pac-calc-overlay #pacExpBtn {
          background: ${adjustColor(settings.backgroundColor, 15)} !important;
          color: ${settings.textColor} !important;
          border: 1px solid ${adjustColor(settings.backgroundColor, 40)} !important;
        }
        #pac-calc-overlay #pacExpBtn.pending {
          background: rgba(251, 191, 36, 0.3) !important;
          color: #fbbf24 !important;
          border-color: rgba(251, 191, 36, 0.5) !important;
        }
        #pac-calc-overlay #pacExpBtn.active {
          background: rgba(251, 191, 36, 0.8) !important;
          color: #1e293b !important;
          border-color: #fbbf24 !important;
          font-weight: 700 !important;
        }
        
        /* CLR Button - neutral, red-ish to indicate destructive */
        #pac-calc-overlay #pacClrBtn {
          background: ${adjustColor(settings.backgroundColor, 15)} !important;
          color: ${settings.textColor} !important;
          border: 1px solid ${adjustColor(settings.backgroundColor, 40)} !important;
        }
        #pac-calc-overlay #pacClrBtn:hover {
          background: rgba(239, 68, 68, 0.3) !important;
          color: #ff6b6b !important;
          border-color: rgba(239, 68, 68, 0.5) !important;
        }
        
        /* Help Button - blue accent */
        #pac-calc-overlay #pacHelpBtn {
          background: ${adjustColor(settings.backgroundColor, 15)} !important;
          color: ${settings.textColor} !important;
          border: 1px solid ${adjustColor(settings.backgroundColor, 40)} !important;
        }
        #pac-calc-overlay #pacHelpBtn:hover {
          background: rgba(100, 181, 246, 0.3) !important;
          color: #64b5f6 !important;
          border-color: rgba(100, 181, 246, 0.5) !important;
        }
        
        /* Close button */
        #pac-calc-overlay .pac-team-close {
          background: transparent !important;
          color: ${settings.textColor} !important;
        }
        
        /* HIGH VISIBILITY CHECKBOXES - Custom styled with SVG checkmark */
        #pac-calc-overlay input[type="checkbox"] {
          appearance: none !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          width: 24px !important;
          height: 24px !important;
          min-width: 24px !important;
          min-height: 24px !important;
          max-width: 24px !important;
          max-height: 24px !important;
          background-color: ${adjustColor(settings.backgroundColor, -30)} !important;
          border: 3px solid ${settings.accentColor} !important;
          border-radius: 4px !important;
          cursor: pointer !important;
          position: relative !important;
          margin: 0 8px 0 0 !important;
          padding: 0 !important;
          transition: all 0.2s !important;
          flex-shrink: 0 !important;
          display: inline-block !important;
          vertical-align: middle !important;
          background-image: none !important;
          background-position: center !important;
          background-repeat: no-repeat !important;
          background-size: 16px 16px !important;
        }
        
        #pac-calc-overlay input[type="checkbox"]:hover:not(:disabled) {
          border-color: ${adjustColor(settings.accentColor, 30)} !important;
          box-shadow: 0 0 12px ${settings.accentColor}66 !important;
          background-color: ${settings.accentColor}33 !important;
        }
        
        #pac-calc-overlay input[type="checkbox"]:checked {
          background-color: ${settings.accentColor} !important;
          border-color: ${adjustColor(settings.accentColor, 30)} !important;
          box-shadow: 0 0 10px ${settings.accentColor}66 !important;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 12l5 5L20 6'/%3E%3C/svg%3E") !important;
          background-size: 18px 18px !important;
        }
        
        #pac-calc-overlay input[type="checkbox"]:disabled {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
          border-color: ${adjustColor(settings.backgroundColor, 50)} !important;
        }
        
        #pac-calc-overlay input[type="checkbox"]:disabled:checked {
          background-color: ${adjustColor(settings.backgroundColor, 50)} !important;
          border-color: ${adjustColor(settings.backgroundColor, 70)} !important;
        }
        
        /* Also handle .pac-toggle checkboxes */
        #pac-calc-overlay .pac-toggle input[type="checkbox"] {
          width: 26px !important;
          height: 26px !important;
          min-width: 26px !important;
          min-height: 26px !important;
          max-width: 26px !important;
          max-height: 26px !important;
        }
        
        #pac-calc-overlay .pac-toggle input[type="checkbox"]:checked {
          background-size: 20px 20px !important;
        }
        
        /* Regional Pokemon & Add Picks sections */
        #pac-calc-overlay .pac-collapsible,
        #pac-calc-overlay .pac-regional-section,
        #pac-calc-overlay .pac-portal-section {
          background: ${adjustColor(settings.backgroundColor, -10)} !important;
          border-color: ${adjustColor(settings.backgroundColor, 20)} !important;
        }
        
        /* Side panels */
        .pac-team-panel,
        #pac-team-panel,
        #pac-current-panel,
        #pac-settings-panel,
        #pac-history-panel {
          background: linear-gradient(135deg, ${settings.backgroundColor} 0%, ${adjustColor(settings.backgroundColor, -20)} 100%) !important;
        }
        
        .pac-team-panel .pac-team-content,
        .pac-team-panel .pac-settings-content,
        .pac-team-panel .pac-history-content {
          color: ${settings.textColor} !important;
          font-size: ${settings.fontSize}px !important;
        }
        
        .pac-team-toggle {
          background: linear-gradient(135deg, ${settings.backgroundColor} 0%, ${adjustColor(settings.backgroundColor, -20)} 100%) !important;
          border-color: ${settings.accentColor} !important;
        }
        
        /* Team panel items */
        #pac-calc-overlay .pac-team-item,
        #pac-calc-overlay .pac-intel-player {
          background: ${adjustColor(settings.backgroundColor, -20)} !important;
          border-color: ${adjustColor(settings.backgroundColor, 20)} !important;
        }
        
        /* Header */
        #pac-calc-overlay #pac-calc-header {
          background: linear-gradient(90deg, ${adjustColor(settings.backgroundColor, -30)} 0%, ${settings.accentColor}44 100%) !important;
        }
        
        /* Settings panel specific */
        #pac-settings-panel .pac-settings-label,
        #pac-settings-panel .pac-settings-section-title,
        #pac-settings-panel .pac-settings-value {
          color: ${settings.textColor} !important;
          font-size: ${settings.fontSize}px !important;
        }
        
        #pac-settings-panel .pac-settings-preview {
          background: ${settings.backgroundColor} !important;
        }
        
        #pac-settings-panel .pac-settings-preview-text {
          color: ${settings.textColor} !important;
          font-size: ${settings.fontSize}px !important;
        }
        
        /* Slider accent color */
        #pac-settings-panel .pac-settings-slider::-webkit-slider-thumb {
          background: linear-gradient(135deg, ${settings.accentColor} 0%, ${adjustColor(settings.accentColor, -20)} 100%) !important;
        }
        
        /* Toggle switch accent */
        #pac-settings-panel .pac-settings-switch input:checked + .pac-settings-switch-slider {
          background: linear-gradient(135deg, ${settings.accentColor} 0%, ${adjustColor(settings.accentColor, -20)} 100%) !important;
          border-color: ${settings.accentColor} !important;
        }
        
        /* Dropdown selects */
        #pac-calc-overlay select option {
          background: ${settings.backgroundColor} !important;
          color: ${settings.textColor} !important;
        }
      `;
      return;
    }
    
    // Generate dynamic CSS with user colors
    dynamicStyle.textContent = `
      /* Dynamic flash animations with user colors */
      @keyframes targetInShopFlashCustom {
        0%, 100% { 
          background: linear-gradient(135deg, ${settings.backgroundColor} 0%, #16213e 100%);
          border-color: #0f3460;
        }
        50% { 
          background: linear-gradient(135deg, #1e3a8a 0%, ${settings.targetFlashColor} 100%);
          border-color: ${settings.targetFlashColor};
        }
      }
      
      @keyframes targetInShopFullFlashCustom {
        0%, 100% { 
          background: transparent;
        }
        50% { 
          background: linear-gradient(135deg, ${settings.targetFlashColor}4D 0%, ${settings.targetFlashColor}80 100%);
          box-shadow: inset 0 0 50px ${settings.targetFlashColor}99;
        }
      }
      
      @keyframes teamTargetInShopFlashCustom {
        0%, 100% { 
          border-color: rgba(255,255,255,0.1);
          background: linear-gradient(135deg, ${settings.backgroundColor} 0%, #16213e 100%);
        }
        50% { 
          border-color: ${settings.teamFlashColor};
          background: linear-gradient(135deg, ${settings.teamFlashColor} 0%, ${settings.teamFlashColor}CC 100%);
          box-shadow: 0 0 30px ${settings.teamFlashColor}CC;
        }
      }
      
      @keyframes minimizedTargetFlashCustom {
        0%, 100% { 
          background: linear-gradient(135deg, ${settings.backgroundColor} 0%, #16213e 100%);
        }
        50% { 
          background: linear-gradient(135deg, ${settings.targetFlashColor} 0%, ${settings.targetFlashColor}CC 100%);
          box-shadow: 0 0 30px ${settings.targetFlashColor}E6, 0 0 60px ${settings.targetFlashColor}80;
        }
      }
      
      @keyframes minimizedTeamTargetFlashCustom {
        0%, 100% { 
          background: linear-gradient(135deg, ${settings.backgroundColor} 0%, #16213e 100%);
        }
        50% { 
          background: linear-gradient(135deg, ${settings.teamFlashColor} 0%, ${settings.teamFlashColor}CC 100%);
          box-shadow: 0 0 30px ${settings.teamFlashColor}E6, 0 0 60px ${settings.teamFlashColor}80;
        }
      }
      
      @keyframes minimizedBothFlashCustom {
        0%, 100% { 
          background: linear-gradient(135deg, ${settings.backgroundColor} 0%, #16213e 100%);
        }
        25% { 
          background: linear-gradient(135deg, ${settings.targetFlashColor} 0%, ${settings.targetFlashColor}CC 100%);
          box-shadow: 0 0 30px ${settings.targetFlashColor}E6;
        }
        75% { 
          background: linear-gradient(135deg, ${settings.teamFlashColor} 0%, ${settings.teamFlashColor}CC 100%);
          box-shadow: 0 0 30px ${settings.teamFlashColor}E6;
        }
      }
      
      /* Override default animations with custom ones */
      #pac-calc-overlay.target-in-shop {
        animation: targetInShopFlashCustom ${settings.flashSpeed}ms ease-in-out infinite !important;
      }
      
      #pac-calc-overlay.target-in-shop::before {
        animation: targetInShopFullFlashCustom ${settings.flashSpeed}ms ease-in-out infinite !important;
      }
      
      .pac-team-panel.team-target-in-shop {
        animation: teamTargetInShopFlashCustom ${settings.flashSpeed}ms ease-in-out infinite !important;
      }
      
      #pac-calc-overlay.minimized.target-in-shop {
        animation: minimizedTargetFlashCustom ${settings.flashSpeed + 50}ms ease-in-out infinite !important;
      }
      
      #pac-calc-overlay.minimized.target-in-shop #pac-calc-header {
        animation: minimizedTargetFlashCustom ${settings.flashSpeed + 50}ms ease-in-out infinite !important;
      }
      
      #pac-calc-overlay.minimized.team-target-in-shop {
        animation: minimizedTeamTargetFlashCustom ${settings.flashSpeed + 50}ms ease-in-out infinite !important;
      }
      
      #pac-calc-overlay.minimized.team-target-in-shop #pac-calc-header {
        animation: minimizedTeamTargetFlashCustom ${settings.flashSpeed + 50}ms ease-in-out infinite !important;
      }
      
      #pac-calc-overlay.minimized.target-in-shop.team-target-in-shop {
        animation: minimizedBothFlashCustom ${settings.flashSpeed * 2}ms ease-in-out infinite !important;
      }
      
      #pac-calc-overlay.minimized.target-in-shop.team-target-in-shop #pac-calc-header {
        animation: minimizedBothFlashCustom ${settings.flashSpeed * 2}ms ease-in-out infinite !important;
      }
      
      /* Apply custom background and text color to main overlay */
      #pac-calc-overlay {
        background: linear-gradient(135deg, ${settings.backgroundColor} 0%, ${adjustColor(settings.backgroundColor, -20)} 100%) !important;
        font-size: ${settings.fontSize}px !important;
      }
      
      #pac-calc-overlay .pac-body {
        font-size: ${settings.fontSize}px !important;
        color: ${settings.textColor} !important;
      }
      
      /* COMPREHENSIVE FONT SIZE - Apply to everything */
      #pac-calc-overlay,
      #pac-calc-overlay *,
      #pac-calc-overlay .pac-section,
      #pac-calc-overlay .pac-section-title,
      #pac-calc-overlay .pac-label,
      #pac-calc-overlay .pac-input,
      #pac-calc-overlay .pac-result-value,
      #pac-calc-overlay .pac-result-label,
      #pac-calc-overlay .pac-header-title,
      #pac-calc-overlay .pac-toggle,
      #pac-calc-overlay .pac-collapse-btn,
      #pac-calc-overlay .pac-team-header h3,
      #pac-calc-overlay .pac-team-stat-label,
      #pac-calc-overlay .pac-team-stat-value,
      #pac-calc-overlay .pac-team-combined-title,
      #pac-calc-overlay .pac-mono-status,
      #pac-calc-overlay .pac-mono-wheel-label,
      #pac-calc-overlay label,
      #pac-calc-overlay span,
      #pac-calc-overlay div,
      #pac-calc-overlay input,
      #pac-calc-overlay select,
      #pac-calc-overlay button,
      #pac-calc-overlay p {
        font-size: ${settings.fontSize}px !important;
      }
      
      /* Override ALL text colors throughout the extension */
      #pac-calc-overlay,
      #pac-calc-overlay .pac-section,
      #pac-calc-overlay .pac-section-title,
      #pac-calc-overlay .pac-label,
      #pac-calc-overlay .pac-input,
      #pac-calc-overlay .pac-result-value,
      #pac-calc-overlay .pac-result-label,
      #pac-calc-overlay .pac-header-title,
      #pac-calc-overlay .pac-toggle,
      #pac-calc-overlay .pac-collapse-btn,
      #pac-calc-overlay .pac-team-header h3,
      #pac-calc-overlay .pac-team-stat-label,
      #pac-calc-overlay .pac-team-stat-value,
      #pac-calc-overlay .pac-team-combined-title,
      #pac-calc-overlay .pac-mono-status,
      #pac-calc-overlay .pac-mono-wheel-label,
      #pac-calc-overlay label,
      #pac-calc-overlay span,
      #pac-calc-overlay div {
        color: ${settings.textColor} !important;
      }
      
      /* Keep some semantic colors but adjust others */
      #pac-calc-overlay .pac-section-title {
        color: ${adjustColor(settings.textColor, 30)} !important;
      }
      
      /* Input fields - use accent color for borders */
      #pac-calc-overlay input[type="text"],
      #pac-calc-overlay input[type="number"],
      #pac-calc-overlay select {
        background: ${adjustColor(settings.backgroundColor, -15)} !important;
        color: ${settings.textColor} !important;
        border: 2px solid ${settings.accentColor} !important;
        font-size: ${settings.fontSize}px !important;
      }
      
      #pac-calc-overlay input[type="text"]:focus,
      #pac-calc-overlay input[type="number"]:focus,
      #pac-calc-overlay select:focus {
        border-color: ${adjustColor(settings.accentColor, 30)} !important;
        box-shadow: 0 0 8px ${settings.accentColor}66 !important;
      }
      
      /* BUTTONS - use accent color (excluding status indicators) */
      #pac-calc-overlay button:not(#pacExpBtn):not(#pacClrBtn):not(.pac-live-toggle):not(.pac-ctrl-btn),
      #pac-calc-overlay .pac-collapse-btn,
      #pac-calc-overlay .pac-reinject-btn,
      #pac-calc-overlay .pac-team-add-btn,
      #pac-calc-overlay .pac-mono-spin-btn,
      #pac-calc-overlay .pac-mono-clear {
        background: linear-gradient(135deg, ${settings.accentColor} 0%, ${adjustColor(settings.accentColor, -20)} 100%) !important;
        color: ${getContrastColor(settings.accentColor)} !important;
        border: 1px solid ${adjustColor(settings.accentColor, 20)} !important;
        font-size: ${settings.fontSize}px !important;
      }
      
      #pac-calc-overlay button:not(#pacExpBtn):not(#pacClrBtn):not(.pac-live-toggle):not(.pac-ctrl-btn):hover,
      #pac-calc-overlay .pac-collapse-btn:hover,
      #pac-calc-overlay .pac-reinject-btn:hover {
        background: linear-gradient(135deg, ${adjustColor(settings.accentColor, 20)} 0%, ${settings.accentColor} 100%) !important;
        box-shadow: 0 2px 8px ${settings.accentColor}66 !important;
      }
      
      /* STATUS INDICATOR BUTTONS - preserve functional colors */
      /* Live Toggle - red when off, green when on */
      #pac-calc-overlay .pac-live-toggle {
        background: rgba(244, 67, 54, 0.15) !important;
        border: 2px solid rgba(244, 67, 54, 0.4) !important;
        color: ${settings.textColor} !important;
      }
      #pac-calc-overlay .pac-live-toggle:hover {
        background: rgba(244, 67, 54, 0.25) !important;
        border-color: rgba(244, 67, 54, 0.6) !important;
      }
      #pac-calc-overlay .pac-live-toggle.active {
        background: rgba(76, 175, 80, 0.25) !important;
        border: 2px solid rgba(76, 175, 80, 0.5) !important;
        box-shadow: 0 0 10px rgba(76, 175, 80, 0.3) !important;
      }
      #pac-calc-overlay .pac-live-toggle.active:hover {
        background: rgba(76, 175, 80, 0.35) !important;
        border-color: rgba(76, 175, 80, 0.7) !important;
      }
      #pac-calc-overlay .pac-live-toggle .pac-live-status {
        background: rgba(244, 67, 54, 0.3) !important;
        color: #ff5252 !important;
      }
      #pac-calc-overlay .pac-live-toggle.active .pac-live-status {
        background: rgba(76, 175, 80, 0.3) !important;
        color: #4caf50 !important;
      }
      
      /* EXP Button - neutral, gold pending, gold active */
      #pac-calc-overlay #pacExpBtn {
        background: ${adjustColor(settings.backgroundColor, 15)} !important;
        color: ${settings.textColor} !important;
        border: 1px solid ${adjustColor(settings.backgroundColor, 40)} !important;
      }
      #pac-calc-overlay #pacExpBtn:hover {
        background: ${adjustColor(settings.backgroundColor, 30)} !important;
      }
      #pac-calc-overlay #pacExpBtn.pending {
        background: rgba(251, 191, 36, 0.3) !important;
        color: #fbbf24 !important;
        border-color: rgba(251, 191, 36, 0.5) !important;
        animation: expPulse 1s ease-in-out infinite !important;
      }
      #pac-calc-overlay #pacExpBtn.active {
        background: rgba(251, 191, 36, 0.8) !important;
        color: #1e293b !important;
        border-color: #fbbf24 !important;
        font-weight: 700 !important;
      }
      
      /* CLR Button - neutral, red-ish to indicate destructive */
      #pac-calc-overlay #pacClrBtn {
        background: ${adjustColor(settings.backgroundColor, 15)} !important;
        color: ${settings.textColor} !important;
        border: 1px solid ${adjustColor(settings.backgroundColor, 40)} !important;
      }
      #pac-calc-overlay #pacClrBtn:hover {
        background: rgba(239, 68, 68, 0.3) !important;
        color: #ff6b6b !important;
        border-color: rgba(239, 68, 68, 0.5) !important;
      }
      
      /* Header buttons (minimize, close) - keep smaller */
      #pac-calc-overlay .pac-header-btn:not(#pacExpBtn):not(#pacClrBtn) {
        background: ${adjustColor(settings.backgroundColor, 20)} !important;
        color: ${settings.textColor} !important;
        border-color: ${adjustColor(settings.backgroundColor, 40)} !important;
      }
      
      #pac-calc-overlay .pac-header-btn:not(#pacExpBtn):not(#pacClrBtn):hover {
        background: ${settings.accentColor} !important;
        color: ${getContrastColor(settings.accentColor)} !important;
      }
      
      /* Close button */
      #pac-calc-overlay .pac-team-close {
        background: transparent !important;
        color: ${settings.textColor} !important;
      }
      
      /* HIGH VISIBILITY CHECKBOXES - Custom styled with SVG checkmark */
      #pac-calc-overlay input[type="checkbox"] {
        appearance: none !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        width: 24px !important;
        height: 24px !important;
        min-width: 24px !important;
        min-height: 24px !important;
        max-width: 24px !important;
        max-height: 24px !important;
        background-color: ${adjustColor(settings.backgroundColor, -30)} !important;
        border: 3px solid ${settings.accentColor} !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        position: relative !important;
        margin: 0 8px 0 0 !important;
        padding: 0 !important;
        transition: all 0.2s !important;
        flex-shrink: 0 !important;
        display: inline-block !important;
        vertical-align: middle !important;
        background-image: none !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
        background-size: 16px 16px !important;
      }
      
      #pac-calc-overlay input[type="checkbox"]:hover:not(:disabled) {
        border-color: ${adjustColor(settings.accentColor, 30)} !important;
        box-shadow: 0 0 12px ${settings.accentColor}66 !important;
        background-color: ${settings.accentColor}33 !important;
      }
      
      #pac-calc-overlay input[type="checkbox"]:checked {
        background-color: ${settings.accentColor} !important;
        border-color: ${adjustColor(settings.accentColor, 30)} !important;
        box-shadow: 0 0 10px ${settings.accentColor}66 !important;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 12l5 5L20 6'/%3E%3C/svg%3E") !important;
        background-size: 18px 18px !important;
      }
      
      #pac-calc-overlay input[type="checkbox"]:disabled {
        opacity: 0.5 !important;
        cursor: not-allowed !important;
        border-color: ${adjustColor(settings.backgroundColor, 50)} !important;
      }
      
      #pac-calc-overlay input[type="checkbox"]:disabled:checked {
        background-color: ${adjustColor(settings.backgroundColor, 50)} !important;
        border-color: ${adjustColor(settings.backgroundColor, 70)} !important;
      }
      
      /* Also handle .pac-toggle checkboxes */
      #pac-calc-overlay .pac-toggle input[type="checkbox"] {
        width: 26px !important;
        height: 26px !important;
        min-width: 26px !important;
        min-height: 26px !important;
        max-width: 26px !important;
        max-height: 26px !important;
      }
      
      #pac-calc-overlay .pac-toggle input[type="checkbox"]:checked {
        background-size: 20px 20px !important;
      }
      
      /* Regional Pokemon & Add Picks sections */
      #pac-calc-overlay .pac-collapsible,
      #pac-calc-overlay .pac-regional-section,
      #pac-calc-overlay .pac-portal-section {
        background: ${adjustColor(settings.backgroundColor, -10)} !important;
        border-color: ${adjustColor(settings.backgroundColor, 20)} !important;
      }
      
      /* Pokemon tags/badges */
      #pac-calc-overlay .pac-pokemon-tag,
      #pac-calc-overlay .pac-regional-pokemon,
      #pac-calc-overlay .pac-additional-pokemon {
        font-size: ${Math.max(10, settings.fontSize - 2)}px !important;
      }
      
      /* Side panels */
      .pac-team-panel,
      #pac-team-panel,
      #pac-current-panel,
      #pac-settings-panel,
      #pac-history-panel {
        background: linear-gradient(135deg, ${settings.backgroundColor} 0%, ${adjustColor(settings.backgroundColor, -20)} 100%) !important;
      }
      
      .pac-team-panel .pac-team-content,
      .pac-team-panel .pac-settings-content,
      .pac-team-panel .pac-history-content {
        color: ${settings.textColor} !important;
        font-size: ${settings.fontSize}px !important;
      }
      
      .pac-team-toggle {
        background: linear-gradient(135deg, ${settings.backgroundColor} 0%, ${adjustColor(settings.backgroundColor, -20)} 100%) !important;
        border-color: ${settings.accentColor} !important;
      }
      
      .pac-team-toggle:hover {
        background: linear-gradient(135deg, ${settings.accentColor}33 0%, ${settings.accentColor}22 100%) !important;
      }
      
      /* Team panel items */
      #pac-calc-overlay .pac-team-item,
      #pac-calc-overlay .pac-intel-player {
        background: ${adjustColor(settings.backgroundColor, -20)} !important;
        border-color: ${adjustColor(settings.backgroundColor, 20)} !important;
      }
      
      /* Header */
      #pac-calc-overlay #pac-calc-header {
        background: linear-gradient(90deg, ${adjustColor(settings.backgroundColor, -30)} 0%, ${settings.accentColor}44 100%) !important;
      }
      
      /* Settings panel specific */
      #pac-settings-panel .pac-settings-label,
      #pac-settings-panel .pac-settings-section-title,
      #pac-settings-panel .pac-settings-value {
        color: ${settings.textColor} !important;
        font-size: ${settings.fontSize}px !important;
      }
      
      #pac-settings-panel .pac-settings-preview {
        background: ${settings.backgroundColor} !important;
      }
      
      #pac-settings-panel .pac-settings-preview-text {
        color: ${settings.textColor} !important;
        font-size: ${settings.fontSize}px !important;
      }
      
      /* Slider accent color */
      #pac-settings-panel .pac-settings-slider::-webkit-slider-thumb {
        background: linear-gradient(135deg, ${settings.accentColor} 0%, ${adjustColor(settings.accentColor, -20)} 100%) !important;
      }
      
      /* Toggle switch accent */
      #pac-settings-panel .pac-settings-switch input:checked + .pac-settings-switch-slider {
        background: linear-gradient(135deg, ${settings.accentColor} 0%, ${adjustColor(settings.accentColor, -20)} 100%) !important;
        border-color: ${settings.accentColor} !important;
      }
      
      /* Dropdown selects */
      #pac-calc-overlay select option {
        background: ${settings.backgroundColor} !important;
        color: ${settings.textColor} !important;
      }
    `;
  }
  
  // Helper function to lighten/darken colors
  function adjustColor(hex, amount) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Adjust
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));
    
    // Convert back to hex
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  }
  
  // Helper function to get contrasting text color (black or white)
  function getContrastColor(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }
  
  // Track expanded players in Counter Intelligence panel
  const expandedIntelPlayers = new Set();
  
  function updateCounterIntelDisplay() {
    const container = document.getElementById('pacIntelPlayers');
    
    if (!container) {
      if (DEBUG_MODE) console.warn('⚠️ Intel panel container not found');
      return;
    }
    
    // Check if we have player data
    if (!lastPoolData || !lastPoolData.playerBoards) {
      container.innerHTML = '<div class="pac-intel-empty">Waiting for game data...</div>';
      return;
    }
    
    // Get all player names from boards, benches, and shops
    const allPlayerNames = new Set([
      ...Object.keys(lastPoolData.playerBoards || {}),
      ...Object.keys(lastPoolData.playerBenches || {}),
      ...Object.keys(lastPoolData.playerShops || {})
    ]);
    
    if (allPlayerNames.size === 0) {
      container.innerHTML = '<div class="pac-intel-empty">No players detected</div>';
      return;
    }
    
    // Sort alphabetically
    const sortedPlayers = Array.from(allPlayerNames).sort((a, b) => 
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
    
    // Get team target families for contested checking
    const targetFamilies = state.teamTargets
      .filter(t => t.enabled)
      .map(t => ({
        family: getEvolutionFamily(getBaseForm(t.pokemon)),
        pokemon: t.pokemon
      }));
    
    // Also include main calculator target if set
    if (state.targetPokemon) {
      const mainTargetFamily = getEvolutionFamily(getBaseForm(state.targetPokemon));
      // Only add if not already in team targets
      if (!targetFamilies.some(t => t.pokemon === state.targetPokemon)) {
        targetFamilies.push({
          family: mainTargetFamily,
          pokemon: state.targetPokemon
        });
      }
    }
    
    // Build fingerprint for dirty check
    const intelFingerprint = JSON.stringify({
      players: sortedPlayers,
      boards: lastPoolData.playerBoards,
      benches: lastPoolData.playerBenches,
      shops: lastPoolData.playerShops,
      targets: targetFamilies.map(t => t.pokemon),
      mainTarget: state.targetPokemon, // Include main target in fingerprint
      pokemonCounts: lastPoolData.pokemonCounts
    });
    
    if (intelFingerprint === lastCurrentHash) {
      if (DEBUG_MODE) console.log('⚡ SKIP: Intel panel unchanged');
      return;
    }
    lastCurrentHash = intelFingerprint;
    
    // Render each player
    container.innerHTML = sortedPlayers.map(playerName => {
      const board = lastPoolData.playerBoards?.[playerName] || [];
      const bench = lastPoolData.playerBenches?.[playerName] || [];
      const shop = lastPoolData.playerShops?.[playerName] || [];
      const allUnits = [...board, ...bench];
      const unitCount = allUnits.length;
      const isYou = playerName === state.playerName;
      const isExpanded = expandedIntelPlayers.has(playerName);
      
      // Check if this player is contesting any of your targets (skip yourself)
      let isContested = false;
      const contestedFamilies = new Set();
      
      if (!isYou && targetFamilies.length > 0) {
        allUnits.forEach(unit => {
          const unitName = unit.name?.toUpperCase();
          targetFamilies.forEach(target => {
            if (target.family.includes(unitName)) {
              isContested = true;
              target.family.forEach(f => contestedFamilies.add(f));
            }
          });
        });
      }
      
      // Build shop slots HTML (5 slots)
      const shopHtml = Array.from({length: 5}, (_, i) => {
        const pokemon = shop[i];
        if (pokemon) {
          const name = typeof pokemon === 'string' ? pokemon : pokemon.name;
          // Filter out DEFAULT placeholder
          if (name && name.toUpperCase() !== 'DEFAULT') {
            return `<span class="pac-intel-shop-slot">${name}</span>`;
          }
        }
        return `<span class="pac-intel-shop-slot empty">─</span>`;
      }).join('');
      
      // Build units HTML with pool remaining
      const unitsHtml = allUnits.map(unit => {
        const unitName = unit.name?.toUpperCase() || unit.name;
        const stars = '★'.repeat(unit.stars || 1);
        const baseForm = getBaseForm(unitName);
        const rarity = POKEMON_DATA[baseForm]?.rarity;
        const family = getEvolutionFamily(baseForm);
        
        // Check if this unit is contested
        const isUnitContested = contestedFamilies.has(unitName);
        
        // Calculate pool remaining for this family
        let poolRemaining = '?';
        let poolMax = '?';
        let poolClass = '';
        
        if (rarity && POOL_COPIES[rarity]) {
          const chain = EVOLUTION_CHAINS[baseForm];
          const maxStars = chain?.[0]?.maxStars || 3;
          poolMax = maxStars === 2 ? POOL_COPIES[rarity].twoStar : POOL_COPIES[rarity].threeStar;
          
          // Count all copies taken from this family
          let copiesTaken = 0;
          if (lastPoolData.pokemonCounts) {
            family.forEach(formName => {
              const formCount = lastPoolData.pokemonCounts[formName] || 0;
              if (formCount > 0) {
                copiesTaken += formCount * getEvolutionCost(formName);
              }
            });
          }
          
          poolRemaining = Math.max(0, poolMax - copiesTaken);
          
          // Color code based on remaining percentage
          const pct = poolRemaining / poolMax;
          if (pct < 0.3) poolClass = 'critical';
          else if (pct < 0.7) poolClass = 'low';
        }
        
        return `
          <div class="pac-intel-unit ${isUnitContested ? 'contested' : ''}">
            <span class="pac-intel-unit-name">${unitName}</span>
            <span class="pac-intel-unit-stars">${stars}</span>
            <span class="pac-intel-unit-pool ${poolClass}">(${poolRemaining}/${poolMax})</span>
          </div>
        `;
      }).join('');
      
      // Player classes
      const playerClasses = [
        'pac-intel-player',
        isYou ? 'is-you' : '',
        isContested ? 'contested' : '',
        isExpanded ? 'expanded' : ''
      ].filter(Boolean).join(' ');
      
      return `
        <div class="${playerClasses}" data-player="${playerName}">
          <div class="pac-intel-header" data-player="${playerName}">
            <span class="pac-intel-arrow">▶</span>
            <span class="pac-intel-name">${playerName}${isYou ? ' (You)' : ''}</span>
            <span class="pac-intel-count">(${unitCount} units)</span>
            ${isContested ? '<span class="pac-intel-contested-badge">⚔️</span>' : ''}
          </div>
          <div class="pac-intel-content">
            <div class="pac-intel-shop">
              <div class="pac-intel-shop-label">Shop</div>
              ${shopHtml}
            </div>
            <div class="pac-intel-units">
              ${unitsHtml || '<span style="color: #666; font-style: italic;">No units</span>'}
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    // Attach click handlers for accordion
    container.querySelectorAll('.pac-intel-header').forEach(header => {
      header.addEventListener('click', () => {
        const playerName = header.dataset.player;
        const playerEl = header.closest('.pac-intel-player');
        
        if (expandedIntelPlayers.has(playerName)) {
          expandedIntelPlayers.delete(playerName);
          playerEl.classList.remove('expanded');
        } else {
          expandedIntelPlayers.add(playerName);
          playerEl.classList.add('expanded');
        }
      });
    });
    
    if (DEBUG_MODE) console.log(`🕵️ Counter Intel: Rendered ${sortedPlayers.length} players`);
  }
  
  // Legacy wrapper for compatibility
  function updateCurrentDisplay(data) {
    updateCounterIntelDisplay();
  }
  
  function setupTeamAutocomplete(input) {
    // Create dropdown - append to body so it can float outside
    const dropdown = document.createElement('div');
    dropdown.className = 'pac-team-dropdown hidden';
    dropdown.id = 'pacTeamDropdown';
    document.body.appendChild(dropdown);
    
    let selectedIndex = -1;
    let filteredPokemon = [];
    
    // Update dropdown position based on panel position
    function updateDropdownPosition() {
      const panel = document.getElementById('pac-team-panel');
      const inputRect = input.getBoundingClientRect();
      
      if (panel && state.teamPanelExpanded && !dropdown.classList.contains('hidden')) {
        const panelRect = panel.getBoundingClientRect();
        // Position to the right of the panel
        const leftPos = panelRect.right + 20;
        const topPos = inputRect.top;
        
        dropdown.style.left = leftPos + 'px';
        dropdown.style.top = topPos + 'px';
      }
    }
    
    // Store globally so drag handler can access
    window.updateTeamDropdownPosition = updateDropdownPosition;
    
    input.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      selectedIndex = -1;
      
      // Only show dropdown if panel is expanded
      if (!state.teamPanelExpanded || query.length === 0) {
        dropdown.classList.add('hidden');
        return;
      }
      
      // Filter Pokemon
      filteredPokemon = Object.entries(POKEMON_DATA)
        .filter(([name, data]) => name.toLowerCase().includes(query))
        .slice(0, 8);
      
      if (filteredPokemon.length === 0) {
        dropdown.classList.add('hidden');
        return;
      }
      
      // Update position before showing
      updateDropdownPosition();
      
      // Render dropdown
      dropdown.innerHTML = filteredPokemon.map(([name, data], idx) => {
        const rarityColors = {
          common: '#9ca3af',
          uncommon: '#10b981',
          rare: '#00d9ff',
          epic: '#a855f7',
          ultra: '#ef4444',
          unique: '#ff6b6b',
          legendary: '#ffd700',
          special: '#e91e63',
          hatch: '#00bcd4'
        };
        
        // data is now an object with rarity, types, additional, regional, stars
        const rarity = data.rarity || 'common';
        const color = rarityColors[rarity] || rarityColors['common'];
        const displayRarity = rarity.charAt(0).toUpperCase() + rarity.slice(1);
        
        return `
          <div class="pac-team-dropdown-item" data-index="${idx}" data-pokemon="${name}">
            <div class="pac-team-dropdown-name" style="color: ${color}">${name}</div>
            <div class="pac-team-dropdown-meta">
              ${displayRarity}
            </div>
          </div>
        `;
      }).join('');
      
      dropdown.classList.remove('hidden');
    });
    
    // Use event delegation for clicks instead of adding handlers every input
    dropdown.addEventListener('click', (e) => {
      const item = e.target.closest('.pac-team-dropdown-item');
      if (!item) return;
      
      const pokemonName = item.dataset.pokemon;
      if (pokemonName) {
        // Hide dropdown immediately
        dropdown.classList.add('hidden');
        addTeamTarget(pokemonName);
        // Clear input after a tick to prevent input event from re-showing dropdown
        setTimeout(() => {
          input.value = '';
        }, 0);
      }
    });
    
    dropdown.addEventListener('mouseenter', (e) => {
      const item = e.target.closest('.pac-team-dropdown-item');
      if (!item) return;
      
      const idx = parseInt(item.dataset.index);
      if (idx >= 0 && idx < filteredPokemon.length) {
        selectedIndex = idx;
        updateDropdownSelection();
      }
    }, true);
    
    input.addEventListener('keydown', (e) => {
      if (dropdown.classList.contains('hidden') || filteredPokemon.length === 0) {
        return;
      }
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, filteredPokemon.length - 1);
        updateDropdownSelection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        updateDropdownSelection();
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        input.value = filteredPokemon[selectedIndex][0];
        dropdown.classList.add('hidden');
        addTeamTarget(filteredPokemon[selectedIndex][0]);
        input.value = '';
      } else if (e.key === 'Escape') {
        dropdown.classList.add('hidden');
      }
    });
    
    input.addEventListener('blur', () => {
      setTimeout(() => dropdown.classList.add('hidden'), 200);
    });
    
    function updateDropdownSelection() {
      dropdown.querySelectorAll('.pac-team-dropdown-item').forEach((item, idx) => {
        item.classList.toggle('selected', idx === selectedIndex);
      });
    }
  }
  
  
  function showNotification(message, type = 'info') {
    // Create notification element
    const notif = document.createElement('div');
    notif.className = `pac-notification pac-notification-${type}`;
    notif.textContent = message;
    
    // Add to body
    document.body.appendChild(notif);
    
    // Position in top-right
    notif.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === 'success' ? 'rgba(16, 185, 129, 0.95)' : type === 'warning' ? 'rgba(245, 158, 11, 0.95)' : 'rgba(239, 68, 68, 0.95)'};
      color: white;
      border-radius: 8px;
      font-family: 'Segoe UI', sans-serif;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 9999999;
      animation: slideIn 0.3s ease-out;
    `;
    
    // Add CSS animation if not already present
    if (!document.getElementById('pac-notif-styles')) {
      const style = document.createElement('style');
      style.id = 'pac-notif-styles';
      style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Auto-remove after 2 seconds
    setTimeout(() => {
      notif.style.transition = 'all 0.3s ease-out';
      notif.style.transform = 'translateX(400px)';
      notif.style.opacity = '0';
      setTimeout(() => notif.remove(), 300);
    }, 2000);
  }
  
  function addTeamTarget(pokemonName) {
    const normalizedName = pokemonName.toUpperCase();
    
    // Check if already in team
    if (state.teamTargets.some(t => t.pokemon === normalizedName)) {
      // Show non-blocking notification
      showNotification('This Pokemon is already in your team!', 'warning');
      return;
    }
    
    // Get rarity - POKEMON_DATA is now just strings
    const rarity = POKEMON_DATA[normalizedName]?.rarity;
    if (!rarity) {
      showNotification('Pokemon not found!', 'error');
      return;
    }
    
    // Get evolution cap from EVOLUTION_CHAINS
    const baseForm = getBaseForm(normalizedName);
    const evolutionChain = EVOLUTION_CHAINS[baseForm];
    
    let evo = 'twoStar'; // Default
    
    if (evolutionChain && evolutionChain[0] && evolutionChain[0].maxStars !== undefined) {
      // maxStars: 3 → threeStar, maxStars: 1 or 2 → twoStar
      evo = evolutionChain[0].maxStars === 3 ? 'threeStar' : 'twoStar';
    }
    
    // Add to team
    const target = {
      id: Date.now() + Math.random(),
      pokemon: normalizedName,
      displayName: pokemonName,
      rarity: rarity,
      evo: evo,
      isWild: isWildPokemon(normalizedName), // Auto-detect wild Pokemon
      enabled: true,
      copiesTaken: 0
    };
    
    state.teamTargets.push(target);
    saveTeamTargets();
    if (DEBUG_MODE) console.log('Added to team:', target, 'Total targets:', state.teamTargets.length);
    updateTeamDisplay();
    showNotification(`${pokemonName} added to team!`, 'success');
  }
  
  function removeTeamTarget(id) {
    state.teamTargets = state.teamTargets.filter(t => t.id !== id);
    saveTeamTargets();
    updateTeamDisplay();
  }
  
  function toggleTeamTarget(id) {
    const target = state.teamTargets.find(t => t.id === id);
    if (target) {
      target.enabled = !target.enabled;
      saveTeamTargets();
      updateTeamDisplay();
    }
  }
  
  function toggleTeamTargetWild(id) {
    const target = state.teamTargets.find(t => t.id === id);
    if (target) {
      target.isWild = !target.isWild;
      saveTeamTargets();
      // Force fingerprint update by clearing it
      lastTeamFingerprint = '';
      updateTeamDisplay();
    }
  }
  
  function saveTeamTargets() {
    try {
      localStorage.setItem('pac_teamTargets', JSON.stringify(state.teamTargets));
    } catch (err) {
      if (DEBUG_MODE) console.warn('Failed to save teamTargets to localStorage:', err);
    }
  }
  
  function setActiveTeamTarget(id) {
    const target = state.teamTargets.find(t => t.id === id);
    if (!target) return;
    
    // Set as main target
    state.targetPokemon = target.pokemon;
    state.targetPokemonDisplayName = target.displayName;
    state.targetRarity = target.rarity;
    state.targetEvo = target.evo;
    state.targetIsWild = target.isWild;
    state.copiesTaken = target.copiesTaken;
    
    // Update main panel
    document.getElementById('pacTarget').value = target.displayName;
    document.getElementById('pacRarity').value = target.rarity;
    document.getElementById('pacEvo').value = target.evo;
    document.getElementById('pacTargetWild').checked = target.isWild;
    document.getElementById('pacScouted').value = target.copiesTaken;
    
    // Recalculate
    updateDisplay();
    updateTeamDisplay();
  }
  
  function calculateTeamStats() {
    const results = [];
    let combinedMissProb = 1.0;
    
    // Get player's board and bench for copiesOwned calculation
    const playerBoard = lastPoolData?.playerBoards?.[state.playerName] || [];
    const playerBench = lastPoolData?.playerBenches?.[state.playerName] || [];
    const playerUnits = [...playerBoard, ...playerBench];
    
    state.teamTargets.forEach(target => {
      if (!target.enabled) {
        results.push({
          target: target,
          perRefresh: 0,
          expected: Infinity,
          notInPool: false,
          disabled: true
        });
        return;
      }
      
      // Skip non-pool rarities (legendary, unique, hatch, special)
      if (!POOL_RARITIES.includes(target.rarity)) {
        results.push({
          target: target,
          perRefresh: 0,
          expected: Infinity,
          notInPool: true
        });
        return;
      }
      
      // Check regional/additional availability
      const availability = checkPokemonAvailability(
        target.pokemon,
        state.activeRegionalPokemon,
        state.activeAdditionalPokemon
      );
      
      if (!availability.available) {
        results.push({
          target: target,
          perRefresh: 0,
          expected: Infinity,
          notInPool: true,
          availabilityReason: availability.reason
        });
        return;
      }
      
      // Get evolution family and max stars for this target
      const baseForm = getBaseForm(target.pokemon);
      const family = getEvolutionFamily(baseForm);
      const evolutionChain = EVOLUTION_CHAINS[baseForm];
      const maxStars = evolutionChain?.[0]?.maxStars || 3;
      const copiesNeeded = maxStars === 2 ? 3 : 9;  // 2★ max = 3, 3★ max = 9
      
      // Calculate copiesTaken from live data using family aggregation
      let copiesTaken = 0;
      if (lastPoolData && lastPoolData.pokemonCounts) {
        family.forEach(formName => {
          const formCount = lastPoolData.pokemonCounts[formName] || 0;
          if (formCount > 0) {
            const cost = getEvolutionCost(formName);
            copiesTaken += formCount * cost;
          }
        });
      }
      
      // Calculate copiesOwned from player's board+bench (star-weighted)
      let copiesOwned = 0;
      if (state.playerName && playerUnits.length > 0) {
        playerUnits.forEach(unit => {
          if (family.includes(unit.name?.toUpperCase())) {
            const starMultiplier = unit.stars === 3 ? 9 : unit.stars === 2 ? 3 : 1;
            copiesOwned += starMultiplier;
          }
        });
      }
      
      // Check if already maxed - can't find more in shop
      const isMaxed = copiesOwned >= copiesNeeded;
      
      // If maxed, skip probability calculations
      if (isMaxed) {
        results.push({
          target: target,
          perRefresh: 0,
          expected: Infinity,
          maxCopies: target.evo === 'twoStar' ? POOL_COPIES[target.rarity].twoStar : POOL_COPIES[target.rarity].threeStar,
          copiesTaken: 0,
          poolRemaining: 0,
          copiesOwned: copiesOwned,
          copiesNeeded: copiesNeeded,
          isMaxed: true,
          isImpossible: false,
          isDanger: false
        });
        return; // Don't include in combined probability
      }
      
      // Calculate for this target
      const totalPool = calculateTotalPool();
      const totalWildCounts = calculateWildCounts();
      const pool = totalPool[target.rarity];
      const rarityOdds = SHOP_ODDS[state.level];
      const rarityChance = rarityOdds[target.rarity] / 100;
      
      const wildCountsForRarity = totalWildCounts[target.rarity];
      const maxTargetCopies = target.evo === 'twoStar' ? POOL_COPIES[target.rarity].twoStar : POOL_COPIES[target.rarity].threeStar;
      
      // Pool remaining = max - taken globally
      const poolRemaining = Math.max(0, maxTargetCopies - copiesTaken);
      const targetCopies = poolRemaining;  // For probability calc, use remaining
      
      // Impossible/Danger checks
      const availableToPlayer = poolRemaining + copiesOwned;
      const isImpossible = availableToPlayer < copiesNeeded;
      const isDanger = !isImpossible && availableToPlayer < copiesNeeded + 2;
      
      // Get pool reductions from extraction data
      let visibleTwoStar = 0;
      let visibleThreeStar = 0;
      
      if (lastPoolData && lastPoolData.poolReductions && lastPoolData.poolReductions[target.rarity]) {
        visibleTwoStar = lastPoolData.poolReductions[target.rarity].twoStar || 0;
        visibleThreeStar = lastPoolData.poolReductions[target.rarity].threeStar || 0;
      }
      
      const relevantPoolBeforeVisible = target.evo === 'twoStar' ? pool.twoStarTotal : pool.threeStarTotal;
      const otherPoolPortion = target.evo === 'twoStar' ? pool.threeStarTotal : pool.twoStarTotal;
      
      // Reduce pools by visible units
      const relevantPoolAfterVisible = Math.max(0, relevantPoolBeforeVisible - (target.evo === 'twoStar' ? visibleTwoStar : visibleThreeStar));
      const otherPoolAfterVisible = Math.max(0, otherPoolPortion - (target.evo === 'twoStar' ? visibleThreeStar : visibleTwoStar));
      
      const totalPoolSize = relevantPoolAfterVisible + otherPoolAfterVisible;
      
      const totalWildCopiesBeforeReduction = target.evo === 'twoStar' ?
        wildCountsForRarity.twoStar * POOL_COPIES[target.rarity].twoStar :
        wildCountsForRarity.threeStar * POOL_COPIES[target.rarity].threeStar;
      const wildScoutedForRarity = state.wildUnitsTaken[target.rarity] || 0;
      const totalWildCopies = Math.max(0, totalWildCopiesBeforeReduction - wildScoutedForRarity);
      
      const wildBoost = state.pveRoundEnabled ? (0.05 + (state.wildUnitsOwned * 0.01)) : (state.wildUnitsOwned * 0.01);
      const safeWildBoost = isNaN(wildBoost) ? 0 : wildBoost;
      
      let perSlotProbTarget = 0;
      
      if (target.isWild) {
        const wildUnitsExist = target.evo === 'twoStar' ? wildCountsForRarity.twoStar > 0 : wildCountsForRarity.threeStar > 0;
        if (wildUnitsExist && totalWildCopies > 0 && safeWildBoost > 0) {
          perSlotProbTarget = safeWildBoost * rarityChance * (targetCopies / totalWildCopies);
        }
      } else {
        if (targetCopies > 0 && totalPoolSize > 0) {
          const baseProb = rarityChance * (targetCopies / totalPoolSize);
          perSlotProbTarget = (1 - safeWildBoost) * baseProb;
        }
      }
      
      const perRefresh = 1 - Math.pow(1 - perSlotProbTarget, 6);  // 6 shop slots
      const confidenceDecimal = (100 - state.confidencePercent) / 100;
      const expectedForConfidence = perRefresh > 0 ? Math.log(confidenceDecimal) / Math.log(1 - perRefresh) : Infinity;
      
      results.push({
        target: target,
        perRefresh: perRefresh,
        expected: expectedForConfidence,
        // New pool tracking fields
        maxCopies: maxTargetCopies,
        copiesTaken: copiesTaken,
        poolRemaining: poolRemaining,
        copiesOwned: copiesOwned,
        copiesNeeded: copiesNeeded,
        isMaxed: false,
        isImpossible: isImpossible,
        isDanger: isDanger
      });
      
      // For combined calculation
      if (perRefresh > 0) {
        combinedMissProb *= (1 - perRefresh);
      }
    });
    
    const combinedHitProb = 1 - combinedMissProb;
    const combinedExpected = combinedHitProb > 0 ? 1 / combinedHitProb : Infinity;
    
    return {
      individual: results,
      combined: {
        prob: combinedHitProb,
        expected: combinedExpected
      }
    };
  }
  
  // OPTIMIZATION: Create fingerprint of team state for dirty checking
  function createTeamFingerprint() {
    // Get player's board/bench for copiesOwned fingerprinting
    const playerBoard = lastPoolData?.playerBoards?.[state.playerName] || [];
    const playerBench = lastPoolData?.playerBenches?.[state.playerName] || [];
    
    // Capture exact pool state for each target
    const targetStates = state.teamTargets.map(target => {
      const baseForm = getBaseForm(target.pokemon);
      const rarity = POKEMON_DATA[baseForm]?.rarity;
      const family = getEvolutionFamily(baseForm);
      
      // Get exact pool reductions - no rounding
      const poolRed = lastPoolData?.poolReductions?.[rarity] || { twoStar: 0, threeStar: 0 };
      
      // Calculate copiesTaken from pokemonCounts
      let copiesTaken = 0;
      if (lastPoolData?.pokemonCounts) {
        family.forEach(formName => {
          const formCount = lastPoolData.pokemonCounts[formName] || 0;
          if (formCount > 0) {
            copiesTaken += formCount * getEvolutionCost(formName);
          }
        });
      }
      
      // Calculate copiesOwned from player's board/bench
      let copiesOwned = 0;
      [...playerBoard, ...playerBench].forEach(unit => {
        if (family.includes(unit.name?.toUpperCase())) {
          copiesOwned += unit.stars === 3 ? 9 : unit.stars === 2 ? 3 : 1;
        }
      });
      
      return [
        target.pokemon,
        copiesTaken,
        copiesOwned,
        target.isWild ? '1' : '0',
        target.enabled ? '1' : '0',
        state.level,
        poolRed.twoStar,
        poolRed.threeStar
      ].join(':');
    }).join('|');
    
    // Global state that affects all calculations
    const globalState = [
      state.round5Enabled ? '1' : '0',
      state.round8Enabled ? '1' : '0',
      state.round11Enabled ? '1' : '0',
      state.targetEvo,
      lastPoolData?.playerCount || 0,
      state.pveRoundEnabled ? '1' : '0',
      state.wildUnitsOwned || 0,
      JSON.stringify(state.wildUnitsTaken),
      state.playerName || '',
      state.activeRegionalPokemon.join(','),
      state.activeAdditionalPokemon.join(',')
    ].join(':');
    
    return `${targetStates}||${globalState}`;
  }

  function updateTeamDisplay() {
    const list = document.getElementById('pacTeamList');
    const combinedProbEl = document.getElementById('pacTeamCombinedProb');
    const combinedRollsEl = document.getElementById('pacTeamCombinedRolls');
    
    // OPTIMIZATION: Dirty check - only render if pool state changed
    const fingerprint = createTeamFingerprint();
    if (fingerprint === lastTeamFingerprint) {
      if (DEBUG_MODE) console.log('⚡ SKIP: Team panel unchanged');
      return;
    }
    lastTeamFingerprint = fingerprint;
    
    if (DEBUG_MODE) {
      if (DEBUG_MODE) console.log('updateTeamDisplay called', {
        listExists: !!list,
        targetsCount: state.teamTargets.length,
        targets: state.teamTargets
      });
    }
    
    if (!list) {
      if (DEBUG_MODE) console.error('Team list element not found!');
      return;
    }
    
    if (state.teamTargets.length === 0) {
      list.innerHTML = `
        <div class="pac-team-empty">
          <div class="pac-team-empty-icon">🎯</div>
          <div>No Pokemon in team tracker</div>
          <div style="font-size: 11px; margin-top: 8px;">Click + Add Pokemon to start</div>
        </div>
      `;
      combinedProbEl.textContent = '0%';
      combinedRollsEl.textContent = '0 rolls';
      return;
    }
    
    const stats = calculateTeamStats();
    
    // Render team list
    list.innerHTML = state.teamTargets.map(target => {
      const result = stats.individual.find(r => r.target.id === target.id);
      const isActive = state.targetPokemon === target.pokemon;
      const notInPool = result && result.notInPool;
      const availabilityReason = result && result.availabilityReason;
      const isDisabled = result && result.disabled;
      const isImpossible = result && result.isImpossible;
      const isDanger = result && result.isDanger;
      const isMaxed = result && result.isMaxed;
      
      let probText = '0%';
      let rollsText = '∞';
      let poolText = '';
      let ownedText = '';
      
      if (result && !notInPool && !isDisabled) {
        if (isMaxed) {
          probText = '—';
          rollsText = '—';
          poolText = 'MAXED';
          ownedText = `${result.copiesOwned}/${result.copiesNeeded} ✓`;
        } else {
          probText = (result.perRefresh * 100).toFixed(1) + '%';
          rollsText = isFinite(result.expected) ? Math.ceil(result.expected).toString() : '∞';
          poolText = `${result.poolRemaining}/${result.maxCopies}`;
          ownedText = result.copiesOwned > 0 ? `You: ${result.copiesOwned}/${result.copiesNeeded}` : `Need: ${result.copiesNeeded}`;
        }
      }
      
      const rarityColors = {
        common: '#9ca3af',
        uncommon: '#10b981',
        rare: '#00d9ff',
        epic: '#a855f7',
        ultra: '#ef4444',
        unique: '#ff6b6b',
        legendary: '#ffd700',
        special: '#e91e63',
        hatch: '#00bcd4'
      };
      
      // Build CSS classes
      const itemClasses = [
        'pac-team-item',
        isActive ? 'active' : '',
        notInPool ? 'not-in-pool' : '',
        isMaxed ? 'pac-maxed' : '',
        isImpossible ? 'pac-impossible' : '',
        isDanger ? 'pac-danger' : ''
      ].filter(Boolean).join(' ');
      
      return `
        <div class="${itemClasses}" data-id="${target.id}">
          <div class="pac-team-item-header">
            <input type="checkbox" class="pac-team-checkbox" ${target.enabled ? 'checked' : ''} data-id="${target.id}" title="Enable/Disable">
            <span class="pac-team-name" style="color: ${rarityColors[target.rarity]}" data-id="${target.id}">${target.displayName}</span>
            ${isMaxed ? '<span class="pac-warning-badge pac-maxed-badge" title="Fully evolved!">✓</span>' : ''}
            ${isImpossible ? '<span class="pac-warning-badge pac-impossible-badge" title="Cannot max - not enough copies in pool">✗</span>' : ''}
            ${isDanger ? '<span class="pac-warning-badge pac-danger-badge" title="Low copies remaining">⚠</span>' : ''}
            <button class="pac-team-remove" data-id="${target.id}">×</button>
          </div>
          <div class="pac-team-meta">
            <span style="color: ${rarityColors[target.rarity]}">${target.rarity.charAt(0).toUpperCase() + target.rarity.slice(1)}</span>
            <span style="margin: 0 8px;">•</span>
            <span>${target.evo === 'twoStar' ? '2★' : '3★'}</span>
            <span style="margin: 0 8px;">•</span>
            <label style="display: inline-flex; align-items: center; gap: 4px; cursor: pointer; color: ${target.isWild ? '#fbbf24' : '#888'};">
              <input type="checkbox" class="pac-team-wild-checkbox" ${target.isWild ? 'checked' : ''} data-id="${target.id}" style="cursor: pointer;">
              <span>Wild</span>
            </label>
            ${notInPool ? `<span style="margin: 0 8px;">•</span><span style="color: #fbbf24; font-size: 10px;">${availabilityReason || 'Not in pool'}</span>` : ''}
          </div>
          ${target.enabled ? `
            <div class="pac-team-stats">
              <div class="pac-team-stat-mini">
                <div class="pac-team-stat-mini-label">Pool</div>
                <div class="pac-team-stat-mini-value ${notInPool ? '' : isMaxed ? 'pac-maxed-text' : ''} ${!notInPool && isImpossible ? 'pac-impossible-text' : ''} ${!notInPool && isDanger ? 'pac-danger-text' : ''}">${notInPool ? 'N/A' : poolText}</div>
              </div>
              <div class="pac-team-stat-mini">
                <div class="pac-team-stat-mini-label">${!notInPool && result && result.copiesOwned > 0 ? 'Owned' : 'Goal'}</div>
                <div class="pac-team-stat-mini-value ${!notInPool && isMaxed ? 'pac-maxed-text' : ''}">${notInPool ? 'N/A' : ownedText}</div>
              </div>
              <div class="pac-team-stat-mini">
                <div class="pac-team-stat-mini-label">Per Roll</div>
                <div class="pac-team-stat-mini-value" style="${notInPool ? 'color: #ef4444;' : ''}">${notInPool ? '0%' : probText}</div>
              </div>
              <div class="pac-team-stat-mini">
                <div class="pac-team-stat-mini-label">Expected</div>
                <div class="pac-team-stat-mini-value">${notInPool ? '—' : rollsText}${!notInPool && !isMaxed ? ' rolls' : ''}</div>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
    
    // Combined stats
    const enabledCount = state.teamTargets.filter(t => t.enabled).length;
    if (enabledCount > 0) {
      combinedProbEl.textContent = (stats.combined.prob * 100).toFixed(1) + '%';
      combinedRollsEl.textContent = isFinite(stats.combined.expected) ? Math.ceil(stats.combined.expected) + ' rolls' : '∞';
    } else {
      combinedProbEl.textContent = '0%';
      combinedRollsEl.textContent = '0 rolls';
    }
    
    // Attach event listeners
    list.querySelectorAll('.pac-team-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        e.stopPropagation();
        toggleTeamTarget(parseFloat(e.target.dataset.id));
      });
    });
    
    list.querySelectorAll('.pac-team-wild-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        e.stopPropagation();
        toggleTeamTargetWild(parseFloat(e.target.dataset.id));
      });
    });
    
    list.querySelectorAll('.pac-team-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeTeamTarget(parseFloat(e.target.dataset.id));
      });
    });
    
    list.querySelectorAll('.pac-team-name').forEach(name => {
      name.addEventListener('click', (e) => {
        e.stopPropagation();
        setActiveTeamTarget(parseFloat(e.target.dataset.id));
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════════════════════
  // EULA / PRIVACY NOTICE
  // ═══════════════════════════════════════════════════════════════════════════
  
  function showEULA() {
    return new Promise((resolve) => {
      const eulaOverlay = document.createElement('div');
      eulaOverlay.id = 'pac-eula-overlay';
      eulaOverlay.innerHTML = `
        <div id="pac-eula-modal">
          <div class="pac-eula-title">🎮 Pokemon Auto Chess Live Data Calculator - Terms & Privacy Notice</div>
          
          <div class="pac-eula-content">
            <div class="pac-eula-section">
              <div class="pac-eula-section-title">Welcome!</div>
              <p>Thank you for using Pokemon Auto Chess Live Data Calculator. Before you begin, please review and accept the following terms:</p>
            </div>
            
            <div class="pac-eula-highlight">
              <strong>✅ 100% Safe & TOS Compliant</strong>
              <p style="margin: 8px 0 0 0;">This extension is a <strong>read-only calculator tool</strong>. It does NOT:</p>
              <ul style="margin: 8px 0 0 20px; padding: 0;">
                <li>Modify game files or memory</li>
                <li>Automate gameplay or provide unfair advantages</li>
                <li>Violate Pokemon Auto Chess Terms of Service</li>
                <li>Interact with game servers in any way</li>
              </ul>
              <p style="margin: 8px 0 0 0;"><strong>This is purely a probability calculator</strong> - similar to using a calculator app while playing poker.</p>
            </div>
            
            <div class="pac-eula-section">
              <div class="pac-eula-section-title">🔒 Your Privacy & Data</div>
              <p><strong>Zero data collection. Zero tracking. Zero transmission.</strong></p>
              <ul style="margin: 8px 0 0 20px; padding: 0;">
                <li><strong>All data stays on YOUR device</strong> - nothing is sent to any server</li>
                <li><strong>No personal information collected</strong> - no emails, no IPs, no tracking</li>
                <li><strong>No analytics, no telemetry, no third parties</strong></li>
                <li><strong>Local storage only</strong> - your settings (player name, team targets) are saved in your browser's localStorage for convenience</li>
              </ul>
            </div>
            
            <div class="pac-eula-section">
              <div class="pac-eula-section-title">📊 What This Tool Does</div>
              <ul style="margin: 8px 0 0 20px; padding: 0;">
                <li>Reads public game state (Pokemon counts in the current match)</li>
                <li>Calculates probability of finding specific Pokemon</li>
                <li>Tracks your board/bench when you provide your in-game name</li>
                <li>Saves your preferences locally for convenience</li>
              </ul>
            </div>
            
            <div class="pac-eula-warning">
              <strong>⚠️ Use Responsibly</strong>
              <p style="margin: 8px 0 0 0;">While this tool is safe and compliant, I recommend:</p>
              <ul style="margin: 8px 0 0 20px; padding: 0;">
                <li>Don't rely solely on calculations - use game knowledge too</li>
                <li>Be respectful to other players</li>
                <li><strong>Calculator bug/issue?</strong> Contact me: <strong>@Deuce222X</strong> in the official Discord (DMs/pings welcome!)</li>
                <li><strong>Game issue?</strong> Contact moderators in the official Pokemon Auto Chess Discord</li>
              </ul>
            </div>
            
            <div class="pac-eula-section">
              <div class="pac-eula-section-title">⚖️ Disclaimer</div>
              <p style="font-size: 12px; color: #999;">
                This is an independent, open-source tool created by a solo developer (@Deuce222X) for educational and strategic purposes. 
                Not affiliated with or endorsed by Pokemon Auto Chess developers. 
                Use at your own discretion. The developer of this tool is not responsible for any consequences of its use.
              </p>
            </div>
            
            <div class="pac-eula-section">
              <div class="pac-eula-section-title">📞 Contact</div>
              <p style="font-size: 12px; color: #64b5f6;">
                Find me in the official Pokemon Auto Chess Discord: <strong>@Deuce222X</strong><br>
                Open to DMs and pings for calculator-related questions, bugs, or suggestions!
              </p>
            </div>
          </div>
          
          <div class="pac-eula-checkboxes">
            <div class="pac-eula-checkbox-row" data-checkbox="1">
              <div class="pac-eula-custom-checkbox" id="pac-eula-understand"></div>
              <label>I understand this tool is safe, read-only, and does not violate Terms of Service</label>
            </div>
            <div class="pac-eula-checkbox-row" data-checkbox="2">
              <div class="pac-eula-custom-checkbox" id="pac-eula-privacy"></div>
              <label>I understand no personal data is collected or transmitted - all data stays on my device</label>
            </div>
            <div class="pac-eula-checkbox-row" data-checkbox="3">
              <div class="pac-eula-custom-checkbox" id="pac-eula-agree"></div>
              <label>I agree to use this tool responsibly and at my own discretion</label>
            </div>
          </div>
          
          <button id="pac-eula-accept" class="pac-eula-button" disabled>I Understand and Agree - Start Using PAC Live Data Calculator</button>
        </div>
      `;
      
      document.body.appendChild(eulaOverlay);
      if (DEBUG_MODE) console.log('✅ EULA overlay appended to body');
      if (DEBUG_MODE) console.log('📋 EULA overlay element:', eulaOverlay);
      if (DEBUG_MODE) console.log('📐 EULA overlay computed style:', window.getComputedStyle(eulaOverlay).display);
      
      const checkbox1 = document.getElementById('pac-eula-understand');
      const checkbox2 = document.getElementById('pac-eula-privacy');
      const checkbox3 = document.getElementById('pac-eula-agree');
      const acceptBtn = document.getElementById('pac-eula-accept');
      
      if (DEBUG_MODE) console.log('✅ Found checkboxes and button:', {
        checkbox1: !!checkbox1,
        checkbox2: !!checkbox2,
        checkbox3: !!checkbox3,
        acceptBtn: !!acceptBtn
      });
      
      function checkAll() {
        if (checkbox1.classList.contains('checked') && 
            checkbox2.classList.contains('checked') && 
            checkbox3.classList.contains('checked')) {
          acceptBtn.disabled = false;
        } else {
          acceptBtn.disabled = true;
        }
      }
      
      checkbox1.addEventListener('click', () => {
        checkbox1.classList.toggle('checked');
        checkAll();
      });
      checkbox2.addEventListener('click', () => {
        checkbox2.classList.toggle('checked');
        checkAll();
      });
      checkbox3.addEventListener('click', () => {
        checkbox3.classList.toggle('checked');
        checkAll();
      });
      
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem('pac_eulaAccepted', 'true');
        eulaOverlay.remove();
        resolve();
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HELP MODAL
  // ═══════════════════════════════════════════════════════════════════════════

  function openHelpModal() {
    // Remove existing modal if any
    const existing = document.getElementById('pac-help-overlay');
    if (existing) existing.remove();
    
    const helpOverlay = document.createElement('div');
    helpOverlay.id = 'pac-help-overlay';
    helpOverlay.innerHTML = `
      <div id="pac-help-modal">
        <div class="pac-help-header">
          <span class="pac-help-title">📖 PAC Live Data Calculator - Help</span>
          <button class="pac-help-close" id="pac-help-close">×</button>
        </div>
        
        <div class="pac-help-content">
          <div class="pac-help-section">
            <div class="pac-help-section-title"><span class="emoji">⌨️</span> Keyboard Shortcuts</div>
            <div class="pac-help-shortcut">
              <span class="pac-help-shortcut-desc">Toggle Calculator</span>
              <span class="pac-help-shortcut-key">ALT + Shift + P</span>
            </div>
            <div class="pac-help-shortcut">
              <span class="pac-help-shortcut-desc">Toggle Reroll Blocking</span>
              <span class="pac-help-shortcut-key">ALT + Shift + Y</span>
            </div>
            <div class="pac-help-shortcut">
              <span class="pac-help-shortcut-desc">Reset Position to Center</span>
              <span class="pac-help-shortcut-key">ALT + Shift + R</span>
            </div>
            <div class="pac-help-shortcut">
              <span class="pac-help-shortcut-desc">Dismiss Flash Alert</span>
              <span class="pac-help-shortcut-key">Click × or ESC</span>
            </div>
          </div>
          
          <div class="pac-help-section">
            <div class="pac-help-section-title"><span class="emoji">🎯</span> Main Calculator</div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Per-Refresh Probability</div>
              <div class="pac-help-feature-desc">Shows the chance of finding your target Pokemon in any given shop refresh, based on current pool state and your level.</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Expected Rolls & Gold Cost</div>
              <div class="pac-help-feature-desc">Estimates how many rolls (and gold) needed to reach your desired confidence level. Updates live as the pool changes.</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Pool Tracking</div>
              <div class="pac-help-feature-desc">Shows copies remaining vs total for your target. Accounts for copies on all boards, benches, and shops.</div>
            </div>
          </div>
          
          <div class="pac-help-section">
            <div class="pac-help-section-title"><span class="emoji">🌍</span> Smart Detection</div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Regional & Add Pick Detection</div>
              <div class="pac-help-feature-desc">Hover over the regional/add pick icons in-game to auto-detect which Pokemon are available this match. Click to confirm when multiple Pokemon share the same types.</div>
            </div>
            <div class="pac-help-tip">
              <div class="pac-help-tip-title">💡 Tip</div>
              <div class="pac-help-tip-text">Entering a new regional portal? Just re-hover the regional icons to update detection automatically.</div>
            </div>
          </div>
          
          <div class="pac-help-section">
            <div class="pac-help-section-title"><span class="emoji">📊</span> Counter Intelligence Panel</div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">8-Player Overview</div>
              <div class="pac-help-feature-desc">See all players' boards, benches, and shops at a glance. Know who's contesting your targets.</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Contested Detection</div>
              <div class="pac-help-feature-desc">Warns when opponents are building the same Pokemon you're targeting. Helps you pivot early.</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Flash Alerts</div>
              <div class="pac-help-feature-desc">Screen flashes when your target appears in YOUR shop. Never miss a key unit!</div>
            </div>
          </div>
          
          <div class="pac-help-section">
            <div class="pac-help-section-title"><span class="emoji">🎯</span> Team Tracker</div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Multi-Target Tracking</div>
              <div class="pac-help-feature-desc">Track multiple Pokemon simultaneously. Each shows its own probability, pool count, and warnings.</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Smart Warnings</div>
              <div class="pac-help-feature-desc">MAXED = all copies accounted for. IMPOSSIBLE = none left in pool. DANGER = very few remaining.</div>
            </div>
          </div>
          
          <div class="pac-help-section">
            <div class="pac-help-section-title"><span class="emoji">🎰</span> Roll Luck Tracker</div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Live Tab</div>
              <div class="pac-help-feature-desc">Per-player roll history showing exactly what Pokemon appeared in each shop.</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Analytics Tab</div>
              <div class="pac-help-feature-desc">Overall luck score, rarity hit rates, luckiest/unluckiest Pokemon, Ditto tracking, and a narrative summary of your session.</div>
            </div>
            <div class="pac-help-tip">
              <div class="pac-help-tip-title">💡 Tip</div>
              <div class="pac-help-tip-text">Data persists across sessions via localStorage. Wild Pokemon and Ditto are tracked separately and don't affect your luck score.</div>
            </div>
          </div>
          
          <div class="pac-help-section">
            <div class="pac-help-section-title"><span class="emoji">🌿</span> Wild Pokemon Support</div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Auto-Detection</div>
              <div class="pac-help-feature-desc">All 67 wild Pokemon families are automatically detected. Wild checkbox auto-enables when targeting a wild Pokemon.</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Wild Stars Counting</div>
              <div class="pac-help-feature-desc">Each wild star on your board adds +1% to wild odds. PVE rounds add +5% automatically.</div>
            </div>
          </div>
          
          <div class="pac-help-section">
            <div class="pac-help-section-title"><span class="emoji">🎣</span> Fishing Tab</div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Rod-Based Catch Rates</div>
              <div class="pac-help-feature-desc">Shows catch percentages by rarity for each rod tier. Old Rod from Water(3), Good Rod from Water(6), Super Rod from Water(9).</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Special Catches</div>
              <div class="pac-help-feature-desc">Old Rod: Magikarp (55%), Good Rod: Feebas (35%), Super Rod: Wishiwashi (35%). Toggle Mantyke for +33% Remoraid chance.</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Fishable Pool</div>
              <div class="pac-help-feature-desc">Shows all Water-type Pokemon you can catch, including your regionals and add-picks. Does NOT deplete the main shop pool.</div>
            </div>
            <div class="pac-help-tip">
              <div class="pac-help-tip-title">⚠️ Important</div>
              <div class="pac-help-tip-text">Fishing requires a free bench slot or the catch is lost!</div>
            </div>
          </div>
          
          <div class="pac-help-section">
            <div class="pac-help-section-title"><span class="emoji">🧪</span> Experimental Features</div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">How to Access</div>
              <div class="pac-help-feature-desc">Click the EXP button in the header, then press ALT + Shift + Y to unlock experimental features. Button turns gold when active.</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Mono-Type Challenge</div>
              <div class="pac-help-feature-desc">Restrict yourself to one Pokemon type! Spin the wheel for random selection. Shop blockers prevent purchasing non-matching types. 18 types available with color-coded UI.</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Reroll Blocking</div>
              <div class="pac-help-feature-desc">Places a blocker overlay over the refresh button to prevent accidental clicks. Works best with polling set to 30ms for instant coverage.</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Random Draft</div>
              <div class="pac-help-feature-desc">Spins a roulette across your shop slots and randomly picks one - all other slots get blocked! Forces you to buy the chosen slot. Re-spins after each purchase.</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Copycat</div>
              <div class="pac-help-feature-desc">Only allows buying Pokemon that other players already have on their boards. Forces you to play contested units and follow the lobby meta!</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">MLG Mode</div>
              <div class="pac-help-feature-desc">420 NO SCOPE! Triggers hitmarkers, lens flares, screen shake, and epic text popups when you find targets in shop. Pure visual chaos for the memes.</div>
            </div>
          </div>
          
          <div class="pac-help-section">
            <div class="pac-help-section-title"><span class="emoji">⚡</span> Live Data & Privacy</div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Real-Time Extraction</div>
              <div class="pac-help-feature-desc">Game state is read every 30ms at max speed. Stage tracking with PVE/PVP detection updates automatically.</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">100% Private</div>
              <div class="pac-help-feature-desc">Zero network requests. Zero data collection. Everything runs locally in your browser. Settings saved to localStorage only.</div>
            </div>
          </div>
        </div>
        
        <div class="pac-help-version">
          v3.2.1 • Made by <a href="https://github.com/DonaldGallianoIII" target="_blank">Galliano Games</a> • Discord: @Deuce222X
        </div>
      </div>
    `;
    
    document.body.appendChild(helpOverlay);
    
    // Close button handler
    document.getElementById('pac-help-close').addEventListener('click', () => {
      helpOverlay.remove();
    });
    
    // Click outside to close
    helpOverlay.addEventListener('click', (e) => {
      if (e.target === helpOverlay) {
        helpOverlay.remove();
      }
    });
    
    // ESC to close
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        helpOverlay.remove();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════

  function init() {
    const overlay = createOverlay();
    setupDrag(overlay);
    setupResize(overlay);
    loadPosition();
    setupCollapsibles();
    setupTeamPanel();
    setupCurrentPanel();
    setupSettingsPanel();
    setupHistoryPanel();
    loadRollHistory();  // Load roll history from localStorage
    bindUI();
    setupKeyboardShortcut();
    setupInputProtection();
    setupRefreshBlocker();
    setupExperimentalButton();
    populateSynergyBar();
    setupMonoTypePanel();
    setupRandomDraftPanel();
    setupCopycatPanel();
    setupMlgPanel();
    setupFishingTab();
    
    // Load saved data from localStorage
    try {
      const savedPlayerName = localStorage.getItem('pac_playerName');
      if (savedPlayerName) {
        state.playerName = savedPlayerName;
        const playerNameInput = document.getElementById('pacPlayerName');
        if (playerNameInput) {
          playerNameInput.value = savedPlayerName;
        }
        if (DEBUG_MODE) console.log('✅ Loaded playerName from localStorage:', savedPlayerName);
      }
      
      const savedTeamTargets = localStorage.getItem('pac_teamTargets');
      if (savedTeamTargets) {
        state.teamTargets = JSON.parse(savedTeamTargets);
        
        // Migration: Fix any targets with incorrect evo values or missing wild status
        let needsSave = false;
        state.teamTargets.forEach(target => {
          // Fix evo values
          const baseForm = getBaseForm(target.pokemon);
          const evolutionChain = EVOLUTION_CHAINS[baseForm];
          if (evolutionChain && evolutionChain[0] && evolutionChain[0].maxStars !== undefined) {
            const correctEvo = evolutionChain[0].maxStars === 3 ? 'threeStar' : 'twoStar';
            if (target.evo !== correctEvo) {
              if (DEBUG_MODE) console.log(`🔧 Migrating ${target.pokemon}: ${target.evo} → ${correctEvo}`);
              target.evo = correctEvo;
              needsSave = true;
            }
          }
          
          // Fix wild status
          const shouldBeWild = isWildPokemon(target.pokemon);
          if (target.isWild !== shouldBeWild) {
            if (DEBUG_MODE) console.log(`🔧 Migrating ${target.pokemon}: isWild ${target.isWild} → ${shouldBeWild}`);
            target.isWild = shouldBeWild;
            needsSave = true;
          }
        });
        
        // Save if any migrations were applied
        if (needsSave) {
          localStorage.setItem('pac_teamTargets', JSON.stringify(state.teamTargets));
          if (DEBUG_MODE) console.log('✅ Saved migrated team targets');
        }
        
        updateTeamDisplay();
        if (DEBUG_MODE) console.log('✅ Loaded', state.teamTargets.length, 'team targets from localStorage');
      }
    } catch (err) {
      if (DEBUG_MODE) console.warn('Failed to load from localStorage:', err);
    }
    
    updateDisplay();
    
    // Setup portal/regional detection observer (v3.0.2)
    setupPortalDetection();
    
    if (DEBUG_MODE) console.log('🎮 PAC Calculator v3.2.1: Overlay ready');
    if (DEBUG_MODE) console.log('   • 1060 pokemon database loaded');
    if (DEBUG_MODE) console.log('   • Autocomplete selector active');
    if (DEBUG_MODE) console.log('   • Drag header to move');
    if (DEBUG_MODE) console.log('   • Shift+Alt+P to toggle');
    if (DEBUG_MODE) console.log('   • Click "Live Tracking" to start polling');
  }

  // Wait for page to be ready
  async function start() {
    if (DEBUG_MODE) console.log('🚀 PAC Calculator starting...');
    
    // Inject CSS FIRST (before EULA so it's styled properly)
    if (!document.getElementById('pac-calc-styles')) {
      const style = document.createElement('style');
      style.id = 'pac-calc-styles';
      style.textContent = `
        /* Copy all CSS from createOverlay here - just the EULA part for now */
        #pac-eula-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          background: rgba(0, 0, 0, 0.95) !important;
          z-index: 2147483647 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          backdrop-filter: blur(10px);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        #pac-eula-modal {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 2px solid #0f3460;
          border-radius: 12px;
          max-width: 600px;
          max-height: 80vh;
          padding: 24px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6);
          color: #e9e9e9;
          overflow-y: auto;
          position: relative;
          z-index: 2147483647 !important;
        }
        
        .pac-eula-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #64b5f6;
          text-align: center;
        }
        
        .pac-eula-content {
          font-size: 13px;
          line-height: 1.6;
          margin-bottom: 20px;
          color: #ccc;
        }
        
        .pac-eula-section {
          margin-bottom: 16px;
        }
        
        .pac-eula-section-title {
          font-size: 14px;
          font-weight: 600;
          color: #64b5f6;
          margin-bottom: 8px;
        }
        
        .pac-eula-highlight {
          background: rgba(76, 175, 80, 0.2);
          padding: 12px;
          border-left: 3px solid #4caf50;
          border-radius: 4px;
          margin: 12px 0;
        }
        
        .pac-eula-warning {
          background: rgba(255, 152, 0, 0.2);
          padding: 12px;
          border-left: 3px solid #ff9800;
          border-radius: 4px;
          margin: 12px 0;
        }
        
        .pac-eula-checkboxes {
          margin: 20px 0;
        }
        
        .pac-eula-checkbox-row {
          display: flex !important;
          align-items: flex-start !important;
          gap: 12px !important;
          margin-bottom: 12px !important;
          padding: 12px !important;
          background: rgba(255,255,255,0.03) !important;
          border-radius: 6px !important;
          cursor: pointer !important;
        }
        
        .pac-eula-custom-checkbox {
          width: 32px !important;
          height: 32px !important;
          min-width: 32px !important;
          min-height: 32px !important;
          background: #000 !important;
          border: 2px solid #4caf50 !important;
          border-radius: 6px !important;
          cursor: pointer !important;
          position: relative !important;
          transition: all 0.2s !important;
          flex-shrink: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        
        .pac-eula-custom-checkbox:hover {
          border-color: #66bb6a !important;
          box-shadow: 0 0 8px rgba(76, 175, 80, 0.4) !important;
        }
        
        .pac-eula-custom-checkbox.checked {
          background: #4caf50 !important;
          border-color: #66bb6a !important;
        }
        
        .pac-eula-custom-checkbox.checked::after {
          content: '✓' !important;
          color: #fff !important;
          font-size: 24px !important;
          font-weight: 900 !important;
          line-height: 1 !important;
          text-shadow: 
            -1px -1px 0 #2196f3,
            1px -1px 0 #2196f3,
            -1px 1px 0 #2196f3,
            1px 1px 0 #2196f3,
            0 0 6px #2196f3 !important;
        }
        
        .pac-eula-checkbox-row label {
          flex: 1;
          cursor: pointer;
          font-size: 13px;
          line-height: 1.5;
        }
        
        .pac-eula-button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .pac-eula-button:disabled {
          background: #444;
          cursor: not-allowed;
          opacity: 0.5;
        }
        
        .pac-eula-button:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
        }
      `;
      document.head.appendChild(style);
      if (DEBUG_MODE) console.log('✅ Injected EULA styles');
    }
    
    // Check if EULA has been accepted
    const eulaAccepted = localStorage.getItem('pac_eulaAccepted');
    if (DEBUG_MODE) console.log('📜 EULA acceptance status:', eulaAccepted);
    
    if (!eulaAccepted) {
      if (DEBUG_MODE) console.log('⏳ Showing EULA modal...');
      await showEULA();
      if (DEBUG_MODE) console.log('✅ EULA accepted!');
    } else {
      if (DEBUG_MODE) console.log('✅ EULA already accepted, skipping');
    }
    
    // Now initialize the calculator
    if (DEBUG_MODE) console.log('🎮 Initializing calculator...');
    init();
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    setTimeout(start, 500);
  }

  // Expose for debugging
  window.__PACCalc = {
    isConnected: () => isConnected,
    getState: () => state,
    getPoolData: () => lastPoolData,
    getPokemonData: () => POKEMON_DATA,
    recalculate: updateDisplay,
    requestExtraction: () => window.postMessage({ type: 'PAC_EXTRACT_REQUEST' }, '*'),
    reinject: injectExtractor,
    resetEULA: () => {
      localStorage.removeItem('pac_eulaAccepted');
      if (DEBUG_MODE) console.log('EULA reset! Refresh the page to see it again.');
    }
  };

  // Export UI functions to namespace
  PAC.UI.init = init;
  PAC.UI.start = start;
  PAC.UI.updateDisplay = updateDisplay;
  PAC.UI.createOverlay = createOverlay;
  PAC.UI.showNotification = showNotification;

  if (PAC.DEBUG_MODE) {
    console.log('PAC UI: Overlay module loaded');
  }
})();
