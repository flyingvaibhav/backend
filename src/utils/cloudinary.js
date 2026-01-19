import { v2 as cloudinary } from 'cloudinary';

const requiredEnv = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length) {
    throw new Error(`Missing Cloudinary env vars: ${missingEnv.join(', ')}`);
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath, options = {}) => {
    if (!filePath) {
        throw new Error('filePath is required for Cloudinary upload');
    }

    const uploadOptions = {
        folder: process.env.CLOUDINARY_FOLDER || undefined,
        resource_type: 'auto',
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        ...options,
    };

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);

    return {
        url: result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type,
        bytes: result.bytes,
        format: result.format,
        width: result.width,
        height: result.height,
        duration: result.duration,
    };
};

const deleteFromCloudinary = async (publicId, options = {}) => {
    if (!publicId) {
        throw new Error('publicId is required for Cloudinary deletion');
    }

    return cloudinary.uploader.destroy(publicId, {
        invalidate: true,
        resource_type: 'auto',
        ...options,
    });
};

export { cloudinary, uploadToCloudinary, deleteFromCloudinary };