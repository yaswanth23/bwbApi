const db = require('../db');
const { QueryTypes } = require('sequelize');
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

module.exports.findSearchPincodes = async (searchDigit, txn) => {
  try {
    const query = `
      SELECT * FROM "serviceablePincodes"
      WHERE "pincode"::TEXT LIKE '${searchDigit}%';
    `;

    const data = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction: txn,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
