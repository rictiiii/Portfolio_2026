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
