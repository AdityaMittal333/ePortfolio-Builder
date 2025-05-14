const express = require("express");
const router = express.Router();
const Profile = require("../models/ProfileSchema");
const multer = require("multer");
const { storage } = require("../cloudConfig2");
const upload = multer({ storage });
const { cloudinary } = require("../cloudConfig");

// Get profile data for a specific owner
router.get("/", async (req, res) => {
  try {
    const ownerId = req.headers.ownerid;
    const profile = await Profile.find({ ownerId }); // returns array
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create a new profile
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { ownerId, name, description, skills , githubLink , linkedInLink} = req.body;

    const newProfile = new Profile({
      ownerId,
      name,
      description,
      skills,
      githubLink,
      linkedInLink,
      photo: req.file?.path || null,
    });

    await newProfile.save();
    res.status(200).json({ message: "Profile Added", profile: newProfile });
  } catch (err) {
    console.error("Error creating profile:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// Update an existing profile
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { ownerId, name, description, skills , githubLink , linkedInLink} = req.body;

    const profile = await Profile.findById(req.params.id);
    if(!profile){
      return res.status(404).json({ error: "Project not found" });
    }
    if(req.file && profile.photo){
      const urlParts = profile.photo.split("/");
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
      skills,
      githubLink,
      linkedInLink,
    };

    if (req.file) {
      updatedData.photo = req.file.path;
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { ownerId },
      updatedData,
      { new: true }
    );

    res.json({ message: "Profile Updated", profile: updatedProfile });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
