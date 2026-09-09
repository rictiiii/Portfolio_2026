// Theme Switcher
document.addEventListener('DOMContentLoaded', function() {
  const themeSwitcher = document.querySelector('.theme-switcher');

  // Check for saved theme preference or default to 'dark'
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);

  // Theme toggle handler
  if (themeSwitcher) {
    themeSwitcher.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
});

// Scroll-progress based animations for project cards
document.addEventListener('DOMContentLoaded', function() {
  const projectCards = document.querySelectorAll('.project-card');
  const revealElements = document.querySelectorAll('.ii-reveal');

  if ('IntersectionObserver' in window && revealElements.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  const prototypeFrames = document.querySelectorAll('.ii-frame[data-prototype-width]');

  function sizePrototypeFrame(frame) {
    const canvas = frame.querySelector('.ii-frame__canvas');
    if (!canvas) return;

    const prototypeWidth = Number(frame.dataset.prototypeWidth) || 1440;
    const prototypeHeight = Number(frame.dataset.prototypeHeight) || 960;
    const scale = Math.min(frame.clientWidth / prototypeWidth, 1);

    canvas.style.width = `${prototypeWidth}px`;
    canvas.style.height = `${prototypeHeight}px`;
    canvas.style.transform = `scale(${scale})`;
    frame.style.height = `${Math.round(prototypeHeight * scale)}px`;
  }

  if (prototypeFrames.length) {
    prototypeFrames.forEach(sizePrototypeFrame);

    if ('ResizeObserver' in window) {
      const prototypeResizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => sizePrototypeFrame(entry.target));
      });
      prototypeFrames.forEach((frame) => prototypeResizeObserver.observe(frame));
    } else {
      window.addEventListener('resize', () => {
        prototypeFrames.forEach(sizePrototypeFrame);
      }, { passive: true });
    }
  }

  const prototypeTabs = Array.from(document.querySelectorAll('.ii-prototype-tab'));
  const prototypePanels = Array.from(document.querySelectorAll('.ii-prototype-panel'));

  function activatePrototypeTab(tab, moveFocus = false) {
    const panelId = tab.getAttribute('aria-controls');
    const activePanel = document.getElementById(panelId);
    if (!activePanel) return;

    prototypeTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-selected', String(isActive));
      item.tabIndex = isActive ? 0 : -1;
    });

    prototypePanels.forEach((panel) => {
      panel.classList.toggle('active', panel === activePanel);
    });

    if (moveFocus) tab.focus();

    const activeFrame = activePanel.querySelector('.ii-frame[data-prototype-width]');
    if (activeFrame) {
      window.requestAnimationFrame(() => sizePrototypeFrame(activeFrame));
    }
  }

  prototypeTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activatePrototypeTab(tab));
    tab.addEventListener('keydown', (event) => {
      let nextIndex;

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        nextIndex = (index + 1) % prototypeTabs.length;
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        nextIndex = (index - 1 + prototypeTabs.length) % prototypeTabs.length;
      } else if (event.key === 'Home') {
        nextIndex = 0;
      } else if (event.key === 'End') {
        nextIndex = prototypeTabs.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      activatePrototypeTab(prototypeTabs[nextIndex], true);
    });
  });

  function updateCardTransforms() {
    const windowHeight = window.innerHeight;

    projectCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardTop = rect.top;
      const cardHeight = rect.height;

      // Calculate progress: 0 when card bottom enters viewport, 1 when card top reaches center
      const startPoint = windowHeight;
      const endPoint = windowHeight / 2 - cardHeight / 2;

      let progress = 0;
      if (cardTop < startPoint) {
        progress = (startPoint - cardTop) / (startPoint - endPoint);
        progress = Math.max(0, Math.min(1, progress)); // Clamp between 0 and 1
      }

      // Apply easing (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);

      // Calculate values based on progress
      const opacity = eased;
      const scale = 0.8 + (0.2 * eased); // 0.8 to 1
      const translateY = 60 - (60 * eased); // 60px to 0
      const rotateX = 35 - (35 * eased); // 35deg to 0deg (more obvious trapezoid)

      // Store scroll-based values as data attributes for hover to use
      card.dataset.scrollScale = scale;
      card.dataset.scrollTranslateY = translateY;
      card.dataset.scrollRotateX = rotateX;

      // Apply transforms (hover will override if active)
      if (!card.matches(':hover')) {
        card.style.opacity = opacity;
        card.style.transform = `perspective(1200px) scale(${scale}) translateY(${translateY}px) rotateX(${rotateX}deg)`;
      }
    });
  }

  // Handle hover state
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      const scale = parseFloat(this.dataset.scrollScale) || 1;
      const rotateX = parseFloat(this.dataset.scrollRotateX) || 0;
      this.style.transform = `perspective(1200px) scale(${scale}) translateY(-16px) rotateX(${rotateX}deg)`;
    });

    card.addEventListener('mouseleave', function() {
      const scale = parseFloat(this.dataset.scrollScale) || 1;
      const translateY = parseFloat(this.dataset.scrollTranslateY) || 0;
      const rotateX = parseFloat(this.dataset.scrollRotateX) || 0;
      this.style.transform = `perspective(1200px) scale(${scale}) translateY(${translateY}px) rotateX(${rotateX}deg)`;
    });
  });

  // Update on scroll
  window.addEventListener('scroll', updateCardTransforms, { passive: true });

  // Initial update
  updateCardTransforms();
});

// Back to top button
document.addEventListener('DOMContentLoaded', function() {
  const backToTopButton = document.querySelector('.back-to-top');

  if (backToTopButton) {
    // Show/hide button based on scroll position
    function toggleBackToTop() {
      if (window.scrollY > 400) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    }

    // Smooth scroll to top
    backToTopButton.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Listen to scroll events
    window.addEventListener('scroll', toggleBackToTop, { passive: true });

    // Initial check
    toggleBackToTop();
  }
});

// Counter animation for impact cards
document.addEventListener('DOMContentLoaded', function() {
  const counters = document.querySelectorAll('.counter');

  if (counters.length === 0) return;

  let hasAnimated = false;

  function animateCounter(counter) {
    const target = parseFloat(counter.getAttribute('data-target'));
    const decimal = parseInt(counter.getAttribute('data-decimal')) || 0;
    const suffix = counter.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 seconds
    const frameRate = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const updateCounter = () => {
      frame++;
      const progress = easeOutQuart(frame / totalFrames);
      const current = progress * target;

      if (decimal > 0) {
        counter.textContent = current.toFixed(decimal) + suffix;
      } else {
        // For whole numbers, format with commas if it's 11 or 18
        const rounded = Math.floor(current);
        if (target === 11000 || target === 18000) {
          // Show the base number (11 or 18) then add suffix
          counter.textContent = rounded.toLocaleString().split(',')[0] + suffix;
        } else {
          counter.textContent = Math.floor(current) + suffix;
        }
      }

      if (frame < totalFrames) {
        requestAnimationFrame(updateCounter);
      } else {
        // Final value
        if (decimal > 0) {
          counter.textContent = target.toFixed(decimal) + suffix;
        } else {
          if (target === 11000 || target === 18000) {
            const baseNum = target === 11000 ? '11' : '18';
            counter.textContent = baseNum + suffix;
          } else {
            counter.textContent = Math.floor(target) + suffix;
          }
        }
      }
    };

    updateCounter();
  }

  // Use Intersection Observer to trigger animation when scrolled into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counters.forEach(counter => {
          animateCounter(counter);
        });
        observer.disconnect();
      }
    });
  }, {
    threshold: 0.5 // Trigger when 50% of the element is visible
  });

  // Observe the impact-cards container
  const impactCards = document.querySelector('.impact-cards');
  if (impactCards) {
    observer.observe(impactCards);
  }
});

// Contact form handler
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;

      // Create mailto link
      const subject = encodeURIComponent(`Message from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      const mailtoLink = `mailto:rickyliudesign@gmail.com?subject=${subject}&body=${body}`;

      // Open default email client
      window.location.href = mailtoLink;
    });
  }
});
