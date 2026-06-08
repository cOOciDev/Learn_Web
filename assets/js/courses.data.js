export const COURSES = [
  {
    id: '3d-modeling',
    difficulty: 'intermediate',
    icon: '3D',
    image: {
      src: './images/courses/3d-modeling.svg',
      alt: {
        fa: 'کاور دوره مدل سازی سه بعدی',
        en: '3D modeling course cover'
      }
    },
    title: {
      fa: 'دوره مدل سازی سه بعدی',
      en: '3D Modeling Course'
    },
    duration: {
      fa: '6 هفته',
      en: '6 weeks'
    },
    level: {
      fa: 'متوسط مقدماتی',
      en: 'Early intermediate'
    },
    price: {
      fa: '3,000,000 تومان',
      en: '3,000,000 toman'
    },
    summary: {
      fa: '۳ مدل قابل ارائه، آماده ورود به فریلنسری',
      en: 'Build 3 presentable models and get ready for freelance work.'
    },
    outcome: {
      fa: 'ساخت مدل‌های سه بعدی قابل استفاده در پروژه‌ها',
      en: 'Reusable 3D models for real projects'
    },
    audience: {
      fa: 'علاقه‌مندان به دنیای 3D و بازی‌سازی',
      en: 'Students interested in 3D and game creation'
    }
  },
  {
    id: 'game-environment',
    difficulty: 'intermediate',
    icon: 'G',
    image: {
      src: './images/courses/game-environment.svg',
      alt: {
        fa: 'کاور دوره طراحی محیط بازی',
        en: 'Game environment course cover'
      }
    },
    title: {
      fa: 'دوره طراحی و ساخت محیط بازی',
      en: 'Game Environment Design'
    },
    duration: {
      fa: '8 هفته',
      en: '8 weeks'
    },
    level: {
      fa: 'متوسط و حرفه‌ای',
      en: 'Intermediate to professional'
    },
    price: {
      fa: '6,000,000 تومان',
      en: '6,000,000 toman'
    },
    summary: {
      fa: 'ساخت محیط بازی آماده Unity',
      en: 'Create a Unity-ready game environment.'
    },
    outcome: {
      fa: 'محیط‌های حرفه‌ای قابل استفاده در بازی‌ها',
      en: 'Professional environments ready for games'
    },
    audience: {
      fa: 'طراحان بازی و محیط‌های سه بعدی',
      en: 'Game designers and 3D environment creators'
    }
  },
  {
    id: 'animation',
    difficulty: 'intermediate',
    icon: 'M',
    image: {
      src: './images/courses/animation.svg',
      alt: {
        fa: 'کاور دوره انیمیشن سازی',
        en: 'Animation course cover'
      }
    },
    title: {
      fa: 'دوره انیمیشن سازی',
      en: 'Animation Course'
    },
    duration: {
      fa: '8 هفته',
      en: '8 weeks'
    },
    level: {
      fa: 'متوسط و حرفه‌ای',
      en: 'Intermediate to professional'
    },
    price: {
      fa: '7,000,000 تومان',
      en: '7,000,000 toman'
    },
    summary: {
      fa: 'ساخت انیمیشن کوتاه حرفه‌ای',
      en: 'Produce a professional short animation.'
    },
    outcome: {
      fa: 'انیمیشن سه بعدی و موشن قابل استفاده در رزومه',
      en: 'Portfolio-ready 3D animation and motion'
    },
    audience: {
      fa: 'علاقه‌مندان به انیمیشن و موشن گرافیک',
      en: 'Students interested in animation and motion graphics'
    }
  },
  {
    id: 'digital-kickstart',
    difficulty: 'beginner',
    icon: 'S',
    image: {
      src: './images/courses/digital-kickstart.svg',
      alt: {
        fa: 'کاور دوره شروع سریع دنیای دیجیتال',
        en: 'Digital quick start course cover'
      }
    },
    title: {
      fa: 'دوره شروع سریع دنیای دیجیتال',
      en: 'Digital World Quick Start'
    },
    duration: {
      fa: '4 هفته',
      en: '4 weeks'
    },
    level: {
      fa: 'مقدماتی',
      en: 'Beginner'
    },
    price: {
      fa: '900,000 تومان',
      en: '900,000 toman'
    },
    summary: {
      fa: 'شناخت مسیر شغلی و اولین پروژه ساده',
      en: 'Discover career paths and build a first simple project.'
    },
    outcome: {
      fa: 'آشنایی با دنیای دیجیتال و ساخت اولین پروژه',
      en: 'Digital foundations plus a first project'
    },
    audience: {
      fa: 'مبتدیان و همه سنین از ۱۰ سال به بالا',
      en: 'Beginners and students age 10+'
    }
  },
  {
    id: 'real-programming',
    difficulty: 'beginner',
    icon: 'C',
    image: {
      src: './images/courses/real-programming.svg',
      alt: {
        fa: 'کاور دوره برنامه نویسی واقعی',
        en: 'Real programming course cover'
      }
    },
    title: {
      fa: 'دوره ورود به برنامه نویسی واقعی',
      en: 'Real Programming Entry'
    },
    duration: {
      fa: '6 هفته',
      en: '6 weeks'
    },
    level: {
      fa: 'مقدماتی',
      en: 'Beginner'
    },
    price: {
      fa: '2,000,000 تومان',
      en: '2,000,000 toman'
    },
    summary: {
      fa: 'توانایی ساخت برنامه‌های کوچک',
      en: 'Learn to build small real applications.'
    },
    outcome: {
      fa: 'کدنویسی، حل مسئله و پروژه‌های ساده',
      en: 'Coding, problem solving, and simple projects'
    },
    audience: {
      fa: 'علاقه‌مندان به برنامه‌نویسی از صفر',
      en: 'Students starting programming from zero'
    }
  },
  {
    id: 'professional-web',
    difficulty: 'intermediate',
    icon: 'W',
    image: {
      src: './images/courses/professional-web.svg',
      alt: {
        fa: 'کاور دوره طراحی سایت حرفه ای',
        en: 'Professional website design course cover'
      }
    },
    title: {
      fa: 'دوره طراحی سایت حرفه‌ای',
      en: 'Professional Website Design'
    },
    duration: {
      fa: '7 هفته',
      en: '7 weeks'
    },
    level: {
      fa: 'پایه و متوسط',
      en: 'Foundation to intermediate'
    },
    price: {
      fa: '4,000,000 تومان',
      en: '4,000,000 toman'
    },
    summary: {
      fa: 'توانایی ساخت سایت واقعی و قابل انتشار',
      en: 'Build real websites ready to publish.'
    },
    outcome: {
      fa: 'طراحی سایت‌های کامل واکنش‌گرا',
      en: 'Complete responsive website design'
    },
    audience: {
      fa: 'علاقه‌مندان به طراحی وب و فریلنسری',
      en: 'Students interested in web design and freelancing'
    }
  },
  {
    id: 'full-stack',
    difficulty: 'advanced',
    icon: 'FS',
    image: {
      src: './images/courses/full-stack.svg',
      alt: {
        fa: 'کاور دوره توسعه دهنده فول استک',
        en: 'Full-stack course cover'
      }
    },
    title: {
      fa: 'دوره توسعه دهنده فول استک',
      en: 'Full-Stack Developer Course'
    },
    duration: {
      fa: '10 هفته',
      en: '10 weeks'
    },
    level: {
      fa: 'حرفه‌ای',
      en: 'Professional'
    },
    price: {
      fa: '8,000,000 تومان',
      en: '8,000,000 toman'
    },
    summary: {
      fa: 'پورتفولیو شغلی کامل',
      en: 'Create a complete job-ready portfolio.'
    },
    outcome: {
      fa: 'توسعه Front-End و Back-End در پروژه واقعی',
      en: 'Front-end and back-end development in a real project'
    },
    audience: {
      fa: 'برنامه‌نویسان آماده ورود به بازار کار',
      en: 'Developers preparing to enter the job market'
    }
  },
  {
    id: '3d-website',
    difficulty: 'advanced',
    icon: '3W',
    image: {
      src: './images/courses/3d-website.svg',
      alt: {
        fa: 'کاور دوره طراحی سایت سه بعدی',
        en: '3D website design course cover'
      }
    },
    title: {
      fa: 'دوره طراحی سایت سه بعدی',
      en: '3D Website Design'
    },
    duration: {
      fa: '7 هفته',
      en: '7 weeks'
    },
    level: {
      fa: 'متوسط و حرفه‌ای',
      en: 'Intermediate to professional'
    },
    price: {
      fa: '5,000,000 تومان',
      en: '5,000,000 toman'
    },
    summary: {
      fa: 'توانایی ساخت سایت 3D و قابل انتشار',
      en: 'Build publishable 3D websites.'
    },
    outcome: {
      fa: 'طراحی وب‌سایت‌های سه بعدی و تعاملی',
      en: 'Interactive 3D website design'
    },
    audience: {
      fa: 'طراحان وب و علاقه‌مندان تکنولوژی‌های نو',
      en: 'Web designers and new-technology enthusiasts'
    }
  },
  {
    id: 'startup-product',
    difficulty: 'advanced',
    icon: 'P',
    image: {
      src: './images/courses/startup-product.svg',
      alt: {
        fa: 'کاور دوره ساخت محصول و استارتاپ',
        en: 'Product and startup course cover'
      }
    },
    title: {
      fa: 'ساخت محصول و استارتاپ',
      en: 'Product and Startup Building'
    },
    duration: {
      fa: '6 هفته',
      en: '6 weeks'
    },
    level: {
      fa: 'حرفه‌ای',
      en: 'Professional'
    },
    price: {
      fa: '4,000,000 تومان',
      en: '4,000,000 toman'
    },
    summary: {
      fa: 'ساخت یک محصول واقعی',
      en: 'Build a real digital product.'
    },
    outcome: {
      fa: 'ایده‌پردازی، طراحی و راه‌اندازی محصول',
      en: 'Ideation, design, and product launch'
    },
    audience: {
      fa: 'کارآفرینان و علاقه‌مندان به کسب‌وکار دیجیتال',
      en: 'Entrepreneurs and digital business students'
    }
  },
  {
    id: 'cooci-system',
    difficulty: 'advanced',
    icon: 'CL',
    image: {
      src: './images/courses/cooci-system.svg',
      alt: {
        fa: 'کاور دوره سیستم سازی',
        en: 'Systems design course cover'
      }
    },
    title: {
      fa: 'سیستم سازی (cooci Level)',
      en: 'Systems Design (cooci Level)'
    },
    duration: {
      fa: '10 هفته',
      en: '10 weeks'
    },
    level: {
      fa: 'پیشرفته',
      en: 'Advanced'
    },
    price: {
      fa: '12,000,000 تومان',
      en: '12,000,000 toman'
    },
    summary: {
      fa: 'طراحی و بهینه‌سازی سیستم‌ها',
      en: 'Design and optimize advanced systems.'
    },
    outcome: {
      fa: 'ساخت سیستم‌های پیشرفته و مقیاس‌پذیر',
      en: 'Advanced, scalable system building'
    },
    audience: {
      fa: 'برنامه‌نویسان حرفه‌ای و علاقه‌مندان سیستم‌سازی',
      en: 'Professional developers and systems builders'
    }
  },
  {
    id: 'unity-game-dev',
    difficulty: 'advanced',
    icon: 'U',
    image: {
      src: './images/courses/unity-game-dev.svg',
      alt: {
        fa: 'کاور دوره بازی سازی با یونیتی',
        en: 'Unity game development course cover'
      }
    },
    title: {
      fa: 'دوره جامع بازی سازی با UNITY',
      en: 'Complete Game Development with Unity'
    },
    duration: {
      fa: '20 هفته',
      en: '20 weeks'
    },
    level: {
      fa: 'پیشرفته',
      en: 'Advanced'
    },
    price: {
      fa: '19,000,000 تومان',
      en: '19,000,000 toman'
    },
    summary: {
      fa: 'مهارت‌های بازی‌سازی واقعی قابل ورود به بازار کار',
      en: 'Real game-development skills for entering the market.'
    },
    outcome: {
      fa: 'ساخت بازی کامل و آماده انتشار',
      en: 'A complete game ready for release'
    },
    audience: {
      fa: 'علاقه‌مندان جدی بازی‌سازی و ورود به صنعت گیم',
      en: 'Serious game-development students entering the game industry'
    }
  }
];
