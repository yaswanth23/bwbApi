const express = require('express');
const router = express.Router();
const { HeaderService } = require('../services');
const { GeneralController } = require('../controllers');

router.get('/get/pincodes', [
  HeaderService.validateApiAuthorization,
  GeneralController.getServiceablePincodes,
]);

router.get('/search/:pincode', [
  HeaderService.validateApiAuthorization,
  GeneralController.searchPincodes,
]);

router.get('/get/diagnostics', [
  HeaderService.validateApiAuthorization,
  GeneralController.getDiagnosticTests,
]);

router.get('/search/diagnostics/:diagnosticTest', [
  HeaderService.validateApiAuthorization,
  GeneralController.searchDiagnosticTest,
]);

router.get('/diagnostics/details/:testId', [
  HeaderService.validateApiAuthorization,
  GeneralController.getDiagnosticTestDetails,
]);

module.exports = router;
