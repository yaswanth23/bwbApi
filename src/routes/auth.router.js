const express = require('express');
const router = express.Router();
const { HeaderService } = require('../services');
const { AuthController } = require('../controllers');

router.post('/pharmacy/user/sign_up', [
  HeaderService.validateApiAuthorization,
  AuthController.pharmacyUserSignUp,
]);

router.post('/pharmacy/user/login', [
  HeaderService.validateApiAuthorization,
  AuthController.pharmacyUserLogin,
]);

module.exports = router;
