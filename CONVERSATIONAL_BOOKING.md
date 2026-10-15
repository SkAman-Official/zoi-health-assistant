# Conversational appointment booking

Zoi prepares appointment requests in English, Hindi and Bengali. A user can type a request such as “Book an appointment with Dr [registered name] tomorrow at 10 AM”, or use **Book in chat** and select a department, a doctor in that department, a date and a time. Department options come from registered doctors' specialties, with duplicate labels merged without regard to case or surrounding spaces. Selecting a department always shows a doctor choice, even when only one matches. A request naming a unique doctor can skip directly to that doctor's booking details. The signed-in patient reviews the details and presses **Confirm booking** before the server creates an appointment. Change department clears the previous doctor/time and review while retaining the preferred date.

## Current scope

The booking card groups controls by purpose: full-width department/doctor choices, a three-column time grid, a full-width confirmation action, a separated two-column grid for changes and a muted discard row. Buttons have consistent gaps, wrap long labels and have a minimum 44px height.

- Only doctors in Zoi's MongoDB Doctor collection are bookable. External hospital directory entries do not create doctor accounts or availability.
- Availability uses the existing Zoi slot grid: 09:00–12:30 and 14:00–15:30 at 30-minute intervals, every day, in Asia/Kolkata time. This is an application booking policy, not verified individual consultant shifts. Past slots and existing reservations are excluded. Dates are limited to the next 90 days, including today.
- New appointments have status `Scheduled`, subject to doctor approval. There is no live connection to an external hospital scheduling system.
- Booking uses the signed-in account's name, email and user ID. Both existing booking forms load the account profile and make name/email read-only. Phone is entered in the review card and goes directly to the booking endpoint; it is not added to AI history. Chat booking uses pay-at-clinic and collects no payment details.
- Changing the doctor/date/time replaces the displayed review. Discard draft does not cancel an existing appointment. Appointment cancellation and rescheduling are outside this version.

## Modules and request flow

| File | Responsibility |
| --- | --- |
| `backend/services/chatService.js` | One structured provider call returns ordinary reply text or a proposed booking intent. Model output never performs a write. |
| `backend/services/bookingConversation.js` | Validates public draft fields, resolves registered doctors and produces selection/review stages. Button selections bypass the model. |
| `backend/services/appointmentService.js` | Shared doctor resolution, date/slot checks, account-bound signed review tokens, booking writes and retry protection. |
| `backend/controllers/appointmentController.js` | Patient-only creation/confirmation and doctor-only, owner-scoped listing/approval/rejection. |
| `backend/models/Appointment.js` | Optional doctor ID, slot reservation and request key fields plus partial unique indexes. |
| `mediic/src/features/chat/ChatAssistant.jsx` | Chat state, booking draft, confirmation request and server receipt. |
| `mediic/src/features/chat/renderBookingPanel.jsx` | Localized choices, date/time controls, contact review, confirmation and receipt. |

`POST /api/chat` accepts the existing language/messages fields plus an optional public `bookingDraft` and a single `bookingSelection`. It only reads data and prepares a review. A signed review expires after ten minutes and binds the user, doctor ID, doctor name/hospital snapshot, date and time.

`POST /api/appointments/chat/confirm` accepts the signed `confirmationToken` and phone number. It revalidates the doctor, date and slot, binds ownership to authentication and returns a receipt only after saving. The signed request identifier provides retry protection. A repeated valid confirmation returns the original appointment rather than saving or emailing twice.

`POST /api/appointments` uses the same booking service. `GET /api/appointments/profile` returns only the authenticated patient's own name, email and phone with no-store caching.

## Database compatibility

No existing appointment is rewritten or deleted. Two partial unique indexes protect new writes: reserved doctor/date/time and booking request key. Mongoose may create these indexes on startup; the booking service also waits for their creation before accepting writes and fails closed if this fails. Atlas therefore needs index-creation permission. The feature does not run a separate migration or drop indexes.

Legacy appointments are still checked by normalized doctor name when checking occupancy. Legacy owner access additionally requires a matching hospital and an unambiguous doctor identity; records with stable doctor IDs use those IDs. Rejection releases a new reservation. Historical name-only records remain less precise than ID-based records.

Appointment notifications run after saving. Delivery failure is logged with a fixed code and does not report a saved appointment as failed. The patient email says scheduled, subject to approval. No card number, client-supplied owner or client-supplied status is saved by this service.

## Validation performed

From `backend`: `npm.cmd test` passes 41 tests. From `mediic`: `npm.cmd test` passes six rendering/security tests; targeted ESLint of the chat modules and `npm.cmd run build` pass. Existing unrelated asset-resolution, bundle-size and Browserslist warnings remain.

The tests use mocked provider/database boundaries. They cover input handling, India-time validation, legacy occupancy, simulated racing writes, repeat confirmations, index definitions, failed index setup, failed email delivery, signed-token binding, role/ownership checks, model-output validation and localized review rendering. They do not prove live Atlas index behavior, live Gemini extraction quality or browser interaction. No real appointment or email is created by these tests.

## Local verification

1. Restart the backend in its existing PowerShell terminal. If the local resolver still needs the established override, use:

   ```powershell
   node -e "require('node:dns').setServers(['1.1.1.1', '1.0.0.1']); require('./index.js');"
   ```

2. Refresh the frontend and start a fresh chat. Use **Book in chat** to choose a department first. Departments reflect registered doctors; an empty list means a doctor account with a specialty must be registered first.
3. Choose one registered doctor in the selected department, tomorrow and a listed slot. Check the review, change department/date/time, and discard once to verify that preparation alone creates nothing.
4. Type a request using that registered doctor's name and an explicit AM/PM time. Check the extracted date/time before confirming. Repeat preparation in Hindi/Bengali.
5. To test a real save, use an intended test appointment and your contact information, then press Confirm booking. This writes to the configured database and attempts the existing patient/doctor emails. Verify the receipt and the corresponding doctor's appointment list. The UI must never claim external hospital confirmation.
6. Check that the slot is no longer offered and that a different doctor cannot approve or read the appointment. Verify a normal form booking still succeeds for an available slot.

After this user-side check passes, the next feature is extraction of clear printed prescriptions and synthetic documents, with extracted fields reviewed before any subsequent use.
