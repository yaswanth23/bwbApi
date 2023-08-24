const db = require('../db');
const { QueryTypes, col, Op, literal } = require('sequelize');
const {
  ServiceablePincodes,
  DiagnosticsTestAttributes,
  DiagnosticsTestAttributesStore,
} = db.GeneralSchema;

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

module.exports.findDiagnosticsTestAttributesStore = async (
  whereObj,
  limit,
  offset,
  txn
) => {
  try {
    let data = await DiagnosticsTestAttributesStore.findAll({
      attributes: ['attributeId', 'testId', 'attributeValue'],
      where: whereObj,
      limit: limit,
      offset: offset,
      raw: true,
      transaction: txn,
      include: [
        {
          model: DiagnosticsTestAttributes,
          attributes: ['attributeName'],
          where: {
            isActive: true,
          },
        },
      ],
    });
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.searchDiagnosticTest = async (whereObj, txn) => {
  try {
    let data = await DiagnosticsTestAttributesStore.findAll({
      where: whereObj,
      attributes: ['testId', 'attributeId', 'attributeValue'],
      raw: true,
      transaction: txn,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.getDiagnosticTestDetails = async (whereObj, txn) => {
  try {
    let data = await DiagnosticsTestAttributesStore.findAll({
      where: whereObj,
      include: [
        {
          model: DiagnosticsTestAttributes,
          attributes: ['attributeName'],
          where: {
            isActive: true,
          },
        },
      ],
      raw: true,
      transaction: txn,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
