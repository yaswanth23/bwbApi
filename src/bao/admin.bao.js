const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Base = require('./base');
const { AdminDao, AuthDao } = require('../dao');
const logger = require('../common/logger')('admin-bao');
const { ERROR_CODES, ERROR_MESSAGES } = require('../common/error.constants');
const { STATUS_CODES } = require('../common/constants');
const error = new Error();

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

      let roleDetails = await AdminDao.findUserRoles(whereObj, session);
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
        createdOn: new Date().toISOString(),
        updatedOn: new Date().toISOString(),
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

      let doctorUserDetails = [];
      let userId;
      if (!adminUserDetails.length) {
        doctorUserDetails = await AdminDao.findDoctorUserDetails(
          whereObj,
          session
        );
        if (!doctorUserDetails.length) {
          error.message = ERROR_MESSAGES.ERROR_MESSAGE_USER_NOT_FOUND;
          error.code = ERROR_CODES.ERROR_CODE_404;
          throw error;
        } else {
          userId = doctorUserDetails[0]._id;
        }
      } else {
        userId = adminUserDetails[0]._id;
      }

      whereObj = {
        userId: userId,
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

      let response;
      if (adminUserDetails.length > 0) {
        response = {
          userId: adminUserDetails[0]._id,
          userName: adminUserDetails[0].userName,
          partnerName: adminUserDetails[0].partnerName,
          partnerId: adminUserDetails[0].partnerName,
          roleId: adminUserDetails[0].roleId,
          isActive: adminUserDetails[0].isActive,
        };
      }

      if (doctorUserDetails.length > 0) {
        response = {
          userId: doctorUserDetails[0]._id,
          userName: doctorUserDetails[0].userName,
          mobileNumber: doctorUserDetails[0].mobileNumber,
          emailId: doctorUserDetails[0].emailId,
          age: doctorUserDetails[0].age,
          gender: doctorUserDetails[0].gender,
          specialty: doctorUserDetails[0].specialty,
          yearsOfPractice: doctorUserDetails[0].yearsOfPractice,
          hospitalAffiliation: doctorUserDetails[0].hospitalAffiliation,
          clinicAffiliation: doctorUserDetails[0].clinicAffiliation,
          calendlyUserUrl: doctorUserDetails[0].calendlyUserUrl,
          calendlyUserCalenderUrl: doctorUserDetails[0].calendlyUserCalenderUrl,
          roleId: doctorUserDetails[0].roleId,
          isActive: doctorUserDetails[0].isActive,
        };
      }

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

  async doctorUserSignUp(params) {
    const session = await mongoose.startSession();
    try {
      logger.info('inside adminUserLogin bao');
      session.startTransaction();

      let whereObj = {
        roleId: params.roleId,
      };

      let roleDetails = await AdminDao.findUserRoles(whereObj, session);
      if (!roleDetails.length) {
        error.message = ERROR_MESSAGES.ERROR_MESSAGE_ROLE_NOT_FOUND;
        error.code = ERROR_CODES.ERROR_CODE_404;
        throw error;
      }

      whereObj = {
        mobileNumber: params.mobileNumber,
      };

      let doctorUserDetails = await AdminDao.findDoctorUserDetails(
        whereObj,
        session
      );
      if (doctorUserDetails.length > 0) {
        error.message = ERROR_MESSAGES.ERROR_MESSAGE_USER_ALREADY_EXISTS;
        error.code = ERROR_CODES.ERROR_CODE_409;
        throw error;
      }

      let insertObj = {
        userName: params.userName,
        mobileNumber: params.mobileNumber,
        emailId: params.emailId,
        age: params.age,
        gender: params.gender,
        specialty: params.specialty,
        yearsOfPractice: params.yearsOfPractice,
        hospitalAffiliation: params.hospitalAffiliation,
        clinicAffiliation: params.clinicAffiliation,
        roleId: params.roleId,
        isActive: true,
        createdOn: new Date().toISOString(),
        updatedOn: new Date().toISOString(),
      };

      doctorUserDetails = await AdminDao.createDoctorUser(insertObj, session);

      const saltKey = generateSalt();
      const hashedKey = hashPasswordWithSalt(
        params.mobileNumber.toString(),
        saltKey
      );

      insertObj = {
        userId: doctorUserDetails[0]._id,
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

  async getDoctorsList(params, limit, page) {
    const session = await mongoose.startSession();
    try {
      logger.info('inside adminUserLogin bao');
      session.startTransaction();

      let offset = (page - 1) * limit;
      let whereObj = {};

      let doctorUsers = await AdminDao.getAllDoctorUserDetails(
        whereObj,
        limit,
        offset
      );

      let totalDoctorsCount = await AdminDao.getDoctorUsersCount(
        whereObj,
        session
      );

      let totalPages = totalDoctorsCount / limit;

      await session.commitTransaction();
      session.endSession();
      return {
        successCode: STATUS_CODES.STATUS_CODE_200,
        doctorUsers: doctorUsers,
        metaData: {
          totalDoctorsCount: totalDoctorsCount,
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

  async getTotalUsersCount() {
    const session = await mongoose.startSession();
    try {
      logger.info('inside getTotalUsersCount bao');
      session.startTransaction();
      let whereObj = {};
      let totalDoctorsCount = await AdminDao.getDoctorUsersCount(
        whereObj,
        session
      );

      let totalPharmacyUsersCount = await AdminDao.getPharmacyUsersCount(
        whereObj,
        session
      );

      whereObj = {
        roleId: 101,
      };
      let totalPartnersCount = await AdminDao.getPartnerUsersCount(
        whereObj,
        session
      );

      return {
        successCode: STATUS_CODES.STATUS_CODE_200,
        pharmacyUsersCount: totalPharmacyUsersCount,
        partnerUsersCount: totalPartnersCount,
        doctorUsersCount: totalDoctorsCount,
      };
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
