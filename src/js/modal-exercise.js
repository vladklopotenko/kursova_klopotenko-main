import { YourEnergyAPI } from './api-service';
import { openRatingModal } from './rating.js'; // 👈 1. Додано імпорт рейтингу

const api = new YourEnergyAPI();
const backdrop = document.querySelector('.js-backdrop');
const modalContent = document.querySelector('.js-modal-content');
const closeBtn = document.querySelector('.js-modal-close');

// Змінна для збереження поточного об'єкта вправи
let currentExercise = null;

// --- ВІДКРИТТЯ МОДАЛКИ ---
export async function openModal(id) {
  if (!backdrop) return;
  
  // 1. Показуємо бекдроп
  backdrop.classList.remove('is-hidden');
    document.addEventListener('keydown', handleKeyDown);
  document.body.style.overflow = 'hidden'; 
  
  modalContent.innerHTML = '<p style="text-align:center; padding:50px;">Loading...</p>';

  try {
    // 2. Качаємо дані
    currentExercise = await api.getExerciseById(id);
    
    // 3. Малюємо розмітку
    renderModalMarkup(currentExercise);
    
    // 4. Вішаємо слухачі (Favorites + Rating)
    setupModalListeners();

  } catch (error) {
    console.error(error);
    modalContent.innerHTML = '<p style="text-align:center; color:red; padding:50px;">Failed to load details.</p>';
  }
}

// --- ЗАКРИТТЯ МОДАЛКИ ---
function closeModal() {
  document.removeEventListener('keydown', handleKeyDown);
  backdrop.classList.add('is-hidden');
  document.body.style.overflow = ''; 
  modalContent.innerHTML = ''; 
}

// --- СЛУХАЧІ ДЛЯ ЗАКРИТТЯ ---
if (closeBtn) {
  closeBtn.addEventListener('click', closeModal);
}

if (backdrop) {
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });
}

function handleKeyDown(e) {
  if (e.key === 'Escape' && !backdrop.classList.contains('is-hidden')) {
    closeModal();
  }
}

// --- РОЗМІТКА ---
function renderModalMarkup(data) {
  const { gifUrl, name, rating, target, bodyPart, equipment, popularity, burnedCalories, time, description, _id } = data;

  // Перевіряємо, чи є вже в обраному
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const isFavorite = favorites.some(item => item._id === _id);
  
  const btnText = isFavorite ? 'Remove from favorites' : 'Add to favorites';
  // Іконка: Смітник (якщо в обраному) або Серце (якщо ні)
  const btnIcon = isFavorite ? 
    '<svg width="18" height="18"><path d="M6 18L18 6M6 6l12 12" stroke="white" stroke-width="2"/></svg>' : 
    '<svg width="18" height="18"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white"/></svg>';

  const markup = `
    <div class="modal-wrapper">
      <img class="modal-img" src="${gifUrl}" alt="${name}">
      
      <div class="modal-info">
        <h3 class="modal-title">${name}</h3>
        
        <div class="modal-rating">
          <span class="modal-rating-value">${rating}</span>
          <svg class="modal-star" viewBox="0 0 32 32"><path d="M16 2 L20.32 10.75 L30 12.16 L23 18.98 L24.65 28.63 L16 24.08 L7.35 28.63 L9 18.98 L2 12.16 L11.68 10.75 Z"></path></svg>
        </div>

        <ul class="modal-details-list">
          <li class="modal-details-item">
            <span class="modal-details-label">Target</span>
            <span class="modal-details-value">${target}</span>
          </li>
          <li class="modal-details-item">
            <span class="modal-details-label">Body Part</span>
            <span class="modal-details-value">${bodyPart}</span>
          </li>
          <li class="modal-details-item">
            <span class="modal-details-label">Equipment</span>
            <span class="modal-details-value">${equipment}</span>
          </li>
          <li class="modal-details-item">
            <span class="modal-details-label">Popular</span>
            <span class="modal-details-value">${popularity}</span>
          </li>
          <li class="modal-details-item">
            <span class="modal-details-label">Burned Calories</span>
            <span class="modal-details-value">${burnedCalories}/${time} min</span>
          </li>
        </ul>

        <p class="modal-desc">${description}</p>

        <div class="modal-buttons">
          <button type="button" class="modal-btn-fav js-fav-btn">
            <span>${btnText}</span>
            ${btnIcon}
          </button>
          
          <button type="button" class="modal-btn-rating">
            Give a rating
          </button>
        </div>
      </div>
    </div>
  `;
  
  modalContent.innerHTML = markup;
}

// --- ЛОГІКА КНОПОК ---
function setupModalListeners() {
  const favBtn = document.querySelector('.js-fav-btn');
  const ratingBtn = document.querySelector('.modal-btn-rating'); // Знаходимо кнопку рейтингу

  // 1. Слухач Favorites
  if (favBtn) {
    favBtn.addEventListener('click', () => {
      let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      const index = favorites.findIndex(item => item._id === currentExercise._id);

      if (index === -1) {
        // Додаємо
        favorites.push(currentExercise);
        favBtn.querySelector('span').textContent = 'Remove from favorites';
        favBtn.innerHTML = `<span>Remove from favorites</span> <svg width="18" height="18"><path d="M6 18L18 6M6 6l12 12" stroke="white" stroke-width="2"/></svg>`;
      } else {
        // Видаляємо
        favorites.splice(index, 1);
        favBtn.querySelector('span').textContent = 'Add to favorites';
        favBtn.innerHTML = `<span>Add to favorites</span> <svg width="18" height="18"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white"/></svg>`;
      }

      localStorage.setItem('favorites', JSON.stringify(favorites));
    });
  }

  // 2. Слухач Give a rating (👈 2. Додана логіка)
  if (ratingBtn) {
    ratingBtn.addEventListener('click', () => {
        closeModal(); // Закриваємо поточну модалку
        openRatingModal(currentExercise._id); // Відкриваємо рейтинг
    });
  }
}