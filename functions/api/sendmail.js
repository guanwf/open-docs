/**
 * Cloudflare Pages Function — POST /api/sendmail
 * Forwards email request to Render-hosted mail_server.js backend.
 */
export async function onRequest(context) {
  var request = context.request;
  var backendUrl = context.env.MAIL_BACKEND_URL;

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  if (!backendUrl) {
    return new Response(JSON.stringify({ ok: false, error: 'MAIL_BACKEND_URL 未配置' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  try {
    var data = await request.json();
    var resp = await fetch(backendUrl + '/api/sendmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    var result = await resp.json();
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
}
