export function toast(message, type = 'info') {

  const el = document.createElement('div');
  el.textContent = message;
  el.setAttribute('role', 'status');
  el.style.cssText = `
    position: fixed; left: 16px; bottom: 16px; z-index: 9999;
    padding: 10px 12px; border-radius: 10px; max-width: 320px;
    background: ${type === 'error' ? '#ffdddd' : type === 'success' ? '#ddffea' : '#e9e9ff'};
    color: #111; box-shadow: 0 10px 30px rgba(0,0,0,.15);
    font: 14px/1.3 system-ui, -apple-system, Segoe UI, Roboto, Arial;
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}
