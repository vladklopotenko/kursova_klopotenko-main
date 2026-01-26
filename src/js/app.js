import { refs } from './ui/refs';
import { createRouter } from './router';
import { api } from './api';
import { toast } from './ui/toast';

const router = createRouter({ mount: refs.app });

router.render();
bindGlobalNav();
bindSubscription();
bindMobileMenu();
syncActiveNav();

function bindGlobalNav() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-route]');
    if (!btn) return;
    router.navigate({ route: btn.dataset.route, page: 1, view: 'categories', category: '', keyword: '' });
  });
}

function bindMobileMenu() {
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.mobile-menu');
  if (!burger || !menu) return;

  function open() {
    menu.hidden = false;
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    menu.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    if (isOpen) close();
    else open();
  });

  // Close on any navigation click inside menu
  menu.addEventListener('click', (e) => {
    const link = e.target.closest('[data-route]');
    if (link) close();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  window.addEventListener('hashchange', close);
}

function syncActiveNav() {
  function apply() {
    const hash = location.hash.replace(/^#/, '');
    const p = new URLSearchParams(hash);
    const route = p.get('route') || 'home';
    document.querySelectorAll('[data-route]').forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      const active = el.dataset.route === route;
      el.classList.toggle('is-active', active);
      if (el.matches('a')) el.setAttribute('aria-current', active ? 'page' : 'false');
    });
  }
  apply();
  window.addEventListener('hashchange', apply);
}

function bindSubscription() {
  document.addEventListener('submit', async (e) => {
    const form = e.target.closest('#subscribeForm');
    if (!form) return;

    e.preventDefault();
    const email = String(new FormData(form).get('email') || '').trim();
    if (!email) {
      toast('Enter email', 'error');
      return;
    }

    try {
      await api.subscribe(email);
      toast('Subscribed successfully', 'success');
      form.reset();
    } catch (err) {
      toast(err.message || 'Subscribe error', 'error');
    }
  });
}
