const { DataTypes } = require('sequelize');

const schema = '';
const tableName = 'bookingCaptureStates';

const definition = {
  bookingId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'bookingid',
    primaryKey: true,
  },
  stateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'stateid',
    primaryKey: true,
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'createdby',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
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
