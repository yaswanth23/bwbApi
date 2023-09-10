const mongoose = require('mongoose');
const moment = require('moment');
const bcrypt = require('bcrypt');
const Base = require('./base');
const { AdminDao, AuthDao } = require('../dao');
const logger = require('../common/logger')('admin-bao');
const { ERROR_CODES, ERROR_MESSAGES } = require('../common/error.constants');
const { STATUS_CODES } = require('../common/constants');
const error = new Error();
const istTimestamp = moment.utc().add(5, 'hours').add(30, 'minutes').toDate();

class AdminBao extends Base {
  constructor() {
    super();
  }

  async adminUserSignUp(params) {
    const session = await mongoose.startSession();
    try {
      logger.info('inside adminUserSignUp bao', params);
      session.startTransaction();

      let whereObj = {
        roleId: params.roleId,
      };

      let roleDetails = await AdminDao.findAdminUserRoles(whereObj, session);
      if (!roleDetails.length) {
        error.message = ERROR_MESSAGES.ERROR_MESSAGE_ROLE_NOT_FOUND;
        error.code = ERROR_CODES.ERROR_CODE_404;
        throw error;
      }

      whereObj = {
        mobileNumber: params.mobileNumber,
      };

      let adminUserDetails = await AdminDao.findAdminUserDetails(
        whereObj,
        session
      );
      if (adminUserDetails.length > 0) {
        error.message = ERROR_MESSAGES.ERROR_MESSAGE_USER_ALREADY_EXISTS;
        error.code = ERROR_CODES.ERROR_CODE_409;
        throw error;
      }

      let insertObj = {
        userName: params.userName,
        mobileNumber: params.mobileNumber,
        partnerName: params.partnerName,
        roleId: params.roleId,
        partnerId: params.partnerId,
        isActive: true,
        createdOn: istTimestamp,
        updatedOn: istTimestamp,
      };

      adminUserDetails = await AdminDao.createAdminUser(insertObj, session);

      const saltKey = generateSalt();
      const hashedKey = hashPasswordWithSalt(
        params.mobileNumber.toString(),
        saltKey
      );

      insertObj = {
        userId: adminUserDetails[0]._id,
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

  async adminUserLogin(params) {
    const session = await mongoose.startSession();
    try {
      logger.info('inside adminUserLogin bao');
      session.startTransaction();
      let whereObj = {
        mobileNumber: params.mobileNumber,
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

      whereObj = {
        userId: adminUserDetails[0]._id,
      };

      let userAuthData = await AuthDao.findUserAuthPass(whereObj, session);

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

      let response = {
        userId: adminUserDetails[0]._id,
        userName: adminUserDetails[0].userName,
        partnerName: adminUserDetails[0].partnerName,
        partnerId: adminUserDetails[0].partnerName,
        roleId: adminUserDetails[0].roleId,
        isActive: adminUserDetails[0].isActive,
      };

      await session.commitTransaction();
      session.endSession();
      return response;
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

module.exports = AdminBao;
