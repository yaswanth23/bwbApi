const db = require('../db');
const { Op } = require('sequelize');
const { BookingDao, AdminDao } = require('../dao');
const logger = require('../common/logger')('booking-helper');

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

    txn = await db.sequelize.transaction();
    insertObj = {
      bookingId: bookingId,
      stateId: 4,
      createdBy: userId,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await BookingDao.insertBookingCaptureStates(insertObj, txn);
    await txn.commit();
    
    return status[0].stateName;
  } catch (error) {
    logger.error(error);
    await txn.rollback();
    throw error;
  }
};

module.exports.calculateBookingStates = async (userId, roleId, bookingId) => {
  let txn = await db.sequelize.transaction();
  logger.info(
    'inside calculateBookingStates helper',
    userId,
    roleId,
    bookingId
  );
  try {
    let whereObj = {
      userRoleIds: {
        [Op.overlap]: [roleId],
      },
    };
    let bookingStates = await BookingDao.findBookingStates(whereObj, txn);

    whereObj = {
      bookingId: bookingId,
      // createdBy: userId,
    };

    let bookingCaptureStates = await BookingDao.findBookingCaptureStates(
      whereObj,
      txn
    );

    let finalObject = bookingStates.map((val) => {
      let result = {};
      result.stateId = val.stateId;
      result.stateName = val.stateName;
      result.isActive = bookingCaptureStates.some(
        (item) => item.stateId === val.stateId
      );

      return result;
    });

    const state2Index = finalObject.find((state) => state.stateId === 2);
    const state3Index = finalObject.findIndex((state) => state.stateId === 3);

    if (
      state2Index &&
      state2Index.isActive &&
      state3Index &&
      !state3Index.isActive
    ) {
      finalObject = finalObject.filter(
        (state) => ![1, 3].includes(state.stateId)
      );
    }

    if (state3Index !== -1 && finalObject[state3Index].isActive) {
      finalObject = finalObject.filter(
        (state) => ![1, 2].includes(state.stateId)
      );
    }

    await txn.commit();
    return finalObject;
  } catch (error) {
    logger.error(error);
    await txn.rollback();
    throw error;
  }
};
