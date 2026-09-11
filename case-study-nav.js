(() => {
  const chapterNav = document.querySelector('[data-case-chapters]');
  if (!chapterNav) return;

  const primaryNav = document.querySelector('.navigation');
  const trigger = document.querySelector('[data-chapter-trigger]');
  const links = [...chapterNav.querySelectorAll('a[href^="#"]')];
  const sections = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);

  const updateVisibility = () => {
    const threshold = trigger ? trigger.offsetTop + trigger.offsetHeight : 72;
    const visible = window.scrollY > threshold;
    chapterNav.classList.toggle('case-chapters--visible', visible);
    chapterNav.toggleAttribute('inert', !visible);
    chapterNav.setAttribute('aria-hidden', String(!visible));
    primaryNav?.classList.toggle('nav-hidden', visible);
  };

  updateVisibility();
  window.addEventListener('scroll', updateVisibility, { passive: true });

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      const active = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!active) return;
      links.forEach((link) => {
        const selected = link.getAttribute('href') === `#${active.target.id}`;
        link.classList.toggle('case-chapters__active', selected);
        link.classList.toggle('is-active', selected);
        link.classList.toggle('sky-chapters__active', selected);
        if (selected) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-18% 0px -62% 0px', threshold: [0, .2, .5] });
    sections.forEach((section) => observer.observe(section));
  }
})();
