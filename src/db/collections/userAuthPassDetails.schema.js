const mongoose = require('mongoose');
const moment = require('moment');
const istTimestamp = moment.utc().add(5, 'hours').add(30, 'minutes').toDate();

const userAuthPassDetailsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  saltKey: { type: String, required: true },
  hashedKey: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdOn: { type: Date, default: istTimestamp },
  updatedOn: { type: Date, default: istTimestamp },
});

const userAuthPassDetails = mongoose.model(
  'userAuthPassDetails',
  userAuthPassDetailsSchema,
  'userAuthPassDetails'
);

module.exports = userAuthPassDetails;
