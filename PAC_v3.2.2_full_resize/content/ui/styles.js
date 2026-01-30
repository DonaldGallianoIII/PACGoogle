/**
 * PAC Live Data Calculator - Styles
 *
 * All CSS styles for the calculator overlay.
 * Separated for easy modification and viewport unit conversion.
 */
(function() {
  'use strict';

  // Store CSS as a string for injection
  PAC.UI.CSS = `

      /* Viewport Scaling System
       * Base: 1vmin ≈ 10.8px at 1080p
       * Scale factor adjusts all sizes proportionally
       */
      :root {
        --pac-scale: 1; /* Adjust this to scale entire UI (0.8 = smaller, 1.2 = larger) */
        --pac-base: calc(1vmin * var(--pac-scale));
      }

      #pac-calc-overlay {
        position: fixed;
        top: 1.9vmin;
        right: 1.9vmin;
        width: 35.2vmin;
        max-height: calc(100vh - 3.7vmin);
        background: rgba(26, 26, 46, 0.96);
        border: 2px solid #0f3460;
        border-radius: 1.1vmin;
        box-shadow: 0 0.7vmin 3.0vmin rgba(0,0,0,0.4);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #e9e9e9;
        z-index: 999999;
        user-select: none;
        overflow: visible;
        display: flex;
        flex-direction: column;
        min-height: 18.5vmin;
        min-width: 25.9vmin;
        max-width: 55.6vmin;
      }
      
      /* Hide side panels when width is not default */
      #pac-calc-overlay.width-resized .pac-team-panel,
      #pac-calc-overlay.width-resized .pac-team-toggle {
        display: none !important;
      }
      
      /* Hide scrollbar */
      #pac-calc-body {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      #pac-calc-body::-webkit-scrollbar {
        display: none;
      }
      
      /* ═══ RESIZE HANDLES ═══ */
      .pac-resize-handle {
        position: absolute;
        z-index: 1000001;
        background: transparent !important;
        pointer-events: auto;
      }
      
      /* Corner handles */
      .pac-resize-nw { top: -0.6vmin; left: -0.6vmin; width: 1.5vmin; height: 1.5vmin; cursor: nw-resize; }
      .pac-resize-ne { top: -0.6vmin; right: -0.6vmin; width: 1.5vmin; height: 1.5vmin; cursor: ne-resize; }
      .pac-resize-sw { bottom: -0.6vmin; left: -0.6vmin; width: 1.5vmin; height: 1.5vmin; cursor: sw-resize; }
      .pac-resize-se { bottom: -0.6vmin; right: -0.6vmin; width: 1.5vmin; height: 1.5vmin; cursor: se-resize; }
      
      /* Edge handles */
      .pac-resize-n { top: -0.6vmin; left: 1.9vmin; right: 1.9vmin; height: 1.1vmin; cursor: n-resize; }
      .pac-resize-s { bottom: -0.6vmin; left: 1.9vmin; right: 1.9vmin; height: 1.1vmin; cursor: s-resize; }
      .pac-resize-w { left: -0.6vmin; top: 1.9vmin; bottom: 1.9vmin; width: 1.1vmin; cursor: w-resize; }
      .pac-resize-e { right: -0.6vmin; top: 1.9vmin; bottom: 1.9vmin; width: 1.1vmin; cursor: e-resize; }
      
      /* Hide handles when minimized */
      #pac-calc-overlay.minimized .pac-resize-handle {
        display: none !important;
      }
      
      #pac-calc-header {
        background: linear-gradient(90deg, #0f3460 0%, #533483 100%);
        padding: 1.1vmin 1.5vmin;
        border-radius: 0.9vmin 0.9vmin 0 0;
        cursor: move;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        position: relative;
        z-index: 1;  /* Above side panels */
      }
      
      #pac-calc-title {
        font-weight: 600;
        font-size: clamp(11px, 1.5vmin, 21px);
        display: flex;
        align-items: center;
        gap: 0.7vmin;
      }
      
      .pac-status-dot {
        width: 0.9vmin;
        height: 0.9vmin;
        border-radius: 50%;
        background: #666;
        box-shadow: 0 0 0.7vmin rgba(255,255,255,0.3);
        transition: all 0.3s ease;
      }
      
      .pac-status-dot.connected {
        background: #4caf50;
        box-shadow: 0 0 1.1vmin rgba(76,175,80,0.6);
      }
      
      #pac-calc-controls {
        display: flex;
        gap: 0.7vmin;
      }
      
      .pac-ctrl-btn {
        background: rgba(255,255,255,0.1);
        border: none;
        color: #fff;
        width: 2.6vmin;
        height: 2.6vmin;
        border-radius: 0.6vmin;
        cursor: pointer;
        font-size: clamp(12px, 1.7vmin, 23px);
        line-height: 1;
        transition: all 0.2s;
      }
      
      .pac-ctrl-btn:hover {
        background: rgba(255,255,255,0.2);
        transform: scale(1.1);
      }
      
      /* Experimental mode button */
      #pacExpBtn.pending {
        background: rgba(251, 191, 36, 0.3);
        color: #fbbf24;
        animation: expPulse 1s ease-in-out infinite;
      }
      
      #pacExpBtn.active {
        background: rgba(251, 191, 36, 0.8);
        color: #1e293b;
        font-weight: 700;
      }
      
      @keyframes expPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      /* Synergy Bar */
      .pac-synergy-bar {
        display: none;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        padding: 0.7vmin;
        background: rgba(0,0,0,0.3);
        border-bottom: 1px solid rgba(255,255,255,0.1);
        gap: 0.6vmin;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      
      .pac-synergy-bar.visible {
        display: flex;
      }
      
      .pac-synergy-bar::-webkit-scrollbar {
        display: none;
      }
      
      .pac-synergy-btn {
        flex-shrink: 0;
        padding: 0.37vmin 0.9vmin;
        border: 1px solid rgba(255,255,255,0.3);
        border-radius: 1.1vmin;
        font-size: clamp(9px, 1.0vmin, 14px);
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s;
        text-transform: capitalize;
      }
      
      .pac-synergy-btn:hover {
        filter: brightness(1.3);
        transform: scale(1.05);
      }
      
      .pac-synergy-btn:active {
        transform: scale(0.95);
      }
      
      /* Synergy type colors */
      .pac-synergy-btn[data-synergy="water"] { background: #6390F0; color: #fff; }
      .pac-synergy-btn[data-synergy="fire"] { background: #EE8130; color: #fff; }
      .pac-synergy-btn[data-synergy="grass"] { background: #7AC74C; color: #fff; }
      .pac-synergy-btn[data-synergy="electric"] { background: #F7D02C; color: #333; }
      .pac-synergy-btn[data-synergy="ice"] { background: #96D9D6; color: #333; }
      .pac-synergy-btn[data-synergy="fighting"] { background: #C22E28; color: #fff; }
      .pac-synergy-btn[data-synergy="poison"] { background: #A33EA1; color: #fff; }
      .pac-synergy-btn[data-synergy="ground"] { background: #E2BF65; color: #333; }
      .pac-synergy-btn[data-synergy="flying"] { background: #A98FF3; color: #fff; }
      .pac-synergy-btn[data-synergy="psychic"] { background: #F95587; color: #fff; }
      .pac-synergy-btn[data-synergy="bug"] { background: #A6B91A; color: #fff; }
      .pac-synergy-btn[data-synergy="rock"] { background: #B6A136; color: #fff; }
      .pac-synergy-btn[data-synergy="ghost"] { background: #735797; color: #fff; }
      .pac-synergy-btn[data-synergy="dragon"] { background: #6F35FC; color: #fff; }
      .pac-synergy-btn[data-synergy="dark"] { background: #705746; color: #fff; }
      .pac-synergy-btn[data-synergy="steel"] { background: #B7B7CE; color: #333; }
      .pac-synergy-btn[data-synergy="fairy"] { background: #D685AD; color: #fff; }
      .pac-synergy-btn[data-synergy="normal"] { background: #A8A77A; color: #fff; }
      /* PAC-specific synergies */
      .pac-synergy-btn[data-synergy="monster"] { background: #8B4513; color: #fff; }
      .pac-synergy-btn[data-synergy="human"] { background: #DEB887; color: #333; }
      .pac-synergy-btn[data-synergy="aquatic"] { background: #1E90FF; color: #fff; }
      .pac-synergy-btn[data-synergy="artificial"] { background: #708090; color: #fff; }
      .pac-synergy-btn[data-synergy="wild"] { background: #228B22; color: #fff; }
      .pac-synergy-btn[data-synergy="fossil"] { background: #8B7355; color: #fff; }
      .pac-synergy-btn[data-synergy="baby"] { background: #FFB6C1; color: #333; }
      .pac-synergy-btn[data-synergy="mega"] { background: #FF4500; color: #fff; }
      .pac-synergy-btn[data-synergy="beast"] { background: #4B0082; color: #fff; }
      .pac-synergy-btn[data-synergy="ethereal"] { background: #9370DB; color: #fff; }
      .pac-synergy-btn[data-synergy="sound"] { background: #FF69B4; color: #fff; }
      .pac-synergy-btn[data-synergy="amorphous"] { background: #9932CC; color: #fff; }
      
      /* Mono-Type Panel */
      .pac-mono-panel {
        display: none;
        margin: 0.7vmin 0;
        background: rgba(0,0,0,0.3);
        border-radius: 0.6vmin;
        overflow: hidden;
      }
      .pac-mono-panel.visible {
        display: block;
      }
      .pac-mono-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.7vmin 1.1vmin;
        cursor: pointer;
        background: rgba(255,255,255,0.05);
        transition: background 0.2s;
      }
      .pac-mono-header:hover {
        background: rgba(255,255,255,0.1);
      }
      .pac-mono-header-title {
        display: flex;
        align-items: center;
        gap: 0.7vmin;
        font-weight: 600;
        font-size: clamp(9px, 1.1vmin, 15px);
      }
      .pac-mono-arrow {
        transition: transform 0.2s;
        font-size: clamp(9px, 0.9vmin, 12px);
      }
      .pac-mono-panel.expanded .pac-mono-arrow {
        transform: rotate(90deg);
      }
      .pac-mono-content {
        display: none;
        padding: 0.7vmin;
      }
      .pac-mono-panel.expanded .pac-mono-content {
        display: block;
      }
      .pac-mono-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.37vmin;
      }
      .pac-mono-btn {
        padding: 0.6vmin 0.37vmin;
        border: none;
        border-radius: 0.37vmin;
        cursor: pointer;
        font-size: clamp(9px, 0.8vmin, 11px);
        font-weight: 600;
        text-transform: uppercase;
        transition: all 0.15s;
        opacity: 0.7;
      }
      .pac-mono-btn:hover {
        opacity: 1;
        transform: scale(1.05);
      }
      .pac-mono-btn.selected {
        opacity: 1;
        box-shadow: 0 0 0 2px #fff, 0 0 0.7vmin rgba(255,255,255,0.5);
      }
      .pac-mono-status {
        text-align: center;
        font-size: clamp(9px, 0.9vmin, 12px);
        color: #888;
        padding: 0.37vmin;
        margin-top: 0.37vmin;
      }
      .pac-mono-status.active {
        color: #4caf50;
        font-weight: 600;
      }
      .pac-mono-clear {
        width: 100%;
        margin-top: 0.7vmin;
        padding: 0.6vmin;
        background: rgba(239, 68, 68, 0.3);
        border: 1px solid rgba(239, 68, 68, 0.5);
        border-radius: 0.37vmin;
        color: #fff;
        font-size: clamp(9px, 0.9vmin, 12px);
        cursor: pointer;
        transition: all 0.15s;
      }
      .pac-mono-clear:hover {
        background: rgba(239, 68, 68, 0.5);
      }
      
      /* Mono-type Spin Wheel */
      .pac-mono-wheel-section {
        display: flex;
        align-items: center;
        gap: 0.7vmin;
        margin-top: 0.9vmin;
        padding-top: 0.9vmin;
        border-top: 1px solid rgba(255,255,255,0.1);
      }
      .pac-mono-spin-btn {
        padding: 0.7vmin 1.5vmin;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 0.6vmin;
        color: #fff;
        font-size: clamp(9px, 1.0vmin, 14px);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .pac-mono-spin-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 0.37vmin 1.4vmin rgba(102, 126, 234, 0.4);
      }
      .pac-mono-spin-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }
      .pac-mono-wheel-display {
        flex: 1;
        height: 3.3vmin;
        background: rgba(0,0,0,0.4);
        border-radius: 0.6vmin;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
      }
      .pac-mono-wheel-type {
        font-size: clamp(9px, 1.1vmin, 15px);
        font-weight: 700;
        text-transform: uppercase;
        padding: 0.37vmin 1.1vmin;
        border-radius: 0.37vmin;
        transition: all 0.1s;
      }
      .pac-mono-wheel-type.spinning {
        animation: wheelPulse 0.15s ease-in-out infinite;
      }
      @keyframes wheelPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
      .pac-mono-wheel-label {
        font-size: clamp(9px, 0.9vmin, 12px);
        color: #888;
        text-align: center;
      }
      
      /* Mono-type blocker overlay on shop slots */
      .pac-mono-blocker {
        position: fixed;
        background: rgba(220, 38, 38, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: not-allowed;
        font-size: clamp(22px, 3.0vmin, 42px);
        color: #fff;
        text-shadow: 0 2px 0.37vmin rgba(0,0,0,0.8);
        pointer-events: all;
        border-radius: 0.7vmin;
      }
      
      /* Random Draft challenge styles */
      .pac-draft-blocker {
        position: fixed;
        background: rgba(220, 38, 38, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: not-allowed;
        font-size: clamp(24px, 3.3vmin, 46px);
        color: #fff;
        text-shadow: 0 2px 0.37vmin rgba(0,0,0,0.8);
        pointer-events: all;
        border-radius: 0.7vmin;
      }
      
      .pac-draft-spin-highlight {
        position: fixed;
        pointer-events: none;
        z-index: 9998;
        border-radius: 0.7vmin;
        border: 0.46vmin solid #fbbf24;
        background: rgba(251, 191, 36, 0.4);
        box-shadow: 
          0 0 2.8vmin #fbbf24,
          0 0 5.6vmin #fbbf24,
          inset 0 0 2.8vmin rgba(251, 191, 36, 0.3);
        transition: all 0.08s ease-out;
      }
      
      .pac-draft-chosen-highlight {
        position: fixed;
        pointer-events: none;
        z-index: 9997;
        border-radius: 0.7vmin;
        border: 0.46vmin solid #22c55e;
        background: rgba(34, 197, 94, 0.35);
        box-shadow: 
          0 0 2.3vmin #22c55e,
          0 0 4.6vmin #22c55e,
          inset 0 0 2.3vmin rgba(34, 197, 94, 0.25);
        animation: draftChosenPulse 1.5s ease-in-out infinite;
      }
      
      @keyframes draftChosenPulse {
        0%, 100% { 
          box-shadow: 0 0 2.3vmin #22c55e, 0 0 4.6vmin #22c55e, inset 0 0 2.3vmin rgba(34, 197, 94, 0.25);
          border-color: #22c55e;
        }
        50% { 
          box-shadow: 0 0 3.2vmin #4ade80, 0 0 6.5vmin #4ade80, inset 0 0 3.2vmin rgba(74, 222, 128, 0.35);
          border-color: #4ade80;
        }
      }
      
      /* Random Draft panel in experimental - always visible when mono panel is visible */
      .pac-draft-panel {
        display: none;
        margin: 0;
        padding: 0;
        border-top: 1px solid rgba(255,255,255,0.1);
      }
      
      .pac-mono-panel.visible .pac-draft-panel {
        display: block;
      }
      
      .pac-draft-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.7vmin 1.1vmin;
        background: rgba(255,255,255,0.05);
        transition: background 0.2s;
      }
      
      .pac-draft-header:hover {
        background: rgba(255,255,255,0.1);
      }
      
      .pac-draft-header-title {
        font-size: clamp(9px, 1.2vmin, 16px);
        font-weight: 600;
        color: #fbbf24;
      }
      
      .pac-draft-toggle {
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        border: none;
        color: #fff;
        padding: 0.6vmin 1.3vmin;
        border-radius: 0.37vmin;
        font-size: clamp(9px, 1.0vmin, 14px);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .pac-draft-toggle:hover {
        transform: scale(1.05);
        box-shadow: 0 2px 0.7vmin rgba(34, 197, 94, 0.4);
      }
      
      .pac-draft-toggle.active {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      }
      
      .pac-draft-toggle.active:hover {
        box-shadow: 0 2px 0.7vmin rgba(239, 68, 68, 0.4);
      }
      
      .pac-draft-status {
        margin-top: 0.7vmin;
        padding: 0.7vmin;
        background: rgba(34, 197, 94, 0.15);
        border-radius: 0.6vmin;
        font-size: clamp(9px, 1.0vmin, 14px);
        color: #86efac;
        text-align: center;
        display: none;
      }
      
      .pac-draft-status.active {
        display: block;
      }
      
      /* Copycat challenge styles */
      .pac-copycat-blocker {
        position: fixed;
        background: rgba(168, 85, 247, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: not-allowed;
        font-size: clamp(19px, 2.6vmin, 36px);
        color: #fff;
        text-shadow: 0 2px 0.37vmin rgba(0,0,0,0.8);
        pointer-events: all;
        border-radius: 0.7vmin;
        flex-direction: column;
        gap: 2px;
      }
      
      .pac-copycat-blocker-text {
        font-size: clamp(9px, 0.8vmin, 11px);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .pac-copycat-panel {
        display: none;
        border-top: 1px solid rgba(255,255,255,0.1);
      }
      
      .pac-mono-panel.visible .pac-copycat-panel {
        display: block;
      }
      
      .pac-copycat-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.7vmin 1.1vmin;
        background: rgba(255,255,255,0.05);
        transition: background 0.2s;
      }
      
      .pac-copycat-header:hover {
        background: rgba(255,255,255,0.1);
      }
      
      .pac-copycat-header-title {
        font-size: clamp(9px, 1.2vmin, 16px);
        font-weight: 600;
        color: #a855f7;
      }
      
      .pac-copycat-toggle {
        background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
        border: none;
        color: #fff;
        padding: 0.6vmin 1.3vmin;
        border-radius: 0.37vmin;
        font-size: clamp(9px, 1.0vmin, 14px);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .pac-copycat-toggle:hover {
        transform: scale(1.05);
        box-shadow: 0 2px 0.7vmin rgba(168, 85, 247, 0.4);
      }
      
      .pac-copycat-toggle.active {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      }
      
      .pac-copycat-toggle.active:hover {
        box-shadow: 0 2px 0.7vmin rgba(239, 68, 68, 0.4);
      }
      
      .pac-copycat-status {
        padding: 0.7vmin 1.1vmin;
        background: rgba(168, 85, 247, 0.15);
        font-size: clamp(9px, 1.0vmin, 14px);
        color: #c4b5fd;
        text-align: center;
        display: none;
      }
      
      .pac-copycat-status.active {
        display: block;
      }
      
      /* MLG Mode styles */
      .pac-mlg-panel {
        display: none;
        border-top: 1px solid rgba(255,255,255,0.1);
      }
      
      .pac-mono-panel.visible .pac-mlg-panel {
        display: block;
      }
      
      .pac-mlg-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.7vmin 1.1vmin;
        background: rgba(255,255,255,0.05);
        transition: background 0.2s;
      }
      
      .pac-mlg-header:hover {
        background: rgba(255,255,255,0.1);
      }
      
      .pac-mlg-header-title {
        font-size: clamp(9px, 1.2vmin, 16px);
        font-weight: 600;
        color: #00ff00;
        text-shadow: 0 0 0.9vmin #00ff00;
        animation: mlgGlow 0.5s ease-in-out infinite alternate;
      }
      
      @keyframes mlgGlow {
        from { text-shadow: 0 0 0.46vmin #00ff00, 0 0 0.9vmin #00ff00; }
        to { text-shadow: 0 0 0.9vmin #ff00ff, 0 0 1.9vmin #ff00ff, 0 0 2.8vmin #ff00ff; }
      }
      
      .pac-mlg-toggle {
        background: linear-gradient(135deg, #00ff00 0%, #ff00ff 50%, #00ffff 100%);
        border: none;
        color: #000;
        padding: 0.6vmin 1.3vmin;
        border-radius: 0.37vmin;
        font-size: clamp(9px, 1.0vmin, 14px);
        font-weight: 800;
        cursor: pointer;
        transition: all 0.2s;
        text-transform: uppercase;
      }
      
      .pac-mlg-toggle:hover {
        transform: scale(1.1) rotate(5deg);
        box-shadow: 0 0 1.9vmin #00ff00;
      }
      
      .pac-mlg-toggle.active {
        background: linear-gradient(135deg, #ff0000 0%, #ff6600 100%);
        animation: mlgButtonPulse 0.3s ease-in-out infinite;
      }
      
      @keyframes mlgButtonPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
      
      .pac-mlg-status {
        padding: 0.7vmin 1.1vmin;
        background: linear-gradient(90deg, rgba(0,255,0,0.2), rgba(255,0,255,0.2), rgba(0,255,255,0.2));
        font-size: clamp(9px, 1.0vmin, 14px);
        color: #00ff00;
        text-align: center;
        font-weight: bold;
        text-transform: uppercase;
        display: none;
      }
      
      .pac-mlg-status.active {
        display: block;
        animation: mlgRainbow 2s linear infinite;
      }
      
      @keyframes mlgRainbow {
        0% { color: #ff0000; }
        16% { color: #ff8800; }
        33% { color: #ffff00; }
        50% { color: #00ff00; }
        66% { color: #0088ff; }
        83% { color: #ff00ff; }
        100% { color: #ff0000; }
      }
      
      /* MLG Hitmarker overlay */
      .pac-mlg-hitmarker {
        position: fixed;
        width: 5.6vmin;
        height: 5.6vmin;
        pointer-events: none;
        z-index: 99999;
        animation: hitmarkerPop 0.3s ease-out forwards;
      }
      
      .pac-mlg-hitmarker::before,
      .pac-mlg-hitmarker::after {
        content: '';
        position: absolute;
        background: white;
        box-shadow: 0 0 0.9vmin #fff, 0 0 1.9vmin #fff;
      }
      
      .pac-mlg-hitmarker::before {
        width: 0.37vmin;
        height: 1.9vmin;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
      }
      
      .pac-mlg-hitmarker::after {
        width: 0.37vmin;
        height: 1.9vmin;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
      }
      
      @keyframes hitmarkerPop {
        0% { opacity: 1; transform: scale(0.5); }
        50% { opacity: 1; transform: scale(1.2); }
        100% { opacity: 0; transform: scale(1); }
      }
      
      /* MLG Text popup */
      .pac-mlg-text {
        position: fixed;
        font-family: 'Impact', 'Arial Black', sans-serif;
        font-size: clamp(33px, 4.4vmin, 61px);
        font-weight: bold;
        color: #fff;
        text-shadow: 
          -0.28vmin -0.28vmin 0 #000,
          0.28vmin -0.28vmin 0 #000,
          -0.28vmin 0.28vmin 0 #000,
          0.28vmin 0.28vmin 0 #000,
          0 0 1.9vmin #ff0000;
        pointer-events: none;
        z-index: 99999;
        animation: mlgTextPop 1s ease-out forwards;
        text-transform: uppercase;
        white-space: nowrap;
      }
      
      @keyframes mlgTextPop {
        0% { opacity: 0; transform: scale(0) rotate(-20deg); }
        20% { opacity: 1; transform: scale(1.3) rotate(10deg); }
        40% { transform: scale(1) rotate(-5deg); }
        100% { opacity: 0; transform: scale(1.5) translateY(-4.6vmin) rotate(5deg); }
      }
      
      /* MLG Screen shake */
      @keyframes mlgShake {
        0%, 100% { transform: translateX(0); }
        10% { transform: translateX(-0.9vmin) rotate(-1deg); }
        20% { transform: translateX(0.9vmin) rotate(1deg); }
        30% { transform: translateX(-0.9vmin) rotate(-1deg); }
        40% { transform: translateX(0.9vmin) rotate(1deg); }
        50% { transform: translateX(-0.46vmin); }
        60% { transform: translateX(0.46vmin); }
        70% { transform: translateX(-0.46vmin); }
        80% { transform: translateX(0.46vmin); }
        90% { transform: translateX(-2px); }
      }
      
      .pac-mlg-shake {
        animation: mlgShake 0.5s ease-in-out;
      }
      
      /* MLG Lens flare */
      .pac-mlg-lensflare {
        position: fixed;
        width: 18.5vmin;
        height: 18.5vmin;
        background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,0,0.5) 30%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 99998;
        animation: lensFlare 0.8s ease-out forwards;
      }
      
      @keyframes lensFlare {
        0% { opacity: 0; transform: scale(0.3); }
        30% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(1.5) translateX(9.3vmin); }
      }
      
      /* MLG Illuminati triangle */
      .pac-mlg-illuminati {
        position: fixed;
        width: 0;
        height: 0;
        border-left: 7.4vmin solid transparent;
        border-right: 7.4vmin solid transparent;
        border-bottom: 13.0vmin solid #00ff00;
        pointer-events: none;
        z-index: 99999;
        animation: illuminatiFly 2s ease-out forwards;
        filter: drop-shadow(0 0 2.8vmin #00ff00);
      }
      
      .pac-mlg-illuminati::after {
        content: '👁';
        position: absolute;
        top: 4.2vmin;
        left: -1.9vmin;
        font-size: clamp(27px, 3.7vmin, 51px);
      }
      
      @keyframes illuminatiFly {
        0% { opacity: 0; transform: scale(0) rotate(0deg) translate(0, 0); }
        20% { opacity: 1; transform: scale(1.5) rotate(180deg); }
        50% { transform: scale(1.2) rotate(360deg) translate(var(--fly-x, 9.3vmin), var(--fly-y, -9.3vmin)); }
        80% { opacity: 1; transform: scale(1) rotate(540deg) translate(calc(var(--fly-x, 9.3vmin) * 2), calc(var(--fly-y, -9.3vmin) * 2)); }
        100% { opacity: 0; transform: scale(0.5) rotate(720deg) translate(calc(var(--fly-x, 9.3vmin) * 3), calc(var(--fly-y, -9.3vmin) * 3)); }
      }
      
      /* MLG Doritos */
      .pac-mlg-dorito {
        position: fixed;
        font-size: clamp(167px, 22.2vmin, 311px);
        pointer-events: none;
        z-index: 99997;
        animation: doritoFall 3s ease-in forwards;
      }
      
      @keyframes doritoFall {
        0% { opacity: 1; transform: translateY(-18.5vmin) rotate(0deg); }
        100% { opacity: 0; transform: translateY(100vh) rotate(720deg); }
      }
      
      /* MLG Sample Text */
      .pac-mlg-sample {
        position: fixed;
        font-family: 'Comic Sans MS', cursive;
        font-size: clamp(16px, 2.2vmin, 30px);
        color: #ff00ff;
        text-shadow: 2px 2px 0 #000;
        pointer-events: none;
        z-index: 99996;
        animation: sampleTextBounce 2s ease-in-out forwards;
      }
      
      @keyframes sampleTextBounce {
        0%, 100% { opacity: 0; }
        20%, 80% { opacity: 1; }
        0% { transform: translateY(0); }
        25% { transform: translateY(-1.9vmin); }
        50% { transform: translateY(0); }
        75% { transform: translateY(-0.9vmin); }
        100% { transform: translateY(0); }
      }
      
      /* MLG 360 spinning text */
      .pac-mlg-360 {
        position: fixed;
        font-family: 'Impact', 'Arial Black', sans-serif;
        font-size: clamp(50px, 6.7vmin, 94px);
        font-weight: bold;
        color: #ff0000;
        text-shadow: 
          -0.37vmin -0.37vmin 0 #000,
          0.37vmin -0.37vmin 0 #000,
          -0.37vmin 0.37vmin 0 #000,
          0.37vmin 0.37vmin 0 #000,
          0 0 2.8vmin #ff0000;
        pointer-events: none;
        z-index: 99999;
        animation: spin360 0.5s linear infinite, mlg360Pop 2s ease-out forwards;
      }
      
      @keyframes spin360 {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes mlg360Pop {
        0% { opacity: 0; font-size: clamp(14px, 1.9vmin, 26px); }
        20% { opacity: 1; font-size: clamp(55px, 7.4vmin, 103px); }
        80% { opacity: 1; }
        100% { opacity: 0; font-size: clamp(83px, 11.1vmin, 155px); }
      }
      
      /* MLG Airhorn visual */
      .pac-mlg-airhorn {
        position: fixed;
        font-size: clamp(55px, 7.4vmin, 103px);
        pointer-events: none;
        z-index: 99999;
        animation: airhornBlast 0.8s ease-out forwards;
        filter: drop-shadow(0 0 1.9vmin #ffff00);
      }
      
      @keyframes airhornBlast {
        0% { opacity: 0; transform: scale(0) rotate(-30deg); }
        30% { opacity: 1; transform: scale(1.5) rotate(15deg); }
        50% { transform: scale(1.2) rotate(-10deg); }
        70% { transform: scale(1.3) rotate(5deg); }
        100% { opacity: 0; transform: scale(2) rotate(0deg); }
      }
      
      /* MLG Weed leaf */
      .pac-mlg-weed {
        position: fixed;
        font-size: clamp(34px, 4.6vmin, 64px);
        pointer-events: none;
        z-index: 99997;
        animation: weedFloat 3s ease-out forwards;
        filter: drop-shadow(0 0 0.9vmin #00ff00);
      }
      
      @keyframes weedFloat {
        0% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
        50% { opacity: 1; transform: translateY(-9.3vmin) rotate(180deg) scale(1.2); }
        100% { opacity: 0; transform: translateY(-18.5vmin) rotate(360deg) scale(0.5); }
      }
      
      /* MLG Snoop overlay */
      .pac-mlg-snoop {
        position: fixed;
        font-size: clamp(70px, 9.3vmin, 130px);
        pointer-events: none;
        z-index: 99996;
        animation: snoopDance 2s ease-in-out forwards;
      }
      
      @keyframes snoopDance {
        0%, 100% { opacity: 0; }
        20%, 80% { opacity: 1; }
        0%, 20%, 40%, 60%, 80%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(1.9vmin); }
      }

      /* Target highlighter overlays - click-through */
      .pac-target-highlighter {
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        border-radius: 0.7vmin;
        border: 0.37vmin solid var(--pac-target-color, #fbbf24);
        background: var(--pac-target-color-bg, rgba(251, 191, 36, 0.45));
        box-shadow: 
          0 0 1.9vmin var(--pac-target-color, #fbbf24),
          inset 0 0 2.8vmin var(--pac-target-color-bg, rgba(251, 191, 36, 0.35));
        animation: targetHighlightPulse 1s ease-in-out infinite;
      }
      
      .pac-team-highlighter {
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        border-radius: 0.7vmin;
        border: 0.37vmin solid var(--pac-team-color, #FF1493);
        background: var(--pac-team-color-bg, rgba(255, 20, 147, 0.45));
        box-shadow: 
          0 0 1.9vmin var(--pac-team-color, #FF1493),
          inset 0 0 2.8vmin var(--pac-team-color-bg, rgba(255, 20, 147, 0.35));
        animation: teamHighlightPulse 1s ease-in-out infinite;
      }
      
      /* Both target and team - show both colors */
      .pac-target-highlighter.also-team {
        border: 0.37vmin solid;
        border-image: linear-gradient(45deg, var(--pac-target-color, #fbbf24), var(--pac-team-color, #FF1493)) 1;
        box-shadow: 
          0 0 1.9vmin var(--pac-target-color, #fbbf24),
          0 0 1.9vmin var(--pac-team-color, #FF1493);
      }
      
      @keyframes targetHighlightPulse {
        0%, 100% { 
          opacity: 0.85;
          transform: scale(1);
        }
        50% { 
          opacity: 1;
          transform: scale(1.02);
        }
      }
      
      @keyframes teamHighlightPulse {
        0%, 100% { 
          opacity: 0.85;
          transform: scale(1);
        }
        50% { 
          opacity: 1;
          transform: scale(1.02);
        }
      }
      
      /* Epilepsy mode - no animation */
      .pac-target-highlighter.no-animate,
      .pac-team-highlighter.no-animate {
        animation: none !important;
        opacity: 0.95;
      }
      
      #pac-calc-body {
        padding: 1.5vmin;
        max-height: 70vh;
        overflow-y: auto;
      }
      
      #pac-calc-body.minimized {
        display: none;
      }
      
      /* Hide side panel arrows when minimized */
      #pac-calc-overlay.minimized .pac-team-toggle,
      #pac-calc-overlay.minimized .pac-current-toggle {
        display: none !important;
      }
      
      #pac-calc-overlay.minimized .pac-team-arrow {
        display: none !important;
      }
      
      .pac-section {
        margin-bottom: 1.5vmin;
        background: rgba(255,255,255,0.03);
        border-radius: 0.7vmin;
        padding: 1.1vmin;
        border: 1px solid rgba(255,255,255,0.05);
        position: relative;
        z-index: 1;  /* Above side panels */
      }
      
      .pac-section-title {
        font-size: clamp(9px, 1.2vmin, 16px);
        font-weight: 600;
        margin-bottom: 0.9vmin;
        color: #64b5f6;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .pac-row {
        display: flex;
        gap: 0.7vmin;
        margin-bottom: 0.7vmin;
      }
      
      .pac-row:last-child {
        margin-bottom: 0;
      }
      
      .pac-field {
        flex: 1;
      }
      
      .pac-field label {
        display: block;
        font-size: clamp(9px, 1.0vmin, 14px);
        margin-bottom: 0.37vmin;
        color: #aaa;
        font-weight: 500;
      }
      
      .pac-field input,
      .pac-field select {
        width: 100%;
        padding: 0.7vmin;
        background: rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 0.6vmin;
        color: #fff;
        font-size: clamp(9px, 1.2vmin, 16px);
        transition: all 0.2s;
      }
      
      .pac-field input:focus,
      .pac-field select:focus {
        outline: none;
        border-color: #64b5f6;
        box-shadow: 0 0 0.7vmin rgba(100,181,246,0.3);
      }
      
      .pac-toggle-row {
        display: flex;
        gap: 1.1vmin;
        flex-wrap: wrap;
      }
      
      .pac-toggle {
        display: flex;
        align-items: center;
        gap: 0.6vmin;
        cursor: pointer;
        font-size: clamp(9px, 1.1vmin, 15px);
        padding: 0.6vmin 0.9vmin;
        background: rgba(255,255,255,0.05);
        border-radius: 0.6vmin;
        transition: all 0.2s;
      }
      
      .pac-new-game-btn {
        width: 100%;
        background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
        border: 2px solid #2196f3;
        color: white;
        border-radius: 0.7vmin;
        padding: 1.1vmin 1.5vmin;
        font-size: clamp(9px, 1.3vmin, 18px);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.7vmin;
        margin-top: 0.7vmin;
      }
      
      .pac-new-game-btn:hover {
        background: linear-gradient(135deg, #42a5f5 0%, #2196f3 100%);
        border-color: #42a5f5;
        transform: translateY(-2px);
        box-shadow: 0 0.37vmin 1.1vmin rgba(33, 150, 243, 0.4);
      }
      
      .pac-new-game-btn:active {
        transform: translateY(0);
      }
      
      .pac-toggle:hover {
        background: rgba(255,255,255,0.08);
      }
      
      /* HIGH VISIBILITY CHECKBOXES - Apply to ALL checkboxes */
      #pac-calc-overlay input[type="checkbox"] {
        appearance: none !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        width: 2.2vmin !important;
        height: 2.2vmin !important;
        min-width: 2.2vmin !important;
        min-height: 2.2vmin !important;
        max-width: 2.2vmin !important;
        max-height: 2.2vmin !important;
        background: #111 !important;
        border: 0.28vmin solid #4caf50 !important;
        border-radius: 0.37vmin !important;
        cursor: pointer !important;
        position: relative !important;
        margin: 0 0.7vmin 0 0 !important;
        padding: 0 !important;
        transition: all 0.2s !important;
        flex-shrink: 0 !important;
        display: inline-block !important;
        vertical-align: middle !important;
        background-image: none !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
        background-size: 1.5vmin 1.5vmin !important;
      }
      
      #pac-calc-overlay input[type="checkbox"]:hover:not(:disabled) {
        border-color: #66bb6a !important;
        box-shadow: 0 0 1.1vmin rgba(76, 175, 80, 0.6) !important;
        background-color: rgba(76, 175, 80, 0.2) !important;
      }
      
      #pac-calc-overlay input[type="checkbox"]:checked {
        background-color: #4caf50 !important;
        border-color: #66bb6a !important;
        box-shadow: 0 0 0.9vmin rgba(76, 175, 80, 0.5) !important;
        /* White checkmark with blue glow - SVG encoded */
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 12l5 5L20 6'/%3E%3C/svg%3E") !important;
        background-size: 1.7vmin 1.7vmin !important;
      }
      
      #pac-calc-overlay input[type="checkbox"]:disabled {
        opacity: 0.5 !important;
        cursor: not-allowed !important;
        border-color: #666 !important;
      }
      
      #pac-calc-overlay input[type="checkbox"]:disabled:checked {
        background-color: #666 !important;
        border-color: #888 !important;
      }
      
      /* Also style the toggle wrapper checkboxes */
      .pac-toggle input[type="checkbox"] {
        appearance: none !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        width: 2.4vmin !important;
        height: 2.4vmin !important;
        min-width: 2.4vmin !important;
        min-height: 2.4vmin !important;
        max-width: 2.4vmin !important;
        max-height: 2.4vmin !important;
        background: #111 !important;
        border: 0.28vmin solid #4caf50 !important;
        border-radius: 0.37vmin !important;
        cursor: pointer !important;
        position: relative !important;
        margin: 0 !important;
        padding: 0 !important;
        transition: all 0.2s !important;
        flex-shrink: 0 !important;
        display: inline-block !important;
        background-image: none !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
        background-size: 1.7vmin 1.7vmin !important;
      }
      
      .pac-toggle input[type="checkbox"]:hover:not(:disabled) {
        border-color: #66bb6a !important;
        box-shadow: 0 0 1.1vmin rgba(76, 175, 80, 0.6) !important;
        background-color: rgba(76, 175, 80, 0.2) !important;
      }
      
      .pac-toggle input[type="checkbox"]:checked {
        background-color: #4caf50 !important;
        border-color: #66bb6a !important;
        box-shadow: 0 0 0.9vmin rgba(76, 175, 80, 0.5) !important;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 12l5 5L20 6'/%3E%3C/svg%3E") !important;
        background-size: 1.9vmin 1.9vmin !important;
      }
      
      .pac-toggle input[type="checkbox"]:disabled {
        opacity: 0.5 !important;
        cursor: not-allowed !important;
        border-color: #666 !important;
      }
      
      .pac-toggle input[type="checkbox"]:disabled:checked {
        background-color: #666 !important;
        border-color: #888 !important;
      }
      
      .pac-warning-banner {
        padding: 1.1vmin;
        background: rgba(251, 191, 36, 0.15);
        border: 1px solid rgba(251, 191, 36, 0.4);
        border-radius: 0.7vmin;
        color: #fbbf24;
        font-size: clamp(9px, 1.2vmin, 16px);
        line-height: 1.4;
      }
      
      .pac-results {
        background: linear-gradient(135deg, rgba(100,181,246,0.1) 0%, rgba(156,39,176,0.1) 100%);
        padding: 1.5vmin;
        border-radius: 0.7vmin;
        margin-bottom: 1.5vmin;
        border: 1px solid rgba(100,181,246,0.2);
      }
      
      .pac-result-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.9vmin;
        font-size: clamp(9px, 1.2vmin, 16px);
      }
      
      .pac-result-row:last-child {
        margin-bottom: 0;
      }
      
      .pac-result-label {
        color: #bbb;
        font-weight: 500;
      }
      
      .pac-result-value {
        font-weight: 700;
        color: #fff;
        font-size: clamp(9px, 1.3vmin, 18px);
      }
      
      .pac-confidence-control {
        margin: 1.1vmin 0;
        padding: 0;
      }
      
      .pac-confidence-control label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: clamp(9px, 1.2vmin, 16px);
        color: #64b5f6;
        margin-bottom: 0.7vmin;
        font-weight: 600;
      }
      
      .pac-confidence-control input[type="range"] {
        width: 100%;
        height: 0.7vmin;
        border-radius: 0.37vmin;
        background: linear-gradient(90deg, 
          rgba(100,181,246,0.3) 0%, 
          rgba(156,39,176,0.3) 50%, 
          rgba(244,67,54,0.3) 100%);
        outline: none;
        -webkit-appearance: none;
        cursor: pointer;
      }
      
      .pac-confidence-control input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 1.9vmin;
        height: 1.9vmin;
        border-radius: 50%;
        background: linear-gradient(135deg, #64b5f6 0%, #9c27b0 100%);
        cursor: pointer;
        box-shadow: 0 2px 0.7vmin rgba(100,181,246,0.5);
        border: 2px solid #fff;
        transition: all 0.2s;
      }
      
      .pac-confidence-control input[type="range"]::-webkit-slider-thumb:hover {
        transform: scale(1.15);
        box-shadow: 0 0.37vmin 1.1vmin rgba(100,181,246,0.7);
      }
      
      .pac-confidence-control input[type="range"]::-moz-range-thumb {
        width: 1.9vmin;
        height: 1.9vmin;
        border-radius: 50%;
        background: linear-gradient(135deg, #64b5f6 0%, #9c27b0 100%);
        cursor: pointer;
        border: 2px solid #fff;
        box-shadow: 0 2px 0.7vmin rgba(100,181,246,0.5);
        transition: all 0.2s;
      }
      
      .pac-confidence-control input[type="range"]::-moz-range-thumb:hover {
        transform: scale(1.15);
        box-shadow: 0 0.37vmin 1.1vmin rgba(100,181,246,0.7);
      }
      
      /* Flash animation when target in shop */
      @keyframes targetInShopFlash {
        0%, 100% { 
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-color: #0f3460;
        }
        50% { 
          background: linear-gradient(135deg, #1e3a8a 0%, #fbbf24 100%);
          border-color: #fbbf24;
        }
      }
      
      #pac-calc-overlay.target-in-shop {
        animation: targetInShopFlash 0.25s ease-in-out infinite;
      }
      
      /* Full calculator gold flash overlay - always on top */
      #pac-calc-overlay.target-in-shop::before {
        content: '';
        position: absolute;
        inset: 0;  /* Cover entire calculator */
        background: transparent;
        border-radius: 1.1vmin;
        pointer-events: none;
        animation: targetInShopFullFlash 0.25s ease-in-out infinite;
        z-index: 999999999 !important;
      }
      
      @keyframes targetInShopFullFlash {
        0%, 100% { 
          background: transparent;
        }
        50% { 
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(251, 191, 36, 0.5) 100%);
          box-shadow: inset 0 0 4.6vmin rgba(251, 191, 36, 0.6);
        }
      }
      
      /* Flash animation for team panel when any team target in shop */
      @keyframes teamTargetInShopFlash {
        0%, 100% { 
          border-color: rgba(255,255,255,0.1);
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }
        50% { 
          border-color: #FF1493;  /* Hot pink */
          background: linear-gradient(135deg, #FF1493 0%, #FF69B4 100%);  /* Bright hot pink gradient */
          box-shadow: 0 0 2.8vmin rgba(255, 20, 147, 0.8);  /* Glow effect */
        }
      }
      
      .pac-team-panel.team-target-in-shop {
        animation: teamTargetInShopFlash 0.25s ease-in-out infinite;
      }
      
      /* Minimized flash animations - bright and visible */
      @keyframes minimizedTargetFlash {
        0%, 100% { 
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }
        50% { 
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          box-shadow: 0 0 2.8vmin rgba(251, 191, 36, 0.9), 0 0 5.6vmin rgba(251, 191, 36, 0.5);
        }
      }
      
      @keyframes minimizedTeamTargetFlash {
        0%, 100% { 
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }
        50% { 
          background: linear-gradient(135deg, #FF1493 0%, #FF69B4 100%);
          box-shadow: 0 0 2.8vmin rgba(255, 20, 147, 0.9), 0 0 5.6vmin rgba(255, 20, 147, 0.5);
        }
      }
      
      /* When minimized AND target in shop - bright yellow flash */
      #pac-calc-overlay.minimized.target-in-shop {
        animation: minimizedTargetFlash 0.3s ease-in-out infinite !important;
      }
      
      #pac-calc-overlay.minimized.target-in-shop #pac-calc-header {
        animation: minimizedTargetFlash 0.3s ease-in-out infinite;
      }
      
      /* When minimized AND team target in shop - bright pink flash */
      #pac-calc-overlay.minimized.team-target-in-shop {
        animation: minimizedTeamTargetFlash 0.3s ease-in-out infinite !important;
      }
      
      #pac-calc-overlay.minimized.team-target-in-shop #pac-calc-header {
        animation: minimizedTeamTargetFlash 0.3s ease-in-out infinite;
      }
      
      /* Both at once - alternate between yellow and pink */
      @keyframes minimizedBothFlash {
        0%, 100% { 
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }
        25% { 
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          box-shadow: 0 0 2.8vmin rgba(251, 191, 36, 0.9);
        }
        75% { 
          background: linear-gradient(135deg, #FF1493 0%, #FF69B4 100%);
          box-shadow: 0 0 2.8vmin rgba(255, 20, 147, 0.9);
        }
      }
      
      #pac-calc-overlay.minimized.target-in-shop.team-target-in-shop {
        animation: minimizedBothFlash 0.5s ease-in-out infinite !important;
      }
      
      #pac-calc-overlay.minimized.target-in-shop.team-target-in-shop #pac-calc-header {
        animation: minimizedBothFlash 0.5s ease-in-out infinite;
      }
      
      /* Refresh Blocker Overlay */
      #pac-refresh-blocker {
        position: fixed;
        z-index: 2147483647;
        background: rgba(239, 68, 68, 0.95);
        border: 0.28vmin solid #fbbf24;
        border-radius: 1.1vmin;
        display: none;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.7vmin;
        padding: 1.5vmin;
        box-shadow: 0 0 2.8vmin rgba(251, 191, 36, 0.8), 0 0 5.6vmin rgba(239, 68, 68, 0.6);
        animation: blockerPulse 0.3s ease-in-out infinite alternate;
        cursor: default;
        user-select: none;
      }
      
      #pac-refresh-blocker.visible {
        display: flex;
      }
      
      @keyframes blockerPulse {
        from { 
          box-shadow: 0 0 2.8vmin rgba(251, 191, 36, 0.8), 0 0 5.6vmin rgba(239, 68, 68, 0.6);
          transform: scale(1);
        }
        to { 
          box-shadow: 0 0 3.7vmin rgba(251, 191, 36, 1), 0 0 7.4vmin rgba(239, 68, 68, 0.8);
          transform: scale(1.02);
        }
      }
      
      #pac-refresh-blocker .blocker-title {
        font-size: clamp(9px, 1.3vmin, 18px);
        font-weight: 700;
        color: #fbbf24;
        text-transform: uppercase;
        letter-spacing: 1px;
        text-shadow: 0 0 0.9vmin rgba(0,0,0,0.5);
      }
      
      #pac-refresh-blocker .blocker-pokemon {
        font-size: clamp(12px, 1.7vmin, 23px);
        font-weight: 800;
        color: white;
        text-shadow: 0 0 0.9vmin rgba(0,0,0,0.5);
      }
      
      #pac-refresh-blocker .blocker-dismiss {
        position: absolute;
        top: -1.1vmin;
        right: -1.1vmin;
        width: 2.6vmin;
        height: 2.6vmin;
        background: #1e293b;
        border: 2px solid #fbbf24;
        border-radius: 50%;
        color: #fbbf24;
        font-size: clamp(11px, 1.5vmin, 21px);
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s;
      }
      
      #pac-refresh-blocker .blocker-dismiss:hover {
        background: #fbbf24;
        color: #1e293b;
        transform: scale(1.1);
      }
      
      .pac-footer {
        background: rgba(0,0,0,0.2);
        padding: 0.9vmin 1.5vmin;
        border-radius: 0 0 0.9vmin 0.9vmin;
        border-top: 1px solid rgba(255,255,255,0.05);
        font-size: clamp(9px, 1.0vmin, 14px);
        color: #888;
        display: flex;
        justify-content: space-between;
        position: relative;
        z-index: 1;  /* Above side panels */
        cursor: move;
      }
      
      .pac-collapsible {
        margin-bottom: 1.5vmin;
      }
      
      .pac-collapse-btn {
        width: 100%;
        background: rgba(100,181,246,0.1);
        border: 1px solid rgba(100,181,246,0.2);
        color: #64b5f6;
        padding: 0.9vmin;
        border-radius: 0.6vmin;
        cursor: pointer;
        font-size: clamp(9px, 1.2vmin, 16px);
        font-weight: 600;
        transition: all 0.2s;
        text-align: left;
      }
      
      .pac-collapse-btn:hover {
        background: rgba(100,181,246,0.15);
      }
      
      .pac-collapse-content {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
        background: rgba(255,255,255,0.02);
        border-radius: 0 0 0.6vmin 0.6vmin;
        padding: 0 1.1vmin;
      }
      
      .pac-collapse-content.expanded {
        max-height: 74.1vmin;
        padding: 1.1vmin;
        border: 1px solid rgba(255,255,255,0.05);
        border-top: none;
      }
      
      .pac-status-msg {
        font-size: clamp(9px, 1.1vmin, 15px);
        padding: 0.7vmin;
        border-radius: 0.6vmin;
        margin-top: 0.7vmin;
        text-align: center;
      }
      
      .pac-status-msg.error {
        background: rgba(244,67,54,0.15);
        color: #ff5252;
        border: 1px solid rgba(244,67,54,0.3);
      }
      
      .pac-status-msg.warning {
        background: rgba(255,152,0,0.15);
        color: #ffab40;
        border: 1px solid rgba(255,152,0,0.3);
      }
      
      .pac-status-msg.success {
        background: rgba(76,175,80,0.15);
        color: #4caf50;
        border: 1px solid rgba(76,175,80,0.3);
      }
      
      .pac-live-indicator {
        display: none;
        align-items: center;
        gap: 0.6vmin;
        font-size: clamp(9px, 1.0vmin, 14px);
        color: #4caf50;
        margin-top: 0.7vmin;
        padding: 0.6vmin 0.9vmin;
        background: rgba(76,175,80,0.1);
        border-radius: 0.6vmin;
        border: 1px solid rgba(76,175,80,0.2);
      }
      
      .pac-stage-display {
        font-weight: 600;
        color: #64b5f6;
      }
      
      .pac-stage-display.pve {
        color: #fbbf24;
      }
      
      .pac-live-divider {
        color: rgba(255,255,255,0.3);
        margin: 0 2px;
      }
      
      .pac-pokemon-chip {
        display: inline-block;
        padding: 2px 0.7vmin;
        border-radius: 1.1vmin;
        font-size: clamp(9px, 1.0vmin, 14px);
        font-weight: 500;
        color: white;
      }
      .pac-pokemon-chip.common { background: rgb(160, 160, 160); }
      .pac-pokemon-chip.uncommon { background: rgb(59, 201, 94); }
      .pac-pokemon-chip.rare { background: rgb(65, 191, 204); }
      .pac-pokemon-chip.epic { background: rgb(146, 127, 255); }
      .pac-pokemon-chip.ultra { background: rgb(239, 68, 68); }
      .pac-pokemon-chip.unknown { background: #555; }
      
      .pac-live-controls {
        display: flex;
        gap: 0.7vmin;
        margin-top: 0.7vmin;
      }
      
      .pac-live-toggle {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.7vmin;
        padding: 0.9vmin;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 0.6vmin;
        color: #fff;
        font-size: clamp(9px, 1.2vmin, 16px);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .pac-live-toggle:hover {
        background: rgba(255,255,255,0.08);
        border-color: rgba(255,255,255,0.2);
      }
      
      .pac-live-toggle.active {
        background: rgba(76,175,80,0.2);
        border-color: rgba(76,175,80,0.4);
      }
      
      .pac-live-status {
        font-weight: 700;
        padding: 2px 0.7vmin;
        border-radius: 0.37vmin;
        font-size: clamp(9px, 1.0vmin, 14px);
      }
      
      .pac-live-toggle .pac-live-status {
        background: rgba(244,67,54,0.3);
        color: #ff5252;
      }
      
      .pac-live-toggle.active .pac-live-status {
        background: rgba(76,175,80,0.3);
        color: #4caf50;
      }
      
      .pac-speed-select {
        flex: 1;
        padding: 0.7vmin;
        background: rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 0.6vmin;
        color: #fff;
        font-size: clamp(9px, 1.1vmin, 15px);
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .pac-speed-select:hover {
        border-color: #64b5f6;
      }
      
      .pac-speed-select:focus {
        outline: none;
        border-color: #64b5f6;
        box-shadow: 0 0 0.7vmin rgba(100,181,246,0.3);
      }
      
      /* Pokemon Autocomplete Styles */
      .pac-pokemon-selector {
        position: relative;
        width: 100%;
      }
      
      
      /* Evolution Family Styles (v2.5.0) */
      .pac-evolution-family {
        margin-top: 0.7vmin;
        padding: 0.7vmin;
        background: rgba(100, 181, 246, 0.1);
        border-radius: 0.6vmin;
        border: 1px solid rgba(100, 181, 246, 0.2);
      }
      
      .pac-family-title {
        font-size: clamp(9px, 1.0vmin, 14px);
        font-weight: 600;
        color: #64b5f6;
        margin-bottom: 0.6vmin;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .pac-family-breakdown {
        display: flex;
        flex-direction: column;
        gap: 0.37vmin;
        margin: 0.7vmin 0;
      }
      
      .pac-family-row {
        display: flex;
        justify-content: space-between;
        font-size: clamp(9px, 1.1vmin, 15px);
        padding: 0.37vmin 0.6vmin;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 0.37vmin;
      }
      
      .pac-family-name {
        font-weight: 600;
        color: #fff;
      }
      
      .pac-family-calc {
        color: #64b5f6;
        font-family: 'Courier New', monospace;
      }
      
      .pac-family-total {
        font-weight: 700;
        text-align: right;
        color: #fff;
        padding-top: 0.37vmin;
        border-top: 1px solid rgba(100, 181, 246, 0.3);
        font-size: clamp(9px, 1.2vmin, 16px);
      }

      .pac-autocomplete-input {
        width: 100%;
        text-transform: uppercase;
      }
      
      #pacAutocompleteDropdown {
        position: fixed;
        width: 27.8vmin;
        max-height: 37.0vmin;
        overflow-y: auto;
        background: #0a0e27;
        border: 1px solid rgba(100,181,246,0.3);
        border-radius: 0.6vmin;
        z-index: 1000000;
        box-shadow: 0 0.7vmin 1.5vmin rgba(0,0,0,0.4);
      }
      
      #pacAutocompleteDropdown.hidden {
        display: none;
      }
      
      .pac-dropdown-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.9vmin 1.1vmin;
        cursor: pointer;
        border-bottom: 1px solid rgba(255,255,255,0.05);
        transition: all 0.2s;
      }
      
      .pac-dropdown-item:hover {
        background: rgba(100,181,246,0.15);
      }
      
      .pac-dropdown-item:last-child {
        border-bottom: none;
      }
      
      .pac-pokemon-name {
        font-weight: 600;
        color: #fff;
        font-size: clamp(9px, 1.2vmin, 16px);
      }
      
      .pac-pokemon-rarity {
        font-size: clamp(9px, 0.9vmin, 12px);
        padding: 0.28vmin 0.7vmin;
        border-radius: 0.37vmin;
        text-transform: uppercase;
        font-weight: 700;
        letter-spacing: 0.5px;
      }
      
      #pacRarityError {
        color: #ff5252;
        font-size: clamp(9px, 1.0vmin, 14px);
        margin-top: 0.6vmin;
        padding: 0.6vmin 0.9vmin;
        background: rgba(244,67,54,0.15);
        border-radius: 0.6vmin;
        border: 1px solid rgba(244,67,54,0.3);
      }
      
      #pacRarityError.hidden {
        display: none;
      }
      
      /* Scrollbar styling */
      #pac-calc-body::-webkit-scrollbar,
      #pacAutocompleteDropdown::-webkit-scrollbar {
        width: 0.7vmin;
      }
      
      #pac-calc-body::-webkit-scrollbar-track,
      #pacAutocompleteDropdown::-webkit-scrollbar-track {
        background: rgba(0,0,0,0.2);
        border-radius: 0.9vmin;
      }
      
      #pac-calc-body::-webkit-scrollbar-thumb,
      #pacAutocompleteDropdown::-webkit-scrollbar-thumb {
        background: rgba(100,181,246,0.3);
        border-radius: 0.9vmin;
      }
      
      #pac-calc-body::-webkit-scrollbar-thumb:hover,
      #pacAutocompleteDropdown::-webkit-scrollbar-thumb:hover {
        background: rgba(100,181,246,0.5);
      }
      
      /* ═══════════════════════════════════════════════════════════════════════════
         TEAM TRACKER SIDE PANEL (v2.9.6)
         ═══════════════════════════════════════════════════════════════════════════ */
      
      .pac-team-panel {
        position: absolute;
        left: 0;
        top: 0;
        width: 35.2vmin;
        height: 100%;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border: 2px solid #0f3460;
        border-radius: 1.1vmin;
        box-shadow: 0 0.7vmin 3.0vmin rgba(0,0,0,0.4);
        transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: -2147483648 !important;  /* Absolute minimum - below everything for flash visibility */
        display: flex;
        flex-direction: column;
      }
      
      .pac-team-panel.expanded {
        left: 36.1vmin;
      }
      
      .pac-team-toggle {
        position: absolute;
        left: 100%;
        top: 50%;
        transform: translateY(-50%);
        width: 3.7vmin;
        height: 7.4vmin;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border: 2px solid #0f3460;
        border-left: none;
        border-radius: 0 0.7vmin 0.7vmin 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #64b5f6;
        font-size: clamp(14px, 1.9vmin, 26px);
        z-index: -1 !important;  /* Below main calculator so flash shows */
      }
      
      .pac-team-toggle:hover {
        background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
        border-color: #64b5f6;
        transition: background 0.2s, border-color 0.2s;
      }
      
      .pac-team-arrow {
        transition: transform 0.3s;
        display: inline-block;
      }
      
      .pac-team-panel.expanded .pac-team-arrow {
        transform: rotate(180deg);
      }
      
      .pac-team-content {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 1.5vmin;
        position: relative;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
        pointer-events: none;
      }
      
      .pac-team-panel.expanded .pac-team-content {
        opacity: 1;
        pointer-events: all;
        transition-delay: 0.3s;
      }
      
      .pac-team-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5vmin;
        padding-bottom: 1.1vmin;
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }
      
      .pac-team-header h3 {
        margin: 0;
        font-size: clamp(11px, 1.5vmin, 21px);
        color: #64b5f6;
        font-weight: 600;
      }
      
      .pac-team-close {
        background: none;
        border: none;
        color: #888;
        font-size: clamp(16px, 2.2vmin, 30px);
        cursor: pointer;
        padding: 0;
        width: 2.6vmin;
        height: 2.6vmin;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.37vmin;
        transition: all 0.2s;
      }
      
      .pac-team-close:hover {
        background: rgba(255,255,255,0.1);
        color: #fff;
      }
      
      .pac-team-list {
        flex: 1;
        overflow-y: auto;
        margin-bottom: 1.5vmin;
        min-height: 18.5vmin;
      }
      
      .pac-team-item {
        background: rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 0.7vmin;
        padding: 1.1vmin;
        margin-bottom: 0.7vmin;
        transition: all 0.2s;
        cursor: pointer;
      }
      
      .pac-team-item:hover {
        background: rgba(255,255,255,0.05);
        border-color: rgba(100,181,246,0.3);
      }
      
      .pac-team-item.active {
        border-color: #64b5f6;
        background: rgba(100,181,246,0.1);
      }
      
      .pac-team-item.not-in-pool {
        opacity: 0.6;
        border-style: dashed;
      }
      
      /* Impossible state - red flash */
      .pac-team-item.pac-impossible {
        border-color: #f44336;
        background: rgba(244, 67, 54, 0.15);
        animation: impossiblePulse 1.5s ease-in-out infinite;
      }
      
      @keyframes impossiblePulse {
        0%, 100% { background: rgba(244, 67, 54, 0.15); box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); }
        50% { background: rgba(244, 67, 54, 0.25); box-shadow: 0 0 0.7vmin 2px rgba(244, 67, 54, 0.3); }
      }
      
      /* Danger state - orange warning */
      .pac-team-item.pac-danger {
        border-color: #ff9800;
        background: rgba(255, 152, 0, 0.12);
        animation: dangerPulse 2s ease-in-out infinite;
      }
      
      @keyframes dangerPulse {
        0%, 100% { background: rgba(255, 152, 0, 0.12); box-shadow: 0 0 0 0 rgba(255, 152, 0, 0); }
        50% { background: rgba(255, 152, 0, 0.2); box-shadow: 0 0 0.6vmin 1px rgba(255, 152, 0, 0.25); }
      }
      
      /* Warning badges */
      .pac-warning-badge {
        font-size: clamp(9px, 1.1vmin, 15px);
        font-weight: bold;
        padding: 2px 0.6vmin;
        border-radius: 0.37vmin;
        margin-left: 0.37vmin;
      }
      
      .pac-impossible-badge {
        background: #f44336;
        color: #fff;
      }
      
      .pac-danger-badge {
        background: #ff9800;
        color: #000;
      }
      
      /* Text colors for pool display */
      .pac-impossible-text {
        color: #f44336 !important;
      }
      
      .pac-danger-text {
        color: #ff9800 !important;
      }
      
      /* Maxed state - green success */
      .pac-maxed-badge {
        background: #4caf50;
        color: #fff;
      }
      
      .pac-maxed-text {
        color: #4caf50 !important;
      }
      
      .pac-team-item.pac-maxed {
        border-color: #4caf50;
        background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%);
      }
      
      .pac-team-item-header {
        display: flex;
        align-items: center;
        gap: 0.7vmin;
        margin-bottom: 0.7vmin;
      }
      
      .pac-team-checkbox {
        width: 1.7vmin;
        height: 1.7vmin;
        cursor: pointer;
      }
      
      .pac-team-name {
        flex: 1;
        font-weight: 600;
        font-size: clamp(9px, 1.3vmin, 18px);
        color: #fff;
      }
      
      .pac-team-remove {
        background: none;
        border: none;
        color: #f44336;
        font-size: clamp(12px, 1.7vmin, 23px);
        cursor: pointer;
        padding: 0;
        width: 2.2vmin;
        height: 2.2vmin;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.37vmin;
        transition: all 0.2s;
      }
      
      .pac-team-remove:hover {
        background: rgba(244,67,54,0.2);
      }
      
      .pac-team-meta {
        font-size: clamp(9px, 1.0vmin, 14px);
        color: #888;
        margin-bottom: 0.6vmin;
      }
      
      .pac-team-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.7vmin;
        font-size: clamp(9px, 1.0vmin, 14px);
      }
      
      .pac-team-stat-mini {
        background: rgba(0,0,0,0.3);
        padding: 0.37vmin 0.7vmin;
        border-radius: 0.37vmin;
        text-align: center;
      }
      
      .pac-team-stat-mini-label {
        color: #888;
        font-size: clamp(9px, 0.9vmin, 12px);
      }
      
      .pac-team-stat-mini-value {
        color: #64b5f6;
        font-weight: 600;
      }
      
      .pac-team-combined {
        background: rgba(100,181,246,0.1);
        border: 1px solid rgba(100,181,246,0.2);
        border-radius: 0.7vmin;
        padding: 1.1vmin;
        margin-bottom: 1.1vmin;
      }
      
      .pac-team-combined-title {
        font-size: clamp(9px, 1.1vmin, 15px);
        color: #64b5f6;
        font-weight: 600;
        margin-bottom: 0.7vmin;
        text-align: center;
      }
      
      .pac-team-combined-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.7vmin;
      }
      
      .pac-team-stat {
        text-align: center;
      }
      
      .pac-team-stat-label {
        display: block;
        font-size: clamp(9px, 0.9vmin, 12px);
        color: #888;
        margin-bottom: 0.37vmin;
      }
      
      .pac-team-stat-value {
        display: block;
        font-size: clamp(11px, 1.5vmin, 21px);
        color: #fff;
        font-weight: 700;
      }
      
      .pac-team-add-section {
        display: flex;
        gap: 0.7vmin;
        align-items: stretch;
      }
      
      .pac-team-input {
        flex: 1;
        background: rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.1);
        color: #fff;
        padding: 0.9vmin;
        border-radius: 0.6vmin;
        font-size: clamp(9px, 1.2vmin, 16px);
        transition: all 0.2s;
      }
      
      .pac-team-input:focus {
        outline: none;
        border-color: #64b5f6;
        background: rgba(0,0,0,0.4);
      }
      
      .pac-team-add-btn {
        background: rgba(76,175,80,0.2);
        border: 1px solid rgba(76,175,80,0.4);
        color: #4caf50;
        padding: 0.9vmin 1.9vmin;
        border-radius: 0.6vmin;
        cursor: pointer;
        font-size: clamp(9px, 1.2vmin, 16px);
        font-weight: 600;
        transition: all 0.2s;
        white-space: nowrap;
      }
      
      .pac-team-add-btn:hover {
        background: rgba(76,175,80,0.3);
        border-color: #4caf50;
      }
      
      .pac-team-dropdown {
        position: fixed;
        width: 29.6vmin;
        background: rgba(26, 26, 46, 0.98);
        border: 2px solid #64b5f6;
        border-radius: 0.7vmin;
        max-height: 37.0vmin;
        overflow-y: auto;
        z-index: 999999;
        box-shadow: 0 0.37vmin 1.9vmin rgba(0,0,0,0.6);
        padding: 0.7vmin 0;
      }
      
      .pac-team-dropdown.hidden {
        display: none;
      }
      
      .pac-team-dropdown-item {
        padding: 0.7vmin 1.1vmin;
        cursor: pointer;
        transition: background 0.1s;
        font-size: clamp(9px, 1.2vmin, 16px);
      }
      
      .pac-team-dropdown-item:hover,
      .pac-team-dropdown-item.selected {
        background: rgba(100,181,246,0.2);
      }
      
      .pac-team-dropdown-name {
        font-weight: 600;
      }
      
      .pac-team-dropdown-meta {
        font-size: clamp(9px, 1.0vmin, 14px);
        color: #888;
        margin-top: 2px;
      }
      
      .pac-team-add {
        width: 100%;
        background: rgba(76,175,80,0.2);
        border: 1px solid rgba(76,175,80,0.4);
        color: #4caf50;
        padding: 0.9vmin;
        border-radius: 0.6vmin;
        cursor: pointer;
        font-size: clamp(9px, 1.2vmin, 16px);
        font-weight: 600;
        transition: all 0.2s;
      }
      
      .pac-team-add:hover {
        background: rgba(76,175,80,0.3);
        border-color: #4caf50;
      }
      
      .pac-team-empty {
        text-align: center;
        color: #888;
        font-size: clamp(9px, 1.2vmin, 16px);
        padding: 3.7vmin 1.9vmin;
      }
      
      .pac-team-empty-icon {
        font-size: clamp(33px, 4.4vmin, 61px);
        margin-bottom: 1.1vmin;
        opacity: 0.3;
      }
      
      /* Counter Intelligence Panel Styles */
      .pac-current-toggle {
        top: calc(50% - 5.6vmin) !important;  /* Stacked above team tracker arrow */
      }
      
      .pac-intel-players {
        display: flex;
        flex-direction: column;
        gap: 0.7vmin;
        flex: 1;
        overflow-y: auto;
        padding-right: 0.37vmin;
      }
      
      .pac-intel-empty {
        color: #666;
        font-size: clamp(9px, 1.1vmin, 15px);
        font-style: italic;
        padding: 1.9vmin;
        text-align: center;
      }
      
      .pac-intel-player {
        background: rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 0.7vmin;
        overflow: hidden;
        transition: all 0.2s;
      }
      
      .pac-intel-player.is-you {
        border-color: rgba(100,181,246,0.4);
        background: rgba(100,181,246,0.08);
      }
      
      .pac-intel-player.contested {
        border-color: #ff9800;
        background: rgba(255,152,0,0.1);
      }
      
      .pac-intel-header {
        display: flex;
        align-items: center;
        gap: 0.7vmin;
        padding: 0.9vmin 1.1vmin;
        cursor: pointer;
        transition: background 0.2s;
        user-select: none;
      }
      
      .pac-intel-header:hover {
        background: rgba(255,255,255,0.05);
      }
      
      .pac-intel-arrow {
        font-size: clamp(9px, 0.9vmin, 12px);
        color: #888;
        transition: transform 0.2s;
      }
      
      .pac-intel-player.expanded .pac-intel-arrow {
        transform: rotate(90deg);
      }
      
      .pac-intel-name {
        flex: 1;
        font-weight: 600;
        font-size: clamp(9px, 1.2vmin, 16px);
        color: #fff;
      }
      
      .pac-intel-player.is-you .pac-intel-name {
        color: #64b5f6;
      }
      
      .pac-intel-count {
        font-size: clamp(9px, 1.0vmin, 14px);
        color: #888;
      }
      
      .pac-intel-contested-badge {
        background: #ff9800;
        color: #000;
        font-size: clamp(9px, 0.9vmin, 12px);
        font-weight: bold;
        padding: 2px 0.6vmin;
        border-radius: 0.37vmin;
      }
      
      .pac-intel-content {
        display: none;
        padding: 0 1.1vmin 1.1vmin 1.1vmin;
        border-top: 1px solid rgba(255,255,255,0.05);
      }
      
      .pac-intel-player.expanded .pac-intel-content {
        display: block;
      }
      
      .pac-intel-shop {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6vmin;
        padding: 0.9vmin 0;
        border-bottom: 1px solid rgba(255,255,255,0.05);
        margin-bottom: 0.9vmin;
      }
      
      .pac-intel-shop-label {
        font-size: clamp(9px, 0.9vmin, 12px);
        color: #888;
        text-transform: uppercase;
        width: 100%;
        margin-bottom: 0.37vmin;
      }
      
      .pac-intel-shop-slot {
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 0.37vmin;
        padding: 0.37vmin 0.7vmin;
        font-size: clamp(9px, 0.9vmin, 12px);
        color: #ccc;
      }
      
      .pac-intel-shop-slot.empty {
        color: #555;
        border-style: dashed;
      }
      
      .pac-intel-units {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6vmin;
      }
      
      .pac-intel-unit {
        background: rgba(100,181,246,0.12);
        border: 1px solid rgba(100,181,246,0.25);
        border-radius: 0.6vmin;
        padding: 0.6vmin 0.9vmin;
        font-size: clamp(9px, 1.0vmin, 14px);
        display: flex;
        align-items: center;
        gap: 0.6vmin;
        white-space: nowrap;
        transition: all 0.2s;
      }
      
      .pac-intel-unit.contested {
        border-color: #ff9800;
        background: rgba(255,152,0,0.2);
        box-shadow: 0 0 0.6vmin rgba(255,152,0,0.3);
      }
      
      .pac-intel-unit-name {
        font-weight: 600;
        color: #fff;
      }
      
      .pac-intel-unit-stars {
        color: #fbbf24;
        font-size: clamp(9px, 0.9vmin, 12px);
      }
      
      .pac-intel-unit-pool {
        font-size: clamp(9px, 0.9vmin, 12px);
        color: #888;
        margin-left: 2px;
      }
      
      .pac-intel-unit-pool.low {
        color: #ff9800;
      }
      
      .pac-intel-unit-pool.critical {
        color: #f44336;
      }
      
      /* Settings/Accessibility Panel */
      .pac-settings-toggle {
        top: calc(50% + 5.6vmin) !important;  /* Below team tracker arrow */
      }
      
      .pac-settings-content {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 1.5vmin;
        position: relative;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
        pointer-events: none;
        overflow-y: auto;
      }
      
      .pac-team-panel.expanded .pac-settings-content {
        opacity: 1;
        pointer-events: all;
        transition-delay: 0.3s;
      }
      
      .pac-settings-section {
        margin-bottom: 1.5vmin;
        padding-bottom: 1.5vmin;
        border-bottom: 1px solid rgba(255,255,255,0.08);
      }
      
      .pac-settings-section:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }
      
      .pac-settings-section-title {
        font-size: clamp(9px, 1.0vmin, 14px);
        font-weight: 600;
        color: #64b5f6;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 1.1vmin;
      }
      
      .pac-settings-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.9vmin;
      }
      
      .pac-settings-row:last-child {
        margin-bottom: 0;
      }
      
      .pac-settings-label {
        font-size: clamp(9px, 1.1vmin, 15px);
        color: #ccc;
      }
      
      .pac-settings-color-input {
        width: 3.7vmin;
        height: 2.6vmin;
        border: 2px solid rgba(255,255,255,0.2);
        border-radius: 0.37vmin;
        cursor: pointer;
        background: transparent;
        padding: 0;
      }
      
      .pac-settings-color-input::-webkit-color-swatch-wrapper {
        padding: 2px;
      }
      
      .pac-settings-color-input::-webkit-color-swatch {
        border-radius: 2px;
        border: none;
      }
      
      .pac-settings-slider {
        width: 11.1vmin;
        height: 0.7vmin;
        -webkit-appearance: none;
        background: linear-gradient(90deg, rgba(100,181,246,0.3) 0%, rgba(100,181,246,0.6) 100%);
        border-radius: 0.37vmin;
        cursor: pointer;
        outline: none;
        position: relative;
      }
      
      .pac-settings-slider::-webkit-slider-runnable-track {
        height: 0.7vmin;
        border-radius: 0.37vmin;
        background: linear-gradient(90deg, rgba(100,181,246,0.2) 0%, rgba(100,181,246,0.4) 100%);
      }
      
      .pac-settings-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 1.9vmin;
        height: 1.9vmin;
        background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%);
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 2px 0.6vmin rgba(0,0,0,0.3), 0 0 0 2px rgba(100,181,246,0.3);
        margin-top: -0.6vmin;
      }
      
      .pac-settings-slider::-webkit-slider-thumb:hover {
        background: linear-gradient(135deg, #90caf9 0%, #64b5f6 100%);
        box-shadow: 0 2px 0.7vmin rgba(0,0,0,0.4), 0 0 0 0.28vmin rgba(100,181,246,0.4);
        transform: scale(1.1);
      }
      
      .pac-settings-slider::-webkit-slider-thumb:active {
        transform: scale(0.95);
      }
      
      /* Firefox slider */
      .pac-settings-slider::-moz-range-track {
        height: 0.7vmin;
        border-radius: 0.37vmin;
        background: linear-gradient(90deg, rgba(100,181,246,0.2) 0%, rgba(100,181,246,0.4) 100%);
      }
      
      .pac-settings-slider::-moz-range-thumb {
        width: 1.9vmin;
        height: 1.9vmin;
        background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%);
        border-radius: 50%;
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 0.6vmin rgba(0,0,0,0.3), 0 0 0 2px rgba(100,181,246,0.3);
      }
      
      /* Toggle Switch */
      .pac-settings-switch {
        position: relative;
        display: inline-block;
        width: 4.4vmin;
        height: 2.4vmin;
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
        background: rgba(255,255,255,0.1);
        transition: 0.3s;
        border-radius: 2.4vmin;
        border: 2px solid rgba(255,255,255,0.2);
      }
      
      .pac-settings-switch-slider:before {
        position: absolute;
        content: "";
        height: 1.7vmin;
        width: 1.7vmin;
        left: 2px;
        bottom: 2px;
        background: #888;
        transition: 0.3s;
        border-radius: 50%;
        box-shadow: 0 2px 0.37vmin rgba(0,0,0,0.3);
      }
      
      .pac-settings-switch input:checked + .pac-settings-switch-slider {
        background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
        border-color: #4caf50;
      }
      
      .pac-settings-switch input:checked + .pac-settings-switch-slider:before {
        transform: translateX(2.0vmin);
        background: #fff;
      }
      
      .pac-settings-switch-slider:hover {
        border-color: rgba(255,255,255,0.4);
      }
      
      .pac-settings-value {
        font-size: clamp(9px, 1.0vmin, 14px);
        color: #888;
        min-width: 4.2vmin;
        text-align: right;
      }
      
      .pac-settings-slider-row {
        display: flex;
        align-items: center;
        gap: 0.7vmin;
      }
      
      .pac-settings-btn {
        background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
        border: 1px solid #3b82f6;
        border-radius: 0.6vmin;
        color: #fff;
        padding: 0.7vmin 1.5vmin;
        font-size: clamp(9px, 1.1vmin, 15px);
        cursor: pointer;
        transition: all 0.2s;
        width: 100%;
        margin-top: 0.7vmin;
      }
      
      .pac-settings-btn:hover {
        background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
        box-shadow: 0 2px 0.7vmin rgba(59,130,246,0.3);
      }
      
      .pac-settings-btn.reset {
        background: rgba(255,255,255,0.05);
        border-color: rgba(255,255,255,0.2);
      }
      
      .pac-settings-btn.reset:hover {
        background: rgba(255,255,255,0.1);
        border-color: rgba(255,255,255,0.3);
      }
      
      .pac-settings-preview {
        background: var(--pac-bg-color, #1a1a2e);
        border: 2px solid rgba(255,255,255,0.15);
        border-radius: 0.7vmin;
        padding: 1.5vmin;
        margin-top: 1.1vmin;
        text-align: center;
        transition: background 0.2s;
      }
      
      .pac-settings-preview-text {
        color: var(--pac-text-color, #e0e0e0);
        font-size: var(--pac-font-size, 1.1vmin);
        margin-bottom: 1.1vmin;
        font-weight: 500;
      }
      
      .pac-settings-preview-flashes {
        display: flex;
        justify-content: center;
        gap: 0.7vmin;
        flex-wrap: wrap;
      }
      
      .pac-settings-flash-preview {
        display: inline-block;
        padding: 0.7vmin 1.5vmin;
        border-radius: 0.6vmin;
        font-size: clamp(9px, 1.1vmin, 15px);
        font-weight: 600;
        transition: all 0.2s;
      }
      
      .pac-settings-flash-preview.target {
        background: var(--pac-target-flash, #fbbf24);
        color: #000;
        box-shadow: 0 2px 0.7vmin var(--pac-target-flash, #fbbf24)66;
      }
      
      .pac-settings-flash-preview.team {
        background: var(--pac-team-flash, #FF1493);
        color: #fff;
        box-shadow: 0 2px 0.7vmin var(--pac-team-flash, #FF1493)66;
      }
      
      .pac-settings-flash-preview.disabled {
        opacity: 0.4;
        box-shadow: none;
      }
      
      /* Shop History / Roll Luck Panel */
      .pac-history-toggle {
        top: calc(50% + 11.1vmin) !important;  /* Below settings arrow */
      }
      
      .pac-history-content {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
        padding: 1.5vmin;
        position: relative;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
        pointer-events: none;
        overflow: hidden;
      }
      
      .pac-history-content::-webkit-scrollbar {
        display: none;  /* Chrome/Safari/Opera */
      }
      
      .pac-team-panel.expanded .pac-history-content {
        opacity: 1;
        pointer-events: all;
        transition-delay: 0.3s;
        overflow: visible;
      }
      
      .pac-history-disclaimer {
        background: rgba(251, 191, 36, 0.15);
        border: 1px solid rgba(251, 191, 36, 0.3);
        border-radius: 0.6vmin;
        padding: 0.6vmin 0.9vmin;
        font-size: clamp(9px, 0.9vmin, 12px);
        color: #fbbf24;
        margin-bottom: 1.1vmin;
        text-align: center;
        flex-shrink: 0;
      }
      }
      
      .pac-history-players {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      
      .pac-history-players::-webkit-scrollbar {
        display: none;
      }
      
      /* Player accordion */
      .pac-history-player {
        margin-bottom: 0.7vmin;
        border-radius: 0.7vmin;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.03);
      }
      
      .pac-history-player.current-player {
        border-color: rgba(100, 181, 246, 0.4);
        background: rgba(100, 181, 246, 0.08);
      }
      
      .pac-history-player.expanded {
        border-color: rgba(255,255,255,0.2);
      }
      
      .pac-history-player-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.9vmin 1.1vmin;
        cursor: pointer;
        transition: background 0.2s;
      }
      
      .pac-history-player-header:hover {
        background: rgba(255,255,255,0.05);
      }
      
      .pac-history-player-name {
        font-weight: 600;
        font-size: clamp(9px, 1.1vmin, 15px);
        color: #e0e0e0;
      }
      
      .pac-history-player.current-player .pac-history-player-name {
        color: #64b5f6;
      }
      
      .pac-history-player-summary {
        display: flex;
        align-items: center;
        gap: 0.7vmin;
        font-size: clamp(9px, 1.0vmin, 14px);
      }
      
      .pac-history-rolls {
        color: #888;
      }
      
      .pac-history-level {
        color: #64b5f6;
        font-size: clamp(9px, 0.9vmin, 12px);
      }
      
      .pac-history-lucky-count {
        color: #4caf50;
      }
      
      .pac-history-unlucky-count {
        color: #f44336;
      }
      
      .pac-history-expand-icon {
        font-size: clamp(9px, 0.9vmin, 12px);
        color: #666;
        transition: transform 0.2s;
      }
      
      .pac-history-player.expanded .pac-history-expand-icon {
        transform: rotate(180deg);
      }
      
      .pac-history-player-content {
        padding: 0 1.1vmin 1.1vmin;
        border-top: 1px solid rgba(255,255,255,0.08);
      }
      
      .pac-history-level-breakdown {
        font-size: clamp(9px, 0.8vmin, 11px);
        color: #666;
        padding: 0.6vmin 0;
        font-family: monospace;
      }
      
      .pac-history-section {
        margin-top: 0.9vmin;
      }
      
      .pac-history-section-title {
        font-size: clamp(9px, 0.9vmin, 12px);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 0.6vmin;
        padding-bottom: 0.37vmin;
        border-bottom: 1px solid rgba(255,255,255,0.08);
      }
      
      .pac-history-section.lucky .pac-history-section-title {
        color: #4caf50;
      }
      
      .pac-history-section.unlucky .pac-history-section-title {
        color: #f44336;
      }
      
      .pac-history-list {
        display: flex;
        flex-direction: column;
        gap: 0.28vmin;
      }
      
      .pac-history-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.37vmin 0.7vmin;
        border-radius: 0.37vmin;
        font-size: clamp(9px, 0.9vmin, 12px);
      }
      
      .pac-history-section.lucky .pac-history-item {
        background: rgba(76, 175, 80, 0.12);
      }
      
      .pac-history-section.unlucky .pac-history-item {
        background: rgba(244, 67, 54, 0.12);
      }
      
      .pac-history-pokemon {
        font-weight: 600;
        color: #e0e0e0;
        font-size: clamp(9px, 0.9vmin, 12px);
      }
      
      .pac-history-stats-row {
        display: flex;
        gap: 0.6vmin;
        font-size: clamp(9px, 0.8vmin, 11px);
      }
      
      .pac-history-seen {
        color: #64b5f6;
      }
      
      .pac-history-expected {
        color: #666;
      }
      
      .pac-history-diff {
        font-weight: 600;
      }
      
      .pac-history-diff.positive {
        color: #4caf50;
      }
      
      .pac-history-diff.negative {
        color: #f44336;
      }
      
      .pac-history-empty {
        color: #666;
        font-size: clamp(9px, 1.0vmin, 14px);
        font-style: italic;
        padding: 1.1vmin 0.7vmin;
        text-align: center;
      }
      
      /* Analytics Tab System (v3.2.1) */
      .pac-analytics-tabs {
        display: flex;
        gap: 0.37vmin;
        margin-bottom: 1.1vmin;
        padding-bottom: 0.7vmin;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        flex-shrink: 0;
      }
      
      .pac-analytics-tab {
        flex: 1;
        padding: 0.7vmin 1.1vmin;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 0.6vmin;
        color: #888;
        font-size: clamp(9px, 1.0vmin, 14px);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        text-align: center;
      }
      
      .pac-analytics-tab:hover {
        background: rgba(255,255,255,0.1);
        color: #e0e0e0;
      }
      
      .pac-analytics-tab.active {
        background: rgba(100, 181, 246, 0.2);
        border-color: rgba(100, 181, 246, 0.4);
        color: #64b5f6;
      }
      
      .pac-analytics-tab.analytics-btn {
        background: rgba(255,255,255,0.9);
        border-color: rgba(255,255,255,0.95);
        color: #333;
      }
      
      .pac-analytics-tab.analytics-btn:hover {
        background: #fff;
        color: #000;
      }
      
      .pac-analytics-tab.analytics-btn.active {
        background: #fff;
        border-color: #64b5f6;
        color: #000;
        box-shadow: 0 0 1.1vmin rgba(100, 181, 246, 0.4);
      }
      
      .pac-analytics-content {
        display: none;
        flex-direction: column;
        flex: 1;
        min-height: 0;
      }
      
      .pac-analytics-content.active {
        display: flex;
      }
      
      /* Analytics Panel - White Theme */
      .pac-analytics-panel {
        background: #ffffff;
        border-radius: 0.7vmin;
        padding: 1.5vmin;
        color: #1a1a2e;
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      
      .pac-analytics-panel::-webkit-scrollbar {
        display: none;
      }
      
      .pac-analytics-section {
        margin-bottom: 1.9vmin;
      }
      
      .pac-analytics-section:last-child {
        margin-bottom: 0;
      }
      
      .pac-analytics-title {
        font-size: clamp(9px, 1.2vmin, 16px);
        font-weight: 700;
        color: #1a1a2e;
        margin-bottom: 1.1vmin;
        padding-bottom: 0.6vmin;
        border-bottom: 2px solid #64b5f6;
      }
      
      /* Luck Gauge */
      .pac-luck-gauge {
        display: flex;
        align-items: center;
        gap: 1.1vmin;
        margin-bottom: 1.5vmin;
        padding: 1.1vmin;
        background: #f5f5f5;
        border-radius: 0.7vmin;
      }
      
      .pac-luck-gauge-bar {
        flex: 1;
        height: 2.2vmin;
        background: linear-gradient(90deg, #f44336 0%, #ff9800 25%, #ffeb3b 50%, #8bc34a 75%, #4caf50 100%);
        border-radius: 1.1vmin;
        position: relative;
        overflow: hidden;
      }
      
      .pac-luck-gauge-marker {
        position: absolute;
        top: -0.37vmin;
        width: 0.37vmin;
        height: 3.0vmin;
        background: #1a1a2e;
        border-radius: 2px;
        transform: translateX(-50%);
        box-shadow: 0 0 0.7vmin rgba(0,0,0,0.3);
        transition: left 0.5s ease-out;
      }
      
      .pac-luck-gauge-labels {
        display: flex;
        justify-content: space-between;
        font-size: clamp(9px, 0.8vmin, 11px);
        color: #666;
        margin-top: 0.37vmin;
      }
      
      .pac-luck-score {
        font-size: clamp(19px, 2.6vmin, 36px);
        font-weight: 800;
        min-width: 6.5vmin;
        text-align: center;
        transition: color 0.3s ease;
      }
      
      .pac-luck-score.lucky {
        color: #4caf50;
      }
      
      .pac-luck-score.unlucky {
        color: #f44336;
      }
      
      .pac-luck-score.neutral {
        color: #666;
      }
      
      /* Rarity Charts - Horizontal Bars */
      .pac-rarity-charts {
        display: flex;
        flex-direction: column;
        gap: 1.1vmin;
      }
      
      .pac-rarity-chart {
        background: #f5f5f5;
        border-radius: 0.7vmin;
        padding: 1.1vmin;
      }
      
      .pac-rarity-chart-title {
        font-size: clamp(9px, 1.0vmin, 14px);
        font-weight: 600;
        color: #333;
        margin-bottom: 0.7vmin;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .pac-rarity-chart-diff {
        font-size: clamp(9px, 1.1vmin, 15px);
        font-weight: 700;
      }
      
      .pac-rarity-chart-diff.positive {
        color: #4caf50;
      }
      
      .pac-rarity-chart-diff.negative {
        color: #f44336;
      }
      
      .pac-chart-horizontal {
        display: flex;
        flex-direction: column;
        gap: 0.37vmin;
      }
      
      .pac-chart-row {
        display: flex;
        align-items: center;
        gap: 0.7vmin;
        height: 2.2vmin;
      }
      
      .pac-chart-row-label {
        width: 2.6vmin;
        font-size: clamp(9px, 0.8vmin, 11px);
        color: #666;
        text-align: right;
        flex-shrink: 0;
      }
      
      .pac-chart-bar-h {
        height: 1.9vmin;
        border-radius: 0.37vmin;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 0.6vmin;
        min-width: 2.8vmin;
        transition: width 0.3s ease;
      }
      
      .pac-chart-bar-h.expected {
        background: linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%);
        border: 1px solid #90caf9;
      }
      
      .pac-chart-bar-h.actual {
        background: linear-gradient(90deg, #64b5f6 0%, #42a5f5 100%);
      }
      
      .pac-chart-bar-h.actual.over {
        background: linear-gradient(90deg, #81c784 0%, #4caf50 100%);
      }
      
      .pac-chart-bar-h.actual.under {
        background: linear-gradient(90deg, #e57373 0%, #f44336 100%);
      }
      
      .pac-chart-bar-value {
        font-size: clamp(9px, 0.9vmin, 12px);
        font-weight: 700;
        color: #fff;
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
      }
      
      .pac-chart-bar-h.expected .pac-chart-bar-value {
        color: #1565c0;
        text-shadow: none;
      }
      
      /* Level Breakdown */
      .pac-level-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.7vmin;
      }
      
      .pac-level-card {
        background: #f5f5f5;
        border-radius: 0.6vmin;
        padding: 0.7vmin;
        text-align: center;
      }
      
      .pac-level-card-header {
        font-size: clamp(9px, 1.0vmin, 14px);
        font-weight: 700;
        color: #64b5f6;
        margin-bottom: 0.37vmin;
      }
      
      .pac-level-card-rolls {
        font-size: clamp(12px, 1.7vmin, 23px);
        font-weight: 800;
        color: #1a1a2e;
      }
      
      .pac-level-card-label {
        font-size: clamp(9px, 0.8vmin, 11px);
        color: #888;
      }
      
      /* Narrative Summary */
      .pac-narrative {
        background: #f5f5f5;
        border-radius: 0.7vmin;
        padding: 1.1vmin;
        font-size: clamp(9px, 1.1vmin, 15px);
        line-height: 1.6;
        color: #333;
      }
      
      .pac-narrative-highlight {
        font-weight: 700;
      }
      
      .pac-narrative-highlight.lucky {
        color: #4caf50;
      }
      
      .pac-narrative-highlight.unlucky {
        color: #f44336;
      }
      
      .pac-narrative-highlight.neutral {
        color: #64b5f6;
      }
      
      .pac-narrative p {
        margin: 0 0 0.7vmin 0;
      }
      
      .pac-narrative p:last-child {
        margin-bottom: 0;
      }
      
      /* Analytics Disclaimer */
      .pac-analytics-disclaimer {
        background: rgba(255, 152, 0, 0.1);
        border: 1px solid rgba(255, 152, 0, 0.3);
        border-radius: 0.6vmin;
        padding: 0.7vmin 1.1vmin;
        font-size: clamp(9px, 0.9vmin, 12px);
        color: #f57c00;
        margin-bottom: 1.1vmin;
        text-align: center;
        flex-shrink: 0;
      }
      
      /* Fishing Tab Styles */
      .pac-analytics-tab.fishing-btn {
        background: rgba(100, 181, 246, 0.15);
        border-color: rgba(100, 181, 246, 0.3);
        color: #64b5f6;
      }
      
      .pac-analytics-tab.fishing-btn:hover {
        background: rgba(100, 181, 246, 0.25);
        color: #90caf9;
      }
      
      .pac-analytics-tab.fishing-btn.active {
        background: rgba(100, 181, 246, 0.3);
        border-color: #64b5f6;
        color: #64b5f6;
        box-shadow: 0 0 1.1vmin rgba(100, 181, 246, 0.4);
      }
      
      .pac-fishing-disclaimer {
        background: rgba(255, 152, 0, 0.15);
        border: 1px solid rgba(255, 152, 0, 0.4);
        border-radius: 0.6vmin;
        padding: 0.9vmin 1.1vmin;
        font-size: clamp(9px, 1.0vmin, 14px);
        color: #ffb74d;
        margin-bottom: 1.1vmin;
        text-align: center;
        flex-shrink: 0;
        font-weight: 600;
      }
      
      .pac-fishing-panel {
        background: #ffffff;
        border-radius: 0.7vmin;
        padding: 1.5vmin;
        color: #1a1a2e;
        flex: 1;
        overflow-y: auto;
      }
      
      .pac-fishing-section {
        margin-bottom: 1.5vmin;
      }
      
      .pac-fishing-section:last-child {
        margin-bottom: 0;
      }
      
      .pac-fishing-title {
        font-size: clamp(9px, 1.2vmin, 16px);
        font-weight: 700;
        margin-bottom: 0.9vmin;
        color: #1a1a2e;
      }
      
      .pac-fishing-rod-select {
        display: flex;
        gap: 0.6vmin;
        margin-bottom: 0.7vmin;
      }
      
      .pac-rod-btn {
        flex: 1;
        padding: 0.7vmin 0.6vmin;
        background: #f0f0f0;
        border: 2px solid #ddd;
        border-radius: 0.6vmin;
        font-size: clamp(9px, 0.9vmin, 12px);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        color: #666;
      }
      
      .pac-rod-btn:hover {
        background: #e0e0e0;
        border-color: #64b5f6;
      }
      
      .pac-rod-btn.active {
        background: linear-gradient(135deg, #64b5f6, #42a5f5);
        border-color: #1e88e5;
        color: white;
      }
      
      .pac-rod-btn[data-rod="old"].active {
        background: linear-gradient(135deg, #8d6e63, #6d4c41);
        border-color: #5d4037;
      }
      
      .pac-rod-btn[data-rod="good"].active {
        background: linear-gradient(135deg, #78909c, #546e7a);
        border-color: #455a64;
      }
      
      .pac-rod-btn[data-rod="super"].active {
        background: linear-gradient(135deg, #ffd54f, #ffb300);
        border-color: #ff8f00;
        color: #333;
      }
      
      .pac-fishing-rod-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        font-size: clamp(9px, 0.8vmin, 11px);
        color: #888;
        padding: 0.6vmin 0.7vmin;
        background: #f5f5f5;
        border-radius: 0.37vmin;
      }
      
      .pac-rod-synergy {
        display: flex;
        align-items: center;
      }
      
      .pac-fishing-odds {
        background: #f5f5f5;
        border-radius: 0.6vmin;
        padding: 0.9vmin;
      }
      
      .pac-fishing-no-rod {
        text-align: center;
        color: #999;
        font-size: clamp(9px, 1.0vmin, 14px);
        font-style: italic;
        padding: 0.7vmin 0;
      }
      
      .pac-fishing-odds-table {
        width: 100%;
        border-collapse: collapse;
        font-size: clamp(9px, 1.0vmin, 14px);
      }
      
      .pac-fishing-odds-table th {
        text-align: left;
        padding: 0.37vmin 0.6vmin;
        border-bottom: 1px solid #ddd;
        font-weight: 600;
        color: #666;
      }
      
      .pac-fishing-odds-table td {
        padding: 0.37vmin 0.6vmin;
        border-bottom: 1px solid #eee;
      }
      
      .pac-fishing-odds-table tr:last-child td {
        border-bottom: none;
      }
      
      .pac-fishing-odds-table .rarity-common { color: #9e9e9e; }
      .pac-fishing-odds-table .rarity-uncommon { color: #4caf50; }
      .pac-fishing-odds-table .rarity-rare { color: #2196f3; }
      .pac-fishing-odds-table .rarity-epic { color: #9c27b0; }
      .pac-fishing-odds-table .rarity-ultra { color: #f44336; }
      .pac-fishing-odds-table .rarity-special { color: #ff9800; font-weight: 600; }
      
      .pac-fishing-special-note {
        font-size: clamp(9px, 0.9vmin, 12px);
        color: #ff9800;
        margin-top: 0.6vmin;
        text-align: center;
        font-style: italic;
      }
      
      .pac-fishing-toggle-row {
        margin-bottom: 0.9vmin;
      }
      
      .pac-fishing-checkbox {
        display: flex;
        align-items: center;
        gap: 0.7vmin;
        font-size: clamp(9px, 1.0vmin, 14px);
        color: #666;
        cursor: pointer;
      }
      
      .pac-fishing-checkbox input {
        width: 1.5vmin;
        height: 1.5vmin;
        cursor: pointer;
      }
      
      .pac-fishing-pool {
        background: #f5f5f5;
        border-radius: 0.6vmin;
        padding: 0.9vmin;
        max-height: 37.0vmin;
        overflow-y: auto;
      }
      
      .pac-fishing-pool::-webkit-scrollbar {
        width: 0.6vmin;
      }
      
      .pac-fishing-pool::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 0.28vmin;
      }
      
      .pac-fishing-rarity-group {
        margin-bottom: 1.1vmin;
        padding-top: 0.37vmin;
      }
      
      .pac-fishing-rarity-group:first-child {
        padding-top: 2.2vmin;
      }
      
      .pac-fishing-rarity-group:last-child {
        margin-bottom: 0;
      }
      
      .pac-fishing-rarity-label {
        font-size: clamp(9px, 1.0vmin, 14px);
        font-weight: 600;
        margin-bottom: 0.37vmin;
        padding-bottom: 2px;
        border-bottom: 1px solid #ddd;
      }
      
      .pac-fishing-rarity-label.common { color: #9e9e9e; }
      .pac-fishing-rarity-label.uncommon { color: #4caf50; }
      .pac-fishing-rarity-label.rare { color: #2196f3; }
      .pac-fishing-rarity-label.epic { color: #9c27b0; }
      
      .pac-fishing-pokemon-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6vmin;
      }
      
      .pac-fishing-pokemon {
        font-size: clamp(9px, 0.9vmin, 12px);
        padding: 2px 0.6vmin;
        background: #fff;
        border-radius: 0.28vmin;
        border: 1px solid #ddd;
        color: #333;
        cursor: pointer;
        position: relative;
      }
      
      .pac-fishing-pokemon:hover {
        border-color: #64b5f6;
        background: #e3f2fd;
      }
      
      .pac-fishing-pokemon .pac-fish-tooltip {
        display: none;
        position: absolute;
        bottom: calc(100% + 0.7vmin);
        left: 50%;
        transform: translateX(-50%);
        background: #ffffff;
        color: #000000;
        padding: 0.7vmin 1.1vmin;
        border-radius: 0.6vmin;
        font-size: clamp(9px, 1.1vmin, 15px);
        font-weight: 600;
        white-space: nowrap;
        z-index: 10000;
        box-shadow: 0 0.37vmin 1.1vmin rgba(0,0,0,0.4);
        pointer-events: none;
      }
      
      .pac-fishing-pokemon .pac-fish-tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 0.6vmin solid transparent;
        border-top-color: #ffffff;
      }
      
      .pac-fishing-pokemon:hover .pac-fish-tooltip {
        display: block;
      }
      
      .pac-fishing-pokemon.regional {
        border-color: #ff9800;
        background: rgba(255, 152, 0, 0.1);
      }
      
      .pac-fishing-pokemon.additional {
        border-color: #9c27b0;
        background: rgba(156, 39, 176, 0.1);
      }
      
      .pac-fishing-source-legend {
        display: flex;
        gap: 1.1vmin;
        margin-top: 0.7vmin;
        font-size: clamp(9px, 0.8vmin, 11px);
        color: #888;
      }
      
      .pac-fishing-source-legend span {
        display: flex;
        align-items: center;
        gap: 0.37vmin;
      }
      
      .pac-fishing-source-legend .dot {
        width: 0.7vmin;
        height: 0.7vmin;
        border-radius: 2px;
      }
      
      .pac-fishing-source-legend .dot.base {
        background: #ddd;
      }
      
      .pac-fishing-source-legend .dot.regional {
        background: #ff9800;
      }
      
      .pac-fishing-source-legend .dot.additional {
        background: #9c27b0;
      }
      
      .pac-fishing-note {
        margin-top: 1.1vmin;
        padding: 0.7vmin 0.9vmin;
        background: rgba(100, 181, 246, 0.15);
        border: 1px solid rgba(100, 181, 246, 0.3);
        border-radius: 0.37vmin;
        font-size: clamp(9px, 0.9vmin, 12px);
        color: #1976d2;
        text-align: center;
      }

      /* Top Pokemon Grid */
      .pac-top-pokemon-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.7vmin;
      }
      
      .pac-top-pokemon-card {
        background: #f5f5f5;
        border-radius: 0.6vmin;
        padding: 0.7vmin;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .pac-top-pokemon-name {
        font-size: clamp(9px, 1.0vmin, 14px);
        font-weight: 600;
        color: #1a1a2e;
      }
      
      .pac-top-pokemon-stats {
        text-align: right;
        font-size: clamp(9px, 0.9vmin, 12px);
      }
      
      .pac-top-pokemon-seen {
        color: #64b5f6;
        font-weight: 600;
      }
      
      .pac-top-pokemon-diff {
        font-weight: 700;
      }
      
      .pac-top-pokemon-diff.positive {
        color: #4caf50;
      }
      
      .pac-top-pokemon-diff.negative {
        color: #f44336;
      }
      
      /* Wild Pokemon Section */
      .pac-wild-section {
        padding: 0.7vmin 0;
      }
      
      .pac-wild-total {
        font-size: clamp(9px, 1.1vmin, 15px);
        color: #666;
        margin-bottom: 0.9vmin;
        padding: 0.7vmin 1.1vmin;
        background: #f0f7f0;
        border-radius: 0.6vmin;
        border-left: 0.28vmin solid #4caf50;
      }
      
      .pac-wild-total strong {
        color: #2e7d32;
        font-size: clamp(9px, 1.3vmin, 18px);
      }
      
      .pac-wild-pokemon-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.6vmin;
      }
      
      .pac-wild-pokemon-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.7vmin 0.9vmin;
        background: #f5f5f5;
        border-radius: 0.6vmin;
        border-left: 0.28vmin solid #9e9e9e;
      }
      
      .pac-wild-pokemon-card.common { border-left-color: #78909c; }
      .pac-wild-pokemon-card.uncommon { border-left-color: #66bb6a; }
      .pac-wild-pokemon-card.rare { border-left-color: #42a5f5; }
      .pac-wild-pokemon-card.epic { border-left-color: #ab47bc; }
      .pac-wild-pokemon-card.ultra { border-left-color: #ffa726; }
      
      .pac-wild-pokemon-name {
        font-size: clamp(9px, 0.9vmin, 12px);
        font-weight: 600;
        color: #333;
        text-transform: capitalize;
      }
      
      .pac-wild-pokemon-count {
        font-size: clamp(9px, 1.0vmin, 14px);
        font-weight: 700;
        color: #4caf50;
      }
      
      .pac-wild-more {
        font-size: clamp(9px, 0.9vmin, 12px);
        color: #999;
        text-align: center;
        margin-top: 0.6vmin;
        font-style: italic;
      }
      
      /* Ditto Section */
      .pac-ditto-section {
        padding: 0.7vmin 0;
      }
      
      .pac-ditto-stats-card {
        display: flex;
        align-items: center;
        gap: 1.5vmin;
        padding: 1.1vmin 1.5vmin;
        background: linear-gradient(135deg, #e8d5f2 0%, #d4b8e8 100%);
        border-radius: 0.7vmin;
        border-left: 0.37vmin solid #9c27b0;
      }
      
      .pac-ditto-count {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      
      .pac-ditto-number {
        font-size: clamp(19px, 2.6vmin, 36px);
        font-weight: 800;
        color: #7b1fa2;
        line-height: 1;
      }
      
      .pac-ditto-label {
        font-size: clamp(9px, 0.9vmin, 12px);
        color: #9c27b0;
        font-weight: 600;
      }
      
      .pac-ditto-rate {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-left: 1.5vmin;
        border-left: 1px solid rgba(156, 39, 176, 0.3);
      }
      
      .pac-ditto-rate-value {
        font-size: clamp(12px, 1.7vmin, 23px);
        font-weight: 700;
        color: #7b1fa2;
      }
      
      .pac-ditto-rate-label {
        font-size: clamp(9px, 0.8vmin, 11px);
        color: #9c27b0;
      }
      
      .pac-ditto-message {
        margin-left: auto;
        font-size: clamp(9px, 1.1vmin, 15px);
        font-weight: 600;
        color: #7b1fa2;
      }
      
      /* EULA Modal */
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
        backdrop-filter: blur(0.9vmin);
      }
      
      #pac-eula-modal {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border: 2px solid #0f3460;
        border-radius: 1.1vmin;
        max-width: 55.6vmin;
        max-height: 80vh;
        padding: 2.2vmin;
        box-shadow: 0 0.7vmin 3.0vmin rgba(0,0,0,0.6);
        color: #e9e9e9;
        overflow-y: auto;
        position: relative;
        z-index: 2147483647 !important;
      }
      
      .pac-eula-title {
        font-size: clamp(14px, 1.9vmin, 26px);
        font-weight: 600;
        margin-bottom: 1.5vmin;
        color: #64b5f6;
        text-align: center;
      }
      
      .pac-eula-content {
        font-size: clamp(9px, 1.2vmin, 16px);
        line-height: 1.6;
        margin-bottom: 1.9vmin;
        color: #ccc;
      }
      
      .pac-eula-section {
        margin-bottom: 1.5vmin;
      }
      
      .pac-eula-section-title {
        font-size: clamp(9px, 1.3vmin, 18px);
        font-weight: 600;
        color: #64b5f6;
        margin-bottom: 0.7vmin;
      }
      
      .pac-eula-highlight {
        background: rgba(76, 175, 80, 0.2);
        padding: 1.1vmin;
        border-left: 0.28vmin solid #4caf50;
        border-radius: 0.37vmin;
        margin: 1.1vmin 0;
      }
      
      .pac-eula-warning {
        background: rgba(255, 152, 0, 0.2);
        padding: 1.1vmin;
        border-left: 0.28vmin solid #ff9800;
        border-radius: 0.37vmin;
        margin: 1.1vmin 0;
      }
      
      .pac-eula-checkboxes {
        margin: 1.9vmin 0;
      }
      
      .pac-eula-checkbox-row {
        display: flex !important;
        align-items: flex-start !important;
        gap: 1.1vmin !important;
        margin-bottom: 1.1vmin !important;
        padding: 1.1vmin !important;
        background: rgba(255,255,255,0.03) !important;
        border-radius: 0.6vmin !important;
        cursor: pointer !important;
      }
      
      .pac-eula-custom-checkbox {
        width: 3.0vmin !important;
        height: 3.0vmin !important;
        min-width: 3.0vmin !important;
        min-height: 3.0vmin !important;
        background: #000 !important;
        border: 2px solid #4caf50 !important;
        border-radius: 0.6vmin !important;
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
        box-shadow: 0 0 0.7vmin rgba(76, 175, 80, 0.4) !important;
      }
      
      .pac-eula-custom-checkbox.checked {
        background: #4caf50 !important;
        border-color: #66bb6a !important;
      }
      
      .pac-eula-custom-checkbox.checked::after {
        content: '✓' !important;
        color: #fff !important;
        font-size: clamp(16px, 2.2vmin, 30px) !important;
        font-weight: 900 !important;
        line-height: 1 !important;
        text-shadow: 
          -1px -1px 0 #2196f3,
          1px -1px 0 #2196f3,
          -1px 1px 0 #2196f3,
          1px 1px 0 #2196f3,
          0 0 0.6vmin #2196f3 !important;
      }
      
      .pac-eula-checkbox-row label {
        flex: 1;
        cursor: pointer;
        font-size: clamp(9px, 1.2vmin, 16px);
        line-height: 1.5;
      }
      
      .pac-eula-button {
        width: 100%;
        padding: 1.3vmin;
        background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
        border: none;
        border-radius: 0.7vmin;
        color: white;
        font-size: clamp(10px, 1.4vmin, 19px);
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
        box-shadow: 0 0.37vmin 1.1vmin rgba(76, 175, 80, 0.4);
      }
      
      /* Help Modal */
      #pac-help-overlay {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: rgba(0, 0, 0, 0.85) !important;
        z-index: 2147483646 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        backdrop-filter: blur(0.46vmin);
      }
      
      #pac-help-modal {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border: 2px solid #0f3460;
        border-radius: 1.1vmin;
        width: 90%;
        max-width: 64.8vmin;
        max-height: 85vh;
        box-shadow: 0 0.7vmin 3.0vmin rgba(0,0,0,0.6);
        color: #e9e9e9;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      
      .pac-help-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5vmin 1.9vmin;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        background: linear-gradient(90deg, #0f3460 0%, #533483 100%);
      }
      
      .pac-help-title {
        font-size: clamp(12px, 1.7vmin, 23px);
        font-weight: 600;
        color: #fff;
      }
      
      .pac-help-close {
        background: rgba(255,255,255,0.1);
        border: none;
        color: #fff;
        font-size: clamp(14px, 1.9vmin, 26px);
        width: 3.0vmin;
        height: 3.0vmin;
        border-radius: 0.6vmin;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .pac-help-close:hover {
        background: rgba(255,255,255,0.2);
      }
      
      .pac-help-content {
        flex: 1;
        overflow-y: auto;
        padding: 1.9vmin;
        scrollbar-width: thin;
        scrollbar-color: #533483 transparent;
      }
      
      .pac-help-content::-webkit-scrollbar {
        width: 0.6vmin;
      }
      
      .pac-help-content::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .pac-help-content::-webkit-scrollbar-thumb {
        background: #533483;
        border-radius: 0.28vmin;
      }
      
      .pac-help-section {
        margin-bottom: 2.2vmin;
      }
      
      .pac-help-section:last-child {
        margin-bottom: 0;
      }
      
      .pac-help-section-title {
        font-size: clamp(10px, 1.4vmin, 19px);
        font-weight: 600;
        color: #64b5f6;
        margin-bottom: 1.1vmin;
        display: flex;
        align-items: center;
        gap: 0.7vmin;
      }
      
      .pac-help-section-title .emoji {
        font-size: clamp(12px, 1.7vmin, 23px);
      }
      
      .pac-help-feature {
        background: rgba(255,255,255,0.05);
        border-radius: 0.7vmin;
        padding: 1.1vmin 1.3vmin;
        margin-bottom: 0.9vmin;
      }
      
      .pac-help-feature:last-child {
        margin-bottom: 0;
      }
      
      .pac-help-feature-title {
        font-size: clamp(9px, 1.2vmin, 16px);
        font-weight: 600;
        color: #4caf50;
        margin-bottom: 0.6vmin;
      }
      
      .pac-help-feature-desc {
        font-size: clamp(9px, 1.1vmin, 15px);
        color: #aaa;
        line-height: 1.5;
      }
      
      .pac-help-tip {
        background: rgba(100, 181, 246, 0.15);
        border-left: 0.28vmin solid #64b5f6;
        padding: 0.9vmin 1.1vmin;
        border-radius: 0 0.6vmin 0.6vmin 0;
        margin-bottom: 0.9vmin;
      }
      
      .pac-help-tip-title {
        font-size: clamp(9px, 1.1vmin, 15px);
        font-weight: 600;
        color: #64b5f6;
        margin-bottom: 0.37vmin;
      }
      
      .pac-help-tip-text {
        font-size: clamp(9px, 1.0vmin, 14px);
        color: #aaa;
        line-height: 1.4;
      }
      
      .pac-help-shortcut {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.7vmin 1.1vmin;
        background: rgba(255,255,255,0.05);
        border-radius: 0.6vmin;
        margin-bottom: 0.6vmin;
      }
      
      .pac-help-shortcut-key {
        background: #333;
        padding: 0.37vmin 0.9vmin;
        border-radius: 0.37vmin;
        font-family: monospace;
        font-size: clamp(9px, 1.1vmin, 15px);
        color: #64b5f6;
        border: 1px solid #555;
      }
      
      .pac-help-shortcut-desc {
        font-size: clamp(9px, 1.1vmin, 15px);
        color: #ccc;
      }
      
      .pac-help-version {
        text-align: center;
        padding: 1.5vmin;
        border-top: 1px solid rgba(255,255,255,0.1);
        font-size: clamp(9px, 1.0vmin, 14px);
        color: #666;
      }
      
      .pac-help-version a {
        color: #64b5f6;
        text-decoration: none;
      }
      
      .pac-help-version a:hover {
        text-decoration: underline;
      }
  `;

  // Function to inject styles into the document
  PAC.UI.injectStyles = function() {
    if (document.getElementById('pac-calc-styles')) {
      return; // Already injected
    }
    const style = document.createElement('style');
    style.id = 'pac-calc-styles';
    style.textContent = PAC.UI.CSS;
    document.head.appendChild(style);
    
    if (PAC.DEBUG_MODE) {
      console.log('PAC UI: Styles injected');
    }
  };

  if (PAC.DEBUG_MODE) {
    console.log('PAC UI: Styles module loaded');
  }
})();
