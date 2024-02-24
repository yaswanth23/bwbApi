const express = require('express');
const router = express.Router();
const { HeaderService } = require('../services');
const { VideoConsultationController } = require('../controllers');

router.post('/video_call/schedules', [
  VideoConsultationController.captureMeetingSchedules,
]);

router.get('/get/all_appointments', [
  HeaderService.validateApiAuthorization,
  VideoConsultationController.getAllAppointments,
]);

router.post('/update/prescription_details', [
  HeaderService.validateApiAuthorization,
  VideoConsultationController.updatePrescriptionDetails,
]);

router.get('/get/appointments/:appointmentId', [
  HeaderService.validateApiAuthorization,
  VideoConsultationController.getAppointmentDetails,
]);

module.exports = router;
