/*═══════════════════════════════════════════════════════════════
  WaqFi — Charts (Bar & Donut)
═══════════════════════════════════════════════════════════════*/

import { CHART_DATA } from '../config.js';

// ── Color Gradient for Bar Chart ──
const BAR_COLORS = [
  'var(--emerald)', 'var(--emerald)', 'var(--emerald)',
  'var(--emerald-l)', 'var(--emerald-l)',
  'var(--sapphire)', 'var(--sapphire)',
  'var(--gold)', 'var(--gold)', 'var(--gold)',
  'var(--amethyst)', 'var(--amethyst)',
];

// ── Bar Chart ──
export function renderBarChart() {
  const container = document.getElementById('barChart');
  if (!container) return;

  const data = CHART_DATA.monthly;
  const max  = Math.max(...data.map(d => d.value));

  container.innerHTML = data.map((d, i) => `
    <div class="bar-col">
      <div class="bar-fill" style="height:0%;background:${BAR_COLORS[i]}" data-h="${(d.value / max * 100).toFixed(1)}">
        <span class="tooltip">${d.value}M</span>
      </div>
      <span class="bar-label">${d.label}</span>
    </div>
  `).join('');

  // Trigger height animation after paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      container.querySelectorAll('.bar-fill').forEach(bar => {
        bar.style.height = bar.dataset.h + '%';
      });
    });
  });
}

// ── Donut Chart ──
export function renderDonutChart() {
  const svg    = document.getElementById('donutChart');
  const legend = document.getElementById('donutLegend');
  if (!svg || !legend) return;

  const data = CHART_DATA.pilarDistribution;
  const cx = 80, cy = 80, r = 60, strokeW = 18;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  svg.innerHTML = data.map(d => {
    const dashLen = (d.value / 100) * circumference;
    const dashGap = circumference - dashLen;
    const circle  = `<circle cx="${cx}" cy="${cy}" r="${r}"
      fill="none" stroke="${d.color}" stroke-width="${strokeW}"
      stroke-dasharray="${dashLen} ${dashGap}" stroke-dashoffset="${-offset}"
      stroke-linecap="round"
      style="transition:all 1s ease;transform:rotate(-90deg);transform-origin:${cx}px ${cy}px"/>`;
    offset += dashLen;
    return circle;
  }).join('') + `
    <text x="${cx}" y="${cy - 4}" text-anchor="middle"
          fill="white" font-size="18" font-weight="800"
          font-family="'Playfair Display',serif">100%</text>
    <text x="${cx}" y="${cy + 12}" text-anchor="middle"
          fill="#64748B" font-size="8" font-weight="600"
          font-family="'Plus Jakarta Sans',sans-serif">ALLOCATED</text>`;

  legend.innerHTML = data.map(d => `
    <div class="legend-item">
      <div class="legend-dot" style="background:${d.color}"></div>
      <span>${d.label} (${d.value}%)</span>
    </div>
  `).join('');
}
