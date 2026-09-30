# LinkedIn Clone - Setup & Installation Guide

This guide walks you through setting up and running **LinkedIn Clone** on your local machine.

---

## 1. System Requirements

- **Node.js**: `v18.x` or `v20.x` or higher
- **npm**: `v9.x` or higher
- **Operating System**: Windows, macOS, or Linux
- **Git** (optional, for version control)

---

## 2. Project Architecture Overview

```
Linkedin_Clone/
├── client/          # React 18 + Vite + TypeScript + Tailwind CSS Frontend
├── server/          # Node.js + Express + TypeScript + Prisma ORM + PostgreSQL Backend
├── docs/            # Architecture, Database, API, and Viva guides
├── .env.example     # Root environment variable template
└── package.json     # Root orchestrator scripts
```

---

## 3. Quick Start (Zero-Setup Local Dev)

The backend includes an embedded PostgreSQL runner that automatically configures and runs a local PostgreSQL 18 instance with full UTF-8 support on port `5433`. No manual PostgreSQL installation is required!

### Step 1: Install Dependencies
From the repository root:
```bash
npm run install:all
```
*(Or install in each directory individually: `npm install` in root, `cd server && npm install`, and `cd client && npm install`)*

---

### Step 2: Configure Environment Variables

1. Copy `.env.example` in `server/` to `.env`:
   ```bash
   cp server/.env.example server/.env
   ```
2. Verify default settings:
   ```ini
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   DATABASE_URL="postgresql://postgres:postgres@localhost:5433/linkedin_db?schema=public"
   JWT_SECRET=linkedin_clone_super_secure_jwt_secret_token_dev_2026
   JWT_EXPIRES_IN=7d
   ```

*(If you prefer using a hosted PostgreSQL database such as **Neon**, **Supabase**, or **Railway**, simply replace `DATABASE_URL` with your remote connection string).*

---

### Step 3: Setup & Seed the Database

Run the database setup script to initialize the UTF-8 database, generate the Prisma Client, push schema tables, and populate seed data:

```bash
cd server
npm run db:setup
```

This populates the database with:
- **20 User Profiles** across various tech and business roles.
- **18 Skills** (React, TypeScript, Node.js, PostgreSQL, Docker, etc.).
- **66 Realistic Connections** and pending invitation states.
- **30 Posts** with tags, likes, and comments.
- **5 Professional Groups** (Web Dev, AI, Cyber Security, etc.).
- **6 Tech Opportunities** (Internships, Junior/Senior Engineering roles).
- Active conversation histories and notification queues.

#### Demo Credentials for Testing
| Account | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Primary Demo** | `alex.rivera@example.com` | `Password123!` | Full Stack Engineer |
| **Secondary Demo** | `sarah.chen@example.com` | `Password123!` | Senior AI Researcher |
| **Product Demo** | `marcus.vance@example.com` | `Password123!` | Principal Architect |

---

### Step 4: Run the Application

You can run both client and server from the root directory or separately in two terminal windows:

#### Terminal 1 (Backend API & Socket.IO):
```bash
cd server
npm run dev
```
- **Backend API**: `http://localhost:5000`
- **Interactive Swagger Docs**: `http://localhost:5000/api-docs`

#### Terminal 2 (Frontend Client):
```bash
cd client
npm run dev
```
- **Client Application**: `http://localhost:5173`

---

## 4. Running Automated Tests

Run backend integration tests using Vitest:
```bash
cd server
npm test
```
This runs 21 comprehensive integration tests covering:
- User registration & duplicate email rejection.
- Password strength validation.
- JWT cookie issuing and authentication middleware.
- Post creation, editing, and deletion authorization.
- Scalable reactions (`LIKE`, `CELEBRATE`, `LOVE`, etc.) toggle logic.
- Comments and nested replies.
- Connection requests, rejection, acceptance, and self-connection prevention.
- Feed-ranking deterministic scoring calculation.
- Jaccard similarity skill discovery.
- Opportunity matching calculation.

---

## 5. Building for Production

### Server Build:
```bash
cd server
npm run build
```
Compiles TypeScript into `server/dist/`.

### Client Build:
```bash
cd client
npm run build
```
Bundles production assets into `client/dist/` using Vite.
