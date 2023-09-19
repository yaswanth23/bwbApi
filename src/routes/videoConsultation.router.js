const express = require('express');
const router = express.Router();
const { HeaderService } = require('../services');
const { VideoConsultationController } = require('../controllers');

router.post('/video_call/schedules', [
  VideoConsultationController.captureMeetingSchedules,
]);

module.exports = router;
