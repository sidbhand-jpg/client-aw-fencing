import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequestPost } from '../functions/api/chat-lead.js';
import { sign, testMessage, validTest } from '../functions/_lib/security.js';

const env = { AW_MAKE_WEBHOOK_URL: 'https://make.example/webhook', AW_TEST_SIGNING_KEY: 'mock-signing-key' };
const input = () => ({ name: 'Mock Contact', email: 'mock@example.com', phone: '(704) 555-0199',
  project_type: 'Residential Fence Installation', message: 'Wood fence, two gates & a sloping yard.',
  submitted_at: new Date().toISOString(), lead_event_id: 'evt_mock_widget', utm_campaign: 'mock-campaign' });
const request = (body, origin = 'https://aw-fencing.com') => new Request('https://aw-fencing.com/api/chat-lead', {
  method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify(body),
});

test('widget forwards Make-compatible fields and requires a matching Houzflow receipt', async () => {
  const original = globalThis.fetch;
  const body = input(); let mode = 'ok';
  globalThis.fetch = async (url, options) => {
    assert.equal(url, env.AW_MAKE_WEBHOOK_URL);
    const sent = Object.fromEntries(options.body);
    assert.equal(sent.lead_source, 'A&W Fencing Website Chat');
    assert.equal(sent.funnel_variant, 'website_chat_v1');
    assert.equal(sent.message, body.message);
    assert.equal(sent.service, body.project_type);
    assert.equal(sent.project_type, `${body.project_type} — ${body.message}`);
    assert.equal(sent.sms_consent, 'false');
    assert.equal(sent.zip, '');
    assert.equal(sent.utm_campaign, body.utm_campaign);
    if (mode === 'network') throw new Error('Offline');
    if (mode === 'default') return new Response('Accepted');
    return Response.json({ accepted: true, test: false, event_id: mode === 'wrong' ? 'evt_wrong' : body.lead_event_id,
      ...(mode !== 'missing-id' ? { id: 'mock-lead-id' } : {}), duplicate: mode === 'duplicate' }, { status: mode === 'error' ? 500 : 200 });
  };
  try {
    assert.equal((await onRequestPost({ request: request(body), env })).status, 200);
    mode = 'duplicate';
    assert.equal((await (await onRequestPost({ request: request(body), env })).json()).duplicate, true);
    for (mode of ['default', 'network', 'wrong', 'missing-id', 'error']) {
      assert.equal((await onRequestPost({ request: request(body), env })).status, 502, mode);
    }
  } finally { globalThis.fetch = original; }
});

test('invalid forms, cross-origin requests, and untrusted test markers never reach Make', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('Must not reach Make'); };
  try {
    assert.equal((await onRequestPost({ request: request(input(), 'https://other.example'), env })).status, 403);
    assert.equal((await onRequestPost({ request: request(input()), env: {} })).status, 503);
    for (const invalid of [null, [], { ...input(), email: 'bad' }, { ...input(), phone: '123' }, { ...input(), message: '' }]) {
      assert.equal((await onRequestPost({ request: request(invalid), env })).status, 400);
    }
    for (const marker of [{ lead_event_id: 'evt_awtest_unsigned' }, { test_mode: 'false' }, { test_signature: 'bad' }]) {
      assert.equal((await onRequestPost({ request: request({ ...input(), ...marker }), env })).status, 403);
    }
  } finally { globalThis.fetch = original; }
});

test('signed synthetic website tests retain suppression markers through Make', async () => {
  const original = globalThis.fetch;
  const body = { ...input(), name: 'Houzflow Synthetic Test', email: 'aw-test@example.com', phone: '2025550199',
    funnel_variant: 'website_chat_v1', zip: '', fence_type: '', sms_consent: 'false',
    lead_event_id: 'evt_awtest_widget_mock', test_mode: 'true' };
  body.test_signature = await sign(testMessage(body), env.AW_TEST_SIGNING_KEY);
  globalThis.fetch = async (url, options) => {
    const sent = Object.fromEntries(options.body);
    assert.equal(sent.test_mode, 'true'); assert.equal(sent.funnel_variant, 'A');
    assert.equal(await validTest(sent, env.AW_TEST_SIGNING_KEY), true);
    return Response.json({ accepted: true, test: true, event_id: sent.lead_event_id });
  };
  try {
    const response = await onRequestPost({ request: request(body), env });
    assert.equal(response.status, 200); assert.equal((await response.json()).test, true);
  } finally { globalThis.fetch = original; }
});
