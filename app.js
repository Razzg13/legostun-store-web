const fmt = n => n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

const state = {}; // name -> qty

const catalogEl = document.getElementById('catalog');
const categories = [...new Set(PRODUCTS.map(p => p.category))];

categories.forEach(cat => {
  const label = document.createElement('div');
  label.className = 'cat-label';
  label.textContent = cat;
  catalogEl.appendChild(label);

  const grid = document.createElement('div');
  grid.className = 'grid';

  PRODUCTS.filter(p => p.category === cat).forEach(p => {
    state[p.name] = 0;

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
          <span class="qty">0</span>
          <button type="button" class="plus" aria-label="Agregar">+</button>
        </div>
      </div>
    `;
    grid.appendChild(card);

    const stepper = card.querySelector('.stepper');
    const qtyEl = stepper.querySelector('.qty');
    stepper.querySelector('.plus').addEventListener('click', () => {
      state[p.name]++;
      qtyEl.textContent = state[p.name];
      showToast(`${p.name} agregado`);
      updateSummary();
    });
    stepper.querySelector('.minus').addEventListener('click', () => {
      if (state[p.name] > 0) {
        state[p.name]--;
        qtyEl.textContent = state[p.name];
        updateSummary();
      }
    });
  });

  catalogEl.appendChild(grid);
});

const summaryEl = document.getElementById('summary');
const sendBtn = document.getElementById('sendBtn');

function updateSummary(){
  let items = 0, total = 0;
  PRODUCTS.forEach(p => {
    const q = state[p.name];
    if (q > 0){ items += q; total += q * p.price; }
  });
  if (items === 0){
    summaryEl.textContent = 'Tu pedido está vacío';
    sendBtn.disabled = true;
  } else {
    summaryEl.innerHTML = `<strong>${fmt(total)}</strong> · ${items} ${items === 1 ? 'producto' : 'productos'}`;
    sendBtn.disabled = false;
  }
}

let toastTimer;
function showToast(msg){
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1200);
}

sendBtn.addEventListener('click', () => {
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
});

updateSummary();
