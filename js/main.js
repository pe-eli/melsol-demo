/* ═══════════════════════════════════════════════════════════
   MelSol — Main JavaScript
   Interactions, animations, and scroll behaviors
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── DOM Elements ───
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav__link');
  const backToTopBtn = document.getElementById('backToTop');
  const newsletterForm = document.getElementById('newsletterForm');

  // ─── Mobile Menu ───

  function openMenu() {
    navMenu.classList.add('nav__menu--open');
    document.body.style.overflow = 'hidden';
    navToggle.setAttribute('aria-label', 'Fechar menu');
  }

  function closeMenu() {
    navMenu.classList.remove('nav__menu--open');
    document.body.style.overflow = '';
    navToggle.setAttribute('aria-label', 'Abrir menu');
  }

  navToggle.addEventListener('click', function () {
    const isOpen = navMenu.classList.contains('nav__menu--open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when clicking nav links
  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  // ─── Header Scroll Effect ───
  let lastScrollY = 0;

  function handleHeaderScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    lastScrollY = scrollY;
  }

  // ─── Active Nav Link on Scroll ───
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 100;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // ─── Back to Top ───
  function handleBackToTop() {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('back-to-top--visible');
    } else {
      backToTopBtn.classList.remove('back-to-top--visible');
    }
  }

  backToTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── Scroll Event (throttled) ───
  let ticking = false;

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        handleHeaderScroll();
        updateActiveNav();
        handleBackToTop();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ─── Scroll Reveal (IntersectionObserver) ───
  function initScrollReveal() {
    // Add reveal classes to elements
    const revealTargets = [
      { selector: '.section-header', delay: 0 },
      { selector: '.product-card', stagger: true },
      { selector: '.about__image-col', delay: 0 },
      { selector: '.about__text-col', delay: 1 },
      { selector: '.about__value', stagger: true },
      { selector: '.newsletter__content', delay: 0 },
    ];

    revealTargets.forEach(function (target) {
      const elements = document.querySelectorAll(target.selector);
      elements.forEach(function (el, i) {
        el.classList.add('reveal');
        if (target.stagger) {
          el.classList.add('reveal--delay-' + Math.min(i + 1, 6));
        } else if (target.delay) {
          el.classList.add('reveal--delay-' + target.delay);
        }
      });
    });

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('reveal--visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  // ─── Newsletter Form ───
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var email = document.getElementById('emailInput').value;
      if (!email) return;

      // Reset form after submission
      newsletterForm.reset();
    });
  }

  // ─── Initialize ───
  handleHeaderScroll();
  handleBackToTop();
  initScrollReveal();
})();
