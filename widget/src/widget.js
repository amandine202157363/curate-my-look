/**
 * CBY Widget — "Curate By You"
 * Spec-compliant implementation: three always-visible buttons,
 * hero-area notifications, My Looks sidebar.
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

  // ─── State ─────────────────────────────────────────────────────────────────
  // sel: one selected item per category, or undefined
  const sel = {};
  const offsets = {};
  let curatedImg = null;        // src of current AI-generated image, or null
  let isGenerating = false;
  let savedLooks = [];          // in-memory array (also persisted to localStorage)
  let sidebarOpen = false;
  let notifTimer = null;

  // Restore saved looks from localStorage
  try { savedLooks = JSON.parse(localStorage.getItem('cby_looks_v1') || '[]'); } catch(e) {}

  function persistLooks() {
    try { localStorage.setItem('cby_looks_v1', JSON.stringify(savedLooks.slice(0, 20))); } catch(e) {}
  }

  // ─── Inject styles ─────────────────────────────────────────────────────────
  const styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  // ─── Build DOM ─────────────────────────────────────────────────────────────

  // Trigger button — mounts in mountTo OR body
  const trigger = document.createElement('button');
  trigger.className = 'cby-trigger';
  trigger.textContent = config.triggerLabel || 'Curate My Look';

  if (MOUNT_TO) {
    var mountEl = document.querySelector(MOUNT_TO);
    (mountEl || document.body).appendChild(trigger);
  } else {
    document.body.appendChild(trigger);
  }

  // Overlay — always on body so it's never clipped
  const overlay = document.createElement('div');
  overlay.className = 'cby-overlay';
  document.body.appendChild(overlay);

  // Modal
  const modal = document.createElement('div');
  modal.className = 'cby-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  // ── Header
  const header = document.createElement('div');
  header.className = 'cby-header';
  header.innerHTML = `
    <div class="cby-header-left">
      <span class="cby-title">Curate My Look</span>
      <span class="cby-hint">Select items to build your outfit</span>
    </div>
    <div class="cby-header-right">
      <button class="cby-my-looks-btn" id="cby-my-looks-btn">
        My Looks <span class="cby-looks-count"></span>
      </button>
      <button class="cby-close" aria-label="Close">×</button>
    </div>
  `;

  // ── Body
  const body = document.createElement('div');
  body.className = 'cby-body';

  // ── Left panel
  const panelLeft = document.createElement('div');
  panelLeft.className = 'cby-panel-left';

  // Hero area — image + spinner + not-found + notification
  const hero = document.createElement('div');
  hero.className = 'cby-hero';
  hero.innerHTML = `
    <img id="cby-hero-img" class="cby-hero-img" src="${HERO_IMAGE}" alt="Outfit preview" />
    <div class="cby-hero-spinner" id="cby-hero-spinner">
      <div class="cby-spinner-ring"></div>
      <div class="cby-spinner-text">Generating look…</div>
    </div>
    <div class="cby-hero-nf" id="cby-hero-nf">
      <div class="cby-nf-icon">✕</div>
      <div class="cby-nf-text">Look not available</div>
    </div>
    <div class="cby-hero-notif" id="cby-hero-notif"></div>
  `;

  // Price panel
  const pricePanel = document.createElement('div');
  pricePanel.className = 'cby-price-panel';

  // Action buttons — always visible, in spec order: Save / Curate / Shop
  const panelBtns = document.createElement('div');
  panelBtns.className = 'cby-panel-btns';
  panelBtns.innerHTML = `
    <button class="cby-action-btn cby-btn-solid" id="cby-save-btn">♡ Save My Look</button>
    <button class="cby-action-btn cby-btn-curate" id="cby-curate-btn">Curate My Look</button>
    <button class="cby-action-btn cby-btn-solid" id="cby-shop-btn">Shop My Look</button>
  `;

  panelLeft.appendChild(hero);
  panelLeft.appendChild(pricePanel);
  panelLeft.appendChild(panelBtns);

  // ── Right panel
  const panelRight = document.createElement('div');
  panelRight.className = 'cby-panel-right';

  // ── My Looks sidebar (slides in from right, over right panel only)
  const sidebar = document.createElement('div');
  sidebar.className = 'cby-sidebar';
  sidebar.id = 'cby-sidebar';
  sidebar.innerHTML = `
    <div class="cby-sidebar-header">
      <div class="cby-sidebar-title">My Looks</div>
    </div>
    <div class="cby-sidebar-body" id="cby-sidebar-body">
      <div class="cby-sidebar-empty">No looks saved yet</div>
    </div>
  `;

  body.appendChild(panelLeft);
  body.appendChild(panelRight);
  body.appendChild(sidebar);

  modal.appendChild(header);
  modal.appendChild(body);
  overlay.appendChild(modal);

  // ─── Shorthand refs ────────────────────────────────────────────────────────
  const heroImg    = document.getElementById('cby-hero-img');
  const heroSpinner= document.getElementById('cby-hero-spinner');
  const heroNf     = document.getElementById('cby-hero-nf');
  const heroNotif  = document.getElementById('cby-hero-notif');
  const saveBtn    = document.getElementById('cby-save-btn');
  const curateBtn  = document.getElementById('cby-curate-btn');
  const shopBtn    = document.getElementById('cby-shop-btn');
  const myLooksBtn = document.getElementById('cby-my-looks-btn');
  const sidebarBody= document.getElementById('cby-sidebar-body');
  const closeBtn   = header.querySelector('.cby-close');
  const looksCount = header.querySelector('.cby-looks-count');

  // ─── Notification ──────────────────────────────────────────────────────────

  function showNotif(msg) {
    heroNotif.textContent = msg;
    heroNotif.classList.add('cby-active');
    clearTimeout(notifTimer);
    notifTimer = setTimeout(function () {
      heroNotif.classList.remove('cby-active');
    }, 5000);
  }

  heroNotif.addEventListener('click', function () {
    heroNotif.classList.remove('cby-active');
    clearTimeout(notifTimer);
  });

  // ─── Price panel ───────────────────────────────────────────────────────────

  function formatPrice(p) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: CURRENCY }).format(p);
  }

  function renderPricePanel() {
    pricePanel.innerHTML = '';
    const items = Object.values(sel).filter(Boolean);
    if (!items.length) {
      pricePanel.innerHTML = '<div class="cby-price-empty">No items selected yet</div>';
      return;
    }
    var total = 0;
    items.forEach(function (item) {
      total += item.price;
      var row = document.createElement('div');
      row.className = 'cby-price-row';
      row.innerHTML = '<span>' + item.name + '</span><span>' + formatPrice(item.price) + '</span>';
      pricePanel.appendChild(row);
    });
    var totalRow = document.createElement('div');
    totalRow.className = 'cby-price-total';
    totalRow.innerHTML = '<span>Total</span><span>' + formatPrice(total) + '</span>';
    pricePanel.appendChild(totalRow);
  }

  // ─── refreshButtons — called after every selection change ─────────────────

  function refreshButtons() {
    var count = Object.values(sel).filter(Boolean).length;

    // Curate: CSS-only ready state — NEVER html-disabled
    curateBtn.classList.toggle('cby-ready', count >= 2);
    curateBtn.disabled = false;

    // Shop: disabled only when 0 items selected
    shopBtn.disabled = count < 1;

    // Save: never disabled
    saveBtn.disabled = false;
  }

  function updateLooksCount() {
    looksCount.textContent = savedLooks.length > 0 ? '(' + savedLooks.length + ')' : '';
  }

  // ─── Category tile rows ────────────────────────────────────────────────────

  function buildCategorySection(cat, items) {
    var VISIBLE = 4;
    offsets[cat] = 0;

    var section = document.createElement('div');
    section.className = 'cby-cat-section';

    var catHeader = document.createElement('div');
    catHeader.className = 'cby-cat-header';
    catHeader.innerHTML = '<span class="cby-cat-label">' + (CATEGORY_LABELS[cat] || cat) + '</span>';

    var badge = document.createElement('span');
    badge.className = 'cby-cat-badge';
    badge.dataset.cat = cat;
    badge.textContent = '1';
    catHeader.appendChild(badge);

    var tileRow = document.createElement('div');
    tileRow.className = 'cby-tile-row';

    var prevBtn = document.createElement('button');
    prevBtn.className = 'cby-swipe-btn';
    prevBtn.textContent = '‹';
    prevBtn.disabled = true;

    var tilesWrap = document.createElement('div');
    tilesWrap.className = 'cby-tiles-wrap';

    var track = document.createElement('div');
    track.className = 'cby-tiles-track';
    track.dataset.cat = cat;

    items.forEach(function (item) {
      var tile = document.createElement('div');
      tile.className = 'cby-tile';
      tile.innerHTML =
        '<img src="' + item.image_url + '" alt="' + item.name + '" loading="lazy" />' +
        '<div class="cby-tile-dot"></div>' +
        '<div class="cby-tile-label">' + item.name + '</div>';
      tile.addEventListener('click', function () {
        onTileClick(cat, item, tile, track, badge);
      });
      track.appendChild(tile);
    });

    tilesWrap.appendChild(track);

    var nextBtn = document.createElement('button');
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
    var tileW = track.parentElement.offsetWidth * 0.25 - 6;
    track.style.transform = 'translateX(-' + (offsets[cat] * (tileW + 8)) + 'px)';
    prevBtn.disabled = offsets[cat] === 0;
    nextBtn.disabled = offsets[cat] >= total - visible;
  }

  function onTileClick(cat, item, tile, track, badge) {
    var alreadySelected = sel[cat] && sel[cat].id === item.id;
    track.querySelectorAll('.cby-tile').forEach(function (t) { t.classList.remove('cby-selected'); });

    if (alreadySelected) {
      delete sel[cat];
      badge.classList.remove('cby-visible');
    } else {
      sel[cat] = Object.assign({}, item, { category: cat });
      tile.classList.add('cby-selected');
      badge.classList.add('cby-visible');
    }

    // Reset generated image on selection change
    curatedImg = null;
    heroImg.src = HERO_IMAGE;
    heroImg.classList.remove('cby-contain');
    heroImg.style.opacity = '1';
    heroNf.classList.remove('cby-active');

    renderPricePanel();
    refreshButtons();
  }

  // ─── doSave ────────────────────────────────────────────────────────────────

  function doSave() {
    // Save curatedImg if available, otherwise current hero src
    var imgToSave = curatedImg || heroImg.src;
    var items = Object.values(sel).filter(Boolean);

    savedLooks.unshift({
      img: imgToSave,
      items: items,
      saved_at: Date.now(),
    });
    persistLooks();
    updateLooksCount();
    renderSidebar();
    showNotif('Added to My Looks');
  }

  // ─── doCurate ──────────────────────────────────────────────────────────────

  async function doCurate() {
    if (isGenerating) return;
    var items = Object.values(sel).filter(Boolean);
    var count = items.length;

    if (count < 2) {
      var need = 2 - count;
      showNotif('Select ' + need + ' more item' + (need > 1 ? 's' : '') + ' to generate your look');
      return;
    }

    isGenerating = true;
    curateBtn.disabled = false; // always false per spec
    heroImg.style.opacity = '0';
    heroSpinner.classList.add('cby-active');
    heroNf.classList.remove('cby-active');

    try {
      var res = await fetch(API_URL + '/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items }),
      });
      if (!res.ok) {
        var err = await res.json().catch(function() { return {}; });
        throw new Error(err.detail || 'Error ' + res.status);
      }
      var data = await res.json();
      curatedImg = data.image_url;

      heroImg.src = curatedImg;
      heroImg.classList.add('cby-contain');
      heroImg.style.opacity = '1';
    } catch (e) {
      curatedImg = null;
      heroImg.style.opacity = '0';
      heroNf.classList.add('cby-active');
      showNotif('Could not generate image. Please try again.');
      console.error('[CBY]', e);
    } finally {
      isGenerating = false;
      heroSpinner.classList.remove('cby-active');
      refreshButtons();
    }
  }

  // ─── doShop ────────────────────────────────────────────────────────────────

  function doShop() {
    var items = Object.values(sel).filter(Boolean);
    var count = items.length;
    if (count < 1) return;

    showNotif(count + ' item' + (count > 1 ? 's' : '') + ' added to your basket!');

    if (ON_ADD_TO_CART) ON_ADD_TO_CART(items);
    else console.info('[CBY] Set window.CBYConfig.onAddToCart to handle cart logic:', items);

    setTimeout(closeModal, 5200);
  }

  // ─── My Looks sidebar ──────────────────────────────────────────────────────

  function renderSidebar() {
    sidebarBody.innerHTML = '';
    if (!savedLooks.length) {
      sidebarBody.innerHTML = '<div class="cby-sidebar-empty">No looks saved yet</div>';
      return;
    }
    savedLooks.forEach(function (look, idx) {
      var thumb = document.createElement('div');
      thumb.className = 'cby-look-thumb';
      thumb.innerHTML = '<img src="' + look.img + '" alt="Saved look" />';
      thumb.addEventListener('click', function () { selectLook(idx); });
      sidebarBody.appendChild(thumb);
    });
  }

  function selectLook(idx) {
    var look = savedLooks[idx];
    if (!look) return;

    // Clear current selection state + tile highlights
    Object.keys(sel).forEach(function(k) { delete sel[k]; });
    panelRight.querySelectorAll('.cby-tile').forEach(function(t) { t.classList.remove('cby-selected'); });
    panelRight.querySelectorAll('.cby-cat-badge').forEach(function(b) { b.classList.remove('cby-visible'); });

    // Restore selection state
    look.items.forEach(function (item) {
      sel[item.category] = item;
      // Visually mark the right tile as selected
      var track = panelRight.querySelector('.cby-tiles-track[data-cat="' + item.category + '"]');
      if (track) {
        track.querySelectorAll('.cby-tile').forEach(function(t) { t.classList.remove('cby-selected'); });
        track.querySelectorAll('.cby-tile').forEach(function(t) {
          if (t.querySelector('img') && t.querySelector('img').alt === item.name) {
            t.classList.add('cby-selected');
          }
        });
      }
      var badge = panelRight.querySelector('.cby-cat-badge[data-cat="' + item.category + '"]');
      if (badge) badge.classList.add('cby-visible');
    });

    // Restore image
    curatedImg = look.img;
    heroImg.src = look.img;
    heroImg.classList.add('cby-contain');
    heroImg.style.opacity = '1';
    heroNf.classList.remove('cby-active');

    // Mark thumb active
    sidebarBody.querySelectorAll('.cby-look-thumb').forEach(function(t) { t.classList.remove('cby-active'); });
    sidebarBody.querySelectorAll('.cby-look-thumb')[idx].classList.add('cby-active');

    renderPricePanel();
    refreshButtons();
  }

  function toggleSidebar(e) {
    if (e) e.stopPropagation();
    sidebarOpen = !sidebarOpen;
    sidebar.classList.toggle('cby-open', sidebarOpen);
  }

  // ─── Open / close modal ────────────────────────────────────────────────────

  function openModal() {
    overlay.classList.add('cby-open');
    document.body.style.overflow = 'hidden';
    heroImg.classList.remove('cby-contain');
    heroImg.src = HERO_IMAGE;
    heroImg.style.opacity = '1';
    curatedImg = null;
    heroNf.classList.remove('cby-active');
    renderPricePanel();
    refreshButtons();
    updateLooksCount();
  }

  function closeModal() {
    overlay.classList.remove('cby-open');
    document.body.style.overflow = '';
    if (sidebarOpen) { sidebarOpen = false; sidebar.classList.remove('cby-open'); }
  }

  // ─── Events ────────────────────────────────────────────────────────────────

  trigger.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  saveBtn.addEventListener('click', doSave);
  curateBtn.addEventListener('click', doCurate);
  shopBtn.addEventListener('click', doShop);
  myLooksBtn.addEventListener('click', function(e) {
    renderSidebar();
    toggleSidebar(e);
  });
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
  refreshButtons();
  updateLooksCount();

})();
