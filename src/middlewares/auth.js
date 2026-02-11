import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';

const extractToken = (req) => {
  const bearer = req.headers.authorization;
  if (bearer?.startsWith('Bearer ')) {
    return bearer.replace('Bearer ', '').trim();
  }

  if (req.cookies?.accessToken) {
    return req.cookies.accessToken;
  }

  return null;
};

const verifyJWT = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req);
  if (!token) {
    throw new ApiError(401, 'Authentication required');
  }

  try {
    const decoded = jwt.verify(token, env.accessTokenSecret);
    const user = await User.findById(decoded._id).select('-password');

    if (!user) {
      throw new ApiError(401, 'Invalid or expired token');
    }

    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired token', [], err.stack);
  }
});

const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication required'));
  }

  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, 'Insufficient permissions'));
  }

  return next();
};

export { verifyJWT, requireRole };