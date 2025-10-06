const Video = require("../models/video.model");
const { extractAudio } = require("../services/ffmpeg.service");
const { transcribeAudio } = require("../services/stt.service");
const { calculateFluencyScore } = require("../services/fluency.service");
const { categorizeRole } = require("../services/roleCategorization.service");
const path = require("path");
const fs = require("fs");

exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded." });
    }

    const userId = req.userId; // From auth middleware
    const videoPath = req.file.path;
    const audioFileName = `audio-${Date.now()}.mp3`;
    const audioPath = path.join("uploads", "audio", audioFileName);

    // Save initial video record to DB
    const newVideo = await Video.create(userId, videoPath, audioPath);

    // Process video asynchronously
    (async () => {
      try {
        console.log(`Starting audio extraction for video ${newVideo.id}`);
        await extractAudio(videoPath, audioPath);
        console.log(`Audio extraction complete for video ${newVideo.id}`);

        console.log(`Starting transcription for video ${newVideo.id}`);
        const transcript = await transcribeAudio(audioPath);
        console.log(`Transcription complete for video ${newVideo.id}`);

        const fluencyScore = calculateFluencyScore(transcript);
        const categorizedRole = categorizeRole(transcript);

        await Video.updateAnalysisResults(newVideo.id, transcript, fluencyScore, categorizedRole);
        console.log(`Analysis results updated for video ${newVideo.id}`);

        // Clean up audio file after processing
        fs.unlink(audioPath, (err) => {
          if (err) console.error(`Error deleting audio file ${audioPath}:`, err);
          else console.log(`Deleted audio file: ${audioPath}`);
        });

      } catch (err) {
        console.error(`Error during video processing for video ${newVideo.id}:`, err);
        // Optionally, update video status in DB to indicate failure
      }
    })();

    res.status(201).json({
      message: "Video uploaded and processing started successfully.",
      video: { id: newVideo.id, videoPath, audioPath },
    });
  } catch (error) {
    console.error("Video upload error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

