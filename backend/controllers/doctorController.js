const Doctor = require("../models/Doctor");
function profile(account) {
  return {
    id: String(account._id),
    fullName: account.fullName,
    email: account.email,
    specialization: account.specialization,
    hospital: account.hospital,
    licenseNumber: account.licenseNumber
  };
}
exports.getMyProfile = (req, res) => {
  res.set("Cache-Control", "no-store");
  if (req.accountType !== "doctor") return res.status(403).json({
    message: "A doctor account is required."
  });
  res.json({
    doctor: profile(req.account)
  });
};
exports.updateDoctorProfile = async (req, res) => {
  res.set("Cache-Control", "no-store");
  if (req.accountType !== "doctor") return res.status(403).json({
    message: "A doctor account is required."
  });
  const fields = {
    fullName: 160,
    email: 254,
    specialization: 160,
    hospital: 160,
    licenseNumber: 64
  };
  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body) || !Object.keys(body).length || Object.keys(body).some(key => !Object.hasOwn(fields, key) || typeof body[key] !== "string" || !body[key].trim() || body[key].trim().length > fields[key])) {
    return res.status(400).json({
      message: "Please check the supported profile fields."
    });
  }
  const updates = Object.fromEntries(Object.entries(body).map(([key, value]) => [key, key === "email" ? value.trim().toLowerCase() : value.trim()]));
  if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) return res.status(400).json({
    message: "Enter a valid email address."
  });
  if (Object.keys(updates).some(key => updates[key] !== req.account[key])) updates.verified = false;
  try {
    const updated = await Doctor.findByIdAndUpdate(req.account._id, {
      $set: updates
    }, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({
      message: "Doctor account not found."
    });
    res.json({
      message: "Profile updated",
      updatedDoctor: profile(updated)
    });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({
      message: "That email or license number is already in use."
    });
    if (error.name === "ValidationError") return res.status(400).json({
      message: "Please check your profile details."
    });
    console.warn("[Zoi doctor portal] PROFILE_UPDATE_UNAVAILABLE");
    res.status(503).json({
      message: "Profile updates are unavailable. Please try again."
    });
  }
};
