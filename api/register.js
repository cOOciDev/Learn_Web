const nodemailer = require('nodemailer');

// Configure these in Vercel Project Settings -> Environment Variables:
// TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, GMAIL_USER, GMAIL_APP_PASSWORD, ALLOWED_ORIGIN.
// Never place these values in public frontend files or commit them to git.
const TELEGRAM_API = 'https://api.telegram.org';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD = 120;
const MAX_MESSAGE = 1000;
const RATE_WINDOW_MS = 60 * 1000;
const RATE_LIMIT = 8;
const hits = new Map();

const LOCAL_ORIGINS = new Set([
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:8081',
  'http://127.0.0.1:8081'
]);

const cleanText = (value, max = MAX_FIELD) => {
  return String(value ?? '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
};

const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
};

const allowedOrigins = () => {
  const configured = String(process.env.ALLOWED_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  return new Set([...configured, ...LOCAL_ORIGINS]);
};

const applyCors = (req, res) => {
  const origin = req.headers.origin;
  if (!origin) return true;

  if (!allowedOrigins().has(origin)) {
    return false;
  }

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return true;
};

const readBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
};

const checkRateLimit = (req) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const current = hits.get(ip)?.filter((time) => now - time < RATE_WINDOW_MS) || [];
  current.push(now);
  hits.set(ip, current);
  return current.length <= RATE_LIMIT;
};

const formatJalaliDateTime = (value) => {
  const date = value ? new Date(value) : new Date();
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
  const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian-nu-latn', {
    timeZone: 'Asia/Tehran',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return `${formatter.format(safeDate)} - تهران`;
};

const formatMessage = (payload) => [
  'درخواست ثبت نام جدید COOci Dev',
  '',
  `نام: ${payload.fullName}`,
  `تماس: ${payload.phone}`,
  `ایمیل: ${payload.email || '-'}`,
  `سن: ${payload.age || '-'}`,
  `دوره: ${payload.course}`,
  `سطح: ${payload.level || '-'}`,
  `روش ارتباط: ${payload.preferredContact || '-'}`,
  `توضیحات: ${payload.message || '-'}`,
  '',
  `منبع: ${payload.source}`,
  `زمان ارسال: ${payload.submittedAtJalali}`
].join('\n');

const buildPayload = (body) => {
  const submittedAt = cleanText(body.submittedAt || new Date().toISOString(), 40);
  return {
    fullName: cleanText(body.fullName),
    phone: cleanText(body.phone, 40),
    email: cleanText(body.email),
    age: cleanText(body.age, 3),
    course: cleanText(body.course),
    courseId: cleanText(body.courseId),
    level: cleanText(body.level),
    preferredContact: cleanText(body.preferredContact),
    message: cleanText(body.message, MAX_MESSAGE),
    source: cleanText(body.source || 'CoociDev Academy Landing'),
    submittedAt,
    submittedAtJalali: formatJalaliDateTime(submittedAt)
  };
};

const validatePayload = (payload) => {
  if (payload.email && !EMAIL.test(payload.email)) return 'invalid_email';
  if (payload.fullName.length < 3 || !payload.phone || !payload.course) return 'missing_required_fields';
  return null;
};

const sendTelegram = async (messageText) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { ok: false, error: 'telegram_not_configured' };

  try {
    const telegramRes = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        disable_web_page_preview: true
      })
    });

    return telegramRes.ok ? { ok: true } : { ok: false, error: 'telegram_send_failed' };
  } catch {
    return { ok: false, error: 'telegram_send_failed' };
  }
};

const sendGmail = async (payload, messageText) => {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (!gmailUser || !gmailPass) return { ok: false, error: 'gmail_not_configured' };

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass
      }
    });

    await transporter.sendMail({
      from: `COOci Dev Academy <${gmailUser}>`,
      to: gmailUser,
      replyTo: payload.email || undefined,
      subject: `درخواست ثبت نام جدید - ${payload.fullName}`,
      text: messageText
    });

    return { ok: true };
  } catch {
    return { ok: false, error: 'gmail_send_failed' };
  }
};

module.exports = async function handler(req, res) {
  const corsOk = applyCors(req, res);
  if (!corsOk) {
    json(res, 403, { ok: false, error: 'origin_not_allowed' });
    return;
  }

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    json(res, 405, { ok: false, error: 'method_not_allowed' });
    return;
  }

  if (!checkRateLimit(req)) {
    json(res, 429, { ok: false, error: 'rate_limited' });
    return;
  }

  let body;
  try {
    body = await readBody(req);
  } catch {
    json(res, 400, { ok: false, error: 'invalid_json' });
    return;
  }

  const payload = buildPayload(body);
  const validationError = validatePayload(payload);
  if (validationError) {
    json(res, 400, { ok: false, error: validationError });
    return;
  }

  const messageText = formatMessage(payload);
  const telegramResult = await sendTelegram(messageText);
  if (!telegramResult.ok) {
    json(res, 502, { ok: false, error: telegramResult.error });
    return;
  }

  const gmailResult = await sendGmail(payload, messageText);
  if (!gmailResult.ok) {
    json(res, 502, { ok: false, error: gmailResult.error });
    return;
  }

  json(res, 200, { ok: true });
};
