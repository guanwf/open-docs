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

    // Send a quick wake-up request to cold-start the Render backend
    await fetch(backendUrl + '/api/sendmail', {
      method: 'OPTIONS',
      signal: AbortSignal.timeout(8000)
    }).catch(function(){});

    // Send actual email request with extended timeout
    var resp = await fetch(backendUrl + '/api/sendmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(25000)
    });
    var respText = await resp.text();
    var result;
    try { result = JSON.parse(respText); }
    catch(e) { throw new Error('后端响应异常: ' + respText.substring(0, 100)); }
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
