const test = require("node:test");
const assert = require("node:assert/strict");
const {
  loadHospitalKnowledge,
  sanitizeHospitals
} = require("../services/hospitalKnowledge");
const {
  buildSystemPrompt
} = require("../services/chatService");
const example = {
  name: "Synthetic Hospital",
  sourceUrl: "https://example.test/hospital",
  lastChecked: "2026-10-01",
  departments: [{
    name: "Cardiology",
    hours: "Monday 09:00–12:00",
    sourceUrl: "https://example.test/departments",
    lastChecked: "2026-10-01"
  }],
  doctors: [{
    name: "Synthetic Doctor",
    shifts: "Tuesday 10:00–12:00",
    sourceUrl: "https://example.test/doctor",
    lastChecked: "2026-10-01",
    email: "private@example.test"
  }]
};
test("empty hospital directory is valid and does not invent records", () => {
  assert.deepEqual(sanitizeHospitals({
    hospitals: []
  }), []);
});
test("requires sources and actual check dates for hospital and shift claims", () => {
  assert.throws(() => sanitizeHospitals({
    hospitals: [{
      name: "Unsupported claim"
    }]
  }));
  assert.throws(() => sanitizeHospitals({
    hospitals: [{
      ...example,
      lastChecked: "2026-02-30"
    }]
  }));
  assert.throws(() => sanitizeHospitals({
    hospitals: [{
      ...example,
      sourceUrl: "javascript:alert(1)"
    }]
  }));
  assert.throws(() => sanitizeHospitals({
    hospitals: [{
      ...example,
      departments: [{
        name: "Cardiology",
        hours: "24 hours"
      }]
    }]
  }));
  assert.throws(() => sanitizeHospitals({
    hospitals: [{
      ...example,
      doctors: [{
        name: "Doctor",
        shifts: "Any time"
      }]
    }]
  }));
});
test("passes allowlisted hospital schedules and provenance into model context", () => {
  const records = sanitizeHospitals({
    hospitals: [example]
  });
  const prompt = buildSystemPrompt("en", [], records);
  assert.match(prompt, /Synthetic Hospital/);
  assert.match(prompt, /Cardiology/);
  assert.match(prompt, /2026-10-01/);
  assert.match(prompt, /https:\/\/example.test\/doctor/);
  assert.doesNotMatch(prompt, /private@example.test/);
  assert.match(prompt, /not live appointment availability/);
});
