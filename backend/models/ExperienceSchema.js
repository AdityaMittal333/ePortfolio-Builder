const mongoose = require("mongoose");

const experienceschema = new mongoose.Schema({
  ownerId: { type: String, required: true },
  name: String,
  description: String,
  techStack: String,
  photo: { type: String, required: false }, 
});

module.exports = mongoose.models.Experience || mongoose.model("Experience", experienceschema);
