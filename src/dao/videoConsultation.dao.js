const { VideoConsultationBookings } = require('../db/collections');

module.exports.createVideoConsultationBookings = async (insertObj, session) => {
  try {
    let data = await VideoConsultationBookings.create([insertObj], {
      session: session,
    });
    return data;
  } catch (e) {
    throw e;
  }
};

module.exports.findVideoConsultationBookings = async (whereObj, session) => {
  try {
    let data = await VideoConsultationBookings.find(whereObj)
      .session(session)
      .lean(true);
    return data;
  } catch (e) {
    throw e;
  }
};

module.exports.updateVideoConsultationBookings = async (
  updateObj,
  whereObj,
  session
) => {
  try {
    let data = await VideoConsultationBookings.updateOne(whereObj, updateObj, {
      session: session,
      new: true,
    });

    return data;
  } catch (error) {
    throw error;
  }
};
