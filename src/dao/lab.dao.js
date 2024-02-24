const db = require('../db');
const { QueryTypes, col, Op, literal } = require('sequelize');
const { LabLocations } = db.GeneralSchema;

// module.exports.getNearbyLabLocations = async (location, maxDistance, txn) => {
//   try {
//     const nearbyLabLocations = await LabLocations.findAll({
//       attributes: [
//         'labId',
//         'labName',
//         'labAddress',
//         'city',
//         'pincode',
//         'pointOfContact',
//         'phoneNumber',
//         'labTimings',
//         [
//           literal(
//             `(6371 * acos(cos(radians(${location.latitude})) * cos(radians(latitude)) * cos(radians(${location.longitude}) - radians(longitude)) + sin(radians(${location.latitude})) * sin(radians(latitude))))`
//           ),
//           'distance',
//         ],
//       ],
//       where: {
//         latitude: {
//           [Op.between]: [
//             location.latitude - maxDistance / 111.32,
//             location.latitude + maxDistance / 111.32,
//           ],
//         },
//         longitude: {
//           [Op.between]: [
//             location.longitude -
//               maxDistance /
//                 (111.32 * Math.cos(location.latitude * (Math.PI / 180))),
//             location.longitude +
//               maxDistance /
//                 (111.32 * Math.cos(location.latitude * (Math.PI / 180))),
//           ],
//         },
//       },
//       order: [['distance', 'ASC']],
//     });

//     return nearbyLabLocations;
//   } catch (error) {
//     throw error;
//   }
// };

module.exports.getNearbyLabLocations = async (location, txn) => {
  try {
    let data = await LabLocations.findAll({
      attributes: [
        'labId',
        'labName',
        'labAddress',
        'city',
        'pincode',
        'pointOfContact',
        'phoneNumber',
        'labTimings',
        [
          literal(
            `(6371 * acos(cos(radians(${location.latitude})) * cos(radians(latitude)) * cos(radians(${location.longitude}) - radians(longitude)) + sin(radians(${location.latitude})) * sin(radians(latitude))))`
          ),
          'distance',
        ],
      ],
      order: [['distance', 'ASC']],
      raw: true,
      transaction: txn,
    });

    return data;
  } catch (error) {
    throw error;
  }
};
