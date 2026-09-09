const folder = document.querySelector('.portfolio-folder');
const home = document.querySelector('.folder-home');
const sticker = document.querySelector('.eye-sticker');
const workMenu = document.querySelector('.nav-dropdown');
const workButton = workMenu.querySelector('.nav-link');
const cards = [...folder.querySelectorAll('.folder-card')];
const folderFront = folder.querySelector('.folder-front');
const folderBack = folder.querySelector('.folder-back');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const introAlreadyPlayed = document.documentElement.classList.contains('skip-intro');
const returnView = document.documentElement.dataset.returnView;
const returnViewKey = 'ricky-portfolio-return-view';
const introStartedAt = performance.now();

function revealPortfolio() {
  if (introAlreadyPlayed || reduceMotion.matches) {
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-ready', 'is-settled');
    return;
  }

  const remainingLetteringTime = Math.max(0, 3720 - (performance.now() - introStartedAt));
  window.setTimeout(() => {
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-ready');
    window.setTimeout(() => document.body.classList.add('is-settled'), 830);
  }, remainingLetteringTime);
}

if (document.readyState === 'complete') {
  revealPortfolio();
} else {
  window.addEventListener('load', revealPortfolio, { once: true });
}

function setExpanded(expanded) {
  const cardStarts = cards.map((card) => card.getBoundingClientRect());
  const frontStart = folderFront.getBoundingClientRect();
  const backStart = folderBack.getBoundingClientRect();

  folder.classList.toggle('is-expanded', expanded);
  home.classList.toggle('is-expanded', expanded);
  folder.setAttribute('aria-expanded', String(expanded));

  if (reduceMotion.matches) return;

  requestAnimationFrame(() => {
    cards.forEach((card, index) => {
      const end = card.getBoundingClientRect();
      const start = cardStarts[index];
      const surface = card.querySelector('.card-surface');
      surface.animate([
        {
          transform: `translate(${start.left - end.left}px, ${start.top - end.top}px) scale(${start.width / end.width}, ${start.height / end.height})`,
          transformOrigin: 'top left'
        },
        { transform: 'translate(0, 0) scale(1)', transformOrigin: 'top left' }
      ], {
        duration: 720,
        easing: 'cubic-bezier(.2,.8,.2,1)'
      });
    });

    [
      [folderFront, frontStart, 'translateX(-50%) translateY(0) rotateX(0deg) scale(.96)'],
      [folderBack, backStart, 'translateX(-50%) translateY(0) scale(.96)']
    ].forEach(([part, start, restingTransform]) => {
      const end = part.getBoundingClientRect();
      part.animate([
        { transform: `${restingTransform} translateY(${start.top - end.top}px)` },
        { transform: restingTransform }
      ], {
        duration: 760,
        easing: 'cubic-bezier(.2,.8,.2,1)'
      });
    });
  });
}

if (returnView === 'expanded') {
  folder.classList.add('is-expanded');
  home.classList.add('is-expanded');
  folder.setAttribute('aria-expanded', 'true');
}

cards.forEach((card) => {
  card.addEventListener('click', () => {
    try {
      sessionStorage.setItem(returnViewKey, folder.classList.contains('is-expanded') ? 'expanded' : 'closed');
    } catch (error) {
      document.documentElement.removeAttribute('data-return-view');
    }
  });
});

window.addEventListener('pageshow', () => {
  try {
    sessionStorage.removeItem(returnViewKey);
  } catch (error) {
    document.documentElement.removeAttribute('data-return-view');
  }
});

folder.addEventListener('click', (event) => {
  if (event.target.closest('.folder-card')) return;
  setExpanded(!folder.classList.contains('is-expanded'));
});

document.addEventListener('click', (event) => {
  if (!folder.classList.contains('is-expanded')) return;
  if (folder.contains(event.target)) return;
  setExpanded(false);
});

folder.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  if (event.target.closest('.folder-card')) return;
  event.preventDefault();
  setExpanded(!folder.classList.contains('is-expanded'));
});

workButton.addEventListener('click', () => {
  const open = workMenu.classList.toggle('is-open');
  workButton.setAttribute('aria-expanded', String(open));
});

document.addEventListener('click', (event) => {
  if (workMenu.contains(event.target)) return;
  workMenu.classList.remove('is-open');
  workButton.setAttribute('aria-expanded', 'false');
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  workMenu.classList.remove('is-open');
  workButton.setAttribute('aria-expanded', 'false');
  if (folder.classList.contains('is-expanded')) setExpanded(false);
});

home.addEventListener('pointermove', (event) => {
  const box = sticker.getBoundingClientRect();
  const dx = event.clientX - (box.left + box.width / 2);
  const dy = event.clientY - (box.top + box.height / 2);
  const length = Math.hypot(dx, dy) || 1;
  const distance = box.width * 0.055;
  sticker.style.setProperty('--eye-x', `${(dx / length) * distance}px`);
  sticker.style.setProperty('--eye-y', `${(dy / length) * distance}px`);
});

home.addEventListener('pointerleave', () => {
  sticker.style.setProperty('--eye-x', '0px');
  sticker.style.setProperty('--eye-y', '0px');
});
