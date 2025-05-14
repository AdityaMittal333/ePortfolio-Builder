const express = require("express");
const router = express.Router();
const Certificate = require("../models/CertificateSchema");
const multer = require("multer");
const { storage } = require("../cloudConfig"); // assuming cloudConfig is correct
const upload = multer({ storage });
const { cloudinary } = require("../cloudConfig");

// Get all certificates
router.get("/", async (req, res) => {
  try {
    const ownerId = req.headers.ownerid;
    const certificates = await Certificate.find({ownerId});
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create a certificate
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const {ownerId,name, description, techStack, certificateLink } = req.body;
    const newCertificate = new Certificate({
      ownerId,
      name,
      description,
      techStack,
      certificateLink,
      photo: req.file?.path || null,
    });
    await newCertificate.save();
    res.status(201).json({ message: "Certificate added", certificate: newCertificate });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get certificate by id
router.get("/:id", async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ error: "Certificate not found" });
    }
    res.json(certificate);
  } catch (err) {
    console.log("Error fetching certificate:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update certificate by id
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const ownerId = req.headers.ownerid;
    const { name, description, techStack, certificateLink } = req.body;
    const certificate = await Certificate.findById(req.params.id);
    if(!certificate){
      return res.status(404).json({ error: "Project not found" });
    }

    if(req.file && certificate.photo){
      const urlParts = certificate.photo.split("/");
      const folderNameIndex = urlParts.findIndex(part => part === "PortFolio_Builder");
    
      if (folderNameIndex !== -1) {
        const publicIdParts = urlParts.slice(folderNameIndex).join("/");
        const publicId = publicIdParts.replace(/\.[^/.]+$/, ""); // remove file extension
        await cloudinary.uploader.destroy(publicId);
      }
    }

    const updatedData = {
      ownerId,
      name,
      description,
      techStack,
      certificateLink,
    };

    if (req.file) {
      updatedData.photo = req.file.path;
    }

    const updatedCertificate = await Certificate.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    res.json({ message: "Certificate updated", certificate: updatedCertificate });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete certificate
router.delete("/:id", async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (certificate.photo) {
      const urlParts = certificate.photo.split("/");
      const folderNameIndex = urlParts.findIndex(part => part === "PortFolio_Builder");

      if (folderNameIndex !== -1) {
        const publicIdParts = urlParts.slice(folderNameIndex).join("/");
        const publicId = publicIdParts.replace(/\.[^/.]+$/, "");

        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Certificate.findByIdAndDelete(req.params.id);

    res.json({ message: "Certificate and associated image deleted successfully" });
  } catch (err) {
    console.log("Error deleting Certificate:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
