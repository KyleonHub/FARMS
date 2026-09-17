const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.put('/:id', roomController.updateRoom);
router.post('/:id/release', roomController.releaseRoom);
router.post('/:id/checkout', roomController.checkoutRoom);
router.patch('/:id/status', roomController.updateRoomStatus);

module.exports = router;
