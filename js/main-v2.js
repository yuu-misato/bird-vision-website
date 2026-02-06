/* BIRD VISION V2 - Awwwards-Level Interactions */
(() => {
  'use strict';

  /* ======= CUSTOM CURSOR ======= */
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  const cursorDot = document.createElement('div');
  cursorDot.className = 'custom-cursor-dot';
  document.body.appendChild(cursor);
  document.body.appendChild(cursorDot);

  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;

  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    cursorDot.style.transform = `translate(${cursorX - 4}px, ${cursorY - 4}px)`;
  });

  function animateCursor() {
    dotX += (cursorX - dotX) * 0.12;
    dotY += (cursorY - dotY) * 0.12;
    cursor.style.transform = `translate(${dotX - 20}px, ${dotY - 20}px)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor hover effects
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('a, button, .works-v2-item, .advantages-v2-card, .cost-v2-card');
    if (target) {
      cursor.classList.add('cursor-hover');
      cursorDot.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('a, button, .works-v2-item, .advantages-v2-card, .cost-v2-card');
    if (target) {
      cursor.classList.remove('cursor-hover');
      cursorDot.classList.remove('cursor-hover');
    }
  });

  /* ======= SMOOTH LERP UTILITY ======= */
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ======= HEADER ======= */
  const header = document.getElementById('headerV2');
  let lastScroll = 0;

  /* ======= MOUSE PARALLAX ON HERO ======= */
  const hero = document.querySelector('.hero-v2');
  const heroBg = document.querySelector('.hero-v2-bg img');
  let mouseXRatio = 0.5, mouseYRatio = 0.5;
  let currentMX = 0.5, currentMY = 0.5;

  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouseXRatio = (e.clientX - rect.left) / rect.width;
      mouseYRatio = (e.clientY - rect.top) / rect.height;
    });
  }

  /* ======= SCROLL-DRIVEN PARALLAX ======= */
  const parallaxElements = [];

  function initParallax() {
    document.querySelectorAll('[data-parallax]').forEach(el => {
      parallaxElements.push({
        el,
        speed: parseFloat(el.dataset.parallax) || 0.3,
        currentY: 0
      });
    });
  }

  /* ======= MAGNETIC BUTTONS ======= */
  function initMagneticButtons() {
    document.querySelectorAll('.btn-v2, .btn-v2-outline, .header-v2-cta').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        setTimeout(() => btn.style.transition = '', 500);
      });
    });
  }

  /* ======= TEXT REVEAL ANIMATION ======= */
  function initTextReveal() {
    document.querySelectorAll('.text-reveal').forEach(el => {
      const text = el.textContent;
      el.innerHTML = '';
      const wrapper = document.createElement('span');
      wrapper.className = 'text-reveal-inner';
      wrapper.textContent = text;
      el.appendChild(wrapper);
    });
  }

  /* ======= SCROLL-TRIGGERED ANIMATIONS ======= */
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right, .scale-in, .text-reveal').forEach(el => {
      observer.observe(el);
    });
  }

  /* ======= STAGGER CHILDREN ======= */
  function initStagger() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const children = entry.target.children;
          Array.from(children).forEach((child, i) => {
            child.style.transitionDelay = `${i * 0.12}s`;
          });
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.stagger-children').forEach(el => observer.observe(el));
  }

  /* ======= WORKS TILT EFFECT ======= */
  function initTiltCards() {
    document.querySelectorAll('.works-v2-item, .advantages-v2-card-image').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        setTimeout(() => card.style.transition = 'transform 0.3s ease', 600);
      });
    });
  }

  /* ======= SMOOTH SCROLL ======= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ======= MOBILE MENU ======= */
  const menuBtn = document.getElementById('menuBtnV2');
  const mobileNav = document.getElementById('mobileNavV2');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('is-open');
      mobileNav.classList.toggle('is-open');
      document.body.classList.toggle('menu-open');
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('is-open');
        mobileNav.classList.remove('is-open');
        document.body.classList.remove('menu-open');
      });
    });
  }

  /* ======= ACTIVE NAV ======= */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header-v2-nav a');

  /* ======= HORIZONTAL SCROLL SECTIONS ======= */
  function initHorizontalScroll() {
    const costCards = document.getElementById('costCards');
    if (!costCards) return;
    let isDown = false, startX, scrollLeft;
    costCards.addEventListener('mousedown', (e) => {
      isDown = true;
      costCards.style.cursor = 'grabbing';
      startX = e.pageX - costCards.offsetLeft;
      scrollLeft = costCards.scrollLeft;
    });
    costCards.addEventListener('mouseleave', () => { isDown = false; costCards.style.cursor = 'grab'; });
    costCards.addEventListener('mouseup', () => { isDown = false; costCards.style.cursor = 'grab'; });
    costCards.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      costCards.scrollLeft = scrollLeft - (e.pageX - costCards.offsetLeft - startX) * 1.5;
    });
    costCards.style.cursor = 'grab';
  }

  /* ======= SCROLL PROGRESS BAR ======= */
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress-v2';
  document.body.appendChild(progressBar);

  /* ======= COUNTER ANIMATION ======= */
  function initCounters() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.count);
          let current = 0;
          const step = target / 60;
          const animate = () => {
            current += step;
            if (current < target) {
              entry.target.textContent = Math.floor(current).toLocaleString();
              requestAnimationFrame(animate);
            } else {
              entry.target.textContent = target.toLocaleString();
            }
          };
          animate();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
  }

  /* ======= MAIN ANIMATION LOOP ======= */
  function tick() {
    const scrollY = window.scrollY;

    // Header
    if (scrollY > 80) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }

    // Hero mouse parallax
    if (heroBg && hero) {
      currentMX = lerp(currentMX, mouseXRatio, 0.05);
      currentMY = lerp(currentMY, mouseYRatio, 0.05);
      const moveX = (currentMX - 0.5) * -20;
      const moveY = (currentMY - 0.5) * -10;
      heroBg.style.transform = `scale(1.05) translate(${moveX}px, ${moveY}px)`;
    }

    // Scroll parallax
    parallaxElements.forEach(item => {
      const rect = item.el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewCenter = window.innerHeight / 2;
      const dist = (center - viewCenter) * item.speed;
      item.currentY = lerp(item.currentY, dist, 0.1);
      item.el.style.transform = `translateY(${item.currentY}px)`;
    });

    // Active nav
    const scrollPos = scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
        });
      }
    });

    // Progress bar
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollY / docHeight : 0;
    progressBar.style.transform = `scaleX(${progress})`;

    requestAnimationFrame(tick);
  }

  /* ======= INIT ======= */
  document.addEventListener('DOMContentLoaded', () => {
    initParallax();
    initMagneticButtons();
    initTextReveal();
    initScrollAnimations();
    initStagger();
    initTiltCards();
    initHorizontalScroll();
    initCounters();
    requestAnimationFrame(tick);

    // Page load animation
    document.body.classList.add('is-loaded');
  });
})();
