/**
 * FARMS (Faculty Availability & Room Management System)
 * Master Client Application Script - Adaptive Sidebar & Blueprint Grid Architecture
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. INITIAL SEED DATA & STATE
  // ==========================================
  
  function getOrGenerateRoomCode(r) {
    const bldg = (r.building || r.bldg || '').trim();
    const roomName = (r.room || '').trim();
    const numMatch = roomName.match(/\d+[A-Za-z]?/);
    if (bldg.includes('Pancho')) {
      if (numMatch) return `PANCHO ${numMatch[0]}`;
      if (/lecture/i.test(roomName)) return 'PANCHO LEC';
      if (/science|scilab/i.test(roomName)) return 'PANCHO SCILAB';
      if (/multimedia|avr/i.test(roomName)) return 'PANCHO MULTIMEDIA';
      if (/library|lib/i.test(roomName)) return 'PANCHO LIB';
      if (/sped/i.test(roomName)) return 'PANCHO SPED';
      if (/unites/i.test(roomName)) return 'PANCHO UNITES';
      if (/pta/i.test(roomName)) return 'PANCHO PTA';
      if (/sto/i.test(roomName)) return 'PANCHO STO';
      if (/scouts/i.test(roomName)) return 'PANCHO SCOUTS';
      const cleanName = roomName.replace(/^Pancho\s*/i, '').toUpperCase();
      return `PANCHO ${cleanName}`;
    } else if (bldg.includes('CBA')) {
      if (numMatch) return `CBA ${numMatch[0]}`;
      const cleanName = roomName.replace(/^CBA\s*/i, '').toUpperCase();
      return `CBA ${cleanName}`;
    } else if (bldg.includes('Hangar')) {
      if (numMatch) return `H ${numMatch[0]}`;
      const cleanName = roomName.replace(/^Hangar\s*/i, '').toUpperCase();
      return `H ${cleanName}`;
    }
    return r.roomCode || roomName;
  }

  const DEFAULT_ROOMS = [
    // CBA Building (4 Storeys, 3 rooms each = 12 rooms)
    // Floor 1
    { id: 'cba-101', building: 'CBA Building', floor: 1, roomCode: 'CBA 101', room: 'CBA 101', type: 'Lecture Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Dual Projectors, Sound System, Whiteboard' },
    { id: 'cba-102', building: 'CBA Building', floor: 1, roomCode: 'CBA 102', room: 'CBA 102', type: 'Computer Lab', status: 'occupied', occupant: 'Prof. Santos (CS101)', schedule: '08:00 AM - 10:00 AM', capacity: 40, equipment: '40 PC Workstations, Smart TV' },
    { id: 'cba-103', building: 'CBA Building', floor: 1, roomCode: 'CBA 103', room: 'CBA 103', type: 'Business Lab', status: 'vacant', occupant: 'None', schedule: '--', capacity: 35, equipment: 'Smart Board, Conference Setup' },
    // Floor 2
    { id: 'cba-201', building: 'CBA Building', floor: 2, roomCode: 'CBA 201', room: 'CBA 201', type: 'Smart Classroom', status: 'occupied', occupant: 'Dr. Reyes (BUS201)', schedule: '10:00 AM - 12:00 PM', capacity: 40, equipment: 'Interactive Display, Sound System' },
    { id: 'cba-202', building: 'CBA Building', floor: 2, roomCode: 'CBA 202', room: 'CBA 202', type: 'Lecture Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Projector, Whiteboard' },
    { id: 'cba-203', building: 'CBA Building', floor: 2, roomCode: 'CBA 203', room: 'CBA 203', type: 'Accounting Lab', status: 'occupied', occupant: 'Prof. Villanueva (ACT101)', schedule: '01:00 PM - 03:00 PM', capacity: 35, equipment: 'Workstations, Ledger Terminal' },
    // Floor 3
    { id: 'cba-301', building: 'CBA Building', floor: 3, roomCode: 'CBA 301', room: 'CBA 301', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard, Ceiling Fans' },
    { id: 'cba-302', building: 'CBA Building', floor: 3, roomCode: 'CBA 302', room: 'CBA 302', type: 'Economics Lab', status: 'maintenance', occupant: 'None', schedule: 'Under Maintenance', capacity: 30, equipment: 'Terminal Racks, Smart TV' },
    { id: 'cba-303', building: 'CBA Building', floor: 3, roomCode: 'CBA 303', room: 'CBA 303', type: 'Seminar Room', status: 'vacant', occupant: 'None', schedule: '--', capacity: 35, equipment: 'Projector, Whiteboard' },
    // Floor 4
    { id: 'cba-401', building: 'CBA Building', floor: 4, roomCode: 'CBA 401', room: 'CBA 401', type: 'Executive Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 60, equipment: 'Audio System, Dual Projectors' },
    { id: 'cba-402', building: 'CBA Building', floor: 4, roomCode: 'CBA 402', room: 'CBA 402', type: 'Conference Suite', status: 'occupied', occupant: 'Dean Mendoza (Admin)', schedule: '01:00 PM - 04:00 PM', capacity: 25, equipment: 'Video Conference, Smart TV' },
    { id: 'cba-403', building: 'CBA Building', floor: 4, roomCode: 'CBA 403', room: 'CBA 403', type: 'Case Study Room', status: 'vacant', occupant: 'None', schedule: '--', capacity: 35, equipment: 'Tiered Seating, Screen' },

    // Hangar (1 Storey, 6 rooms: Left 004, 005, 006; Right 003, 002, 001)
    { id: 'h-001', building: 'Hangar', floor: 1, roomCode: 'H 001', room: 'Hangar 001', type: 'Powerplants Bay', status: 'occupied', occupant: 'Engr. Cruz (AERO202)', schedule: '09:00 AM - 12:00 PM', capacity: 50, equipment: 'Engine Test Stands, Heavy Hoist' },
    { id: 'h-002', building: 'Hangar', floor: 1, roomCode: 'H 002', room: 'Hangar 002', type: 'Avionics Lab', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Diagnostic Benches, Oscilloscopes' },
    { id: 'h-003', building: 'Hangar', floor: 1, roomCode: 'H 003', room: 'Hangar 003', type: 'Flight Simulation', status: 'vacant', occupant: 'None', schedule: '--', capacity: 30, equipment: 'Flight Simulators, Avionics Racks' },
    { id: 'h-004', building: 'Hangar', floor: 1, roomCode: 'H 004', room: 'Hangar 004', type: 'UAV & Drone Lab', status: 'occupied', occupant: 'Prof. De Vega (UAV101)', schedule: '01:00 PM - 03:30 PM', capacity: 35, equipment: 'Drone Cages, Telemetry Racks' },
    { id: 'h-005', building: 'Hangar', floor: 1, roomCode: 'H 005', room: 'Hangar 005', type: 'Composite Materials', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Autoclave, Vacuum Table, Tooling' },
    { id: 'h-006', building: 'Hangar', floor: 1, roomCode: 'H 006', room: 'Hangar 006', type: 'Aircraft Assembly', status: 'maintenance', occupant: 'None', schedule: 'Facility Recalibration', capacity: 60, equipment: 'Hydraulic Lifts, Tool Depots' },

    // Pancho Building - Floor 1
    { id: 'p1-101', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO 101', room: '101', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard, Ceiling Fans' },
    { id: 'p1-103', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO 103', room: '103', type: 'Classroom', status: 'occupied', occupant: 'Dr. Reyes (BUS301)', schedule: '01:00 PM - 03:00 PM', capacity: 45, equipment: 'Projector, Whiteboard' },
    { id: 'p1-105', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO 105', room: '105', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard, Smart TV' },
    { id: 'p1-107', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO 107', room: '107', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p1-109', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO 109', room: '109', type: 'Classroom', status: 'occupied', occupant: 'Prof. Diaz (MATH101)', schedule: '10:00 AM - 12:00 PM', capacity: 45, equipment: 'Whiteboard, Sound System' },
    { id: 'p1-111', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO 111', room: '111', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p1-113', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO 113', room: '113', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard, Projector' },
    { id: 'p1-115', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO 115', room: '115', type: 'Classroom', status: 'occupied', occupant: 'Prof. Rivera (CHEM101)', schedule: '08:00 AM - 11:00 AM', capacity: 45, equipment: 'Chemistry Lab Benches' },
    { id: 'p1-117a', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO 117A', room: '117A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
    { id: 'p1-119', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO 119', room: '119', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p1-121', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO 121', room: '121', type: 'Classroom', status: 'occupied', occupant: 'Prof. Soriano (FIL101)', schedule: '01:00 PM - 03:00 PM', capacity: 45, equipment: 'Projector, Whiteboard' },
    { id: 'p1-123a', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO 123A', room: '123A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
    { id: 'p1-125', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO 125', room: '125', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p1-lecture', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO LEC', room: 'Lecture Room', type: 'Lecture Hall', status: 'occupied', occupant: 'Prof. Gomez (ENG101)', schedule: '10:00 AM - 12:00 PM', capacity: 90, equipment: 'Tiered Seating, Sound System' },
    { id: 'p1-102', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO 102', room: '102', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p1-104', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO 104', room: '104', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p1-106', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO 106', room: '106', type: 'Classroom', status: 'occupied', occupant: 'Prof. Morales (ENG201)', schedule: '08:00 AM - 10:00 AM', capacity: 45, equipment: 'Projector, Whiteboard' },
    { id: 'p1-108', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO 108', room: '108', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p1-scilab', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO SCILAB', room: 'Science Laboratory', type: 'Wet Lab', status: 'occupied', occupant: 'Dr. Lim (BIO102)', schedule: '02:00 PM - 05:00 PM', capacity: 50, equipment: 'Microscopes, Safety Showers' },
    { id: 'p1-112a', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO 112A', room: '112A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
    { id: 'p1-112b', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO 112B', room: '112B', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
    { id: 'p1-114', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO 114', room: '114', type: 'Classroom', status: 'occupied', occupant: 'Prof. Navarro (PHY102)', schedule: '02:00 PM - 04:00 PM', capacity: 45, equipment: 'Physics Apparatus, Projector' },
    { id: 'p1-116', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO 116', room: '116', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p1-118', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO 118', room: '118', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p1-122', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO 122', room: '122', type: 'Classroom', status: 'occupied', occupant: 'Dr. Santos (SOC102)', schedule: '10:00 AM - 12:00 PM', capacity: 45, equipment: 'Whiteboard, Projector' },
    { id: 'p1-103bot', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO 103E', room: '103 (East)', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p1-library', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO LIB', room: 'Library', type: 'Learning Center', status: 'vacant', occupant: 'Open Access', schedule: '08:00 AM - 06:00 PM', capacity: 120, equipment: 'Book Stacks, Wi-Fi Desks' },
    { id: 'p1-multimedia', building: 'Pancho Building', floor: 1, roomCode: 'PANCHO MULTIMEDIA', room: 'Multimedia Room', type: 'Audio-Visual Hall', status: 'occupied', occupant: 'AV Team (Forum)', schedule: '09:00 AM - 11:30 AM', capacity: 70, equipment: 'Acoustic Panels, 4K Projector' },

    // Pancho Building - Floor 2
    { id: 'p2-201', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 201', room: '201', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-203', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 203', room: '203', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-206', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 206', room: '206', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-202', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 202', room: 'Pancho 202', type: 'Conference Room', status: 'occupied', occupant: 'Dr. Smith (Physics Seminar)', schedule: '02:00 PM - 04:00 PM', capacity: 12, equipment: 'Video Conf, Smart Board' },
    { id: 'p2-210', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 210', room: '210', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-212', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 212', room: '212', type: 'Classroom', status: 'occupied', occupant: 'Prof. Mendoza (HIST101)', schedule: '08:00 AM - 10:00 AM', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-214a', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 214A', room: '214A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
    { id: 'p2-214b', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 214B', room: '214B', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
    { id: 'p2-216a', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 216A', room: '216A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
    { id: 'p2-216b', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 216B', room: '216B', type: 'Classroom', status: 'occupied', occupant: 'Prof. De Leon (LIT102)', schedule: '01:00 PM - 03:00 PM', capacity: 40, equipment: 'Whiteboard, Projector' },
    { id: 'p2-215', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 215', room: '215', type: 'Architecture Studio', status: 'occupied', occupant: 'Engr. Dalisay (ARCH202)', schedule: '08:00 AM - 11:30 AM', capacity: 40, equipment: 'Drafting Tables, Plotter' },
    { id: 'p2-220', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 220', room: '220', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-222', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 222', room: '222', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-224', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 224', room: '224', type: 'Lecture Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 65, equipment: 'Projector, Whiteboard' },
    { id: 'p2-226', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 226', room: '226', type: 'Classroom', status: 'occupied', occupant: 'Dr. Garcia (CHEM202)', schedule: '02:00 PM - 04:00 PM', capacity: 45, equipment: 'Smart Board' },
    { id: 'p2-228a', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 228A', room: '228A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 35, equipment: 'Whiteboard' },
    { id: 'p2-228b', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 228B', room: '228B', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 35, equipment: 'Whiteboard' },
    { id: 'p2-sped', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO SPED', room: 'SPED Room', type: 'Resource Room', status: 'occupied', occupant: 'Mrs. Ramos (Special Ed)', schedule: '08:00 AM - 12:00 PM', capacity: 20, equipment: 'Sensory Stations, Braille Display' },
    { id: 'p2-unites', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO UNITES', room: 'Unites Room', type: 'Activity Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 30, equipment: 'Round Tables' },
    { id: 'p2-200', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 200', room: '200', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-204', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 204', room: '204', type: 'Classroom', status: 'occupied', occupant: 'Prof. Cruz (ENG102)', schedule: '10:00 AM - 12:00 PM', capacity: 45, equipment: 'Projector' },
    { id: 'p2-pta', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO PTA', room: 'PTA Room', type: 'Office', status: 'vacant', occupant: 'None', schedule: '--', capacity: 15, equipment: 'Conference Table' },
    { id: 'p2-sto', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO STO', room: 'STO', type: 'Faculty Office', status: 'occupied', occupant: 'Student Affairs', schedule: '08:00 AM - 05:00 PM', capacity: 15, equipment: 'Desks, File Storage' },
    { id: 'p2-scouts', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO SCOUTS', room: 'Scouts Room', type: 'Activity Office', status: 'vacant', occupant: 'None', schedule: '--', capacity: 20, equipment: 'Benches, Gear Lockers' },
    { id: 'p2-207', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 207', room: '207', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-209', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 209', room: '209', type: 'Classroom', status: 'occupied', occupant: 'Prof. Tolentino (FIL102)', schedule: '01:00 PM - 03:00 PM', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-211', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 211', room: '211', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-213', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 213', room: '213', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-217', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 217', room: '217', type: 'Lecture Hall', status: 'occupied', occupant: 'Dr. Hernandez (ENG202)', schedule: '09:00 AM - 11:30 AM', capacity: 85, equipment: 'Sound System, Dual TV' },
    { id: 'p2-219', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 219', room: '219', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-221', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 221', room: '221', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-223', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 223', room: '223', type: 'Classroom', status: 'occupied', occupant: 'Prof. Castillo (MATH201)', schedule: '08:00 AM - 10:00 AM', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-225', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 225', room: '225', type: 'Lecture Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 70, equipment: 'Projector, Whiteboard' },
    { id: 'p2-227a', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 227A', room: '227A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
    { id: 'p2-227b', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 227B', room: '227B', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
    { id: 'p2-229', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 229', room: '229', type: 'Classroom', status: 'occupied', occupant: 'Dr. Valerio (PHYS201)', schedule: '02:00 PM - 04:30 PM', capacity: 45, equipment: 'Physics Kits' },
    { id: 'p2-231', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 231', room: '231', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-232', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 232', room: '232', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-233', building: 'Pancho Building', floor: 2, roomCode: 'PANCHO 233', room: '233', type: 'Classroom', status: 'occupied', occupant: 'Prof. Robles (BIO201)', schedule: '10:00 AM - 12:00 PM', capacity: 45, equipment: 'Whiteboard, Screen' }
  ];

  const DEFAULT_REQUESTS = [
    { id: 'REQ-101', requester: 'Dr. Reyes (BUS301)', room: 'Pancho 103', date: 'Today, 01:00 PM', purpose: 'Business Admin Forum', status: 'approved' },
    { id: 'REQ-102', requester: 'Prof. Diaz (MATH101)', room: 'Pancho 109', date: 'Today, 10:00 AM', purpose: 'Calculus Midterms', status: 'approved' },
    { id: 'REQ-103', requester: 'Engr. Cruz (AERO202)', room: 'Hangar 001', date: 'Today, 09:00 AM', purpose: 'Propulsion Diagnostics', status: 'approved' },
    { id: 'REQ-104', requester: 'Prof. Santos (CS101)', room: 'CBA 102', date: 'Today, 08:00 AM', purpose: 'Python Laboratory', status: 'approved' },
    { id: 'REQ-105', requester: 'Prof. Gomez (ENG101)', room: 'Pancho Lecture Room', date: 'Tomorrow, 09:00 AM', purpose: 'Speech & Debate Workshop', status: 'pending' },
    { id: 'REQ-106', requester: 'Dr. Lim (BIO102)', room: 'Science Laboratory', date: 'Tomorrow, 02:00 PM', purpose: 'Cellular Biology Lab', status: 'pending' },
    { id: 'REQ-107', requester: 'Prof. Navarro (PHY102)', room: 'Pancho 114', date: 'Oct 24, 02:00 PM', purpose: 'Electromagnetics Practical', status: 'pending' },
    { id: 'REQ-108', requester: 'Engr. Dalisay (ARCH202)', room: 'Pancho 215', date: 'Oct 25, 08:00 AM', purpose: 'Blueprint Drafting Review', status: 'pending' },
    { id: 'REQ-109', requester: 'Dr. Smith (Physics Seminar)', room: 'Pancho 202', date: 'Oct 26, 02:00 PM', purpose: 'Guest Lecture Physics', status: 'pending' }
  ];

  const DEFAULT_TIMELINE = [
    { id: 'LOG-1', title: 'Room Assigned: Pancho 103', time: '10 mins ago', desc: 'Assigned to Dr. Reyes for Business Admin Forum (01:00 PM - 03:00 PM)', icon: 'booking', type: 'booking', color: 'green', side: 'left' },
    { id: 'LOG-2', title: 'Schedule Override: Hangar 001', time: '45 mins ago', desc: 'Extended until 12:00 PM for Engr. Cruz (Propulsion Test)', icon: 'booking', type: 'booking', color: 'teal', side: 'right' },
    { id: 'LOG-3', title: 'Maintenance Flagged: CBA 302', time: '2 hours ago', desc: 'Scheduled maintenance for economics lab terminal recalibration.', icon: 'maintenance', type: 'maintenance', color: 'amber', side: 'left' },
    { id: 'LOG-4', title: 'Room Released: Pancho 105', time: '3 hours ago', desc: 'Morning session completed. Room returned to Available pool.', icon: 'release', type: 'release', color: 'teal', side: 'right' },
    { id: 'LOG-5', title: 'Automated Facility Audit', time: '5 hours ago', desc: 'Daily room occupancy synchronization executed. 68 total facilities synced.', icon: 'system', type: 'system', color: 'green', side: 'left' }
  ];

  const DEFAULT_NOTIFS = [
    { id: 'N1', title: 'New Access Request', desc: 'Prof. Gomez requested Pancho Lecture Room for tomorrow.', time: '5 mins ago', unread: true },
    { id: 'N2', title: 'Maintenance Pending', desc: 'CBA 302 terminal recalibration scheduled for inspection.', time: '1 hour ago', unread: true },
    { id: 'N3', title: 'Auto-Sync Completed', desc: 'All 3 campus buildings operational status refreshed.', time: '4 hours ago', unread: false }
  ];

  // Refresh local storage if old seed format detected
  let storedRooms = JSON.parse(localStorage.getItem('farms_rooms_v4'));
  let rooms = storedRooms || DEFAULT_ROOMS;

  // Auto-migrate rooms to ensure roomCode property is always present and concise
  rooms.forEach(r => {
    if (!r.roomCode || /lecture room|science laboratory|multimedia room|library|sped room|unites room|pta room|scouts room/i.test(r.roomCode)) {
      r.roomCode = getOrGenerateRoomCode(r);
    }
  });

  let requests = JSON.parse(localStorage.getItem('farms_requests_v4')) || DEFAULT_REQUESTS;
  let timelineLogs = JSON.parse(localStorage.getItem('farms_logs_v4')) || DEFAULT_TIMELINE;
  let notifs = JSON.parse(localStorage.getItem('farms_notifs_v4')) || DEFAULT_NOTIFS;

  function saveState() {
    localStorage.setItem('farms_rooms_v4', JSON.stringify(rooms));
    localStorage.setItem('farms_requests_v4', JSON.stringify(requests));
    localStorage.setItem('farms_logs_v4', JSON.stringify(timelineLogs));
    localStorage.setItem('farms_notifs_v4', JSON.stringify(notifs));
    updateKPIs();
  }

  // ==========================================
  // 1.5 USER SESSION & GUEST MODE ENFORCEMENT
  // ==========================================
  const sessionUser = JSON.parse(localStorage.getItem('farms_session_user') || 'null');
  const isGuest = sessionUser && (sessionUser.role === 'Guest' || sessionUser.isGuest);

  if (isGuest) {
    document.body.classList.add('farms-guest-mode');
    
    // Update User Profile in Topbar
    const userDisplayName = document.querySelector('.user-display-name');
    const userStatusIndicator = document.querySelector('.user-status-indicator');
    const userAvatarCircle = document.querySelector('.user-avatar-circle');
    const userProfileBtn = document.querySelector('.user-profile-btn');
    
    if (userDisplayName) userDisplayName.textContent = 'Guest Visitor';
    if (userStatusIndicator) userStatusIndicator.textContent = '● View Only';
    if (userAvatarCircle) {
      userAvatarCircle.textContent = 'G';
      userAvatarCircle.style.background = '#059669';
    }
    if (userProfileBtn) {
      userProfileBtn.title = 'Guest Mode (Live Room Availability Only) · Click to Sign In';
      userProfileBtn.style.cursor = 'pointer';
      userProfileBtn.addEventListener('click', () => {
        window.location.href = 'login.html';
      });
    }

    // Insert Guest Notification Banner at top of dashboard
    const mainView = document.getElementById('view-dashboard');
    if (mainView && !document.getElementById('guestBannerNotice')) {
      const guestBanner = document.createElement('div');
      guestBanner.id = 'guestBannerNotice';
      guestBanner.className = 'guest-access-banner';
      guestBanner.innerHTML = `
        <div class="guest-banner-left">
          <span class="guest-banner-icon">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </span>
          <div>
            <strong>Guest Mode Active:</strong> You are viewing real-time room availability &amp; campus floor plans. Management actions are view-only.
          </div>
        </div>
        <a href="login.html" class="guest-banner-btn">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:4px;"><circle cx="7.5" cy="15.5" r="4.5"/><path d="m21 3-9.5 9.5"/><path d="m15.5 7.5 3 3"/></svg>
          Sign In with Account
        </a>
      `;
      mainView.insertBefore(guestBanner, mainView.firstChild);
    }
  }

  // ==========================================
  // 2. DOM SELECTORS & STATE
  // ==========================================
  const navItems = document.querySelectorAll('.nav-item');
  const contentViews = document.querySelectorAll('.content-view');
  const notifBtn = document.getElementById('notifBellBtn');
  const notifDropdown = document.getElementById('notifDropdown');
  const notifList = document.getElementById('notifList');
  const markAllReadBtn = document.getElementById('markAllReadBtn');
  const sidebarRequestBadge = document.getElementById('sidebarRequestBadge');

  const btnSvgView = document.getElementById('btnSvgView');
  const btnListView = document.getElementById('btnListView');
  const btnMatrixView = document.getElementById('btnMatrixView');
  const statusDisplayMain = document.getElementById('statusDisplayMain');
  const svgContainer = document.getElementById('svgContainer');
  const listContainer = document.getElementById('listContainer');
  const matrixContainer = document.getElementById('matrixContainer');
  const matrixBody = document.getElementById('matrixBody');

  const campusMap = document.getElementById('campusMap');
  const buildingMap = document.getElementById('buildingMap');
  const floorPlanContent = document.getElementById('floorPlanContent');
  const storeySelector = document.getElementById('storeySelector');
  const backToCampusBtn = document.getElementById('backToCampusBtn');
  const currentBldgTitleLabel = document.getElementById('currentBldgTitleLabel');

  // Adaptive Sidebar Elements
  const sidebarContextIcon = document.getElementById('sidebarContextIcon');
  const sidebarContextTitle = document.getElementById('sidebarContextTitle');
  const sidebarCampusBlock = document.getElementById('sidebarCampusBlock');
  const sidebarBuildingBlock = document.getElementById('sidebarBuildingBlock');
  const sidebarListBlock = document.getElementById('sidebarListBlock');
  const sidebarMiniStatsWrap = document.getElementById('sidebarMiniStatsWrap');
  const campusBlockDivider = document.getElementById('campusBlockDivider');

  const bldgHeroTitle = document.getElementById('bldgHeroTitle');
  const bldgHeroBadge = document.getElementById('bldgHeroBadge');
  const bldgHeroOccSummary = document.getElementById('bldgHeroOccSummary');
  const bldgContextHero = document.getElementById('bldgContextHero');
  const floorVacantCount = document.getElementById('floorVacantCount');
  const floorOccupiedCount = document.getElementById('floorOccupiedCount');

  const sidebarVacantCount = document.getElementById('sidebarVacantCount');
  const sidebarOccupiedCount = document.getElementById('sidebarOccupiedCount');
  const sidebarMaintenanceCount = document.getElementById('sidebarMaintenanceCount');

  const roomFilterSearch = document.getElementById('roomFilterSearch');
  const bldgCheckboxes = document.querySelectorAll('.bldg-chk');
  const statusCheckboxes = document.querySelectorAll('.status-chk');
  const listTableBody = document.getElementById('listTableBody');

  // Matrix Filter State
  let activeMatrixFilter = 'ALL';

  const accessRequestsTableBody = document.getElementById('accessRequestsTableBody');
  const fullRequestsTableBody = document.getElementById('fullRequestsTableBody');
  const btnNewRequest = document.getElementById('btnNewRequest');
  const btnNewRequestView = document.getElementById('btnNewRequestView');

  const activityTimelineList = document.getElementById('activityTimelineList');
  const fullActivityTimelineList = document.getElementById('fullActivityTimelineList');
  const activityLogFilterSelect = document.getElementById('activityLogFilterSelect');
  const btnLoadMoreActivity = document.getElementById('btnLoadMoreActivity');
  const btnClearAllLogs = document.getElementById('btnClearAllLogs');

  const ringLayer = document.getElementById('ringLayer');
  const hudCalloutContainer = document.getElementById('hudCalloutContainer');
  const hudLeaderLine = document.getElementById('hudLeaderLine');
  const hudAnchorRing = document.getElementById('hudAnchorRing');
  const hudAnchorDot = document.getElementById('hudAnchorDot');
  const hudJointDot = document.getElementById('hudJointDot');
  const hudEndDot = document.getElementById('hudEndDot');

  const tooltip = document.getElementById('roomTooltip');
  const tooltipRoom = document.getElementById('tooltipRoom');
  const tooltipStatus = document.getElementById('tooltipStatus');
  const tooltipOccupant = document.getElementById('tooltipOccupant');
  const tooltipSchedule = document.getElementById('tooltipSchedule');
  const tooltipDetail = document.getElementById('tooltipDetail');
  const mapDisplayArea = document.querySelector('.status-display-main');

  const floorTelemetryDock = document.getElementById('floorTelemetryDock');
  const dockRoomName = document.getElementById('dockRoomName');
  const dockRoomStatus = document.getElementById('dockRoomStatus');
  const dockRoomOccupant = document.getElementById('dockRoomOccupant');
  const dockRoomSchedule = document.getElementById('dockRoomSchedule');
  const dockRoomCapacity = document.getElementById('dockRoomCapacity');
  const dockActionHint = document.getElementById('dockActionHint');

  function showHudCallout() {
    if (hudCalloutContainer) hudCalloutContainer.classList.remove('hidden');
    if (tooltip) tooltip.classList.remove('hidden');
  }

  function hideHudCallout() {
    if (hudCalloutContainer) hudCalloutContainer.classList.add('hidden');
    if (tooltip) tooltip.classList.add('hidden');
  }

  const roomModalBackdrop = document.getElementById('roomModalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalRoomTitle = document.getElementById('modalRoomTitle');
  const modalBldgBadge = document.getElementById('modalBldgBadge');
  const modalStatusBanner = document.getElementById('modalStatusBanner');
  const modalStatusText = document.getElementById('modalStatusText');
  const modalRoomCode = document.getElementById('modalRoomCode');
  const modalRoomName = document.getElementById('modalRoomName');
  const modalBldgSelect = document.getElementById('modalBldgSelect');
  const modalFloorNum = document.getElementById('modalFloorNum');
  const modalRoomType = document.getElementById('modalRoomType');
  const modalStatusSelect = document.getElementById('modalStatusSelect');
  const modalCapacity = document.getElementById('modalCapacity');
  const modalOccupant = document.getElementById('modalOccupant');
  const modalSchedule = document.getElementById('modalSchedule');
  const modalEquipment = document.getElementById('modalEquipment');
  const btnReleaseRoom = document.getElementById('btnReleaseRoom');
  const roomAssignmentForm = document.getElementById('roomAssignmentForm');

  const toastContainer = document.getElementById('toastContainer');

  let activeBuilding = null;
  let activeFloor = 1;
  let currentEditingRoom = null;
  let currentActiveTab = 'map'; // 'map', 'list', 'matrix'

  const BUILDING_CONFIG = {
    'Pancho Building': { 
      floors: 2, 
      label: 'Pancho Building', 
      icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>', 
      theme: 'pancho' 
    },
    'CBA Building': { 
      floors: 4, 
      label: 'CBA Building', 
      icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="12"/><line x1="15" y1="22" x2="15" y2="12"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="9" x2="9" y2="9.01"/><line x1="15" y1="9" x2="15" y2="9.01"/></svg>', 
      theme: 'cba' 
    },
    'Hangar': { 
      floors: 1, 
      label: 'Hangar', 
      icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"/></svg>', 
      theme: 'hangar' 
    }
  };

  // ==========================================
  // 2.5 DARK / LIGHT THEME TOGGLE & PERSISTENCE
  // ==========================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeLabelText = document.getElementById('themeLabelText');

  const savedTheme = localStorage.getItem('farms-theme') || 
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('farms-theme', theme);
    if (themeLabelText) {
      themeLabelText.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
  }

  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      showToast(`Switched to ${nextTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}`);
    });
  }

  // ==========================================
  // 2.6 MOBILE UI VIEW SIMULATOR / TOGGLE
  // ==========================================
  const btnToggleMobileMode = document.getElementById('btnToggleMobileMode');
  const savedMobileMode = localStorage.getItem('farms_mobile_mode') === 'true';

  function applyMobileMode(isMobile) {
    if (isMobile) {
      document.body.classList.add('force-mobile-view');
      if (btnToggleMobileMode) {
        btnToggleMobileMode.classList.add('active');
        const phoneIcon = btnToggleMobileMode.querySelector('.icon-phone');
        const desktopIcon = btnToggleMobileMode.querySelector('.icon-desktop');
        if (phoneIcon) phoneIcon.style.display = 'none';
        if (desktopIcon) desktopIcon.style.display = 'inline-block';
        btnToggleMobileMode.setAttribute('title', 'Switch to Desktop UI View');
      }
    } else {
      document.body.classList.remove('force-mobile-view');
      if (btnToggleMobileMode) {
        btnToggleMobileMode.classList.remove('active');
        const phoneIcon = btnToggleMobileMode.querySelector('.icon-phone');
        const desktopIcon = btnToggleMobileMode.querySelector('.icon-desktop');
        if (phoneIcon) phoneIcon.style.display = 'inline-block';
        if (desktopIcon) desktopIcon.style.display = 'none';
        btnToggleMobileMode.setAttribute('title', 'Switch to Mobile UI View');
      }
    }
    localStorage.setItem('farms_mobile_mode', isMobile);
  }

  if (savedMobileMode) {
    applyMobileMode(true);
  }

  if (btnToggleMobileMode) {
    btnToggleMobileMode.addEventListener('click', () => {
      const isMobile = document.body.classList.contains('force-mobile-view');
      applyMobileMode(!isMobile);
      showToast(!isMobile ? 'Mobile UI View Activated' : 'Desktop UI View Restored');
    });
  }

  // ── Retractable Sidebar Logic ──
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
  const appLayout = document.querySelector('.admin-app-layout');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');

  const savedSidebarState = localStorage.getItem('farms_sidebar_collapsed') === 'true';
  if (savedSidebarState && window.innerWidth > 768 && !document.body.classList.contains('force-mobile-view') && appLayout) {
    appLayout.classList.add('sidebar-collapsed');
  }

  function closeMobileSidebar() {
    if (appLayout) appLayout.classList.remove('sidebar-mobile-open');
  }

  if (sidebarToggleBtn && appLayout) {
    sidebarToggleBtn.addEventListener('click', () => {
      if (window.innerWidth <= 768 || document.body.classList.contains('force-mobile-view')) {
        appLayout.classList.toggle('sidebar-mobile-open');
      } else {
        appLayout.classList.toggle('sidebar-collapsed');
        localStorage.setItem('farms_sidebar_collapsed', appLayout.classList.contains('sidebar-collapsed'));
      }
    });
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeMobileSidebar);
  }

  // Auto-close sidebar on mobile when clicking any navigation link
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 768 || document.body.classList.contains('force-mobile-view')) {
        closeMobileSidebar();
      }
    });
  });

  // Close sidebar on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && appLayout && appLayout.classList.contains('sidebar-mobile-open')) {
      closeMobileSidebar();
    }
  });

  // ==========================================
  // 3. TOAST & NOTIFICATIONS
  // ==========================================
  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    while (toastContainer.children.length >= 2) {
      toastContainer.removeChild(toastContainer.firstChild);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' 
      ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
      : type === 'error'
      ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
      : '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    toast.innerHTML = `<span class="toast-icon">${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2400);
  }

  function renderNotifications() {
    if (!notifList) return;
    notifList.innerHTML = '';
    const unread = notifs.filter(n => n.unread).length;
    const badge = document.querySelector('.notif-badge-dot');
    if (badge) badge.style.display = unread > 0 ? 'block' : 'none';

    if (notifs.length === 0) {
      notifList.innerHTML = `<p style="padding:16px; text-align:center; color:#64748b; font-size:0.75rem;">No notifications.</p>`;
      return;
    }

    notifs.forEach(n => {
      const item = document.createElement('div');
      item.className = `notif-item ${n.unread ? 'unread' : ''}`;
      item.innerHTML = `
        <div style="font-weight:800; color:#0f172a; margin-bottom:2px;">${n.title}</div>
        <div style="color:#475569; font-size:0.75rem;">${n.desc}</div>
        <div style="color:#94a3b8; font-size:0.68rem; margin-top:4px;">${n.time}</div>
      `;
      notifList.appendChild(item);
    });
  }

  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
      if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
        notifDropdown.classList.add('hidden');
      }
    });
  }

  if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', () => {
      notifs.forEach(n => n.unread = false);
      saveState();
      renderNotifications();
      showToast('All notifications marked as read.');
    });
  }

  // ==========================================
  // 4. ADAPTIVE SIDEBAR STATE CONTROLLER
  // ==========================================
  function updateAdaptiveSidebar() {
    // Hide all context blocks first
    [sidebarCampusBlock, sidebarBuildingBlock, sidebarListBlock].forEach(b => {
      if (b) b.classList.add('hidden');
    });

    const sidebarContextBadge = document.getElementById('sidebarContextBadge');
    const sidebarContextTag = document.getElementById('sidebarContextTag');
    const sidebarContextSub = document.getElementById('sidebarContextSub');
    const sidebarContextIcon = document.getElementById('sidebarContextIcon');

    // Universal top header badge is ALWAYS visible across all views
    if (sidebarContextBadge) sidebarContextBadge.classList.remove('hidden');

    if (currentActiveTab === 'list') {
      if (statusDisplayMain) statusDisplayMain.removeAttribute('data-active-bldg');
      if (svgContainer) svgContainer.removeAttribute('data-active-bldg');
      if (sidebarContextBadge) sidebarContextBadge.className = 'sidebar-context-badge';
      if (sidebarContextIcon) sidebarContextIcon.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>';
      if (sidebarContextSub) sidebarContextSub.textContent = 'CAMPUS RADAR // V3';
      if (sidebarContextTitle) sidebarContextTitle.textContent = 'Room Directory';
      if (sidebarContextTag) sidebarContextTag.textContent = '● DIRECTORY';
      if (sidebarListBlock) sidebarListBlock.classList.remove('hidden');
      if (sidebarMiniStatsWrap) sidebarMiniStatsWrap.classList.remove('hidden');
      if (campusBlockDivider) campusBlockDivider.classList.remove('hidden');
    } else {
      // Map Mode
      if (activeBuilding) {
        const bldgKey = activeBuilding === 'CBA Building' ? 'cba' : activeBuilding === 'Hangar' ? 'hangar' : 'pancho';
        if (statusDisplayMain) statusDisplayMain.setAttribute('data-active-bldg', bldgKey);
        if (svgContainer) svgContainer.setAttribute('data-active-bldg', bldgKey);

        const cfg = BUILDING_CONFIG[activeBuilding] || { icon: '', floors: 1 };
        if (sidebarBuildingBlock) sidebarBuildingBlock.classList.remove('hidden');

        if (sidebarContextBadge) {
          sidebarContextBadge.className = `sidebar-context-badge ${activeBuilding === 'CBA Building' ? 'cba' : activeBuilding === 'Hangar' ? 'hangar' : 'pancho'}`;
        }
        if (sidebarContextIcon) {
          sidebarContextIcon.innerHTML = cfg.icon || '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>';
        }
        if (sidebarContextSub) sidebarContextSub.textContent = 'BUILDING RADAR // V3';
        if (sidebarContextTitle) sidebarContextTitle.textContent = activeBuilding;
        if (sidebarContextTag) sidebarContextTag.textContent = `LEVEL ${activeFloor}`;

        const bldgRooms = rooms.filter(r => r.building === activeBuilding);

        // Update Floor Metrics
        const floorRooms = bldgRooms.filter(r => r.floor === activeFloor);
        const flrVac = floorRooms.filter(r => r.status === 'vacant').length;
        const flrOcc = floorRooms.filter(r => r.status === 'occupied').length;
        if (floorVacantCount) floorVacantCount.textContent = flrVac;
        if (floorOccupiedCount) floorOccupiedCount.textContent = flrOcc;

        buildFloorPills(activeBuilding);
      } else {
        if (statusDisplayMain) statusDisplayMain.removeAttribute('data-active-bldg');
        if (svgContainer) svgContainer.removeAttribute('data-active-bldg');

        // In Campus Overview Map -> SHOW campus top radar badge & grounds block
        if (sidebarContextBadge) sidebarContextBadge.className = 'sidebar-context-badge';
        if (sidebarMiniStatsWrap) sidebarMiniStatsWrap.classList.remove('hidden');
        if (campusBlockDivider) campusBlockDivider.classList.remove('hidden');

        if (sidebarContextIcon) sidebarContextIcon.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>';
        if (sidebarContextSub) sidebarContextSub.textContent = 'CAMPUS RADAR // V3';
        if (sidebarContextTitle) sidebarContextTitle.textContent = 'Campus Grounds';
        if (sidebarContextTag) sidebarContextTag.textContent = '● 3 ACTIVE';
        if (sidebarCampusBlock) sidebarCampusBlock.classList.remove('hidden');
      }
    }
  }

  function updateMatrixSidebarStats() {
    const panchoRooms = rooms.filter(r => r.building === 'Pancho Building');
    const cbaRooms = rooms.filter(r => r.building === 'CBA Building');
    const hangarRooms = rooms.filter(r => r.building === 'Hangar');

    const pOcc = panchoRooms.filter(r => r.status === 'occupied').length;
    const cOcc = cbaRooms.filter(r => r.status === 'occupied').length;
    const hOcc = hangarRooms.filter(r => r.status === 'occupied').length;

    const pPct = panchoRooms.length > 0 ? Math.round((pOcc / panchoRooms.length) * 100) : 0;
    const cPct = cbaRooms.length > 0 ? Math.round((cOcc / cbaRooms.length) * 100) : 0;
    const hPct = hangarRooms.length > 0 ? Math.round((hOcc / hangarRooms.length) * 100) : 0;

    const panchoMatrixStat = document.getElementById('panchoMatrixStat');
    const cbaMatrixStat = document.getElementById('cbaMatrixStat');
    const hangarMatrixStat = document.getElementById('hangarMatrixStat');
    const panchoMatrixBar = document.getElementById('panchoMatrixBar');
    const cbaMatrixBar = document.getElementById('cbaMatrixBar');
    const hangarMatrixBar = document.getElementById('hangarMatrixBar');

    if (panchoMatrixStat) panchoMatrixStat.textContent = `${pOcc}/${panchoRooms.length} in-use`;
    if (cbaMatrixStat) cbaMatrixStat.textContent = `${cOcc}/${cbaRooms.length} in-use`;
    if (hangarMatrixStat) hangarMatrixStat.textContent = `${hOcc}/${hangarRooms.length} in-use`;

    if (panchoMatrixBar) panchoMatrixBar.style.width = `${pPct}%`;
    if (cbaMatrixBar) cbaMatrixBar.style.width = `${cPct}%`;
    if (hangarMatrixBar) hangarMatrixBar.style.width = `${hPct}%`;
  }

  // Wire Sidebar Quick Building Jump buttons
  window.openBldgFloor = function(bldg, floor) {
    if (btnSvgView) btnSvgView.click();
    openBuildingView(bldg, floor || 1);
  };

  document.querySelectorAll('.bldg-jump-btn:not(.disabled-bldg)').forEach(btn => {
    btn.addEventListener('click', () => {
      const bldg = btn.getAttribute('data-jump');
      if (bldg) {
        btnSvgView.click();
        openBuildingView(bldg);
      }
    });
  });

  // Building View Floor Room Status Filter Chips
  const roomFilterChips = document.querySelectorAll('.quick-filter-chip[data-room-filter]');
  roomFilterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      roomFilterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.getAttribute('data-room-filter');
      applyFloorRoomFilter(filter);
    });
  });

  function applyFloorRoomFilter(filter) {
    const roomGroups = document.querySelectorAll('.room-group');
    roomGroups.forEach(grp => {
      if (filter === 'all') {
        grp.style.opacity = '1';
      } else if (filter === 'vacant') {
        const isVac = grp.classList.contains('available') || grp.classList.contains('vacant');
        grp.style.opacity = isVac ? '1' : '0.18';
      } else if (filter === 'occupied') {
        const isOcc = grp.classList.contains('booked') || grp.classList.contains('occupied');
        grp.style.opacity = isOcc ? '1' : '0.18';
      }
    });
  }

  // Building View Floor Room Search Box
  const floorRoomSearchInput = document.getElementById('floorRoomSearch');
  const clearFloorRoomSearchBtn = document.getElementById('clearFloorRoomSearch');
  if (floorRoomSearchInput) {
    floorRoomSearchInput.addEventListener('input', () => {
      const query = floorRoomSearchInput.value.trim().toLowerCase();
      if (clearFloorRoomSearchBtn) clearFloorRoomSearchBtn.style.display = query ? 'block' : 'none';
      
      const roomGroups = document.querySelectorAll('.room-group');
      if (!query) {
        roomGroups.forEach(grp => grp.style.opacity = '1');
        return;
      }

      roomGroups.forEach(grp => {
        const roomName = (grp.getAttribute('data-room') || '').toLowerCase();
        const match = roomName.includes(query);
        grp.style.opacity = match ? '1' : '0.18';
      });
    });

    if (clearFloorRoomSearchBtn) {
      clearFloorRoomSearchBtn.addEventListener('click', () => {
        floorRoomSearchInput.value = '';
        clearFloorRoomSearchBtn.style.display = 'none';
        applyFloorRoomFilter('all');
      });
    }
  }

  // Two-Way Interactive Linkage between Sidebar Cards & SVG Map
  const bldgLinkMap = {
    'Pancho Building': { side: 'sideCardPancho', svg: 'campus-pancho' },
    'CBA Building': { side: 'sideCardCba', svg: 'campus-cba' },
    'Hangar': { side: 'sideCardHangar', svg: 'campus-hangar' }
  };

  Object.entries(bldgLinkMap).forEach(([name, ids]) => {
    const sideEl = document.getElementById(ids.side);
    const svgEl = document.getElementById(ids.svg);
    if (sideEl && svgEl) {
      sideEl.addEventListener('mouseenter', () => svgEl.classList.add('bldg-highlighted'));
      sideEl.addEventListener('mouseleave', () => svgEl.classList.remove('bldg-highlighted'));

      svgEl.addEventListener('mouseenter', () => sideEl.classList.add('sidebar-highlighted'));
      svgEl.addEventListener('mouseleave', () => sideEl.classList.remove('sidebar-highlighted'));
    }
  });

  // Dynamic Building Metrics Calculator for Sidebar
  function updateDynamicSidebarData() {
    const panchoRooms = rooms.filter(r => r.building === 'Pancho Building');
    const cbaRooms = rooms.filter(r => r.building === 'CBA Building');
    const hangarRooms = rooms.filter(r => r.building === 'Hangar');

    const pVac = panchoRooms.filter(r => r.status === 'vacant').length;
    const pOcc = panchoRooms.filter(r => r.status === 'occupied').length;
    const pPct = panchoRooms.length > 0 ? Math.round((pVac / panchoRooms.length) * 100) : 0;

    const cVac = cbaRooms.filter(r => r.status === 'vacant').length;
    const cOcc = cbaRooms.filter(r => r.status === 'occupied').length;
    const cPct = cbaRooms.length > 0 ? Math.round((cVac / cbaRooms.length) * 100) : 0;

    const hVac = hangarRooms.filter(r => r.status === 'vacant').length;
    const hOcc = hangarRooms.filter(r => r.status === 'occupied').length;
    const hPct = hangarRooms.length > 0 ? Math.round((hVac / hangarRooms.length) * 100) : 0;

    // Pancho Card
    const panchoFreeChip = document.getElementById('panchoFreeChip');
    const panchoSubText = document.getElementById('panchoSubText');
    const panchoMeterFill = document.getElementById('panchoMeterFill');
    const panchoMeterVac = document.getElementById('panchoMeterVac');
    const panchoMeterOcc = document.getElementById('panchoMeterOcc');
    if (panchoFreeChip) panchoFreeChip.textContent = `${pVac} FREE`;
    if (panchoSubText) panchoSubText.textContent = `2 Floors · ${panchoRooms.length} Classrooms`;
    if (panchoMeterFill) panchoMeterFill.style.width = `${pPct}%`;
    if (panchoMeterVac) panchoMeterVac.textContent = `${pVac} Free (${pPct}%)`;
    if (panchoMeterOcc) panchoMeterOcc.textContent = `${pOcc} In-Use`;

    // CBA Card
    const cbaFreeChip = document.getElementById('cbaFreeChip');
    const cbaSubText = document.getElementById('cbaSubText');
    const cbaMeterFill = document.getElementById('cbaMeterFill');
    const cbaMeterVac = document.getElementById('cbaMeterVac');
    const cbaMeterOcc = document.getElementById('cbaMeterOcc');
    if (cbaFreeChip) cbaFreeChip.textContent = `${cVac} FREE`;
    if (cbaSubText) cbaSubText.textContent = `4 Floors · ${cbaRooms.length} Rooms`;
    if (cbaMeterFill) cbaMeterFill.style.width = `${cPct}%`;
    if (cbaMeterVac) cbaMeterVac.textContent = `${cVac} Free (${cPct}%)`;
    if (cbaMeterOcc) cbaMeterOcc.textContent = `${cOcc} In-Use`;

    // Hangar Card
    const hangarFreeChip = document.getElementById('hangarFreeChip');
    const hangarSubText = document.getElementById('hangarSubText');
    const hangarMeterFill = document.getElementById('hangarMeterFill');
    const hangarMeterVac = document.getElementById('hangarMeterVac');
    const hangarMeterOcc = document.getElementById('hangarMeterOcc');
    if (hangarFreeChip) hangarFreeChip.textContent = `${hVac} FREE`;
    if (hangarSubText) hangarSubText.textContent = `1 Storey · ${hangarRooms.length} Aviation Bays`;
    if (hangarMeterFill) hangarMeterFill.style.width = `${hPct}%`;
    if (hangarMeterVac) hangarMeterVac.textContent = `${hVac} Free (${hPct}%)`;
    if (hangarMeterOcc) hangarMeterOcc.textContent = `${hOcc} In-Use`;
  }

  // Wire Matrix Nav Item clicks
  document.querySelectorAll('.matrix-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const target = item.getAttribute('data-matrix-target');
      const targetEl = document.querySelector(`[data-bldg-card="${target}"]`);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ==========================================
  // 5. KPI STATS & LIVE COUNTS
  // ==========================================
  function updateKPIs() {
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
    const vacantRooms = rooms.filter(r => r.status === 'vacant').length;
    const maintenanceRooms = rooms.filter(r => r.status === 'maintenance').length;
    const pendingReqs = requests.filter(r => r.status === 'pending').length;

    // Card 1: Active Classes & Mini Bars
    const statActiveClasses = document.getElementById('statActiveClasses');
    if (statActiveClasses) statActiveClasses.textContent = occupiedRooms;

    const panchoRooms = rooms.filter(r => r.building === 'Pancho Building');
    const cbaRooms = rooms.filter(r => r.building === 'CBA Building');
    const hangarRooms = rooms.filter(r => r.building === 'Hangar');

    const pOcc = panchoRooms.filter(r => r.status === 'occupied').length;
    const cOcc = cbaRooms.filter(r => r.status === 'occupied').length;
    const hOcc = hangarRooms.filter(r => r.status === 'occupied').length;

    const kpiOccRate = document.getElementById('kpiOccRate');
    const occPct = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
    if (kpiOccRate) kpiOccRate.textContent = `${occPct}% Occupancy`;

    const barValCba = document.getElementById('barValCba');
    const barValHangar = document.getElementById('barValHangar');
    const barValPancho = document.getElementById('barValPancho');
    const barFillCba = document.getElementById('barFillCba');
    const barFillHangar = document.getElementById('barFillHangar');
    const barFillPancho = document.getElementById('barFillPancho');

    if (barValCba) barValCba.textContent = cOcc;
    if (barValHangar) barValHangar.textContent = hOcc;
    if (barValPancho) barValPancho.textContent = pOcc;

    const maxBarVal = Math.max(cOcc, hOcc, pOcc, 1);
    if (barFillCba) barFillCba.style.width = `${Math.round((cOcc / maxBarVal) * 100)}%`;
    if (barFillHangar) barFillHangar.style.width = `${Math.round((hOcc / maxBarVal) * 100)}%`;
    if (barFillPancho) barFillPancho.style.width = `${Math.round((pOcc / maxBarVal) * 100)}%`;

    // Right Segment: Vacant Rooms Legend & Multi-Segment Donut Chart
    const statVacantRooms = document.getElementById('statVacantRooms');
    const vacantGaugeNum = document.getElementById('vacantGaugeNum');
    const vacantGaugeTotal = document.getElementById('vacantGaugeTotal');
    const kpiFreeRate = document.getElementById('kpiFreeRate');

    if (statVacantRooms) statVacantRooms.textContent = vacantRooms;
    if (vacantGaugeNum) vacantGaugeNum.textContent = vacantRooms;
    if (vacantGaugeTotal) vacantGaugeTotal.textContent = `of ${totalRooms}`;
    if (kpiFreeRate) kpiFreeRate.textContent = `${vacantRooms} / ${totalRooms} Rooms Free`;

    const pieValFree = document.getElementById('pieValFree');
    const pieValOcc = document.getElementById('pieValOcc');
    const pieValMaint = document.getElementById('pieValMaint');

    if (pieValFree) pieValFree.textContent = vacantRooms;
    if (pieValOcc) pieValOcc.textContent = occupiedRooms;
    if (pieValMaint) pieValMaint.textContent = maintenanceRooms;

    if (totalRooms > 0) {
      // Modern Multi-Segment Donut Calculations (Radius = 32, Circumference C = 201.06)
      const C = 201.06;
      const freeLen = (vacantRooms / totalRooms) * C;
      const occLen = (occupiedRooms / totalRooms) * C;
      const maintLen = (maintenanceRooms / totalRooms) * C;

      const pieSegFree = document.getElementById('pieSegFree');
      const pieSegOcc = document.getElementById('pieSegOcc');
      const pieSegMaint = document.getElementById('pieSegMaint');

      if (pieSegFree) {
        pieSegFree.style.strokeDasharray = `${freeLen} ${C}`;
        pieSegFree.style.strokeDashoffset = `0`;
      }
      if (pieSegOcc) {
        pieSegOcc.style.strokeDasharray = `${occLen} ${C}`;
        pieSegOcc.style.strokeDashoffset = `-${freeLen}`;
      }
      if (pieSegMaint) {
        pieSegMaint.style.strokeDasharray = `${maintLen} ${C}`;
        pieSegMaint.style.strokeDashoffset = `-${freeLen + occLen}`;
      }
    }

    // Card 3: Pending Requests
    const statPendingRequests = document.getElementById('statPendingRequests');
    if (statPendingRequests) statPendingRequests.textContent = pendingReqs;

    if (sidebarVacantCount) sidebarVacantCount.textContent = vacantRooms;
    if (sidebarOccupiedCount) sidebarOccupiedCount.textContent = occupiedRooms;
    if (sidebarMaintenanceCount) sidebarMaintenanceCount.textContent = maintenanceRooms;

    const sidebarStripVacant = document.getElementById('sidebarStripVacant');
    const sidebarStripOcc = document.getElementById('sidebarStripOcc');
    if (sidebarStripVacant) sidebarStripVacant.textContent = `${vacantRooms} RMS`;
    if (sidebarStripOcc) sidebarStripOcc.textContent = `${occupiedRooms} RMS`;

    if (sidebarRequestBadge) {
      sidebarRequestBadge.textContent = pendingReqs;
      sidebarRequestBadge.style.display = pendingReqs > 0 ? 'inline-block' : 'none';
    }

    updateDynamicSidebarData();
    renderStationaryOccupancyRings();
    updateAdaptiveSidebar();
  }

  // ==========================================
  // 6. CAMPUS MAP LIVE BUILDING STATS & POPOVER
  // ==========================================
  function renderStationaryOccupancyRings() {
    if (ringLayer) ringLayer.innerHTML = '';

    // Attach listeners for interactive campus buildings
    document.querySelectorAll('.interactive-bldg').forEach(el => {
      const bldgName = el.getAttribute('data-bldg');
      const bldgRooms = rooms.filter(r => r.building === bldgName);
      const total = bldgRooms.length;
      const occupied = bldgRooms.filter(r => r.status === 'occupied').length;
      const vacant = bldgRooms.filter(r => r.status === 'vacant').length;
      const pct = total > 0 ? Math.round((occupied / total) * 100) : 0;

      el.addEventListener('mouseenter', () => {
        if (!tooltip) return;
        tooltipRoom.textContent = bldgName;
        tooltipStatus.textContent = `${pct}% In-Use (● ${occupied} / ${vacant})`;
        tooltipStatus.className = `popover-status-badge ${vacant > 0 ? 'vacant' : 'occupied'}`;
        tooltipOccupant.textContent = `${total} Classrooms & Laboratories (${vacant} available)`;
        tooltipSchedule.textContent = `Hours: 7:00 AM - 9:00 PM`;
        tooltipDetail.innerHTML = `<span>Click building to view floor layout</span> <span class="popover-arrow">→</span>`;
        showHudCallout();
      });

      el.addEventListener('mouseleave', () => {
        hideHudCallout();
      });

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        openBuildingView(bldgName);
      });
    });

    // Activity Center Tooltip
    const propGym = document.getElementById('campus-prop-gym');
    if (propGym) {
      propGym.addEventListener('mouseenter', () => {
        if (!tooltip) return;
        tooltipRoom.textContent = 'Activity Center';
        tooltipStatus.textContent = '● Athletics & Events';
        tooltipStatus.className = 'popover-status-badge vacant';
        tooltipOccupant.textContent = 'Covered Gymnasium, Sports Arena & Events Hub';
        tooltipSchedule.textContent = 'Hours: 6:00 AM - 9:00 PM';
        tooltipDetail.innerHTML = `<span>Campus Athletic & Assembly Facility</span>`;
        showHudCallout();
      });
      propGym.addEventListener('mouseleave', () => {
        hideHudCallout();
      });
    }

    // Administrator Building Tooltip
    const propPavilion = document.getElementById('campus-prop-pavilion');
    if (propPavilion) {
      propPavilion.addEventListener('mouseenter', () => {
        if (!tooltip) return;
        tooltipRoom.textContent = 'Administrator Building';
        tooltipStatus.textContent = '● Executive Admin';
        tooltipStatus.className = 'popover-status-badge vacant';
        tooltipOccupant.textContent = 'Executive Offices, Registrar, Dean & Student Affairs';
        tooltipSchedule.textContent = 'Hours: 8:00 AM - 5:00 PM';
        tooltipDetail.innerHTML = `<span>Central Campus Administration</span>`;
        showHudCallout();
      });
      propPavilion.addEventListener('mouseleave', () => {
        hideHudCallout();
      });
    }

  }

  function showHudCallout() {
    if (hudCalloutContainer) hudCalloutContainer.classList.remove('hidden');
  }

  function hideHudCallout() {
    if (hudCalloutContainer) hudCalloutContainer.classList.add('hidden');
  }

  if (mapDisplayArea) {
    mapDisplayArea.addEventListener('mousemove', (e) => {
      if (hudCalloutContainer && !hudCalloutContainer.classList.contains('hidden') && tooltip) {
        const rect = mapDisplayArea.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const popWidth = 260;
        const popHeight = 110;

        let left = x + 16;
        let top = y + 16;

        if (left + popWidth > rect.width - 12) {
          left = x - popWidth - 16;
        }
        if (top + popHeight > rect.height - 12) {
          top = y - popHeight - 16;
        }

        tooltip.style.left = `${Math.max(12, left)}px`;
        tooltip.style.top = `${Math.max(12, top)}px`;
      }
    });
  }

  // ==========================================
  // 7. HIGH-AESTHETIC BLUEPRINT GRID SVG LOADER
  // ==========================================
  function findRoomObj(bldg, roomName, floor) {
    const clean = str => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanName = clean(roomName);
    return rooms.find(r => r.building === bldg && (floor ? r.floor === floor : true) && (clean(r.room) === cleanName || clean(r.room).includes(cleanName) || cleanName.includes(clean(r.room))));
  }

  function getRoomStateClass(bldg, roomName, floor) {
    const found = findRoomObj(bldg, roomName, floor);
    if (!found) return 'available';
    return found.status === 'occupied' ? 'booked' : found.status === 'maintenance' ? 'maintenance' : 'available';
  }

  function loadFloorSVG(building, floor) {
    if (tooltip) tooltip.classList.add('hidden');
    if (floorTelemetryDock) floorTelemetryDock.classList.add('hidden');
    hideHudCallout();

    if (building === 'CBA Building') {
      // CBA 4 Storeys, 3 rooms each: CBA X01, CBA X02, CBA X03
      const room1 = `CBA ${floor}01`;
      const room2 = `CBA ${floor}02`;
      const room3 = `CBA ${floor}03`;

      const room1Type = floor === 1 ? 'Lecture Hall' : floor === 2 ? 'Smart Classroom' : floor === 3 ? 'Classroom' : 'Executive Hall';
      const room2Type = floor === 1 ? 'Computer Lab' : floor === 2 ? 'Lecture Hall' : floor === 3 ? 'Economics Lab' : 'Conference Suite';
      const room3Type = floor === 1 ? 'Business Lab' : floor === 2 ? 'Accounting Lab' : floor === 3 ? 'Seminar Room' : 'Case Study Room';

      floorPlanContent.innerHTML = `
        <svg viewBox="0 0 1280 360" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="floorGridCBA" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(192, 132, 252, 0.22)" stroke-width="0.9"/>
              <circle cx="0" cy="0" r="1.2" fill="#c084fc" opacity="0.6"/>
            </pattern>
          </defs>

          <!-- Outer Blueprint Card -->
          <rect width="100%" height="100%" fill="#faf5ff" class="svg-bldg-bg svg-cba-bg"/>
          <rect width="100%" height="100%" fill="url(#floorGridCBA)"/>

          <!-- Central Floor Identifier Badge -->
          <g transform="translate(525, 14)" class="svg-floor-center-badge">
            <rect width="230" height="34" rx="8" fill="#000000" stroke="#000000" stroke-width="2"/>
            <text x="115" y="22" font-family="Plus Jakarta Sans" font-weight="900" font-size="13" fill="#ffffff" text-anchor="middle" letter-spacing="0.8">LEVEL ${floor} · CBA WING</text>
          </g>

          <!-- Hallway & Corridors -->
          <rect x="50" y="70" width="1180" height="255" fill="#f8fafc" stroke="#000000" stroke-width="2" rx="10"/>

          <!-- West Stairwell -->
          <g transform="translate(70, 90)">
            <rect width="90" height="215" fill="#ecfdf5" stroke="#000000" stroke-width="1.8" rx="7"/>
            <line x1="0" y1="35" x2="90" y2="35" stroke="#047857" stroke-width="1.5"/>
            <line x1="0" y1="70" x2="90" y2="70" stroke="#047857" stroke-width="1.5"/>
            <line x1="0" y1="105" x2="90" y2="105" stroke="#047857" stroke-width="1.5"/>
            <line x1="0" y1="140" x2="90" y2="140" stroke="#047857" stroke-width="1.5"/>
            <line x1="0" y1="175" x2="90" y2="175" stroke="#047857" stroke-width="1.5"/>
            <text x="45" y="198" font-family="Plus Jakarta Sans" font-weight="900" font-size="11" fill="#047857" text-anchor="middle">STAIRS W</text>
          </g>

          <!-- Room 1 (CBA X01) -->
          <g class="room-group ${getRoomStateClass(building, room1, floor)}" data-bldg="${building}" data-room="${room1}" data-floor="${floor}">
            <rect x="180" y="90" width="270" height="215" rx="8" class="room-rect"/>
            <text x="315" y="205" font-family="Plus Jakarta Sans" font-weight="900" font-size="22" fill="#0f172a" text-anchor="middle" class="room-text">${room1}</text>
          </g>

          <!-- Room 2 (CBA X02) -->
          <g class="room-group ${getRoomStateClass(building, room2, floor)}" data-bldg="${building}" data-room="${room2}" data-floor="${floor}">
            <rect x="470" y="90" width="270" height="215" rx="8" class="room-rect"/>
            <text x="605" y="205" font-family="Plus Jakarta Sans" font-weight="900" font-size="22" fill="#0f172a" text-anchor="middle" class="room-text">${room2}</text>
          </g>

          <!-- Room 3 (CBA X03) -->
          <g class="room-group ${getRoomStateClass(building, room3, floor)}" data-bldg="${building}" data-room="${room3}" data-floor="${floor}">
            <rect x="760" y="90" width="270" height="215" rx="8" class="room-rect"/>
            <text x="895" y="205" font-family="Plus Jakarta Sans" font-weight="900" font-size="22" fill="#0f172a" text-anchor="middle" class="room-text">${room3}</text>
          </g>

          <!-- East Stairs & Restroom -->
          <g transform="translate(1050, 90)">
            <rect width="80" height="215" fill="#ecfdf5" stroke="#000000" stroke-width="1.8" rx="7"/>
            <line x1="0" y1="35" x2="80" y2="35" stroke="#047857" stroke-width="1.5"/>
            <line x1="0" y1="70" x2="80" y2="70" stroke="#047857" stroke-width="1.5"/>
            <line x1="0" y1="105" x2="80" y2="105" stroke="#047857" stroke-width="1.5"/>
            <line x1="0" y1="140" x2="80" y2="140" stroke="#047857" stroke-width="1.5"/>
            <line x1="0" y1="175" x2="80" y2="175" stroke="#047857" stroke-width="1.5"/>
            <text x="40" y="198" font-family="Plus Jakarta Sans" font-weight="900" font-size="11" fill="#047857" text-anchor="middle">STAIRS E</text>
          </g>

          <g transform="translate(1145, 90)">
            <rect width="70" height="215" fill="#dbeafe" stroke="#000000" stroke-width="1.8" rx="7"/>
            <text x="35" y="190" font-family="Plus Jakarta Sans" font-weight="900" font-size="13" fill="#1e40af" text-anchor="middle">RESTROOM</text>
            <text x="35" y="215" font-family="Plus Jakarta Sans" font-weight="800" font-size="10" fill="#3b82f6" text-anchor="middle">M / F</text>
          </g>
        </svg>
      `;
    } else if (building === 'Hangar') {
      // HANGAR 1 STOREY, 6 ROOMS (Clean Architectural Layout):
      // Left Wing (Bottom to Top: 001, 002, 003):
      //   - Bottom: Hangar 001
      //   - Middle: Hangar 002
      //   - Top:    Hangar 003
      // Right Wing: Hangar 004, Hangar 005, Hangar 006
      // Middle: Clean Central Hall
      floorPlanContent.innerHTML = `
        <svg viewBox="0 0 1380 580" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="floorGridHangar" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(56, 189, 248, 0.22)" stroke-width="0.9"/>
              <circle cx="0" cy="0" r="1.2" fill="#38bdf8" opacity="0.6"/>
            </pattern>
          </defs>

          <!-- Outer Blueprint Card -->
          <rect width="100%" height="100%" fill="#f0f9ff" class="svg-bldg-bg svg-hangar-bg"/>
          <rect width="100%" height="100%" fill="url(#floorGridHangar)"/>

          <!-- Central Floor Identifier Badge -->
          <g transform="translate(560, 14)" class="svg-floor-center-badge">
            <rect width="260" height="34" rx="8" fill="#000000" stroke="#000000" stroke-width="2"/>
            <text x="130" y="22" font-family="Plus Jakarta Sans" font-weight="900" font-size="13" fill="#ffffff" text-anchor="middle" letter-spacing="0.8">HANGAR COMPLEX · LEVEL 1</text>
          </g>

          <!-- ================= LEFT WING (BOTTOM TO TOP: 001, 002, 003) ================= -->
          
          <!-- Hangar 003 (Top Left) -->
          <g class="room-group ${getRoomStateClass(building, 'Hangar 003', 1)}" data-bldg="${building}" data-room="Hangar 003" data-floor="1">
            <rect x="45" y="65" width="290" height="150" rx="8" class="room-rect"/>
            <text x="190" y="148" font-family="Plus Jakarta Sans" font-weight="900" font-size="22" fill="#0f172a" text-anchor="middle" class="room-text">Hangar 003</text>
          </g>

          <!-- Hangar 002 (Middle Left) -->
          <g class="room-group ${getRoomStateClass(building, 'Hangar 002', 1)}" data-bldg="${building}" data-room="Hangar 002" data-floor="1">
            <rect x="45" y="230" width="290" height="150" rx="8" class="room-rect"/>
            <text x="190" y="313" font-family="Plus Jakarta Sans" font-weight="900" font-size="22" fill="#0f172a" text-anchor="middle" class="room-text">Hangar 002</text>
          </g>

          <!-- Hangar 001 (Bottom Left) -->
          <g class="room-group ${getRoomStateClass(building, 'Hangar 001', 1)}" data-bldg="${building}" data-room="Hangar 001" data-floor="1">
            <rect x="45" y="395" width="290" height="150" rx="8" class="room-rect"/>
            <text x="190" y="478" font-family="Plus Jakarta Sans" font-weight="900" font-size="22" fill="#0f172a" text-anchor="middle" class="room-text">Hangar 001</text>
          </g>

          <!-- ================= MIDDLE AREA (CLEAN CENTRAL HANGAR HALL) ================= -->
          <g transform="translate(355, 65)">
            <rect width="670" height="480" fill="#f8fafc" stroke="#000000" stroke-dasharray="6,6" stroke-width="2" rx="10"/>
          </g>

          <!-- ================= RIGHT WING (ROOMS: 004, 005, 006) ================= -->

          <!-- Hangar 004 (Top Right) -->
          <g class="room-group ${getRoomStateClass(building, 'Hangar 004', 1)}" data-bldg="${building}" data-room="Hangar 004" data-floor="1">
            <rect x="1045" y="65" width="290" height="150" rx="8" class="room-rect"/>
            <text x="1190" y="148" font-family="Plus Jakarta Sans" font-weight="900" font-size="22" fill="#0f172a" text-anchor="middle" class="room-text">Hangar 004</text>
          </g>

          <!-- Hangar 005 (Middle Right) -->
          <g class="room-group ${getRoomStateClass(building, 'Hangar 005', 1)}" data-bldg="${building}" data-room="Hangar 005" data-floor="1">
            <rect x="1045" y="230" width="290" height="150" rx="8" class="room-rect"/>
            <text x="1190" y="313" font-family="Plus Jakarta Sans" font-weight="900" font-size="22" fill="#0f172a" text-anchor="middle" class="room-text">Hangar 005</text>
          </g>

          <!-- Hangar 006 (Bottom Right) -->
          <g class="room-group ${getRoomStateClass(building, 'Hangar 006', 1)}" data-bldg="${building}" data-room="Hangar 006" data-floor="1">
            <rect x="1045" y="395" width="290" height="150" rx="8" class="room-rect"/>
            <text x="1190" y="478" font-family="Plus Jakarta Sans" font-weight="900" font-size="22" fill="#0f172a" text-anchor="middle" class="room-text">Hangar 006</text>
          </g>
        </svg>
      `;
    } else if (building === 'Pancho Building') {
      if (floor === 1) {
        floorPlanContent.innerHTML = `
          <svg viewBox="0 0 1560 480" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="floorGridPancho" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(132, 204, 22, 0.22)" stroke-width="0.9"/>
                <circle cx="0" cy="0" r="1.2" fill="#84cc16" opacity="0.6"/>
              </pattern>
            </defs>

            <!-- Outer Blueprint Card -->
            <rect width="100%" height="100%" fill="#f4fce3" class="svg-bldg-bg svg-pancho-bg"/>
            <rect width="100%" height="100%" fill="url(#floorGridPancho)"/>

            <!-- Central Floor Identifier Badge -->
            <g transform="translate(650, 14)" class="svg-floor-center-badge">
              <rect width="260" height="34" rx="8" fill="#000000" stroke="#000000" stroke-width="2"/>
              <text x="130" y="22" font-family="Plus Jakarta Sans" font-weight="900" font-size="13" fill="#ffffff" text-anchor="middle" letter-spacing="0.8">LEVEL 1 · GROUND FLOOR</text>
            </g>

            <!-- Corridor / Hallway -->
            <path d="M 35 160 L 1455 160 L 1455 210 L 1375 210 L 1375 440 L 1335 440 L 1335 210 L 35 210 Z" fill="#f1f5f9" stroke="#000000" stroke-width="2"/>

            <!-- ================= TOP ROW ROOMS ================= -->
            <g class="room-group ${getRoomStateClass(building, '101', 1)}" data-bldg="${building}" data-room="101" data-floor="1"><rect x="35" y="70" width="90" height="90" rx="7" class="room-rect"/><text x="80" y="120" class="room-text">101</text></g>
            
            <rect x="130" y="70" width="40" height="90" rx="5" fill="#dbeafe" stroke="#000000" stroke-width="1.8"/><text x="150" y="120" font-family="Plus Jakarta Sans" font-weight="900" font-size="11" fill="#1e40af" text-anchor="middle">CR</text>
            
            <g class="room-group ${getRoomStateClass(building, '103', 1)}" data-bldg="${building}" data-room="103" data-floor="1"><rect x="175" y="70" width="80" height="90" rx="7" class="room-rect"/><text x="215" y="120" class="room-text">103</text></g>
            <g class="room-group ${getRoomStateClass(building, '105', 1)}" data-bldg="${building}" data-room="105" data-floor="1"><rect x="260" y="70" width="80" height="90" rx="7" class="room-rect"/><text x="300" y="120" class="room-text">105</text></g>
            <g class="room-group ${getRoomStateClass(building, '107', 1)}" data-bldg="${building}" data-room="107" data-floor="1"><rect x="345" y="70" width="80" height="90" rx="7" class="room-rect"/><text x="385" y="120" class="room-text">107</text></g>
            <g class="room-group ${getRoomStateClass(building, '109', 1)}" data-bldg="${building}" data-room="109" data-floor="1"><rect x="430" y="70" width="80" height="90" rx="7" class="room-rect"/><text x="470" y="120" class="room-text">109</text></g>
            <g class="room-group ${getRoomStateClass(building, '111', 1)}" data-bldg="${building}" data-room="111" data-floor="1"><rect x="515" y="70" width="80" height="90" rx="7" class="room-rect"/><text x="555" y="120" class="room-text">111</text></g>
            <g class="room-group ${getRoomStateClass(building, '113', 1)}" data-bldg="${building}" data-room="113" data-floor="1"><rect x="600" y="70" width="100" height="90" rx="7" class="room-rect"/><text x="650" y="120" class="room-text">113</text></g>
            <g class="room-group ${getRoomStateClass(building, '115', 1)}" data-bldg="${building}" data-room="115" data-floor="1"><rect x="705" y="70" width="100" height="90" rx="7" class="room-rect"/><text x="755" y="120" class="room-text">115</text></g>

            <!-- Washrooms Center -->
            <rect x="810" y="70" width="33" height="42" rx="4" fill="#dbeafe" stroke="#000000" stroke-width="1.8"/><text x="826.5" y="96" font-family="Plus Jakarta Sans" font-weight="900" font-size="9.5" fill="#1e40af" text-anchor="middle">CR</text>
            <rect x="847" y="70" width="33" height="42" rx="4" fill="#dbeafe" stroke="#000000" stroke-width="1.8"/><text x="863.5" y="96" font-family="Plus Jakarta Sans" font-weight="900" font-size="9.5" fill="#1e40af" text-anchor="middle">CR</text>
            <rect x="810" y="116" width="70" height="44" rx="4" fill="#dbeafe" stroke="#000000" stroke-width="1.8"/><text x="845" y="142" font-family="Plus Jakarta Sans" font-weight="900" font-size="10" fill="#1e40af" text-anchor="middle">WashRoom</text>

            <g class="room-group ${getRoomStateClass(building, '117A', 1)}" data-bldg="${building}" data-room="117A" data-floor="1"><rect x="885" y="70" width="90" height="90" rx="7" class="room-rect"/><text x="930" y="120" class="room-text">117A</text></g>
            <g class="room-group ${getRoomStateClass(building, '119', 1)}" data-bldg="${building}" data-room="119" data-floor="1"><rect x="980" y="70" width="90" height="90" rx="7" class="room-rect"/><text x="1025" y="120" class="room-text">119</text></g>
            <g class="room-group ${getRoomStateClass(building, '121', 1)}" data-bldg="${building}" data-room="121" data-floor="1"><rect x="1075" y="70" width="90" height="90" rx="7" class="room-rect"/><text x="1120" y="120" class="room-text">121</text></g>
            <g class="room-group ${getRoomStateClass(building, '123A', 1)}" data-bldg="${building}" data-room="123A" data-floor="1"><rect x="1170" y="70" width="90" height="90" rx="7" class="room-rect"/><text x="1215" y="120" class="room-text">123A</text></g>
            <g class="room-group ${getRoomStateClass(building, '125', 1)}" data-bldg="${building}" data-room="125" data-floor="1"><rect x="1265" y="70" width="90" height="90" rx="7" class="room-rect"/><text x="1310" y="120" class="room-text">125</text></g>
            
            <rect x="1360" y="70" width="45" height="90" rx="5" fill="#dbeafe" stroke="#000000" stroke-width="1.8"/><text x="1382.5" y="120" font-family="Plus Jakarta Sans" font-weight="900" font-size="10" fill="#1e40af" text-anchor="middle">CR</text>
            <rect x="1410" y="70" width="45" height="90" rx="5" fill="#dbeafe" stroke="#000000" stroke-width="1.8"/><text x="1432.5" y="120" font-family="Plus Jakarta Sans" font-weight="900" font-size="10" fill="#1e40af" text-anchor="middle">CR</text>

            <!-- ================= BOTTOM ROW ROOMS ================= -->
            <g class="room-group ${getRoomStateClass(building, 'Lecture Room', 1)}" data-bldg="${building}" data-room="Lecture Room" data-floor="1">
              <rect x="35" y="210" width="90" height="90" rx="7" class="room-rect"/>
              <text class="room-text" x="80" y="248"><tspan x="80" dy="0">Lecture</tspan><tspan x="80" dy="16">Room</tspan></text>
            </g>
            
            <!-- North Stairs -->
            <g transform="translate(130, 210)">
              <rect width="40" height="90" rx="5" fill="#ecfdf5" stroke="#000000" stroke-width="1.8"/>
              <line x1="0" y1="15" x2="40" y2="15" stroke="#047857" stroke-width="1.5"/><line x1="0" y1="30" x2="40" y2="30" stroke="#047857" stroke-width="1.5"/><line x1="0" y1="45" x2="40" y2="45" stroke="#047857" stroke-width="1.5"/><line x1="0" y1="60" x2="40" y2="60" stroke="#047857" stroke-width="1.5"/><line x1="0" y1="75" x2="40" y2="75" stroke="#047857" stroke-width="1.5"/>
              <text x="20" y="52" font-family="Plus Jakarta Sans" font-weight="900" font-size="8" fill="#047857" text-anchor="middle">STAIRS</text>
            </g>

            <g class="room-group ${getRoomStateClass(building, '102', 1)}" data-bldg="${building}" data-room="102" data-floor="1"><rect x="175" y="210" width="70" height="90" rx="7" class="room-rect"/><text x="210" y="260" class="room-text">102</text></g>
            <g class="room-group ${getRoomStateClass(building, '104', 1)}" data-bldg="${building}" data-room="104" data-floor="1"><rect x="250" y="210" width="70" height="90" rx="7" class="room-rect"/><text x="285" y="260" class="room-text">104</text></g>
            <g class="room-group ${getRoomStateClass(building, '106', 1)}" data-bldg="${building}" data-room="106" data-floor="1"><rect x="325" y="210" width="70" height="90" rx="7" class="room-rect"/><text x="360" y="260" class="room-text">106</text></g>
            <g class="room-group ${getRoomStateClass(building, '108', 1)}" data-bldg="${building}" data-room="108" data-floor="1"><rect x="400" y="210" width="70" height="90" rx="7" class="room-rect"/><text x="435" y="260" class="room-text">108</text></g>
            
            <g class="room-group ${getRoomStateClass(building, 'Science Laboratory', 1)}" data-bldg="${building}" data-room="Science Laboratory" data-floor="1">
              <rect x="475" y="210" width="195" height="90" rx="7" class="room-rect"/>
              <text class="room-text" x="572.5" y="248"><tspan x="572.5" dy="0">Science</tspan><tspan x="572.5" dy="16">Laboratory</tspan></text>
            </g>
            
            <g class="room-group ${getRoomStateClass(building, '112A', 1)}" data-bldg="${building}" data-room="112A" data-floor="1"><rect x="675" y="210" width="65" height="90" rx="7" class="room-rect"/><text x="707.5" y="260" class="room-text">112A</text></g>
            <g class="room-group ${getRoomStateClass(building, '112B', 1)}" data-bldg="${building}" data-room="112B" data-floor="1"><rect x="745" y="210" width="65" height="90" rx="7" class="room-rect"/><text x="777.5" y="260" class="room-text">112B</text></g>
            
            <!-- Center Stairs -->
            <g transform="translate(815, 210)">
              <rect width="70" height="90" rx="5" fill="#ecfdf5" stroke="#000000" stroke-width="1.8"/>
              <line x1="0" y1="15" x2="70" y2="15" stroke="#047857" stroke-width="1.5"/><line x1="0" y1="30" x2="70" y2="30" stroke="#047857" stroke-width="1.5"/><line x1="0" y1="45" x2="70" y2="45" stroke="#047857" stroke-width="1.5"/><line x1="0" y1="60" x2="70" y2="60" stroke="#047857" stroke-width="1.5"/><line x1="0" y1="75" x2="70" y2="75" stroke="#047857" stroke-width="1.5"/>
              <text x="35" y="52" font-family="Plus Jakarta Sans" font-weight="900" font-size="9" fill="#047857" text-anchor="middle">STAIRS C</text>
            </g>

            <g class="room-group ${getRoomStateClass(building, '114', 1)}" data-bldg="${building}" data-room="114" data-floor="1"><rect x="890" y="210" width="70" height="90" rx="7" class="room-rect"/><text x="925" y="260" class="room-text">114</text></g>
            <g class="room-group ${getRoomStateClass(building, '116', 1)}" data-bldg="${building}" data-room="116" data-floor="1"><rect x="965" y="210" width="70" height="90" rx="7" class="room-rect"/><text x="1000" y="260" class="room-text">116</text></g>
            <g class="room-group ${getRoomStateClass(building, '118', 1)}" data-bldg="${building}" data-room="118" data-floor="1"><rect x="1040" y="210" width="70" height="90" rx="7" class="room-rect"/><text x="1075" y="260" class="room-text">118</text></g>
            <g class="room-group ${getRoomStateClass(building, '122', 1)}" data-bldg="${building}" data-room="122" data-floor="1"><rect x="1115" y="210" width="70" height="90" rx="7" class="room-rect"/><text x="1150" y="260" class="room-text">122</text></g>
            <g class="room-group ${getRoomStateClass(building, '103 (East)', 1)}" data-bldg="${building}" data-room="103 (East)" data-floor="1"><rect x="1190" y="210" width="90" height="90" rx="7" class="room-rect"/><text x="1235" y="260" class="room-text">103</text></g>

            <!-- East Wing Stairs & Facilities -->
            <g transform="translate(1375, 160)">
              <rect width="80" height="50" rx="5" fill="#ecfdf5" stroke="#000000" stroke-width="1.8"/>
              <line x1="0" y1="12" x2="80" y2="12" stroke="#047857" stroke-width="1.5"/><line x1="0" y1="25" x2="80" y2="25" stroke="#047857" stroke-width="1.5"/><line x1="0" y1="38" x2="80" y2="38" stroke="#047857" stroke-width="1.5"/>
              <text x="40" y="30" font-family="Plus Jakarta Sans" font-weight="900" font-size="9" fill="#047857" text-anchor="middle">STAIRS E</text>
            </g>

            <g class="room-group ${getRoomStateClass(building, 'Library', 1)}" data-bldg="${building}" data-room="Library" data-floor="1">
              <rect x="1375" y="215" width="80" height="105" rx="7" class="room-rect"/>
              <text x="1415" y="270" class="room-text">Library</text>
            </g>
            <g class="room-group ${getRoomStateClass(building, 'Multimedia Room', 1)}" data-bldg="${building}" data-room="Multimedia Room" data-floor="1">
              <rect x="1375" y="325" width="80" height="115" rx="7" class="room-rect"/>
              <text class="room-text" x="1415" y="375"><tspan x="1415" dy="0">Multimedia</tspan><tspan x="1415" dy="16">Room</tspan></text>
            </g>
          </svg>
        `;
      } else if (floor === 2) {
        floorPlanContent.innerHTML = `
          <svg viewBox="0 0 1560 480" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="floorGridPanchoF2" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(132, 204, 22, 0.22)" stroke-width="0.9"/>
                <circle cx="0" cy="0" r="1.2" fill="#84cc16" opacity="0.6"/>
              </pattern>
            </defs>

            <!-- Outer Blueprint Card -->
            <rect width="100%" height="100%" fill="#f4fce3" class="svg-bldg-bg svg-pancho-bg"/>
            <rect width="100%" height="100%" fill="url(#floorGridPanchoF2)"/>

            <!-- Central Floor Identifier Badge -->
            <g transform="translate(650, 14)" class="svg-floor-center-badge">
              <rect width="260" height="34" rx="8" fill="#000000" stroke="#000000" stroke-width="2"/>
              <text x="130" y="22" font-family="Plus Jakarta Sans" font-weight="900" font-size="13" fill="#ffffff" text-anchor="middle" letter-spacing="0.8">LEVEL 2 · SECOND FLOOR</text>
            </g>

            <!-- Corridor / Hallway -->
            <path d="M 35 160 L 1455 160 L 1455 210 L 1375 210 L 1375 440 L 1335 440 L 1335 210 L 35 210 Z" fill="#f1f5f9" stroke="#000000" stroke-width="2"/>

            <!-- ================= TOP ROW ROOMS ================= -->
            <g class="room-group ${getRoomStateClass(building, '201', 2)}" data-bldg="${building}" data-room="201" data-floor="2"><rect x="35" y="70" width="90" height="90" rx="7" class="room-rect"/><text x="80" y="120" class="room-text">201</text></g>
            
            <rect x="130" y="70" width="35" height="90" rx="5" fill="#dbeafe" stroke="#000000" stroke-width="1.8"/><text x="147.5" y="120" font-family="Plus Jakarta Sans" font-size="9" fill="#1e40af" text-anchor="middle">CR</text>
            
            <g class="room-group ${getRoomStateClass(building, '203', 2)}" data-bldg="${building}" data-room="203" data-floor="2"><rect x="170" y="70" width="65" height="90" rx="7" class="room-rect"/><text x="202.5" y="120" class="room-text">203</text></g>
            <g class="room-group ${getRoomStateClass(building, '206', 2)}" data-bldg="${building}" data-room="206" data-floor="2"><rect x="240" y="70" width="65" height="90" rx="7" class="room-rect"/><text x="272.5" y="120" class="room-text">206</text></g>
            <g class="room-group ${getRoomStateClass(building, 'Pancho 202', 2)}" data-bldg="${building}" data-room="Pancho 202" data-floor="2"><rect x="310" y="70" width="65" height="90" rx="7" class="room-rect"/><text x="342.5" y="120" class="room-text">202</text></g>
            <g class="room-group ${getRoomStateClass(building, '210', 2)}" data-bldg="${building}" data-room="210" data-floor="2"><rect x="380" y="70" width="65" height="90" rx="7" class="room-rect"/><text x="412.5" y="120" class="room-text">210</text></g>
            <g class="room-group ${getRoomStateClass(building, '212', 2)}" data-bldg="${building}" data-room="212" data-floor="2"><rect x="450" y="70" width="65" height="90" rx="7" class="room-rect"/><text x="482.5" y="120" class="room-text">212</text></g>
            <g class="room-group ${getRoomStateClass(building, '214A', 2)}" data-bldg="${building}" data-room="214A" data-floor="2"><rect x="520" y="70" width="65" height="90" rx="7" class="room-rect"/><text x="552.5" y="120" class="room-text">214A</text></g>
            <g class="room-group ${getRoomStateClass(building, '214B', 2)}" data-bldg="${building}" data-room="214B" data-floor="2"><rect x="590" y="70" width="65" height="90" rx="7" class="room-rect"/><text x="622.5" y="120" class="room-text">214B</text></g>
            <g class="room-group ${getRoomStateClass(building, '216A', 2)}" data-bldg="${building}" data-room="216A" data-floor="2"><rect x="660" y="70" width="70" height="90" rx="7" class="room-rect"/><text x="695" y="120" class="room-text">216A</text></g>
            <g class="room-group ${getRoomStateClass(building, '216B', 2)}" data-bldg="${building}" data-room="216B" data-floor="2"><rect x="735" y="70" width="70" height="90" rx="7" class="room-rect"/><text x="770" y="120" class="room-text">216B</text></g>

            <!-- Washrooms Center -->
            <rect x="810" y="70" width="33" height="42" rx="4" fill="#dbeafe" stroke="#000000" stroke-width="1.8"/><text x="826.5" y="96" font-family="Plus Jakarta Sans" font-size="9" fill="#1e40af" text-anchor="middle">CR</text>
            <rect x="847" y="70" width="33" height="42" rx="4" fill="#dbeafe" stroke="#000000" stroke-width="1.8"/><text x="863.5" y="96" font-family="Plus Jakarta Sans" font-size="9" fill="#1e40af" text-anchor="middle">CR</text>
            <rect x="810" y="116" width="70" height="44" rx="4" fill="#dbeafe" stroke="#000000" stroke-width="1.8"/><text x="845" y="142" font-family="Plus Jakarta Sans" font-size="9.5" fill="#1e40af" text-anchor="middle">WashRoom</text>

            <g class="room-group ${getRoomStateClass(building, '215', 2)}" data-bldg="${building}" data-room="215" data-floor="2"><rect x="885" y="70" width="50" height="90" rx="7" class="room-rect"/><text x="910" y="120" class="room-text">215</text></g>
            <g class="room-group ${getRoomStateClass(building, '220', 2)}" data-bldg="${building}" data-room="220" data-floor="2"><rect x="940" y="70" width="50" height="90" rx="7" class="room-rect"/><text x="965" y="120" class="room-text">220</text></g>
            <g class="room-group ${getRoomStateClass(building, '222', 2)}" data-bldg="${building}" data-room="222" data-floor="2"><rect x="995" y="70" width="50" height="90" rx="7" class="room-rect"/><text x="1020" y="120" class="room-text">222</text></g>
            <g class="room-group ${getRoomStateClass(building, '224', 2)}" data-bldg="${building}" data-room="224" data-floor="2"><rect x="1050" y="70" width="105" height="90" rx="7" class="room-rect"/><text x="1102.5" y="120" class="room-text">224</text></g>
            <g class="room-group ${getRoomStateClass(building, '226', 2)}" data-bldg="${building}" data-room="226" data-floor="2"><rect x="1160" y="70" width="45" height="90" rx="7" class="room-rect"/><text x="1182.5" y="120" class="room-text">226</text></g>
            <g class="room-group ${getRoomStateClass(building, '228A', 2)}" data-bldg="${building}" data-room="228A" data-floor="2"><rect x="1210" y="70" width="35" height="90" rx="5" class="room-rect"/><text x="1227.5" y="120" font-family="Plus Jakarta Sans" font-weight="900" font-size="8.5" fill="#000000" text-anchor="middle">228A</text></g>
            <g class="room-group ${getRoomStateClass(building, '228B', 2)}" data-bldg="${building}" data-room="228B" data-floor="2"><rect x="1250" y="70" width="35" height="90" rx="5" class="room-rect"/><text x="1267.5" y="120" font-family="Plus Jakarta Sans" font-weight="900" font-size="8.5" fill="#000000" text-anchor="middle">228B</text></g>
            
            <g class="room-group ${getRoomStateClass(building, 'SPED Room', 2)}" data-bldg="${building}" data-room="SPED Room" data-floor="2">
              <rect x="1290" y="70" width="35" height="90" rx="5" class="room-rect"/>
              <text font-family="Plus Jakarta Sans" font-weight="900" font-size="8" fill="#000000" text-anchor="middle" x="1307.5" y="115"><tspan x="1307.5" dy="0">SPED</tspan><tspan x="1307.5" dy="10">Room</tspan></text>
            </g>
            <g class="room-group ${getRoomStateClass(building, 'Unites Room', 2)}" data-bldg="${building}" data-room="Unites Room" data-floor="2">
              <rect x="1330" y="70" width="35" height="90" rx="5" class="room-rect"/>
              <text font-family="Plus Jakarta Sans" font-weight="900" font-size="8" fill="#000000" text-anchor="middle" x="1347.5" y="115"><tspan x="1347.5" dy="0">Unites</tspan><tspan x="1347.5" dy="10">Room</tspan></text>
            </g>

            <rect x="1370" y="70" width="40" height="90" rx="5" fill="#dbeafe" stroke="#000000" stroke-width="1.8"/><text x="1390" y="120" font-family="Plus Jakarta Sans" font-weight="900" font-size="9" fill="#1e40af" text-anchor="middle">CR</text>
            <rect x="1415" y="70" width="40" height="90" rx="5" fill="#dbeafe" stroke="#000000" stroke-width="1.8"/><text x="1435" y="120" font-family="Plus Jakarta Sans" font-weight="900" font-size="9" fill="#1e40af" text-anchor="middle">CR</text>

            <!-- ================= BOTTOM ROW ROOMS ================= -->
            <g class="room-group ${getRoomStateClass(building, '200', 2)}" data-bldg="${building}" data-room="200" data-floor="2"><rect x="35" y="210" width="65" height="90" rx="7" class="room-rect"/><text x="67.5" y="260" class="room-text">200</text></g>
            <g class="room-group ${getRoomStateClass(building, '204', 2)}" data-bldg="${building}" data-room="204" data-floor="2"><rect x="105" y="210" width="20" height="90" rx="4" class="room-rect"/><text x="115" y="260" font-family="Plus Jakarta Sans" font-weight="900" font-size="8" fill="#000000" text-anchor="middle">204</text></g>
            
            <!-- North Stairs -->
            <g transform="translate(130, 210)">
              <rect width="35" height="90" rx="5" fill="#ecfdf5" stroke="#000000" stroke-width="1.8"/>
              <line x1="0" y1="15" x2="35" y2="15" stroke="#047857" stroke-width="1.5"/><line x1="0" y1="30" x2="35" y2="30" stroke="#047857" stroke-width="1.5"/><line x1="0" y1="45" x2="35" y2="45" stroke="#047857" stroke-width="1.5"/><line x1="0" y1="60" x2="35" y2="60" stroke="#047857" stroke-width="1.5"/><line x1="0" y1="75" x2="35" y2="75" stroke="#047857" stroke-width="1.5"/>
              <text x="17.5" y="52" font-family="Plus Jakarta Sans" font-weight="900" font-size="8" fill="#047857" text-anchor="middle">STAIRS</text>
            </g>

            <g class="room-group ${getRoomStateClass(building, 'PTA Room', 2)}" data-bldg="${building}" data-room="PTA Room" data-floor="2"><rect x="170" y="210" width="35" height="42" rx="4" class="room-rect"/><text x="187.5" y="235" font-family="Plus Jakarta Sans" font-weight="900" font-size="8" fill="#000000" text-anchor="middle">PTA</text></g>
            <g class="room-group ${getRoomStateClass(building, '204', 2)}" data-bldg="${building}" data-room="204" data-floor="2"><rect x="170" y="258" width="35" height="42" rx="4" class="room-rect"/><text x="187.5" y="283" font-family="Plus Jakarta Sans" font-weight="900" font-size="8" fill="#000000" text-anchor="middle">204</text></g>
            
            <g class="room-group ${getRoomStateClass(building, 'STO', 2)}" data-bldg="${building}" data-room="STO" data-floor="2"><rect x="210" y="210" width="20" height="90" rx="4" class="room-rect"/><text x="220" y="260" font-family="Plus Jakarta Sans" font-weight="900" font-size="8" fill="#000000" text-anchor="middle">STO</text></g>
            <g class="room-group ${getRoomStateClass(building, 'Scouts Room', 2)}" data-bldg="${building}" data-room="Scouts Room" data-floor="2"><rect x="235" y="210" width="20" height="90" rx="4" class="room-rect"/><text font-family="Plus Jakarta Sans" font-weight="900" font-size="7.5" fill="#000000" text-anchor="middle" x="245" y="255"><tspan x="245" dy="0">Scouts</tspan><tspan x="245" dy="10">Room</tspan></text></g>

            <g class="room-group ${getRoomStateClass(building, '207', 2)}" data-bldg="${building}" data-room="207" data-floor="2"><rect x="260" y="210" width="60" height="90" rx="7" class="room-rect"/><text x="290" y="260" class="room-text">207</text></g>
            <g class="room-group ${getRoomStateClass(building, '209', 2)}" data-bldg="${building}" data-room="209" data-floor="2"><rect x="325" y="210" width="60" height="90" rx="7" class="room-rect"/><text x="355" y="260" class="room-text">209</text></g>
            <g class="room-group ${getRoomStateClass(building, '211', 2)}" data-bldg="${building}" data-room="211" data-floor="2"><rect x="390" y="210" width="60" height="90" rx="7" class="room-rect"/><text x="420" y="260" class="room-text">211</text></g>
            <g class="room-group ${getRoomStateClass(building, '213', 2)}" data-bldg="${building}" data-room="213" data-floor="2"><rect x="455" y="210" width="60" height="90" rx="7" class="room-rect"/><text x="485" y="260" class="room-text">213</text></g>
            <g class="room-group ${getRoomStateClass(building, '215', 2)}" data-bldg="${building}" data-room="215" data-floor="2"><rect x="520" y="210" width="125" height="90" rx="7" class="room-rect"/><text x="582.5" y="260" class="room-text">215</text></g>
            <g class="room-group ${getRoomStateClass(building, '217', 2)}" data-bldg="${building}" data-room="217" data-floor="2"><rect x="650" y="210" width="160" height="90" rx="7" class="room-rect"/><text x="730" y="260" class="room-text">217</text></g>

            <!-- Center Stairs -->
            <g transform="translate(815, 210)">
              <rect width="70" height="90" rx="5" fill="#ecfdf5" stroke="#000000" stroke-width="1.8"/>
              <line x1="0" y1="15" x2="70" y2="15" stroke="#047857" stroke-width="1.5"/><line x1="0" y1="30" x2="70" y2="30" stroke="#047857" stroke-width="1.5"/><line x1="0" y1="45" x2="70" y2="45" stroke="#047857" stroke-width="1.5"/><line x1="0" y1="60" x2="70" y2="60" stroke="#047857" stroke-width="1.5"/><line x1="0" y1="75" x2="70" y2="75" stroke="#047857" stroke-width="1.5"/>
              <text x="35" y="52" font-family="Plus Jakarta Sans" font-weight="900" font-size="9" fill="#047857" text-anchor="middle">STAIRS C</text>
            </g>

            <g class="room-group ${getRoomStateClass(building, '219', 2)}" data-bldg="${building}" data-room="219" data-floor="2"><rect x="890" y="210" width="55" height="90" rx="7" class="room-rect"/><text x="917.5" y="260" class="room-text">219</text></g>
            <g class="room-group ${getRoomStateClass(building, '221', 2)}" data-bldg="${building}" data-room="221" data-floor="2"><rect x="950" y="210" width="55" height="90" rx="7" class="room-rect"/><text x="977.5" y="260" class="room-text">221</text></g>
            <g class="room-group ${getRoomStateClass(building, '223', 2)}" data-bldg="${building}" data-room="223" data-floor="2"><rect x="1010" y="210" width="55" height="90" rx="7" class="room-rect"/><text x="1037.5" y="260" class="room-text">223</text></g>
            <g class="room-group ${getRoomStateClass(building, '225', 2)}" data-bldg="${building}" data-room="225" data-floor="2"><rect x="1070" y="210" width="115" height="90" rx="7" class="room-rect"/><text x="1127.5" y="260" class="room-text">225</text></g>
            <g class="room-group ${getRoomStateClass(building, '227B', 2)}" data-bldg="${building}" data-room="227B" data-floor="2"><rect x="1190" y="210" width="55" height="90" rx="7" class="room-rect"/><text x="1217.5" y="260" class="room-text">227B</text></g>
            <g class="room-group ${getRoomStateClass(building, '227A', 2)}" data-bldg="${building}" data-room="227A" data-floor="2"><rect x="1250" y="210" width="55" height="90" rx="7" class="room-rect"/><text x="1277.5" y="260" class="room-text">227A</text></g>
            <g class="room-group ${getRoomStateClass(building, '229', 2)}" data-bldg="${building}" data-room="229" data-floor="2"><rect x="1310" y="210" width="55" height="90" rx="7" class="room-rect"/><text x="1337.5" y="260" class="room-text">229</text></g>

            <!-- East Wing Stairs & Facilities -->
            <g transform="translate(1375, 160)">
              <rect width="80" height="50" rx="5" fill="#ecfdf5" stroke="#000000" stroke-width="1.8"/>
              <line x1="0" y1="12" x2="80" y2="12" stroke="#047857" stroke-width="1.5"/><line x1="0" y1="25" x2="80" y2="25" stroke="#047857" stroke-width="1.5"/><line x1="0" y1="38" x2="80" y2="38" stroke="#047857" stroke-width="1.5"/>
              <text x="40" y="30" font-family="Plus Jakarta Sans" font-weight="900" font-size="9" fill="#047857" text-anchor="middle">STAIRS E</text>
            </g>

            <g class="room-group ${getRoomStateClass(building, '231', 2)}" data-bldg="${building}" data-room="231" data-floor="2"><rect x="1375" y="215" width="80" height="85" rx="7" class="room-rect"/><text x="1415" y="260" class="room-text">231</text></g>
            <g class="room-group ${getRoomStateClass(building, '232', 2)}" data-bldg="${building}" data-room="232" data-floor="2"><rect x="1375" y="305" width="80" height="65" rx="7" class="room-rect"/><text x="1415" y="340" class="room-text">232</text></g>
            <g class="room-group ${getRoomStateClass(building, '233', 2)}" data-bldg="${building}" data-room="233" data-floor="2"><rect x="1375" y="375" width="80" height="65" rx="7" class="room-rect"/><text x="1415" y="410" class="room-text">233</text></g>
          </svg>
        `;
      }
    }

    attachRoomClickInteractions();
    updateAdaptiveSidebar();
  }

  function attachRoomClickInteractions() {
    document.querySelectorAll('.room-group').forEach(group => {
      const bldg = group.getAttribute('data-bldg') || activeBuilding;
      const roomName = group.getAttribute('data-room');
      const floor = parseInt(group.getAttribute('data-floor'), 10) || activeFloor;
      const roomObj = findRoomObj(bldg, roomName, floor);

      group.addEventListener('mouseenter', () => {
        if (!roomObj) return;
        if (floorTelemetryDock) {
          dockRoomName.textContent = `${roomObj.room}`;
          dockRoomStatus.textContent = roomObj.status.toUpperCase();
          dockRoomStatus.className = `tooltip-status ${roomObj.status}`;
          dockRoomOccupant.textContent = roomObj.occupant || 'Unassigned';
          dockRoomSchedule.textContent = roomObj.schedule || 'Available / Open';
          if (dockRoomCapacity) dockRoomCapacity.textContent = `${roomObj.capacity || 45} Seats`;
          dockActionHint.textContent = roomObj.status === 'vacant' ? 'Assign Faculty' : 'Manage Room';
          floorTelemetryDock.classList.remove('hidden');
        }
      });

      group.addEventListener('mouseleave', () => {
        if (floorTelemetryDock) {
          floorTelemetryDock.classList.add('hidden');
        }
      });

      group.addEventListener('click', (e) => {
        e.stopPropagation();
        if (roomObj) openRoomModal(roomObj);
      });
    });
  }

  function openBuildingView(buildingName) {
    activeBuilding = buildingName;
    activeFloor = 1;

    campusMap.classList.add('hidden');
    buildingMap.classList.remove('hidden');

    if (currentBldgTitleLabel) {
      currentBldgTitleLabel.textContent = `${buildingName.toUpperCase()} FLOORS`;
    }

    loadFloorSVG(buildingName, activeFloor);
  }

  function buildFloorPills(buildingName) {
    if (!storeySelector) return;
    storeySelector.innerHTML = '';
    const totalFloors = BUILDING_CONFIG[buildingName]?.floors || 1;

    const bldgRooms = rooms.filter(r => r.building === buildingName);

    for (let i = totalFloors; i >= 1; i--) {
      const flrRooms = bldgRooms.filter(r => r.floor === i);
      const vac = flrRooms.filter(r => r.status === 'vacant').length;
      const occ = flrRooms.filter(r => r.status === 'occupied').length;

      const btn = document.createElement('button');
      btn.className = `floor-pill-btn ${i === activeFloor ? 'active' : ''}`;
      btn.innerHTML = `
        <span style="display:flex; align-items:center; gap:6px;"><strong>Level ${i}</strong> <small style="font-size:0.68rem; font-weight:700; opacity:0.75;">(${flrRooms.length} Rooms)</small></span>
        <span class="flr-free-badge">${vac} Free</span>
      `;

      btn.addEventListener('click', () => {
        document.querySelectorAll('.floor-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFloor = i;
        loadFloorSVG(buildingName, activeFloor);
      });

      storeySelector.appendChild(btn);
    }
  }

  if (backToCampusBtn) {
    backToCampusBtn.addEventListener('click', () => {
      campusMap.classList.remove('hidden');
      buildingMap.classList.add('hidden');
      activeBuilding = null;
      if (tooltip) tooltip.classList.add('hidden');
      renderStationaryOccupancyRings();
      updateAdaptiveSidebar();
    });
  }

  // ==========================================
  // 8. LIST VIEW & ROOM MATRIX VIEW
  // ==========================================
  function renderListView() {
    if (!listTableBody) return;
    listTableBody.innerHTML = '';

    const query = (roomFilterSearch ? roomFilterSearch.value : '').toLowerCase().trim();
    const selectedBldgs = Array.from(bldgCheckboxes).filter(c => c.checked).map(c => c.getAttribute('data-bldg'));
    const selectedStatuses = Array.from(statusCheckboxes).filter(c => c.checked).map(c => c.getAttribute('data-status'));

    const filtered = rooms.filter(r => {
      const matchBldg = selectedBldgs.includes(r.building);
      const matchStatus = selectedStatuses.includes(r.status);
      const matchQuery = query === '' || 
        (r.roomCode && r.roomCode.toLowerCase().includes(query)) ||
        (r.room && r.room.toLowerCase().includes(query)) || 
        (r.building && r.building.toLowerCase().includes(query)) || 
        (r.occupant && r.occupant.toLowerCase().includes(query)) ||
        (r.type && r.type.toLowerCase().includes(query));
      return matchBldg && matchStatus && matchQuery;
    });

    // Update Directory Vitals at sidebar base
    const dirMatchedCount = document.getElementById('dirMatchedCount');
    const dirFreeCount = document.getElementById('dirFreeCount');
    const dirOccCount = document.getElementById('dirOccCount');
    if (dirMatchedCount) dirMatchedCount.textContent = filtered.length;
    if (dirFreeCount) dirFreeCount.textContent = filtered.filter(r => r.status === 'vacant').length;
    if (dirOccCount) dirOccCount.textContent = filtered.filter(r => r.status === 'occupied').length;

    if (filtered.length === 0) {
      listTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:36px; color:#94a3b8; font-weight:800; font-family:'Plus Jakarta Sans';">No facilities found matching current filters.</td></tr>`;
      return;
    }

    filtered.forEach(item => {
      const tr = document.createElement('tr');
      const bldgColor = item.building.includes('Pancho') ? '#84cc16' : item.building.includes('CBA') ? '#a855f7' : '#06b6d4';
      const bldgLabel = item.building.includes('Pancho') ? 'Pancho Bldg' : item.building.includes('CBA') ? 'CBA Bldg' : 'Hangar Complex';
      
      const badgeClass = item.status === 'vacant' ? 'available' : item.status === 'occupied' ? 'occupied' : 'maintenance';
      const badgeText = item.status === 'vacant' ? 'Available' : item.status === 'occupied' ? 'In-Use' : 'Maintenance';
      const badgeDotClass = item.status === 'vacant' ? 'available' : item.status === 'occupied' ? 'occupied' : 'maintenance';

      const codeDisplay = item.roomCode || getOrGenerateRoomCode(item);
      const isAlias = item.room && item.room !== codeDisplay && !codeDisplay.endsWith(item.room);

      tr.innerHTML = `
        <td>
          <div class="table-room-chip clickable-room-name" title="Click to edit room properties">
            <span class="room-chip-code">${codeDisplay}</span>
            ${isAlias ? `<small class="room-chip-alias" style="display:block; font-size:0.72rem; color:#64748b; font-weight:700; margin-top:2px;">${item.room}</small>` : ''}
          </div>
        </td>
        <td>
          <div class="table-bldg-cell">
            <span class="bldg-indicator-dot" style="background:${bldgColor};"></span>
            <div class="table-bldg-text">
              <strong>${bldgLabel}</strong>
              <small>Level ${item.floor}</small>
            </div>
          </div>
        </td>
        <td>
          <span class="dir-status-tag ${badgeClass}">
            <span class="leg-dot ${badgeDotClass}"></span>
            <strong>${badgeText}</strong>
          </span>
        </td>
        <td>
          <span class="dir-capacity-pill">${item.capacity || 45} Seats</span>
        </td>
        <td>
          <span class="dir-equipment-text">${item.equipment || 'Standard Class Facility'}</span>
        </td>
        <td style="text-align:right;">
          <button class="dir-manage-action-btn list-inspect-btn">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            <span>Manage</span>
          </button>
        </td>
      `;

      tr.querySelector('.clickable-room-name').addEventListener('click', () => {
        openRoomModal(item);
      });
      tr.querySelector('.list-inspect-btn').addEventListener('click', () => {
        openRoomModal(item);
      });

      listTableBody.appendChild(tr);
    });
  }

  function renderMatrixView() {
    if (!matrixBody) return;
    matrixBody.innerHTML = '';

    const bldgs = ['Pancho Building', 'CBA Building', 'Hangar'];

    bldgs.forEach(bldgName => {
      if (activeMatrixFilter !== 'ALL' && activeMatrixFilter !== bldgName) return;

      const bldgRooms = rooms.filter(r => r.building === bldgName);
      if (bldgRooms.length === 0) return;

      const card = document.createElement('div');
      card.className = 'matrix-bldg-card';
      card.setAttribute('data-bldg-card', bldgName);

      card.innerHTML = `
        <div class="matrix-bldg-header">
          <h4>${bldgName}</h4>
          <span class="matrix-bldg-badge">${bldgRooms.length} Facilities</span>
        </div>
      `;

      // Group rooms by floor
      const floors = [...new Set(bldgRooms.map(r => r.floor))].sort((a,b) => a - b);
      floors.forEach(flr => {
        const flrRooms = bldgRooms.filter(r => r.floor === flr);
        if (flrRooms.length === 0) return;

        const flrSection = document.createElement('div');
        flrSection.className = 'matrix-floor-section';
        flrSection.innerHTML = `
          <div class="matrix-floor-title">Level ${flr} (${flrRooms.length} Facilities)</div>
          <div class="matrix-rooms-grid"></div>
        `;

        const grid = flrSection.querySelector('.matrix-rooms-grid');
        flrRooms.forEach(roomObj => {
          const cell = document.createElement('div');
          cell.className = `matrix-room-cell ${roomObj.status}`;
          const codeDisplay = roomObj.roomCode || getOrGenerateRoomCode(roomObj);
          cell.innerHTML = `
            <span class="matrix-room-dot"></span>
            <div class="matrix-room-name">${codeDisplay}</div>
            <div class="matrix-room-sub">${roomObj.status === 'vacant' ? 'Available' : roomObj.occupant}</div>
          `;

          cell.addEventListener('click', () => {
            openRoomModal(roomObj);
          });

          grid.appendChild(cell);
        });

        card.appendChild(flrSection);
      });

      matrixBody.appendChild(card);
    });
  }

  // Standalone Full Room Matrix Function
  function renderStandaloneMatrix() {
    const grid = document.getElementById('standaloneMatrixGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const bldgFilter = document.getElementById('matrixBldgFilter')?.value || 'all';
    const statusFilter = document.getElementById('matrixStatusFilter')?.value || 'all';

    const bldgs = ['Pancho Building', 'CBA Building', 'Hangar'];

    bldgs.forEach(bldgName => {
      if (bldgFilter !== 'all' && bldgFilter !== bldgName) return;

      let bldgRooms = rooms.filter(r => r.building === bldgName);
      if (statusFilter !== 'all') {
        bldgRooms = bldgRooms.filter(r => r.status === statusFilter);
      }
      if (bldgRooms.length === 0) return;

      const card = document.createElement('div');
      card.className = 'matrix-bldg-card';
      
      const occCount = bldgRooms.filter(r => r.status === 'occupied').length;
      const vacCount = bldgRooms.filter(r => r.status === 'vacant').length;
      const mntCount = bldgRooms.filter(r => r.status === 'maintenance').length;

      card.innerHTML = `
        <div class="matrix-bldg-header">
          <div style="display:flex; align-items:center; gap:10px;">
            <h4 style="font-size:1.15rem; font-weight:900; color:#0f172a;">${bldgName}</h4>
            <span class="matrix-bldg-badge" style="font-size:0.8rem; font-weight:800;">${bldgRooms.length} Facilities</span>
          </div>
          <div style="display:flex; gap:12px; font-size:0.85rem; font-weight:900;">
            <span style="color:#059669;">${vacCount} Available</span>
            <span style="color:#e11d48;">${occCount} In-Use</span>
            ${mntCount > 0 ? `<span style="color:#d97706;">${mntCount} Repair</span>` : ''}
          </div>
        </div>
      `;

      const floors = [...new Set(bldgRooms.map(r => r.floor))].sort((a,b) => a - b);
      floors.forEach(flr => {
        const flrRooms = bldgRooms.filter(r => r.floor === flr);
        if (flrRooms.length === 0) return;

        const flrSection = document.createElement('div');
        flrSection.className = 'matrix-floor-section';
        flrSection.innerHTML = `
          <div class="matrix-floor-title" style="font-size:0.95rem; font-weight:900; color:#334155; margin-bottom:10px;">Floor Level ${flr} (${flrRooms.length} Facilities)</div>
          <div class="matrix-rooms-grid"></div>
        `;

        const roomGrid = flrSection.querySelector('.matrix-rooms-grid');
        flrRooms.forEach(roomObj => {
          const cell = document.createElement('div');
          cell.className = `matrix-room-cell ${roomObj.status}`;
          cell.style.cursor = 'pointer';
          const codeDisplay = roomObj.roomCode || getOrGenerateRoomCode(roomObj);
          cell.innerHTML = `
            <span class="matrix-room-dot"></span>
            <div class="matrix-room-name" style="font-size:0.95rem; font-weight:900;">${codeDisplay}</div>
            <div class="matrix-room-sub" style="font-size:0.82rem; font-weight:800;">${roomObj.status === 'vacant' ? 'Available' : roomObj.status === 'maintenance' ? 'In Repair' : roomObj.occupant}</div>
          `;

          cell.addEventListener('click', () => {
            openRoomModal(roomObj);
          });

          roomGrid.appendChild(cell);
        });

        card.appendChild(flrSection);
      });

      grid.appendChild(card);
    });

    if (grid.children.length === 0) {
      grid.innerHTML = `<div style="padding:40px; text-align:center; color:#64748b; font-size:1.1rem; font-weight:800;">No facilities match the selected filters.</div>`;
    }
  }

  function renderMasterDirectory() {
    const tbody = document.getElementById('masterDirectoryTableBody');
    const totalCountEl = document.getElementById('dirTotalCount');
    const searchVal = (document.getElementById('dirSearchInput')?.value || '').toLowerCase().trim();
    if (!tbody) return;
    tbody.innerHTML = '';

    let filtered = rooms;
    if (searchVal) {
      filtered = rooms.filter(r => 
        r.room.toLowerCase().includes(searchVal) ||
        r.building.toLowerCase().includes(searchVal) ||
        r.type.toLowerCase().includes(searchVal) ||
        r.occupant.toLowerCase().includes(searchVal)
      );
    }

    if (totalCountEl) totalCountEl.textContent = filtered.length;

    filtered.forEach(item => {
      const tr = document.createElement('tr');
      const badgeClass = item.status === 'vacant' ? 'badge-available' : item.status === 'occupied' ? 'badge-occupied' : 'badge-maintenance';
      const badgeText = item.status === 'vacant' ? '• Available' : item.status === 'occupied' ? '• In-Use' : '• Repair';

      tr.innerHTML = `
        <td><strong style="font-size:0.95rem; color:#0f172a;">${item.room}</strong></td>
        <td>${item.building}</td>
        <td>Floor ${item.floor}</td>
        <td><span style="background:#f1f5f9; padding:3px 8px; border-radius:6px; font-weight:800; font-size:0.8rem;">${item.type}</span></td>
        <td><strong>${item.capacity || 40}</strong> seats</td>
        <td><span class="status-pill-badge ${badgeClass}">${badgeText}</span></td>
        <td>${item.status === 'vacant' ? '<span style="color:#059669; font-weight:800;">None (Available)</span>' : `<strong>${item.occupant}</strong>`}</td>
        <td>
          <button class="list-inspect-btn" style="padding:5px 12px; font-size:0.82rem; font-weight:800; border-radius:6px;">Edit / View</button>
        </td>
      `;

      tr.querySelector('.list-inspect-btn').addEventListener('click', () => {
        openRoomModal(item);
      });

      tbody.appendChild(tr);
    });
  }

  // Handle matrix filter dropdowns and tabs
  document.getElementById('matrixBldgFilter')?.addEventListener('change', renderStandaloneMatrix);
  document.getElementById('matrixStatusFilter')?.addEventListener('change', renderStandaloneMatrix);
  document.getElementById('dirSearchInput')?.addEventListener('input', renderMasterDirectory);
  
  document.getElementById('btnFacMatrixTab')?.addEventListener('click', () => {
    document.getElementById('btnFacMatrixTab')?.classList.add('active');
    document.getElementById('btnFacDirectoryTab')?.classList.remove('active');
    document.getElementById('paneFacMatrix')?.classList.remove('hidden');
    document.getElementById('paneFacDirectory')?.classList.add('hidden');
    renderStandaloneMatrix();
  });
  
  document.getElementById('btnFacDirectoryTab')?.addEventListener('click', () => {
    document.getElementById('btnFacDirectoryTab')?.classList.add('active');
    document.getElementById('btnFacMatrixTab')?.classList.remove('active');
    document.getElementById('paneFacDirectory')?.classList.remove('hidden');
    document.getElementById('paneFacMatrix')?.classList.add('hidden');
    renderMasterDirectory();
  });

  // Handle matrix filter pills
  document.querySelectorAll('.matrix-pill-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.matrix-pill-btn').forEach(b => b.classList.remove('active'));
      const targetBtn = e.target.closest('.matrix-pill-btn');
      if (targetBtn) {
        targetBtn.classList.add('active');
        activeMatrixFilter = targetBtn.getAttribute('data-filter-bldg');
        renderMatrixView();
      }
    });
  });

  if (roomFilterSearch) {
    roomFilterSearch.addEventListener('input', () => {
      renderListView();
    });
  }

  bldgCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      renderListView();
    });
  });

  statusCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      renderListView();
    });
  });

  const btnDirSelectAll = document.getElementById('btnDirSelectAll');
  const btnDirFreeOnly = document.getElementById('btnDirFreeOnly');
  const btnDirBusyOnly = document.getElementById('btnDirBusyOnly');

  if (btnDirSelectAll) {
    btnDirSelectAll.addEventListener('click', () => {
      bldgCheckboxes.forEach(cb => cb.checked = true);
      statusCheckboxes.forEach(cb => cb.checked = true);
      btnDirSelectAll.classList.add('active');
      if (btnDirFreeOnly) btnDirFreeOnly.classList.remove('active');
      if (btnDirBusyOnly) btnDirBusyOnly.classList.remove('active');
      renderListView();
    });
  }

  if (btnDirFreeOnly) {
    btnDirFreeOnly.addEventListener('click', () => {
      bldgCheckboxes.forEach(cb => cb.checked = true);
      statusCheckboxes.forEach(cb => {
        cb.checked = (cb.getAttribute('data-status') === 'vacant');
      });
      btnDirFreeOnly.classList.add('active');
      if (btnDirSelectAll) btnDirSelectAll.classList.remove('active');
      if (btnDirBusyOnly) btnDirBusyOnly.classList.remove('active');
      renderListView();
    });
  }

  if (btnDirBusyOnly) {
    btnDirBusyOnly.addEventListener('click', () => {
      bldgCheckboxes.forEach(cb => cb.checked = true);
      statusCheckboxes.forEach(cb => {
        cb.checked = (cb.getAttribute('data-status') === 'occupied');
      });
      btnDirBusyOnly.classList.add('active');
      if (btnDirSelectAll) btnDirSelectAll.classList.remove('active');
      if (btnDirFreeOnly) btnDirFreeOnly.classList.remove('active');
      renderListView();
    });
  }

  if (btnSvgView && btnListView) {
    btnSvgView.addEventListener('click', () => {
      currentActiveTab = 'map';
      btnSvgView.classList.add('active');
      btnListView.classList.remove('active');
      svgContainer.classList.remove('hidden');
      listContainer.classList.add('hidden');
      updateAdaptiveSidebar();
    });

    btnListView.addEventListener('click', () => {
      currentActiveTab = 'list';
      btnListView.classList.add('active');
      btnSvgView.classList.remove('active');
      listContainer.classList.remove('hidden');
      svgContainer.classList.add('hidden');
      renderListView();
      updateAdaptiveSidebar();
    });
  }

  // ==========================================
  // 9. ACCESS REQUESTS TABLE
  // ==========================================
  function renderAccessRequests() {
    [accessRequestsTableBody, fullRequestsTableBody].forEach(tbody => {
      if (!tbody) return;
      tbody.innerHTML = '';

      if (requests.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:24px; color:#94a3b8;">No access requests.</td></tr>`;
        return;
      }

      requests.forEach(req => {
        const tr = document.createElement('tr');
        const badgeClass = req.status === 'approved' ? 'badge-approved' : req.status === 'denied' ? 'badge-denied' : 'badge-pending';
        const badgeText = req.status === 'approved' ? '• Approved' : req.status === 'denied' ? '• Denied' : '• Pending';

        tr.innerHTML = `
          <td><strong>${req.requester}</strong></td>
          <td>${req.room}</td>
          <td>${req.date}</td>
          <td>${req.purpose}</td>
          <td><span class="status-pill-badge ${badgeClass}">${badgeText}</span></td>
          <td>
            <div class="action-links">
              ${req.status === 'pending' ? `
                <button class="action-link-approve" data-id="${req.id}">Approve</button>
                <button class="action-link-deny" data-id="${req.id}">Deny</button>
              ` : `
                <span style="font-size:0.75rem; color:#94a3b8; font-weight:700;">Completed</span>
              `}
            </div>
          </td>
        `;

        const approveBtn = tr.querySelector('.action-link-approve');
        const denyBtn = tr.querySelector('.action-link-deny');

        if (approveBtn) {
          approveBtn.addEventListener('click', () => {
            req.status = 'approved';
            showToast(`Request ${req.id} for ${req.room} approved.`);
            saveState();
            renderAccessRequests();
          });
        }

        if (denyBtn) {
          denyBtn.addEventListener('click', () => {
            req.status = 'denied';
            showToast(`Request ${req.id} denied.`, 'error');
            saveState();
            renderAccessRequests();
          });
        }

        tbody.appendChild(tr);
      });
    });

    const authQueuePendingCount = document.getElementById('authQueuePendingCount');
    if (authQueuePendingCount) {
      const pendingCount = requests.filter(r => r.status === 'pending').length;
      authQueuePendingCount.textContent = pendingCount;
    }
  }

  function handleNewRequestPrompt() {
    const requester = prompt('Enter Requester Name & Title:');
    if (!requester) return;
    const room = prompt('Enter Room (e.g. Pancho 105, CBA 101, Hangar 001):');
    if (!room) return;
    const purpose = prompt('Enter Purpose of Access:') || 'Department Class / Activity';

    const newReq = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      requester,
      room,
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      purpose,
      status: 'pending'
    };

    requests.unshift(newReq);
    timelineLogs.unshift({
      id: `LOG-${Date.now()}`,
      title: 'New Access Request',
      time: 'Just now',
      desc: `${requester} submitted request for ${room}.`,
      icon: 'request',
      type: 'request',
      color: 'amber',
      side: 'left'
    });

    saveState();
    renderAccessRequests();
    renderTimelineLogs();
    showToast(`Access request ${newReq.id} created.`);
  }

  if (btnNewRequest) btnNewRequest.addEventListener('click', handleNewRequestPrompt);
  if (btnNewRequestView) btnNewRequestView.addEventListener('click', handleNewRequestPrompt);

  // Helper for timeline log SVG icons
  function getLogIconSvg(log) {
    if (log.icon && log.icon.includes('<svg')) return log.icon;
    const type = log.type || log.icon;
    switch (type) {
      case 'booking':
        return `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
      case 'maintenance':
        return `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;
      case 'release':
        return `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
      case 'request':
        return `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`;
      case 'broadcast':
        return `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`;
      case 'security':
      case 'system':
      default:
        return `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
    }
  }

  // ==========================================
  // 10. ACTIVITY LOGS TIMELINE
  // ==========================================
  function renderTimelineLogs() {
    [activityTimelineList, fullActivityTimelineList].forEach(container => {
      if (!container) return;
      container.innerHTML = '';

      const filter = activityLogFilterSelect ? activityLogFilterSelect.value : 'all';
      const filtered = timelineLogs.filter(log => filter === 'all' || log.type === filter);

      if (filtered.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding:24px; color:#94a3b8;">No activity records.</p>`;
        return;
      }

      filtered.forEach(log => {
        const item = document.createElement('div');
        item.className = `timeline-item ${log.side || 'left'}`;
        item.innerHTML = `
          <div class="timeline-node-icon ${log.color}">
            ${getLogIconSvg(log)}
          </div>
          <div class="timeline-card">
            <div class="timeline-card-top">
              <span class="timeline-title">${log.title}</span>
              <span class="timeline-time">${log.time}</span>
            </div>
            <p class="timeline-desc">${log.desc}</p>
          </div>
        `;
        container.appendChild(item);
      });
    });
  }

  if (activityLogFilterSelect) activityLogFilterSelect.addEventListener('change', renderTimelineLogs);

  if (btnLoadMoreActivity) {
    btnLoadMoreActivity.addEventListener('click', () => {
      timelineLogs.push({
        id: `LOG-${Date.now()}`,
        title: 'System Health Check',
        time: '2 days ago',
        desc: 'All 3 buildings sync verified. Database backup archived.',
        icon: 'system',
        type: 'system',
        color: 'teal',
        side: 'left'
      });
      saveState();
      renderTimelineLogs();
      showToast('Loaded older activity logs.');
    });
  }

  if (btnClearAllLogs) {
    btnClearAllLogs.addEventListener('click', () => {
      timelineLogs = [];
      saveState();
      renderTimelineLogs();
      showToast('Activity logs cleared.');
    });
  }

  // ==========================================
  // 11. ROOM MODAL MANAGEMENT
  // ==========================================
  function openRoomModal(roomObj) {
    currentEditingRoom = roomObj;
    const codeDisplay = roomObj.roomCode || getOrGenerateRoomCode(roomObj);
    modalRoomTitle.textContent = `${codeDisplay} (${roomObj.type || 'Room'})`;
    modalBldgBadge.textContent = `${roomObj.building} · Level ${roomObj.floor}`;

    modalStatusBanner.className = `room-status-banner ${roomObj.status}`;
    modalStatusText.textContent = roomObj.status === 'vacant' ? 'Currently Available' : roomObj.status === 'occupied' ? `Occupied by ${roomObj.occupant}` : 'Under Maintenance';
    
    if (modalRoomCode) modalRoomCode.value = codeDisplay;
    if (modalRoomName) modalRoomName.value = roomObj.room || '';
    if (modalBldgSelect) modalBldgSelect.value = roomObj.building || 'Pancho Building';
    if (modalFloorNum) modalFloorNum.value = roomObj.floor || 1;
    if (modalRoomType) modalRoomType.value = roomObj.type || 'Classroom';
    if (modalStatusSelect) modalStatusSelect.value = roomObj.status;
    if (modalCapacity) modalCapacity.value = roomObj.capacity || 45;
    if (modalOccupant) modalOccupant.value = roomObj.occupant !== 'None' ? roomObj.occupant : '';
    if (modalSchedule) modalSchedule.value = roomObj.schedule !== '--' ? roomObj.schedule : '';
    if (modalEquipment) modalEquipment.value = roomObj.equipment || '';

    roomModalBackdrop.classList.remove('hidden');
  }

  function closeRoomModal() {
    roomModalBackdrop.classList.add('hidden');
    currentEditingRoom = null;
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeRoomModal);
  if (roomModalBackdrop) {
    roomModalBackdrop.addEventListener('click', (e) => {
      if (e.target === roomModalBackdrop) closeRoomModal();
    });
  }

  if (roomAssignmentForm) {
    roomAssignmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!currentEditingRoom) return;

      const newRoomCode = modalRoomCode ? modalRoomCode.value.trim() : (currentEditingRoom.roomCode || getOrGenerateRoomCode(currentEditingRoom));
      const newRoomName = modalRoomName ? modalRoomName.value.trim() : currentEditingRoom.room;
      const newBldg = modalBldgSelect ? modalBldgSelect.value : currentEditingRoom.building;
      const newFloor = modalFloorNum ? parseInt(modalFloorNum.value, 10) : currentEditingRoom.floor;
      const newType = modalRoomType ? modalRoomType.value.trim() : currentEditingRoom.type;
      const newStatus = modalStatusSelect.value;
      const newCapacity = modalCapacity ? parseInt(modalCapacity.value, 10) : (currentEditingRoom.capacity || 45);
      const newOccupant = modalOccupant.value.trim() || 'None';
      const newSchedule = modalSchedule.value.trim() || '--';
      const newEquipment = modalEquipment ? modalEquipment.value.trim() : currentEditingRoom.equipment;

      currentEditingRoom.roomCode = newRoomCode;
      currentEditingRoom.room = newRoomName;
      currentEditingRoom.building = newBldg;
      currentEditingRoom.floor = newFloor;
      currentEditingRoom.type = newType;
      currentEditingRoom.status = newStatus;
      currentEditingRoom.capacity = newCapacity;
      currentEditingRoom.occupant = newStatus === 'vacant' ? 'None' : newOccupant;
      currentEditingRoom.schedule = newStatus === 'vacant' ? '--' : newSchedule;
      currentEditingRoom.equipment = newEquipment;

      timelineLogs.unshift({
        id: `LOG-${Date.now()}`,
        title: newStatus === 'vacant' ? 'Room Released' : 'Room Assigned',
        time: 'Just now',
        desc: `${currentEditingRoom.roomCode} (${currentEditingRoom.building}) updated to ${newStatus.toUpperCase()}${newStatus === 'occupied' ? ' - ' + newOccupant : ''}`,
        icon: newStatus === 'vacant' ? 'release' : 'booking',
        type: 'booking',
        color: newStatus === 'vacant' ? 'teal' : 'green',
        side: 'right'
      });

      saveState();
      renderListView();
      renderMatrixView();
      renderTimelineLogs();

      if (activeBuilding) {
        loadFloorSVG(activeBuilding, activeFloor);
      }

      closeRoomModal();
      showToast(`Updated ${currentEditingRoom.roomCode} to ${newStatus}.`);
    });
  }

  if (btnReleaseRoom) {
    btnReleaseRoom.addEventListener('click', () => {
      if (!currentEditingRoom) return;
      currentEditingRoom.status = 'vacant';
      currentEditingRoom.occupant = 'None';
      currentEditingRoom.schedule = '--';

      timelineLogs.unshift({
        id: `LOG-${Date.now()}`,
        title: 'Room Released',
        time: 'Just now',
        desc: `${currentEditingRoom.room} has been released and is now vacant.`,
        icon: 'release',
        type: 'release',
        color: 'teal',
        side: 'left'
      });

      saveState();
      renderListView();
      renderMatrixView();
      renderTimelineLogs();

      if (activeBuilding) {
        loadFloorSVG(activeBuilding, activeFloor);
      }

      closeRoomModal();
      showToast(`${currentEditingRoom.room} is now available.`);
    });
  }

  // ==========================================
  // 12. TOPBAR SEARCH AUTOCOMPLETE
  // ==========================================
  const adminSearch = document.getElementById('adminSearch');
  const searchDropdown = document.getElementById('searchDropdown');
  const searchResultsList = document.getElementById('searchResultsList');
  const clearSearchBtn = document.getElementById('clearSearchBtn');

  if (adminSearch && searchDropdown && searchResultsList) {
    adminSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (clearSearchBtn) clearSearchBtn.style.display = q.length > 0 ? 'block' : 'none';

      if (q.length < 1) {
        searchDropdown.classList.add('hidden');
        return;
      }

      const matchedRooms = rooms.filter(r => (r.roomCode && r.roomCode.toLowerCase().includes(q)) || r.room.toLowerCase().includes(q) || r.occupant.toLowerCase().includes(q) || r.building.toLowerCase().includes(q));
      searchResultsList.innerHTML = '';

      if (matchedRooms.length === 0) {
        searchResultsList.innerHTML = `<div style="padding:14px; text-align:center; color:#94a3b8; font-size:0.8rem;">No results found.</div>`;
        searchDropdown.classList.remove('hidden');
        return;
      }

      matchedRooms.slice(0, 7).forEach(r => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        const codeDisplay = r.roomCode || getOrGenerateRoomCode(r);
        item.innerHTML = `
          <div>
            <strong>${codeDisplay}</strong> <span style="color:#64748b; font-size:0.75rem;">— ${r.building} (Floor ${r.floor})</span>
            <div style="font-size:0.7rem; color:#94a3b8; margin-top:2px;">${r.occupant !== 'None' ? 'Occupied: ' + r.occupant : 'Available Now'}</div>
          </div>
          <span class="search-category-badge">${r.type || 'Room'}</span>
        `;

        item.addEventListener('click', () => {
          searchDropdown.classList.add('hidden');
          adminSearch.value = '';
          if (clearSearchBtn) clearSearchBtn.style.display = 'none';

          if (r.building) {
            switchView('dashboard');
            btnSvgView.click();
            openBuildingView(r.building);
            activeFloor = r.floor;
            buildFloorPills(r.building);
            loadFloorSVG(r.building, activeFloor);
            setTimeout(() => openRoomModal(r), 200);
          }
        });

        searchResultsList.appendChild(item);
      });

      searchDropdown.classList.remove('hidden');
    });

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        adminSearch.value = '';
        clearSearchBtn.style.display = 'none';
        searchDropdown.classList.add('hidden');
      });
    }

    document.addEventListener('click', (e) => {
      if (!searchDropdown.contains(e.target) && e.target !== adminSearch) {
        searchDropdown.classList.add('hidden');
      }
    });

    // Global keyboard shortcut: Ctrl+K or Cmd+K to focus search
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (adminSearch) {
          adminSearch.focus();
          adminSearch.select();
        }
      } else if (e.key === 'Escape') {
        if (searchDropdown) searchDropdown.classList.add('hidden');
        if (adminSearch) adminSearch.blur();
      }
    });
  }

  // ==========================================
  // 13. SIDEBAR NAVIGATION SWITCHER
  // ==========================================
  const mainScrollContent = document.querySelector('.admin-scroll-content');

  function switchView(viewName) {
    navItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-view') === viewName);
    });

    contentViews.forEach(view => {
      const isTarget = view.id === `view-${viewName}`;
      view.style.display = isTarget ? 'flex' : 'none';
      view.classList.toggle('active', isTarget);
    });

    if (mainScrollContent) mainScrollContent.scrollTop = 0;

    if (viewName === 'facilities') {
      renderStandaloneMatrix();
      renderMasterDirectory();
    }
    if (viewName === 'requests') renderAccessRequests();
    if (viewName === 'logs') renderTimelineLogs();
  }

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const viewName = item.getAttribute('data-view');
      if (viewName) {
        e.preventDefault();
        switchView(viewName);
      }
    });
  });

  // ==========================================
  // 14. QUICK DISPATCH OPERATIONS
  // ==========================================
  document.getElementById('btnDispatchAssign')?.addEventListener('click', () => {
    const vacantRoom = rooms.find(r => r.status === 'vacant') || rooms[0];
    if (vacantRoom && typeof openRoomModal === 'function') {
      openRoomModal(vacantRoom);
    } else {
      showToast('Opening room assignment editor...');
    }
  });

  document.getElementById('btnDispatchReset')?.addEventListener('click', () => {
    document.getElementById('btnSvgView')?.click();
    document.getElementById('backToCampusBtn')?.click();
    showToast('Campus vector map & filters reset.');
  });

  document.getElementById('btnDispatchExport')?.addEventListener('click', () => {
    let csv = 'ID,Room Code,Building,Floor,Room,Type,Status,Occupant,Schedule,Capacity\n';
    rooms.forEach(r => {
      csv += `"${r.id}","${r.roomCode || getOrGenerateRoomCode(r)}","${r.building}","${r.floor}","${r.room}","${r.type}","${r.status}","${r.occupant}","${r.schedule}","${r.capacity}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FARMS_Room_Audit_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Facility Audit Log exported as CSV.');
  });

  document.getElementById('btnDispatchBroadcast')?.addEventListener('click', () => {
    const msg = prompt('Enter Campus Operational Announcement:');
    if (!msg) return;
    showToast(`Announcement: ${msg}`);
    timelineLogs.unshift({
      id: `LOG-${Date.now()}`,
      title: 'Campus Broadcast Announcement',
      time: 'Just now',
      desc: msg,
      icon: 'broadcast',
      type: 'broadcast',
      color: 'amber',
      side: 'left'
    });
    saveState();
    renderTimelineLogs();
  });

  // ==========================================
  // 15. LIVE TIMESTAMP TICKER (MAXIMIZED REALTIME CLOCK)
  // ==========================================
  const clockTimeDigits = document.getElementById('clockTimeDigits');
  const clockAmPm = document.getElementById('clockAmPm');
  const clockDateSub = document.getElementById('clockDateSub');
  const legacyLiveTimestampEl = document.getElementById('liveTimestamp');

  function updateTimestamp() {
    const now = new Date();
    const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    
    const hrs  = now.getHours();
    const mins = now.getMinutes().toString().padStart(2, '0');
    const secs = now.getSeconds().toString().padStart(2, '0');
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    const dispHrs = (hrs % 12 || 12).toString().padStart(2, '0');

    if (clockTimeDigits) {
      clockTimeDigits.textContent = `${dispHrs}:${mins}:${secs}`;
    }
    if (clockAmPm) {
      clockAmPm.textContent = ampm;
    }
    if (clockDateSub) {
      clockDateSub.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
    }
    if (legacyLiveTimestampEl) {
      legacyLiveTimestampEl.textContent =
        `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()} — ${dispHrs}:${mins}:${secs} ${ampm}`;
    }
  }

  updateTimestamp();
  setInterval(updateTimestamp, 1000); // 1000ms ticker for live seconds

  // ==========================================================
  // 14.5 DEDICATED MOBILE ROOM STATUS MATRIX & BOTTOM SHEET
  // ==========================================================
  let activeMobileBldg = 'Pancho Building';
  let activeMobileStatus = 'all';
  let activeMobileFloor = 'all';
  let mobileSearchQuery = '';
  let activeMobileSheetRoom = null;

  const mobileRoomsFeed = document.getElementById('mobileRoomsFeed');
  const mobileFloorPillsWrap = document.getElementById('mobileFloorPillsWrap');
  const mobileRoomSearchInput = document.getElementById('mobileRoomSearchInput');
  const btnMobileSearchClear = document.getElementById('btnMobileSearchClear');
  const mobileSheetBackdrop = document.getElementById('mobileSheetBackdrop');
  const mobileRoomSheet = document.getElementById('mobileRoomSheet');
  const btnMobileSheetClose = document.getElementById('btnMobileSheetClose');
  const btnSheetInspectFull = document.getElementById('btnSheetInspectFull');
  const btnSheetQuickAction = document.getElementById('btnSheetQuickAction');

  function updateMobileVitals() {
    const freeRooms = rooms.filter(r => r.status === 'vacant').length;
    const occRooms = rooms.filter(r => r.status === 'occupied').length;
    const mCountFree = document.getElementById('mCountFree');
    const mCountOcc = document.getElementById('mCountOcc');
    const mCountTotal = document.getElementById('mCountTotal');
    if (mCountFree) mCountFree.textContent = freeRooms;
    if (mCountOcc) mCountOcc.textContent = occRooms;
    if (mCountTotal) mCountTotal.textContent = rooms.length;

    // Building badges
    const panchoFree = rooms.filter(r => r.building === 'Pancho Building' && r.status === 'vacant').length;
    const cbaFree = rooms.filter(r => r.building === 'CBA Building' && r.status === 'vacant').length;
    const hangarFree = rooms.filter(r => r.building === 'Hangar' && r.status === 'vacant').length;
    const mBldgFreePancho = document.getElementById('mBldgFreePancho');
    const mBldgFreeCBA = document.getElementById('mBldgFreeCBA');
    const mBldgFreeHangar = document.getElementById('mBldgFreeHangar');
    if (mBldgFreePancho) mBldgFreePancho.textContent = `${panchoFree} Free`;
    if (mBldgFreeCBA) mBldgFreeCBA.textContent = `${cbaFree} Free`;
    if (mBldgFreeHangar) mBldgFreeHangar.textContent = `${hangarFree} Free`;
  }

  function renderMobileFloorPills() {
    if (!mobileFloorPillsWrap) return;
    const floorsCount = (BUILDING_CONFIG[activeMobileBldg] && BUILDING_CONFIG[activeMobileBldg].floors) || 1;
    let html = `<button class="m-floor-btn ${activeMobileFloor === 'all' ? 'active' : ''}" data-floor="all">ALL</button>`;
    for (let f = 1; f <= floorsCount; f++) {
      html += `<button class="m-floor-btn ${activeMobileFloor === String(f) ? 'active' : ''}" data-floor="${f}">L${f}</button>`;
    }
    mobileFloorPillsWrap.innerHTML = html;

    mobileFloorPillsWrap.querySelectorAll('.m-floor-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeMobileFloor = btn.getAttribute('data-floor');
        renderMobileFloorPills();
        renderMobileRoomFeed();
      });
    });
  }

  function renderMobileRoomFeed() {
    if (!mobileRoomsFeed) return;
    updateMobileVitals();

    let filtered = rooms.filter(r => {
      const matchBldg = r.building === activeMobileBldg;
      const matchFloor = activeMobileFloor === 'all' || String(r.floor) === String(activeMobileFloor);
      const matchStatus = activeMobileStatus === 'all' || 
        (activeMobileStatus === 'available' && r.status === 'vacant') ||
        (activeMobileStatus === 'occupied' && r.status === 'occupied') ||
        (activeMobileStatus === 'maintenance' && r.status === 'maintenance');
      
      let matchSearch = true;
      if (mobileSearchQuery.trim()) {
        const q = mobileSearchQuery.toLowerCase();
        matchSearch = (r.roomCode && r.roomCode.toLowerCase().includes(q)) ||
                      (r.room && r.room.toLowerCase().includes(q)) ||
                      (r.type && r.type.toLowerCase().includes(q)) ||
                      (r.occupant && r.occupant.toLowerCase().includes(q)) ||
                      (r.building && r.building.toLowerCase().includes(q));
      }
      return matchBldg && matchFloor && matchStatus && matchSearch;
    });

    if (filtered.length === 0) {
      mobileRoomsFeed.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 24px 16px; text-align: center; background: #f8fafc; border: 2px dashed #000000; border-radius: 12px;">
          <p style="font-weight: 900; margin: 0 0 4px 0; color: #000000;">No Rooms Found</p>
          <span style="font-size: 0.76rem; color: #64748b;">Try adjusting your status, floor, or search filter.</span>
        </div>
      `;
      return;
    }

    mobileRoomsFeed.innerHTML = filtered.map(r => {
      const statusClass = r.status === 'vacant' ? 'available' : r.status === 'occupied' ? 'occupied' : 'maintenance';
      const statusLabel = r.status === 'vacant' ? 'FREE' : r.status === 'occupied' ? 'IN-USE' : 'MAINT';
      const occupantDisplay = r.status === 'occupied' ? (r.occupant !== 'None' ? r.occupant : 'Active Class') : (r.status === 'vacant' ? 'Vacant & Ready' : 'Under Maintenance');
      const codeDisplay = r.roomCode || getOrGenerateRoomCode(r);

      return `
        <div class="mobile-room-card" data-room-id="${r.id}">
          <div class="m-card-top">
            <span class="m-card-code">${codeDisplay}</span>
            <span class="m-card-badge ${statusClass}">${statusLabel}</span>
          </div>
          <div class="m-card-occupant">${occupantDisplay}</div>
          <div class="m-card-bottom">
            <span>Level ${r.floor}</span>
            <span>${r.capacity || 45} Max</span>
          </div>
        </div>
      `;
    }).join('');

    mobileRoomsFeed.querySelectorAll('.mobile-room-card').forEach(card => {
      card.addEventListener('click', () => {
        const rId = card.getAttribute('data-room-id');
        const found = rooms.find(r => r.id === rId);
        if (found) {
          openMobileRoomSheet(found);
        }
      });
    });
  }

  function openMobileRoomSheet(roomObj) {
    activeMobileSheetRoom = roomObj;
    const sheetRoomBadge = document.getElementById('sheetRoomBadge');
    const sheetRoomName = document.getElementById('sheetRoomName');
    const sheetRoomMeta = document.getElementById('sheetRoomMeta');
    const sheetRoomBody = document.getElementById('sheetRoomBody');
    const btnSheetQuickAction = document.getElementById('btnSheetQuickAction');

    const codeDisplay = roomObj.roomCode || getOrGenerateRoomCode(roomObj);
    if (sheetRoomBadge) sheetRoomBadge.textContent = codeDisplay;
    if (sheetRoomName) sheetRoomName.textContent = `${codeDisplay} (${roomObj.type || 'Room'})`;
    if (sheetRoomMeta) sheetRoomMeta.textContent = `${roomObj.building} · Level ${roomObj.floor}`;

    const isFree = roomObj.status === 'vacant';
    const isOcc = roomObj.status === 'occupied';

    if (sheetRoomBody) {
      sheetRoomBody.innerHTML = `
        <div class="mobile-sheet-stat-card" style="border-left: 5px solid ${isFree ? '#22c55e' : (isOcc ? '#ef4444' : '#f59e0b')};">
          <div class="mobile-sheet-stat-label">Current Status</div>
          <div class="mobile-sheet-stat-value" style="font-weight:900;">
            ${isFree ? 'Available for Immediate Use' : (isOcc ? 'Currently In-Use' : 'Facility Under Maintenance')}
          </div>
        </div>

        <div class="mobile-sheet-stat-card">
          <div class="mobile-sheet-stat-label">Assigned Faculty / Subject</div>
          <div class="mobile-sheet-stat-value">${roomObj.occupant !== 'None' ? roomObj.occupant : 'None (Room Unassigned)'}</div>
        </div>

        <div class="mobile-sheet-stat-card">
          <div class="mobile-sheet-stat-label">Schedule &amp; Time Window</div>
          <div class="mobile-sheet-stat-value">${roomObj.schedule !== '--' ? roomObj.schedule : 'Available all periods'}</div>
        </div>

        <div class="mobile-sheet-stat-card">
          <div class="mobile-sheet-stat-label">Room Capacity &amp; Equipment</div>
          <div class="mobile-sheet-stat-value">${roomObj.capacity || 45} Seats · ${roomObj.equipment || 'Standard Setup'}</div>
        </div>
      `;
    }

    if (btnSheetQuickAction) {
      btnSheetQuickAction.textContent = isFree ? 'Mark In-Use / Book' : 'Free Up & Release Room';
    }

    if (mobileSheetBackdrop) mobileSheetBackdrop.classList.remove('hidden');
    if (mobileRoomSheet) mobileRoomSheet.classList.remove('hidden');
  }

  function closeMobileRoomSheet() {
    if (mobileSheetBackdrop) mobileSheetBackdrop.classList.add('hidden');
    if (mobileRoomSheet) mobileRoomSheet.classList.add('hidden');
    activeMobileSheetRoom = null;
  }

  if (btnMobileSheetClose) btnMobileSheetClose.addEventListener('click', closeMobileRoomSheet);
  if (mobileSheetBackdrop) mobileSheetBackdrop.addEventListener('click', closeMobileRoomSheet);

  if (btnSheetInspectFull) {
    btnSheetInspectFull.addEventListener('click', () => {
      if (activeMobileSheetRoom) {
        const target = activeMobileSheetRoom;
        closeMobileRoomSheet();
        openRoomModal(target);
      }
    });
  }

  if (btnSheetQuickAction) {
    btnSheetQuickAction.addEventListener('click', () => {
      if (!activeMobileSheetRoom) return;
      const target = activeMobileSheetRoom;
      const willBeOcc = target.status === 'vacant';
      target.status = willBeOcc ? 'occupied' : 'vacant';
      target.occupant = willBeOcc ? 'Quick Reserved (Mobile)' : 'None';
      target.schedule = willBeOcc ? 'Current Period' : '--';

      localStorage.setItem('farms_rooms_v4', JSON.stringify(rooms));
      updateKPIs();
      renderListView();
      renderMatrixView();
      renderMobileRoomFeed();
      closeMobileRoomSheet();
      showToast(`${target.roomCode || target.room} status updated to ${target.status === 'vacant' ? 'Available' : 'In-Use'}`);
    });
  }

  // Mobile Building Chips listeners
  document.querySelectorAll('.mobile-bldg-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.mobile-bldg-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeMobileBldg = chip.getAttribute('data-bldg');
      activeMobileFloor = 'all';
      renderMobileFloorPills();
      renderMobileRoomFeed();
    });
  });

  // Mobile Status Filter buttons
  document.querySelectorAll('.m-status-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.m-status-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeMobileStatus = btn.getAttribute('data-status');
      renderMobileRoomFeed();
    });
  });

  // Mobile Live Search input
  if (mobileRoomSearchInput) {
    mobileRoomSearchInput.addEventListener('input', (e) => {
      mobileSearchQuery = e.target.value;
      if (btnMobileSearchClear) {
        btnMobileSearchClear.classList.toggle('hidden', !mobileSearchQuery);
      }
      renderMobileRoomFeed();
    });
  }

  if (btnMobileSearchClear) {
    btnMobileSearchClear.addEventListener('click', () => {
      if (mobileRoomSearchInput) {
        mobileRoomSearchInput.value = '';
        mobileSearchQuery = '';
        btnMobileSearchClear.classList.add('hidden');
        renderMobileRoomFeed();
      }
    });
  }

  // ==========================================
  // 15. BOOTSTRAP INITIALIZATION
  // ==========================================
  updateKPIs();
  renderListView();
  renderMatrixView();
  renderMobileFloorPills();
  renderMobileRoomFeed();
  renderNotifications();
  renderAccessRequests();
  renderTimelineLogs();

  // Ensure initial active view uses flex
  contentViews.forEach(view => {
    view.style.display = view.classList.contains('active') ? 'flex' : 'none';
  });
});
