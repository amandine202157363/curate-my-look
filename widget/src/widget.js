/**
 * CBY Widget — "Curate By You"
 *
 * This is the entire widget in one file. Brands embed it with a single script tag:
 *
 *   <script>
 *     window.CBYConfig = {
 *       apiUrl: 'https://your-backend.railway.app',
 *       storeId: 'my-store',           // optional, for analytics later
 *       triggerLabel: 'Style This Look', // button text, optional
 *       currency: 'USD',               // optional
 *       onAddToCart: function(items) {  // called when shopper clicks Add to Cart
 *         items.forEach(function(item) {
 *           // use the store's own cart API here, e.g. Shopify's fetch('/cart/add.js')
 *           console.log('add to cart:', item.cart_id, item.name);
 *         });
 *       },
 *       categories: {
 *         tops:        [ { id:'t1', name:'White Tee',    image_url:'...', price:29, cart_id:'sku-t1' }, ... ],
 *         bottoms:     [ ... ],
 *         shoes:       [ ... ],
 *         accessories: [ ... ]
 *       }
 *     };
 *   </script>
 *   <script src="cby.js"></script>
 *
 * The widget reads window.CBYConfig and builds the full UI automatically.
 */

import { CSS } from './styles.js';

(function () {
  'use strict';

  // ─── Config ───────────────────────────────────────────────────────────────

  const config = window.CBYConfig || {};
  const API_URL = (config.apiUrl || 'http://localhost:8000').replace(/\/$/, '');
  const CURRENCY = config.currency || 'USD';
  const TRIGGER_LABEL = config.triggerLabel || '✦ Style This Look';
  const CATEGORIES = config.categories || {};
  const ON_ADD_TO_CART = typeof config.onAddToCart === 'function' ? config.onAddToCart : null;

  const CATEGORY_META = {
    tops:        { label: 'Tops',        icon: '👕' },
    bottoms:     { label: 'Bottoms',     icon: '👖' },
    shoes:       { label: 'Shoes',       icon: '👟' },
    accessories: { label: 'Accessories', icon: '💍' },
  };

  // ─── State ────────────────────────────────────────────────────────────────

  // selectedItems: { [category]: item | null }
  const selectedItems = {};
  let activeCategory = Object.keys(CATEGORIES)[0] || 'tops';
  let generatedImageUrl = null;
  let isGenerating = false;

  // ─── Inject styles ────────────────────────────────────────────────────────

  const styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  // ─── Build DOM ────────────────────────────────────────────────────────────

  // Root wrapper (keeps everything namespaced)
  const root = document.createElement('div');
  root.className = 'cby-root';

  // Trigger button
  const trigger = document.createElement('button');
  trigger.className = 'cby-trigger';
  trigger.textContent = TRIGGER_LABEL;

  // Overlay + popup
  const overlay = document.createElement('div');
  overlay.className = 'cby-overlay';

  const popup = document.createElement('div');
  popup.className = 'cby-popup';
  popup.setAttribute('role', 'dialog');
  popup.setAttribute('aria-modal', 'true');
  popup.setAttribute('aria-label', 'Style your look');

  // ── Header
  const header = document.createElement('div');
  header.className = 'cby-header';
  header.innerHTML = `<h2>Mix & Match Your Look</h2>`;
  const closeBtn = document.createElement('button');
  closeBtn.className = 'cby-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '×';
  header.appendChild(closeBtn);

  // ── Body
  const body = document.createElement('div');
  body.className = 'cby-body';

  // Sidebar (category tabs)
  const sidebar = document.createElement('div');
  sidebar.className = 'cby-sidebar';

  // Grid area (item cards)
  const gridArea = document.createElement('div');
  gridArea.className = 'cby-grid-area';

  // Right preview panel
  const preview = document.createElement('div');
  preview.className = 'cby-preview';
  preview.innerHTML = `<div class="cby-preview-header">Your Look</div>`;
  const selectedList = document.createElement('div');
  selectedList.className = 'cby-selected-items';
  const resultImage = document.createElement('img');
  resultImage.className = 'cby-result-image';
  resultImage.alt = 'AI-generated outfit';
  preview.appendChild(selectedList);
  preview.appendChild(resultImage);

  body.appendChild(sidebar);
  body.appendChild(gridArea);
  body.appendChild(preview);

  // ── Footer
  const footer = document.createElement('div');
  footer.className = 'cby-footer';
  const generateBtn = document.createElement('button');
  generateBtn.className = 'cby-btn cby-btn-generate';
  generateBtn.textContent = 'Generate Look';
  const cartBtn = document.createElement('button');
  cartBtn.className = 'cby-btn cby-btn-cart';
  cartBtn.textContent = 'Add All to Cart';
  const errorMsg = document.createElement('div');
  errorMsg.className = 'cby-error';

  footer.appendChild(generateBtn);
  footer.appendChild(cartBtn);

  popup.appendChild(header);
  popup.appendChild(body);
  popup.appendChild(errorMsg);
  popup.appendChild(footer);

  overlay.appendChild(popup);
  root.appendChild(trigger);
  root.appendChild(overlay);
  document.body.appendChild(root);

  // ─── Render functions ─────────────────────────────────────────────────────

  function renderTabs() {
    sidebar.innerHTML = '';
    Object.keys(CATEGORIES).forEach(function (cat) {
      const meta = CATEGORY_META[cat] || { label: cat, icon: '●' };
      const btn = document.createElement('button');
      btn.className = 'cby-tab' + (cat === activeCategory ? ' cby-active' : '');
      btn.innerHTML = `<span class="cby-tab-icon">${meta.icon}</span>${meta.label}`;
      btn.addEventListener('click', function () {
        activeCategory = cat;
        renderTabs();
        renderGrid();
      });
      sidebar.appendChild(btn);
    });
  }

  function formatPrice(price) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: CURRENCY }).format(price);
  }

  function renderGrid() {
    gridArea.innerHTML = '';
    const items = CATEGORIES[activeCategory] || [];
    if (!items.length) {
      gridArea.innerHTML = '<p style="color:#bbb;font-size:13px;padding:8px;">No items in this category.</p>';
      return;
    }
    const label = document.createElement('div');
    label.className = 'cby-category-label';
    label.textContent = (CATEGORY_META[activeCategory] || {}).label || activeCategory;
    gridArea.appendChild(label);

    const grid = document.createElement('div');
    grid.className = 'cby-grid';

    items.forEach(function (item) {
      const isSelected = selectedItems[activeCategory] && selectedItems[activeCategory].id === item.id;
      const card = document.createElement('div');
      card.className = 'cby-item-card' + (isSelected ? ' cby-selected' : '');
      card.innerHTML = `
        <img src="${item.image_url}" alt="${item.name}" loading="lazy" />
        <div class="cby-item-info">
          <div class="cby-item-name">${item.name}</div>
          <div class="cby-item-price">${formatPrice(item.price)}</div>
        </div>
        <div class="cby-check">✓</div>
      `;
      card.addEventListener('click', function () {
        if (isSelected) {
          delete selectedItems[activeCategory];
        } else {
          selectedItems[activeCategory] = item;
        }
        // Reset generated image when selection changes
        generatedImageUrl = null;
        resultImage.classList.remove('cby-visible');
        cartBtn.classList.remove('cby-visible');
        renderGrid();
        renderPreview();
        updateGenerateBtn();
      });
      grid.appendChild(card);
    });

    gridArea.appendChild(grid);
  }

  function renderPreview() {
    selectedList.innerHTML = '';
    const items = Object.values(selectedItems).filter(Boolean);

    if (!items.length) {
      selectedList.innerHTML = '<p class="cby-empty-state">Select items from each category to build your look.</p>';
      return;
    }

    items.forEach(function (item) {
      const chip = document.createElement('div');
      chip.className = 'cby-selected-chip';
      chip.innerHTML = `
        <img class="cby-chip-img" src="${item.image_url}" alt="${item.name}" />
        <span class="cby-chip-name">${item.name}</span>
      `;
      const removeBtn = document.createElement('button');
      removeBtn.className = 'cby-chip-remove';
      removeBtn.setAttribute('aria-label', `Remove ${item.name}`);
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', function () {
        // Find which category this item belongs to and remove it
        Object.keys(selectedItems).forEach(function (cat) {
          if (selectedItems[cat] && selectedItems[cat].id === item.id) {
            delete selectedItems[cat];
          }
        });
        generatedImageUrl = null;
        resultImage.classList.remove('cby-visible');
        cartBtn.classList.remove('cby-visible');
        renderGrid();
        renderPreview();
        updateGenerateBtn();
      });
      chip.appendChild(removeBtn);
      selectedList.appendChild(chip);
    });
  }

  function updateGenerateBtn() {
    const count = Object.values(selectedItems).filter(Boolean).length;
    generateBtn.disabled = count === 0 || isGenerating;
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.add('cby-visible');
    setTimeout(function () { errorMsg.classList.remove('cby-visible'); }, 5000);
  }

  // ─── API calls ────────────────────────────────────────────────────────────

  async function callGenerate() {
    if (isGenerating) return;
    const items = Object.values(selectedItems).filter(Boolean);
    if (!items.length) return;

    isGenerating = true;
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<span class="cby-spinner"></span>Generating…';
    errorMsg.classList.remove('cby-visible');

    try {
      const response = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `Server error ${response.status}`);
      }

      const data = await response.json();
      generatedImageUrl = data.image_url;

      resultImage.src = generatedImageUrl;
      resultImage.classList.add('cby-visible');
      cartBtn.classList.add('cby-visible');
    } catch (err) {
      showError('Could not generate image. Please try again.');
      console.error('[CBY] Generate error:', err);
    } finally {
      isGenerating = false;
      generateBtn.textContent = 'Regenerate';
      updateGenerateBtn();
    }
  }

  function handleAddToCart() {
    const items = Object.values(selectedItems).filter(Boolean);
    if (!items.length) return;

    if (ON_ADD_TO_CART) {
      ON_ADD_TO_CART(items);
    } else {
      // Fallback: log the items so brands can see what to hook into
      console.info('[CBY] Add to cart called. Wire up window.CBYConfig.onAddToCart to handle these:', items);
      alert(`${items.length} item(s) ready to add! Set window.CBYConfig.onAddToCart to handle cart logic.`);
    }
  }

  // ─── Open / close ─────────────────────────────────────────────────────────

  function openPopup() {
    overlay.classList.add('cby-open');
    document.body.style.overflow = 'hidden'; // prevent background scroll
    closeBtn.focus();
  }

  function closePopup() {
    overlay.classList.remove('cby-open');
    document.body.style.overflow = '';
  }

  // ─── Event listeners ──────────────────────────────────────────────────────

  trigger.addEventListener('click', openPopup);
  closeBtn.addEventListener('click', closePopup);
  generateBtn.addEventListener('click', callGenerate);
  cartBtn.addEventListener('click', handleAddToCart);

  // Close on backdrop click
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closePopup();
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('cby-open')) closePopup();
  });

  // ─── Initial render ───────────────────────────────────────────────────────

  renderTabs();
  renderGrid();
  renderPreview();
  updateGenerateBtn();

})();
