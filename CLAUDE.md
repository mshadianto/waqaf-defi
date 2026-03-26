# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**WaqFi** is a blockchain-based Islamic fintech platform that tokenizes different types of Islamic endowments (Wakaf) on Polygon (Ethereum L2). Built as a Proof of Concept for Hackathon DIGDAYA 2026. Primary language of content is Indonesian.

The platform supports four pillars of wakaf tokenization:
1. Wakaf Aset Tetap (Fixed Asset) — land, buildings, properties
2. Wakaf Uang (Cash Wakaf) — sukuk-backed instruments
3. Wakaf Melalui Uang (Crowdfunding) — community fundraising for assets
4. Wakaf Usaha Produktif (Productive Business) — agriculture, retail, manufacturing

## Development

### Frontend (static site)
```bash
npx serve .
# needs a local server for ES module imports — file:// won't work
```

### Smart Contract
```bash
npm install              # install Hardhat, OpenZeppelin, ethers
npx hardhat compile      # compile contracts
npx hardhat test         # run 18 tests (all passing)
npx hardhat run scripts/deploy.js --network amoy   # deploy to Polygon Amoy
npx hardhat verify --network amoy <CONTRACT_ADDR>   # verify on Polygonscan
```

Environment variables (`.env`, not committed):
```
DEPLOYER_PRIVATE_KEY=0x...
ETHERSCAN_API_KEY=...
```

## Deployed Contract

| Item | Detail |
|------|--------|
| Address | `0x8C6D7f1bE4BDECaB43d5FD07057733b37753cc25` |
| Network | Polygon Amoy Testnet (Chain ID 80002) |
| Token | WaqFi Token (WAQF) — ERC-20 |
| Verified | Polygonscan + Sourcify |
| Explorer | https://amoy.polygonscan.com/address/0x8C6D7f1bE4BDECaB43d5FD07057733b37753cc25#code |

On-chain seed data: 4 projects (all pillars), 500 WAQF minted, 3 beneficiaries registered.

## Architecture

### Smart Contract (`contracts/WaqfToken.sol`)

Solidity ^0.8.20, ERC-20 + AccessControl + ReentrancyGuard (OpenZeppelin).

**Roles:**
- `DEFAULT_ADMIN_ROLE` — full admin (deployer)
- `NAZHIR_ROLE` — create projects, distribute ROI, manage beneficiaries
- `KYC_ADMIN_ROLE` — approve/revoke KYC status

**Core functions:**
- `mintWaqfToken(projectId, amount)` — KYC-gated, min 10,000 units, mints WAQF tokens
- `distributeROI(projectId)` payable — splits sent POL equally to all beneficiaries
- `createProject(name, pillar, nazhir)` — 4 pillar types enum
- `setKYCStatus(account, bool)` / `batchSetKYC(accounts[], bool)`
- `addBeneficiary(account)` / `removeBeneficiary(account)`
- `getContributions(wakif)` — returns contribution history array

**State flow:**
```
Wakif → setKYCStatus() → mintWaqfToken() → holds WAQF tokens
Nazhir → distributeROI{value: POL}() → beneficiaries receive POL
```

### Test Suite (`test/WaqfToken.test.js`)

18 tests covering: deployment, KYC, project management, minting validation, ROI distribution, beneficiary management, and end-to-end flow.

### Frontend — Modular Static Site

ES modules (no bundler). Entry: `js/app.js` via `<script type="module">`.

**CSS (`css/`):**

| File | Purpose |
|------|---------|
| `variables.css` | Design tokens — colors, spacing, typography, transitions, z-index |
| `base.css` | Reset, scrollbar, background layers, containers, section headers |
| `animations.css` | Keyframes, scroll-reveal (`.reveal`/`.reveal-scale`), hover utilities |
| `components.css` | All UI components |
| `pillar.css` | Pillar detail page styles (hero, project cards, calculator, benefits) |
| `responsive.css` | Breakpoints (1024/768/640px) + `prefers-reduced-motion` |

**JS (`js/`):**

| File | Purpose |
|------|---------|
| `config.js` | Constants — pilar names/colors, project names, seed data, amounts |
| `state.js` | Reactive state manager (`EventTarget`). Subscribe via `store.on('change:key', fn)` |
| `blockchain.js` | Simulation engine — `createGenesisBlock()`, `mineBlock()`, hash/address utils |
| `wallet.js` | Simulated wallet connection |
| `app.js` | Orchestrator — init, seed, auto-generate, cleanup |

**UI Modules (`js/ui/`):**

| File | Purpose |
|------|---------|
| `toast.js` | Toast notifications (success/warning/error/info) |
| `hero.js` | Hero blockchain visual |
| `explorer.js` | Chain display, hash bar, tx table. Subscribes to `change:blocks` |
| `dashboard.js` | KPI cards, impact meters. Subscribes to `change:totalWaqf/totalWakif/totalTokens` |
| `charts.js` | Bar chart (monthly) and donut chart (pilar distribution) |
| `mint.js` | Mint form + ROI distribution handlers |
| `scroll.js` | IntersectionObserver scroll-reveal, topbar effect, nav scroll |
| `txfeed.js` | Live transaction feed (prepend, auto-trim to 15) |

**Pillar Pages (`pillar/`):** 4 detail mockups (aset-tetap, wakaf-uang, melalui-uang, usaha-produktif) with project listings, calculators, how-it-works flows.

## Key Domain Concepts

- **Wakif** — donor/contributor who gives wakaf
- **Nazhir** — manager/administrator of wakaf assets
- **BWI** — Badan Wakaf Indonesia, the national regulatory body
- **Sharia compliance** governed by: UU No. 41/2004, Fatwa DSN-MUI No. 132, AAOIFI Standard No. 60
- Revenue comes from ROI fees (1-2%), not from donor principal
