/**
 * Cloudflare Pages Function — POST /api/sendmail
 * Sends email via smtp.qq.com:465 using raw SMTP over TLS.
 * No external dependencies, uses Workers runtime connect() API.
 */
import { connect } from 'cloudflare:connect';

// ─── SMTP Configuration (mirrors mail_server.js) ───
const SMTP_HOST     = 'smtp.qq.com';
const SMTP_PORT     = 465;
const SMTP_FROM     = '3665068397@qq.com';
const SMTP_USER     = '3665068397@qq.com';
const EMAIL_KEY     = 'infra-server-key';
const ENCRYPTED_PWD = 'BBcTGg5dHBYfDhULSQoMEw==';

function decryptPwd(encrypted, key) {
  var raw = atob(encrypted);
  var r = '';
  for (var i = 0; i < raw.length; i++) {
    r += String.fromCharCode(raw.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return r;
}

function encodeBase64(str) {
  var bytes = new TextEncoder().encode(str);
  var binary = '';
  for (var i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function onRequest(context) {
  var request = context.request;

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    var data = await request.json();
    var toList     = data.to || [];
    var subject    = data.subject || '';
    var bodyText   = data.body || '';
    var attachment = data.attachment || '';
    var filename   = data.filename || '';

    if (!toList.length || !subject) {
      return new Response(JSON.stringify({ ok: false, error: '缺少收件人或主题' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    await sendMail(toList, subject, bodyText, attachment, filename);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
}

async function sendMail(toList, subject, bodyText, attachmentBase64, attachmentName) {
  var password = decryptPwd(ENCRYPTED_PWD, EMAIL_KEY);

  // Open TLS connection to QQ Mail SMTP
  var socket = connect({ host: SMTP_HOST, port: SMTP_PORT, tls: true });
  var writer = socket.writable.getWriter();
  var reader = socket.readable.getReader();
  var encoder = new TextEncoder();

  async function readLine() {
    var buffer = '';
    while (true) {
      var result = await reader.read();
      if (result.done) break;
      buffer += new TextDecoder().decode(result.value);
      var idx = buffer.indexOf('\n');
      if (idx !== -1) {
        var line = buffer.substring(0, idx).replace(/\r$/, '');
        // Put back excess data (simplified: we assume responses fit in one chunk for qq.com)
        return line;
      }
    }
    return buffer;
  }

  async function cmd(text) {
    await writer.write(encoder.encode(text + '\r\n'));
    var line = await readLine();
    return line;
  }

  async function cmdMultiline(text) {
    await writer.write(encoder.encode(text + '\r\n'));
    // Read until we get a response starting with 3-digit code + space (not dash)
    var buffer = '';
    while (true) {
      var result = await reader.read();
      if (result.done) break;
      buffer += new TextDecoder().decode(result.value);
      // Check if we have a complete final response line
      var lines = buffer.split('\n');
      for (var i = lines.length - 1; i >= 0; i--) {
        var trimmed = lines[i].replace(/\r$/, '');
        if (/^\d{3} /.test(trimmed)) {
          return trimmed;
        }
      }
      // If buffer is very large, extract what we have
      if (buffer.length > 4096) {
        return buffer.split('\n')[0].replace(/\r$/, '');
      }
    }
    return buffer.split('\n')[0].replace(/\r$/, '');
  }

  try {
    // 1. Greeting
    var greeting = await readLine();
    if (greeting.substring(0, 3) !== '220') throw new Error('SMTP greeting failed: ' + greeting);

    // 2. EHLO (use multiline read for the extended response)
    var ehloResp = await cmd('EHLO mailer');
    if (ehloResp.substring(0, 3) !== '250') throw new Error('EHLO failed: ' + ehloResp);

    // 3. AUTH LOGIN
    var authStep1 = await cmd('AUTH LOGIN');
    if (authStep1.substring(0, 3) !== '334') throw new Error('AUTH LOGIN failed: ' + authStep1);

    var authStep2 = await cmd(encodeBase64(SMTP_USER));
    if (authStep2.substring(0, 3) !== '334') throw new Error('AUTH username failed: ' + authStep2);

    var authStep3 = await cmd(encodeBase64(password));
    if (authStep3.substring(0, 3) !== '235') throw new Error('AUTH password failed: ' + authStep3);

    // 4. MAIL FROM
    var mfResp = await cmd('MAIL FROM:<' + SMTP_FROM + '>');
    if (mfResp.substring(0, 3) !== '250') throw new Error('MAIL FROM failed: ' + mfResp);

    // 5. RCPT TO
    for (var i = 0; i < toList.length; i++) {
      var rcptResp = await cmd('RCPT TO:<' + toList[i] + '>');
      if (rcptResp.substring(0, 3) !== '250') throw new Error('RCPT TO failed for ' + toList[i] + ': ' + rcptResp);
    }

    // 6. DATA
    var dataResp = await cmd('DATA');
    if (dataResp.substring(0, 3) !== '354') throw new Error('DATA failed: ' + dataResp);

    // 7. Build MIME message
    var boundary = '----=_Part_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
    var msg = 'From: ' + SMTP_FROM + '\r\n';
    msg += 'To: ' + toList.join(', ') + '\r\n';
    msg += 'Subject: =?UTF-8?B?' + encodeBase64(subject) + '?=\r\n';
    msg += 'MIME-Version: 1.0\r\n';
    msg += 'Content-Type: multipart/mixed; boundary="' + boundary + '"\r\n';
    msg += '\r\n';
    msg += '--' + boundary + '\r\n';
    msg += 'Content-Type: text/plain; charset=UTF-8\r\n';
    msg += 'Content-Transfer-Encoding: base64\r\n';
    msg += '\r\n';
    msg += encodeBase64(bodyText) + '\r\n';

    if (attachmentBase64 && attachmentName) {
      msg += '--' + boundary + '\r\n';
      msg += 'Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\r\n';
      msg += 'Content-Transfer-Encoding: base64\r\n';
      msg += 'Content-Disposition: attachment; filename*=UTF-8\'\'' + encodeURIComponent(attachmentName) + '\r\n';
      msg += '\r\n';
      // Split base64 into 76-char lines per MIME spec
      for (var j = 0; j < attachmentBase64.length; j += 76) {
        msg += attachmentBase64.substring(j, j + 76) + '\r\n';
      }
    }

    msg += '--' + boundary + '--\r\n';
    msg += '.\r\n';

    await writer.write(encoder.encode(msg));

    // Read DATA response
    var dataEndResp = await readLine();
    if (dataEndResp.substring(0, 3) !== '250') throw new Error('DATA send failed: ' + dataEndResp);

    // 8. QUIT
    await cmd('QUIT');
  } finally {
    try { writer.close(); } catch(e) { /* ignore */ }
    try { reader.cancel(); } catch(e) { /* ignore */ }
  }
}
