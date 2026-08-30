/**
 * Faculty Directory Controller
 */
const { faculty } = require('../config/db');

exports.getAllFaculty = (req, res) => {
  res.json({ success: true, count: faculty.length, data: faculty });
};

exports.getFacultyById = (req, res) => {
  const { id } = req.params;
  const member = faculty.find(f => f.id === id);
  
  if (!member) {
    return res.status(404).json({ success: false, message: 'Faculty member not found' });
  }
  
  res.json({ success: true, data: member });
};
