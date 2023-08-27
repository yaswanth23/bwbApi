const db = require('../db');
const { GeneralDao } = require('../dao');
const logger = require('../common/logger')('general-bao');
const { ERROR_CODES, ERROR_MESSAGES } = require('../common/error.constants');
const error = new Error();

module.exports.getDiagnosticTestDetails = async (testId) => {
  let txn = await db.sequelize.transaction();
  logger.info('inside getDiagnosticTestDetails helper');
  try {
    let result = {};
    let whereObj = {
      testId: testId,
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
};
