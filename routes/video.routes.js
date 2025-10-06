const express = require("express");
const router = express.Router();
const videoController = require("../controllers/video.controller");
const videoUpload = require("../middleware/upload.middleware");
const { verifyToken, isCandidate } = require("../middleware/auth.middleware");

router.post("/upload", [verifyToken, isCandidate, videoUpload.single("video")], videoController.uploadVideo);

module.exports = router;

