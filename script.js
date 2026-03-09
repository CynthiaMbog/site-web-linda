/* ═══════════════════════════════════════════════════════════════
   LYN'D DESIGN · SCRIPT JS
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ──────────────────────────────────────────
  // CUSTOM CURSOR (desktop only)
  // ──────────────────────────────────────────
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.append(cursor, ring);

    let mx = -100, my = -100, rx = -100, ry = -100;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
    });

    function animateCursor() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .col-item').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '14px';
        cursor.style.height = '14px';
        ring.style.width = '50px';
        ring.style.height = '50px';
        ring.style.opacity = '0.3';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '';
        cursor.style.height = '';
        ring.style.width = '';
        ring.style.height = '';
        ring.style.opacity = '';
      });
    });
  }

  // ──────────────────────────────────────────
  // NAVBAR SCROLL
  // ──────────────────────────────────────────
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // ──────────────────────────────────────────
  // BURGER MENU
  // ──────────────────────────────────────────
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  burger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    const spans = burger.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(4.5px, 4.5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4.5px, -4.5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      const spans = burger.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // ──────────────────────────────────────────
  // HERO IMAGE SLIDESHOW
  // ──────────────────────────────────────────
  const heroImgs = document.querySelectorAll('.hero-img');
  let heroIndex = 0;

  if (heroImgs.length > 1) {
    setInterval(() => {
      heroImgs[heroIndex].classList.remove('active');
      heroIndex = (heroIndex + 1) % heroImgs.length;
      heroImgs[heroIndex].classList.add('active');
    }, 5000);
  }

  // ──────────────────────────────────────────
  // SCROLL-BASED FADE-IN ANIMATIONS
  // ──────────────────────────────────────────
  const fadeEls = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = entry.target.parentElement
          ? Array.from(entry.target.parentElement.querySelectorAll('.fade-in'))
          : [];
        const idx = siblings.indexOf(entry.target);
        const delay = idx * 120;
        entry.target.style.transitionDelay = delay + 'ms';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  fadeEls.forEach(el => observer.observe(el));

  // ──────────────────────────────────────────
  // LIGHTBOX
  // ──────────────────────────────────────────
  const lightbox = document.getElementById('lightbox');
  let lightboxMedia = null;

  // Image lightbox support (existing) — attempt to find elements, but keep optional
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.col-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // VIDEO LIGHTBOX: cards with .video-card and data-src
  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      const src = card.getAttribute('data-src');
      if (!src) return;
      if (!lightbox) return;
      // create or reuse video element
      if (lightboxMedia) {
        lightboxMedia.remove();
        lightboxMedia = null;
      }
      const container = document.createElement('div');
      container.className = 'lightbox-content';
      const closeBtn = document.createElement('button');
      closeBtn.className = 'lightbox-close';
      closeBtn.textContent = '✕';
      closeBtn.addEventListener('click', closeLightbox);
      const video = document.createElement('video');
      video.className = 'lightbox-video';
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      container.appendChild(closeBtn);
      container.appendChild(video);
      lightbox.appendChild(container);
      lightbox.classList.add('open');
      lightboxMedia = container;
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    if (lightboxMedia) {
      const v = lightboxMedia.querySelector('video');
      if (v) { v.pause(); v.src = ''; }
      lightboxMedia.remove();
      lightboxMedia = null;
    }
    if (lightboxImg) {
      lightboxImg.src = '';
    }
  }

  if (lightbox) {
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ──────────────────────────────────────────
  // CHARGEMENT PROGRESSIF DES IMAGES
  // Fade-in doux quand loaded + stop skeleton
  // ──────────────────────────────────────────
  function initImageLoading() {
    const imgs = document.querySelectorAll('.col-item img, .maison-image img');

    imgs.forEach(img => {
      const container = img.parentElement;

      const onLoad = () => {
        img.classList.add('img-loaded');
        container.classList.add('img-ready');
      };

      if (img.complete && img.naturalWidth > 0) {
        // Image déjà en cache
        onLoad();
      } else {
        img.addEventListener('load', onLoad);
        img.addEventListener('error', () => {
          // En cas d'erreur, on affiche quand même
          container.classList.add('img-ready');
        });
      }
    });
  }

  initImageLoading();


  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ──────────────────────────────────────────
  // CONTACT FORM
  // ──────────────────────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      const orig = btn.textContent;
      btn.textContent = 'Message envoyé ✓';
      btn.style.background = 'transparent';
      btn.style.color = 'var(--bordeaux)';
      btn.style.borderColor = 'var(--bordeaux)';
      btn.disabled = true;
      form.reset();
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.style.color = '';
        btn.style.borderColor = '';
        btn.disabled = false;
      }, 4000);
    });
  }

  // ──────────────────────────────────────────
  // PARALLAX subtle on hero image
  // ──────────────────────────────────────────
  const heroMedia = document.querySelector('.hero-media');
  if (heroMedia) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroMedia.style.transform = `translateY(${scrollY * 0.25}px)`;
      }
    }, { passive: true });
  }

  // ──────────────────────────────────────────
  // COLLECTION INFO: subtle scale on scroll
  // ──────────────────────────────────────────
  const collNums = document.querySelectorAll('.collection-num');
  const numObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'color 0.6s ease';
        entry.target.style.color = 'var(--beige)';
      }
    });
  }, { threshold: 0.5 });

  collNums.forEach(el => numObserver.observe(el));

})();
