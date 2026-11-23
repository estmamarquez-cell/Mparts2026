(function () {
  const KEY = 'mparts_cart';
  const $ = (selector) => document.querySelector(selector);
  const money = (n) => '$' + Number(n || 0).toLocaleString('es-CO');
  let toastTimer;

  function getCart() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (_) { return []; }
  }
  function saveCart(cart, animateCount) {
    localStorage.setItem(KEY, JSON.stringify(cart));
    updateCount(animateCount);
  }
  function updateCount(animate) {
    const count = getCart().reduce((sum, item) => sum + Number(item.qty), 0);
    const el = $('#cart-count');
    if (!el) return;
    el.textContent = count;
    el.setAttribute('aria-label', count + ' productos en el carrito');
    if (animate) {
      el.classList.remove('bump');
      void el.offsetWidth;
      el.classList.add('bump');
      setTimeout(() => el.classList.remove('bump'), 450);
    }
  }
  function announce(message, level) {
    const toast = $('#cart-toast');
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = message + ' ';
    toast.className = 'cart-toast is-visible ' + (level || 'success');
    if (level !== 'limit') {
      const link = document.createElement('a');
      link.href = 'carrito.php';
      link.textContent = 'Ver carrito';
      toast.appendChild(link);
    }
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
  }
  function addProduct(button) {
    const cart = getCart();
    const code = button.dataset.codigo;
    const stock = Number(button.dataset.stock || 1);
    const found = cart.find((item) => item.code === code);
    if (found && found.qty >= stock) {
      button.textContent = 'Stock máximo';
      announce('Ya agregaste todas las unidades disponibles.', 'limit');
      setTimeout(() => { button.textContent = button.dataset.label; }, 1100);
      return;
    }
    if (found) found.qty += 1;
    else cart.push({ code, name: button.dataset.nombre, price: Number(button.dataset.precio), qty: 1, stock });
    saveCart(cart, true);
    button.textContent = '✓ Agregado';
    const card = button.closest('.card');
    if (card) {
      card.classList.remove('is-added');
      void card.offsetWidth;
      card.classList.add('is-added');
      setTimeout(() => card.classList.remove('is-added'), 550);
    }
    announce(button.dataset.nombre + ' se agregó al carrito.', 'success');
    setTimeout(() => { button.textContent = button.dataset.label; }, 1000);
  }

  document.querySelectorAll('.cart-add').forEach((button) => {
    button.dataset.label = button.textContent;
    button.addEventListener('click', () => addProduct(button));
  });

  function renderCart() {
    const items = getCart();
    const empty = $('#cart-empty');
    const content = $('#cart-content');
    const list = $('#cart-items');
    if (!list) return;
    empty.hidden = items.length > 0;
    content.hidden = items.length === 0;
    list.innerHTML = '';
    let total = 0;
    items.forEach((item, index) => {
      total += item.price * item.qty;
      const row = document.createElement('div');
      row.className = 'cart-row';
      row.innerHTML = '<div><b>' + escapeHtml(item.name) + '</b><small>Código ' + escapeHtml(item.code) + '</small></div>' +
        '<div class="qty"><button type="button" data-action="minus" data-index="' + index + '">−</button><span>' + item.qty + '</span><button type="button" data-action="plus" data-index="' + index + '">+</button></div>' +
        '<strong>' + money(item.price * item.qty) + '</strong><button class="cart-remove" type="button" data-action="remove" data-index="' + index + '">Eliminar</button>';
      list.appendChild(row);
    });
    $('#cart-total').textContent = money(total);
  }
  function escapeHtml(value) {
    const el = document.createElement('span');
    el.textContent = value;
    return el.innerHTML;
  }

  const items = $('#cart-items');
  if (items) {
    renderCart();
    items.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      const cart = getCart();
      const index = Number(button.dataset.index);
      const action = button.dataset.action;
      if (action === 'remove') cart.splice(index, 1);
      if (action === 'minus') cart[index].qty = Math.max(1, cart[index].qty - 1);
      if (action === 'plus') cart[index].qty = Math.min(cart[index].stock, cart[index].qty + 1);
      saveCart(cart);
      renderCart();
    });
  }
  const clear = $('#clear-cart');
  if (clear) clear.addEventListener('click', () => { saveCart([]); renderCart(); });
  const checkout = $('#checkout-wa');
  if (checkout) checkout.addEventListener('click', () => {
    const cart = getCart();
    if (!cart.length) return;
    let total = 0;
    let message = 'Hola M-PARTS, quiero hacer este pedido:\n\n';
    cart.forEach((item) => {
      const subtotal = item.price * item.qty;
      total += subtotal;
      message += '• ' + item.name + ' (' + item.code + ') — ' + item.qty + ' x ' + money(item.price) + ' = ' + money(subtotal) + '\n';
    });
    message += '\nTotal: ' + money(total) + '\n\n¿Deseas confirmar este pedido o agregar más productos?\n\nMis datos:\nNombre:\nDirección:\nCiudad:\nTeléfono:';
    window.open('https://wa.me/' + (window.MPARTS_WHATSAPP || '') + '?text=' + encodeURIComponent(message), '_blank', 'noopener');
  });
  updateCount();
})();
