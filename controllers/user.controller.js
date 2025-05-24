const db = require("../config/db");

exports.getUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.user_id, u.name, u.email, u.role 
      FROM tb_users u`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
