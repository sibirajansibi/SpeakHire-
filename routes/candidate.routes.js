const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidate.controller");
const { verifyToken, isCandidate } = require("../middleware/auth.middleware");

router.get("/videos", [verifyToken, isCandidate], candidateController.getCandidateVideos);

module.exports = router;

