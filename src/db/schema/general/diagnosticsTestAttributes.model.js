const { DataTypes } = require('sequelize');
const schema = '';
const tableName = `diagnosticsTestAttributes`;
const definition = {
  attributeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    field: 'attributeid',
    primaryKey: true,
  },
  attributeName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'attributename',
  },
  attributeType: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'attributetype',
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
  table.associate = (models) => {
    table.belongsTo(models.GeneralSchema.DiagnosticsTestAttributesStore, {
      foreignKey: 'attributeId',
      targetKey: 'attributeId',
    });
  };
  return table;
};
