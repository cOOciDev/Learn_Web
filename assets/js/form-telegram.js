const IRAN_PHONE = /^09\d{9}$/;
const INTL_PHONE = /^[+0-9 ()-]{8,}$/;
const TELEGRAM_LIMIT = 4096;
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

const chunkText = (text, limit = TELEGRAM_LIMIT) => {
  if (text.length <= limit) return [text];
  const output = [];
  let start = 0;
  while (start < text.length) {
    output.push(text.slice(start, start + limit));
    start += limit;
  }
  return output;
};

const buildMessages = (payload) => {
  const json = JSON.stringify(payload, null, 2);
  const parts = chunkText(json, TELEGRAM_LIMIT - 12); // reserve space for labels
  if (parts.length <= 1) return [json];
  return parts.map((part, index) => `(${index + 1}/${parts.length})\n${part}`);
};

const sendViaProxy = async (messages) => {
  const url = window.TELEGRAM_PROXY_URL;
  const chatId = window.TELEGRAM_CHAT_ID;
  if (!url) throw new Error('Missing proxy URL');
  if (!chatId) throw new Error('Missing chat id');

  for (const text of messages) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });
    if (!res.ok) throw new Error(`Proxy error ${res.status}`);
  }
};

const sendDirect = async (messages) => {
  const chatId = window.TELEGRAM_CHAT_ID;
  const token = window.TELEGRAM_BOT_TOKEN;
  if (!chatId || !token) throw new Error('Missing Telegram credentials');

  for (const text of messages) {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });
    if (!res.ok) throw new Error(`Telegram error ${res.status}`);
  }
};

const toggleHelper = (id, show) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('show', show);
};

const toggleStatus = (el, show) => {
  if (!el) return;
  el.classList.toggle('show', show);
};

const toggleSubmitting = (form, state) => {
  const submit = form.querySelector('button[type="submit"]');
  if (!submit) return;
  submit.disabled = state;
  submit.dataset.loading = state ? '1' : '';
};

const serializeForm = (form) => {
  const data = new FormData(form);
  return {
    fullName: (data.get('fullName') || '').toString().trim(),
    phone: (data.get('phone') || '').toString().trim(),
    course: (data.get('course') || '').toString(),
    note: (data.get('note') || '').toString().trim()
  };
};

const validPhone = (value) => IRAN_PHONE.test(value) || INTL_PHONE.test(value);

const validate = (form, data) => {
  const okName = data.fullName.length >= 3;
  const okPhone = validPhone(data.phone);
  const okCourse = Boolean(data.course);
  const okNote = data.note.length === 0 || data.note.length >= 10;
  const consent = form.querySelector('#consent')?.checked ?? false;

  toggleHelper('err-fullName', !okName);
  toggleHelper('err-phone', !okPhone);
  toggleHelper('err-course', !okCourse);
  toggleHelper('err-note', !okNote && data.note.length > 0);
  const consentHelp = document.getElementById('consentHelp');
  consentHelp?.classList.toggle('show', !consent);

  form.fullName?.setAttribute('aria-invalid', okName ? 'false' : 'true');
  form.phone?.setAttribute('aria-invalid', okPhone ? 'false' : 'true');
  form.course?.setAttribute('aria-invalid', okCourse ? 'false' : 'true');
  form.note?.setAttribute('aria-invalid', okNote ? 'false' : 'true');

  if (!(okName && okPhone && okCourse && okNote && consent)) {
    const firstInvalid = form.querySelector('[aria-invalid="true"], #consent:not(:checked)');
    firstInvalid?.focus({ preventScroll: false });
    return false;
  }
  return true;
};

const buildPayload = (data) => {
  const params = new URLSearchParams(window.location.search);
  const utm = UTM_KEYS.reduce((acc, key) => {
    acc[key] = params.get(key) ?? '';
    return acc;
  }, {});

  return {
    type: 'lead',
    academy: 'CoociDev Academy',
    program: 'Learn_Web',
    ts: new Date().toISOString(),
    page: window.location.href,
    lang: document.documentElement.lang || 'en',
    data,
    utm,
    client: {
      ua: navigator.userAgent,
      viewport: { w: window.innerWidth, h: window.innerHeight }
    }
  };
};

export function initFormTelegram() {
  const form = document.getElementById('lead-form');
  if (!form) return;

  const okBanner = document.getElementById('ok');
  const failBanner = document.getElementById('fail');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    toggleStatus(okBanner, false);
    toggleStatus(failBanner, false);

    const data = serializeForm(form);
    if (!validate(form, data)) return;

    const payload = buildPayload(data);
    const messages = buildMessages(payload);

    toggleSubmitting(form, true);
    try {
      if (window.TELEGRAM_PROXY_URL) {
        try {
          await sendViaProxy(messages);
        } catch (proxyError) {
          console.warn('[form] proxy error, attempting direct send', proxyError);
          await sendDirect(messages);
        }
      } else {
        await sendDirect(messages);
      }
      form.reset();
      toggleStatus(okBanner, true);
      toggleStatus(failBanner, false);
    } catch (error) {
      console.error('[form] telegram error', error);
      toggleStatus(failBanner, true);
    } finally {
      toggleSubmitting(form, false);
    }
  });
}
