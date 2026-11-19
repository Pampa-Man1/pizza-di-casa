// Pizza Di Casa , shared scripts

// Add .js class for reveal animations (progressive enhancement)
document.documentElement.classList.add('js');

// Mobile menu toggle
function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('open');
  const open = !!(menu && menu.classList.contains('open'));
  document.body.style.overflow = open ? 'hidden' : '';
  document.body.classList.toggle('menu-open', open);
}

// Smooth scroll for "Comment y aller" -> remonte un peu pour que le haut de la case soit visible
(function () {
  function bind() {
    document.querySelectorAll('a[href="#carte"], a[href="#carte-map"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var section = document.getElementById('carte');
        if (!section) return;
        e.preventDefault();
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        section.querySelectorAll('.reveal').forEach(function (r) { r.classList.add('in'); });
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();

// Cookie banner
function acceptCookies() {
  localStorage.setItem('cookies', 'accepted');
  document.getElementById('cookie-banner')?.classList.remove('show');
  loadMap();
}
function declineCookies() {
  localStorage.setItem('cookies', 'declined');
  document.getElementById('cookie-banner')?.classList.remove('show');
}

// Consent-gated Google Maps: only load the iframe if the user accepted cookies
function loadMap(trigger) {
  const containers = trigger
    ? [trigger.closest('[data-map-src]')]
    : Array.from(document.querySelectorAll('[data-map-src]'));
  containers.forEach((container) => {
    if (!container || container.querySelector('iframe')) return;
    const src = container.dataset.mapSrc;
    if (!src) return;
    const placeholder = container.querySelector('.map-placeholder');
    if (placeholder) placeholder.remove();
    const iframe = document.createElement('iframe');
    iframe.title = 'Carte Pizza Di Casa';
    iframe.src = src;
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    container.appendChild(iframe);
  });
}
(function () {
  if (localStorage.getItem('cookies') === 'accepted') {
    document.addEventListener('DOMContentLoaded', () => loadMap());
  }
})();
(function() {
  if (!localStorage.getItem('cookies')) {
    setTimeout(() => document.getElementById('cookie-banner')?.classList.add('show'), 1500);
  }
})();

// Scroll reveal
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

// Form submission feedback
function handleFormSubmit(e, successMsg) {
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Envoi en cours...';
  }
  // FormSubmit handles the actual submission; this just gives feedback
  setTimeout(() => {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Envoyer';
    }
  }, 3000);
}

// Time slot generator for ordering
function generateTimeSlots(selectEl, startHour, endHour, interval) {
  if (!selectEl) return;
  selectEl.innerHTML = '<option value="">Choisir un créneau</option>';
  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += interval) {
      if (h === endHour && m > 0) break;
      const time = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
      const opt = document.createElement('option');
      opt.value = time;
      opt.textContent = time;
      selectEl.appendChild(opt);
    }
  }
}

// Validate order/reservation date (no Mondays, must be today or future)
function validateDate(input) {
  if (!input || !input.value) return;
  const selected = new Date(input.value + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selected < today) {
    input.setCustomValidity('La date doit être aujourd\'hui ou dans le futur.');
    return false;
  }
  const day = selected.getDay();
  if (day >= 1 && day <= 4) {
    input.setCustomValidity('Nous sommes ouverts uniquement du vendredi au dimanche.');
    return false;
  }
  input.setCustomValidity('');
  return true;
}

// Auto-generate time slots and date validation on page load
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-timeslots]').forEach(el => {
    const start = parseInt(el.dataset.start || '17', 10);
    const end = parseInt(el.dataset.end || '22', 10);
    const interval = parseInt(el.dataset.interval || '30', 10);
    generateTimeSlots(el, start, end, interval);
  });
  document.querySelectorAll('input[type="date"]').forEach(input => {
    input.addEventListener('change', () => validateDate(input));
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    input.setAttribute('min', today);
  });
});

// Tab switching for commande/reservation
function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.tab-btn').forEach(el => {
    el.classList.remove('active');
    el.style.borderBottom = 'none';
  });
  const content = document.getElementById(tabId);
  if (content) content.style.display = 'block';
  const btn = document.querySelector('[data-tab="' + tabId + '"]');
  if (btn) {
    btn.classList.add('active');
    btn.style.borderBottom = '2px solid var(--color-accent)';
  }
}

// Toggle supplement panel when a pizza is checked/unchecked
function togglePizzaSupplements(checkbox) {
  const pizzaName = checkbox.value;
  const pizzaRow = checkbox.closest('.order-item');
  const container = document.getElementById('pizza-supplements');
  const panelId = 'supps-' + pizzaName.replace(/[^a-zA-Z0-9]/g, '');
  
  // Remove existing panel for this pizza
  const existingPanel = document.getElementById(panelId);
  if (existingPanel) existingPanel.remove();
  
  if (!checkbox.checked) return;
  
  // Get pizza price
  const price = pizzaRow ? pizzaRow.dataset.price : '0';
  
  // Create supplement panel
  const panel = document.createElement('div');
  panel.id = panelId;
  panel.style.cssText = 'margin-bottom:1rem; padding:0.75rem; border:1px solid var(--color-border); border-radius:var(--radius-sm); background:var(--color-bg-alt)';
  panel.innerHTML = '<p style="font-size:0.85rem; font-weight:600; margin-bottom:0.5rem">Suppléments pour ' + pizzaName + ' :</p>' +
    '<div style="display:flex; flex-wrap:wrap; gap:0.5rem">' +
    '<label style="font-size:0.85rem; cursor:pointer"><input type="checkbox" data-pizza-supp="' + pizzaName + '" value="Fromages" data-price="3.00" onchange="updateOrderTotal()" /> Fromages (+3,00 €)</label>' +
    '<label style="font-size:0.85rem; cursor:pointer"><input type="checkbox" data-pizza-supp="' + pizzaName + '" value="Légumes" data-price="2.00" onchange="updateOrderTotal()" /> Légumes (+2,00 €)</label>' +
    '<label style="font-size:0.85rem; cursor:pointer"><input type="checkbox" data-pizza-supp="' + pizzaName + '" value="Burrata" data-price="4.00" onchange="updateOrderTotal()" /> Burrata (+4,00 €)</label>' +
    '<label style="font-size:0.85rem; cursor:pointer"><input type="checkbox" data-pizza-supp="' + pizzaName + '" value="Viandes" data-price="3.00" onchange="updateOrderTotal()" /> Viandes (+3,00 €)</label>' +
    '<label style="font-size:0.85rem; cursor:pointer"><input type="checkbox" data-pizza-supp="' + pizzaName + '" value="Poissons" data-price="3.50" onchange="updateOrderTotal()" /> Poissons (+3,50 €)</label>' +
    '</div>';
  container.appendChild(panel);
}

// Order total calculator
function updateOrderTotal() {
  let total = 0;
  document.querySelectorAll('.order-item').forEach(row => {
    const checkbox = row.querySelector('input[type="checkbox"]');
    const qty = row.querySelector('input[type="number"]');
    const price = parseFloat(row.dataset.price || '0');
    if (checkbox && checkbox.checked && qty) {
      total += price * (parseInt(qty.value, 10) || 1);
    }
  });
  // Add pizza supplements
  document.querySelectorAll('[data-pizza-supp]').forEach(cb => {
    if (cb.checked) {
      const pizzaName = cb.dataset.pizzaSupp;
      const pizzaCheckbox = document.querySelector('input[name="pizza"][value="' + pizzaName + '"]');
      const pizzaRow = pizzaCheckbox ? pizzaCheckbox.closest('.order-item') : null;
      const qtyInput = pizzaRow ? pizzaRow.querySelector('input[type="number"]') : null;
      const qty = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;
      const suppPrice = parseFloat(cb.dataset.price || '0');
      total += suppPrice * qty;
    }
  });
  const totalEl = document.getElementById('order-total');
  if (totalEl) totalEl.textContent = total.toFixed(2).replace('.', ',') + ' €';
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.order-item input').forEach(input => {
    input.addEventListener('change', updateOrderTotal);
  });
  updateOrderTotal();
});
