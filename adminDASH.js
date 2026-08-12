document.addEventListener('DOMContentLoaded', () => {
  const btnSvgView = document.getElementById('btnSvgView');
  const btnListView = document.getElementById('btnListView');
  const svgContainer = document.getElementById('svgContainer');
  const listContainer = document.getElementById('listContainer');

  const campusMap = document.getElementById('campusMap');
  const buildingMap = document.getElementById('buildingMap');
  const floorPlanContent = document.getElementById('floorPlanContent');
  
  const viewTitle = document.getElementById('viewTitle');
  const backToCampusBtn = document.getElementById('backToCampusBtn');
  
  const campusOverviewGroup = document.getElementById('campusOverviewGroup');
  const storeyGroup = document.getElementById('storeyGroup');
  const storeySelector = document.getElementById('storeySelector');
  
  const listControlGroup = document.getElementById('listControlGroup');
  const listTableBody = document.getElementById('listTableBody');

  // Tooltip Tracking Elements
  const tooltip = document.getElementById('roomTooltip');
  const tooltipRoom = document.getElementById('tooltipRoom');
  const tooltipStatus = document.getElementById('tooltipStatus');
  const tooltipDetail = document.getElementById('tooltipDetail');
  const mapDisplayArea = document.querySelector('.map-display-area');

  const BUILDING_CONFIG = {
    'CBA Building': { floors: 4 },
    'Hangar': { floors: 1 },
    'Pancho Building': { floors: 1 }
  };

  const ROOM_DATA = [
    { building: 'CBA Building', room: 'Room 101', status: 'vacant', occupant: 'None', schedule: '--' },
    { building: 'CBA Building', room: 'Room 102', status: 'occupied', occupant: 'Prof. Santos (CS101)', schedule: '08:00 AM - 10:00 AM' },
    { building: 'CBA Building', room: 'Room 103', status: 'vacant', occupant: 'None', schedule: '--' },
    { building: 'Hangar', room: 'Room H1', status: 'vacant', occupant: 'None', schedule: '--' },
    { building: 'Hangar', room: 'Room H2', status: 'occupied', occupant: 'Engr. Cruz (CPE202)', schedule: '09:00 AM - 12:00 PM' },
    { building: 'Pancho Building', room: 'Room 101', status: 'vacant', occupant: 'None', schedule: '--' },
    { building: 'Pancho Building', room: 'Room 103', status: 'occupied', occupant: 'Dr. Reyes (BUS301)', schedule: '01:00 PM - 03:00 PM' }
  ];

  let activeBuilding = null;
  let activeFloor = 1;
  let activeMode = 'svg';
  let activeListFilter = 'all';

  function updateTitle() {
    if (activeMode === 'list') {
      viewTitle.textContent = activeBuilding ? `${activeBuilding} - Room List` : 'All Buildings - Room List';
    } else {
      viewTitle.textContent = activeBuilding ? `${activeBuilding} - Floor Plans` : 'Live Campus Room Status';
    }
  }

  mapDisplayArea.addEventListener('mousemove', (e) => {
    if (tooltip && !tooltip.classList.contains('hidden')) {
      const rect = mapDisplayArea.getBoundingClientRect();
      tooltip.style.left = `${e.clientX - rect.left + 15}px`;
      tooltip.style.top = `${e.clientY - rect.top + 15}px`;
    }
  });

  function attachRoomTooltips() {
    const roomGroups = document.querySelectorAll('.room-group');
    
    roomGroups.forEach(group => {
      group.addEventListener('mouseenter', () => {
        const textElement = group.querySelector('.room-text');
        const subTextElement = group.querySelector('.sub-text');
        
        if (textElement) {
          tooltipRoom.textContent = textElement.textContent;
          const status = subTextElement ? subTextElement.textContent : 'Unknown';
          tooltipStatus.textContent = status;
          
          if (status.toLowerCase() === 'vacant') {
            tooltipStatus.style.color = '#34d399';
            tooltipDetail.textContent = 'Click to assign room';
          } else {
            tooltipStatus.style.color = '#f87171';
            tooltipDetail.textContent = 'Click to view occupant';
          }

          tooltip.classList.remove('hidden');
        }
      });

      group.addEventListener('mouseleave', () => {
        tooltip.classList.add('hidden');
      });
    });
  }

  btnSvgView.addEventListener('click', () => {
    activeMode = 'svg';
    btnSvgView.classList.add('active');
    btnListView.classList.remove('active');
    
    svgContainer.classList.remove('hidden');
    listContainer.classList.add('hidden');
    listControlGroup.classList.add('hidden');

    if (activeBuilding) {
      openBuildingView(activeBuilding);
    } else {
      campusMap.classList.remove('hidden');
      buildingMap.classList.add('hidden');
      backToCampusBtn.classList.add('hidden');
      campusOverviewGroup.classList.remove('hidden');
      storeyGroup.classList.add('hidden');
    }
    updateTitle();
  });

  btnListView.addEventListener('click', () => {
    activeMode = 'list';
    btnListView.classList.add('active');
    btnSvgView.classList.remove('active');
    
    listContainer.classList.remove('hidden');
    svgContainer.classList.add('hidden');

    campusOverviewGroup.classList.add('hidden');
    storeyGroup.classList.add('hidden');
    backToCampusBtn.classList.add('hidden');
    listControlGroup.classList.remove('hidden');
    tooltip.classList.add('hidden'); 
    
    document.querySelectorAll('.bldg-filter').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-bldg') === (activeBuilding || 'all'));
    });

    updateTitle();
    renderListView();
  });

  const buildingShells = document.querySelectorAll('.clickable-shell');
  buildingShells.forEach(shell => {
    shell.addEventListener('click', () => {
      activeBuilding = shell.getAttribute('data-bldg');
      activeFloor = 1;
      openBuildingView(activeBuilding);
    });
  });

  document.querySelectorAll('.quick-bldg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeBuilding = btn.getAttribute('data-bldg');
      activeFloor = 1;
      openBuildingView(activeBuilding);
    });
  });

  function openBuildingView(buildingName) {
    campusMap.classList.add('hidden');
    buildingMap.classList.remove('hidden');
    campusOverviewGroup.classList.add('hidden');

    if (activeMode === 'svg') {
      backToCampusBtn.classList.remove('hidden');
      storeyGroup.classList.remove('hidden');
    }

    updateTitle();
    buildFloorTabs(buildingName);
    loadFloorSVG(buildingName, activeFloor);
    renderListView();
  }

  function buildFloorTabs(buildingName) {
    storeySelector.innerHTML = '';
    const totalFloors = BUILDING_CONFIG[buildingName]?.floors || 1;

    for (let i = totalFloors; i >= 1; i--) {
      const btn = document.createElement('button');
      btn.className = `storey-btn ${i === activeFloor ? 'active' : ''}`;
      btn.textContent = getFloorLabel(i, buildingName);
      btn.setAttribute('data-floor', i);

      btn.addEventListener('click', () => {
        document.querySelectorAll('.storey-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFloor = i;
        loadFloorSVG(buildingName, activeFloor);
      });

      storeySelector.appendChild(btn);
    }
  }

  function getFloorLabel(floorNum, buildingName) {
    if (buildingName === 'Hangar' && floorNum === 1) return 'Ground Floor';
    if (floorNum === 1) return '1st Floor';
    if (floorNum === 2) return '2nd Floor';
    if (floorNum === 3) return '3rd Floor';
    return `${floorNum}th Floor`;
  }

  const statusFilterBtns = document.querySelectorAll('.status-filter');
  statusFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      statusFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeListFilter = btn.getAttribute('data-filter');
      renderListView();
    });
  });

  const bldgFilterBtns = document.querySelectorAll('.bldg-filter');
  bldgFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      bldgFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const selectedBldg = btn.getAttribute('data-bldg');
      activeBuilding = selectedBldg === 'all' ? null : selectedBldg;
      activeFloor = 1; 
      
      updateTitle();
      renderListView();
    });
  });

  function renderListView() {
    listTableBody.innerHTML = '';

    const filteredRooms = ROOM_DATA.filter(item => {
      const matchesBuilding = activeBuilding ? item.building === activeBuilding : true;
      const matchesStatus = activeListFilter === 'all' ? true : item.status === activeListFilter;
      return matchesBuilding && matchesStatus;
    });

    if (filteredRooms.length === 0) {
      listTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#64748b; padding:24px;">No rooms match the selected filters.</td></tr>`;
      return;
    }

    filteredRooms.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${item.building}</strong></td>
        <td>${item.room}</td>
        <td><span class="status-badge ${item.status}">${item.status.toUpperCase()}</span></td>
        <td>${item.occupant}</td>
        <td>${item.schedule}</td>
        <td><button class="action-btn ${item.status === 'vacant' ? 'primary' : ''}">${item.status === 'vacant' ? 'Assign' : 'View'}</button></td>
      `;
      listTableBody.appendChild(row);
    });
  }

  backToCampusBtn.addEventListener('click', () => {
    campusMap.classList.remove('hidden');
    buildingMap.classList.add('hidden');
    backToCampusBtn.classList.add('hidden');
    storeyGroup.classList.add('hidden');
    tooltip.classList.add('hidden');
    
    if (activeMode === 'svg') {
      campusOverviewGroup.classList.remove('hidden');
    }
    
    activeBuilding = null;
    updateTitle();
    renderListView();
  });

  function loadFloorSVG(building, floor) {
    tooltip.classList.add('hidden');

    if (building === 'CBA Building') {
      const translateY = (4 - floor) * 210;
      floorPlanContent.innerHTML = `
        <svg viewBox="0 0 1100 220" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
          <style>
            .floor-label { font-family: system-ui, sans-serif; font-weight: bold; font-size: 16px; fill: #064e3b; }
            .hallway { fill: #f1f3f5; stroke: #cbd5e1; stroke-dasharray: 4,4; }
            .stair-box { fill: #f8fafc; stroke: #64748b; stroke-width: 2; rx: 4; }
            .stair-step { stroke: #cbd5e1; stroke-width: 1.5; }
            .cr-rect { fill: #ecfdf5; stroke: #064e3b; stroke-width: 2; rx: 4; }
            
            .room-rect { fill: #ffffff; stroke: #334155; stroke-width: 2.5; rx: 6; transition: all 0.2s ease; }
            .room-text { font-family: system-ui, sans-serif; font-weight: bold; font-size: 14px; fill: #0f172a; text-anchor: middle; pointer-events: none; }
            .sub-text { font-family: system-ui, sans-serif; font-size: 11px; fill: #64748b; text-anchor: middle; pointer-events: none; }
            
            .room-group.available .room-rect { fill: #ecfdf5; stroke: #10b981; }
            .room-group.available .sub-text { fill: #047857; }
            .room-group.booked .room-rect { fill: #fff1f2; stroke: #f43f5e; }
            .room-group.booked .sub-text { fill: #be123c; }

            .room-group { cursor: pointer; transform-origin: center; transform-box: fill-box; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
            .room-group:hover { transform: translateY(-3px) scale(1.02); }
            .room-group:hover .room-rect { filter: drop-shadow(0px 6px 10px rgba(6,78,59,0.15)) brightness(0.98); stroke-width: 3.5; stroke: #f59e0b; }
          </style>

          <g transform="translate(-40, -${30 + translateY})">
            <g transform="translate(0, ${translateY})">
              <text x="150" y="65" class="floor-label">${getFloorLabel(floor, building).toUpperCase()}</text>
              <rect x="150" y="45" width="970" height="170" class="hallway"/>

              <g transform="translate(160, 55)">
                <rect width="80" height="150" class="stair-box"/>
                <line x1="10" y1="30" x2="70" y2="30" class="stair-step"/>
                <line x1="10" y1="55" x2="70" y2="55" class="stair-step"/>
                <line x1="10" y1="80" x2="70" y2="80" class="stair-step"/>
                <line x1="10" y1="105" x2="70" y2="105" class="stair-step"/>
                <line x1="10" y1="130" x2="70" y2="130" class="stair-step"/>
                <text x="40" y="142" class="sub-text" font-size="9" font-weight="bold">STAIRS</text>
              </g>

              <g id="room-rect-${floor}01" class="room-group available">
                <rect x="250" y="55" width="160" height="150" class="room-rect"/>
                <text x="330" y="125" class="room-text">Room ${floor}01</text>
                <text id="status-text-${floor}01" x="330" y="145" class="sub-text">Vacant</text>
              </g>

              <g id="room-rect-${floor}02" class="room-group booked">
                <rect x="420" y="55" width="160" height="150" class="room-rect"/>
                <text x="500" y="125" class="room-text">Room ${floor}02</text>
                <text id="status-text-${floor}02" x="500" y="145" class="sub-text">Occupied</text>
              </g>

              <g id="room-rect-${floor}03" class="room-group available">
                <rect x="590" y="55" width="160" height="150" class="room-rect"/>
                <text x="670" y="125" class="room-text">Room ${floor}03</text>
                <text id="status-text-${floor}03" x="670" y="145" class="sub-text">Vacant</text>
              </g>

              <g transform="translate(760, 55)">
                <rect width="80" height="150" class="stair-box"/>
                <line x1="10" y1="30" x2="70" y2="30" class="stair-step"/>
                <line x1="10" y1="55" x2="70" y2="55" class="stair-step"/>
                <line x1="10" y1="80" x2="70" y2="80" class="stair-step"/>
                <line x1="10" y1="105" x2="70" y2="105" class="stair-step"/>
                <line x1="10" y1="130" x2="70" y2="130" class="stair-step"/>
                <text x="40" y="142" class="sub-text" font-size="9" font-weight="bold">STAIRS</text>
              </g>

              <g><rect x="850" y="55" width="90" height="150" class="cr-rect"/><text x="895" y="130" class="room-text" fill="#064e3b">CR</text></g>
            </g>
          </g>
        </svg>
      `;
    } else if (building === 'Hangar') {
      floorPlanContent.innerHTML = `
        <svg viewBox="0 0 1150 380" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
          <style>
            .floor-label { font-family: system-ui, sans-serif; font-weight: bold; font-size: 20px; fill: #064e3b; }
            .room-text { font-family: system-ui, sans-serif; font-weight: bold; font-size: 15px; fill: #0f172a; text-anchor: middle; pointer-events: none; }
            .sub-text { font-family: system-ui, sans-serif; font-size: 12px; fill: #64748b; text-anchor: middle; pointer-events: none; }
            
            .room-rect { fill: #ffffff; stroke: #334155; stroke-width: 2.5; rx: 8; transition: all 0.2s ease; }
            .room-group.available .room-rect { fill: #ecfdf5; stroke: #10b981; }
            .room-group.available .sub-text { fill: #047857; }
            .room-group.booked .room-rect { fill: #fff1f2; stroke: #f43f5e; }
            .room-group.booked .sub-text { fill: #be123c; }
            
            .room-group { cursor: pointer; transform-origin: center; transform-box: fill-box; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
            .room-group:hover { transform: translateY(-3px) scale(1.02); }
            .room-group:hover .room-rect { filter: drop-shadow(0px 6px 10px rgba(6,78,59,0.15)) brightness(0.98); stroke-width: 3.5; stroke: #f59e0b; }
          </style>
          
          <rect x="50" y="20" width="1050" height="340" rx="10" fill="#ffffff" stroke="#064e3b" stroke-width="4"/>
          <text x="100" y="190" transform="rotate(-90, 100, 190)" text-anchor="middle" font-family="system-ui, sans-serif" font-size="24" font-weight="900" fill="#e2e8f0" letter-spacing="8">HANGAR</text>
          <text x="140" y="55" class="floor-label">GROUND FLOOR</text>

          <g transform="translate(0, 10)">
            <g id="room-rect-H3" class="room-group available"><rect x="140" y="50" width="180" height="85" class="room-rect"/><text x="230" y="88" class="room-text">Room H3</text><text id="status-text-H3" x="230" y="108" class="sub-text">Vacant</text></g>
            <g id="room-rect-H2" class="room-group booked"><rect x="140" y="145" width="180" height="85" class="room-rect"/><text x="230" y="183" class="room-text">Room H2</text><text id="status-text-H2" x="230" y="203" class="sub-text">Occupied</text></g>
            <g id="room-rect-H1" class="room-group available"><rect x="140" y="240" width="180" height="85" class="room-rect"/><text x="230" y="278" class="room-text">Room H1</text><text id="status-text-H1" x="230" y="298" class="sub-text">Vacant</text></g>
            
            <rect x="350" y="50" width="460" height="275" fill="#f8fafc" stroke="#cbd5e1" stroke-dasharray="8,8" stroke-width="2" rx="8"/>

            <g id="room-rect-H6" class="room-group available"><rect x="840" y="50" width="180" height="85" class="room-rect"/><text x="930" y="88" class="room-text">Room H6</text><text id="status-text-H6" x="930" y="108" class="sub-text">Vacant</text></g>
            <g id="room-rect-H5" class="room-group booked"><rect x="840" y="145" width="180" height="85" class="room-rect"/><text x="930" y="183" class="room-text">Room H5</text><text id="status-text-H5" x="930" y="203" class="sub-text">Occupied</text></g>
            <g id="room-rect-H4" class="room-group available"><rect x="840" y="240" width="180" height="85" class="room-rect"/><text x="930" y="278" class="room-text">Room H4</text><text id="status-text-H4" x="930" y="298" class="sub-text">Vacant</text></g>
          </g>
        </svg>
      `;
    } else if (building === 'Pancho Building') {
      floorPlanContent.innerHTML = `
        <svg viewBox="40 20 1520 660" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
          <style>
            .floor-label { font-family: system-ui, sans-serif; font-weight: bold; font-size: 20px; fill: #064e3b; }
            .hallway { fill: #f1f3f5; stroke: #cbd5e1; stroke-dasharray: 4,4; }
            .cr-rect { fill: #ecfdf5; stroke: #064e3b; stroke-width: 2.5; rx: 5; }
            
            .room-text { font-family: system-ui, sans-serif; font-weight: bold; font-size: 13px; fill: #0f172a; text-anchor: middle; pointer-events: none; }
            .sub-text { font-family: system-ui, sans-serif; font-size: 10px; fill: #64748b; text-anchor: middle; pointer-events: none; }
            
            .room-rect { fill: #ffffff; stroke: #334155; stroke-width: 2.5; rx: 5; transition: all 0.2s ease; }
            .room-group.available .room-rect { fill: #ecfdf5; stroke: #10b981; }
            .room-group.available .sub-text { fill: #047857; }
            .room-group.booked .room-rect { fill: #fff1f2; stroke: #f43f5e; }
            .room-group.booked .sub-text { fill: #be123c; }
            
            .room-group { cursor: pointer; transform-origin: center; transform-box: fill-box; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
            .room-group:hover { transform: translateY(-3px) scale(1.02); }
            .room-group:hover .room-rect { filter: drop-shadow(0px 6px 10px rgba(6,78,59,0.15)) brightness(0.98); stroke-width: 3.5; stroke: #f59e0b; }
          </style>
          
          <rect x="50" y="30" width="1500" height="640" rx="8" fill="#ffffff" stroke="#064e3b" stroke-width="4"/>
          <text x="70" y="62" class="floor-label">PANCHO BUILDING - GROUND FLOOR</text>

          <rect x="100" y="240" width="1300" height="90" class="hallway"/>
          <rect x="1400" y="240" width="63" height="410" class="hallway"/>
          <text x="700" y="292" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#94a3b8" text-anchor="middle" letter-spacing="8">CORRIDOR</text>

          <g id="room-rect-101" class="room-group available"><rect x="100" y="90" width="80" height="150" class="room-rect"/><text x="140" y="160" class="room-text">Room 101</text><text id="status-text-101" x="140" y="178" class="sub-text">Vacant</text></g>
          <rect x="180" y="90" width="80" height="150" class="cr-rect"/><text x="220" y="170" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#064e3b" text-anchor="middle" pointer-events: none">CR</text>

          <g id="room-rect-103" class="room-group booked"><rect x="260" y="90" width="80" height="150" class="room-rect"/><text x="300" y="160" class="room-text">Room 103</text><text id="status-text-103" x="300" y="178" class="sub-text">Occupied</text></g>
          <g id="room-rect-105" class="room-group available"><rect x="340" y="90" width="80" height="150" class="room-rect"/><text x="380" y="160" class="room-text">Room 105</text><text id="status-text-105" x="380" y="178" class="sub-text">Vacant</text></g>
          <g id="room-rect-107" class="room-group available"><rect x="420" y="90" width="80" height="150" class="room-rect"/><text x="460" y="160" class="room-text">Room 107</text><text id="status-text-107" x="460" y="178" class="sub-text">Vacant</text></g>
          <g id="room-rect-109" class="room-group booked"><rect x="500" y="90" width="80" height="150" class="room-rect"/><text x="540" y="160" class="room-text">Room 109</text><text id="status-text-109" x="540" y="178" class="sub-text">Occupied</text></g>
          <g id="room-rect-111" class="room-group available"><rect x="580" y="90" width="80" height="150" class="room-rect"/><text x="620" y="160" class="room-text">Room 111</text><text id="status-text-111" x="620" y="178" class="sub-text">Vacant</text></g>
          <g id="room-rect-113" class="room-group available"><rect x="660" y="90" width="80" height="150" class="room-rect"/><text x="700" y="160" class="room-text">Room 113</text><text id="status-text-113" x="700" y="178" class="sub-text">Vacant</text></g>

          <g id="room-rect-115" class="room-group booked"><rect x="740" y="90" width="160" height="150" class="room-rect"/><text x="820" y="160" class="room-text">Room 115</text><text id="status-text-115" x="820" y="178" class="sub-text">Occupied</text></g>

          <rect x="900" y="90" width="100" height="150" class="cr-rect"/><text x="950" y="170" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#064e3b" text-anchor="middle" pointer-events: none">CR</text>

          <g id="room-rect-117a" class="room-group available"><rect x="1000" y="90" width="80" height="150" class="room-rect"/><text x="1040" y="160" class="room-text">Room 117A</text><text id="status-text-117a" x="1040" y="178" class="sub-text">Vacant</text></g>
          <g id="room-rect-119" class="room-group available"><rect x="1080" y="90" width="80" height="150" class="room-rect"/><text x="1120" y="160" class="room-text">Room 119</text><text id="status-text-119" x="1120" y="178" class="sub-text">Vacant</text></g>
          <g id="room-rect-121" class="room-group booked"><rect x="1160" y="90" width="80" height="150" class="room-rect"/><text x="1200" y="160" class="room-text">Room 121</text><text id="status-text-121" x="1200" y="178" class="sub-text">Occupied</text></g>
          <g id="room-rect-123a" class="room-group available"><rect x="1240" y="90" width="80" height="150" class="room-rect"/><text x="1280" y="160" class="room-text">Room 123A</text><text id="status-text-123a" x="1280" y="178" class="sub-text">Vacant</text></g>
          <g id="room-rect-125" class="room-group available"><rect x="1320" y="90" width="80" height="150" class="room-rect"/><text x="1360" y="160" class="room-text">Room 125</text><text id="status-text-125" x="1360" y="178" class="sub-text">Vacant</text></g>

          <rect x="1400" y="90" width="143" height="150" class="cr-rect"/><text x="1471.5" y="170" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#064e3b" text-anchor="middle" pointer-events: none">CR</text>

          <g id="room-rect-lecture" class="room-group booked"><rect x="100" y="330" width="80" height="150" class="room-rect"/><text x="140" y="400" class="room-text">Lecture</text><text id="status-text-lecture" x="140" y="418" class="sub-text">Occupied</text></g>

          <g id="room-rect-102" class="room-group available"><rect x="260" y="330" width="80" height="150" class="room-rect"/><text x="300" y="400" class="room-text">Room 102</text><text id="status-text-102" x="300" y="418" class="sub-text">Vacant</text></g>
          <g id="room-rect-104" class="room-group available"><rect x="340" y="330" width="80" height="150" class="room-rect"/><text x="380" y="400" class="room-text">Room 104</text><text id="status-text-104" x="380" y="418" class="sub-text">Vacant</text></g>
          <g id="room-rect-106" class="room-group booked"><rect x="420" y="330" width="80" height="150" class="room-rect"/><text x="460" y="400" class="room-text">Room 106</text><text id="status-text-106" x="460" y="418" class="sub-text">Occupied</text></g>
          <g id="room-rect-108" class="room-group available"><rect x="500" y="330" width="80" height="150" class="room-rect"/><text x="540" y="400" class="room-text">Room 108</text><text id="status-text-108" x="540" y="418" class="sub-text">Vacant</text></g>

          <g id="room-rect-scilab" class="room-group booked"><rect x="580" y="330" width="160" height="150" class="room-rect"/><text x="660" y="400" class="room-text">Science Lab</text><text id="status-text-scilab" x="660" y="418" class="sub-text">Occupied</text></g>

          <g id="room-rect-112a" class="room-group available"><rect x="740" y="330" width="80" height="150" class="room-rect"/><text x="780" y="400" class="room-text">Room 112A</text><text id="status-text-112a" x="780" y="418" class="sub-text">Vacant</text></g>
          <g id="room-rect-112b" class="room-group available"><rect x="820" y="330" width="80" height="150" class="room-rect"/><text x="860" y="400" class="room-text">Room 112B</text><text id="status-text-112b" x="860" y="418" class="sub-text">Vacant</text></g>

          <g id="room-rect-114" class="room-group booked"><rect x="1000" y="330" width="80" height="150" class="room-rect"/><text x="1040" y="400" class="room-text">Room 114</text><text id="status-text-114" x="1040" y="418" class="sub-text">Occupied</text></g>
          <g id="room-rect-116" class="room-group available"><rect x="1080" y="330" width="80" height="150" class="room-rect"/><text x="1120" y="400" class="room-text">Room 116</text><text id="status-text-116" x="1120" y="418" class="sub-text">Vacant</text></g>
          <g id="room-rect-118" class="room-group available"><rect x="1160" y="330" width="80" height="150" class="room-rect"/><text x="1200" y="400" class="room-text">Room 118</text><text id="status-text-118" x="1200" y="418" class="sub-text">Vacant</text></g>
          <g id="room-rect-122" class="room-group booked"><rect x="1240" y="330" width="80" height="150" class="room-rect"/><text x="1280" y="400" class="room-text">Room 122</text><text id="status-text-122" x="1280" y="418" class="sub-text">Occupied</text></g>
          <g id="room-rect-124" class="room-group available"><rect x="1320" y="330" width="80" height="150" class="room-rect"/><text x="1360" y="400" class="room-text">Room 124</text><text id="status-text-124" x="1360" y="418" class="sub-text">Vacant</text></g>

          <g id="room-rect-126" class="room-group available"><rect x="1463" y="285" width="80" height="205" class="room-rect"/><text x="1503" y="380" class="room-text">Library</text><text id="status-text-126" x="1503" y="398" class="sub-text">Vacant</text></g>
          <g id="room-rect-127" class="room-group booked"><rect x="1463" y="490" width="80" height="160" class="room-rect"/><text x="1503" y="565" class="room-text">Multi-</text><text x="1503" y="578" class="room-text">media</text><text id="status-text-127" x="1503" y="596" class="sub-text">Occupied</text></g>
        </svg>
      `;
    }

    attachRoomTooltips();
  }
});