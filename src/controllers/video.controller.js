import fs from 'fs/promises';
import { Video } from '../models/video.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

const listVideos = asyncHandler(async (req, res) => {
	const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
	const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
	const skip = (page - 1) * limit;

	const [items, total] = await Promise.all([
		Video.find({ isPublished: true }).sort({ createdAt: -1 }).skip(skip).limit(limit),
		Video.countDocuments({ isPublished: true }),
	]);

	const response = new ApiResponse(200, {
		items,
		page,
		limit,
		total,
		hasMore: skip + items.length < total,
	});

	res.status(200).json(response);
});

const createVideo = asyncHandler(async (req, res) => {
	const videoPath = req.files?.video?.[0]?.path;
	const thumbnailPath = req.files?.thumbnail?.[0]?.path;
	const { title, description } = req.body;

	if (!title || !description) {
		throw new ApiError(400, 'title and description are required');
	}

	if (!videoPath) {
		throw new ApiError(400, 'video file is required');
	}

	if (!thumbnailPath) {
		throw new ApiError(400, 'thumbnail image is required');
	}

	const uploads = await Promise.all([
		uploadToCloudinary(videoPath, { folder: process.env.CLOUDINARY_VIDEO_FOLDER, resource_type: 'video' }),
		uploadToCloudinary(thumbnailPath, { folder: process.env.CLOUDINARY_THUMBNAIL_FOLDER, resource_type: 'image' }),
	]);

	const [videoUpload, thumbnailUpload] = uploads;

	const video = await Video.create({
		videoFile: videoUpload.url,
		thumbnail: thumbnailUpload.url,
		title,
		description,
		duration: Math.round(videoUpload.duration || 0),
	});

	await Promise.allSettled([
		videoPath ? fs.unlink(videoPath) : Promise.resolve(),
		thumbnailPath ? fs.unlink(thumbnailPath) : Promise.resolve(),
	]);

	const response = new ApiResponse(201, video, 'Video uploaded successfully');
	res.status(201).json(response);
});

const incrementView = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const video = await Video.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });

	if (!video) {
		throw new ApiError(404, 'Video not found');
	}

	const response = new ApiResponse(200, video, 'View recorded');
	res.status(200).json(response);
});

export { listVideos, createVideo, incrementView };
