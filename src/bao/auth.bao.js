const mongoose = require('mongoose');
const moment = require('moment');
const Base = require('./base');
const { AuthDao } = require('../dao');
const logger = require('../common/logger')('auth-bao');
const { ERROR_CODES, ERROR_MESSAGES } = require('../common/error.constants');
const error = new Error();
const istTimestamp = moment.utc().add(5, 'hours').add(30, 'minutes').toDate();

class AuthBao extends Base {
  constructor() {
    super();
  }

  async pharmacyUserSignUp(params) {
    const session = await mongoose.startSession();
    try {
      logger.info('inside pharmacyUserSignUp bao', params);
      session.startTransaction();
      let whereObj = {
        pharmacyPhone: params.pharmacyPhone,
      };
      let pharmacyUserData = await AuthDao.findPharmacyUser(whereObj, session);
      if (pharmacyUserData.length > 0) {
        error.message = ERROR_MESSAGES.ERROR_MESSAGE_USER_ALREADY_EXISTS;
        error.code = ERROR_CODES.ERROR_CODE_409;
        throw error;
      }

      let insertObj = {
        pharmacyName: params.pharmacyName,
        pharmacyPhone: params.pharmacyPhone,
        pharmacyAddress: params.pharmacyAddress,
        pharmacyPincode: params.pharmacyPincode,
      };
      await AuthDao.createPharmacyUser(insertObj, session);
      await session.commitTransaction();
      session.endSession();
      return params;
    } catch (e) {
      logger.error(e);
      await session.abortTransaction();
      session.endSession();
      throw e;
    }
  }
}

module.exports = AuthBao;
