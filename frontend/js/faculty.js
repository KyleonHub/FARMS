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

  const DEFAULT_LOGS = [
    { id: 'REQ-9012', facility: 'Multimedia Room (Pancho Flr 1)', date: 'Aug 28, 2026', time: '02:00 PM - 04:00 PM', purpose: 'Special Department Seminar & Defense', status: 'Approved', permit: 'BSU-KEY-9012' },
    { id: 'REQ-9045', facility: 'Science Laboratory (Pancho Flr 1)', date: 'Aug 29, 2026', time: '09:00 AM - 11:30 AM', purpose: 'Make-up Chemistry Examination', status: 'Approved', permit: 'BSU-KEY-9045' },
    { id: 'REQ-9102', facility: 'Hangar 004 (Aviation Bay)', date: 'Sep 01, 2026', time: '01:00 PM - 03:00 PM', purpose: 'Drone Flight Simulation Demo', status: 'Pending', permit: 'Awaiting Admin' }
  ];

  const ROOM_DATA = [
    { bldg: 'Pancho Building', roomCode: 'PANCHO 101', room: '101', floor: 1, status: 'vacant',      occupant: 'Unassigned',           schedule: 'Open', capacity: 45 },
    { bldg: 'Pancho Building', roomCode: 'PANCHO 103', room: '103', floor: 1, status: 'occupied',    occupant: 'Dr. Reyes (BUS301)',    schedule: '08:00 AM – 11:00 AM', capacity: 45 },
    { bldg: 'Pancho Building', roomCode: 'PANCHO 105', room: '105', floor: 1, status: 'vacant',      occupant: 'Unassigned',           schedule: 'Open', capacity: 45 },
    { bldg: 'Pancho Building', roomCode: 'PANCHO SCILAB', room: 'Science Laboratory', floor: 1, status: 'occupied', occupant: 'Dr. Lim (BIO102)', schedule: '01:30 PM – 03:30 PM', capacity: 40 },
    { bldg: 'Pancho Building', roomCode: 'PANCHO LEC', room: 'Lecture Room',       floor: 1, status: 'occupied', occupant: 'Prof. Gomez (ENG101)', schedule: '09:00 AM – 12:00 PM', capacity: 60 },
    { bldg: 'Pancho Building', roomCode: 'PANCHO MULTIMEDIA', room: 'Multimedia Room',    floor: 1, status: 'occupied', occupant: 'Prof. Santos (CS101)', schedule: '02:00 PM – 04:00 PM', capacity: 50 },
    { bldg: 'CBA Building',    roomCode: 'CBA 101', room: 'CBA 101', floor: 1,  status: 'vacant',      occupant: 'Unassigned',           schedule: 'Open', capacity: 45 },
    { bldg: 'CBA Building',    roomCode: 'CBA 102', room: 'CBA 102', floor: 1,  status: 'occupied',    occupant: 'Prof. Santos (CS101)', schedule: '08:30 AM – 10:00 AM', capacity: 50 },
    { bldg: 'CBA Building',    roomCode: 'CBA 103', room: 'CBA 103', floor: 1,  status: 'vacant',      occupant: 'Unassigned',           schedule: 'Open', capacity: 45 },
    { bldg: 'CBA Building',    roomCode: 'CBA 202', room: 'CBA 202', floor: 2,  status: 'vacant',      occupant: 'Unassigned',           schedule: 'Open', capacity: 45 },
    { bldg: 'Hangar',          roomCode: 'H 001', room: 'Hangar 001', floor: 1, status: 'occupied',  occupant: 'Engr. Cruz (AERO202)', schedule: '08:00 AM – 12:00 PM', capacity: 35 },
    { bldg: 'Hangar',          roomCode: 'H 002', room: 'Hangar 002', floor: 1, status: 'vacant',    occupant: 'Unassigned',           schedule: 'Open', capacity: 35 },
    { bldg: 'Hangar',          roomCode: 'H 003', room: 'Hangar 003', floor: 1, status: 'vacant',    occupant: 'Unassigned',           schedule: 'Open', capacity: 35 },
    { bldg: 'Hangar',          roomCode: 'H 004', room: 'Hangar 004', floor: 1, status: 'occupied',  occupant: 'Prof. De Vega (UAV101)', schedule: '01:00 PM – 04:00 PM', capacity: 35 },
    { bldg: 'Hangar',          roomCode: 'H 005', room: 'Hangar 005', floor: 1, status: 'vacant',    occupant: 'Unassigned',           schedule: 'Open', capacity: 35 },
    { bldg: 'Hangar',          roomCode: 'H 006', room: 'Hangar 006', floor: 1, status: 'maintenance', occupant: 'Facility Maintenance', schedule: 'All Day', capacity: 35 }
  ];

  let facultyProfile = JSON.parse(localStorage.getItem('farms_faculty_profile')) || DEFAULT_PROFILE;
  let bookingLogs    = JSON.parse(localStorage.getItem('farms_faculty_bookings')) || DEFAULT_LOGS;

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
    if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
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
  // 5. LIVE TIMESTAMP
  // ────────────────────────────────────────────────
  function updateTimestamp() {
    const el = document.getElementById('liveTimestamp');
    if (!el) return;
    const now = new Date();
    el.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) +
      ' — ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  updateTimestamp();
  setInterval(updateTimestamp, 60000);

  // ────────────────────────────────────────────────
  // 6. PROFILE
  // ────────────────────────────────────────────────
  function renderProfile() {
    const initial = facultyProfile.fullName.replace(/^(Prof\.|Dr\.|Engr\.)\s*/i, '').charAt(0).toUpperCase() || 'F';

    const els = {
      greetingFacultyName: facultyProfile.fullName,
      profileAvatarBig: initial,
      profileNameDisplay: facultyProfile.fullName,
      profileDeptDisplay: facultyProfile.department
    };
    Object.entries(els).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    });

    // Topbar avatar
    const avatar = document.getElementById('facAvatarBtn');
    if (avatar) avatar.textContent = initial;

    // Form fields
    ['profFullName', 'profFacultyId', 'profDepartment', 'profTitle', 'profEmail', 'profPhone', 'profOfficeHours'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const map = { profFullName: 'fullName', profFacultyId: 'facultyId', profDepartment: 'department', profTitle: 'title', profEmail: 'email', profPhone: 'phone', profOfficeHours: 'officeHours' };
      el.value = facultyProfile[map[id]] || '';
    });
  }

  renderProfile();

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
    localStorage.setItem('farms_faculty_profile', JSON.stringify(facultyProfile));
    renderProfile();
    showToast('✅ Profile updated successfully!');
  });

  // ────────────────────────────────────────────────
  // 7. FLOATING TOOLTIP
  // ────────────────────────────────────────────────
  const floatTip = document.createElement('div');
  floatTip.id = 'facFloatTip';
  document.body.appendChild(floatTip);

  function showTip(r, anchorEl) {
    const statusColor = { vacant: '#4ade80', occupied: '#f87171', maintenance: '#fbbf24' }[r.status];
    const statusLabel = { vacant: '🟢 Vacant — Open for Booking', occupied: '🔴 Occupied', maintenance: '🟡 Under Maintenance' }[r.status];
    floatTip.innerHTML = `
      <div class="tip-room">${r.room}</div>
      <div class="tip-status" style="color:${statusColor};">${statusLabel}</div>
      <div class="tip-row"><span class="tip-key">Building</span><span class="tip-val">${r.bldg}</span></div>
      <div class="tip-row"><span class="tip-key">Floor</span><span class="tip-val">Floor ${r.floor}</span></div>
      <div class="tip-row"><span class="tip-key">Capacity</span><span class="tip-val">${r.capacity} seats</span></div>
      <div class="tip-row"><span class="tip-key">Occupant</span><span class="tip-val">${r.occupant}</span></div>
      <div class="tip-row"><span class="tip-key">Schedule</span><span class="tip-val">${r.schedule}</span></div>
      ${r.status === 'vacant' ? '<div class="tip-cta">⚡ Click to Request Access</div>' : ''}
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
    const icons = { vacant: '🟢', occupied: '🔴', maintenance: '🟡' };
    const btn = document.createElement('button');
    btn.className = `fac-room-sqbtn ${r.status}`;
    btn.setAttribute('aria-label', `${r.room} — ${r.status}`);
    btn.innerHTML = `
      <span class="fac-sqbtn-icon">${icons[r.status]}</span>
      <span class="fac-sqbtn-name">${r.room}</span>
      <span class="fac-sqbtn-floor">Flr ${r.floor}</span>
    `;
    btn.addEventListener('mouseenter', () => showTip(r, btn));
    btn.addEventListener('mouseleave', hideTip);
    btn.addEventListener('click', () => { hideTip(); openRoomModal(r); });
    return btn;
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
  // 8. CAMPUS MAP (SVG)
  // ────────────────────────────────────────────────
  function renderCampusMap() {
    const cont = document.getElementById('facMapContent');
    if (!cont) return;
    cont.innerHTML = `
      <div style="padding:20px;">
        <p style="font-size:0.8rem; font-weight:700; color:#94a3b8; margin-bottom:12px;">Click a building to inspect floors &amp; rooms.</p>
        <svg viewBox="0 0 1000 600" width="100%" style="max-height:400px;">
          <rect width="1000" height="600" fill="transparent"/>
          <path d="M 0 300 Q 500 280 1000 300" stroke="#cbd5e1" stroke-width="32" fill="none"/>
          <g class="fac-campus-bldg" data-bldg="Pancho Building" style="cursor:pointer;" transform="translate(60, 60)">
            <rect width="400" height="180" rx="12" fill="#047857" stroke="#065f46" stroke-width="3"/>
            <text x="200" y="85" font-family="Plus Jakarta Sans,system-ui" font-weight="900" font-size="22" fill="#fff" text-anchor="middle">🏛️ PANCHO BUILDING</text>
            <text x="200" y="115" font-family="Plus Jakarta Sans,system-ui" font-weight="700" font-size="13" fill="#a7f3d0" text-anchor="middle">2 Floors · 50 Classrooms &amp; Labs</text>
            <rect x="140" y="130" width="120" height="26" rx="13" fill="rgba(0,0,0,.25)"/>
            <text x="200" y="148" font-family="Plus Jakarta Sans,system-ui" font-weight="800" font-size="11" fill="#facc15" text-anchor="middle">⚡ Click to Inspect</text>
          </g>
          <g class="fac-campus-bldg" data-bldg="CBA Building" style="cursor:pointer;" transform="translate(560, 60)">
            <rect width="380" height="180" rx="12" fill="#1d4ed8" stroke="#1e40af" stroke-width="3"/>
            <text x="190" y="85" font-family="Plus Jakarta Sans,system-ui" font-weight="900" font-size="22" fill="#fff" text-anchor="middle">🏢 CBA BUILDING</text>
            <text x="190" y="115" font-family="Plus Jakarta Sans,system-ui" font-weight="700" font-size="13" fill="#bfdbfe" text-anchor="middle">4 Storeys · Business &amp; Computing</text>
            <rect x="130" y="130" width="120" height="26" rx="13" fill="rgba(0,0,0,.25)"/>
            <text x="190" y="148" font-family="Plus Jakarta Sans,system-ui" font-weight="800" font-size="11" fill="#facc15" text-anchor="middle">⚡ Click to Inspect</text>
          </g>
          <g class="fac-campus-bldg" data-bldg="Hangar" style="cursor:pointer;" transform="translate(200, 360)">
            <rect width="600" height="190" rx="12" fill="#0369a1" stroke="#075985" stroke-width="3"/>
            <text x="300" y="90" font-family="Plus Jakarta Sans,system-ui" font-weight="900" font-size="24" fill="#fff" text-anchor="middle">✈️ HANGAR AVIATION COMPLEX</text>
            <text x="300" y="120" font-family="Plus Jakarta Sans,system-ui" font-weight="700" font-size="13" fill="#bae6fd" text-anchor="middle">1 Storey · 6 Aviation Engineering Bays</text>
            <rect x="240" y="135" width="120" height="26" rx="13" fill="rgba(0,0,0,.25)"/>
            <text x="300" y="153" font-family="Plus Jakarta Sans,system-ui" font-weight="800" font-size="11" fill="#facc15" text-anchor="middle">⚡ Click to Inspect</text>
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
    if (modal) modal.classList.add('open');

    // Hide form for occupied/maintenance
    const formEl = document.getElementById('facModalForm');
    if (formEl) formEl.style.display = r.status === 'vacant' ? '' : 'none';
  }

  modalClose?.addEventListener('click', () => modal?.classList.remove('open'));
  modal?.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });

  modalForm?.addEventListener('submit', e => {
    e.preventDefault();
    if (!selectedRoom) return;
    const subj = document.getElementById('facModalSubject')?.value.trim() || 'N/A';
    const time = document.getElementById('facModalTime')?.value.trim() || 'N/A';
    const newLog = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      facility: `${selectedRoom.room} (${selectedRoom.bldg})`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time,
      purpose: subj,
      status: 'Pending',
      permit: 'Awaiting Admin'
    };
    bookingLogs.unshift(newLog);
    localStorage.setItem('farms_faculty_bookings', JSON.stringify(bookingLogs));
    renderLogs();
    modal?.classList.remove('open');
    modalForm.reset();
    showToast(`✅ Request submitted for ${selectedRoom.room}!`);
  });

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

      const badgeCls = log.status === 'Approved' ? 'fac-badge-approved' : log.status === 'Denied' ? 'fac-badge-denied' : 'fac-badge-pending';
      const badgeText = log.status === 'Approved' ? '✓ Approved' : log.status === 'Denied' ? '✕ Denied' : '⏳ Pending';

      const permitHtml = log.status === 'Pending'
        ? `<button class="fac-btn-reset" style="height:30px; padding:0 12px; font-size:0.72rem; color:#ef4444; border-color:#ef4444;" onclick="window.cancelFacReq('${log.id}')">Cancel</button>`
        : `<code style="background:#f0fdf4; color:#047857; padding:3px 10px; border-radius:6px; font-weight:900; font-size:0.78rem;">${log.permit}</code>`;

      const card = document.createElement('div');
      card.className = 'fac-log-card';
      card.innerHTML = `
        <div class="fac-log-top">
          <div>
            <div class="fac-log-id">${log.id}</div>
            <div class="fac-log-room">${log.facility}</div>
          </div>
          <span class="fac-status-badge ${badgeCls}">${badgeText}</span>
        </div>
        <div class="fac-log-meta-row">
          <span>📅 ${log.date}</span>
          <span>🕐 ${log.time}</span>
        </div>
        <div class="fac-log-purpose">📋 ${log.purpose}</div>
        <div class="fac-log-footer">
          <span style="font-size:0.72rem; color:#94a3b8;">Permit:</span>
          ${permitHtml}
        </div>
      `;
      list.appendChild(card);
    });

    // Update KPI counters
    const elApproved = document.getElementById('statApprovedCount');
    const elPending  = document.getElementById('statPendingCount');
    const sidebarBadge = document.getElementById('sidebarLogBadge');
    const mobileBadge  = document.getElementById('mobileLogBadge');

    if (elApproved) elApproved.textContent = approved;
    if (elPending)  elPending.textContent  = pending;
    if (sidebarBadge) sidebarBadge.textContent = pending;
    if (mobileBadge)  mobileBadge.textContent  = pending;
    if (sidebarBadge) sidebarBadge.style.display = pending > 0 ? '' : 'none';
    if (mobileBadge)  mobileBadge.style.display  = pending > 0 ? '' : 'none';
  }

  // Global cancel handler
  window.cancelFacReq = (id) => {
    bookingLogs = bookingLogs.filter(l => l.id !== id);
    localStorage.setItem('farms_faculty_bookings', JSON.stringify(bookingLogs));
    renderLogs();
    showToast('🗑 Request cancelled.');
  };

  renderLogs();

  // ────────────────────────────────────────────────
  // 11. REQUEST FORM
  // ────────────────────────────────────────────────
  document.getElementById('facRequestForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    const newLog = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      facility: `${form.reqRoom.value} (${form.reqBuilding.value})`,
      date: new Date(form.reqDate.value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: form.reqTime.value,
      purpose: form.reqSubject.value,
      status: 'Pending',
      permit: 'Awaiting Admin'
    };
    bookingLogs.unshift(newLog);
    localStorage.setItem('farms_faculty_bookings', JSON.stringify(bookingLogs));
    renderLogs();
    form.reset();
    showToast(`✅ Request submitted! Check Booking Logs.`);
    switchView('logs');
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
    results.forEach(r => {
      // Re-render matching cards
      const pillClass = r.status === 'vacant' ? 'pill-vacant' : r.status === 'occupied' ? 'pill-occupied' : 'pill-maintenance';
      const pillText  = r.status === 'vacant' ? '🟢 Vacant' : r.status === 'occupied' ? '🔴 Occupied' : '🟡 Maintenance';
      const btn = r.status === 'vacant'
        ? `<button class="fac-rc-btn fac-rc-btn-primary">⚡ Request Room</button>`
        : `<button class="fac-rc-btn fac-rc-btn-ghost">View Details</button>`;
      const card = document.createElement('div');
      card.className = `fac-room-card ${r.status}`;
      card.innerHTML = `
        <div class="fac-rc-head">
          <div><div class="fac-rc-room">${r.room}</div><div class="fac-rc-bldg">${r.bldg} · Floor ${r.floor}</div></div>
          <span class="fac-rc-pill ${pillClass}">${pillText}</span>
        </div>
        <div class="fac-rc-body">
          <div class="fac-rc-info-row"><span class="fac-rc-key">Capacity</span><span class="fac-rc-val">${r.capacity} Seats</span></div>
          <div class="fac-rc-info-row"><span class="fac-rc-key">Occupant</span><span class="fac-rc-val">${r.occupant}</span></div>
          <div class="fac-rc-info-row"><span class="fac-rc-key">Schedule</span><span class="fac-rc-val ${r.status === 'vacant' ? 'green' : ''}">${r.schedule}</span></div>
        </div>
        <div class="fac-rc-foot">${btn}</div>
      `;
      card.querySelector('button').addEventListener('click', () => openRoomModal(r));
      grid.appendChild(card);
    });
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
