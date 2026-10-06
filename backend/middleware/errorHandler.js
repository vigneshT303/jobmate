const { errorResponse } = require('../utils/responseHandler');

const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.name || 'ApplicationError'}: ${err.message}`);

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return errorResponse(res, 400, 'File too large. Maximum size allowed is 5MB.');
    }
    return errorResponse(res, 400, `Upload error: ${err.message}`);
  }

  if (err.name === 'CastError') {
    return errorResponse(res, 404, `Resource not found with id: ${err.value}`);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return errorResponse(res, 409, `A record with this ${field} already exists.`);
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message
    }));
    return errorResponse(res, 400, 'Validation Error', errors);
  }

  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 401, 'Invalid authentication token');
  }
  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 401, 'Authentication token has expired');
  }

  if (err.message && err.message.startsWith('Not allowed by CORS')) {
    return errorResponse(res, 403, err.message);
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  return errorResponse(res, statusCode, err.message || 'Internal Server Error');
};

module.exports = errorHandler;
