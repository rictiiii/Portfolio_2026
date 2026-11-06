// Shared disclosure navigation. Native buttons provide Enter and Space activation.
(function() {
  const dropdown = document.querySelector('.navigation .nav-dropdown');
  if (!dropdown) return;

  const button = dropdown.querySelector('button.nav-link');
  const menu = dropdown.querySelector('.nav-dropdown-menu');
  if (!button || !menu) return;

  if (!menu.id) menu.id = 'portfolio-work-links';
  button.setAttribute('aria-controls', menu.id);
  // This is a disclosure containing ordinary links, not an application menu.
  button.removeAttribute('aria-haspopup');

  function setOpen(open) {
    dropdown.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
  }

  setOpen(false);

  button.addEventListener('click', function() {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });

  dropdown.addEventListener('focusout', function(event) {
    if (!dropdown.contains(event.relatedTarget)) setOpen(false);
  });

  document.addEventListener('click', function(event) {
    if (!dropdown.contains(event.target)) setOpen(false);
  });

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      event.preventDefault();
      setOpen(false);
      button.focus();
    }
  });
})();

// Metrics remain as authored: preserve decimals, currency, units, and qualifiers.

// One shared back-to-top control on every portfolio page.
(() => {
  if (document.querySelector('.portfolio-to-top')) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'portfolio-to-top';
  button.setAttribute('aria-label', 'Back to top');
  button.title = 'Back to top';
  button.innerHTML = '<span aria-hidden="true">↑</span>';
  button.hidden = true;
  document.body.append(button);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let scheduled = false;
  function update() {
    button.hidden = scrollY < Math.min(600, innerHeight * .75);
    scheduled = false;
  }
  function schedule() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }
  button.addEventListener('click', () => {
    const target = document.querySelector('main, h1');
    if (target) {
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
        target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      }
      target.focus({ preventScroll: true });
    }
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  });
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  addEventListener('pageshow', update);
  update();
})();
