/*═══════════════════════════════════════════════════════════════
  WaqFi — Wallet Connection Simulator
═══════════════════════════════════════════════════════════════*/

import { store } from './state.js';
import { generateAddress, shortAddr } from './blockchain.js';
import { toast } from './ui/toast.js';

export function connectWallet() {
  if (store.get('walletConnected')) return;

  const btn = document.querySelector('.btn-connect');
  if (!btn) return;

  btn.textContent = 'Connecting...';
  btn.disabled = true;

  setTimeout(() => {
    const address = generateAddress();

    store.set({
      walletConnected: true,
      walletAddress:   address,
    });

    btn.textContent = shortAddr(address);
    btn.classList.add('connected');
    btn.disabled = false;

    toast('success', 'Wallet Connected', `Address: ${shortAddr(address)}`);
  }, 1200);
}
