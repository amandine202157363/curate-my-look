(()=>{var ie=`
  .cby-root *, .cby-root *::before, .cby-root *::after,
  .cby-overlay *, .cby-overlay *::before, .cby-overlay *::after {
    box-sizing: border-box; margin: 0; padding: 0;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }

  /* \u2500\u2500 Trigger button \u2500\u2500 */
  .cby-trigger {
    width: 100%; padding: 14px;
    border: 1px solid #000; background: #fff; color: #000;
    font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
    cursor: pointer; font-family: inherit;
    transition: background 0.15s, color 0.15s;
    display: block;
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
  }

  /* \u2500\u2500 Header \u2500\u2500 */
  .cby-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 22px; border-bottom: 1px solid #e0e0e0; flex-shrink: 0;
  }
  .cby-header-left { display: flex; align-items: center; gap: 14px; }
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
  .cby-my-looks-btn:hover,
  .cby-my-looks-btn.cby-has-looks { border-color: #000; color: #000; }
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
  .cby-hero {
    flex: 1; background: #f5f4f1;
    position: relative; overflow: hidden; min-height: 0;
  }
  .cby-hero-img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: opacity 0.3s;
  }
  .cby-hero-img.cby-contain { object-fit: contain; }

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

  /* Action buttons */
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

  /* Save + Shop buttons: hidden until an outfit is generated */
  .cby-btn-save,
  .cby-btn-shop { background: #fff; color: #000; display: none; }
  .cby-btn-save.cby-visible,
  .cby-btn-shop.cby-visible { display: block; }
  .cby-btn-save:hover { background: #000; color: #fff; }
  .cby-btn-shop { background: #000; color: #fff; }
  .cby-btn-shop:hover { background: #333; }
  .cby-btn-save:disabled { opacity: 0.4; cursor: not-allowed; }

  /* Error */
  .cby-error {
    font-size: 11px; color: #c00; text-align: center;
    padding: 8px 16px; display: none; letter-spacing: 0.04em;
    border-top: 1px solid #f5c2c2; background: #fff5f5; flex-shrink: 0;
  }
  .cby-error.cby-visible { display: block; }

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

  /* \u2550\u2550 MY LOOKS PANEL \u2550\u2550 */
  .cby-looks-panel {
    position: absolute; inset: 0; background: #fff; z-index: 10;
    display: none; flex-direction: column;
  }
  .cby-looks-panel.cby-open { display: flex; }

  .cby-looks-panel-header {
    display: flex; align-items: center; gap: 20px;
    padding: 16px 24px; border-bottom: 1px solid #e0e0e0; flex-shrink: 0;
  }
  .cby-back-btn {
    background: none; border: none; cursor: pointer;
    font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
    color: #767676; font-family: inherit; padding: 0;
  }
  .cby-back-btn:hover { color: #000; }
  .cby-looks-panel-title {
    font-size: 13px; letter-spacing: 0.18em;
    text-transform: uppercase; color: #000; font-weight: 500;
  }

  .cby-looks-grid {
    flex: 1; overflow-y: auto; padding: 24px;
    display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px; align-content: start;
  }

  /* Empty state */
  .cby-looks-empty {
    grid-column: 1 / -1; text-align: center; padding: 60px 20px;
    display: flex; flex-direction: column; align-items: center; gap: 12px;
  }
  .cby-looks-empty-icon { font-size: 32px; color: #ddd; }
  .cby-looks-empty-text {
    font-size: 12px; color: #b0b0b0; line-height: 1.7; letter-spacing: 0.04em;
  }

  /* Individual saved look card */
  .cby-look-card {
    border: 1px solid #e0e0e0; display: flex; flex-direction: column;
    overflow: hidden;
  }
  .cby-look-img-wrap { aspect-ratio: 3/4; overflow: hidden; background: #f5f4f1; }
  .cby-look-img-wrap img {
    width: 100%; height: 100%; object-fit: contain; display: block;
  }
  .cby-look-info { padding: 10px 12px; border-top: 1px solid #e0e0e0; }
  .cby-look-items {
    font-size: 10px; color: #767676; letter-spacing: 0.03em;
    line-height: 1.5; margin-bottom: 4px;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .cby-look-price {
    font-size: 12px; font-weight: 500; color: #000; letter-spacing: 0.04em;
  }
  .cby-look-actions {
    padding: 10px 12px; border-top: 1px solid #e0e0e0;
    display: flex; align-items: center; gap: 8px;
  }
  .cby-btn-shop-look {
    flex: 1; padding: 9px; border: 1px solid #000; background: #000; color: #fff;
    font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
    cursor: pointer; font-family: inherit;
    transition: background 0.15s;
  }
  .cby-btn-shop-look:hover { background: #333; }
  .cby-look-delete {
    background: none; border: 1px solid #e0e0e0; color: #b0b0b0;
    width: 32px; height: 32px; cursor: pointer; font-size: 16px;
    display: flex; align-items: center; justify-content: center;
    font-family: inherit; flex-shrink: 0; transition: color 0.15s, border-color 0.15s;
  }
  .cby-look-delete:hover { color: #000; border-color: #000; }

  /* \u2500\u2500 Mobile \u2500\u2500 */
  @media (max-width: 640px) {
    .cby-modal { width: 100vw; height: 100vh; }
    .cby-panel-left { width: 180px; }
    .cby-tile { width: calc(33.33% - 6px); }
    .cby-hint { display: none; }
    .cby-looks-grid { grid-template-columns: repeat(2, 1fr); padding: 16px; }
  }
`;(function(){"use strict";let p=window.CBYConfig||{},ae=(p.apiUrl||"http://localhost:8000").replace(/\/$/,""),le=p.currency||"USD",F=p.categories||{},K=p.heroImage||"",X=p.mountTo||null,j=typeof p.onAddToCart=="function"?p.onAddToCart:null,se={tops:"Tops",bottoms:"Bottoms",shoes:"Shoes",accessories:"Accessories"},Q="cby_looks_v1";function O(){try{return JSON.parse(localStorage.getItem(Q)||"[]")}catch{return[]}}function Z(e){localStorage.setItem(Q,JSON.stringify(e))}function re(e){let t=O();t.unshift(e),Z(t.slice(0,20))}function de(e){let t=O();t.splice(e,1),Z(t)}let s={},b={},f=null,H=!1,ee=document.createElement("style");ee.textContent=ie,document.head.appendChild(ee);let g=document.createElement("button");if(g.className="cby-trigger",g.textContent=p.triggerLabel||"Curate My Look",X){let e=document.querySelector(X);e?e.appendChild(g):document.body.appendChild(g)}else document.body.appendChild(g);let y=document.createElement("div");y.className="cby-overlay",document.body.appendChild(y);let h=document.createElement("div");h.className="cby-modal",h.setAttribute("role","dialog"),h.setAttribute("aria-modal","true");let C=document.createElement("div");C.className="cby-header";let Y=document.createElement("div");Y.className="cby-header-left",Y.innerHTML=`
    <span class="cby-title">Curate My Look</span>
    <span class="cby-hint">Select items to build your outfit</span>
  `;let I=document.createElement("div");I.className="cby-header-right";let E=document.createElement("button");E.className="cby-my-looks-btn",E.innerHTML='My Looks <span class="cby-looks-count"></span>';let L=document.createElement("button");L.className="cby-close",L.setAttribute("aria-label","Close"),L.textContent="\xD7",I.appendChild(E),I.appendChild(L),C.appendChild(Y),C.appendChild(I);let N=document.createElement("div");N.className="cby-body";let x=document.createElement("div");x.className="cby-panel-left";let P=document.createElement("div");P.className="cby-hero";let i=document.createElement("img");i.className="cby-hero-img",i.src=K,i.alt="Outfit preview";let S=document.createElement("div");S.className="cby-spinner-wrap",S.innerHTML=`
    <div class="cby-spinner-ring"></div>
    <div class="cby-spinner-text">Generating look\u2026</div>
  `,P.appendChild(i),P.appendChild(S);let v=document.createElement("div");v.className="cby-price-panel";let T=document.createElement("div");T.className="cby-panel-btns";let r=document.createElement("button");r.className="cby-action-btn cby-btn-generate",r.textContent="Generate Look",r.disabled=!0;let d=document.createElement("button");d.className="cby-action-btn cby-btn-save",d.textContent="Save My Look";let B=document.createElement("button");B.className="cby-action-btn cby-btn-shop",B.textContent="Shop My Look",T.appendChild(r),T.appendChild(d),T.appendChild(B);let M=document.createElement("div");M.className="cby-error",x.appendChild(P),x.appendChild(v),x.appendChild(T),x.appendChild(M);let U=document.createElement("div");U.className="cby-panel-right";let k=document.createElement("div");k.className="cby-looks-panel";let $=document.createElement("div");$.className="cby-looks-panel-header";let R=document.createElement("button");R.className="cby-back-btn",R.innerHTML="\u2190 Back to styling";let q=document.createElement("span");q.className="cby-looks-panel-title",q.textContent="My Looks",$.appendChild(R),$.appendChild(q);let z=document.createElement("div");z.className="cby-looks-grid",k.appendChild($),k.appendChild(z),N.appendChild(x),N.appendChild(U),N.appendChild(k),h.appendChild(C),h.appendChild(N),y.appendChild(h);function V(e){return new Intl.NumberFormat("en-US",{style:"currency",currency:le}).format(e)}function te(){v.innerHTML="";let e=Object.values(s).filter(Boolean);if(!e.length){v.innerHTML='<div class="cby-price-empty">No items selected yet</div>';return}let t=0;e.forEach(function(o){t+=o.price;let n=document.createElement("div");n.className="cby-price-row",n.innerHTML=`<span>${o.name}</span><span>${V(o.price)}</span>`,v.appendChild(n)});let a=document.createElement("div");a.className="cby-price-total",a.innerHTML=`<span>Total</span><span>${V(t)}</span>`,v.appendChild(a)}function D(){let e=Object.values(s).filter(Boolean).length;r.disabled=e===0||H;let t=!!f;d.classList.toggle("cby-visible",t),B.classList.toggle("cby-visible",t)}function _(){let e=O().length,t=C.querySelector(".cby-looks-count");t.textContent=e>0?`(${e})`:"",E.classList.toggle("cby-has-looks",e>0)}function pe(e,t){b[e]=0;let o=document.createElement("div");o.className="cby-cat-section";let n=document.createElement("div");n.className="cby-cat-header";let c=document.createElement("span");c.className="cby-cat-badge",c.dataset.cat=e,c.textContent="1",n.innerHTML=`<span class="cby-cat-label">${se[e]||e}</span>`,n.appendChild(c);let l=document.createElement("div");l.className="cby-tile-row";let m=document.createElement("button");m.className="cby-swipe-btn",m.textContent="\u2039",m.disabled=!0;let J=document.createElement("div");J.className="cby-tiles-wrap";let w=document.createElement("div");w.className="cby-tiles-track",t.forEach(function(G){let A=document.createElement("div");A.className="cby-tile",A.innerHTML=`
        <img src="${G.image_url}" alt="${G.name}" loading="lazy" />
        <div class="cby-tile-dot"></div>
        <div class="cby-tile-label">${G.name}</div>
      `,A.addEventListener("click",function(){be(e,G,A,w,c)}),w.appendChild(A)}),J.appendChild(w);let u=document.createElement("button");u.className="cby-swipe-btn",u.textContent="\u203A",u.disabled=t.length<=4,m.addEventListener("click",function(){b[e]=Math.max(0,b[e]-1),oe(w,e,t.length,4,m,u)}),u.addEventListener("click",function(){b[e]=Math.min(t.length-4,b[e]+1),oe(w,e,t.length,4,m,u)}),l.appendChild(m),l.appendChild(J),l.appendChild(u),o.appendChild(n),o.appendChild(l),U.appendChild(o)}function oe(e,t,a,o,n,c){let l=e.parentElement.offsetWidth*.25-6;e.style.transform=`translateX(-${b[t]*(l+8)}px)`,n.disabled=b[t]===0,c.disabled=b[t]>=a-o}function be(e,t,a,o,n){let c=s[e]&&s[e].id===t.id;o.querySelectorAll(".cby-tile").forEach(function(l){l.classList.remove("cby-selected")}),c?(delete s[e],n.classList.remove("cby-visible")):(s[e]=t,a.classList.add("cby-selected"),n.classList.add("cby-visible")),f=null,i.src=K,i.classList.remove("cby-contain"),te(),D()}function ne(){z.innerHTML="";let e=O();if(!e.length){z.innerHTML=`
        <div class="cby-looks-empty">
          <div class="cby-looks-empty-icon">\u25FB</div>
          <div class="cby-looks-empty-text">No saved looks yet.<br>Generate an outfit and save it here.</div>
        </div>`;return}e.forEach(function(t,a){let o=document.createElement("div");o.className="cby-look-card";let n=t.items.reduce(function(c,l){return c+l.price},0);o.innerHTML=`
        <div class="cby-look-img-wrap">
          <img src="${t.image_url}" alt="Saved look" />
        </div>
        <div class="cby-look-info">
          <div class="cby-look-items">${t.items.map(function(c){return c.name}).join(", ")}</div>
          <div class="cby-look-price">${V(n)}</div>
        </div>
        <div class="cby-look-actions">
          <button class="cby-action-btn cby-btn-shop-look">Shop This Look</button>
          <button class="cby-look-delete" aria-label="Remove look">\xD7</button>
        </div>
      `,o.querySelector(".cby-btn-shop-look").addEventListener("click",function(){j?j(t.items):alert("[CBY] Set onAddToCart in CBYConfig to handle cart logic.")}),o.querySelector(".cby-look-delete").addEventListener("click",function(){de(a),_(),ne()}),z.appendChild(o)})}function ye(){ne(),k.classList.add("cby-open")}function ce(){k.classList.remove("cby-open")}async function fe(){if(H)return;let e=Object.values(s).filter(Boolean);if(e.length){H=!0,r.disabled=!0,r.textContent="Generating\u2026",S.classList.add("cby-active"),i.style.opacity="0.3",M.classList.remove("cby-visible");try{let t=await fetch(`${ae}/generate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:e})});if(!t.ok){let o=await t.json().catch(function(){return{}});throw new Error(o.detail||`Error ${t.status}`)}f=(await t.json()).image_url,i.src=f,i.classList.add("cby-contain"),i.style.opacity="1"}catch(t){M.textContent="Could not generate image. Please try again.",M.classList.add("cby-visible"),i.style.opacity="1",console.error("[CBY]",t)}finally{H=!1,r.textContent=f?"Regenerate":"Generate Look",D(),S.classList.remove("cby-active")}}}function me(){if(!f)return;let e=Object.values(s).filter(Boolean);re({image_url:f,items:e,saved_at:Date.now()}),_(),d.textContent="Saved \u2713",d.disabled=!0,setTimeout(function(){d.textContent="Save My Look",d.disabled=!1},2e3)}function ue(){let e=Object.values(s).filter(Boolean);e.length&&(j?j(e):(console.info("[CBY] Set window.CBYConfig.onAddToCart to handle cart logic:",e),alert(`${e.length} item(s) ready. Set window.CBYConfig.onAddToCart to connect your cart.`)))}function ge(){y.classList.add("cby-open"),document.body.style.overflow="hidden",_()}function W(){y.classList.remove("cby-open"),document.body.style.overflow="",ce()}g.addEventListener("click",ge),L.addEventListener("click",W),r.addEventListener("click",fe),d.addEventListener("click",me),B.addEventListener("click",ue),E.addEventListener("click",ye),R.addEventListener("click",ce),y.addEventListener("click",function(e){e.target===y&&W()}),document.addEventListener("keydown",function(e){e.key==="Escape"&&y.classList.contains("cby-open")&&W()}),Object.keys(F).forEach(function(e){pe(e,F[e])}),te(),D(),_()})();})();
