/**
 * BIRD VISION Website - Animations
 * スクロールアニメーション、ヘッダー効果、その他のインタラクション
 */

document.addEventListener('DOMContentLoaded', function() {
  // =============================================
  // Intersection Observer for Scroll Animations
  // =============================================
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // 一度表示されたら監視を解除（オプション）
        // fadeInObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // フェードイン対象要素を監視
  const fadeElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right, .scale-in');
  fadeElements.forEach(el => fadeInObserver.observe(el));

  // セクションごとのアニメーション
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    section.classList.add('section-animate');
    fadeInObserver.observe(section);
  });

  // =============================================
  // Staggered Animation for Lists/Grids
  // =============================================
  const staggerContainers = document.querySelectorAll('.stagger-container');
  staggerContainers.forEach(container => {
    const children = container.children;
    Array.from(children).forEach((child, index) => {
      child.style.transitionDelay = `${index * 0.1}s`;
      child.classList.add('stagger-item');
      fadeInObserver.observe(child);
    });
  });

  // =============================================
  // Header Scroll Effect
  // =============================================
  const header = document.querySelector('.header');
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateHeader() {
    const scrollY = window.scrollY;

    // ヘッダーの背景変化
    if (scrollY > 100) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }

    // ヘッダーの表示/非表示（スクロール方向に応じて）
    if (scrollY > lastScrollY && scrollY > 200) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  });

  // =============================================
  // Smooth Scroll for Anchor Links
  // =============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // =============================================
  // Hero Section Parallax Effect
  // =============================================
  const heroImage = document.querySelector('.hero-image');
  if (heroImage) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const parallaxSpeed = 0.3;
      heroImage.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
    });
  }

  // =============================================
  // Counter Animation
  // =============================================
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    function update() {
      start += increment;
      if (start < target) {
        element.textContent = Math.floor(start).toLocaleString();
        requestAnimationFrame(update);
      } else {
        element.textContent = target.toLocaleString();
      }
    }

    update();
  }

  // カウンター要素の監視
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count, 10);
        animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => {
    counterObserver.observe(el);
  });

  // =============================================
  // Mobile Menu Toggle
  // =============================================
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const headerNav = document.querySelector('.header-nav');

  if (mobileMenuBtn && headerNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('is-active');
      headerNav.classList.toggle('is-open');
      document.body.classList.toggle('menu-open');
    });

    // メニューリンクをクリックしたらメニューを閉じる
    headerNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('is-active');
        headerNav.classList.remove('is-open');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // =============================================
  // Image Lazy Loading with Animation
  // =============================================
  const lazyImages = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  }, { rootMargin: '50px' });

  lazyImages.forEach(img => imageObserver.observe(img));

  // =============================================
  // Hover Effects Enhancement
  // =============================================
  const cards = document.querySelectorAll('.work-card, .strength-card, .news-item');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // =============================================
  // Text Reveal Animation (文字を1文字ずつ表示)
  // =============================================
  const textRevealElements = document.querySelectorAll('.text-reveal');
  textRevealElements.forEach(element => {
    const text = element.textContent;
    element.innerHTML = '';
    text.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.animationDelay = `${i * 0.05}s`;
      span.classList.add('char');
      element.appendChild(span);
    });
  });

  // =============================================
  // Form Input Animation
  // =============================================
  const formInputs = document.querySelectorAll('.form-input, .form-textarea');
  formInputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', function() {
      if (!this.value) {
        this.parentElement.classList.remove('focused');
      }
    });
  });

  // =============================================
  // Page Load Animation
  // =============================================
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Hero section animation
    const heroContent = document.querySelector('.hero-content');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');

    if (heroContent) {
      setTimeout(() => heroContent.classList.add('is-visible'), 100);
    }
    if (heroTitle) {
      setTimeout(() => heroTitle.classList.add('is-visible'), 300);
    }
    if (heroSubtitle) {
      setTimeout(() => heroSubtitle.classList.add('is-visible'), 600);
    }
  });

  // =============================================
  // Scroll Progress Indicator
  // =============================================
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = `${progress}%`;
  });

  console.log('BIRD VISION animations initialized');
});
