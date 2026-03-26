# WaqFi — Wakaf DeFi: Platform Tokenisasi Wakaf Berbasis Blockchain

<p align="center">
  <strong>Berwakaf untuk Masa Depan, Memberdayakan Umat</strong><br>
  <em>Hackathon DIGDAYA 2026 — Universitas Tazkia</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Blockchain-Polygon_L2-8247E5?style=flat-square" alt="Polygon">
  <img src="https://img.shields.io/badge/Token-ERC--20_(WAQF)-10B981?style=flat-square" alt="WAQF">
  <img src="https://img.shields.io/badge/Sharia-AAOIFI_No.60-F59E0B?style=flat-square" alt="AAOIFI">
  <img src="https://img.shields.io/badge/Regulasi-DSN--MUI_No.132-3B82F6?style=flat-square" alt="DSN-MUI">
  <img src="https://img.shields.io/badge/Status-Proof_of_Concept-8B5CF6?style=flat-square" alt="PoC">
</p>

<p align="center">
  <a href="https://mshadianto.github.io/waqaf-defi/"><strong>&#x1F680; Live Demo</strong></a> &nbsp;|&nbsp;
  <a href="https://amoy.polygonscan.com/address/0x8C6D7f1bE4BDECaB43d5FD07057733b37753cc25#code"><strong>&#x1F4DC; Verified Contract</strong></a>
</p>

---

## Tentang WaqFi

**WaqFi** adalah platform DeFi syariah pertama yang men-tokenisasi seluruh jenis wakaf — aset tetap, uang, melalui uang, dan usaha produktif — dengan transparansi 100% di blockchain Polygon. Platform ini membuka akses wakaf untuk **238 juta muslim Indonesia** dengan kontribusi minimum **Rp 10.000**.

### Masalah yang Diselesaikan

| Masalah | Solusi WaqFi |
|---------|-------------|
| Realisasi wakaf hanya Rp 800M dari potensi Rp 2.000T/tahun | Tokenisasi menurunkan barrier entry ke Rp 10.000 |
| 80% aset wakaf idle/tidak produktif | Smart contract otomatis mengelola & mendistribusikan ROI |
| Transparansi rendah, laporan manual | Immutable audit trail di blockchain, real-time monitoring |
| Akses terbatas, proses birokratis | Platform digital 24/7, e-KYC instan |

---

## 4 Pilar Tokenisasi

| Pilar | Nama | Deskripsi | Mekanisme |
|:-----:|------|-----------|-----------|
| 1 | **Wakaf Aset Tetap** | Tanah, bangunan, properti | Fractional token dari aset existing, ROI dari sewa/pengelolaan |
| 2 | **Wakaf Uang** | Instrumen keuangan syariah | Dana diinvestasikan di Sukuk/Deposito Syariah, pokok dijaga |
| 3 | **Wakaf Melalui Uang** | Crowdfunding aset baru | Dana terkumpul → beli aset → diwakafkan → tokenisasi |
| 4 | **Wakaf Usaha Produktif** | Pertanian, retail, manufaktur | Modal usaha produktif, profit sharing via smart contract |

---

## Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│  FRONTEND                                               │
│  React Native (Mobile) · Next.js + TypeScript (Web)     │
│  Wakif Dashboard · Nazhir Portal · BWI Monitor          │
├─────────────────────────────────────────────────────────┤
│  API GATEWAY                                            │
│  JWT Auth + RBAC · WAF + Rate Limiting                  │
│  REST + WebSocket · Load Balancer                       │
├─────────────────────────────────────────────────────────┤
│  MICROSERVICES                                          │
│  User Service (Node.js) · Token Service (Go)            │
│  Waqf Service (Node.js) · Payment Service               │
│  Analytics Service · KYC Service (VIDA)                 │
├─────────────────────────────────────────────────────────┤
│  BLOCKCHAIN — Polygon (Ethereum L2)                     │
│  WaqfFactory.sol · WaqfToken (ERC-1400)                 │
│  ComplianceModule.sol · ROIDistributor.sol              │
├─────────────────────────────────────────────────────────┤
│  DATA LAYER                                             │
│  PostgreSQL · Redis · RabbitMQ · IPFS · AWS/GCP + K8s   │
├─────────────────────────────────────────────────────────┤
│  INTEGRASI EKSTERNAL                                    │
│  Xendit/Midtrans (Payment) · VIDA/PrivyID (e-KYC)      │
│  BSI/Muamalat API (Banking) · BWI Reporting · QRIS      │
└─────────────────────────────────────────────────────────┘
```

---

## Smart Contract (Deployed & Verified)

Smart contract **WaqfToken** sudah **deployed dan verified** di Polygon Amoy Testnet:

| Item | Detail |
|------|--------|
| **Contract** | [`0x8C6D7f1bE4BDECaB43d5FD07057733b37753cc25`](https://amoy.polygonscan.com/address/0x8C6D7f1bE4BDECaB43d5FD07057733b37753cc25#code) |
| **Network** | Polygon Amoy Testnet (Chain ID: 80002) |
| **Token** | WaqFi Token (WAQF) — ERC-20 |
| **Verified** | [Polygonscan](https://amoy.polygonscan.com/address/0x8C6D7f1bE4BDECaB43d5FD07057733b37753cc25#code) + [Sourcify](https://repo.sourcify.dev/contracts/full_match/80002/0x8C6D7f1bE4BDECaB43d5FD07057733b37753cc25/) |
| **Test Suite** | 18 tests — all passing |

### Flow End-to-End On-Chain

```
Wakif ──→ setKYCStatus() ──→ mintWaqfToken() ──→ holds WAQF tokens
                                                        │
Nazhir ──→ distributeROI{value: POL}() ──→ beneficiaries receive POL
```

### Fungsi Utama

| Fungsi | Akses | Deskripsi |
|--------|-------|-----------|
| `mintWaqfToken(projectId, amount)` | KYC Wakif | Mint WAQF token, min Rp 10.000 |
| `distributeROI(projectId)` payable | Nazhir | Kirim POL, auto-split ke semua beneficiary |
| `createProject(name, pillar, nazhir)` | Nazhir | Buat proyek baru (4 pilar) |
| `setKYCStatus(account, bool)` | KYC Admin | Verifikasi identitas wakif |
| `addBeneficiary(account)` | Nazhir | Tambah penerima manfaat |
| `getContributions(wakif)` | Public | Riwayat kontribusi per wakif |

### Kode Smart Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract WaqfToken is ERC20, AccessControl, ReentrancyGuard {

    enum PillarType { AsetTetap, WakafUang, MelaluiUang, UsahaProduktif }

    struct WaqfProject {
        string name;
        PillarType pillar;
        uint256 totalRaised;
        uint256 totalTokensMinted;
        address nazhir;
        bool active;
    }

    // KYC-verified minting dengan minimum Rp 10.000
    function mintWaqfToken(uint256 projectId, uint256 amount)
        external nonReentrant { ... }

    // Distribusi ROI (native POL) ke semua beneficiary
    function distributeROI(uint256 projectId)
        external payable onlyRole(NAZHIR_ROLE) nonReentrant { ... }
}
```

### Spesifikasi Token

| Parameter | Detail |
|-----------|--------|
| Token Name | WaqFi Token (WAQF) |
| Standard | ERC-20 + AccessControl + ReentrancyGuard |
| Network | Polygon Amoy Testnet (L2) |
| Minimum Mint | Rp 10.000 (10,000 units) |
| Gas Fee | ~$0.01 per transaksi |
| Confirmation | ~2 detik |
| Library | OpenZeppelin Contracts |

### Data On-Chain (Seeded)

- 4 proyek wakaf (satu per pilar)
- 500 WAQF minted untuk Masjid Al-Ikhlas Jakarta
- 3 beneficiary terdaftar

---

## Kepatuhan Syariah & Regulasi

| Framework | Keterangan |
|-----------|------------|
| **AAOIFI Standard No. 60** | Standar internasional tentang Waqf |
| **Fatwa DSN-MUI No. 132** | Fatwa tentang Wakaf Uang |
| **UU No. 41/2004** | Undang-Undang Wakaf Indonesia |
| **PP No. 25/2020** | Peraturan Penyelenggaraan Perwakafan |
| **Waqf Core Principles** | Standar IsDB (Islamic Development Bank) |
| **KYC/AML** | e-KYC via VIDA/PrivyID + validasi NIK Dukcapil |

---

## Model Bisnis

| Revenue Stream | Detail | Catatan |
|---------------|--------|---------|
| Platform Fee | 1-2% dari ROI | Bukan dari dana wakif |
| Nazhir SaaS | Rp 500K-2M/bulan | Dashboard & analytics premium |
| Transaction Fee | Rp 1K-5K/tx | Biaya admin pencairan |
| White Label | Custom pricing | Lisensi untuk lembaga besar |
| Data Analytics | Per institusi | Layanan B2B |
| **Biaya Wakif** | **Rp 0 (Gratis)** | **Tidak membebani donatur** |

---

## Roadmap Pengembangan

| Fase | Periode | Milestone |
|------|---------|-----------|
| **1 — Foundation** | Bulan 1-2 | Dev environment, smart contract core, security audit, backend microservices, integrasi payment & KYC |
| **2 — MVP Launch** | Bulan 3-4 | Mobile app Wakif, Nazhir dashboard, QA testing, deploy Polygon testnet, UAT dengan partner nazhir |
| **3 — Pilot** | Bulan 5-6 | Onboarding 5 nazhir, 3 proyek perdana, deploy mainnet Polygon, monitoring & optimasi |
| **4 — Scale** | Bulan 7-12 | Pilar 3 & 4 launch, 50+ nazhir, integrasi LKS, Rp 10M+ terhimpun, marketing campaign |

---

## Demo PoC

WaqFi tersedia sebagai **interactive Proof of Concept** — modular static site dengan ES modules (tanpa build tool).

**Live demo:** [mshadianto.github.io/waqaf-defi](https://mshadianto.github.io/waqaf-defi/)

Fitur demo:
- Koneksi wallet blockchain (simulasi)
- Minting token wakaf dengan verifikasi KYC
- Distribusi ROI otomatis ke beneficiary
- Blockchain explorer dengan immutable audit trail
- Dashboard analytics real-time (KPI, chart, impact metrics)
- Toast notification system
- Scroll-reveal animations
- Responsive design (desktop, tablet, mobile)
- Auto-generate transaksi periodik

### Cara Menjalankan Lokal

```bash
# 1. Install dependencies
npm install

# 2. Frontend — local server (diperlukan untuk ES module imports)
npx serve .
# atau: python -m http.server 3000
# lalu buka http://localhost:3000

# 3. Smart contract — compile & test
npx hardhat compile
npx hardhat test                                    # 18 tests

# 4. Deploy ke Polygon Amoy (butuh .env dengan DEPLOYER_PRIVATE_KEY)
npx hardhat run scripts/deploy.js --network amoy

# 5. Verify di Polygonscan (butuh ETHERSCAN_API_KEY di .env)
npx hardhat verify --network amoy <CONTRACT_ADDRESS>
```

> **Catatan:** Buka langsung via `file://` tidak didukung karena browser memblokir ES module imports. Gunakan local server.

### Struktur Project

```
waqaf-defi/
├── contracts/
│   └── WaqfToken.sol       ← Smart contract (deployed & verified)
├── scripts/
│   └── deploy.js           ← Deploy + seed demo data
├── test/
│   └── WaqfToken.test.js   ← 18 tests (e2e flow)
├── hardhat.config.js       ← Hardhat config (Amoy network)
├── index.html              ← Frontend entry point
├── waqfi-platform.html     ← Original monolithic demo (legacy)
├── css/
│   ├── variables.css       ← Design tokens
│   ├── base.css            ← Reset & global styles
│   ├── animations.css      ← Keyframes & scroll-reveal
│   ├── components.css      ← All UI components
│   ├── pillar.css          ← Pillar detail page styles
│   └── responsive.css      ← Breakpoints & a11y
├── js/
│   ├── app.js              ← Entry point & orchestrator
│   ├── config.js           ← Constants & configuration
│   ├── state.js            ← Reactive state manager (EventTarget)
│   ├── blockchain.js       ← Simulation engine
│   ├── wallet.js           ← Wallet connection
│   └── ui/                 ← UI modules (toast, hero, explorer, ...)
├── pillar/
│   ├── aset-tetap.html     ← Pilar 1 mockup
│   ├── wakaf-uang.html     ← Pilar 2 mockup
│   ├── melalui-uang.html   ← Pilar 3 mockup
│   └── usaha-produktif.html← Pilar 4 mockup
├── README.md
└── CLAUDE.md
```

---

## Tim Pengembang

| Nama | Peran | Afiliasi |
|------|-------|----------|
| **Dr. Yaser Taufik S.** | Ketua Tim | Universitas Tazkia |
| **MS. Hadianto, SE, Ak, MM** | Tech & AI Lead | [github.com/mshadianto](https://github.com/mshadianto) |
| **H. Asnan Purba, Lc.M.Pd.I, CWC** | Sharia Compliance | Wakil Sekretaris ANI, Asesor BWI Pusat |
| **Ronal Rulindo, PhD** | Research Lead | Academic Research |
| **M. Ichsan Junaedi** | Dev Engineer | [github.com/IchsanJunaedi](https://github.com/IchsanJunaedi) |

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Smart Contract | Solidity ^0.8.20, Hardhat, OpenZeppelin, ERC-20 + AccessControl |
| Blockchain | Polygon Amoy Testnet (L2), deployed & verified on Polygonscan |
| Backend | Node.js, Go, PostgreSQL, Redis, RabbitMQ, IPFS |
| Frontend | Next.js, TypeScript, React Native |
| PoC Demo | Vanilla HTML/CSS/JS, ES Modules, EventTarget State |
| Infra | AWS/GCP, Kubernetes, Docker |
| Payment | Xendit, Midtrans, QRIS |
| KYC | VIDA, PrivyID, Dukcapil |
| Banking | BSI API, Muamalat API |

---

## Glosarium

| Istilah | Definisi |
|---------|----------|
| **Wakif** | Donatur/kontributor yang memberikan wakaf |
| **Nazhir** | Pengelola/administrator aset wakaf |
| **BWI** | Badan Wakaf Indonesia — regulator nasional |
| **Mauquf** | Harta/aset yang diwakafkan |
| **Mauquf 'Alaih** | Penerima manfaat wakaf |
| **ROI** | Return on Investment — hasil pengelolaan aset |

---

<p align="center">
  <strong>WaqFi</strong> — Wakaf DeFi Protocol<br>
  <sub>Polygon L2 · ERC-1400 · AAOIFI · DSN-MUI · BWI Ready</sub><br>
  <sub>&copy; 2026 WaqFi Team — Hackathon DIGDAYA 2026 | Universitas Tazkia</sub>
</p>
