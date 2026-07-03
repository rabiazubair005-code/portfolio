/* ============================================================
   Muhammad Taha — Cyberpunk Developer Portfolio
   Pure Vanilla JavaScript — No External Libraries
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ----------------------------------------------------------
     0. UTILITY HELPERS
  ---------------------------------------------------------- */
  const qs  = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const isMobile = () => window.innerWidth < 768;

  /* ----------------------------------------------------------
     1. PRELOADER
  ---------------------------------------------------------- */
  const initPreloader = () => {
    const MIN_DISPLAY = 1500; // ms
    const start = Date.now();

    window.addEventListener('load', () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_DISPLAY - elapsed);

      setTimeout(() => {
        document.body.classList.add('loaded');
      }, remaining);
    });

    // Fallback: force-hide after 5 s even if load never fires
    setTimeout(() => document.body.classList.add('loaded'), 5000);
  };

  /* ----------------------------------------------------------
     2. PARTICLE BACKGROUND SYSTEM
  ---------------------------------------------------------- */
  const initParticles = () => {
    const canvas = qs('#particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, particles;

    const COLORS = [
      '#00f0ff',              // accent-cyan
      '#a855f7',              // accent-purple
      '#ff006e',              // accent-pink
      'rgba(255,255,255,0.3)' // dim white
    ];

    const CONNECTION_DIST = 120;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;              // 1 – 3 px
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.speedY = (Math.random() - 0.5) * 0.6;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const count = isMobile() ? 40 : 80;
      particles = Array.from({ length: count }, () => new Particle());
    };

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const opacity = 1 - dist / CONNECTION_DIST;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${opacity * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      drawConnections();
      requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });
  };

  /* ----------------------------------------------------------
     3. CUSTOM CURSOR
  ---------------------------------------------------------- */
  const initCustomCursor = () => {
    // Only for devices with a fine pointer (desktop mice)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot = qs('#cursor-dot');
    const outline = qs('#cursor-outline');
    if (!dot || !outline) return;

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    const INTERACTIVE = 'a, button, .btn-primary, .btn-secondary, .btn-outline, .glass, .project-card, .service-card, .skill-category, input, textarea';

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Dot follows exactly
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    // Lerp outline for smooth follow
    const lerpOutline = () => {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      outline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
      requestAnimationFrame(lerpOutline);
    };
    lerpOutline();

    // Hover state
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(INTERACTIVE)) {
        dot.classList.add('cursor-hover');
        outline.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(INTERACTIVE)) {
        dot.classList.remove('cursor-hover');
        outline.classList.remove('cursor-hover');
      }
    });
  };

  /* ----------------------------------------------------------
     4. SCROLL PROGRESS BAR
  ---------------------------------------------------------- */
  const initScrollProgress = () => {
    const bar = qs('#scroll-progress-bar');
    if (!bar) return;

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = `${pct}%`;
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
  };

  /* ----------------------------------------------------------
     5. STICKY NAVBAR
  ---------------------------------------------------------- */
  const initStickyNavbar = () => {
    const navbar = qs('#navbar');
    if (!navbar) return;

    const update = () => {
      navbar.classList.toggle('navbar-scrolled', window.scrollY > 50);
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
  };

  /* ----------------------------------------------------------
     6. MOBILE MENU
  ---------------------------------------------------------- */
  const initMobileMenu = () => {
    const toggle = qs('#menu-toggle');
    const navLinks = qs('#nav-links');
    if (!toggle) return;

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      document.body.classList.toggle('menu-open');
    });

    // Close when a nav link is clicked
    qsa('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        document.body.classList.remove('menu-open');
      });
    });

    // Close on clicking outside
    document.addEventListener('click', (e) => {
      if (
        document.body.classList.contains('menu-open') &&
        !e.target.closest('#nav-links') &&
        !e.target.closest('#menu-toggle')
      ) {
        document.body.classList.remove('menu-open');
      }
    });
  };

  /* ----------------------------------------------------------
     7. SMOOTH SCROLL
  ---------------------------------------------------------- */
  const initSmoothScroll = () => {
    qsa('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = qs(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Back to top
    const backToTop = qs('.back-to-top');
    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  };

  /* ----------------------------------------------------------
     8. ACTIVE SECTION HIGHLIGHT
  ---------------------------------------------------------- */
  const initActiveSection = () => {
    const sections = qsa('section[id]');
    const navLinksArr = qsa('.nav-link');
    if (!sections.length || !navLinksArr.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinksArr.forEach(link => {
              const href = link.getAttribute('href');
              link.classList.toggle('active', href === `#${id}`);
            });
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
      }
    );

    sections.forEach(sec => observer.observe(sec));
  };

  /* ----------------------------------------------------------
     9. TYPING ANIMATION
  ---------------------------------------------------------- */
  const initTypingAnimation = () => {
    const typedText = qs('#typed-text');
    const typedCursor = qs('#typed-cursor');
    if (!typedText) return;

    const titles = [
      'Web Developer',
      'AI Solution Developer',
      'Extension Developer',
      'E-Commerce Developer',
      'Full Stack Developer'
    ];

    const TYPE_SPEED   = 80;   // ms per char typing
    const DELETE_SPEED = 50;   // ms per char deleting
    const PAUSE_AFTER  = 2000; // ms pause after full word

    let titleIndex = 0;
    let charIndex  = 0;
    let isDeleting = false;

    const tick = () => {
      const currentTitle = titles[titleIndex];

      if (!isDeleting) {
        // Typing forward
        charIndex++;
        typedText.textContent = currentTitle.substring(0, charIndex);

        if (charIndex === currentTitle.length) {
          // Finished typing — pause then delete
          isDeleting = true;
          setTimeout(tick, PAUSE_AFTER);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        // Deleting
        charIndex--;
        typedText.textContent = currentTitle.substring(0, charIndex);

        if (charIndex === 0) {
          // Finished deleting — move to next title
          isDeleting = false;
          titleIndex = (titleIndex + 1) % titles.length;
          setTimeout(tick, 400); // small pause before next word
          return;
        }
        setTimeout(tick, DELETE_SPEED);
      }
    };

    // Start the loop
    setTimeout(tick, 800);
  };

  /* ----------------------------------------------------------
     10. SCROLL REVEAL ANIMATION
  ---------------------------------------------------------- */
  const initScrollReveal = () => {
    const elements = qsa('.scroll-reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            // Stagger children slightly based on index in current batch
            const delay = idx * 80;
            setTimeout(() => {
              entry.target.classList.add('revealed');
            }, delay);
            observer.unobserve(entry.target); // reveal only once
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    elements.forEach(el => observer.observe(el));
  };

  /* ----------------------------------------------------------
     11. SKILL BAR ANIMATION
  ---------------------------------------------------------- */
  const initSkillBars = () => {
    const skillsSection = qs('#skills');
    if (!skillsSection) return;

    let animated = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !animated) {
            animated = true;
            const bars = qsa('.skill-progress', skillsSection);
            bars.forEach((bar, i) => {
              const progress = bar.getAttribute('data-progress') || '0';
              setTimeout(() => {
                bar.style.width = `${progress}%`;
              }, i * 120); // staggered cascade
            });
            observer.unobserve(skillsSection);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(skillsSection);
  };

  /* ----------------------------------------------------------
     12. COUNTER ANIMATION
  ---------------------------------------------------------- */
  const initCounters = () => {
    const counters = qsa('.counter');
    if (!counters.length) return;

    // Ease-out quad
    const easeOutQuad = (t) => t * (2 - t);

    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10) || 0;
      const duration = 2000; // ms
      const startTime = performance.now();

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuad(progress);
        const current = Math.round(easedProgress * target);

        el.textContent = current + '+';

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.3 }
    );

    counters.forEach(c => observer.observe(c));
  };

  /* ----------------------------------------------------------
     13. DARK / LIGHT MODE TOGGLE
  ---------------------------------------------------------- */
  const initThemeToggle = () => {
    const toggleBtns = qsa('.theme-toggle-btn');
    if (!toggleBtns.length) return;

    const STORAGE_KEY = 'theme';

    // Apply saved preference on load
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light') {
      document.body.classList.add('light-mode');
    }

    const updateIcon = () => {
      const isLight = document.body.classList.contains('light-mode');
      toggleBtns.forEach(btn => {
        // Find the <i> icon element inside the button
        const icon = btn.querySelector('i');
        if (icon) {
          if (isLight) {
            // In light mode: show moon icon (click to go dark)
            icon.className = 'fas fa-moon';
          } else {
            // In dark mode: show sun icon (click to go light)
            icon.className = 'fas fa-sun';
          }
        }
      });
    };

    updateIcon();

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem(STORAGE_KEY, isLight ? 'light' : 'dark');
        updateIcon();
      });
    });
  };

  /* ----------------------------------------------------------
     14. CONTACT FORM HANDLING
  ---------------------------------------------------------- */
  const initContactForm = () => {
    const form = qs('#contact-form');
    if (!form) return;

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const showNotification = (message, type = 'success') => {
      // Remove any existing notification
      const existing = qs('.form-notification');
      if (existing) existing.remove();

      const notification = document.createElement('div');
      notification.className = `form-notification form-notification--${type}`;
      notification.innerHTML = `
        <div class="notification-content">
          <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
          <span>${message}</span>
        </div>
      `;

      // Style the notification inline (in case CSS doesn't cover it)
      Object.assign(notification.style, {
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        background: type === 'success'
          ? 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(168,85,247,0.15))'
          : 'linear-gradient(135deg, rgba(255,0,110,0.15), rgba(168,85,247,0.15))',
        border: `1px solid ${type === 'success' ? '#00f0ff' : '#ff006e'}`,
        color: '#fff',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        backdropFilter: 'blur(12px)',
        zIndex: '10000',
        animation: 'slideInRight 0.4s ease',
        fontFamily: 'inherit',
        fontSize: '0.95rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        boxShadow: `0 0 20px ${type === 'success' ? 'rgba(0,240,255,0.2)' : 'rgba(255,0,110,0.2)'}`
      });

      document.body.appendChild(notification);

      // Auto-remove after 4 seconds
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        notification.style.transition = 'all 0.4s ease';
        setTimeout(() => notification.remove(), 400);
      }, 4000);
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Gather fields
      const formData = new FormData(form);
      const name  = (formData.get('name')  || '').toString().trim();
      const email = (formData.get('email') || '').toString().trim();
      const message = (formData.get('message') || '').toString().trim();

      // Validate
      if (!name || !email || !message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
      }

      // Success (no backend — client-side only)
      showNotification('Message sent successfully! I\'ll get back to you soon. 🚀', 'success');
      form.reset();
    });
  };

  /* ----------------------------------------------------------
     15. FOOTER YEAR
  ---------------------------------------------------------- */
  const initFooterYear = () => {
    const yearEl = qs('#year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  };

  /* ----------------------------------------------------------
     16. TESTIMONIAL SLIDER
  ---------------------------------------------------------- */
  const initTestimonialSlider = () => {
    const cards = qsa('.testimonial-card');
    const dots  = qsa('.testimonial-dot');
    const prev  = qs('.testimonial-prev');
    const next  = qs('.testimonial-next');
    if (!cards.length) return;

    let currentIndex = 0;
    let autoPlayTimer = null;

    const goToSlide = (index) => {
      // Clamp / wrap
      if (index < 0) index = cards.length - 1;
      if (index >= cards.length) index = 0;
      currentIndex = index;

      // Move the slider via translateX on parent
      const slider = cards[0].parentElement;
      if (slider) {
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        slider.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      }

      // Update dots
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    };

    // Arrow navigation
    if (prev) prev.addEventListener('click', () => { goToSlide(currentIndex - 1); resetAutoPlay(); });
    if (next) next.addEventListener('click', () => { goToSlide(currentIndex + 1); resetAutoPlay(); });

    // Dot navigation
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goToSlide(i); resetAutoPlay(); });
    });

    // Auto-rotate every 5 s
    const startAutoPlay = () => {
      autoPlayTimer = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 5000);
    };

    const resetAutoPlay = () => {
      clearInterval(autoPlayTimer);
      startAutoPlay();
    };

    goToSlide(0);
    startAutoPlay();
  };

  /* ----------------------------------------------------------
     17. BACK TO TOP BUTTON
  ---------------------------------------------------------- */
  const initBackToTop = () => {
    const btn = qs('.back-to-top');
    if (!btn) return;

    const update = () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
  };

  /* ----------------------------------------------------------
     18. 3D CARD TILT EFFECT
  ---------------------------------------------------------- */
  const initCardTilt = () => {
    // Skip tilt on touch devices for performance
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cards = qsa('.project-card, .service-card');
    const MAX_TILT = 5; // degrees

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;   // cursor X relative to card
        const y = e.clientY - rect.top;    // cursor Y relative to card
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Normalize to -1 … 1
        const rotateY = ((x - centerX) / centerX) * MAX_TILT;
        const rotateX = ((centerY - y) / centerY) * MAX_TILT;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'transform 0.1s ease';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s ease';
      });
    });
  };

  /* ----------------------------------------------------------
     19. LAZY LOADING IMAGES
  ---------------------------------------------------------- */
  const initLazyImages = () => {
    const images = qsa('img[data-src]');
    if (!images.length) return;

    // Use native lazy loading if available as a supplement
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
              img.addEventListener('load', () => {
                img.classList.add('loaded');
              });
            }
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '200px 0px' } // start loading 200px before viewport
    );

    images.forEach(img => observer.observe(img));
  };

  /* ----------------------------------------------------------
     20. SCROLL-OPTIMIZED EVENT CONSOLIDATION
  ---------------------------------------------------------- */
  // Debounce utility used for resize events
  const debounce = (fn, delay = 200) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  /* ----------------------------------------------------------
     21. KEYBOARD ACCESSIBILITY — ESC closes menu
  ---------------------------------------------------------- */
  const initKeyboardHandlers = () => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.body.classList.remove('menu-open');
      }
    });
  };

  /* ----------------------------------------------------------
     22. PERFORMANCE — reduce motion for users who prefer it
  ---------------------------------------------------------- */
  const respectsReducedMotion = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Disable particle animation opacity
      const canvas = qs('#particle-canvas');
      if (canvas) canvas.style.opacity = '0.3';
    }
  };

  /* ----------------------------------------------------------
     23. GLITCH TEXT EFFECT (hero heading random flicker)
  ---------------------------------------------------------- */
  const initGlitchEffect = () => {
    const glitchEls = qsa('.glitch');
    if (!glitchEls.length) return;

    // The CSS handles the core glitch; this adds periodic random offset
    setInterval(() => {
      glitchEls.forEach(el => {
        const shouldGlitch = Math.random() > 0.92;
        if (shouldGlitch) {
          el.style.textShadow = `
            ${(Math.random() - 0.5) * 4}px ${(Math.random() - 0.5) * 4}px 0 #00f0ff,
            ${(Math.random() - 0.5) * 4}px ${(Math.random() - 0.5) * 4}px 0 #ff006e
          `;
          setTimeout(() => {
            el.style.textShadow = '';
          }, 100);
        }
      });
    }, 200);
  };

  /* ----------------------------------------------------------
     24. SMOOTH PARALLAX ON HERO ELEMENTS
  ---------------------------------------------------------- */
  const initParallax = () => {
    const hero = qs('#hero, #home, .hero-section');
    if (!hero) return;

    const layers = qsa('.parallax-layer', hero);
    if (!layers.length) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      layers.forEach((layer, i) => {
        const speed = (i + 1) * 0.15;
        layer.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  };

  /* ----------------------------------------------------------
     25. NOTIFICATION SLIDE-IN KEYFRAME INJECTION
     (Inject CSS keyframe for form notification animation)
  ---------------------------------------------------------- */
  const injectAnimationKeyframes = () => {
    if (qs('#injected-keyframes')) return;
    const style = document.createElement('style');
    style.id = 'injected-keyframes';
    style.textContent = `
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(100%);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `;
    document.head.appendChild(style);
  };

  /* ----------------------------------------------------------
     INITIALIZATION — BOOT ALL MODULES
  ---------------------------------------------------------- */
  const boot = () => {
    injectAnimationKeyframes();
    initPreloader();
    initParticles();
    initCustomCursor();
    initScrollProgress();
    initStickyNavbar();
    initMobileMenu();
    initSmoothScroll();
    initActiveSection();
    initTypingAnimation();
    initScrollReveal();
    initSkillBars();
    initCounters();
    initThemeToggle();
    initContactForm();
    initFooterYear();
    initTestimonialSlider();
    initBackToTop();
    initCardTilt();
    initLazyImages();
    initKeyboardHandlers();
    initGlitchEffect();
    initParallax();
    respectsReducedMotion();

    console.log(
      '%c🚀 Muhammad Taha — Portfolio Loaded',
      'color: #00f0ff; font-size: 14px; font-weight: bold; background: #0a0a0f; padding: 8px 16px; border-radius: 6px;'
    );
  };

  boot();
});
