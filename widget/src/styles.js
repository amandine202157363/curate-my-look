/**
 * All CBY widget CSS lives here as a JS string.
 * widget.js injects it into a <style> tag so the widget is fully
 * self-contained — brands don't need to link any stylesheet.
 *
 * We prefix every class with "cby-" to avoid clashing with the host
 * store's own CSS.
 */

export const CSS = `
  /* ---------- Reset inside the widget ---------- */
  .cby-root *, .cby-root *::before, .cby-root *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  /* ---------- Trigger button ---------- */
  .cby-trigger {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9998;
    background: #111;
    color: #fff;
    border: none;
    border-radius: 50px;
    padding: 14px 22px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    transition: transform 0.15s, box-shadow 0.15s;
    letter-spacing: 0.3px;
  }
  .cby-trigger:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(0,0,0,0.35);
  }

  /* ---------- Overlay (dark backdrop) ---------- */
  .cby-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.55);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
  }
  .cby-overlay.cby-open {
    opacity: 1;
    pointer-events: all;
  }

  /* ---------- Popup panel ---------- */
  .cby-popup {
    background: #fff;
    border-radius: 16px;
    width: min(820px, 96vw);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 24px 64px rgba(0,0,0,0.2);
    transform: translateY(16px);
    transition: transform 0.2s;
  }
  .cby-overlay.cby-open .cby-popup {
    transform: translateY(0);
  }

  /* ---------- Header ---------- */
  .cby-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid #f0f0f0;
    flex-shrink: 0;
  }
  .cby-header h2 {
    font-size: 18px;
    font-weight: 700;
    color: #111;
  }
  .cby-close {
    background: none;
    border: none;
    font-size: 22px;
    cursor: pointer;
    color: #888;
    line-height: 1;
    padding: 4px;
    border-radius: 6px;
  }
  .cby-close:hover { color: #111; background: #f5f5f5; }

  /* ---------- Body (tabs + grid, side by side on desktop) ---------- */
  .cby-body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  /* ---------- Left sidebar: category tabs ---------- */
  .cby-sidebar {
    width: 140px;
    border-right: 1px solid #f0f0f0;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    padding: 12px 8px;
    gap: 4px;
  }
  .cby-tab {
    background: none;
    border: none;
    border-radius: 10px;
    padding: 10px 12px;
    text-align: left;
    font-size: 13px;
    font-weight: 500;
    color: #555;
    cursor: pointer;
    transition: background 0.1s, color 0.1s;
  }
  .cby-tab:hover { background: #f5f5f5; }
  .cby-tab.cby-active {
    background: #111;
    color: #fff;
  }
  .cby-tab-icon { margin-right: 6px; }

  /* ---------- Center: item grid ---------- */
  .cby-grid-area {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .cby-category-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #aaa;
  }
  .cby-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }
  .cby-item-card {
    border: 2px solid #eee;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.15s, transform 0.15s;
    background: #fafafa;
  }
  .cby-item-card:hover { transform: translateY(-2px); border-color: #ccc; }
  .cby-item-card.cby-selected { border-color: #111; }
  .cby-item-card img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    display: block;
  }
  .cby-item-info {
    padding: 8px;
  }
  .cby-item-name {
    font-size: 12px;
    font-weight: 600;
    color: #111;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .cby-item-price {
    font-size: 11px;
    color: #888;
    margin-top: 2px;
  }
  .cby-check {
    display: none;
    position: absolute;
    top: 6px;
    right: 6px;
    background: #111;
    color: #fff;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 11px;
    align-items: center;
    justify-content: center;
  }
  .cby-item-card { position: relative; }
  .cby-item-card.cby-selected .cby-check { display: flex; }

  /* ---------- Right panel: outfit preview ---------- */
  .cby-preview {
    width: 200px;
    border-left: 1px solid #f0f0f0;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    overflow: hidden;
  }
  .cby-preview-header {
    padding: 12px 14px 8px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #aaa;
    flex-shrink: 0;
  }
  .cby-selected-items {
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .cby-selected-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f8f8f8;
    border-radius: 10px;
    padding: 6px;
  }
  .cby-chip-img {
    width: 36px;
    height: 36px;
    border-radius: 6px;
    object-fit: cover;
    flex-shrink: 0;
  }
  .cby-chip-name {
    font-size: 11px;
    font-weight: 600;
    color: #111;
    line-height: 1.3;
    flex: 1;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .cby-chip-remove {
    background: none;
    border: none;
    color: #bbb;
    cursor: pointer;
    font-size: 14px;
    padding: 2px;
    flex-shrink: 0;
    line-height: 1;
    border-radius: 4px;
  }
  .cby-chip-remove:hover { color: #555; background: #eee; }
  .cby-empty-state {
    font-size: 12px;
    color: #bbb;
    text-align: center;
    padding: 20px 10px;
    line-height: 1.5;
  }

  /* ---------- AI output image ---------- */
  .cby-result-image {
    width: calc(100% - 20px);
    margin: 0 10px 10px;
    border-radius: 10px;
    object-fit: cover;
    display: none;
  }
  .cby-result-image.cby-visible { display: block; }

  /* ---------- Footer: generate + cart buttons ---------- */
  .cby-footer {
    border-top: 1px solid #f0f0f0;
    padding: 16px 20px;
    display: flex;
    gap: 10px;
    flex-shrink: 0;
  }
  .cby-btn {
    flex: 1;
    border: none;
    border-radius: 10px;
    padding: 13px 16px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.15s;
  }
  .cby-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }
  .cby-btn:hover:not(:disabled) { transform: translateY(-1px); }
  .cby-btn-generate {
    background: #111;
    color: #fff;
  }
  .cby-btn-cart {
    background: #f0f0f0;
    color: #111;
    display: none;
  }
  .cby-btn-cart.cby-visible { display: block; }

  /* ---------- Loading spinner ---------- */
  .cby-spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: cby-spin 0.7s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
  }
  @keyframes cby-spin { to { transform: rotate(360deg); } }

  /* ---------- Error message ---------- */
  .cby-error {
    font-size: 12px;
    color: #d00;
    text-align: center;
    padding: 8px 16px;
    display: none;
  }
  .cby-error.cby-visible { display: block; }

  /* ---------- Mobile: stack sidebar on top ---------- */
  @media (max-width: 600px) {
    .cby-body { flex-direction: column; }
    .cby-sidebar {
      width: 100%;
      flex-direction: row;
      border-right: none;
      border-bottom: 1px solid #f0f0f0;
      padding: 8px;
      overflow-x: auto;
    }
    .cby-preview { width: 100%; border-left: none; border-top: 1px solid #f0f0f0; max-height: 160px; }
  }
`;
