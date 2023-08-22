const moment = require('moment');
const Base = require('./base');
const db = require('../db');
const { GeneralDao } = require('../dao');
const logger = require('../common/logger')('general-bao');
const { ERROR_CODES, ERROR_MESSAGES } = require('../common/error.constants');
const { STATUS_CODES } = require('../common/constants');
const error = new Error();

class GeneralBao extends Base {
  constructor() {
    super();
  }

  async getServiceablePincodes(limit, page) {
    let txn = await db.sequelize.transaction();
    logger.info('inside getServiceablePincodes');
    try {
      let offset = (page - 1) * limit;
      let whereObj = {
        isActive: true,
      };
      let data = await GeneralDao.findServiceablePincodes(
        whereObj,
        limit,
        offset,
        txn
      );
      await txn.commit();
      return data;
    } catch (error) {
      logger.error(error);
      await txn.rollback();
      throw error;
    }
  }

  async searchPincodes(params) {
    let txn = await db.sequelize.transaction();
    logger.info('inside getServiceablePincodes');
    try {
      const searchDigit = params.pincode.toString();
      let data = await GeneralDao.findSearchPincodes(searchDigit, txn);
      await txn.commit();
      return data;
    } catch (error) {
      logger.error(error);
      await txn.rollback();
      throw error;
    }
  }

  async getDiagnosticTests(limit, page) {
    let txn = await db.sequelize.transaction();
    logger.info('inside getDiagnosticTests');
    try {
      let offset = (page - 1) * limit;
      let whereObj = {
        attributeId: [2],
        isActive: true,
      };
      let data = await GeneralDao.findDiagnosticsTestAttributesStore(
        whereObj,
        limit,
        offset,
        txn
      );

      data = data.map((item) => ({
        attributeId: item.attributeId,
        testId: item.testId,
        attributeValue: item.attributeValue,
        attributeName: item['diagnosticsTestAttribute.attributeName'],
      }));

      await txn.commit();
      return data;
    } catch (error) {
      logger.error(error);
      await txn.rollback();
      throw error;
    }
  }
}

module.exports = GeneralBao;
