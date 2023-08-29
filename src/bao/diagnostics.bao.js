const mongoose = require('mongoose');
const moment = require('moment');
const Base = require('./base');
const logger = require('../common/logger')('diagnostics-bao');
const { CartDao, DiagnosticsDao } = require('../dao');
const { ERROR_CODES, ERROR_MESSAGES } = require('../common/error.constants');
const { STATUS_CODES } = require('../common/constants');
const istTimestamp = moment.utc().add(5, 'hours').add(30, 'minutes').toDate();
const error = new Error();

class DiagnosticsBao extends Base {
  constructor() {
    super();
  }

  async bookDiagnostics(params) {
    const session = await mongoose.startSession();
    try {
      logger.info('inside bookDiagnostics bao', params);
      session.startTransaction();

      let whereObj = {
        _id: params.cartId,
        userId: params.userId,
      };

      let cartDetails = await CartDao.findCartDetails(whereObj, session);

      if (!cartDetails.length) {
        error.message = ERROR_MESSAGES.ERROR_MESSAGE_USER_NOT_FOUND;
        error.code = ERROR_CODES.ERROR_CODE_404;
        throw error;
      }

      let updateObj = {
        cartItems: [],
      };

      await CartDao.updateCartItems(updateObj, whereObj, session);

      await DiagnosticsDao.createDiagnosticBookings(params, session);

      await session.commitTransaction();
      session.endSession();
      return {
        successCode: STATUS_CODES.STATUS_CODE_200,
        successMessage: 'Booking confirmed!',
      };
    } catch (e) {
      logger.error(e);
      await session.abortTransaction();
      session.endSession();
      throw e;
    }
  }
}

module.exports = DiagnosticsBao;
