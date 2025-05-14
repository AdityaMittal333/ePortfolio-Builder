const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  ownerId: { type: String, required: true },
  name: String,
  description: String,
  video: { type: String, required: false }, // Cloudinary video URL
});

module.exports = mongoose.model("Video", videoSchema);
