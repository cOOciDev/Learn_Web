import { JOBS } from './jobs.data.js';

const resolve = (value, lang) => value?.[lang] ?? value?.en ?? '';
const SENIORITY_ORDER = new Map([['junior', 0], ['mid', 1], ['senior', 2]]);

export function initJobMarket({ lang, labels, registerReveal, onMatch }) {
  const list = document.querySelector('[data-jobs-list]');
  const filterGroups = document.querySelectorAll('[data-filter-group]');
  if (!list) {
    return {
      setLanguage() {},
      resetFilters() {},
      getState() { return { seniority: 'all', workType: 'all' }; }
    };
  }

  const state = { seniority: 'all', workType: 'all' };
  let currentLang = lang;
  let currentLabels = labels;

  const sortJobs = (a, b) => {
    const byOrder = (SENIORITY_ORDER.get(a.seniority) ?? 99) - (SENIORITY_ORDER.get(b.seniority) ?? 99);
    return byOrder !== 0 ? byOrder : a.title.en.localeCompare(b.title.en);
  };

  const renderEmpty = () => {
    const empty = document.createElement('p');
    empty.className = 'jobs-empty';
    empty.textContent = currentLabels?.empty ?? 'No openings match the filters right now.';
    list.append(empty);
    registerReveal?.(empty);
  };

  const render = () => {
    list.innerHTML = '';

    const filtered = JOBS
      .filter((job) => (state.seniority === 'all' || job.seniority === state.seniority))
      .filter((job) => (state.workType === 'all' || job.workType === state.workType))
      .sort(sortJobs);

    if (!filtered.length) {
      renderEmpty();
      return;
    }

    filtered.forEach((job) => {
      const card = document.createElement('article');
      card.className = 'job-card card';
      card.dataset.reveal = 'up';
      card.dataset.seniority = job.seniority;
      card.dataset.workType = job.workType;
      card.dataset.jobId = job.id;

      const head = document.createElement('div');
      head.className = 'job-head';

      const title = document.createElement('h3');
      title.className = 'job-title';
      title.textContent = resolve(job.title, currentLang);
      head.append(title);

      const meta = document.createElement('div');
      meta.className = 'job-meta';

      const seniorityTag = document.createElement('span');
      seniorityTag.className = 'pill job-tag';
      seniorityTag.textContent = currentLabels?.seniorityNames?.[job.seniority] ?? job.seniority;
      seniorityTag.setAttribute('aria-label', `${currentLabels?.seniorityLabel ?? 'Seniority'}: ${seniorityTag.textContent}`);
      meta.append(seniorityTag);

      const workTypeTag = document.createElement('span');
      workTypeTag.className = 'pill job-tag';
      workTypeTag.textContent = currentLabels?.workTypeNames?.[job.workType] ?? job.workType;
      workTypeTag.setAttribute('aria-label', `${currentLabels?.workTypeLabel ?? 'Work type'}: ${workTypeTag.textContent}`);
      meta.append(workTypeTag);

      head.append(meta);

      const summary = document.createElement('p');
      summary.className = 'job-summary';
      summary.textContent = resolve(job.summary, currentLang);

      const skillsTitle = document.createElement('p');
      skillsTitle.className = 'job-skills-title';
      skillsTitle.textContent = currentLabels?.skillsLabel ?? '';

      const skillsList = document.createElement('ul');
      skillsList.className = 'job-skills';
      const skills = job.skills?.[currentLang] ?? job.skills?.en ?? [];
      skills.forEach((skill) => {
        const li = document.createElement('li');
        li.className = 'pill job-skill';
        li.textContent = skill;
        skillsList.append(li);
      });

      const cta = document.createElement('button');
      cta.type = 'button';
      cta.className = 'btn-ghost job-cta';
      const ctaLabel = currentLabels?.cta ?? 'Match me to this role';
      cta.textContent = ctaLabel;
      const ariaTemplate = currentLabels?.ctaAria ?? '{cta} — {role}';
      cta.setAttribute('aria-label', ariaTemplate.replace('{cta}', ctaLabel).replace('{role}', title.textContent));
      cta.dataset.jobId = job.id;
      cta.addEventListener('click', () => onMatch?.(job));

      card.append(head, summary, skillsTitle, skillsList, cta);
      list.append(card);
      registerReveal?.(card);
    });
  };

  filterGroups.forEach((group) => {
    group.addEventListener('click', (event) => {
      const button = event.target.closest('[data-filter]');
      if (!button) return;
      const filter = button.getAttribute('data-filter');
      const groupKey = group.getAttribute('data-filter-group');
      if (!groupKey || !filter) return;
      if (state[groupKey] === filter) return;
      state[groupKey] = filter;
      group.querySelectorAll('[data-filter]').forEach((btn) => {
        btn.classList.toggle('active', btn === button);
      });
      render();
    });
  });

  render();

  return {
    setLanguage(nextLang, nextLabels) {
      currentLang = nextLang;
      currentLabels = nextLabels;
      render();
    },
    resetFilters() {
      state.seniority = 'all';
      state.workType = 'all';
      filterGroups.forEach((group) => {
        group.querySelectorAll('[data-filter]').forEach((btn) => {
          const filter = btn.getAttribute('data-filter');
          btn.classList.toggle('active', filter === 'all');
        });
      });
      render();
    },
    getState() {
      return { ...state };
    }
  };
}
