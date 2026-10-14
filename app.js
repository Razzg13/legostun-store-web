const fmt = n => n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
const slugify = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-');

const STORAGE_KEY = 'legostun-cart';

function loadCart(){
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const cart = {};
    PRODUCTS.forEach(p => { cart[p.name] = saved[p.name] > 0 ? saved[p.name] : 0; });
    return cart;
  } catch (e) {
    return {};
  }
}

function saveCart(){
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable, cart just won't persist */ }
}

const state = loadCart(); // name -> qty

// ---- Render catalog ----
const catalogEl = document.getElementById('catalog');
const navEl = document.getElementById('siteNav');
const categories = [...new Set(PRODUCTS.map(p => p.category))];
const qtyDisplays = {}; // name -> [elements] to keep in sync (card + cart row)

categories.forEach(cat => {
  const navLink = document.createElement('a');
  navLink.href = `#cat-${slugify(cat)}`;
  navLink.textContent = cat;
  navEl.appendChild(navLink);

  const label = document.createElement('div');
  label.className = 'cat-label';
  label.id = `cat-${slugify(cat)}`;
  label.textContent = cat;
  catalogEl.appendChild(label);

  const grid = document.createElement('div');
  grid.className = 'grid';

  PRODUCTS.filter(p => p.category === cat).forEach(p => {
    qtyDisplays[p.name] = [];

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="emoji">${p.emoji}</div>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="row">
        <span class="price">${fmt(p.price)}</span>
        <div class="stepper" data-name="${p.name}">
          <button type="button" class="minus" aria-label="Quitar">−</button>
          <span class="qty">${state[p.name]}</span>
          <button type="button" class="plus" aria-label="Agregar">+</button>
        </div>
      </div>
    `;
    grid.appendChild(card);

    const stepper = card.querySelector('.stepper');
    const qtyEl = stepper.querySelector('.qty');
    qtyDisplays[p.name].push(qtyEl);

    stepper.querySelector('.plus').addEventListener('click', () => {
      const wasZero = state[p.name] === 0;
      setQty(p.name, state[p.name] + 1);
      showToast(wasZero ? `${p.name} agregado` : `${p.name} actualizado`);
    });
    stepper.querySelector('.minus').addEventListener('click', () => {
      if (state[p.name] > 0) setQty(p.name, state[p.name] - 1);
    });
  });

  catalogEl.appendChild(grid);
});

// ---- Shared qty update ----
function setQty(name, qty){
  state[name] = Math.max(0, qty);
  qtyDisplays[name].forEach(el => { el.textContent = state[name]; });
  saveCart();
  updateSummary();
  renderCartItems();
}

// ---- Bottom order bar ----
const summaryEl = document.getElementById('summary');
const sendBtn = document.getElementById('sendBtn');
const cartCountEl = document.getElementById('cartCount');

function getCartStats(){
  let items = 0, total = 0;
  PRODUCTS.forEach(p => {
    const q = state[p.name];
    if (q > 0){ items += q; total += q * p.price; }
  });
  return { items, total };
}

function updateSummary(){
  const { items, total } = getCartStats();
  if (items === 0){
    summaryEl.textContent = 'Tu pedido está vacío';
    sendBtn.disabled = true;
    cartSendBtn.disabled = true;
    cartCountEl.hidden = true;
  } else {
    summaryEl.innerHTML = `<strong>${fmt(total)}</strong> · ${items} ${items === 1 ? 'producto' : 'productos'}`;
    sendBtn.disabled = false;
    cartSendBtn.disabled = false;
    cartCountEl.hidden = false;
    cartCountEl.textContent = items;
  }
  cartTotalEl.textContent = fmt(total);
}

let toastTimer;
function showToast(msg){
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1200);
}

function sendOrder(){
  const lines = [`Hola ${BUSINESS.name}! Quiero hacer este pedido:`, ''];
  let total = 0;
  PRODUCTS.forEach(p => {
    const q = state[p.name];
    if (q > 0){
      lines.push(`• ${q}x ${p.name} - ${fmt(q * p.price)}`);
      total += q * p.price;
    }
  });
  lines.push('', `Total: ${fmt(total)}`);
  const text = encodeURIComponent(lines.join('\n'));
  const url = `https://wa.me/${BUSINESS.whatsapp}?text=${text}`;
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

sendBtn.addEventListener('click', sendOrder);

// ---- Cart drawer ----
const cartBtn = document.getElementById('cartBtn');
const cartBackdrop = document.getElementById('cartBackdrop');
const cartDrawer = document.getElementById('cartDrawer');
const cartClose = document.getElementById('cartClose');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const cartSendBtn = document.getElementById('cartSendBtn');
const cartClear = document.getElementById('cartClear');

function openCart(){
  cartBackdrop.hidden = false;
  cartDrawer.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeCart(){
  cartBackdrop.hidden = true;
  cartDrawer.hidden = true;
  document.body.style.overflow = '';
}

cartBtn.addEventListener('click', openCart);
summaryEl.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartBackdrop.addEventListener('click', closeCart);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !cartDrawer.hidden) closeCart(); });

cartSendBtn.addEventListener('click', sendOrder);

cartClear.addEventListener('click', () => {
  PRODUCTS.forEach(p => { if (state[p.name] > 0) setQty(p.name, 0); });
});

function renderCartItems(){
  const { items } = getCartStats();
  if (items === 0){
    cartItemsEl.innerHTML = '<p class="cart-empty">Tu carrito está vacío.<br>Agregá productos del catálogo.</p>';
    return;
  }
  cartItemsEl.innerHTML = '';
  PRODUCTS.forEach(p => {
    const q = state[p.name];
    if (q === 0) return;

    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="cart-item-emoji">${p.emoji}</div>
      <div class="cart-item-info">
        <div class="name">${p.name}</div>
        <div class="line-price">${fmt(p.price)} c/u · <strong>${fmt(p.price * q)}</strong></div>
      </div>
      <div class="stepper" data-name="${p.name}">
        <button type="button" class="minus" aria-label="Quitar uno">−</button>
        <span class="qty">${q}</span>
        <button type="button" class="plus" aria-label="Agregar uno">+</button>
      </div>
      <button type="button" class="cart-item-remove" aria-label="Eliminar ${p.name}">✕</button>
    `;
    cartItemsEl.appendChild(row);

    row.querySelector('.plus').addEventListener('click', () => setQty(p.name, state[p.name] + 1));
    row.querySelector('.minus').addEventListener('click', () => setQty(p.name, state[p.name] - 1));
    row.querySelector('.cart-item-remove').addEventListener('click', () => setQty(p.name, 0));
  });
}

// ---- Header contact links ----
const genericText = encodeURIComponent(`Hola ${BUSINESS.name}! Quería hacer una consulta.`);
const genericWaUrl = `https://wa.me/${BUSINESS.whatsapp}?text=${genericText}`;
document.getElementById('headerWhatsapp').href = genericWaUrl;
document.getElementById('footerWhatsapp').href = genericWaUrl;
document.getElementById('year').textContent = new Date().getFullYear();

renderCartItems();
updateSummary();
