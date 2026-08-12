document.addEventListener('DOMContentLoaded', () => {
  const card = document.getElementById('cardContainer');
  if (!card) return;

  const cardInner = card.querySelector('.card-inner');
  const frontFace = card.querySelector('.card-front');
  const backFace = card.querySelector('.card-back');
  const openBtn = document.getElementById('openAdminBtn');
  const closeBtn = document.getElementById('closeAdminBtn');

  // ==========================================
  // 1. DYNAMIC CARD HEIGHT CALCULATION
  // ==========================================
  const updateCardHeight = () => {
    if (card.classList.contains('flipped')) {
      cardInner.style.height = `${backFace.offsetHeight}px`;
    } else {
      cardInner.style.height = `${frontFace.offsetHeight}px`;
    }
  };

  // Set initial height on page load
  updateCardHeight();

  // Flip to Contact Admin
  if (openBtn) {
    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      card.classList.add('flipped');
      updateCardHeight();
    });
  }

  // Flip back to Login
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      card.classList.remove('flipped');
      updateCardHeight();
    });
  }

  window.addEventListener('resize', updateCardHeight);

  // ==========================================
  // 2. MOCK AUTHENTICATION LOGIC
  // ==========================================
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const authMessage = document.getElementById('authMessage');
  const loginBtn = document.getElementById('loginBtn');

  // Mock Credentials
  const MOCK_USER = 'admin1@gmail.com';
  const MOCK_PASS = 'password123';

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const enteredUser = usernameInput.value.trim();
      const enteredPass = passwordInput.value;

      // Show loading state on button
      loginBtn.disabled = true;
      loginBtn.textContent = 'Authenticating...';
      authMessage.className = 'auth-message';
      authMessage.textContent = '';

      setTimeout(() => {
        if (enteredUser === MOCK_USER && enteredPass === MOCK_PASS) {
          // Success State
          authMessage.className = 'auth-message success';
          authMessage.textContent = 'Login successful! Redirecting...';
          loginBtn.textContent = 'Success!';
          
          // Simulate redirection after 1.5 seconds
          setTimeout(() => {
            alert('Welcome back, Admin! (Redirecting to Dashboard...)');
            // window.location.href = 'dashboard.html'; // Replace with actual route later
          }, 1200);

        } else {
          // Failure State
          authMessage.className = 'auth-message error';
          authMessage.textContent = 'Invalid email or password. Try again.';
          loginBtn.disabled = false;
          loginBtn.textContent = 'Sign In';
          
          // Trigger dynamic height recalculation to fit the error message
          updateCardHeight();
        }
      }, 800); // 800ms mock network delay
    });
  }
});