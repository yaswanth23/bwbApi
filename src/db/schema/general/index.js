module.exports = (sequelize) => {
  const ServiceablePincodes = require('./serviceablePincodes.model')(sequelize);
  const LabLocations = require('./labLocations.model')(sequelize);

  return {
    Schema: 'GeneralSchema',
    ServiceablePincodes,
    LabLocations,
  };
};
