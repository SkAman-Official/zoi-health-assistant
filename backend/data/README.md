# Local hospital directory

`hospitals.json` holds the public hospital information used by Zoi Assistant. The initial dataset contains Woodlands Alipore, Fortis Anandapur and IPGME&R/SSKM, with selected departments and doctor listings. It is not training data: the server reads its records and supplies them as context when answering questions.

Add at most 10 hospitals, initially 2 or 3. Use the specific hospital branch rather than a hospital group. Collect publicly published names, departments, opening hours and doctor shifts from official hospital sources, and record a check date. Leave unknown hours and shifts empty. A published shift is not live appointment availability. Do not add patient records, internal staff rosters, or credentials.

All times are interpreted in Asia/Kolkata. Write explicit days, start and end times, and exceptions where the source provides them. Each doctor listing requires its own source URL and check date; department opening hours also require their own source and date. The hospital-level source must support any hospital-level opening hours. The application validates provenance fields, not the truth of a source; a human must verify each record.

The active Woodlands records are enriched from woodlands-opd.json, extracted from the user's 16-page official booklet. It contains 179 consultation listing rows across 30 table departments. Publication date is unknown. Use sourcePage and the linked PDF for provenance. Sessions marked merged_columns_requires_confirmation preserve the printed column span without asserting independently confirmed attendance on every spanned day. Multiple listings for the same doctor can represent different clinics. The original hospitals.json is the initial website snapshot; runtime merging supplies the booklet records.

This fictional example illustrates the format only. Do not add it as a real hospital:

```json
{
  "hospitals": [
    {
      "name": "Synthetic Hospital",
      "address": "Synthetic address",
      "operatingHours": "",
      "sourceUrl": "https://example.test/hospital",
      "lastChecked": "2026-10-15",
      "departments": [
        {
          "name": "Cardiology",
          "hours": "Monday to Friday 09:00 to 17:00",
          "sourceUrl": "https://example.test/departments",
          "lastChecked": "2026-10-15"
        }
      ],
      "doctors": [
        {
          "name": "Synthetic Doctor",
          "department": "Cardiology",
          "specialty": "Cardiology",
          "shifts": "Tuesday 10:00 to 12:00; appointment required",
          "sourceUrl": "https://example.test/doctor",
          "lastChecked": "2026-10-15"
        }
      ]
    }
  ]
}
```

The file is read on each chat request, so data edits do not require a backend restart. Directory validation fails closed when required sources or dates are missing. A date is a record of manual checking, not a guarantee that a schedule remains current.

With a cloud provider, this locally stored context is transmitted to that provider along with the conversation. With Ollama, model requests use a fixed loopback endpoint. Use an actually local downloaded model and disable Ollama cloud features for a local inference setup. Zoi's Atlas connection and existing authentication still depend on the internet; selecting Ollama alone does not make the entire app offline.
