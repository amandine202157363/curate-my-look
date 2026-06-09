(()=>{var q=`
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

  /* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 LEFT PANEL \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
  .cby-panel-left {
    width: 260px; flex-shrink: 0;
    border-right: 1px solid #e0e0e0;
    display: flex; flex-direction: column;
  }

  /* Hero \u2014 shows product photo, then generated outfit */
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

  /* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 RIGHT PANEL \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
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

  /* Individual tile \u2014 3:4 portrait cards */
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
`;(function(){"use strict";let y=window.CBYConfig||{},J=(y.apiUrl||"http://localhost:8000").replace(/\/$/,""),X=y.currency||"USD",$=y.categories||{},G=y.heroImage||"",Y=typeof y.onAddToCart=="function"?y.onAddToCart:null,K={tops:"Tops",bottoms:"Bottoms",shoes:"Shoes",accessories:"Accessories"},l={},s={},N=null,T=!1,U=document.createElement("style");U.textContent=q,document.head.appendChild(U);let S=document.createElement("div");S.className="cby-root";let A=document.createElement("button");A.className="cby-trigger",A.textContent=y.triggerLabel||"Curate My Look";let d=document.createElement("div");d.className="cby-overlay";let g=document.createElement("div");g.className="cby-modal",g.setAttribute("role","dialog"),g.setAttribute("aria-modal","true");let B=document.createElement("div");B.className="cby-header";let I=document.createElement("div");I.className="cby-header-left";let O=document.createElement("span");O.className="cby-title",O.textContent="Curate My Look";let H=document.createElement("span");H.className="cby-hint",H.textContent="Select items to build your outfit";let x=document.createElement("button");x.className="cby-close",x.setAttribute("aria-label","Close"),x.textContent="\xD7",I.appendChild(O),I.appendChild(H),B.appendChild(I),B.appendChild(x);let j=document.createElement("div");j.className="cby-body";let v=document.createElement("div");v.className="cby-panel-left";let z=document.createElement("div");z.className="cby-hero";let i=document.createElement("img");i.className="cby-hero-img",i.src=G,i.alt="Outfit preview";let E=document.createElement("div");E.className="cby-spinner-wrap",E.innerHTML=`
    <div class="cby-spinner-ring"></div>
    <div class="cby-spinner-text">Generating look\u2026</div>
  `,z.appendChild(i),z.appendChild(E);let w=document.createElement("div");w.className="cby-price-panel";let M=document.createElement("div");M.className="cby-panel-btns";let c=document.createElement("button");c.className="cby-action-btn cby-btn-generate",c.textContent="Generate Look",c.disabled=!0;let C=document.createElement("button");C.className="cby-action-btn cby-btn-cart",C.textContent="Add All to Cart",M.appendChild(c),M.appendChild(C);let k=document.createElement("div");k.className="cby-error",v.appendChild(z),v.appendChild(w),v.appendChild(M),v.appendChild(k);let P=document.createElement("div");P.className="cby-panel-right",j.appendChild(v),j.appendChild(P),g.appendChild(B),g.appendChild(j),d.appendChild(g),S.appendChild(A),S.appendChild(d),document.body.appendChild(S);function V(e){return new Intl.NumberFormat("en-US",{style:"currency",currency:X}).format(e)}function W(){w.innerHTML="";let e=Object.values(l).filter(Boolean);if(!e.length){let n=document.createElement("div");n.className="cby-price-empty",n.textContent="No items selected yet",w.appendChild(n);return}let t=0;e.forEach(function(n){t+=n.price;let o=document.createElement("div");o.className="cby-price-row",o.innerHTML=`<span>${n.name}</span><span>${V(n.price)}</span>`,w.appendChild(o)});let a=document.createElement("div");a.className="cby-price-total",a.innerHTML=`<span>Total</span><span>${V(t)}</span>`,w.appendChild(a)}function D(){let e=Object.values(l).filter(Boolean).length;c.disabled=e===0||T}function Q(e,t){s[e]=0;let n=document.createElement("div");n.className="cby-cat-section",n.dataset.cat=e;let o=document.createElement("div");o.className="cby-cat-header";let f=document.createElement("span");f.className="cby-cat-label",f.textContent=K[e]||e;let r=document.createElement("span");r.className="cby-cat-badge",r.dataset.cat=e,r.textContent="1",o.appendChild(f),o.appendChild(r);let m=document.createElement("div");m.className="cby-tile-row";let p=document.createElement("button");p.className="cby-swipe-btn",p.setAttribute("aria-label","Previous"),p.textContent="\u2039",p.disabled=!0;let _=document.createElement("div");_.className="cby-tiles-wrap";let u=document.createElement("div");u.className="cby-tiles-track",u.dataset.cat=e,t.forEach(function(L){let h=document.createElement("div");h.className="cby-tile",h.dataset.id=L.id,h.dataset.cat=e,h.innerHTML=`
        <img src="${L.image_url}" alt="${L.name}" loading="lazy" />
        <div class="cby-tile-dot"></div>
        <div class="cby-tile-label">${L.name}</div>
      `,h.addEventListener("click",function(){Z(e,L,h,u,r)}),u.appendChild(h)}),_.appendChild(u);let b=document.createElement("button");b.className="cby-swipe-btn",b.setAttribute("aria-label","Next"),b.textContent="\u203A",b.disabled=t.length<=4,p.addEventListener("click",function(){s[e]=Math.max(0,s[e]-1),F(u,e,t.length,4,p,b)}),b.addEventListener("click",function(){s[e]=Math.min(t.length-4,s[e]+1),F(u,e,t.length,4,p,b)}),m.appendChild(p),m.appendChild(_),m.appendChild(b),n.appendChild(o),n.appendChild(m),P.appendChild(n)}function F(e,t,a,n,o,f){let r=e.parentElement.offsetWidth*.25-6,m=s[t]*(r+8);e.style.transform=`translateX(-${m}px)`,o.disabled=s[t]===0,f.disabled=s[t]>=a-n}function Z(e,t,a,n,o){let f=l[e]&&l[e].id===t.id;n.querySelectorAll(".cby-tile").forEach(function(r){r.classList.remove("cby-selected")}),f?(delete l[e],o.classList.remove("cby-visible")):(l[e]=t,a.classList.add("cby-selected"),o.classList.add("cby-visible")),N=null,i.src=G,i.classList.remove("cby-contain"),C.classList.remove("cby-visible"),W(),D()}async function ee(){if(T)return;let e=Object.values(l).filter(Boolean);if(e.length){T=!0,c.disabled=!0,c.textContent="Generating\u2026",E.classList.add("cby-active"),i.style.opacity="0.3",k.classList.remove("cby-visible");try{let t=await fetch(`${J}/generate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:e})});if(!t.ok){let n=await t.json().catch(()=>({}));throw new Error(n.detail||`Error ${t.status}`)}N=(await t.json()).image_url,i.src=N,i.classList.add("cby-contain"),i.style.opacity="1",C.classList.add("cby-visible")}catch(t){k.textContent="Could not generate image. Please try again.",k.classList.add("cby-visible"),i.style.opacity="1",console.error("[CBY]",t)}finally{T=!1,c.textContent=N?"Regenerate":"Generate Look",D(),E.classList.remove("cby-active")}}}function te(){let e=Object.values(l).filter(Boolean);e.length&&(Y?Y(e):(console.info("[CBY] Wire up window.CBYConfig.onAddToCart to handle cart logic:",e),alert(`${e.length} item(s) ready. Set window.CBYConfig.onAddToCart to handle cart.`)))}function ne(){d.classList.add("cby-open"),document.body.style.overflow="hidden",x.focus()}function R(){d.classList.remove("cby-open"),document.body.style.overflow=""}A.addEventListener("click",ne),x.addEventListener("click",R),c.addEventListener("click",ee),C.addEventListener("click",te),d.addEventListener("click",function(e){e.target===d&&R()}),document.addEventListener("keydown",function(e){e.key==="Escape"&&d.classList.contains("cby-open")&&R()}),Object.keys($).forEach(function(e){Q(e,$[e])}),W()})();})();
