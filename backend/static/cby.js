(()=>{var Z=`
  .cby-overlay *, .cby-overlay *::before, .cby-overlay *::after {
    box-sizing: border-box; margin: 0; padding: 0;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }

  /* \u2500\u2500 Trigger button \u2500\u2500 */
  .cby-trigger {
    width: 100%; padding: 14px;
    border: 1px solid #000; background: #fff; color: #000;
    font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
    cursor: pointer; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    transition: background 0.15s, color 0.15s; display: block;
    margin-bottom: 10px;
  }
  .cby-trigger:hover { background: #000; color: #fff; }

  /* \u2500\u2500 Overlay \u2500\u2500 */
  .cby-overlay {
    position: fixed; inset: 0; z-index: 99999;
    background: rgba(0,0,0,0.45);
    display: none; align-items: center; justify-content: center;
  }
  .cby-overlay.cby-open { display: flex; }

  /* \u2500\u2500 Modal \u2500\u2500 */
  .cby-modal {
    background: #fff;
    width: 92vw; max-width: 1120px; height: 87vh;
    display: flex; flex-direction: column;
    border: 1px solid #e0e0e0; overflow: hidden;
    position: relative;
  }

  /* \u2500\u2500 Header \u2500\u2500 */
  .cby-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 22px; border-bottom: 1px solid #e0e0e0; flex-shrink: 0;
  }
  .cby-header-left  { display: flex; align-items: center; gap: 14px; }
  .cby-header-right { display: flex; align-items: center; gap: 16px; }
  .cby-title {
    font-size: 13px; letter-spacing: 0.18em;
    text-transform: uppercase; color: #000; font-weight: 500;
  }
  .cby-hint { font-size: 11px; color: #767676; letter-spacing: 0.04em; }

  /* My Looks header button */
  .cby-my-looks-btn {
    padding: 7px 14px; border: 1px solid #e0e0e0; background: #fff;
    font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
    cursor: pointer; font-family: inherit; color: #767676;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
    white-space: nowrap;
  }
  .cby-my-looks-btn:hover { border-color: #000; color: #000; }
  .cby-looks-count { font-size: 10px; margin-left: 3px; }

  .cby-close {
    background: none; border: none; cursor: pointer;
    font-size: 22px; color: #767676; line-height: 1; padding: 2px 6px;
  }
  .cby-close:hover { color: #000; }

  /* \u2500\u2500 Body \u2500\u2500 */
  .cby-body {
    display: flex; flex: 1; overflow: hidden; position: relative;
  }

  /* \u2550\u2550 LEFT PANEL \u2550\u2550 */
  .cby-panel-left {
    width: 260px; flex-shrink: 0;
    border-right: 1px solid #e0e0e0;
    display: flex; flex-direction: column;
  }

  /* \u2500\u2500 Hero area \u2500\u2500 */
  .cby-hero {
    flex: 1; background: #f5f4f1;
    position: relative; overflow: hidden; min-height: 0;
  }
  .cby-hero-img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: opacity 0.3s;
  }
  .cby-hero-img.cby-contain { object-fit: contain; }

  /* Spinner \u2014 sits over hero image */
  .cby-hero-spinner {
    display: none; position: absolute; inset: 0;
    background: rgba(245,244,241,0.92);
    align-items: center; justify-content: center;
    flex-direction: column; gap: 14px;
  }
  .cby-hero-spinner.cby-active { display: flex; }
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

  /* Not-found state */
  .cby-hero-nf {
    display: none; position: absolute; inset: 0;
    background: #f5f4f1;
    align-items: center; justify-content: center;
    flex-direction: column; gap: 10px;
  }
  .cby-hero-nf.cby-active { display: flex; }
  .cby-nf-icon { font-size: 24px; color: #ccc; }
  .cby-nf-text { font-size: 11px; color: #b0b0b0; letter-spacing: 0.06em; text-transform: uppercase; }

  /* \u2500\u2500 Hero notification toast \u2500\u2500
     Sits OVER the hero image, absolute inside .cby-hero.
     top: 12px, left: 12px, right: 12px \u2014 matches spec exactly.
  */
  .cby-hero-notif {
    position: absolute; top: 12px; left: 12px; right: 12px;
    background: #000; color: #fff;
    font-size: 11px; letter-spacing: 0.06em;
    padding: 10px 14px; line-height: 1.4;
    z-index: 20; cursor: pointer;
    opacity: 0; pointer-events: none;
    transform: translateY(-6px);
    transition: opacity 0.22s ease, transform 0.22s ease;
  }
  .cby-hero-notif.cby-active {
    opacity: 1; pointer-events: auto;
    transform: translateY(0);
  }

  /* \u2500\u2500 Price panel \u2500\u2500 */
  .cby-price-panel {
    padding: 14px 16px; border-top: 1px solid #e0e0e0;
    flex-shrink: 0; min-height: 56px;
  }
  .cby-price-empty { font-size: 11px; color: #b0b0b0; letter-spacing: 0.03em; }
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

  /* \u2500\u2500 Action buttons \u2500\u2500 */
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

  /* Solid buttons: Save + Shop \u2014 always black */
  .cby-btn-solid {
    background: #000; color: #fff;
  }
  .cby-btn-solid:hover:not(:disabled) { background: #333; }
  .cby-btn-solid:disabled { opacity: 0.28; cursor: not-allowed; }

  /* Curate button \u2014 starts inactive (white), becomes black when .cby-ready */
  .cby-btn-curate {
    background: #fff; color: #b0b0b0; border-color: #e0e0e0;
    cursor: default;
  }
  .cby-btn-curate.cby-ready {
    background: #000; color: #fff; border-color: #000; cursor: pointer;
  }
  .cby-btn-curate.cby-ready:hover { background: #333; }

  /* \u2550\u2550 RIGHT PANEL \u2550\u2550 */
  .cby-panel-right { flex: 1; overflow-y: auto; padding: 22px 26px; }

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
    display: none; align-items: center; justify-content: center; font-weight: 500;
  }
  .cby-cat-badge.cby-visible { display: flex; }

  .cby-tile-row { display: flex; align-items: center; gap: 8px; }
  .cby-swipe-btn {
    width: 28px; height: 28px; background: #fff; border: 1px solid #e0e0e0;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 16px; color: #000; font-family: inherit;
    transition: background 0.15s; line-height: 1;
  }
  .cby-swipe-btn:hover:not(:disabled) { background: #f5f4f1; }
  .cby-swipe-btn:disabled { opacity: 0.2; cursor: not-allowed; }

  .cby-tiles-wrap { flex: 1; overflow: hidden; }
  .cby-tiles-track { display: flex; gap: 8px; transition: transform 0.28s ease; }

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
    background: rgba(255,255,255,0.92); padding: 6px 8px;
    font-size: 10px; letter-spacing: 0.03em; color: #1a1a1a;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    opacity: 0; transition: opacity 0.15s;
  }
  .cby-tile:hover .cby-tile-label { opacity: 1; }

  /* \u2550\u2550 MY LOOKS SIDEBAR \u2550\u2550
     Slides in from the RIGHT over the right panel ONLY.
     Left panel always stays visible.
     200px wide, position absolute on .cby-body.
  */
  .cby-sidebar {
    position: absolute;
    top: 0; right: 0; bottom: 0;
    width: 200px;
    background: #fff;
    border-left: 1px solid #e0e0e0;
    display: flex; flex-direction: column;
    z-index: 10;
    transform: translateX(100%);
    transition: transform 0.28s ease;
    overflow: hidden;
  }
  .cby-sidebar.cby-open { transform: translateX(0); }

  .cby-sidebar-header {
    padding: 14px 16px; border-bottom: 1px solid #e0e0e0; flex-shrink: 0;
  }
  .cby-sidebar-title {
    font-size: 11px; letter-spacing: 0.14em;
    text-transform: uppercase; color: #000; font-weight: 500;
  }

  .cby-sidebar-body {
    flex: 1; overflow-y: auto; padding: 12px;
    display: flex; flex-direction: column; gap: 10px;
  }

  .cby-sidebar-empty {
    font-size: 11px; color: #b0b0b0; letter-spacing: 0.04em;
    text-align: center; padding: 24px 0;
  }

  /* Look thumbnail */
  .cby-look-thumb {
    width: 100%; aspect-ratio: 3/4;
    background: #f5f4f1; overflow: hidden; cursor: pointer;
    border: 2px solid transparent;
    transition: border-color 0.18s;
    flex-shrink: 0;
  }
  .cby-look-thumb:hover { border-color: #c8a96e; }
  .cby-look-thumb.cby-active { border-color: #000; }
  .cby-look-thumb img {
    width: 100%; height: 100%; object-fit: contain; display: block;
  }

  /* \u2500\u2500 Mobile \u2500\u2500 */
  @media (max-width: 640px) {
    .cby-modal { width: 100vw; height: 100vh; }
    .cby-panel-left { width: 180px; }
    .cby-tile { width: calc(33.33% - 6px); }
    .cby-hint { display: none; }
    .cby-sidebar { width: 160px; }
  }
`;(function(){"use strict";let l=window.CBYConfig||{},ee=(l.apiUrl||"http://localhost:8000").replace(/\/$/,""),te=l.currency||"USD",U=l.categories||{},I=l.heroImage||"",D=l.mountTo||null,J=typeof l.onAddToCart=="function"?l.onAddToCart:null,oe={tops:"Tops",bottoms:"Bottoms",shoes:"Shoes",accessories:"Accessories"},r={},d={},y=null,q=!1,b=[],k=!1,R=null;try{b=JSON.parse(localStorage.getItem("cby_looks_v1")||"[]")}catch{}function ne(){try{localStorage.setItem("cby_looks_v1",JSON.stringify(b.slice(0,20)))}catch{}}let W=document.createElement("style");W.textContent=Z,document.head.appendChild(W);let w=document.createElement("button");if(w.className="cby-trigger",w.textContent=l.triggerLabel||"Curate My Look",D){var ie=document.querySelector(D);(ie||document.body).appendChild(w)}else document.body.appendChild(w);let p=document.createElement("div");p.className="cby-overlay",document.body.appendChild(p);let g=document.createElement("div");g.className="cby-modal",g.setAttribute("role","dialog"),g.setAttribute("aria-modal","true");let L=document.createElement("div");L.className="cby-header",L.innerHTML=`
    <div class="cby-header-left">
      <span class="cby-title">Curate My Look</span>
      <span class="cby-hint">Select items to build your outfit</span>
    </div>
    <div class="cby-header-right">
      <button class="cby-my-looks-btn" id="cby-my-looks-btn">
        My Looks <span class="cby-looks-count"></span>
      </button>
      <button class="cby-close" aria-label="Close">\xD7</button>
    </div>
  `;let E=document.createElement("div");E.className="cby-body";let C=document.createElement("div");C.className="cby-panel-left";let _=document.createElement("div");_.className="cby-hero",_.innerHTML=`
    <img id="cby-hero-img" class="cby-hero-img" src="${I}" alt="Outfit preview" />
    <div class="cby-hero-spinner" id="cby-hero-spinner">
      <div class="cby-spinner-ring"></div>
      <div class="cby-spinner-text">Generating look\u2026</div>
    </div>
    <div class="cby-hero-nf" id="cby-hero-nf">
      <div class="cby-nf-icon">\u2715</div>
      <div class="cby-nf-text">Look not available</div>
    </div>
    <div class="cby-hero-notif" id="cby-hero-notif"></div>
  `;let v=document.createElement("div");v.className="cby-price-panel";let P=document.createElement("div");P.className="cby-panel-btns",P.innerHTML=`
    <button class="cby-action-btn cby-btn-solid" id="cby-save-btn">\u2661 Save My Look</button>
    <button class="cby-action-btn cby-btn-curate" id="cby-curate-btn">Curate My Look</button>
    <button class="cby-action-btn cby-btn-solid" id="cby-shop-btn">Shop My Look</button>
  `,C.appendChild(_),C.appendChild(v),C.appendChild(P);let f=document.createElement("div");f.className="cby-panel-right";let x=document.createElement("div");x.className="cby-sidebar",x.id="cby-sidebar",x.innerHTML=`
    <div class="cby-sidebar-header">
      <div class="cby-sidebar-title">My Looks</div>
    </div>
    <div class="cby-sidebar-body" id="cby-sidebar-body">
      <div class="cby-sidebar-empty">No looks saved yet</div>
    </div>
  `,E.appendChild(C),E.appendChild(f),E.appendChild(x),g.appendChild(L),g.appendChild(E),p.appendChild(g);let a=document.getElementById("cby-hero-img"),X=document.getElementById("cby-hero-spinner"),S=document.getElementById("cby-hero-nf"),N=document.getElementById("cby-hero-notif"),F=document.getElementById("cby-save-btn"),A=document.getElementById("cby-curate-btn"),V=document.getElementById("cby-shop-btn"),ce=document.getElementById("cby-my-looks-btn"),T=document.getElementById("cby-sidebar-body"),ae=L.querySelector(".cby-close"),re=L.querySelector(".cby-looks-count");function O(e){N.textContent=e,N.classList.add("cby-active"),clearTimeout(R),R=setTimeout(function(){N.classList.remove("cby-active")},5e3)}N.addEventListener("click",function(){N.classList.remove("cby-active"),clearTimeout(R)});function $(e){return new Intl.NumberFormat("en-US",{style:"currency",currency:te}).format(e)}function z(){v.innerHTML="";let e=Object.values(r).filter(Boolean);if(!e.length){v.innerHTML='<div class="cby-price-empty">No items selected yet</div>';return}var o=0;e.forEach(function(n){o+=n.price;var i=document.createElement("div");i.className="cby-price-row",i.innerHTML="<span>"+n.name+"</span><span>"+$(n.price)+"</span>",v.appendChild(i)});var t=document.createElement("div");t.className="cby-price-total",t.innerHTML="<span>Total</span><span>"+$(o)+"</span>",v.appendChild(t)}function B(){var e=Object.values(r).filter(Boolean).length;A.classList.toggle("cby-ready",e>=2),A.disabled=!1,V.disabled=e<1,F.disabled=!1}function Y(){re.textContent=b.length>0?"("+b.length+")":""}function se(e,o){var t=4;d[e]=0;var n=document.createElement("div");n.className="cby-cat-section";var i=document.createElement("div");i.className="cby-cat-header",i.innerHTML='<span class="cby-cat-label">'+(oe[e]||e)+"</span>";var c=document.createElement("span");c.className="cby-cat-badge",c.dataset.cat=e,c.textContent="1",i.appendChild(c);var s=document.createElement("div");s.className="cby-tile-row";var u=document.createElement("button");u.className="cby-swipe-btn",u.textContent="\u2039",u.disabled=!0;var G=document.createElement("div");G.className="cby-tiles-wrap";var m=document.createElement("div");m.className="cby-tiles-track",m.dataset.cat=e,o.forEach(function(j){var M=document.createElement("div");M.className="cby-tile",M.innerHTML='<img src="'+j.image_url+'" alt="'+j.name+'" loading="lazy" /><div class="cby-tile-dot"></div><div class="cby-tile-label">'+j.name+"</div>",M.addEventListener("click",function(){le(e,j,M,m,c)}),m.appendChild(M)}),G.appendChild(m);var h=document.createElement("button");h.className="cby-swipe-btn",h.textContent="\u203A",h.disabled=o.length<=t,u.addEventListener("click",function(){d[e]=Math.max(0,d[e]-1),K(m,e,o.length,t,u,h)}),h.addEventListener("click",function(){d[e]=Math.min(o.length-t,d[e]+1),K(m,e,o.length,t,u,h)}),s.appendChild(u),s.appendChild(G),s.appendChild(h),n.appendChild(i),n.appendChild(s),f.appendChild(n)}function K(e,o,t,n,i,c){var s=e.parentElement.offsetWidth*.25-6;e.style.transform="translateX(-"+d[o]*(s+8)+"px)",i.disabled=d[o]===0,c.disabled=d[o]>=t-n}function le(e,o,t,n,i){var c=r[e]&&r[e].id===o.id;n.querySelectorAll(".cby-tile").forEach(function(s){s.classList.remove("cby-selected")}),c?(delete r[e],i.classList.remove("cby-visible")):(r[e]=Object.assign({},o,{category:e}),t.classList.add("cby-selected"),i.classList.add("cby-visible")),y=null,a.src=I,a.classList.remove("cby-contain"),a.style.opacity="1",S.classList.remove("cby-active"),z(),B()}function de(){var e=y||a.src,o=Object.values(r).filter(Boolean);b.unshift({img:e,items:o,saved_at:Date.now()}),ne(),Y(),Q(),O("Added to My Looks")}async function be(){if(!q){var e=Object.values(r).filter(Boolean),o=e.length;if(o<2){var t=2-o;O("Select "+t+" more item"+(t>1?"s":"")+" to generate your look");return}q=!0,A.disabled=!1,a.style.opacity="0",X.classList.add("cby-active"),S.classList.remove("cby-active");try{var n=await fetch(ee+"/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:e})});if(!n.ok){var i=await n.json().catch(function(){return{}});throw new Error(i.detail||"Error "+n.status)}var c=await n.json();y=c.image_url,a.src=y,a.classList.add("cby-contain"),a.style.opacity="1"}catch(s){y=null,a.style.opacity="0",S.classList.add("cby-active"),O("Could not generate image. Please try again."),console.error("[CBY]",s)}finally{q=!1,X.classList.remove("cby-active"),B()}}}function pe(){var e=Object.values(r).filter(Boolean),o=e.length;o<1||(O(o+" item"+(o>1?"s":"")+" added to your basket!"),J?J(e):console.info("[CBY] Set window.CBYConfig.onAddToCart to handle cart logic:",e),setTimeout(H,5200))}function Q(){if(T.innerHTML="",!b.length){T.innerHTML='<div class="cby-sidebar-empty">No looks saved yet</div>';return}b.forEach(function(e,o){var t=document.createElement("div");t.className="cby-look-thumb",t.innerHTML='<img src="'+e.img+'" alt="Saved look" />',t.addEventListener("click",function(){ye(o)}),T.appendChild(t)})}function ye(e){var o=b[e];o&&(Object.keys(r).forEach(function(t){delete r[t]}),f.querySelectorAll(".cby-tile").forEach(function(t){t.classList.remove("cby-selected")}),f.querySelectorAll(".cby-cat-badge").forEach(function(t){t.classList.remove("cby-visible")}),o.items.forEach(function(t){r[t.category]=t;var n=f.querySelector('.cby-tiles-track[data-cat="'+t.category+'"]');n&&(n.querySelectorAll(".cby-tile").forEach(function(c){c.classList.remove("cby-selected")}),n.querySelectorAll(".cby-tile").forEach(function(c){c.querySelector("img")&&c.querySelector("img").alt===t.name&&c.classList.add("cby-selected")}));var i=f.querySelector('.cby-cat-badge[data-cat="'+t.category+'"]');i&&i.classList.add("cby-visible")}),y=o.img,a.src=o.img,a.classList.add("cby-contain"),a.style.opacity="1",S.classList.remove("cby-active"),T.querySelectorAll(".cby-look-thumb").forEach(function(t){t.classList.remove("cby-active")}),T.querySelectorAll(".cby-look-thumb")[e].classList.add("cby-active"),z(),B())}function fe(e){e&&e.stopPropagation(),k=!k,x.classList.toggle("cby-open",k)}function ue(){p.classList.add("cby-open"),document.body.style.overflow="hidden",a.classList.remove("cby-contain"),a.src=I,a.style.opacity="1",y=null,S.classList.remove("cby-active"),z(),B(),Y()}function H(){p.classList.remove("cby-open"),document.body.style.overflow="",k&&(k=!1,x.classList.remove("cby-open"))}w.addEventListener("click",ue),ae.addEventListener("click",H),F.addEventListener("click",de),A.addEventListener("click",be),V.addEventListener("click",pe),ce.addEventListener("click",function(e){Q(),fe(e)}),p.addEventListener("click",function(e){e.target===p&&H()}),document.addEventListener("keydown",function(e){e.key==="Escape"&&p.classList.contains("cby-open")&&H()}),Object.keys(U).forEach(function(e){se(e,U[e])}),z(),B(),Y()})();})();
