(() => {
  const navigation = document.querySelector('.navigation');
  if (!navigation) return;

  const topSafeZone = 72;
  const directionThreshold = 8;
  let accumulatedDelta = 0;
  let touchY = null;
  let lastSettledY = window.scrollY;

  const setDirection = (delta) => {
    const currentY = window.scrollY;

    if (currentY <= topSafeZone) {
      navigation.classList.remove('nav-hidden');
      accumulatedDelta = 0;
      return;
    }

    if (Math.sign(delta) !== Math.sign(accumulatedDelta)) accumulatedDelta = 0;
    accumulatedDelta += delta;

    if (Math.abs(accumulatedDelta) < directionThreshold) return;

    navigation.classList.toggle('nav-hidden', accumulatedDelta > 0);
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
})();
