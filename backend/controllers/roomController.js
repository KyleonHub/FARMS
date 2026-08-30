/**
 * Room Management Controller
 */
const { rooms, activityLogs } = require('../config/db');

exports.getAllRooms = (req, res) => {
  const { building, status } = req.query;
  let filtered = rooms;
  
  if (building) {
    filtered = filtered.filter(r => r.building.toLowerCase() === building.toLowerCase());
  }
  if (status) {
    filtered = filtered.filter(r => r.status.toLowerCase() === status.toLowerCase());
  }
  
  res.json({ success: true, count: filtered.length, data: filtered });
};

exports.getRoomById = (req, res) => {
  const { id } = req.params;
  const room = rooms.find(r => r.id === id);
  
  if (!room) {
    return res.status(404).json({ success: false, message: 'Room not found' });
  }
  
  res.json({ success: true, data: room });
};

exports.updateRoom = (req, res) => {
  const { id } = req.params;
  const roomIndex = rooms.findIndex(r => r.id === id);
  
  if (roomIndex === -1) {
    return res.status(404).json({ success: false, message: 'Room not found' });
  }

  rooms[roomIndex] = { ...rooms[roomIndex], ...req.body };

  activityLogs.unshift({
    icon: rooms[roomIndex].status === 'vacant' ? '🟢' : '🚪',
    text: `Room ${rooms[roomIndex].room} (${rooms[roomIndex].building}) updated to ${rooms[roomIndex].status.toUpperCase()}`,
    time: 'Just now',
    type: 'assignment'
  });

  res.json({ success: true, message: 'Room updated successfully', data: rooms[roomIndex] });
};
