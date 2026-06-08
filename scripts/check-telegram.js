const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const applyHandler = require('../api/apply');

const ROOT = path.resolve(__dirname, '..');

const loadEnv = () => {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) return false;

  fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const index = trimmed.indexOf('=');
    if (index === -1) return;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, '');
    if (key && process.env[key] === undefined) process.env[key] = value;
  });
  return true;
};

const callApply = async () => {
  const payload = {
    fullName: 'تست اتصال تلگرام',
    phone: '09120000000',
    email: 'test@example.com',
    age: '16',
    course: 'تست ارسال فرم COOci Dev Academy',
    level: 'تست',
    preferredContact: 'تلگرام',
    message: 'این پیام فقط برای بررسی اتصال فرم سایت به تلگرام ارسال شده است.',
    source: 'Local Telegram Check',
    submittedAt: new Date().toISOString()
  };

  const req = Readable.from([JSON.stringify(payload)]);
  req.method = 'POST';
  req.headers = { origin: 'local-check' };
  req.socket = { remoteAddress: '127.0.0.1' };

  let statusCode = 0;
  let output = '';
  const res = {
    setHeader() {},
    get statusCode() { return statusCode; },
    set statusCode(value) { statusCode = value; },
    end(value = '') { output = value; }
  };

  await applyHandler(req, res);
  return { statusCode, output };
};

const describeChatId = (chatId) => {
  if (/^-?\d+$/.test(chatId)) return 'numeric';
  if (chatId.startsWith('@')) return 'username';
  if (/^https?:\/\//i.test(chatId)) return 'url';
  return 'other';
};

const readTelegramResponse = async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { ok: false, description: text };
  }
};

const checkBotToken = async () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
  const body = await readTelegramResponse(res);
  console.log(`getMe status: ${res.status}`);
  if (body.ok) {
    console.log(`bot username: @${body.result.username}`);
  } else {
    console.log(`getMe error: ${body.description || 'unknown_error'}`);
  }
  return body.ok;
};

const checkDirectSend = async () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: `COOci Dev Academy direct Telegram check\n${new Date().toISOString()}`,
      disable_web_page_preview: true
    })
  });
  const body = await readTelegramResponse(res);
  console.log(`direct send status: ${res.status}`);
  console.log(`direct send result: ${body.ok ? 'ok' : (body.description || 'unknown_error')}`);
  return body.ok;
};

(async () => {
  const hasEnv = loadEnv();
  if (!hasEnv) {
    console.error('Missing .env. Create it from .env.example first.');
    process.exit(1);
  }

  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in .env.');
    process.exit(1);
  }

  console.log(`chat id format: ${describeChatId(process.env.TELEGRAM_CHAT_ID)}`);
  const botOk = await checkBotToken();
  if (!botOk) {
    process.exit(1);
  }

  const directOk = await checkDirectSend();
  if (!directOk) {
    process.exit(1);
  }

  const result = await callApply();
  console.log(`apply status: ${result.statusCode}`);
  console.log(result.output);

  if (result.statusCode !== 200) {
    process.exit(1);
  }
})();
