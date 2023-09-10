const mongoose = require('mongoose');
const moment = require('moment');
const bcrypt = require('bcrypt');
const Base = require('./base');
const { AuthDao, AdminDao } = require('../dao');
const logger = require('../common/logger')('auth-bao');
const { ERROR_CODES, ERROR_MESSAGES } = require('../common/error.constants');
const { STATUS_CODES } = require('../common/constants');
const error = new Error();
const istTimestamp = moment.utc().add(5, 'hours').add(30, 'minutes').toDate();
const fs = require('fs');
const db = require('../db');
const csv = require('csv-parser');

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
        roleId: params.roleId,
      };

      let roleDetails = await AdminDao.findAdminUserRoles(whereObj, session);
      if (!roleDetails.length) {
        error.message = ERROR_MESSAGES.ERROR_MESSAGE_ROLE_NOT_FOUND;
        error.code = ERROR_CODES.ERROR_CODE_404;
        throw error;
      }

      whereObj = {
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
        roleId: params.roleId,
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

      insertObj = {
        userId: pharmacyUserData[0]._id,
        isActive: true,
      };
      await AuthDao.createCartDetails(insertObj, session);

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
      let cartDetails = await AuthDao.findCartDetails(whereObj, session);

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
        userId: pharmacyUserData[0]._id,
        cartId: cartDetails[0]._id,
        pharmacyName: pharmacyUserData[0].pharmacyName,
        pharmacyPhone: pharmacyUserData[0].pharmacyPhone,
        pharmacyAddress: pharmacyUserData[0].pharmacyAddress,
        pharmacyPincode: pharmacyUserData[0].pharmacyPincode,
        roleId: pharmacyUserData[0].roleId,
        isActive: pharmacyUserData[0].isActive,
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

module.exports = AuthBao;

// code to insert data into db
// const csvFilePath = '/Users/yash/Downloads/nc.csv';
// console.log(process.cwd());
// fs.createReadStream(csvFilePath)
//   .pipe(csv())
//   .on('data', async (row) => {
//     try {
//       let insertObj = {
//         city: row.City,
//         labName: row['Name of Lab'],
//         labAddress: row['Address of Lab'],
//         pincode: 111111,
//         pointOfContact: row['Point of Contact'],
//         phoneNumber: row['Phone Number'],
//         labTimings: row['Lab Timings'],
//         isActive: 1,

//       };
//       let txn = await db.sequelize.transaction();
//       let d = await AuthDao.insertLabs(insertObj, txn);
//       await txn.commit();
//       console.log(d);
//     } catch (error) {
//       console.error('Error during data insertion:', error);
//     }
//   })
//   .on('end', () => {
//     console.log('Data insertion complete.');
//   });
