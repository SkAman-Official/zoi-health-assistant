# Zoi — Health Assistant

Zoi is a healthcare web application with patient and doctor portals, appointment requests, a multilingual assistant and reviewed medical document extraction. It uses React, Vite and Tailwind on the frontend, with Express and MongoDB on the backend. Original project/team attribution is retained in the existing source and project materials.

## Start here

| Directory | Responsibility |
| --- | --- |
| `mediic/src/features/` | Chat, conversational booking UI, doctor portal, document extraction and shared refresh behavior |
| `mediic/src/Router/router.jsx` | Application routes |
| `mediic/src/Main/` | Page layouts and portal shells |
| `mediic/src/Shared/` | Navigation, footer and other shared presentation components |
| `mediic/src/Component1/`–`Component5/`, `Pages/` | Original page components and compatibility entry points |
| `mediic/src/ComponentEmergencyServices/` | Emergency-service screens |
| `mediic/src/ComponentPharmacy/` | Pharmacy screens and cart |
| `backend/routes/` | HTTP routing, authentication and request middleware |
| `backend/controllers/` | Request/response orchestration |
| `backend/services/` | Booking rules, provider integration, document validation and public hospital retrieval |
| `backend/models/` | Mongoose schemas and indexes |
| `backend/data/` | Public hospital directory, published schedules and provenance |
| `backend/tests/`, `mediic/tests/` | Automated regression checks |
| `doc/` | Original template documentation and bundled vendor assets |

Keep the existing directory names during maintenance: renaming original components is a separate refactor. `doc/` and installed dependencies are not application source to reformat. Older components remain available until their use is conclusively established.

## Local setup

Use the two npm packages separately; the application root has no package.json. Both packages include lockfiles. Existing node_modules are already available in the development workspace. For a fresh checkout, run `npm ci` in each package using an appropriate Node.js environment; the current verification environment uses Node.js 24.13.0.

1. Create `backend/.env` using `backend/.env.example` as the variable checklist. Configure the MongoDB connection, JWT secret, permitted frontend origin and server-side provider/email settings as needed. Never commit real credentials.
2. Start the backend from `backend/` with `npm start` or `node index.js`.
3. Start the frontend from `mediic/` with `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort`.
4. Open `http://127.0.0.1:5173/`.

On this development machine the default Node DNS resolver fails MongoDB SRV lookups. The established process-only workaround is:

```powershell
node -e "require('node:dns').setServers(['1.1.1.1', '1.0.0.1']); require('./index.js');"
```

Run that command from `backend/`. It does not change Windows DNS. In PowerShell, use `npm.cmd` if the npm script shim is blocked by execution policy.

Frontend requests use relative `/api` URLs. The Vite development proxy forwards them to `127.0.0.1:5000`. A production host needs equivalent API routing; `vite build` alone does not deploy the backend.

## Implemented feature boundaries

- **Assistant:** English, Hindi and Bengali replies use server-side Gemini configuration. Public hospital context uses keyword retrieval; it does not use embeddings or model training. Private patient records are excluded from chat context.
- **Appointments:** The patient chooses a department, registered doctor, date and application slot, then explicitly confirms the server-signed review. Only registered Zoi accounts are bookable. Published external hospital shifts are information, not live availability. See [CONVERSATIONAL_BOOKING.md](CONVERSATIONAL_BOOKING.md).
- **Doctor portal:** Account-scoped appointments, patient summaries and supported profile edits use authenticated APIs. No invented medical histories or ratings are presented as account data. See [DOCTOR_PORTAL.md](DOCTOR_PORTAL.md).
- **Documents:** A patient explicitly consents to sending a printed JPG/PNG to Gemini, reviews the editable transcription and explicitly saves it to their account. Zoi stores reviewed text, not original image bytes. PDFs and handwriting are outside this version. See [DOCUMENT_EXTRACTION.md](DOCUMENT_EXTRACTION.md).
- **Hospital directory:** Published schedules retain source provenance and uncertainty. Consult [backend/data/README.md](backend/data/README.md) before editing directory records.

Legacy pharmacy and emergency-service screens retain their existing behavior. Their presence does not establish a production connection to a pharmacy, hospital or emergency dispatch service.

## Validation

Run from the indicated package:

| Package | Command | Purpose |
| --- | --- | --- |
| `backend` | `npm test` | Booking, authorization, provider boundaries, documents and directory regression tests |
| `mediic` | `npm test` | API helpers, data summaries, refresh behavior and static UI rendering |
| `mediic` | `npm run build` | Production frontend compilation |
| `mediic` | `npm run lint` | Whole frontend lint; outstanding legacy findings remain |
| `mediic` | `npx --no-install eslint src/features src/Router/router.jsx` | Focused maintained-feature and routing lint |

The backend diagnostic scripts `scripts/check-chat.cjs` and `scripts/check-document-extraction.cjs` make real provider requests and can consume quota. They are separate from the automated tests. The document diagnostic accepts only the bundled fictional sample and does not save it.

Automated tests use mocked provider/database boundaries and static rendering. They do not replace authenticated browser testing or demonstrate production readiness. The document synthetic-image Gemini diagnostic passes; Sky confirms extraction works in the UI. A reviewed-record save/reopen round trip is not yet confirmed. The existing asset-resolution, Browserslist and bundle-size build warnings remain documented limitations.

## Maintenance conventions

Use two-space indentation and readable statements. The frontend uses ES modules; the backend uses CommonJS. Keep related work in the existing feature/controller/service boundaries. Preserve API shapes, middleware order, database ownership checks and explicit confirmation steps when making presentation-only changes.

Comments explain constraints and non-obvious decisions, rather than keeping old implementations inside active files. Retain source provenance, security explanations, license notices and original attribution. Do not log passwords, tokens, provider credentials or document contents. Keep credentials in server-side environment variables. Do not remove apparently unused files, bare imports, assets or dependencies without checking their runtime and build effects.
