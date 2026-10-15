const test = require("node:test");
const assert = require("node:assert/strict");
const patients = require("../controllers/patientController");
const doctors = require("../controllers/doctorController");
const appointments = require("../controllers/appointmentController");
const Appointment = require("../models/Appointment");
const Patient = require("../models/User");
const Doctor = require("../models/Doctor");
const account = {
  _id: "aaaaaaaaaaaaaaaaaaaaaaaa",
  fullName: "Demo Doctor",
  hospital: "Demo Clinic",
  email: "doctor@example.test",
  specialization: "Cardiology",
  licenseNumber: "DEMO-001",
  password: "private-hash"
};
const patientId = "bbbbbbbbbbbbbbbbbbbbbbbb";
const response = () => ({
  statusCode: 200,
  set() {
    return this;
  },
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  }
});
test("patient accounts cannot access doctor patient records, dashboard data or profile updates", async () => {
  for (const action of [patients.getPatientById, appointments.getMyAppointments, doctors.getMyProfile, doctors.updateDoctorProfile]) {
    const res = response();
    await action({
      accountType: "user",
      params: {
        id: patientId
      },
      body: {
        fullName: "Spoof"
      }
    }, res);
    assert.equal(res.statusCode, 403);
  }
});
test("unrelated patient access fails before any patient account lookup", async t => {
  const original = {
    owner: appointments.bookingService.ownedDoctorFilter,
    exists: Appointment.exists,
    find: Patient.findById
  };
  t.after(() => {
    appointments.bookingService.ownedDoctorFilter = original.owner;
    Appointment.exists = original.exists;
    Patient.findById = original.find;
  });
  appointments.bookingService.ownedDoctorFilter = async () => ({
    doctorId: account._id
  });
  let captured;
  Appointment.exists = async filter => {
    captured = filter;
    return null;
  };
  Patient.findById = () => {
    throw new Error("Patient lookup must not happen");
  };
  const res = response();
  await patients.getPatientById({
    accountType: "doctor",
    account,
    params: {
      id: patientId
    }
  }, res);
  assert.equal(res.statusCode, 404);
  assert.deepEqual(captured, {
    doctorId: account._id,
    userId: patientId
  });
});
test("patient history uses doctor ownership and returns only projected account fields", async t => {
  const original = {
    owner: appointments.bookingService.ownedDoctorFilter,
    exists: Appointment.exists,
    find: Appointment.find,
    patient: Patient.findById
  };
  t.after(() => {
    appointments.bookingService.ownedDoctorFilter = original.owner;
    Appointment.exists = original.exists;
    Appointment.find = original.find;
    Patient.findById = original.patient;
  });
  appointments.bookingService.ownedDoctorFilter = async () => ({
    doctorId: account._id
  });
  Appointment.exists = async () => ({
    _id: "appointment"
  });
  let projection;
  Patient.findById = () => ({
    select(value) {
      projection = value;
      return {
        lean: async () => ({
          _id: patientId,
          name: "Demo Patient",
          email: "patient@example.test",
          phone: ""
        })
      };
    }
  });
  let historyFilter;
  Appointment.find = filter => {
    historyFilter = filter;
    return {
      sort: () => ({
        select: () => ({
          lean: () => ({
            maxTimeMS: async () => [{
              _id: "appointment",
              status: "Scheduled"
            }]
          })
        })
      })
    };
  };
  const res = response();
  await patients.getPatientById({
    accountType: "doctor",
    account,
    params: {
      id: patientId
    }
  }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(projection, "name email phone");
  assert.deepEqual(historyFilter, {
    doctorId: account._id,
    userId: patientId
  });
  assert.equal(res.body.data.password, undefined);
  assert.equal(res.body.appointments.length, 1);
});
test("malformed patient IDs do not reach database queries", async () => {
  const res = response();
  await patients.getPatientById({
    accountType: "doctor",
    account,
    params: {
      id: "not-an-id"
    }
  }, res);
  assert.equal(res.statusCode, 400);
});
test("doctor profile read never serializes credentials or arbitrary account fields", () => {
  const res = response();
  doctors.getMyProfile({
    accountType: "doctor",
    account: {
      ...account,
      resetToken: "private-reset"
    }
  }, res);
  assert.equal(res.body.doctor.id, account._id);
  assert.equal(res.body.doctor.password, undefined);
  assert.equal(res.body.doctor.resetToken, undefined);
});
test("profile update rejects mass assignment and validates supported fields", async () => {
  for (const body of [{
    verified: true
  }, {
    password: "injected"
  }, {
    fullName: ""
  }, {
    email: "invalid-email"
  }, {
    hospital: {}
  }]) {
    const res = response();
    await doctors.updateDoctorProfile({
      accountType: "doctor",
      account,
      body
    }, res);
    assert.equal(res.statusCode, 400);
  }
});
test("profile updates bind the authenticated doctor and return an allowlisted result", async t => {
  const original = Doctor.findByIdAndUpdate;
  t.after(() => {
    Doctor.findByIdAndUpdate = original;
  });
  let update;
  Doctor.findByIdAndUpdate = async (id, value, options) => {
    assert.equal(id, account._id);
    assert.equal(options.runValidators, true);
    update = value;
    return {
      ...account,
      ...value.$set
    };
  };
  const res = response();
  await doctors.updateDoctorProfile({
    accountType: "doctor",
    account,
    body: {
      fullName: "Updated Doctor"
    }
  }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(update.$set.verified, false);
  assert.equal(res.body.updatedDoctor.fullName, "Updated Doctor");
  assert.equal(res.body.updatedDoctor.password, undefined);
});
test("the dashboard appointment query uses authenticated ownership rather than a supplied doctor name", async t => {
  const original = {
    owner: appointments.bookingService.ownedDoctorFilter,
    find: Appointment.find
  };
  t.after(() => {
    appointments.bookingService.ownedDoctorFilter = original.owner;
    Appointment.find = original.find;
  });
  appointments.bookingService.ownedDoctorFilter = async () => ({
    doctorId: account._id
  });
  let captured;
  const query = {
    sort() {
      return this;
    },
    populate() {
      return this;
    },
    select() {
      return this;
    },
    lean() {
      return this;
    },
    maxTimeMS: async () => []
  };
  Appointment.find = filter => {
    captured = filter;
    return query;
  };
  const res = response();
  await appointments.getMyAppointments({
    accountType: "doctor",
    account,
    params: {
      doctorName: "Injected Doctor"
    }
  }, res);
  assert.deepEqual(captured, {
    doctorId: account._id
  });
  assert.deepEqual(res.body, []);
});
test("the patient booking directory includes registered doctors with public fields only", async t => {
  const router = require("../routes/auth");
  const handler = router.stack.find(layer => layer.route?.path === "/doctors/all").route.stack.at(-1).handle;
  const original = Doctor.find;
  t.after(() => {
    Doctor.find = original;
  });
  Doctor.find = (filter, projection) => {
    assert.deepEqual(filter, {});
    assert.equal(projection, "fullName specialization hospital");
    return {
      sort: async () => [{
        _id: account._id,
        fullName: account.fullName,
        specialization: account.specialization,
        hospital: account.hospital
      }]
    };
  };
  const res = response();
  let cache;
  res.set = (key, value) => {
    cache = [key, value];
    return res;
  };
  await handler({}, res);
  assert.equal(res.body[0]._id, account._id);
  assert.equal(res.body[0].email, undefined);
  assert.equal(res.body[0].password, undefined);
  assert.deepEqual(cache, ["Cache-Control", "no-store"]);
});
