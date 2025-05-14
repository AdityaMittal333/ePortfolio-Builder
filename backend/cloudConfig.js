const cloudinary = require('cloudinary').v2;
const {cloudinaryStorage, CloudinaryStorage} = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME_CLOUDINARY,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})


const storage = new CloudinaryStorage({
  cloudinary:cloudinary,
  params:{
    folder:'PortFolio_Builder',
    allowedFormats: ["png","jpg","jpeg","mp4", "mov", "avi", "mkv"],
  },
});

module.exports={
  cloudinary,
  storage,
};