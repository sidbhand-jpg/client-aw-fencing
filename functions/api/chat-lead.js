import { json, hasTestMarker, validTest, sign, testMessage } from '../_lib/security.js';

const attributionFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'ad_id', 'adset_id', 'campaign_id', 'fbclid', 'fbp', 'fbc', 'source_url', 'user_agent'];
const text = (value, max = 200) => typeof value === 'string' ? value.trim().slice(0, max) : '';

export async function onRequestPost({ request, env }) {
  if (request.headers.get('origin') !== new URL(request.url).origin) return json({ ok: false, error: 'Origin not allowed' }, 403);
  if (!env.AW_MAKE_WEBHOOK_URL) return json({ ok: false, error: 'Online submissions are being configured.' }, 503);
  let input;
  try { input = await request.json(); }
  catch { return json({ ok: false, error: 'Invalid form' }, 400); }
  if (!input || typeof input !== 'object' || Array.isArray(input)) return json({ ok: false, error: 'Invalid form' }, 400);
  const body = {
    business: 'A&W Fencing', lead_source: 'A&W Fencing Website Chat', funnel_variant: 'website_chat_v1',
    name: text(input.name), email: text(input.email, 320), phone: text(input.phone, 40),
    project_type: text(input.project_type), message: text(input.message, 4000),
    sms_consent: 'false', zip: '', fence_type: '',
    lead_event_id: text(input.lead_event_id, 200), submitted_at: text(input.submitted_at, 100),
  };
  const test = hasTestMarker(input);
  if (test) {
    body.test_mode = input.test_mode;
    body.test_signature = input.test_signature;
    if (!(await validTest(body, env.AW_TEST_SIGNING_KEY))) return json({ ok: false, error: 'Unauthorized test submission' }, 403);
  }
  if (!body.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)
      || !/^\+?[\d\s().-]{10,40}$/.test(body.phone) || body.phone.replace(/\D/g, '').length < 10
      || !body.project_type || !body.message || !/^evt_[A-Za-z0-9_]+$/.test(body.lead_event_id)
      || !Number.isFinite(Date.parse(body.submitted_at))) return json({ ok: false, error: 'Please check your contact and project details.' }, 400);
  for (const field of attributionFields) body[field] = text(input[field], 2000);
  // The existing Houzflow intake stores project_type in its project summary.
  // Keep the selected service and free-text details together without app changes.
  body.service = body.project_type;
  body.project_type = `${body.service} — ${body.message}`;
  if (test) {
    // Re-sign the normalized payload using the app's existing A–E test protocol.
    // This variant is synthetic only; real leads keep website_chat_v1.
    body.funnel_variant = 'A';
    body.test_signature = await sign(testMessage(body), env.AW_TEST_SIGNING_KEY);
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const upstream = await fetch(env.AW_MAKE_WEBHOOK_URL, {
      method: 'POST', body: new URLSearchParams(body), signal: controller.signal,
    });
    const receipt = await upstream.json().catch(() => null);
    if (!upstream.ok || receipt?.accepted !== true || receipt.test !== test
        || receipt.event_id !== body.lead_event_id || (!test && !receipt.id)) {
      return json({ ok: false, error: 'We could not confirm your request. Please try again.' }, 502);
    }
    return json({ ok: true, accepted: true, duplicate: Boolean(receipt.duplicate), test, event_id: body.lead_event_id });
  } catch {
    return json({ ok: false, error: 'We could not send your request. Please try again.' }, 502);
  } finally { clearTimeout(timeout); }
}
