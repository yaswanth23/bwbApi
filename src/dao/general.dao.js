const db = require('../db');
const { ServiceablePincodes, LabLocations } = db.GeneralSchema;

module.exports.findServiceablePincodes = async (
  whereObj,
  limit,
  offset,
  txn
) => {
  try {
    let data = await ServiceablePincodes.findAll({
      where: whereObj,
      limit: limit,
      offset: offset,
      raw: true,
      transaction: txn,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
