const mongoose = require('mongoose');
const Base = require('./base');
const logger = require('../common/logger')('diagnostics-bao');
const { CartDao, DiagnosticsDao, AdminDao, AuthDao } = require('../dao');
const { ERROR_CODES, ERROR_MESSAGES } = require('../common/error.constants');
const { STATUS_CODES } = require('../common/constants');
const BookingHelper = require('../common/bookingHelper');
const { FileService } = require('../services');
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

      let bookingStatus = await BookingHelper.insertBookingCapture(
        params.userId,
        bookingData[0]._id.toString(),
        1
      );

      bookingData[0].status = bookingStatus;

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
        _id: params.userId,
      };

      let userDetails = await AuthDao.findPharmacyUser(whereObj, session);
      if (!userDetails.length) {
        userDetails = await AdminDao.findAdminUserDetails(whereObj, session);
        if (!userDetails.length) {
          error.message = ERROR_MESSAGES.ERROR_MESSAGE_USER_NOT_FOUND;
          error.code = ERROR_CODES.ERROR_CODE_404;
          throw error;
        } else {
          whereObj = {
            _id: params.bookingId,
          };
        }
      } else {
        whereObj = {
          _id: params.bookingId,
          userId: params.userId,
        };
      }

      let bookingDetails = await DiagnosticsDao.findDiagnosticBookingDetails(
        whereObj,
        session
      );

      let bookingStates = await BookingHelper.calculateBookingStates(
        params.userId,
        userDetails[0].roleId,
        params.bookingId
      );

      bookingDetails[0].bookingStates = bookingStates;

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
        patientInfo: patientDetails.length > 0 ? patientDetails[0] : [],
      };
    } catch (e) {
      logger.error(e);
      await session.abortTransaction();
      session.endSession();
      throw e;
    }
  }

  async getPartnerDiagnosticBookings(params, limit, page) {
    const session = await mongoose.startSession();
    try {
      logger.info('inside getPartnerDiagnosticBookings bao', params);
      session.startTransaction();

      let offset = (page - 1) * limit;
      let whereObj = {
        _id: params.userId,
      };

      let adminUserDetails = await AdminDao.findAdminUserDetails(
        whereObj,
        session
      );

      if (!adminUserDetails.length) {
        error.message = ERROR_MESSAGES.ERROR_MESSAGE_USER_NOT_FOUND;
        error.code = ERROR_CODES.ERROR_CODE_404;
        throw error;
      }
      whereObj = {};
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

  async updateBookingStatus(params) {
    try {
      logger.info('inside updateBookingStatus bao', params);
      await BookingHelper.updateBookingStates(params);
      return {
        successCode: STATUS_CODES.STATUS_CODE_200,
        successMessage: 'data updated successfully',
      };
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async uploadReports(files) {
    try {
      logger.info('inside uploadReports bao');
      const bucketName = 'bwb-patient-records';
      const updatedMedia = await FileService.uploadFilesAndGetUrls(
        bucketName,
        files
      );
      return updatedMedia;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async submitReports(params) {
    const session = await mongoose.startSession();
    try {
      logger.info('inside submitReports bao', params);
      session.startTransaction();

      let whereObj = {
        _id: params.bookingId,
      };

      let bookingDetails = await DiagnosticsDao.findDiagnosticBookingDetails(
        whereObj,
        session
      );
      if (!bookingDetails.length) {
        error.message = ERROR_MESSAGES.ERROR_MESSAGE_BOOKING_ID_INVALID;
        error.code = ERROR_CODES.ERROR_CODE_404;
        throw error;
      }

      let updateObj = {
        reports: [...bookingDetails[0].reports, ...params.fileUrls],
      };

      await DiagnosticsDao.updateDiagnosticBookings(
        updateObj,
        whereObj,
        session
      );

      await session.commitTransaction();
      session.endSession();
      return {
        successCode: STATUS_CODES.STATUS_CODE_200,
        successMessage: 'files are submitted',
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
