// POST /api/contact — the contact form's handler.
//
// OFF until configured. Turning it on needs three things that are not yet
// decided or created (docs/forms.md):
//   CONTACT_TO        — where messages go (who received Contact Form 7 mail)
//   TURNSTILE_SECRET  — Cloudflare Turnstile secret for spam protection
//   SEND_EMAIL        — a send_email binding (Cloudflare Email Service), which
//                       needs unfoldingword.org's DNS on Cloudflare
// Until then this answers 503 and the form is not rendered (the contact block
// shows address and phone only).
import type { Env } from './index';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export async function handleContact(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return json(405, { error: 'method not allowed' });
  if (!env.CONTACT_TO || !env.SEND_EMAIL || !env.TURNSTILE_SECRET) return json(503, { error: 'contact form not configured' });

  const form = await request.formData();
  const name = String(form.get('name') ?? '').trim().slice(0, 200);
  const email = String(form.get('email') ?? '').trim().slice(0, 200);
  const message = String(form.get('message') ?? '').trim().slice(0, 5000);
  if (form.get('website')) return json(200, { ok: true }); // honeypot: pretend success
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || message.length < 2) return json(400, { error: 'invalid' });

  const token = String(form.get('cf-turnstile-response') ?? '');
  const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token, remoteip: request.headers.get('CF-Connecting-IP') ?? '' }),
  });
  const outcome = (await verify.json()) as { success: boolean };
  if (!outcome.success) return json(400, { error: 'verification failed' });

  await env.SEND_EMAIL.send({
    to: env.CONTACT_TO,
    from: { email: 'website@unfoldingword.org', name: 'unfoldingword.org contact form' },
    replyTo: email,
    subject: `Website message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });
  return json(200, { ok: true });
}
