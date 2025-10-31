import { initHero3D } from './hero3d.js';
import { initFormTelegram } from './form-telegram.js';
import { COURSES } from './courses.data.js';
import { renderCourses } from './render.courses.js';
import { initJobMarket } from './render.jobs.js';

const LANG_STORAGE_KEY = 'learnweb:lang';
const THEME_STORAGE_KEY = 'learnweb:theme';
const THEME_ICONS = {
  light: '\u{1F319}',
  dark: '\u2600'
};

const translationsCache = new Map();
let revealObserver = null;
let jobMarketController = null;
let currentLang = 'en';
let currentTranslations = null;
let heroDispose = null;

const resolvePath = (dict, path) => {
  return path.split('.').reduce((acc, key) => (acc && typeof acc === 'object') ? acc[key] : undefined, dict);
};

const ensureRevealObserver = () => {
  if (revealObserver) return revealObserver;
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
  return revealObserver;
};

const registerRevealElement = (element) => {
  if (!element) return;
  element.classList.remove('is-visible');
  ensureRevealObserver().observe(element);
};

const initRevealAnimations = () => {
  document.querySelectorAll('[data-reveal]').forEach(registerRevealElement);
};

const scrollToElement = (element) => {
  if (!element) return;
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  element.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
};

const scrollToForm = () => {
  const form = document.getElementById('lead-form');
  if (!form) return;
  scrollToElement(form);
};

const updateDirection = (lang) => {
  const html = document.documentElement;
  const body = document.body;
  const isRTL = lang === 'fa';
  html.lang = lang;
  html.dir = isRTL ? 'rtl' : 'ltr';
  html.classList.toggle('lang-fa', isRTL);
  html.classList.toggle('lang-en', !isRTL);
  body?.classList.toggle('lang-fa', isRTL);
  body?.classList.toggle('lang-en', !isRTL);
};

const applyTranslations = (dict) => {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (!key) return;
    const value = resolvePath(dict, key);
    if (typeof value === 'string') {
      el.textContent = value;
      if (el.tagName === 'TITLE') document.title = value;
    }
  });

  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    const mappings = el.dataset.i18nAttr?.split(';').map((entry) => entry.trim()).filter(Boolean) ?? [];
    mappings.forEach((entry) => {
      const [attr, path] = entry.split(':').map((part) => part.trim());
      if (!attr || !path) return;
      const value = resolvePath(dict, path);
      if (typeof value !== 'string') return;
      if (attr === 'data-empty') {
        el.dataset.empty = value;
      } else if (attr === 'textContent') {
        el.textContent = value;
        if (el.tagName === 'TITLE') document.title = value;
      } else {
        el.setAttribute(attr, value);
      }
    });
  });
};

const renderLangToggle = (lang, dict) => {
  const btn = document.getElementById('langToggle');
  if (!btn) return;
  btn.dataset.lang = lang;
  const label = dict?.header?.langToggle ?? (lang === 'fa' ? 'EN / FA' : 'FA / EN');
  btn.textContent = label;
  if (dict?.header?.langToggleLabel) {
    btn.setAttribute('aria-label', dict.header.langToggleLabel);
  }
};

const renderThemeLabel = (dict) => {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;
  if (dict?.header?.themeToggleLabel) {
    toggle.setAttribute('aria-label', dict.header.themeToggleLabel);
    toggle.title = dict.header.themeToggleLabel;
  }
};

const populateCourseSelect = (lang) => {
  const select = document.getElementById('course');
  if (!select) return;
  const previous = select.value;
  select.querySelectorAll('option[data-dynamic="1"]').forEach((opt) => opt.remove());
  COURSES.forEach((course) => {
    const option = document.createElement('option');
    option.value = course.id;
    option.textContent = course.title?.[lang] ?? course.title?.en ?? course.id;
    option.dataset.dynamic = '1';
    select.append(option);
  });
  if (COURSES.some((course) => course.id === previous)) {
    select.value = previous;
  } else {
    select.value = '';
  }
};

const handleCourseEnroll = (course) => {
  const select = document.getElementById('course');
  if (!select) return;
  select.value = course.id;
  select.dispatchEvent(new Event('change', { bubbles: true }));
  scrollToForm();
  setTimeout(() => {
    select.focus({ preventScroll: true });
  }, 180);
};

const handleJobMatch = (job) => {
  const form = document.getElementById('lead-form');
  const note = document.getElementById('note');
  if (!form || !note) return;
  const prefix = currentTranslations?.jobs?.matchPrefix ?? 'Job interest';
  const title = job.title?.[currentLang] ?? job.title?.en ?? job.id;
  const entry = `${prefix}: ${title}`;
  const existing = note.value.trim();
  if (!existing) {
    note.value = `${entry}\n`;
  } else if (!existing.includes(entry)) {
    note.value = `${entry}\n${existing}`;
  }
  note.dispatchEvent(new Event('input', { bubbles: true }));
  scrollToForm();
  setTimeout(() => {
    note.focus({ preventScroll: true });
  }, 200);
};

const initScrollProgress = () => {
  const bar = document.getElementById('scrollbar');
  const header = document.querySelector('header');
  const update = () => {
    const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(window.scrollY / max, 1);
    if (bar) {
      bar.style.transform = `scaleX(${progress})`;
      bar.style.opacity = progress > 0.02 ? '1' : '0';
    }
    if (header) header.classList.toggle('scrolled', window.scrollY > 24);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
};

const initMobileMenu = () => {
  const button = document.getElementById('menuBtn');
  const panel = document.getElementById('mobileMenu');
  if (!button || !panel) return;

  const close = () => {
    panel.classList.add('hidden');
    panel.setAttribute('aria-hidden', 'true');
    button.setAttribute('aria-expanded', 'false');
  };

  const open = () => {
    panel.classList.remove('hidden');
    panel.setAttribute('aria-hidden', 'false');
    button.setAttribute('aria-expanded', 'true');
    panel.querySelector('a')?.focus({ preventScroll: true });
  };

  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    if (expanded) close();
    else open();
  });

  panel.addEventListener('click', (event) => {
    if (event.target === panel) {
      close();
    } else if (event.target.closest('a')) {
      close();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
};

const initThemeToggle = () => {
  const toggle = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  if (!toggle) return;

  const applyTheme = (mode, persist = true) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', mode);
    toggle.setAttribute('aria-pressed', mode === 'light' ? 'true' : 'false');
    if (icon) icon.textContent = mode === 'light' ? THEME_ICONS.light : THEME_ICONS.dark;
    if (persist) localStorage.setItem(THEME_STORAGE_KEY, mode);
  };

  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  const media = window.matchMedia?.('(prefers-color-scheme: light)');
  const initial = stored || (media?.matches ? 'light' : 'dark');
  applyTheme(initial, false);

  media?.addEventListener?.('change', (event) => {
    if (localStorage.getItem(THEME_STORAGE_KEY)) return;
    applyTheme(event.matches ? 'light' : 'dark', false);
  });

  toggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
  });
};

const initHeroCanvas = () => {
  const canvas = document.getElementById('hero3d');
  if (!canvas) return;
  heroDispose = initHero3D(canvas, { model: '../../public/models/mascot.glb' });
};

const initAnchorScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      scrollToElement(target);
      const mobileMenu = document.getElementById('mobileMenu');
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        document.getElementById('menuBtn')?.click();
      }
    });
  });
};

const loadTranslations = async (lang) => {
  if (translationsCache.has(lang)) return translationsCache.get(lang);
  const res = await fetch(`../assets/i18n/${lang}.json`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load translations for ${lang}`);
  const data = await res.json();
  translationsCache.set(lang, data);
  return data;
};

const renderCoursesSection = (lang, dict) => {
  renderCourses({
    lang,
    labels: dict?.courses ?? {},
    registerReveal: registerRevealElement,
    onEnroll: handleCourseEnroll
  });
};

const renderJobsSection = (lang, dict) => {
  if (!jobMarketController) {
    jobMarketController = initJobMarket({
      lang,
      labels: dict?.jobs ?? {},
      registerReveal: registerRevealElement,
      onMatch: handleJobMatch
    });
  } else {
    jobMarketController.setLanguage(lang, dict?.jobs ?? {});
  }
};

const setLanguage = async (lang) => {
  let dict;
  try {
    dict = await loadTranslations(lang);
  } catch (error) {
    console.warn('[i18n] falling back to English', error);
    lang = 'en';
    dict = await loadTranslations('en');
  }

  currentLang = lang;
  currentTranslations = dict;
  updateDirection(lang);
  applyTranslations(dict);
  renderLangToggle(lang, dict);
  renderThemeLabel(dict);
  populateCourseSelect(lang);
  renderCoursesSection(lang, dict);
  renderJobsSection(lang, dict);
  localStorage.setItem(LANG_STORAGE_KEY, lang);
  return dict;
};

document.addEventListener('DOMContentLoaded', async () => {
  initScrollProgress();
  initMobileMenu();
  initThemeToggle();
  initHeroCanvas();
  initAnchorScroll();
  initRevealAnimations();

  initFormTelegram();

  const storedLang = localStorage.getItem(LANG_STORAGE_KEY) || document.documentElement.lang || 'en';
  await setLanguage(storedLang);

  const langToggle = document.getElementById('langToggle');
  langToggle?.addEventListener('click', async () => {
    const next = (currentLang === 'fa') ? 'en' : 'fa';
    await setLanguage(next);
  });

  const year = document.getElementById('y');
  if (year) year.textContent = new Date().getFullYear().toString();
});

window.addEventListener('beforeunload', () => {
  heroDispose?.();
});
