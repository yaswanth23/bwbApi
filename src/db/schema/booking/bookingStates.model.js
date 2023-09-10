const { DataTypes } = require('sequelize');

const schema = '';
const tableName = 'bookingStates';

const definition = {
  stateId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'stateid',
    primaryKey: true,
  },
  stateName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'statename',
  },
  userRoleIds: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true,
    field: 'userroleids',
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
