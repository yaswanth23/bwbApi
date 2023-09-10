const mongoose = require('mongoose');
const moment = require('moment');
const istTimestamp = moment.utc().add(5, 'hours').add(30, 'minutes').toDate();

const userRolesSchema = new mongoose.Schema({
  roleId: { type: Number, required: true },
  roleName: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdOn: { type: Date, default: istTimestamp },
  updatedOn: { type: Date, default: istTimestamp },
});

const userRoles = mongoose.model('userRoles', userRolesSchema, 'userRoles');

module.exports = userRoles;
