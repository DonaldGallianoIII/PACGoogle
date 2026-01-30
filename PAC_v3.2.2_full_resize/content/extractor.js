/**
 * PAC Pool Extractor - Runs in page context
 * Injected as external file to bypass CSP
 */

(function() {
  if (window.__PACExtractorReady) return;
  window.__PACExtractorReady = true;
  
  // OPTIMIZATION: Console logging gating
  const DEBUG_MODE = false; // Set to true only for development
  
  if (DEBUG_MODE) console.log('🎮 PAC Extractor: Initializing in page context...');
  
  // Step 1: findRoom function (exactly as provided)
  function findRoom(obj, depth = 0, visited = new Set()) {
    if (depth > 10 || !obj || visited.has(obj)) return null;
    visited.add(obj);
    if (obj.sessionId && obj.state) return obj;
    for (let key in obj) {
      try {
        const val = obj[key];
        if (typeof val === 'object') {
          const found = findRoom(val, depth + 1, visited);
          if (found) return found;
        }
      } catch (e) {}
    }
    return null;
  }
  
  // Store room reference
  var __pacRoom = null;
  
  // OPTIMIZATION: Throttle room search to prevent browser freeze
  var __lastRoomSearchFail = 0;
  const ROOM_SEARCH_COOLDOWN = 5000; // 5 seconds
  
  // Listen for extraction requests via postMessage
  window.addEventListener('message', function(event) {
    // Handle reset request - clear cached room for new game
    if (event.data && event.data.type === 'PAC_RESET') {
      __pacRoom = null;
      __lastRoomSearchFail = 0;
      if (DEBUG_MODE) console.log('🔄 PAC Extractor: Reset - cleared cached room');
      return;
    }
    
    if (event.data && event.data.type === 'PAC_EXTRACT_REQUEST') {
      
      // Step 1: Get cached room (or find if needed with throttling)
      if (!__pacRoom || !__pacRoom.sessionId || !__pacRoom.state) {
        const now = Date.now();
        
        // Throttle: Only search once every 5 seconds if failing
        if (now - __lastRoomSearchFail < ROOM_SEARCH_COOLDOWN) {
          window.postMessage({ type: 'PAC_EXTRACT_RESPONSE', data: null }, '*');
          return;
        }
        
        __pacRoom = findRoom(window);
        
        if (!__pacRoom) {
          __lastRoomSearchFail = now;
          window.postMessage({ type: 'PAC_EXTRACT_RESPONSE', data: null }, '*');
          return;
        }
      }
      
      // Step 2: Verify room exists
      if (!__pacRoom) {
        window.postMessage({ type: 'PAC_EXTRACT_RESPONSE', data: null }, '*');
        return;
      }
      
      // Step 3: Extract counts
      try {
        var players = Array.from(__pacRoom.state.players.$items.values());
        var pokemonCounts = {};
        var totalUnits = 0;
        var playerShops = {}; // Map of playerName -> shop items
        
        // Extract local player level from DOM (easier than game state)
        var localPlayerLevel = null;
        var gameExpElement = document.querySelector('.game-experience span');
        if (gameExpElement && gameExpElement.textContent) {
          var levelMatch = gameExpElement.textContent.match(/Lvl\s*(\d+)/i);
          if (levelMatch) {
            localPlayerLevel = parseInt(levelMatch[1]);
          }
        }
        
        // Extract current round/stage from DOM
        var currentStage = null;
        
        // Get stage from .stage-information p element
        var stageElement = document.querySelector('.stage-information p');
        if (stageElement && stageElement.textContent) {
          var stageMatch = stageElement.textContent.match(/(\d+)/);
          if (stageMatch) {
            currentStage = parseInt(stageMatch[1]);
          }
        }
        
        // Fallback: Try game state
        if (currentStage === null && __pacRoom.state.stageLevel !== undefined) {
          currentStage = __pacRoom.state.stageLevel;
        }
        
        if (DEBUG_MODE && currentStage) {
          console.log('📍 Current stage:', currentStage);
        }
        
        // Store board/bench for each player (keyed by name, just like playerShops)
        var playerBoards = {};
        var playerBenches = {};
        var playerLevels = {};  // Track each player's level
        
        // Track pool reductions by rarity and evolution level
        var poolReductions = {
          common: { twoStar: 0, threeStar: 0 },
          uncommon: { twoStar: 0, threeStar: 0 },
          rare: { twoStar: 0, threeStar: 0 },
          epic: { twoStar: 0, threeStar: 0 },
          ultra: { twoStar: 0, threeStar: 0 }
        };
        
        // Get POKEMON_DATA from window if available
        var pokemonData = null;
        if (window.__PACCalc && window.__PACCalc.getPokemonData) {
          pokemonData = window.__PACCalc.getPokemonData();
        }
        
        players.forEach(function(player) {
          // Extract player level if available
          if (player.name) {
            var level = null;
            if (player.experienceManager && player.experienceManager.level !== undefined) {
              level = player.experienceManager.level;
            } else if (player.level !== undefined) {
              level = player.level;
            }
            if (level !== null) {
              playerLevels[player.name] = level;
            }
          }
          
          // Count board Pokemon
          var board = Array.from(player.board.$items.values());
          var bench = player.bench && player.bench.$items ? Array.from(player.bench.$items.values()) : [];
          
          // Store this player's board if they have a name
          if (player.name && board.length > 0) {
            playerBoards[player.name] = board.map(function(p) {
              return { name: p.name, stars: p.stars || 1 };
            });
          }
          
          // Store this player's bench if they have a name
          if (player.name && bench.length > 0) {
            playerBenches[player.name] = bench.map(function(p) {
              return { name: p.name, stars: p.stars || 1 };
            });
          }
          
          // Count units and pool reductions - OPTIMIZATION: Use for loops, avoid spread
          var allUnits = board.concat(bench); // concat is faster than spread
          for (var i = 0; i < allUnits.length; i++) {
            var pokemon = allUnits[i];
            var name = pokemon.name;
            var stars = pokemon.stars || 1;
            
            if (name) {
              pokemonCounts[name] = (pokemonCounts[name] || 0) + 1;
              totalUnits++;
              
              // Track pool reductions if we have rarity data
              if (pokemonData && pokemonData[name]) {
                var rarity = pokemonData[name];
                if (poolReductions[rarity]) {
                  if (stars === 1) {
                    // 1★ = 1 copy in twoStar pool
                    poolReductions[rarity].twoStar += 1;
                  } else if (stars === 2) {
                    // 2★ = 3 copies in twoStar pool
                    poolReductions[rarity].twoStar += 3;
                  } else if (stars === 3) {
                    // 3★ = 9 copies in threeStar pool
                    poolReductions[rarity].threeStar += 9;
                  }
                }
              }
            }
          }
          
          // Count shop Pokemon - try multiple paths
          var shop = null;
          
          // Debug: Log shop structure for first player
          if (DEBUG_MODE && player.name && players.indexOf(player) === 0) {
            console.log('🔍 DEBUG: Shop structure for ' + player.name);
            console.log('   - player.shop:', player.shop ? 'exists' : 'null');
            if (player.shop) {
              console.log('   - player.shop.items:', player.shop.items ? player.shop.items : 'null');
              console.log('   - player.shop.$items:', player.shop.$items ? 'exists' : 'null');
            }
          }
          
          if (player.shop && player.shop.items) {
            shop = Array.from(player.shop.items);
            if (DEBUG_MODE) console.log('🛒 Using player.shop.items for ' + player.name + ': ', shop);
          } else if (player.shop && player.shop.$items) {
            shop = Array.from(player.shop.$items.values());
            if (DEBUG_MODE) console.log('🛒 Using player.shop.$items for ' + player.name + ': ', shop);
          }
          
          if (shop) {
            var shopCount = 0;
            var trimmed; // OPTIMIZATION: Pre-allocate variable outside loop
            
            // OPTIMIZATION: Use for loop (faster than forEach)
            for (var i = 0; i < shop.length; i++) {
              var pokemon = shop[i];
              
              // String case - single trim call
              if (typeof pokemon === 'string') {
                trimmed = pokemon.trim();
                if (trimmed.length > 0) {
                  pokemonCounts[trimmed] = (pokemonCounts[trimmed] || 0) + 1;
                  totalUnits++;
                  shopCount++;
                }
              }
              // Object case - single trim call
              else if (pokemon && pokemon.name) {
                trimmed = pokemon.name.trim();
                if (trimmed.length > 0) {
                  pokemonCounts[trimmed] = (pokemonCounts[trimmed] || 0) + 1;
                  totalUnits++;
                  shopCount++;
                }
              }
              // null/undefined/empty - skip (no allocation)
            }
            
            // Debug: Log shop counts (even if 0)
            if (DEBUG_MODE && player.name) {
              console.log('🛒 Shop units for ' + player.name + ': ' + shopCount + ' / ' + shop.length + ' slots');
            }
            
            // Store player's shop with their name (filter out empty slots)
            // OPTIMIZATION: Use for loop instead of filter
            if (player.name && player.shop && player.shop.items) {
              var shopItems = Array.from(player.shop.items);
              var filteredShop = [];
              for (var j = 0; j < shopItems.length; j++) {
                var item = shopItems[j];
                var itemTrimmed;
                if (typeof item === 'string') {
                  itemTrimmed = item.trim();
                  if (itemTrimmed.length > 0) filteredShop.push(itemTrimmed);
                } else if (item && item.name) {
                  itemTrimmed = item.name.trim();
                  if (itemTrimmed.length > 0) filteredShop.push(item);
                }
              }
              playerShops[player.name] = filteredShop;
            }
          } else if (DEBUG_MODE && player.name) {
            console.log('❌ No shop found for ' + player.name);
          }
        });
        
        if (DEBUG_MODE) {
          console.log('📊 Extraction Summary: ' + totalUnits + ' total units tracked');
          console.log('   - Players: ' + players.length);
          console.log('   - Unique Pokemon: ' + Object.keys(pokemonCounts).length);
        }
        
        window.postMessage({ 
          type: 'PAC_EXTRACT_RESPONSE', 
          data: {
            pokemonCounts: pokemonCounts,
            playerCount: players.length,
            totalUnits: totalUnits,
            playerShops: playerShops, // All player shops keyed by name
            playerBoards: playerBoards, // All player boards keyed by name
            playerBenches: playerBenches, // All player benches keyed by name
            playerLevels: playerLevels, // All player levels keyed by name
            poolReductions: poolReductions, // Pool reductions by rarity and evolution
            localPlayerLevel: localPlayerLevel, // Send local player level from DOM
            currentStage: currentStage, // Current stage number (1, 2, 3, etc.)
            timestamp: Date.now()
          }
        }, '*');
        
      } catch (err) {
        console.error('PAC Extractor error:', err);
        window.postMessage({ type: 'PAC_EXTRACT_RESPONSE', data: null }, '*');
      }
    }
  });
  
  if (DEBUG_MODE) console.log('🎮 PAC Extractor: Ready and listening');
})();
