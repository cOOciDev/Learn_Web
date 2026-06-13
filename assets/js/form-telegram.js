const IRAN_PHONE = /^09\d{9}$/;
const INTL_PHONE = /^[+0-9 ()-]{8,}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const resolveApiEndpoint = () => {
  const configured = window.COOci_API_ENDPOINT || document.querySelector('meta[name="cooci-api-endpoint"]')?.content;
  return String(configured || '').trim() || '/api/register';
};

const cleanText = (value, max = 200) => {
  return String(value ?? '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
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
  const selectedText = (name) => {
    const field = form.elements[name];
    if (!field?.value) return '';
    return cleanText(field.selectedOptions?.[0]?.textContent, 120);
  };
  return {
    fullName: cleanText(data.get('fullName'), 120),
    phone: cleanText(data.get('phone'), 40),
    email: cleanText(data.get('email'), 120),
    age: cleanText(data.get('age'), 3),
    course: selectedText('course'),
    courseId: cleanText(data.get('course'), 80),
    level: selectedText('level'),
    preferredContact: selectedText('preferredContact'),
    message: cleanText(data.get('message'), 1000),
    website: cleanText(data.get('website'), 120)
  };
};

const validPhone = (value) => IRAN_PHONE.test(value) || INTL_PHONE.test(value);
const validEmail = (value) => !value || EMAIL.test(value);

const validate = (form, data) => {
  const okName = data.fullName.length >= 3;
  const okPhone = validPhone(data.phone);
  const okEmail = validEmail(data.email);
  const okCourse = Boolean(data.courseId);
  const okAge = !data.age || (Number(data.age) >= 6 && Number(data.age) <= 99);
  const consent = form.querySelector('#consent')?.checked ?? false;
  const isSpam = Boolean(data.website);

  toggleHelper('err-fullName', !okName);
  toggleHelper('err-phone', !okPhone);
  toggleHelper('err-email', !okEmail);
  toggleHelper('err-course', !okCourse);
  toggleHelper('err-age', !okAge);
  const consentHelp = document.getElementById('consentHelp');
  consentHelp?.classList.toggle('show', !consent);

  form.fullName?.setAttribute('aria-invalid', okName ? 'false' : 'true');
  form.phone?.setAttribute('aria-invalid', okPhone ? 'false' : 'true');
  form.email?.setAttribute('aria-invalid', okEmail ? 'false' : 'true');
  form.course?.setAttribute('aria-invalid', okCourse ? 'false' : 'true');
  form.age?.setAttribute('aria-invalid', okAge ? 'false' : 'true');

  if (!(okName && okPhone && okEmail && okCourse && okAge && consent) || isSpam) {
    const firstInvalid = form.querySelector('[aria-invalid="true"], #consent:not(:checked)');
    firstInvalid?.focus({ preventScroll: false });
    return false;
  }
  return true;
};

const buildPayload = (data) => ({
  fullName: data.fullName,
  phone: data.phone,
  email: data.email,
  age: data.age,
  course: data.course,
  courseId: data.courseId,
  level: data.level,
  preferredContact: data.preferredContact,
  message: data.message,
  website: data.website,
  source: 'CoociDev Academy Landing',
  submittedAt: new Date().toISOString()
});

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

    toggleSubmitting(form, true);
    try {
      const res = await fetch(resolveApiEndpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Apply endpoint error ${res.status}`);
      form.reset();
      toggleStatus(okBanner, true);
      toggleStatus(failBanner, false);
    } catch (error) {
      console.error('[form] application error', error);
      toggleStatus(failBanner, true);
    } finally {
      toggleSubmitting(form, false);
    }
  });
}
