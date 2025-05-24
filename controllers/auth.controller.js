const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const SECRET_KEY = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!["nurse", "head_nurse"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const [existing] = await db.query(
      "SELECT * FROM tb_users WHERE email = ?",
      [email]
    );
    if (existing.length > 0)
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO tb_users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashed, role]
    );

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM tb_users WHERE email = ?", [
      email,
    ]);
    const user = users[0];
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ user_id: user.user_id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { user_id: user.user_id, name: user.name, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
