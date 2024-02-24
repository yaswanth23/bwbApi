const Joi = require('joi');
const { _200, _error } = require('../common/httpHelper');
const { validateSchema } = require('../common/validator');
const logger = require('../common/logger')('lab-controller');
const { LabBao } = require('../bao');

module.exports.searchNearByLabs = async (req, res) => {
  try {
    logger.info('inside searchNearByLabs');
    const { pincode } = req.params;
    const verifyData = Joi.object({
      pincode: Joi.number().required(),
    });
    const params = await validateSchema({ pincode }, verifyData);
    const labBao = new LabBao();
    const result = await labBao.searchNearByLabs(params);
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
