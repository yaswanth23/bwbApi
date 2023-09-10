const Joi = require('joi');
const { _200, _error } = require('../common/httpHelper');
const { validateSchema } = require('../common/validator');
const logger = require('../common/logger')('admin-controller');
const { AdminBao } = require('../bao');

module.exports.adminUserSignUp = async (req, res) => {
  try {
    logger.info('inside adminUserSignUp controller');
    const schemaVerifyData = Joi.object().keys({
      userName: Joi.string().required(),
      mobileNumber: Joi.number().required(),
      roleId: Joi.number().required(),
      partnerName: Joi.string().allow(null),
      partnerId: Joi.number().allow(null),
    });
    const params = await validateSchema(req.body, schemaVerifyData);
    const adminBao = new AdminBao();
    const result = await adminBao.adminUserSignUp(params);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.adminUserLogin = async (req, res) => {
  try {
    logger.info('inside adminUserLogin controller');
    const schemaVerifyData = Joi.object().keys({
      mobileNumber: Joi.number().required(),
      password: Joi.string().required(),
    });
    const params = await validateSchema(req.body, schemaVerifyData);
    const adminBao = new AdminBao();
    const result = await adminBao.adminUserLogin(params);
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
