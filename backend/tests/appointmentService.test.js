const test = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
const {
  createAppointmentService,
  validateDate,
  validateSlot,
  todayIST,
  nameRegex
} = require("../services/appointmentService");
const {
  prepareBooking,
  cleanDraft,
  cleanSelection
} = require("../services/bookingConversation");
const doctor = {
  _id: "aaaaaaaaaaaaaaaaaaaaaaaa",
  fullName: "Dr. Demo Roy",
  specialization: "Cardiology",
  hospital: "Demo Clinic"
};
const user = {
  _id: "bbbbbbbbbbbbbbbbbbbbbbbb",
  name: "Demo Patient",
  email: "patient@example.test",
  phone: "+910000000000"
};
const now = () => new Date("2026-10-15T08:00:00Z");
const secret = () => "synthetic-test-secret-for-booking-only";
function fixture(options = {}) {
  const rows = options.rows || [];
  let emails = 0;
  let writes = 0;
  const Appointment = {
    createIndexes: async () => {
      if (options.failIndexes) throw new Error("INDEX_FAILED");
    },
    find: filter => ({
      select: () => ({
        lean: async () => rows.filter(row => row.date === filter.date && row.status !== "Rejected" && (String(row.doctorId) === String(doctor._id) || !row.doctorId && nameRegex(doctor.fullName).test(row.doctor)))
      })
    }),
    findOne: async filter => rows.find(row => row.bookingRequestKey === filter.bookingRequestKey && row.userId === filter.userId),
    create: async value => {
      // Force racing callers past the preliminary read; emulate Mongo's unique indexes at insertion.
      await new Promise(resolve => setImmediate(resolve));
      if (rows.some(row => row.slotReserved && row.doctorId === value.doctorId && row.date === value.date && row.time === value.time || value.bookingRequestKey && row.bookingRequestKey === value.bookingRequestKey)) throw Object.assign(new Error("duplicate"), {
        code: 11000
      });
      writes++;
      const row = {
        _id: `record-${writes}`,
        ...value
      };
      rows.push(row);
      return row;
    }
  };
  const Doctor = {
    findById: async id => id === doctor._id ? doctor : null,
    find: () => ({
      limit: async () => [doctor]
    }),
    countDocuments: async () => options.duplicates ? 2 : 1
  };
  const service = createAppointmentService({
    Appointment,
    Doctor,
    now,
    secret,
    notify: async () => {
      emails++;
      if (options.failEmail) throw new Error("synthetic mail failure");
    }
  });
  return {
    service,
    rows,
    writes: () => writes,
    emails: () => emails
  };
}
const request = {
  user,
  doctor,
  date: "2026-10-16",
  time: "09:00",
  phone: user.phone
};
test("India date boundaries, real calendar days, horizon and past slots are validated", () => {
  assert.equal(todayIST(new Date("2026-10-15T20:00:00Z")), "2026-10-16");
  for (const date of ["2026-10-14", "2026-02-30", "2027-01-14", "16/10/2026", null]) assert.throws(() => validateDate(date, now()), {
    code: "INVALID_DATE"
  });
  assert.equal(validateDate("2026-10-16", now()), "2026-10-16");
  assert.throws(() => validateSlot("2026-10-15", "09:00", now()), {
    code: "INVALID_TIME"
  });
  assert.throws(() => validateSlot("2026-10-16", "13:00", now()), {
    code: "INVALID_TIME"
  });
});
test("availability honors legacy name records and does not expose patient fields", async () => {
  const {
    service
  } = fixture({
    rows: [{
      doctor: "Demo Roy",
      date: request.date,
      time: "09:00",
      status: "Scheduled",
      email: "private@example.test"
    }, {
      doctor: "Demo Roy",
      date: request.date,
      time: "09:30",
      status: "Rejected"
    }]
  });
  const slots = await service.availableSlots(doctor, request.date);
  assert.ok(!slots.includes("09:00"));
  assert.ok(slots.includes("09:30"));
  assert.ok(slots.every(time => /^\d{2}:\d{2}$/.test(time)));
});
test("competing users cannot both reserve one slot after racing availability reads", async () => {
  const f = fixture();
  const outcomes = await Promise.allSettled([f.service.book(request), f.service.book({
    ...request,
    user: {
      ...user,
      _id: "cccccccccccccccccccccccc"
    }
  })]);
  assert.equal(outcomes.filter(outcome => outcome.status === "fulfilled").length, 1);
  assert.equal(outcomes.find(outcome => outcome.status === "rejected").reason.code, "SLOT_TAKEN");
  assert.equal(f.writes(), 1);
});
test("the same confirmation safely retries without duplicate bookings or emails", async () => {
  const f = fixture();
  const results = await Promise.all([f.service.book({
    ...request,
    requestKey: "same-confirmation"
  }), f.service.book({
    ...request,
    requestKey: "same-confirmation"
  })]);
  assert.equal(results[0].appointment._id, results[1].appointment._id);
  assert.equal(f.writes(), 1);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(f.emails(), 1);
});
test("writes fail closed if index creation fails; saved bookings survive mail failure", async () => {
  const blocked = fixture({
    failIndexes: true
  });
  await assert.rejects(blocked.service.book(request), /INDEX_FAILED/);
  assert.equal(blocked.writes(), 0);
  const f = fixture({
    failEmail: true
  });
  assert.equal((await f.service.book(request)).appointment.status, "Scheduled");
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(f.writes(), 1);
});
test("booking persists only the allowlisted account identity and no card details", async () => {
  const f = fixture();
  const {
    appointment
  } = await f.service.book({
    ...request,
    name: "Spoofed",
    email: "spoof@example.test",
    userId: "other",
    status: "Approved",
    cardNumber: "synthetic-card"
  });
  assert.equal(appointment.name, user.name);
  assert.equal(appointment.email, user.email);
  assert.equal(appointment.userId, user._id);
  assert.equal(appointment.status, "Scheduled");
  assert.equal(appointment.cardNumber, undefined);
  await assert.rejects(f.service.book({
    ...request,
    phone: "1------"
  }), {
    code: "CONTACT_REQUIRED"
  });
});
test("review tokens bind the user, doctor and slot and reject tampering and expiry", () => {
  const {
    service
  } = fixture();
  const token = service.signReview(user._id, doctor, request.date, request.time);
  const review = service.verifyReview(token, user._id);
  assert.equal(review.doctorId, doctor._id);
  assert.equal(review.time, request.time);
  assert.throws(() => service.verifyReview(token, "other-user"), {
    code: "REVIEW_EXPIRED"
  });
  assert.throws(() => service.verifyReview(`${token}tampered`, user._id), {
    code: "REVIEW_EXPIRED"
  });
  const expired = jwt.sign({
    kind: "booking-review",
    doctorId: doctor._id
  }, secret(), {
    issuer: "zoi-booking",
    audience: user._id,
    expiresIn: -1
  });
  assert.throws(() => service.verifyReview(expired, user._id), {
    code: "REVIEW_EXPIRED"
  });
});
test("doctor access uses IDs and excludes ambiguous legacy identities", async () => {
  const regular = await fixture().service.ownedDoctorFilter(doctor);
  assert.equal(regular.$or[0].doctorId, doctor._id);
  assert.ok(regular.$or[1].doctor.test("Demo Roy"));
  assert.ok(!regular.$or[1].doctor.test("Other Doctor"));
  const duplicate = await fixture({
    duplicates: true
  }).service.ownedDoctorFilter(doctor);
  assert.deepEqual(duplicate, {
    doctorId: doctor._id
  });
});
test("booking progresses through missing fields and reviews without creating records", async () => {
  const f = fixture();
  const base = {
    language: "en",
    directory: [doctor],
    user,
    service: f.service,
    now: now()
  };
  const start = await prepareBooking({
    ...base,
    selection: {
      start: true
    }
  });
  assert.equal(start.booking.stage, "department");
  assert.deepEqual(start.booking.departments, ["Cardiology"]);
  assert.equal(start.booking.choices, undefined);
  const department = await prepareBooking({
    ...base,
    draft: start.booking.draft,
    selection: {
      specialty: "Cardiology"
    }
  });
  assert.equal(department.booking.stage, "doctor");
  assert.deepEqual(department.booking.choices.map(item => item.id), [doctor._id]);
  const selected = await prepareBooking({
    ...base,
    draft: department.booking.draft,
    selection: {
      doctorId: doctor._id
    }
  });
  assert.equal(selected.booking.stage, "date");
  const dated = await prepareBooking({
    ...base,
    draft: selected.booking.draft,
    intent: {
      active: true,
      date: request.date
    }
  });
  assert.equal(dated.booking.stage, "time");
  const reviewed = await prepareBooking({
    ...base,
    draft: dated.booking.draft,
    intent: {
      active: true,
      time: request.time
    }
  });
  assert.equal(reviewed.booking.stage, "review");
  assert.ok(reviewed.booking.confirmationToken);
  assert.equal(f.writes(), 0);
  const edited = await prepareBooking({
    ...base,
    draft: reviewed.booking.draft,
    selection: {
      edit: true
    }
  });
  assert.equal(edited.booking.stage, "time");
  assert.equal(edited.booking.confirmationToken, undefined);
  const discarded = await prepareBooking({
    ...base,
    draft: reviewed.booking.draft,
    selection: {
      cancel: true
    }
  });
  assert.equal(discarded.booking, null);
  assert.equal(f.writes(), 0);
});
test("directory-only names and ambiguous doctors are never silently substituted", async () => {
  const f = fixture();
  const base = {
    language: "en",
    directory: [doctor],
    user,
    service: f.service,
    now: now()
  };
  const result = await prepareBooking({
    ...base,
    intent: {
      active: true,
      doctorName: "Sunil Baran Roy",
      date: request.date,
      time: request.time
    }
  });
  assert.equal(result.booking.stage, "department");
  assert.equal(result.booking.draft.doctorId, null);
  assert.match(result.reply, /not bookable/);
  assert.equal(f.writes(), 0);
});
test("department selection filters doctors and changing department clears the old review", async () => {
  const f = fixture();
  const other = {
    ...doctor,
    _id: "dddddddddddddddddddddddd",
    fullName: "Demo Sen",
    specialization: "Dermatology"
  };
  const base = {
    language: "en",
    directory: [doctor, other, {
      ...doctor,
      _id: "eeeeeeeeeeeeeeeeeeeeeeee",
      specialization: " cardiology "
    }],
    user,
    service: f.service,
    now: now()
  };
  const start = await prepareBooking({
    ...base,
    selection: {
      start: true
    }
  });
  assert.equal(start.booking.departments.length, 2);
  const selected = await prepareBooking({
    ...base,
    draft: start.booking.draft,
    selection: {
      specialty: "Dermatology"
    }
  });
  assert.equal(selected.booking.stage, "doctor");
  assert.deepEqual(selected.booking.choices.map(item => item.id), [other._id]);
  const reset = await prepareBooking({
    ...base,
    draft: {
      doctorId: doctor._id,
      specialty: "Cardiology",
      date: request.date,
      time: request.time
    },
    selection: {
      edit: "department"
    }
  });
  assert.equal(reset.booking.stage, "department");
  assert.equal(reset.booking.draft.doctorId, null);
  assert.equal(reset.booking.draft.time, null);
  assert.equal(reset.booking.confirmationToken, undefined);
  assert.equal(f.writes(), 0);
});
test("a named doctor bypasses department selection and typed departments still require a doctor choice", async () => {
  const f = fixture();
  const base = {
    language: "en",
    directory: [doctor],
    user,
    service: f.service,
    now: now()
  };
  const named = await prepareBooking({
    ...base,
    intent: {
      active: true,
      doctorName: "Demo Roy"
    }
  });
  assert.equal(named.booking.stage, "date");
  assert.equal(named.booking.draft.specialty, "Cardiology");
  const department = await prepareBooking({
    ...base,
    intent: {
      active: true,
      specialty: "Cardiology"
    }
  });
  assert.equal(department.booking.stage, "doctor");
  assert.equal(department.booking.draft.doctorId, null);
});
test("draft and button input reject unexpected shapes and invalid IDs", () => {
  for (const value of ["bad", [], {
    doctorId: "invalid"
  }, {
    date: {}
  }]) assert.throws(() => cleanDraft(value), {
    code: "INVALID_BOOKING"
  });
  for (const value of [{
    confirm: true
  }, {
    start: "yes"
  }, {
    date: "2026-10-16",
    time: "09:00"
  }, {
    doctorId: "invalid"
  }]) assert.throws(() => cleanSelection(value), {
    code: "INVALID_BOOKING"
  });
});
test("new-slot and confirmation indexes enforce uniqueness without indexing legacy rows", () => {
  const Appointment = require("../models/Appointment");
  const indexes = Appointment.schema.indexes();
  const [, slot] = indexes.find(([, options]) => options.name === "reserved_doctor_slot");
  assert.equal(slot.unique, true);
  assert.deepEqual(slot.partialFilterExpression, {
    slotReserved: true,
    doctorId: {
      $type: "objectId"
    }
  });
  assert.ok(indexes.some(([, options]) => options.name === "booking_request_retry" && options.unique));
});
