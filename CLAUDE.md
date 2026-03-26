# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**WaqFi** is a blockchain-based Islamic fintech platform that tokenizes different types of Islamic endowments (Wakaf) on Polygon (Ethereum L2). Built as a Proof of Concept for Hackathon DIGDAYA 2026. Primary language of content is Indonesian.

The platform supports four pillars of wakaf tokenization:
1. Wakaf Aset Tetap (Fixed Asset) — land, buildings, properties
2. Wakaf Uang (Cash Wakaf) — sukuk-backed instruments
3. Wakaf Melalui Uang (Crowdfunding) — community fundraising for assets
4. Wakaf Usaha Produktif (Productive Business) — agriculture, retail, manufacturing

## Current State

The project is a **single-file PoC demo** (`waqfi-platform.html`, ~76 KB) — a self-contained HTML/CSS/JS application that simulates the full platform including smart contract interactions, blockchain mining, token minting, ROI distribution, and analytics dashboards. There is no build system, package manager, or test framework yet.

## Planned Production Architecture

### Smart Contracts (Solidity ^0.8.20, Polygon L2)
- **WaqfToken.sol** — ERC-1400 security token with KYC-gated minting (min Rp 10,000)
- **WaqfFactory.sol** — Factory pattern for creating waqf projects
- **ComplianceModule.sol** — Sharia compliance enforcement (AAOIFI No. 60, Fatwa DSN-MUI No. 132)
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

## Key Domain Concepts

- **Wakif** — donor/contributor who gives wakaf
- **Nazhir** — manager/administrator of wakaf assets
- **BWI** — Badan Wakaf Indonesia, the national regulatory body
- **Sharia compliance** governed by: UU No. 41/2004, Fatwa DSN-MUI No. 132, AAOIFI Standard No. 60
- Revenue comes from ROI fees (1-2%), not from donor principal
