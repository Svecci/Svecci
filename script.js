document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const links = document.querySelectorAll('.nav-link');
  const sections = [...links]
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(section => section);

  const setActive = () => {
    const y = window.scrollY + window.innerHeight * 0.35;
    let current = null;
    sections.forEach(section => {
      if (y >= section.offsetTop) current = section;
    });
    links.forEach(link => {
      link.classList.toggle('active', current && link.getAttribute('href') === `#${current.id}`);
    });
  };

  document.addEventListener('scroll', setActive, { passive: true });
  setActive();

  // Lightbox gallery logic
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCounter = document.querySelector('.lightbox__counter');
  const closeBtn = document.querySelector('.lightbox__close');
  const prevBtn = document.querySelector('.lightbox__prev');
  const nextBtn = document.querySelector('.lightbox__next');

  // Image sets per category (replace placeholders with real paths)
  const galleries = {
    evento: [
      './Immagini/Evento/100esimo palio spezia-01-min.jpg',
      './Immagini/Evento/100esimo palio spezia-02-min.jpg',
      './Immagini/Evento/100esimo palio spezia-03-min.jpg',
      './Immagini/Evento/100esimo palio spezia-04-min.jpg',
      './Immagini/Evento/IlTrovatore-20250126-05-min.jpg',
      './Immagini/Evento/IlTrovatore-20250126-29-min.jpg',
      './Immagini/Evento/IlTrovatore-20250126-42-min.jpg',
      './Immagini/Evento/IlTrovatore-20250126-55-min.jpg',
      './Immagini/Evento/Made M.A.R.E.-08-min.jpg',
      './Immagini/Evento/Made M.A.R.E.-11-min.jpg',
      './Immagini/Evento/Made M.A.R.E.-16-min.jpg',
      './Immagini/Evento/Made M.A.R.E.-31-min.jpg',
      './Immagini/Evento/Made M.A.R.E.-39-min.jpg',
      './Immagini/Evento/Made M.A.R.E.-43-min.jpg'
    ],
    sport: [
      './Immagini/Sport/Bisonte-01-min.jpg',
      './Immagini/Sport/Bisonte-02-min.jpg',
      './Immagini/Sport/Bisonte-03-min.jpg',
      './Immagini/Sport/JustP-01-min.jpg',
      './Immagini/Sport/JustP-03-min.jpg',
      './Immagini/Sport/JustP-12-min.jpg',
      './Immagini/Sport/JustP-28-min.jpg',
      './Immagini/Sport/Mugello-01-min.jpg',
      './Immagini/Sport/Mugello-04-min.jpg',
      './Immagini/Sport/Mugello-43-min.jpg',
      './Immagini/Sport/Mugello-53-min.jpg',
      './Immagini/Sport/Mugello-61-min.jpg'
    ],
    panoramiche: [
      './Immagini/Panoramiche/SVS0228-HDR-min.jpg',
      './Immagini/Panoramiche/SVS0237-min.jpg',
      './Immagini/Panoramiche/SVS3971-min.jpg',
      './Immagini/Panoramiche/SVS6207-HDR-2-min.jpg',
      './Immagini/Panoramiche/SVS7936-HDR-min.jpg',
      './Immagini/Panoramiche/SVS8047-HDR-min.jpg',
      './Immagini/Panoramiche/SVS8055-min.jpg',
      './Immagini/Panoramiche/SVS9076-min.jpg',
      './Immagini/Panoramiche/SVS9867-HDR-min.jpg'
    ]
  };

  let currentGallery = [];
  let currentIndex = 0;

  const showImage = (index) => {
    if (!currentGallery.length) return;
    currentIndex = (index + currentGallery.length) % currentGallery.length;
    lightboxImg.src = currentGallery[currentIndex];
    lightboxImg.alt = `Immagine ${currentIndex + 1} di ${currentGallery.length}`;
    lightboxCounter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
  };

  const openLightbox = (galleryKey) => {
    currentGallery = galleries[galleryKey] || [];
    if (!currentGallery.length) return;
    currentIndex = 0;
    showImage(0);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    currentGallery = [];
  };

  // Click on cards
  document.querySelectorAll('.photo-card[data-gallery]').forEach(card => {
    const open = () => openLightbox(card.dataset.gallery);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });

  // Navigation
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

  // Close on backdrop click
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });

  // Touch swipe support (already implemented, no changes needed)
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) showImage(currentIndex + 1);
      else showImage(currentIndex - 1);
    }
  }, { passive: true });

  // Intro: mostra solo la hero finché l'utente non scrolla/clicca
  document.body.classList.add('intro');

  const exitIntro = () => {
    if (!document.body.classList.contains('intro')) return;
    document.body.classList.remove('intro');
  };

  // Esci dall'intro al primo scroll
  const onFirstScroll = () => { exitIntro(); window.removeEventListener('scroll', onFirstScroll); };
  window.addEventListener('scroll', onFirstScroll, { passive:true });

  // Click sull'indicatore: esci dall'intro e scorri al portfolio
  const indicator = document.querySelector('.scroll-indicator');
  if (indicator) {
    indicator.addEventListener('click', (e) => {
      e.preventDefault();
      exitIntro();
      const target = document.querySelector('#portfolio');
      if (target) target.scrollIntoView({ behavior:'smooth' });
    });
  }

  // Scroll indicator visibility based on hero visibility (50%)
  const hero = document.getElementById('hero');
  if (hero && indicator && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      const entry = entries[0];
      const hide = entry.intersectionRatio < 0.5;
      indicator.classList.toggle('scroll-indicator--hidden', hide);
    }, { threshold: [0, 0.5, 1] });
    io.observe(hero);
  }

  // Update --nav-h with the real navbar height
  const navEl = document.querySelector('.navbar');
  const setNavHeightVar = () => {
    const h = navEl ? navEl.offsetHeight : 0;
    document.documentElement.style.setProperty('--nav-h', `${h}px`);
  };
  setNavHeightVar();
  window.addEventListener('resize', setNavHeightVar);
  window.addEventListener('orientationchange', setNavHeightVar);

  // Toggle solid navbar after the hero (when hero < 50% visible)
  if (hero && navEl && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      const r = entries[0]?.intersectionRatio || 0;
      const pastHalf = r < 0.5;
      navEl.classList.toggle('nav--solid', pastHalf);

      // If you also use the scroll indicator, hide it past half hero
      const indicator = document.querySelector('.scroll-indicator');
      if (indicator) indicator.classList.toggle('scroll-indicator--hidden', pastHalf);
    }, { threshold: [0, .5, 1] });
    io.observe(hero);
  }

  // Cards reveal: arm only after hero is ~80% scrolled past (hero <= 20% visible)
  const heroEl = document.getElementById('hero');
  const cards = document.querySelectorAll('#portfolio .photo-card');
  let revealsArmed = false;

  function armReveals(){
    if (revealsArmed || !cards.length) return;
    revealsArmed = true;

    // prepara stato iniziale + ritardo sfalsato
    cards.forEach((card, i) => {
      card.classList.add('reveal');
      // sfalsamento leggero per colonna/riga
      const colDelay = (i % 3) * 120;
      const rowDelay = Math.floor(i / 3) * 60;
      card.style.setProperty('--reveal-delay', `${colDelay + rowDelay}ms`);
    });

    // osserva l'entrata in viewport delle card
    const ioCards = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

    cards.forEach(card => ioCards.observe(card));
  }

  // arma le reveal quando la hero è <= 20% visibile (cioè ~80% superata)
  if (heroEl && 'IntersectionObserver' in window) {
    const ioHero = new IntersectionObserver((entries) => {
      const r = entries[0]?.intersectionRatio ?? 1;
      if (r <= 0.2) {
        armReveals();
        ioHero.disconnect();
      }
    }, { threshold: [0, 0.2, 1] });
    ioHero.observe(heroEl);
  } else {
    // fallback
    armReveals();
  }
});
