const Joi = require('joi');
const { _200, _error } = require('../common/httpHelper');
const { validateSchema } = require('../common/validator');
const logger = require('../common/logger')('general-controller');
const { GeneralBao } = require('../bao');

module.exports.getServiceablePincodes = async (req, res) => {
  try {
    logger.info('inside getServiceablePincodes controller');
    const schemaVerifyData = Joi.object().keys({
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
    });
    await validateSchema(req.query, schemaVerifyData);
    const { limit = 10, page = 1 } = req.query;
    const generalBao = new GeneralBao();
    const result = await generalBao.getServiceablePincodes(Number(limit), page);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.searchPincodes = async (req, res) => {
  try {
    logger.info('inside searchPincodes');
    const { pincode } = req.params;
    const verifyData = Joi.object({
      pincode: Joi.number().required(),
    });
    const params = await validateSchema({ pincode }, verifyData);
    const generalBao = new GeneralBao();
    const result = await generalBao.searchPincodes(params);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.getDiagnosticTests = async (req, res) => {
  try {
    logger.info('inside getDiagnosticTests controller');
    const schemaVerifyData = Joi.object().keys({
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
    });
    await validateSchema(req.query, schemaVerifyData);
    const { limit = 10, page = 1 } = req.query;
    const generalBao = new GeneralBao();
    const result = await generalBao.getDiagnosticTests(Number(limit), page);
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
