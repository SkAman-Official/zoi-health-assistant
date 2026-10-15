# Doctor portal polish

The doctor portal retains the existing navigation, illustrated hero banner, blue/teal palette, summary cards, two-chart row and appointment section. The changes replace sample-driven content with the signed-in doctor's recorded appointments and improve controls, feedback and small-screen layouts.

## Screens

- **Dashboard:** unique linked patient count, today's non-rejected appointments, requests awaiting approval and recorded completed appointments. Weekly activity uses the last seven scheduled dates in India time, including all statuses. The second chart shows recorded appointment status counts. Upcoming appointments show the next six future Scheduled/Pending/Rescheduled/Approved records.
- **Appointments:** patient/reference search, status and today/upcoming filters, time/name sorting, clear filters, per-request action state, inline feedback and a two-step rejection confirmation. Approval/rejection updates the existing booking backend. Rejected slots are released by that backend. No unsupported “Start consultation” action is presented.
- **Patients:** cards are derived from real, populated patient accounts in that doctor's appointments. Duplicate accounts merge. Search and upcoming/no-upcoming filters describe booking activity, not a patient's health status. Orphan appointments remain visible in appointment lists without fabricated patient links.
- **Patient details:** contact information and only that doctor's recorded appointment history, including patient-provided booking reasons and contact numbers. No default diagnoses, allergies, vital signs, prescriptions, file counts or fabricated medical history are shown. Unsupported notes/prescription editing controls are removed rather than implying that they save.
- **Profile:** reads current account data from the backend; only schema-supported full name, specialty, hospital, email and license fields are editable. Biography, experience and address placeholders are removed. These are account details and are not a clinical credential-verification claim.
- **Navigation:** active route styling, labelled mobile controls, close-on-navigation/Escape handling, listener cleanup and logout cache cleanup. The existing overall shell remains. The Lenis GSAP ticker callback is removed on unmount.

## Data and authorization

`DoctorPortalProvider` shares one authenticated profile/appointment load across portal pages, refreshes after appointment changes, and cancels obsolete reads. It also refreshes every 30 seconds while visible and on tab focus/visibility return. Background reads do not trigger overlapping requests or reset an unchanged profile object. Errors never replace failed requests with sample records. A failed refresh retains the last loaded snapshot with a visible warning. This is polling, not realtime server push.

The patient booking forms use `useRegisteredDoctors` to reload the public registered-doctor directory at mount, every visible 30-second interval, and on return to the tab. New registrations therefore appear without reopening the form. Updates preserve a still-valid doctor selection; changing hospital clears it. The public endpoint returns ID, name, specialty and hospital with no-store caching, without doctor email/credential fields. Chat reads registered doctors for each new turn; start Book in chat again to refresh previously displayed choices.

New registrations save Doctor records. New bookings store the selected doctor's `doctorId` and the authenticated patient's `userId`; the doctor's owned-appointment read and related-patient list use those links. An empty new doctor account should show zero appointments until a patient books with it.

| Endpoint | Behavior |
| --- | --- |
| `GET /api/doctors/me` | Doctor-only, explicit profile field allowlist; no password/reset data. |
| `GET /api/appointments/mine` | Doctor-only appointment query using authenticated account ID, with the existing guarded legacy-name fallback. No client-supplied doctor name controls the query. |
| `GET /api/patients/:id` | Doctor-only; validates the ID, checks an owned appointment relationship before patient lookup, projects name/email/phone and returns only that doctor's appointment history. |
| `PUT /api/doctors/update` | Doctor-only, authenticated ID, supported string-field validation, duplicate-field feedback and safe response projection. Client-supplied verification/password/owner fields are rejected. Changed profile details clear the verification flag. |

All new/read-refined private responses use no-store caching. The pre-existing approve/reject endpoints retain their doctor ownership checks. Existing name-only appointments remain subject to the conservative compatibility rules in `CONVERSATIONAL_BOOKING.md`; changing a profile name/hospital does not migrate old name-only records.

## File index

- `mediic/src/features/doctor/DoctorPortalProvider.jsx`, `doctorContext.js`, `doctorApi.js`: shared state and authenticated requests.
- `doctorData.js`: India-time labels, filters, real-data summaries and patient grouping.
- `DoctorOverview.jsx`, `DoctorAppointments.jsx`, `AppointmentList.jsx`: dashboard and booking management.
- `DoctorPatients.jsx`, `DoctorPatientDetails.jsx`, `DoctorProfile.jsx`: patient and profile views.
- `doctor.css`: styles scoped to doctor classes, retaining existing colours and card treatment.
- The router now imports the feature views directly; old page delegates remain compatible. Routes and links stay intact. `/doctor-portal/dashboard` shows the same working overview as the portal index.
- `backend/controllers/{appointmentController,patientController,doctorController}.js` and corresponding existing routes: owned reads, profile validation and patient access.

PropTypes is now declared directly in the frontend manifest and lockfile; version 15.8.1 is already installed. No dependency download is required for this workspace.

## Verification

`npm.cmd test` passes 50 backend tests and 18 frontend tests. New checks cover unrelated-patient denial before account lookup, own-doctor query scoping, profile field projection and mass-assignment rejection, public doctor directory fields/caching, real-data summaries, India-time boundaries, orphan links, empty-account rendering, doctor-token use, visible refresh scheduling/cleanup and preserved booking selections. Targeted lint of the modified feature modules passes. The production build passes with the pre-existing image-resolution, Browserslist and bundle-size warnings.

Provider/database boundaries are mocked in these tests; UI checks render markup and do not constitute a live browser session. No real appointments, emails, profile changes or database mutations run as part of verification. Browser appearance and the full MongoDB-backed workflow still need the local check below. This change does not constitute a complete security audit of unrelated application routes.

## Local check

1. Restart both backend and Vite using the existing commands, then hard-refresh the browser (Ctrl+Shift+R). No new environment variables are introduced. The user-provided screenshots still contain old sample demographics/reviews/profile content despite the newer hero; those sample components are absent from the current feature views. This mixed state is not a verified browser-cache diagnosis. Direct route imports and a clean restart ensure the latest source is requested. The current dashboard heading is Practice overview and its second chart is Appointment status; the profile heading is My profile.
2. Sign in with an existing doctor account. Confirm that the hero, dashboard counts and upcoming appointments match that doctor's data. An empty account shows zero activity and useful empty states.
3. Open Appointments, search by a patient or reference, and try Awaiting approval/Today/Upcoming filters. Approve an intended test appointment, or check the rejection review and press Keep appointment. A confirmed rejection changes the database and releases its slot.
4. Open My patients and follow a real patient card. Check that only your appointment history appears. An unrelated patient's URL should return an unavailable/not-found response.
5. Open My profile and confirm the details match the registered account. Save an intended small correction, then check that both the profile and banner refresh.
6. Check the mobile navigation, card spacing, keyboard focus, empty states and Refresh feedback. Register a doctor, return to an open patient booking form and confirm that doctor appears in its hospital/department. Create an intended test booking, then return to that doctor's dashboard or wait up to 30 visible seconds; check the appointment and linked patient. Patient-detail history reloads when opened/reloaded; no realtime push is claimed.

Medical document extraction remains the next feature after this live check. No document upload, extraction, diagnostic advice or new prescription-writing workflow is added here.
