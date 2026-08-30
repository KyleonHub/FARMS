const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

router.get('/', requestController.getAllRequests);
router.post('/', requestController.createRequest);
router.put('/:id/status', requestController.updateRequestStatus);
router.get('/logs', requestController.getActivityLogs);

module.exports = router;
