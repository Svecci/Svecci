(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  // Year
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  // Nav hide on scroll
  const nav = $('[data-nav]');
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    if (y > 120 && y > lastY) nav?.classList.add('nav--hidden');
    else nav?.classList.remove('nav--hidden');
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive:true });

  // Parallax red grid
  const grid = $('#bg-grid');
  if (grid && !prefersReduced) {
    let x = 0, y = 0, tx = 0, ty = 0;
    const lerp = (a,b,n)=>a+(b-a)*n;
    window.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / window.innerWidth - .5) * 20;
      const ny = (e.clientY / window.innerHeight - .5) * 20;
      tx = nx; ty = ny;
    }, { passive:true });
    const loop = () => {
      x = lerp(x, tx, .08);
      y = lerp(y, ty, .08);
      grid.style.setProperty('--grid-x', `${x}px`);
      grid.style.setProperty('--grid-y', `${y}px`);
      requestAnimationFrame(loop);
    };
    loop();
  }

  // GSAP animations
  const bootGSAP = () => {
    if (typeof gsap === 'undefined') {
      // Fallback: simple reveal with IntersectionObserver
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.style.transition = 'opacity .6s cubic-bezier(.22,.61,.36,1), transform .6s cubic-bezier(.22,.61,.36,1)';
            e.target.style.opacity = 1;
            e.target.style.transform = 'none';
            io.unobserve(e.target);
          }
        });
      }, { threshold:.12 });
      $$('[data-animate]').forEach(el => io.observe(el));
      return;
    }

    gsap.defaults({ ease: 'power3.out' });

    // Hero
    gsap.to('[data-animate="hero"]', { opacity:1, y:0, scale:1, duration: .9, stagger:.08, delay:.1 });
    gsap.to('[data-animate="fade"]', { opacity:1, y:0, duration:.8, stagger:.08, delay:.2 });

    // Sections
    $$('[data-animate="line"]').forEach((el) => {
      gsap.fromTo(el, { opacity:0 }, {
        opacity:1, duration:.8,
        scrollTrigger:{ trigger: el, start:'top 80%' }
      });
    });

    // Cards
    $$('.card').forEach((card, i) => {
      gsap.to(card, {
        opacity:1, y:0, scale:1, duration:.7, delay: i * 0.05,
        scrollTrigger:{ trigger: card, start:'top 86%' }
      });
    });

    // Subtle grid pulse on scroll
    if (!prefersReduced && grid) {
      gsap.to(grid, {
        '--grid-s': 1.02,
        duration:1.2,
        scrollTrigger:{ trigger: '#work', start:'top 70%', end:'bottom 60%', scrub:true }
      });
    }
  };

  if (prefersReduced) {
    // Minimal reveal without motion
    $$('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  } else {
    if (document.readyState === 'complete' || document.readyState === 'interactive') bootGSAP();
    else window.addEventListener('DOMContentLoaded', bootGSAP);
  }

  // Card tilt
  if (!prefersReduced) {
    const maxTilt = 6; // deg
    const damp = .12;
    $$('.card').forEach(card => {
      let rx = 0, ry = 0, trx = 0, tryy = 0;
      const rect = () => card.getBoundingClientRect();
      const onMove = (e) => {
        const r = rect();
        const cx = r.left + r.width/2;
        const cy = r.top + r.height/2;
        const dx = (e.clientX - cx) / (r.width/2);
        const dy = (e.clientY - cy) / (r.height/2);
        trx = (+dy) * maxTilt; // rotateX
        tryy = (-dx) * maxTilt; // rotateY
      };
      const onLeave = () => { trx = 0; tryy = 0; };
      const loop = () => {
        rx += (trx - rx) * damp;
        ry += (tryy - ry) * damp;
        card.style.transform = `translateY(-4px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        requestAnimationFrame(loop);
      };
      loop();
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      card.addEventListener('touchstart', onLeave, { passive:true });
      card.addEventListener('touchend', onLeave, { passive:true });
    });
  }

  // Smooth internal navigation active state
  const links = $$('.nav__links a');
  const sections = ['#work','#about','#contact'].map(id => ({ id, el: $(id) })).filter(s => s.el);
  const setActive = () => {
    let idx = -1, y = window.scrollY + window.innerHeight * .3;
    sections.forEach((s, i) => {
      const top = s.el.offsetTop - 100;
      if (y >= top) idx = i;
    });
    links.forEach((a,i) => a.style.opacity = (i === idx) ? '1' : '.9');
  };
  window.addEventListener('scroll', setActive, { passive:true });
  setActive();
})();

// Assicurati che gli embed vengano processati quando la pagina è pronta (se embed.js è caricato)
window.addEventListener('load', () => {
  if (window.instgrm && window.instgrm.Embeds) {
    window.instgrm.Embeds.process();
  }
});