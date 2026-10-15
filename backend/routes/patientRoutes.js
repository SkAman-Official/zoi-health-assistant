const express = require("express");
const router = express.Router();
const {
  getPatientById
} = require("../controllers/patientController");
const authMiddleware = require("../middleware/auth");
router.get("/:id", authMiddleware, getPatientById);
module.exports = router;
