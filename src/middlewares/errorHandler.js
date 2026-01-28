import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

const notFound = (req, _res, next) => {
  const error = new ApiError(404, `Route not found: ${req.originalUrl}`);
  next(error);
};

const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || err.status || 500;
  const payload = {
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || err.error || [],
  };

  if (env.nodeEnv === 'development' && err.stack) {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};

export { notFound, errorHandler };
