const express = require("express");
const router = express.Router();
const Experience = require("../models/ExperienceSchema"); // Notice uppercase "Experience"
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
const { cloudinary } = require("../cloudConfig");

// No need to create a new mongoose connection separately here

// Get all experiences
router.get("/", async (req, res) => {
  try {
    const ownerId = req.headers.ownerid;
    const experiences = await Experience.find({ownerId});
    res.json(experiences);
  } catch (err) {
    console.error("Error fetching experiences:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Create a new experience
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const {ownerId, name, description, techStack } = req.body;

    const newExperience = new Experience({
      ownerId,
      name,
      description,
      techStack,
      photo: req.file.path || null,
    });

    await newExperience.save();
    console.log("Experience saved:", newExperience);
    res.status(200).json({ message: "Experience Added", experience: newExperience });
  } catch (err) {
    console.error("Error saving newExperience:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// Get a single experience by ID
router.get("/:id", async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) {
      return res.status(404).json({ error: "Experience not found" });
    }
    res.json(exp);
  } catch (err) {
    console.error("Error fetching experience:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update an experience by ID
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const ownerId = req.headers.ownerid;
    const { name, description, techStack } = req.body;

    const experience = await Experience.findById(req.params.id);
    if(!experience){
      return res.status(404).json({ error: "Project not found" });
    }

    if(req.file && experience.photo){
      const urlParts = experience.photo.split("/");
      const folderNameIndex = urlParts.findIndex(part => part === "PortFolio_Builder");

      if (folderNameIndex !== -1) {
        const publicIdParts = urlParts.slice(folderNameIndex).join("/");
        const publicId = publicIdParts.replace(/\.[^/.]+$/, ""); // remove file extension
        await cloudinary.uploader.destroy(publicId);
      }
    }

    const updateData = {
      ownerId,
      name,
      description,
      techStack,
    };

    if (req.file) {
      updateData.photo = req.file.path;
    }

    const updatedExp = await Experience.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });

    res.json({ message: "Experience Updated", experience: updatedExp });
  } catch (err) {
    console.error("Error updating experience:", err);
    res.status(500).json({ error: "Server Error" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const deletedExp = await Experience.findById(req.params.id);
    if (!deletedExp) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (deletedExp.photo) {
      const urlParts = deletedExp.photo.split("/");
      const folderNameIndex = urlParts.findIndex(part => part === "PortFolio_Builder");

      if (folderNameIndex !== -1) {
        const publicIdParts = urlParts.slice(folderNameIndex).join("/");
        const publicId = publicIdParts.replace(/\.[^/.]+$/, "");

        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Experience.findByIdAndDelete(req.params.id);

    res.json({ message: "Experience and associated image deleted successfully" });
  } catch (err) {
    console.log("Error deleting Experiencet:", err);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
