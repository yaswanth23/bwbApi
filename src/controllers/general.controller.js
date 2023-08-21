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

function _sendGenericError(res, e) {
  return _error(res, {
    message: e,
    type: 'generic',
  });
}
