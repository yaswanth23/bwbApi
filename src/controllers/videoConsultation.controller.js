const Joi = require('joi');
const { _200, _error } = require('../common/httpHelper');
const { validateSchema } = require('../common/validator');
const logger = require('../common/logger')('videoConsultation-controller');
const { VideoConsultationBao } = require('../bao');

module.exports.captureMeetingSchedules = async (req, res) => {
  try {
    logger.info('inside captureMeetingSchedules controller');
    console.log('----> req.body', req.body);
    console.log(
      '----> req.body.questions_and_answers',
      req.body.payload.questions_and_answers
    );
    console.log(
      '----> req.body.scheduled_event',
      req.body.payload.scheduled_event
    );
    
    const videoConsultationBao = new VideoConsultationBao();
    const result = await videoConsultationBao.captureMeetingSchedules(req.body);
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
