require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

// Routes
// const userRoutes = require("./routes/users.routes");
const shiftRoutes = require("./routes/shift.routes");
const leaveRoutes = require("./routes/leave.routes");
const authRoutes = require("./routes/auth.routes");

// app.use("/api/users", userRoutes);
app.use("/api", shiftRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
