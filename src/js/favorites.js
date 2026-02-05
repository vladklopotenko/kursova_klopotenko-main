import './scroll-up.js';
import './mobile-menu.js';
import './nav-active.js';
import { openModal } from './modal-exercise.js';

const list = document.querySelector('.js-favorites-list');
const emptyBlock = document.querySelector('.js-favorites-empty');

// 1. Функція малювання карток (схожа на ту, що була, але для Favorites)
function createMarkup(arr) {
  return arr.map(({ _id, name, burnedCalories, time, bodyPart, target }) => `
    <li class="exercises-item exercise-card-details" data-id="${_id}">
      <div class="exercise-card-top">
        <span class="exercise-badge">WORKOUT</span>
        <button class="favorites-remove-btn js-remove-btn" data-id="${_id}" aria-label="Remove">
          <svg width="16" height="16" viewBox="0 0 16 16" stroke="currentColor" fill="none">
            <path d="M3 3L13 13M3 13L13 3" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        
        <button class="exercise-start-btn js-start-btn" data-id="${_id}">
          Start
          <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/></svg>
        </button>
      </div>
      
      <div class="exercise-card-title">
        <div class="exercise-icon-run">
            <svg viewBox="0 0 32 32"><path d="M7 29.5l-5-4 3.5-3.5 3.5 2.5 4-5-3-3.5 1-4.5 4-2.5 3.5-3.5-1.5-3.5 4.5-2 3 3-1 4.5-5 3.5-2 4 1.5 1.5 3.5-0.5 3 2.5-0.5 3.5-4.5 1-4-2.5-3 2.5z"></path></svg>
        </div>
        <h3 class="exercise-title-text">${name}</h3>
      </div>

      <ul class="exercise-info-list">
        <li class="exercise-info-item">Burned calories:<span class="exercise-info-value">${burnedCalories} / ${time} min</span></li>
        <li class="exercise-info-item">Body part:<span class="exercise-info-value">${bodyPart}</span></li>
        <li class="exercise-info-item">Target:<span class="exercise-info-value">${target}</span></li>
      </ul>
    </li>
  `).join('');
}

// 2. Головна функція рендеру
function renderFavorites() {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  if (favorites.length === 0) {
    list.innerHTML = '';
    emptyBlock.classList.remove('is-hidden'); // Показуємо "Пусто"
  } else {
    emptyBlock.classList.add('is-hidden');
    list.innerHTML = createMarkup(favorites);
  }
}

// 3. Обробка кліків (Видалити або Старт)
list.addEventListener('click', (e) => {
  // А) Клік по кнопці "Видалити" (смітник)
  const removeBtn = e.target.closest('.js-remove-btn');
  if (removeBtn) {
    const id = removeBtn.dataset.id;
    removeFromFavorites(id);
    return;
  }

  // Б) Клік по кнопці "Start" (відкрити модалку)
  const startBtn = e.target.closest('.js-start-btn');
  if (startBtn) {
    const id = startBtn.dataset.id;
    openModal(id);
  }
});

// Функція видалення
function removeFromFavorites(id) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const updatedFavorites = favorites.filter(item => item._id !== id);
  localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  
  // Перемальовуємо список
  renderFavorites();
}

// 4. Підсвітка активного посилання в Хедері
function highlightActiveLink() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes('favorites.html')) {
            link.classList.add('active');
        }
    });
}

// Запуск
document.addEventListener('DOMContentLoaded', () => {
  highlightActiveLink();
  renderFavorites();
});