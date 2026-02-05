import { renderInitialExercises } from './js/exercises.js';
import { renderQuote } from './js/quote.js';
import './js/footer.js';
import './js/mobile-menu.js';
import './js/scroll-up.js';
import './js/nav-active.js';

document.addEventListener('DOMContentLoaded', () => {
  renderInitialExercises();
  renderQuote();
});