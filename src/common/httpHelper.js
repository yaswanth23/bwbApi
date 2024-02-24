const httpContext = require("express-http-context");
const { v4: UUID } = require("uuid");
const APP_ENV = process.env.APP_ENV;

module.exports._200 = (httpResponse, data = {}) => {
  const response_data = {
    status: "success",
    data: data,
  };
  return httpResponse.status(200).json(response_data);
};

module.exports._error = async (httpResponse, error, next) => {
  try {
    if (error.message.code && error.message.message) {
      error.code = error.message.code;
      error.message = error.message.message;
    } else {
      error.message = error.message.message || error.message;
    }
    let errors =
      error.errors && Array.isArray(error.errors) && error.errors.length > 0
        ? []
        : undefined;
    let [code, message, statusCode, request_id, trace] = [
      error.code || "SERVICE_ERROR",
      error.message || error.message.message,
      error.code,
      httpContext.get("request_id") || undefined,
      APP_ENV === "production" ? undefined : error.stack,
    ];

    switch (error.type) {
      case "validation":
        statusCode = 403;
        break;
      case "generic":
        statusCode = error.code ? error.code : 400;
        break;
      case "business":
        statusCode = 500;
        break;
      case "authorization":
        statusCode = 401;
        break;
    }

    if (error.errors && error.errors.length > 0) {
      for (const e of error.errors) {
        if (typeof error === "string") {
          errors.push(e);
        } else {
          errors.push(e.message);
        }
      }
    }
    let response = {
      status: "error",
      request_id,
      code,
      message,
      errors,
      trace,
    };

    httpResponse.status(statusCode).json(response);
    if (next) next();
  } catch (e) {
    httpResponse.status(500).json({
      status: "error",
      code: "SERVICE_ERROR",
      message:
        "An unexpected error has happened on the server while resolving your request.",
      trace: APP_ENV === "production" ? undefined : error.stack,
    });
    if (next) next();
  }
};

module.exports._404 = (httpRequest, httpResponse) => {
  httpResponse.status(404).json({
    status: "error",
    message: "The resource you are looking for is not found on the server",
    code: "RESOURCE_NOT_FOUND",
  });
};

module.exports._genRID = () => {
  return UUID();
};
