const express = require('express');
const router = express.Router();
const { HeaderService } = require('../services');
const { AdminController } = require('../controllers');

router.post('/admin/user/sign_up', [
  HeaderService.validateApiAuthorization,
  AdminController.adminUserSignUp,
]);

router.post('/admin/user/login', [
  HeaderService.validateApiAuthorization,
  AdminController.adminUserLogin,
]);

module.exports = router;
