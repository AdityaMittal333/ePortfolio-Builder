const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema({
  ownerId: { type: String, required: true },
  name: String,
  description: String,
  techStack: String,
  certificateLink: String,
  photo: { type: String, required: false },
});

module.exports = mongoose.model("Certificate", CertificateSchema);
