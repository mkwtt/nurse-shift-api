require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;

app.use(cors());

app.use(express.json());

// Routes
const userRoutes = require("./routes/user.routes");
const shiftRoutes = require("./routes/shift.routes");
const leaveRoutes = require("./routes/leave.routes");
const authRoutes = require("./routes/auth.routes");

app.use("/api/users", userRoutes);
app.use("/api", shiftRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
