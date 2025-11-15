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
      './Immagini/Panoramiche/_SVS0228-HDR-min.jpg',
      './Immagini/Panoramiche/_SVS0237-min.jpg',
      './Immagini/Panoramiche/_SVS3971-min.jpg',
      './Immagini/Panoramiche/_SVS6207-HDR-2-min.jpg',
      './Immagini/Panoramiche/_SVS7936-HDR-min.jpg',
      './Immagini/Panoramiche/_SVS8047-HDR-min.jpg',
      './Immagini/Panoramiche/_SVS8055-min.jpg',
      './Immagini/Panoramiche/_SVS9076-min.jpg',
      './Immagini/Panoramiche/_SVS9867-HDR-min.jpg'
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
});
