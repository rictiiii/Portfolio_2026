(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduced && 'IntersectionObserver' in window) {
    const targets = document.querySelectorAll('.k2-intro,.k2-problem-grid,.k2-thesis,.k2-principles,.k2-discovery,.k2-decision>* ,.k2-moment,.k2-section--iteration .k2-media,.k2-results,.k2-reflection,.k2-closing,.k2-appendix');
    document.documentElement.classList.add('k2-motion-ready');
    targets.forEach((target) => target.classList.add('k2-reveal'));
    const reveal = new IntersectionObserver((entries, observer) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }), { rootMargin: '0px 0px -10% 0px', threshold: .12 });
    targets.forEach((target) => reveal.observe(target));
  }
})();
