import { COURSES } from './courses.data.js';

const resolve = (value, lang) => value?.[lang] ?? value?.fa ?? value?.en ?? '';

const makeMeta = (label, value) => {
  const item = document.createElement('span');
  item.className = 'course-stat';
  const labelEl = document.createElement('span');
  labelEl.textContent = label;
  const valueEl = document.createElement('strong');
  valueEl.textContent = value;
  item.append(labelEl, valueEl);
  return item;
};

export function renderCourses({ lang, labels, registerReveal, onEnroll }) {
  const list = document.querySelector('[data-courses-list]');
  if (!list) return;

  list.innerHTML = '';

  COURSES.forEach((course) => {
    const card = document.createElement('article');
    card.className = 'course-card card';
    card.dataset.reveal = 'up';
    card.dataset.courseId = course.id;

    if (course.image?.src) {
      const media = document.createElement('div');
      media.className = 'course-media';
      const image = document.createElement('img');
      image.src = course.image.src;
      image.alt = resolve(course.image.alt, lang);
      image.loading = 'lazy';
      image.decoding = 'async';
      media.append(image);
      card.append(media);
    }

    const head = document.createElement('div');
    head.className = 'course-head';

    const icon = document.createElement('span');
    icon.className = 'course-icon';
    icon.textContent = course.icon;
    head.append(icon);

    const titleWrap = document.createElement('div');
    titleWrap.className = 'course-title-wrap';

    const title = document.createElement('h3');
    title.className = 'course-title';
    title.textContent = resolve(course.title, lang);
    titleWrap.append(title);

    const level = document.createElement('span');
    level.className = `pill course-difficulty course-difficulty-${course.difficulty}`;
    level.textContent = resolve(course.level, lang);
    titleWrap.append(level);
    head.append(titleWrap);

    const summary = document.createElement('p');
    summary.className = 'course-summary';
    summary.textContent = resolve(course.summary, lang);

    const stats = document.createElement('div');
    stats.className = 'course-stats';
    stats.append(
      makeMeta(labels?.durationLabel ?? 'Duration', resolve(course.duration, lang)),
      makeMeta(labels?.priceLabel ?? 'Price', resolve(course.price, lang))
    );

    const details = document.createElement('div');
    details.className = 'course-details';

    const outcome = document.createElement('p');
    const outcomeLabel = document.createElement('strong');
    outcomeLabel.textContent = `${labels?.outcomeLabel ?? 'Outcome'}:`;
    outcome.append(outcomeLabel, ` ${resolve(course.outcome, lang)}`);

    const audience = document.createElement('p');
    const audienceLabel = document.createElement('strong');
    audienceLabel.textContent = `${labels?.audienceLabel ?? 'Audience'}:`;
    audience.append(audienceLabel, ` ${resolve(course.audience, lang)}`);
    details.append(outcome, audience);

    const cta = document.createElement('button');
    cta.type = 'button';
    cta.className = 'btn-ghost course-cta';
    const courseTitle = resolve(course.title, lang);
    const ctaLabel = labels?.cta ?? 'Apply';
    cta.textContent = ctaLabel;
    const ariaLabelTemplate = labels?.ctaAria ?? '{cta} - {course}';
    cta.setAttribute('aria-label', ariaLabelTemplate.replace('{cta}', ctaLabel).replace('{course}', courseTitle));
    cta.dataset.courseId = course.id;
    cta.addEventListener('click', () => {
      onEnroll?.(course);
    });

    card.append(head, summary, stats, details, cta);
    list.append(card);

    registerReveal?.(card);
  });
}
