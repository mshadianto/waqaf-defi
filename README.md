# WaqFi — Wakaf DeFi: Platform Tokenisasi Wakaf Berbasis Blockchain

<p align="center">
  <strong>Berwakaf untuk Masa Depan, Memberdayakan Umat</strong><br>
  <em>Hackathon DIGDAYA 2026 — Universitas Tazkia</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Blockchain-Polygon_L2-8247E5?style=flat-square" alt="Polygon">
  <img src="https://img.shields.io/badge/Token-ERC--1400-10B981?style=flat-square" alt="ERC-1400">
  <img src="https://img.shields.io/badge/Sharia-AAOIFI_No.60-F59E0B?style=flat-square" alt="AAOIFI">
  <img src="https://img.shields.io/badge/Regulasi-DSN--MUI_No.132-3B82F6?style=flat-square" alt="DSN-MUI">
  <img src="https://img.shields.io/badge/Status-Proof_of_Concept-8B5CF6?style=flat-square" alt="PoC">
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

## Smart Contract

Smart contract utama menggunakan **ERC-1400** (Security Token Standard) dengan built-in compliance:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract WaqfToken is ERC1400 {
    struct WaqfProject {
        string name;
        uint8 pillarType;    // 1-4
        uint256 totalValue;
        uint256 totalTokens;
        address nazhir;
        bool shariaCompliant;
    }

    // KYC-verified minting dengan minimum Rp 10.000
    function mintWaqfToken(address _wakif, uint256 _projectId, uint256 _amount)
        external onlyKYCVerified(_wakif) { ... }

    // Distribusi ROI otomatis ke seluruh beneficiary
    function distributeROI(uint256 _projectId, uint256 _totalROI)
        external onlyNazhir { ... }
}
```

**Kontrak Pendukung:**
- `WaqfFactory.sol` — Factory pattern untuk membuat proyek wakaf baru
- `ComplianceModule.sol` — Enforcement kepatuhan syariah on-chain
- `ROIDistributor.sol` — Distribusi ROI proporsional otomatis

### Spesifikasi Token

| Parameter | Detail |
|-----------|--------|
| Token Name | WaqFi Token (WAQF) |
| Standard | ERC-1400 |
| Network | Polygon (Ethereum L2) |
| Minimum Mint | Rp 10.000 |
| Gas Fee | ~$0.01 per transaksi |
| Confirmation | ~2 detik |
| Audit Library | OpenZeppelin |

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

Saat ini WaqFi tersedia sebagai **interactive Proof of Concept** dalam satu file HTML (`waqfi-platform.html`). Demo ini mensimulasikan:

- Koneksi wallet blockchain
- Minting token wakaf dengan verifikasi KYC
- Distribusi ROI otomatis ke beneficiary
- Blockchain explorer dengan immutable audit trail
- Dashboard analytics real-time (KPI, chart, impact metrics)
- Visualisasi 4 pilar tokenisasi
- Auto-generate transaksi periodik

### Cara Menjalankan Demo

```bash
# Cukup buka file HTML di browser
open waqfi-platform.html

# Atau gunakan live server
npx serve .
```

---

## Tim Pengembang

| Nama | Peran | Afiliasi |
|------|-------|----------|
| **Dr. Yaser Taufik S.** | Ketua Tim | Universitas Tazkia |
| **MS. Hadianto, SE, Ak, MM** | Tech & AI Lead | [github.com/mshadianto](https://github.com/mshadianto) |
| **Asnan Purba, LC, MHI** | Sharia Compliance | Islamic Law Expert |
| **Ronal Rulindo, PhD** | Research Lead | Academic Research |
| **M. Ichsan Junaedi** | Dev Engineer | [github.com/IchsanJunaedi](https://github.com/IchsanJunaedi) |

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Blockchain | Polygon (Ethereum L2), Solidity ^0.8.20, ERC-1400, OpenZeppelin |
| Backend | Node.js, Go, PostgreSQL, Redis, RabbitMQ, IPFS |
| Frontend | Next.js, TypeScript, React Native |
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
