document.addEventListener('DOMContentLoaded', () => {
  // === 1. CARD FLIP & DYNAMIC HEIGHT LOGIC ===
  const card = document.getElementById('cardContainer');
  if (!card) return;

  const cardInner = card.querySelector('.card-inner');
  const frontFace = card.querySelector('.card-front');
  const backFace = card.querySelector('.card-back');
  const openBtn = document.getElementById('openAdminBtn');
  const closeBtn = document.getElementById('closeAdminBtn');
  const forgotPwdBtn = document.getElementById('forgotPwdBtn');

  const updateCardHeight = () => {
    if (card.classList.contains('flipped')) {
      cardInner.style.height = `${backFace.offsetHeight}px`;
    } else {
      cardInner.style.height = `${frontFace.offsetHeight}px`;
    }
  };

  // Initial height calculation
  setTimeout(updateCardHeight, 50);

  if (openBtn) {
    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      card.classList.add('flipped');
      updateCardHeight();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      card.classList.remove('flipped');
      updateCardHeight();
    });
  }

  if (forgotPwdBtn) {
    forgotPwdBtn.addEventListener('click', (e) => {
      e.preventDefault();
      card.classList.add('flipped');
      updateCardHeight();
    });
  }

  window.addEventListener('resize', updateCardHeight);

  // === 2. PASSWORD VISIBILITY TOGGLE ===
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const eyeIcon = document.getElementById('eyeIcon');

  if (togglePasswordBtn && passwordInput && eyeIcon) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');

      if (isPassword) {
        eyeIcon.innerHTML = `
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        `;
      } else {
        eyeIcon.innerHTML = `
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        `;
      }
    });
  }

  // === 3. AUTHENTICATION LOGIC ===
  const VALID_USERS = [
    { email: 'admin@farms.edu', password: 'admin123', name: 'System Administrator', role: 'Super Admin' },
    { email: 'admin1@gmail.com', password: 'password123', name: 'Admin Jeibog', role: 'Facility Admin' },
    { email: 'faculty@farms.edu', password: 'faculty123', name: 'Prof. Santos', role: 'Faculty Member' }
  ];

  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const messageBox = document.getElementById('loginMessage');
  const signInBtn = document.getElementById('signInBtn');
  const btnText = signInBtn ? signInBtn.querySelector('.btn-text') : null;
  const btnSpinner = signInBtn ? signInBtn.querySelector('.btn-spinner') : null;

  // Restore saved email if rememberMe was used
  const savedEmail = localStorage.getItem('farms_remembered_email');
  if (savedEmail && usernameInput) {
    usernameInput.value = savedEmail;
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const enteredEmail = usernameInput.value.trim().toLowerCase();
      const enteredPassword = passwordInput.value.trim();
      const rememberMe = document.getElementById('rememberMe')?.checked;

      // Reset alert and show loading spinner
      messageBox.className = 'login-message';
      messageBox.textContent = '';
      if (signInBtn) signInBtn.disabled = true;
      if (btnText) btnText.textContent = 'Authenticating...';
      if (btnSpinner) btnSpinner.classList.remove('hidden');

      setTimeout(() => {
        if (btnSpinner) btnSpinner.classList.add('hidden');
        if (signInBtn) signInBtn.disabled = false;
        if (btnText) btnText.textContent = 'Sign In to Dashboard';

        // Check against users or allow any standard email/pass for smooth demo
        const matchedUser = VALID_USERS.find(
          u => u.email.toLowerCase() === enteredEmail && u.password === enteredPassword
        ) || (enteredEmail.length > 3 && enteredPassword.length >= 4 ? {
          email: enteredEmail,
          name: enteredEmail.split('@')[0].toUpperCase(),
          role: 'System Administrator'
        } : null);

        if (matchedUser) {
          messageBox.classList.add('success');
          messageBox.textContent = `Welcome, ${matchedUser.name}! Redirecting...`;
          if (signInBtn) signInBtn.disabled = true;

          // Store session info in localStorage
          localStorage.setItem('farms_session_user', JSON.stringify(matchedUser));
          if (rememberMe) {
            localStorage.setItem('farms_remembered_email', enteredEmail);
          } else {
            localStorage.removeItem('farms_remembered_email');
          }

          updateCardHeight();

          // Redirect to dashboard
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 600);

        } else {
          messageBox.classList.add('error');
          messageBox.textContent = 'Invalid credentials. Use demo: admin@farms.edu / admin123';
          updateCardHeight();
        }
      }, 500);
    });
  }
});
