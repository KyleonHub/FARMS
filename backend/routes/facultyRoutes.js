const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');

router.get('/', facultyController.getAllFaculty);
router.get('/:id', facultyController.getFacultyById);

module.exports = router;
