/* ===== PawSafe Den — Application Logic ===== */
const PRODUCT = {
  id: "pawsafe-den",
  name: "PawSafe Den",
  basePrice: 89.00,
  image: "🦴",
  sizes: [
    { label: "Small", priceDelta: 0, desc: "Toy & small breeds, up to 10 kg", dims: "28 × 22 × 16 cm" },
    { label: "Medium", priceDelta: 12, desc: "Medium breeds, 11–25 kg", dims: "36 × 28 × 20 cm" },
    { label: "Large", priceDelta: 24, desc: "Large breeds, 26–40 kg", dims: "44 × 34 × 24 cm" }
  ],
  modes: [
    { label: "Puppy", desc: "Gentle puzzles, softer treat release" },
    { label: "Adult", desc: "Standard challenge, full movement" },
    { label: "Senior", desc: "Low-impact cycles, slow dispensing" }
  ],
  energy: [
    { label: "Low", desc: "Calm, slower movement cycles" },
    { label: "High", desc: "Active, frequent rolling & treats" }
  ],
  materials: "BPA-free, chew-proof polypropylene; food-grade silicone seals; stainless-steel treat tray",
  specs: {
    weight: "1.2 kg (Small) / 1.8 kg (Medium) / 2.5 kg (Large)",
    power: "USB-C rechargeable, up to 14 hours per charge",
    compartments: "6 hidden scent chambers + rotating treat maze",
    safety: "No choking hazards • No overheating (auto shutoff) • Rounded edges • No sharp parts",
    cleaning: "Dishwasher-safe removable tray; wipe base with damp cloth"
  },
  included: [
    { qty: 1, item: "PawSafe Den station" },
    { qty: 1, item: "Motorized treat ball" },
    { qty: 1, item: "USB-C charging cable" },
    { qty: 1, item: "Removable dishwasher-safe tray" },
    { qty: 1, item: "Quick-start guide" }
  ],
  usage: [
    "Fill the scent chambers with your dog’s favourite dry treats.",
    "Choose Size, Mode and Energy level to match your dog.",
    "Place the station on a flat floor and press the power dial.",
    "Let your dog sniff, puzzle and play while you are away.",
    "Remove the tray and rinse it when the session ends."
  ],
  care: [
    "Wipe the base weekly with a damp, soft cloth.",
    "Wash the treat tray in the dishwasher or by hand.",
    "Recharge via USB-C when the indicator dims.",
    "Do not submerge the motorized ball in water."
  ],
  reviews: [
    { name: "Maya T.", stars: 5, text: "Our labrador used to chew the sofa. Now he spends the whole morning with the Den. Worth every penny." },
    { name: "David K.", stars: 5, text: "Great for my puppy — the gentle mode is perfect and the parts are too big to swallow." },
    { name: "Sofia L.", stars: 4, text: "Easy to clean and keeps our border collie tired out while we work." },
    { name: "Rahul P.", stars: 5, text: "The scent chambers keep him busy for hours. Build quality feels premium." }
  ]
};

let cart = JSON.parse(localStorage.getItem("pawsafe_cart")) || [];
let orderId = null;

let selSize = PRODUCT.sizes[0].label;
let selMode = PRODUCT.modes[0].label;
let selEnergy = PRODUCT.energy[0].label;
let qtyVal = 1;

function saveCart() {
  localStorage.setItem("pawsafe_cart", JSON.stringify(cart));
  updateCartCount();
}
function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (!el) return;
  const total = cart.reduce((s, i) => s + i.qty, 0);
  el.textContent = total;
  el.style.display = total > 0 ? "grid" : "none";
}
function formatMoney(n) { return "₹" + Number(n).toFixed(2); }

function currentPrice() {
  const size = PRODUCT.sizes.find(s => s.label === selSize);
  return PRODUCT.basePrice + (size ? size.priceDelta : 0);
}

function addToCart(size, mode, energy, qty, price) {
  const existing = cart.find(i => i.size === size && i.mode === mode && i.energy === energy);
  if (existing) existing.qty += qty;
  else cart.push({ id: PRODUCT.id, name: PRODUCT.name, size, mode, energy, qty, price, image: PRODUCT.image });
  saveCart();
  showToast("Added to cart");
}
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}
function changeCartQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart();
  renderCart();
}
function cartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}
function cartItemCount() { return cart.reduce((s, i) => s + i.qty, 0); }

function showToast(msg) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t);
  }
  t.textContent = msg; t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1800);
}

/* ---- Reveal on scroll ---- */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
  }, { threshold: 0.12 });
  els.forEach(e => obs.observe(e));
}

/* ---- Mobile nav ---- */
function initMobileNav() {
  const btn = document.querySelector(".mobile-menu-btn");
  const drawer = document.getElementById("nav-drawer");
  const close = drawer ? drawer.querySelector(".close-btn") : null;
  if (!btn || !drawer) return;
  btn.addEventListener("click", () => drawer.classList.toggle("open"));
  if (close) close.addEventListener("click", () => drawer.classList.remove("open"));
  drawer.querySelectorAll("a").forEach(a => a.addEventListener("click", () => drawer.classList.remove("open")));
}

/* ---- Product page options ---- */
function renderOptions(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const groups = [
    { key: "size", label: "Size", items: PRODUCT.sizes.map(s => ({ label: s.label, delta: s.priceDelta })) },
    { key: "mode", label: "Mode", items: PRODUCT.modes.map(m => ({ label: m.label, delta: 0 })) },
    { key: "energy", label: "Energy", items: PRODUCT.energy.map(e => ({ label: e.label, delta: 0 })) }
  ];
  let html = "";
  groups.forEach(g => {
    let selectedValue = selSize;
    if (g.key === "mode") selectedValue = selMode;
    if (g.key === "energy") selectedValue = selEnergy;
    html += `<div class="${g.key}-group"><label>${g.label}</label><div class="pill-row">`;
    g.items.forEach((it, i) => {
      const isSel = it.label === selectedValue;
      html += `<button class="pill${isSel ? " selected" : ""}" data-group="${g.key}" data-value="${it.label}">${it.label}${it.delta > 0 ? " +₹" + it.delta : ""}</button>`;
    });
    html += `</div></div>`;
  });
  container.innerHTML = html;
  container.querySelectorAll(".pill").forEach(p => {
    p.addEventListener("click", () => {
      const group = p.dataset.group;
      p.parentElement.querySelectorAll(".pill").forEach(x => x.classList.remove("selected"));
      p.classList.add("selected");
      if (group === "size") selSize = p.dataset.value;
      if (group === "mode") selMode = p.dataset.value;
      if (group === "energy") selEnergy = p.dataset.value;
      refreshPrice();
    });
  });
}
function refreshPrice() {
  const price = currentPrice();
  const el = document.getElementById("product-price");
  if (el) el.textContent = formatMoney(price);
  const old = document.getElementById("old-price");
  if (old) old.textContent = formatMoney(price + 10);
  window._currentPrice = price;
}

/* ---- Product qty controls (product page) ---- */
function initProductQty() {
  const minus = document.getElementById("qty-minus");
  const plus = document.getElementById("qty-plus");
  const val = document.getElementById("qty-val");
  if (!minus || !plus || !val) return;
  minus.addEventListener("click", () => { qtyVal = Math.max(1, qtyVal - 1); val.textContent = qtyVal; });
  plus.addEventListener("click", () => { qtyVal += 1; val.textContent = qtyVal; });
}
function initAddToCart() {
  const btn = document.getElementById("add-to-cart");
  if (!btn) return;
  btn.addEventListener("click", () => {
    addToCart(selSize, selMode, selEnergy, qtyVal, currentPrice());
    btn.classList.add("adding");
    setTimeout(() => btn.classList.remove("adding"), 600);
  });
}

/* ---- Cart page ---- */
function renderCart() {
  const container = document.getElementById("cart-items");
  const empty = document.getElementById("empty-cart");
  const sidebar = document.getElementById("cart-sidebar");
  const totalEl = document.getElementById("cart-total");
  const totalFinal = document.getElementById("cart-total-final");
  if (!container) return;
  if (cart.length === 0) {
    if (empty) empty.style.display = "block";
    if (sidebar) sidebar.style.display = "none";
    return;
  }
  if (empty) empty.style.display = "none";
  if (sidebar) sidebar.style.display = "block";
  container.innerHTML = cart.map((item, i) => {
    const line = item.price * item.qty;
    return `
      <div class="cart-item">
        <div class="cart-item-img">${item.image}</div>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div class="cart-item-opt">${item.size} • ${item.mode} • ${item.energy}</div>
        </div>
        <div class="cart-qty">
          <button class="qty-btn" onclick="appChangeQty(${i}, -1)">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="appChangeQty(${i}, 1)">+</button>
        </div>
        <div class="cart-item-price">${formatMoney(line)}</div>
        <button class="remove-item" onclick="appRemove(${i})">Remove</button>
      </div>
    `;
  }).join("");
  if (totalEl) totalEl.textContent = formatMoney(cartTotal());
  if (totalFinal) totalFinal.textContent = formatMoney(cartTotal());
}
window.appChangeQty = changeCartQty;
window.appRemove = removeFromCart;

/* ---- Checkout summary ---- */
function renderCheckoutSummary() {
  const container = document.getElementById("checkout-items");
  const totalEl = document.getElementById("checkout-total");
  if (!container) return;
  if (cart.length === 0) { container.innerHTML = "<p>Your cart is empty.</p>"; if (totalEl) totalEl.textContent = formatMoney(0); return; }
  container.innerHTML = cart.map(item => `
    <div style="display:flex;justify-content:space-between;font-size:0.9rem;padding:4px 0;color:var(--ink);">
      <span>${item.name} (${item.size}, ${item.mode}) × ${item.qty}</span>
      <span>${formatMoney(item.price * item.qty)}</span>
    </div>
  `).join("");
  if (totalEl) totalEl.textContent = formatMoney(cartTotal());
}

/* ---- Checkout form ---- */
function initCheckout() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  // Payment selection
  const opts = document.querySelectorAll(".payment-option");
  let selectedPayment = "card";
  opts.forEach(opt => {
    opt.addEventListener("click", () => {
      opts.forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");
      const r = opt.querySelector('input[type="radio"]'); if (r) r.checked = true;
      selectedPayment = opt.dataset.payment;
    });
    const r = opt.querySelector('input[type="radio"]');
    if (r && r.checked) { opt.classList.add("selected"); selectedPayment = opt.dataset.payment; }
  });

  // Field validation on blur
  const fields = ["full-name", "email", "address", "phone"];
  fields.forEach(name => {
    const input = form.elements[name];
    if (!input) return;
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => { if (input.classList.contains("input-error")) validateField(input); });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    fields.forEach(name => { if (!validateField(form.elements[name])) valid = false; });
    if (!valid) {
      showToast("Please complete all required fields.");
      return;
    }
    const name = form.elements["full-name"].value.trim();
    const email = form.elements["email"].value.trim();
    const address = form.elements["address"].value.trim();
    const order = {
      id: "PS" + Date.now().toString().slice(-6),
      date: new Date().toISOString(),
      items: cart.map(i => ({ ...i })),
      total: cartTotal(),
      customer: { name, email, address, phone: form.elements["phone"].value.trim() },
      payment: selectedPayment
    };
    localStorage.setItem("pawsafe_order", JSON.stringify(order));
    cart = []; saveCart();
    location.href = "confirmation.html";
  });
}
function validateField(input) {
  let valid = true;
  const msg = input.parentElement.querySelector(".error-msg");
  const v = input.value.trim();
  if (input.required && !v) valid = false;
  if (input.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) valid = false;
  if (input.type === "tel" && v && !/^[\d\s\+\-]{7,}$/.test(v)) valid = false;
  input.classList.toggle("input-error", !valid);
  if (msg) msg.style.display = valid ? "none" : "block";
  return valid;
}

/* ---- Confirmation ---- */
function renderConfirmation() {
  const order = JSON.parse(localStorage.getItem("pawsafe_order") || "null");
  if (!order) { location.href = "cart.html"; return; }
  document.getElementById("order-id").textContent = order.id;
  document.getElementById("order-date").textContent = new Date(order.date).toLocaleDateString();
  document.getElementById("order-customer").textContent = order.customer.name;
  const container = document.getElementById("confirm-items");
  const totalEl = document.getElementById("confirm-total");
  container.innerHTML = order.items.map(item => `
    <div class="order-item-row">
      <span>${item.name} (${item.size}, ${item.mode}) × ${item.qty}</span>
      <span>${formatMoney(item.price * item.qty)}</span>
    </div>
  `).join("");
  totalEl.textContent = formatMoney(order.total);
  localStorage.removeItem("pawsafe_order");
}

/* ---- Global init ---- */
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  initReveal();
  initMobileNav();
  if (document.getElementById("cart-items")) renderCart();
  if (document.getElementById("checkout-items")) renderCheckoutSummary();
  if (document.getElementById("checkout-form")) initCheckout();
  if (document.getElementById("confirm-items")) renderConfirmation();
  initProductQty();
  initAddToCart();
  if (document.getElementById("options-container")) renderOptions("options-container");
  refreshPrice();
});
