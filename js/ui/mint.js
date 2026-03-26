/*═══════════════════════════════════════════════════════════════
  WaqFi — Mint & ROI Distribution Interactions
═══════════════════════════════════════════════════════════════*/

import { store } from '../state.js';
import { mineBlock, generateAddress, shortHash, formatRupiah } from '../blockchain.js';
import { PILAR_NAMES, MIN_WAQF_AMOUNT, TOKEN_UNIT } from '../config.js';
import { addTxFeed } from './txfeed.js';
import { toast } from './toast.js';

// ── Mint Token ──
export function mintToken() {
  const nameEl    = document.getElementById('wakifName');
  const pilarEl   = document.getElementById('pilarSelect');
  const amountEl  = document.getElementById('waqfAmount');
  const projectEl = document.getElementById('projectSelect');
  const btn       = document.querySelector('.btn-mint');

  if (!nameEl || !pilarEl || !amountEl || !projectEl || !btn) return;

  const name    = nameEl.value.trim() || 'Anonymous';
  const pilar   = parseInt(pilarEl.value, 10);
  const amount  = parseInt(amountEl.value, 10);
  const project = projectEl.value;

  if (!amount || amount < MIN_WAQF_AMOUNT) {
    toast('error', 'Minimum Tidak Terpenuhi', `Minimum wakaf Rp ${MIN_WAQF_AMOUNT.toLocaleString('id-ID')}`);
    return;
  }

  btn.disabled = true;
  btn.classList.add('loading');

  addTxFeed(`\uD83D\uDD0D Verifying KYC for ${name}...`, 'var(--sapphire)');

  setTimeout(() => {
    addTxFeed('\u2705 KYC verified \u2014 Sharia compliance check passed', 'var(--emerald)');

    setTimeout(() => {
      const tokenCount = Math.floor(amount / TOKEN_UNIT);

      const { block, tx } = mineBlock('mint', {
        from:    store.get('walletAddress') || generateAddress(),
        to:      '0xWaqfToken',
        amount,
        pilar,
        project,
        wakif:   name,
        tokens:  tokenCount,
      });

      store.set({
        totalWaqf:   store.get('totalWaqf')   + amount,
        totalWakif:  store.get('totalWakif')   + 1,
        totalTokens: store.get('totalTokens')  + tokenCount,
      });

      renderMintResult(name, pilar, amount, tokenCount, block, tx);
      addTxFeed(`\uD83E\uDE99 Minted ${tokenCount} WAQF \u2192 ${name} | Block #${block.number}`, 'var(--gold)');
      toast('success', 'Token Minted!', `${tokenCount} WAQF \u2192 ${name}`);

      btn.disabled = false;
      btn.classList.remove('loading');
    }, 800);
  }, 600);
}

function renderMintResult(name, pilar, amount, tokenCount, block, tx) {
  const el = document.getElementById('mintResult');
  if (!el) return;

  el.innerHTML = `
    <div style="background:var(--bg-deep);border:1px solid var(--border-a);border-radius:8px;padding:16px;animation:fadeInScale .4s var(--ease-out)">
      <div style="color:var(--emerald);font-weight:700;font-size:14px;margin-bottom:10px">\u2705 Token Minted Successfully!</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px">
        <span style="color:var(--tx-dim)">Wakif:</span><span style="font-weight:600">${name}</span>
        <span style="color:var(--tx-dim)">Pilar:</span><span style="font-weight:600">${PILAR_NAMES[pilar]}</span>
        <span style="color:var(--tx-dim)">Amount:</span><span style="color:var(--emerald);font-weight:600">${formatRupiah(amount)}</span>
        <span style="color:var(--tx-dim)">Tokens:</span><span style="color:var(--gold);font-weight:600">${tokenCount} WAQF</span>
        <span style="color:var(--tx-dim)">Block:</span><span style="font-family:var(--font-mono);font-size:10px">#${block.number}</span>
        <span style="color:var(--tx-dim)">Tx Hash:</span><span style="font-family:var(--font-mono);font-size:10px;color:var(--sapphire)">${shortHash(tx.hash)}</span>
        <span style="color:var(--tx-dim)">Gas Used:</span><span style="font-family:var(--font-mono);font-size:10px">${block.gasUsed} gwei</span>
        <span style="color:var(--tx-dim)">Project:</span><span style="font-weight:600">${tx.project}</span>
      </div>
    </div>`;
}

// ── Distribute ROI ──
export function distributeROI() {
  if (store.get('totalTokens') === 0) {
    toast('warning', 'Belum Ada Token', 'Mint token wakaf terlebih dahulu sebelum distribusi ROI.');
    return;
  }

  const roiPercent    = (Math.random() * 5 + 3).toFixed(2);
  const totalROI      = Math.floor(store.get('totalWaqf') * parseFloat(roiPercent) / 100);
  const beneficiaries = Math.floor(Math.random() * 50) + 10;

  const { block, tx } = mineBlock('distribution', {
    from:    '0xROIDistributor',
    to:      'Multi-beneficiary',
    amount:  totalROI,
    pilar:   0,
    project: 'ROI Distribution Round #' + Math.floor(Math.random() * 100),
  });

  addTxFeed(
    `\uD83D\uDCCA ROI Distribution: ${formatRupiah(totalROI)} \u2192 ${beneficiaries} beneficiaries (${roiPercent}%)`,
    'var(--gold)',
  );

  const el = document.getElementById('mintResult');
  if (el) {
    el.innerHTML = `
      <div style="background:var(--bg-deep);border:1px solid rgba(245,158,11,0.2);border-radius:8px;padding:16px;animation:fadeInScale .4s var(--ease-out)">
        <div style="color:var(--gold);font-weight:700;font-size:14px;margin-bottom:10px">\uD83D\uDCCA ROI Distributed!</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px">
          <span style="color:var(--tx-dim)">Total ROI:</span><span style="color:var(--gold);font-weight:600">${formatRupiah(totalROI)}</span>
          <span style="color:var(--tx-dim)">ROI Rate:</span><span style="font-weight:600">${roiPercent}%</span>
          <span style="color:var(--tx-dim)">Beneficiaries:</span><span style="font-weight:600">${beneficiaries} orang</span>
          <span style="color:var(--tx-dim)">Block:</span><span style="font-family:var(--font-mono);font-size:10px">#${block.number}</span>
          <span style="color:var(--tx-dim)">Method:</span><span style="font-weight:600">Smart Contract Auto</span>
          <span style="color:var(--tx-dim)">Tx Hash:</span><span style="font-family:var(--font-mono);font-size:10px;color:var(--sapphire)">${shortHash(tx.hash)}</span>
        </div>
      </div>`;
  }

  toast('success', 'ROI Distributed', `${formatRupiah(totalROI)} to ${beneficiaries} beneficiaries`);
}
