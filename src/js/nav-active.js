/**
 * Marks the current page in the header navigation.
 * Works for both desktop and mobile links.
 */
export function setActiveNav() {
  const isFavorites = /favorites\.html$/i.test(window.location.pathname);

  const homeActive = !isFavorites;
  const favActive = isFavorites;

  document.querySelectorAll('[data-nav="home"]').forEach((el) => {
    el.classList.toggle('active', homeActive);
    el.setAttribute('aria-current', homeActive ? 'page' : 'false');
  });

  document.querySelectorAll('[data-nav="favorites"]').forEach((el) => {
    el.classList.toggle('active', favActive);
    el.setAttribute('aria-current', favActive ? 'page' : 'false');
  });
}

// Run on initial load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setActiveNav);
} else {
  setActiveNav();
}
