/**
 * FARMS - Room Management Controller
 * Handles room queries, updates, status changes, releases, and auto-sync with faculty
 */
const { rooms, faculty, requests, activityLogs, saveData } = require('../config/db');
const events = require('../utils/events');

exports.getAllRooms = (req, res) => {
  const { building, floor, status, search } = req.query;
  let filtered = [...rooms];
  
  if (building && building !== 'all') {
    filtered = filtered.filter(r => r.building && r.building.toLowerCase().includes(building.toLowerCase()));
  }
  if (floor && floor !== 'all') {
    filtered = filtered.filter(r => String(r.floor) === String(floor));
  }
  if (status && status !== 'all') {
    filtered = filtered.filter(r => r.status && r.status.toLowerCase() === status.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(r => 
      (r.room && r.room.toLowerCase().includes(q)) ||
      (r.room_code && r.room_code.toLowerCase().includes(q)) ||
      (r.occupant && r.occupant.toLowerCase().includes(q)) ||
      (r.type && r.type.toLowerCase().includes(q)) ||
      (r.building && r.building.toLowerCase().includes(q))
    );
  }
  
  res.json({ success: true, count: filtered.length, total: rooms.length, data: filtered });
};

exports.getRoomById = (req, res) => {
  const { id } = req.params;
  const cleanId = String(id).toLowerCase();
  const room = rooms.find(r => 
    r.id.toLowerCase() === cleanId || 
    (r.room_code && r.room_code.toLowerCase() === cleanId)
  );
  
  if (!room) {
    return res.status(404).json({ success: false, message: 'Room not found' });
  }
  
  res.json({ success: true, data: room });
};

exports.updateRoom = (req, res) => {
  const { id } = req.params;
  const cleanId = String(id).toLowerCase();
  const roomIndex = rooms.findIndex(r => 
    r.id.toLowerCase() === cleanId || 
    (r.room_code && r.room_code.toLowerCase() === cleanId)
  );
  
  if (roomIndex === -1) {
    return res.status(404).json({ success: false, message: 'Room not found' });
  }

  rooms[roomIndex] = { ...rooms[roomIndex], ...req.body, id: rooms[roomIndex].id };
  saveData();

  const now = new Date();
  const logItem = {
    id: `LOG-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    title: `Room Updated: ${rooms[roomIndex].room}`,
    desc: `Room ${rooms[roomIndex].room} (${rooms[roomIndex].building}) set to ${rooms[roomIndex].status.toUpperCase()}`,
    text: `Room ${rooms[roomIndex].room} (${rooms[roomIndex].building}) set to ${rooms[roomIndex].status.toUpperCase()}`,
    icon: rooms[roomIndex].status === 'vacant' ? 'green' : 'door',
    color: rooms[roomIndex].status === 'vacant' ? 'green' : 'amber',
    type: rooms[roomIndex].status === 'vacant' ? 'release' : 'booking',
    side: 'left',
    timestamp: now.getTime(),
    createdAt: now.toISOString()
  };
  activityLogs.unshift(logItem);

  events.broadcast('room_updated', rooms[roomIndex]);
  events.broadcast('new_log', logItem);

  res.json({ success: true, message: 'Room updated successfully', data: rooms[roomIndex] });
};

exports.checkoutRoom = (req, res) => {
  const { id } = req.params;
  const cleanId = String(id).toLowerCase().trim();
  
  // Find room by id, room_code, room name, or clean match
  let roomIndex = rooms.findIndex(r => 
    r.id.toLowerCase() === cleanId || 
    (r.room_code && r.room_code.toLowerCase() === cleanId) ||
    (r.room && r.room.toLowerCase() === cleanId)
  );

  if (roomIndex === -1) {
    roomIndex = rooms.findIndex(r => cleanId.includes(r.id.toLowerCase()) || (r.room && cleanId.includes(r.room.toLowerCase())));
  }

  if (roomIndex === -1) {
    return res.status(404).json({ success: false, message: 'Room not found for checkout' });
  }

  const targetRoom = rooms[roomIndex];
  const prevOccupant = targetRoom.occupant;

  targetRoom.status = 'vacant';
  targetRoom.occupant = 'None';
  targetRoom.schedule = '--';
  targetRoom.sessionStartTime = null;
  targetRoom.actualOccupiedMinutes = 0;
  targetRoom.declaredDuration = 0;
  targetRoom.lastUpdated = Date.now();

  // Reset faculty status if matched
  if (prevOccupant && prevOccupant !== 'None') {
    faculty.forEach(f => {
      if (prevOccupant.toLowerCase().includes(f.name.toLowerCase())) {
        f.status = 'available';
        f.room = 'None';
      }
    });
  }

  // Find any active/approved requests associated with this room and complete them
  let updatedReq = null;
  requests.forEach(r => {
    const isMatchingRoom = r.room && (
      r.room.toLowerCase().includes(targetRoom.room.toLowerCase()) || 
      (targetRoom.room_code && r.room.toLowerCase().includes(targetRoom.room_code.toLowerCase())) ||
      r.room.toLowerCase().includes(targetRoom.id.toLowerCase())
    );
    if (isMatchingRoom && r.status === 'approved') {
      r.status = 'completed';
      updatedReq = r;
    }
  });

  saveData();

  const now = new Date();
  const occupantLabel = prevOccupant && prevOccupant !== 'None' ? prevOccupant : 'Faculty member';
  const logItem = {
    id: `LOG-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    title: `Room Checked Out: ${targetRoom.room_code || targetRoom.room}`,
    desc: `${occupantLabel} checked out of ${targetRoom.room} (${targetRoom.building}). Facility returned to Vacant pool.`,
    text: `${occupantLabel} checked out of ${targetRoom.room}`,
    icon: 'release',
    color: 'teal',
    type: 'release',
    side: 'left',
    timestamp: now.getTime(),
    createdAt: now.toISOString()
  };
  activityLogs.unshift(logItem);

  events.broadcast('room_updated', targetRoom);
  if (updatedReq) {
    events.broadcast('request_status_updated', updatedReq);
  }
  events.broadcast('new_log', logItem);

  res.json({
    success: true,
    message: `Successfully checked out of ${targetRoom.room_code || targetRoom.room}`,
    data: targetRoom,
    completedRequest: updatedReq
  });
};

exports.releaseRoom = exports.checkoutRoom;

exports.updateRoomStatus = (req, res) => {
  const { id } = req.params;
  const { status, occupant, schedule } = req.body;
  const cleanId = String(id).toLowerCase();
  const roomIndex = rooms.findIndex(r => 
    r.id.toLowerCase() === cleanId || 
    (r.room_code && r.room_code.toLowerCase() === cleanId)
  );
  
  if (roomIndex === -1) {
    return res.status(404).json({ success: false, message: 'Room not found' });
  }

  const validStatuses = ['vacant', 'occupied', 'maintenance'];
  if (status && !validStatuses.includes(status.toLowerCase())) {
    return res.status(400).json({ success: false, message: `Invalid status: ${status}` });
  }

  const prev = rooms[roomIndex];
  if (status) prev.status = status.toLowerCase();
  if (occupant !== undefined) prev.occupant = occupant;
  if (schedule !== undefined) prev.schedule = schedule;

  if (prev.status === 'vacant') {
    prev.occupant = 'None';
    prev.schedule = '--';
    prev.sessionStartTime = null;
    prev.actualOccupiedMinutes = 0;
  }

  saveData();

  const now = new Date();
  const logItem = {
    id: `LOG-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    title: `Room Status Changed: ${prev.room}`,
    desc: `Room ${prev.room} status changed to ${prev.status.toUpperCase()}`,
    text: `Room ${prev.room} status changed to ${prev.status.toUpperCase()}`,
    icon: prev.status === 'vacant' ? 'green' : prev.status === 'occupied' ? 'door' : 'tools',
    color: prev.status === 'vacant' ? 'green' : prev.status === 'occupied' ? 'amber' : 'red',
    type: prev.status === 'maintenance' ? 'maintenance' : prev.status === 'vacant' ? 'release' : 'booking',
    side: 'right',
    timestamp: now.getTime(),
    createdAt: now.toISOString()
  };
  activityLogs.unshift(logItem);

  events.broadcast('room_updated', prev);
  events.broadcast('new_log', logItem);

  res.json({ success: true, message: 'Room status updated', data: prev });
};
