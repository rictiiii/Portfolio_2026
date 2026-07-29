// Password modal for protected projects on homepage
(function() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const protectedProjects = [
      {
        targetUrl: 'skytab-onboarding.html',
        password: 'ricky',
        sessionKey: 'password_verified_onboarding'
      },
      {
        targetUrl: 'intelligence-inbox-premium-case-study.html',
        password: 'ricky',
        sessionKey: 'password_verified_intelligence_inbox'
      }
    ];

    protectedProjects.forEach(function(project) {
      const projectLinks = document.querySelectorAll(
        'a[href="' + project.targetUrl + '"]'
      );

      projectLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          showPasswordModal(
            project.targetUrl,
            project.password,
            project.sessionKey
          );
          return false;
        }, true);
      });
    });
  }

  function showPasswordModal(targetUrl, correctPassword, sessionKey) {
    // Check if already verified in session
    const isVerified = sessionStorage.getItem(sessionKey);

    console.log('Session verified status:', isVerified);

    if (isVerified === 'true') {
      console.log('Already verified, navigating to:', targetUrl);
      window.location.href = targetUrl;
      return;
    }

    console.log('Showing password modal');

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.2s ease;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
      background: var(--color-background-primary, #ffffff);
      border-radius: 16px;
      padding: 48px;
      max-width: 440px;
      width: 90%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s ease;
      position: relative;
    `;

    // Add X button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      background: transparent;
      border: none;
      font-size: 32px;
      color: var(--color-text-secondary, #6b6b6b);
      cursor: pointer;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s ease;
      padding: 0;
      line-height: 1;
    `;

    closeButton.addEventListener('mouseover', function() {
      this.style.color = 'var(--color-text-primary, #1a1a1a)';
    });

    closeButton.addEventListener('mouseout', function() {
      this.style.color = 'var(--color-text-secondary, #6b6b6b)';
    });

    closeButton.addEventListener('click', function() {
      overlay.remove();
    });

    const title = document.createElement('h2');
    title.textContent = 'Password Required';
    title.style.cssText = `
      margin: 0 0 12px 0;
      font-size: 28px;
      font-weight: 600;
      color: var(--color-text-primary, #1a1a1a);
    `;

    const description = document.createElement('p');
    description.textContent = 'This project is password protected. Please enter the password to continue.';
    description.style.cssText = `
      margin: 0 0 32px 0;
      font-size: 16px;
      color: var(--color-text-secondary, #6b6b6b);
      line-height: 1.6;
    `;

    const input = document.createElement('input');
    input.type = 'password';
    input.placeholder = 'Enter password';
    input.style.cssText = `
      width: 100%;
      padding: 14px 18px;
      border: 2px solid var(--color-border, #e5e7eb);
      border-radius: 12px;
      font-size: 16px;
      font-family: inherit;
      margin-bottom: 16px;
      box-sizing: border-box;
      transition: border-color 0.2s ease;
    `;

    input.addEventListener('focus', function() {
      this.style.borderColor = 'var(--color-accent, #1a1a1a)';
    });

    input.addEventListener('blur', function() {
      this.style.borderColor = 'var(--color-border, #e5e7eb)';
    });

    const errorMsg = document.createElement('p');
    errorMsg.style.cssText = `
      color: #ef4444;
      font-size: 14px;
      margin: -8px 0 16px 0;
      min-height: 20px;
    `;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 12px;
    `;

    const requestButton = document.createElement('button');
    requestButton.textContent = 'Request Password';
    requestButton.style.cssText = `
      width: 100%;
      padding: 14px 24px;
      background: transparent;
      color: var(--color-text-secondary, #6b6b6b);
      border: 2px solid var(--color-border, #e5e7eb);
      border-radius: 50px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s ease;
      white-space: nowrap;
    `;

    requestButton.addEventListener('mouseover', function() {
      this.style.borderColor = 'var(--color-text-secondary, #6b6b6b)';
    });

    requestButton.addEventListener('mouseout', function() {
      this.style.borderColor = 'var(--color-border, #e5e7eb)';
    });

    requestButton.addEventListener('click', function() {
      window.location.href = 'mailto:rickyliudesign@gmail.com?subject=Portfolio%20Password%20Request';
    });

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Enter';
    submitButton.style.cssText = `
      width: 100%;
      padding: 14px 24px;
      background: linear-gradient(180deg, #4a4a4a 0%, #1a1a1a 100%);
      color: #ffffff;
      border: none;
      border-radius: 50px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s ease;
      box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.25);
    `;

    submitButton.addEventListener('mouseover', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 8px 24px 0 rgba(0, 0, 0, 0.3)';
    });

    submitButton.addEventListener('mouseout', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 4px 14px 0 rgba(0, 0, 0, 0.25)';
    });

    function checkPassword() {
      const enteredPassword = input.value.toLowerCase().trim();
      const correctPass = correctPassword.toLowerCase();

      if (enteredPassword === correctPass) {
        // Store verification in session storage
        sessionStorage.setItem(sessionKey, 'true');

        // Navigate to page
        window.location.href = targetUrl;
      } else {
        errorMsg.textContent = 'Incorrect password. Please try again.';
        input.value = '';
        input.focus();

        // Shake animation
        modal.style.animation = 'shake 0.4s ease';
        setTimeout(() => {
          modal.style.animation = 'slideUp 0.3s ease';
        }, 400);
      }
    }

    submitButton.addEventListener('click', checkPassword);
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        checkPassword();
      }
    });

    // Close on overlay click
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        overlay.remove();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        overlay.remove();
      }
    });

    buttonContainer.appendChild(requestButton);
    buttonContainer.appendChild(submitButton);

    modal.appendChild(closeButton);
    modal.appendChild(title);
    modal.appendChild(description);
    modal.appendChild(input);
    modal.appendChild(errorMsg);
    modal.appendChild(buttonContainer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Add animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
      }
    `;
    document.head.appendChild(style);

    // Focus the input
    setTimeout(() => input.focus(), 100);
  }
})();
