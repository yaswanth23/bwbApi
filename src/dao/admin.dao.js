const { UserRoles, AdminUserDetails } = require('../db/collections');

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
