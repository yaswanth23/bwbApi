const { DataTypes } = require('sequelize');
const schema = '';
const tableName = `labLocations`;
const definition = {
  labId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    field: 'labid',
  },
  labName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'labname',
  },
  labAddress: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'labaddress',
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'city',
  },
  pincode: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'pincode',
  },
  pointOfContact: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'pointofcontact',
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'phonenumber',
  },
  labTimings: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'labtimings',
  },
  partnerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'partnerid',
  },
  isActive: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'isactive',
  },
  createdAt: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'createdat',
  },
  updatedAt: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'updatedat',
  },
};

module.exports = (sequelize) => {
  const table = sequelize.define(tableName, definition, {
    schema,
    createdAt: false,
    updatedAt: false,
    freezeTableName: true,
  });
  return table;
};
