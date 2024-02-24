const { DataTypes } = require('sequelize');

const schema = '';
const tableName = 'bookingStateTransition';

const definition = {
  fromStateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'fromstateid',
    primaryKey: true,
  },
  toStateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'tostateid',
    primaryKey: true,
  },
  triggerCondition: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'triggercondition',
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
