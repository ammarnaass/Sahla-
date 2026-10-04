# 🏛️ Sahla Enterprise Architecture (المعمارية المؤسساتية لمنصة سهلة)

This document provides a comprehensive technical overview of the architecture of **Sahla (سهلة)** — the premier digital services platform for cybercafés, public writers, and stationery kiosks across Algeria's 58 Wilayas.

---

## 📑 Table of Contents
1. [Architectural Overview](#1-architectural-overview)
2. [Layered Design & Folder Structure](#2-layered-design--folder-structure)
3. [Role-Based Access Control (RBAC)](#3-role-based-access-control-rbac)
4. [Persistence & Data Layer](#4-persistence--data-layer)
5. [Real-Time Print Bridge (SSE)](#5-real-time-print-bridge-sse)
6. [Algerian Regulatory Compliance](#6-algerian-regulatory-compliance)
7. [API Specification](#7-api-specification)

---

## 1. Architectural Overview

Sahla adheres to **Clean Layered Architecture (Onion Architecture)** principles, establishing strict separation of concerns across presentation, routing, application services, domain models, and data persistence layers.

```mermaid
graph TD
    Client[📱 Client PWA / Mobile Web Browser]
    
    subgraph Infrastructure_Layer [Infrastructure & Entry]
        Entry[server.js - HTTP Bootstrap]
        Router[server/router.js - Request Dispatcher]
        Static[Static PWA Asset Server]
    end

    subgraph Middleware_Layer [Security & Validation Middleware]
        CORS[CORS & Security Headers]
        AuthGuard[RBAC Guard: SUPER_ADMIN | SHOP_ADMIN | STAFF]
    end

    subgraph Controller_Layer [Controllers]
        AuthCtrl[AuthController]
        ShopCtrl[ShopController]
        StaffCtrl[StaffController]
        WalletCtrl[WalletController]
        AdminCtrl[AdminController]
        PrintCtrl[PrintController]
    end

    subgraph Service_Layer [Business Logic & Domain Services]
        AuthSvc[AuthService]
        ShopSvc[ShopService]
        WalletSvc[WalletService]
        AdminSvc[AdminService]
        PrintSvc[PrintBridgeService]
    end

    subgraph Repository_Layer [Persistence & Repositories]
        UserRepo[UserRepository]
        ShopRepo[ShopRepository]
        WalletRepo[WalletRepository]
        DocRepo[DocumentRepository]
        Storage[(Atomic JSON Store / Prisma Aligned)]
    end

    Client --> Entry --> Router
    Router --> Static
    Router --> CORS --> AuthGuard
    AuthGuard --> AuthCtrl & ShopCtrl & StaffCtrl & WalletCtrl & AdminCtrl & PrintCtrl
    
    AuthCtrl --> AuthSvc
    ShopCtrl & StaffCtrl --> ShopSvc
    WalletCtrl --> WalletSvc
    AdminCtrl --> AdminSvc
    PrintCtrl --> PrintSvc
    
    AuthSvc & ShopSvc & WalletSvc & AdminSvc --> UserRepo & ShopRepo & WalletRepo & DocRepo
    UserRepo & ShopRepo & WalletRepo & DocRepo --> Storage
```

---

## 2. Layered Design & Folder Structure

```
Sahla/
├── public/                     # Client Presentation Layer (PWA UI)
│   ├── index.html              # Single-Page Application (HTML5, Modern CSS, Cairo 900)
│   ├── manifest.json           # Web App Manifest (PWA installable)
│   └── sw.js                   # Service Worker (Offline caching & PWA)
│
├── server/                     # Core Backend Application
│   ├── config/
│   │   └── constants.js        # National constants (58 Wilayas, Telecom operators, Roles)
│   ├── storage/
│   │   ├── jsonStore.js        # Atomic file-backed JSON persistence engine
│   │   └── data/               # Persistent data collections (users, shops, ledger, cards)
│   ├── repositories/
│   │   ├── userRepository.js   # User data access & identity queries
│   │   ├── shopRepository.js   # Shop data access, points, & staff management
│   │   ├── walletRepository.js # Ledger history & scratch cards redemption
│   │   └── documentRepository.js # Documents with Law 18-07 auto-purge
│   ├── services/
│   │   ├── authService.js      # Phone normalization, operator detection, OTP verify
│   │   ├── shopService.js      # Shop lifecycle & staff delegation
│   │   ├── walletService.js    # Edahabia/BaridiMob e-pay & scratch card PINs
│   │   ├── adminService.js     # Super Admin 58-Wilaya aggregation & control
│   │   └── printBridgeService.js # Server-Sent Events (SSE) wireless printer engine
│   ├── middleware/
│   │   ├── cors.js             # CORS & XSS/Security Headers
│   │   └── authGuard.js        # Session verification & role authorization
│   ├── controllers/
│   │   ├── authController.js   # /api/auth/* endpoints
│   │   ├── shopController.js   # /api/shops/* endpoints
│   │   ├── staffController.js  # /api/shop/staff/* endpoints
│   │   ├── walletController.js # /api/wallet/* endpoints
│   │   ├── adminController.js  # /api/admin/* endpoints
│   │   └── printController.js  # /api/send-print & /events endpoints
│   └── router.js               # Central HTTP request routing & static file handler
│
├── prisma/
│   └── schema.prisma           # Enterprise PostgreSQL database schema
├── server.js                   # Lightweight application entrypoint & bootstrap
├── package.json                # Project manifest & run scripts
└── ARCHITECTURE.md             # This document
```

---

## 3. Role-Based Access Control (RBAC)

The platform enforces a strict three-tier role hierarchy:

| Role | Default Test Account | Primary Responsibilities | Scope of Access |
| :--- | :---: | :--- | :--- |
| **👑 Super Admin (مدير النظام)** | `0550 00 00 00`<br>`OTP: 123456` | Platform administration, national statistics, distributor management | Full access to all 58 Wilayas, administrative topups, shop activation/suspension |
| **🛡️ Shop Admin (أدمن المحل)** | `0555 12 34 56`<br>`OTP: 123456` | Shop owner / registered public writer / kiosk manager | Shop ledger, financials, staff hiring/firing, printer binding, settings |
| **👤 Staff Member (موظف المحل)** | `0661 99 88 77`<br>`OTP: 123456` | Counter clerk, document designer, printer operator | Restricted exclusively to customer service & document generation. Forbidden from altering shop settings or ledger |

---

## 4. Persistence & Data Layer

1. **Atomic File-Backed Persistence**:
   - Implemented via `JsonStore`, guaranteeing data safety across restarts by writing to atomic `.tmp` files before renaming.
   - Collections stored in `server/storage/data/`:
     - `users.json`: Identity, phone, role, and shop associations.
     - `shops.json`: Shop profiles, wilaya codes, active status, and staff lists.
     - `ledger.json`: Immutable transaction log (`CREDIT`, `DEBIT`, `REFUND`).
     - `cards.json`: 16-digit scratch cards (`XXXX-XXXX-XXXX-XXXX`).
     - `documents.json`: Generated documents with customer records.

2. **Prisma ORM Alignment**:
   - The data models in `JsonStore` 100% reflect the PostgreSQL relational schema defined in `prisma/schema.prisma`.

---

## 5. Real-Time Print Bridge (SSE)

Sahla bridges mobile phones to counter desktop printers without third-party drivers:
- **Protocol**: HTTP Server-Sent Events (`GET /events?pin=XXXX`).
- **Mechanism**: The counter desktop computer opens an SSE connection with the shop's printer PIN. When a staff member hits "Print" from a smartphone or tablet, `POST /api/send-print` immediately streams the raw document payload to the desktop browser for zero-delay printing.

---

## 6. Algerian Regulatory Compliance

1. **Law 18-07 (حماية المعطيات ذات الطابع الشخصي)**:
   - Automated expiration and privacy controls preventing long-term retention of citizen identity records.
2. **Law 18-05 (التجارة الإلكترونية والدفع الإلكتروني)**:
   - Full compliance with Algerian e-commerce frameworks via reference-numbered transactions (`ALG-XXXXXX`) compatible with SATIM, BaridiMob, and Edahabia.
3. **58 Wilayas Administrative Coding**:
   - Canonical Algerian Wilaya numbering (01 Adrar to 58 El Menia).

---

## 7. API Specification

| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/otp/request` | Request OTP via SMS/WhatsApp | Public |
| `POST` | `/api/auth/otp/verify` | Verify OTP code & establish session | Public |
| `POST` | `/api/auth/logout` | Terminate session & clear cookies | Authenticated |
| `POST` | `/api/shops` | Register new shop | Authenticated |
| `GET` | `/api/shops/profile` | Get current shop profile | `SHOP_ADMIN` |
| `GET` | `/api/shop/staff` | List staff members for shop | `SHOP_ADMIN` |
| `POST` | `/api/shop/staff` | Add new staff member | `SHOP_ADMIN` |
| `DELETE` | `/api/shop/staff/:id` | Remove staff member & revoke access | `SHOP_ADMIN` |
| `GET` | `/api/wallet/ledger` | Get immutable ledger history | `SHOP_ADMIN` |
| `POST` | `/api/wallet/pay-gateway` | Electronic recharge (BaridiMob/Edahabia) | `SHOP_ADMIN` |
| `POST` | `/api/wallet/redeem-scratch` | Redeem 16-digit scratch card PIN | `SHOP_ADMIN` |
| `GET` | `/api/admin/overview` | Platform-wide KPIs & 58-Wilaya table | `SUPER_ADMIN` |
| `POST` | `/api/admin/shops/topup` | Administrative points topup (+50) | `SUPER_ADMIN` |
| `POST` | `/api/admin/shops/toggle` | Freeze or activate shop | `SUPER_ADMIN` |
| `GET` | `/events?pin=XXXX` | SSE printer connection stream | Counter PC |
| `POST` | `/api/send-print` | Dispatch print job to counter PC | Authenticated |
