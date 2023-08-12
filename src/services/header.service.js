const { _error } = require('../common/httpHelper');
const jwt = require('jsonwebtoken');

module.exports.validateApiAuthorization = async (
  httpRequest,
  httpResponse,
  next
) => {
  try {
    if (httpRequest.headers && httpRequest.headers.authorization) {
      let decoded = jwt.decode(httpRequest.headers.authorization, {
        complete: true,
      });
      if (decoded.payload.secret === process.env.AUTH_KEY) {
        return next();
      } else {
        return _error(httpResponse, {
          type: 'authorization',
          message: 'Invalid Authorization token',
        });
      }
    } else {
      return _error(httpResponse, {
        type: 'authorization',
        message: 'Authorization is required',
      });
    }
  } catch (e) {
    return _error(httpResponse, {
      type: 'authorization',
      message: 'Invalid Authorization token',
    });
  }
};
