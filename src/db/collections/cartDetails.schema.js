const mongoose = require('mongoose');
const moment = require('moment');
const istTimestamp = moment.utc().add(5, 'hours').add(30, 'minutes').toDate();

const cartDetailsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  cartItems: { type: Array },
  isActive: { type: Boolean, default: true },
  createdOn: { type: Date, default: istTimestamp },
  updatedOn: { type: Date, default: istTimestamp },
});

const cartDetails = mongoose.model(
  'cartDetails',
  cartDetailsSchema,
  'cartDetails'
);

module.exports = cartDetails;
