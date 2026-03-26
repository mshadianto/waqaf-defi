/*═══════════════════════════════════════════════════════════════
  WaqFi — Blockchain Simulation Engine
  Creates blocks, mines transactions, maintains chain integrity.
═══════════════════════════════════════════════════════════════*/

import { store } from './state.js';

// ── Crypto Helpers ──
function randomHex(len) {
  const chars = '0123456789abcdef';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[(Math.random() * 16) | 0];
  return out;
}

export function generateHash()    { return '0x' + randomHex(64); }
export function generateAddress() { return '0x' + randomHex(40); }
export function shortHash(h)      { return h.slice(0, 10) + '...' + h.slice(-6); }
export function shortAddr(a)      { return a.slice(0, 8) + '...' + a.slice(-4); }

// ── Number Formatting ──
export function formatRupiah(num) {
  if (num >= 1e12) return 'Rp ' + (num / 1e12).toFixed(1) + 'T';
  if (num >= 1e9)  return 'Rp ' + (num / 1e9).toFixed(1)  + 'M';
  if (num >= 1e6)  return 'Rp ' + (num / 1e6).toFixed(1)  + 'Jt';
  return 'Rp ' + num.toLocaleString('id-ID');
}

// ── Genesis Block ──
export function createGenesisBlock() {
  const block = {
    number:    0,
    hash:      generateHash(),
    prevHash:  '0x' + '0'.repeat(64),
    timestamp: Date.now(),
    type:      'genesis',
    data:      { message: 'WaqFi Genesis — Bismillah' },
    txCount:   0,
    gasUsed:   '0',
  };

  store.set('blocks', [block]);
  store.set('blockHeight', 0);
  return block;
}

// ── Mine a New Block ──
export function mineBlock(txType, txData) {
  const blocks      = store.get('blocks');
  const prevBlock   = blocks[blocks.length - 1];
  const blockHeight = store.get('blockHeight') + 1;

  const block = {
    number:    blockHeight,
    hash:      generateHash(),
    prevHash:  prevBlock.hash,
    timestamp: Date.now(),
    type:      txType,
    data:      txData,
    txCount:   1,
    gasUsed:   ((Math.random() * 50_000) + 21_000).toFixed(0),
  };

  const tx = {
    hash:      generateHash(),
    block:     blockHeight,
    from:      txData.from || generateAddress(),
    to:        txData.to   || '0xWaqfContract',
    type:      txType,
    amount:    txData.amount || 0,
    status:    'confirmed',
    timestamp: new Date().toLocaleTimeString('id-ID'),
    pilar:     txData.pilar   || 0,
    project:   txData.project || '',
  };

  // Batch update — single event
  store.set({
    blocks:       [...blocks, block],
    blockHeight:  blockHeight,
    transactions: [...store.get('transactions'), tx],
  });

  return { block, tx };
}
