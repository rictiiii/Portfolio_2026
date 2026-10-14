// Password protection for case study pages
(function() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPasswordProtection);
  } else {
    initPasswordProtection();
  }

  function initPasswordProtection() {
    // Check if password is already verified in session storage
    const pagePassword = document.body.getAttribute('data-password');

    if (!pagePassword) {
      return; // No password protection on this page
    }

  const sessionKey = 'password_verified_' + window.location.pathname;
  const isVerified = sessionStorage.getItem(sessionKey);

  if (isVerified === 'true') {
    document.body.style.visibility = 'visible';
    return; // Already verified in this session
  }

  // Hide the page content
  document.body.style.visibility = 'hidden';

  // Create password overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    visibility: visible;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--color-background-primary, #ffffff);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;

  const container = document.createElement('div');
  container.style.cssText = `
    max-width: 400px;
    padding: 48px;
    text-align: center;
  `;

  const title = document.createElement('h2');
  title.textContent = 'Password Required';
  title.style.cssText = `
    margin: 0 0 16px 0;
    font-size: 24px;
    font-weight: 600;
    color: var(--color-text-primary, #1a1a1a);
  `;

  const description = document.createElement('p');
  description.textContent = 'This case study is password protected. Please enter the password to continue.';
  description.style.cssText = `
    margin: 0 0 32px 0;
    font-size: 16px;
    color: var(--color-text-secondary, #6b6b6b);
    line-height: 1.5;
  `;

  const input = document.createElement('input');
  input.type = 'password';
  input.setAttribute('aria-label', 'Project password');
  input.placeholder = 'Enter password';
  input.style.cssText = `
    width: 100%;
    padding: 12px 16px;
    border: 1px solid var(--color-border, #e5e7eb);
    border-radius: 8px;
    font-size: 16px;
    font-family: inherit;
    margin-bottom: 16px;
    box-sizing: border-box;
  `;

  const errorMsg = document.createElement('p');
  errorMsg.setAttribute('role', 'alert');
  errorMsg.style.cssText = `
    color: #ef4444;
    font-size: 14px;
    margin: -8px 0 16px 0;
    min-height: 20px;
  `;

  const button = document.createElement('button');
  button.textContent = 'Submit';
  button.style.cssText = `
    width: 100%;
    padding: 12px 24px;
    background: linear-gradient(180deg, #4a4a4a 0%, #1a1a1a 100%);
    color: #ffffff;
    border: none;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.3s ease;
  `;

  button.onmouseover = function() {
    this.style.transform = 'translateY(-2px)';
    this.style.boxShadow = '0 8px 24px 0 rgba(0, 0, 0, 0.3)';
  };

  button.onmouseout = function() {
    this.style.transform = 'translateY(0)';
    this.style.boxShadow = 'none';
  };

  function checkPassword() {
    const enteredPassword = input.value.toLowerCase().trim();
    const correctPassword = pagePassword.toLowerCase();

    if (enteredPassword === correctPassword) {
      // Store verification in session storage
      sessionStorage.setItem(sessionKey, 'true');

      // Remove overlay and show content
      overlay.remove();
      document.body.style.visibility = 'visible';
    } else {
      errorMsg.textContent = 'Incorrect password. Please try again.';
      input.value = '';
      input.focus();
    }
  }

  button.addEventListener('click', checkPassword);
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      checkPassword();
    }
  });

  container.appendChild(title);
  container.appendChild(description);
  container.appendChild(input);
  container.appendChild(errorMsg);
  container.appendChild(button);
  overlay.appendChild(container);
  document.body.appendChild(overlay);

  // Focus the input
  setTimeout(() => input.focus(), 100);
  }
})();
