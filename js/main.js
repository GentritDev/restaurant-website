/*
timeInput  
   67-92 (JS Fundamentals, DOM, Modern Features)
  
  Client-Server Model Explanation:
  - Browseri (client) dërgon HTTP requests për resurse (HTML, CSS, JS, JSON)
  - Serveri përgjigjet me skedaret ose të dhënat e kërkuara
  - React/JS ndryshon DOM në bazë të të dhënave të marra
*/

// (68) - Modern variable declarations let/const
// (77) - querySelector / querySelectorAll
const qs = (sel, el = document) => el.querySelector(sel);
const qsa = (sel, el = document) => Array.from(el.querySelectorAll(sel));

// 
// 1. NAVIGIM MOBIL (79, 81)

const nav = qs('#siteNav');
const navToggle = qs('#navToggle');

if (navToggle) {
  // (81) - addEventListener
  navToggle.addEventListener('click', () => {
    // (79) - classList toggle
    const opened = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', opened ?  'true' : 'false');
  });
}

// Mbyll menunë kur klikon një link në mobile
qsa('#siteNav a').forEach(link => {
  link.addEventListener('click', () => {
    if (nav.classList.contains('open')) {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// 
// 2. FILTRIM I MENYSË (71, 72, 75, 77-79)
// 
const filterBtns = qsa('.filter-btn');
const menuGrid = qs('#menuGrid');

// (72, 75) - Loops me forEach, (88) - Array methods
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // (70) - Strict equality ===
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    // (75) - Array methods (forEach)
    qsa('.menu-card').forEach(card => {
      const visible = filter === 'gjitha' || card.dataset.category === filter;
      card.classList.toggle('hidden', !visible);
    });
  });
});

// 
// 3. LOAD MENU NGA JSON (90, 88, 85, 89)
// 
// (90) - fetch() API
// (91) - Promises me . then()/.catch()
function loadMenu() {
  fetch('data/menu.json')
    .then(response => {
      if (!response.ok) throw new Error('Gabim në ngarkim');
      return response.json();
    })
    .then(data => {
      // (88) - map() method
      // (85) - Template literals
      const html = data.map(item => `
        <article class="menu-card" data-category="${item.category}">
          <div class="menu-card-head">
            <h3>${item.title}</h3>
            <span class="price">€${item.price}</span>
          </div>
          <p>${item.description}</p>
          ${item.badge ? `<span class="badge ${item.badgeClass || ''}">${item.badge}</span>` : ''}
        </article>
      `).join('');
      
      if (menuGrid) menuGrid.innerHTML = html;
    })
    .catch(err => console.error('Gabim në menu:', err));
}

// Nëse ekziston menuGrid, ngarko menu
if (menuGrid) {
  loadMenu();
}

 
// 4. VALIDIM FORMASH (71, 82, 83, 92)

const reservationForm = qs('#reservationForm');
const contactForm = qs('#contactForm');

function getErrorElement(fieldName) {
  // (77) - querySelector
  return qs(`.error[data-for="${fieldName}"]`);
}

function setMinDate() {
  // (69) - Primitive types:  dates, strings
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const minDate = `${yyyy}-${mm}-${dd}`;
  
  const dateInput = qs('#date');
  if (dateInput) dateInput.min = minDate;
}

setMinDate();

function validateReservationForm() {
  // (71) - if/else logic
  let isValid = true;
  
  // Fshi gabimet e mëparshme
  qsa('.error').forEach(e => e.textContent = '');

  const fields = {
    name: { el: qs('#name'), required: true, minLength: 2 },
    email: { el: qs('#email'), required: true, isEmail: true },
    phone:  { el: qs('#phone'), required: true, pattern: /^[0-9+() \-]{7,}$/ },
    guests: { el: qs('#guests'), required: true, min: 1 },
    date: { el:  qs('#date'), required: true },
    time: { el: qs('#time'), required: true }
  };

  // (73, 75) - Functions, array methods
  Object.entries(fields).forEach(([key, field]) => {
    const { el, required, minLength, isEmail, pattern, min } = field;
    
    if (required && !el.value.trim()) {
      getErrorElement(key).textContent = 'Kjo fushë është e detyrueshme. ';
      isValid = false;
    } else if (minLength && el.value.length < minLength) {
      getErrorElement(key).textContent = `Minimum ${minLength} karaktere. `;
      isValid = false;
    } else if (isEmail && !el.value.includes('@')) {
      getErrorElement(key).textContent = 'Email i pavlefshëm. ';
      isValid = false;
    } else if (pattern && !pattern.test(el.value)) {
      getErrorElement(key).textContent = 'Format i pavlefshëm.';
      isValid = false;
    } else if (min && Number(el.value) < min) {
      getErrorElement(key).textContent = `Vlera minimum:  ${min}`;
      isValid = false;
    }
  });

  // Validim i orës
  const timeInput = qs('#time');
  if (timeInput && timeInput.value) {
    const [hh, mm] = timeInput.value.split(':').map(Number);
    const minutes = hh * 60 + mm;
    if (minutes < 10 * 60 || minutes > 23 * 60) {
      getErrorElement('time').textContent = 'Orari:  10:00 - 23:00';
      isValid = false;
    }
  }

  return isValid;
}

 
// 5. SUBMIT FORMA REZERVIMIT (81, 83, 92)

if (reservationForm) {
  reservationForm.addEventListener('submit', e => {
    // (83) - preventDefault()
    e.preventDefault();

    if (validateReservationForm()) {
      // (86) - Destructuring
      const { name, email, phone, guests, date, time, message } = Object.fromEntries(
        new FormData(reservationForm)
      );

      // (92) - localStorage
      const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      reservations.push({
        name,
        email,
        phone,
        guests,
        date,
        time,
                message,
                // (85) - Template literals
                createdAt: new Date().toISOString()
              });
        
              localStorage.setItem('reservations', JSON.stringify(reservations));
              alert('Rezervimi u dërgua me sukses!');
              reservationForm.reset();
              setMinDate();
            }
          });
        }