// Enhance the complete, readable stage sequence with an explicit stage selector.
(() => {
  const controls = document.querySelector('.lifecycle-controls');
  if (!controls) return;
  const buttons = [...controls.querySelectorAll('[data-stage]')];
  const stages = buttons.map(button => document.getElementById(button.dataset.stage));
  if (stages.some(stage => !stage)) return;
  function select(index) {
    buttons.forEach((button, i) => {
      button.setAttribute('aria-pressed', String(i === index));
      stages[i].hidden = i !== index;
    });
  }
  buttons.forEach((button, index) => button.addEventListener('click', () => select(index)));
  select(0);
  controls.hidden = false;
})();
