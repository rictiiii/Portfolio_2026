(() => {
  const navigation = document.querySelector('.navigation');
  if (!navigation) return;

  const chapterNavigation = document.querySelector('.sky-chapters');
  const chapterTrigger = document.querySelector('.sky-snapshot');

  const topSafeZone = 72;
  const directionThreshold = 8;
  let accumulatedDelta = 0;
  let touchY = null;
  let lastSettledY = window.scrollY;

  const setChapterVisibility = (visible) => {
    if (!chapterNavigation) return;
    chapterNavigation.classList.toggle('sky-chapters--visible', visible);
    chapterNavigation.toggleAttribute('inert', !visible);
    chapterNavigation.setAttribute('aria-hidden', String(!visible));
  };

  setChapterVisibility(false);

  const setDirection = (delta) => {
    const currentY = window.scrollY;

    if (currentY <= topSafeZone) {
      navigation.classList.remove('nav-hidden');
      setChapterVisibility(false);
      accumulatedDelta = 0;
      return;
    }

    if (Math.sign(delta) !== Math.sign(accumulatedDelta)) accumulatedDelta = 0;
    accumulatedDelta += delta;

    if (Math.abs(accumulatedDelta) < directionThreshold) return;

    const movingDown = accumulatedDelta > 0;
    const chapterThreshold = chapterTrigger
      ? chapterTrigger.offsetTop + chapterTrigger.offsetHeight
      : topSafeZone;

    navigation.classList.toggle('nav-hidden', movingDown);
    setChapterVisibility(movingDown && currentY > chapterThreshold);
    accumulatedDelta = 0;
  };

  window.addEventListener('wheel', (event) => {
    setDirection(event.deltaY);
  }, { passive: true });

  window.addEventListener('touchstart', (event) => {
    touchY = event.touches[0]?.clientY ?? null;
  }, { passive: true });

  window.addEventListener('touchmove', (event) => {
    const nextY = event.touches[0]?.clientY;
    if (touchY === null || nextY === undefined) return;
    setDirection(touchY - nextY);
    touchY = nextY;
  }, { passive: true });

  window.addEventListener('keydown', (event) => {
    const downKeys = ['ArrowDown', 'PageDown', 'End', 'Space'];
    const upKeys = ['ArrowUp', 'PageUp', 'Home'];

    if (downKeys.includes(event.code) && !event.shiftKey) setDirection(directionThreshold);
    if (upKeys.includes(event.code) || (event.code === 'Space' && event.shiftKey)) setDirection(-directionThreshold);
  });

  window.addEventListener('scrollend', () => {
    const currentY = window.scrollY;
    const delta = currentY - lastSettledY;
    if (Math.abs(delta) >= directionThreshold) setDirection(delta);
    lastSettledY = currentY;
  }, { passive: true });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = document.querySelectorAll([
    '.sky-section__intro',
    '.sky-before',
    '.sky-thesis',
    '.sky-lifecycle',
    '.sky-discovery',
    '.sky-decision > *',
    '.sky-moment',
    '.sky-extension',
    '.sky-iteration',
    '.sky-results',
    '.sky-reflection',
    '.sky-closing',
    '.sky-appendix'
  ].join(','));

  if (!reduceMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('sky-motion-ready');
    revealTargets.forEach((target) => target.classList.add('sky-reveal'));

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('sky-reveal--visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

    revealTargets.forEach((target) => revealObserver.observe(target));
  }

  const chapterLinks = [...document.querySelectorAll('.sky-chapters a[href^="#"]')];
  const chapters = chapterLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && chapters.length) {
    const chapterObserver = new IntersectionObserver((entries) => {
      const active = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!active) return;

      chapterLinks.forEach((link) => {
        const selected = link.getAttribute('href') === `#${active.target.id}`;
        link.classList.toggle('sky-chapters__active', selected);
        if (selected) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-18% 0px -62% 0px', threshold: [0, 0.2, 0.5] });

    chapters.forEach((chapter) => chapterObserver.observe(chapter));
  }
})();
