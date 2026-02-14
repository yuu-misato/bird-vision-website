/* BIRD VISION V2 - Cinematic Awwwards-Level Interactions (Performance Optimized) */
(() => {
  'use strict';

  /* ======= MOUSE POSITION TRACKING (for particles) ======= */
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  }, { passive: true });

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
    }, { passive: true });
  }

  /* ======= FLOATING PARTICLE CANVAS (Optimized) ======= */
  function initParticleCanvas() {
    const canvas = document.createElement('canvas');
    canvas.className = 'particle-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;opacity:0.4;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let w, h, particles = [];
    // Reduced particle count for smoother performance
    const particleCount = Math.min(35, Math.floor(window.innerWidth / 35));

    let resizeTimer;
    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    });

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }
      update(time) {
        this.x += this.speedX;
        this.y += this.speedY;
        // Gentle float based on mouse
        this.x += (cursorX / w - 0.5) * 0.15;
        this.y += (cursorY / h - 0.5) * 0.15;
        this.currentOpacity = this.opacity * (0.5 + 0.5 * Math.sin(time * this.pulseSpeed + this.pulsePhase));
        if (this.x < -10 || this.x > w + 10 || this.y < -10 || this.y > h + 10) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(26, 39, 68, ${this.currentOpacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    // Draw lines between nearby particles — optimized with distance squared
    function drawLines() {
      const maxDist = 120;
      const maxDistSq = maxDist * maxDist;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < maxDistSq) {
            const alpha = (1 - Math.sqrt(distSq) / maxDist) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(26, 39, 68, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    let time = 0;
    function animateParticles() {
      ctx.clearRect(0, 0, w, h);
      time++;
      particles.forEach(p => {
        p.update(time);
        p.draw();
      });
      drawLines();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ======= CINEMATIC PAGE LOAD SEQUENCE ======= */
  function initCinematicLoad() {
    // Create curtain overlay
    const curtain = document.createElement('div');
    curtain.className = 'page-curtain';
    curtain.innerHTML = `
      <div class="page-curtain-logo">
        <img src="images/logo-birdvision.webp" alt="BIRDVISION" class="page-curtain-img">
        <span class="page-curtain-line"></span>
      </div>
    `;
    document.body.appendChild(curtain);

    // Sequence
    setTimeout(() => {
      curtain.classList.add('curtain-reveal');
    }, 800);

    setTimeout(() => {
      curtain.classList.add('curtain-exit');
      document.body.classList.add('is-loaded');
    }, 1600);

    setTimeout(() => {
      curtain.remove();
    }, 2600);
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

  /* ======= HERO SCROLL ZOOM EFFECT ======= */
  function initHeroScrollZoom() {
    if (!hero || !heroBg) return;
    const overlay = hero.querySelector('.hero-v2-overlay');

    // Create hero scroll indicator
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'hero-scroll-indicator';
    scrollIndicator.innerHTML = '<span class="hero-scroll-arrow"></span><span class="hero-scroll-text">SCROLL</span>';
    if (overlay) overlay.appendChild(scrollIndicator);
  }

  /* ======= MAGNETIC BUTTONS ======= */
  function initMagneticButtons() {
    document.querySelectorAll('.btn-v2, .btn-v2-outline, .header-v2-cta, .btn-v2--white, .btn-v2--outline-white').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate3d(${x * 0.3}px, ${y * 0.3}px, 0)`;
      }, { passive: true });
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

  /* ======= SPLIT TEXT (Character-by-Character) ======= */
  function initSplitText() {
    document.querySelectorAll('[data-split-text]').forEach(el => {
      const html = el.innerHTML;
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      let charIndex = 0;
      const baseDelay = 1.4; // seconds after page load (longer for curtain)

      function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          const fragment = document.createDocumentFragment();
          for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char;
            span.style.animationDelay = `${baseDelay + charIndex * 0.06}s`;
            charIndex++;
            fragment.appendChild(span);
          }
          node.parentNode.replaceChild(fragment, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // Skip rotating word — don't split, don't add .char opacity animation
          if (node.classList && node.classList.contains('hero-rotating-word')) {
            charIndex += 2; // reserve timing gap
            return;
          }
          const childNodes = Array.from(node.childNodes);
          childNodes.forEach(processNode);
        }
      }

      const childNodes = Array.from(tempDiv.childNodes);
      childNodes.forEach(processNode);
      el.innerHTML = tempDiv.innerHTML;
    });
  }

  /* ======= HERO ROTATING WORD ======= */
  function initRotatingWord() {
    const el = document.querySelector('.hero-rotating-word');
    if (!el) return;

    const words = (el.dataset.words || '').split(',').filter(Boolean);
    if (words.length < 2) return;

    let currentIndex = 0;
    const interval = 3500; // time per word
    const startDelay = 2500; // wait for page load + char reveal
    let isAnimating = false;

    // Build char spans for a word
    function buildChars(word) {
      el.innerHTML = '';
      const chars = word.split('');
      chars.forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'rotating-char';
        span.textContent = ch;
        span.style.setProperty('--float-delay', `${i * 0.15}s`);
        el.appendChild(span);
      });
    }

    // Initial word
    buildChars(words[0]);
    // Add idle float after initial reveal finishes
    setTimeout(() => {
      el.querySelectorAll('.rotating-char').forEach(ch => {
        ch.classList.add('char-idle');
      });
    }, 800);

    function rotateToNext() {
      if (isAnimating) return;
      isAnimating = true;
      currentIndex = (currentIndex + 1) % words.length;
      const nextWord = words[currentIndex];
      const currentChars = el.querySelectorAll('.rotating-char');

      // Phase 1: scatter out each char with stagger
      currentChars.forEach((ch, i) => {
        ch.classList.remove('char-idle');
        setTimeout(() => {
          ch.classList.add('char-out');
        }, i * 60);
      });

      // Phase 2: after all chars out, build new word and bounce in
      const outDuration = currentChars.length * 60 + 400;
      setTimeout(() => {
        buildChars(nextWord);
        const newChars = el.querySelectorAll('.rotating-char');

        newChars.forEach((ch, i) => {
          ch.style.opacity = '0';
          setTimeout(() => {
            ch.style.opacity = '';
            ch.classList.add('char-in');
          }, i * 80);
        });

        // Phase 3: after bounce in, switch to idle float
        const inDuration = newChars.length * 80 + 600;
        setTimeout(() => {
          el.querySelectorAll('.rotating-char').forEach(ch => {
            ch.classList.remove('char-in');
            ch.classList.add('char-idle');
          });
          isAnimating = false;
        }, inDuration);
      }, outDuration);
    }

    setTimeout(() => {
      setInterval(rotateToNext, interval);
    }, startDelay);
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

    document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right, .scale-in, .text-reveal, .cinematic-reveal').forEach(el => {
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

  /* ======= SECTION WIPE REVEALS ======= */
  function initSectionReveals() {
    const sections = document.querySelectorAll('[data-reveal]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -80px 0px' });

    sections.forEach(el => observer.observe(el));
  }

  /* ======= WORKS TILT EFFECT ======= */
  function initTiltCards() {
    document.querySelectorAll('.advantages-v2-card-image').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.03) translateZ(0)`;
      }, { passive: true });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        setTimeout(() => card.style.transition = 'transform 0.3s ease', 600);
      });
    });

    // Works items — cinematic mouse-follow parallax on background
    document.querySelectorAll('.works-v2-item').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.backgroundPosition = `${50 + x * 10}% ${50 + y * 10}%`;
      }, { passive: true });
      card.addEventListener('mouseleave', () => {
        card.style.backgroundPosition = 'center';
        card.style.transition = 'background-position 0.6s ease';
        setTimeout(() => card.style.transition = '', 600);
      });
    });

    // 3D depth effect on testimonial cards
    document.querySelectorAll('.testimonial-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px) translateZ(0)`;
      }, { passive: true });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        setTimeout(() => card.style.transition = 'transform 0.3s ease', 600);
      });
    });

    // Service detail cards — rotate on hover
    document.querySelectorAll('.service-detail-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.05) translateZ(0)`;
        card.style.boxShadow = `${-x * 20}px ${-y * 20}px 40px rgba(0,0,0,0.15)`;
      }, { passive: true });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
        card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s ease';
        setTimeout(() => card.style.transition = '', 600);
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

  /* ======= COUNTER ANIMATION (Cinematic with easing & pop) ======= */
  function initCounters() {
    const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          const duration = 2000;
          const start = performance.now();

          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutExpo(progress);
            const current = Math.floor(eased * target);
            el.textContent = current.toLocaleString();

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              el.textContent = target.toLocaleString();
              const wrap = el.closest('.stat-number-wrap');
              if (wrap) {
                wrap.classList.add('stat-counted');
              }
            }
          };
          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
  }

  /* ======= SECTION HEADING PARALLAX (cached) ======= */
  let cachedHeadings = [];
  function initHeadingParallax() {
    cachedHeadings = Array.from(document.querySelectorAll('.section-heading-v2-en'));
  }

  /* ======= STEPS TIMELINE ANIMATION ======= */
  function initStepsAnimation() {
    const timeline = document.querySelector('.steps-v2-timeline');
    if (!timeline) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.steps-v2-item');
          items.forEach((item, i) => {
            setTimeout(() => {
              item.classList.add('step-active');
            }, i * 250);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(timeline);
  }

  /* ======= FAQ ACCORDION ANIMATION ======= */
  function initFAQAnimations() {
    document.querySelectorAll('.faq-v2-item').forEach(item => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          const answer = item.querySelector('.faq-v2-answer');
          if (answer) {
            answer.style.animation = 'none';
            answer.offsetHeight; // force reflow
            answer.style.animation = 'faqSlideIn 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards';
          }
        }
      });
    });
  }

  /* ======= MAIN ANIMATION LOOP (Optimized) ======= */
  let ticking = false;

  function tick() {
    const scrollY = window.scrollY;

    // Header
    if (header) {
      if (scrollY > 80) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    // Hero mouse parallax + scroll zoom
    if (heroBg && hero) {
      currentMX = lerp(currentMX, mouseXRatio, 0.08);
      currentMY = lerp(currentMY, mouseYRatio, 0.08);
      const moveX = (currentMX - 0.5) * -20;
      const moveY = (currentMY - 0.5) * -10;

      // Scroll-driven zoom on hero
      const heroRect = hero.getBoundingClientRect();
      const heroProgress = Math.max(0, Math.min(1, -heroRect.top / heroRect.height));
      const zoomScale = 1.05 + heroProgress * 0.15;

      heroBg.style.transform = `scale(${zoomScale}) translate3d(${moveX}px, ${moveY}px, 0)`;

      // Parallax on hero overlay text
      const overlay = hero.querySelector('.hero-v2-overlay');
      if (overlay) {
        overlay.style.transform = `translate3d(0, ${heroProgress * -60}px, 0)`;
        overlay.style.opacity = 1 - heroProgress * 1.2;
      }
    }

    // Scroll parallax (with faster lerp)
    parallaxElements.forEach(item => {
      const rect = item.el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewCenter = window.innerHeight / 2;
      const dist = (center - viewCenter) * item.speed;
      item.currentY = lerp(item.currentY, dist, 0.12);
      item.el.style.transform = `translate3d(0, ${item.currentY}px, 0)`;
    });

    // Section heading parallax (subtle horizontal drift) — cached
    const viewH = window.innerHeight;
    cachedHeadings.forEach(heading => {
      const rect = heading.getBoundingClientRect();
      const progress = (rect.top - viewH) / viewH;
      if (progress > -2 && progress < 1) {
        heading.style.transform = `translate3d(${progress * 30}px, 0, 0)`;
      }
    });

    // Active nav — throttled: only check every ~3 frames
    if (!tick._navCounter) tick._navCounter = 0;
    tick._navCounter++;
    if (tick._navCounter % 3 === 0) {
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
    }

    // Progress bar
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollY / docHeight : 0;
    progressBar.style.transform = `scaleX(${progress})`;

    requestAnimationFrame(tick);
  }

  /* ======= INIT ======= */
  document.addEventListener('DOMContentLoaded', () => {
    // Cinematic load first
    initCinematicLoad();

    // Then the rest
    initParallax();
    initMagneticButtons();
    initTextReveal();
    initSplitText();
    initRotatingWord();
    initScrollAnimations();
    initStagger();
    initTiltCards();
    initHorizontalScroll();
    initCounters();
    initHeroScrollZoom();
    initSectionReveals();
    initHeadingParallax();
    initStepsAnimation();
    initFAQAnimations();

    // Particle canvas (only on desktop)
    if (window.innerWidth > 768) {
      initParticleCanvas();
    }

    requestAnimationFrame(tick);
  });
})();
