const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');

// Department breakdown and analytics (must precede /:id)
router.get('/departments', facultyController.getDepartments);

// Faculty directory listing with search, filtering, and sorting
router.get('/', facultyController.getAllFaculty);

// Register a new faculty member
router.post('/', facultyController.createFaculty);

// Retrieve single faculty member by ID or institutional number
router.get('/:id', facultyController.getFacultyById);

// Full profile update
router.put('/:id', facultyController.updateFaculty);

// Fast status change with room auto-synchronization
router.patch('/:id/status', facultyController.patchFacultyStatus);

// Delete faculty record and release rooms
router.delete('/:id', facultyController.deleteFaculty);

// Weekly class schedule timetable
router.get('/:id/schedule', facultyController.getFacultySchedule);
router.put('/:id/schedule', facultyController.updateFacultySchedule);

module.exports = router;
