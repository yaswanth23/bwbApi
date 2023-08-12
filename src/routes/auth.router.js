const express = require('express');
const router = express.Router();
const { HeaderService } = require('../services');
const { AuthController } = require('../controllers');

router.post('/pharmacy/user/sign_up', [
  HeaderService.validateApiAuthorization,
  AuthController.pharmacyUserSignUp,
]);

module.exports = router;
