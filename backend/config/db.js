/**
 * FARMS - Data Store & Persistence Layer
 * File-backed JSON database with automatic synchronization across
 * Faculty, Rooms, Booking Requests, and System Activity Logs.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'farms-data.json');

// Comprehensive Campus Facilities Seed (Pancho, CBA, and Hangar) - All Vacant on Release
const INITIAL_ROOMS = [
  // CBA Building (4 Storeys, 3 rooms each = 12 rooms)
  { id: 'cba-101', building: 'CBA Building', floor: 1, room_code: 'CBA 101', room: 'CBA 101', type: 'Lecture Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Dual Projectors, Sound System, Whiteboard' },
  { id: 'cba-102', building: 'CBA Building', floor: 1, room_code: 'CBA 102', room: 'CBA 102', type: 'Computer Lab', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: '40 PC Workstations, Smart TV' },
  { id: 'cba-103', building: 'CBA Building', floor: 1, room_code: 'CBA 103', room: 'CBA 103', type: 'Business Lab', status: 'vacant', occupant: 'None', schedule: '--', capacity: 35, equipment: 'Smart Board, Conference Setup' },
  { id: 'cba-201', building: 'CBA Building', floor: 2, room_code: 'CBA 201', room: 'CBA 201', type: 'Smart Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Interactive Display, Sound System' },
  { id: 'cba-202', building: 'CBA Building', floor: 2, room_code: 'CBA 202', room: 'CBA 202', type: 'Lecture Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Projector, Whiteboard' },
  { id: 'cba-203', building: 'CBA Building', floor: 2, room_code: 'CBA 203', room: 'CBA 203', type: 'Accounting Lab', status: 'vacant', occupant: 'None', schedule: '--', capacity: 35, equipment: 'Workstations, Ledger Terminal' },
  { id: 'cba-301', building: 'CBA Building', floor: 3, room_code: 'CBA 301', room: 'CBA 301', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard, Ceiling Fans' },
  { id: 'cba-302', building: 'CBA Building', floor: 3, room_code: 'CBA 302', room: 'CBA 302', type: 'Economics Lab', status: 'vacant', occupant: 'None', schedule: '--', capacity: 30, equipment: 'Terminal Racks, Smart TV' },
  { id: 'cba-303', building: 'CBA Building', floor: 3, room_code: 'CBA 303', room: 'CBA 303', type: 'Seminar Room', status: 'vacant', occupant: 'None', schedule: '--', capacity: 35, equipment: 'Projector, Whiteboard' },
  { id: 'cba-401', building: 'CBA Building', floor: 4, room_code: 'CBA 401', room: 'CBA 401', type: 'Executive Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 60, equipment: 'Audio System, Dual Projectors' },
  { id: 'cba-402', building: 'CBA Building', floor: 4, room_code: 'CBA 402', room: 'CBA 402', type: 'Conference Suite', status: 'vacant', occupant: 'None', schedule: '--', capacity: 25, equipment: 'Video Conference, Smart TV' },
  { id: 'cba-403', building: 'CBA Building', floor: 4, room_code: 'CBA 403', room: 'CBA 403', type: 'Case Study Room', status: 'vacant', occupant: 'None', schedule: '--', capacity: 35, equipment: 'Tiered Seating, Screen' },

  // Hangar (1 Storey, 6 rooms: Left 004, 005, 006; Right 003, 002, 001)
  { id: 'h-001', building: 'Hangar', floor: 1, room_code: 'H 001', room: 'Hangar 001', type: 'Powerplants Bay', status: 'vacant', occupant: 'None', schedule: '--', capacity: 50, equipment: 'Engine Test Stands, Heavy Hoist' },
  { id: 'h-002', building: 'Hangar', floor: 1, room_code: 'H 002', room: 'Hangar 002', type: 'Avionics Lab', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Diagnostic Benches, Oscilloscopes' },
  { id: 'h-003', building: 'Hangar', floor: 1, room_code: 'H 003', room: 'Hangar 003', type: 'Flight Simulation', status: 'vacant', occupant: 'None', schedule: '--', capacity: 30, equipment: 'Flight Simulators, Avionics Racks' },
  { id: 'h-004', building: 'Hangar', floor: 1, room_code: 'H 004', room: 'Hangar 004', type: 'UAV & Drone Lab', status: 'vacant', occupant: 'None', schedule: '--', capacity: 35, equipment: 'Drone Cages, Telemetry Racks' },
  { id: 'h-005', building: 'Hangar', floor: 1, room_code: 'H 005', room: 'Hangar 005', type: 'Composite Materials', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Autoclave, Vacuum Table, Tooling' },
  { id: 'h-006', building: 'Hangar', floor: 1, room_code: 'H 006', room: 'Hangar 006', type: 'Aircraft Assembly', status: 'vacant', occupant: 'None', schedule: '--', capacity: 60, equipment: 'Hydraulic Lifts, Tool Depots' },

  // Pancho Building - Floor 1
  { id: 'p1-101', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 101', room: '101', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard, Ceiling Fans' },
  { id: 'p1-103', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 103', room: '103', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Projector, Whiteboard' },
  { id: 'p1-105', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 105', room: '105', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard, Smart TV' },
  { id: 'p1-107', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 107', room: '107', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p1-109', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 109', room: '109', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard, Sound System' },
  { id: 'p1-111', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 111', room: '111', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p1-113', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 113', room: '113', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard, Projector' },
  { id: 'p1-115', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 115', room: '115', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Chemistry Lab Benches' },
  { id: 'p1-117a', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 117A', room: '117A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
  { id: 'p1-119', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 119', room: '119', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p1-121', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 121', room: '121', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Projector, Whiteboard' },
  { id: 'p1-123a', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 123A', room: '123A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
  { id: 'p1-125', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 125', room: '125', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p1-lecture', building: 'Pancho Building', floor: 1, room_code: 'PANCHO LEC', room: 'Lecture Room', type: 'Lecture Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 90, equipment: 'Tiered Seating, Sound System' },
  { id: 'p1-102', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 102', room: '102', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p1-104', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 104', room: '104', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p1-106', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 106', room: '106', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Projector, Whiteboard' },
  { id: 'p1-108', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 108', room: '108', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p1-scilab', building: 'Pancho Building', floor: 1, room_code: 'PANCHO SCILAB', room: 'Science Laboratory', type: 'Wet Lab', status: 'vacant', occupant: 'None', schedule: '--', capacity: 50, equipment: 'Microscopes, Safety Showers' },
  { id: 'p1-112a', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 112A', room: '112A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
  { id: 'p1-112b', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 112B', room: '112B', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
  { id: 'p1-114', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 114', room: '114', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Physics Apparatus, Projector' },
  { id: 'p1-116', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 116', room: '116', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p1-118', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 118', room: '118', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p1-122', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 122', room: '122', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard, Projector' },
  { id: 'p1-103bot', building: 'Pancho Building', floor: 1, room_code: 'PANCHO 103E', room: '103E', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p1-library', building: 'Pancho Building', floor: 1, room_code: 'PANCHO LIB', room: 'Library', type: 'Learning Center', status: 'vacant', occupant: 'Open Access', schedule: '08:00 AM - 06:00 PM', capacity: 120, equipment: 'Book Stacks, Wi-Fi Desks' },
  { id: 'p1-multimedia', building: 'Pancho Building', floor: 1, room_code: 'PANCHO MULTIMEDIA', room: 'Multimedia Room', type: 'Audio-Visual Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 70, equipment: 'Acoustic Panels, 4K Projector' },

  // Pancho Building - Floor 2
  { id: 'p2-201', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 201', room: '201', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-203', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 203', room: '203', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-206', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 206', room: '206', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-202', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 202', room: 'Pancho 202', type: 'Conference Room', status: 'vacant', occupant: 'None', schedule: '--', capacity: 12, equipment: 'Video Conf, Smart Board' },
  { id: 'p2-210', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 210', room: '210', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-212', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 212', room: '212', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-214a', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 214A', room: '214A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
  { id: 'p2-214b', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 214B', room: '214B', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
  { id: 'p2-216a', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 216A', room: '216A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
  { id: 'p2-216b', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 216B', room: '216B', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard, Projector' },
  { id: 'p2-215', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 215', room: '215', type: 'Architecture Studio', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Drafting Tables, Plotter' },
  { id: 'p2-220', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 220', room: '220', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-222', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 222', room: '222', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-224', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 224', room: '224', type: 'Lecture Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 65, equipment: 'Projector, Whiteboard' },
  { id: 'p2-226', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 226', room: '226', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Smart Board' },
  { id: 'p2-228a', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 228A', room: '228A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 35, equipment: 'Whiteboard' },
  { id: 'p2-228b', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 228B', room: '228B', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 35, equipment: 'Whiteboard' },
  { id: 'p2-sped', building: 'Pancho Building', floor: 2, room_code: 'PANCHO SPED', room: 'SPED Room', type: 'Resource Room', status: 'vacant', occupant: 'None', schedule: '--', capacity: 20, equipment: 'Sensory Stations, Braille Display' },
  { id: 'p2-unites', building: 'Pancho Building', floor: 2, room_code: 'PANCHO UNITES', room: 'Unites Room', type: 'Activity Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 30, equipment: 'Round Tables' },
  { id: 'p2-200', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 200', room: '200', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-204', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 204', room: '204', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Projector' },
  { id: 'p2-pta', building: 'Pancho Building', floor: 2, room_code: 'PANCHO PTA', room: 'PTA Room', type: 'Office', status: 'vacant', occupant: 'None', schedule: '--', capacity: 15, equipment: 'Conference Table' },
  { id: 'p2-sto', building: 'Pancho Building', floor: 2, room_code: 'PANCHO STO', room: 'STO', type: 'Faculty Office', status: 'vacant', occupant: 'None', schedule: '--', capacity: 15, equipment: 'Desks, File Storage' },
  { id: 'p2-scouts', building: 'Pancho Building', floor: 2, room_code: 'PANCHO SCOUTS', room: 'Scouts Room', type: 'Activity Office', status: 'vacant', occupant: 'None', schedule: '--', capacity: 20, equipment: 'Benches, Gear Lockers' },
  { id: 'p2-207', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 207', room: '207', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-209', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 209', room: '209', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-211', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 211', room: '211', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-213', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 213', room: '213', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-217', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 217', room: '217', type: 'Lecture Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 85, equipment: 'Sound System, Dual TV' },
  { id: 'p2-219', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 219', room: '219', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-221', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 221', room: '221', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-223', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 223', room: '223', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-225', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 225', room: '225', type: 'Lecture Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: 70, equipment: 'Projector, Whiteboard' },
  { id: 'p2-227a', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 227A', room: '227A', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
  { id: 'p2-227b', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 227B', room: '227B', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 40, equipment: 'Whiteboard' },
  { id: 'p2-229', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 229', room: '229', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Physics Kits' },
  { id: 'p2-231', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 231', room: '231', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-232', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 232', room: '232', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard' },
  { id: 'p2-233', building: 'Pancho Building', floor: 2, room_code: 'PANCHO 233', room: '233', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: 45, equipment: 'Whiteboard, Screen' }
];

// Rich Faculty Seed with full weekly class timetables
const INITIAL_FACULTY = [
  {
    id: 'f-1',
    faculty_id: 'BSU-FAC-2024-881',
    name: 'Prof. Maria Santos',
    dept: 'College of Information and Communications Technology',
    title: 'Associate Professor III',
    email: 'maria.santos@bulsu.edu.ph',
    phone: '+63 917 882 4591',
    status: 'available',
    room: 'None',
    subject: 'CS101 - Data Structures & Algorithms',
    hours: 'MWF 08:00 AM - 10:00 AM',
    consultation_hours: 'Mon/Wed 1:00 PM - 4:00 PM (Faculty Hall Rm 204)',
    schedule: [
      { id: 'sch-101', day: 'Mon', start: '08:00 AM', end: '10:00 AM', room: 'CBA Room 102', subject: 'CS101', section: 'BSCS 2A', units: 3 },
      { id: 'sch-102', day: 'Wed', start: '08:00 AM', end: '10:00 AM', room: 'CBA Room 102', subject: 'CS101', section: 'BSCS 2A', units: 3 },
      { id: 'sch-103', day: 'Fri', start: '08:00 AM', end: '10:00 AM', room: 'CBA Room 102', subject: 'CS101', section: 'BSCS 2A', units: 3 },
      { id: 'sch-104', day: 'Tue', start: '01:00 PM', end: '03:00 PM', room: 'CBA Room 102', subject: 'CS204', section: 'BSIT 3B', units: 3 }
    ]
  },
  {
    id: 'f-2',
    faculty_id: 'BSU-FAC-2023-412',
    name: 'Dr. Roberto Reyes',
    dept: 'College of Business Administration',
    title: 'Professor I & Dept Chair',
    email: 'roberto.reyes@bulsu.edu.ph',
    phone: '+63 918 554 1290',
    status: 'available',
    room: 'None',
    subject: 'BUS301 - Strategic Management',
    hours: 'TTh 01:00 PM - 03:00 PM',
    consultation_hours: 'Tue/Thu 9:00 AM - 12:00 PM (CBA Dean Office)',
    schedule: [
      { id: 'sch-201', day: 'Tue', start: '10:00 AM', end: '12:00 PM', room: 'CBA Room 201', subject: 'BUS201', section: 'BSBA 2C', units: 3 },
      { id: 'sch-202', day: 'Thu', start: '10:00 AM', end: '12:00 PM', room: 'CBA Room 201', subject: 'BUS201', section: 'BSBA 2C', units: 3 },
      { id: 'sch-203', day: 'Tue', start: '01:00 PM', end: '03:00 PM', room: 'Pancho 103', subject: 'BUS301', section: 'BSBA 3A', units: 3 },
      { id: 'sch-204', day: 'Thu', start: '01:00 PM', end: '03:00 PM', room: 'Pancho 103', subject: 'BUS301', section: 'BSBA 3A', units: 3 }
    ]
  },
  {
    id: 'f-3',
    faculty_id: 'BSU-FAC-2022-309',
    name: 'Engr. Carlos Cruz',
    dept: 'College of Engineering',
    title: 'Assistant Professor II',
    email: 'carlos.cruz@bulsu.edu.ph',
    phone: '+63 920 114 9982',
    status: 'available',
    room: 'None',
    subject: 'AERO202 - Aerodynamics & Propulsion',
    hours: 'MWF 09:00 AM - 12:00 PM',
    consultation_hours: 'Mon/Wed 2:00 PM - 4:00 PM (Hangar Avionics Bay)',
    schedule: [
      { id: 'sch-301', day: 'Mon', start: '09:00 AM', end: '12:00 PM', room: 'Hangar Room H2', subject: 'AERO202', section: 'BSAero 2', units: 4 },
      { id: 'sch-302', day: 'Wed', start: '09:00 AM', end: '12:00 PM', room: 'Hangar Room H2', subject: 'AERO202', section: 'BSAero 2', units: 4 },
      { id: 'sch-303', day: 'Fri', start: '09:00 AM', end: '12:00 PM', room: 'Hangar Room H2', subject: 'AERO202', section: 'BSAero 2', units: 4 }
    ]
  },
  {
    id: 'f-4',
    faculty_id: 'BSU-FAC-2024-520',
    name: 'Dr. Elena Lim',
    dept: 'College of Science',
    title: 'Associate Professor I',
    email: 'elena.lim@bulsu.edu.ph',
    phone: '+63 929 332 8840',
    status: 'available',
    room: 'None',
    subject: 'BIO102 - Cellular & Molecular Biology',
    hours: 'TTh 02:00 PM - 05:00 PM',
    consultation_hours: 'Wed/Fri 10:00 AM - 12:00 PM (SciLab Prep Room)',
    schedule: [
      { id: 'sch-401', day: 'Tue', start: '02:00 PM', end: '05:00 PM', room: 'Pancho Science Laboratory', subject: 'BIO102', section: 'BSBio 1A', units: 4 },
      { id: 'sch-402', day: 'Thu', start: '02:00 PM', end: '05:00 PM', room: 'Pancho Science Laboratory', subject: 'BIO102', section: 'BSBio 1A', units: 4 }
    ]
  },
  {
    id: 'f-5',
    faculty_id: 'BSU-FAC-2021-118',
    name: 'Prof. Antonio Gomez',
    dept: 'College of Arts and Letters',
    title: 'Assistant Professor III',
    email: 'antonio.gomez@bulsu.edu.ph',
    phone: '+63 916 448 3012',
    status: 'available',
    room: 'None',
    subject: 'ENG101 - Advanced Technical Writing',
    hours: 'MWF 10:00 AM - 12:00 PM',
    consultation_hours: 'Tue/Thu 1:00 PM - 3:00 PM (CAL Faculty Hall 108)',
    schedule: [
      { id: 'sch-501', day: 'Mon', start: '10:00 AM', end: '12:00 PM', room: 'Pancho Lecture Room', subject: 'ENG101', section: 'BSCS 1B', units: 3 },
      { id: 'sch-502', day: 'Wed', start: '10:00 AM', end: '12:00 PM', room: 'Pancho Lecture Room', subject: 'ENG101', section: 'BSCS 1B', units: 3 },
      { id: 'sch-503', day: 'Fri', start: '10:00 AM', end: '12:00 PM', room: 'Pancho Lecture Room', subject: 'ENG101', section: 'BSCS 1B', units: 3 }
    ]
  },
  {
    id: 'f-6',
    faculty_id: 'BSU-FAC-2024-904',
    name: 'Prof. Jason De Vega',
    dept: 'College of Engineering',
    title: 'Instructor I',
    email: 'jason.devega@bulsu.edu.ph',
    phone: '+63 945 771 9022',
    status: 'available',
    room: 'None',
    subject: 'UAV101 - Autonomous Drone Systems',
    hours: 'MW 01:00 PM - 03:30 PM',
    consultation_hours: 'Mon/Wed 4:00 PM - 5:30 PM (Drone Hangar)',
    schedule: [
      { id: 'sch-601', day: 'Mon', start: '01:00 PM', end: '03:30 PM', room: 'Hangar Room H4', subject: 'UAV101', section: 'BSAero 3', units: 3 },
      { id: 'sch-602', day: 'Wed', start: '01:00 PM', end: '03:30 PM', room: 'Hangar Room H4', subject: 'UAV101', section: 'BSAero 3', units: 3 }
    ]
  },
  {
    id: 'f-7',
    faculty_id: 'BSU-FAC-2023-719',
    name: 'Prof. Teresa Villanueva',
    dept: 'College of Business Administration',
    title: 'Associate Professor II',
    email: 'teresa.villanueva@bulsu.edu.ph',
    phone: '+63 933 665 1902',
    status: 'available',
    room: 'None',
    subject: 'ACT101 - Financial Accounting',
    hours: 'TTh 01:00 PM - 03:00 PM',
    consultation_hours: 'Tue/Thu 3:30 PM - 5:00 PM (CBA Faculty Room 301)',
    schedule: [
      { id: 'sch-701', day: 'Tue', start: '01:00 PM', end: '03:00 PM', room: 'CBA Room 203', subject: 'ACT101', section: 'BSA 1A', units: 3 },
      { id: 'sch-702', day: 'Thu', start: '01:00 PM', end: '03:00 PM', room: 'CBA Room 203', subject: 'ACT101', section: 'BSA 1A', units: 3 }
    ]
  },
  {
    id: 'f-8',
    faculty_id: 'BSU-FAC-2020-044',
    name: 'Dr. Arthur Mendoza',
    dept: 'College of Information and Communications Technology',
    title: 'Dean & Professor IV',
    email: 'arthur.mendoza@bulsu.edu.ph',
    phone: '+63 917 220 8811',
    status: 'available',
    room: 'None',
    subject: 'CS401 - Systems Architecture',
    hours: 'Fri 01:00 PM - 04:00 PM',
    consultation_hours: 'Mon-Fri 02:00 PM - 05:00 PM (CICT Dean Executive Suite)',
    schedule: [
      { id: 'sch-801', day: 'Fri', start: '01:00 PM', end: '04:00 PM', room: 'CBA Room 402', subject: 'CS401', section: 'BSCS 4A', units: 3 }
    ]
  },
  {
    id: 'f-9',
    faculty_id: 'BSU-FAC-2025-101',
    name: 'Engr. Andrea Dalisay',
    dept: 'College of Engineering',
    title: 'Instructor II',
    email: 'andrea.dalisay@bulsu.edu.ph',
    phone: '+63 928 440 9182',
    status: 'available',
    room: 'None',
    subject: 'ARCH202 - Architectural Design & CAD',
    hours: 'MWF 08:00 AM - 11:30 AM',
    consultation_hours: 'MW 1:30 PM - 3:30 PM (Engineering Drafting Hall)',
    schedule: [
      { id: 'sch-901', day: 'Mon', start: '08:00 AM', end: '11:30 AM', room: 'Pancho Room 215', subject: 'ARCH202', section: 'BSCE 2B', units: 4 },
      { id: 'sch-902', day: 'Wed', start: '08:00 AM', end: '11:30 AM', room: 'Pancho Room 215', subject: 'ARCH202', section: 'BSCE 2B', units: 4 }
    ]
  },
  {
    id: 'f-10',
    faculty_id: 'BSU-FAC-2022-654',
    name: 'Prof. Grace Ramos',
    dept: 'College of Education',
    title: 'Assistant Professor I',
    email: 'grace.ramos@bulsu.edu.ph',
    phone: '+63 999 501 3328',
    status: 'available',
    room: 'None',
    subject: 'SPED201 - Inclusive Education Strategies',
    hours: 'TTh 08:00 AM - 12:00 PM',
    consultation_hours: 'Fri 09:00 AM - 12:00 PM (COE Rm 104)',
    schedule: [
      { id: 'sch-1001', day: 'Tue', start: '08:00 AM', end: '12:00 PM', room: 'Pancho SPED', subject: 'SPED201', section: 'BSEd SPED 3', units: 4 },
      { id: 'sch-1002', day: 'Thu', start: '08:00 AM', end: '12:00 PM', room: 'Pancho SPED', subject: 'SPED201', section: 'BSEd SPED 3', units: 4 }
    ]
  },
  {
    id: 'f-11',
    faculty_id: 'BSU-FAC-2023-810',
    name: 'Dr. Ferdinand Soriano',
    dept: 'College of Arts and Letters',
    title: 'Associate Professor II',
    email: 'ferdinand.soriano@bulsu.edu.ph',
    phone: '+63 919 773 1109',
    status: 'available',
    room: 'None',
    subject: 'FIL101 - Komunikasyon sa Akademikong Filipino',
    hours: 'MWF 01:00 PM - 03:00 PM',
    consultation_hours: 'Mon/Wed 10:00 AM - 12:00 PM (CAL Hall Rm 112)',
    schedule: [
      { id: 'sch-1101', day: 'Mon', start: '01:00 PM', end: '03:00 PM', room: 'Pancho 121', subject: 'FIL101', section: 'BA Comm 1', units: 3 },
      { id: 'sch-1102', day: 'Wed', start: '01:00 PM', end: '03:00 PM', room: 'Pancho 121', subject: 'FIL101', section: 'BA Comm 1', units: 3 },
      { id: 'sch-1103', day: 'Fri', start: '01:00 PM', end: '03:00 PM', room: 'Pancho 121', subject: 'FIL101', section: 'BA Comm 1', units: 3 }
    ]
  },
  {
    id: 'f-12',
    faculty_id: 'BSU-FAC-2024-349',
    name: 'Prof. Beatrice Morales',
    dept: 'College of Science',
    title: 'Instructor III',
    email: 'beatrice.morales@bulsu.edu.ph',
    phone: '+63 921 662 4901',
    status: 'available',
    room: 'None',
    subject: 'PHY102 - General Physics with Laboratory',
    hours: 'TTh 02:00 PM - 04:00 PM',
    consultation_hours: 'Thu 09:00 AM - 11:30 AM (Physics Laboratory 114)',
    schedule: [
      { id: 'sch-1201', day: 'Tue', start: '02:00 PM', end: '04:00 PM', room: 'Pancho 114', subject: 'PHY102', section: 'BSCS 1A', units: 3 },
      { id: 'sch-1202', day: 'Thu', start: '02:00 PM', end: '04:00 PM', room: 'Pancho 114', subject: 'PHY102', section: 'BSCS 1A', units: 3 }
    ]
  }
];

const INITIAL_REQUESTS = [];

const INITIAL_LOGS = [
  { 
    id: 'LOG-INIT-1', 
    title: 'FARMS System Initialized', 
    desc: 'System database initialized with all 58 campus facilities vacant and ready for scheduling.', 
    text: 'System database initialized with all 58 campus facilities vacant and ready for scheduling.', 
    type: 'system', 
    icon: 'system', 
    color: 'green', 
    side: 'left', 
    timestamp: Date.now(), 
    createdAt: new Date().toISOString() 
  }
];

// Persistent state container
let rooms = [];
let faculty = [];
let requests = [];
let activityLogs = [];

function loadData() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      rooms.splice(0, rooms.length, ...(parsed.rooms || INITIAL_ROOMS));
      faculty.splice(0, faculty.length, ...(parsed.faculty || INITIAL_FACULTY));
      requests.splice(0, requests.length, ...(parsed.requests || INITIAL_REQUESTS));
      activityLogs.splice(0, activityLogs.length, ...(parsed.activityLogs || INITIAL_LOGS));
      console.log(`[Database] Loaded ${rooms.length} rooms, ${faculty.length} faculty members from ${DATA_FILE}`);
      return;
    }
  } catch (err) {
    console.error('[Database] Error loading JSON persistence file, seeding defaults:', err.message);
  }

  // Fallback / Initial Seed
  rooms.splice(0, rooms.length, ...INITIAL_ROOMS);
  faculty.splice(0, faculty.length, ...INITIAL_FACULTY);
  requests.splice(0, requests.length, ...INITIAL_REQUESTS);
  activityLogs.splice(0, activityLogs.length, ...INITIAL_LOGS);
  saveData();
  console.log(`[Database] Seeded ${rooms.length} rooms and ${faculty.length} faculty members.`);
}

let saveTimer = null;
let isSaving = false;
let pendingSave = false;

async function performAsyncSave() {
  if (isSaving) {
    pendingSave = true;
    return;
  }
  isSaving = true;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      await fs.promises.mkdir(DATA_DIR, { recursive: true });
    }
    const payload = {
      rooms,
      faculty,
      requests,
      activityLogs,
      lastUpdated: new Date().toISOString()
    };
    await fs.promises.writeFile(DATA_FILE, JSON.stringify(payload), 'utf8');
  } catch (err) {
    console.error('[Database] Failed to write data asynchronously:', err.message);
  } finally {
    isSaving = false;
    if (pendingSave) {
      pendingSave = false;
      performAsyncSave();
    }
  }
}

function saveData(immediate = false) {
  if (immediate) {
    if (saveTimer) clearTimeout(saveTimer);
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const payload = {
        rooms,
        faculty,
        requests,
        activityLogs,
        lastUpdated: new Date().toISOString()
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(payload), 'utf8');
      return true;
    } catch (err) {
      console.error('[Database] Failed to write data synchronously:', err.message);
      return false;
    }
  }

  // Debounced non-blocking save (250ms)
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(performAsyncSave, 250);
  return true;
}

// Flush pending writes on graceful shutdown
process.on('beforeExit', () => {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveData(true);
  }
});

function resetSystem(preserveLogs = true) {
  // Vacate all rooms
  rooms.forEach(r => {
    r.status = 'vacant';
    r.occupant = 'None';
    r.schedule = '--';
    r.declaredDuration = 0;
    r.actualOccupiedMinutes = 0;
    r.lastUpdated = Date.now();
  });

  // Reset all faculty
  faculty.forEach(f => {
    f.status = 'available';
    f.room = 'None';
  });

  // Clear booking requests
  requests.splice(0, requests.length);

  // If preserveLogs is true, do NOT clear activityLogs, but append a system reset audit log
  if (preserveLogs) {
    const resetLog = {
      id: `LOG-RESET-${Date.now()}`,
      title: 'System State Reset',
      desc: 'System reset executed. All 85 campus facilities set to vacant, faculty set to available, and access requests cleared. Audit history preserved.',
      text: 'System reset executed. All 85 campus facilities set to vacant, faculty set to available, and access requests cleared. Audit history preserved.',
      type: 'system',
      icon: 'system',
      color: 'amber',
      side: 'left',
      timestamp: Date.now(),
      createdAt: new Date().toISOString()
    };
    activityLogs.unshift(resetLog);
  } else {
    activityLogs.splice(0, activityLogs.length, ...INITIAL_LOGS);
  }

  saveData();
  return {
    roomsCount: rooms.length,
    requestsCount: requests.length,
    logsCount: activityLogs.length,
    timestamp: new Date().toISOString()
  };
}

// Initialize on module load
loadData();

module.exports = {
  rooms,
  faculty,
  requests,
  activityLogs,
  saveData,
  loadData,
  resetSystem
};
