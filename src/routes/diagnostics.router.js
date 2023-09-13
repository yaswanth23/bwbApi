const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { HeaderService } = require('../services');
const { DiagnosticsController } = require('../controllers');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    const uuid = uuidv4();
    const originalExtension = file.originalname.split('.').pop();
    const filename = `${uuid}.${originalExtension}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

router.post('/booking/diagnostics', [
  HeaderService.validateApiAuthorization,
  DiagnosticsController.bookDiagnostics,
]);

router.get('/get/diagnostics/bookings', [
  HeaderService.validateApiAuthorization,
  DiagnosticsController.getDiagnosticBookings,
]);

router.get('/details/diagnostics/bookings/:userId/:bookingId', [
  HeaderService.validateApiAuthorization,
  DiagnosticsController.getDiagnosticBookingDetails,
]);

router.get('/patient/details/:mobileNumber', [
  HeaderService.validateApiAuthorization,
  DiagnosticsController.getPatientDetails,
]);

router.get('/get/partner/diagnostics/bookings', [
  HeaderService.validateApiAuthorization,
  DiagnosticsController.getPartnerDiagnosticBookings,
]);

router.post('/update/booking/status', [
  HeaderService.validateApiAuthorization,
  DiagnosticsController.updateBookingStatus,
]);

router.post('/upload/reports', [
  upload.array('files', 50),
  DiagnosticsController.uploadReports,
]);

router.post('/submit/reports', [
  HeaderService.validateApiAuthorization,
  DiagnosticsController.submitReports,
]);

module.exports = router;
