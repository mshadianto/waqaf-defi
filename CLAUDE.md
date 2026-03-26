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

No build system or package manager — pure static HTML/CSS/JS served directly. To run locally:

```bash
npx serve .
# or open index.html in browser (needs a local server for ES module imports)
```

There are no tests, linters, or CI pipelines.

## Architecture

The PoC demo is a **modular static site** using ES modules (no bundler). The original monolithic file is kept as `waqfi-platform.html` for reference.

### CSS (`css/`)

| File | Purpose |
|------|---------|
| `variables.css` | Design tokens — colors, spacing, typography, transitions, z-index scale |
| `base.css` | Reset, scrollbar, background layers, containers, section headers |
| `animations.css` | Keyframes, scroll-reveal classes (`.reveal`/`.reveal-scale`), hover utilities |
| `components.css` | All UI components — topbar, hero, pillar cards, smart contract demo, explorer, dashboard, charts, compliance, architecture, tokenomics, roadmap, revenue, team, toasts, footer |
| `responsive.css` | Breakpoints (1024/768/640px) + `prefers-reduced-motion` |

### JavaScript (`js/`)

All files are ES modules (`import`/`export`). Entry point: `js/app.js` (loaded via `<script type="module">`).

| File | Purpose |
|------|---------|
| `config.js` | Constants — pilar names/colors, project names, seed data, amounts, intervals |
| `state.js` | Reactive state manager extending `EventTarget`. Modules subscribe via `store.on('change:key', handler)`. Single `store` singleton. |
| `blockchain.js` | Blockchain simulation engine — `createGenesisBlock()`, `mineBlock()`, hash/address generation, `formatRupiah()` |
| `wallet.js` | Simulated wallet connection |
| `app.js` | Orchestrator — initializes all modules, seeds demo data, runs auto-generate interval, handles cleanup |

### UI Modules (`js/ui/`)

| File | Purpose |
|------|---------|
| `toast.js` | Toast notification system (success/warning/error/info) with auto-dismiss |
| `hero.js` | Hero section blockchain visual |
| `explorer.js` | Chain block display, hash scroll bar, transaction table. Subscribes to `change:blocks`. |
| `dashboard.js` | KPI cards, impact meters. Subscribes to `change:totalWaqf/totalWakif/totalTokens`. |
| `charts.js` | Bar chart (monthly collection) and donut chart (pilar distribution) |
| `mint.js` | Mint token form handler + ROI distribution. Updates state, triggers toasts. |
| `scroll.js` | IntersectionObserver for scroll-reveal, topbar scroll effect, nav smooth scroll |
| `txfeed.js` | Live transaction feed (prepend messages, auto-trim to 15) |

### State Flow

```
User action / auto-generate
  → mineBlock() writes to store
  → store dispatches change:blocks, change:totalWaqf, etc.
  → explorer, dashboard, charts re-render via subscriptions
```

## Key Domain Concepts

- **Wakif** — donor/contributor who gives wakaf
- **Nazhir** — manager/administrator of wakaf assets
- **BWI** — Badan Wakaf Indonesia, the national regulatory body
- **Sharia compliance** governed by: UU No. 41/2004, Fatwa DSN-MUI No. 132, AAOIFI Standard No. 60
- Revenue comes from ROI fees (1-2%), not from donor principal

## Planned Production Architecture

### Smart Contracts (Solidity ^0.8.20, Polygon L2)
- **WaqfToken.sol** — ERC-1400 security token with KYC-gated minting (min Rp 10,000)
- **WaqfFactory.sol** — Factory pattern for creating waqf projects
- **ComplianceModule.sol** — Sharia compliance enforcement
- **ROIDistributor.sol** — Automated proportional ROI distribution

### Backend Microservices
- User Service (Node.js), Token Service (Go), Waqf Service (Node.js), Payment Service, Analytics Service, KYC Service
- PostgreSQL + Redis + RabbitMQ + IPFS

### Frontend
- Next.js + TypeScript (web), React Native (mobile)
- Three portals: Wakif Dashboard, Nazhir Portal, BWI Monitor

### External Integrations
- Payment: Xendit, Midtrans, QRIS
- KYC: VIDA, PrivyID
- Banking: BSI, Muamalat API
- Regulator: BWI (Badan Wakaf Indonesia)
