const PRODUCT = {
  id: "pawsafe-den",
  name: "PawSafe Den",
  basePrice: 89.00,
  image: "🦴",
  sizes: [
    { label: "Small", priceDelta: 0, desc: "Toy & small breeds, up to 10 kg" },
    { label: "Medium", priceDelta: 10, desc: "Medium breeds, 11–25 kg" },
    { label: "Large", priceDelta: 20, desc: "Large breeds, 26–40 kg" }
  ],
  modes: [
    { label: "Puppy", desc: "Gentle puzzles, softer treats" },
    { label: "Adult", desc: "Standard challenge, full speed" },
    { label: "Senior", desc: "Low-impact, slow treat release" }
  ],
  energy: [
    { label: "Low", desc: "Calm, slower movement cycles" },
    { label: "High", desc: "Active, frequent rolling & treats" }
  ],
  features: [
    { icon: "👃", title: "Scent chambers", text: "Hidden smell puzzles engage nose work for hours." },
    { icon: "🧩", title: "Puzzle solving", text: "Sliding dials, flip covers and rotating maze keep the mind busy." },
    { icon: "🏃", title: "Motorized movement", text: "Auto on/off rolling treat ball encourages physical play." },
    { icon: "🍖", title: "Treat rewards", text: "Slow-release dispensing rewards completion without overfeeding." },
    { icon: "🔍", title: "Exploration", text: "Multiple hidden compartments invite discovery and foraging." },
    { icon: "🛡️", title: "Safety first", text: "Chew-proof BPA-free materials, rounded edges, no choking hazards, thermal shutoff." }
  ],
  benefits: [
    "Keeps dogs engaged 4–8 hours while you are away",
    "Reduces separation anxiety and destructive chewing",
    "Mental + physical stimulation in one station",
    "Works for puppies, adults and seniors",
    "No choking hazards, no overheating, no sharp edges",
    "Dishwasher-safe removable tray"
  ],
  reviews: [
    { name: "Maya T.", stars: 5, text: "Our labrador used to chew the sofa. Now he spends the whole morning with the Den. Worth every penny." },
    { name: "David K.", stars: 5, text: "Great for my puppy — the gentle mode is perfect and the parts are too big to swallow." },
    { name: "Sofia L.", stars: 4, text: "Easy to clean and keeps our border collie tired out while we work." }
  ]
};

let cart = JSON.parse(localStorage.getItem("pawsafe_cart")) || [];
let orderId = null;

function saveCart() {
  localStorage.setItem("pawsafe_cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (!el) return;
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  el.textContent = total;
  el.style.display = total > 0 ? "grid" : "none";
}

function addToCart(size, mode, energy, qty, price) {
  const existing = cart.find(i => i.size === size && i.mode === mode && i.energy === energy);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: PRODUCT.id, name: PRODUCT.name, size, mode, energy, qty, price, image: PRODUCT.image });
  }
  saveCart();
  showToast("Added to cart");
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart();
  renderCart();
}

function cartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function formatMoney(n) { return "₹" + n.toFixed(2); }

function showToast(msg) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1800);
}

function renderProductOptions(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  let html = "";
  PRODUCT.sizes.forEach((s, i) => {
    html += `<button class="size-pill${i === 0 ? " selected" : ""}" data-type="size" data-value="${s.label}">${s.label}</button>`;
  });
  PRODUCT.modes.forEach((m, i) => {
    html += `<button class="size-pill${i === 0 ? " selected" : ""}" data-type="mode" data-value="${m.label}">${m.label}</button>`;
  });
  PRODUCT.energy.forEach((e, i) => {
    html += `<button class="size-pill${i === 0 ? " selected" : ""}" data-type="energy" data-value="${e.label}">${e.label}</button>`;
  });
  container.innerHTML = `<div class="size-options" id="option-pills">${html}</div>`;
  setupOptionPills();
}

let selSize = PRODUCT.sizes[0].label;
let selMode = PRODUCT.modes[0].label;
let selEnergy = PRODUCT.energy[0].label;

function setupOptionPills() {
  const pills = document.querySelectorAll("#option-pills .size-pill");
  pills.forEach(p => {
    p.addEventListener("click", () => {
      const type = p.dataset.type;
      const value = p.dataset.value;
      document.querySelectorAll(`#option-pills [data-type="${type}"]`).forEach(x => x.classList.remove("selected"));
      p.classList.add("selected");
      if (type === "size") selSize = value;
      if (type === "mode") selMode = value;
      if (type === "energy") selEnergy = value;
      updateProductPrice();
    });
  });
}

function updateProductPrice() {
  const size = PRODUCT.sizes.find(s => s.label === selSize);
  const price = PRODUCT.basePrice + (size ? size.priceDelta : 0);
  const el = document.getElementById("product-price");
  if (el) el.textContent = formatMoney(price);
  window._currentPrice = price;
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const empty = document.getElementById("empty-cart");
  const summary = document.getElementById("cart-summary");
  if (!container) return;
  if (cart.length === 0) {
    if (empty) empty.style.display = "block";
    if (summary) summary.style.display = "none";
    return;
  }
  if (empty) empty.style.display = "none";
  if (summary) summary.style.display = "block";
  container.innerHTML = cart.map((item, i) => {
    const lineTotal = item.price * item.qty;
    return `
      <div class="cart-item">
        <div class="cart-item-img">${item.image}</div>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div class="cart-item-opt">${item.size} • ${item.mode} • ${item.energy}</div>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="appChangeQty(${i}, -1)">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="appChangeQty(${i}, 1)">+</button>
        </div>
        <div class="cart-item-price">${formatMoney(lineTotal)}</div>
        <button class="remove-item" onclick="appRemove(${i})">Remove</button>
      </div>
    `;
  }).join("");
  document.getElementById("cart-total").textContent = formatMoney(cartTotal());
}

window.appChangeQty = changeQty;
window.appRemove = removeFromCart;

// Checkout
function renderCheckoutSummary() {
  const container = document.getElementById("checkout-items");
  const totalEl = document.getElementById("checkout-total");
  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    if (totalEl) totalEl.textContent = formatMoney(0);
    return;
  }
  container.innerHTML = cart.map(item => `
    <div class="order-item-row">
      <span>${item.name} (${item.size}, ${item.mode}) × ${item.qty}</span>
      <span>${formatMoney(item.price * item.qty)}</span>
    </div>
  `).join("");
  if (totalEl) totalEl.textContent = formatMoney(cartTotal());
}

function initCheckoutForm() {
  const form = document.getElementById("checkout-form");
  if (!form) return;
  const paymentOpts = document.querySelectorAll(".payment-option");
  let selectedPayment = "card";
  paymentOpts.forEach(opt => {
    opt.addEventListener("click", () => {
      paymentOpts.forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");
      selectedPayment = opt.dataset.payment;
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
    const radio = opt.querySelector('input[type="radio"]');
    if (radio && radio.checked) {
      opt.classList.add("selected");
      selectedPayment = opt.dataset.payment;
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.elements["full-name"].value.trim();
    const email = form.elements["email"].value.trim();
    const address = form.elements["address"].value.trim();
    if (!name || !email || !address) {
      showToast("Please fill in all required fields.");
      return;
    }
    orderId = "PS" + Date.now().toString().slice(-6);
    const order = {
      id: orderId,
      date: new Date().toISOString(),
      items: [...cart],
      total: cartTotal(),
      customer: { name, email, address },
      payment: selectedPayment
    };
    localStorage.setItem("pawsafe_order", JSON.stringify(order));
    cart = [];
    saveCart();
    location.href = "confirmation.html";
  });
}

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

// Global init
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  if (document.getElementById("cart-items")) renderCart();
  if (document.getElementById("checkout-items")) renderCheckoutSummary();
  if (document.getElementById("checkout-form")) initCheckoutForm();
  if (document.getElementById("confirm-items")) renderConfirmation();
  const addBtn = document.getElementById("add-to-cart");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const qty = parseInt(document.getElementById("qty-val").textContent) || 1;
      addToCart(selSize, selMode, selEnergy, qty, window._currentPrice || PRODUCT.basePrice);
    });
  }
});
