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

      whereObj = {
        mobileNumber: params.mobileNumber,
      };

      let patientDetails = await DiagnosticsDao.findPatientDetails(
        whereObj,
        session
      );

      if (patientDetails.length > 0) {
        updateObj = {
          patientDetails: params.patientDetails,
        };

        await DiagnosticsDao.updatePatientDetails(updateObj, whereObj, session);
      } else {
        let insertObj = {
          patientDetails: params.patientDetails,
          addressDetails: [],
          mobileNumber: params.mobileNumber,
          isActive: true,
        };

        await DiagnosticsDao.createPatientDetails(insertObj, session);
      }

      params.status = 'pending';
      let bookingData = await DiagnosticsDao.createDiagnosticBookings(
        params,
        session
      );

      await session.commitTransaction();
      session.endSession();
      return {
        successCode: STATUS_CODES.STATUS_CODE_200,
        successMessage: 'Booking confirmed!',
        bookingData: bookingData,
      };
    } catch (e) {
      logger.error(e);
      await session.abortTransaction();
      session.endSession();
      throw e;
    }
  }

  async getDiagnosticBookings(params, limit, page) {
    const session = await mongoose.startSession();
    try {
      logger.info('inside getDiagnosticBookings bao', params);
      session.startTransaction();

      let offset = (page - 1) * limit;
      let whereObj = {
        userId: params.userId,
      };

      let diagnosticBookings = await DiagnosticsDao.getDiagnosticBookings(
        whereObj,
        limit,
        offset,
        session
      );

      let totalBookingCount = await DiagnosticsDao.getDiagnosticBookingsCount(
        whereObj,
        session
      );

      let totalPages = totalBookingCount / limit;

      await session.commitTransaction();
      session.endSession();
      return {
        successCode: STATUS_CODES.STATUS_CODE_200,
        diagnosticBookings: diagnosticBookings,
        metaData: {
          totalBookingCount: totalBookingCount,
          totalPages: totalPages ? Math.ceil(totalPages) : 1,
        },
      };
    } catch (e) {
      logger.error(e);
      await session.abortTransaction();
      session.endSession();
      throw e;
    }
  }

  async getDiagnosticBookingDetails(params) {
    const session = await mongoose.startSession();
    try {
      logger.info('inside getDiagnosticBookingDetails bao', params);
      session.startTransaction();

      let whereObj = {
        _id: params.bookingId,
        userId: params.userId,
      };

      let bookingDetails = await DiagnosticsDao.findDiagnosticBookingDetails(
        whereObj,
        session
      );

      await session.commitTransaction();
      session.endSession();
      return {
        successCode: STATUS_CODES.STATUS_CODE_200,
        bookingDetails: bookingDetails,
      };
    } catch (e) {
      logger.error(e);
      await session.abortTransaction();
      session.endSession();
      throw e;
    }
  }

  async getPatientDetails(params) {
    const session = await mongoose.startSession();
    try {
      logger.info('inside getPatientDetails bao', params);
      session.startTransaction();

      let whereObj = {
        mobileNumber: params.mobileNumber,
      };

      let patientDetails = await DiagnosticsDao.findPatientDetails(
        whereObj,
        session
      );

      await session.commitTransaction();
      session.endSession();
      return {
        successCode: STATUS_CODES.STATUS_CODE_200,
        patientDetails: patientDetails,
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
