const express = require("express");
const router = express.Router();
const Project = require("../models/ProjectSchema");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
const { cloudinary } = require("../cloudConfig"); 

//route to show all submitted projects
router.get("/",async(req,res)=>{
  try{
    const ownerId = req.headers.ownerid;
    const projects=await Project.find({ownerId});
    console.log(projects);
    res.json(projects);
  }
  catch(err){
    console.log("Error fetching projects:",err);
    res.status(500).json({error:"Server error"});
  }
});

// route to save project
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const {ownerId, name, description, githubLink, deployLink, techStack } = req.body;
    const newProject = new Project({
      ownerId,
      name,
      description,
      githubLink,
      deployLink,
      techStack,
      photo: req.file?.path || null, 
    });

    await newProject.save();
    console.log("✅ Project saved:", newProject);
    res.status(201).json({ message: "Project added", project: newProject });
  } catch (err) {
    console.error("❌ Error saving project:", err);
    res.status(500).json({ error: "Server error" });
  }
});


//route to show particular project
router.get("/:id",async(req,res)=>{
  try{
    const project=await Project.findById(req.params.id);
    if(!project){
      return res.status(404).json({error:"Project not found"});
    }
    res.json(project);
  }
  catch(err){
    console.log("Error fetching project:",err);
    res.status(500).json({error:"Server error"});
  }
});


//edit route 
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const ownerId = req.headers.ownerid;
    const { name, description, githubLink, deployLink, techStack } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // If a new image is uploaded and there's an existing image, delete the old image from Cloudinary
    if (req.file && project.photo) {
      const urlParts = project.photo.split("/");
      const folderNameIndex = urlParts.findIndex(part => part === "PortFolio_Builder");

      if (folderNameIndex !== -1) {
        const publicIdParts = urlParts.slice(folderNameIndex).join("/");
        const publicId = publicIdParts.replace(/\.[^/.]+$/, ""); // remove file extension
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // Prepare updated data
    const updatedData = {
      ownerId,
      name,
      description,
      githubLink,
      deployLink,
      techStack,
    };

    if (req.file) {
      updatedData.photo = req.file.path;
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    res.json({ message: "Project Updated", project: updatedProject });
  } catch (err) {
    console.log("❌ Error updating project:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // If project has a photo, delete it from Cloudinary
    if (project.photo) {
      const urlParts = project.photo.split("/");
      const folderNameIndex = urlParts.findIndex(part => part === "PortFolio_Builder");

      if(folderNameIndex!==-1){
        const publicIdParts = urlParts.slice(folderNameIndex).join("/");
        const publicId = publicIdParts.replace(/\.[^/.]+$/, "");

        await cloudinary.uploader.destroy(publicId);
      }
    }

    // After deleting image, delete project from database
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: "Project and associated image deleted successfully" });
  } catch (err) {
    console.log("Error deleting project:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
