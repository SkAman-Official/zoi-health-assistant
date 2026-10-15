import test from "node:test";
import assert from "node:assert/strict";
import { todayIST, formatDate, formatTime, summarizeAppointments, filterAppointments, summarizePatients } from "../src/features/doctor/doctorData.js";
const now = new Date("2026-10-15T04:00:00Z"); // 09:30 IST
const patient = { _id: "patient-a", name: "Demo Patient", email: "patient@example.test", phone: "" };
const rows = [
  { _id: "appointment-one", userId: patient, phone: "0000000000", date: "2026-10-15", time: "10:00", status: "Scheduled" },
  { _id: "appointment-two", userId: patient, date: "2026-10-14", time: "09:00", status: "Completed" },
  { _id: "appointment-three", userId: { _id: "patient-b", name: "Another Patient" }, date: "2026-10-15", time: "11:00", status: "Rejected" },
  { _id: "appointment-four", userId: null, name: "Archived account", date: "2026-10-16", time: "14:00", status: "Approved" },
];
test("doctor summaries use unique linked patients and actual statuses instead of fixed counts", () => {
  const summary = summarizeAppointments(rows, now);
  assert.equal(summary.patients, 2);
  assert.equal(summary.today, 1);
  assert.equal(summary.pending, 1);
  assert.equal(summary.completed, 1);
  assert.deepEqual(summary.upcoming.map((item) => item._id), ["appointment-one", "appointment-four"]);
  assert.equal(summary.week.length, 7);
  assert.equal(summary.week.at(-1).appointments, 2);
  assert.equal(summary.statuses.reduce((total, item) => total + item.value, 0), rows.length);
});
test("empty doctor accounts have zero counts and no invented appointments or patients", () => {
  const summary = summarizeAppointments([], now);
  assert.equal(summary.patients, 0);
  assert.equal(summary.today, 0);
  assert.deepEqual(summary.upcoming, []);
  assert.deepEqual(summarizePatients([], now), []);
});
test("date labels and today boundaries use India time without invalid time placeholders", () => {
  assert.equal(todayIST(new Date("2026-10-15T20:00:00Z")), "2026-10-16");
  assert.equal(formatTime("14:30"), "2:30 PM");
  assert.equal(formatTime("00:00"), "12:00 AM");
  assert.equal(formatTime("bad"), "Time unavailable");
  assert.equal(formatDate("bad"), "Date unavailable");
  assert.equal(formatDate("2026-02-30"), "Date unavailable");
});
test("filters combine patient search, status and schedule, with stable time sorting", () => {
  assert.deepEqual(filterAppointments(rows, { search: "demo", status: "Scheduled", scope: "today" }, now).map((item) => item._id), ["appointment-one"]);
  assert.deepEqual(filterAppointments(rows, { scope: "upcoming", sort: "date-asc" }, now).map((item) => item._id), ["appointment-one", "appointment-four"]);
  assert.equal(filterAppointments(rows, { search: "three" }, now)[0]._id, "appointment-three");
});
test("patient cards merge duplicate accounts, skip orphans and distinguish recorded visits from future requests", () => {
  const patients = summarizePatients(rows, now);
  assert.equal(patients.length, 2);
  const demo = patients.find((item) => item.id === patient._id);
  assert.equal(demo.appointments.length, 2);
  assert.equal(demo.next._id, "appointment-one");
  assert.equal(demo.lastCompleted._id, "appointment-two");
  assert.equal(demo.phone, "0000000000");
  assert.equal(patients.find((item) => item.id === "patient-b").next, null);
});
