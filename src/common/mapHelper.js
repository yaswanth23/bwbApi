const axios = require('axios');

module.exports.getLatAndLngFromPincode = async (pincode) => {
  try {
    const encodedPincode = encodeURIComponent(pincode);
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedPincode}&key=${process.env.GOOGLE_MAP_KEY}`
    );

    const location = response.data.results[0].geometry.location;

    return { latitude: location.lat, longitude: location.lng };
  } catch (e) {
    throw new Error('Invalid Pincode');
  }
};
