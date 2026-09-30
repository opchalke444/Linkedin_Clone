# 🇮🇳 LinkedIn Clone — Full-Stack Professional Networking Platform

![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-6.4-2D3748?logo=prisma)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?logo=socket.io)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)
![Vitest](https://img.shields.io/badge/Tests-21%20Passed-brightgreen?logo=vitest)

An authentic, production-grade full-stack **LinkedIn Clone** featuring a true-to-spec LinkedIn interface, built-in **Day & Night Mode**, real-time messaging, post interactions, network discovery, job matching algorithms, and pre-seeded with **21 Indian Tech Industry Personas**.

---

## ✨ Key Features & Capabilities

### 1. 🌓 Day / Night Mode (Complete Theme System)
- **Persistent Theme Engine**: Smoothly transitions between LinkedIn Light (`#f3f2ef` canvas / `#0a66c2` primary) and LinkedIn Dark (`#1d2226` canvas / `#23272c` cards / `#383b40` borders / `#70b5f9` accent).
- **Universal Toggle Controls**: Accessible anywhere via desktop top navbar, mobile drawer, landing page header, auth pages, and dedicated account display settings.
- **LocalStorage Sync**: Remembers user preference across sessions and respects system preference by default.

### 2. 📰 Authentic 3-Column LinkedIn Feed
- **Create Post Modal**: Rich post creator supporting text, image URLs, media preview, and visibility settings.
- **Micro-Animated Reactions**: Floating hover reaction bar with 5 LinkedIn reactions (👍 Like, 👏 Celebrate, 🤝 Support, ❤️ Love, 💡 Insightful).
- **Nested Comment Threads**: Real-time comments with reply counters, author profile avatars, and delete authorization.
- **Smart Feed Ranking**: Content-aware algorithm sorting posts by recency, connection degree, and engagement weight.

### 3. 💬 Real-Time Socket.IO Messaging
- Instant 1-on-1 direct messaging between connections with zero page refresh.
- Real-time online/offline presence indicators.
- Live typing status ("typing...") and persistent conversation history in PostgreSQL.

### 4. 🧠 Skill-Based Network Discovery
- Discovers "People You May Know" using the **Jaccard Similarity Index** over technical skills:
  $$\text{Similarity}(A, B) = \frac{|S_A \cap S_B|}{|S_A \cup S_B|}$$
- Highlights mutual skills pills (e.g., `React`, `TypeScript`, `Kafka`, `Go`, `Kubernetes`) and mutual connection counts with instant connection requests (`PENDING` / `ACCEPTED`).

### 5. 🎯 Opportunity & Job Matching Engine
- Matches professionals to tech jobs across Bengaluru, Mumbai, Hyderabad, Pune, and Delhi NCR using **Rule-Based Skill Overlap**:
  $$\text{Match} = \min\left(100, \left\lfloor \frac{|S_{\text{user}} \cap R_{\text{opportunity}}|}{|R_{\text{opportunity}}|} \times 100 \right\rfloor \right)$$
- Displays matching skills (green) vs skills to acquire (dashed outline) with salary ranges in ₹ LPA and one-click "Easy Apply".

### 6. 👤 Comprehensive Member Profiles
- Banner image, profile photo, headline, current position, location, industry, and about summary.
- Work experience timelines with company, role, dates, and descriptions.
- Education records with degrees and fields of study.
- Technical skills with endorsement counters and modal management.

---

## 📐 Architecture & Technology Stack

```mermaid
graph TD
    Client["React 18 + Vite (Port 5173)"]
    subgraph "Frontend Layer"
        Client --> State["React Context (Auth, Theme, Socket, Toast)"]
        State --> UI["Tailwind CSS (Dark Mode) + Lucide Icons"]
    end

    Client -->|REST API / JSON| Router["Express.js Server (Port 5000)"]
    Client <-->|WebSockets (Socket.IO)| SocketServer["Socket.IO Server"]

    subgraph "Backend Layer"
        Router --> AuthMW["JWT & Zod Validation Middleware"]
        AuthMW --> Controllers["Controllers (HTTP Handlers)"]
        Controllers --> Services["Services (Business Logic & Jaccard Engine)"]
        SocketServer --> Services
    end

    subgraph "Database & Storage Layer"
        Services --> Prisma["Prisma ORM Client"]
        Prisma --> Postgres[("PostgreSQL 18 Database (Port 5433)")]
    end
```

| Layer | Technologies | Role & Highlights |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite 6, TypeScript, Tailwind CSS, Lucide | LinkedIn UI, Day/Night toggle, client router |
| **Backend** | Node.js 20+, Express.js 4.21, TypeScript | Layered clean architecture, RESTful API |
| **Database** | PostgreSQL 18, Prisma ORM 6.4 | Embedded zero-config runner on port 5433 |
| **Real-Time** | Socket.IO 4.8 | Live chat, typing status, presence, notification dispatch |
| **Security** | JWT, bcryptjs, Zod validation | Strict input sanitization and password hashing |
| **Testing** | Vitest 3.0, Supertest | 21 automated integration tests passing |

---

## 🏁 Quickstart Guide

### 1. Prerequisites
- **Node.js** `v18.x` or `v20.x+`
- **npm** `v9.x+`

### 2. Clone & Install
```bash
git clone https://github.com/yourusername/Linkedin_Clone.git
cd Linkedin_Clone

# Install root, client, and server dependencies
npm run install:all
```

### 3. Initialize & Seed Database (One Command)
LinkedIn Clone embeds a self-managed PostgreSQL server on port `5433`. No external PostgreSQL install or Docker required!
```bash
npm run db:setup
```
*This command starts embedded PostgreSQL, applies Prisma schema, and populates 21 Indian tech profiles, 77 connections, 19 posts, 5 groups, 6 job listings, and message threads.*

### 4. Start Full-Stack Application
```bash
npm run dev
```
Both services will boot concurrently:
- 💻 **Frontend Web App**: [http://localhost:5173](http://localhost:5173)
- ⚡ **Backend API Server**: [http://localhost:5000](http://localhost:5000)
- 📚 **Swagger API Docs**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

---

## 👥 Demo Test Personas

All 21 demo accounts share the password: **`Password123!`**  
Detailed biographies and testing scenarios are documented in [DEMO_CREDENTIALS.md](file:///c:/Users/User/Desktop/Linkedin_Clone/DEMO_CREDENTIALS.md).

| Name | Email | Company & Role | City | Focus |
| :--- | :--- | :--- | :--- | :--- |
| **Aarav Sharma** | `aarav.sharma@example.com` | Swiggy • Principal Software Architect | Bengaluru | High-Scale Distributed Systems, Go, Kafka |
| **Priya Patel** | `priya.patel@example.com` | CRED • Staff Frontend Engineer | Mumbai | React, TypeScript, Design Systems |
| **Rohan Verma** | `rohan.verma@example.com` | Microsoft IDC • Staff AI/ML Engineer | Hyderabad | Generative AI, Multilingual LLMs, Python |
| **Ananya Iyer** | `ananya.iyer@example.com` | PhonePe • Cloud Security Lead | Pune | DevSecOps, FinTech Security, Kubernetes |
| **Vikram Malhotra** | `vikram.malhotra@example.com` | ex-Zomato • VP of Engineering | Gurugram | Tech Leadership, Hypergrowth, Microservices |
| **Neha Sundaram** | `neha.sundaram@example.com` | Razorpay • Director of Product | Bengaluru | FinTech, UPI AutoPay, ONDC |
| **Rhea Chawla** | `rhea.chawla@example.com` | MakeMyTrip • Director of Talent Acquisition | New Delhi | Engineering Recruitment & Tech Hiring |

---

## 🧪 Automated Testing

Run the full integration test suite with Vitest:
```bash
npm test
```

**21 / 21 Integration Tests Passing:**
- User registration, duplicate email rejection, and password strength validation
- JWT generation and authenticated route guards
- Post creation, feed retrieval, and authorization
- Scalable reactions toggle logic (`LIKE`, `CELEBRATE`, `SUPPORT`, `LOVE`, `INSIGHTFUL`)
- Threaded comments & replies
- Connection requests (`PENDING`, `ACCEPTED`, `REJECTED`)
- Jaccard skill similarity & opportunity matching calculation

---

## 📁 Repository Structure

```
Linkedin_Clone/
├── client/                      # React Frontend Application
│   ├── src/
│   │   ├── api/                 # Axios HTTP client & API service modules
│   │   ├── components/
│   │   │   ├── common/          # Navbar, Footer, Modal, Button, Avatar, Badges
│   │   │   ├── feed/            # PostCard, CreatePostCard, ReactionPicker, Comments
│   │   │   ├── messaging/       # ConversationList, ChatWindow
│   │   │   ├── profile/         # EditProfileModal, ExperienceModal, SkillModal
│   │   │   └── opportunities/   # OpportunityCard
│   │   ├── contexts/            # ThemeContext, AuthContext, SocketContext, ToastContext
│   │   ├── layouts/             # AppLayout, AuthLayout
│   │   ├── pages/               # 14 distinct functional page views
│   │   ├── types/               # TypeScript interface and enum declarations
│   │   └── index.css            # Tailwind directives and dark mode canvas rules
│   ├── .env.example             # Client environment template
│   └── vite.config.ts           # Vite dev server with proxy to :5000
│
├── server/                      # Express Backend API Server
│   ├── prisma/
│   │   ├── schema.prisma        # Normalized 19-table PostgreSQL schema
│   │   └── seed.ts              # Rich seed script with 21 Indian tech profiles
│   ├── src/
│   │   ├── controllers/         # Request handling & HTTP status dispatch
│   │   ├── services/            # Business logic, Jaccard math & feed ranking
│   │   ├── routes/              # Express API route declarations
│   │   ├── middleware/          # Auth, Zod validation, Error handlers
│   │   ├── socket/              # Socket.IO real-time event pipeline
│   │   ├── db/                  # Embedded PostgreSQL launcher & setup runners
│   │   └── __tests__/           # Vitest integration tests
│   ├── .env.example             # Server environment template
│   └── package.json
│
├── docs/                        # Complete viva & architecture documentation
│   ├── architecture.md          # System architecture & viva defense guide
│   ├── database.md              # Database ER diagram & schema reference
│   ├── api.md                   # REST API catalog & Swagger specifications
│   ├── features.md              # Features & mathematical formulas breakdown
│   └── setup.md                 # Step-by-step installation guide
│
├── DEMO_CREDENTIALS.md          # Directory of all 21 pre-seeded accounts & scenarios
├── package.json                 # Cross-platform root scripts (concurrent dev)
├── README.md                    # Project master documentation
└── .env.example                 # Root environment configuration template
```

---

## 📜 Available NPM Scripts

| Command | Action |
| :--- | :--- |
| `npm run install:all` | Installs all dependencies across root, server, and client |
| `npm run db:setup` | Starts embedded PostgreSQL, pushes schema, and seeds test data |
| `npm run dev` | Runs both backend API and frontend Vite dev server concurrently |
| `npm run build` | Compiles TypeScript and bundles both backend and frontend |
| `npm test` | Runs the full backend integration test suite with Vitest |

---

## 🛡️ Security Best Practices

1. **No Plaintext Passwords**: Salted bcrypt hashing with 10+ rounds.
2. **Session Security**: JWT bearer token authentication with 7-day expiration.
3. **SQL Injection Defense**: Prisma ORM parameterized queries with strict relational typing.
4. **Input Validation**: Centralized Zod request schema validation on all mutation endpoints.
5. **Privacy Controls**: Password hashes and sensitive internal fields are omitted from all JSON responses.
