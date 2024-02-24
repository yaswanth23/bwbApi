module.exports = (sequelize) => {
  const ServiceablePincodes = require('./serviceablePincodes.model')(sequelize);
  const LabLocations = require('./labLocations.model')(sequelize);
  const DiagnosticsTestAttributes =
    require('./diagnosticsTestAttributes.model')(sequelize);
  const PartnerDetails = require('./partnerDetails.model')(sequelize);
  const DiagnosticsTestAttributesStore =
    require('./diagnosticsTestAttributesStore.model')(sequelize);

  return {
    Schema: 'GeneralSchema',
    ServiceablePincodes,
    LabLocations,
    DiagnosticsTestAttributes,
    PartnerDetails,
    DiagnosticsTestAttributesStore,
  };
};
