// Shared password dialog for project links and direct case-study visits.
(() => {
  const projects = {
    'skytab-onboarding.html': { name: 'SkyTab Onboarding', password: 'ricky' },
    'intelligence-inbox-premium-case-study.html': { name: 'Intelligence Inbox', password: 'ricky' }
  };
  const key = url => 'password_verified_' + url.pathname;
  function verified(url) {
    try { return sessionStorage.getItem(key(url)) === 'true'; } catch { return false; }
  }
  function show(url, project, direct = false) {
    if (document.querySelector('.password-dialog')) return;
    let opener = document.activeElement;
    const dropdown = opener?.closest('.nav-dropdown');
    if (dropdown) {
      opener = dropdown.querySelector('button');
      dropdown.classList.remove('is-open');
      opener.setAttribute('aria-expanded', 'false');
      dropdown.querySelector('.nav-dropdown-menu').hidden = true;
    }
    const dialog = document.createElement('dialog');
    dialog.className = 'password-dialog';
    dialog.setAttribute('aria-labelledby', 'password-title');
    dialog.setAttribute('aria-describedby', 'password-description');
    dialog.innerHTML = `
      <button class="password-close" type="button" aria-label="Close password dialog">×</button>
      <p class="password-eyebrow">SELECTED WORK · PRIVATE CASE STUDY</p>
      <h2 id="password-title">A closer look.</h2>
      <p id="password-description"></p>
      <form class="password-form">
        <label for="project-password">Password</label>
        <input id="project-password" name="password" type="password" autocomplete="current-password" placeholder="Enter project password" required aria-describedby="password-error">
        <p id="password-error" class="password-error" role="alert"></p>
        <button class="password-submit" type="submit">View case study <span aria-hidden="true">↗</span></button>
      </form>
      <p class="password-request">Need access? <a>Request password</a></p>`;
    dialog.querySelector('#password-description').textContent = `Enter the password to explore ${project.name}.`;
    const request = dialog.querySelector('.password-request a');
    request.href = 'mailto:rickyliudesign@gmail.com?subject=' + encodeURIComponent('Portfolio password request — ' + project.name) + '&body=' + encodeURIComponent(`Hi Ricky,\n\nI’d like to view your ${project.name} case study. Could you please share the password?\n\nThank you!`);
    const input = dialog.querySelector('input');
    const error = dialog.querySelector('.password-error');
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.append(dialog);
    let unlocked = false;
    dialog.addEventListener('close', () => {
      document.body.style.overflow = oldOverflow;
      dialog.remove();
      if (direct && !unlocked) {
        location.replace(new URL('index.html#work', url).href);
      } else if (direct) {
        const main = document.querySelector('main, h1');
        if (main) { main.setAttribute('tabindex', '-1'); main.focus({ preventScroll: true }); }
      } else if (opener && opener.isConnected) opener.focus({ preventScroll: true });
    });
    dialog.querySelector('.password-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const box = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
    });
    input.addEventListener('input', () => { input.removeAttribute('aria-invalid'); error.textContent = ''; });
    dialog.querySelector('form').addEventListener('submit', event => {
      event.preventDefault();
      if (input.value.trim().toLowerCase() !== project.password.toLowerCase()) {
        error.textContent = 'That password isn’t right. Please try again.';
        input.setAttribute('aria-invalid', 'true');
        input.select();
        input.focus();
        return;
      }
      try { sessionStorage.setItem(key(url), 'true'); } catch {
        // If storage is unavailable, verification still works on a direct visit.
      }
      unlocked = true;
      dialog.close();
      if (!direct) location.assign(url.href);
    });
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const controls = [...dialog.querySelectorAll('button, input, a[href]')].filter(el => !el.disabled);
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    });
    dialog.showModal();
    document.body.style.visibility = 'visible';
    input.focus({ preventScroll: true });
  }
  window.portfolioPassword = { verified, show, projects };
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;
    const project = projects[url.pathname.split('/').pop()];
    if (!project || verified(url)) return;
    event.preventDefault();
    show(url, project);
  });
})();
