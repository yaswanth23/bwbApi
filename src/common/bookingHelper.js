const db = require('../db');
const { BookingDao } = require('../dao');
const logger = require('../common/logger')('booking-helper');
const { ERROR_CODES, ERROR_MESSAGES } = require('../common/error.constants');
const error = new Error();

module.exports.insertBookingCapture = async (userId, bookingId, stateId) => {
  let txn = await db.sequelize.transaction();
  logger.info('inside insertBookingCapture helper', userId, bookingId, stateId);
  try {
    let insertObj = {
      bookingId: bookingId,
      stateId: stateId,
      createdBy: userId,
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await BookingDao.insertBookingCaptureStates(insertObj, txn);
    await txn.commit();

    //once the payment flow is integrated we need to update this flow to check if payment is done or not
    txn = await db.sequelize.transaction();
    insertObj = {
      bookingId: bookingId,
      stateId: 3,
      createdBy: userId,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    let bookingState = await BookingDao.insertBookingCaptureStates(
      insertObj,
      txn
    );

    let whereObj = {
      stateId: bookingState.stateId,
    };

    let status = await BookingDao.findBookingStates(whereObj, txn);

    await txn.commit();
    return status[0].stateName;
  } catch (error) {
    logger.error(error);
    await txn.rollback();
    throw error;
  }
};
