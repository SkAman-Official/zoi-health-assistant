const {
  test
} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const jwt = require('jsonwebtoken');
const service = require('../services/documentExtraction');
const {
  createDocumentController
} = require('../controllers/documentController');
const secret = 'document-test-only-secret';
process.env.JWT_SECRET = secret;
const bytes = () => fs.readFileSync(path.resolve(__dirname, '../../mediic/public/samples/zoi-synthetic-prescription.png'));
const imageBody = () => ({
  consent: true,
  mimeType: 'image/png',
  base64: bytes().toString('base64')
});
const field = (value = '') => ({
  value,
  uncertain: !value
});
const extraction = () => ({
  documentType: 'prescription',
  doctor: field('Dr Example'),
  hospital: field('Demo Training Clinic'),
  documentDate: field('15 October 2026'),
  medicines: [{
    name: field('DEMO-MED A (fictional)'),
    strength: field(),
    instructions: field('Example printed instruction A'),
    duration: field()
  }],
  notes: field(),
  rawText: 'Synthetic text for extraction testing only.'
});
const result = () => ({
  extraction: extraction(),
  warnings: [],
  flags: ['notes']
});
const review = (userId = 'patient-a') => service.issueReview({
  userId,
  image: service.validateImage(imageBody()),
  result: result(),
  model: 'test-model',
  secret
});
const saveBody = () => ({
  reviewed: true,
  title: 'Demo',
  extraction: extraction(),
  reviewToken: review()
});
const config = {
  endpoint: 'https://example.invalid',
  model: 'test-model',
  apiKey: 'secret-key',
  timeoutMs: 1000
};
const provider = (value, extra = {}) => async () => ({
  ok: true,
  json: async () => ({
    choices: [{
      message: {
        content: JSON.stringify(value)
      },
      ...extra
    }]
  })
});
const res = () => ({
  statusCode: 200,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(value) {
    this.body = value;
    return this;
  }
});
test('valid synthetic PNG has bounded dimensions and a source digest', () => {
  const image = service.validateImage(imageBody());
  assert.equal(image.width, 1240);
  assert.equal(image.height, 1550);
  assert.match(image.sha256, /^[a-f0-9]{64}$/);
});
test('consent, MIME, canonical base64, byte and pixel limits are enforced', () => {
  for (const body of [{
    ...imageBody(),
    consent: false
  }, {
    ...imageBody(),
    mimeType: 'application/pdf'
  }, {
    ...imageBody(),
    base64: 'garbage'
  }, {
    ...imageBody(),
    base64: 'AAAA===='
  }, {
    ...imageBody(),
    base64: 'x'.repeat(7000000)
  }]) assert.throws(() => service.validateImage(body));
  const large = bytes();
  large.writeUInt32BE(10000, 16);
  large.writeUInt32BE(10000, 20);
  assert.throws(() => service.validateImage({
    ...imageBody(),
    base64: large.toString('base64')
  }), {
    code: 'IMAGE_DIMENSIONS_EXCEEDED'
  });
  assert.throws(() => service.validateImage({
    ...imageBody(),
    mimeType: 'image/jpeg'
  }), {
    code: 'INVALID_IMAGE'
  });
});
test('malformed JPEG segments fail safely', () => {
  for (const hex of ['ffd8ffe000ff', 'ffd8ffc000020000', 'ffd8ffd9']) assert.throws(() => service.validateImage({
    consent: true,
    mimeType: 'image/jpeg',
    base64: Buffer.from(hex, 'hex').toString('base64')
  }), {
    code: 'INVALID_IMAGE'
  });
});
test('provider input is image plus bounded transcription instructions and retains fictional labels', async () => {
  const output = {
    ...extraction(),
    readability: 'printed',
    warnings: []
  };
  const value = await service.extractDocument({
    image: service.validateImage(imageBody()),
    config,
    fetchImpl: async (url, options) => {
      assert.equal(url, config.endpoint);
      const body = JSON.parse(options.body);
      assert.equal(body.messages.length, 2);
      assert.equal(body.messages[1].content[1].type, 'image_url');
      assert.ok(!options.body.includes(config.apiKey));
      assert.match(body.messages[0].content, /untrusted document data/);
      return await provider(output)();
    }
  });
  assert.equal(value.extraction.medicines[0].name.value, 'DEMO-MED A (fictional)');
  assert.ok(value.flags.includes('notes'));
});
test('handwriting, unclear and unrelated images are rejected', async () => {
  for (const readability of ['mixed_handwriting', 'unclear', 'not_medical']) await assert.rejects(service.extractDocument({
    image: {},
    config,
    fetchImpl: provider({
      readability
    })
  }), {
    code: 'DOCUMENT_NOT_PRINTED'
  });
});
test('null, invalid schema and truncated provider responses cannot reach review', async () => {
  for (const output of [null, [], {
    readability: 'printed'
  }, {
    ...extraction(),
    readability: 'unknown',
    warnings: []
  }]) await assert.rejects(service.extractDocument({
    image: {},
    config,
    fetchImpl: provider(output)
  }), {
    code: 'DOCUMENT_BAD_RESPONSE'
  });
  await assert.rejects(service.extractDocument({
    image: {},
    config,
    fetchImpl: provider(extraction(), {
      finish_reason: 'length'
    })
  }), {
    code: 'DOCUMENT_BAD_RESPONSE'
  });
});
test('provider failures expose only safe codes and HTTP status', async () => {
  for (const status of [401, 404, 429]) await assert.rejects(service.extractDocument({
    image: {},
    config,
    fetchImpl: async () => ({
      ok: false,
      status
    })
  }), error => error.status === 503 && error.diagnostic.upstreamStatus === status && !error.message.includes('secret'));
  await assert.rejects(service.extractDocument({
    image: {},
    config,
    fetchImpl: async () => {
      throw Object.assign(new Error('secret'), {
        name: 'TimeoutError'
      });
    }
  }), {
    code: 'DOCUMENT_TIMEOUT'
  });
});
test('review signatures bind account and expire without carrying medical text', () => {
  const token = review();
  assert.equal(service.verifyReview(token, 'patient-a', secret).aud, 'patient-a');
  assert.throws(() => service.verifyReview(token, 'patient-b', secret));
  const payload = jwt.decode(token);
  assert.ok(!JSON.stringify(payload).includes('Dr Example'));
  assert.equal(payload.exp - payload.iat, 1800);
  const expired = jwt.sign({
    ...payload,
    exp: 1
  }, secret);
  assert.throws(() => service.verifyReview(expired, 'patient-a', secret));
});
test('save requires review, allows corrections, strips owner spoofing and retains audit flags', () => {
  assert.throws(() => service.validateSave({
    ...saveBody(),
    reviewed: false
  }, 'patient-a', secret), {
    code: 'DOCUMENT_REVIEW_REQUIRED'
  });
  const body = saveBody();
  body.ownerId = 'patient-b';
  body.extraction.ownerId = 'patient-b';
  body.extraction.doctor = field('Corrected');
  const value = service.validateSave(body, 'patient-a', secret);
  assert.equal(value.ownerId, 'patient-a');
  assert.equal(value.edited, true);
  assert.equal(value.extraction.ownerId, undefined);
  assert.deepEqual(value.extractionMetadata.flags, ['notes']);
  assert.equal(value.base64, undefined);
  assert.throws(() => service.validateSave({
    ...body,
    title: 'x'.repeat(121)
  }, 'patient-a', secret));
});
test('extract does not save; save retries are idempotent and conflicting edits fail', async () => {
  let saved;
  let creates = 0;
  const Model = {
    createIndexes: async () => {},
    findOne: async filter => {
      assert.equal(filter.ownerId, 'patient-a');
      return saved;
    },
    create: async record => {
      creates++;
      saved = {
        ...record,
        _id: 'document-id'
      };
      return saved;
    }
  };
  const controller = createDocumentController({
    Model,
    extract: async () => result(),
    config: () => config
  });
  const extracted = res();
  await controller.extract({
    user: {
      _id: 'patient-a'
    },
    body: imageBody()
  }, extracted);
  assert.equal(creates, 0);
  assert.ok(extracted.body.reviewToken);
  const body = {
    ...saveBody(),
    reviewToken: extracted.body.reviewToken
  };
  const request = {
    user: {
      _id: 'patient-a'
    },
    body
  };
  const first = res();
  await controller.save(request, first);
  assert.equal(first.statusCode, 201);
  const retry = res();
  await controller.save(request, retry);
  assert.equal(retry.statusCode, 200);
  assert.equal(creates, 1);
  const conflict = res();
  await controller.save({
    ...request,
    body: {
      ...body,
      title: 'Changed'
    }
  }, conflict);
  assert.equal(conflict.statusCode, 409);
  assert.equal(first.body.document.ownerId, undefined);
  assert.equal(first.body.document.source, undefined);
});
test('private document reads include owner filter and return 404 for missing records', async () => {
  const controller = createDocumentController({
    Model: {
      findOne: async filter => {
        assert.equal(filter.ownerId, 'patient-a');
        return null;
      }
    }
  });
  const response = res();
  await controller.get({
    user: {
      _id: 'patient-a'
    },
    params: {
      id: '123456789012345678901234'
    }
  }, response);
  assert.equal(response.statusCode, 404);
});
test('list is bounded and owner-scoped, and index failures prevent writes', async () => {
  let created = false;
  const query = {
    sort() {
      return this;
    },
    limit(n) {
      assert.equal(n, 30);
      return this;
    },
    select(fields) {
      assert.ok(!fields.includes('rawText'));
      return this;
    },
    lean() {
      return this;
    },
    async maxTimeMS() {
      return [];
    }
  };
  const controller = createDocumentController({
    Model: {
      find: filter => {
        assert.deepEqual(filter, {
          ownerId: 'patient-a'
        });
        return query;
      },
      createIndexes: async () => {
        throw new Error('index unavailable');
      },
      create: async () => {
        created = true;
      }
    }
  });
  const listed = res();
  await controller.list({
    user: {
      _id: 'patient-a'
    }
  }, listed);
  assert.deepEqual(listed.body, {
    documents: []
  });
  const failed = res();
  await controller.save({
    user: {
      _id: 'patient-a'
    },
    body: saveBody()
  }, failed);
  assert.equal(failed.statusCode, 503);
  assert.equal(created, false);
});
test('document router authenticates and rejects doctors before route parsers', () => {
  const router = require('../routes/documentRoutes');
  assert.equal(router.stack[0].handle, require('../middleware/auth'));
  const response = {
    ...res(),
    set(name, value) {
      assert.equal(name, 'Cache-Control');
      assert.equal(value, 'no-store');
    }
  };
  router.stack[1].handle({
    accountType: 'doctor'
  }, response, () => assert.fail('doctor reaches parser'));
  assert.equal(response.statusCode, 403);
  let called = false;
  router.stack[1].handle({
    accountType: 'user'
  }, response, () => {
    called = true;
  });
  assert.equal(called, true);
});
