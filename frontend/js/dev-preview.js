/**
 * FARMS Viewport Lab & Multi-Platform Simulator Engine
 * Real-time aspect ratio, resolution, and hardware bezel testing
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. DEVICE PRESETS CATALOG
  const DEVICE_CATALOG = {
    // Phones
    'iphone-15-pro': { name: 'iPhone 15 Pro', w: 393, h: 852, category: 'phone', frame: 'frame-phone', ratio: '19.5:9' },
    'iphone-se': { name: 'iPhone SE (Gen 3)', w: 375, h: 667, category: 'phone', frame: 'frame-phone', ratio: '9:16' },
    'pixel-8': { name: 'Google Pixel 8', w: 412, h: 915, category: 'phone', frame: 'frame-phone', ratio: '20:9' },
    'galaxy-s24': { name: 'Samsung Galaxy S24', w: 412, h: 920, category: 'phone', frame: 'frame-phone', ratio: '20:9' },
    'compact-phone': { name: 'Compact Phone', w: 360, h: 740, category: 'phone', frame: 'frame-phone', ratio: '18.5:9' },

    // Tablets
    'ipad-mini': { name: 'iPad Mini (Portrait)', w: 768, h: 1024, category: 'tablet', frame: 'frame-tablet', ratio: '3:4' },
    'ipad-air-port': { name: 'iPad Air (Portrait)', w: 820, h: 1180, category: 'tablet', frame: 'frame-tablet', ratio: '4:3' },
    'ipad-air-land': { name: 'iPad Air (Landscape)', w: 1180, h: 820, category: 'tablet', frame: 'frame-tablet', ratio: '16:11' },
    'ipad-pro-12': { name: 'iPad Pro 12.9"', w: 1024, h: 1366, category: 'tablet', frame: 'frame-tablet', ratio: '3:4' },
    'surface-pro': { name: 'Microsoft Surface Pro', w: 912, h: 1368, category: 'tablet', frame: 'frame-tablet', ratio: '2:3' },

    // Laptops
    'macbook-air': { name: 'MacBook Air 13"', w: 1280, h: 800, category: 'laptop', frame: 'frame-laptop', ratio: '16:10' },
    'laptop-1366': { name: 'Standard HD Laptop', w: 1366, h: 768, category: 'laptop', frame: 'frame-laptop', ratio: '16:9' },
    'laptop-1440': { name: 'Pro Laptop 1440', w: 1440, h: 900, category: 'laptop', frame: 'frame-laptop', ratio: '16:10' },

    // Desktops & Displays
    'desktop-1080': { name: 'Desktop Full HD', w: 1920, h: 1080, category: 'desktop', frame: 'frame-none', ratio: '16:9' },
    'desktop-2k': { name: 'Desktop WQHD 2K', w: 2560, h: 1440, category: 'desktop', frame: 'frame-none', ratio: '16:9' },
    'ultrawide': { name: 'Ultrawide 21:9', w: 2560, h: 1080, category: 'desktop', frame: 'frame-none', ratio: '21:9' }
  };

  // State
  let currentKey = 'iphone-15-pro';
  let currentW = 393;
  let currentH = 852;
  let currentZoom = 'fit'; // 'fit', 1, 0.75, 0.5
  let showHardwareFrame = true;
  let isLandscape = false;
  let isDimensionLinked = false; // Default: Separate X and Y!
  let currentPage = 'dashboard.html';

  // DOM Elements
  const deviceSelect = document.getElementById('devicePresetSelect');
  const aspectRatioSelect = document.getElementById('aspectRatioSelect');
  const pageSelect = document.getElementById('pageSelect');
  const deviceContainer = document.getElementById('deviceContainer');
  const scaleWrapper = document.getElementById('scaleWrapper');
  const canvasStage = document.getElementById('canvasStage');
  const simulatorIframe = document.getElementById('simulatorIframe');
  const customWInput = document.getElementById('customW');
  const customHInput = document.getElementById('customH');
  const btnLinkRatio = document.getElementById('btnLinkRatio');
  const rotateBtn = document.getElementById('btnRotateOrientation');
  const frameToggleBtn = document.getElementById('btnToggleBezel');
  const reloadIframeBtn = document.getElementById('btnReloadIframe');
  const openExternalBtn = document.getElementById('btnOpenExternal');
  const zoomSelect = document.getElementById('zoomSelect');

  // Telemetry Elements
  const footerDimensions = document.getElementById('footerDimensions');
  const footerAspectRatio = document.getElementById('footerAspectRatio');
  const footerBreakpoint = document.getElementById('footerBreakpoint');
  const footerScale = document.getElementById('footerScale');
  const deviceDimTag = document.getElementById('deviceDimTag');

  // Category buttons
  const catBtns = document.querySelectorAll('[data-cat]');

  // 2. INITIALIZE URL PARAMETERS
  function initFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('page')) currentPage = params.get('page');
    if (params.has('device') && DEVICE_CATALOG[params.get('device')]) {
      currentKey = params.get('device');
      currentW = DEVICE_CATALOG[currentKey].w;
      currentH = DEVICE_CATALOG[currentKey].h;
    }
    if (params.has('w')) currentW = parseInt(params.get('w'), 10) || currentW;
    if (params.has('h')) currentH = parseInt(params.get('h'), 10) || currentH;
    if (params.has('zoom')) currentZoom = params.get('zoom');
    if (params.has('bezel')) showHardwareFrame = params.get('bezel') === '1';

    pageSelect.value = currentPage;
    deviceSelect.value = currentKey;
  }

  // 3. GREATEST COMMON DIVISOR FOR EXACT ASPECT RATIO
  function getAspectRatioString(w, h) {
    function gcd(a, b) {
      return b === 0 ? a : gcd(b, a % b);
    }
    const d = gcd(w, h);
    const rw = w / d;
    const rh = h / d;

    // Approximate common ratios
    const val = w / h;
    if (Math.abs(val - 16 / 9) < 0.03) return '16:9 (Widescreen)';
    if (Math.abs(val - 9 / 16) < 0.03) return '9:16 (Vertical)';
    if (Math.abs(val - 16 / 10) < 0.03) return '16:10 (Laptop)';
    if (Math.abs(val - 10 / 16) < 0.03) return '10:16 (Tall)';
    if (Math.abs(val - 4 / 3) < 0.03) return '4:3 (Classic Tablet)';
    if (Math.abs(val - 3 / 4) < 0.03) return '3:4 (Portrait Tablet)';
    if (Math.abs(val - 19.5 / 9) < 0.05) return '19.5:9 (Modern Phone)';
    if (Math.abs(val - 9 / 19.5) < 0.05) return '9:19.5 (Modern Phone)';
    if (Math.abs(val - 21 / 9) < 0.05) return '21:9 (Ultrawide)';

    return `${rw}:${rh}`;
  }

  // 3b. FIND MATCHING RATIO PRESET OPTION
  function findMatchingRatioOption(w, h) {
    const val = w / h;
    const standardRatios = [
      { key: '16:9', val: 16 / 9 },
      { key: '16:10', val: 16 / 10 },
      { key: '21:9', val: 21 / 9 },
      { key: '4:3', val: 4 / 3 },
      { key: '3:2', val: 3 / 2 },
      { key: '9:16', val: 9 / 16 },
      { key: '9:19.5', val: 9 / 19.5 },
      { key: '9:20', val: 9 / 20 },
      { key: '3:4', val: 3 / 4 },
      { key: '2:3', val: 2 / 3 },
      { key: '1:1', val: 1.0 }
    ];
    for (const r of standardRatios) {
      if (Math.abs(val - r.val) < 0.035) {
        return r.key;
      }
    }
    return 'auto';
  }

  // 4. BREAKPOINT CLASSIFICATION
  function getBreakpointInfo(w) {
    if (w < 480) return { label: 'Mobile Compact (<480px)', class: 'mobile' };
    if (w < 768) return { label: 'Mobile Standard (<768px)', class: 'mobile' };
    if (w <= 1024) return { label: 'Tablet / Surface (768–1024px)', class: 'tablet' };
    if (w <= 1920) return { label: 'Desktop Standard (1025–1920px)', class: 'desktop' };
    return { label: 'Ultrawide Display (>1920px)', class: 'ultrawide' };
  }

  // 5. RENDER VIEWPORT & SCALE
  function applyViewport() {
    customWInput.value = currentW;
    customHInput.value = currentH;

    // Apply dimensions to device container
    deviceContainer.style.width = `${currentW}px`;
    deviceContainer.style.height = `${currentH}px`;

    // Framing Bezel
    deviceContainer.className = 'device-container';
    const preset = DEVICE_CATALOG[currentKey];
    if (showHardwareFrame && preset && preset.frame) {
      deviceContainer.classList.add(preset.frame);
    } else {
      deviceContainer.classList.add('frame-none');
    }

    // Dimension Tag on Container
    if (deviceDimTag) {
      deviceDimTag.textContent = `${currentW} × ${currentH} px`;
    }

    // Calculate Zoom & Fit
    calculateScale();

    // Update Telemetry
    updateTelemetry();

    // Update URL query params without reloading
    const url = new URL(window.location);
    url.searchParams.set('page', currentPage);
    url.searchParams.set('device', currentKey);
    url.searchParams.set('w', currentW);
    url.searchParams.set('h', currentH);
    window.history.replaceState({}, '', url);
  }

  // 6. SCALE CALCULATION
  function calculateScale() {
    let scale = 1;
    if (currentZoom === 'fit') {
      const availW = canvasStage.clientWidth - 80;
      const availH = canvasStage.clientHeight - 80;

      // Include bezel padding allowance in fit calculation
      const bezelPadding = showHardwareFrame ? 60 : 20;
      const totalW = currentW + bezelPadding;
      const totalH = currentH + bezelPadding;

      const scaleW = availW / totalW;
      const scaleH = availH / totalH;
      scale = Math.min(scaleW, scaleH, 1);
      // Don't let it shrink to microscopic
      scale = Math.max(scale, 0.25);
    } else {
      scale = parseFloat(currentZoom) || 1;
    }

    scaleWrapper.style.transform = `scale(${scale})`;
    if (footerScale) {
      footerScale.textContent = `${Math.round(scale * 100)}%`;
    }
  }

  // 7. TELEMETRY DISPLAY
  function updateTelemetry() {
    if (footerDimensions) {
      footerDimensions.innerHTML = `X: <strong style="color:#ffffff;">${currentW}px</strong> × Y: <strong style="color:#ffffff;">${currentH}px</strong>`;
    }

    const ratioStr = getAspectRatioString(currentW, currentH);
    if (footerAspectRatio) {
      footerAspectRatio.textContent = `Aspect: ${ratioStr}`;
    }

    const bp = getBreakpointInfo(currentW);
    if (footerBreakpoint) {
      footerBreakpoint.textContent = bp.label;
      footerBreakpoint.className = `badge-tag ${bp.class}`;
    }

    // Sync active category button
    const preset = DEVICE_CATALOG[currentKey];
    catBtns.forEach(btn => {
      btn.classList.toggle('active', preset && btn.getAttribute('data-cat') === preset.category);
    });

    if (frameToggleBtn) {
      frameToggleBtn.classList.toggle('active', showHardwareFrame);
    }
  }

  // 8. DEVICE SELECTION
  function selectDevice(key) {
    if (DEVICE_CATALOG[key]) {
      currentKey = key;
      const d = DEVICE_CATALOG[key];
      currentW = d.w;
      currentH = d.h;
      deviceSelect.value = key;
      if (aspectRatioSelect) {
        aspectRatioSelect.value = findMatchingRatioOption(currentW, currentH);
      }
      applyViewport();
    }
  }

  // 9. EVENT LISTENERS
  deviceSelect.addEventListener('change', (e) => {
    selectDevice(e.target.value);
  });

  // Aspect Ratio Selector Event
  if (aspectRatioSelect) {
    aspectRatioSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'auto') return;

      const parts = val.split(':').map(Number);
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        const targetRatio = parts[0] / parts[1];

        if (targetRatio >= 1) {
          // Landscape or Square target
          if (currentW < currentH) {
            // Flip base dimension to landscape orientation
            const base = Math.max(currentW, currentH);
            currentW = base;
          }
          currentH = Math.round(currentW / targetRatio);
        } else {
          // Portrait target
          if (currentW > currentH) {
            // Flip base dimension to portrait orientation
            const base = Math.min(currentW, currentH);
            currentW = base;
          }
          currentH = Math.round(currentW / targetRatio);
        }

        // Keep within safe preview bounds
        currentW = Math.max(280, Math.min(currentW, 3840));
        currentH = Math.max(280, Math.min(currentH, 3840));

        // Check if matches an existing preset
        const matchedPreset = Object.keys(DEVICE_CATALOG).find(k => 
          DEVICE_CATALOG[k].w === currentW && DEVICE_CATALOG[k].h === currentH
        );
        if (matchedPreset) {
          currentKey = matchedPreset;
          deviceSelect.value = matchedPreset;
        } else {
          currentKey = 'custom';
          deviceSelect.value = 'custom';
        }

        applyViewport();
      }
    });
  }

  pageSelect.addEventListener('change', (e) => {
    currentPage = e.target.value;
    simulatorIframe.src = currentPage;
    applyViewport();
  });

  // Category quick filter clicks
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-cat');
      // Find first preset in this category
      const foundKey = Object.keys(DEVICE_CATALOG).find(k => DEVICE_CATALOG[k].category === cat);
      if (foundKey) {
        selectDevice(foundKey);
      }
    });
  });

  // Link / Unlink Dimension Ratio Toggle
  if (btnLinkRatio) {
    btnLinkRatio.addEventListener('click', () => {
      isDimensionLinked = !isDimensionLinked;
      btnLinkRatio.classList.toggle('is-linked', isDimensionLinked);
      btnLinkRatio.title = isDimensionLinked 
        ? 'Aspect Locked: X and Y are Linked (Click to separate X & Y)' 
        : 'Separate X & Y: Dimensions are Independent (Click to link)';
      const iconUnlinked = btnLinkRatio.querySelector('.icon-unlinked');
      const iconLinked = btnLinkRatio.querySelector('.icon-linked');
      if (iconUnlinked) iconUnlinked.style.display = isDimensionLinked ? 'none' : 'block';
      if (iconLinked) iconLinked.style.display = isDimensionLinked ? 'block' : 'none';
    });
  }

  // Separate X and Y Inputs
  function onCustomWChange() {
    const newW = parseInt(customWInput.value, 10);
    if (newW >= 240 && newW <= 4000) {
      currentW = newW;
      if (isDimensionLinked && aspectRatioSelect && aspectRatioSelect.value !== 'auto') {
        const parts = aspectRatioSelect.value.split(':').map(Number);
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          currentH = Math.round(newW / (parts[0] / parts[1]));
        }
      } else if (aspectRatioSelect) {
        aspectRatioSelect.value = findMatchingRatioOption(currentW, currentH);
      }
      currentKey = 'custom';
      deviceSelect.value = 'custom';
      applyViewport();
    }
  }

  function onCustomHChange() {
    const newH = parseInt(customHInput.value, 10);
    if (newH >= 240 && newH <= 4000) {
      currentH = newH;
      if (isDimensionLinked && aspectRatioSelect && aspectRatioSelect.value !== 'auto') {
        const parts = aspectRatioSelect.value.split(':').map(Number);
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          currentW = Math.round(newH * (parts[0] / parts[1]));
        }
      } else if (aspectRatioSelect) {
        aspectRatioSelect.value = findMatchingRatioOption(currentW, currentH);
      }
      currentKey = 'custom';
      deviceSelect.value = 'custom';
      applyViewport();
    }
  }

  customWInput.addEventListener('change', onCustomWChange);
  customHInput.addEventListener('change', onCustomHChange);

  // Rotate Orientation
  rotateBtn.addEventListener('click', () => {
    const temp = currentW;
    currentW = currentH;
    currentH = temp;
    isLandscape = !isLandscape;
    rotateBtn.classList.toggle('active', isLandscape);

    // Invert aspect ratio selection if an explicit ratio is chosen
    if (aspectRatioSelect && aspectRatioSelect.value !== 'auto') {
      const parts = aspectRatioSelect.value.split(':');
      if (parts.length === 2) {
        const inverted = `${parts[1]}:${parts[0]}`;
        const hasOption = Array.from(aspectRatioSelect.options).some(o => o.value === inverted);
        if (hasOption) {
          aspectRatioSelect.value = inverted;
        } else {
          aspectRatioSelect.value = findMatchingRatioOption(currentW, currentH);
        }
      }
    } else if (aspectRatioSelect) {
      aspectRatioSelect.value = findMatchingRatioOption(currentW, currentH);
    }

    applyViewport();
  });

  // Hardware Frame Toggle
  frameToggleBtn.addEventListener('click', () => {
    showHardwareFrame = !showHardwareFrame;
    applyViewport();
  });

  // Zoom Selector
  zoomSelect.addEventListener('change', (e) => {
    currentZoom = e.target.value;
    calculateScale();
  });

  // Zoom Buttons in stage
  document.getElementById('btnZoomIn')?.addEventListener('click', () => {
    let current = currentZoom === 'fit' ? 1 : parseFloat(currentZoom);
    current = Math.min(current + 0.15, 2.0);
    currentZoom = current.toFixed(2);
    zoomSelect.value = 'custom';
    calculateScale();
  });

  document.getElementById('btnZoomOut')?.addEventListener('click', () => {
    let current = currentZoom === 'fit' ? 1 : parseFloat(currentZoom);
    current = Math.max(current - 0.15, 0.3);
    currentZoom = current.toFixed(2);
    zoomSelect.value = 'custom';
    calculateScale();
  });

  document.getElementById('btnZoomFit')?.addEventListener('click', () => {
    currentZoom = 'fit';
    zoomSelect.value = 'fit';
    calculateScale();
  });

  // Reload iframe
  reloadIframeBtn.addEventListener('click', () => {
    reloadIframeBtn.style.transform = 'rotate(180deg)';
    setTimeout(() => reloadIframeBtn.style.transform = 'none', 300);
    simulatorIframe.src = `${currentPage}?_t=${Date.now()}`;
  });

  // Open external
  openExternalBtn.addEventListener('click', () => {
    window.open(currentPage, '_blank');
  });

  // Recalculate scale on window resize
  window.addEventListener('resize', () => {
    if (currentZoom === 'fit') calculateScale();
  });

  // 9B. INTERACTIVE DRAG RESIZE ENGINE
  function initDragResize() {
    const resizeHandles = document.querySelectorAll('.resize-handle');
    const resizeBadge = document.getElementById('resizeBadge');
    if (!resizeHandles.length) return;

    let isDragging = false;
    let activeHandle = null;
    let startX = 0;
    let startY = 0;
    let startW = 0;
    let startH = 0;
    let currentScale = 1;

    function onStartDrag(e) {
      e.preventDefault();
      e.stopPropagation();

      isDragging = true;
      activeHandle = e.currentTarget.getAttribute('data-handle');
      startX = e.clientX;
      startY = e.clientY;
      startW = currentW;
      startH = currentH;

      // Determine effective scale from scaleWrapper transform
      const tr = window.getComputedStyle(scaleWrapper).transform;
      if (tr && tr !== 'none') {
        const match = tr.match(/matrix\(([^,]+)/);
        if (match && match[1]) currentScale = parseFloat(match[1]) || 1;
      } else {
        currentScale = 1;
      }

      deviceContainer.classList.add('is-resizing');
      document.body.style.cursor = window.getComputedStyle(e.currentTarget).cursor;

      if (resizeBadge) {
        const ratioStr = getAspectRatioString(currentW, currentH);
        resizeBadge.textContent = `${currentW} × ${currentH} px · ${ratioStr}`;
      }

      window.addEventListener('pointermove', onPointerMove, { passive: false });
      window.addEventListener('mousemove', onPointerMove, { passive: false });
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('mouseup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    }

    resizeHandles.forEach(handle => {
      handle.addEventListener('pointerdown', onStartDrag);
      handle.addEventListener('mousedown', onStartDrag);
    });

    function onPointerMove(e) {
      if (!isDragging || !activeHandle) return;
      e.preventDefault();

      const dx = (e.clientX - startX) / currentScale;
      const dy = (e.clientY - startY) / currentScale;

      let newW = startW;
      let newH = startH;

      // Handle horizontal delta
      if (activeHandle === 'e' || activeHandle === 'se' || activeHandle === 'ne') {
        newW = startW + Math.round(dx * 2);
      } else if (activeHandle === 'w' || activeHandle === 'sw' || activeHandle === 'nw') {
        newW = startW - Math.round(dx * 2);
      }

      // Handle vertical delta
      if (activeHandle === 's' || activeHandle === 'se' || activeHandle === 'sw') {
        newH = startH + Math.round(dy * 2);
      } else if (activeHandle === 'n' || activeHandle === 'ne' || activeHandle === 'nw') {
        newH = startH - Math.round(dy * 2);
      }

      // Respect active aspect ratio ONLY if dimensions are explicitly linked or if Shift key is held
      const ratioVal = aspectRatioSelect ? aspectRatioSelect.value : 'auto';
      let targetRatio = null;

      if (isDimensionLinked && ratioVal !== 'auto') {
        const parts = ratioVal.split(':').map(Number);
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          targetRatio = parts[0] / parts[1];
        }
      } else if (e.shiftKey) {
        targetRatio = startW / startH;
      }

      if (targetRatio) {
        if (activeHandle === 'e' || activeHandle === 'w') {
          newH = Math.round(newW / targetRatio);
        } else if (activeHandle === 'n' || activeHandle === 's') {
          newW = Math.round(newH * targetRatio);
        } else {
          // Corner handle with ratio lock: take dominant axis
          if (Math.abs(dx) >= Math.abs(dy)) {
            newH = Math.round(newW / targetRatio);
          } else {
            newW = Math.round(newH * targetRatio);
          }
        }
      }

      // Clamp dimensions within safe boundaries
      newW = Math.max(280, Math.min(newW, 4000));
      newH = Math.max(280, Math.min(newH, 4000));

      currentW = newW;
      currentH = newH;
      currentKey = 'custom';
      deviceSelect.value = 'custom';

      if (aspectRatioSelect && ratioVal === 'auto') {
        aspectRatioSelect.value = findMatchingRatioOption(currentW, currentH);
      }

      // Apply dimensions immediately without CSS transition lag
      customWInput.value = currentW;
      customHInput.value = currentH;
      deviceContainer.style.width = `${currentW}px`;
      deviceContainer.style.height = `${currentH}px`;

      if (deviceDimTag) {
        deviceDimTag.textContent = `X: ${currentW} × Y: ${currentH} px`;
      }
      if (resizeBadge) {
        const ratioStr = getAspectRatioString(currentW, currentH);
        resizeBadge.textContent = `X: ${currentW}px · Y: ${currentH}px · ${ratioStr}`;
      }

      updateTelemetry();
    }

    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      activeHandle = null;

      deviceContainer.classList.remove('is-resizing');
      document.body.style.cursor = '';

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      // Re-apply full viewport & recalculate scale if in 'fit' mode
      applyViewport();
    }
  }

  // 9C. SCRUBBABLE X AND Y AXIS LABELS
  function initScrubbableInputs() {
    const labelX = document.getElementById('labelScrubX');
    const labelY = document.getElementById('labelScrubY');

    function setupScrub(label, isX) {
      if (!label) return;
      label.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const startCoord = e.clientX;
        const startVal = isX ? currentW : currentH;
        label.classList.add('is-scrubbing');
        document.body.style.cursor = 'ew-resize';

        function onScrubMove(moveEv) {
          moveEv.preventDefault();
          const delta = moveEv.clientX - startCoord;
          const newVal = Math.max(280, Math.min(4000, startVal + delta));

          if (isX) {
            currentW = newVal;
            if (isDimensionLinked && aspectRatioSelect && aspectRatioSelect.value !== 'auto') {
              const parts = aspectRatioSelect.value.split(':').map(Number);
              if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                currentH = Math.round(newVal / (parts[0] / parts[1]));
              }
            } else if (aspectRatioSelect) {
              aspectRatioSelect.value = findMatchingRatioOption(currentW, currentH);
            }
          } else {
            currentH = newVal;
            if (isDimensionLinked && aspectRatioSelect && aspectRatioSelect.value !== 'auto') {
              const parts = aspectRatioSelect.value.split(':').map(Number);
              if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                currentW = Math.round(newVal * (parts[0] / parts[1]));
              }
            } else if (aspectRatioSelect) {
              aspectRatioSelect.value = findMatchingRatioOption(currentW, currentH);
            }
          }

          currentKey = 'custom';
          deviceSelect.value = 'custom';
          applyViewport();
        }

        function onScrubEnd() {
          label.classList.remove('is-scrubbing');
          document.body.style.cursor = '';
          window.removeEventListener('pointermove', onScrubMove);
          window.removeEventListener('pointerup', onScrubEnd);
          window.removeEventListener('pointercancel', onScrubEnd);
        }

        window.addEventListener('pointermove', onScrubMove);
        window.addEventListener('pointerup', onScrubEnd);
        window.addEventListener('pointercancel', onScrubEnd);
      });
    }

    setupScrub(labelX, true);
    setupScrub(labelY, false);
  }

  // 10. BOOTSTRAP
  initFromUrl();
  if (aspectRatioSelect) {
    aspectRatioSelect.value = findMatchingRatioOption(currentW, currentH);
  }
  simulatorIframe.src = currentPage;
  applyViewport();
  initDragResize();
  initScrubbableInputs();

});
