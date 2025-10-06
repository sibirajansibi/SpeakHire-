const Video = require("../models/video.model");

exports.getAllCandidateVideos = async (req, res) => {
  try {
    const videos = await Video.findAll();

    if (!videos || videos.length === 0) {
      return res.status(404).json({ message: "No candidate videos found." });
    }

    res.status(200).json(videos);
  } catch (error) {
    console.error("Error fetching all candidate videos for recruiter:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

