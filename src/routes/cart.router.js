const express = require('express');
const router = express.Router();
const { HeaderService } = require('../services');
const { CartController } = require('../controllers');

router.get('/cart/count', [
  HeaderService.validateApiAuthorization,
  CartController.getCartItemsCount,
]);

module.exports = router;
