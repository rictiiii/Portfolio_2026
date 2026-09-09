// Shared portfolio navigation dropdown
(function() {
  const dropdown = document.querySelector('.navigation .nav-dropdown');
  if (!dropdown) return;

  const button = dropdown.querySelector('button.nav-link');
  if (!button) return;

  function closeDropdown() {
    dropdown.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
  }

  button.addEventListener('click', function(event) {
    event.stopPropagation();
    const willOpen = !dropdown.classList.contains('is-open');
    dropdown.classList.toggle('is-open', willOpen);
    button.setAttribute('aria-expanded', String(willOpen));
  });

  document.addEventListener('click', function(event) {
    if (!dropdown.contains(event.target)) closeDropdown();
  });

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeDropdown();
      button.focus();
    }
  });
})();

// Counting animation for metrics
(function() {
  function animateValue(element, start, end, duration, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Ease out cubic function for smoother animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeOutCubic;

      element.textContent = formatNumber(current, suffix);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = formatNumber(end, suffix);
      }
    };
    window.requestAnimationFrame(step);
  }

  function formatNumber(num, suffix) {
    if (suffix === '%') {
      return Math.round(num) + '%';
    } else if (suffix === ' days') {
      return num.toFixed(1) + ' days';
    } else if (suffix === '+') {
      return Math.round(num).toLocaleString() + '+';
    }
    return Math.round(num).toLocaleString();
  }

  function parseMetricValue(text) {
    // Remove commas and parse the number
    const cleanText = text.replace(/,/g, '');

    if (text.includes('%')) {
      return { value: parseFloat(cleanText), suffix: '%' };
    } else if (text.includes('days')) {
      return { value: parseFloat(cleanText), suffix: ' days' };
    } else if (text.includes('+')) {
      return { value: parseFloat(cleanText), suffix: '+' };
    }

    return { value: parseFloat(cleanText), suffix: '' };
  }

  function initCounters() {
    const metricValues = document.querySelectorAll('.hero-metric-value');

    if (metricValues.length === 0) return;

    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          const originalText = entry.target.textContent;
          const { value, suffix } = parseMetricValue(originalText);

          if (!isNaN(value)) {
            entry.target.textContent = formatNumber(0, suffix);
            animateValue(entry.target, 0, value, 2000, suffix);
          }
        }
      });
    }, observerOptions);

    metricValues.forEach(metric => observer.observe(metric));
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCounters);
  } else {
    initCounters();
  }
})();
