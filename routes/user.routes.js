const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken, checkRole } = require("../middleware/auth.middleware");

router.get(
  "/view-users",
  verifyToken,
  checkRole(["head_nurse"]),
  userController.getUsers
);

module.exports = router;
