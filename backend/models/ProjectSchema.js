const mongoose = require("mongoose");

const projectschema = new mongoose.Schema({
  ownerId: { type: String, required: true },
  name: String,
  description: String,
  githubLink: String,
  deployLink: String,
  techStack: String,
  photo: { type: String, required: false }, 
});

module.exports=mongoose.model("Project",projectschema);