const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leave.controller");
const { verifyToken, checkRole } = require("../middleware/auth.middleware");

router.post(
  "/leave-requests",
  verifyToken,
  checkRole(["nurse"]),
  leaveController.createLeaveRequest
);

router.get(
  "/leave-requests",
  verifyToken,
  checkRole(["head_nurse"]),
  leaveController.getLeaveRequests
);

router.patch(
  "/leave-requests/:id/approve",
  verifyToken,
  checkRole(["head_nurse"]),
  leaveController.approveLeaveRequest
);

module.exports = router;
