import { getFavorites, toggleFavorite } from '../storage';
import { renderExerciseCard, renderList } from '../ui/render';
import { openExerciseModal } from '../ui/modalExercise';

export function favoritesPage() {
  const favs = getFavorites();

  const content =
    favs.length === 0
      ? `<p class="empty">Favorites list is empty</p>`
      : renderList(
          favs
            .map((f) =>
              renderExerciseCard({
                id: f.id,
                name: f.name,
                burnedCalories: f.burnedCalories,
                time: f.time,
                target: f.target,
                bodyPart: f.bodyPart,
                rating: f.rating,
              })
            )
            .join('')
        );

  return `
    <section class="favorites">
      <h1>Favorites</h1>
      <div class="content">${content}</div>
    </section>
  `;
}

export function bindFavoritesEvents(container, navigate, getState) {
  container.addEventListener('click', async (e) => {
    const startBtn = e.target.closest('[data-start]');
    if (startBtn) {
      await openExerciseModal(startBtn.dataset.start);
      return;
    }

    const favBtn = e.target.closest('[data-fav]');
    if (favBtn) {
      toggleFavorite({ id: favBtn.dataset.fav });
      navigate({ ...getState() }, { replace: true });
    }
  });
}
