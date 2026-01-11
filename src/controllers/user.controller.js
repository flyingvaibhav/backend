import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const requiredFields = ['username', 'email', 'fullName', 'password'];

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullName, password, avatar, coverImage } = req.body;

  const missing = requiredFields.filter((field) => !req.body[field]);
  if (missing.length) {
    throw new ApiError(400, `Missing required fields: ${missing.join(', ')}`);
  }

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    throw new ApiError(409, 'User with that email or username already exists');
  }

  const user = await User.create({ username, email, fullName, password, avatar, coverImage });
  const safeUser = {
    id: user._id,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    avatar: user.avatar,
    coverImage: user.coverImage,
  };

  const response = new ApiResponse(201, safeUser, 'User registered successfully');
  res.status(201).json(response);
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!password || (!email && !username)) {
    throw new ApiError(400, 'Provide username or email and a password');
  }

  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const payload = new ApiResponse(200, {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatar,
      coverImage: user.coverImage,
    },
  }, 'Login successful');

  res.status(200).json(payload);
});

export { registerUser, loginUser };
