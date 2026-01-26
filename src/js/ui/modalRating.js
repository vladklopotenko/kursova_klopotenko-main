import { api } from '../api';
import { toast } from './toast';

const EMAIL_RE = /^\w+((\.\w+)?|(\-\w+)?)@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

export function openRatingModal(id) {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <div class="modal modal--small" role="dialog" aria-modal="true" aria-label="Rating">
      <button class="modal__close" aria-label="Close">×</button>
      <div class="modal__content">
        <h2>Rating</h2>
        <form id="ratingForm">
          <div class="rating-stars" aria-label="Choose rating">
            ${[1,2,3,4,5].map(n => `
              <label>
                <input type="radio" name="rating" value="${n}" ${n===5?'checked':''}/>
                <span>${n}</span>
              </label>
            `).join('')}
          </div>

          <input name="email" type="email" placeholder="Email" aria-label="Email" required />
          <textarea name="comment" placeholder="Your comment" aria-label="Comment"></textarea>
          <button type="submit" class="btn">Send</button>
        </form>
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

  modal.querySelector('#ratingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const rating = Number(fd.get('rating'));
    const email = String(fd.get('email') || '').trim();
    const comment = String(fd.get('comment') || '').trim();

    if (!EMAIL_RE.test(email)) {
      toast('Invalid email format', 'error');
      return;
    }

    try {
      await api.rateExercise(id, { rating, email, comment });
      toast('Rating sent successfully', 'success');
      close();
    } catch (err) {
      toast(err.message || 'Rating error', 'error');
    }
  });

  document.body.appendChild(modal);
  window.addEventListener('keydown', onEsc);
}
