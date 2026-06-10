const TELEGRAM_API = 'https://api.telegram.org';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD = 120;
const MAX_MESSAGE = 1000;
const RATE_WINDOW_MS = 60 * 1000;
const RATE_LIMIT = 8;
const hits = new Map();
const nodemailer = require('nodemailer');


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

const setCors = (req, res) => {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
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
  `زمان ارسال: ${payload.submittedAtJalali}`,
  // `زمان میلادی: ${payload.submittedAt}`
].join('\n');

module.exports = async function handler(req, res) {
  setCors(req, res);

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

  // Telegram configuration
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    json(res, 500, { ok: false, error: 'telegram_not_configured' });
    return;
  }


// gmail configuration 
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    json(res, 500, { ok: false, error: 'gmail_not_configured' });
    return;
  }



  let body;
  try {
    body = await readBody(req);
  } catch {
    json(res, 400, { ok: false, error: 'invalid_json' });
    return;
  }

  const payload = {
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
    submittedAt: cleanText(body.submittedAt || new Date().toISOString(), 40)
  };
  payload.submittedAtJalali = formatJalaliDateTime(payload.submittedAt);

  if (payload.email && !EMAIL.test(payload.email)) {
    json(res, 400, { ok: false, error: 'invalid_email' });
    return;
  }

  if (payload.fullName.length < 3 || !payload.phone || !payload.course) {
    json(res, 400, { ok: false, error: 'missing_required_fields' });
    return;
  }

  const messageText = formatMessage(payload);


  const telegramRes = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: messageText,
      disable_web_page_preview: true
    })
  });

  if (!telegramRes.ok) {
    json(res, 502, { ok: false, error: 'telegram_send_failed' });
    return;
  }



  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: payload.email ? gmailUser : 'COOci Dev Learn Web <${gmailUser}>',
      pass: gmailPass
    }
  });

  await transporter.sendMail({
    from: payload.email ? gmailUser : 'COOci Dev Learn Web <${gmailUser}>',
    to: 'cooci.ebrahimi@gmail.com',
    subject: `درخواست ثبت نام جدید - ${payload.fullName}`,
    text: messageText
  });



  json(res, 200, { ok: true });
};
