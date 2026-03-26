/*═══════════════════════════════════════════════════════════════
  WaqFi — Hero Section (blockchain visual)
═══════════════════════════════════════════════════════════════*/

import { generateHash, shortHash } from '../blockchain.js';

const HERO_BLOCKS = [
  { h: 'Block #1024', d: 'WaqfToken.mint() \u2014 50 WAQF' },
  { h: 'Block #1025', d: 'ROIDistributor.distribute()' },
  { h: 'Block #1026', d: 'WaqfFactory.createProject()' },
  { h: 'Block #1027', d: 'ComplianceModule.verify()' },
];

export function renderHeroChain() {
  const el = document.getElementById('heroChain');
  if (!el) return;

  el.innerHTML = HERO_BLOCKS.map((b, i) => {
    const hash = shortHash(generateHash());
    const arrow = i > 0 ? '<div class="chain-arrow">\u2B07</div>' : '';
    return `${arrow}
      <div class="block-row" style="animation-delay:${i * 0.15}s">
        <div class="block-item${i === 0 ? ' active' : ''}">
          <div class="bh">${b.h}</div>
          <div class="bd">${b.d}</div>
          <div class="bd" style="margin-top:4px;font-size:8.5px;color:var(--tx-dim)">${hash}</div>
        </div>
      </div>`;
  }).join('');
}
