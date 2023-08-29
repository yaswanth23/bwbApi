const Joi = require('joi');
const { _200, _error } = require('../common/httpHelper');
const { validateSchema } = require('../common/validator');
const logger = require('../common/logger')('diagnostics-controller');
const { DiagnosticsBao } = require('../bao');

module.exports.bookDiagnostics = async (req, res) => {
  try {
    logger.info('inside bookDiagnostics controller');
    const schemaVerifyData = Joi.object().keys({
      userId: Joi.string().required(),
      cartId: Joi.string().required(),
      cartItems: Joi.array().required(),
      patientDetails: Joi.array().required(),
      address: Joi.string().required(),
      mobileNumber: Joi.number().required(),
      pincode: Joi.number().required(),
      totalPrice: Joi.number().required(),
    });
    const params = await validateSchema(req.body, schemaVerifyData);
    const diagnosticsBao = new DiagnosticsBao();
    const result = await diagnosticsBao.bookDiagnostics(params);
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
