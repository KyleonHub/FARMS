/**
 * FARMS - System Activity Logs Controller
 * Handles query, filtering, creation, and clearing of system audit logs
 */
const { activityLogs, saveData } = require('../config/db');
const events = require('../utils/events');

exports.getAllLogs = (req, res) => {
  const { type, limit } = req.query;
  let list = [...activityLogs];

  // Ensure every log has id, timestamp, and createdAt
  list = list.map((log, idx) => {
    const timestamp = log.timestamp || (log.createdAt ? new Date(log.createdAt).getTime() : Date.now() - (idx * 600000));
    return {
      id: log.id || `LOG-${timestamp}-${idx}`,
      title: log.title || log.text || 'System Activity Event',
      desc: log.desc || log.text || 'Operational activity logged.',
      type: log.type || 'system',
      icon: log.icon || 'system',
      color: log.color || (log.type === 'booking' ? 'green' : log.type === 'request' ? 'amber' : log.type === 'release' ? 'teal' : log.type === 'maintenance' ? 'red' : 'purple'),
      side: log.side || 'left',
      timestamp: typeof timestamp === 'number' ? timestamp : new Date(timestamp).getTime(),
      createdAt: log.createdAt || new Date(timestamp).toISOString()
    };
  });

  if (type && type !== 'all') {
    list = list.filter(l => l.type === type);
  }

  // Sort newest first
  list.sort((a, b) => b.timestamp - a.timestamp);

  const max = limit ? parseInt(limit, 10) : 100;
  const result = list.slice(0, max);

  res.json({
    success: true,
    count: result.length,
    total: activityLogs.length,
    data: result
  });
};

exports.createLog = (req, res) => {
  const { title, desc, type, icon, color, side } = req.body;
  const now = new Date();
  const timestamp = now.getTime();

  const newLog = {
    id: req.body.id || `LOG-${timestamp}`,
    title: title || 'System Audit Event',
    desc: desc || title || 'System event recorded.',
    type: type || 'system',
    icon: icon || type || 'system',
    color: color || (type === 'booking' ? 'green' : type === 'request' ? 'amber' : type === 'release' ? 'teal' : type === 'maintenance' ? 'red' : 'purple'),
    side: side || 'left',
    timestamp,
    createdAt: now.toISOString()
  };

  activityLogs.unshift(newLog);
  saveData();

  events.broadcast('new_log', newLog);

  res.status(201).json({ success: true, message: 'Log created successfully', data: newLog });
};

exports.clearAllLogs = (req, res) => {
  activityLogs.splice(0, activityLogs.length);
  saveData();
  events.broadcast('logs_cleared', { timestamp: Date.now() });
  res.json({ success: true, message: 'All activity logs cleared successfully' });
};
