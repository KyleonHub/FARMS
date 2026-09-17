/**
 * FARMS - Faculty Management & Schedule Controller
 * Complete CRUD operations, department analytics, timetable management,
 * and automatic two-way room occupancy synchronization.
 */

const { faculty, rooms, activityLogs, saveData } = require('../config/db');

// Helper to find a faculty member by internal ID or institutional faculty_id
function findFacultyIndex(id) {
  if (!id) return -1;
  const cleanId = String(id).trim().toLowerCase();
  return faculty.findIndex(f => 
    String(f.id).toLowerCase() === cleanId || 
    (f.faculty_id && String(f.faculty_id).toLowerCase() === cleanId)
  );
}

// Helper to match room by ID, room_code, or room name
function findRoom(roomIdentifier) {
  if (!roomIdentifier || roomIdentifier === 'None') return null;
  const clean = String(roomIdentifier).trim().toLowerCase();
  return rooms.find(r => 
    (r.id && r.id.toLowerCase() === clean) ||
    (r.room_code && r.room_code.toLowerCase() === clean) ||
    (r.room && r.room.toLowerCase() === clean) ||
    clean.includes(r.id.toLowerCase()) ||
    (r.room_code && clean.includes(r.room_code.toLowerCase()))
  );
}

/**
 * GET /api/faculty
 * Fetch all faculty with optional filtering, search, and sorting
 */
exports.getAllFaculty = (req, res) => {
  try {
    const { dept, status, search, room, sortBy = 'name', order = 'asc' } = req.query;
    let result = [...faculty];

    // Filter by department (partial match, case-insensitive)
    if (dept && dept !== 'all') {
      const qDept = dept.trim().toLowerCase();
      result = result.filter(f => f.dept && f.dept.toLowerCase().includes(qDept));
    }

    // Filter by status (available, in-class, consultation, off-campus)
    if (status && status !== 'all') {
      const qStatus = status.trim().toLowerCase();
      result = result.filter(f => f.status && f.status.toLowerCase() === qStatus);
    }

    // Filter by room
    if (room) {
      const qRoom = room.trim().toLowerCase();
      result = result.filter(f => f.room && f.room.toLowerCase().includes(qRoom));
    }

    // Global text search across name, faculty_id, email, subject, room, dept
    if (search) {
      const q = search.trim().toLowerCase();
      result = result.filter(f => 
        (f.name && f.name.toLowerCase().includes(q)) ||
        (f.faculty_id && f.faculty_id.toLowerCase().includes(q)) ||
        (f.email && f.email.toLowerCase().includes(q)) ||
        (f.subject && f.subject.toLowerCase().includes(q)) ||
        (f.dept && f.dept.toLowerCase().includes(q)) ||
        (f.room && f.room.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      let fieldA = (a[sortBy] || '').toString().toLowerCase();
      let fieldB = (b[sortBy] || '').toString().toLowerCase();
      if (order === 'desc') {
        return fieldB.localeCompare(fieldA);
      }
      return fieldA.localeCompare(fieldB);
    });

    res.json({
      success: true,
      count: result.length,
      total: faculty.length,
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve faculty list', error: err.message });
  }
};

/**
 * GET /api/faculty/departments
 * Aggregate faculty counts and status breakdown grouped by department
 */
exports.getDepartments = (req, res) => {
  try {
    const deptMap = {};

    faculty.forEach(f => {
      const d = f.dept || 'General Academic';
      if (!deptMap[d]) {
        deptMap[d] = {
          department: d,
          total: 0,
          available: 0,
          inClass: 0,
          consultation: 0,
          offCampus: 0
        };
      }
      deptMap[d].total += 1;
      if (f.status === 'available') deptMap[d].available += 1;
      else if (f.status === 'in-class') deptMap[d].inClass += 1;
      else if (f.status === 'consultation') deptMap[d].consultation += 1;
      else if (f.status === 'off-campus') deptMap[d].offCampus += 1;
    });

    const departments = Object.values(deptMap).sort((a, b) => b.total - a.total);

    res.json({
      success: true,
      count: departments.length,
      data: departments
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to aggregate departments', error: err.message });
  }
};

/**
 * GET /api/faculty/:id
 * Retrieve a single faculty member by ID or faculty_id
 */
exports.getFacultyById = (req, res) => {
  const { id } = req.params;
  const index = findFacultyIndex(id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: `Faculty member '${id}' not found` });
  }

  res.json({ success: true, data: faculty[index] });
};

/**
 * POST /api/faculty
 * Register a new faculty member with validation and initial schedule
 */
exports.createFaculty = (req, res) => {
  try {
    const {
      name,
      dept,
      title,
      email,
      phone,
      faculty_id,
      status,
      room,
      subject,
      hours,
      consultation_hours,
      schedule
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Full Name is required' });
    }
    if (!dept || !dept.trim()) {
      return res.status(400).json({ success: false, message: 'Department is required' });
    }

    const newId = `f-${Date.now()}`;
    const generatedFacultyId = faculty_id && faculty_id.trim()
      ? faculty_id.trim()
      : `BSU-FAC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newMember = {
      id: newId,
      faculty_id: generatedFacultyId,
      name: name.trim(),
      dept: dept.trim(),
      title: title && title.trim() ? title.trim() : 'Instructor I',
      email: email && email.trim() ? email.trim() : `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@bulsu.edu.ph`,
      phone: phone && phone.trim() ? phone.trim() : '+63 900 000 0000',
      status: status || 'available',
      room: room || 'None',
      subject: subject || 'Unassigned',
      hours: hours || '--',
      consultation_hours: consultation_hours || 'By Appointment',
      schedule: Array.isArray(schedule) ? schedule : []
    };

    // If initial status is in-class with a room, synchronize room status
    if (newMember.status === 'in-class' && newMember.room && newMember.room !== 'None') {
      const targetRoom = findRoom(newMember.room);
      if (targetRoom) {
        targetRoom.status = 'occupied';
        targetRoom.occupant = `${newMember.name} (${newMember.subject})`;
        targetRoom.schedule = newMember.hours || 'Active Class';
      }
    }

    faculty.push(newMember);
    saveData();

    activityLogs.unshift({
      icon: '👤',
      text: `New faculty registered: ${newMember.name} (${newMember.dept})`,
      time: 'Just now',
      type: 'faculty'
    });

    res.status(201).json({
      success: true,
      message: 'Faculty member created successfully',
      data: newMember
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create faculty member', error: err.message });
  }
};

/**
 * PUT /api/faculty/:id
 * Full update of faculty member details
 */
exports.updateFaculty = (req, res) => {
  try {
    const { id } = req.params;
    const index = findFacultyIndex(id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: `Faculty member '${id}' not found` });
    }

    const prevMember = faculty[index];
    const updated = {
      ...prevMember,
      ...req.body,
      id: prevMember.id // immutable internal ID
    };

    // If status or room changed, maintain sync
    if (req.body.status && req.body.status !== prevMember.status) {
      if (req.body.status === 'in-class' && updated.room && updated.room !== 'None') {
        const targetRoom = findRoom(updated.room);
        if (targetRoom) {
          targetRoom.status = 'occupied';
          targetRoom.occupant = `${updated.name} (${updated.subject || 'Class'})`;
          targetRoom.schedule = updated.hours || 'Active Class';
        }
      } else if (prevMember.room && prevMember.room !== 'None') {
        const prevRoom = findRoom(prevMember.room);
        if (prevRoom && prevRoom.occupant && prevRoom.occupant.includes(prevMember.name)) {
          prevRoom.status = 'vacant';
          prevRoom.occupant = 'None';
          prevRoom.schedule = '--';
        }
        if (req.body.status !== 'in-class') {
          updated.room = 'None';
        }
      }
    }

    faculty[index] = updated;
    saveData();

    activityLogs.unshift({
      icon: '✏️',
      text: `Faculty profile updated: ${updated.name} (${updated.dept})`,
      time: 'Just now',
      type: 'faculty'
    });

    res.json({
      success: true,
      message: 'Faculty member updated successfully',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update faculty member', error: err.message });
  }
};

/**
 * PATCH /api/faculty/:id/status
 * Quick status transition with automated room occupancy synchronization
 */
exports.patchFacultyStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status, room, subject } = req.body;

    const validStatuses = ['available', 'in-class', 'consultation', 'off-campus'];
    if (!status || !validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const index = findFacultyIndex(id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: `Faculty member '${id}' not found` });
    }

    const member = faculty[index];
    const prevStatus = member.status;
    const prevRoom = member.room;
    const newStatus = status.toLowerCase();

    member.status = newStatus;
    if (subject) member.subject = subject;

    let affectedRoom = null;

    if (newStatus === 'in-class') {
      const targetRoomName = room || member.room;
      if (targetRoomName && targetRoomName !== 'None') {
        member.room = targetRoomName;
        const targetRoom = findRoom(targetRoomName);
        if (targetRoom) {
          targetRoom.status = 'occupied';
          targetRoom.occupant = `${member.name} (${member.subject || 'Class'})`;
          targetRoom.schedule = member.hours || 'Active Class';
          affectedRoom = targetRoom;
        }
      }
    } else {
      // Releasing room back to vacant pool
      if (prevRoom && prevRoom !== 'None') {
        const roomToRelease = findRoom(prevRoom);
        if (roomToRelease) {
          roomToRelease.status = 'vacant';
          roomToRelease.occupant = 'None';
          roomToRelease.schedule = '--';
          affectedRoom = roomToRelease;
        }
      }
      // Also release any other room whose occupant string contains member's name
      rooms.forEach(r => {
        if (r.occupant && r.occupant.toLowerCase().includes(member.name.toLowerCase())) {
          r.status = 'vacant';
          r.occupant = 'None';
          r.schedule = '--';
        }
      });
      member.room = 'None';
    }

    saveData();

    const statusIcons = {
      'available': '🟢',
      'in-class': '🏫',
      'consultation': '🕒',
      'off-campus': '⚪'
    };

    activityLogs.unshift({
      icon: statusIcons[newStatus] || '🔄',
      text: `${member.name} changed status from ${prevStatus.toUpperCase()} to ${newStatus.toUpperCase()}${member.room !== 'None' ? ' in ' + member.room : ''}`,
      time: 'Just now',
      type: 'status'
    });

    res.json({
      success: true,
      message: `Status updated to ${newStatus}`,
      data: member,
      affectedRoom: affectedRoom ? { id: affectedRoom.id, room: affectedRoom.room, status: affectedRoom.status } : null
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update faculty status', error: err.message });
  }
};

/**
 * DELETE /api/faculty/:id
 * Remove a faculty member and release any held facilities
 */
exports.deleteFaculty = (req, res) => {
  try {
    const { id } = req.params;
    const index = findFacultyIndex(id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: `Faculty member '${id}' not found` });
    }

    const removed = faculty[index];

    // Release any rooms occupied by this faculty
    rooms.forEach(r => {
      if (r.occupant && r.occupant.toLowerCase().includes(removed.name.toLowerCase())) {
        r.status = 'vacant';
        r.occupant = 'None';
        r.schedule = '--';
      }
    });

    faculty.splice(index, 1);
    saveData();

    activityLogs.unshift({
      icon: '🗑️',
      text: `Faculty record removed: ${removed.name} (${removed.faculty_id})`,
      time: 'Just now',
      type: 'faculty'
    });

    res.json({
      success: true,
      message: `Faculty member '${removed.name}' removed successfully`,
      deletedId: removed.id
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete faculty member', error: err.message });
  }
};

/**
 * GET /api/faculty/:id/schedule
 * Retrieve timetable for a specific faculty member
 */
exports.getFacultySchedule = (req, res) => {
  try {
    const { id } = req.params;
    const index = findFacultyIndex(id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: `Faculty member '${id}' not found` });
    }

    const member = faculty[index];
    res.json({
      success: true,
      facultyId: member.id,
      facultyNumber: member.faculty_id,
      facultyName: member.name,
      department: member.dept,
      schedule: member.schedule || []
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve schedule', error: err.message });
  }
};

/**
 * PUT /api/faculty/:id/schedule
 * Update or replace weekly timetable slots for a faculty member
 */
exports.updateFacultySchedule = (req, res) => {
  try {
    const { id } = req.params;
    const index = findFacultyIndex(id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: `Faculty member '${id}' not found` });
    }

    const incoming = Array.isArray(req.body) ? req.body : req.body.schedule;
    if (!Array.isArray(incoming)) {
      return res.status(400).json({
        success: false,
        message: 'Schedule payload must be an array of timetable slots or { schedule: [...] }'
      });
    }

    // Format schedule slots with unique IDs if missing
    const formattedSchedule = incoming.map((slot, i) => ({
      id: slot.id || `sch-${Date.now()}-${i + 1}`,
      day: slot.day || 'Mon',
      start: slot.start || '08:00 AM',
      end: slot.end || '10:00 AM',
      room: slot.room || 'Unassigned',
      subject: slot.subject || 'Class',
      section: slot.section || 'General',
      units: slot.units ? Number(slot.units) : 3
    }));

    faculty[index].schedule = formattedSchedule;
    saveData();

    activityLogs.unshift({
      icon: '📅',
      text: `Timetable updated for ${faculty[index].name} (${formattedSchedule.length} active slots)`,
      time: 'Just now',
      type: 'schedule'
    });

    res.json({
      success: true,
      message: 'Faculty timetable updated successfully',
      data: formattedSchedule
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update schedule', error: err.message });
  }
};
