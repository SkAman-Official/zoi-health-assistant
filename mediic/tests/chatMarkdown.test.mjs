import assert from "node:assert/strict";
import { after, test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { StaticRouter } from "react-router-dom/server.js";
import { createServer } from "vite";
import react from "@vitejs/plugin-react";

const server = await createServer({
  configFile: false,
  plugins: [react()],
  server: { middlewareMode: true, hmr: false, watch: null },
  appType: "custom",
});
after(() => server.close());
const { default: render } = await server.ssrLoadModule("/src/features/chat/renderChatMarkdown.jsx");
const { default: renderBookingPanel } = await server.ssrLoadModule("/src/features/chat/renderBookingPanel.jsx");
const { DoctorContext } = await server.ssrLoadModule("/src/features/doctor/doctorContext.js");
const { default: AppointmentList } = await server.ssrLoadModule("/src/features/doctor/AppointmentList.jsx");
const { default: DoctorPatients } = await server.ssrLoadModule("/src/features/doctor/DoctorPatients.jsx");
const html = (text) => renderToStaticMarkup(render(text));

test("doctor reply formats emphasis, lists, code and the PDF citation", () => {
  const result = html("**Cardiology**\n\n* **Monday:** 10:00–12:00\n* **Tuesday:** 08:00–10:00\n\n*Note:* Check `/home/appointment`.\n\n[Woodlands OPD PDF](https://www.woodlandshospital.in/pdf/DOCTORS%20OPD%20A5.pdf#page=3)");
  assert.match(result, /<strong>Cardiology<\/strong>/u);
  assert.match(result, /<ul><li><strong>Monday:<\/strong> 10:00–12:00<\/li>/u);
  assert.match(result, /<em>Note:<\/em>/u);
  assert.match(result, /<code>\/home\/appointment<\/code>/u);
  assert.match(result, /href="https:\/\/www\.woodlandshospital\.in\/pdf\/DOCTORS%20OPD%20A5.pdf#page=3" target="_blank" rel="noopener noreferrer"/u);
});

test("HTML stays inert and executable or protocol-relative links are rejected", () => {
  const result = html('<img src=x onerror=alert(1)> [bad](javascript:alert) [bad](data:text/html,test) [bad](//evil.example) [bad](https:\\evil.example)');
  assert.ok(!result.includes("<img"));
  assert.ok(!result.includes("<a "));
  assert.match(result, /&lt;img/u);
});

test("local links, numbered lists and multilingual text remain readable", () => {
  const result = html("3. हिन्दी\n4. বাংলা\n\n[Appointments](/home/appointment)");
  assert.match(result, /<ol start="3"><li>हिन्दी<\/li><li>বাংলা<\/li><\/ol>/u);
  assert.match(result, /href="\/home\/appointment"/u);
  assert.ok(!result.includes('target="_blank"'));
});

const review = {
  stage: "review", doctor: { id: "demo", name: "Demo Doctor", hospital: "Demo Clinic" },
  draft: { date: "2026-10-16", time: "09:00" },
  contact: { name: "<script>unsafe</script>", email: "demo@example.test", phone: "" },
};
test("review card escapes account text and provides localized confirmation with no automatic submission", () => {
  for (const language of ["en", "hi", "bn"]) {
    const result = renderToStaticMarkup(renderBookingPanel({ booking: review, language, busy: false, phone: "", onChoose() {}, onConfirm() {}, onPhone() {} }));
    assert.match(result, /type="submit" disabled=""/u);
    assert.match(result, /&lt;script&gt;unsafe/u);
    assert.ok(!result.includes("<script>"));
    assert.match(result, /type="tel"/u);
  }
});

test("completed booking shows its server receipt without another confirmation button", () => {
  const result = renderToStaticMarkup(renderBookingPanel({ language: "en", booking: { stage: "done", receipt: {
    id: "server-receipt", doctor: "Demo Doctor", hospital: "Demo Clinic", date: "2026-10-16", time: "09:00",
  } } }));
  assert.match(result, /server-receipt/u);
  assert.match(result, /doctor approval/u);
  assert.ok(!result.includes('type="submit"'));
});

test("the first booking panel offers departments without listing doctors", () => {
  const result = renderToStaticMarkup(renderBookingPanel({ language: "en", busy: false, onChoose() {},
    booking: { stage: "department", draft: {}, departments: ["Cardiology", "Dermatology"] } }));
  assert.match(result, /Cardiology/u);
  assert.match(result, /Dermatology/u);
  assert.ok(!result.includes("Demo Doctor"));
  assert.ok(!result.includes('type="submit"'));
});

const doctorContext = { doctor: { fullName: "Demo Doctor" }, appointments: [], loading: false, refreshing: false,
  lastUpdated: new Date("2026-10-15T08:00:00Z"), pendingId: null, refresh() {}, updateStatus() {} };
function renderDoctor(element, context = doctorContext) {
  return renderToStaticMarkup(createElement(StaticRouter, { location: "/doctor-portal" }, createElement(DoctorContext.Provider, { value: context }, element)));
}
test("doctor cards link real patient IDs, omit orphan links and offer only supported actions", () => {
  const result = renderDoctor(createElement(AppointmentList, { appointments: [
    { _id: "appointment-real", userId: { _id: "patient-real", name: "Demo Patient" }, date: "2026-10-16", time: "10:00", status: "Scheduled" },
    { _id: "appointment-orphan", userId: null, name: "Archived Patient", date: "2026-10-17", time: "14:00", status: "Approved" },
  ] }));
  assert.match(result, /href="\/doctor-portal\/patients\/patient-real"/u);
  assert.ok(!result.includes("/patients/appointment-orphan"));
  assert.match(result, /Linked patient account unavailable/u);
  assert.match(result, /Approve/u);
  assert.ok(!result.includes("Start Consultation"));
  assert.ok(!result.includes("Confirm rejection"));
});
test("empty doctor patient view reports an empty account instead of sample records", () => {
  const result = renderDoctor(createElement(DoctorPatients));
  assert.match(result, /No linked patients yet/u);
  assert.match(result, /Showing 0 of 0 patients/u);
  assert.ok(!result.includes("Sarah Johnson"));
  assert.ok(!result.includes("Hypertension"));
});

const { default: Fields } = await server.ssrLoadModule("/src/features/documents/DocumentFields.jsx");
const field = (value = "") => ({ value, uncertain: !value });
const extraction = { doctor: field("<script>example</script>"), hospital: field(), documentDate: field(), notes: field(), medicines: [], rawText: "<img src=x onerror=alert(1)>" };
test('review fields escape document text, expose uncertainty and support readonly records', () => {
  const html = renderToStaticMarkup(createElement(Fields, { extraction, onChange: () => {}, readOnly: true }));
  assert.ok(!html.includes('<script>')); assert.ok(!html.includes('<img')); assert.match(html, /Needs review/); assert.match(html, /readonly/); assert.ok(!html.includes('Remove row')); assert.match(html, /Transcribed text/);
});
