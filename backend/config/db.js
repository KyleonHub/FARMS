/**
 * FARMS - Data Store & Seed Configuration
 */

let rooms = [
  // CBA Building
  { id: 'cba-101', building: 'CBA Building', floor: 1, room: 'Room 101', type: 'Lecture Hall', status: 'vacant', occupant: 'None', schedule: '--', capacity: '50 Students' },
  { id: 'cba-102', building: 'CBA Building', floor: 1, room: 'Room 102', type: 'Computer Lab', status: 'occupied', occupant: 'Prof. Santos (CS101)', schedule: '08:00 AM - 10:00 AM', capacity: '40 Workstations' },
  { id: 'cba-103', building: 'CBA Building', floor: 1, room: 'Room 103', type: 'Lecture Room', status: 'vacant', occupant: 'None', schedule: '--', capacity: '45 Students' },
  { id: 'cba-201', building: 'CBA Building', floor: 2, room: 'Room 201', type: 'Smart Classroom', status: 'occupied', occupant: 'Dr. Reyes (BUS201)', schedule: '10:00 AM - 12:00 PM', capacity: '45 Students' },
  { id: 'cba-202', building: 'CBA Building', floor: 2, room: 'Room 202', type: 'Lecture Room', status: 'occupied', occupant: 'Prof. Gomez (MKT102)', schedule: '01:00 PM - 03:00 PM', capacity: '45 Students' },
  { id: 'cba-203', building: 'CBA Building', floor: 2, room: 'Room 203', type: 'Seminar Room', status: 'vacant', occupant: 'None', schedule: '--', capacity: '60 Students' },
  
  // Hangar Complex
  { id: 'h-1', building: 'Hangar', floor: 1, room: 'Room H1', type: 'Aero Lab', status: 'vacant', occupant: 'None', schedule: '--', capacity: '35 Students' },
  { id: 'h-2', building: 'Hangar', floor: 1, room: 'Room H2', type: 'Avionics Workshop', status: 'occupied', occupant: 'Engr. Cruz (AERO202)', schedule: '09:00 AM - 12:00 PM', capacity: '30 Students' },
  { id: 'h-3', building: 'Hangar', floor: 1, room: 'Room H3', type: 'Flight Simulation', status: 'vacant', occupant: 'None', schedule: '--', capacity: '20 Students' },

  // Pancho Building
  { id: 'p-101', building: 'Pancho Building', floor: 1, room: '101', type: 'Classroom', status: 'vacant', occupant: 'None', schedule: '--', capacity: '45 Students' },
  { id: 'p-103', building: 'Pancho Building', floor: 1, room: '103', type: 'Classroom', status: 'occupied', occupant: 'Dr. Reyes (BUS301)', schedule: '01:00 PM - 03:00 PM', capacity: '45 Students' },
  { id: 'p-lecture', building: 'Pancho Building', floor: 1, room: 'Lecture Room', type: 'Lecture Hall', status: 'occupied', occupant: 'Prof. Gomez (ENG101)', schedule: '10:00 AM - 12:00 PM', capacity: '90 Students' },
  { id: 'p-scilab', building: 'Pancho Building', floor: 1, room: 'Science Laboratory', type: 'Wet Lab', status: 'occupied', occupant: 'Dr. Lim (BIO102)', schedule: '02:00 PM - 05:00 PM', capacity: '45 Workstations' }
];

let faculty = [
  { id: 'f-1', name: 'Prof. Santos', dept: 'Computer Science', status: 'in-class', room: 'CBA Room 102', subject: 'CS101 - Algorithms', email: 'santos@farms.edu', hours: 'MWF 1-3 PM' },
  { id: 'f-2', name: 'Dr. Reyes', dept: 'Business Admin', status: 'in-class', room: 'Pancho 103', subject: 'BUS301 - Strategic Mgmt', email: 'reyes@farms.edu', hours: 'TTh 9-11 AM' },
  { id: 'f-3', name: 'Engr. Cruz', dept: 'Engineering', status: 'in-class', room: 'Hangar Room H2', subject: 'AERO202 - Aerodynamics', email: 'cruz@farms.edu', hours: 'MWF 10-12 AM' }
];

let requests = [
  { id: 'REQ-101', requester: 'Student Council (Pres. Alcantara)', room: 'Pancho Multimedia Room', purpose: 'Campus Leadership Forum', date: 'Tomorrow, 2:00 PM - 5:00 PM', status: 'pending' },
  { id: 'REQ-102', requester: 'Engr. Cruz (Aero Club)', room: 'Hangar Room H1', purpose: 'Drone Flight Calibration', date: 'Friday, 1:00 PM - 4:00 PM', status: 'pending' }
];

let activityLogs = [
  { icon: '🚪', text: 'Room CBA 102 assigned to Prof. Santos for CS101', time: '10 mins ago', type: 'assignment' },
  { icon: '🟢', text: 'Room Pancho 101 marked as Vacant', time: '40 mins ago', type: 'status' }
];

module.exports = {
  rooms,
  faculty,
  requests,
  activityLogs
};
