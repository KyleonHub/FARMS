/**
 * FARMS – Faculty Workstation Logic (Maximalist Mobile-First Build)
 * Views: Room Status | Request Access | Booking Logs | Edit Profile
 */
document.addEventListener('DOMContentLoaded', () => {

  // ────────────────────────────────────────────────
  // 1. DATA
  // ────────────────────────────────────────────────
  const DEFAULT_PROFILE = {
    fullName: 'Prof. Maria Santos',
    facultyId: 'BSU-FAC-2024-881',
    department: 'College of Information and Communications Technology',
    title: 'Associate Professor III',
    email: 'maria.santos@bulsu.edu.ph',
    phone: '+63 917 882 4591',
    officeHours: 'Mon/Wed 1:00 PM - 4:00 PM (Faculty Hall Rm 204)'
  };

  const DEFAULT_LOGS = [];

  let facultyProfile = JSON.parse(localStorage.getItem('farms_faculty_profile_v6')) || DEFAULT_PROFILE;
  let bookingLogs    = JSON.parse(localStorage.getItem('farms_faculty_bookings_v6')) || DEFAULT_LOGS;
  let ROOM_DATA      = [
    { bldg: 'Pancho Building', roomCode: 'PANCHO 101', room: '101', floor: 1, status: 'vacant', occupant: 'Unassigned', schedule: 'Open', capacity: 45 },
    { bldg: 'Pancho Building', roomCode: 'PANCHO 103', room: '103', floor: 1, status: 'vacant', occupant: 'Unassigned', schedule: 'Open', capacity: 45 },
    { bldg: 'Pancho Building', roomCode: 'PANCHO 105', room: '105', floor: 1, status: 'vacant', occupant: 'Unassigned', schedule: 'Open', capacity: 45 },
    { bldg: 'Pancho Building', roomCode: 'PANCHO SCILAB', room: 'Science Laboratory', floor: 1, status: 'vacant', occupant: 'Unassigned', schedule: 'Open', capacity: 40 },
    { bldg: 'Pancho Building', roomCode: 'PANCHO LEC', room: 'Lecture Room', floor: 1, status: 'vacant', occupant: 'Unassigned', schedule: 'Open', capacity: 60 },
    { bldg: 'Pancho Building', roomCode: 'PANCHO MULTIMEDIA', room: 'Multimedia Room', floor: 1, status: 'vacant', occupant: 'Unassigned', schedule: 'Open', capacity: 50 },
    { bldg: 'CBA Building',    roomCode: 'CBA 101', room: 'CBA 101', floor: 1, status: 'vacant', occupant: 'Unassigned', schedule: 'Open', capacity: 45 },
    { bldg: 'CBA Building',    roomCode: 'CBA 102', room: 'CBA 102', floor: 1, status: 'vacant', occupant: 'Unassigned', schedule: 'Open', capacity: 50 },
    { bldg: 'CBA Building',    roomCode: 'CBA 103', room: 'CBA 103', floor: 1, status: 'vacant', occupant: 'Unassigned', schedule: 'Open', capacity: 45 },
    { bldg: 'CBA Building',    roomCode: 'CBA 202', room: 'CBA 202', floor: 2, status: 'vacant', occupant: 'Unassigned', schedule: 'Open', capacity: 45 },
    { bldg: 'Hangar',          roomCode: 'H 001', room: 'Hangar 001', floor: 1, status: 'vacant', occupant: 'Unassigned', schedule: 'Open', capacity: 35 },
    { bldg: 'Hangar',          roomCode: 'H 002', room: 'Hangar 002', floor: 1, status: 'vacant', occupant: 'Unassigned', schedule: 'Open', capacity: 35 },
    { bldg: 'Hangar',          roomCode: 'H 003', room: 'Hangar 003', floor: 1, status: 'vacant', occupant: 'Unassigned', schedule: 'Open', capacity: 35 },
    { bldg: 'Hangar',          roomCode: 'H 004', room: 'Hangar 004', floor: 1, status: 'vacant', occupant: 'Unassigned', schedule: 'Open', capacity: 35 },
    { bldg: 'Hangar',          roomCode: 'H 005', room: 'Hangar 005', floor: 1, status: 'vacant', occupant: 'Unassigned', schedule: 'Open', capacity: 35 },
    { bldg: 'Hangar',          roomCode: 'H 006', room: 'Hangar 006', floor: 1, status: 'vacant', occupant: 'Unassigned', schedule: 'Open', capacity: 35 }
  ];

  // ────────────────────────────────────────────────
  // 2. THEME
  // ────────────────────────────────────────────────
  const savedTheme = localStorage.getItem('farms-theme') ||
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('farms-theme', theme);
    const icon = document.getElementById('facThemeIcon');
    const label = document.getElementById('facThemeLabel');
    if (icon) {
      icon.innerHTML = theme === 'dark' 
        ? `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
        : `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
    }
    if (label) label.textContent = theme === 'dark' ? 'Light' : 'Dark';
  }
  applyTheme(savedTheme);

  document.getElementById('facThemeBtn')?.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(cur === 'dark' ? 'light' : 'dark');
  });

  // ────────────────────────────────────────────────
  // 3. SIDEBAR TOGGLE
  // ────────────────────────────────────────────────
  const facApp      = document.getElementById('facApp');
  const facSidebar  = document.getElementById('facSidebar');
  const facBackdrop = document.getElementById('facBackdrop');

  // Desktop: collapsed state
  if (localStorage.getItem('fac_sidebar_collapsed') === 'true' && window.innerWidth > 768) {
    facApp?.classList.add('sidebar-collapsed');
  }

  document.getElementById('facToggleBtn')?.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      facApp?.classList.toggle('mobile-open');
    } else {
      facApp?.classList.toggle('sidebar-collapsed');
      localStorage.setItem('fac_sidebar_collapsed', facApp?.classList.contains('sidebar-collapsed'));
    }
  });

  facBackdrop?.addEventListener('click', () => facApp?.classList.remove('mobile-open'));

  // Desktop collapsed sidebar styles (icon-only)
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .fac-app.sidebar-collapsed .fac-sidebar { width: 64px !important; min-width: 64px !important; padding: 20px 8px !important; }
    .fac-app.sidebar-collapsed .fac-brand-text,
    .fac-app.sidebar-collapsed .fac-nav-item span,
    .fac-app.sidebar-collapsed .fac-nav-badge,
    .fac-app.sidebar-collapsed .fac-sidebar-foot { display: none !important; }
    .fac-app.sidebar-collapsed .fac-brand { justify-content: center !important; padding-bottom: 16px !important; }
    .fac-app.sidebar-collapsed .fac-nav-item { justify-content: center !important; padding: 12px 0 !important; gap: 0 !important; }
  `;
  document.head.appendChild(styleEl);

  // ────────────────────────────────────────────────
  // 4. VIEW NAVIGATION
  // ────────────────────────────────────────────────
  function switchView(target) {
    document.querySelectorAll('.fac-nav-item[data-view]').forEach(n => {
      n.classList.toggle('active', n.dataset.view === target);
    });
    document.querySelectorAll('.fac-nav-tab[data-view]').forEach(t => {
      t.classList.toggle('active', t.dataset.view === target);
    });
    document.querySelectorAll('.fac-view').forEach(v => {
      v.classList.toggle('active', v.id === `view-${target}`);
    });
    // Close mobile sidebar on nav
    facApp?.classList.remove('mobile-open');
    document.getElementById('facScrollMain')?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('[data-view]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const v = el.dataset.view;
      if (v) switchView(v);
    });
  });

  document.getElementById('facGoToRequest')?.addEventListener('click', () => switchView('request'));
  document.getElementById('facQuickReqBtn')?.addEventListener('click', () => switchView('request'));

  // ────────────────────────────────────────────────
  // 5. EXECUTIVE REALTIME CLOCK & SQLITE HEALTH POLL
  // ────────────────────────────────────────────────
  function updateExecutiveClock() {
    const now = new Date();
    const digits = document.getElementById('clockTimeDigits');
    const ampm = document.getElementById('clockAmPm');
    const dateSub = document.getElementById('clockDateSub');
    const legacy = document.getElementById('liveTimestamp');

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampmStr = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const hoursStr = String(hours).padStart(2, '0');

    if (digits) digits.textContent = `${hoursStr}:${minutes}:${seconds}`;
    if (ampm) ampm.textContent = ampmStr;
    if (dateSub) {
      dateSub.textContent = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    if (legacy) {
      legacy.textContent = now.toLocaleString();
    }
  }
  updateExecutiveClock();
  setInterval(updateExecutiveClock, 1000);

  // SQLite Database Health Polling
  async function checkDbHealth() {
    const pill = document.getElementById('dbSyncStatusPill');
    if (!pill) return;
    const dot = pill.querySelector('.db-sync-dot');
    const label = pill.querySelector('.db-sync-label');

    try {
      const res = await fetch('http://localhost:5000/api/health');
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'healthy' || data.database === 'connected') {
          pill.classList.remove('offline');
          pill.classList.add('online');
          if (dot) { dot.className = 'db-sync-dot online'; }
          if (label) label.textContent = 'DTB';
          pill.title = 'FARMS Database: Live (Port 5000)';
          return;
        }
      }
      throw new Error('Degraded');
    } catch (err) {
      pill.classList.add('offline');
      pill.classList.remove('online');
      if (dot) { dot.className = 'db-sync-dot offline'; }
      if (label) label.textContent = 'DTB';
      pill.title = 'FARMS Database: Offline';
    }
  }
  checkDbHealth();
  setInterval(checkDbHealth, 15000);

  // ────────────────────────────────────────────────
  // 6. PROFILE
  // ────────────────────────────────────────────────
  function renderProfile() {
    const initial = facultyProfile.fullName.replace(/^(Prof\.|Dr\.|Engr\.)\s*/i, '').charAt(0).toUpperCase() || 'F';

    const els = {
      greetingFacultyName: facultyProfile.fullName,
      profileAvatarBig: initial,
      profileAvatarHeader: initial,
      profileHeaderName: facultyProfile.fullName,
      profileNameDisplay: facultyProfile.fullName,
      profileDeptDisplay: facultyProfile.department
    };
    Object.entries(els).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    });

    // Form fields
    ['profFullName', 'profFacultyId', 'profDepartment', 'profTitle', 'profEmail', 'profPhone', 'profOfficeHours'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const map = { profFullName: 'fullName', profFacultyId: 'facultyId', profDepartment: 'department', profTitle: 'title', profEmail: 'email', profPhone: 'phone', profOfficeHours: 'officeHours' };
      el.value = facultyProfile[map[id]] || '';
    });
  }

  renderProfile();

  // Async load profile from backend if online
  if (window.farmsApi) {
    farmsApi.getFacultyById('f-1').then(res => {
      if (res && res.success && res.data) {
        facultyProfile = {
          fullName: res.data.name || facultyProfile.fullName,
          facultyId: res.data.faculty_id || facultyProfile.facultyId,
          department: res.data.dept || facultyProfile.department,
          title: res.data.title || facultyProfile.title,
          email: res.data.email || facultyProfile.email,
          phone: res.data.phone || facultyProfile.phone,
          officeHours: res.data.consultation_hours || facultyProfile.officeHours
        };
        localStorage.setItem('farms_faculty_profile_v6', JSON.stringify(facultyProfile));
        renderProfile();
      }
    }).catch(() => {});
  }

  document.getElementById('facProfileForm')?.addEventListener('submit', e => {
    e.preventDefault();
    facultyProfile = {
      fullName: document.getElementById('profFullName').value.trim(),
      facultyId: document.getElementById('profFacultyId').value.trim(),
      department: document.getElementById('profDepartment').value.trim(),
      title: document.getElementById('profTitle').value.trim(),
      email: document.getElementById('profEmail').value.trim(),
      phone: document.getElementById('profPhone').value.trim(),
      officeHours: document.getElementById('profOfficeHours').value.trim()
    };
    localStorage.setItem('farms_faculty_profile_v6', JSON.stringify(facultyProfile));
    renderProfile();
    showToast('Profile updated successfully!');

    // Persist updates to the live backend database
    if (window.farmsApi) {
      farmsApi.updateFaculty('f-1', {
        name: facultyProfile.fullName,
        faculty_id: facultyProfile.facultyId,
        dept: facultyProfile.department,
        title: facultyProfile.title,
        email: facultyProfile.email,
        phone: facultyProfile.phone,
        consultation_hours: facultyProfile.officeHours
      }).catch(err => console.warn('[farmsApi] Background profile sync failed:', err));
    }
  });

  // ────────────────────────────────────────────────
  // 7. FLOATING TOOLTIP
  // ────────────────────────────────────────────────
  const floatTip = document.createElement('div');
  floatTip.id = 'facFloatTip';
  document.body.appendChild(floatTip);

  function showTip(r, anchorEl) {
    const statusColor = { vacant: '#4ade80', occupied: '#f87171', maintenance: '#fbbf24' }[r.status];
    const statusLabel = { vacant: 'Vacant — Open for Booking', occupied: 'Occupied', maintenance: 'Under Maintenance' }[r.status];
    floatTip.innerHTML = `
      <div class="tip-room">${r.room}</div>
      <div class="tip-status" style="color:${statusColor};">${statusLabel}</div>
      <div class="tip-row"><span class="tip-key">Building</span><span class="tip-val">${r.bldg}</span></div>
      <div class="tip-row"><span class="tip-key">Floor</span><span class="tip-val">Floor ${r.floor}</span></div>
      <div class="tip-row"><span class="tip-key">Capacity</span><span class="tip-val">${r.capacity} seats</span></div>
      <div class="tip-row"><span class="tip-key">Occupant</span><span class="tip-val">${r.occupant}</span></div>
      <div class="tip-row"><span class="tip-key">Schedule</span><span class="tip-val">${r.schedule}</span></div>
      ${r.status === 'vacant' ? '<div class="tip-cta">Click to Request Access</div>' : ''}
    `;
    const rect = anchorEl.getBoundingClientRect();
    const TW = 215, TH = floatTip.offsetHeight || 190;
    let left = rect.left + rect.width / 2 - TW / 2;
    let top  = rect.top - TH - 12;
    left = Math.max(8, Math.min(left, window.innerWidth - TW - 8));
    if (top < 8) top = rect.bottom + 12;
    floatTip.style.left = left + 'px';
    floatTip.style.top  = top  + 'px';
    floatTip.style.opacity = '1';
  }
  function hideTip() { floatTip.style.opacity = '0'; }

  // ────────────────────────────────────────────────
  // 8. ROOM SQUARE BUTTON MATRIX
  // ────────────────────────────────────────────────
  let activeFilter = 'all';
  const grid = document.getElementById('facRoomsGrid');

  function makeSqBtn(r) {
    const tile = document.createElement('div');
    tile.className = `fac-room-tile ${r.status}`;
    tile.setAttribute('role', 'button');
    tile.setAttribute('tabindex', '0');
    tile.setAttribute('aria-label', `${r.room} (${r.bldg}) — ${r.status}`);
    tile.innerHTML = `
      <div class="fac-tile-top">
        <span class="fac-room-code">${r.room}</span>
        <span class="fac-room-status-indicator"></span>
      </div>
      <div class="fac-tile-bottom">
        <span class="fac-room-capacity">${r.capacity} seats</span>
        <span class="fac-room-status-tag">${r.status}</span>
      </div>
    `;
    tile.addEventListener('mouseenter', () => showTip(r, tile));
    tile.addEventListener('mouseleave', hideTip);
    tile.addEventListener('click', () => { hideTip(); openRoomModal(r); });
    tile.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        hideTip();
        openRoomModal(r);
      }
    });
    return tile;
  }

  function renderRooms() {
    if (!grid) return;
    grid.innerHTML = '';
    let list = ROOM_DATA;
    if (activeFilter === 'vacant')   list = ROOM_DATA.filter(r => r.status === 'vacant');
    else if (activeFilter !== 'all') list = ROOM_DATA.filter(r => r.bldg === activeFilter);
    if (list.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:#94a3b8;font-weight:700;">No rooms match this filter.</div>`;
      return;
    }
    list.forEach(r => grid.appendChild(makeSqBtn(r)));
    const el = document.getElementById('statVacantCount');
    if (el) el.textContent = ROOM_DATA.filter(r => r.status === 'vacant').length;
    if (typeof renderActiveSessionBanner === 'function') renderActiveSessionBanner();
  }

  // Filter chips
  document.querySelectorAll('.fac-filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.fac-filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.dataset.filter;
      renderRooms();
    });
  });

  // View toggle (Matrix vs Map)
  const btnCards = document.getElementById('facBtnCards');
  const btnMap   = document.getElementById('facBtnMap');
  const mapCont  = document.getElementById('facMapContainer');

  btnCards?.addEventListener('click', () => {
    btnCards.classList.add('active');
    btnMap?.classList.remove('active');
    if (grid) grid.style.display = '';
    if (mapCont) mapCont.classList.add('hidden');
  });

  btnMap?.addEventListener('click', () => {
    btnMap.classList.add('active');
    btnCards?.classList.remove('active');
    if (grid) grid.style.display = 'none';
    if (mapCont) { mapCont.classList.remove('hidden'); renderCampusMap(); }
  });

  renderRooms();

  // ────────────────────────────────────────────────
  // ────────────────────────────────────────────────
  // 8. CAMPUS MAP (SVG)
  // ────────────────────────────────────────────────
  function renderCampusMap() {
    const cont = document.getElementById('facMapContent');
    if (!cont) return;
    cont.innerHTML = `
      <div style="padding:20px;">
        <p style="font-size:0.8rem; font-weight:800; color:var(--fac-text-muted); margin-bottom:12px; text-transform:uppercase; letter-spacing:0.5px;">Click a building to inspect rooms</p>
        <svg viewBox="0 0 1000 600" width="100%" style="max-height:400px; filter: drop-shadow(4px 4px 0px #000000);">
          <rect width="1000" height="600" fill="transparent"/>
          <path d="M 0 300 Q 500 280 1000 300" stroke="#475569" stroke-width="24" stroke-dasharray="16,10" fill="none"/>
          <g class="fac-campus-bldg" data-bldg="Pancho Building" style="cursor:pointer;" transform="translate(60, 60)">
            <rect width="400" height="180" rx="14" fill="#047857" stroke="#000000" stroke-width="3.5"/>
            <text x="200" y="80" font-family="Plus Jakarta Sans,system-ui" font-weight="900" font-size="22" fill="#ffffff" text-anchor="middle">PANCHO BUILDING</text>
            <text x="200" y="110" font-family="Plus Jakarta Sans,system-ui" font-weight="800" font-size="13" fill="#a7f3d0" text-anchor="middle">2 Floors · 50 Classrooms &amp; Labs</text>
            <rect x="130" y="128" width="140" height="30" rx="8" fill="#ccff00" stroke="#000000" stroke-width="2"/>
            <text x="200" y="148" font-family="Plus Jakarta Sans,system-ui" font-weight="900" font-size="12" fill="#000000" text-anchor="middle">INSPECT BUILDING</text>
          </g>
          <g class="fac-campus-bldg" data-bldg="CBA Building" style="cursor:pointer;" transform="translate(560, 60)">
            <rect width="380" height="180" rx="14" fill="#1d4ed8" stroke="#000000" stroke-width="3.5"/>
            <text x="190" y="80" font-family="Plus Jakarta Sans,system-ui" font-weight="900" font-size="22" fill="#ffffff" text-anchor="middle">CBA BUILDING</text>
            <text x="190" y="110" font-family="Plus Jakarta Sans,system-ui" font-weight="800" font-size="13" fill="#bfdbfe" text-anchor="middle">4 Storeys · Business &amp; Computing</text>
            <rect x="120" y="128" width="140" height="30" rx="8" fill="#ccff00" stroke="#000000" stroke-width="2"/>
            <text x="190" y="148" font-family="Plus Jakarta Sans,system-ui" font-weight="900" font-size="12" fill="#000000" text-anchor="middle">INSPECT BUILDING</text>
          </g>
          <g class="fac-campus-bldg" data-bldg="Hangar" style="cursor:pointer;" transform="translate(200, 360)">
            <rect width="600" height="190" rx="14" fill="#0284c7" stroke="#000000" stroke-width="3.5"/>
            <text x="300" y="85" font-family="Plus Jakarta Sans,system-ui" font-weight="900" font-size="24" fill="#ffffff" text-anchor="middle">HANGAR AVIATION COMPLEX</text>
            <text x="300" y="115" font-family="Plus Jakarta Sans,system-ui" font-weight="800" font-size="13" fill="#bae6fd" text-anchor="middle">1 Storey · 6 Aviation Engineering Bays</text>
            <rect x="230" y="132" width="140" height="30" rx="8" fill="#ccff00" stroke="#000000" stroke-width="2"/>
            <text x="300" y="152" font-family="Plus Jakarta Sans,system-ui" font-weight="900" font-size="12" fill="#000000" text-anchor="middle">INSPECT BUILDING</text>
          </g>
        </svg>
      </div>
    `;

    cont.querySelectorAll('.fac-campus-bldg').forEach(g => {
      g.addEventListener('click', () => {
        const bldg = g.dataset.bldg;
        activeFilter = bldg;
        document.querySelectorAll('.fac-filter-chip').forEach(c => {
          c.classList.toggle('active', c.dataset.filter === bldg);
        });
        // Switch back to card view
        btnCards?.click();
      });
    });
  }

  // ────────────────────────────────────────────────
  // 8.5 INTERACTIVE TIME RANGE PICKER COMPONENT
  // ────────────────────────────────────────────────
  function formatTimeTo12Hour(time24) {
    if (!time24 || !time24.includes(':')) return time24 || '--:--';
    const [hStr, mStr] = time24.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr || '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
  }

  function timeToMinutes(time24) {
    if (!time24 || !time24.includes(':')) return 0;
    const [h, m] = time24.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }

  function minutesToTime(totalMins) {
    let norm = (totalMins % 1440 + 1440) % 1440;
    const h = Math.floor(norm / 60);
    const m = norm % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  function initTimeRangePicker({ cardId, startId, endId, summaryTextId, hiddenId }) {
    const card = document.getElementById(cardId);
    if (!card) return null;

    const startInput = document.getElementById(startId);
    const endInput = document.getElementById(endId);
    const summaryText = document.getElementById(summaryTextId);
    const hiddenInput = document.getElementById(hiddenId);
    const chips = card.querySelectorAll('.dur-chip');

    function updateCalculations(source = 'manual') {
      if (!startInput || !endInput) return;
      const startMins = timeToMinutes(startInput.value);
      const endMins = timeToMinutes(endInput.value);
      const diffMins = endMins - startMins;

      const start12 = formatTimeTo12Hour(startInput.value);
      const end12 = formatTimeTo12Hour(endInput.value);

      if (diffMins <= 0) {
        card.classList.add('time-error');
        if (summaryText) {
          summaryText.innerHTML = `<span style="color:var(--fac-coral); font-weight:900;">⚠️ Invalid Window:</span> End time (${end12}) must be after start time (${start12}).`;
        }
        if (hiddenInput) hiddenInput.value = `${start12} – ${end12}`;
        chips.forEach(c => c.classList.remove('active'));
        return { start: startInput.value, end: endInput.value, diffMins: 0, valid: false };
      }

      card.classList.remove('time-error');
      const hrs = (diffMins / 60).toFixed(diffMins % 60 === 0 ? 0 : 1);
      const durationStr = `${diffMins} mins (${hrs} hr${hrs === '1' ? '' : 's'})`;

      if (summaryText) {
        summaryText.innerHTML = `<strong>${start12} – ${end12}</strong> <span style="color:var(--fac-lime); background:#000000; padding:1px 6px; border-radius:4px; font-weight:900; margin-left:6px;">${durationStr}</span>`;
      }

      if (hiddenInput) {
        hiddenInput.value = `${start12} – ${end12}`;
      }

      // Update chip active state if matches
      if (source !== 'chip') {
        chips.forEach(c => {
          const chipMins = parseInt(c.dataset.mins, 10);
          c.classList.toggle('active', chipMins === diffMins);
        });
      }

      return { start: startInput.value, end: endInput.value, diffMins, valid: true };
    }

    // Attach listeners
    const btnNow = card.querySelector('.btn-time-now');
    btnNow?.addEventListener('click', (e) => {
      e.preventDefault();
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const curTime24 = `${h}:${m}`;
      if (startInput) startInput.value = curTime24;

      const activeChip = card.querySelector('.dur-chip.active');
      const durMins = activeChip ? parseInt(activeChip.dataset.mins, 10) : 120;
      if (endInput) {
        endInput.value = minutesToTime(timeToMinutes(curTime24) + durMins);
      }
      updateCalculations('now');
      showToast(`⏱️ Start time set to current time (${formatTimeTo12Hour(curTime24)})`);
    });

    chips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const mins = parseInt(chip.dataset.mins, 10);
        const startMins = timeToMinutes(startInput.value);
        endInput.value = minutesToTime(startMins + mins);
        updateCalculations('chip');
      });
    });

    startInput?.addEventListener('input', () => {
      const activeChip = card.querySelector('.dur-chip.active');
      if (activeChip) {
        const mins = parseInt(activeChip.dataset.mins, 10);
        const startMins = timeToMinutes(startInput.value);
        endInput.value = minutesToTime(startMins + mins);
      }
      updateCalculations('start');
    });

    endInput?.addEventListener('input', () => {
      updateCalculations('end');
    });

    // Initial run
    updateCalculations('init');

    return {
      getValues: () => ({
        start_time: startInput?.value || '08:00',
        end_time: endInput?.value || '10:00',
        duration_minutes: Math.max(0, timeToMinutes(endInput?.value) - timeToMinutes(startInput?.value)),
        formatted_window: hiddenInput?.value || `${formatTimeTo12Hour(startInput?.value)} – ${formatTimeTo12Hour(endInput?.value)}`
      }),
      reset: (defaultStart = '08:00', defaultMins = 120) => {
        if (startInput) startInput.value = defaultStart;
        if (endInput) endInput.value = minutesToTime(timeToMinutes(defaultStart) + defaultMins);
        chips.forEach(c => c.classList.toggle('active', parseInt(c.dataset.mins, 10) === defaultMins));
        updateCalculations('init');
      }
    };
  }

  // Initialize both time range pickers
  const reqTimePicker = initTimeRangePicker({
    cardId: 'reqTimePickerCard',
    startId: 'reqStartTime',
    endId: 'reqEndTime',
    summaryTextId: 'reqTimeSummaryText',
    hiddenId: 'reqTime'
  });

  const modalTimePicker = initTimeRangePicker({
    cardId: 'modalTimePickerCard',
    startId: 'modalStartTime',
    endId: 'modalEndTime',
    summaryTextId: 'modalTimeSummaryText',
    hiddenId: 'facModalTime'
  });

  // ────────────────────────────────────────────────
  // 9. ROOM MODAL
  // ────────────────────────────────────────────────
  let selectedRoom = null;
  const modal        = document.getElementById('facModalBackdrop');
  const modalClose   = document.getElementById('facModalClose');
  const modalTitle   = document.getElementById('facModalTitle');
  const modalStatus  = document.getElementById('facModalStatus');
  const modalSText   = document.getElementById('facModalStatusText');
  const modalCap     = document.getElementById('facModalCap');
  const modalOcc     = document.getElementById('facModalOcc');
  const modalSched   = document.getElementById('facModalSched');
  const modalForm    = document.getElementById('facModalForm');

  function openRoomModal(r) {
    selectedRoom = r;
    if (modalTitle) modalTitle.textContent = `${r.room} – ${r.bldg}`;
    if (modalStatus) {
      modalStatus.className = `fac-modal-status ${r.status === 'vacant' ? 'available' : 'occupied'}`;
    }
    if (modalSText) modalSText.textContent = r.status === 'vacant' ? 'AVAILABLE FOR RESERVATION' : r.status === 'occupied' ? 'CURRENTLY OCCUPIED' : 'UNDER MAINTENANCE';
    if (modalCap)   modalCap.textContent   = `${r.capacity} Seats`;
    if (modalOcc)   modalOcc.textContent   = r.occupant;
    if (modalSched) modalSched.textContent = r.schedule;
    if (modal) modal.classList.add('active', 'open');

    // Check if this room is occupied by current faculty
    const myName = (facultyProfile.fullName || '').toLowerCase();
    const isMyOccupiedRoom = r.status === 'occupied' && (
      (r.occupant && r.occupant.toLowerCase().includes(myName)) ||
      bookingLogs.some(l => l.status === 'Approved' && l.facility.toLowerCase().includes(r.room.toLowerCase()))
    );

    const checkoutSection = document.getElementById('facModalCheckoutSection');
    const btnModalCheckout = document.getElementById('btnModalCheckout');
    const formEl = document.getElementById('facModalForm');

    if (isMyOccupiedRoom) {
      if (modalStatus) modalStatus.className = 'fac-modal-status occupied';
      if (modalSText) modalSText.textContent = 'OCCUPIED BY YOU (ACTIVE SESSION)';
      if (checkoutSection) checkoutSection.style.display = 'block';
      if (formEl) formEl.style.display = 'none';
      if (btnModalCheckout) {
        btnModalCheckout.onclick = () => {
          window.checkoutFacRoom(null, `${r.room} (${r.bldg})`, r.id || r.roomCode || r.room);
        };
      }
    } else {
      if (checkoutSection) checkoutSection.style.display = 'none';
      if (formEl) formEl.style.display = r.status === 'vacant' ? '' : 'none';
    }
  }

  function closeModal() {
    if (modal) modal.classList.remove('active', 'open');
  }

  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  modalForm?.addEventListener('submit', e => {
    e.preventDefault();
    if (!selectedRoom) return;
    const subj = document.getElementById('facModalSubject')?.value.trim() || 'N/A';
    const timeData = modalTimePicker ? modalTimePicker.getValues() : {
      start_time: '13:00',
      end_time: '15:00',
      duration_minutes: 120,
      formatted_window: document.getElementById('facModalTime')?.value.trim() || '01:00 PM – 03:00 PM'
    };

    if (timeData.duration_minutes <= 0) {
      showToast('⚠️ Please select a valid time range (End time must be after Start time).');
      return;
    }

    const newLog = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      facility: `${selectedRoom.room} (${selectedRoom.bldg})`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: timeData.formatted_window,
      purpose: subj,
      status: 'Pending',
      permit: 'Awaiting Admin'
    };
    bookingLogs.unshift(newLog);
    localStorage.setItem('farms_faculty_bookings_v6', JSON.stringify(bookingLogs));
    renderLogs();
    closeModal();
    modalForm.reset();
    showToast(`Request submitted for ${selectedRoom.room}!`);

    // Sync request to backend database and cross-tab broadcast
    const reqPayload = {
      id: newLog.id,
      requester: `${facultyProfile.fullName} (${facultyProfile.facultyId})`,
      room: newLog.facility,
      purpose: newLog.purpose,
      date: `${newLog.date}, ${newLog.time}`,
      start_time: timeData.start_time,
      end_time: timeData.end_time,
      duration_minutes: timeData.duration_minutes,
      status: 'pending'
    };

    if (window.farmsApi) {
      farmsApi.createRequest(reqPayload).catch(err => console.warn('[farmsApi] Request creation sync failed:', err));
      farmsApi.broadcastLocalEvent('new_request', reqPayload);
    }
  });

  // Real-time listener for admin approval notifications & room state changes
  function handleIncomingRealtime(evt) {
    if (!evt) return;
    if (evt.type === 'room_updated' && evt.data) {
      const u = evt.data;
      const target = ROOM_DATA.find(r => r.id === u.id || r.roomCode === u.room_code || (r.bldg === u.building && r.room === u.room));
      if (target) {
        target.status = u.status;
        target.occupant = u.occupant && u.occupant !== 'None' ? u.occupant : 'Unassigned';
        target.schedule = u.schedule && u.schedule !== '--' ? u.schedule : 'Open';
        renderRooms();
      } else {
        syncRealtimeData();
      }
    } else if (evt.type === 'request_status_updated' && evt.data) {
      const updated = evt.data;
      const target = bookingLogs.find(b => b.id === updated.id || (b.facility && updated.room && b.facility.includes(updated.room)));
      if (target) {
        target.status = updated.status === 'approved' ? 'Approved' : updated.status === 'completed' ? 'Completed' : 'Denied';
        if (updated.status === 'approved' && (!target.permit || target.permit.includes('Awaiting'))) {
          target.permit = `BSU-KEY-${updated.id ? updated.id.replace(/\D/g, '') : Math.floor(1000 + Math.random() * 9000)}`;
        }
        localStorage.setItem('farms_faculty_bookings_v6', JSON.stringify(bookingLogs));
        renderLogs();
        if (updated.status === 'approved') {
          showToast(`🎉 Room permit issued for ${target.facility}!`);
        } else if (updated.status === 'completed') {
          showToast(`Room session ended for ${target.facility}.`);
        } else {
          showToast(`Notice: Request for ${target.facility} was denied.`);
        }
      }
      syncRealtimeData();
    } else if (evt.type === 'new_request') {
      syncRealtimeData();
    }
  }

  // Active Session Banner Renderer
  function renderActiveSessionBanner() {
    const container = document.getElementById('facActiveSessionContainer');
    if (!container) return;

    const myName = (facultyProfile.fullName || '').toLowerCase();
    
    // Look in bookingLogs for approved requests
    const activeLog = bookingLogs.find(l => l.status === 'Approved');
    
    // Also check ROOM_DATA for rooms occupied by current faculty
    let activeRoom = null;
    if (activeLog) {
      activeRoom = ROOM_DATA.find(r => activeLog.facility && (
        activeLog.facility.toLowerCase().includes(r.room.toLowerCase()) ||
        (r.roomCode && activeLog.facility.toLowerCase().includes(r.roomCode.toLowerCase()))
      ));
    }
    if (!activeRoom) {
      activeRoom = ROOM_DATA.find(r => r.status === 'occupied' && (
        (r.occupant && r.occupant.toLowerCase().includes(myName)) ||
        (facultyProfile.facultyId && r.occupant && r.occupant.includes(facultyProfile.facultyId))
      ));
    }

    if (!activeLog && !activeRoom) {
      container.innerHTML = '';
      return;
    }

    const sessionFacility = activeLog ? activeLog.facility : `${activeRoom.room} (${activeRoom.bldg})`;
    const sessionTime = activeLog ? activeLog.time : (activeRoom.schedule !== '--' ? activeRoom.schedule : 'Active Session');
    const sessionPurpose = activeLog ? activeLog.purpose : 'Faculty Class Window';
    const sessionPermit = activeLog?.permit || 'BSU-KEY-ACTIVE';
    const logId = activeLog ? activeLog.id : '';
    const roomId = activeRoom ? (activeRoom.id || activeRoom.roomCode || activeRoom.room) : '';

    container.innerHTML = `
      <div class="fac-active-session-card">
        <div class="fac-active-session-icon">🔑</div>
        <div class="fac-active-session-info">
          <div class="fac-active-session-title">Active Room Session: <strong>${sessionFacility}</strong></div>
          <div class="fac-active-session-sub">⏰ <strong>${sessionTime}</strong> &nbsp;·&nbsp; 📝 ${sessionPurpose} &nbsp;·&nbsp; Permit: <span class="fac-permit-chip" style="display:inline-block; padding:1px 6px; font-size:0.7rem;">${sessionPermit}</span></div>
        </div>
        <div class="fac-active-session-actions">
          <button class="fac-btn-checkout-hero" onclick="window.checkoutFacRoom('${logId}', '${sessionFacility}', '${roomId}')">
            ⚡ Check Out Room
          </button>
        </div>
      </div>
    `;
  }

  // Global Checkout Room Handler
  window.checkoutFacRoom = async (logId, facilityTitle, directRoomId) => {
    try {
      // 1. Find matching room in ROOM_DATA
      let targetRoom = null;
      if (directRoomId) {
        targetRoom = ROOM_DATA.find(r => r.id === directRoomId || r.roomCode === directRoomId || r.room === directRoomId);
      }
      if (!targetRoom && facilityTitle) {
        targetRoom = ROOM_DATA.find(r => 
          facilityTitle.toLowerCase().includes(r.room.toLowerCase()) || 
          (r.roomCode && facilityTitle.toLowerCase().includes(r.roomCode.toLowerCase()))
        );
      }
      if (!targetRoom && logId) {
        const matchLog = bookingLogs.find(l => l.id === logId);
        if (matchLog) {
          targetRoom = ROOM_DATA.find(r => 
            matchLog.facility.toLowerCase().includes(r.room.toLowerCase()) || 
            (r.roomCode && matchLog.facility.toLowerCase().includes(r.roomCode.toLowerCase()))
          );
        }
      }

      // 2. Update local room state immediately
      if (targetRoom) {
        targetRoom.status = 'vacant';
        targetRoom.occupant = 'Unassigned';
        targetRoom.schedule = 'Open';
      }

      // 3. Update bookingLogs
      bookingLogs.forEach(l => {
        if ((logId && l.id === logId) || (targetRoom && l.status === 'Approved' && l.facility.toLowerCase().includes(targetRoom.room.toLowerCase()))) {
          l.status = 'Completed';
        }
      });
      localStorage.setItem('farms_faculty_bookings_v6', JSON.stringify(bookingLogs));

      // 4. Update UI
      closeModal();
      renderRooms();
      renderLogs();
      renderActiveSessionBanner();

      const displayTitle = facilityTitle || targetRoom?.room || 'room';
      showToast(`Checked out of ${displayTitle} successfully! Room is now vacant.`);

      // 5. Send checkout API request to backend
      const roomIdToUse = targetRoom?.id || targetRoom?.roomCode || directRoomId || (facilityTitle ? facilityTitle.split('(')[0].trim() : 'room');
      if (window.farmsApi) {
        await farmsApi.checkoutRoom(roomIdToUse);
        if (logId) {
          farmsApi.updateRequestStatus(logId, 'completed').catch(() => {});
        }
      }
      
      // Auto re-sync
      setTimeout(syncRealtimeData, 500);
    } catch (err) {
      console.error('Checkout error:', err);
      showToast('Notice: Checkout recorded.');
    }
  };

  // Fetch real-time rooms and booking requests from backend REST API
  async function syncRealtimeData() {
    if (!window.farmsApi) return;
    try {
      const roomRes = await farmsApi.getRooms();
      if (roomRes && roomRes.success && Array.isArray(roomRes.data) && roomRes.data.length > 0) {
        ROOM_DATA.length = 0;
        roomRes.data.forEach(r => {
          ROOM_DATA.push({
            id: r.id,
            bldg: r.building,
            roomCode: r.room_code || r.room,
            room: r.room || r.room_code,
            floor: r.floor || 1,
            status: r.status || 'vacant',
            occupant: r.occupant && r.occupant !== 'None' ? r.occupant : 'Unassigned',
            schedule: r.schedule && r.schedule !== '--' ? r.schedule : 'Open',
            capacity: r.capacity || 45,
            equipment: r.equipment || ''
          });
        });
        renderRooms();
        if (reqBldgSelect?.value) {
          updateRoomDropdown(reqBldgSelect.value);
        }
      }

      const reqRes = await farmsApi.getRequests();
      if (reqRes && reqRes.success && Array.isArray(reqRes.data)) {
        const mappedLogs = reqRes.data.map(req => {
          let dStr = req.date || 'Today';
          let tStr = req.time || '';
          if (dStr.includes(',')) {
            const parts = dStr.split(',');
            dStr = parts[0].trim();
            tStr = parts.slice(1).join(',').trim();
          }
          return {
            id: req.id,
            facility: req.room,
            date: dStr,
            time: tStr || 'Class Window',
            purpose: req.purpose,
            status: req.status === 'approved' ? 'Approved' : req.status === 'completed' ? 'Completed' : req.status === 'denied' ? 'Denied' : 'Pending',
            permit: req.status === 'approved' ? `BSU-KEY-${req.id.replace(/\D/g, '') || '9012'}` : req.status === 'completed' ? `BSU-KEY-${req.id.replace(/\D/g, '') || '9012'}` : (req.status === 'denied' ? 'Denied' : 'Awaiting Admin')
          };
        });
        bookingLogs = mappedLogs;
        localStorage.setItem('farms_faculty_bookings_v6', JSON.stringify(bookingLogs));
        renderLogs();
      }
    } catch (e) {
      console.warn('[faculty] Real-time sync notice:', e.message);
    }
  }

  syncRealtimeData();
  
  // Smart adaptive polling: Relaxed heartbeat when tab is visible, suspended when hidden
  setInterval(() => {
    if (document.hidden) return;
    syncRealtimeData();
  }, 10000);

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      syncRealtimeData();
    }
  });

  if (window.farmsApi) {
    farmsApi.listenLocalEvents(handleIncomingRealtime);
    farmsApi.connectEventStream(handleIncomingRealtime);
  }

  // ────────────────────────────────────────────────
  // 10. BOOKING LOGS
  // ────────────────────────────────────────────────
  function renderLogs() {
    const list = document.getElementById('facLogsList');
    if (!list) return;
    list.innerHTML = '';

    let approved = 0, pending = 0;

    bookingLogs.forEach(log => {
      if (log.status === 'Approved') approved++;
      if (log.status === 'Pending') pending++;

      const badgeCls = log.status === 'Approved' ? 'fac-badge-approved' : 
                       log.status === 'Completed' ? 'fac-badge-completed' :
                       log.status === 'Denied' ? 'fac-badge-denied' : 'fac-badge-pending';
      const badgeText = log.status === 'Approved' ? 'Approved' : 
                        log.status === 'Completed' ? 'Completed' :
                        log.status === 'Denied' ? 'Denied' : 'Pending';

      let actionHtml = '';
      if (log.status === 'Pending') {
        actionHtml = `<button class="fac-tab-btn" style="height:32px; padding:0 12px; font-size:0.72rem; color:var(--fac-coral); border-color:var(--fac-coral); box-shadow:2px 2px 0px var(--fac-coral); cursor:pointer;" onclick="window.cancelFacReq('${log.id}')">Cancel Request</button>`;
      } else if (log.status === 'Approved') {
        actionHtml = `
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; justify-content:flex-end;">
            <span class="fac-permit-chip">🔑 ${log.permit}</span>
            <button class="fac-tab-btn fac-btn-checkout" style="height:30px; padding:0 10px; font-size:0.72rem; color:#ffffff; background:#e11d48; border-color:#e11d48; box-shadow:2px 2px 0px #000000; font-weight:800; cursor:pointer;" onclick="window.checkoutFacRoom('${log.id}', '${log.facility}')">⚡ Check Out</button>
          </div>
        `;
      } else if (log.status === 'Completed') {
        actionHtml = `<span class="fac-permit-chip" style="opacity:0.75; border-style:dashed;">✔ Completed</span>`;
      } else {
        actionHtml = `<span class="fac-permit-chip" style="opacity:0.5;">Denied</span>`;
      }

      const card = document.createElement('div');
      card.className = 'fac-log-item';
      card.innerHTML = `
        <div class="fac-log-main">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-family:var(--fac-mono); font-size:0.75rem; font-weight:900; color:var(--fac-lime); background:#000000; padding:2px 7px; border-radius:4px; border:1px solid #333333;">${log.id}</span>
            <span class="fac-log-title">${log.facility}</span>
          </div>
          <div class="fac-log-meta" style="margin-top:6px; display:flex; gap:12px; flex-wrap:wrap;">
            <span>📅 ${log.date}</span>
            <span>⏰ ${log.time}</span>
            <span>📝 ${log.purpose}</span>
          </div>
        </div>
        <div class="fac-log-side">
          <span class="fac-status-badge ${badgeCls}">${badgeText}</span>
          ${actionHtml}
        </div>
      `;
      list.appendChild(card);
    });

    // Update KPI counters
    const elApproved = document.getElementById('statApprovedCount');
    const elPending  = document.getElementById('statPendingCount');
    const sidebarBadge = document.getElementById('sidebarLogBadge');

    if (elApproved) elApproved.textContent = approved;
    if (elPending)  elPending.textContent  = pending;
    if (sidebarBadge) {
      sidebarBadge.textContent = pending;
      sidebarBadge.style.display = pending > 0 ? '' : 'none';
    }

    renderActiveSessionBanner();
  }

  // Global cancel handler
  window.cancelFacReq = (id) => {
    bookingLogs = bookingLogs.filter(l => l.id !== id);
    localStorage.setItem('farms_faculty_bookings_v6', JSON.stringify(bookingLogs));
    renderLogs();
    showToast('Request cancelled.');
  };

  renderLogs();

  // ────────────────────────────────────────────────
  // 11. REQUEST FORM & INTERACTIVE SVG BLUEPRINT SYNC
  // ────────────────────────────────────────────────
  const BLDG_ROOMS = {
    'Pancho Building': [
      { code: 'Pancho 101', label: 'Pancho 101 (Classroom - 45 seats)' },
      { code: 'Pancho 103', label: 'Pancho 103 (Classroom - 45 seats)' },
      { code: 'Pancho 105', label: 'Pancho 105 (Classroom - 45 seats)' },
      { code: 'Science Laboratory', label: 'Science Laboratory (Lab - 40 seats)' },
      { code: 'Lecture Room', label: 'Lecture Room (Lecture - 60 seats)' },
      { code: 'Multimedia Room', label: 'Multimedia Room / AVR (AV - 50 seats)' }
    ],
    'CBA Building': [
      { code: 'CBA 101', label: 'CBA 101 (Lecture - 45 seats)' },
      { code: 'CBA 102', label: 'CBA 102 (Computer Lab - 50 seats)' },
      { code: 'CBA 103', label: 'CBA 103 (Classroom - 45 seats)' },
      { code: 'CBA 202', label: 'CBA 202 (Lecture Hall - 45 seats)' }
    ],
    'Hangar': [
      { code: 'Hangar 001', label: 'Hangar 001 (Aviation Bay - 35 seats)' },
      { code: 'Hangar 002', label: 'Hangar 002 (Aviation Bay - 35 seats)' },
      { code: 'Hangar 003', label: 'Hangar 003 (Aviation Bay - 35 seats)' },
      { code: 'Hangar 004', label: 'Hangar 004 (Drone Bay - 35 seats)' },
      { code: 'Hangar 005', label: 'Hangar 005 (Aviation Bay - 35 seats)' },
      { code: 'Hangar 006', label: 'Hangar 006 (Maintenance Bay - 35 seats)' }
    ]
  };

  const reqBldgSelect = document.getElementById('reqBuilding');
  const reqRoomSelect = document.getElementById('reqRoom');
  const bannerText    = document.getElementById('facSvgSelectedText');

  function updateRoomDropdown(bldgName, selectedRoomCode = null) {
    if (!reqRoomSelect) return;
    const rooms = BLDG_ROOMS[bldgName] || [];
    reqRoomSelect.innerHTML = '';
    rooms.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.code;
      opt.textContent = r.label;
      if (selectedRoomCode && (r.code === selectedRoomCode || r.label.includes(selectedRoomCode))) {
        opt.selected = true;
      }
      reqRoomSelect.appendChild(opt);
    });
  }

  function highlightSvgBuilding(bldgName) {
    // Highlight SVG polygon
    document.querySelectorAll('#facReqSvgFrame .interactive-bldg').forEach(el => {
      const isMatch = el.dataset.bldg === bldgName;
      el.classList.toggle('active-selected', isMatch);
    });

    // Update filter pills
    document.querySelectorAll('.fac-svg-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.svgBldg === bldgName);
    });

    // Update form select if different
    if (reqBldgSelect && reqBldgSelect.value !== bldgName) {
      reqBldgSelect.value = bldgName;
      updateRoomDropdown(bldgName);
    }

    // Update banner text
    if (bannerText) {
      const curRoom = reqRoomSelect?.value || 'Pancho 101';
      bannerText.innerHTML = `Focused Building: <strong style="color:var(--fac-lime); background:#000000; padding:2px 8px; border-radius:4px;">${bldgName}</strong> &nbsp;·&nbsp; Room: <strong>${curRoom}</strong>`;
    }
  }

  // Click on SVG buildings
  document.querySelectorAll('#facReqSvgFrame .interactive-bldg').forEach(el => {
    el.addEventListener('click', () => {
      const bldg = el.dataset.bldg;
      if (bldg) {
        highlightSvgBuilding(bldg);
        showToast(`📍 Selected ${bldg} from vector map.`);
      }
    });
  });

  // Click on SVG pills
  document.querySelectorAll('.fac-svg-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const bldg = pill.dataset.svgBldg;
      if (bldg) {
        highlightSvgBuilding(bldg);
      }
    });
  });

  // Form select change
  reqBldgSelect?.addEventListener('change', () => {
    const bldg = reqBldgSelect.value;
    updateRoomDropdown(bldg);
    highlightSvgBuilding(bldg);
  });

  reqRoomSelect?.addEventListener('change', () => {
    const bldg = reqBldgSelect?.value || 'Pancho Building';
    const curRoom = reqRoomSelect?.value || '';
    if (bannerText) {
      bannerText.innerHTML = `Focused Building: <strong style="color:var(--fac-lime); background:#000000; padding:2px 8px; border-radius:4px;">${bldg}</strong> &nbsp;·&nbsp; Room: <strong>${curRoom}</strong>`;
    }
  });

  // Initialize room dropdown on load
  if (reqBldgSelect?.value) {
    updateRoomDropdown(reqBldgSelect.value);
  }

  document.getElementById('facRequestForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    const timeData = reqTimePicker ? reqTimePicker.getValues() : {
      start_time: '08:00',
      end_time: '10:00',
      duration_minutes: 120,
      formatted_window: form.reqTime?.value || '08:00 AM – 10:00 AM'
    };

    if (timeData.duration_minutes <= 0) {
      showToast('⚠️ Please select a valid time range (End time must be after Start time).');
      return;
    }

    const newLog = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      facility: `${form.reqRoom.value} (${form.reqBuilding.value})`,
      date: new Date(form.reqDate.value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: timeData.formatted_window,
      purpose: form.reqSubject.value,
      status: 'Pending',
      permit: 'Awaiting Admin'
    };
    bookingLogs.unshift(newLog);
    localStorage.setItem('farms_faculty_bookings_v6', JSON.stringify(bookingLogs));
    renderLogs();
    form.reset();
    reqTimePicker?.reset('08:00', 120);
    showToast(`Request submitted! Check Booking Logs.`);
    switchView('logs');

    // Sync request to backend database and cross-tab broadcast
    const reqPayload = {
      id: newLog.id,
      requester: `${facultyProfile.fullName} (${facultyProfile.facultyId})`,
      room: newLog.facility,
      purpose: newLog.purpose,
      date: `${newLog.date}, ${newLog.time}`,
      start_time: timeData.start_time,
      end_time: timeData.end_time,
      duration_minutes: timeData.duration_minutes,
      status: 'pending'
    };

    if (window.farmsApi) {
      farmsApi.createRequest(reqPayload).catch(err => console.warn('[farmsApi] Request form sync failed:', err));
      farmsApi.broadcastLocalEvent('new_request', reqPayload);
    }
  });

  // ────────────────────────────────────────────────
  // 12. SEARCH
  // ────────────────────────────────────────────────
  document.getElementById('facSearch')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) { renderRooms(); return; }
    const results = ROOM_DATA.filter(r =>
      r.room.toLowerCase().includes(q) ||
      r.bldg.toLowerCase().includes(q) ||
      r.occupant.toLowerCase().includes(q)
    );
    if (!grid) return;
    grid.innerHTML = '';
    if (results.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--fac-text-muted);font-weight:800;">No rooms match "${e.target.value}".</div>`;
      return;
    }
    results.forEach(r => grid.appendChild(makeSqBtn(r)));
  });

  // ────────────────────────────────────────────────
  // 13. TOAST
  // ────────────────────────────────────────────────
  function showToast(msg) {
    const container = document.getElementById('facToasts');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'fac-toast';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .3s'; setTimeout(() => toast.remove(), 300); }, 3000);
  }

});
