const express = require("express");
const router = express.Router();
const recruiterController = require("../controllers/recruiter.controller");
const { verifyToken, isRecruiter } = require("../middleware/auth.middleware");

router.get("/candidates", [verifyToken, isRecruiter], recruiterController.getAllCandidateVideos);

module.exports = router;

