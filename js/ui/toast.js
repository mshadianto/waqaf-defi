/*═══════════════════════════════════════════════════════════════
  WaqFi — Toast Notification System
═══════════════════════════════════════════════════════════════*/

import { TOAST_DURATION } from '../config.js';

const ICONS = { success: '\u2705', warning: '\u26A0\uFE0F', error: '\u274C', info: '\u2139\uFE0F' };
let container = null;

function ensureContainer() {
  if (container) return container;
  container = document.createElement('div');
  container.className = 'toast-container';
  container.setAttribute('role', 'status');
  container.setAttribute('aria-live', 'polite');
  document.body.appendChild(container);
  return container;
}

/**
 * Show a toast notification.
 * @param {'success'|'warning'|'error'|'info'} type
 * @param {string} title
 * @param {string} message
 * @param {number} [duration]
 */
export function toast(type, title, message, duration = TOAST_DURATION) {
  const wrap = ensureContainer();

  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `
    <span class="toast-icon">${ICONS[type] || ICONS.info}</span>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
    <div class="toast-progress"><div class="toast-progress-bar" style="animation-duration:${duration}ms"></div></div>
  `;

  wrap.appendChild(el);

  // Cap max visible toasts
  while (wrap.children.length > 5) {
    wrap.firstChild.remove();
  }

  const timer = setTimeout(() => removeToast(el), duration);

  // Click to dismiss
  el.addEventListener('click', () => {
    clearTimeout(timer);
    removeToast(el);
  });
}

function removeToast(el) {
  if (!el.parentNode) return;
  el.classList.add('removing');
  el.addEventListener('animationend', () => el.remove(), { once: true });
}
