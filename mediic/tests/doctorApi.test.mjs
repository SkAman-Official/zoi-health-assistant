import test from "node:test";
import assert from "node:assert/strict";
import { doctorRequest } from "../src/features/doctor/doctorApi.js";

function restoreGlobals(t) {
  const original = { fetch: globalThis.fetch, storage: Object.getOwnPropertyDescriptor(globalThis, "localStorage") };
  t.after(() => { globalThis.fetch = original.fetch; if (original.storage) Object.defineProperty(globalThis, "localStorage", original.storage); else delete globalThis.localStorage; });
}
test("doctor requests use the doctor session and never substitute the patient token", async (t) => {
  restoreGlobals(t);
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: { getItem: (key) => {
    assert.equal(key, "doctorToken"); return "synthetic-doctor-session";
  } } });
  globalThis.fetch = async (path, options) => {
    assert.equal(path, "/api/appointments/mine");
    assert.equal(options.headers.Authorization, "Bearer synthetic-doctor-session");
    return { ok: true, json: async () => [] };
  };
  assert.deepEqual(await doctorRequest("/api/appointments/mine"), []);
});
test("missing sessions stop before a request and forbidden responses have a clear error", async (t) => {
  restoreGlobals(t);
  let token = null;
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: { getItem: () => token } });
  globalThis.fetch = async () => { throw new Error("Must not request without a session"); };
  await assert.rejects(doctorRequest("/api/doctors/me"), { status: 401 });
  token = "synthetic-session";
  globalThis.fetch = async () => ({ ok: false, status: 403, json: async () => ({}) });
  await assert.rejects(doctorRequest("/api/doctors/me"), { status: 403, message: "This page requires the appropriate doctor account." });
});
test("network errors do not leak raw request or credential details", async (t) => {
  restoreGlobals(t);
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: { getItem: () => "synthetic-session" } });
  globalThis.fetch = async () => { throw new Error("private upstream detail"); };
  await assert.rejects(doctorRequest("/api/appointments/mine"), { message: "Unable to reach Zoi. Check your connection and try again." });
});
