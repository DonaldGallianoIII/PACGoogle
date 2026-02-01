/**
 * PAC Live Data Calculator - Styles v2.0
 *
 * Complete UI redesign with:
 * - Modern glassmorphism aesthetic
 * - Smooth slide/fade animations
 * - Viewport-based scaling (vmin)
 * - CSS custom properties for theming
 */
(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════════
  // CSS CUSTOM PROPERTIES & THEMING
  // ═══════════════════════════════════════════════════════════════════════════

  PAC.UI.CSS = `
    /* ═══════════════════════════════════════════════════════════════════════
       CSS VARIABLES - Easy Customization
       ═══════════════════════════════════════════════════════════════════════ */
    :root {
      /* Scale factor - adjust to resize entire UI */
      --pac-scale: 1;

      /* Colors - Primary Theme */
      --pac-bg-primary: rgba(15, 23, 42, 0.95);
      --pac-bg-secondary: rgba(30, 41, 59, 0.9);
      --pac-bg-tertiary: rgba(51, 65, 85, 0.8);
      --pac-bg-glass: rgba(255, 255, 255, 0.03);
      --pac-bg-glass-hover: rgba(255, 255, 255, 0.06);

      --pac-border-primary: rgba(100, 116, 139, 0.3);
      --pac-border-accent: rgba(59, 130, 246, 0.5);
      --pac-border-glow: rgba(59, 130, 246, 0.3);

      --pac-text-primary: #f1f5f9;
      --pac-text-secondary: #94a3b8;
      --pac-text-muted: #64748b;

      --pac-accent-blue: #3b82f6;
      --pac-accent-cyan: #06b6d4;
      --pac-accent-green: #22c55e;
      --pac-accent-yellow: #eab308;
      --pac-accent-orange: #f97316;
      --pac-accent-red: #ef4444;
      --pac-accent-purple: #a855f7;

      /* Rarity Colors */
      --pac-rarity-common: #9ca3af;
      --pac-rarity-uncommon: #22c55e;
      --pac-rarity-rare: #3b82f6;
      --pac-rarity-epic: #a855f7;
      --pac-rarity-ultra: #f97316;
      --pac-rarity-legendary: #eab308;

      /* Spacing (vmin based) */
      --pac-space-xs: calc(0.4vmin * var(--pac-scale));
      --pac-space-sm: calc(0.8vmin * var(--pac-scale));
      --pac-space-md: calc(1.2vmin * var(--pac-scale));
      --pac-space-lg: calc(1.8vmin * var(--pac-scale));
      --pac-space-xl: calc(2.4vmin * var(--pac-scale));

      /* Typography */
      --pac-font-xs: clamp(9px, calc(1.0vmin * var(--pac-scale)), 14px);
      --pac-font-sm: clamp(10px, calc(1.2vmin * var(--pac-scale)), 16px);
      --pac-font-md: clamp(11px, calc(1.4vmin * var(--pac-scale)), 18px);
      --pac-font-lg: clamp(13px, calc(1.7vmin * var(--pac-scale)), 22px);
      --pac-font-xl: clamp(15px, calc(2.0vmin * var(--pac-scale)), 26px);

      /* Border Radius */
      --pac-radius-sm: calc(0.6vmin * var(--pac-scale));
      --pac-radius-md: calc(1.0vmin * var(--pac-scale));
      --pac-radius-lg: calc(1.4vmin * var(--pac-scale));
      --pac-radius-xl: calc(2.0vmin * var(--pac-scale));

      /* Shadows */
      --pac-shadow-sm: 0 calc(0.2vmin * var(--pac-scale)) calc(0.6vmin * var(--pac-scale)) rgba(0, 0, 0, 0.2);
      --pac-shadow-md: 0 calc(0.4vmin * var(--pac-scale)) calc(1.2vmin * var(--pac-scale)) rgba(0, 0, 0, 0.3);
      --pac-shadow-lg: 0 calc(0.8vmin * var(--pac-scale)) calc(2.4vmin * var(--pac-scale)) rgba(0, 0, 0, 0.4);
      --pac-shadow-glow: 0 0 calc(2vmin * var(--pac-scale)) var(--pac-border-glow);

      /* Animations */
      --pac-transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
      --pac-transition-normal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
      --pac-transition-slow: 400ms cubic-bezier(0.4, 0, 0.2, 1);
      --pac-transition-slide: 350ms cubic-bezier(0.16, 1, 0.3, 1);

      /* Dimensions */
      --pac-panel-width: calc(32vmin * var(--pac-scale));
      --pac-panel-min-width: calc(24vmin * var(--pac-scale));
      --pac-panel-max-width: calc(50vmin * var(--pac-scale));
      --pac-side-panel-width: calc(30vmin * var(--pac-scale));
      --pac-toggle-width: calc(3.2vmin * var(--pac-scale));
      --pac-toggle-height: calc(6.4vmin * var(--pac-scale));
    }

    /* ═══════════════════════════════════════════════════════════════════════
       MAIN OVERLAY CONTAINER
       ═══════════════════════════════════════════════════════════════════════ */
    #pac-calc-overlay {
      position: fixed;
      top: calc(2vmin * var(--pac-scale));
      right: calc(2vmin * var(--pac-scale));
      width: var(--pac-panel-width);
      min-width: var(--pac-panel-min-width);
      max-width: var(--pac-panel-max-width);
      max-height: calc(100vh - 4vmin);

      background: var(--pac-bg-primary);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);

      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-lg);
      box-shadow: var(--pac-shadow-lg), inset 0 1px 0 rgba(255,255,255,0.05);

      font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: var(--pac-font-md);
      color: var(--pac-text-primary);
      line-height: 1.5;

      display: flex;
      flex-direction: column;
      overflow: visible;
      z-index: 999999;
      user-select: none;

      transition:
        opacity var(--pac-transition-normal),
        transform var(--pac-transition-normal),
        box-shadow var(--pac-transition-normal);
    }

    #pac-calc-overlay:hover {
      box-shadow: var(--pac-shadow-lg), var(--pac-shadow-glow), inset 0 1px 0 rgba(255,255,255,0.05);
    }

    /* Minimized State */
    #pac-calc-overlay.minimized {
      max-height: auto;
    }

    #pac-calc-overlay.minimized #pac-calc-body {
      display: none;
    }

    #pac-calc-overlay.minimized .pac-team-toggle,
    #pac-calc-overlay.minimized .pac-current-toggle,
    #pac-calc-overlay.minimized .pac-settings-toggle,
    #pac-calc-overlay.minimized .pac-history-toggle {
      opacity: 0;
      pointer-events: none;
    }

    /* Target Flash States */
    #pac-calc-overlay.target-in-shop {
      border-color: var(--pac-accent-green);
      box-shadow: var(--pac-shadow-lg), 0 0 calc(3vmin * var(--pac-scale)) rgba(34, 197, 94, 0.4);
      animation: targetPulse 1.5s ease-in-out infinite;
    }

    #pac-calc-overlay.team-target-in-shop {
      border-color: var(--pac-accent-cyan);
      box-shadow: var(--pac-shadow-lg), 0 0 calc(3vmin * var(--pac-scale)) rgba(6, 182, 212, 0.4);
      animation: teamTargetPulse 1.5s ease-in-out infinite;
    }

    @keyframes targetPulse {
      0%, 100% { box-shadow: var(--pac-shadow-lg), 0 0 calc(2vmin * var(--pac-scale)) rgba(34, 197, 94, 0.3); }
      50% { box-shadow: var(--pac-shadow-lg), 0 0 calc(4vmin * var(--pac-scale)) rgba(34, 197, 94, 0.6); }
    }

    @keyframes teamTargetPulse {
      0%, 100% { box-shadow: var(--pac-shadow-lg), 0 0 calc(2vmin * var(--pac-scale)) rgba(6, 182, 212, 0.3); }
      50% { box-shadow: var(--pac-shadow-lg), 0 0 calc(4vmin * var(--pac-scale)) rgba(6, 182, 212, 0.6); }
    }

    /* ═══════════════════════════════════════════════════════════════════════
       RESIZE HANDLES
       ═══════════════════════════════════════════════════════════════════════ */
    .pac-resize-handle {
      position: absolute;
      z-index: 10;
      opacity: 0;
      transition: opacity var(--pac-transition-fast);
    }

    #pac-calc-overlay:hover .pac-resize-handle {
      opacity: 1;
    }

    .pac-resize-nw, .pac-resize-ne, .pac-resize-sw, .pac-resize-se {
      width: calc(1.6vmin * var(--pac-scale));
      height: calc(1.6vmin * var(--pac-scale));
    }

    .pac-resize-n, .pac-resize-s {
      height: calc(0.8vmin * var(--pac-scale));
      left: calc(1.6vmin * var(--pac-scale));
      right: calc(1.6vmin * var(--pac-scale));
      cursor: ns-resize;
    }

    .pac-resize-w, .pac-resize-e {
      width: calc(0.8vmin * var(--pac-scale));
      top: calc(1.6vmin * var(--pac-scale));
      bottom: calc(1.6vmin * var(--pac-scale));
      cursor: ew-resize;
    }

    .pac-resize-nw { top: 0; left: 0; cursor: nwse-resize; }
    .pac-resize-ne { top: 0; right: 0; cursor: nesw-resize; }
    .pac-resize-sw { bottom: 0; left: 0; cursor: nesw-resize; }
    .pac-resize-se { bottom: 0; right: 0; cursor: nwse-resize; }
    .pac-resize-n { top: 0; }
    .pac-resize-s { bottom: 0; }
    .pac-resize-w { left: 0; }
    .pac-resize-e { right: 0; }

    #pac-calc-overlay.minimized .pac-resize-handle {
      display: none;
    }

    /* ═══════════════════════════════════════════════════════════════════════
       HEADER
       ═══════════════════════════════════════════════════════════════════════ */
    #pac-calc-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--pac-space-md) var(--pac-space-lg);
      background: var(--pac-bg-glass);
      border-bottom: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-lg) var(--pac-radius-lg) 0 0;
      cursor: grab;
      flex-shrink: 0;
    }

    #pac-calc-header:active {
      cursor: grabbing;
    }

    #pac-calc-title {
      display: flex;
      align-items: center;
      gap: var(--pac-space-sm);
      font-size: var(--pac-font-md);
      font-weight: 600;
      color: var(--pac-text-primary);
    }

    .pac-status-dot {
      width: calc(1vmin * var(--pac-scale));
      height: calc(1vmin * var(--pac-scale));
      border-radius: 50%;
      background: var(--pac-text-muted);
      transition: background var(--pac-transition-normal), box-shadow var(--pac-transition-normal);
    }

    .pac-status-dot.connected {
      background: var(--pac-accent-green);
      box-shadow: 0 0 calc(0.8vmin * var(--pac-scale)) var(--pac-accent-green);
    }

    .pac-status-dot.tracking {
      background: var(--pac-accent-cyan);
      box-shadow: 0 0 calc(0.8vmin * var(--pac-scale)) var(--pac-accent-cyan);
      animation: statusPulse 2s ease-in-out infinite;
    }

    @keyframes statusPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    #pac-calc-controls {
      display: flex;
      gap: var(--pac-space-xs);
    }

    .pac-ctrl-btn {
      width: calc(2.8vmin * var(--pac-scale));
      height: calc(2.8vmin * var(--pac-scale));
      display: flex;
      align-items: center;
      justify-content: center;

      background: var(--pac-bg-tertiary);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-sm);

      color: var(--pac-text-secondary);
      font-size: var(--pac-font-sm);
      font-weight: 500;
      cursor: pointer;

      transition: all var(--pac-transition-fast);
    }

    .pac-ctrl-btn:hover {
      background: var(--pac-bg-glass-hover);
      border-color: var(--pac-border-accent);
      color: var(--pac-text-primary);
      transform: translateY(-1px);
    }

    .pac-ctrl-btn:active {
      transform: translateY(0);
    }

    /* ═══════════════════════════════════════════════════════════════════════
       BODY
       ═══════════════════════════════════════════════════════════════════════ */
    #pac-calc-body {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: var(--pac-space-md);

      scroll-behavior: smooth;
      scrollbar-width: thin;
      scrollbar-color: var(--pac-bg-tertiary) transparent;
    }

    #pac-calc-body::-webkit-scrollbar {
      width: calc(0.6vmin * var(--pac-scale));
    }

    #pac-calc-body::-webkit-scrollbar-track {
      background: transparent;
    }

    #pac-calc-body::-webkit-scrollbar-thumb {
      background: var(--pac-bg-tertiary);
      border-radius: var(--pac-radius-sm);
    }

    #pac-calc-body::-webkit-scrollbar-thumb:hover {
      background: var(--pac-text-muted);
    }

    /* ═══════════════════════════════════════════════════════════════════════
       SECTIONS
       ═══════════════════════════════════════════════════════════════════════ */
    .pac-section {
      background: var(--pac-bg-glass);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-md);
      padding: var(--pac-space-md);
      margin-bottom: var(--pac-space-md);

      transition: border-color var(--pac-transition-fast), box-shadow var(--pac-transition-fast);
    }

    .pac-section:hover {
      border-color: var(--pac-border-accent);
    }

    .pac-section-title {
      font-size: var(--pac-font-sm);
      font-weight: 600;
      color: var(--pac-accent-blue);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: var(--pac-space-sm);
      padding-bottom: var(--pac-space-xs);
      border-bottom: 1px solid var(--pac-border-primary);
    }

    /* ═══════════════════════════════════════════════════════════════════════
       FORM ELEMENTS
       ═══════════════════════════════════════════════════════════════════════ */
    .pac-row {
      display: flex;
      gap: var(--pac-space-sm);
      margin-bottom: var(--pac-space-sm);
    }

    .pac-row:last-child {
      margin-bottom: 0;
    }

    .pac-field {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--pac-space-xs);
    }

    .pac-field label {
      font-size: var(--pac-font-xs);
      font-weight: 500;
      color: var(--pac-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .pac-field input,
    .pac-field select {
      width: 100%;
      padding: var(--pac-space-sm) var(--pac-space-md);

      background: var(--pac-bg-secondary);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-sm);

      color: var(--pac-text-primary);
      font-size: var(--pac-font-md);
      font-family: inherit;

      transition: all var(--pac-transition-fast);
      outline: none;
    }

    .pac-field input:hover,
    .pac-field select:hover {
      border-color: var(--pac-text-muted);
    }

    .pac-field input:focus,
    .pac-field select:focus {
      border-color: var(--pac-accent-blue);
      box-shadow: 0 0 0 calc(0.3vmin * var(--pac-scale)) rgba(59, 130, 246, 0.2);
    }

    .pac-field select {
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L2 4h8z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right var(--pac-space-sm) center;
      padding-right: calc(2.4vmin * var(--pac-scale));
    }

    .pac-field select option {
      background: var(--pac-bg-primary);
      color: var(--pac-text-primary);
    }

    .pac-field input[type="number"] {
      -moz-appearance: textfield;
    }

    .pac-field input[type="number"]::-webkit-inner-spin-button,
    .pac-field input[type="number"]::-webkit-outer-spin-button {
      opacity: 0;
    }

    .pac-field input[type="number"]:hover::-webkit-inner-spin-button,
    .pac-field input[type="number"]:hover::-webkit-outer-spin-button {
      opacity: 1;
    }

    /* ═══════════════════════════════════════════════════════════════════════
       TOGGLE SWITCHES
       ═══════════════════════════════════════════════════════════════════════ */
    .pac-toggle-row {
      display: flex;
      flex-wrap: wrap;
      gap: var(--pac-space-sm);
      margin-bottom: var(--pac-space-sm);
    }

    .pac-toggle {
      display: flex;
      align-items: center;
      gap: var(--pac-space-sm);
      cursor: pointer;
      font-size: var(--pac-font-sm);
      color: var(--pac-text-secondary);
      transition: color var(--pac-transition-fast);
    }

    .pac-toggle:hover {
      color: var(--pac-text-primary);
    }

    .pac-toggle input[type="checkbox"] {
      width: calc(1.6vmin * var(--pac-scale));
      height: calc(1.6vmin * var(--pac-scale));
      margin: 0;
      accent-color: var(--pac-accent-blue);
      cursor: pointer;
    }

    /* ═══════════════════════════════════════════════════════════════════════
       POKEMON SELECTOR & AUTOCOMPLETE
       ═══════════════════════════════════════════════════════════════════════ */
    .pac-pokemon-selector {
      position: relative;
    }

    .pac-autocomplete-input {
      width: 100%;
      padding: var(--pac-space-sm) var(--pac-space-md);
      background: var(--pac-bg-secondary);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-sm);
      color: var(--pac-text-primary);
      font-size: var(--pac-font-md);
      transition: all var(--pac-transition-fast);
      outline: none;
    }

    .pac-autocomplete-input:focus {
      border-color: var(--pac-accent-blue);
      box-shadow: 0 0 0 calc(0.3vmin * var(--pac-scale)) rgba(59, 130, 246, 0.2);
    }

    #pacAutocompleteDropdown {
      position: fixed;
      background: var(--pac-bg-primary);
      border: 1px solid var(--pac-border-accent);
      border-radius: var(--pac-radius-md);
      box-shadow: var(--pac-shadow-lg);
      max-height: calc(40vmin * var(--pac-scale));
      overflow-y: auto;
      z-index: 10000000;

      opacity: 0;
      transform: translateY(calc(-1vmin * var(--pac-scale)));
      transition: opacity var(--pac-transition-fast), transform var(--pac-transition-fast);
    }

    #pacAutocompleteDropdown:not(.hidden) {
      opacity: 1;
      transform: translateY(0);
    }

    #pacAutocompleteDropdown.hidden {
      display: none;
    }

    .pac-dropdown-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--pac-space-sm) var(--pac-space-md);
      cursor: pointer;
      transition: background var(--pac-transition-fast);
    }

    .pac-dropdown-item:hover {
      background: var(--pac-bg-glass-hover);
    }

    .pac-pokemon-name {
      font-size: var(--pac-font-sm);
      color: var(--pac-text-primary);
    }

    .pac-pokemon-rarity {
      font-size: var(--pac-font-xs);
      padding: var(--pac-space-xs) var(--pac-space-sm);
      border-radius: var(--pac-radius-sm);
      font-weight: 600;
      text-transform: uppercase;
    }

    /* ═══════════════════════════════════════════════════════════════════════
       EVOLUTION FAMILY DISPLAY
       ═══════════════════════════════════════════════════════════════════════ */
    .pac-evolution-family {
      margin-top: var(--pac-space-sm);
      padding: var(--pac-space-sm);
      background: var(--pac-bg-glass);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-sm);

      opacity: 0;
      max-height: 0;
      overflow: hidden;
      transition: opacity var(--pac-transition-normal), max-height var(--pac-transition-normal);
    }

    .pac-evolution-family:not(.hidden) {
      opacity: 1;
      max-height: calc(20vmin * var(--pac-scale));
    }

    .pac-family-title {
      font-size: var(--pac-font-xs);
      font-weight: 600;
      color: var(--pac-accent-blue);
      text-transform: uppercase;
      margin-bottom: var(--pac-space-xs);
    }

    .pac-family-breakdown {
      display: flex;
      flex-wrap: wrap;
      gap: var(--pac-space-xs);
      margin-bottom: var(--pac-space-xs);
    }

    .pac-family-total {
      font-size: var(--pac-font-sm);
      color: var(--pac-text-secondary);
      text-align: right;
    }

    /* ═══════════════════════════════════════════════════════════════════════
       LIVE TRACKING CONTROLS
       ═══════════════════════════════════════════════════════════════════════ */
    .pac-live-controls {
      display: flex;
      gap: var(--pac-space-sm);
      margin: var(--pac-space-sm) 0;
    }

    .pac-live-toggle {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--pac-space-sm);
      padding: var(--pac-space-sm) var(--pac-space-md);

      background: var(--pac-bg-tertiary);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-sm);

      color: var(--pac-text-secondary);
      font-size: var(--pac-font-sm);
      font-weight: 500;
      cursor: pointer;

      transition: all var(--pac-transition-fast);
    }

    .pac-live-toggle:hover {
      background: var(--pac-bg-glass-hover);
      border-color: var(--pac-border-accent);
    }

    .pac-live-toggle.active {
      background: rgba(34, 197, 94, 0.15);
      border-color: var(--pac-accent-green);
      color: var(--pac-accent-green);
    }

    .pac-live-status {
      padding: var(--pac-space-xs) var(--pac-space-sm);
      background: var(--pac-accent-red);
      border-radius: var(--pac-radius-sm);
      font-size: var(--pac-font-xs);
      font-weight: 700;
      color: white;
    }

    .pac-live-toggle.active .pac-live-status {
      background: var(--pac-accent-green);
    }

    .pac-speed-select {
      flex: 1;
      padding: var(--pac-space-sm);
      background: var(--pac-bg-secondary);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-sm);
      color: var(--pac-text-primary);
      font-size: var(--pac-font-xs);
      cursor: pointer;
    }

    .pac-new-game-btn {
      width: 100%;
      padding: var(--pac-space-sm) var(--pac-space-md);
      background: linear-gradient(135deg, var(--pac-accent-blue) 0%, var(--pac-accent-cyan) 100%);
      border: none;
      border-radius: var(--pac-radius-sm);
      color: white;
      font-size: var(--pac-font-sm);
      font-weight: 600;
      cursor: pointer;
      transition: all var(--pac-transition-fast);
    }

    .pac-new-game-btn:hover {
      transform: translateY(-1px);
      box-shadow: var(--pac-shadow-md);
    }

    .pac-live-indicator {
      display: flex;
      align-items: center;
      gap: var(--pac-space-sm);
      padding: var(--pac-space-sm);
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      border-radius: var(--pac-radius-sm);
      font-size: var(--pac-font-xs);
      color: var(--pac-accent-green);
      margin-top: var(--pac-space-sm);

      opacity: 0;
      transform: translateY(calc(-0.5vmin * var(--pac-scale)));
      transition: opacity var(--pac-transition-normal), transform var(--pac-transition-normal);
    }

    .pac-live-indicator[style*="display: flex"],
    .pac-live-indicator:not([style*="display: none"]) {
      opacity: 1;
      transform: translateY(0);
    }

    .pac-live-divider {
      color: var(--pac-text-muted);
    }

    .pac-stage-display {
      font-weight: 600;
      color: var(--pac-accent-cyan);
    }

    /* ═══════════════════════════════════════════════════════════════════════
       COLLAPSIBLE SECTIONS
       ═══════════════════════════════════════════════════════════════════════ */
    .pac-collapsible {
      margin-bottom: var(--pac-space-md);
    }

    .pac-collapse-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--pac-space-sm) var(--pac-space-md);

      background: var(--pac-bg-glass);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-sm);

      color: var(--pac-text-primary);
      font-size: var(--pac-font-sm);
      font-weight: 500;
      cursor: pointer;

      transition: all var(--pac-transition-fast);
    }

    .pac-collapse-btn:hover {
      background: var(--pac-bg-glass-hover);
      border-color: var(--pac-border-accent);
    }

    .pac-collapse-btn::after {
      content: '▼';
      font-size: var(--pac-font-xs);
      color: var(--pac-text-muted);
      transition: transform var(--pac-transition-normal);
    }

    .pac-collapse-content {
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transition: max-height var(--pac-transition-slide), opacity var(--pac-transition-normal);
    }

    .pac-collapse-content.expanded {
      max-height: calc(50vmin * var(--pac-scale));
      opacity: 1;
      padding: var(--pac-space-sm);
      margin-top: var(--pac-space-xs);
      background: var(--pac-bg-glass);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-sm);
    }

    .pac-collapsible:has(.pac-collapse-content.expanded) .pac-collapse-btn::after {
      transform: rotate(180deg);
    }

    /* ═══════════════════════════════════════════════════════════════════════
       RESULTS DISPLAY
       ═══════════════════════════════════════════════════════════════════════ */
    .pac-results {
      background: linear-gradient(135deg, var(--pac-bg-secondary) 0%, var(--pac-bg-tertiary) 100%);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-md);
      padding: var(--pac-space-md);
      margin-top: var(--pac-space-md);
    }

    .pac-result-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--pac-space-xs) 0;
      border-bottom: 1px solid var(--pac-border-primary);
    }

    .pac-result-row:last-child {
      border-bottom: none;
    }

    .pac-result-label {
      font-size: var(--pac-font-sm);
      color: var(--pac-text-secondary);
    }

    .pac-result-value {
      font-size: var(--pac-font-md);
      font-weight: 600;
      color: var(--pac-accent-cyan);
      transition: color var(--pac-transition-fast), opacity var(--pac-transition-fast);
    }

    .pac-result-value.updating {
      opacity: 0.5;
    }

    .pac-result-value.highlight {
      color: var(--pac-accent-green);
      text-shadow: 0 0 calc(1vmin * var(--pac-scale)) rgba(34, 197, 94, 0.5);
    }

    .pac-confidence-control {
      padding: var(--pac-space-sm) 0;
    }

    .pac-confidence-control label {
      display: flex;
      justify-content: space-between;
      font-size: var(--pac-font-sm);
      color: var(--pac-text-secondary);
      margin-bottom: var(--pac-space-xs);
    }

    .pac-confidence-control input[type="range"] {
      width: 100%;
      height: calc(0.6vmin * var(--pac-scale));
      background: var(--pac-bg-tertiary);
      border-radius: var(--pac-radius-sm);
      outline: none;
      -webkit-appearance: none;
      cursor: pointer;
    }

    .pac-confidence-control input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: calc(1.6vmin * var(--pac-scale));
      height: calc(1.6vmin * var(--pac-scale));
      background: var(--pac-accent-blue);
      border-radius: 50%;
      cursor: pointer;
      transition: transform var(--pac-transition-fast);
    }

    .pac-confidence-control input[type="range"]::-webkit-slider-thumb:hover {
      transform: scale(1.2);
    }

    .pac-status-msg {
      padding: var(--pac-space-sm);
      margin-top: var(--pac-space-sm);
      border-radius: var(--pac-radius-sm);
      font-size: var(--pac-font-xs);

      opacity: 0;
      transform: translateY(calc(-0.5vmin * var(--pac-scale)));
      transition: opacity var(--pac-transition-normal), transform var(--pac-transition-normal);
    }

    .pac-status-msg:not(:empty) {
      opacity: 1;
      transform: translateY(0);
    }

    .pac-status-msg.warning {
      background: rgba(234, 179, 8, 0.15);
      border: 1px solid rgba(234, 179, 8, 0.3);
      color: var(--pac-accent-yellow);
    }

    .pac-status-msg.error {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: var(--pac-accent-red);
    }

    .pac-status-msg.success {
      background: rgba(34, 197, 94, 0.15);
      border: 1px solid rgba(34, 197, 94, 0.3);
      color: var(--pac-accent-green);
    }

    /* ═══════════════════════════════════════════════════════════════════════
       FOOTER
       ═══════════════════════════════════════════════════════════════════════ */
    #pac-calc-footer,
    .pac-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--pac-space-sm) var(--pac-space-lg);
      background: var(--pac-bg-glass);
      border-top: 1px solid var(--pac-border-primary);
      border-radius: 0 0 var(--pac-radius-lg) var(--pac-radius-lg);
      font-size: var(--pac-font-sm);
      color: var(--pac-text-secondary);
      flex-shrink: 0;
    }

    .pac-footer span {
      transition: color var(--pac-transition-fast);
    }

    /* ═══════════════════════════════════════════════════════════════════════
       SIDE PANEL SYSTEM
       ═══════════════════════════════════════════════════════════════════════ */
    .pac-team-panel {
      position: absolute;
      top: 0;
      left: 0;
      width: var(--pac-side-panel-width);
      height: 100%;

      background: var(--pac-bg-primary);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-lg);
      box-shadow: var(--pac-shadow-lg);

      display: flex;
      flex-direction: column;
      z-index: -1;

      transform: translateX(0);
      opacity: 0;
      transition:
        transform var(--pac-transition-slide),
        opacity var(--pac-transition-normal);
    }

    .pac-team-panel.expanded {
      transform: translateX(calc(var(--pac-panel-width) + var(--pac-space-sm)));
      opacity: 1;
    }

    .pac-team-toggle {
      position: absolute;
      left: 100%;
      top: 50%;
      transform: translateY(-50%);

      width: var(--pac-toggle-width);
      height: var(--pac-toggle-height);

      background: var(--pac-bg-primary);
      border: 1px solid var(--pac-border-primary);
      border-left: none;
      border-radius: 0 var(--pac-radius-sm) var(--pac-radius-sm) 0;

      display: flex;
      align-items: center;
      justify-content: center;

      color: var(--pac-accent-blue);
      font-size: var(--pac-font-md);
      cursor: pointer;
      z-index: 1;

      transition: all var(--pac-transition-fast);
    }

    .pac-team-toggle:hover {
      background: var(--pac-bg-glass-hover);
      border-color: var(--pac-accent-blue);
      color: var(--pac-text-primary);
      width: calc(var(--pac-toggle-width) + 0.5vmin);
    }

    .pac-team-arrow {
      transition: transform var(--pac-transition-normal);
      display: inline-block;
    }

    .pac-team-panel.expanded .pac-team-arrow {
      transform: rotate(180deg);
    }

    .pac-current-toggle {
      top: calc(50% - 8vmin);
    }

    .pac-settings-toggle {
      top: calc(50% + 8vmin);
    }

    .pac-history-toggle {
      top: calc(50% + 16vmin);
    }

    .pac-team-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      opacity: 0;
      transition: opacity var(--pac-transition-slow);
    }

    .pac-team-panel.expanded .pac-team-content {
      opacity: 1;
      transition-delay: 100ms;
    }

    .pac-team-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--pac-space-md);
      border-bottom: 1px solid var(--pac-border-primary);
      flex-shrink: 0;
    }

    .pac-team-header h3 {
      margin: 0;
      font-size: var(--pac-font-md);
      font-weight: 600;
      color: var(--pac-text-primary);
    }

    .pac-team-close {
      width: calc(2.4vmin * var(--pac-scale));
      height: calc(2.4vmin * var(--pac-scale));
      display: flex;
      align-items: center;
      justify-content: center;

      background: transparent;
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-sm);

      color: var(--pac-text-muted);
      font-size: var(--pac-font-md);
      cursor: pointer;

      transition: all var(--pac-transition-fast);
    }

    .pac-team-close:hover {
      background: rgba(239, 68, 68, 0.15);
      border-color: var(--pac-accent-red);
      color: var(--pac-accent-red);
    }

    /* ═══════════════════════════════════════════════════════════════════════
       SYNERGY BAR
       ═══════════════════════════════════════════════════════════════════════ */
    .pac-synergy-bar {
      display: none;
      overflow-x: auto;
      overflow-y: hidden;
      white-space: nowrap;
      padding: var(--pac-space-sm);
      background: var(--pac-bg-glass);
      border-bottom: 1px solid var(--pac-border-primary);
      scrollbar-width: none;
      flex-shrink: 0;
    }

    .pac-synergy-bar::-webkit-scrollbar {
      display: none;
    }

    .pac-synergy-bar.visible {
      display: block;
    }

    .pac-synergy-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: calc(3.2vmin * var(--pac-scale));
      height: calc(3.2vmin * var(--pac-scale));
      margin-right: var(--pac-space-xs);

      background: var(--pac-bg-tertiary);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-sm);

      font-size: var(--pac-font-md);
      cursor: pointer;

      transition: all var(--pac-transition-fast);
    }

    .pac-synergy-btn:hover {
      transform: scale(1.1);
      border-color: var(--pac-border-accent);
    }

    .pac-synergy-btn.active {
      background: rgba(59, 130, 246, 0.2);
      border-color: var(--pac-accent-blue);
      box-shadow: 0 0 calc(1vmin * var(--pac-scale)) rgba(59, 130, 246, 0.3);
    }

    /* ═══════════════════════════════════════════════════════════════════════
       TEAM LIST
       ═══════════════════════════════════════════════════════════════════════ */
    .pac-team-list {
      flex: 1;
      overflow-y: auto;
      padding: var(--pac-space-sm);
      scrollbar-width: thin;
      scrollbar-color: var(--pac-bg-tertiary) transparent;
    }

    .pac-team-list::-webkit-scrollbar {
      width: calc(0.5vmin * var(--pac-scale));
    }

    .pac-team-list::-webkit-scrollbar-thumb {
      background: var(--pac-bg-tertiary);
      border-radius: var(--pac-radius-sm);
    }

    .pac-team-target {
      display: flex;
      align-items: center;
      gap: var(--pac-space-sm);
      padding: var(--pac-space-sm);
      margin-bottom: var(--pac-space-sm);

      background: var(--pac-bg-glass);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-sm);

      transition: all var(--pac-transition-fast);

      animation: fadeSlideIn var(--pac-transition-normal) ease-out;
    }

    @keyframes fadeSlideIn {
      from {
        opacity: 0;
        transform: translateX(calc(-1vmin * var(--pac-scale)));
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .pac-team-target:hover {
      border-color: var(--pac-border-accent);
    }

    .pac-team-target.in-shop {
      border-color: var(--pac-accent-green);
      background: rgba(34, 197, 94, 0.1);
      box-shadow: 0 0 calc(1vmin * var(--pac-scale)) rgba(34, 197, 94, 0.2);
    }

    .pac-team-target-name {
      flex: 1;
      font-size: var(--pac-font-sm);
      font-weight: 500;
      color: var(--pac-text-primary);
    }

    .pac-team-target-prob {
      font-size: var(--pac-font-sm);
      font-weight: 600;
      color: var(--pac-accent-cyan);
    }

    .pac-team-target-remove {
      width: calc(2vmin * var(--pac-scale));
      height: calc(2vmin * var(--pac-scale));
      display: flex;
      align-items: center;
      justify-content: center;

      background: transparent;
      border: none;
      border-radius: var(--pac-radius-sm);

      color: var(--pac-text-muted);
      font-size: var(--pac-font-sm);
      cursor: pointer;

      transition: all var(--pac-transition-fast);
    }

    .pac-team-target-remove:hover {
      background: rgba(239, 68, 68, 0.15);
      color: var(--pac-accent-red);
    }

    .pac-team-combined {
      padding: var(--pac-space-sm);
      margin: var(--pac-space-sm);
      background: var(--pac-bg-glass);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-sm);
      flex-shrink: 0;
    }

    .pac-team-combined-title {
      font-size: var(--pac-font-xs);
      font-weight: 600;
      color: var(--pac-accent-blue);
      text-transform: uppercase;
      margin-bottom: var(--pac-space-xs);
    }

    .pac-team-combined-stats {
      display: flex;
      justify-content: space-between;
    }

    .pac-team-stat {
      display: flex;
      flex-direction: column;
    }

    .pac-team-stat-label {
      font-size: var(--pac-font-xs);
      color: var(--pac-text-muted);
    }

    .pac-team-stat-value {
      font-size: var(--pac-font-md);
      font-weight: 600;
      color: var(--pac-accent-cyan);
    }

    .pac-team-add-section {
      display: flex;
      gap: var(--pac-space-sm);
      padding: var(--pac-space-sm);
      border-top: 1px solid var(--pac-border-primary);
      flex-shrink: 0;
    }

    .pac-team-input {
      flex: 1;
      padding: var(--pac-space-sm);
      background: var(--pac-bg-secondary);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-sm);
      color: var(--pac-text-primary);
      font-size: var(--pac-font-sm);
      outline: none;
      transition: border-color var(--pac-transition-fast);
    }

    .pac-team-input:focus {
      border-color: var(--pac-accent-blue);
    }

    .pac-team-add-btn {
      padding: var(--pac-space-sm) var(--pac-space-md);
      background: var(--pac-accent-blue);
      border: none;
      border-radius: var(--pac-radius-sm);
      color: white;
      font-size: var(--pac-font-sm);
      font-weight: 600;
      cursor: pointer;
      transition: all var(--pac-transition-fast);
    }

    .pac-team-add-btn:hover {
      background: var(--pac-accent-cyan);
      transform: translateY(-1px);
    }

    /* ═══════════════════════════════════════════════════════════════════════
       MONO TYPE / CHALLENGE PANELS
       ═══════════════════════════════════════════════════════════════════════ */
    .pac-mono-panel {
      display: none;
      padding: var(--pac-space-sm);
      background: var(--pac-bg-glass);
      border-radius: var(--pac-radius-sm);
      margin: var(--pac-space-sm);
    }

    .pac-mono-panel.visible {
      display: block;
      animation: fadeSlideIn var(--pac-transition-normal) ease-out;
    }

    .pac-mono-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--pac-space-sm);
      cursor: pointer;
      border-radius: var(--pac-radius-sm);
      transition: background var(--pac-transition-fast);
    }

    .pac-mono-header:hover {
      background: var(--pac-bg-glass-hover);
    }

    .pac-mono-header-title {
      font-size: var(--pac-font-sm);
      font-weight: 600;
      color: var(--pac-text-primary);
    }

    .pac-mono-arrow {
      font-size: var(--pac-font-xs);
      color: var(--pac-text-muted);
      transition: transform var(--pac-transition-normal);
    }

    .pac-mono-panel.expanded .pac-mono-arrow {
      transform: rotate(90deg);
    }

    .pac-mono-content {
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transition: max-height var(--pac-transition-slide), opacity var(--pac-transition-normal);
    }

    .pac-mono-panel.expanded .pac-mono-content {
      max-height: calc(60vmin * var(--pac-scale));
      opacity: 1;
      padding-top: var(--pac-space-sm);
    }

    .pac-mono-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: var(--pac-space-xs);
      margin-bottom: var(--pac-space-sm);
    }

    .pac-mono-type-btn {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      background: var(--pac-bg-tertiary);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-sm);

      font-size: var(--pac-font-lg);
      cursor: pointer;

      transition: all var(--pac-transition-fast);
    }

    .pac-mono-type-btn:hover {
      transform: scale(1.1);
      border-color: var(--pac-border-accent);
    }

    .pac-mono-type-btn.selected {
      border-color: var(--pac-accent-green);
      box-shadow: 0 0 calc(1vmin * var(--pac-scale)) rgba(34, 197, 94, 0.4);
    }

    .pac-mono-status {
      text-align: center;
      font-size: var(--pac-font-xs);
      color: var(--pac-text-muted);
      padding: var(--pac-space-sm);
    }

    .pac-mono-clear {
      width: 100%;
      padding: var(--pac-space-sm);
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: var(--pac-radius-sm);
      color: var(--pac-accent-red);
      font-size: var(--pac-font-sm);
      cursor: pointer;
      transition: all var(--pac-transition-fast);
    }

    .pac-mono-clear:hover {
      background: rgba(239, 68, 68, 0.25);
    }

    .pac-draft-panel,
    .pac-copycat-panel,
    .pac-mlg-panel {
      margin-top: var(--pac-space-sm);
      padding: var(--pac-space-sm);
      background: var(--pac-bg-glass);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-sm);
    }

    .pac-draft-header,
    .pac-copycat-header,
    .pac-mlg-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .pac-draft-header-title,
    .pac-copycat-header-title,
    .pac-mlg-header-title {
      font-size: var(--pac-font-sm);
      font-weight: 600;
      color: var(--pac-text-primary);
    }

    .pac-draft-toggle,
    .pac-copycat-toggle,
    .pac-mlg-toggle {
      padding: var(--pac-space-xs) var(--pac-space-sm);
      background: var(--pac-bg-tertiary);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-sm);
      color: var(--pac-text-secondary);
      font-size: var(--pac-font-xs);
      cursor: pointer;
      transition: all var(--pac-transition-fast);
    }

    .pac-draft-toggle:hover,
    .pac-copycat-toggle:hover,
    .pac-mlg-toggle:hover {
      border-color: var(--pac-accent-blue);
      color: var(--pac-text-primary);
    }

    .pac-draft-toggle.active,
    .pac-copycat-toggle.active,
    .pac-mlg-toggle.active {
      background: rgba(34, 197, 94, 0.15);
      border-color: var(--pac-accent-green);
      color: var(--pac-accent-green);
    }

    .pac-draft-status,
    .pac-copycat-status,
    .pac-mlg-status {
      margin-top: var(--pac-space-sm);
      font-size: var(--pac-font-xs);
      color: var(--pac-text-muted);
      text-align: center;
    }

    .pac-mono-wheel-section {
      display: flex;
      align-items: center;
      gap: var(--pac-space-sm);
      margin-top: var(--pac-space-sm);
    }

    .pac-mono-spin-btn {
      padding: var(--pac-space-sm) var(--pac-space-md);
      background: linear-gradient(135deg, var(--pac-accent-purple), var(--pac-accent-blue));
      border: none;
      border-radius: var(--pac-radius-sm);
      color: white;
      font-size: var(--pac-font-sm);
      font-weight: 600;
      cursor: pointer;
      transition: all var(--pac-transition-fast);
    }

    .pac-mono-spin-btn:hover {
      transform: scale(1.05);
    }

    .pac-mono-wheel-display {
      flex: 1;
      display: flex;
      justify-content: center;
    }

    .pac-mono-wheel-type {
      padding: var(--pac-space-sm) var(--pac-space-md);
      border-radius: var(--pac-radius-sm);
      font-size: var(--pac-font-md);
      font-weight: 600;
    }

    .pac-mono-wheel-label {
      text-align: center;
      font-size: var(--pac-font-xs);
      color: var(--pac-text-muted);
      margin-top: var(--pac-space-xs);
    }

    /* ═══════════════════════════════════════════════════════════════════════
       HISTORY PANEL
       ═══════════════════════════════════════════════════════════════════════ */
    .pac-history-content {
      flex: 1;
      overflow-y: auto;
      padding: var(--pac-space-sm);

      opacity: 0;
      transition: opacity var(--pac-transition-slow);
    }

    .pac-team-panel.expanded .pac-history-content {
      opacity: 1;
    }

    .pac-history-disclaimer {
      padding: var(--pac-space-sm);
      margin-bottom: var(--pac-space-sm);
      background: rgba(234, 179, 8, 0.1);
      border: 1px solid rgba(234, 179, 8, 0.3);
      border-radius: var(--pac-radius-sm);
      font-size: var(--pac-font-xs);
      color: var(--pac-accent-yellow);
    }

    .pac-history-entry {
      padding: var(--pac-space-sm);
      margin-bottom: var(--pac-space-sm);
      background: var(--pac-bg-glass);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-sm);

      animation: fadeSlideIn var(--pac-transition-normal) ease-out;
    }

    .pac-history-stats {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--pac-space-xs);
    }

    .pac-history-stat {
      font-size: var(--pac-font-xs);
      color: var(--pac-text-secondary);
    }

    .pac-history-stat-value {
      font-weight: 600;
      color: var(--pac-text-primary);
    }

    .pac-luck-gauge {
      height: calc(0.8vmin * var(--pac-scale));
      background: var(--pac-bg-tertiary);
      border-radius: var(--pac-radius-sm);
      overflow: hidden;
      position: relative;
    }

    .pac-luck-gauge-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--pac-accent-red), var(--pac-accent-yellow), var(--pac-accent-green));
      transition: width var(--pac-transition-normal);
    }

    .pac-luck-gauge-marker {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: calc(0.4vmin * var(--pac-scale));
      height: calc(1.2vmin * var(--pac-scale));
      background: white;
      border-radius: var(--pac-radius-sm);
    }

    /* ═══════════════════════════════════════════════════════════════════════
       DETECTION PANEL
       ═══════════════════════════════════════════════════════════════════════ */
    .pac-detection-panel {
      margin-top: var(--pac-space-md);
      padding: var(--pac-space-md);
      background: var(--pac-bg-glass);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-sm);

      opacity: 0;
      max-height: 0;
      overflow: hidden;
      transition: opacity var(--pac-transition-normal), max-height var(--pac-transition-slide);
    }

    .pac-detection-panel[style*="display: block"],
    .pac-detection-panel:not([style*="display: none"]) {
      opacity: 1;
      max-height: calc(40vmin * var(--pac-scale));
    }

    /* ═══════════════════════════════════════════════════════════════════════
       REFRESH BLOCKER
       ═══════════════════════════════════════════════════════════════════════ */
    #pac-refresh-blocker {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);

      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      z-index: 99999999;

      opacity: 0;
      transition: opacity var(--pac-transition-normal);
    }

    #pac-refresh-blocker.visible {
      display: flex;
      opacity: 1;
    }

    .blocker-title {
      font-size: var(--pac-font-xl);
      font-weight: 700;
      color: var(--pac-accent-green);
      margin-bottom: var(--pac-space-lg);
      animation: blockerPulse 1s ease-in-out infinite;
    }

    @keyframes blockerPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .blocker-pokemon {
      font-size: calc(4vmin * var(--pac-scale));
      font-weight: 700;
      color: var(--pac-text-primary);
      text-shadow: 0 0 calc(2vmin * var(--pac-scale)) var(--pac-accent-green);
    }

    .blocker-dismiss {
      position: absolute;
      top: var(--pac-space-lg);
      right: var(--pac-space-lg);

      width: calc(4vmin * var(--pac-scale));
      height: calc(4vmin * var(--pac-scale));

      background: transparent;
      border: 2px solid var(--pac-text-muted);
      border-radius: 50%;

      color: var(--pac-text-muted);
      font-size: var(--pac-font-xl);
      cursor: pointer;

      transition: all var(--pac-transition-fast);
    }

    .blocker-dismiss:hover {
      border-color: var(--pac-accent-red);
      color: var(--pac-accent-red);
    }

    /* ═══════════════════════════════════════════════════════════════════════
       NOTIFICATIONS
       ═══════════════════════════════════════════════════════════════════════ */
    .pac-notification {
      position: fixed;
      bottom: var(--pac-space-lg);
      right: var(--pac-space-lg);

      padding: var(--pac-space-md) var(--pac-space-lg);
      background: var(--pac-bg-primary);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-md);
      box-shadow: var(--pac-shadow-lg);

      font-size: var(--pac-font-sm);
      color: var(--pac-text-primary);

      z-index: 10000000;

      opacity: 0;
      transform: translateY(calc(2vmin * var(--pac-scale)));
      transition: opacity var(--pac-transition-normal), transform var(--pac-transition-normal);
    }

    .pac-notification.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .pac-notification.success {
      border-color: var(--pac-accent-green);
    }

    .pac-notification.error {
      border-color: var(--pac-accent-red);
    }

    .pac-notification.warning {
      border-color: var(--pac-accent-yellow);
    }

    /* ═══════════════════════════════════════════════════════════════════════
       HELP / EULA OVERLAYS
       ═══════════════════════════════════════════════════════════════════════ */
    .pac-help-overlay,
    #pac-eula-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);

      display: flex;
      align-items: center;
      justify-content: center;

      z-index: 2147483647;

      opacity: 0;
      transition: opacity var(--pac-transition-normal);
    }

    .pac-help-overlay.visible,
    #pac-eula-overlay {
      opacity: 1;
    }

    .pac-help-modal,
    #pac-eula-modal {
      width: calc(50vmin * var(--pac-scale));
      max-height: 80vh;

      background: var(--pac-bg-primary);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-lg);
      box-shadow: var(--pac-shadow-lg);

      overflow: hidden;
      display: flex;
      flex-direction: column;

      transform: scale(0.9);
      transition: transform var(--pac-transition-normal);
    }

    .pac-help-overlay.visible .pac-help-modal,
    #pac-eula-modal {
      transform: scale(1);
    }

    #pac-eula-modal {
      padding: var(--pac-space-xl);
      overflow-y: auto;
    }

    .pac-eula-title {
      font-size: var(--pac-font-xl);
      font-weight: 600;
      color: var(--pac-accent-blue);
      text-align: center;
      margin-bottom: var(--pac-space-lg);
    }

    .pac-eula-content {
      font-size: var(--pac-font-sm);
      color: var(--pac-text-secondary);
      line-height: 1.6;
      margin-bottom: var(--pac-space-lg);
    }

    .pac-eula-section {
      margin-bottom: var(--pac-space-md);
    }

    .pac-eula-section-title {
      font-size: var(--pac-font-md);
      font-weight: 600;
      color: var(--pac-accent-blue);
      margin-bottom: var(--pac-space-sm);
    }

    .pac-eula-highlight {
      padding: var(--pac-space-md);
      background: rgba(34, 197, 94, 0.1);
      border-left: 3px solid var(--pac-accent-green);
      border-radius: var(--pac-radius-sm);
      margin: var(--pac-space-md) 0;
    }

    .pac-eula-warning {
      padding: var(--pac-space-md);
      background: rgba(249, 115, 22, 0.1);
      border-left: 3px solid var(--pac-accent-orange);
      border-radius: var(--pac-radius-sm);
      margin: var(--pac-space-md) 0;
    }

    .pac-eula-checkboxes {
      margin: var(--pac-space-lg) 0;
    }

    .pac-eula-checkbox-row {
      display: flex;
      align-items: flex-start;
      gap: var(--pac-space-md);
      padding: var(--pac-space-md);
      background: var(--pac-bg-glass);
      border-radius: var(--pac-radius-sm);
      margin-bottom: var(--pac-space-sm);
      cursor: pointer;
      transition: background var(--pac-transition-fast);
    }

    .pac-eula-checkbox-row:hover {
      background: var(--pac-bg-glass-hover);
    }

    .pac-eula-custom-checkbox {
      width: calc(2.4vmin * var(--pac-scale));
      height: calc(2.4vmin * var(--pac-scale));
      min-width: calc(2.4vmin * var(--pac-scale));
      background: var(--pac-bg-secondary);
      border: 2px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--pac-transition-fast);
    }

    .pac-eula-checkbox-row:has(input:checked) .pac-eula-custom-checkbox {
      background: var(--pac-accent-green);
      border-color: var(--pac-accent-green);
    }

    .pac-eula-checkbox-row:has(input:checked) .pac-eula-custom-checkbox::after {
      content: '✓';
      color: white;
      font-weight: bold;
    }

    .pac-eula-checkbox-row input {
      display: none;
    }

    .pac-eula-checkbox-label {
      flex: 1;
      font-size: var(--pac-font-sm);
      color: var(--pac-text-secondary);
      line-height: 1.5;
    }

    .pac-eula-button {
      width: 100%;
      padding: var(--pac-space-md);
      background: linear-gradient(135deg, var(--pac-accent-green), #16a34a);
      border: none;
      border-radius: var(--pac-radius-md);
      color: white;
      font-size: var(--pac-font-md);
      font-weight: 600;
      cursor: pointer;
      transition: all var(--pac-transition-fast);
    }

    .pac-eula-button:disabled {
      background: var(--pac-bg-tertiary);
      color: var(--pac-text-muted);
      cursor: not-allowed;
    }

    .pac-eula-button:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: var(--pac-shadow-md);
    }

    /* ═══════════════════════════════════════════════════════════════════════
       UTILITY CLASSES
       ═══════════════════════════════════════════════════════════════════════ */
    .hidden {
      display: none !important;
    }

    .pac-fade-in {
      animation: fadeIn var(--pac-transition-normal) ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .pac-slide-in {
      animation: slideIn var(--pac-transition-slide) ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(calc(-2vmin * var(--pac-scale)));
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    /* Rarity Badge Colors */
    .rarity-common { background: var(--pac-rarity-common); color: #1a1a2e; }
    .rarity-uncommon { background: var(--pac-rarity-uncommon); color: #1a1a2e; }
    .rarity-rare { background: var(--pac-rarity-rare); color: white; }
    .rarity-epic { background: var(--pac-rarity-epic); color: white; }
    .rarity-ultra { background: var(--pac-rarity-ultra); color: white; }
    .rarity-legendary { background: var(--pac-rarity-legendary); color: #1a1a2e; }

    .pac-portal-warning {
      padding: var(--pac-space-sm);
      margin-top: var(--pac-space-sm);
      background: rgba(249, 115, 22, 0.15);
      border: 1px solid rgba(249, 115, 22, 0.3);
      border-radius: var(--pac-radius-sm);
      font-size: var(--pac-font-xs);
      color: var(--pac-accent-orange);
    }

    #pacRarityError {
      padding: var(--pac-space-sm);
      margin-top: var(--pac-space-sm);
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: var(--pac-radius-sm);
      font-size: var(--pac-font-xs);
      color: var(--pac-accent-red);
    }

    #pacRarityError.hidden {
      display: none;
    }

    /* ═══════════════════════════════════════════════════════════════════════
       SETTINGS PANEL
       ═══════════════════════════════════════════════════════════════════════ */
    .pac-settings-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      padding: var(--pac-space-sm);

      opacity: 0;
      transition: opacity var(--pac-transition-slow);
    }

    .pac-team-panel.expanded .pac-settings-content {
      opacity: 1;
      transition-delay: 100ms;
    }

    .pac-settings-section {
      background: var(--pac-bg-glass);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-md);
      padding: var(--pac-space-md);
      margin-bottom: var(--pac-space-md);
    }

    .pac-settings-section-title {
      font-size: var(--pac-font-sm);
      font-weight: 600;
      color: var(--pac-accent-blue);
      margin-bottom: var(--pac-space-md);
      padding-bottom: var(--pac-space-xs);
      border-bottom: 1px solid var(--pac-border-primary);
    }

    .pac-settings-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--pac-space-sm) 0;
    }

    .pac-settings-label {
      font-size: var(--pac-font-sm);
      color: var(--pac-text-secondary);
    }

    .pac-settings-color-input {
      width: calc(4vmin * var(--pac-scale));
      height: calc(3vmin * var(--pac-scale));
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-sm);
      cursor: pointer;
      background: transparent;
      padding: 0;
    }

    .pac-settings-color-input::-webkit-color-swatch-wrapper {
      padding: 2px;
    }

    .pac-settings-color-input::-webkit-color-swatch {
      border: none;
      border-radius: var(--pac-radius-sm);
    }

    .pac-settings-slider-row {
      display: flex;
      align-items: center;
      gap: var(--pac-space-md);
      width: 100%;
    }

    .pac-settings-slider {
      flex: 1;
      height: calc(0.6vmin * var(--pac-scale));
      background: var(--pac-bg-tertiary);
      border-radius: var(--pac-radius-sm);
      outline: none;
      -webkit-appearance: none;
      cursor: pointer;
    }

    .pac-settings-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: calc(1.6vmin * var(--pac-scale));
      height: calc(1.6vmin * var(--pac-scale));
      background: var(--pac-accent-blue);
      border-radius: 50%;
      cursor: pointer;
      transition: transform var(--pac-transition-fast);
    }

    .pac-settings-slider::-webkit-slider-thumb:hover {
      transform: scale(1.2);
    }

    .pac-settings-value {
      font-size: var(--pac-font-sm);
      color: var(--pac-accent-cyan);
      min-width: calc(6vmin * var(--pac-scale));
      text-align: right;
    }

    .pac-settings-switch {
      position: relative;
      width: calc(4.8vmin * var(--pac-scale));
      height: calc(2.4vmin * var(--pac-scale));
    }

    .pac-settings-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .pac-settings-switch-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--pac-bg-tertiary);
      border: 1px solid var(--pac-border-primary);
      border-radius: calc(1.2vmin * var(--pac-scale));
      transition: all var(--pac-transition-fast);
    }

    .pac-settings-switch-slider::before {
      position: absolute;
      content: "";
      height: calc(1.8vmin * var(--pac-scale));
      width: calc(1.8vmin * var(--pac-scale));
      left: calc(0.2vmin * var(--pac-scale));
      bottom: calc(0.2vmin * var(--pac-scale));
      background: var(--pac-text-muted);
      border-radius: 50%;
      transition: all var(--pac-transition-fast);
    }

    .pac-settings-switch input:checked + .pac-settings-switch-slider {
      background: rgba(34, 197, 94, 0.2);
      border-color: var(--pac-accent-green);
    }

    .pac-settings-switch input:checked + .pac-settings-switch-slider::before {
      transform: translateX(calc(2.4vmin * var(--pac-scale)));
      background: var(--pac-accent-green);
    }

    .pac-settings-preview {
      padding: var(--pac-space-md);
      background: var(--pac-bg-secondary);
      border-radius: var(--pac-radius-sm);
      text-align: center;
    }

    .pac-settings-preview-text {
      font-size: var(--pac-font-md);
      color: var(--pac-text-primary);
      margin-bottom: var(--pac-space-sm);
    }

    .pac-settings-preview-flashes {
      display: flex;
      justify-content: center;
      gap: var(--pac-space-md);
    }

    .pac-settings-flash-preview {
      padding: var(--pac-space-xs) var(--pac-space-md);
      border-radius: var(--pac-radius-sm);
      font-size: var(--pac-font-sm);
      font-weight: 600;
    }

    .pac-settings-flash-preview.target {
      background: #fbbf24;
      color: #1a1a2e;
    }

    .pac-settings-flash-preview.team {
      background: #FF1493;
      color: white;
    }

    .pac-settings-btn {
      width: 100%;
      padding: var(--pac-space-sm) var(--pac-space-md);
      border-radius: var(--pac-radius-sm);
      font-size: var(--pac-font-sm);
      font-weight: 500;
      cursor: pointer;
      transition: all var(--pac-transition-fast);
    }

    .pac-settings-btn.reset {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: var(--pac-accent-red);
    }

    .pac-settings-btn.reset:hover {
      background: rgba(239, 68, 68, 0.25);
    }

    /* ═══════════════════════════════════════════════════════════════════════
       ANALYTICS TABS
       ═══════════════════════════════════════════════════════════════════════ */
    .pac-analytics-tabs {
      display: flex;
      gap: var(--pac-space-xs);
      padding: var(--pac-space-sm);
      border-bottom: 1px solid var(--pac-border-primary);
      flex-shrink: 0;
    }

    .pac-analytics-tab {
      flex: 1;
      padding: var(--pac-space-sm);
      background: var(--pac-bg-tertiary);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-sm);
      color: var(--pac-text-secondary);
      font-size: var(--pac-font-xs);
      font-weight: 500;
      cursor: pointer;
      transition: all var(--pac-transition-fast);
    }

    .pac-analytics-tab:hover {
      border-color: var(--pac-border-accent);
      color: var(--pac-text-primary);
    }

    .pac-analytics-tab.active {
      background: rgba(59, 130, 246, 0.15);
      border-color: var(--pac-accent-blue);
      color: var(--pac-accent-blue);
    }

    .pac-analytics-content {
      display: none;
      flex: 1;
      flex-direction: column;
      overflow-y: auto;
      padding: var(--pac-space-sm);
    }

    .pac-analytics-content.active {
      display: flex;
    }

    .pac-analytics-disclaimer,
    .pac-fishing-disclaimer {
      padding: var(--pac-space-sm);
      margin-bottom: var(--pac-space-md);
      background: rgba(234, 179, 8, 0.1);
      border: 1px solid rgba(234, 179, 8, 0.3);
      border-radius: var(--pac-radius-sm);
      font-size: var(--pac-font-xs);
      color: var(--pac-accent-yellow);
    }

    .pac-analytics-panel {
      flex: 1;
      overflow-y: auto;
    }

    .pac-analytics-section {
      background: var(--pac-bg-glass);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-md);
      padding: var(--pac-space-md);
      margin-bottom: var(--pac-space-md);
    }

    .pac-analytics-title {
      font-size: var(--pac-font-sm);
      font-weight: 600;
      color: var(--pac-accent-blue);
      margin-bottom: var(--pac-space-sm);
    }

    .pac-luck-gauge {
      display: flex;
      align-items: center;
      gap: var(--pac-space-md);
    }

    .pac-luck-score {
      font-size: var(--pac-font-xl);
      font-weight: 700;
      min-width: calc(6vmin * var(--pac-scale));
      text-align: center;
    }

    .pac-luck-score.lucky { color: var(--pac-accent-green); }
    .pac-luck-score.unlucky { color: var(--pac-accent-red); }
    .pac-luck-score.neutral { color: var(--pac-text-muted); }

    .pac-luck-gauge-bar {
      height: calc(1vmin * var(--pac-scale));
      background: linear-gradient(90deg, var(--pac-accent-red), var(--pac-accent-yellow), var(--pac-accent-green));
      border-radius: var(--pac-radius-sm);
      position: relative;
    }

    .pac-luck-gauge-labels {
      display: flex;
      justify-content: space-between;
      font-size: var(--pac-font-xs);
      color: var(--pac-text-muted);
      margin-top: var(--pac-space-xs);
    }

    .pac-rarity-charts {
      display: flex;
      flex-direction: column;
      gap: var(--pac-space-sm);
    }

    .pac-level-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--pac-space-sm);
    }

    .pac-top-pokemon-grid {
      display: flex;
      flex-wrap: wrap;
      gap: var(--pac-space-sm);
    }

    .pac-narrative {
      font-size: var(--pac-font-sm);
      color: var(--pac-text-secondary);
      line-height: 1.6;
    }

    .pac-narrative p {
      margin-bottom: var(--pac-space-sm);
    }

    /* ═══════════════════════════════════════════════════════════════════════
       HISTORY PANEL
       ═══════════════════════════════════════════════════════════════════════ */
    .pac-history-players {
      flex: 1;
      overflow-y: auto;
    }

    .pac-history-empty {
      text-align: center;
      padding: var(--pac-space-xl);
      color: var(--pac-text-muted);
      font-size: var(--pac-font-sm);
    }

    /* ═══════════════════════════════════════════════════════════════════════
       FISHING PANEL
       ═══════════════════════════════════════════════════════════════════════ */
    .pac-fishing-panel {
      flex: 1;
      overflow-y: auto;
    }

    .pac-fishing-section {
      background: var(--pac-bg-glass);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-md);
      padding: var(--pac-space-md);
      margin-bottom: var(--pac-space-md);
    }

    .pac-fishing-title {
      font-size: var(--pac-font-sm);
      font-weight: 600;
      color: var(--pac-accent-blue);
      margin-bottom: var(--pac-space-sm);
    }

    .pac-fishing-rod-select {
      display: flex;
      gap: var(--pac-space-xs);
      margin-bottom: var(--pac-space-sm);
    }

    .pac-rod-btn {
      flex: 1;
      padding: var(--pac-space-sm);
      background: var(--pac-bg-tertiary);
      border: 1px solid var(--pac-border-primary);
      border-radius: var(--pac-radius-sm);
      color: var(--pac-text-secondary);
      font-size: var(--pac-font-xs);
      cursor: pointer;
      transition: all var(--pac-transition-fast);
    }

    .pac-rod-btn:hover {
      border-color: var(--pac-border-accent);
      color: var(--pac-text-primary);
    }

    .pac-rod-btn.active {
      background: rgba(6, 182, 212, 0.15);
      border-color: var(--pac-accent-cyan);
      color: var(--pac-accent-cyan);
    }

    .pac-fishing-rod-info {
      display: flex;
      flex-direction: column;
      gap: var(--pac-space-xs);
      font-size: var(--pac-font-xs);
      color: var(--pac-text-muted);
    }

    .pac-rod-synergy {
      padding: var(--pac-space-xs);
      background: var(--pac-bg-glass);
      border-radius: var(--pac-radius-sm);
    }

    .pac-fishing-odds {
      padding: var(--pac-space-sm);
      background: var(--pac-bg-glass);
      border-radius: var(--pac-radius-sm);
    }

    .pac-fishing-no-rod {
      text-align: center;
      color: var(--pac-text-muted);
      font-size: var(--pac-font-sm);
      padding: var(--pac-space-md);
    }

    .pac-fishing-toggle-row {
      margin-bottom: var(--pac-space-sm);
    }

    .pac-fishing-checkbox {
      display: flex;
      align-items: center;
      gap: var(--pac-space-sm);
      font-size: var(--pac-font-sm);
      color: var(--pac-text-secondary);
      cursor: pointer;
    }

    .pac-fishing-checkbox input {
      accent-color: var(--pac-accent-cyan);
    }

    .pac-fishing-pool {
      display: flex;
      flex-wrap: wrap;
      gap: var(--pac-space-xs);
    }

    /* ═══════════════════════════════════════════════════════════════════════
       INTEL PANEL
       ═══════════════════════════════════════════════════════════════════════ */
    .pac-intel-players {
      flex: 1;
      overflow-y: auto;
      padding: var(--pac-space-sm);
    }

    .pac-intel-empty {
      text-align: center;
      padding: var(--pac-space-xl);
      color: var(--pac-text-muted);
      font-size: var(--pac-font-sm);
    }

    /* ═══════════════════════════════════════════════════════════════════════
       RESPONSIVE ADJUSTMENTS
       ═══════════════════════════════════════════════════════════════════════ */
    @media (max-height: 600px) {
      :root {
        --pac-scale: 0.85;
      }
    }

    @media (max-width: 1200px) {
      :root {
        --pac-scale: 0.9;
      }
    }
  `;

  // ═══════════════════════════════════════════════════════════════════════════
  // STYLE INJECTION
  // ═══════════════════════════════════════════════════════════════════════════

  PAC.UI.injectStyles = function() {
    if (document.getElementById('pac-calc-styles')) {
      return;
    }

    var style = document.createElement('style');
    style.id = 'pac-calc-styles';
    style.textContent = PAC.UI.CSS;
    document.head.appendChild(style);

    if (PAC.DEBUG_MODE) {
      console.log('PAC UI: Styles injected (v2.0 redesign)');
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // THEME CUSTOMIZATION API
  // ═══════════════════════════════════════════════════════════════════════════

  PAC.UI.setTheme = function(theme) {
    var root = document.documentElement;

    if (theme === 'dark') {
      root.style.setProperty('--pac-bg-primary', 'rgba(15, 23, 42, 0.95)');
      root.style.setProperty('--pac-bg-secondary', 'rgba(30, 41, 59, 0.9)');
      root.style.setProperty('--pac-text-primary', '#f1f5f9');
    } else if (theme === 'light') {
      root.style.setProperty('--pac-bg-primary', 'rgba(248, 250, 252, 0.95)');
      root.style.setProperty('--pac-bg-secondary', 'rgba(241, 245, 249, 0.9)');
      root.style.setProperty('--pac-text-primary', '#1e293b');
    }

    if (PAC.DEBUG_MODE) {
      console.log('PAC UI: Theme set to', theme);
    }
  };

  PAC.UI.setScale = function(scale) {
    document.documentElement.style.setProperty('--pac-scale', scale);

    if (PAC.DEBUG_MODE) {
      console.log('PAC UI: Scale set to', scale);
    }
  };

  PAC.UI.setAccentColor = function(color) {
    document.documentElement.style.setProperty('--pac-accent-blue', color);

    if (PAC.DEBUG_MODE) {
      console.log('PAC UI: Accent color set to', color);
    }
  };

  if (PAC.DEBUG_MODE) {
    console.log('PAC UI: Styles module loaded (v2.0 redesign)');
  }
})();
