/* --------------------------------------------------
   main.js
   Funksionalitete kryesore interaktive për faqen:
   - Toggle i menusë mobile
   - Smooth scroll manual + highlight aktiv me IntersectionObserver
   - Filtrimi i menysë sipas kategorive (data-* attributes)
   - Validimi i formës së rezervimit + ruajtje demonstruese në localStorage
   - Vendosja dinamike e vitit në footer
-------------------------------------------------- */
(function(){
  /* Shkurtesa për querySelector / querySelectorAll */
  const qs = (sel, el=document) => el.querySelector(sel);
  const qsa = (sel, el=document) => Array.from(el.querySelectorAll(sel));

  /* ------------------ Navigimi Mobil ------------------ */
  const nav = qs('#siteNav');
  const navToggle = qs('#navToggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const opened = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
  }
  // Mbyll menunë kur klikon një link në mobile
  qsa('#siteNav a').forEach(link=>{
    link.addEventListener('click', ()=>{
      if (nav.classList.contains('open')) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded','false');
      }
    });
  });

  /* ------------------ Smooth Scroll + Update URL ------------------ */
  qsa('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const href = a.getAttribute('href');
      if (href && href.length > 1) {
        const target = qs(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({behavior:'smooth', block:'start'});
          history.replaceState(null,'', href);
        }
      }
    });
  });

  /* ------------------ Highlight Seksioni Aktiv ------------------ */
  const sections = qsa('main section[id]');
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      const id = entry.target.getAttribute('id');
      const navLink = qs(`.nav a[href="#${id}"]`);
      if (entry.isIntersecting && navLink){
        qsa('.nav a').forEach(l=>l.classList.remove('active'));
        navLink.classList.add('active');
      }
    });
  }, {
    rootMargin: '-35% 0px -55% 0px',
    threshold: 0
  });
  sections.forEach(s=>observer.observe(s));

  /* ------------------ Filtrim i Menysë ------------------ */
  const filterBtns = qsa('.filter-btn');
  const items = qsa('.menu-card');
  filterBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      // UI state
      filterBtns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      items.forEach(card=>{
        const cat = card.dataset.category;
        const visible = (filter === 'gjitha' || filter === cat);
        card.classList.toggle('hidden', !visible);
      });
    });
  });

  /* ------------------ Rezervime (Form Validim) ------------------ */
  const form = qs('#reservationForm');
  const errorFor = name => qs(`.error[data-for="${name}"]`);

  // Vendos datën minimale = sot
  function setMinDate(){
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth()+1).padStart(2,'0');
    const dd = String(now.getDate()).padStart(2,'0');
    const min = `${yyyy}-${mm}-${dd}`;
    const dateInput = qs('#date');
    if (dateInput) dateInput.min = min;
  }
  setMinDate();

  // Funksion validimi
  function validate(){
    let ok = true;
    // Fshi gabimet e mëparshme
    qsa('.error').forEach(e=>e.textContent='');

    const name = qs('#name');
    const email = qs('#email');
    const phone = qs('#phone');
    const guests = qs('#guests');
    const date = qs('#date');
    const time = qs('#time');

    if (!name.value.trim()) { errorFor('name').textContent = 'Shkruani emrin.'; ok=false; }
    if (!email.validity.valid){ errorFor('email').textContent = 'Email i pavlefshëm.'; ok=false; }
    if (!phone.validity.valid){ errorFor('phone').textContent = 'Numër telefoni i pavlefshëm.'; ok=false; }
    if (!guests.value || Number(guests.value) < 1){ errorFor('guests').textContent = '≥ 1.'; ok=false; }
    if (!date.value){ errorFor('date').textContent = 'Zgjidhni datën.'; ok=false; }
    if (!time.value){ errorFor('time').textContent = 'Zgjidhni orën.'; ok=false; }

    // Orari i lejuar 10:00 - 23:00
    if (time.value){
      const [hh, mm] = time.value.split(':').map(Number);
      const minutes = hh*60 + mm;
      const open = 10*60, close = 23*60;
      if (minutes < open || minutes > close){
        errorFor('time').textContent = 'Orari: 10:00 - 23:00.';
        ok=false;
      }
    }
    return ok;
  }

  form?.addEventListener('submit', e=>{
    e.preventDefault();
    if (!validate()) return;

    const formData = Object.fromEntries(new FormData(form).entries());
    // Ruajtje demonstrative lokale (localStorage) – mund të zëvendësohet me API POST
    const existing = JSON.parse(localStorage.getItem('reservations')||'[]');
    existing.push({...formData, createdAt: new Date().toISOString()});
    localStorage.setItem('reservations', JSON.stringify(existing));

    form.reset();
    setMinDate();
    alert('Rezervimi u dërgua! Do të kontaktoheni për konfirmim.');
  });

  /* ------------------ Footer Year ------------------ */
  const yearEl = qs('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();