/* ===== script.js — Pro Frontend Kernel (FA/EN, theme, UX, lead form) ===== */
"use strict";

/* ------------------------------- Config ---------------------------------- */
const CONFIG = {
  // ⛳️ آدرس Worker/Endpoint خودت را بگذار (Cloudflare Worker / هر سرورلس امن)
  ENDPOINT: "https://YOUR-WORKER-NAME.workers.dev",

  // اگر فقط از دامنه خودت می‌پذیری، اینجا ست کن و در Worker هم CORS را محدود کن
  ALLOWED_ORIGIN: "*", // مثال: "https://yourdomain.github.io"

  STORAGE_KEYS: {
    theme: "theme",
    lang: "lang",
  },

  // پشتیبانی زبان‌ها
  SUPPORTED_LANGS: ["en", "fa"],
};

/* ------------------------------- Utilities ------------------------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const on = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);
const cls = (el, name, on) => el && el.classList.toggle(name, on);
const isStr = (v) => typeof v === "string";

/* Debounce برای بهینه‌سازی Scroll/Resize */
const debounce = (fn, wait = 80) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
};

/* LocalStorage ایمن */
const store = {
  get: (k) => {
    try {
      return localStorage.getItem(k) || null;
    } catch { return null; }
  },
  set: (k, v) => {
    try { localStorage.setItem(k, String(v)); } catch {}
  }
};

/* آیکن‌های Lucide با رندر امن (در صورت دیرلودشدن اسکریپت) */
function renderIcons() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  } else {
    setTimeout(renderIcons, 60);
  }
}

/* ------------------------------ i18n Kernel ------------------------------ */
/* دیکشنری را از خود HTML می‌گیریم (I18N در صفحه‌ات تعریف شده بود)؛
   اگر global موجود نبود، حداقل ساختار لازم را می‌سازیم تا ارورها رخ ندهد. */
const DICT = window.I18N || {
  en: { "meta.title": document.title || "Portfolio", "meta.desc": "", },
  fa: { "meta.title": document.title || "پرتفو", "meta.desc": "", },
};

const LANG = {
  key: CONFIG.STORAGE_KEYS.lang,

  detect() {
    const saved = store.get(this.key);
    if (CONFIG.SUPPORTED_LANGS.includes(saved)) return saved;
    const nav = (navigator.language || "en").toLowerCase();
    return nav.startsWith("fa") ? "fa" : "en";
  },

  applyDir(lang) {
    const html = document.documentElement;
    const body = document.body;
    if (lang === "fa") {
      html.setAttribute("lang", "fa");
      html.setAttribute("dir", "rtl");
      body.classList.add("use-fa");
      body.classList.remove("use-en");
      html.classList.add("lang-fa");
      html.classList.remove("lang-en");
    } else {
      html.setAttribute("lang", "en");
      html.setAttribute("dir", "ltr");
      body.classList.add("use-en");
      body.classList.remove("use-fa");
      html.classList.add("lang-en");
      html.classList.remove("lang-fa");
    }
  },

  trAttr(el, attrKey, dict) {
    const k = el.getAttribute(attrKey);
    if (k && dict[k]) el.setAttribute(attrKey.replace("data-i18n-", ""), dict[k]);
  },

  translate(lang) {
    const dict = DICT[lang] || DICT.en;
    $$("[data-i18n]").forEach((el) => {
      const k = el.getAttribute("data-i18n");
      if (dict[k]) el.textContent = dict[k];
    });
    $$("[data-i18n-placeholder]").forEach((el) => this.trAttr(el, "data-i18n-placeholder", dict));

    // متا و عنوان
    const t = dict["meta.title"]; if (t) document.title = t;
    const d = dict["meta.desc"]; if (d) { const m = $('meta[name="description"]'); m && m.setAttribute("content", d); }

    this.applyDir(lang);
    store.set(this.key, lang);
    renderIcons(); // جهت رندر مجدد در صورت جابه‌جایی متن‌ها
  },

  switch() {
    const cur = store.get(this.key) || this.detect();
    const next = cur === "fa" ? "en" : "fa";
    this.translate(next);
  },

  init() {
    this.translate(this.detect());
    on($("#langToggle"), "click", () => this.switch());
    on($("#langToggleMobile"), "click", () => this.switch());
  },
};

/* ------------------------------- Theme UX -------------------------------- */
const THEME = {
  key: CONFIG.STORAGE_KEYS.theme,

  apply(mode) {
    document.documentElement.setAttribute("data-theme", mode);
    store.set(this.key, mode);
    const icon = $("#themeIcon");
    icon && icon.setAttribute("data-lucide", mode === "light" ? "moon" : "sun");
    renderIcons();
  },

  init() {
    const saved = store.get(this.key);
    const sysLight = matchMedia("(prefers-color-scheme: light)").matches;
    const initial = saved || (sysLight ? "light" : "dark");
    this.apply(initial);
    on($("#themeToggle"), "click", () => {
      const cur = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
      this.apply(cur === "light" ? "dark" : "light");
    });
  },
};

/* ----------------------------- Header & Nav ------------------------------- */
const NAV = {
  init() {
    // اسکرول‌بار پیشرفت
    const header = $("#siteHeader");
    const bar = $("#scrollbar");
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = Math.max(0, Math.min(1, (scrollY || 0) / (max || 1)));
      if (bar) bar.style.transform = `scaleX(${p})`;
      cls(header, "scrolled", scrollY > 24);
    };
    onScroll();
    on(window, "scroll", onScroll, { passive: true });

    // منوی موبایل
    on($("#menuBtn"), "click", () => {
      $("#mobileMenu")?.classList.toggle("hidden");
    });

    // اسکرول‌اسپای ساده
    const links = $$('nav a[href^="#"]');
    const map = new Map();
    links.forEach((a) => {
      const id = a.getAttribute("href").slice(1);
      const sec = document.getElementById(id);
      if (sec) map.set(sec, a);
    });
    if (map.size) {
      const spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            const a = map.get(e.target);
            if (!a) return;
            if (e.isIntersecting) {
              links.forEach((l) => l.classList.remove("active"));
              a.classList.add("active");
            }
          });
        },
        { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
      );
      map.forEach((_, sec) => spy.observe(sec));
    }
  },
};

/* --------------------------- Portfolio Filter ----------------------------- */
const FILTER = {
  init() {
    const btns = $$("[data-filter]");
    const cards = $$("[data-cat]");
    if (!btns.length || !cards.length) return;

    const setActive = (f) => btns.forEach((b) => b.classList.toggle("active", b.getAttribute("data-filter") === f));
    const applyFilter = (f) => {
      cards.forEach((c) => {
        const cat = c.getAttribute("data-cat");
        c.style.display = (f === "all" || f === cat) ? "block" : "none";
      });
    };

    btns.forEach((b) => {
      on(b, "click", () => {
        const f = b.getAttribute("data-filter");
        setActive(f);
        applyFilter(f);
      });
    });
  },
};

/* ------------------------------ Lead Form -------------------------------- */
const LEAD = {
  form: null,

  init() {
    this.form = $("#lead-form");
    if (!this.form) return;

    // پیام‌های وضعیت
    const ok = $("#ok");
    const fail = $("#fail");

    const errEl = (id) => document.getElementById(id);
    const show = (el, on) => el && el.classList.toggle("show", on === true);
    const byId = (id) => this.form.querySelector(`#${id}`);

    // ولیدیشن سمت کلاینت
    const validate = () => {
      const data = Object.fromEntries(new FormData(this.form).entries());
      const okName = (data.name || "").trim().length >= 3;
      const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || "");
      const okPhone = /^[+0-9 ()-]{8,}$/.test(data.phone || "");
      const okSource = !!data.source;
      const okMsg = (data.message || "").trim().length >= 10;
      const okConsent = this.form.querySelector("#consent")?.checked;

      show(errEl("err-name"), !okName);
      show(errEl("err-email"), !okEmail);
      show(errEl("err-phone"), !okPhone);
      show(errEl("err-source"), !okSource);
      show(errEl("err-message"), !okMsg);

      return okName && okEmail && okPhone && okSource && okMsg && okConsent;
    };

    on(this.form, "submit", async (e) => {
      e.preventDefault();
      ok && ok.classList.add("hidden");
      fail && fail.classList.add("hidden");

      if (!validate()) return;

      // Honeypot
      const payload = Object.fromEntries(new FormData(this.form).entries());
      if (payload.website && String(payload.website).trim().length) return;

      // متادیتا
      payload._ts = new Date().toISOString();
      payload._lang = store.get(CONFIG.STORAGE_KEYS.lang) || LANG.detect();

      // UTM
      const usp = new URLSearchParams(location.search);
      ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((k) => {
        if (usp.get(k)) payload[k] = usp.get(k);
      });

      try {
        const r = await fetch(CONFIG.ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          // mode: "cors"  // اگر لازم شد
        });
        if (r.ok) {
          ok && ok.classList.remove("hidden");
          this.form.reset();
        } else {
          fail && fail.classList.remove("hidden");
        }
      } catch (_) {
        fail && fail.classList.remove("hidden");
      }
    });
  },
};

/* ------------------------------- Boot ------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  // سال فوتر
  const y = $("#y");
  if (y) y.textContent = new Date().getFullYear();

  // آیکن‌ها
  renderIcons();

  // ماژول‌ها
  THEME.init();
  LANG.init();
  NAV.init();
  FILTER.init();
  LEAD.init();
});
