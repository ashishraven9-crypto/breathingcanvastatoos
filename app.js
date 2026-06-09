/* ═══════════════════════════════════════════════════════════════
   BREATHING CANVAS TATTOOS — Interactive Experience
   Scroll reveals, testimonial slider, gallery filters, lightbox,
   counter animations, mobile menu, and smooth interactions.
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Loading Screen ───
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loaded');
      document.body.style.overflow = '';
    }, 2800);
  });

  // Fallback: hide loader after max wait
  setTimeout(() => {
    loader.classList.add('loaded');
    document.body.style.overflow = '';
  }, 4000);

  // ─── Navigation Scroll Effect ───
  const nav = document.getElementById('nav');
  let lastScrollY = 0;

  const handleNavScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ─── Mobile Menu ───
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ─── Smooth Scroll for Anchor Links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        const navHeight = nav.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ─── Scroll Reveal (IntersectionObserver) ───
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all elements
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ─── Gallery Filter ───
  const filterButtons = document.querySelectorAll('.gallery__filter');
  const galleryItems = document.querySelectorAll('.gallery__item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.dataset.filter;

      galleryItems.forEach((item, index) => {
        const categories = item.dataset.category || '';

        if (filter === 'all' || categories.includes(filter)) {
          item.style.display = '';
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, index * 80);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ─── Gallery Lightbox ───
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.lightbox__close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && img.src) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // ─── Testimonials Slider ───
  const testimonials = document.querySelectorAll('.testimonial');
  const dots = document.querySelectorAll('.testimonials__dot');
  let currentTestimonial = 0;
  let testimonialInterval;

  const showTestimonial = (index) => {
    testimonials.forEach(t => t.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    testimonials[index].classList.add('active');
    dots[index].classList.add('active');
    currentTestimonial = index;
  };

  const nextTestimonial = () => {
    const next = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(next);
  };

  // Auto-advance testimonials
  const startTestimonialTimer = () => {
    testimonialInterval = setInterval(nextTestimonial, 5000);
  };

  const resetTestimonialTimer = () => {
    clearInterval(testimonialInterval);
    startTestimonialTimer();
  };

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.index);
      showTestimonial(index);
      resetTestimonialTimer();
    });
  });

  startTestimonialTimer();

  // ─── Counter Animation ───
  const counters = document.querySelectorAll('[data-count]');

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          animateCounter(el, target);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  function animateCounter(element, target) {
    const duration = 2000;
    const startTime = performance.now();

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const current = Math.floor(easedProgress * target);

      element.textContent = current + '+';

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = target + '+';
      }
    };

    requestAnimationFrame(step);
  }

  // ─── Form Handling ───
  const consultationForm = document.getElementById('consultationForm');
  if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(consultationForm);
      const data = Object.fromEntries(formData.entries());

      // Create mailto link with form data
      const subject = encodeURIComponent('Tattoo Consultation Request — ' + data.name);
      const body = encodeURIComponent(
        `Name: ${data.name}\n` +
        `Email: ${data.email}\n` +
        `Phone: ${data.phone || 'Not provided'}\n` +
        `Tattoo Style: ${data.tattooType || 'Not specified'}\n` +
        `Placement: ${data.placement || 'Not specified'}\n\n` +
        `Story:\n${data.story || 'Not provided'}`
      );

      window.location.href = `mailto:breathingcanvastattoos@gmail.com?subject=${subject}&body=${body}`;

      // Show success state
      const submitBtn = consultationForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Message Prepared ✓';
      submitBtn.style.background = 'var(--forest)';

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
      }, 3000);
    });
  }

  // Newsletter form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const btn = newsletterForm.querySelector('button');
      const originalText = btn.innerHTML;

      btn.innerHTML = 'Subscribed ✓';
      btn.style.background = 'var(--forest)';
      input.value = '';

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
      }, 3000);
    });
  }

  // ─── Hero Parallax Effect ───
  const heroBg = document.querySelector('.hero__bg img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroHeight = document.querySelector('.hero').offsetHeight;

      if (scrollY < heroHeight) {
        const parallax = scrollY * 0.3;
        heroBg.style.transform = `scale(1.1) translateY(${parallax}px)`;
      }
    }, { passive: true });
  }

  // ─── Cursor custom interaction (subtle) ───
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--terracotta);
    pointer-events: none;
    z-index: 9998;
    transition: transform 0.15s ease, opacity 0.15s;
    mix-blend-mode: difference;
    opacity: 0;
  `;
  document.body.appendChild(cursor);

  let cursorVisible = false;

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 4 + 'px';
    cursor.style.top = e.clientY - 4 + 'px';
    if (!cursorVisible) {
      cursor.style.opacity = '0.6';
      cursorVisible = true;
    }
  });

  // Enlarge cursor on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .gallery__item');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(4)';
      cursor.style.opacity = '0.3';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      cursor.style.opacity = '0.6';
    });
  });

  // Hide cursor on touch devices
  window.addEventListener('touchstart', () => {
    cursor.style.display = 'none';
  }, { once: true });

  // ─── Quote Section Parallax ───
  const quoteSection = document.querySelector('.quote-section__text');
  if (quoteSection && 'IntersectionObserver' in window) {
    const quoteObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const ratio = entry.intersectionRatio;
          quoteSection.style.opacity = 0.15 + (ratio * 0.85);
        }
      });
    }, {
      threshold: Array.from({ length: 20 }, (_, i) => i / 20)
    });

    quoteObserver.observe(quoteSection);
  }

});
