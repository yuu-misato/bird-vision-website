/* BIRD VISION V2 - Main JavaScript */
document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('headerV2');
  const menuBtn = document.getElementById('menuBtnV2');
  const mobileNav = document.getElementById('mobileNavV2');

  /* Header scroll effect */
  let lastScroll = 0;
  const onScroll = () => {
    const y = window.scrollY;
    if (y > 80) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
    lastScroll = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu toggle */
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

  /* Smooth scroll for anchor links */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* Scroll-triggered fade-in animations */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    fadeEls.forEach(el => observer.observe(el));
  }

  /* Active nav highlighting */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header-v2-nav a');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('is-active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('is-active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  /* Cost cards drag scroll */
  const costCards = document.getElementById('costCards');
  if (costCards) {
    let isDown = false;
    let startX;
    let scrollLeft;

    costCards.addEventListener('mousedown', (e) => {
      isDown = true;
      costCards.style.cursor = 'grabbing';
      startX = e.pageX - costCards.offsetLeft;
      scrollLeft = costCards.scrollLeft;
    });
    costCards.addEventListener('mouseleave', () => {
      isDown = false;
      costCards.style.cursor = 'grab';
    });
    costCards.addEventListener('mouseup', () => {
      isDown = false;
      costCards.style.cursor = 'grab';
    });
    costCards.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - costCards.offsetLeft;
      const walk = (x - startX) * 1.5;
      costCards.scrollLeft = scrollLeft - walk;
    });
    costCards.style.cursor = 'grab';
  }
});
