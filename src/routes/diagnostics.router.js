const express = require('express');
const router = express.Router();
const { HeaderService } = require('../services');
const { DiagnosticsController } = require('../controllers');

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

module.exports = router;
