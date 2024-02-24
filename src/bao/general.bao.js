const moment = require('moment');
const Base = require('./base');
const db = require('../db');
const { Op, fn, col } = require('sequelize');
const { GeneralDao } = require('../dao');
const logger = require('../common/logger')('general-bao');
const memoryCache = require('memory-cache');
const { ERROR_CODES, ERROR_MESSAGES } = require('../common/error.constants');
const { STATUS_CODES } = require('../common/constants');
const error = new Error();

const cacheDuration = 2 * 24 * 60 * 60 * 1000;

class GeneralBao extends Base {
  constructor() {
    super();
  }

  async getServiceablePincodes(limit, page) {
    const cacheKey = `serviceablePincodes_${limit}_${page}`;

    const cachedData = memoryCache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

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

      memoryCache.put(cacheKey, data, cacheDuration);

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
    const cacheKey = `diagnosticTests_${limit}_${page}`;

    const cachedData = memoryCache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

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

      memoryCache.put(cacheKey, data, cacheDuration);

      await txn.commit();
      return data;
    } catch (error) {
      logger.error(error);
      await txn.rollback();
      throw error;
    }
  }

  async searchDiagnosticTest(params) {
    let txn = await db.sequelize.transaction();
    logger.info('inside searchDiagnosticTest');
    try {
      let whereObj = {
        attributeId: 2,
        attributeValue: {
          [Op.iLike]: fn('lower', col('attributeValue')),
          [Op.iLike]: `%${params.diagnosticTest.toLowerCase()}%`,
        },
      };
      let data = await GeneralDao.searchDiagnosticTest(whereObj, txn);
      await txn.commit();
      return data;
    } catch (error) {
      logger.error(error);
      await txn.rollback();
      throw error;
    }
  }

  async getDiagnosticTestDetails(params) {
    let txn = await db.sequelize.transaction();
    logger.info('inside getDiagnosticTestDetails');
    try {
      let result = {};
      let whereObj = {
        testId: params.testId,
        isActive: true,
      };
      let data = await GeneralDao.getDiagnosticTestDetails(whereObj, txn);
      if (data.length > 0) {
        result['partnerId'] = data[0]['partnerId'];
        result['testId'] = data[0]['testId'];
        for (const item of data) {
          const attributeName = item['diagnosticsTestAttribute.attributeName'];
          const attributeValue = item['attributeValue'];
          result[attributeName] = attributeValue;
        }
      } else {
        error.message = ERROR_MESSAGES.ERROR_MESSAGE_DIAGNOSTIC_TEST_NOT_FOUND;
        error.code = ERROR_CODES.ERROR_CODE_404;
        throw error;
      }
      await txn.commit();
      return result;
    } catch (error) {
      logger.error(error);
      await txn.rollback();
      throw error;
    }
  }
}

module.exports = GeneralBao;
