// Content is visible by default; motion only enhances an already usable page.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.work-project').forEach(project => {
    if (project.getBoundingClientRect().top <= innerHeight) return;
    project.classList.add('reveal-ready');
    observer.observe(project);
  });
  reduce.addEventListener('change', () => {
    if (!reduce.matches) return;
    observer.disconnect();
    document.querySelectorAll('.reveal-ready').forEach(project => project.classList.add('is-visible'));
  });
})();

// A local appearance control; system preference remains the initial default.
(() => {
  const button = document.querySelector('.theme-toggle');
  if (!button) return;
  const preference = matchMedia('(prefers-color-scheme: dark)');
  let explicit = false;
  function render(dark) {
    document.documentElement.dataset.appearance = dark ? 'dark' : 'light';
    button.textContent = dark ? 'Light mode' : 'Dark mode';
    button.setAttribute('aria-label', dark ? 'Light mode' : 'Dark mode');
  }
  render(preference.matches);
  button.hidden = false;
  button.addEventListener('click', () => {
    explicit = true;
    render(document.documentElement.dataset.appearance !== 'dark');
  });
  preference.addEventListener('change', event => { if (!explicit) render(event.matches); });
})();

// Keep the original sticker playful without animating for touch or reduced motion.
(() => {
 const sticker = document.querySelector('.eyes');
 if (!sticker) return;
 const reduce = matchMedia('(prefers-reduced-motion: reduce)');
 let frame = 0, point;
 function reset() { cancelAnimationFrame(frame); frame = 0; sticker.style.setProperty('--eye-x','0px'); sticker.style.setProperty('--eye-y','0px'); }
 document.addEventListener('pointermove', event => {
  if (reduce.matches || event.pointerType === 'touch') return;
  point = {x:event.clientX,y:event.clientY};
  if (frame) return;
  frame = requestAnimationFrame(() => {
   frame = 0;
   const box = sticker.getBoundingClientRect();
   const dx = point.x - box.left - box.width/2, dy = point.y - box.top - box.height/2;
   // Convert the pointer direction into the rotated sticker's local coordinates.
   let angle = 0;
   for (let el = sticker; el; el = el.parentElement) {
    const transform = getComputedStyle(el).transform;
    if (transform !== 'none') { const m = new DOMMatrixReadOnly(transform); angle += Math.atan2(m.b,m.a); }
   }
   const length = Math.hypot(dx,dy) || 1, distance = Math.min(4, length/24);
   sticker.style.setProperty('--eye-x', `${(dx*Math.cos(angle)+dy*Math.sin(angle))/length*distance}px`);
   sticker.style.setProperty('--eye-y', `${(-dx*Math.sin(angle)+dy*Math.cos(angle))/length*distance}px`);
  });
 }, {passive:true});
 document.documentElement.addEventListener('pointerleave',reset);
 window.addEventListener('blur',reset);
 reduce.addEventListener('change',reset);
})();
