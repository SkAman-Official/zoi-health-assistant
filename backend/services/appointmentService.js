const jwt = require("jsonwebtoken");
const {
  randomUUID,
  createHash
} = require("node:crypto");
const WORKING_HOURS = Object.freeze(["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "14:00", "14:30", "15:00", "15:30"]);
class BookingError extends Error {
  constructor(code, status = 400) {
    super(code);
    this.code = code;
    this.status = status;
  }
}
const objectId = value => typeof value === "string" && /^[a-f\d]{24}$/i.test(value);
const normalizeName = name => String(name || "").replace(/^Dr\.?\s+/i, "").trim();
const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const nameRegex = name => new RegExp(`^(?:Dr\\.?\\s+)?${escapeRegex(normalizeName(name))}$`, "i");
const doctorVersion = doctor => createHash("sha256").update(JSON.stringify([doctor.fullName, doctor.hospital])).digest("hex");
function todayIST(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(now);
}
function validateDate(date, now = new Date()) {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new BookingError("INVALID_DATE");
  const stamp = new Date(`${date}T00:00:00Z`);
  if (!Number.isFinite(stamp.getTime()) || stamp.toISOString().slice(0, 10) !== date || date < todayIST(now)) throw new BookingError("INVALID_DATE");
  const last = new Date(`${todayIST(now)}T00:00:00Z`);
  last.setUTCDate(last.getUTCDate() + 90);
  if (date > last.toISOString().slice(0, 10)) throw new BookingError("INVALID_DATE");
  return date;
}
function validateSlot(date, time, now = new Date()) {
  validateDate(date, now);
  if (!WORKING_HOURS.includes(time)) throw new BookingError("INVALID_TIME");
  if (new Date(`${date}T${time}:00+05:30`) <= now) throw new BookingError("INVALID_TIME");
}
function publicDoctor(doctor) {
  return {
    id: String(doctor._id),
    name: doctor.fullName,
    specialty: doctor.specialization,
    hospital: doctor.hospital
  };
}
function slotFilter(doctor, date) {
  return {
    date,
    status: {
      $ne: "Rejected"
    },
    $or: [{
      doctorId: doctor._id
    }, {
      doctorId: {
        $exists: false
      },
      doctor: nameRegex(doctor.fullName)
    }]
  };
}
function createAppointmentService({
  Appointment,
  Doctor,
  notify = async () => {},
  now = () => new Date(),
  secret = () => process.env.JWT_SECRET
}) {
  let indexes;
  async function registeredDoctor(id) {
    if (!objectId(id)) throw new BookingError("DOCTOR_NOT_FOUND", 404);
    const doctor = await Doctor.findById(id);
    if (!doctor) throw new BookingError("DOCTOR_NOT_FOUND", 404);
    return doctor;
  }
  async function resolveDoctor(body) {
    if (body.doctorId) return registeredDoctor(body.doctorId);
    if (typeof body.doctor !== "string" || !body.doctor.trim() || body.doctor.length > 160) throw new BookingError("DOCTOR_NOT_FOUND", 404);
    const filter = {
      fullName: nameRegex(body.doctor)
    };
    if (typeof body.hospital === "string" && body.hospital.trim()) filter.hospital = body.hospital.trim();
    const doctors = await Doctor.find(filter).limit(2);
    if (!doctors.length) throw new BookingError("DOCTOR_NOT_FOUND", 404);
    if (doctors.length !== 1) throw new BookingError("DOCTOR_AMBIGUOUS", 409);
    return doctors[0];
  }
  async function availableSlots(doctor, date) {
    validateDate(date, now());
    const appointments = await Appointment.find(slotFilter(doctor, date)).select("time -_id").lean();
    const occupied = new Set(appointments.map(appointment => appointment.time));
    return WORKING_HOURS.filter(time => !occupied.has(time) && new Date(`${date}T${time}:00+05:30`) > now());
  }
  function signReview(userId, doctor, date, time) {
    validateSlot(date, time, now());
    return jwt.sign({
      kind: "booking-review",
      doctorId: String(doctor._id),
      doctorVersion: doctorVersion(doctor),
      date,
      time
    }, secret(), {
      algorithm: "HS256",
      issuer: "zoi-booking",
      audience: String(userId),
      expiresIn: "10m",
      jwtid: randomUUID()
    });
  }
  function verifyReview(token, userId) {
    if (typeof token !== "string" || token.length > 2000) throw new BookingError("REVIEW_EXPIRED", 409);
    try {
      const value = jwt.verify(token, secret(), {
        algorithms: ["HS256"],
        issuer: "zoi-booking",
        audience: String(userId)
      });
      if (value.kind !== "booking-review" || !value.jti || !objectId(value.doctorId)) throw new Error();
      return value;
    } catch {
      throw new BookingError("REVIEW_EXPIRED", 409);
    }
  }
  async function book({
    user,
    doctor,
    date,
    time,
    phone,
    reason = "",
    paymentMethod = "cash",
    isFirstVisit = true,
    requestKey
  }) {
    const contactPhone = typeof phone === "string" ? phone.trim() : String(user.phone || "").trim();
    const digits = contactPhone.replace(/\D/g, "");
    if (!user.name || !user.email || !/^[+\d][\d ()-]{6,24}$/.test(contactPhone) || digits.length < 7 || digits.length > 15) throw new BookingError("CONTACT_REQUIRED");
    if (typeof reason !== "string" || reason.length > 1000) throw new BookingError("INVALID_BOOKING");
    // Await index creation before accepting writes; fail closed if protection cannot be installed.
    if (!indexes) indexes = Appointment.createIndexes().catch(error => {
      indexes = null;
      throw error;
    });
    await indexes;
    if (requestKey) {
      const previous = await Appointment.findOne({
        bookingRequestKey: requestKey,
        userId: user._id
      });
      if (previous) return {
        appointment: previous,
        replayed: true
      };
    }
    validateSlot(date, time, now());
    if (!(await availableSlots(doctor, date)).includes(time)) throw new BookingError("SLOT_TAKEN", 409);
    let appointment;
    try {
      appointment = await Appointment.create({
        name: user.name,
        email: user.email,
        phone: contactPhone,
        hospital: doctor.hospital,
        doctor: normalizeName(doctor.fullName),
        doctorId: doctor._id,
        userId: user._id,
        date,
        time,
        reason: reason.trim(),
        paymentMethod: ["cash", "insurance", "card"].includes(paymentMethod) ? paymentMethod : "cash",
        isFirstVisit: isFirstVisit === true,
        status: "Scheduled",
        slotReserved: true,
        ...(requestKey ? {
          bookingRequestKey: requestKey
        } : {})
      });
    } catch (error) {
      if (error.code !== 11000) throw error;
      const previous = requestKey && (await Appointment.findOne({
        bookingRequestKey: requestKey,
        userId: user._id
      }));
      if (previous) return {
        appointment: previous,
        replayed: true
      };
      throw new BookingError("SLOT_TAKEN", 409);
    }
    // Email delivery cannot turn a saved booking into a reported failure.
    Promise.resolve().then(() => notify(appointment, doctor)).catch(() => console.warn("[Zoi booking] EMAIL_DELIVERY_FAILED"));
    return {
      appointment,
      replayed: false
    };
  }
  async function ownedDoctorFilter(account) {
    const legacy = {
      doctorId: {
        $exists: false
      },
      doctor: nameRegex(account.fullName),
      hospital: account.hospital
    };
    const count = await Doctor.countDocuments({
      fullName: nameRegex(account.fullName),
      hospital: account.hospital
    });
    return count === 1 ? {
      $or: [{
        doctorId: account._id
      }, legacy]
    } : {
      doctorId: account._id
    };
  }
  return {
    registeredDoctor,
    resolveDoctor,
    availableSlots,
    signReview,
    verifyReview,
    book,
    ownedDoctorFilter
  };
}
module.exports = {
  BookingError,
  WORKING_HOURS,
  objectId,
  normalizeName,
  nameRegex,
  doctorVersion,
  todayIST,
  validateDate,
  validateSlot,
  publicDoctor,
  createAppointmentService
};
