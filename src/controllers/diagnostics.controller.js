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
      address: Joi.array().required(),
      mobileNumber: Joi.number().required(),
      pincode: Joi.number().required(),
      timeSlot: Joi.string(),
      dateLabel: Joi.string(),
      collectionDate: Joi.string(),
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

module.exports.getDiagnosticBookings = async (req, res) => {
  try {
    logger.info('inside getDiagnosticBookings controller');
    const schemaVerifyData = Joi.object().keys({
      userId: Joi.string().required(),
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
    });
    const params = await validateSchema(req.query, schemaVerifyData);
    const { limit = 10, page = 1 } = req.query;
    const diagnosticsBao = new DiagnosticsBao();
    const result = await diagnosticsBao.getDiagnosticBookings(
      params,
      limit,
      page
    );
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.getDiagnosticBookingDetails = async (req, res) => {
  try {
    logger.info('inside getDiagnosticBookingDetails controller');
    const { userId, bookingId } = req.params;
    const verifyData = Joi.object({
      userId: Joi.string().required(),
      bookingId: Joi.string().required(),
    });
    const params = await validateSchema({ userId, bookingId }, verifyData);
    const diagnosticsBao = new DiagnosticsBao();
    const result = await diagnosticsBao.getDiagnosticBookingDetails(params);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.getPatientDetails = async (req, res) => {
  try {
    logger.info('inside getPatientDetails controller');
    const { mobileNumber } = req.params;
    const verifyData = Joi.object({
      mobileNumber: Joi.number().required(),
    });
    const params = await validateSchema({ mobileNumber }, verifyData);
    const diagnosticsBao = new DiagnosticsBao();
    const result = await diagnosticsBao.getPatientDetails(params);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.getPartnerDiagnosticBookings = async (req, res) => {
  try {
    logger.info('inside getPartnerDiagnosticBookings controller');
    const schemaVerifyData = Joi.object().keys({
      userId: Joi.string().required(),
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
    });
    const params = await validateSchema(req.query, schemaVerifyData);
    const { limit = 10, page = 1 } = req.query;
    const diagnosticsBao = new DiagnosticsBao();
    const result = await diagnosticsBao.getPartnerDiagnosticBookings(
      params,
      limit,
      page
    );
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
