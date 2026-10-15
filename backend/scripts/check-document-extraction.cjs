// Uses only the bundled fictional sample. Never accepts a private-image argument.
require('dotenv').config({
  quiet: true
});
const fs = require('node:fs');
const path = require('node:path');
const {
  getDocumentConfig,
  validateImage,
  extractDocument
} = require('../services/documentExtraction');
(async () => {
  try {
    const config = getDocumentConfig();
    console.log('Provider: gemini');
    console.log('Model:', config.model);
    console.log('Credential configured:', Boolean(config.apiKey));
    const file = path.resolve(__dirname, '../../mediic/public/samples/zoi-synthetic-prescription.png');
    const image = validateImage({
      consent: true,
      mimeType: 'image/png',
      base64: fs.readFileSync(file).toString('base64')
    });
    const result = await extractDocument({
      image,
      config
    });
    if (!result.extraction.medicines.some(row => row.name.value.includes('DEMO-MED A'))) throw Object.assign(new Error(), {
      code: 'SAMPLE_CONTENT_MISMATCH'
    });
    console.log('PASS: Synthetic printed image returns structured transcription. No record is saved.');
  } catch (error) {
    console.log('FAIL:', error.code || 'DOCUMENT_UNAVAILABLE');
    if (error.diagnostic?.upstreamStatus) console.log('Provider HTTP status:', error.diagnostic.upstreamStatus);
    process.exitCode = 1;
  }
})();
