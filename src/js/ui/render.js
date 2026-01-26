import { isFavorite } from '../storage';

export function stars(rating = 0) {
  const r = Math.max(0, Math.min(5, Number(rating) || 0));
  const full = Math.round(r);
  return '★★★★★'.slice(0, full) + '☆☆☆☆☆'.slice(0, 5 - full);
}

export function renderQuote({ quote, author }) {
  return `
    <section class="quote">
      <h2>Quote of the day</h2>
      <p class="quote__text">${escapeHtml(quote || '')}</p>
      <p class="quote__author">${escapeHtml(author || '')}</p>
      <p class="quote__note">Щоденна фізична активність тривалістю щонайменше 110 хвилин — важлива для здоров’я та енергії.</p>
    </section>
  `;
}

export function renderTabs(active) {
  const tabs = [
    { id: 'Muscles', label: 'Muscles' },
    { id: 'Body parts', label: 'Body parts' },
    { id: 'Equipment', label: 'Equipment' },
  ];

  return `
    <div class="tabs" role="tablist" aria-label="Filters">
      ${tabs
        .map(
          (t) => `
        <button class="tab ${active === t.id ? 'is-active' : ''}"
          role="tab" aria-selected="${active === t.id}"
          data-tab="${t.id}">
          ${t.label}
        </button>`
        )
        .join('')}
    </div>
  `;
}

export function renderCategoryCard(item, activeFilter) {
  // item: { name, imgURL? } (залежить від API)
  const name = item?.name || item?.title || '';
  const img = item?.imgURL || item?.img || item?.image || '';
  return `
    <li class="card card--category">
      <button class="card__btn" data-category="${escapeAttr(name)}" data-filter="${escapeAttr(activeFilter)}">
        ${img ? `<img class="card__img" src="${escapeAttr(img)}" alt="${escapeAttr(name)}" loading="lazy">` : ''}
        <span class="card__title">${escapeHtml(name)}</span>
        <span class="card__meta">${escapeHtml(activeFilter)}</span>
      </button>
    </li>
  `;
}

export function renderExerciseCard(ex) {
  const id = ex?._id || ex?.id;
  const name = ex?.name || '';
  const rating = ex?.rating || 0;
  const bodyPart = ex?.bodyPart || ex?.bodypart || '';
  const target = ex?.target || '';
  const burned = ex?.burnedCalories || ex?.burned || ex?.calories || '';
  const time = ex?.time || ex?.duration || ex?.durationMinutes || '';
  const fav = isFavorite(id);

  return `
    <li class="card card--exercise">
      <div class="card__top">
        <span class="badge">WORKOUT</span>
        <span class="stars" aria-label="Rating">${stars(rating)}</span>
        <button class="fav" type="button" aria-label="Toggle favorite" data-fav="${escapeAttr(id)}">
          ${fav ? '♥' : '♡'}
        </button>
      </div>

      <h3 class="card__title">${escapeHtml(name)}</h3>

      <p class="card__meta">
        <span><b>Body part:</b> ${escapeHtml(bodyPart)}</span>
        <span><b>Target:</b> ${escapeHtml(target)}</span>
      </p>

      <p class="card__meta">
        <span><b>Burned:</b> ${escapeHtml(String(burned))}</span>
        <span><b>Time:</b> ${escapeHtml(String(time))}</span>
      </p>

      <button class="start" type="button" data-start="${escapeAttr(id)}">Start →</button>
    </li>
  `;
}

export function renderList(itemsHtml) {
  return `<ul class="grid">${itemsHtml}</ul>`;
}

export function renderSearch(value = '') {
  return `
    <form class="search" id="searchForm" role="search" aria-label="Search exercises">
      <input name="keyword" value="${escapeAttr(value)}" placeholder="Search" aria-label="Search by name" />
      <button type="submit" aria-label="Search">🔎</button>
    </form>
  `;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}
function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}
