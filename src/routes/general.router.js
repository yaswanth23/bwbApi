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
])

module.exports = router;
