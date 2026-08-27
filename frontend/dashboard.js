/**
 * FARMS (Faculty Availability & Room Management System)
 * Master Client Application Script - Adaptive Sidebar & Blueprint Grid Architecture
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. INITIAL SEED DATA & STATE
  // ==========================================
  
  const DEFAULT_ROOMS = [
    // CBA Building (4 Storeys, 3 rooms each = 12 rooms)
    // Floor 1
    { id: 'cba-101', building: 'CBA Building', floor: 1, room: 'CBA 101', type: 'Lecture Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Dual Projectors, Sound System, Whiteboard' },
    { id: 'cba-102', building: 'CBA Building', floor: 1, room: 'CBA 102', type: 'Computer Lab', status: 'occupied', occupant: 'Prof. Santos (CS101)', schedule: '08:00 AM - 10:00 AM', capacity: 40, equipment: '40 PC Workstations, Smart TV' },
    { id: 'cba-103', building: 'CBA Building', floor: 1, room: 'CBA 103', type: 'Business Lab', status: 'vacant', occupant: 'None', schedule: '--', capacity: 35, equipment: 'Smart Board, Conference Setup' },
    // Floor 2
    { id: 'cba-201', building: 'CBA Building', floor: 2, room: 'CBA 201', type: 'Smart Classroom', status: 'occupied', occupant: 'Dr. Reyes (BUS201)', schedule: '10:00 AM - 12:00 PM', capacity: 40, equipment: 'Interactive Display, Sound System' },
    { id: 'cba-202', building: 'CBA Building', floor: 2, room: 'CBA 202', type: 'Lecture Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Projector, Whiteboard' },
    { id: 'cba-203', building: 'CBA Building', floor: 2, room: 'CBA 203', type: 'Accounting Lab', status: 'occupied', occupant: 'Prof. Villanueva (ACT101)', schedule: '01:00 PM - 03:00 PM', capacity: 35, equipment: 'Workstations, Ledger Terminal' },
    // Floor 3
    { id: 'cba-301', building: 'CBA Building', floor: 3, room: 'CBA 301', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard, Ceiling Fans' },
    { id: 'cba-302', building: 'CBA Building', floor: 3, room: 'CBA 302', type: 'Economics Lab', status: 'maintenance', occupant: 'None', schedule: 'Under Maintenance', capacity: 30, equipment: 'Terminal Racks, Smart TV' },
    { id: 'cba-303', building: 'CBA Building', floor: 3, room: 'CBA 303', type: 'Seminar Room', status: 'vacant', occupant: 'None', schedule: '--', capacity: 35, equipment: 'Projector, Whiteboard' },
    // Floor 4
    { id: 'cba-401', building: 'CBA Building', floor: 4, room: 'CBA 401', type: 'Executive Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 60, equipment: 'Audio System, Dual Projectors' },
    { id: 'cba-402', building: 'CBA Building', floor: 4, room: 'CBA 402', type: 'Conference Suite', status: 'occupied', occupant: 'Dean Mendoza (Admin)', schedule: '01:00 PM - 04:00 PM', capacity: 25, equipment: 'Video Conference, Smart TV' },
    { id: 'cba-403', building: 'CBA Building', floor: 4, room: 'CBA 403', type: 'Case Study Room', status: 'vacant', occupant: 'None', schedule: '--', capacity: 35, equipment: 'Tiered Seating, Screen' },

    // Hangar (1 Storey, 6 rooms: Left 004, 005, 006; Right 003, 002, 001)
    { id: 'h-001', building: 'Hangar', floor: 1, room: 'Hangar 001', type: 'Powerplants Bay', status: 'occupied', occupant: 'Engr. Cruz (AERO202)', schedule: '09:00 AM - 12:00 PM', capacity: 50, equipment: 'Engine Test Stands, Heavy Hoist' },
    { id: 'h-002', building: 'Hangar', floor: 1, room: 'Hangar 002', type: 'Avionics Lab', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Diagnostic Benches, Oscilloscopes' },
    { id: 'h-003', building: 'Hangar', floor: 1, room: 'Hangar 003', type: 'Flight Simulation', status: 'vacant', occupant: 'None', schedule: '--', capacity: 30, equipment: 'Flight Simulators, Avionics Racks' },
    { id: 'h-004', building: 'Hangar', floor: 1, room: 'Hangar 004', type: 'UAV & Drone Lab', status: 'occupied', occupant: 'Prof. De Vega (UAV101)', schedule: '01:00 PM - 03:30 PM', capacity: 35, equipment: 'Drone Cages, Telemetry Racks' },
    { id: 'h-005', building: 'Hangar', floor: 1, room: 'Hangar 005', type: 'Composite Materials', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Autoclave, Vacuum Table, Tooling' },
    { id: 'h-006', building: 'Hangar', floor: 1, room: 'Hangar 006', type: 'Aircraft Assembly', status: 'maintenance', occupant: 'None', schedule: 'Facility Recalibration', capacity: 60, equipment: 'Hydraulic Lifts, Tool Depots' },

    // Pancho Building - Floor 1
    { id: 'p1-101', building: 'Pancho Building', floor: 1, room: '101', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard, Ceiling Fans' },
    { id: 'p1-103', building: 'Pancho Building', floor: 1, room: '103', type: 'Classroom', status: 'occupied', occupant: 'Dr. Reyes (BUS301)', schedule: '01:00 PM - 03:00 PM', capacity: 45, equipment: 'Projector, Whiteboard' },
    { id: 'p1-105', building: 'Pancho Building', floor: 1, room: '105', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard, Smart TV' },
    { id: 'p1-107', building: 'Pancho Building', floor: 1, room: '107', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p1-109', building: 'Pancho Building', floor: 1, room: '109', type: 'Classroom', status: 'occupied', occupant: 'Prof. Diaz (MATH101)', schedule: '10:00 AM - 12:00 PM', capacity: 45, equipment: 'Whiteboard, Sound System' },
    { id: 'p1-111', building: 'Pancho Building', floor: 1, room: '111', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p1-113', building: 'Pancho Building', floor: 1, room: '113', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard, Projector' },
    { id: 'p1-115', building: 'Pancho Building', floor: 1, room: '115', type: 'Classroom', status: 'occupied', occupant: 'Prof. Rivera (CHEM101)', schedule: '08:00 AM - 11:00 AM', capacity: 45, equipment: 'Chemistry Lab Benches' },
    { id: 'p1-117a', building: 'Pancho Building', floor: 1, room: '117A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
    { id: 'p1-119', building: 'Pancho Building', floor: 1, room: '119', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p1-121', building: 'Pancho Building', floor: 1, room: '121', type: 'Classroom', status: 'occupied', occupant: 'Prof. Soriano (FIL101)', schedule: '01:00 PM - 03:00 PM', capacity: 45, equipment: 'Projector, Whiteboard' },
    { id: 'p1-123a', building: 'Pancho Building', floor: 1, room: '123A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
    { id: 'p1-125', building: 'Pancho Building', floor: 1, room: '125', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p1-lecture', building: 'Pancho Building', floor: 1, room: 'Lecture Room', type: 'Lecture Hall', status: 'occupied', occupant: 'Prof. Gomez (ENG101)', schedule: '10:00 AM - 12:00 PM', capacity: 90, equipment: 'Tiered Seating, Sound System' },
    { id: 'p1-102', building: 'Pancho Building', floor: 1, room: '102', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p1-104', building: 'Pancho Building', floor: 1, room: '104', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p1-106', building: 'Pancho Building', floor: 1, room: '106', type: 'Classroom', status: 'occupied', occupant: 'Prof. Morales (ENG201)', schedule: '08:00 AM - 10:00 AM', capacity: 45, equipment: 'Projector, Whiteboard' },
    { id: 'p1-108', building: 'Pancho Building', floor: 1, room: '108', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p1-scilab', building: 'Pancho Building', floor: 1, room: 'Science Laboratory', type: 'Wet Lab', status: 'occupied', occupant: 'Dr. Lim (BIO102)', schedule: '02:00 PM - 05:00 PM', capacity: 50, equipment: 'Microscopes, Safety Showers' },
    { id: 'p1-112a', building: 'Pancho Building', floor: 1, room: '112A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
    { id: 'p1-112b', building: 'Pancho Building', floor: 1, room: '112B', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
    { id: 'p1-114', building: 'Pancho Building', floor: 1, room: '114', type: 'Classroom', status: 'occupied', occupant: 'Prof. Navarro (PHY102)', schedule: '02:00 PM - 04:00 PM', capacity: 45, equipment: 'Physics Apparatus, Projector' },
    { id: 'p1-116', building: 'Pancho Building', floor: 1, room: '116', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p1-118', building: 'Pancho Building', floor: 1, room: '118', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p1-122', building: 'Pancho Building', floor: 1, room: '122', type: 'Classroom', status: 'occupied', occupant: 'Dr. Santos (SOC102)', schedule: '10:00 AM - 12:00 PM', capacity: 45, equipment: 'Whiteboard, Projector' },
    { id: 'p1-103bot', building: 'Pancho Building', floor: 1, room: '103 (East)', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p1-library', building: 'Pancho Building', floor: 1, room: 'Library', type: 'Learning Center', status: 'vacant', occupant: 'Open Access', schedule: '08:00 AM - 06:00 PM', capacity: 120, equipment: 'Book Stacks, Wi-Fi Desks' },
    { id: 'p1-multimedia', building: 'Pancho Building', floor: 1, room: 'Multimedia Room', type: 'Audio-Visual Hall', status: 'occupied', occupant: 'AV Team (Forum)', schedule: '09:00 AM - 11:30 AM', capacity: 70, equipment: 'Acoustic Panels, 4K Projector' },

    // Pancho Building - Floor 2
    { id: 'p2-201', building: 'Pancho Building', floor: 2, room: '201', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-203', building: 'Pancho Building', floor: 2, room: '203', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-206', building: 'Pancho Building', floor: 2, room: '206', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-202', building: 'Pancho Building', floor: 2, room: 'Pancho 202', type: 'Conference Room', status: 'occupied', occupant: 'Dr. Smith (Physics Seminar)', schedule: '02:00 PM - 04:00 PM', capacity: 12, equipment: 'Video Conf, Smart Board' },
    { id: 'p2-210', building: 'Pancho Building', floor: 2, room: '210', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-212', building: 'Pancho Building', floor: 2, room: '212', type: 'Classroom', status: 'occupied', occupant: 'Prof. Mendoza (HIST101)', schedule: '08:00 AM - 10:00 AM', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-214a', building: 'Pancho Building', floor: 2, room: '214A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
    { id: 'p2-214b', building: 'Pancho Building', floor: 2, room: '214B', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
    { id: 'p2-216a', building: 'Pancho Building', floor: 2, room: '216A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
    { id: 'p2-216b', building: 'Pancho Building', floor: 2, room: '216B', type: 'Classroom', status: 'occupied', occupant: 'Prof. De Leon (LIT102)', schedule: '01:00 PM - 03:00 PM', capacity: 40, equipment: 'Whiteboard, Projector' },
    { id: 'p2-215', building: 'Pancho Building', floor: 2, room: '215', type: 'Architecture Studio', status: 'occupied', occupant: 'Engr. Dalisay (ARCH202)', schedule: '08:00 AM - 11:30 AM', capacity: 40, equipment: 'Drafting Tables, Plotter' },
    { id: 'p2-220', building: 'Pancho Building', floor: 2, room: '220', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-222', building: 'Pancho Building', floor: 2, room: '222', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-224', building: 'Pancho Building', floor: 2, room: '224', type: 'Lecture Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 65, equipment: 'Projector, Whiteboard' },
    { id: 'p2-226', building: 'Pancho Building', floor: 2, room: '226', type: 'Classroom', status: 'occupied', occupant: 'Dr. Garcia (CHEM202)', schedule: '02:00 PM - 04:00 PM', capacity: 45, equipment: 'Smart Board' },
    { id: 'p2-228a', building: 'Pancho Building', floor: 2, room: '228A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 35, equipment: 'Whiteboard' },
    { id: 'p2-228b', building: 'Pancho Building', floor: 2, room: '228B', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 35, equipment: 'Whiteboard' },
    { id: 'p2-sped', building: 'Pancho Building', floor: 2, room: 'SPED Room', type: 'Resource Room', status: 'occupied', occupant: 'Mrs. Ramos (Special Ed)', schedule: '08:00 AM - 12:00 PM', capacity: 20, equipment: 'Sensory Stations, Braille Display' },
    { id: 'p2-unites', building: 'Pancho Building', floor: 2, room: 'Unites Room', type: 'Activity Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 30, equipment: 'Round Tables' },
    { id: 'p2-200', building: 'Pancho Building', floor: 2, room: '200', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-204', building: 'Pancho Building', floor: 2, room: '204', type: 'Classroom', status: 'occupied', occupant: 'Prof. Cruz (ENG102)', schedule: '10:00 AM - 12:00 PM', capacity: 45, equipment: 'Projector' },
    { id: 'p2-pta', building: 'Pancho Building', floor: 2, room: 'PTA Room', type: 'Office', status: 'vacant', occupant: 'None', schedule: '--', capacity: 15, equipment: 'Conference Table' },
    { id: 'p2-sto', building: 'Pancho Building', floor: 2, room: 'STO', type: 'Faculty Office', status: 'occupied', occupant: 'Student Affairs', schedule: '08:00 AM - 05:00 PM', capacity: 15, equipment: 'Desks, File Storage' },
    { id: 'p2-scouts', building: 'Pancho Building', floor: 2, room: 'Scouts Room', type: 'Activity Office', status: 'vacant', occupant: 'None', schedule: '--', capacity: 20, equipment: 'Benches, Gear Lockers' },
    { id: 'p2-207', building: 'Pancho Building', floor: 2, room: '207', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-209', building: 'Pancho Building', floor: 2, room: '209', type: 'Classroom', status: 'occupied', occupant: 'Prof. Tolentino (FIL102)', schedule: '01:00 PM - 03:00 PM', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-211', building: 'Pancho Building', floor: 2, room: '211', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-213', building: 'Pancho Building', floor: 2, room: '213', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-217', building: 'Pancho Building', floor: 2, room: '217', type: 'Lecture Hall', status: 'occupied', occupant: 'Dr. Hernandez (ENG202)', schedule: '09:00 AM - 11:30 AM', capacity: 85, equipment: 'Sound System, Dual TV' },
    { id: 'p2-219', building: 'Pancho Building', floor: 2, room: '219', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-221', building: 'Pancho Building', floor: 2, room: '221', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-223', building: 'Pancho Building', floor: 2, room: '223', type: 'Classroom', status: 'occupied', occupant: 'Prof. Castillo (MATH201)', schedule: '08:00 AM - 10:00 AM', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-225', building: 'Pancho Building', floor: 2, room: '225', type: 'Lecture Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 70, equipment: 'Projector, Whiteboard' },
    { id: 'p2-227a', building: 'Pancho Building', floor: 2, room: '227A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
    { id: 'p2-227b', building: 'Pancho Building', floor: 2, room: '227B', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
    { id: 'p2-229', building: 'Pancho Building', floor: 2, room: '229', type: 'Classroom', status: 'occupied', occupant: 'Dr. Valerio (PHYS201)', schedule: '02:00 PM - 04:30 PM', capacity: 45, equipment: 'Physics Kits' },
    { id: 'p2-231', building: 'Pancho Building', floor: 2, room: '231', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-232', building: 'Pancho Building', floor: 2, room: '232', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
    { id: 'p2-233', building: 'Pancho Building', floor: 2, room: '233', type: 'Classroom', status: 'occupied', occupant: 'Prof. Robles (BIO201)', schedule: '10:00 AM - 12:00 PM', capacity: 45, equipment: 'Whiteboard, Screen' }
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
    { id: 'LOG-1', title: 'Room Assigned: Pancho 103', time: '10 mins ago', desc: 'Assigned to Dr. Reyes for Business Admin Forum (01:00 PM - 03:00 PM)', icon: '📅', type: 'booking', color: 'green', side: 'left' },
    { id: 'LOG-2', title: 'Schedule Override: Hangar 001', time: '45 mins ago', desc: 'Extended until 12:00 PM for Engr. Cruz (Propulsion Test)', icon: '✈️', type: 'booking', color: 'teal', side: 'right' },
    { id: 'LOG-3', title: 'Maintenance Flagged: CBA 302', time: '2 hours ago', desc: 'Scheduled maintenance for economics lab terminal recalibration.', icon: '🔧', type: 'maintenance', color: 'amber', side: 'left' },
    { id: 'LOG-4', title: 'Room Released: Pancho 105', time: '3 hours ago', desc: 'Morning session completed. Room returned to Available pool.', icon: '🚪', type: 'release', color: 'teal', side: 'right' },
    { id: 'LOG-5', title: 'Automated Facility Audit', time: '5 hours ago', desc: 'Daily room occupancy synchronization executed. 68 total facilities synced.', icon: '⚡', type: 'system', color: 'green', side: 'left' }
  ];

  const DEFAULT_NOTIFS = [
    { id: 'N1', title: 'New Access Request', desc: 'Prof. Gomez requested Pancho Lecture Room for tomorrow.', time: '5 mins ago', unread: true },
    { id: 'N2', title: 'Maintenance Pending', desc: 'CBA 302 terminal recalibration scheduled for inspection.', time: '1 hour ago', unread: true },
    { id: 'N3', title: 'Auto-Sync Completed', desc: 'All 3 campus buildings operational status refreshed.', time: '4 hours ago', unread: false }
  ];

  // Refresh local storage if old seed format detected
  let storedRooms = JSON.parse(localStorage.getItem('farms_rooms_v4'));
  let rooms = storedRooms || DEFAULT_ROOMS;
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
  const modalStatusSelect = document.getElementById('modalStatusSelect');
  const modalCapacity = document.getElementById('modalCapacity');
  const modalOccupant = document.getElementById('modalOccupant');
  const modalSchedule = document.getElementById('modalSchedule');
  const btnReleaseRoom = document.getElementById('btnReleaseRoom');
  const roomAssignmentForm = document.getElementById('roomAssignmentForm');

  const toastContainer = document.getElementById('toastContainer');

  let activeBuilding = null;
  let activeFloor = 1;
  let currentEditingRoom = null;
  let currentActiveTab = 'map'; // 'map', 'list', 'matrix'

  const BUILDING_CONFIG = {
    'Pancho Building': { floors: 2, label: 'Pancho Building', icon: '🏛️', theme: 'pancho' },
    'CBA Building': { floors: 4, label: 'CBA Building', icon: '🏢', theme: 'cba' },
    'Hangar': { floors: 1, label: 'Hangar', icon: '✈️', theme: 'hangar' }
  };

  // ==========================================
  // 3. TOAST & NOTIFICATIONS
  // ==========================================
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
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

    if (currentActiveTab === 'list') {
      if (sidebarContextIcon) sidebarContextIcon.textContent = '📋';
      if (sidebarContextTitle) sidebarContextTitle.textContent = 'Room Directory';
      if (sidebarListBlock) sidebarListBlock.classList.remove('hidden');
      if (sidebarMiniStatsWrap) sidebarMiniStatsWrap.classList.remove('hidden');
      if (campusBlockDivider) campusBlockDivider.classList.remove('hidden');
    } else {
      // Map Mode
      if (activeBuilding) {
        // Inside a Building Floor Plan -> HIDE campus mini KPI stats and divider
        if (sidebarMiniStatsWrap) sidebarMiniStatsWrap.classList.add('hidden');
        if (campusBlockDivider) campusBlockDivider.classList.add('hidden');

        const cfg = BUILDING_CONFIG[activeBuilding] || { icon: '🏛️', floors: 1 };
        if (sidebarContextIcon) sidebarContextIcon.textContent = cfg.icon;
        if (sidebarContextTitle) sidebarContextTitle.textContent = `${activeBuilding} (Floor ${activeFloor})`;
        if (sidebarBuildingBlock) sidebarBuildingBlock.classList.remove('hidden');

        // Update Building Hero Card
        if (bldgHeroTitle) bldgHeroTitle.textContent = activeBuilding;
        if (bldgHeroBadge) bldgHeroBadge.textContent = `${cfg.floors} ${cfg.floors > 1 ? 'Floors' : 'Floor'}`;
        
        const bldgRooms = rooms.filter(r => r.building === activeBuilding);
        const vacant = bldgRooms.filter(r => r.status === 'vacant').length;
        const occupied = bldgRooms.filter(r => r.status === 'occupied').length;
        if (bldgHeroOccSummary) bldgHeroOccSummary.textContent = `${vacant} Available • ${occupied} Occupied`;

        if (bldgContextHero) {
          bldgContextHero.className = `building-context-card ${activeBuilding === 'CBA Building' ? 'cba' : activeBuilding === 'Hangar' ? 'hangar' : ''}`;
        }

        // Update Floor Metrics
        const floorRooms = bldgRooms.filter(r => r.floor === activeFloor);
        const flrVac = floorRooms.filter(r => r.status === 'vacant').length;
        const flrOcc = floorRooms.filter(r => r.status === 'occupied').length;
        if (floorVacantCount) floorVacantCount.textContent = flrVac;
        if (floorOccupiedCount) floorOccupiedCount.textContent = flrOcc;

        buildFloorPills(activeBuilding);
      } else {
        // In Campus Overview Map -> SHOW campus mini KPI stats and divider
        if (sidebarMiniStatsWrap) sidebarMiniStatsWrap.classList.remove('hidden');
        if (campusBlockDivider) campusBlockDivider.classList.remove('hidden');

        if (sidebarContextIcon) sidebarContextIcon.textContent = '🗺️';
        if (sidebarContextTitle) sidebarContextTitle.textContent = 'Campus Overview';
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
  document.querySelectorAll('.bldg-jump-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const bldg = btn.getAttribute('data-jump');
      if (bldg) {
        btnSvgView.click();
        openBuildingView(bldg);
      }
    });
  });

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
    if (barFillCba) barFillCba.style.height = `${Math.round((cOcc / maxBarVal) * 100)}%`;
    if (barFillHangar) barFillHangar.style.height = `${Math.round((hOcc / maxBarVal) * 100)}%`;
    if (barFillPancho) barFillPancho.style.height = `${Math.round((pOcc / maxBarVal) * 100)}%`;

    // Card 2: Vacant Rooms & Circular Ring Gauge
    const statVacantRooms = document.getElementById('statVacantRooms');
    const vacantGaugeNum = document.getElementById('vacantGaugeNum');
    const vacantGaugeTotal = document.getElementById('vacantGaugeTotal');
    const vacantRingProgress = document.getElementById('vacantRingProgress');
    const kpiFreeRate = document.getElementById('kpiFreeRate');

    if (statVacantRooms) statVacantRooms.textContent = vacantRooms;
    if (vacantGaugeNum) vacantGaugeNum.textContent = vacantRooms;
    if (vacantGaugeTotal) vacantGaugeTotal.textContent = `of ${totalRooms}`;
    if (kpiFreeRate) kpiFreeRate.textContent = `${vacantRooms} / ${totalRooms} Rooms Free`;

    if (vacantRingProgress && totalRooms > 0) {
      const circum = 2 * Math.PI * 32; // ~201
      const offset = circum - (vacantRooms / totalRooms) * circum;
      vacantRingProgress.style.strokeDashoffset = offset;
    }

    // Card 3: Pending Requests
    const statPendingRequests = document.getElementById('statPendingRequests');
    if (statPendingRequests) statPendingRequests.textContent = pendingReqs;

    if (sidebarVacantCount) sidebarVacantCount.textContent = vacantRooms;
    if (sidebarOccupiedCount) sidebarOccupiedCount.textContent = occupiedRooms;
    if (sidebarMaintenanceCount) sidebarMaintenanceCount.textContent = maintenanceRooms;

    if (sidebarRequestBadge) {
      sidebarRequestBadge.textContent = pendingReqs;
      sidebarRequestBadge.style.display = pendingReqs > 0 ? 'inline-block' : 'none';
    }

    renderStationaryOccupancyRings();
    updateAdaptiveSidebar();
  }

  // ==========================================
  // 6. ZERO-JITTER STATIONARY OCCUPANCY RINGS
  // ==========================================
  function renderStationaryOccupancyRings() {
    if (!ringLayer) return;
    ringLayer.innerHTML = '';

    const bldgs = [
      { name: 'Pancho Building', cx: 530, cy: 180, r: 44 },
      { name: 'CBA Building', cx: 1267.5, cy: 275, r: 36 },
      { name: 'Hangar', cx: 1060, cy: 565, r: 46 }
    ];

    bldgs.forEach(b => {
      const bldgRooms = rooms.filter(r => r.building === b.name);
      const total = bldgRooms.length;
      const occupied = bldgRooms.filter(r => r.status === 'occupied').length;
      const pct = total > 0 ? Math.round((occupied / total) * 100) : 0;
      const circumference = 2 * Math.PI * b.r;
      const strokeDashoffset = circumference - (pct / 100) * circumference;

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'stationary-ring');
      g.setAttribute('data-bldg', b.name);
      g.style.cursor = 'pointer';

      const strokeColor = pct > 75 ? '#f43f5e' : pct > 45 ? '#f59e0b' : '#10b981';

      g.innerHTML = `
        <!-- Plate Backdrop -->
        <circle cx="${b.cx}" cy="${b.cy}" r="${b.r + 10}" fill="#ffffff" stroke="#cbd5e1" stroke-width="2.5" filter="url(#labelShadow)"/>
        <!-- Background Track -->
        <circle cx="${b.cx}" cy="${b.cy}" r="${b.r}" fill="#f8fafc" stroke="#e2e8f0" stroke-width="8"/>
        <!-- Active Progress Ring -->
        <circle cx="${b.cx}" cy="${b.cy}" r="${b.r}" fill="none" stroke="${strokeColor}" stroke-width="8"
                stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}"
                stroke-linecap="round" transform="rotate(-90 ${b.cx} ${b.cy})"/>
        <!-- Central Percentage Text -->
        <text x="${b.cx}" y="${b.cy + 7}" font-family="Plus Jakarta Sans, system-ui" font-weight="900" font-size="19" fill="#0f172a" text-anchor="middle">${pct}%</text>
        <!-- Occupancy Micro Pill (2x Doubled Size) -->
        <rect x="${b.cx - 58}" y="${b.cy + b.r + 2}" width="116" height="26" rx="13" fill="#0f172a"/>
        <text x="${b.cx}" y="${b.cy + b.r + 19}" font-family="Plus Jakarta Sans, system-ui" font-weight="900" font-size="12.5" fill="#ffffff" text-anchor="middle">${occupied}/${total} IN-USE</text>
      `;

      g.addEventListener('click', (e) => {
        e.stopPropagation();
        openBuildingView(b.name);
      });

      ringLayer.appendChild(g);
    });

    // Attach listeners for interactive campus buildings
    document.querySelectorAll('.interactive-bldg').forEach(el => {
      const bldgName = el.getAttribute('data-bldg');
      const bldgRooms = rooms.filter(r => r.building === bldgName);
      const total = bldgRooms.length;
      const occupied = bldgRooms.filter(r => r.status === 'occupied').length;
      const vacant = bldgRooms.filter(r => r.status === 'vacant').length;

      el.addEventListener('mouseenter', () => {
        if (!tooltip) return;
        tooltipRoom.textContent = bldgName;
        tooltipStatus.textContent = `${occupied} OCCUPIED / ${vacant} VACANT`;
        tooltipStatus.className = `tooltip-status ${vacant > 0 ? 'vacant' : 'occupied'}`;
        tooltipOccupant.textContent = `Total Facilities: ${total} Classrooms & Labs`;
        tooltipSchedule.textContent = `Active Status: Operational`;
        tooltipDetail.textContent = '👉 Click building to view detailed floor plans';
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

    // Prop Gym Tooltip
    const propGym = document.getElementById('campus-prop-gym');
    if (propGym) {
      propGym.addEventListener('mouseenter', () => {
        if (!tooltip) return;
        tooltipRoom.textContent = 'Covered Court / University Gymnasium';
        tooltipStatus.textContent = 'CAMPUS PROP';
        tooltipStatus.className = 'tooltip-status vacant';
        tooltipOccupant.textContent = 'Athletic & Common Grounds';
        tooltipSchedule.textContent = 'Open Daily: 06:00 AM - 08:00 PM';
        tooltipDetail.textContent = 'Facility Prop • Non-classroom Structure';
        showHudCallout();
      });
      propGym.addEventListener('mouseleave', () => {
        hideHudCallout();
      });
    }

    // Prop Pavilion Tooltip
    const propPavilion = document.getElementById('campus-prop-pavilion');
    if (propPavilion) {
      propPavilion.addEventListener('mouseenter', () => {
        if (!tooltip) return;
        tooltipRoom.textContent = 'Academic Pavilion & Student Center';
        tooltipStatus.textContent = 'CAMPUS PROP';
        tooltipStatus.className = 'tooltip-status vacant';
        tooltipOccupant.textContent = 'Administrative & Student Services';
        tooltipSchedule.textContent = 'Office Hours: 08:00 AM - 05:00 PM';
        tooltipDetail.textContent = 'Facility Prop • Administration';
        showHudCallout();
      });
      propPavilion.addEventListener('mouseleave', () => {
        hideHudCallout();
      });
    }
  }

  const hudLaserPulse = document.getElementById('hudLaserPulse');

  // Dynamic HUD Physics & Adaptive Responsive Reach System
  let hudTarget = { x: 0, y: 0, x1: 0, y1: 0, x2: 0, y2: 0, goRight: true, goUp: true, active: false };
  let hudCurrent = { x: 0, y: 0, x1: 0, y1: 0, x2: 0, y2: 0, initialized: false };
  let hudRafId = null;

  function renderHudPhysicsLoop() {
    if (!hudTarget.active) {
      hudRafId = null;
      return;
    }

    if (!hudCurrent.initialized) {
      hudCurrent = { ...hudTarget, initialized: true };
    } else {
      // Fluid organic spring interpolation (tether elasticity)
      hudCurrent.x += (hudTarget.x - hudCurrent.x) * 0.42;
      hudCurrent.y += (hudTarget.y - hudCurrent.y) * 0.42;
      hudCurrent.x1 += (hudTarget.x1 - hudCurrent.x1) * 0.24;
      hudCurrent.y1 += (hudTarget.y1 - hudCurrent.y1) * 0.24;
      hudCurrent.x2 += (hudTarget.x2 - hudCurrent.x2) * 0.18;
      hudCurrent.y2 += (hudTarget.y2 - hudCurrent.y2) * 0.18;
    }

    const x = hudCurrent.x;
    const y = hudCurrent.y;
    const x1 = hudCurrent.x1;
    const y1 = hudCurrent.y1;
    const x2 = hudCurrent.x2;
    const y2 = hudCurrent.y2;
    const cardWidth = 250;

    if (hudAnchorRing) {
      hudAnchorRing.setAttribute('cx', x.toFixed(1));
      hudAnchorRing.setAttribute('cy', y.toFixed(1));
    }
    if (hudAnchorDot) {
      hudAnchorDot.setAttribute('cx', x.toFixed(1));
      hudAnchorDot.setAttribute('cy', y.toFixed(1));
    }
    if (hudJointDot) {
      hudJointDot.setAttribute('cx', x1.toFixed(1));
      hudJointDot.setAttribute('cy', y1.toFixed(1));
    }
    if (hudEndDot) {
      hudEndDot.setAttribute('cx', x2.toFixed(1));
      hudEndDot.setAttribute('cy', y2.toFixed(1));
    }

    const pointsString = `${x.toFixed(1)},${y.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
    if (hudLeaderLine) hudLeaderLine.setAttribute('points', pointsString);
    if (hudLaserPulse) hudLaserPulse.setAttribute('points', pointsString);

    if (tooltip) {
      if (hudTarget.goRight) {
        tooltip.style.left = `${(x2 + 4).toFixed(1)}px`;
        tooltip.style.right = 'auto';
      } else {
        tooltip.style.left = `${(x2 - cardWidth - 4).toFixed(1)}px`;
        tooltip.style.right = 'auto';
      }
      tooltip.style.top = `${(y2 - 24).toFixed(1)}px`;
    }

    hudRafId = requestAnimationFrame(renderHudPhysicsLoop);
  }

  function startHudPhysics() {
    hudTarget.active = true;
    if (!hudRafId) {
      hudRafId = requestAnimationFrame(renderHudPhysicsLoop);
    }
  }

  function stopHudPhysics() {
    hudTarget.active = false;
    hudCurrent.initialized = false;
  }

  // Update show/hide to trigger physics
  const origShowHud = showHudCallout;
  showHudCallout = function() {
    origShowHud();
    startHudPhysics();
  };

  const origHideHud = hideHudCallout;
  hideHudCallout = function() {
    origHideHud();
    stopHudPhysics();
  };

  if (mapDisplayArea) {
    mapDisplayArea.addEventListener('mousemove', (e) => {
      if (hudCalloutContainer && !hudCalloutContainer.classList.contains('hidden')) {
        const rect = mapDisplayArea.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const cardWidth = 250;
        const spaceRight = rect.width - x;
        const spaceLeft = x;
        const spaceTop = y;
        const spaceBottom = rect.height - y;

        // Adaptive direction determination
        const goRight = (spaceRight >= 270 || spaceRight >= spaceLeft);
        const goUp = (spaceTop >= 130 || spaceTop >= spaceBottom);

        // Dynamically scale line lengths strictly clamped within 100px of building/cursor
        const availX = goRight ? spaceRight : spaceLeft;
        const availY = goUp ? spaceTop : spaceBottom;
        const clearDist = Math.min(availX - cardWidth, availY);

        // Compact 45-degree angled reach (clamped: 45px to 65px, ~32px to 46px horizontal/vertical projection)
        const diagLength = Math.max(45, Math.min(65, clearDist * 0.35));
        const dxAngled = diagLength * 0.7071; // 45° angle
        const dyAngled = diagLength * 0.7071;

        // Compact horizontal shoulder end (clamped: 20px to 30px)
        // Total combined offset is strictly <= 76px (well under 100px total distance)
        const dxHoriz = Math.max(20, Math.min(30, (availX - dxAngled - cardWidth) * 0.2));

        const x1 = goRight ? (x + dxAngled) : (x - dxAngled);
        const y1 = goUp ? (y - dyAngled) : (y + dyAngled);
        const x2 = goRight ? (x1 + dxHoriz) : (x1 - dxHoriz);
        const y2 = y1;

        hudTarget = {
          x, y, x1, y1, x2, y2, goRight, goUp, active: true
        };

        if (!hudRafId) {
          hudRafId = requestAnimationFrame(renderHudPhysicsLoop);
        }
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
        <svg viewBox="0 0 1280 340" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="floorGridCBA" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#cbd5e1" stroke-width="1.3"/>
              <circle cx="0" cy="0" r="1.5" fill="#64748b" opacity="0.85"/>
            </pattern>
            <filter id="cardGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#1e3a8a" flood-opacity="0.08"/>
            </filter>
          </defs>

          <!-- Blueprint Background Grid -->
          <rect x="15" y="10" width="1250" height="315" rx="12" fill="url(#floorGridCBA)" stroke="#cbd5e1" stroke-width="2"/>
          
          <!-- Outer Architectural Shell -->
          <rect x="40" y="35" width="1200" height="265" rx="10" fill="#ffffff" stroke="#94a3b8" stroke-width="2" filter="url(#cardGlow)"/>

          <!-- Header -->
          <g transform="translate(60, 60)">
            <text font-family="Plus Jakarta Sans, system-ui" font-weight="900" font-size="18" fill="#1e3a8a">🏢 CBA BUILDING — LEVEL ${floor} BLUEPRINT (3 ROOMS)</text>
            <text y="18" font-family="Plus Jakarta Sans, system-ui" font-weight="700" font-size="11" fill="#64748b">Eastern Academic Wing · Level ${floor} Layout</text>
          </g>

          <!-- Hallway & Corridors -->
          <rect x="60" y="95" width="1160" height="180" fill="#f8fafc" stroke="#cbd5e1" stroke-dasharray="4,4" stroke-width="1.5" rx="8"/>

          <!-- West Stairwell -->
          <g transform="translate(75, 105)">
            <rect width="90" height="160" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5" rx="6"/>
            <line x1="10" y1="30" x2="80" y2="30" stroke="#059669" stroke-width="1.2"/>
            <line x1="10" y1="60" x2="80" y2="60" stroke="#059669" stroke-width="1.2"/>
            <line x1="10" y1="90" x2="80" y2="90" stroke="#059669" stroke-width="1.2"/>
            <line x1="10" y1="120" x2="80" y2="120" stroke="#059669" stroke-width="1.2"/>
            <text x="45" y="148" font-family="Plus Jakarta Sans" font-weight="900" font-size="11" fill="#047857" text-anchor="middle">STAIRS W</text>
          </g>

          <!-- Room 1 (CBA X01) -->
          <g class="room-group ${getRoomStateClass(building, room1, floor)}" data-bldg="${building}" data-room="${room1}" data-floor="${floor}">
            <rect x="180" y="105" width="270" height="160" rx="8" class="room-rect"/>
            <text x="315" y="170" font-family="Plus Jakarta Sans" font-weight="900" font-size="16" fill="#0f172a" text-anchor="middle" class="room-text">${room1}</text>
            <text x="315" y="194" font-family="Plus Jakarta Sans" font-weight="700" font-size="11" fill="#64748b" text-anchor="middle" class="sub-text">${room1Type}</text>
            <text x="315" y="222" font-family="Plus Jakarta Sans" font-size="10" font-weight="800" fill="#059669" text-anchor="middle">👉 Click to Manage</text>
          </g>

          <!-- Room 2 (CBA X02) -->
          <g class="room-group ${getRoomStateClass(building, room2, floor)}" data-bldg="${building}" data-room="${room2}" data-floor="${floor}">
            <rect x="465" y="105" width="270" height="160" rx="8" class="room-rect"/>
            <text x="600" y="170" font-family="Plus Jakarta Sans" font-weight="900" font-size="16" fill="#0f172a" text-anchor="middle" class="room-text">${room2}</text>
            <text x="600" y="194" font-family="Plus Jakarta Sans" font-weight="700" font-size="11" fill="#64748b" text-anchor="middle" class="sub-text">${room2Type}</text>
            <text x="600" y="222" font-family="Plus Jakarta Sans" font-size="10" font-weight="800" fill="#059669" text-anchor="middle">👉 Click to Manage</text>
          </g>

          <!-- Room 3 (CBA X03) -->
          <g class="room-group ${getRoomStateClass(building, room3, floor)}" data-bldg="${building}" data-room="${room3}" data-floor="${floor}">
            <rect x="750" y="105" width="270" height="160" rx="8" class="room-rect"/>
            <text x="885" y="170" font-family="Plus Jakarta Sans" font-weight="900" font-size="16" fill="#0f172a" text-anchor="middle" class="room-text">${room3}</text>
            <text x="885" y="194" font-family="Plus Jakarta Sans" font-weight="700" font-size="11" fill="#64748b" text-anchor="middle" class="sub-text">${room3Type}</text>
            <text x="885" y="222" font-family="Plus Jakarta Sans" font-size="10" font-weight="800" fill="#059669" text-anchor="middle">👉 Click to Manage</text>
          </g>

          <!-- East Stairs & Restroom -->
          <g transform="translate(1035, 105)">
            <rect width="85" height="160" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5" rx="6"/>
            <line x1="8" y1="30" x2="77" y2="30" stroke="#059669" stroke-width="1.2"/>
            <line x1="8" y1="60" x2="77" y2="60" stroke="#059669" stroke-width="1.2"/>
            <line x1="8" y1="90" x2="77" y2="90" stroke="#059669" stroke-width="1.2"/>
            <line x1="8" y1="120" x2="77" y2="120" stroke="#059669" stroke-width="1.2"/>
            <text x="42.5" y="148" font-family="Plus Jakarta Sans" font-weight="900" font-size="11" fill="#047857" text-anchor="middle">STAIRS E</text>
          </g>

          <g transform="translate(1130, 105)">
            <rect width="70" height="160" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5" rx="6"/>
            <text x="35" y="175" font-family="Plus Jakarta Sans" font-weight="900" font-size="14" fill="#1e40af" text-anchor="middle">CR</text>
            <text x="35" y="196" font-family="Plus Jakarta Sans" font-weight="700" font-size="9.5" fill="#3b82f6" text-anchor="middle">M / F</text>
          </g>
        </svg>
      `;
    } else if (building === 'Hangar') {
      // HANGAR 1 STOREY, 6 ROOMS:
      // Left (Top to Bottom): Hangar 004, Hangar 005, Hangar 006
      // Right (Top to Bottom): Hangar 003, Hangar 002, Hangar 001
      // Middle: Equal area large space for Aircraft Assembly & Apron
      floorPlanContent.innerHTML = `
        <svg viewBox="0 0 1380 560" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="floorGridHangar" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#cbd5e1" stroke-width="1.3"/>
              <circle cx="0" cy="0" r="1.5" fill="#0284c7" opacity="0.75"/>
            </pattern>
            <filter id="hangarCardShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#0284c7" flood-opacity="0.1"/>
            </filter>
          </defs>

          <!-- Blueprint Background -->
          <rect x="15" y="10" width="1350" height="540" rx="14" fill="url(#floorGridHangar)" stroke="#cbd5e1" stroke-width="2.5"/>

          <!-- Title Banner -->
          <g transform="translate(45, 45)">
            <rect width="1290" height="42" rx="8" fill="#0c4a6e"/>
            <text x="20" y="27" font-family="Plus Jakarta Sans, system-ui" font-weight="900" font-size="17" fill="#7dd3fc">✈️ HANGAR COMPLEX — 1 STOREY MASTER BLUEPRINT (6 ROOMS + CENTRAL ASSEMBLY BAY)</text>
          </g>

          <!-- ================= LEFT WING (3 ROOMS: 004, 005, 006) ================= -->
          
          <!-- Hangar 004 (Top Left) -->
          <g class="room-group ${getRoomStateClass(building, 'Hangar 004', 1)}" data-bldg="${building}" data-room="Hangar 004" data-floor="1">
            <rect x="45" y="105" width="290" height="130" rx="8" class="room-rect"/>
            <text x="190" y="155" font-family="Plus Jakarta Sans" font-weight="900" font-size="16" fill="#0f172a" text-anchor="middle" class="room-text">Hangar 004</text>
            <text x="190" y="178" font-family="Plus Jakarta Sans" font-weight="700" font-size="11" fill="#64748b" text-anchor="middle" class="sub-text">UAV &amp; Drone Diagnostics Lab</text>
            <text x="190" y="205" font-family="Plus Jakarta Sans" font-size="9.5" font-weight="800" fill="#059669" text-anchor="middle">👉 Click to Manage</text>
          </g>

          <!-- Hangar 005 (Middle Left) -->
          <g class="room-group ${getRoomStateClass(building, 'Hangar 005', 1)}" data-bldg="${building}" data-room="Hangar 005" data-floor="1">
            <rect x="45" y="250" width="290" height="130" rx="8" class="room-rect"/>
            <text x="190" y="300" font-family="Plus Jakarta Sans" font-weight="900" font-size="16" fill="#0f172a" text-anchor="middle" class="room-text">Hangar 005</text>
            <text x="190" y="323" font-family="Plus Jakarta Sans" font-weight="700" font-size="11" fill="#64748b" text-anchor="middle" class="sub-text">Composite Materials &amp; Fabrication</text>
            <text x="190" y="350" font-family="Plus Jakarta Sans" font-size="9.5" font-weight="800" fill="#059669" text-anchor="middle">👉 Click to Manage</text>
          </g>

          <!-- Hangar 006 (Bottom Left) -->
          <g class="room-group ${getRoomStateClass(building, 'Hangar 006', 1)}" data-bldg="${building}" data-room="Hangar 006" data-floor="1">
            <rect x="45" y="395" width="290" height="130" rx="8" class="room-rect"/>
            <text x="190" y="445" font-family="Plus Jakarta Sans" font-weight="900" font-size="16" fill="#0f172a" text-anchor="middle" class="room-text">Hangar 006</text>
            <text x="190" y="468" font-family="Plus Jakarta Sans" font-weight="700" font-size="11" fill="#64748b" text-anchor="middle" class="sub-text">Aircraft Systems &amp; Assembly</text>
            <text x="190" y="495" font-family="Plus Jakarta Sans" font-size="9.5" font-weight="800" fill="#059669" text-anchor="middle">👉 Click to Manage</text>
          </g>

          <!-- ================= MIDDLE AREA (EQUAL TO AREA OF ALL ROOMS) ================= -->
          <g transform="translate(355, 105)">
            <rect width="670" height="420" fill="#f8fafc" stroke="#94a3b8" stroke-dasharray="6,6" stroke-width="2" rx="10"/>
            
            <!-- Runway / Apron Marking Lines -->
            <line x1="40" y1="210" x2="630" y2="210" stroke="#cbd5e1" stroke-width="3" stroke-dasharray="14,10"/>
            <line x1="335" y1="30" x2="335" y2="390" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="10,8"/>

            <!-- Center Compass & Aircraft Staging Icon -->
            <circle cx="335" cy="210" r="85" fill="#f0f9ff" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6,4"/>
            <text x="335" y="195" font-family="Plus Jakarta Sans, system-ui" font-size="17" font-weight="900" fill="#0369a1" text-anchor="middle">🛫 CENTRAL AIRCRAFT HANGAR BAY</text>
            <text x="335" y="218" font-family="Plus Jakarta Sans, system-ui" font-size="12" font-weight="700" fill="#0284c7" text-anchor="middle">Main Assembly, Propulsion Taxiway &amp; Heavy Ground Staging</text>
            <text x="335" y="240" font-family="Plus Jakarta Sans, system-ui" font-size="10.5" font-weight="700" fill="#64748b" text-anchor="middle">Equal Capacity Center Ground · Clearance Zone</text>
          </g>

          <!-- ================= RIGHT WING (3 ROOMS: 003, 002, 001) ================= -->

          <!-- Hangar 003 (Top Right) -->
          <g class="room-group ${getRoomStateClass(building, 'Hangar 003', 1)}" data-bldg="${building}" data-room="Hangar 003" data-floor="1">
            <rect x="1045" y="105" width="290" height="130" rx="8" class="room-rect"/>
            <text x="1190" y="155" font-family="Plus Jakarta Sans" font-weight="900" font-size="16" fill="#0f172a" text-anchor="middle" class="room-text">Hangar 003</text>
            <text x="1190" y="178" font-family="Plus Jakarta Sans" font-weight="700" font-size="11" fill="#64748b" text-anchor="middle" class="sub-text">Flight Simulation &amp; Nav Lab</text>
            <text x="1190" y="205" font-family="Plus Jakarta Sans" font-size="9.5" font-weight="800" fill="#059669" text-anchor="middle">👉 Click to Manage</text>
          </g>

          <!-- Hangar 002 (Middle Right) -->
          <g class="room-group ${getRoomStateClass(building, 'Hangar 002', 1)}" data-bldg="${building}" data-room="Hangar 002" data-floor="1">
            <rect x="1045" y="250" width="290" height="130" rx="8" class="room-rect"/>
            <text x="1190" y="300" font-family="Plus Jakarta Sans" font-weight="900" font-size="16" fill="#0f172a" text-anchor="middle" class="room-text">Hangar 002</text>
            <text x="1190" y="323" font-family="Plus Jakarta Sans" font-weight="700" font-size="11" fill="#64748b" text-anchor="middle" class="sub-text">Avionics &amp; Radar Mechanical Lab</text>
            <text x="1190" y="350" font-family="Plus Jakarta Sans" font-size="9.5" font-weight="800" fill="#059669" text-anchor="middle">👉 Click to Manage</text>
          </g>

          <!-- Hangar 001 (Bottom Right) -->
          <g class="room-group ${getRoomStateClass(building, 'Hangar 001', 1)}" data-bldg="${building}" data-room="Hangar 001" data-floor="1">
            <rect x="1045" y="395" width="290" height="130" rx="8" class="room-rect"/>
            <text x="1190" y="445" font-family="Plus Jakarta Sans" font-weight="900" font-size="16" fill="#0f172a" text-anchor="middle" class="room-text">Hangar 001</text>
            <text x="1190" y="468" font-family="Plus Jakarta Sans" font-weight="700" font-size="11" fill="#64748b" text-anchor="middle" class="sub-text">Aviation Powerplants Bay</text>
            <text x="1190" y="495" font-family="Plus Jakarta Sans" font-size="9.5" font-weight="800" fill="#059669" text-anchor="middle">👉 Click to Manage</text>
          </g>
        </svg>
      `;
    } else if (building === 'Pancho Building') {
      if (floor === 1) {
        floorPlanContent.innerHTML = `
          <svg viewBox="0 0 1560 490" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="floorGridPancho" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#cbd5e1" stroke-width="1.3"/>
                <circle cx="0" cy="0" r="1.5" fill="#059669" opacity="0.75"/>
              </pattern>
            </defs>

            <rect x="15" y="10" width="1530" height="465" rx="14" fill="url(#floorGridPancho)" stroke="#cbd5e1" stroke-width="2.5"/>
            <text x="780" y="55" class="floor-title-main" font-family="Plus Jakarta Sans" font-weight="900" font-size="24" fill="#064e3b" text-anchor="middle">🏛️ PANCHO BUILDING — 1ST FLOOR ARCHITECTURAL BLUEPRINT</text>
            
            <path d="M 40 170 L 1450 170 L 1450 215 L 1380 215 L 1380 445 L 1340 445 L 1340 215 L 40 215 Z" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5"/>

            <!-- TOP ROW -->
            <g class="room-group ${getRoomStateClass(building, '101', 1)}" data-bldg="${building}" data-room="101" data-floor="1"><rect x="40" y="90" width="90" height="80" rx="6" class="room-rect"/><text x="85" y="135" class="room-text">101</text></g>
            <rect x="135" y="90" width="40" height="80" rx="4" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/><text x="155" y="135" class="tiny-text" font-family="Plus Jakarta Sans" font-weight="800" font-size="9.5" fill="#1e3a8a" text-anchor="middle">CR</text>
            <g class="room-group ${getRoomStateClass(building, '103', 1)}" data-bldg="${building}" data-room="103" data-floor="1"><rect x="180" y="90" width="80" height="80" rx="6" class="room-rect"/><text x="220" y="135" class="room-text">103</text></g>
            <g class="room-group ${getRoomStateClass(building, '105', 1)}" data-bldg="${building}" data-room="105" data-floor="1"><rect x="265" y="90" width="80" height="80" rx="6" class="room-rect"/><text x="305" y="135" class="room-text">105</text></g>
            <g class="room-group ${getRoomStateClass(building, '107', 1)}" data-bldg="${building}" data-room="107" data-floor="1"><rect x="350" y="90" width="80" height="80" rx="6" class="room-rect"/><text x="390" y="135" class="room-text">107</text></g>
            <g class="room-group ${getRoomStateClass(building, '109', 1)}" data-bldg="${building}" data-room="109" data-floor="1"><rect x="435" y="90" width="80" height="80" rx="6" class="room-rect"/><text x="475" y="135" class="room-text">109</text></g>
            <g class="room-group ${getRoomStateClass(building, '111', 1)}" data-bldg="${building}" data-room="111" data-floor="1"><rect x="520" y="90" width="80" height="80" rx="6" class="room-rect"/><text x="560" y="135" class="room-text">111</text></g>
            <g class="room-group ${getRoomStateClass(building, '113', 1)}" data-bldg="${building}" data-room="113" data-floor="1"><rect x="605" y="90" width="100" height="80" rx="6" class="room-rect"/><text x="655" y="135" class="room-text">113</text></g>
            <g class="room-group ${getRoomStateClass(building, '115', 1)}" data-bldg="${building}" data-room="115" data-floor="1"><rect x="710" y="90" width="100" height="80" rx="6" class="room-rect"/><text x="760" y="135" class="room-text">115</text></g>

            <rect x="815" y="90" width="33" height="38" rx="4" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/><text x="831.5" y="114" class="tiny-text" font-family="Plus Jakarta Sans" font-size="9" fill="#1e3a8a" text-anchor="middle">CR</text>
            <rect x="852" y="90" width="33" height="38" rx="4" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/><text x="868.5" y="114" class="tiny-text" font-family="Plus Jakarta Sans" font-size="9" fill="#1e3a8a" text-anchor="middle">CR</text>
            <rect x="815" y="132" width="70" height="38" rx="4" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/><text x="850" y="156" class="tiny-text" font-family="Plus Jakarta Sans" font-size="9" fill="#1e3a8a" text-anchor="middle">WashRoom</text>

            <g class="room-group ${getRoomStateClass(building, '117A', 1)}" data-bldg="${building}" data-room="117A" data-floor="1"><rect x="890" y="90" width="90" height="80" rx="6" class="room-rect"/><text x="935" y="135" class="room-text">117A</text></g>
            <g class="room-group ${getRoomStateClass(building, '119', 1)}" data-bldg="${building}" data-room="119" data-floor="1"><rect x="985" y="90" width="90" height="80" rx="6" class="room-rect"/><text x="1030" y="135" class="room-text">119</text></g>
            <g class="room-group ${getRoomStateClass(building, '121', 1)}" data-bldg="${building}" data-room="121" data-floor="1"><rect x="1080" y="90" width="90" height="80" rx="6" class="room-rect"/><text x="1125" y="135" class="room-text">121</text></g>
            <g class="room-group ${getRoomStateClass(building, '123A', 1)}" data-bldg="${building}" data-room="123A" data-floor="1"><rect x="1175" y="90" width="90" height="80" rx="6" class="room-rect"/><text x="1220" y="135" class="room-text">123A</text></g>
            <g class="room-group ${getRoomStateClass(building, '125', 1)}" data-bldg="${building}" data-room="125" data-floor="1"><rect x="1270" y="90" width="90" height="80" rx="6" class="room-rect"/><text x="1315" y="135" class="room-text">125</text></g>
            <rect x="1365" y="90" width="40" height="80" rx="4" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/><text x="1385" y="135" class="tiny-text" font-family="Plus Jakarta Sans" font-size="9" fill="#1e3a8a" text-anchor="middle">CR</text>
            <rect x="1410" y="90" width="40" height="80" rx="4" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/><text x="1430" y="135" class="tiny-text" font-family="Plus Jakarta Sans" font-size="9" fill="#1e3a8a" text-anchor="middle">CR</text>

            <!-- BOTTOM ROW -->
            <g class="room-group ${getRoomStateClass(building, 'Lecture Room', 1)}" data-bldg="${building}" data-room="Lecture Room" data-floor="1">
              <rect x="40" y="215" width="90" height="80" rx="6" class="room-rect"/>
              <text class="room-text" x="85" y="248"><tspan x="85" dy="0">Lecture</tspan><tspan x="85" dy="16">Room</tspan></text>
            </g>
            
            <!-- North Stairs -->
            <rect x="135" y="215" width="40" height="80" rx="4" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
            <line x1="135" y1="225" x2="175" y2="225" stroke="#047857" stroke-width="1.2"/><line x1="135" y1="235" x2="175" y2="235" stroke="#047857" stroke-width="1.2"/><line x1="135" y1="245" x2="175" y2="245" stroke="#047857" stroke-width="1.2"/><line x1="135" y1="255" x2="175" y2="255" stroke="#047857" stroke-width="1.2"/><line x1="135" y1="265" x2="175" y2="265" stroke="#047857" stroke-width="1.2"/><line x1="135" y1="275" x2="175" y2="275" stroke="#047857" stroke-width="1.2"/><line x1="135" y1="285" x2="175" y2="285" stroke="#047857" stroke-width="1.2"/>

            <g class="room-group ${getRoomStateClass(building, '102', 1)}" data-bldg="${building}" data-room="102" data-floor="1"><rect x="180" y="215" width="70" height="80" rx="6" class="room-rect"/><text x="215" y="260" class="room-text">102</text></g>
            <g class="room-group ${getRoomStateClass(building, '104', 1)}" data-bldg="${building}" data-room="104" data-floor="1"><rect x="255" y="215" width="70" height="80" rx="6" class="room-rect"/><text x="290" y="260" class="room-text">104</text></g>
            <g class="room-group ${getRoomStateClass(building, '106', 1)}" data-bldg="${building}" data-room="106" data-floor="1"><rect x="330" y="215" width="70" height="80" rx="6" class="room-rect"/><text x="365" y="260" class="room-text">106</text></g>
            <g class="room-group ${getRoomStateClass(building, '108', 1)}" data-bldg="${building}" data-room="108" data-floor="1"><rect x="405" y="215" width="70" height="80" rx="6" class="room-rect"/><text x="440" y="260" class="room-text">108</text></g>
            
            <g class="room-group ${getRoomStateClass(building, 'Science Laboratory', 1)}" data-bldg="${building}" data-room="Science Laboratory" data-floor="1">
              <rect x="480" y="215" width="190" height="80" rx="6" class="room-rect"/>
              <text class="room-text" x="575" y="248"><tspan x="575" dy="0">🧪 Science</tspan><tspan x="575" dy="16">Laboratory</tspan></text>
            </g>
            
            <g class="room-group ${getRoomStateClass(building, '112A', 1)}" data-bldg="${building}" data-room="112A" data-floor="1"><rect x="675" y="215" width="65" height="80" rx="6" class="room-rect"/><text x="707.5" y="260" class="room-text">112A</text></g>
            <g class="room-group ${getRoomStateClass(building, '112B', 1)}" data-bldg="${building}" data-room="112B" data-floor="1"><rect x="745" y="215" width="65" height="80" rx="6" class="room-rect"/><text x="777.5" y="260" class="room-text">112B</text></g>
            
            <!-- Center Stairs -->
            <rect x="815" y="215" width="70" height="80" rx="4" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
            <line x1="825" y1="225" x2="875" y2="225" stroke="#047857" stroke-width="1.2"/><line x1="825" y1="235" x2="875" y2="235" stroke="#047857" stroke-width="1.2"/><line x1="825" y1="245" x2="875" y2="245" stroke="#047857" stroke-width="1.2"/><line x1="825" y1="255" x2="875" y2="255" stroke="#047857" stroke-width="1.2"/><line x1="825" y1="265" x2="875" y2="265" stroke="#047857" stroke-width="1.2"/><line x1="825" y1="275" x2="875" y2="275" stroke="#047857" stroke-width="1.2"/><line x1="825" y1="285" x2="875" y2="285" stroke="#047857" stroke-width="1.2"/>

            <g class="room-group ${getRoomStateClass(building, '114', 1)}" data-bldg="${building}" data-room="114" data-floor="1"><rect x="890" y="215" width="70" height="80" rx="6" class="room-rect"/><text x="925" y="260" class="room-text">114</text></g>
            <g class="room-group ${getRoomStateClass(building, '116', 1)}" data-bldg="${building}" data-room="116" data-floor="1"><rect x="965" y="215" width="70" height="80" rx="6" class="room-rect"/><text x="1000" y="260" class="room-text">116</text></g>
            <g class="room-group ${getRoomStateClass(building, '118', 1)}" data-bldg="${building}" data-room="118" data-floor="1"><rect x="1040" y="215" width="70" height="80" rx="6" class="room-rect"/><text x="1075" y="260" class="room-text">118</text></g>
            <g class="room-group ${getRoomStateClass(building, '122', 1)}" data-bldg="${building}" data-room="122" data-floor="1"><rect x="1115" y="215" width="70" height="80" rx="6" class="room-rect"/><text x="1150" y="260" class="room-text">122</text></g>
            <g class="room-group ${getRoomStateClass(building, '103 (East)', 1)}" data-bldg="${building}" data-room="103 (East)" data-floor="1"><rect x="1190" y="215" width="90" height="80" rx="6" class="room-rect"/><text x="1235" y="260" class="room-text">103</text></g>

            <!-- East Wing Stairs & Facilities -->
            <rect x="1380" y="180" width="70" height="35" rx="4" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
            <line x1="1390" y1="180" x2="1390" y2="215" stroke="#047857" stroke-width="1.2"/><line x1="1400" y1="180" x2="1400" y2="215" stroke="#047857" stroke-width="1.2"/><line x1="1410" y1="180" x2="1410" y2="215" stroke="#047857" stroke-width="1.2"/><line x1="1420" y1="180" x2="1420" y2="215" stroke="#047857" stroke-width="1.2"/><line x1="1430" y1="180" x2="1430" y2="215" stroke="#047857" stroke-width="1.2"/><line x1="1440" y1="180" x2="1440" y2="215" stroke="#047857" stroke-width="1.2"/>

            <g class="room-group ${getRoomStateClass(building, 'Library', 1)}" data-bldg="${building}" data-room="Library" data-floor="1">
              <rect x="1380" y="215" width="70" height="100" rx="6" class="room-rect"/>
              <text x="1415" y="270" class="room-text">📚 Library</text>
            </g>
            <g class="room-group ${getRoomStateClass(building, 'Multimedia Room', 1)}" data-bldg="${building}" data-room="Multimedia Room" data-floor="1">
              <rect x="1380" y="320" width="70" height="110" rx="6" class="room-rect"/>
              <text class="room-text" x="1415" y="370"><tspan x="1415" dy="0">🎬 Multimedia</tspan><tspan x="1415" dy="16">Room</tspan></text>
            </g>
          </svg>
        `;
      } else if (floor === 2) {
        floorPlanContent.innerHTML = `
          <svg viewBox="0 0 1560 490" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="floorGridPanchoF2" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#cbd5e1" stroke-width="1.3"/>
                <circle cx="0" cy="0" r="1.5" fill="#059669" opacity="0.75"/>
              </pattern>
            </defs>

            <rect x="15" y="10" width="1530" height="465" rx="14" fill="url(#floorGridPanchoF2)" stroke="#cbd5e1" stroke-width="2.5"/>
            <text x="780" y="55" class="floor-title-main" font-family="Plus Jakarta Sans" font-weight="900" font-size="24" fill="#064e3b" text-anchor="middle">🏛️ PANCHO BUILDING — 2ND FLOOR ARCHITECTURAL BLUEPRINT</text>
            
            <path d="M 40 170 L 1450 170 L 1450 215 L 1380 215 L 1380 445 L 1340 445 L 1340 215 L 40 215 Z" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5"/>

            <!-- TOP ROW -->
            <g class="room-group ${getRoomStateClass(building, '201', 2)}" data-bldg="${building}" data-room="201" data-floor="2"><rect x="40" y="90" width="90" height="80" rx="6" class="room-rect"/><text x="85" y="135" class="room-text">201</text></g>
            <rect x="135" y="90" width="35" height="80" rx="4" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/><text x="152.5" y="135" class="tiny-text" font-family="Plus Jakarta Sans" font-size="9" fill="#1e3a8a" text-anchor="middle">CR</text>
            <g class="room-group ${getRoomStateClass(building, '203', 2)}" data-bldg="${building}" data-room="203" data-floor="2"><rect x="175" y="90" width="65" height="80" rx="6" class="room-rect"/><text x="207.5" y="135" class="room-text">203</text></g>
            <g class="room-group ${getRoomStateClass(building, '206', 2)}" data-bldg="${building}" data-room="206" data-floor="2"><rect x="245" y="90" width="65" height="80" rx="6" class="room-rect"/><text x="277.5" y="135" class="room-text">206</text></g>
            <g class="room-group ${getRoomStateClass(building, 'Pancho 202', 2)}" data-bldg="${building}" data-room="Pancho 202" data-floor="2"><rect x="315" y="90" width="65" height="80" rx="6" class="room-rect"/><text x="347.5" y="135" class="room-text">202</text></g>
            <g class="room-group ${getRoomStateClass(building, '210', 2)}" data-bldg="${building}" data-room="210" data-floor="2"><rect x="385" y="90" width="65" height="80" rx="6" class="room-rect"/><text x="417.5" y="135" class="room-text">210</text></g>
            <g class="room-group ${getRoomStateClass(building, '212', 2)}" data-bldg="${building}" data-room="212" data-floor="2"><rect x="455" y="90" width="65" height="80" rx="6" class="room-rect"/><text x="487.5" y="135" class="room-text">212</text></g>
            <g class="room-group ${getRoomStateClass(building, '214A', 2)}" data-bldg="${building}" data-room="214A" data-floor="2"><rect x="525" y="90" width="65" height="80" rx="6" class="room-rect"/><text x="557.5" y="135" class="room-text">214A</text></g>
            <g class="room-group ${getRoomStateClass(building, '214B', 2)}" data-bldg="${building}" data-room="214B" data-floor="2"><rect x="595" y="90" width="65" height="80" rx="6" class="room-rect"/><text x="627.5" y="135" class="room-text">214B</text></g>
            <g class="room-group ${getRoomStateClass(building, '216A', 2)}" data-bldg="${building}" data-room="216A" data-floor="2"><rect x="665" y="90" width="70" height="80" rx="6" class="room-rect"/><text x="700" y="135" class="room-text">216A</text></g>
            <g class="room-group ${getRoomStateClass(building, '216B', 2)}" data-bldg="${building}" data-room="216B" data-floor="2"><rect x="740" y="90" width="70" height="80" rx="6" class="room-rect"/><text x="775" y="135" class="room-text">216B</text></g>

            <rect x="815" y="90" width="33" height="38" rx="4" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/><text x="831.5" y="114" class="tiny-text" font-family="Plus Jakarta Sans" font-size="9" fill="#1e3a8a" text-anchor="middle">CR</text>
            <rect x="852" y="90" width="33" height="38" rx="4" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/><text x="868.5" y="114" class="tiny-text" font-family="Plus Jakarta Sans" font-size="9" fill="#1e3a8a" text-anchor="middle">CR</text>
            <rect x="815" y="132" width="70" height="38" rx="4" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/><text x="850" y="156" class="tiny-text" font-family="Plus Jakarta Sans" font-size="9" fill="#1e3a8a" text-anchor="middle">WashRoom</text>

            <g class="room-group ${getRoomStateClass(building, '215', 2)}" data-bldg="${building}" data-room="215" data-floor="2"><rect x="890" y="90" width="50" height="80" rx="6" class="room-rect"/><text x="915" y="135" class="room-text">215</text></g>
            <g class="room-group ${getRoomStateClass(building, '220', 2)}" data-bldg="${building}" data-room="220" data-floor="2"><rect x="945" y="90" width="50" height="80" rx="6" class="room-rect"/><text x="970" y="135" class="room-text">220</text></g>
            <g class="room-group ${getRoomStateClass(building, '222', 2)}" data-bldg="${building}" data-room="222" data-floor="2"><rect x="1000" y="90" width="50" height="80" rx="6" class="room-rect"/><text x="1025" y="135" class="room-text">222</text></g>
            <g class="room-group ${getRoomStateClass(building, '224', 2)}" data-bldg="${building}" data-room="224" data-floor="2"><rect x="1055" y="90" width="105" height="80" rx="6" class="room-rect"/><text x="1107.5" y="135" class="room-text">224</text></g>
            <g class="room-group ${getRoomStateClass(building, '226', 2)}" data-bldg="${building}" data-room="226" data-floor="2"><rect x="1165" y="90" width="45" height="80" rx="6" class="room-rect"/><text x="1187.5" y="135" class="room-text">226</text></g>
            <g class="room-group ${getRoomStateClass(building, '228A', 2)}" data-bldg="${building}" data-room="228A" data-floor="2"><rect x="1215" y="90" width="35" height="80" rx="6" class="room-rect"/><text x="1232.5" y="135" class="tiny-text" font-family="Plus Jakarta Sans" font-size="8.5" fill="#1e3a8a" text-anchor="middle">228A</text></g>
            <g class="room-group ${getRoomStateClass(building, '228B', 2)}" data-bldg="${building}" data-room="228B" data-floor="2"><rect x="1255" y="90" width="35" height="80" rx="6" class="room-rect"/><text x="1272.5" y="135" class="tiny-text" font-family="Plus Jakarta Sans" font-size="8.5" fill="#1e3a8a" text-anchor="middle">228B</text></g>
            
            <g class="room-group ${getRoomStateClass(building, 'SPED Room', 2)}" data-bldg="${building}" data-room="SPED Room" data-floor="2">
              <rect x="1295" y="90" width="35" height="80" rx="6" class="room-rect"/>
              <text font-family="Plus Jakarta Sans" font-weight="800" font-size="8" fill="#0f172a" text-anchor="middle" x="1312.5" y="130"><tspan x="1312.5" dy="0">SPED</tspan><tspan x="1312.5" dy="10">Room</tspan></text>
            </g>
            <g class="room-group ${getRoomStateClass(building, 'Unites Room', 2)}" data-bldg="${building}" data-room="Unites Room" data-floor="2">
              <rect x="1335" y="90" width="35" height="80" rx="6" class="room-rect"/>
              <text font-family="Plus Jakarta Sans" font-weight="800" font-size="8" fill="#0f172a" text-anchor="middle" x="1352.5" y="130"><tspan x="1352.5" dy="0">Unites</tspan><tspan x="1352.5" dy="10">Room</tspan></text>
            </g>

            <rect x="1375" y="90" width="35" height="80" rx="4" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/><text x="1392.5" y="135" class="tiny-text" font-family="Plus Jakarta Sans" font-size="8.5" fill="#1e3a8a" text-anchor="middle">CR</text>
            <rect x="1415" y="90" width="35" height="80" rx="4" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/><text x="1432.5" y="135" class="tiny-text" font-family="Plus Jakarta Sans" font-size="8.5" fill="#1e3a8a" text-anchor="middle">CR</text>

            <!-- BOTTOM ROW -->
            <g class="room-group ${getRoomStateClass(building, '200', 2)}" data-bldg="${building}" data-room="200" data-floor="2"><rect x="40" y="215" width="65" height="80" rx="6" class="room-rect"/><text x="72.5" y="260" class="room-text">200</text></g>
            <g class="room-group ${getRoomStateClass(building, '204', 2)}" data-bldg="${building}" data-room="204" data-floor="2"><rect x="110" y="215" width="20" height="80" rx="6" class="room-rect"/><text x="120" y="260" font-family="Plus Jakarta Sans" font-weight="800" font-size="8" fill="#0f172a" text-anchor="middle">204</text></g>
            
            <!-- North Stairs -->
            <rect x="135" y="215" width="35" height="80" rx="4" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
            <line x1="135" y1="225" x2="170" y2="225" stroke="#047857" stroke-width="1.2"/><line x1="135" y1="235" x2="170" y2="235" stroke="#047857" stroke-width="1.2"/><line x1="135" y1="245" x2="170" y2="245" stroke="#047857" stroke-width="1.2"/><line x1="135" y1="255" x2="170" y2="255" stroke="#047857" stroke-width="1.2"/><line x1="135" y1="265" x2="170" y2="265" stroke="#047857" stroke-width="1.2"/><line x1="135" y1="275" x2="170" y2="275" stroke="#047857" stroke-width="1.2"/><line x1="135" y1="285" x2="170" y2="285" stroke="#047857" stroke-width="1.2"/>

            <g class="room-group ${getRoomStateClass(building, 'PTA Room', 2)}" data-bldg="${building}" data-room="PTA Room" data-floor="2"><rect x="175" y="215" width="30" height="40" rx="4" class="room-rect"/><text x="190" y="239" font-family="Plus Jakarta Sans" font-weight="800" font-size="8" fill="#0f172a" text-anchor="middle">PTA</text></g>
            <g class="room-group ${getRoomStateClass(building, '204', 2)}" data-bldg="${building}" data-room="204" data-floor="2"><rect x="175" y="255" width="30" height="40" rx="4" class="room-rect"/><text x="190" y="279" font-family="Plus Jakarta Sans" font-weight="800" font-size="8" fill="#0f172a" text-anchor="middle">204</text></g>
            
            <g class="room-group ${getRoomStateClass(building, 'STO', 2)}" data-bldg="${building}" data-room="STO" data-floor="2"><rect x="210" y="215" width="20" height="80" rx="4" class="room-rect"/><text x="220" y="260" font-family="Plus Jakarta Sans" font-weight="800" font-size="8" fill="#0f172a" text-anchor="middle">STO</text></g>
            <g class="room-group ${getRoomStateClass(building, 'Scouts Room', 2)}" data-bldg="${building}" data-room="Scouts Room" data-floor="2"><rect x="235" y="215" width="20" height="80" rx="4" class="room-rect"/><text font-family="Plus Jakarta Sans" font-weight="800" font-size="7.5" fill="#0f172a" text-anchor="middle" x="245" y="255"><tspan x="245" dy="0">Scouts</tspan><tspan x="245" dy="10">Room</tspan></text></g>

            <g class="room-group ${getRoomStateClass(building, '207', 2)}" data-bldg="${building}" data-room="207" data-floor="2"><rect x="260" y="215" width="60" height="80" rx="6" class="room-rect"/><text x="290" y="260" class="room-text">207</text></g>
            <g class="room-group ${getRoomStateClass(building, '209', 2)}" data-bldg="${building}" data-room="209" data-floor="2"><rect x="325" y="215" width="60" height="80" rx="6" class="room-rect"/><text x="355" y="260" class="room-text">209</text></g>
            <g class="room-group ${getRoomStateClass(building, '211', 2)}" data-bldg="${building}" data-room="211" data-floor="2"><rect x="390" y="215" width="60" height="80" rx="6" class="room-rect"/><text x="420" y="260" class="room-text">211</text></g>
            <g class="room-group ${getRoomStateClass(building, '213', 2)}" data-bldg="${building}" data-room="213" data-floor="2"><rect x="455" y="215" width="60" height="80" rx="6" class="room-rect"/><text x="485" y="260" class="room-text">213</text></g>
            <g class="room-group ${getRoomStateClass(building, '215', 2)}" data-bldg="${building}" data-room="215" data-floor="2"><rect x="520" y="215" width="125" height="80" rx="6" class="room-rect"/><text x="582.5" y="260" class="room-text">215</text></g>
            <g class="room-group ${getRoomStateClass(building, '217', 2)}" data-bldg="${building}" data-room="217" data-floor="2"><rect x="650" y="215" width="160" height="80" rx="6" class="room-rect"/><text x="730" y="260" class="room-text">217</text></g>

            <!-- Center Stairs -->
            <rect x="815" y="215" width="70" height="80" rx="4" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
            <line x1="825" y1="225" x2="875" y2="225" stroke="#047857" stroke-width="1.2"/><line x1="825" y1="235" x2="875" y2="235" stroke="#047857" stroke-width="1.2"/><line x1="825" y1="245" x2="875" y2="245" stroke="#047857" stroke-width="1.2"/><line x1="825" y1="255" x2="875" y2="255" stroke="#047857" stroke-width="1.2"/><line x1="825" y1="265" x2="875" y2="265" stroke="#047857" stroke-width="1.2"/><line x1="825" y1="275" x2="875" y2="275" stroke="#047857" stroke-width="1.2"/><line x1="825" y1="285" x2="875" y2="285" stroke="#047857" stroke-width="1.2"/>

            <g class="room-group ${getRoomStateClass(building, '219', 2)}" data-bldg="${building}" data-room="219" data-floor="2"><rect x="890" y="215" width="55" height="80" rx="6" class="room-rect"/><text x="917.5" y="260" class="room-text">219</text></g>
            <g class="room-group ${getRoomStateClass(building, '221', 2)}" data-bldg="${building}" data-room="221" data-floor="2"><rect x="950" y="215" width="55" height="80" rx="6" class="room-rect"/><text x="977.5" y="260" class="room-text">221</text></g>
            <g class="room-group ${getRoomStateClass(building, '223', 2)}" data-bldg="${building}" data-room="223" data-floor="2"><rect x="1010" y="215" width="55" height="80" rx="6" class="room-rect"/><text x="1037.5" y="260" class="room-text">223</text></g>
            <g class="room-group ${getRoomStateClass(building, '225', 2)}" data-bldg="${building}" data-room="225" data-floor="2"><rect x="1070" y="215" width="115" height="80" rx="6" class="room-rect"/><text x="1127.5" y="260" class="room-text">225</text></g>
            <g class="room-group ${getRoomStateClass(building, '227B', 2)}" data-bldg="${building}" data-room="227B" data-floor="2"><rect x="1190" y="215" width="55" height="80" rx="6" class="room-rect"/><text x="1217.5" y="260" class="room-text">227B</text></g>
            <g class="room-group ${getRoomStateClass(building, '227A', 2)}" data-bldg="${building}" data-room="227A" data-floor="2"><rect x="1250" y="215" width="55" height="80" rx="6" class="room-rect"/><text x="1277.5" y="260" class="room-text">227A</text></g>
            <g class="room-group ${getRoomStateClass(building, '229', 2)}" data-bldg="${building}" data-room="229" data-floor="2"><rect x="1310" y="215" width="55" height="80" rx="6" class="room-rect"/><text x="1337.5" y="260" class="room-text">229</text></g>

            <!-- East Wing Stairs & Facilities -->
            <rect x="1380" y="175" width="70" height="40" rx="4" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
            <line x1="1390" y1="175" x2="1390" y2="215" stroke="#047857" stroke-width="1.2"/><line x1="1400" y1="175" x2="1400" y2="215" stroke="#047857" stroke-width="1.2"/><line x1="1410" y1="175" x2="1410" y2="215" stroke="#047857" stroke-width="1.2"/><line x1="1420" y1="175" x2="1420" y2="215" stroke="#047857" stroke-width="1.2"/><line x1="1430" y1="175" x2="1430" y2="215" stroke="#047857" stroke-width="1.2"/><line x1="1440" y1="175" x2="1440" y2="215" stroke="#047857" stroke-width="1.2"/>

            <g class="room-group ${getRoomStateClass(building, '231', 2)}" data-bldg="${building}" data-room="231" data-floor="2"><rect x="1380" y="235" width="70" height="70" rx="6" class="room-rect"/><text x="1415" y="275" class="room-text">231</text></g>
            <g class="room-group ${getRoomStateClass(building, '232', 2)}" data-bldg="${building}" data-room="232" data-floor="2"><rect x="1380" y="315" width="70" height="70" rx="6" class="room-rect"/><text x="1415" y="355" class="room-text">232</text></g>
            <g class="room-group ${getRoomStateClass(building, '233', 2)}" data-bldg="${building}" data-room="233" data-floor="2"><rect x="1380" y="395" width="70" height="70" rx="6" class="room-rect"/><text x="1415" y="435" class="room-text">233</text></g>
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
          dockActionHint.textContent = roomObj.status === 'vacant' ? '👉 Assign Faculty' : '👉 Manage Room';
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
      const occ = flrRooms.filter(r => r.status === 'occupied').length;

      const btn = document.createElement('button');
      btn.className = `floor-pill-btn ${i === activeFloor ? 'active' : ''}`;
      btn.innerHTML = `
        <span>🪜 Floor ${i}</span>
        <span style="font-size:0.7rem; opacity:0.85;">${occ}/${flrRooms.length} in-use</span>
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
      const matchQuery = query === '' || r.room.toLowerCase().includes(query) || r.building.toLowerCase().includes(query) || r.occupant.toLowerCase().includes(query);
      return matchBldg && matchStatus && matchQuery;
    });

    if (filtered.length === 0) {
      listTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:28px; color:#94a3b8; font-weight:700;">No rooms found matching filters.</td></tr>`;
      return;
    }

    filtered.forEach(item => {
      const tr = document.createElement('tr');
      const badgeClass = item.status === 'vacant' ? 'badge-available' : item.status === 'occupied' ? 'badge-occupied' : 'badge-maintenance';
      const badgeText = item.status === 'vacant' ? '• Available' : item.status === 'occupied' ? '• Occupied' : '• Maintenance';

      tr.innerHTML = `
        <td><strong style="color:#0f172a; cursor:pointer;" class="clickable-room-name">${item.room}</strong></td>
        <td>${item.building} (Level ${item.floor})</td>
        <td><span class="status-pill-badge ${badgeClass}">${badgeText}</span></td>
        <td>${item.capacity || 45}</td>
        <td>${item.equipment || 'Standard Facilities'}</td>
        <td><button class="list-inspect-btn">Manage</button></td>
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

      const icon = bldgName === 'Pancho Building' ? '🏛️' : bldgName === 'CBA Building' ? '🏢' : '✈️';
      card.innerHTML = `
        <div class="matrix-bldg-header">
          <h4>${icon} ${bldgName}</h4>
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
          <div class="matrix-floor-title">🪜 Level ${flr} (${flrRooms.length} Facilities)</div>
          <div class="matrix-rooms-grid"></div>
        `;

        const grid = flrSection.querySelector('.matrix-rooms-grid');
        flrRooms.forEach(roomObj => {
          const cell = document.createElement('div');
          cell.className = `matrix-room-cell ${roomObj.status}`;
          cell.innerHTML = `
            <span class="matrix-room-dot"></span>
            <div class="matrix-room-name">${roomObj.room}</div>
            <div class="matrix-room-sub">${roomObj.status === 'vacant' ? '🟢 Available' : roomObj.occupant}</div>
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
      const icon = bldgName === 'Pancho Building' ? '🏛️' : bldgName === 'CBA Building' ? '🏢' : '✈️';
      
      const occCount = bldgRooms.filter(r => r.status === 'occupied').length;
      const vacCount = bldgRooms.filter(r => r.status === 'vacant').length;
      const mntCount = bldgRooms.filter(r => r.status === 'maintenance').length;

      card.innerHTML = `
        <div class="matrix-bldg-header">
          <div style="display:flex; align-items:center; gap:10px;">
            <h4 style="font-size:1.15rem; font-weight:900; color:#0f172a;">${icon} ${bldgName}</h4>
            <span class="matrix-bldg-badge" style="font-size:0.8rem; font-weight:800;">${bldgRooms.length} Facilities</span>
          </div>
          <div style="display:flex; gap:12px; font-size:0.85rem; font-weight:900;">
            <span style="color:#059669;">🟢 ${vacCount} Available</span>
            <span style="color:#e11d48;">📚 ${occCount} In-Use</span>
            ${mntCount > 0 ? `<span style="color:#d97706;">🛠️ ${mntCount} Repair</span>` : ''}
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
          <div class="matrix-floor-title" style="font-size:0.95rem; font-weight:900; color:#334155; margin-bottom:10px;">🪜 Floor Level ${flr} (${flrRooms.length} Facilities)</div>
          <div class="matrix-rooms-grid"></div>
        `;

        const roomGrid = flrSection.querySelector('.matrix-rooms-grid');
        flrRooms.forEach(roomObj => {
          const cell = document.createElement('div');
          cell.className = `matrix-room-cell ${roomObj.status}`;
          cell.style.cursor = 'pointer';
          cell.innerHTML = `
            <span class="matrix-room-dot"></span>
            <div class="matrix-room-name" style="font-size:0.95rem; font-weight:900;">${roomObj.room}</div>
            <div class="matrix-room-sub" style="font-size:0.82rem; font-weight:800;">${roomObj.status === 'vacant' ? '🟢 Available' : roomObj.status === 'maintenance' ? '🛠️ In Repair' : roomObj.occupant}</div>
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
      icon: '📝',
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
            ${log.icon}
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
        icon: '🛡️',
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
    modalRoomTitle.textContent = `${roomObj.room} (${roomObj.type || 'Room'})`;
    modalBldgBadge.textContent = `${roomObj.building} · Level ${roomObj.floor}`;

    modalStatusBanner.className = `room-status-banner ${roomObj.status}`;
    modalStatusText.textContent = roomObj.status === 'vacant' ? '🟢 Currently Available' : roomObj.status === 'occupied' ? `🔴 Occupied by ${roomObj.occupant}` : '🟠 Under Maintenance';
    modalStatusSelect.value = roomObj.status;
    modalCapacity.value = `${roomObj.capacity || 45} Students`;
    modalOccupant.value = roomObj.occupant !== 'None' ? roomObj.occupant : '';
    modalSchedule.value = roomObj.schedule !== '--' ? roomObj.schedule : '';

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

      const newStatus = modalStatusSelect.value;
      const newOccupant = modalOccupant.value.trim() || 'None';
      const newSchedule = modalSchedule.value.trim() || '--';

      currentEditingRoom.status = newStatus;
      currentEditingRoom.occupant = newStatus === 'vacant' ? 'None' : newOccupant;
      currentEditingRoom.schedule = newStatus === 'vacant' ? '--' : newSchedule;

      timelineLogs.unshift({
        id: `LOG-${Date.now()}`,
        title: newStatus === 'vacant' ? 'Room Released' : 'Room Assigned',
        time: 'Just now',
        desc: `${currentEditingRoom.room} (${currentEditingRoom.building}) updated to ${newStatus.toUpperCase()}${newStatus === 'occupied' ? ' - ' + newOccupant : ''}`,
        icon: newStatus === 'vacant' ? '🚪' : '📅',
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
      showToast(`Updated ${currentEditingRoom.room} to ${newStatus}.`);
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
        icon: '🚪',
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

      const matchedRooms = rooms.filter(r => r.room.toLowerCase().includes(q) || r.occupant.toLowerCase().includes(q) || r.building.toLowerCase().includes(q));
      searchResultsList.innerHTML = '';

      if (matchedRooms.length === 0) {
        searchResultsList.innerHTML = `<div style="padding:14px; text-align:center; color:#94a3b8; font-size:0.8rem;">No results found.</div>`;
        searchDropdown.classList.remove('hidden');
        return;
      }

      matchedRooms.slice(0, 7).forEach(r => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `
          <div>
            <strong>${r.room}</strong> <span style="color:#64748b; font-size:0.75rem;">— ${r.building} (Floor ${r.floor})</span>
            <div style="font-size:0.7rem; color:#94a3b8; margin-top:2px;">${r.occupant !== 'None' ? 'Occupied: ' + r.occupant : '🟢 Available Now'}</div>
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
  // 14. LIVE TIMESTAMP TICKER
  // ==========================================
  const liveTimestampEl = document.getElementById('liveTimestamp');

  function updateTimestamp() {
    if (!liveTimestampEl) return;
    const now = new Date();
    const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const hrs  = now.getHours();
    const mins = now.getMinutes().toString().padStart(2, '0');
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    const disp = (hrs % 12 || 12).toString().padStart(2, '0');
    liveTimestampEl.textContent =
      `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()} — ${disp}:${mins} ${ampm}`;
  }

  updateTimestamp();
  setInterval(updateTimestamp, 30000);

  // ==========================================
  // 15. BOOTSTRAP INITIALIZATION
  // ==========================================
  updateKPIs();
  renderListView();
  renderMatrixView();
  renderNotifications();
  renderAccessRequests();
  renderTimelineLogs();

  // Ensure initial active view uses flex
  contentViews.forEach(view => {
    view.style.display = view.classList.contains('active') ? 'flex' : 'none';
  });
});
