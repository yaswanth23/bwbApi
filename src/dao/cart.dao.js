const { CartDetails } = require('../db/collections');

module.exports.findCartDetails = async (whereObj, session) => {
  try {
    let data = await CartDetails.find(whereObj).session(session).lean(true);
    return data;
  } catch (e) {
    throw e;
  }
};

module.exports.updateCartItems = async (updateObj, whereObj, session) => {
  try {
    let data = await CartDetails.updateOne(whereObj, updateObj, {
      session: session,
      new: true,
    });

    return data;
  } catch (error) {
    throw error;
  }
};
