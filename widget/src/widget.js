/**
 * CBY Widget — "Curate By You"
 * Embed with a single script tag after setting window.CBYConfig.
 */

import { CSS } from './styles.js';

(function () {
  'use strict';

  // ─── Config ────────────────────────────────────────────────────────────────
  const config       = window.CBYConfig || {};
  const API_URL      = (config.apiUrl || 'http://localhost:8000').replace(/\/$/, '');
  const CURRENCY     = config.currency || 'USD';
  const CATEGORIES   = config.categories || {};
  const HERO_IMAGE   = config.heroImage || '';   // default product photo shown in left panel
  const ON_ADD_TO_CART = typeof config.onAddToCart === 'function' ? config.onAddToCart : null;

  const CATEGORY_LABELS = {
    tops:        'Tops',
    bottoms:     'Bottoms',
    shoes:       'Shoes',
    accessories: 'Accessories',
  };

  // ─── State ─────────────────────────────────────────────────────────────────
  // One selected item per category, keyed by category name
  const selected  = {};
  // Tile scroll offsets, keyed by category name (how many tiles scrolled right)
  const offsets   = {};
  let generatedUrl  = null;
  let isGenerating  = false;

  // ─── Inject styles ─────────────────────────────────────────────────────────
  const styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  // ─── Root wrapper ──────────────────────────────────────────────────────────
  const root = document.createElement('div');
  root.className = 'cby-root';

  // ─── Trigger button ────────────────────────────────────────────────────────
  const trigger = document.createElement('button');
  trigger.className = 'cby-trigger';
  trigger.textContent = config.triggerLabel || 'Curate My Look';

  // ─── Overlay ───────────────────────────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.className = 'cby-overlay';

  // ─── Modal ─────────────────────────────────────────────────────────────────
  const modal = document.createElement('div');
  modal.className = 'cby-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  // ── Header
  const header = document.createElement('div');
  header.className = 'cby-header';

  const headerLeft = document.createElement('div');
  headerLeft.className = 'cby-header-left';

  const title = document.createElement('span');
  title.className = 'cby-title';
  title.textContent = 'Curate My Look';

  const hint = document.createElement('span');
  hint.className = 'cby-hint';
  hint.textContent = 'Select items to build your outfit';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'cby-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '×';

  headerLeft.appendChild(title);
  headerLeft.appendChild(hint);
  header.appendChild(headerLeft);
  header.appendChild(closeBtn);

  // ── Body
  const body = document.createElement('div');
  body.className = 'cby-body';

  // ── Left panel
  const panelLeft = document.createElement('div');
  panelLeft.className = 'cby-panel-left';

  // Hero image area
  const hero = document.createElement('div');
  hero.className = 'cby-hero';

  const heroImg = document.createElement('img');
  heroImg.className = 'cby-hero-img';
  heroImg.src = HERO_IMAGE;
  heroImg.alt = 'Outfit preview';

  const spinnerWrap = document.createElement('div');
  spinnerWrap.className = 'cby-spinner-wrap';
  spinnerWrap.innerHTML = `
    <div class="cby-spinner-ring"></div>
    <div class="cby-spinner-text">Generating look…</div>
  `;

  hero.appendChild(heroImg);
  hero.appendChild(spinnerWrap);

  // Price panel
  const pricePanel = document.createElement('div');
  pricePanel.className = 'cby-price-panel';

  // Buttons
  const panelBtns = document.createElement('div');
  panelBtns.className = 'cby-panel-btns';

  const generateBtn = document.createElement('button');
  generateBtn.className = 'cby-action-btn cby-btn-generate';
  generateBtn.textContent = 'Generate Look';
  generateBtn.disabled = true;

  const cartBtn = document.createElement('button');
  cartBtn.className = 'cby-action-btn cby-btn-cart';
  cartBtn.textContent = 'Add All to Cart';

  panelBtns.appendChild(generateBtn);
  panelBtns.appendChild(cartBtn);

  // Error message
  const errorMsg = document.createElement('div');
  errorMsg.className = 'cby-error';

  panelLeft.appendChild(hero);
  panelLeft.appendChild(pricePanel);
  panelLeft.appendChild(panelBtns);
  panelLeft.appendChild(errorMsg);

  // ── Right panel (category rows)
  const panelRight = document.createElement('div');
  panelRight.className = 'cby-panel-right';

  body.appendChild(panelLeft);
  body.appendChild(panelRight);

  modal.appendChild(header);
  modal.appendChild(body);
  overlay.appendChild(modal);
  root.appendChild(trigger);
  root.appendChild(overlay);
  document.body.appendChild(root);

  // ─── Render helpers ────────────────────────────────────────────────────────

  function formatPrice(p) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: CURRENCY }).format(p);
  }

  function renderPricePanel() {
    pricePanel.innerHTML = '';
    const items = Object.values(selected).filter(Boolean);

    if (!items.length) {
      const empty = document.createElement('div');
      empty.className = 'cby-price-empty';
      empty.textContent = 'No items selected yet';
      pricePanel.appendChild(empty);
      return;
    }

    let total = 0;
    items.forEach(function (item) {
      total += item.price;
      const row = document.createElement('div');
      row.className = 'cby-price-row';
      row.innerHTML = `<span>${item.name}</span><span>${formatPrice(item.price)}</span>`;
      pricePanel.appendChild(row);
    });

    const totalRow = document.createElement('div');
    totalRow.className = 'cby-price-total';
    totalRow.innerHTML = `<span>Total</span><span>${formatPrice(total)}</span>`;
    pricePanel.appendChild(totalRow);
  }

  function updateButtons() {
    const count = Object.values(selected).filter(Boolean).length;
    generateBtn.disabled = count === 0 || isGenerating;
  }

  // Builds one category section and appends it to panelRight
  function buildCategorySection(cat, items) {
    const TILES_VISIBLE = 4;
    offsets[cat] = 0;

    const section = document.createElement('div');
    section.className = 'cby-cat-section';
    section.dataset.cat = cat;

    // Header row with label + selection badge
    const catHeader = document.createElement('div');
    catHeader.className = 'cby-cat-header';

    const catLabel = document.createElement('span');
    catLabel.className = 'cby-cat-label';
    catLabel.textContent = CATEGORY_LABELS[cat] || cat;

    const badge = document.createElement('span');
    badge.className = 'cby-cat-badge';
    badge.dataset.cat = cat;
    badge.textContent = '1';

    catHeader.appendChild(catLabel);
    catHeader.appendChild(badge);

    // Tile row
    const tileRow = document.createElement('div');
    tileRow.className = 'cby-tile-row';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'cby-swipe-btn';
    prevBtn.setAttribute('aria-label', 'Previous');
    prevBtn.textContent = '‹';
    prevBtn.disabled = true;

    const tilesWrap = document.createElement('div');
    tilesWrap.className = 'cby-tiles-wrap';

    const track = document.createElement('div');
    track.className = 'cby-tiles-track';
    track.dataset.cat = cat;

    items.forEach(function (item) {
      const tile = document.createElement('div');
      tile.className = 'cby-tile';
      tile.dataset.id = item.id;
      tile.dataset.cat = cat;
      tile.innerHTML = `
        <img src="${item.image_url}" alt="${item.name}" loading="lazy" />
        <div class="cby-tile-dot"></div>
        <div class="cby-tile-label">${item.name}</div>
      `;
      tile.addEventListener('click', function () {
        onTileClick(cat, item, tile, track, badge);
      });
      track.appendChild(tile);
    });

    tilesWrap.appendChild(track);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'cby-swipe-btn';
    nextBtn.setAttribute('aria-label', 'Next');
    nextBtn.textContent = '›';
    nextBtn.disabled = items.length <= TILES_VISIBLE;

    // Prev/next scroll logic
    prevBtn.addEventListener('click', function () {
      offsets[cat] = Math.max(0, offsets[cat] - 1);
      updateTrack(track, cat, items.length, TILES_VISIBLE, prevBtn, nextBtn);
    });
    nextBtn.addEventListener('click', function () {
      offsets[cat] = Math.min(items.length - TILES_VISIBLE, offsets[cat] + 1);
      updateTrack(track, cat, items.length, TILES_VISIBLE, prevBtn, nextBtn);
    });

    tileRow.appendChild(prevBtn);
    tileRow.appendChild(tilesWrap);
    tileRow.appendChild(nextBtn);

    section.appendChild(catHeader);
    section.appendChild(tileRow);
    panelRight.appendChild(section);
  }

  function updateTrack(track, cat, total, visible, prevBtn, nextBtn) {
    // Each tile is 25% of the wrap width + 8px gap
    const tileW = track.parentElement.offsetWidth * 0.25 - 6;
    const shift = offsets[cat] * (tileW + 8);
    track.style.transform = `translateX(-${shift}px)`;
    prevBtn.disabled = offsets[cat] === 0;
    nextBtn.disabled = offsets[cat] >= total - visible;
  }

  function onTileClick(cat, item, tile, track, badge) {
    const isAlreadySelected = selected[cat] && selected[cat].id === item.id;

    // Deselect all tiles in this category
    track.querySelectorAll('.cby-tile').forEach(function (t) {
      t.classList.remove('cby-selected');
    });

    if (isAlreadySelected) {
      delete selected[cat];
      badge.classList.remove('cby-visible');
    } else {
      selected[cat] = item;
      tile.classList.add('cby-selected');
      badge.classList.add('cby-visible');
    }

    // Reset generated image when selection changes
    generatedUrl = null;
    heroImg.src = HERO_IMAGE;
    heroImg.classList.remove('cby-contain');
    cartBtn.classList.remove('cby-visible');

    renderPricePanel();
    updateButtons();
  }

  // ─── API ───────────────────────────────────────────────────────────────────

  async function callGenerate() {
    if (isGenerating) return;
    const items = Object.values(selected).filter(Boolean);
    if (!items.length) return;

    isGenerating = true;
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating…';
    spinnerWrap.classList.add('cby-active');
    heroImg.style.opacity = '0.3';
    errorMsg.classList.remove('cby-visible');

    try {
      const res = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Error ${res.status}`);
      }
      const data = await res.json();
      generatedUrl = data.image_url;

      heroImg.src = generatedUrl;
      heroImg.classList.add('cby-contain');
      heroImg.style.opacity = '1';
      cartBtn.classList.add('cby-visible');
    } catch (err) {
      errorMsg.textContent = 'Could not generate image. Please try again.';
      errorMsg.classList.add('cby-visible');
      heroImg.style.opacity = '1';
      console.error('[CBY]', err);
    } finally {
      isGenerating = false;
      generateBtn.textContent = generatedUrl ? 'Regenerate' : 'Generate Look';
      updateButtons();
      spinnerWrap.classList.remove('cby-active');
    }
  }

  function handleAddToCart() {
    const items = Object.values(selected).filter(Boolean);
    if (!items.length) return;
    if (ON_ADD_TO_CART) {
      ON_ADD_TO_CART(items);
    } else {
      console.info('[CBY] Wire up window.CBYConfig.onAddToCart to handle cart logic:', items);
      alert(`${items.length} item(s) ready. Set window.CBYConfig.onAddToCart to handle cart.`);
    }
  }

  // ─── Open / close ──────────────────────────────────────────────────────────

  function openModal() {
    overlay.classList.add('cby-open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    overlay.classList.remove('cby-open');
    document.body.style.overflow = '';
  }

  // ─── Event listeners ───────────────────────────────────────────────────────

  trigger.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  generateBtn.addEventListener('click', callGenerate);
  cartBtn.addEventListener('click', handleAddToCart);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('cby-open')) closeModal();
  });

  // ─── Init ──────────────────────────────────────────────────────────────────

  Object.keys(CATEGORIES).forEach(function (cat) {
    buildCategorySection(cat, CATEGORIES[cat]);
  });
  renderPricePanel();

})();
