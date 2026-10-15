const Patient = require("../models/User"); // Assuming Patient is a User model or similar
const Appointment = require("../models/Appointment");
const {
  bookingService
} = require("./appointmentController");
const {
  objectId
} = require("../services/appointmentService");
exports.getPatientById = async (req, res) => {
  res.set("Cache-Control", "no-store");
  if (req.accountType !== "doctor") return res.status(403).json({
    message: "A doctor account is required."
  });
  if (!objectId(req.params.id)) return res.status(400).json({
    message: "Invalid patient ID."
  });
  try {
    const patientId = req.params.id;
    const owner = await bookingService.ownedDoctorFilter(req.account);
    const filter = {
      ...owner,
      userId: patientId
    };
    // Check the relationship before looking up any account information.
    if (!(await Appointment.exists(filter))) return res.status(404).json({
      message: "Patient not found in your appointments."
    });
    const patient = await Patient.findById(patientId).select("name email phone").lean();
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }
    const appointments = await Appointment.find(filter).sort({
      date: -1,
      time: -1
    }).select("name doctor hospital date time status reason phone createdAt").lean().maxTimeMS(5000);
    res.status(200).json({
      success: true,
      data: patient,
      appointments
    });
  } catch (error) {
    console.warn("[Zoi doctor portal] PATIENT_DATA_UNAVAILABLE");
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
