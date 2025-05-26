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

router.get(
  "/nurses",
  verifyToken,
  checkRole(["head_nurse"]),
  userController.getNurses
);

module.exports = router;
