const Joi = require('joi');
const { _200, _error } = require('../common/httpHelper');
const { validateSchema } = require('../common/validator');
const logger = require('../common/logger')('cart-controller');
const { CartBao } = require('../bao');

module.exports.getCartItemsCount = async (req, res) => {
  try {
    logger.info('inside getCartItemsCount controller');
    const schemaVerifyData = Joi.object().keys({
      userId: Joi.string().required(),
      cartId: Joi.string().required(),
    });
    const params = await validateSchema(req.query, schemaVerifyData);
    const cartBao = new CartBao();
    const result = await cartBao.getCartItemsCount(params);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.addCartItems = async (req, res) => {
  try {
    logger.info('inside addCartItems controller');
    const schemaVerifyData = Joi.object().keys({
      userId: Joi.string().required(),
      cartId: Joi.string().required(),
      cartItems: Joi.array().required(),
    });
    const params = await validateSchema(req.body, schemaVerifyData);
    const cartBao = new CartBao();
    const result = await cartBao.addCartItems(params);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

function _sendGenericError(res, e) {
  return _error(res, {
    message: e,
    type: 'generic',
  });
}
