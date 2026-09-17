/**
 * FARMS Floating In-Page Developer HUD
 * Live Viewport Telemetry & Viewport Lab Shortcut
 */

(function () {
  // Prevent injection if already inside the Viewport Lab iframe
  if (window.self !== window.top) return;

  function initDevHud() {
    // Breakpoint helper
    function getBreakpoint(w) {
      if (w < 480) return 'Mobile-S';
      if (w < 768) return 'Mobile';
      if (w <= 1024) return 'Tablet';
      if (w <= 1920) return 'Desktop';
      return 'Ultrawide';
    }

    // Aspect ratio approximation
    function getAspect(w, h) {
      function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
      const d = gcd(w, h);
      const rw = Math.round(w / d);
      const rh = Math.round(h / d);
      const val = w / h;
      if (Math.abs(val - 16 / 9) < 0.05) return '16:9';
      if (Math.abs(val - 9 / 16) < 0.05) return '9:16';
      if (Math.abs(val - 16 / 10) < 0.05) return '16:10';
      if (Math.abs(val - 4 / 3) < 0.05) return '4:3';
      if (Math.abs(val - 19.5 / 9) < 0.05) return '19.5:9';
      return `${rw}:${rh}`;
    }

    const hudWrap = document.createElement('div');
    hudWrap.className = 'farms-dev-hud';
    hudWrap.id = 'farmsDevHud';

    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';

    hudWrap.innerHTML = `
      <div class="farms-dev-panel hidden" id="farmsDevPanel">
        <div class="farms-dev-header">
          <div class="farms-dev-title">
            <span>⚙️</span>
            <span>FARMS DEV TOOLS</span>
          </div>
          <button class="farms-dev-close" id="farmsDevCloseBtn" title="Close Panel">✕</button>
        </div>

        <div class="farms-dev-metrics">
          <div class="farms-dev-metric-row">
            <span class="farms-dev-metric-label">Resolution:</span>
            <span class="farms-dev-metric-val" id="hudResText">-- × --</span>
          </div>
          <div class="farms-dev-metric-row">
            <span class="farms-dev-metric-label">Aspect Ratio:</span>
            <span class="farms-dev-metric-val" id="hudAspectText">--</span>
          </div>
          <div class="farms-dev-metric-row">
            <span class="farms-dev-metric-label">Breakpoint:</span>
            <span class="farms-dev-metric-val" id="hudBpText">--</span>
          </div>
          <div class="farms-dev-metric-row">
            <span class="farms-dev-metric-label">Device Pixel Ratio:</span>
            <span class="farms-dev-metric-val">${window.devicePixelRatio || 1}x</span>
          </div>
          <div class="farms-dev-metric-row">
            <span class="farms-dev-metric-label">Platform:</span>
            <span class="farms-dev-metric-val">${navigator.platform ? navigator.platform.split(' ')[0] : 'Web'}</span>
          </div>
        </div>

        <a href="dev-preview.html?page=${encodeURIComponent(currentPage)}" class="farms-dev-btn-launch" id="hudLaunchLabBtn" target="_blank">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
          <span>Open Viewport Lab</span>
        </a>

        <div class="farms-dev-hint">Press <kbd style="background:#1e293b; padding:2px 5px; border-radius:3px;">Ctrl+Shift+D</kbd> to toggle HUD</div>
      </div>

      <div class="farms-dev-pill" id="farmsDevPill" title="FARMS Viewport Telemetry (Click to inspect or launch simulator)">
        <span class="farms-dev-dot"></span>
        <span class="farms-dev-text" id="hudPillDimensions">-- × --</span>
        <span class="farms-dev-bp-chip" id="hudPillBreakpoint">--</span>
      </div>
    `;

    document.body.appendChild(hudWrap);

    const pill = document.getElementById('farmsDevPill');
    const panel = document.getElementById('farmsDevPanel');
    const closeBtn = document.getElementById('farmsDevCloseBtn');
    const pillDims = document.getElementById('hudPillDimensions');
    const pillBp = document.getElementById('hudPillBreakpoint');
    const hudResText = document.getElementById('hudResText');
    const hudAspectText = document.getElementById('hudAspectText');
    const hudBpText = document.getElementById('hudBpText');

    function updateMetrics() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const bp = getBreakpoint(w);
      const aspect = getAspect(w, h);

      if (pillDims) pillDims.textContent = `${w} × ${h}`;
      if (pillBp) pillBp.textContent = bp;
      if (hudResText) hudResText.textContent = `${w} × ${h} px`;
      if (hudAspectText) hudAspectText.textContent = aspect;
      if (hudBpText) hudBpText.textContent = bp;
    }

    pill?.addEventListener('click', (e) => {
      e.stopPropagation();
      panel?.classList.toggle('hidden');
    });

    closeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      panel?.classList.add('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!hudWrap.contains(e.target)) {
        panel?.classList.add('hidden');
      }
    });

    // Keyboard shortcut Ctrl+Shift+D or Alt+D
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey && e.shiftKey && e.code === 'KeyD') || (e.altKey && e.code === 'KeyD')) {
        e.preventDefault();
        panel?.classList.toggle('hidden');
      }
    });

    window.addEventListener('resize', updateMetrics);
    updateMetrics();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDevHud);
  } else {
    initDevHud();
  }
})();
