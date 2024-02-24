const db = require('../db');
const { QueryTypes, col, Op, literal } = require('sequelize');
const { BookingCaptureStates, BookingStates, BookingStateTransition } =
  db.BookingSchema;

module.exports.insertBookingCaptureStates = async (insertObj, txn) => {
  try {
    let data = await BookingCaptureStates.create(insertObj, {
      transaction: txn,
    });
    if (data) {
      data = data.get({ plain: true });
    }
    return data;
  } catch (e) {
    throw e;
  }
};

module.exports.findBookingCaptureStates = async (whereObj, txn) => {
  try {
    let data = await BookingCaptureStates.findAll({
      where: whereObj,
      raw: true,
      transaction: txn,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.updateBookingCaptureStates = async (
  updateObj,
  whereObj,
  txn
) => {
  try {
    let data = await BookingCaptureStates.update(
      updateObj,
      {
        where: whereObj,
      },
      { transaction: txn }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.findBookingStates = async (whereObj, txn) => {
  try {
    let data = await BookingStates.findAll({
      where: whereObj,
      raw: true,
      transaction: txn,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.findBookingStateTransition = async (whereObj, txn) => {
  try {
    let data = await BookingStateTransition.findAll({
      where: whereObj,
      raw: true,
      transaction: txn,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
