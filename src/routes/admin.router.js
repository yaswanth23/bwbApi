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

router.post('/doctor/user/sign_up', [
  HeaderService.validateApiAuthorization,
  AdminController.doctorUserSignUp,
]);

router.get('/doctor/users/list', [
  HeaderService.validateApiAuthorization,
  AdminController.getDoctorsList,
]);

router.get('/admin/users/count', [
  HeaderService.validateApiAuthorization,
  AdminController.getTotalUsersCount,
]);

module.exports = router;
