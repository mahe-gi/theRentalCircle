# The Rental Circle

> **Human-Reviewed Residential Leasing Infrastructure for Hyderabad, India**  
> Direct owner-to-renter connections with utility bill verification, room-by-room photo inspection, and mutual contact privacy.

---

## Overview

**The Rental Circle** (`therentalcircle.in`) is a verification-first residential rental platform designed specifically for the Hyderabad market (Kondapur, Madhapur, Gachibowli, HITEC City, Manikonda, Financial District). It replaces broker spam, unverified listings, and invasive phone harvesting with human-reviewed property records and mutual acceptance workflows.

### Core Verification Pillars
- **Zero Role Bleeding & Strict RBAC**: Explicit boundaries between **Renters**, **Property Owners**, and **Platform Moderators (Trust Desk)**.
- **Mutual Contact Privacy**: Phone numbers remain encrypted at rest (`AES-256-GCM`) and are only revealed upon mutual application acceptance.
- **Utility & Connection Evidence**: Every listing undergoes administrative review of TSSPDCL / TGSPDCL electricity bills, GHMC records, and room-by-room photos before publishing live.
- **Real-Time Corridor Discovery**: Synchronized corridor filtering (`?cluster=kondapur`, `?cluster=madhapur`, `?q=...`) with instant response.

---

## Architecture and Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/) + TypeScript 5
- **Styling**: Tailwind CSS with bespoke *Electric City* design palette (Cobalt `#2547F5`, Midnight `#0B1537`, Verified Green `#0E6F4B`)
- **Database & ORM**: [Drizzle ORM](https://orm.drizzle.team/) with SQLite / Cloudflare D1 compatibility
- **Deployment**: [OpenNext Cloudflare](https://opennext.js.org/cloudflare) Workers & Cloudflare R2 object storage
- **Security & Cryptography**: Native Web Crypto API (`AES-256-GCM` with nonce uniqueness, HMAC-SHA256 blind indexing for phone deduplication)
- **Testing**: Node.js native test runner with `tsx` (`55 pass / 0 fail`)

---

## Quick Start

### 1. Installation
```bash
# Clone repository
git clone git@github.com:mahe-gi/theRentalCircle.git
cd theRentalCircle

# Install dependencies
npm install
```

### 2. Run Development Server
```bash
# Start local Next.js dev server
npm run dev

# Open in browser: http://localhost:3000
```

### 3. Run Verification & Tests
```bash
# Run TypeScript typecheck
npm run typecheck

# Run full test suite
npm test
```

---

## Key Personas and Roles

| Persona | Role | Key Portals & Permissions |
| :--- | :--- | :--- |
| **Ananya Sharma** | `RENTER` | Browse verified homes (`/homes`), send structured move-in applications, track requests (`/requests`), unlock WhatsApp contacts upon owner acceptance. |
| **Suresh Reddy** | `OWNER` | Manage properties (`/owner/listings`), list new homes via 6-step guided wizard (`/owner/listings/new`), review applicant profiles & accept/decline move-in requests. |
| **Platform Moderator** | `ADMIN` | Inspect submissions in Admin Moderation Queue (`/admin/listings`), audit room photos & TSSPDCL utility records (`/admin/listings/[id]`), approve or reject listings. |

---

## Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router (Pages, Layouts & API Routes)
│   │   ├── (public)/           # Homepage, /homes, /how-it-works, /safety, /privacy
│   │   ├── admin/              # Admin Moderation Queue & Evidence Inspector
│   │   ├── owner/              # Owner Property Management & Listing Wizard
│   │   ├── requests/           # Renter Applications & Unlocked Contacts
│   │   ├── sign-in/            # Tabbed Sign-In & Role-Gated Registration
│   │   └── api/                # REST endpoints for requests, listings, and media
│   ├── components/
│   │   ├── auth/               # RouteGuard RBAC wrapper
│   │   ├── layout/             # Scoped Navbar & Footer
│   │   └── listings/           # Listing Cards, Request Modals, and Actions
│   ├── db/                     # Drizzle ORM schema, queries, and D1 connection
│   ├── lib/                    # Web Crypto, Better-Auth, Session, and Data Store
│   └── middleware.ts           # Hostname routing matrix & security headers
├── drizzle/                    # SQL schema migrations
└── public/                     # Static brand assets & SVG logo mark
```

---

## License and Compliance

Compliant with India Digital Personal Data Protection (DPDP) Act 2023 principles for purpose limitation, data minimization, and secure cryptographic storage.
