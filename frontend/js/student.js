/**
 * FARMS - Student Dashboard Logic
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Dark Mode Toggle
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeLabelText = document.getElementById('themeLabelText');
  const savedTheme = localStorage.getItem('farms-theme') || 
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('farms-theme', theme);
    if (themeLabelText) themeLabelText.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
  }
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ── Retractable Sidebar Logic ──
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const appLayout = document.querySelector('.admin-app-layout');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');

  const savedSidebarState = localStorage.getItem('farms_sidebar_collapsed') === 'true';
  if (savedSidebarState && window.innerWidth > 768 && appLayout) {
    appLayout.classList.add('sidebar-collapsed');
  }

  if (sidebarToggleBtn && appLayout) {
    sidebarToggleBtn.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        appLayout.classList.toggle('sidebar-mobile-open');
      } else {
        appLayout.classList.toggle('sidebar-collapsed');
        localStorage.setItem('farms_sidebar_collapsed', appLayout.classList.contains('sidebar-collapsed'));
      }
    });
  }

  if (sidebarBackdrop && appLayout) {
    sidebarBackdrop.addEventListener('click', () => {
      appLayout.classList.remove('sidebar-mobile-open');
    });
  }

  // 2. Navigation View Switcher
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item[data-view]');
  const views = document.querySelectorAll('.content-view');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = item.getAttribute('data-view');
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      views.forEach(v => {
        if (v.id === `view-${targetView}`) {
          v.classList.add('active');
        } else {
          v.classList.remove('active');
        }
      });
    });
  });

  // 3. Map Interaction
  const campusMap = document.getElementById('campusMap');
  const buildingMap = document.getElementById('buildingMap');
  const floorPlanContent = document.getElementById('floorPlanContent');
  const sidebarCampusBlock = document.getElementById('sidebarCampusBlock');
  const sidebarBuildingBlock = document.getElementById('sidebarBuildingBlock');
  const backToCampusBtn = document.getElementById('backToCampusBtn');
  const storeySelector = document.getElementById('storeySelector');
  const bldgHeroTitle = document.getElementById('bldgHeroTitle');
  const contextMainLabel = document.getElementById('contextMainLabel');
  const floorTelemetryDock = document.getElementById('floorTelemetryDock');
  const dockRoomName = document.getElementById('dockRoomName');
  const dockRoomStatus = document.getElementById('dockRoomStatus');
  const dockRoomOccupant = document.getElementById('dockRoomOccupant');
  const dockRoomSchedule = document.getElementById('dockRoomSchedule');

  let activeBldg = 'Pancho Building';
  let activeFlr = 1;

  const ROOM_DATA = [
    { bldg: 'Pancho Building', room: '101', floor: 1, status: 'vacant', occupant: 'Open Study Space', schedule: 'No class currently', capacity: 45 },
    { bldg: 'Pancho Building', room: '103', floor: 1, status: 'occupied', occupant: 'Dr. Reyes (BUS301)', schedule: 'Business Ethics Lecture', capacity: 45 },
    { bldg: 'Pancho Building', room: '105', floor: 1, status: 'vacant', occupant: 'Open Study Space', schedule: 'No class currently', capacity: 45 },
    { bldg: 'Pancho Building', room: 'Science Laboratory', floor: 1, status: 'occupied', occupant: 'Dr. Lim (BIO102)', schedule: 'General Biology Lab', capacity: 40 },
    { bldg: 'Pancho Building', room: 'Multimedia Room', floor: 1, status: 'occupied', occupant: 'Prof. Santos (CS101)', schedule: 'Multimedia Lecture', capacity: 50 },
    { bldg: 'CBA Building', room: 'CBA 101', floor: 1, status: 'vacant', occupant: 'Open Study Space', schedule: 'Available for Study', capacity: 45 },
    { bldg: 'CBA Building', room: 'CBA 102', floor: 1, status: 'occupied', occupant: 'Prof. Santos (CS101)', schedule: 'Intro to Programming', capacity: 50 },
    { bldg: 'CBA Building', room: 'CBA 103', floor: 1, status: 'vacant', occupant: 'Open Study Space', schedule: 'Available for Study', capacity: 45 },
    { bldg: 'Hangar', room: 'Hangar 001', floor: 1, status: 'occupied', occupant: 'Engr. Cruz (AERO101)', schedule: 'Powerplants Session', capacity: 35 },
    { bldg: 'Hangar', room: 'Hangar 002', floor: 1, status: 'vacant', occupant: 'Open Study Space', schedule: 'Available for Study', capacity: 35 },
    { bldg: 'Hangar', room: 'Hangar 003', floor: 1, status: 'vacant', occupant: 'Open Study Space', schedule: 'Available for Study', capacity: 35 },
    { bldg: 'Hangar', room: 'Hangar 004', floor: 1, status: 'occupied', occupant: 'Prof. De Vega (UAV101)', schedule: 'Drone Testing Lab', capacity: 35 }
  ];

  function openBuilding(bldgName, floorNum = 1) {
    activeBldg = bldgName;
    activeFlr = floorNum;
    campusMap.classList.add('hidden');
    buildingMap.classList.remove('hidden');
    sidebarCampusBlock.classList.add('hidden');
    sidebarBuildingBlock.classList.remove('hidden');

    if (bldgHeroTitle) bldgHeroTitle.textContent = bldgName;
    if (contextMainLabel) contextMainLabel.textContent = `${bldgName} (Flr ${floorNum})`;

    buildStoreyPills(bldgName, floorNum);
    renderFloor(bldgName, floorNum);
  }

  function openCampus() {
    campusMap.classList.remove('hidden');
    buildingMap.classList.add('hidden');
    sidebarCampusBlock.classList.remove('hidden');
    sidebarBuildingBlock.classList.add('hidden');
    if (contextMainLabel) contextMainLabel.textContent = 'Campus Overview';
    if (floorTelemetryDock) floorTelemetryDock.classList.add('hidden');
  }

  function buildStoreyPills(bldgName, currentFlr) {
    if (!storeySelector) return;
    storeySelector.innerHTML = '';
    const floors = bldgName === 'CBA Building' ? 4 : bldgName === 'Pancho Building' ? 2 : 1;

    for (let f = 1; f <= floors; f++) {
      const btn = document.createElement('button');
      btn.className = `floor-pill-btn ${f === currentFlr ? 'active' : ''}`;
      btn.textContent = `Level ${f}`;
      btn.addEventListener('click', () => openBuilding(bldgName, f));
      storeySelector.appendChild(btn);
    }
  }

  function renderFloor(bldgName, floorNum) {
    if (bldgName === 'CBA Building') {
      floorPlanContent.innerHTML = `
        <svg viewBox="0 0 1280 340" width="100%" height="100%">
          <rect x="15" y="10" width="1250" height="315" rx="12" fill="#061122" stroke="#1e2d4a" stroke-width="2"/>
          <text x="60" y="55" font-family="Plus Jakarta Sans" font-weight="900" font-size="18" fill="#38bdf8">🏢 CBA BUILDING — LEVEL ${floorNum} BLUEPRINT</text>
          <g class="room-group available" data-room="CBA ${floorNum}01"><rect x="180" y="105" width="270" height="160" rx="8" class="room-rect"/><text x="315" y="180" font-family="Plus Jakarta Sans" font-weight="900" font-size="16" fill="#fff" text-anchor="middle" class="room-text">CBA ${floorNum}01</text></g>
          <g class="room-group booked" data-room="CBA ${floorNum}02"><rect x="465" y="105" width="270" height="160" rx="8" class="room-rect"/><text x="600" y="180" font-family="Plus Jakarta Sans" font-weight="900" font-size="16" fill="#fff" text-anchor="middle" class="room-text">CBA ${floorNum}02</text></g>
          <g class="room-group available" data-room="CBA ${floorNum}03"><rect x="750" y="105" width="270" height="160" rx="8" class="room-rect"/><text x="885" y="180" font-family="Plus Jakarta Sans" font-weight="900" font-size="16" fill="#fff" text-anchor="middle" class="room-text">CBA ${floorNum}03</text></g>
        </svg>
      `;
    } else if (bldgName === 'Hangar') {
      floorPlanContent.innerHTML = `
        <svg viewBox="0 0 1380 560" width="100%" height="100%">
          <rect x="15" y="10" width="1350" height="540" rx="14" fill="#061122" stroke="#1e2d4a" stroke-width="2.5"/>
          <text x="45" y="55" font-family="Plus Jakarta Sans" font-weight="900" font-size="18" fill="#38bdf8">✈️ HANGAR COMPLEX — BLUEPRINT</text>
          <g class="room-group booked" data-room="Hangar 001"><rect x="45" y="105" width="290" height="130" rx="8" class="room-rect"/><text x="190" y="175" class="room-text" fill="#fff" text-anchor="middle">Hangar 001</text></g>
          <g class="room-group available" data-room="Hangar 002"><rect x="45" y="250" width="290" height="130" rx="8" class="room-rect"/><text x="190" y="320" class="room-text" fill="#fff" text-anchor="middle">Hangar 002</text></g>
          <g class="room-group available" data-room="Hangar 003"><rect x="45" y="395" width="290" height="130" rx="8" class="room-rect"/><text x="190" y="465" class="room-text" fill="#fff" text-anchor="middle">Hangar 003</text></g>
          <g transform="translate(355, 105)"><rect width="670" height="420" fill="#0a1526" stroke="#1e2d4a" stroke-dasharray="4,4" rx="10"/><text x="335" y="220" font-family="Plus Jakarta Sans" font-size="18" font-weight="900" fill="#38bdf8" text-anchor="middle">🛫 CENTRAL HANGAR HALL</text></g>
          <g class="room-group booked" data-room="Hangar 004"><rect x="1045" y="105" width="290" height="130" rx="8" class="room-rect"/><text x="1190" y="175" class="room-text" fill="#fff" text-anchor="middle">Hangar 004</text></g>
          <g class="room-group available" data-room="Hangar 005"><rect x="1045" y="250" width="290" height="130" rx="8" class="room-rect"/><text x="1190" y="320" class="room-text" fill="#fff" text-anchor="middle">Hangar 005</text></g>
          <g class="room-group maintenance" data-room="Hangar 006"><rect x="1045" y="395" width="290" height="130" rx="8" class="room-rect"/><text x="1190" y="465" class="room-text" fill="#fff" text-anchor="middle">Hangar 006</text></g>
        </svg>
      `;
    } else {
      floorPlanContent.innerHTML = `
        <svg viewBox="0 0 1560 490" width="100%" height="100%">
          <rect x="15" y="10" width="1530" height="465" rx="14" fill="#061122" stroke="#1e2d4a" stroke-width="2.5"/>
          <text x="780" y="55" font-family="Plus Jakarta Sans" font-weight="900" font-size="22" fill="#34d399" text-anchor="middle">🏛️ PANCHO BUILDING — LEVEL ${floorNum} BLUEPRINT</text>
          <path d="M 40 170 L 1450 170 L 1450 215 L 1380 215 L 1380 445 L 1340 445 L 1340 215 L 40 215 Z" fill="#0a1526" stroke="#1e2d4a" stroke-width="1.5"/>
          <g class="room-group available" data-room="101"><rect x="40" y="90" width="90" height="80" rx="6" class="room-rect"/><text x="85" y="135" fill="#fff" class="room-text">101</text></g>
          <g class="room-group booked" data-room="103"><rect x="180" y="90" width="80" height="80" rx="6" class="room-rect"/><text x="220" y="135" fill="#fff" class="room-text">103</text></g>
          <g class="room-group available" data-room="105"><rect x="265" y="90" width="80" height="80" rx="6" class="room-rect"/><text x="305" y="135" fill="#fff" class="room-text">105</text></g>
          <g class="room-group booked" data-room="Science Laboratory"><rect x="480" y="215" width="190" height="80" rx="6" class="room-rect"/><text x="575" y="260" fill="#fff" class="room-text">🧪 Science Lab</text></g>
          <g class="room-group booked" data-room="Multimedia Room"><rect x="1380" y="320" width="70" height="110" rx="6" class="room-rect"/><text x="1415" y="375" fill="#fff" class="room-text">🎬 AVR</text></g>
        </svg>
      `;
    }

    attachRoomListeners();
  }

  function attachRoomListeners() {
    document.querySelectorAll('.room-group').forEach(group => {
      const roomName = group.getAttribute('data-room');
      const rObj = ROOM_DATA.find(r => r.room === roomName || roomName.includes(r.room)) || {
        room: roomName, status: 'vacant', occupant: 'Open Study Space', schedule: 'Available for Study', capacity: 45
      };

      group.addEventListener('mouseenter', () => {
        if (floorTelemetryDock) {
          dockRoomName.textContent = rObj.room;
          dockRoomStatus.textContent = rObj.status.toUpperCase();
          dockRoomStatus.className = `tooltip-status ${rObj.status}`;
          dockRoomOccupant.textContent = rObj.occupant;
          dockRoomSchedule.textContent = rObj.schedule;
          floorTelemetryDock.classList.remove('hidden');
        }
      });

      group.addEventListener('mouseleave', () => {
        if (floorTelemetryDock) floorTelemetryDock.classList.add('hidden');
      });

      group.addEventListener('click', () => {
        openModal(rObj);
      });
    });
  }

  // Campus clicks
  document.querySelectorAll('.interactive-bldg').forEach(b => {
    b.addEventListener('click', () => {
      const name = b.getAttribute('data-bldg');
      openBuilding(name, 1);
    });
  });

  document.querySelectorAll('.bldg-jump-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const jump = btn.getAttribute('data-jump');
      openBuilding(jump, 1);
    });
  });

  if (backToCampusBtn) backToCampusBtn.addEventListener('click', openCampus);

  // Modal
  const modal = document.getElementById('roomModalBackdrop');
  const modalClose = document.getElementById('modalCloseBtn');
  const modalRoomTitle = document.getElementById('modalRoomTitle');
  const modalBldgBadge = document.getElementById('modalBldgBadge');
  const modalStatusText = document.getElementById('modalStatusText');
  const modalOccupant = document.getElementById('modalOccupant');
  const modalSchedule = document.getElementById('modalSchedule');

  function openModal(r) {
    if (!modal) return;
    modalRoomTitle.textContent = r.room;
    modalBldgBadge.textContent = r.bldg || activeBldg;
    modalStatusText.textContent = r.status === 'vacant' ? 'OPEN STUDY ROOM' : 'CLASS IN SESSION';
    modalOccupant.textContent = r.occupant;
    modalSchedule.textContent = r.schedule;
    modal.classList.remove('hidden');
  }

  if (modalClose) modalClose.addEventListener('click', () => modal.classList.add('hidden'));
});
