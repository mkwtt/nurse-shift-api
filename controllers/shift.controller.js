const db = require("../config/db");

exports.createShift = async (req, res) => {
  const { date, start_time, end_time } = req.body;
  try {
    const [existing] = await db.query(
      "SELECT * FROM tb_shifts WHERE date = ? AND start_time = ? AND end_time = ?",
      [date, start_time, end_time]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: "Shift already exists" });
    }

    await db.query(
      "INSERT INTO tb_shifts (date, start_time, end_time) VALUES (?, ?, ?)",
      [date, start_time, end_time]
    );
    res.status(201).json({ message: "Shift created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.assignShift = async (req, res) => {
  const { user_id, shift_id } = req.body;
  try {
    const [users] = await db.query(
      "SELECT role FROM tb_users WHERE user_id = ?",
      [user_id]
    );
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    if (users[0].role !== "nurse") {
      return res
        .status(403)
        .json({ error: "Only nurses can be assigned shifts" });
    }

    const [existing] = await db.query(
      "SELECT * FROM tb_shift_assignments WHERE user_id = ? AND shift_id = ?",
      [user_id, shift_id]
    );
    if (existing.length > 0) {
      return res
        .status(400)
        .json({ error: "Shift already assigned to this user" });
    }

    await db.query(
      "INSERT INTO tb_shift_assignments (user_id, shift_id) VALUES (?, ?)",
      [user_id, shift_id]
    );
    res.status(201).json({ message: "Shift assigned" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMySchedule = async (req, res) => {
  const nurseId = req.user.user_id;
  try {
    const [rows] = await db.query(
      `SELECT s.date, s.start_time, s.end_time
            FROM tb_shifts s
            JOIN tb_shift_assignments sa ON s.shift_id = sa.shift_id
            WHERE sa.user_id = ?`,
      [nurseId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
