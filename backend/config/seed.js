/**
 * FARMS - Campus Seed Data & Migration
 * Seeds all 50+ campus facilities across Pancho, CBA, and Hangar
 */

const { db } = require('./db');

const SEED_ROOMS = [
  // ── CBA Building (4 Storeys, 3 rooms each = 12 rooms) ──
  // Floor 1
  { id: 'cba-101', building: 'CBA Building', floor: 1, room_code: 'CBA 101', room_name: 'CBA 101', type: 'Lecture Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Dual Projectors, Sound System, Whiteboard' },
  { id: 'cba-102', building: 'CBA Building', floor: 1, room_code: 'CBA 102', room_name: 'CBA 102', type: 'Computer Lab', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: '40 PC Workstations, Smart TV' },
  { id: 'cba-103', building: 'CBA Building', floor: 1, room_code: 'CBA 103', room_name: 'CBA 103', type: 'Business Lab', status: 'vacant', occupant: 'None', schedule: '--', capacity: 35, equipment: 'Smart Board, Conference Setup' },
  // Floor 2
  { id: 'cba-201', building: 'CBA Building', floor: 2, room_code: 'CBA 201', room_name: 'CBA 201', type: 'Smart Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Interactive Display, Sound System' },
  { id: 'cba-202', building: 'CBA Building', floor: 2, room_code: 'CBA 202', room_name: 'CBA 202', type: 'Lecture Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Projector, Whiteboard' },
  { id: 'cba-203', building: 'CBA Building', floor: 2, room_code: 'CBA 203', room_name: 'CBA 203', type: 'Accounting Lab', status: 'vacant', occupant: 'None', schedule: '--', capacity: 35, equipment: 'Workstations, Ledger Terminal' },
  // Floor 3
  { id: 'cba-301', building: 'CBA Building', floor: 3, room_code: 'CBA 301', room_name: 'CBA 301', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard, Ceiling Fans' },
  { id: 'cba-302', building: 'CBA Building', floor: 3, room_code: 'CBA 302', room_name: 'CBA 302', type: 'Economics Lab', status: 'vacant', occupant: 'None', schedule: '--', capacity: 30, equipment: 'Terminal Racks, Smart TV' },
  { id: 'cba-303', building: 'CBA Building', floor: 3, room_code: 'CBA 303', room_name: 'CBA 303', type: 'Seminar Room', status: 'vacant', occupant: 'None', schedule: '--', capacity: 35, equipment: 'Projector, Whiteboard' },
  // Floor 4
  { id: 'cba-401', building: 'CBA Building', floor: 4, room_code: 'CBA 401', room_name: 'CBA 401', type: 'Executive Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 60, equipment: 'Audio System, Dual Projectors' },
  { id: 'cba-402', building: 'CBA Building', floor: 4, room_code: 'CBA 402', room_name: 'CBA 402', type: 'Conference Suite', status: 'vacant', occupant: 'None', schedule: '--', capacity: 25, equipment: 'Video Conference, Smart TV' },
  { id: 'cba-403', building: 'CBA Building', floor: 4, room_code: 'CBA 403', room_name: 'CBA 403', type: 'Case Study Room', status: 'vacant', occupant: 'None', schedule: '--', capacity: 35, equipment: 'Tiered Seating, Screen' },

  // ── Hangar Complex (1 Storey, 6 Aviation bays) ──
  { id: 'h-001', building: 'Hangar', floor: 1, room_code: 'H 001', room_name: 'Hangar 001', type: 'Powerplants Bay', status: 'vacant', occupant: 'None', schedule: '--', capacity: 50, equipment: 'Engine Test Stands, Heavy Hoist' },
  { id: 'h-002', building: 'Hangar', floor: 1, room_code: 'H 002', room_name: 'Hangar 002', type: 'Avionics Lab', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Diagnostic Benches, Oscilloscopes' },
  { id: 'h-003', building: 'Hangar', floor: 1, room_code: 'H 003', room_name: 'Hangar 003', type: 'Flight Simulation', status: 'vacant', occupant: 'None', schedule: '--', capacity: 30, equipment: 'Flight Simulators, Avionics Racks' },
  { id: 'h-004', building: 'Hangar', floor: 1, room_code: 'H 004', room_name: 'Hangar 004', type: 'UAV & Drone Lab', status: 'vacant', occupant: 'None', schedule: '--', capacity: 35, equipment: 'Drone Cages, Telemetry Racks' },
  { id: 'h-005', building: 'Hangar', floor: 1, room_code: 'H 005', room_name: 'Hangar 005', type: 'Composite Materials', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Autoclave, Vacuum Table, Tooling' },
  { id: 'h-006', building: 'Hangar', floor: 1, room_code: 'H 006', room_name: 'Hangar 006', type: 'Aircraft Assembly', status: 'vacant', occupant: 'None', schedule: '--', capacity: 60, equipment: 'Hydraulic Lifts, Tool Depots' },

  // ── Pancho Building - Floor 1 ──
  { id: 'p1-101', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 101', room_name: '101', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard, Ceiling Fans' },
  { id: 'p1-103', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 103', room_name: '103', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Projector, Whiteboard' },
  { id: 'p1-105', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 105', room_name: '105', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard, Smart TV' },
  { id: 'p1-107', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 107', room_name: '107', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p1-109', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 109', room_name: '109', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard, Sound System' },
  { id: 'p1-111', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 111', room_name: '111', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p1-113', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 113', room_name: '113', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard, Projector' },
  { id: 'p1-115', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 115', room_name: '115', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Chemistry Lab Benches' },
  { id: 'p1-117a', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 117A', room_name: '117A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
  { id: 'p1-119', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 119', room_name: '119', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p1-121', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 121', room_name: '121', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Projector, Whiteboard' },
  { id: 'p1-123a', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 123A', room_name: '123A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
  { id: 'p1-125', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 125', room_name: '125', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p1-lecture', building: 'Pancho Building', floor: 1, room_code: 'PANCHO LEC', room_name: 'Lecture Room', type: 'Lecture Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 90, equipment: 'Tiered Seating, Sound System' },
  { id: 'p1-102', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 102', room_name: '102', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p1-104', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 104', room_name: '104', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p1-106', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 106', room_name: '106', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Projector, Whiteboard' },
  { id: 'p1-108', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 108', room_name: '108', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p1-scilab', building: 'Pancho Building', floor: 1, room_code: 'PANCHO SCILAB', room_name: 'Science Laboratory', type: 'Wet Lab', status: 'vacant', occupant: 'None', schedule: '--', capacity: 50, equipment: 'Microscopes, Safety Showers' },
  { id: 'p1-112a', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 112A', room_name: '112A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
  { id: 'p1-112b', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 112B', room_name: '112B', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
  { id: 'p1-114', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 114', room_name: '114', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Physics Apparatus, Projector' },
  { id: 'p1-116', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 116', room_name: '116', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p1-118', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 118', room_name: '118', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p1-122', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 122', room_name: '122', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard, Projector' },
  { id: 'p1-103bot', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 103E', room_name: '103E', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p1-library', building: 'Pancho Building', floor: 1, room_code: 'PANCHO LIB', room_name: 'Library', type: 'Learning Center', status: 'vacant', occupant: 'Open Access', schedule: '08:00 AM - 06:00 PM', capacity: 120, equipment: 'Book Stacks, Wi-Fi Desks' },
  { id: 'p1-multimedia', building: 'Pancho Building', floor: 1, room_code: 'PANCHO MULTIMEDIA', room_name: 'Multimedia Room', type: 'Audio-Visual Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 70, equipment: 'Acoustic Panels, 4K Projector' },

  // ── Pancho Building - Floor 2 ──
  { id: 'p2-201', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 201', room_name: '201', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-203', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 203', room_name: '203', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-206', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 206', room_name: '206', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-202', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 202', room_name: 'Pancho 202', type: 'Conference Room', status: 'vacant', occupant: 'None', schedule: '--', capacity: 12, equipment: 'Video Conf, Smart Board' },
  { id: 'p2-210', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 210', room_name: '210', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-212', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 212', room_name: '212', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-214a', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 214A', room_name: '214A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
  { id: 'p2-214b', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 214B', room_name: '214B', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
  { id: 'p2-216a', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 216A', room_name: '216A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
  { id: 'p2-216b', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 216B', room_name: '216B', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard, Projector' },
  { id: 'p2-215', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 215', room_name: '215', type: 'Architecture Studio', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Drafting Tables, Plotter' },
  { id: 'p2-220', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 220', room_name: '220', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-222', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 222', room_name: '222', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-224', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 224', room_name: '224', type: 'Lecture Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 65, equipment: 'Projector, Whiteboard' },
  { id: 'p2-226', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 226', room_name: '226', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Smart Board' },
  { id: 'p2-228a', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 228A', room_name: '228A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 35, equipment: 'Whiteboard' },
  { id: 'p2-228b', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 228B', room_name: '228B', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 35, equipment: 'Whiteboard' },
  { id: 'p2-sped', building: 'Pancho Building', floor: 2, room_code: 'PANCHO SPED', room_name: 'SPED Room', type: 'Resource Room', status: 'vacant', occupant: 'None', schedule: '--', capacity: 20, equipment: 'Sensory Stations, Braille Display' },
  { id: 'p2-unites', building: 'Pancho Building', floor: 2, room_code: 'PANCHO UNITES', room_name: 'Unites Room', type: 'Activity Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 30, equipment: 'Round Tables' },
  { id: 'p2-200', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 200', room_name: '200', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-204', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 204', room_name: '204', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Projector' },
  { id: 'p2-pta', building: 'Pancho Building', floor: 2, room_code: 'PANCHO PTA', room_name: 'PTA Room', type: 'Office', status: 'vacant', occupant: 'None', schedule: '--', capacity: 15, equipment: 'Conference Table' },
  { id: 'p2-sto', building: 'Pancho Building', floor: 2, room_code: 'PANCHO STO', room_name: 'STO', type: 'Faculty Office', status: 'vacant', occupant: 'None', schedule: '--', capacity: 15, equipment: 'Desks, File Storage' },
  { id: 'p2-scouts', building: 'Pancho Building', floor: 2, room_code: 'PANCHO SCOUTS', room_name: 'Scouts Room', type: 'Activity Office', status: 'vacant', occupant: 'None', schedule: '--', capacity: 20, equipment: 'Benches, Gear Lockers' },
  { id: 'p2-207', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 207', room_name: '207', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-209', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 209', room_name: '209', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-211', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 211', room_name: '211', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-213', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 213', room_name: '213', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-217', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 217', room_name: '217', type: 'Lecture Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 85, equipment: 'Sound System, Dual TV' },
  { id: 'p2-219', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 219', room_name: '219', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-221', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 221', room_name: '221', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-223', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 223', room_name: '223', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-225', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 225', room_name: '225', type: 'Lecture Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 70, equipment: 'Projector, Whiteboard' },
  { id: 'p2-227a', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 227A', room_name: '227A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
  { id: 'p2-227b', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 227B', room_name: '227B', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
  { id: 'p2-229', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 229', room_name: '229', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Physics Kits' },
  { id: 'p2-231', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 231', room_name: '231', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-232', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 232', room_name: '232', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-233', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 233', room_name: '233', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard, Screen' }
];

const SEED_LOGS = [
  { id: 'LOG-1', title: 'FARMS System Initialized', desc: 'System database initialized with all 58 campus facilities vacant and ready for scheduling.', type: 'system', color: 'green', icon: 'system', side: 'left' }
];

function seedDatabase(force = false) {
  const roomCountRow = db.prepare('SELECT COUNT(*) as count FROM rooms').get();
  
  if (roomCountRow.count > 0 && !force) {
    console.log(`[Database] Database already contains ${roomCountRow.count} rooms. Skipping initial seed.`);
    return;
  }

  console.log('[Database] Seeding rooms table...');
  const insertRoom = db.prepare(`
    INSERT OR REPLACE INTO rooms (
      id, building, floor, room_code, room_name, type, status, occupant, schedule, capacity, equipment, equipment_tags, declared_duration, actual_occupied_minutes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertLog = db.prepare(`
    INSERT OR REPLACE INTO activity_logs (
      id, title, desc, type, color, icon, side
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  SEED_ROOMS.forEach(r => {
    const tags = r.equipment ? r.equipment.split(',').map(s => s.trim()).filter(Boolean) : [];
    const declaredDuration = r.status === 'occupied' ? 120 : 0;
    const actualOccupiedMinutes = r.status === 'occupied' ? 45 : 0;

    insertRoom.run(
      r.id,
      r.building,
      r.floor,
      r.room_code,
      r.room_name,
      r.type,
      r.status,
      r.occupant,
      r.schedule,
      r.capacity,
      r.equipment,
      JSON.stringify(tags),
      declaredDuration,
      actualOccupiedMinutes
    );
  });

  SEED_LOGS.forEach(l => {
    insertLog.run(l.id, l.title, l.desc, l.type, l.color, l.icon, l.side);
  });

  const finalCount = db.prepare('SELECT COUNT(*) as count FROM rooms').get();
  console.log(`[Database] Successfully seeded ${finalCount.count} campus rooms & initial activity logs!`);
}

module.exports = {
  seedDatabase,
  SEED_ROOMS
};
