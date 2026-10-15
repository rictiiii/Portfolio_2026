// Use the same dialog and session key for direct visits and in-site links.
(() => {
  function init() {
    const password = document.body.dataset.password;
    if (!password) return;
    const url = new URL(location.href);
    const gate = window.portfolioPassword;
    if (gate.verified(url)) {
      document.body.style.visibility = 'visible';
      return;
    }
    const project = gate.projects[url.pathname.split('/').pop()];
    gate.show(url, { ...project, password }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
