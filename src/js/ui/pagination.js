export function renderPagination({ page, totalPages }) {
  const p = Number(page) || 1;
  const tp = Number(totalPages) || 1;

  const prevDisabled = p <= 1;
  const nextDisabled = p >= tp;

  return `
    <nav class="pagination" aria-label="Pagination">
      <button type="button" data-page="1" ${prevDisabled ? 'disabled' : ''} aria-label="First">«</button>
      <button type="button" data-page="${p - 1}" ${prevDisabled ? 'disabled' : ''} aria-label="Prev">‹</button>
      <span class="pagination__current">${p}</span>
      <button type="button" data-page="${p + 1}" ${nextDisabled ? 'disabled' : ''} aria-label="Next">›</button>
      <button type="button" data-page="${tp}" ${nextDisabled ? 'disabled' : ''} aria-label="Last">»</button>
    </nav>
  `;
}
