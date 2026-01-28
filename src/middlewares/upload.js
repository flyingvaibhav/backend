import fs from 'fs';
import path from 'path';
import multer from 'multer';

const tempDir = path.join(process.cwd(), 'public', 'temp');
if (!fs.existsSync(tempDir)) {
	fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => cb(null, tempDir),
	filename: (_req, file, cb) => {
		const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
		cb(null, uniqueName);
	},
});

const allowedVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];

const fileFilter = (_req, file, cb) => {
	if (file.fieldname === 'video' && allowedVideoTypes.includes(file.mimetype)) return cb(null, true);
	if (file.fieldname === 'thumbnail' && allowedImageTypes.includes(file.mimetype)) return cb(null, true);
	cb(new Error(`Unsupported file type for field ${file.fieldname}`));
};

const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: 150 * 1024 * 1024 },
});

// Accepts single video and thumbnail uploads in one request
const uploadVideoAndThumbnail = upload.fields([
	{ name: 'video', maxCount: 1 },
	{ name: 'thumbnail', maxCount: 1 },
]);

export { uploadVideoAndThumbnail };
