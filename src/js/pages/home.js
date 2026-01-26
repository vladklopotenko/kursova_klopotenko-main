import { api } from '../api';
import { getQuoteCache, setQuoteCache, todayISO } from '../storage';
import { toast } from '../ui/toast';
import {
  renderQuote,
  renderTabs,
  renderCategoryCard,
  renderExerciseCard,
  renderList,
  renderSearch,
} from '../ui/render';
import { renderPagination } from '../ui/pagination';
import { openExerciseModal } from '../ui/modalExercise';
import { toggleFavorite } from '../storage';

const LIMIT = 10;

export async function homePage(state) {
  const s = {
    filterTab: state.filterTab || 'Muscles',
    category: state.category || '',
    keyword: state.keyword || '',
    page: Number(state.page) || 1,
    view: state.view || 'categories', // 'categories' | 'exercises'
  };

  const quoteHtml = await loadQuoteHtml();
  const tabsHtml = renderTabs(s.filterTab);

  let contentHtml = '';
  let paginationHtml = '';

  try {
    if (s.view === 'categories') {
      // filters endpoint повертає категорії для табу
      const data = await api.getFilters(s.filterTab, s.page, LIMIT);
      const items = data?.results || data?.items || data || [];
      if (!items.length) {
        contentHtml = `<p class="empty">No categories found</p>`;
      } else {
        contentHtml = renderList(items.map((it) => renderCategoryCard(it, s.filterTab)).join(''));
      }
      paginationHtml = renderPagination({ page: s.page, totalPages: data?.totalPages || data?.pages || 1 });
    } else {
      const params = mapExerciseParams(s);
      const data = await api.getExercises(params);
      const items = data?.results || data?.items || data || [];
      if (!items.length) {
        contentHtml = `<p class="empty">No exercises found</p>`;
      } else {
        contentHtml = renderList(items.map(renderExerciseCard).join(''));
      }
      paginationHtml = renderPagination({ page: s.page, totalPages: data?.totalPages || data?.pages || 1 });
    }
  } catch (err) {
    toast(err.message || 'Load error', 'error');
    contentHtml = `<p class="empty">Error: ${err.message}</p>`;
  }

  return `
    <section class="home">
      <div class="home__left">
        ${quoteHtml}
      </div>

      <div class="home__right">
        ${renderSearch(s.keyword)}
        ${tabsHtml}

        <div class="content" id="content">
          ${contentHtml}
        </div>

        <div id="pagination">
          ${paginationHtml}
        </div>
      </div>
    </section>
  `;
}

export function bindHomeEvents(container, navigate, getState) {
  container.addEventListener('click', async (e) => {
    const tabBtn = e.target.closest('[data-tab]');
    if (tabBtn) {
      const tab = tabBtn.dataset.tab;
      navigate({ ...getState(), filterTab: tab, view: 'categories', category: '', page: 1 });
      return;
    }

    const catBtn = e.target.closest('[data-category]');
    if (catBtn) {
      const category = catBtn.dataset.category;
      const filterTab = catBtn.dataset.filter;
      navigate({ ...getState(), filterTab, view: 'exercises', category, page: 1 });
      return;
    }

    const startBtn = e.target.closest('[data-start]');
    if (startBtn) {
      await openExerciseModal(startBtn.dataset.start);
      return;
    }

    const favBtn = e.target.closest('[data-fav]');
    if (favBtn) {
      const id = favBtn.dataset.fav;
      toggleFavorite({ id });
      navigate({ ...getState() }, { replace: true });
      return;
    }

    const pageBtn = e.target.closest('[data-page]');
    if (pageBtn) {
      const page = Number(pageBtn.dataset.page);
      navigate({ ...getState(), page });
      return;
    }
  });

  const form = container.querySelector('#searchForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const keyword = new FormData(e.currentTarget).get('keyword');
      navigate({ ...getState(), keyword: String(keyword || '').trim(), view: 'exercises', page: 1 });
    });
  }
}

async function loadQuoteHtml() {
  const cache = getQuoteCache();
  const today = todayISO();

  if (cache?.date === today && cache?.data) {
    return renderQuote(cache.data);
  }

  try {
    const data = await api.getQuote();
    setQuoteCache({ date: today, data });
    return renderQuote(data);
  } catch (err) {
    if (cache?.data) return renderQuote(cache.data);
    return `<section class="quote"><h2>Quote of the day</h2><p class="empty">Quote unavailable</p></section>`;
  }
}

function mapExerciseParams(s) {
  const params = { page: s.page, limit: LIMIT };

  if (s.keyword) params.keyword = s.keyword;

  if (s.category) {
    if (s.filterTab === 'Muscles') params.muscles = s.category;
    if (s.filterTab === 'Body parts') params.bodypart = s.category;
    if (s.filterTab === 'Equipment') params.equipment = s.category;
  }
  return params;
}
