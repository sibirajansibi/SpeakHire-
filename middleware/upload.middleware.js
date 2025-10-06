const multer = require("multer");
const path = require("path");

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/videos/");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 1024 * 1024 * 100, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /mp4|mov|avi|wmv|flv|webm/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: Video files only!");
  },
});

module.exports = videoUpload;

