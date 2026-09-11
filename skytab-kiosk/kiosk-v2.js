document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.ks2');
  if (!root) return;

  const revealTargets = root.querySelectorAll('.ks2-intro, .ks2-queue, .ks2-frictions, .ks2-principle-grid, .ks2-process-grid, .ks2-prototype, .ks2-iteration, .ks2-screen-strip, .ks2-impact-grid, .ks2-outcomes, .ks2-quote blockquote');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach((element) => element.classList.add('is-visible'));
  } else {
    revealTargets.forEach((element) => element.classList.add('ks2-reveal'));
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16 });
    revealTargets.forEach((element) => revealObserver.observe(element));
  }

});
