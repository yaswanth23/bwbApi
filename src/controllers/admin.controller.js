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

module.exports.doctorUserSignUp = async (req, res) => {
  try {
    logger.info('inside doctorUserSignUp controller');
    const schemaVerifyData = Joi.object().keys({
      userName: Joi.string().required(),
      mobileNumber: Joi.number().required(),
      emailId: Joi.string().required(),
      age: Joi.number().required(),
      gender: Joi.string().required(),
      specialty: Joi.string().required(),
      yearsOfPractice: Joi.number().required(),
      hospitalAffiliation: Joi.string().required(),
      clinicAffiliation: Joi.string().allow(null),
      roleId: Joi.number().required(),
    });
    const params = await validateSchema(req.body, schemaVerifyData);
    const adminBao = new AdminBao();
    const result = await adminBao.doctorUserSignUp(params);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.getDoctorsList = async (req, res) => {
  try {
    logger.info('inside getDoctorsList controller');
    const schemaVerifyData = Joi.object().keys({
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
    });
    const params = await validateSchema(req.query, schemaVerifyData);
    const { limit = 10, page = 1 } = req.query;
    const adminBao = new AdminBao();
    const result = await adminBao.getDoctorsList(params, limit, page);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.getTotalUsersCount = async (req, res) => {
  try {
    logger.info('inside getTotalUsersCount controller');
    const adminBao = new AdminBao();
    const result = await adminBao.getTotalUsersCount();
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.getUsersList = async (req, res) => {
  try {
    logger.info('inside getUsersList controller');
    const schemaVerifyData = Joi.object().keys({
      userType: Joi.string().valid('doctor', 'partner', 'pharmacy').required(),
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
    });
    const params = await validateSchema(req.query, schemaVerifyData);
    const { limit = 10, page = 1 } = req.query;
    const adminBao = new AdminBao();
    const result = await adminBao.getUsersList(params, limit, page);
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
