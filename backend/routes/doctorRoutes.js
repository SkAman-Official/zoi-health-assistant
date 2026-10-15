// src/routes/doctorRoutes.js
const express = require("express");
const router = express.Router();
const {
  updateDoctorProfile,
  getMyProfile
} = require("../controllers/doctorController");
const authMiddleware = require("../middleware/auth"); // ✅ Make sure this works for doctor JWTs

// PUT /api/doctors/update
router.put("/update", authMiddleware, updateDoctorProfile);
router.get("/me", authMiddleware, getMyProfile);
router.get("/test", (req, res) => {
  res.send("Doctor routes working!");
});
module.exports = router;
