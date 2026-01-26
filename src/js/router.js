import { homePage, bindHomeEvents } from './pages/home';
import { favoritesPage, bindFavoritesEvents } from './pages/favorites';

export function createRouter({ mount }) {
  let state = parseLocation();

  async function render() {
    const route = state.route || 'home';

    if (route === 'favorites') {
      mount.innerHTML = favoritesPage(state);
      bindFavoritesEvents(mount, navigate, () => state);
    } else {
      mount.innerHTML = await homePage(state);
      bindHomeEvents(mount, navigate, () => state);
    }
  }

  function navigate(nextState, opts = {}) {
    state = { ...state, ...nextState };
    const hash = toHash(state);

    if (opts.replace) {
      history.replaceState(null, '', hash);
    } else {
      history.pushState(null, '', hash);
    }
    render();
  }

  window.addEventListener('hashchange', () => {
    state = parseLocation();
    render();
  });

  return { render, navigate, getState: () => state };
}

function parseLocation() {
  const h = location.hash.replace(/^#/, '');
  const p = new URLSearchParams(h);

  return {
    route: p.get('route') || 'home',
    filterTab: p.get('filterTab') || 'Muscles',
    category: p.get('category') || '',
    keyword: p.get('keyword') || '',
    page: Number(p.get('page') || 1),
    view: p.get('view') || 'categories',
  };
}

function toHash(s) {
  const p = new URLSearchParams();
  p.set('route', s.route || 'home');
  p.set('filterTab', s.filterTab || 'Muscles');
  if (s.category) p.set('category', s.category);
  if (s.keyword) p.set('keyword', s.keyword);
  p.set('page', String(s.page || 1));
  p.set('view', s.view || 'categories');
  return `#${p.toString()}`;
}
