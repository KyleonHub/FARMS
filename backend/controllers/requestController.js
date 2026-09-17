/**
 * FARMS - Room Access & Booking Requests Controller
 * Handles request creation, approvals, rejections, activity logging, room occupancy sync, and real-time broadcasts
 */
const { requests, rooms, activityLogs, saveData } = require('../config/db');
const events = require('../utils/events');

function findRoomInDb(roomStr) {
  if (!roomStr || typeof roomStr !== 'string') return null;
  const raw = roomStr.trim();
  const lower = raw.toLowerCase();

  // 1. Direct ID match
  const byId = rooms.find(r => r.id && r.id.toLowerCase() === lower);
  if (byId) return byId;

  // 2. Direct room_code match
  const byCode = rooms.find(r => (r.room_code || '').toLowerCase() === lower);
  if (byCode) return byCode;

  // 3. Extract building hint
  let bldgHint = null;
  if (/pancho/i.test(lower)) bldgHint = 'Pancho Building';
  else if (/cba/i.test(lower)) bldgHint = 'CBA Building';
  else if (/hangar/i.test(lower)) bldgHint = 'Hangar';

  // 4. Special facilities matching
  if (/science|scilab/i.test(lower)) {
    return rooms.find(r => r.id === 'p1-scilab' || (r.room && /science/i.test(r.room)));
  }
  if (/multimedia|avr/i.test(lower)) {
    return rooms.find(r => r.id === 'p1-multimedia' || (r.room && /multimedia/i.test(r.room)));
  }
  if (/lecture/i.test(lower) && (!bldgHint || bldgHint === 'Pancho Building')) {
    return rooms.find(r => r.id === 'p1-lecture' || (r.room && /lecture room/i.test(r.room)));
  }
  if (/library|lib/i.test(lower)) {
    return rooms.find(r => r.id === 'p1-library' || (r.room && /library/i.test(r.room)));
  }
  if (/sped/i.test(lower)) {
    return rooms.find(r => r.id === 'p2-sped' || (r.room && /sped/i.test(r.room)));
  }
  if (/unites/i.test(lower)) {
    return rooms.find(r => r.id === 'p2-unites' || (r.room && /unites/i.test(r.room)));
  }
  if (/pta/i.test(lower)) {
    return rooms.find(r => r.id === 'p2-pta' || (r.room && /pta/i.test(r.room)));
  }
  if (/sto/i.test(lower)) {
    return rooms.find(r => r.id === 'p2-sto' || (r.room && /sto/i.test(r.room)));
  }
  if (/scouts/i.test(lower)) {
    return rooms.find(r => r.id === 'p2-scouts' || (r.room && /scouts/i.test(r.room)));
  }

  // 5. Extract room number or code (e.g., "101", "103", "201", "001", "117a")
  const numMatch = lower.match(/\b\d{3}[a-z]?\b/) || lower.match(/\b\d{1,3}[a-z]?\b/);
  if (numMatch) {
    const num = numMatch[0];
    const candidateRooms = bldgHint ? rooms.filter(r => r.building === bldgHint) : rooms;
    const match = candidateRooms.find(r => {
      const rCode = (r.room_code || '').toLowerCase();
      const rName = (r.room || '').toLowerCase();
      const rId = (r.id || '').toLowerCase();
      return rCode.endsWith(num) || rName === num || rName.endsWith(num) || rId.endsWith(num);
    });
    if (match) return match;
  }

  // 6. Generic substring matching
  const cleanStr = lower.replace(/\([^)]*\)/g, '').replace(/building|room|floor|flr|\d/gi, '').trim();
  if (cleanStr.length > 2) {
    const subMatch = rooms.find(r => {
      const rName = (r.room || '').toLowerCase();
      return rName.includes(cleanStr) || cleanStr.includes(rName);
    });
    if (subMatch) return subMatch;
  }

  return null;
}

function parseDurationMinutes(str) {
  if (!str || typeof str !== 'string') return 120;
  // Match 12-hour or 24-hour range like "01:00 PM – 03:30 PM", "8:00 AM - 10:00 AM", "08:00 - 10:00"
  const rangeMatch = str.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?\s*[-–—to]+\s*(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (rangeMatch) {
    let [_, h1, m1, ap1, h2, m2, ap2] = rangeMatch;
    let startHour = parseInt(h1, 10);
    let endHour = parseInt(h2, 10);
    if (!ap1 && ap2) ap1 = ap2;
    if (!ap2 && ap1) ap2 = ap1;
    if (ap1 && ap1.toUpperCase() === 'PM' && startHour !== 12) startHour += 12;
    if (ap1 && ap1.toUpperCase() === 'AM' && startHour === 12) startHour = 0;
    if (ap2 && ap2.toUpperCase() === 'PM' && endHour !== 12) endHour += 12;
    if (ap2 && ap2.toUpperCase() === 'AM' && endHour === 12) endHour = 0;

    const startMins = startHour * 60 + parseInt(m1, 10);
    const endMins = endHour * 60 + parseInt(m2, 10);
    if (endMins > startMins) {
      return endMins - startMins;
    }
  }

  // Match "2 hrs", "90 mins", "3 hours"
  const hoursMatch = str.match(/(\d+(\.\d+)?)\s*(hr|hour|hrs|hours)/i);
  if (hoursMatch) return Math.round(parseFloat(hoursMatch[1]) * 60);
  const minsMatch = str.match(/(\d+)\s*(min|mins|minutes)/i);
  if (minsMatch) return parseInt(minsMatch[1], 10);

  return 120; // standard default
}

exports.getAllRequests = (req, res) => {
  res.json({ success: true, count: requests.length, data: requests });
};

exports.createRequest = (req, res) => {
  const { requester, room, purpose, date, time, start_time, end_time, duration_minutes } = req.body;
  
  if (!requester || !room) {
    return res.status(400).json({ success: false, message: 'Requester and Room are required' });
  }

  let scheduleDate = date;
  if (!scheduleDate) {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    scheduleDate = `${today} · ${nowTime}`;
  }

  const duration = typeof duration_minutes === 'number' 
    ? duration_minutes 
    : parseDurationMinutes(scheduleDate + ' ' + (time || ''));

  const newRequest = {
    id: req.body.id || `REQ-${Date.now().toString().slice(-4)}`,
    requester,
    room,
    purpose: purpose || 'Academic Activity',
    date: scheduleDate,
    time: time || '',
    start_time: start_time || null,
    end_time: end_time || null,
    duration_minutes: duration,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  requests.unshift(newRequest);
  
  const now = new Date();
  const logItem = {
    id: `LOG-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    title: `New Request Submitted: ${room}`,
    desc: `Submitted by ${requester} for ${purpose || 'Academic Activity'}`,
    text: `New access request submitted for ${room} by ${requester}`,
    icon: 'request',
    color: 'amber',
    type: 'request',
    side: 'left',
    timestamp: now.getTime(),
    createdAt: now.toISOString()
  };
  activityLogs.unshift(logItem);

  saveData();

  // Broadcast real-time event to all connected dashboard clients
  events.broadcast('new_request', newRequest);
  events.broadcast('new_log', logItem);

  res.status(201).json({ success: true, message: 'Request submitted successfully', data: newRequest });
};

exports.updateRequestStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const reqIndex = requests.findIndex(r => r.id === id);
  if (reqIndex === -1) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }

  requests[reqIndex].status = status;
  const targetReq = requests[reqIndex];

  // Synchronize Room Occupancy in real-time
  let matchedRoom = null;
  const now = new Date();

  if (status === 'approved') {
    matchedRoom = findRoomInDb(targetReq.room);
    if (matchedRoom) {
      const nowIso = now.toISOString();
      const parsedDuration = parseDurationMinutes(targetReq.date);

      matchedRoom.status = 'occupied';
      matchedRoom.occupant = targetReq.requester;
      matchedRoom.schedule = targetReq.date || 'Active Reservation';
      matchedRoom.declaredDuration = parsedDuration;
      matchedRoom.actualOccupiedMinutes = 0; // Starts in real-time at 0 minutes
      matchedRoom.sessionStartTime = nowIso;

      const assignLog = {
        id: `LOG-${Date.now()}-${Math.floor(Math.random()*1000)}`,
        title: `Room Assigned: ${matchedRoom.room_code || matchedRoom.room}`,
        desc: `Room allocated to ${targetReq.requester} (${targetReq.purpose || 'Authorized Access'})`,
        text: `Room ${matchedRoom.room_code || matchedRoom.room} assigned to ${targetReq.requester}`,
        icon: 'door',
        color: 'green',
        type: 'booking',
        side: 'left',
        timestamp: now.getTime(),
        createdAt: now.toISOString()
      };
      activityLogs.unshift(assignLog);
      events.broadcast('new_log', assignLog);
    }
  } else if (status === 'denied') {
    matchedRoom = findRoomInDb(targetReq.room);
    if (matchedRoom && matchedRoom.occupant && matchedRoom.occupant.includes(targetReq.requester)) {
      matchedRoom.status = 'vacant';
      matchedRoom.occupant = 'None';
      matchedRoom.schedule = '--';
      matchedRoom.declaredDuration = 0;
      matchedRoom.actualOccupiedMinutes = 0;
      matchedRoom.sessionStartTime = null;

      const releaseLog = {
        id: `LOG-${Date.now()}-${Math.floor(Math.random()*1000)}`,
        title: `Room Released: ${matchedRoom.room_code || matchedRoom.room}`,
        desc: `Released back to vacant pool after request denied`,
        text: `Room ${matchedRoom.room_code || matchedRoom.room} released back to Vacant pool`,
        icon: 'release',
        color: 'teal',
        type: 'release',
        side: 'left',
        timestamp: now.getTime(),
        createdAt: now.toISOString()
      };
      activityLogs.unshift(releaseLog);
      events.broadcast('new_log', releaseLog);
    }
  }

  const logItem = {
    id: `LOG-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    title: `Request ${status.toUpperCase()}: ${targetReq.room}`,
    desc: `Request for ${targetReq.room} by ${targetReq.requester} marked as ${status.toUpperCase()}`,
    text: `Request ${id} for ${targetReq.room} marked as ${status.toUpperCase()}`,
    icon: status === 'approved' ? 'check' : 'cross',
    color: status === 'approved' ? 'green' : 'red',
    type: status === 'approved' ? 'booking' : 'status',
    side: 'right',
    timestamp: now.getTime(),
    createdAt: now.toISOString()
  };
  activityLogs.unshift(logItem);

  saveData();

  // Broadcast status update to all connected clients
  events.broadcast('request_status_updated', targetReq);
  if (matchedRoom) {
    events.broadcast('room_updated', matchedRoom);
  }
  events.broadcast('new_log', logItem);

  res.json({ success: true, message: `Request ${status}`, data: targetReq, room: matchedRoom });
};

exports.getActivityLogs = (req, res) => {
  res.json({ success: true, count: activityLogs.length, data: activityLogs });
};
