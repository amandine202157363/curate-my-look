export const CSS = `
  /* ---------- Reset ---------- */
  .cby-root *, .cby-root *::before, .cby-root *::after {
    box-sizing: border-box; margin: 0; padding: 0;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }

  /* ---------- Trigger button (dropped inline into PDP by brand) ---------- */
  .cby-trigger {
    width: 100%; padding: 14px;
    border: 1px solid #000; background: #fff; color: #000;
    font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
    cursor: pointer; font-family: inherit;
    transition: background 0.15s, color 0.15s;
  }
  .cby-trigger:hover { background: #000; color: #fff; }

  /* ---------- Overlay ---------- */
  .cby-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,0.45);
    display: none; align-items: center; justify-content: center;
  }
  .cby-overlay.cby-open { display: flex; }

  /* ---------- Modal ---------- */
  .cby-modal {
    background: #fff;
    width: 92vw; max-width: 1120px; height: 87vh;
    display: flex; flex-direction: column;
    border: 1px solid #e0e0e0; overflow: hidden;
  }

  /* ---------- Header ---------- */
  .cby-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 22px; border-bottom: 1px solid #e0e0e0; flex-shrink: 0;
  }
  .cby-header-left { display: flex; align-items: center; gap: 14px; }
  .cby-title {
    font-size: 13px; letter-spacing: 0.18em;
    text-transform: uppercase; color: #000; font-weight: 500;
  }
  .cby-hint { font-size: 11px; color: #767676; letter-spacing: 0.04em; }
  .cby-close {
    background: none; border: none; cursor: pointer;
    font-size: 20px; color: #767676; line-height: 1; padding: 4px;
  }
  .cby-close:hover { color: #000; }

  /* ---------- Body ---------- */
  .cby-body { display: flex; flex: 1; overflow: hidden; }

  /* ══════════ LEFT PANEL ══════════ */
  .cby-panel-left {
    width: 260px; flex-shrink: 0;
    border-right: 1px solid #e0e0e0;
    display: flex; flex-direction: column;
  }

  /* Hero — shows product photo, then generated outfit */
  .cby-hero {
    flex: 1; background: #f5f4f1;
    position: relative; overflow: hidden; min-height: 0;
  }
  .cby-hero-img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: opacity 0.3s;
  }
  .cby-hero-img.cby-contain { object-fit: contain; }

  /* Spinner overlay */
  .cby-spinner-wrap {
    display: none; position: absolute; inset: 0;
    background: #f5f4f1; align-items: center; justify-content: center;
    flex-direction: column; gap: 14px;
  }
  .cby-spinner-wrap.cby-active { display: flex; }
  .cby-spinner-ring {
    width: 34px; height: 34px;
    border: 1.5px solid #e0e0e0; border-top-color: #000;
    border-radius: 50%; animation: cby-spin 0.75s linear infinite;
  }
  @keyframes cby-spin { to { transform: rotate(360deg); } }
  .cby-spinner-text {
    font-size: 10px; letter-spacing: 0.12em;
    text-transform: uppercase; color: #767676;
  }

  /* Price summary */
  .cby-price-panel {
    padding: 14px 16px; border-top: 1px solid #e0e0e0; flex-shrink: 0;
    min-height: 60px;
  }
  .cby-price-empty {
    font-size: 11px; color: #b0b0b0; letter-spacing: 0.04em;
  }
  .cby-price-row {
    display: flex; justify-content: space-between;
    font-size: 11px; color: #767676; margin-bottom: 5px; gap: 8px;
  }
  .cby-price-row span:first-child {
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;
  }
  .cby-price-total {
    display: flex; justify-content: space-between;
    font-size: 12px; font-weight: 500; color: #000;
    margin-top: 9px; padding-top: 9px; border-top: 1px solid #e0e0e0;
    letter-spacing: 0.06em; text-transform: uppercase;
  }

  /* Buttons */
  .cby-panel-btns {
    padding: 12px 16px; border-top: 1px solid #e0e0e0;
    display: flex; flex-direction: column; gap: 8px; flex-shrink: 0;
  }
  .cby-action-btn {
    width: 100%; padding: 11px; border: 1px solid #000;
    font-size: 11px; letter-spacing: 0.13em; text-transform: uppercase;
    cursor: pointer; font-family: inherit;
    transition: background 0.15s, color 0.15s, opacity 0.15s;
  }
  .cby-btn-generate { background: #000; color: #fff; }
  .cby-btn-generate:hover:not(:disabled) { background: #333; }
  .cby-btn-generate:disabled { opacity: 0.28; cursor: not-allowed; }
  .cby-btn-cart { background: #fff; color: #000; display: none; }
  .cby-btn-cart.cby-visible { display: block; }
  .cby-btn-cart:hover { background: #000; color: #fff; }

  /* Error */
  .cby-error {
    font-size: 11px; color: #c00; text-align: center;
    padding: 8px 16px; display: none; letter-spacing: 0.04em;
    border-top: 1px solid #e0e0e0; flex-shrink: 0;
  }
  .cby-error.cby-visible { display: block; }

  /* ══════════ RIGHT PANEL ══════════ */
  .cby-panel-right { flex: 1; overflow-y: auto; padding: 22px 26px; }

  /* One category section */
  .cby-cat-section { margin-bottom: 28px; }
  .cby-cat-header {
    display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
  }
  .cby-cat-label {
    font-size: 11px; letter-spacing: 0.14em;
    text-transform: uppercase; color: #000; font-weight: 500;
  }
  .cby-cat-badge {
    width: 17px; height: 17px; background: #000; color: #fff;
    font-size: 10px; border-radius: 50%;
    display: none; align-items: center; justify-content: center;
    font-weight: 500;
  }
  .cby-cat-badge.cby-visible { display: flex; }

  /* Horizontal tile row */
  .cby-tile-row { display: flex; align-items: center; gap: 8px; }
  .cby-swipe-btn {
    width: 28px; height: 28px; background: #fff; border: 1px solid #e0e0e0;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 14px; color: #000; font-family: inherit;
    transition: background 0.15s;
  }
  .cby-swipe-btn:hover:not(:disabled) { background: #f5f4f1; }
  .cby-swipe-btn:disabled { opacity: 0.2; cursor: not-allowed; }

  .cby-tiles-wrap { flex: 1; overflow: hidden; }
  .cby-tiles-track { display: flex; gap: 8px; transition: transform 0.28s ease; }

  /* Individual tile — 3:4 portrait cards */
  .cby-tile {
    flex-shrink: 0; width: calc(25% - 6px); aspect-ratio: 3/4;
    background: #f5f4f1; position: relative; cursor: pointer;
    border: 2px solid transparent; transition: border-color 0.15s; overflow: hidden;
  }
  .cby-tile.cby-selected { border-color: #000; }
  .cby-tile img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .cby-tile-dot {
    display: none; position: absolute; top: 7px; right: 7px;
    width: 9px; height: 9px; background: #000; border-radius: 50%;
  }
  .cby-tile.cby-selected .cby-tile-dot { display: block; }
  .cby-tile-label {
    position: absolute; bottom: 0; left: 0; right: 0;
    background: rgba(255,255,255,0.9); padding: 6px 8px;
    font-size: 10px; letter-spacing: 0.03em; color: #1a1a1a;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    opacity: 0; transition: opacity 0.15s;
  }
  .cby-tile:hover .cby-tile-label { opacity: 1; }

  /* ---------- Mobile ---------- */
  @media (max-width: 640px) {
    .cby-modal { width: 100vw; height: 100vh; }
    .cby-panel-left { width: 180px; }
    .cby-tile { width: calc(33.33% - 6px); }
  }
`;
