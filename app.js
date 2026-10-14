const fmt = n => n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const CART_KEY = 'legostun-cart';
const FAVORITES_KEY = 'legostun-favorites';

function loadCart(){
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || '{}');
    const cart = {};
    PRODUCTS.forEach(p => { cart[p.name] = saved[p.name] > 0 ? saved[p.name] : 0; });
    return cart;
  } catch (e) {
    return Object.fromEntries(PRODUCTS.map(p => [p.name, 0]));
  }
}
function saveCart(){
  try { localStorage.setItem(CART_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
}

function loadFavorites(){
  try { return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')); }
  catch (e) { return new Set(); }
}
function saveFavorites(){
  try { localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites])); } catch (e) { /* storage unavailable */ }
}

const state = loadCart(); // name -> qty
const favorites = loadFavorites(); // Set of product names

const filters = { query: '', category: 'Todos', favoritesOnly: false, sort: 'relevance' };
const categories = [...new Set(PRODUCTS.map(p => p.category))];

// ---- Build chips ----
const chipsEl = document.getElementById('chips');
function buildChips(){
  const chipDefs = ['Todos', ...categories];
  chipDefs.forEach(cat => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.textContent = cat;
    chip.dataset.category = cat;
    chip.addEventListener('click', () => {
      filters.category = cat;
      filters.favoritesOnly = false;
      syncChipState();
      render();
    });
    chipsEl.appendChild(chip);
  });

  const favChip = document.createElement('button');
  favChip.type = 'button';
  favChip.className = 'chip chip-fav';
  favChip.id = 'favChip';
  favChip.innerHTML = '♥ Favoritos';
  favChip.addEventListener('click', () => {
    filters.favoritesOnly = !filters.favoritesOnly;
    syncChipState();
    render();
  });
  chipsEl.appendChild(favChip);
}
function syncChipState(){
  chipsEl.querySelectorAll('.chip[data-category]').forEach(c => {
    c.classList.toggle('active', !filters.favoritesOnly && c.dataset.category === filters.category);
  });
  document.getElementById('favChip').classList.toggle('active', filters.favoritesOnly);
}

// ---- Build product cards (once) ----
const gridEl = document.getElementById('grid');
const emptyStateEl = document.getElementById('emptyState');
const cardsByName = {};
const qtyDisplays = {}; // name -> card qty span

PRODUCTS.forEach(p => {
  qtyDisplays[p.name] = null;

  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.name = p.name;
  card.dataset.category = p.category;
  card.innerHTML = `
    <button type="button" class="fav-btn" aria-label="Agregar a favoritos" aria-pressed="${favorites.has(p.name)}">♥</button>
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

  if (favorites.has(p.name)) card.querySelector('.fav-btn').classList.add('active');

  qtyDisplays[p.name] = card.querySelector('.qty');
  card.querySelector('.plus').addEventListener('click', () => {
    const wasZero = state[p.name] === 0;
    setQty(p.name, state[p.name] + 1);
    showToast(wasZero ? `${p.name} agregado` : `${p.name} actualizado`);
  });
  card.querySelector('.minus').addEventListener('click', () => {
    if (state[p.name] > 0) setQty(p.name, state[p.name] - 1);
  });
  card.querySelector('.fav-btn').addEventListener('click', () => {
    if (favorites.has(p.name)) favorites.delete(p.name); else favorites.add(p.name);
    saveFavorites();
    card.querySelector('.fav-btn').classList.toggle('active');
    card.querySelector('.fav-btn').setAttribute('aria-pressed', favorites.has(p.name));
    if (filters.favoritesOnly) render();
  });

  cardsByName[p.name] = card;
  gridEl.appendChild(card);
});

// ---- Filtering, sorting, rendering ----
function render(){
  let visible = PRODUCTS.filter(p => {
    if (filters.favoritesOnly && !favorites.has(p.name)) return false;
    if (!filters.favoritesOnly && filters.category !== 'Todos' && p.category !== filters.category) return false;
    if (filters.query && !norm(p.name).includes(norm(filters.query)) && !norm(p.desc).includes(norm(filters.query))) return false;
    return true;
  });

  if (filters.sort === 'price-asc') visible = visible.slice().sort((a, b) => a.price - b.price);
  if (filters.sort === 'price-desc') visible = visible.slice().sort((a, b) => b.price - a.price);

  const visibleNames = new Set(visible.map(p => p.name));
  PRODUCTS.forEach(p => { cardsByName[p.name].hidden = !visibleNames.has(p.name); });
  visible.forEach(p => gridEl.appendChild(cardsByName[p.name])); // reorder to match sort

  emptyStateEl.hidden = visible.length > 0;
}

// ---- Shared qty update ----
function setQty(name, qty){
  state[name] = Math.max(0, qty);
  if (qtyDisplays[name]) qtyDisplays[name].textContent = state[name];
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
function toggleCart(){
  if (cartDrawer.hidden) openCart(); else closeCart();
}

cartBtn.addEventListener('click', toggleCart);
summaryEl.addEventListener('click', toggleCart);
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

// ---- Toolbar: search + sort ----
document.getElementById('searchInput').addEventListener('input', e => {
  filters.query = e.target.value;
  render();
});
document.getElementById('sortSelect').addEventListener('change', e => {
  filters.sort = e.target.value;
  render();
});

// ---- Header contact links ----
const genericText = encodeURIComponent(`Hola ${BUSINESS.name}! Quería hacer una consulta.`);
const genericWaUrl = `https://wa.me/${BUSINESS.whatsapp}?text=${genericText}`;
document.getElementById('headerWhatsapp').href = genericWaUrl;
document.getElementById('footerWhatsapp').href = genericWaUrl;
document.getElementById('year').textContent = new Date().getFullYear();

buildChips();
syncChipState();
render();
renderCartItems();
updateSummary();
