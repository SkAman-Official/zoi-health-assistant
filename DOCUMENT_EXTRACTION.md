# Reviewed medical document extraction

Zoi provides a patient-only Documents page at `/home/documents`, linked from navigation and chat. The screen follows the existing violet/white design. Clear, single-page printed JPG/PNG images are supported: 5 MiB, 20 megapixels and 10,000 pixels per side maximum. PDFs and handwritten clinical content are outside this version.

Choosing an image creates a local preview. Only pressing Extract after explicit consent sends the image to Gemini. The original file is not saved by Zoi. Cloud processing still sends its contents to Google; use synthetic/redacted documents or documents whose processing is authorized. The provider's retention policies apply independently of Zoi's storage behavior.

The backend requests literal transcription into doctor, clinic, date, medicine name/strength/instructions/duration, printed notes and raw text. The prompt prohibits guesses, medical recommendations, abbreviation expansion and instructions embedded in the document. Missing fields remain blank and flagged. A provider classification of handwritten, unclear or unrelated content is rejected. Classification and transcription are model outputs and can be wrong; these checks are not a guarantee of legibility or accuracy.

Patients compare editable text with the image and explicitly confirm review before saving. Edits reset the review checkbox. User-reviewed means transcription review, not medical verification. A signed, account-bound review expires after 30 minutes. A unique extraction key makes identical save retries return the existing record; conflicting edits receive 409. The new ReviewedDocument collection stores reviewed text, timestamps, source digest and extraction metadata, not image bytes. Index creation is required before writing. No existing collections are migrated.

Reads are patient-only and owner-scoped. The saved list shows the latest 30 records; records open read-only. Saved content is not included in chat context, shared with doctors or interpreted clinically. Record deletion/edit-after-save, PDF parsing, handwriting, clinical validation and hospital integration are not implemented.

## Configuration and use

Reuse server-side `GEMINI_API_KEY`, `GEMINI_MODEL` and `JWT_SECRET`. Optional `GEMINI_DOCUMENT_MODEL` selects a separate image-capable model. No frontend key is needed and no dependency installation is required. The current project uses `gemini-3.5-flash-lite`.

Restart the backend after changes, then refresh the frontend. With the existing DNS workaround, run from backend:

```powershell
node -e "require('node:dns').setServers(['1.1.1.1', '1.0.0.1']); require('./index.js');"
```

From mediic, use `npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort`. Sign in as a patient, open Documents, choose Use synthetic sample, consent and extract. Compare/correct fields, confirm review and save. Reopen the saved record. This final authenticated browser/Atlas check remains unverified by the agent.

`node scripts/check-document-extraction.cjs` from backend makes one real Gemini request using only the bundled fictional sample. It prints safe status information and never saves a document. This live diagnostic passes on 2026-10-15 with the configured model; it verifies structured output containing the expected fictional medicine label, not comprehensive OCR accuracy.

## File index and validation

- `backend/services/documentExtraction.js`: image limits, provider boundary, structured validation and signed review.
- `backend/controllers/documentController.js`, `routes/documentRoutes.js`, `models/ReviewedDocument.js`: private API and persistence.
- `mediic/src/features/documents/`: upload, consent, preview, editing, review and saved records.
- `mediic/public/samples/zoi-synthetic-prescription.png`: fictional printed test fixture, no real medicines or identities.
- `backend/tests/documentExtraction.test.js`, `mediic/tests/documents.test.mjs`, `chatMarkdown.test.mjs`: mocked provider/database tests and static UI rendering.

Automated suites cover invalid uploads, provider errors, handwriting classification rejection, expiry/account binding, explicit review, owner filters, retry conflicts, index failure, role guard, safe rendering and patient credentials. Tests do not make live Atlas writes. Production build and focused extraction/chat lint pass; existing legacy asset/Browserslist/bundle warnings remain. Live browser layout and reviewed-record persistence are not verified here.

Gemini image-input format follows Google's official compatibility documentation: https://ai.google.dev/gemini-api/docs/openai#image_understanding
