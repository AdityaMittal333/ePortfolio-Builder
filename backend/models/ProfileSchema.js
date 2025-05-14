const mongoose = require("mongoose");

const profileschema = new mongoose.Schema({
  ownerId: { type: String, required: true },
  name: String,
  description: String,
  skills: String,
  githubLink: String,
  linkedInLink: String,
  photo: {type:String,required:false},
});

module.exports = mongoose.model("Profile", profileschema);