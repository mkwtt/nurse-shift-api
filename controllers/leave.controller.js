const db = require("../config/db");

exports.createLeaveRequest = async (req, res) => {
  const { shift_assignment_id, reason } = req.body;
  const user_id = req.user.user_id;

  try {
    const [existing] = await db.query(
      "SELECT * FROM tb_leave_requests WHERE shift_assignment_id = ?",
      [shift_assignment_id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: "This request already submitted" });
    }

    const [rows] = await db.query(
      "SELECT * FROM tb_shift_assignments WHERE shift_assignment_id = ? AND user_id = ?",
      [shift_assignment_id, user_id]
    );

    if (rows.length === 0) {
      return res
        .status(403)
        .json({ error: "You can only request leave for your own shifts" });
    }

    await db.query(
      "INSERT INTO tb_leave_requests (shift_assignment_id, reason) VALUES (?, ?)",
      [shift_assignment_id, reason]
    );

    res.status(201).json({ message: "Leave request submitted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyLeaveRequest = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const [rows] = await db.query(
      `
      SELECT lr.leave_request_id, lr.shift_assignment_id, lr.reason, lr.status, u.name AS approved_by 
      FROM tb_leave_requests lr
      JOIN tb_shift_assignments sa ON lr.shift_assignment_id = sa.shift_assignment_id
      LEFT JOIN tb_users u ON lr.approved_by = u.user_id
      WHERE sa.user_id = ?
      `,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLeaveRequests = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT lr.leave_request_id, sa.shift_assignment_id, u.name, s.date, s.start_time, s.end_time, lr.reason, lr.status
            FROM tb_leave_requests lr
            JOIN tb_shift_assignments sa ON lr.shift_assignment_id = sa.shift_assignment_id
            JOIN tb_users u ON sa.user_id = u.user_id
            JOIN tb_shifts s ON sa.shift_id = s.shift_id
            ORDER BY s.date ASC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approveLeaveRequest = async (req, res) => {
  const leaveRequestId = req.params.id;
  const { status } = req.body;
  const approverId = req.user.user_id;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM tb_leave_requests WHERE leave_request_id = ?",
      [leaveRequestId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Leave request not found" });
    }

    if (rows[0].status !== "pending") {
      return res
        .status(400)
        .json({ error: "This request has already been processed" });
    }

    await db.query(
      `UPDATE tb_leave_requests
        SET status = ?, approved_by = ?
        WHERE leave_request_id = ?`,
      [status, approverId, leaveRequestId]
    );

    res.json({ message: `Leave request ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
