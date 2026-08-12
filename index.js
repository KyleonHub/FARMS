document.addEventListener('DOMContentLoaded', () => {
  // === 1. CARD FLIP & DYNAMIC HEIGHT LOGIC ===
  const card = document.getElementById('cardContainer');
  if (!card) return;

  const cardInner = card.querySelector('.card-inner');
  const frontFace = card.querySelector('.card-front');
  const backFace = card.querySelector('.card-back');
  const openBtn = document.getElementById('openAdminBtn');
  const closeBtn = document.getElementById('closeAdminBtn');

  const updateCardHeight = () => {
    if (card.classList.contains('flipped')) {
      cardInner.style.height = `${backFace.offsetHeight}px`;
    } else {
      cardInner.style.height = `${frontFace.offsetHeight}px`;
    }
  };

  updateCardHeight();

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

  window.addEventListener('resize', updateCardHeight);

  // === 2. PASSWORD VISIBILITY TOGGLE ===
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const eyeIcon = document.getElementById('eyeIcon');

  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');

      // Update Eye Icon Graphic (Open vs Hidden)
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

  // === 3. MOCK AUTHENTICATION WITH LOADING STATE ===
  const MOCK_USER = {
    email: 'admin1@gmail.com',
    password: 'password123'
  };

  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const messageBox = document.getElementById('loginMessage');
  const signInBtn = document.getElementById('signInBtn');
  const btnText = signInBtn.querySelector('.btn-text');
  const btnSpinner = signInBtn.querySelector('.btn-spinner');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const enteredEmail = usernameInput.value.trim();
      const enteredPassword = passwordInput.value.trim();

      // Clear alert messages and show spinner state
      messageBox.className = 'login-message';
      messageBox.textContent = '';
      signInBtn.disabled = true;
      btnText.textContent = 'Authenticating...';
      btnSpinner.classList.remove('hidden');

      // Simulate network request delay (800ms)
      setTimeout(() => {
        btnSpinner.classList.add('hidden');
        signInBtn.disabled = false;
        btnText.textContent = 'Sign In';

        if (enteredEmail === MOCK_USER.email && enteredPassword === MOCK_USER.password) {
          messageBox.classList.add('success');
          messageBox.textContent = 'Login successful! Redirecting...';
          signInBtn.disabled = true;

          updateCardHeight();

          setTimeout(() => {
            alert('Simulation: Logged in successfully!');
          }, 1000);

        } else {
          messageBox.classList.add('error');
          messageBox.textContent = 'Invalid email or password. Please try again.';
          updateCardHeight();
        }
      }, 800);
    });
  }
});