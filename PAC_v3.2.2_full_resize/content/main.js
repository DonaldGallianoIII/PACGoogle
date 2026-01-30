/**
 * PAC Live Data Calculator - Main Entry Point
 *
 * Initializes the extension after all modules are loaded.
 */
(function() {
  'use strict';

  // Verify all modules loaded
  if (!window.PAC || !PAC.Data || !PAC.Utils || !PAC.State || !PAC.Calc || !PAC.UI) {
    console.error('PAC: Failed to load all modules');
    return;
  }

  // Start the application
  if (PAC.UI.start) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', PAC.UI.start);
    } else {
      setTimeout(PAC.UI.start, 500);
    }
  }

  // Expose for debugging
  window.__PACCalc = {
    isConnected: function() { return PAC.State.isConnected; },
    getState: function() { return PAC.State.state; },
    getPoolData: function() { return PAC.State.lastPoolData; },
    getPokemonData: function() { return PAC.Data.POKEMON_DATA; },
    recalculate: function() { return PAC.UI.updateDisplay ? PAC.UI.updateDisplay() : null; },
    requestExtraction: function() { window.postMessage({ type: 'PAC_EXTRACT_REQUEST' }, '*'); },
    resetEULA: function() {
      localStorage.removeItem('pac_eulaAccepted');
      console.log('PAC: EULA reset. Refresh the page to see it again.');
    },
    version: PAC.VERSION
  };

  if (PAC.DEBUG_MODE) {
    console.log('PAC Main: Extension initialized v' + PAC.VERSION);
  }
})();
