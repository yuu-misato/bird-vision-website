/**
 * BIRD VISION - Main JavaScript
 * Smooth animations, header effects, scroll interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // =============================================
  // Loading Screen
  // =============================================
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('is-hidden');
        // Trigger hero animation after loader
        const hero = document.getElementById('hero');
        if (hero) {
          setTimeout(() => hero.classList.add('is-visible'), 200);
          // Ken Burns effect on hero image
          const heroImg = hero.querySelector('.hero-bg img');
          if (heroImg) heroImg.classList.add('is-loaded');
        }
      }, 800);
    });
  } else {
    // No loader - trigger hero immediately
    const hero = document.getElementById('hero');
    if (hero) {
      setTimeout(() => hero.classList.add('is-visible'), 100);
      const heroImg = hero.querySelector('.hero-bg img');
      if (heroImg) heroImg.classList.add('is-loaded');
    }
  }

  // =============================================
  // Header Scroll Behavior
  // =============================================
  const header = document.getElementById('header');
  let lastScrollY = 0;
  let ticking = false;

  function updateHeader() {
    const scrollY = window.scrollY;

    // Background
    if (scrollY > 80) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }

    // Hide on scroll down, show on scroll up
    if (scrollY > lastScrollY && scrollY > 300) {
      header.classList.add('is-hidden');
    } else {
      header.classList.remove('is-hidden');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  // =============================================
  // Mobile Menu
  // =============================================
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('is-open');
      menuBtn.classList.toggle('is-active');
      mobileNav.classList.toggle('is-open');
      document.body.classList.toggle('menu-open');
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('is-active');
        mobileNav.classList.remove('is-open');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // =============================================
  // Smooth Scroll for Anchor Links
  // =============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // =============================================
  // Intersection Observer - Scroll Reveal
  // =============================================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger').forEach(el => {
    revealObserver.observe(el);
  });

  // =============================================
  // Scroll Progress Bar
  // =============================================
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  function updateProgress() {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (scrollHeight > 0) {
      const progress = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = progress + '%';
    }
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
});
