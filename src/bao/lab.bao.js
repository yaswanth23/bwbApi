const moment = require('moment');
const Base = require('./base');
const db = require('../db');
const { Op, fn, col } = require('sequelize');
const { LabDao } = require('../dao');
const logger = require('../common/logger')('lab-bao');
const { ERROR_CODES, ERROR_MESSAGES } = require('../common/error.constants');
const { STATUS_CODES } = require('../common/constants');
const MapHelper = require('../common/mapHelper');
const error = new Error();

class LabBao extends Base {
  constructor() {
    super();
  }

  async searchNearByLabs(params) {
    let txn = await db.sequelize.transaction();
    logger.info('inside searchNearByLabs');
    try {
      let location = await MapHelper.getLatAndLngFromPincode(params.pincode);
      let data = await LabDao.getNearbyLabLocations(location, txn);
      await txn.commit();
      return data;
    } catch (error) {
      logger.error(error);
      await txn.rollback();
      throw error;
    }
  }
}

module.exports = LabBao;
