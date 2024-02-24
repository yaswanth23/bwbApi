const {
  UserRoles,
  AdminUserDetails,
  DoctorUserDetails,
  PharmacyUserDetails,
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

module.exports.getAllDoctorUserDetails = async (
  whereObj,
  limit,
  offset,
  session
) => {
  try {
    const data = await DoctorUserDetails.find(whereObj)
      .sort({ createdOn: -1 })
      .skip(Number(offset))
      .limit(Number(limit))
      .lean(true)
      .session(session)
      .exec();

    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.getDoctorUsersCount = async (whereObj, session) => {
  try {
    const count = await DoctorUserDetails.countDocuments(whereObj)
      .session(session)
      .exec();
    return count;
  } catch (error) {
    throw error;
  }
};

module.exports.getPharmacyUsersCount = async (whereObj, session) => {
  try {
    const count = await PharmacyUserDetails.countDocuments(whereObj)
      .session(session)
      .exec();
    return count;
  } catch (error) {
    throw error;
  }
};

module.exports.getPartnerUsersCount = async (whereObj, session) => {
  try {
    const count = await AdminUserDetails.countDocuments(whereObj)
      .session(session)
      .exec();
    return count;
  } catch (error) {
    throw error;
  }
};

module.exports.getAllPharmacyUserDetails = async (
  whereObj,
  limit,
  offset,
  session
) => {
  try {
    const data = await PharmacyUserDetails.find(whereObj)
      .sort({ createdOn: -1 })
      .skip(Number(offset))
      .limit(Number(limit))
      .lean(true)
      .session(session)
      .exec();

    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.getAllPartnerUserDetails = async (
  whereObj,
  limit,
  offset,
  session
) => {
  try {
    const data = await AdminUserDetails.find(whereObj)
      .sort({ createdOn: -1 })
      .skip(Number(offset))
      .limit(Number(limit))
      .lean(true)
      .session(session)
      .exec();

    return data;
  } catch (error) {
    throw error;
  }
};