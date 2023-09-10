const Joi = require('joi');
const { _200, _error } = require('../common/httpHelper');
const { validateSchema } = require('../common/validator');
const logger = require('../common/logger')('auth-controller');
const { AuthBao } = require('../bao');

module.exports.pharmacyUserSignUp = async (req, res) => {
  try {
    logger.info('inside pharmacyUserSignUp controller');
    const schemaVerifyData = Joi.object().keys({
      pharmacyName: Joi.string().required(),
      pharmacyPhone: Joi.number().required(),
      pharmacyAddress: Joi.string().required(),
      pharmacyPincode: Joi.number().required(),
      roleId: Joi.number().required(),
    });
    const params = await validateSchema(req.body, schemaVerifyData);
    const authBao = new AuthBao();
    const result = await authBao.pharmacyUserSignUp(params);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.pharmacyUserLogin = async (req, res) => {
  try {
    logger.info('inside pharmacyUserLogin controller');
    const schemaVerifyData = Joi.object().keys({
      mobileNumber: Joi.number().required(),
      password: Joi.string().required(),
    });
    const params = await validateSchema(req.body, schemaVerifyData);
    const authBao = new AuthBao();
    const result = await authBao.pharmacyUserLogin(params);
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
