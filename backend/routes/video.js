const express = require("express");
const router = express.Router();
const Video = require("../models/videoSchema"); // Import Video model
const multer = require("multer");
const { storage } = require("../cloudConfig2");
const upload = multer({ storage });
const { cloudinary } = require("../cloudConfig2");

// Route to show all videos
router.get("/", async (req, res) => {
  try {
    const ownerId = req.headers.ownerid;
    const videos = await Video.find({ownerId});
    res.json(videos);
  } catch (err) {
    console.log("Error fetching videos:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to save a video
router.post("/create", upload.single("video"), async (req, res) => {
  try {
    const {ownerId, name, description } = req.body;

    const newVideo = new Video({
      ownerId,
      name,
      description,
      video:req.file?.path || null,
    });

    // Save the new video document
    await newVideo.save();
    console.log("✅ Video saved:", newVideo);
    res.status(201).json({ message: "Video added", video: newVideo });
  } catch (err) {
    console.error("❌ Error saving video:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to show a particular video
router.get("/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.json(video);
  } catch (err) {
    console.log("Error fetching video:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Edit route to update a video
router.put("/:id", upload.single("video"), async (req, res) => {
  try {
    const ownerId = req.headers.ownerid;
    const { name, description } = req.body;
    const videoo = await Video.findById(req.params.id);
    if(!videoo){
      return res.status(404).json({ error: "Project not found" });
    }


    if (req.file && videoo.video) {
    try {
      const videoUrl = videoo.video;
      const url = new URL(videoUrl);
      const pathname = url.pathname; // e.g., /video/upload/v1747205943/PortFolio_Builder/filename.mov

      // Remove the version and extension to get the public ID
      const parts = pathname.split("/");
      const uploadIndex = parts.findIndex(part => part === "upload");

      if (uploadIndex !== -1) {
        const publicIdWithExt = parts.slice(uploadIndex + 2).join("/"); // skip 'upload' and 'v123456'
        const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ""); // remove extension like .mov

        await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
        console.log("Old video deleted:", publicId);
      }
    } catch (err) {
      console.error("Failed to delete old video:", err);
    }
  }

  const updatedData = {
      ownerId,
      name,
      description,
  };
    
    if (req.file) {
      updatedData.video = req.file.path; // Use the Cloudinary URL
    }

    // Update video document in MongoDB
    const updatedVideo = await Video.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    res.json({ message: "Video updated", video: updatedVideo });
  } catch (err) {
    console.log("Error updating video:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to delete a video
router.delete("/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    // Extract public_id from the full Cloudinary URL
    const videoUrl = video.video;

    try {
      const url = new URL(videoUrl);
      const pathname = url.pathname; // e.g., /video/upload/v1747205943/PortFolio_Builder/abc123.mov

      const parts = pathname.split("/");
      const uploadIndex = parts.findIndex(part => part === "upload");

      if (uploadIndex !== -1) {
        const publicIdWithExt = parts.slice(uploadIndex + 2).join("/"); // Skip 'upload' and version number (e.g., v1747205943)
        const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ""); // Remove extension (.mov, .mp4, etc.)

        // Delete video from Cloudinary
        await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
        console.log("Deleted video from Cloudinary:", publicId);
      }
    } catch (err) {
      console.error("Failed to extract or delete video from Cloudinary:", err);
    }

    // Delete MongoDB document
    await Video.findByIdAndDelete(req.params.id);

    res.json({ message: "Video and associated Cloudinary file deleted successfully" });
  } catch (err) {
    console.log("Error deleting video:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
