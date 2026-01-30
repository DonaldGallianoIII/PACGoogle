/**
 * PAC Live Data Calculator - Namespace
 *
 * This file MUST be loaded first. It establishes the shared namespace
 * that all other modules use to share data and functions.
 */
(function() {
  'use strict';

  // Create the global namespace
  window.PAC = window.PAC || {};

  // Version info
  PAC.VERSION = '3.2.2';
  PAC.DEBUG_MODE = true;  // Enable for troubleshooting

  // Sub-namespaces for organization
  PAC.Data = {};       // Pokemon data, evolution chains, constants
  PAC.Utils = {};      // Utility functions
  PAC.State = {};      // State management
  PAC.Calc = {};       // Probability calculations
  PAC.UI = {};         // UI components
  PAC.Features = {};   // Feature modules (portal detection, etc.)

  // Log that namespace is ready
  if (PAC.DEBUG_MODE) {
    console.log('PAC Namespace initialized v' + PAC.VERSION);
  }
})();
