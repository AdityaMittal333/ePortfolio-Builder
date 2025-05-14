const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME_CLOUDINARY2,
  api_key: process.env.CLOUDINARY_API_KEY2,
  api_secret: process.env.CLOUDINARY_API_SECRET2,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'PortFolio_Builder',
    allowed_formats: ['mp4', 'mov', 'avi', 'mkv', 'png', 'jpg', 'jpeg'], // ✅ underscore
    resource_type: 'auto', // or set to 'image' or 'video' if you're uploading only one type
  },
});

module.exports = {
  cloudinary,
  storage,
};
