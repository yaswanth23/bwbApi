const mongoose = require('mongoose');
const Base = require('./base');
const { AuthDao, AdminDao } = require('../dao');
const logger = require('../common/logger')('videoConsultation-bao');
const { ERROR_CODES, ERROR_MESSAGES } = require('../common/error.constants');
const { STATUS_CODES, APPLICATION } = require('../common/constants');
const error = new Error();

class VideoConsultationBao extends Base {
  constructor() {
    super();
  }

  async captureMeetingSchedules(params) {
    const session = await mongoose.startSession();
    try {
      logger.info('inside captureMeetingSchedules bao');
      session.startTransaction();

      if (params.event === APPLICATION.CALENDLY_INVITEE_CREATED) {
      } else if (params.event === APPLICATION.CALENDLY_INVITEE_CANCELED) {
      }

      await session.commitTransaction();
      session.endSession();
      return 'success';
    } catch (e) {
      logger.error(e);
      await session.abortTransaction();
      session.endSession();
      throw e;
    }
  }
}

module.exports = VideoConsultationBao;
