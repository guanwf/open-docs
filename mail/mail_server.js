#!/usr/bin/env node
/**
 * 邮件发送服务 — 用于 infra-servers.html
 * 启动: node mail_server.js [端口]
 * 然后浏览器访问 http://localhost:端口/infra-servers.html
 *
 * 依赖: npm install nodemailer
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// ─── SMTP 配置（密码加密存储） ───
const SMTP_HOST = 'smtp.qq.com';
const SMTP_PORT = 465;
const SMTP_FROM = '3665068397@qq.com';
const SMTP_USER = '3665068397@qq.com';

// XOR 解密
const _EMAIL_KEY = 'infra-server-key';
const _ENCRYPTED_PWD = 'BBcTGg5dHBYfDhULSQoMEw==';

function decryptPwd(encrypted, key) {
    const raw = Buffer.from(encrypted, 'base64').toString('binary');
    let r = '';
    for (let i = 0; i < raw.length; i++) {
        r += String.fromCharCode(raw.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return r;
}

// ─── SMTP 发送函数 ───

async function sendMail(toList, subject, bodyText, attachmentBase64, attachmentName) {
    const password = decryptPwd(_ENCRYPTED_PWD, _EMAIL_KEY);

    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: true, // 465 → SSL
        auth: {
            user: SMTP_USER,
            pass: password,
        },
    });

    const mailOptions = {
        from: SMTP_FROM,
        to: toList.join(', '),
        subject: subject,
        text: bodyText,
    };

    // 添加附件
    if (attachmentBase64 && attachmentName) {
        mailOptions.attachments = [
            {
                filename: attachmentName,
                content: attachmentBase64,
                encoding: 'base64',
            },
        ];
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('  ✅ 邮件已发送至:', toList.join(', '), '(messageId:', info.messageId, ')');
    return info;
}

// ─── HTTP 服务器 ───

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/api/sendmail') {
        handleSendMail(req, res);
        return;
    }

    // On Render, only expose the API; hide static pages
    if (process.env.RENDER) {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Mail API service — use POST /api/sendmail');
      return;
    }
    serveStatic(req, res);
});

function handleSendMail(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
        try {
            const data = JSON.parse(body);
            const toList = data.to || [];
            const subject = data.subject || '';
            const bodyText = data.body || '';

            if (!toList.length || !subject) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ ok: false, error: '缺少收件人或主题' }));
                return;
            }

            await sendMail(toList, subject, bodyText, data.attachment || '', data.filename || '');
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ ok: true, message: '邮件发送成功' }));
        } catch (e) {
            console.error('  ❌ 发送失败:', e.message);
            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ ok: false, error: e.message }));
        }
    });
}

function serveStatic(req, res) {
    let urlPath = req.url.split('?')[0];
    if (urlPath === '/') urlPath = '/infra-servers.html';

    const filePath = path.join(__dirname, '..', 'infra', urlPath);
    const ext = path.extname(filePath).toLowerCase();

    if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found: ' + urlPath);
        return;
    }

    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
}

// ─── 启动 ───
const PORT = parseInt(process.env.PORT) || parseInt(process.argv[2]) || 8080;

server.listen(PORT, '0.0.0.0', () => {
    console.log('═'.repeat(50));
    console.log('  📧 邮件发送服务已启动');
    console.log(`  🌐 访问地址: http://localhost:${PORT}/infra-servers.html`);
    console.log(`  📮 邮件 API: http://localhost:${PORT}/api/sendmail`);
    console.log(`  🖐  按 Ctrl+C 停止`);
    console.log('═'.repeat(50));
});
