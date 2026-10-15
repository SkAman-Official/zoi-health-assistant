const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const {
  sendUserAppointmentEmail,
  sendDoctorNotificationEmail
} = require("../utils/email");
const {
  BookingError,
  objectId,
  normalizeName,
  doctorVersion,
  createAppointmentService
} = require("../services/appointmentService");
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
})[character]);
const service = createAppointmentService({
  Appointment,
  Doctor,
  notify: async (appointment, doctor) => {
    const details = Object.fromEntries(["name", "doctor", "hospital", "date", "time", "reason", "email", "phone"].map(key => [key, escapeHtml(appointment[key])]));
    details.isFirstVisit = appointment.isFirstVisit;
    const results = await Promise.allSettled([sendUserAppointmentEmail(appointment.email, details), ...(doctor.email ? [sendDoctorNotificationEmail(doctor.email, details)] : [])]);
    if (results.some(result => result.status === "rejected")) throw new Error("EMAIL_DELIVERY_FAILED");
  }
});
const messages = {
  INVALID_DATE: "Choose a valid date within the next 90 days (India time).",
  INVALID_TIME: "Choose a future time within Zoi's booking slots.",
  DOCTOR_NOT_FOUND: "This doctor is not registered for booking in Zoi.",
  DOCTOR_AMBIGUOUS: "More than one doctor matches. Please select a specific doctor.",
  SLOT_TAKEN: "This time slot is already booked. Please choose another.",
  CONTACT_REQUIRED: "A valid contact phone number is required.",
  INVALID_BOOKING: "Please check the appointment details.",
  REVIEW_EXPIRED: "This booking review is invalid or expired. Please review the appointment again."
};
function respondError(res, error) {
  if (error instanceof BookingError) return res.status(error.status).json({
    code: error.code,
    message: messages[error.code]
  });
  console.warn("[Zoi booking] BOOKING_UNAVAILABLE");
  return res.status(503).json({
    code: "BOOKING_UNAVAILABLE",
    message: "Appointments are unavailable right now. Please try again."
  });
}
function requireRole(req, res, role) {
  if (req.accountType === role) return true;
  res.status(403).json({
    code: "BOOKING_FORBIDDEN",
    message: role === "doctor" ? "A doctor account is required." : "Please sign in with a patient account to book."
  });
  return false;
}
exports.createAppointment = async (req, res) => {
  if (!requireRole(req, res, "user")) return;
  try {
    const body = req.body || {};
    const doctor = await service.resolveDoctor(body);
    const {
      appointment
    } = await service.book({
      user: req.user,
      doctor,
      date: body.date,
      time: body.time,
      phone: body.phone,
      reason: body.reason,
      paymentMethod: body.paymentMethod,
      isFirstVisit: body.isFirstVisit
    });
    res.status(201).json({
      message: "Appointment scheduled, subject to doctor approval.",
      appointmentId: appointment._id,
      status: appointment.status
    });
  } catch (error) {
    respondError(res, error);
  }
};
exports.confirmChatAppointment = async (req, res) => {
  if (!requireRole(req, res, "user")) return;
  res.set("Cache-Control", "no-store");
  try {
    const review = service.verifyReview(req.body?.confirmationToken, req.user._id);
    const doctor = await service.registeredDoctor(review.doctorId);
    if (review.doctorVersion !== doctorVersion(doctor)) throw new BookingError("REVIEW_EXPIRED", 409);
    const {
      appointment,
      replayed
    } = await service.book({
      user: req.user,
      doctor,
      date: review.date,
      time: review.time,
      phone: req.body?.phone,
      requestKey: `${req.user._id}:${review.jti}`
    });
    res.status(replayed ? 200 : 201).json({
      appointment: {
        id: String(appointment._id),
        doctor: appointment.doctor,
        hospital: appointment.hospital,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status
      }
    });
  } catch (error) {
    respondError(res, error);
  }
};
exports.getAppointmentsByDoctor = async (req, res) => {
  if (!requireRole(req, res, "doctor")) return;
  if (normalizeName(req.params.doctorName).toLowerCase() !== normalizeName(req.account.fullName).toLowerCase()) {
    return res.status(403).json({
      message: "You can only view your own appointments."
    });
  }
  try {
    const filter = await service.ownedDoctorFilter(req.account);
    const appointments = await Appointment.find(filter).sort({
      createdAt: -1
    }).populate("userId", "name email phone").select("userId doctor date time status createdAt");
    res.status(200).json(appointments);
  } catch (error) {
    respondError(res, error);
  }
};
exports.getMyAppointments = async (req, res) => {
  if (!requireRole(req, res, "doctor")) return;
  res.set("Cache-Control", "no-store");
  try {
    const filter = await service.ownedDoctorFilter(req.account);
    const appointments = await Appointment.find(filter).sort({
      date: -1,
      time: -1
    }).populate("userId", "name email phone").select("name email phone userId doctor hospital date time status reason createdAt").lean().maxTimeMS(5000);
    res.json(appointments);
  } catch (error) {
    respondError(res, error);
  }
};
async function updateStatus(req, res, status) {
  if (!requireRole(req, res, "doctor")) return;
  if (!objectId(req.params.id)) return res.status(400).json({
    message: "Invalid appointment ID."
  });
  try {
    const owner = await service.ownedDoctorFilter(req.account);
    const appointment = await Appointment.findOneAndUpdate({
      _id: req.params.id,
      ...owner,
      status: {
        $in: ["Scheduled", "Pending", "Rescheduled"]
      }
    }, {
      $set: {
        status,
        slotReserved: status !== "Rejected"
      }
    }, {
      new: true,
      runValidators: true
    });
    if (!appointment) return res.status(404).json({
      message: "No pending appointment found for your account."
    });
    res.json({
      success: true,
      message: status === "Approved" ? "Appointment approved" : "Appointment rejected"
    });
  } catch (error) {
    respondError(res, error);
  }
}
exports.approveAppointment = (req, res) => updateStatus(req, res, "Approved");
exports.rejectAppointment = (req, res) => updateStatus(req, res, "Rejected");
exports.bookingService = service;
exports.respondBookingError = respondError;
