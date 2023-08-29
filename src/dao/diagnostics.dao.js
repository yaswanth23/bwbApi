const { DiagnosticBookings } = require('../db/collections');

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
