const express = require("express");
const router = express.Router();
const shiftController = require("../controllers/shift.controller");
const { verifyToken, checkRole } = require("../middleware/auth.middleware");

router.post(
  "/shifts",
  verifyToken,
  checkRole(["head_nurse"]),
  shiftController.createShift
);

router.get(
  "/shifts",
  verifyToken,
  checkRole(["head_nurse"]),
  shiftController.getShifts
);

router.post(
  "/shifts-assignments",
  verifyToken,
  checkRole(["head_nurse"]),
  shiftController.assignShift
);

router.get(
  "/shifts-assignments",
  verifyToken,
  checkRole(["head_nurse"]),
  shiftController.getShiftAssignments
);

router.get(
  "/my-schedule",
  verifyToken,
  checkRole(["nurse"]),
  shiftController.getMySchedule
);

module.exports = router;
