const express = require('express');
const router = express.Router();
const { HeaderService } = require('../services');
const { DiagnosticsController } = require('../controllers');

router.post('/booking/diagnostics', [
  HeaderService.validateApiAuthorization,
  DiagnosticsController.bookDiagnostics,
]);

module.exports = router;
