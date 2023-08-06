const { _200 } = require('../common/httpHelper');

module.exports.GET_ping = async (httpRequest, httpResponse, next) => {
  try {
    const d = new Date();
    const response = {
      server_time: `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`,
      server_name: process.env.APP_NAME,
      environment: process.env.APP_ENV,
      public: process.env.APP_PUBLIC,
      version: process.env.VERSION || 'x.x.x',
    };
    return _200(httpResponse, response);
  } catch (e) {
    return next(e);
  }
};
