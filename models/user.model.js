const pool = require("../config/db.config");

const User = {};

User.create = async (name, email, password, role) => {
  const [result] = await pool.execute(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, password, role]
  );
  return { id: result.insertId, name, email, role };
};

User.findByEmail = async (email) => {
  const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

User.findById = async (id) => {
  const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};

module.exports = User;

