/**
 * CBY Widget — "Curate By You"
 *
 * Embed with two script tags:
 *   <script>window.CBYConfig = { apiUrl, categories, mountTo, ... };</script>
 *   <script src="https://your-railway-url/widget/cby.js"></script>
 *
 * Config options:
 *   apiUrl       — your Railway backend URL
 *   categories   — { tops: [...], bottoms: [...], shoes: [...], accessories: [...] }
 *   heroImage    — product photo shown in left panel before generation
 *   currency     — e.g. 'EUR', 'USD', 'GBP'
 *   triggerLabel — text on the button (default: 'Curate My Look')
 *   mountTo      — CSS selector for where to place the button, e.g. '#cby-mount'
 *                  If omitted, button is appended to <body>
 *   onAddToCart  — function(items) called when shopper clicks Shop My Look
 */

import { CSS } from './styles.js';

(function () {
  'use strict';

  // ─── Config ────────────────────────────────────────────────────────────────
  const config     = window.CBYConfig || {};
  const API_URL    = (config.apiUrl || 'http://localhost:8000').replace(/\/$/, '');
  const CURRENCY   = config.currency || 'USD';
  const CATEGORIES = config.categories || {};
  const HERO_IMAGE = config.heroImage || '';
  const MOUNT_TO   = config.mountTo || null;
  const ON_ADD_TO_CART = typeof config.onAddToCart === 'function' ? config.onAddToCart : null;

  const CATEGORY_LABELS = {
    tops: 'Tops', bottoms: 'Bottoms', shoes: 'Shoes', accessories: 'Accessories',
  };

  // ─── localStorage helpers ──────────────────────────────────────────────────
  const STORAGE_KEY = 'cby_looks_v1';

  function getSavedLooks() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  }
  function persistLooks(looks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(looks));
  }
  function addSavedLook(look) {
    const looks = getSavedLooks();
    looks.unshift(look);
    persistLooks(looks.slice(0, 20)); // cap at 20 saved looks
  }
  function removeSavedLook(index) {
    const looks = getSavedLooks();
    looks.splice(index, 1);
    persistLooks(looks);
  }

  // ─── State ─────────────────────────────────────────────────────────────────
  const selected = {};
  const offsets  = {};
  let generatedUrl = null;
  let isGenerating = false;

  // ─── Inject styles ─────────────────────────────────────────────────────────
  const styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  // ─── Trigger button ────────────────────────────────────────────────────────
  // Mounts in mountTo element if specified, otherwise appended to body.
  // The overlay is always on body so it's never clipped by a container.
  const trigger = document.createElement('button');
  trigger.className = 'cby-trigger';
  trigger.textContent = config.triggerLabel || 'Curate My Look';

  if (MOUNT_TO) {
    const mountEl = document.querySelector(MOUNT_TO);
    if (mountEl) mountEl.appendChild(trigger);
    else document.body.appendChild(trigger);
  } else {
    document.body.appendChild(trigger);
  }

  // ─── Overlay (always on body) ──────────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.className = 'cby-overlay';
  document.body.appendChild(overlay);

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
  headerLeft.innerHTML = `
    <span class="cby-title">Curate My Look</span>
    <span class="cby-hint">Select items to build your outfit</span>
  `;

  const headerRight = document.createElement('div');
  headerRight.className = 'cby-header-right';

  // "My Looks" button with saved count badge
  const myLooksBtn = document.createElement('button');
  myLooksBtn.className = 'cby-my-looks-btn';
  myLooksBtn.innerHTML = `My Looks <span class="cby-looks-count"></span>`;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'cby-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '×';

  headerRight.appendChild(myLooksBtn);
  headerRight.appendChild(closeBtn);
  header.appendChild(headerLeft);
  header.appendChild(headerRight);

  // ── Body
  const body = document.createElement('div');
  body.className = 'cby-body';

  // ── Left panel
  const panelLeft = document.createElement('div');
  panelLeft.className = 'cby-panel-left';

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

  const pricePanel = document.createElement('div');
  pricePanel.className = 'cby-price-panel';

  const panelBtns = document.createElement('div');
  panelBtns.className = 'cby-panel-btns';

  const generateBtn = document.createElement('button');
  generateBtn.className = 'cby-action-btn cby-btn-generate';
  generateBtn.textContent = 'Generate Look';
  generateBtn.disabled = true;

  // Save My Look — appears after generation
  const saveBtn = document.createElement('button');
  saveBtn.className = 'cby-action-btn cby-btn-save';
  saveBtn.textContent = 'Save My Look';

  // Shop My Look — appears after generation
  const shopBtn = document.createElement('button');
  shopBtn.className = 'cby-action-btn cby-btn-shop';
  shopBtn.textContent = 'Shop My Look';

  panelBtns.appendChild(generateBtn);
  panelBtns.appendChild(saveBtn);
  panelBtns.appendChild(shopBtn);

  const errorMsg = document.createElement('div');
  errorMsg.className = 'cby-error';

  panelLeft.appendChild(hero);
  panelLeft.appendChild(pricePanel);
  panelLeft.appendChild(panelBtns);
  panelLeft.appendChild(errorMsg);

  // ── Right panel (category tile rows)
  const panelRight = document.createElement('div');
  panelRight.className = 'cby-panel-right';

  // ── My Looks panel (full overlay over both panels)
  const looksPanel = document.createElement('div');
  looksPanel.className = 'cby-looks-panel';

  const looksPanelHeader = document.createElement('div');
  looksPanelHeader.className = 'cby-looks-panel-header';

  const backBtn = document.createElement('button');
  backBtn.className = 'cby-back-btn';
  backBtn.innerHTML = '← Back to styling';

  const looksPanelTitle = document.createElement('span');
  looksPanelTitle.className = 'cby-looks-panel-title';
  looksPanelTitle.textContent = 'My Looks';

  looksPanelHeader.appendChild(backBtn);
  looksPanelHeader.appendChild(looksPanelTitle);

  const looksGrid = document.createElement('div');
  looksGrid.className = 'cby-looks-grid';

  looksPanel.appendChild(looksPanelHeader);
  looksPanel.appendChild(looksGrid);

  body.appendChild(panelLeft);
  body.appendChild(panelRight);
  body.appendChild(looksPanel);

  modal.appendChild(header);
  modal.appendChild(body);
  overlay.appendChild(modal);

  // ─── Render: price summary ─────────────────────────────────────────────────

  function formatPrice(p) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: CURRENCY }).format(p);
  }

  function renderPricePanel() {
    pricePanel.innerHTML = '';
    const items = Object.values(selected).filter(Boolean);
    if (!items.length) {
      pricePanel.innerHTML = '<div class="cby-price-empty">No items selected yet</div>';
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
    const hasGenerated = !!generatedUrl;
    saveBtn.classList.toggle('cby-visible', hasGenerated);
    shopBtn.classList.toggle('cby-visible', hasGenerated);
  }

  function updateLooksCount() {
    const count = getSavedLooks().length;
    const badge = header.querySelector('.cby-looks-count');
    badge.textContent = count > 0 ? `(${count})` : '';
    myLooksBtn.classList.toggle('cby-has-looks', count > 0);
  }

  // ─── Render: category tile rows ────────────────────────────────────────────

  function buildCategorySection(cat, items) {
    const VISIBLE = 4;
    offsets[cat] = 0;

    const section = document.createElement('div');
    section.className = 'cby-cat-section';

    const catHeader = document.createElement('div');
    catHeader.className = 'cby-cat-header';

    const badge = document.createElement('span');
    badge.className = 'cby-cat-badge';
    badge.dataset.cat = cat;
    badge.textContent = '1';

    catHeader.innerHTML = `<span class="cby-cat-label">${CATEGORY_LABELS[cat] || cat}</span>`;
    catHeader.appendChild(badge);

    const tileRow = document.createElement('div');
    tileRow.className = 'cby-tile-row';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'cby-swipe-btn';
    prevBtn.textContent = '‹';
    prevBtn.disabled = true;

    const tilesWrap = document.createElement('div');
    tilesWrap.className = 'cby-tiles-wrap';

    const track = document.createElement('div');
    track.className = 'cby-tiles-track';

    items.forEach(function (item) {
      const tile = document.createElement('div');
      tile.className = 'cby-tile';
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
    nextBtn.textContent = '›';
    nextBtn.disabled = items.length <= VISIBLE;

    prevBtn.addEventListener('click', function () {
      offsets[cat] = Math.max(0, offsets[cat] - 1);
      slideTrack(track, cat, items.length, VISIBLE, prevBtn, nextBtn);
    });
    nextBtn.addEventListener('click', function () {
      offsets[cat] = Math.min(items.length - VISIBLE, offsets[cat] + 1);
      slideTrack(track, cat, items.length, VISIBLE, prevBtn, nextBtn);
    });

    tileRow.appendChild(prevBtn);
    tileRow.appendChild(tilesWrap);
    tileRow.appendChild(nextBtn);
    section.appendChild(catHeader);
    section.appendChild(tileRow);
    panelRight.appendChild(section);
  }

  function slideTrack(track, cat, total, visible, prevBtn, nextBtn) {
    const tileW = track.parentElement.offsetWidth * 0.25 - 6;
    track.style.transform = `translateX(-${offsets[cat] * (tileW + 8)}px)`;
    prevBtn.disabled = offsets[cat] === 0;
    nextBtn.disabled = offsets[cat] >= total - visible;
  }

  function onTileClick(cat, item, tile, track, badge) {
    const alreadySelected = selected[cat] && selected[cat].id === item.id;
    track.querySelectorAll('.cby-tile').forEach(function (t) { t.classList.remove('cby-selected'); });

    if (alreadySelected) {
      delete selected[cat];
      badge.classList.remove('cby-visible');
    } else {
      selected[cat] = item;
      tile.classList.add('cby-selected');
      badge.classList.add('cby-visible');
    }

    // Changing selection resets any generated image
    generatedUrl = null;
    heroImg.src = HERO_IMAGE;
    heroImg.classList.remove('cby-contain');
    renderPricePanel();
    updateButtons();
  }

  // ─── Render: My Looks panel ────────────────────────────────────────────────

  function renderLooksPanel() {
    looksGrid.innerHTML = '';
    const looks = getSavedLooks();

    if (!looks.length) {
      looksGrid.innerHTML = `
        <div class="cby-looks-empty">
          <div class="cby-looks-empty-icon">◻</div>
          <div class="cby-looks-empty-text">No saved looks yet.<br>Generate an outfit and save it here.</div>
        </div>`;
      return;
    }

    looks.forEach(function (look, index) {
      const card = document.createElement('div');
      card.className = 'cby-look-card';

      const total = look.items.reduce(function (s, i) { return s + i.price; }, 0);

      card.innerHTML = `
        <div class="cby-look-img-wrap">
          <img src="${look.image_url}" alt="Saved look" />
        </div>
        <div class="cby-look-info">
          <div class="cby-look-items">${look.items.map(function(i){ return i.name; }).join(', ')}</div>
          <div class="cby-look-price">${formatPrice(total)}</div>
        </div>
        <div class="cby-look-actions">
          <button class="cby-action-btn cby-btn-shop-look">Shop This Look</button>
          <button class="cby-look-delete" aria-label="Remove look">×</button>
        </div>
      `;

      card.querySelector('.cby-btn-shop-look').addEventListener('click', function () {
        if (ON_ADD_TO_CART) {
          ON_ADD_TO_CART(look.items);
        } else {
          alert('[CBY] Set onAddToCart in CBYConfig to handle cart logic.');
        }
      });

      card.querySelector('.cby-look-delete').addEventListener('click', function () {
        removeSavedLook(index);
        updateLooksCount();
        renderLooksPanel();
      });

      looksGrid.appendChild(card);
    });
  }

  function openLooksPanel() {
    renderLooksPanel();
    looksPanel.classList.add('cby-open');
  }

  function closeLooksPanel() {
    looksPanel.classList.remove('cby-open');
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
        const err = await res.json().catch(function () { return {}; });
        throw new Error(err.detail || `Error ${res.status}`);
      }
      const data = await res.json();
      generatedUrl = data.image_url;
      heroImg.src = generatedUrl;
      heroImg.classList.add('cby-contain');
      heroImg.style.opacity = '1';
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

  function handleSave() {
    if (!generatedUrl) return;
    const items = Object.values(selected).filter(Boolean);
    addSavedLook({ image_url: generatedUrl, items: items, saved_at: Date.now() });
    updateLooksCount();

    // Brief confirmation on the button
    saveBtn.textContent = 'Saved ✓';
    saveBtn.disabled = true;
    setTimeout(function () {
      saveBtn.textContent = 'Save My Look';
      saveBtn.disabled = false;
    }, 2000);
  }

  function handleShop() {
    const items = Object.values(selected).filter(Boolean);
    if (!items.length) return;
    if (ON_ADD_TO_CART) {
      ON_ADD_TO_CART(items);
    } else {
      console.info('[CBY] Set window.CBYConfig.onAddToCart to handle cart logic:', items);
      alert(`${items.length} item(s) ready. Set window.CBYConfig.onAddToCart to connect your cart.`);
    }
  }

  // ─── Open / close modal ────────────────────────────────────────────────────

  function openModal() {
    overlay.classList.add('cby-open');
    document.body.style.overflow = 'hidden';
    updateLooksCount();
  }

  function closeModal() {
    overlay.classList.remove('cby-open');
    document.body.style.overflow = '';
    closeLooksPanel();
  }

  // ─── Event listeners ───────────────────────────────────────────────────────

  trigger.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  generateBtn.addEventListener('click', callGenerate);
  saveBtn.addEventListener('click', handleSave);
  shopBtn.addEventListener('click', handleShop);
  myLooksBtn.addEventListener('click', openLooksPanel);
  backBtn.addEventListener('click', closeLooksPanel);
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
  updateButtons();
  updateLooksCount();

})();
