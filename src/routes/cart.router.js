const express = require('express');
const router = express.Router();
const { HeaderService } = require('../services');
const { CartController } = require('../controllers');

router.get('/cart/count', [
  HeaderService.validateApiAuthorization,
  CartController.getCartItemsCount,
]);

router.post('/cart/add/items', [
  HeaderService.validateApiAuthorization,
  CartController.addCartItems,
]);

router.get('/cart/get/items/:userId/:cartId', [
  HeaderService.validateApiAuthorization,
  CartController.getCartItems,
]);

module.exports = router;
