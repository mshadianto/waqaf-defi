/*═══════════════════════════════════════════════════════════════
  WaqFi — Dashboard KPIs & Impact Meters
═══════════════════════════════════════════════════════════════*/

import { store } from '../state.js';
import { formatRupiah } from '../blockchain.js';

// ── Animated Value Update ──
function animateValue(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.animation = 'none';
  void el.offsetHeight; // trigger reflow
  el.style.animation = 'countUp .4s ease both';
  el.textContent = val;
}

// ── Update KPI Cards ──
export function updateDashboard() {
  const s = store.snapshot();
  animateValue('kpi-total',  formatRupiah(s.totalWaqf));
  animateValue('kpi-wakif',  s.totalWakif.toLocaleString('id-ID'));
  animateValue('kpi-tokens', s.totalTokens.toLocaleString('id-ID') + ' WAQF');
  animateValue('kpi-roi',    (Math.random() * 3 + 5).toFixed(1) + '%');
}

// ── Animate Impact Meters ──
export function animateMeters() {
  const meters = [
    { id: 'meter1', target: 62 },
    { id: 'meter2', target: 85 },
    { id: 'meter3', target: 74 },
  ];

  meters.forEach((m, i) => {
    setTimeout(() => {
      const el = document.getElementById(m.id);
      if (el) el.style.width = m.target + '%';
    }, 300 + i * 200);
  });
}

// ── Subscribe to state changes ──
export function initDashboard() {
  store.on('change:totalWaqf',   () => updateDashboard());
  store.on('change:totalWakif',  () => updateDashboard());
  store.on('change:totalTokens', () => updateDashboard());
}
