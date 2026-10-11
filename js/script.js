/**
 * ==========================================================================
 * REEM THABET - PORTFOLIO INTERACTIVITY SCRIPT
 * Aspiring Flutter Developer & Software Engineer
 * Vanilla JavaScript (No external framework dependencies)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. THEME MANAGEMENT (DARK / LIGHT MODE)
     Default: Dark Mode
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const rootElement = document.documentElement;

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem('reem-portfolio-theme') || 'dark';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    if (theme === 'light') {
      rootElement.setAttribute('data-theme', 'light');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
        themeToggleBtn.setAttribute('title', 'Switch to dark theme');
      }
    } else {
      rootElement.setAttribute('data-theme', 'dark');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
        themeToggleBtn.setAttribute('title', 'Switch to light theme');
      }
    }
    localStorage.setItem('reem-portfolio-theme', theme);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  /* --------------------------------------------------------------------------
     2. MOBILE NAVIGATION MENU
     -------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const navLinkElements = document.querySelectorAll('.nav-link');

  function toggleMobileMenu(forceClose = false) {
    if (!mobileToggle || !navLinks) return;
    
    if (forceClose) {
      mobileToggle.classList.remove('open');
      navLinks.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
    } else {
      const isOpen = mobileToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  // Close mobile menu on clicking any navigation link
  navLinkElements.forEach((link) => {
    link.addEventListener('click', () => {
      toggleMobileMenu(true);
    });
  });

  // Close mobile menu if clicked outside
  document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('open')) {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        toggleMobileMenu(true);
      }
    }
  });

  /* --------------------------------------------------------------------------
     3. SMOOTH SCROLLING WITH NAVBAR OFFSET
     -------------------------------------------------------------------------- */
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

  smoothScrollLinks.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = 72; // height in px
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* --------------------------------------------------------------------------
     4. SCROLL-BASED ACTIVE NAVIGATION LINK (SCROLLSPY)
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;
    const navHeight = 80;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - navHeight;
      const sectionId = current.getAttribute('id');
      const matchingNavLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinkElements.forEach((link) => link.classList.remove('active'));
        if (matchingNavLink) {
          matchingNavLink.classList.add('active');
        }
      }
    });

    // If at the very top of page, activate home
    if (scrollY < 100) {
      navLinkElements.forEach((link) => link.classList.remove('active'));
      const homeLink = document.querySelector('.nav-link[href="#home"]');
      if (homeLink) homeLink.classList.add('active');
    }
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink(); // Initial call

  /* --------------------------------------------------------------------------
     5. SCROLL-TRIGGERED FADE-IN ANIMATIONS (INTERSECTION OBSERVER)
     -------------------------------------------------------------------------- */
  const animatedElements = document.querySelectorAll('.fade-in-on-scroll');

  // Check if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Immediately show all elements if user prefers reduced motion
    animatedElements.forEach((el) => el.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window) {
    const appearanceObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Unobserve once animated
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach((el) => {
      appearanceObserver.observe(el);
    });
  } else {
    // Fallback for older browsers
    animatedElements.forEach((el) => el.classList.add('is-visible'));
  }

  /* --------------------------------------------------------------------------
     6. CONTACT FORM VALIDATION & HANDLING (STRUCTURED FOR BACKEND INTEGRATION)
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      // Reset feedback
      if (formFeedback) {
        formFeedback.className = 'form-feedback';
        formFeedback.style.display = 'none';
        formFeedback.textContent = '';
      }

      // Basic client-side validation
      if (!name || !email || !subject || !message) {
        showFeedback('Please fill out all fields before sending.', 'error');
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFeedback('Please enter a valid email address.', 'error');
        return;
      }

      // Simulate sending state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }

        // Display success confirmation
        showFeedback(
          'Thank you, ' + name + '! Your message draft is ready. (Contact form is pre-configured for connection to services like Formspree or EmailJS). You can also email directly at reemthabet15@gmail.com.',
          'success'
        );

        // Reset form inputs
        contactForm.reset();
      }, 700);
    });
  }

  function showFeedback(message, type) {
    if (!formFeedback) return;
    formFeedback.textContent = message;
    formFeedback.className = `form-feedback ${type}`;
    formFeedback.style.display = 'flex';
    formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* --------------------------------------------------------------------------
     7. BACK TO TOP BUTTON
     -------------------------------------------------------------------------- */
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* --------------------------------------------------------------------------
     8. IN-BROWSER LIVE EDIT MODE
     -------------------------------------------------------------------------- */
  const editorToggleBtn = document.getElementById('editor-toggle-btn');
  const editorActions = document.getElementById('editor-actions');
  const editorSaveBtn = document.getElementById('editor-save-btn');
  const editorResetBtn = document.getElementById('editor-reset-btn');
  const mainContent = document.querySelector('main');

  // Load previously saved live edits if available
  const savedContent = localStorage.getItem('reem-portfolio-content');
  if (savedContent && mainContent) {
    mainContent.innerHTML = savedContent;
  }

  let isEditing = false;

  function setEditMode(enable) {
    isEditing = enable;
    if (enable) {
      document.body.classList.add('is-editing');
      document.designMode = 'on';
      if (editorToggleBtn) {
        editorToggleBtn.classList.add('active');
        editorToggleBtn.innerHTML = '<span class="editor-icon">✏️</span> <span class="editor-label">Edit Mode: <strong>ON</strong> (Click text to edit)</span>';
      }
      if (editorActions) editorActions.style.display = 'flex';
    } else {
      document.body.classList.remove('is-editing');
      document.designMode = 'off';
      if (editorToggleBtn) {
        editorToggleBtn.classList.remove('active');
        editorToggleBtn.innerHTML = '<span class="editor-icon">✏️</span> <span class="editor-label">Edit Mode: <strong>OFF</strong></span>';
      }
      if (editorActions) editorActions.style.display = 'none';
    }
  }

  if (editorToggleBtn) {
    editorToggleBtn.addEventListener('click', () => {
      setEditMode(!isEditing);
    });
  }

  // Keyboard shortcut: Ctrl + E (or Cmd + E) to toggle edit mode
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
      e.preventDefault();
      setEditMode(!isEditing);
    }
  });

  if (editorSaveBtn && mainContent) {
    editorSaveBtn.addEventListener('click', () => {
      localStorage.setItem('reem-portfolio-content', mainContent.innerHTML);
      const originalText = editorSaveBtn.innerHTML;
      editorSaveBtn.innerHTML = '✓ Saved!';
      setTimeout(() => {
        editorSaveBtn.innerHTML = originalText;
      }, 1500);
    });
  }

  if (editorResetBtn && mainContent) {
    editorResetBtn.addEventListener('click', () => {
      if (confirm('Reset all live edits back to default portfolio content?')) {
        localStorage.removeItem('reem-portfolio-content');
        window.location.reload();
      }
    });
  }
});

