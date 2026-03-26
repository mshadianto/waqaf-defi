/*═══════════════════════════════════════════════════════════════
  WaqFi — Live Transaction Feed
═══════════════════════════════════════════════════════════════*/

const MAX_FEED_ITEMS = 15;

/**
 * Prepend a message to the live feed.
 * @param {string} msg   — HTML-safe message text
 * @param {string} color — CSS color value for the left border
 */
export function addTxFeed(msg, color) {
  const feed = document.getElementById('txFeed');
  if (!feed) return;

  const el = document.createElement('div');
  el.style.cssText = `
    font-size:11px; padding:8px 12px;
    background:var(--bg-deep); border-radius:6px;
    border-left:3px solid ${color};
    animation:fadeUp .3s var(--ease-out);
  `;

  const time = new Date().toLocaleTimeString('id-ID');
  el.innerHTML = `<span style="color:var(--tx-dim);font-size:9px;margin-right:8px">${time}</span>${msg}`;

  feed.prepend(el);

  // Trim excess
  while (feed.children.length > MAX_FEED_ITEMS) {
    feed.lastChild.remove();
  }
}
