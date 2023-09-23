const Joi = require('joi');
const { _200, _error } = require('../common/httpHelper');
const { validateSchema } = require('../common/validator');
const logger = require('../common/logger')('videoConsultation-controller');
const { VideoConsultationBao } = require('../bao');

module.exports.captureMeetingSchedules = async (req, res) => {
  try {
    logger.info('inside captureMeetingSchedules controller');
    const videoConsultationBao = new VideoConsultationBao();
    const result = await videoConsultationBao.captureMeetingSchedules(req.body);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.getAllAppointments = async (req, res) => {
  try {
    logger.info('inside getAllAppointments controller');
    const schemaVerifyData = Joi.object().keys({
      userId: Joi.string().required(),
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
    });
    const params = await validateSchema(req.query, schemaVerifyData);
    const { limit = 10, page = 1 } = req.query;
    const videoConsultationBao = new VideoConsultationBao();
    const result = await videoConsultationBao.getAllAppointments(
      params,
      limit,
      page
    );
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.updatePrescriptionDetails = async (req, res) => {
  try {
    logger.info('inside updatePrescriptionDetails controller');
    const schemaVerifyData = Joi.object().keys({
      appointmentId: Joi.string().required(),
      prescriptionDetails: Joi.array(),
    });
    const params = await validateSchema(req.body, schemaVerifyData);
    const videoConsultationBao = new VideoConsultationBao();
    const result = await videoConsultationBao.updatePrescriptionDetails(params);
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
