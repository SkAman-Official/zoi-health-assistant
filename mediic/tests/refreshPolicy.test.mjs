import test from "node:test";
import assert from "node:assert/strict";
import { observePageRefresh } from "../src/features/observePageRefresh.js";
import { retainDoctorSelection } from "../src/features/appointments/useRegisteredDoctors.js";

test("open pages refresh every 30 seconds and on return, skip hidden tabs and clean up", () => {
  const listeners = { window: {}, document: {} };
  let tick;
  let cleared = false;
  let reads = 0;
  const windowImpl = {
    setInterval(callback, interval) { assert.equal(interval, 30000); tick = callback; return 42; },
    clearInterval(id) { assert.equal(id, 42); cleared = true; },
    addEventListener(event, callback) { listeners.window[event] = callback; },
    removeEventListener(event, callback) { assert.equal(listeners.window[event], callback); delete listeners.window[event]; },
  };
  const documentImpl = { hidden: false,
    addEventListener(event, callback) { listeners.document[event] = callback; },
    removeEventListener(event, callback) { assert.equal(listeners.document[event], callback); delete listeners.document[event]; },
  };
  const stop = observePageRefresh(() => reads++, { windowImpl, documentImpl });
  tick(); assert.equal(reads, 1);
  documentImpl.hidden = true;
  tick(); listeners.window.focus(); assert.equal(reads, 1);
  documentImpl.hidden = false;
  listeners.document.visibilitychange(); listeners.window.focus(); assert.equal(reads, 3);
  stop(); assert.equal(cleared, true);
  assert.deepEqual(listeners, { window: {}, document: {} });
});

test("new registrations preserve an existing doctor's selection but remove missing matches", () => {
  const doctors = [{ fullName: "Existing Doctor" }, { fullName: "New Doctor" }];
  assert.equal(retainDoctorSelection("Existing Doctor", doctors), "Existing Doctor");
  assert.equal(retainDoctorSelection("Removed Doctor", doctors), "");
  assert.equal(retainDoctorSelection("Existing Doctor", []), "");
});
