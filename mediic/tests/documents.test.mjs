import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateSelectedFile, documentRequest } from '../src/features/documents/documentApi.js';

test('upload accepts bounded JPG/PNG and rejects other or empty files', () => {
  validateSelectedFile({ type: 'image/png', size: 100 }); validateSelectedFile({ type: 'image/jpeg', size: 100 });
  for (const file of [null, { type: 'application/pdf', size: 100 }, { type: 'image/png', size: 0 }, { type: 'image/png', size: 5242881 }]) assert.throws(() => validateSelectedFile(file));
});
test('requests use patient credentials only and return safe connection/session failures', async () => {
  const originalFetch = globalThis.fetch; const originalStorage = globalThis.localStorage;
  try {
    globalThis.localStorage = { getItem: key => key === 'doctorToken' ? 'doctor-only' : null };
    await assert.rejects(documentRequest('/api/documents'), /patient account/);
    globalThis.localStorage = { getItem: key => key === 'token' ? 'patient-token' : null };
    globalThis.fetch = async (url, options) => { assert.equal(options.headers.Authorization, 'Bearer patient-token'); assert.equal(options.cache, 'no-store'); return { ok: false, status: 401, json: async () => ({ message: 'internal detail' }) }; };
    await assert.rejects(documentRequest('/api/documents'), /session has expired/);
    globalThis.fetch = async () => { throw new Error('private internal detail'); };
    await assert.rejects(documentRequest('/api/documents'), /Unable to reach Zoi/);
  } finally { globalThis.fetch = originalFetch; globalThis.localStorage = originalStorage; }
});
