const IRAN_PHONE = /^09\d{9}$/;
const INTL_PHONE = /^[+0-9 ()-]{8,}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAILTO_URL_LIMIT = 1800;

const MAIL_TEXT = {
  fa: {
    subject: 'COOci Academy - New Student Request',
    greeting: '\u0633\u0644\u0627\u0645 \u062a\u06cc\u0645 COOci Dev Academy',
    applicant: '\u0627\u0637\u0644\u0627\u0639\u0627\u062a \u0645\u062a\u0642\u0627\u0636\u06cc:',
    name: '\u0646\u0627\u0645',
    phone: '\u0634\u0645\u0627\u0631\u0647 \u062a\u0645\u0627\u0633',
    email: '\u0627\u06cc\u0645\u06cc\u0644',
    course: '\u062f\u0648\u0631\u0647 \u0627\u0646\u062a\u062e\u0627\u0628\u06cc',
    age: '\u0633\u0646',
    level: '\u0633\u0637\u062d \u0645\u0647\u0627\u0631\u062a',
    language: '\u0632\u0628\u0627\u0646',
    preferredContact: '\u0631\u0648\u0634 \u0627\u0631\u062a\u0628\u0627\u0637 \u062a\u0631\u062c\u06cc\u062d\u06cc',
    message: '\u067e\u06cc\u0627\u0645 \u0627\u0648\u0644\u06cc\u0647:',
    source: '\u0645\u0646\u0628\u0639',
    submittedAt: '\u0632\u0645\u0627\u0646 \u062b\u0628\u062a',
    continueText: '\u062f\u0631 \u0635\u0648\u0631\u062a \u0646\u06cc\u0627\u0632\u060c \u0644\u0637\u0641\u0627\u064b \u0645\u062a\u0646 \u062e\u0648\u062f \u0631\u0627 \u0632\u06cc\u0631 \u0627\u06cc\u0646 \u0642\u0633\u0645\u062a \u0627\u0636\u0627\u0641\u0647 \u06a9\u0646\u06cc\u062f:',
    empty: '-',
    sourceValue: '\u0641\u0631\u0645 GitHub Pages \u0622\u06a9\u0627\u062f\u0645\u06cc COOci Dev',
    statusReady: '\u067e\u06cc\u0634 \u0646\u0648\u06cc\u0633 \u0627\u06cc\u0645\u06cc\u0644 \u0622\u0645\u0627\u062f\u0647 \u0627\u0633\u062a. \u062f\u0631 \u067e\u0646\u062c\u0631\u0647 \u0628\u0627\u0632 \u0634\u062f\u0647 \u0622\u0646 \u0631\u0627 \u0627\u0631\u0633\u0627\u0644 \u06a9\u0646\u06cc\u062f \u06cc\u0627 \u0645\u062a\u0646 \u0631\u0627 \u06a9\u067e\u06cc \u06a9\u0646\u06cc\u062f.',
    statusOpened: '\u0628\u0631\u0646\u0627\u0645\u0647 \u0627\u06cc\u0645\u06cc\u0644 \u0628\u0627\u0632 \u0634\u062f. \u0644\u0637\u0641\u0627\u064b \u0627\u06cc\u0645\u06cc\u0644 \u0631\u0627 \u0628\u0631\u0631\u0633\u06cc \u06a9\u0646\u06cc\u062f \u0648 Send \u0631\u0627 \u0628\u0632\u0646\u06cc\u062f.',
    openFailed: '\u0627\u06af\u0631 \u0628\u0631\u0646\u0627\u0645\u0647 \u0627\u06cc\u0645\u06cc\u0644 \u0628\u0627\u0632 \u0646\u0634\u062f\u060c \u0622\u062f\u0631\u0633 \u0648 \u0645\u062a\u0646 \u0622\u0645\u0627\u062f\u0647 \u0631\u0627 \u06a9\u067e\u06cc \u06a9\u0646\u06cc\u062f.',
    copiedEmail: '\u0622\u062f\u0631\u0633 \u0627\u06cc\u0645\u06cc\u0644 \u06a9\u067e\u06cc \u0634\u062f.',
    copiedMessage: '\u0645\u062a\u0646 \u0622\u0645\u0627\u062f\u0647 \u06a9\u067e\u06cc \u0634\u062f.',
    copyFailed: '\u06a9\u067e\u06cc \u0627\u0646\u062c\u0627\u0645 \u0646\u0634\u062f. \u0645\u062a\u0646 \u0631\u0627 \u062f\u0633\u062a\u06cc \u0627\u0646\u062a\u062e\u0627\u0628 \u0648 \u06a9\u067e\u06cc \u06a9\u0646\u06cc\u062f.'
  },
  en: {
    subject: 'COOci Academy - New Student Request',
    greeting: 'Hello COOci Dev Academy team',
    applicant: 'Applicant information:',
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
    course: 'Selected course',
    age: 'Age',
    level: 'Skill level',
    language: 'Language',
    preferredContact: 'Preferred contact',
    message: 'Initial message:',
    source: 'Source',
    submittedAt: 'Submitted at',
    continueText: 'If needed, please add your text below this section:',
    empty: '-',
    sourceValue: 'COOci Dev Academy GitHub Pages form',
    statusReady: 'Your email draft is ready. Open it in your email app, or copy the prepared text.',
    statusOpened: 'The email app opened. Please review the draft and click Send.',
    openFailed: 'If your email app did not open, copy the email address and prepared message.',
    copiedEmail: 'Email address copied.',
    copiedMessage: 'Prepared message copied.',
    copyFailed: 'Copy failed. Please select and copy the text manually.'
  }
};

const cleanText = (value, max = 200) => String(value ?? '')
  .replace(/[<>]/g, '')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, max);

const currentLang = () => document.documentElement.lang === 'en' ? 'en' : 'fa';
const labels = () => MAIL_TEXT[currentLang()] ?? MAIL_TEXT.fa;

const recipientEmail = () => {
  const configured = window.COOci_CONTACT_EMAIL || document.querySelector('meta[name="cooci-contact-email"]')?.content;
  return cleanText(configured || 'YOUR_EMAIL_ADDRESS', 180);
};

const toggleHelper = (id, show) => document.getElementById(id)?.classList.toggle('show', show);

const setStatus = (el, message, show = true) => {
  if (!el) return;
  el.textContent = message;
  el.classList.toggle('show', show);
};

const toggleSubmitting = (form, state) => {
  const submit = form.querySelector('button[type="submit"]');
  if (!submit) return;
  submit.disabled = state;
  submit.dataset.loading = state ? '1' : '';
  submit.classList.toggle('is-loading', state);
};

const selectedText = (form, name) => {
  const field = form.elements[name];
  if (!field?.value) return '';
  return cleanText(field.selectedOptions?.[0]?.textContent, 120);
};

const serializeForm = (form) => {
  const data = new FormData(form);
  return {
    fullName: cleanText(data.get('fullName'), 120),
    phone: cleanText(data.get('phone'), 40),
    email: cleanText(data.get('email'), 120),
    age: cleanText(data.get('age'), 3),
    course: selectedText(form, 'course'),
    courseId: cleanText(data.get('course'), 80),
    level: selectedText(form, 'level'),
    preferredContact: selectedText(form, 'preferredContact'),
    message: cleanText(data.get('message'), 1000),
    website: cleanText(data.get('website'), 120)
  };
};

const validate = (form, data) => {
  const okName = data.fullName.length >= 3;
  const okPhone = IRAN_PHONE.test(data.phone) || INTL_PHONE.test(data.phone);
  const okEmail = !data.email || EMAIL.test(data.email);
  const okCourse = Boolean(data.courseId);
  const okAge = !data.age || (Number(data.age) >= 6 && Number(data.age) <= 99);
  const consent = form.querySelector('#consent')?.checked ?? false;
  const isSpam = Boolean(data.website);

  toggleHelper('err-fullName', !okName);
  toggleHelper('err-phone', !okPhone);
  toggleHelper('err-email', !okEmail);
  toggleHelper('err-course', !okCourse);
  toggleHelper('err-age', !okAge);
  document.getElementById('consentHelp')?.classList.toggle('show', !consent);

  form.fullName?.setAttribute('aria-invalid', okName ? 'false' : 'true');
  form.phone?.setAttribute('aria-invalid', okPhone ? 'false' : 'true');
  form.email?.setAttribute('aria-invalid', okEmail ? 'false' : 'true');
  form.course?.setAttribute('aria-invalid', okCourse ? 'false' : 'true');
  form.age?.setAttribute('aria-invalid', okAge ? 'false' : 'true');

  if (!(okName && okPhone && okEmail && okCourse && okAge && consent) || isSpam) {
    form.querySelector('[aria-invalid="true"], #consent:not(:checked)')?.focus({ preventScroll: false });
    return false;
  }
  return true;
};

const buildEmailBody = (data) => {
  const t = labels();
  const value = (item) => item || t.empty;
  const languageLabel = currentLang() === 'fa' ? '\u0641\u0627\u0631\u0633\u06cc' : 'English';
  const submittedAt = new Intl.DateTimeFormat(currentLang() === 'fa' ? 'fa-IR-u-ca-persian-nu-latn' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date());

  return [
    t.greeting,
    '',
    t.applicant,
    '',
    `${t.name}: ${value(data.fullName)}`,
    `${t.phone}: ${value(data.phone)}`,
    `${t.email}: ${value(data.email)}`,
    `${t.course}: ${value(data.course)}`,
    `${t.age}: ${value(data.age)}`,
    `${t.level}: ${value(data.level)}`,
    `${t.language}: ${languageLabel}`,
    `${t.preferredContact}: ${value(data.preferredContact)}`,
    '',
    t.message,
    value(data.message),
    '',
    '----------------------------------',
    t.continueText,
    '',
    '',
    '----------------------------------',
    `${t.source}: ${t.sourceValue}`,
    `${t.submittedAt}: ${submittedAt}`
  ].join('\n');
};

const buildMailto = ({ to, subject, body }) => {
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const updateModal = ({ to, subject, body }) => {
  const modal = document.getElementById('mailDraftPanel');
  if (!modal) return;
  const mailto = buildMailto({ to, subject, body });
  modal.dataset.email = to;
  modal.dataset.mailto = mailto;
  modal.dataset.message = `To: ${to}\nSubject: ${subject}\n\n${body}`;
  document.getElementById('fallbackEmail').textContent = to;
  const messageEl = document.getElementById('fallbackMessage');
  messageEl.value = modal.dataset.message;
  messageEl.style.height = 'auto';
  messageEl.style.height = `${messageEl.scrollHeight}px`;
};

const showModal = () => {
  const modal = document.getElementById('mailDraftPanel');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  modal.querySelector('[data-open-mail]')?.focus({ preventScroll: true });
};

const hideModal = () => {
  const modal = document.getElementById('mailDraftPanel');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
};

const showToast = (message) => {
  const toast = document.getElementById('formToast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2400);
};

const copyText = async (value) => {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    showToast(labels().copyFailed);
    return false;
  }
};

const initModalControls = () => {
  const modal = document.getElementById('mailDraftPanel');
  if (!modal || modal.dataset.ready === '1') return;
  modal.dataset.ready = '1';

  modal.addEventListener('click', (event) => {
    if (event.target.closest('[data-close-mail-modal]')) hideModal();
  });

  modal.querySelector('[data-open-mail]')?.addEventListener('click', () => {
    const mailto = modal.dataset.mailto || '';
    if (!mailto || mailto.length > MAILTO_URL_LIMIT) {
      showToast(labels().openFailed);
      return;
    }
    try {
      window.location.href = mailto;
      showToast(labels().statusOpened);
    } catch {
      showToast(labels().openFailed);
    }
  });

  modal.querySelector('[data-copy-email]')?.addEventListener('click', async () => {
    if (await copyText(modal.dataset.email || recipientEmail())) showToast(labels().copiedEmail);
  });

  modal.querySelector('[data-copy-message]')?.addEventListener('click', async () => {
    if (await copyText(modal.dataset.message || '')) showToast(labels().copiedMessage);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') hideModal();
  });
};

export function initMailtoForm() {
  const form = document.getElementById('lead-form');
  if (!form) return;

  initModalControls();
  const okBanner = document.getElementById('ok');
  const failBanner = document.getElementById('fail');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    setStatus(okBanner, '', false);
    setStatus(failBanner, '', false);

    const data = serializeForm(form);
    if (!validate(form, data)) return;

    const t = labels();
    const emailData = {
      to: recipientEmail(),
      subject: t.subject,
      body: buildEmailBody(data)
    };

    toggleSubmitting(form, true);
    updateModal(emailData);
    window.setTimeout(() => {
      setStatus(okBanner, t.statusReady, true);
      showModal();
      toggleSubmitting(form, false);
    }, 250);
  });
}
