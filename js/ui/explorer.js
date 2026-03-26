/*═══════════════════════════════════════════════════════════════
  WaqFi — Blockchain Explorer & Transaction Table
═══════════════════════════════════════════════════════════════*/

import { store } from '../state.js';
import { shortHash, shortAddr, formatRupiah } from '../blockchain.js';

// ── Chain Display ──
export function renderChain() {
  const container = document.getElementById('chainDisplay');
  if (!container) return;

  const blocks = store.get('blocks').slice(-8);

  container.innerHTML = blocks.map((b, i) => {
    const connector = i > 0
      ? '<div class="cb-connector">\u2192</div>'
      : '';

    const typeClass = b.type === 'genesis' ? 'gen' : b.type === 'mint' ? 'mint' : 'dist';
    const typeLabel = b.type === 'genesis' ? 'Genesis' : b.type === 'mint' ? 'Mint' : 'ROI Dist';

    return `${connector}
      <div class="chain-block${b.type === 'genesis' ? ' genesis' : ''}" style="animation-delay:${i * 0.1}s">
        <div class="cb-header">
          <span class="cb-num">#${b.number}</span>
          <span class="cb-type ${typeClass}">${typeLabel}</span>
        </div>
        <div class="cb-row"><span class="cb-label">Hash</span><span class="cb-val">${shortHash(b.hash)}</span></div>
        <div class="cb-row"><span class="cb-label">Prev</span><span class="cb-val">${shortHash(b.prevHash)}</span></div>
        <div class="cb-row"><span class="cb-label">Tx</span><span class="cb-val">${b.txCount}</span></div>
        <div class="cb-row"><span class="cb-label">Gas</span><span class="cb-val">${b.gasUsed} gwei</span></div>
      </div>`;
  }).join('');

  renderHashBar();
  updateTxCount();
}

// ── Hash Scrolling Bar ──
function renderHashBar() {
  const el = document.getElementById('hashScroll');
  if (!el) return;

  const blocks = store.get('blocks');
  const str = blocks.map(b => b.hash).join('  \u25CF  ');
  el.textContent = str + '  \u25CF  ' + str;
}

// ── Tx Count Badge ──
function updateTxCount() {
  const el = document.getElementById('txCount');
  if (el) el.textContent = store.get('transactions').length + ' transactions';
}

// ── Transaction Table ──
export function renderTxTable() {
  const tbody = document.getElementById('txTableBody');
  if (!tbody) return;

  const txs = store.get('transactions').slice(-10).reverse();

  tbody.innerHTML = txs.map(tx => {
    const isMint = tx.type === 'mint';
    const typeColor = isMint ? 'var(--emerald)' : 'var(--gold)';
    const typeLabel = isMint ? '\uD83E\uDE99 Mint' : '\uD83D\uDCCA Dist';
    const typeClass = isMint ? 'confirmed' : 'pending';

    return `<tr>
      <td><span class="tx-hash">${shortHash(tx.hash)}</span></td>
      <td>#${tx.block}</td>
      <td style="font-family:var(--font-mono);font-size:10px">${shortAddr(tx.from)}</td>
      <td><span class="tx-status ${typeClass}">${typeLabel}</span></td>
      <td style="font-weight:600;color:${typeColor}">${formatRupiah(tx.amount)}</td>
      <td><span class="tx-status confirmed">\u2713 Confirmed</span></td>
      <td style="color:var(--tx-dim)">${tx.timestamp}</td>
    </tr>`;
  }).join('');
}

// ── Subscribe to state changes ──
export function initExplorer() {
  store.on('change:blocks', () => {
    renderChain();
    renderTxTable();
  });
}
