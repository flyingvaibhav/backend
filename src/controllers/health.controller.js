import mongoose from 'mongoose';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cloudinary } from '../utils/cloudinary.js';

const dbStateMap = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

const healthCheck = asyncHandler(async (_req, res) => {
  let cloudinaryStatus = 'unknown';

  try {
    const ping = await cloudinary.api.ping();
    cloudinaryStatus = ping?.status === 'ok' ? 'ok' : 'error';
  } catch (err) {
    cloudinaryStatus = `error: ${err.message}`;
  }

  const response = new ApiResponse(200, {
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    db: dbStateMap[mongoose.connection.readyState] || 'unknown',
    cloudinary: cloudinaryStatus,
    timestamp: new Date().toISOString(),
  });

  res.status(200).json(response);
});

export { healthCheck };
