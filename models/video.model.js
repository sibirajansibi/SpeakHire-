const pool = require("../config/db.config");

const Video = {};

Video.create = async (userId, videoPath, audioPath) => {
  const [result] = await pool.execute(
    "INSERT INTO videos (user_id, video_path, audio_path) VALUES (?, ?, ?)",
    [userId, videoPath, audioPath]
  );
  return { id: result.insertId, userId, videoPath, audioPath };
};

Video.updateAnalysisResults = async (videoId, transcript, fluencyScore, categorizedRole) => {
  await pool.execute(
    "UPDATE videos SET transcript = ?, fluency_score = ?, categorized_role = ? WHERE id = ?",
    [transcript, fluencyScore, categorizedRole, videoId]
  );
  return { videoId, transcript, fluencyScore, categorizedRole };
};

Video.findByUserId = async (userId) => {
  const [rows] = await pool.execute("SELECT * FROM videos WHERE user_id = ?", [userId]);
  return rows;
};

Video.findById = async (videoId) => {
  const [rows] = await pool.execute("SELECT * FROM videos WHERE id = ?", [videoId]);
  return rows[0];
};

Video.findAll = async () => {
  const [rows] = await pool.execute("SELECT v.*, u.name as userName, u.email as userEmail FROM videos v JOIN users u ON v.user_id = u.id");
  return rows;
};

module.exports = Video;

