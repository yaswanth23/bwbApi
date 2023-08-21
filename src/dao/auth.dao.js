const {
  PharmacyUserDetails,
  UserAuthPassDetails,
} = require('../db/collections');
const db = require('../db');
const { ServiceablePincodes, LabLocations } = db.GeneralSchema;

module.exports.createPharmacyUser = async (insertObj, session) => {
  try {
    let data = await PharmacyUserDetails.create([insertObj], {
      session: session,
    });
    return data;
  } catch (e) {
    throw e;
  }
};

module.exports.findPharmacyUser = async (whereObj, session) => {
  try {
    let data = await PharmacyUserDetails.find(whereObj)
      .session(session)
      .lean(true);
    return data;
  } catch (e) {
    throw e;
  }
};

module.exports.createUserAuthPass = async (insertObj, session) => {
  try {
    let data = await UserAuthPassDetails.create([insertObj], {
      session: session,
    });
    return data;
  } catch (e) {
    throw e;
  }
};

module.exports.findUserAuthPass = async (whereObj, session) => {
  try {
    let data = await UserAuthPassDetails.find(whereObj)
      .session(session)
      .lean(true);
    return data;
  } catch (e) {
    throw e;
  }
};

module.exports.insertPincode = async (insertObj, txn) => {
  try {
    let data = await ServiceablePincodes.create(insertObj, {
      transaction: txn,
    });
    if (data) {
      data = data.get({ plain: true });
    }
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.insertLabs = async (insertObj, txn) => {
  try {
    let data = await LabLocations.create(insertObj, {
      transaction: txn,
    });
    if (data) {
      data = data.get({ plain: true });
    }
    return data;
  } catch (error) {
    throw error;
  }
};
