const Video = require("../models/video.model");

exports.getCandidateVideos = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const videos = await Video.findByUserId(userId);

    if (!videos || videos.length === 0) {
      return res.status(404).json({ message: "No videos found for this candidate." });
    }

    res.status(200).json(videos);
  } catch (error) {
    console.error("Error fetching candidate videos:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

