/**
 * Room Access & Booking Requests Controller
 */
const { requests, activityLogs } = require('../config/db');

exports.getAllRequests = (req, res) => {
  res.json({ success: true, count: requests.length, data: requests });
};

exports.createRequest = (req, res) => {
  const { requester, room, purpose, date } = req.body;
  
  if (!requester || !room) {
    return res.status(400).json({ success: false, message: 'Requester and Room are required' });
  }

  const newRequest = {
    id: `REQ-${Date.now().toString().slice(-4)}`,
    requester,
    room,
    purpose: purpose || 'Academic Activity',
    date: date || 'Today',
    status: 'pending'
  };

  requests.unshift(newRequest);
  
  activityLogs.unshift({
    icon: '📋',
    text: `New access request submitted for ${room} by ${requester}`,
    time: 'Just now',
    type: 'request'
  });

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

  activityLogs.unshift({
    icon: status === 'approved' ? '✅' : '❌',
    text: `Request ${id} for ${requests[reqIndex].room} marked as ${status.toUpperCase()}`,
    time: 'Just now',
    type: 'status'
  });

  res.json({ success: true, message: `Request ${status}`, data: requests[reqIndex] });
};

exports.getActivityLogs = (req, res) => {
  res.json({ success: true, data: activityLogs });
};
