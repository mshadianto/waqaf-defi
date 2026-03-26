/*═══════════════════════════════════════════════════════════════
  WaqFi — Main Application Entry Point
  Orchestrates initialization of all modules.
═══════════════════════════════════════════════════════════════*/

import { store } from './state.js';
import { createGenesisBlock, mineBlock, generateAddress, formatRupiah } from './blockchain.js';
import { connectWallet } from './wallet.js';
import { SEED_TRANSACTIONS, AUTO_TX_INTERVAL, AUTO_TX_AMOUNTS, WAKIF_NAMES, PILAR_NAMES, PILAR_COLORS, PROJECT_NAMES, TOKEN_UNIT } from './config.js';

// UI Modules
import { renderHeroChain } from './ui/hero.js';
import { renderChain, renderTxTable, initExplorer } from './ui/explorer.js';
import { updateDashboard, animateMeters, initDashboard } from './ui/dashboard.js';
import { renderBarChart, renderDonutChart } from './ui/charts.js';
import { addTxFeed } from './ui/txfeed.js';
import { mintToken, distributeROI } from './ui/mint.js';
import { initScrollReveal, initTopbarScroll, initNavigation, scrollToSection } from './ui/scroll.js';

// ── Expose to HTML onclick handlers ──
window.connectWallet  = connectWallet;
window.mintToken      = mintToken;
window.distributeROI  = distributeROI;
window.scrollToSection = scrollToSection;

// ── Seed demo data ──
function seedDemoData() {
  for (const tx of SEED_TRANSACTIONS) {
    const tokens = Math.floor(tx.amount / TOKEN_UNIT);
    mineBlock('mint', {
      from:    generateAddress(),
      to:      '0xWaqfToken',
      amount:  tx.amount,
      pilar:   tx.pilar,
      project: tx.project,
      wakif:   tx.name,
      tokens,
    });

    store.set({
      totalWaqf:   store.get('totalWaqf')   + tx.amount,
      totalWakif:  store.get('totalWakif')   + 1,
      totalTokens: store.get('totalTokens')  + tokens,
    });
  }

  // One ROI distribution
  mineBlock('distribution', {
    from:    '0xROIDistributor',
    to:      'Multi-beneficiary',
    amount:  420_000,
    pilar:   0,
    project: 'ROI Distribution Round #1',
  });
}

// ── Auto-generate periodic transactions ──
let autoInterval = null;

function startAutoGenerate() {
  autoInterval = setInterval(() => {
    const name    = WAKIF_NAMES[(Math.random() * WAKIF_NAMES.length) | 0];
    const pilar   = ((Math.random() * 4) | 0) + 1;
    const amount  = AUTO_TX_AMOUNTS[(Math.random() * AUTO_TX_AMOUNTS.length) | 0];
    const project = PROJECT_NAMES[(Math.random() * PROJECT_NAMES.length) | 0];
    const tokens  = Math.floor(amount / TOKEN_UNIT);

    mineBlock('mint', {
      from: generateAddress(),
      to:   '0xWaqfToken',
      amount, pilar, project, wakif: name, tokens,
    });

    store.set({
      totalWaqf:   store.get('totalWaqf')   + amount,
      totalWakif:  store.get('totalWakif')   + 1,
      totalTokens: store.get('totalTokens')  + tokens,
    });

    addTxFeed(
      `\uD83E\uDE99 Auto: ${name} \u2192 ${tokens} WAQF (${PILAR_NAMES[pilar]})`,
      PILAR_COLORS[pilar],
    );
  }, AUTO_TX_INTERVAL);
}

// ── Cleanup on page unload ──
function cleanup() {
  if (autoInterval) {
    clearInterval(autoInterval);
    autoInterval = null;
  }
}

// ── Initialize ──
function init() {
  // 1. State subscriptions
  initExplorer();
  initDashboard();

  // 2. Blockchain bootstrap
  createGenesisBlock();
  seedDemoData();

  // 3. Render UI
  renderHeroChain();
  renderChain();
  renderTxTable();
  renderBarChart();
  renderDonutChart();
  updateDashboard();
  animateMeters();

  // 4. Scroll & navigation
  initScrollReveal();
  initTopbarScroll();
  initNavigation();

  // 5. Auto-generate
  startAutoGenerate();

  // 6. Cleanup
  window.addEventListener('beforeunload', cleanup);
}

// ── Boot ──
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
