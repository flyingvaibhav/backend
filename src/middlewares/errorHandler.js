import { ApiError } from '../utils/ApiError.js';

const notFound = (req, res, next) => {
  const error = new ApiError(404, `Route not found: ${req.originalUrl}`);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const payload = {
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.error || [],
  };
  res.status(statusCode).json(payload);
};

export { notFound, errorHandler };
