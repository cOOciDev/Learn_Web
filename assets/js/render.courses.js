import { COURSES } from './courses.data.js';

const resolve = (value, lang) => value?.[lang] ?? value?.en ?? '';

export function renderCourses({ lang, labels, registerReveal, onEnroll }) {
  const list = document.querySelector('[data-courses-list]');
  if (!list) return;

  list.innerHTML = '';

  COURSES.forEach((course) => {
    const card = document.createElement('article');
    card.className = 'course-card card';
    card.dataset.reveal = 'up';
    card.dataset.courseId = course.id;

    const meta = document.createElement('div');
    meta.className = 'course-meta';

    const badge = document.createElement('span');
    badge.className = 'course-badge';
    badge.textContent = resolve(course.badge, lang);
    meta.append(badge);

    const difficulty = document.createElement('span');
    difficulty.className = `pill course-difficulty course-difficulty-${course.difficulty}`;
    difficulty.textContent = labels?.levels?.[course.difficulty] ?? course.difficulty;
    meta.append(difficulty);

    if (course.focus) {
      const focus = document.createElement('span');
      focus.className = 'course-focus';
      focus.textContent = resolve(course.focus, lang);
      meta.append(focus);
    }

    const title = document.createElement('h3');
    title.className = 'course-title';
    title.textContent = resolve(course.title, lang);

    const summary = document.createElement('p');
    summary.className = 'course-summary';
    summary.textContent = resolve(course.summary, lang);

    const outcomesWrap = document.createElement('div');
    outcomesWrap.className = 'course-outcomes-wrap';

    const outcomesTitle = document.createElement('p');
    outcomesTitle.className = 'course-outcomes-title';
    outcomesTitle.textContent = labels?.outcomesLabel ?? '';
    outcomesWrap.append(outcomesTitle);

    const outcomesList = document.createElement('ul');
    outcomesList.className = 'course-outcomes';
    const outcomes = course.outcomes?.[lang] ?? course.outcomes?.en ?? [];
    outcomes.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      outcomesList.append(li);
    });
    outcomesWrap.append(outcomesList);

    const cta = document.createElement('button');
    cta.type = 'button';
    cta.className = 'btn-ghost course-cta';
    const courseTitle = resolve(course.title, lang);
    const ctaLabel = labels?.cta ?? 'Enroll';
    cta.textContent = ctaLabel;
    const ariaLabelTemplate = labels?.ctaAria ?? '{cta} — {course}';
    cta.setAttribute('aria-label', ariaLabelTemplate.replace('{cta}', ctaLabel).replace('{course}', courseTitle));
    cta.dataset.courseId = course.id;
    cta.addEventListener('click', () => {
      onEnroll?.(course);
    });

    card.append(meta, title, summary, outcomesWrap, cta);
    list.append(card);

    registerReveal?.(card);
  });
}
