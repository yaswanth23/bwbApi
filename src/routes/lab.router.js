const express = require('express');
const router = express.Router();
const { HeaderService } = require('../services');
const { LabController } = require('../controllers');

router.get('/search/nearBy/labs/:pincode', [
  HeaderService.validateApiAuthorization,
  LabController.searchNearByLabs,
]);

module.exports = router;
