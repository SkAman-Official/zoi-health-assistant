const test = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
const controller = require("../controllers/appointmentController");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
function response() {
  return {
    statusCode: 200,
    status(value) {
      this.statusCode = value;
      return this;
    },
    json(value) {
      this.body = value;
      return this;
    },
    set() {
      return this;
    }
  };
}
test("patient accounts cannot read, approve or reject doctor appointments", async () => {
  for (const action of [controller.getAppointmentsByDoctor, controller.approveAppointment, controller.rejectAppointment]) {
    const res = response();
    await action({
      accountType: "user",
      params: {
        id: "aaaaaaaaaaaaaaaaaaaaaaaa",
        doctorName: "Other Doctor"
      }
    }, res);
    assert.equal(res.statusCode, 403);
  }
});
test("doctor accounts cannot create patient bookings or read another doctor's list", async () => {
  for (const action of [controller.createAppointment, controller.confirmChatAppointment]) {
    const res = response();
    await action({
      accountType: "doctor"
    }, res);
    assert.equal(res.statusCode, 403);
  }
  const res = response();
  await controller.getAppointmentsByDoctor({
    accountType: "doctor",
    account: {
      fullName: "Own Doctor"
    },
    params: {
      doctorName: "Other Doctor"
    }
  }, res);
  assert.equal(res.statusCode, 403);
});
test("approval and rejection always include authenticated ownership in the database update", async t => {
  const originalCount = Doctor.countDocuments;
  const originalUpdate = Appointment.findOneAndUpdate;
  t.after(() => {
    Doctor.countDocuments = originalCount;
    Appointment.findOneAndUpdate = originalUpdate;
  });
  Doctor.countDocuments = async () => 2; // Ambiguous legacy name; only stable ID ownership is accepted.
  for (const [action, status] of [[controller.approveAppointment, "Approved"], [controller.rejectAppointment, "Rejected"]]) {
    let filter;
    let update;
    Appointment.findOneAndUpdate = async (query, value) => {
      filter = query;
      update = value;
      return null;
    };
    const res = response();
    await action({
      accountType: "doctor",
      account: {
        _id: "aaaaaaaaaaaaaaaaaaaaaaaa",
        fullName: "Demo Doctor",
        hospital: "Demo Clinic"
      },
      params: {
        id: "cccccccccccccccccccccccc"
      }
    }, res);
    assert.equal(filter.doctorId, "aaaaaaaaaaaaaaaaaaaaaaaa");
    assert.equal(update.$set.status, status);
    assert.equal(update.$set.slotReserved, status !== "Rejected");
    assert.equal(res.statusCode, 404);
  }
});
test("a confirmation issued to another account fails before any doctor query or booking", async t => {
  const previous = process.env.JWT_SECRET;
  process.env.JWT_SECRET = "synthetic-controller-secret";
  t.after(() => {
    if (previous === undefined) delete process.env.JWT_SECRET;else process.env.JWT_SECRET = previous;
  });
  const token = jwt.sign({
    kind: "booking-review",
    doctorId: "aaaaaaaaaaaaaaaaaaaaaaaa",
    jti: "test-request"
  }, process.env.JWT_SECRET, {
    issuer: "zoi-booking",
    audience: "different-user",
    expiresIn: "10m"
  });
  const res = response();
  await controller.confirmChatAppointment({
    accountType: "user",
    user: {
      _id: "bbbbbbbbbbbbbbbbbbbbbbbb"
    },
    body: {
      confirmationToken: token
    }
  }, res);
  assert.equal(res.statusCode, 409);
  assert.equal(res.body.code, "REVIEW_EXPIRED");
});
test("confirmation uses the signed review and authenticated patient, ignoring client overrides", async t => {
  const service = controller.bookingService;
  const original = {
    verifyReview: service.verifyReview,
    registeredDoctor: service.registeredDoctor,
    book: service.book
  };
  t.after(() => Object.assign(service, original));
  const {
    doctorVersion
  } = require("../services/appointmentService");
  const doctor = {
    _id: "aaaaaaaaaaaaaaaaaaaaaaaa",
    fullName: "Demo Doctor",
    hospital: "Demo Clinic"
  };
  const user = {
    _id: "bbbbbbbbbbbbbbbbbbbbbbbb",
    name: "Demo Patient"
  };
  service.verifyReview = () => ({
    doctorId: doctor._id,
    doctorVersion: doctorVersion(doctor),
    date: "2026-10-16",
    time: "09:00",
    jti: "signed-request"
  });
  service.registeredDoctor = async id => {
    assert.equal(id, doctor._id);
    return doctor;
  };
  let saved;
  service.book = async value => {
    saved = value;
    return {
      replayed: false,
      appointment: {
        _id: "receipt-id",
        doctor: doctor.fullName,
        hospital: doctor.hospital,
        date: value.date,
        time: value.time,
        status: "Scheduled"
      }
    };
  };
  const res = response();
  await controller.confirmChatAppointment({
    accountType: "user",
    user,
    body: {
      confirmationToken: "signed-token",
      date: "2099-01-01",
      time: "23:00",
      userId: "spoofed",
      status: "Approved",
      phone: "+910000000000"
    }
  }, res);
  assert.equal(res.statusCode, 201);
  assert.equal(saved.user, user);
  assert.equal(saved.date, "2026-10-16");
  assert.equal(saved.time, "09:00");
  assert.equal(saved.requestKey, `${user._id}:signed-request`);
  assert.equal(res.body.appointment.status, "Scheduled");
  assert.equal(res.body.appointment.email, undefined);
});
