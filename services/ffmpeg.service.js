const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");

// Ensure ffmpeg path is set if not in system PATH
// ffmpeg.setFfmpegPath("/usr/bin/ffmpeg"); // Example for Linux
// ffmpeg.setFfprobePath("/usr/bin/ffprobe"); // Example for Linux

const extractAudio = (videoPath, outputAudioPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(outputAudioPath)
      .noVideo()
      .audioCodec("libmp3lame") // Convert to MP3
      .audioBitrate(128) // Set audio bitrate
      .on("end", () => {
        console.log(`Audio extracted to ${outputAudioPath}`);
        resolve(outputAudioPath);
      })
      .on("error", (err) => {
        console.error("Error extracting audio:", err);
        reject(err);
      })
      .run();
  });
};

module.exports = { extractAudio };

