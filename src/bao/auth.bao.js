const mongoose = require('mongoose');
const moment = require('moment');
const bcrypt = require('bcrypt');
const Base = require('./base');
const { AuthDao } = require('../dao');
const logger = require('../common/logger')('auth-bao');
const { ERROR_CODES, ERROR_MESSAGES } = require('../common/error.constants');
const { STATUS_CODES } = require('../common/constants');
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
      pharmacyUserData = await AuthDao.createPharmacyUser(insertObj, session);

      const saltKey = generateSalt();
      const hashedKey = hashPasswordWithSalt(
        params.pharmacyPhone.toString(),
        saltKey
      );

      insertObj = {
        userId: pharmacyUserData[0]._id,
        saltKey: saltKey,
        hashedKey: hashedKey,
      };
      await AuthDao.createUserAuthPass(insertObj, session);

      await session.commitTransaction();
      session.endSession();
      return {
        successCode: STATUS_CODES.STATUS_CODE_200,
        successMessage: 'User created successfully!',
      };
    } catch (e) {
      logger.error(e);
      await session.abortTransaction();
      session.endSession();
      throw e;
    }
  }

  async pharmacyUserLogin(params) {
    const session = await mongoose.startSession();
    try {
      logger.info('inside pharmacyUserLogin bao');
      session.startTransaction();
      let whereObj = {
        pharmacyPhone: params.mobileNumber,
      };
      let pharmacyUserData = await AuthDao.findPharmacyUser(whereObj, session);
      if (!pharmacyUserData.length) {
        error.message = ERROR_MESSAGES.ERROR_MESSAGE_USER_NOT_FOUND;
        error.code = ERROR_CODES.ERROR_CODE_404;
        throw error;
      }
      whereObj = {
        userId: pharmacyUserData[0]._id,
      };
      let userAuthData = await AuthDao.findUserAuthPass(whereObj, session);
      console.log(userAuthData);

      let isMatchFound = verifyPasswordWithSalt(
        params.password,
        userAuthData[0].hashedKey,
        userAuthData[0].saltKey
      );

      if (!isMatchFound) {
        error.message = ERROR_MESSAGES.ERROR_MESSAGE_INVALID_PASSWORD;
        error.code = ERROR_CODES.ERROR_CODE_401;
        throw error;
      }

      await session.commitTransaction();
      session.endSession();
      return pharmacyUserData[0];
    } catch (e) {
      logger.error(e);
      await session.abortTransaction();
      session.endSession();
      throw e;
    }
  }
}

function generateSalt() {
  const saltRounds = 10;
  return bcrypt.genSaltSync(saltRounds);
}

function hashPasswordWithSalt(plainPassword, salt) {
  const hashedPassword = bcrypt.hashSync(plainPassword, salt);
  return hashedPassword;
}

function verifyPasswordWithSalt(plainPassword, hashedKey, salt) {
  const hashedPasswordWithSalt = hashPasswordWithSalt(plainPassword, salt);
  return hashedPasswordWithSalt === hashedKey;
}

module.exports = AuthBao;
