const contactForm = document.querySelector('#contact-form');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = String(formData.get('name') || '');
  const email = String(formData.get('email') || '');
  const message = String(formData.get('message') || '');
  const subject = encodeURIComponent(`Message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  document.querySelector('#contact-status').textContent = 'Your email app should open with a draft. If it does not, use the email address above. Your message remains here.';
  window.location.href = `mailto:rickyliudesign@gmail.com?subject=${subject}&body=${body}`;
});
