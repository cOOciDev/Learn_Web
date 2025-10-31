export const COURSES = [
  {
    id: 'ui-front-end',
    difficulty: 'intermediate',
    focus: {
      en: 'UI systems · CSS',
      fa: 'سیستم‌های UI · CSS'
    },
    badge: {
      en: '1×/week · 2h',
      fa: '۱×/هفته · ۲ ساعت'
    },
    title: {
      en: 'UI / Front-End Design',
      fa: 'طراحی رابط کاربری/فرانت'
    },
    summary: {
      en: 'Design responsive UI systems and ship pixel-accurate builds with modern CSS architecture.',
      fa: 'سیستم‌های UI واکنش‌گرا را طراحی کنید و با معماری مدرن CSS پیاده‌سازی دقیق بسازید.'
    },
    outcomes: {
      en: [
        'Define bilingual design tokens and spacing scales',
        'Document accessible component states and flows',
        'Translate Figma specs into clean HTML/CSS',
        'Deliver RTL/LTR themes with minimal overrides'
      ],
      fa: [
        'تعریف توکن‌های طراحی و مقیاس‌های فاصله دو‌زبانه',
        'مستندسازی حالت‌های دسترس‌پذیر و فلوهای کامپوننت',
        'ترجمه دقیق طراحی‌ها به HTML/CSS تمیز',
        'ارائه تم‌های RTL/LTR با حداقل override'
      ]
    }
  },
  {
    id: 'web-foundations',
    difficulty: 'beginner',
    focus: {
      en: 'Foundations · Accessibility',
      fa: 'مبانی · دسترس‌پذیری'
    },
    badge: {
      en: '1×/week · 2h',
      fa: '۱×/هفته · ۲ ساعت'
    },
    title: {
      en: 'Web Foundations 0→100',
      fa: 'دوره مقدماتی صفر تا صد طراحی وب'
    },
    summary: {
      en: 'Master HTML, CSS, and JavaScript essentials to build accessible layouts from scratch.',
      fa: 'مبانی HTML، CSS و جاوااسکریپت را برای ساخت چیدمان‌های دسترس‌پذیر از صفر یاد بگیرید.'
    },
    outcomes: {
      en: [
        'Semantic HTML, forms, and validation patterns',
        'Modern layout with Flexbox and CSS Grid',
        'Progressive enhancement and accessibility mindset',
        'Deploy static sites with Netlify/Vercel workflows'
      ],
      fa: [
        'HTML معنایی، فرم‌ها و الگوهای اعتبارسنجی',
        'چیدمان مدرن با Flexbox و CSS Grid',
        'ذهنیت بهبود تدریجی و رعایت دسترس‌پذیری',
        'دیپلوی سایت‌های استاتیک با Netlify/Vercel'
      ]
    }
  },
  {
    id: 'web-3d',
    difficulty: 'advanced',
    focus: {
      en: 'WebGL · Motion',
      fa: 'WebGL · موشن'
    },
    badge: {
      en: '1×/week · 2h',
      fa: '۱×/هفته · ۲ ساعت'
    },
    title: {
      en: '3D Website Design',
      fa: 'طراحی وب‌سایت سه‌بعدی / WebGL'
    },
    summary: {
      en: 'Blend Three.js scenes with performant UI layers, motion guidelines, and graceful fallbacks.',
      fa: 'صحنه‌های Three.js را با لایه‌های UI performant، راهنمای موشن و fallbackهای مناسب ترکیب کنید.'
    },
    outcomes: {
      en: [
        'Storyboard 3D hero concepts and interaction states',
        'Integrate GLTF assets, lighting, and post-processing',
        'Ship particle fallbacks for reduced-motion visitors',
        'Optimize bundle size, memory, and accessibility'
      ],
      fa: [
        'طراحی استوری‌بورد برای هیرو سه‌بعدی و حالات تعاملی',
        'یکپارچه‌سازی دارایی‌های GLTF، نورپردازی و post-processing',
        'ارائه fallback ذرات برای کاربران با کاهش حرکت',
        'بهینه‌سازی اندازه باندل، حافظه و دسترس‌پذیری'
      ]
    }
  },
  {
    id: 'advanced-publish',
    difficulty: 'advanced',
    focus: {
      en: 'SEO · Delivery',
      fa: 'سئو · انتشار'
    },
    badge: {
      en: '1×/week · 2h',
      fa: '۱×/هفته · ۲ ساعت'
    },
    title: {
      en: 'Advanced & Publish',
      fa: 'پیشرفته: دیپلوی، SEO، انتشار'
    },
    summary: {
      en: 'Ship production-ready sites with automation, analytics, and multi-lingual SEO fundamentals.',
      fa: 'سایت‌های آماده تولید را با اتوماسیون، آنالیتیکس و اصول SEO چندزبانه منتشر کنید.'
    },
    outcomes: {
      en: [
        'Run Lighthouse and Core Web Vitals audits',
        'Implement structured data and multi-language metadata',
        'Configure CI/CD pipelines for Netlify & Vercel',
        'Set up analytics dashboards and conversion experiments'
      ],
      fa: [
        'اجرای گزارش Lighthouse و Core Web Vitals',
        'پیاده‌سازی داده‌های ساخت‌یافته و متادیتای چندزبانه',
        'پیکربندی پایپ‌لاین CI/CD برای Netlify و Vercel',
        'راه‌اندازی داشبورد آنالیتیکس و تست‌های تبدیل'
      ]
    }
  },
  {
    id: 'backend-design',
    difficulty: 'intermediate',
    focus: {
      en: 'Node.js · APIs',
      fa: 'Node.js · API'
    },
    badge: {
      en: '1×/week · 2h',
      fa: '۱×/هفته · ۲ ساعت'
    },
    title: {
      en: 'Backend Design (Node.js/Express)',
      fa: 'طراحی بک‌اند: Node.js/Express'
    },
    summary: {
      en: 'Design lightweight APIs and automation that power modern marketing and course experiences.',
      fa: 'APIهای سبک و اتوماسیون‌هایی طراحی کنید که تجربه‌های مدرن وب و دوره‌ها را پشتیبانی می‌کنند.'
    },
    outcomes: {
      en: [
        'Model content for landing pages and course catalogs',
        'Build Express APIs with auth and rate-limiting guards',
        'Automate Telegram and CRM webhooks securely',
        'Deploy Node services with logging and uptime checks'
      ],
      fa: [
        'مدل‌سازی محتوا برای لندینگ‌پیج‌ها و کاتالوگ دوره‌ها',
        'ساخت APIهای Express با احراز هویت و rate limiting',
        'اتوماسیون امن وب‌هوک‌های تلگرام و CRM',
        'دیپلوی سرویس‌های Node با لاگ و مانیتورینگ آپتایم'
      ]
    }
  }
];
