const { DiagnosticBookings, PatientDetails } = require('../db/collections');

module.exports.createDiagnosticBookings = async (insertObj, session) => {
  try {
    let data = await DiagnosticBookings.create([insertObj], {
      session: session,
    });
    return data;
  } catch (e) {
    throw e;
  }
};

module.exports.getDiagnosticBookings = async (
  whereObj,
  limit,
  offset,
  session
) => {
  try {
    const data = await DiagnosticBookings.find(whereObj)
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

module.exports.getDiagnosticBookingsCount = async (whereObj, session) => {
  try {
    const count = await DiagnosticBookings.countDocuments(whereObj)
      .session(session)
      .exec();
    return count;
  } catch (error) {
    throw error;
  }
};

module.exports.findDiagnosticBookingDetails = async (whereObj, session) => {
  try {
    let data = await DiagnosticBookings.find(whereObj)
      .session(session)
      .lean(true);
    return data;
  } catch (e) {
    throw e;
  }
};

module.exports.createPatientDetails = async (insertObj, session) => {
  try {
    let data = await PatientDetails.create([insertObj], {
      session: session,
    });
    return data;
  } catch (e) {
    throw e;
  }
};

module.exports.findPatientDetails = async (whereObj, session) => {
  try {
    let data = await PatientDetails.find(whereObj).session(session).lean(true);
    return data;
  } catch (e) {
    throw e;
  }
};

module.exports.updatePatientDetails = async (updateObj, whereObj, session) => {
  try {
    let data = await PatientDetails.updateOne(whereObj, updateObj, {
      session: session,
      new: true,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.updateDiagnosticBookings = async (
  updateObj,
  whereObj,
  session
) => {
  try {
    let data = await DiagnosticBookings.updateOne(whereObj, updateObj, {
      session: session,
      new: true,
    });

    return data;
  } catch (error) {
    throw error;
  }
};
