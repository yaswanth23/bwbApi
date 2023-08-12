const {
  PharmacyUserDetails,
  UserAuthPassDetails,
} = require('../db/collections');

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
