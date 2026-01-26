import { api } from '../api';
import { toggleFavorite, isFavorite } from '../storage';
import { toast } from './toast';
import { openRatingModal } from './modalRating';
import { stars } from './render';

export async function openExerciseModal(id) {
  const data = await api.getExerciseById(id);

  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="Exercise details">
      <button class="modal__close" aria-label="Close">×</button>
      <div class="modal__body">
        <div class="modal__media">
          ${data?.gifUrl ? `<img src="${data.gifUrl}" alt="${data.name || 'Exercise'}" loading="lazy">` : ''}
        </div>

        <div class="modal__content">
          <h2>${data?.name || ''}</h2>
          <div class="modal__row">
            <span class="stars">${stars(data?.rating || 0)}</span>
            <span class="meta"><b>Popular:</b> ${data?.popularity ?? ''}</span>
          </div>

          <div class="modal__grid">
            <div><b>Target</b><div>${data?.target || ''}</div></div>
            <div><b>Body Part</b><div>${data?.bodyPart || ''}</div></div>
            <div><b>Equipment</b><div>${data?.equipment || ''}</div></div>
          </div>

          <div class="modal__row">
            <span><b>Burned Calories:</b> ${data?.burnedCalories ?? ''}</span>
            <span><b>Time:</b> ${data?.time ?? ''}</span>
          </div>

          <p>${data?.description || ''}</p>

          <div class="modal__actions">
            <button type="button" class="btn" data-favbtn>
              ${isFavorite(id) ? 'Remove from favorites ♡' : 'Add to favorites ♥'}
            </button>
            <button type="button" class="btn btn--outline" data-ratebtn>Give a rating</button>
          </div>
        </div>
      </div>
    </div>
  `;

  function close() {
    modal.remove();
    window.removeEventListener('keydown', onEsc);
  }
  function onEsc(e) {
    if (e.key === 'Escape') close();
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  modal.querySelector('.modal__close').addEventListener('click', close);

  modal.querySelector('[data-favbtn]').addEventListener('click', () => {
    const brief = { id, name: data?.name, burnedCalories: data?.burnedCalories, time: data?.time, target: data?.target, bodyPart: data?.bodyPart, rating: data?.rating };
    const res = toggleFavorite(brief);
    toast(res.exists ? 'Added to favorites' : 'Removed from favorites', 'success');
    modal.querySelector('[data-favbtn]').textContent = isFavorite(id) ? 'Remove from favorites ♡' : 'Add to favorites ♥';

  });

  modal.querySelector('[data-ratebtn]').addEventListener('click', () => {
    close();
    openRatingModal(id);
  });

  document.body.appendChild(modal);
  window.addEventListener('keydown', onEsc);
}
