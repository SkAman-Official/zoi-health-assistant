const test = require("node:test");
const assert = require("node:assert/strict");
const booklet = require("../data/woodlands-opd.json");
const {
  loadHospitalKnowledge
} = require("../services/hospitalKnowledge");
const {
  selectHospitalKnowledge
} = require("../services/hospitalRetrieval");
function entry(name, department) {
  return booklet.doctorEntries.find(doctor => doctor.name === name && (!department || doctor.department === department));
}
function request(content) {
  return [{
    role: "user",
    content
  }];
}
test("full import covers all booklet table sections without a publication-date assumption", () => {
  assert.equal(booklet.departments.length, 30);
  assert.equal(booklet.doctorEntries.length, 179);
  assert.equal(booklet.publicationDate, null);
  assert.equal(new Set(booklet.doctorEntries.map(doctor => doctor.sourcePage)).size, 12);
});
test("Sunil Baran Roy's alternating weekday times match the page 3 grid", () => {
  const doctor = entry("Dr Sunil Baran Roy");
  assert.equal(doctor.sourcePage, 3);
  assert.deepEqual(doctor.sessions.map(session => [session.days[0], session.timeRanges[0].start, session.timeRanges[0].end]), [["Monday", "10:00", "12:00"], ["Tuesday", "08:00", "10:00"], ["Wednesday", "10:00", "12:00"], ["Thursday", "08:00", "10:00"], ["Friday", "10:00", "12:00"], ["Saturday", "08:00", "10:00"]]);
});
test("merged weekday cells preserve their printed span and confirmation flag", () => {
  const session = entry("Dr Suresh Choraria").sessions[0];
  assert.deepEqual(session.days, ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  assert.equal(session.dayInterpretation, "merged_columns_requires_confirmation");
  assert.deepEqual(session.timeRanges, [{
    start: "08:00",
    end: "12:00"
  }]);
});
test("split paediatric sessions and separate Health Checkup appointments remain distinct", () => {
  const sessions = entry("Dr Sabyasachi Das").sessions;
  assert.deepEqual(sessions.find(session => session.days[0] === "Tuesday").timeRanges, [{
    start: "12:00",
    end: "14:00"
  }, {
    start: "18:00",
    end: "20:00"
  }]);
  const checkup = entry("Dr. Abhirup Maulik", "Health Checkup");
  const orthopaedic = entry("Dr Abhirup Maulik", "Orthopaedics & Joint Replacement");
  assert.equal(checkup.sessions[0].timeRanges[0].start, "09:00");
  assert.equal(orthopaedic.sessions[0].timeRanges[0].start, "08:00");
});
test("By Appointment has no invented time range", () => {
  const doctor = entry("Dr Indira Banerjee");
  assert.equal(doctor.sessions[0].byAppointment, true);
  assert.deepEqual(doctor.sessions[0].timeRanges, []);
});
test("the loaded directory retains records past the old 30-doctor cap", () => {
  const hospitals = loadHospitalKnowledge();
  const woodlands = hospitals.find(hospital => hospital.name.includes("Woodlands"));
  assert.ok(woodlands.doctors.length >= 179);
  const result = selectHospitalKnowledge(hospitals, request("What is Ms Rajyashree Bandyopadhyay's schedule at Woodlands?"));
  assert.equal(result.length, 1);
  const match = result[0].doctors.find(doctor => doctor.name.includes("Rajyashree"));
  assert.equal(match.sourcePage, 14);
  assert.match(match.shifts, /Sunday: 12:00-14:00/);
  assert.match(match.sourceUrl, /#page=14$/);
  assert.ok(result[0].doctors.length <= 24);
});
test("department searches work in English, Hindi and Bengali without changing other hospitals", () => {
  const hospitals = loadHospitalKnowledge();
  for (const text of ["Woodlands cardiologists", "উডল্যান্ডস কার্ডিওলজি", "वुडलैंड्स कार्डियोलॉजी"]) {
    const result = selectHospitalKnowledge(hospitals, request(text));
    assert.equal(result.length, 1);
    assert.ok(result[0].doctors.some(doctor => doctor.name === "Dr Sunil Baran Roy"));
  }
  const result = selectHospitalKnowledge(hospitals, request("Fortis neurologists"));
  assert.equal(result.length, 1);
  assert.ok(result[0].doctors.some(doctor => doctor.name.includes("Amit Haldar")));
  assert.ok(!result[0].name.includes("Woodlands"));
});
test("doctor follow-ups retain hospital context without sending the whole catalogue", () => {
  const result = selectHospitalKnowledge(loadHospitalKnowledge(), [{
    role: "user",
    content: "When does Sunil Baran Roy consult at Woodlands?"
  }, {
    role: "assistant",
    content: "Here is the published schedule."
  }, {
    role: "user",
    content: "What about Friday?"
  }]);
  assert.equal(result.length, 1);
  assert.equal(result[0].doctors[0].name, "Dr Sunil Baran Roy");
  assert.ok(result[0].doctorRecordsAvailable > result[0].doctorRecordsIncluded);
});
