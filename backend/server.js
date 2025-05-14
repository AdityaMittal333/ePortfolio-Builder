const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const projectRoutes = require("./routes/projects");
const experienceRoutes = require("./routes/experience");
const certificateRoutes = require("./routes/certificate");
const videoRoutes = require("./routes/video");
const profileRoutes = require("./routes/profile");

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/projects", projectRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/certificate", certificateRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/profile",profileRoutes);

app.get("/", (req, res) => {
  res.send("API is Running...");
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Mongo Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Failed", err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
