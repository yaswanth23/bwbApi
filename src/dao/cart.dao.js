const { CartDetails } = require('../db/collections');

module.exports.findCartDetails = async (whereObj, session) => {
  try {
    let data = await CartDetails.find(whereObj).session(session).lean(true);
    return data;
  } catch (e) {
    throw e;
  }
};
