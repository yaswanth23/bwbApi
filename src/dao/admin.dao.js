const {
  UserRoles,
  AdminUserDetails,
  DoctorUserDetails,
} = require('../db/collections');

module.exports.findUserRoles = async (whereObj, session) => {
  try {
    let data = await UserRoles.find(whereObj).session(session).lean(true);
    return data;
  } catch (e) {
    throw e;
  }
};

module.exports.findAdminUserDetails = async (whereObj, session) => {
  try {
    let data = await AdminUserDetails.find(whereObj)
      .session(session)
      .lean(true);
    return data;
  } catch (e) {
    throw e;
  }
};

module.exports.createAdminUser = async (insertObj, session) => {
  try {
    let data = await AdminUserDetails.create([insertObj], {
      session: session,
    });
    return data;
  } catch (e) {
    throw e;
  }
};

module.exports.createDoctorUser = async (insertObj, session) => {
  try {
    let data = await DoctorUserDetails.create([insertObj], {
      session: session,
    });
    return data;
  } catch (e) {
    throw e;
  }
};

module.exports.findDoctorUserDetails = async (whereObj, session) => {
  try {
    let data = await DoctorUserDetails.find(whereObj)
      .session(session)
      .lean(true);
    return data;
  } catch (e) {
    throw e;
  }
};
