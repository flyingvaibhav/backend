import { Contact } from '../models/contact.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const createContact = asyncHandler(async (req, res) => {
	const { name, email, date, notes, source } = req.body;

	if (!name?.trim() || !email?.trim()) {
		throw new ApiError(400, 'Name and email are required');
	}

	const contact = await Contact.create({
		name: name.trim(),
		email: email.trim().toLowerCase(),
		notes: notes?.trim() || undefined,
		targetLaunch: date ? new Date(date) : undefined,
		source: source || 'landing',
		userAgent: req.headers['user-agent'],
	});

	const payload = new ApiResponse(
		201,
		{
			id: contact._id,
			name: contact.name,
			email: contact.email,
			status: contact.status,
		},
		'Request received'
	);

	res.status(201).json(payload);
});

export { createContact };
