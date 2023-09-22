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

module.exports.getAllVideoConsultationBookings = async (
  whereObj,
  limit,
  offset,
  session
) => {
  try {
    const data = await VideoConsultationBookings.find(whereObj)
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

module.exports.getVideoConsultationBookingsCount = async (
  whereObj,
  session
) => {
  try {
    const count = await VideoConsultationBookings.countDocuments(whereObj)
      .session(session)
      .exec();
    return count;
  } catch (error) {
    throw error;
  }
};
