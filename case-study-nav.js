(() => {
  const chapterNav = document.querySelector('[data-case-chapters]');
  if (!chapterNav) return;

  const primaryNav = document.querySelector('.navigation');
  const trigger = document.querySelector('[data-chapter-trigger]');
  const links = [...chapterNav.querySelectorAll('a[href^="#"]')];
  const chapters = links.map((link) => ({ link, section: document.getElementById(link.hash.slice(1)) })).filter(({ section }) => section);
  const homeSource = primaryNav?.querySelector('a[href="index.html"]');
  const inner = chapterNav.querySelector('.case-chapters__inner') || chapterNav;
  if (homeSource) {
    const home = document.createElement('a');
    home.href = homeSource.getAttribute('href');
    home.className = 'case-chapters__home';
    home.textContent = '← Home';
    inner.prepend(home);
  }

  let pastOverview = false;
  function updateVisibility() {
    const primaryFocused = primaryNav?.contains(document.activeElement);
    const chapterFocused = chapterNav.contains(document.activeElement);
    // A focused navigation stays visible until the visitor leaves it.
    const visible = !primaryFocused && (pastOverview || chapterFocused);
    chapterNav.classList.toggle('case-chapters--visible', visible);
    chapterNav.toggleAttribute('inert', !visible);
    chapterNav.setAttribute('aria-hidden', String(!visible));
    if (primaryNav) {
      primaryNav.classList.toggle('nav-hidden', visible);
      primaryNav.toggleAttribute('inert', visible);
      primaryNav.setAttribute('aria-hidden', String(visible));
    }
  }

  function updateActiveChapter() {
    const readingLine = window.innerHeight * 0.2;
    let active = chapters[0];
    for (const chapter of chapters) {
      if (chapter.section.getBoundingClientRect().top <= readingLine) active = chapter;
    }
    for (const chapter of chapters) {
      const selected = chapter === active;
      for (const name of ['case-chapters__active', 'is-active', 'sky-chapters__active']) chapter.link.classList.toggle(name, selected);
      if (selected) chapter.link.setAttribute('aria-current', 'location');
      else chapter.link.removeAttribute('aria-current');
    }
  }

  updateVisibility();
  updateActiveChapter();
  document.addEventListener('focusin', updateVisibility);
  // Wait until the next focus target is known before hiding either navigation.
  document.addEventListener('focusout', () => requestAnimationFrame(updateVisibility));

  if ('IntersectionObserver' in window) {
    if (trigger) {
      const visibilityObserver = new IntersectionObserver(() => {
        pastOverview = trigger.getBoundingClientRect().bottom <= 0;
        updateVisibility();
      }, { threshold: 0 });
      visibilityObserver.observe(trigger);
    }
    // A narrow viewport band supplies callbacks when each section enters or
    // leaves the reading position, including when scrolling back toward the top.
    let chapterObserver;
    function observeReadingPosition() {
      chapterObserver?.disconnect();
      const height = window.innerHeight;
      chapterObserver = new IntersectionObserver(updateActiveChapter, {
        rootMargin: `-${height * 0.2}px 0px -${height * 0.79}px 0px`, threshold: 0
      });
      chapters.forEach(({ section }) => chapterObserver.observe(section));
      updateActiveChapter();
    }
    observeReadingPosition();
    window.addEventListener('resize', observeReadingPosition);
  }
  // Without IntersectionObserver the primary navigation remains available.
  window.addEventListener('resize', updateActiveChapter);
  window.addEventListener('load', updateActiveChapter);
})();
