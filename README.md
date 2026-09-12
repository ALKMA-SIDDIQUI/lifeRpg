# ⚔️ LIFE RPG — Turn Your Real Life Into A Game

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2018-blue.svg)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Three.js-cyan.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green.svg)](https://expressjs.com/)

> **LIFE RPG** is a production-ready, full-stack 3D gamified productivity web application where real-world discipline, assignments, workouts, and habits directly progress an interactive 3D virtual character. Built with high-fidelity cyber-RPG aesthetics, procedural Web Audio effects, non-linear leveling mathematics, persistent PostgreSQL storage, and robust JWT session security.

---

## 🌟 Highlights & Core Product Concept

Transform mundane daily routines into rewarding RPG progression:
- **"Complete DSA Graph Traversal"** $\rightarrow$ **+150 XP**, **+15 Intellect**, **+75 Gold**, streak advances, character levels up!
- **"Go to Gym (Chest & Arms)"** $\rightarrow$ **+80 XP**, **+10 Strength**, **+40 Gold**
- **"Read 20 Pages of System Design"** $\rightarrow$ **+40 XP**, **+8 Wisdom**, **+20 Gold**

### Key Capabilities
1. **Interactive 3D Visual Experience**:
   - **Hero Monolith**: 3D cyber crystal with orbiting rings, particles, and mouse parallax rendered using Three.js & React Three Fiber.
   - **3D Character Hub**: Interactive avatar adapting to player archetype (`Cyber Knight`, `Neon Sorcerer`, `Quantum Rogue`) and equipped visual themes (`Cyber Neon`, `Abyssal Void`, `Solar Flare`, `Emerald Matrix`).
   - **Graceful Degradation**: CSS holographic animations activate seamlessly if WebGL is unavailable on low-end mobile devices.
2. **Quadratic Non-Linear Progression Engine**:
   - Strictly enforced mathematical curve: $XP_{required}(L) = 25 \cdot L^2 + 75 \cdot L$.
   - Prevents linear grinding; each higher level reflects genuine sustained consistency.
3. **Ascension / Level-Up Celebration**:
   - Fullscreen celebration modal with particle cannons (`canvas-confetti`), golden holographic typography, stat boost summaries, and custom Web Audio brass fanfare.
4. **Persistent Calendar Streaks**:
5. **Virtual Economy & Equipment Vault**:
   - Spend earned Gold on relics, companions, interface themes, and profile badges with server-validated transactions and equip slots.
6. **Dark / Light Theme Engine**:
   - Seamless toggle between ☀ Light Mode and 🌙 Dark Mode with instant localStorage persistence, zero flicker, and high contrast semantic tokens.
7. **User Avatar & Profile Image Uploader**:
   - Upload, preview, replace, and remove custom profile photos with client & server-side validation (JPG, PNG, WEBP, <2MB), static serving, and PostgreSQL persistence.
8. **Zero-Latency Audio Synthesis**:
   - Web Audio API procedural sound synthesizer (quest chimes, level fanfares, metallic coin clinks, and UI blips) requiring zero external asset downloads.

---

## 🏗️ Architecture & Tech Stack

```
TechZypher/
├── backend/                  # Node.js + Express REST API
│   ├── src/
│   │   ├── db/              # PostgreSQL Pool, Schema DDL, and Seeder
│   │   ├── engine/          # Non-linear leveling & Streak engines
│   │   ├── middleware/      # JWT auth guard & centralized error handling
│   │   ├── routes/          # Auth, Tasks, Character, Shop, Inventory, Stats
│   │   └── index.js         # Express server entry point
│   ├── test/
│   │   └── api.test.js      # Automated 14-stage integration test suite
│   ├── .env.example
│   └── package.json
├── frontend/                 # React 18 + Vite + Tailwind CSS + Three.js
│   ├── src/
│   │   ├── components/
│   │   │   ├── canvas/      # 3D R3F Scenes (HeroScene3D, CharacterScene3D)
│   │   │   ├── common/      # Navbar, HUD badges
│   │   │   └── modals/      # LevelUpModal, QuestModal, AuthModal
│   │   ├── pages/           # LandingPage, Dashboard, QuestsPage, CharacterPage, ShopPage, InventoryPage
│   │   ├── services/        # API client & Web Audio Procedural Synthesizer
│   │   ├── App.jsx          # Root State Orchestrator
│   │   └── main.jsx
│   ├── index.html           # SEO metadata & cyberpunk fonts
│   └── package.json
├── package.json              # Workspace root scripts
├── .env.example              # Environment variables template
└── README.md
```

### Technology Pool
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Three.js, `@react-three/fiber`, `@react-three/drei`, `lucide-react`, `canvas-confetti`.
- **Backend**: Node.js, Express 4, `pg` (node-postgres), `bcryptjs`, `jsonwebtoken`, `cors`, `cookie-parser`, `dotenv`.
- **Database**: PostgreSQL 18 (Relational Schema with ACID transactions, foreign keys, and indexes).

---

## 🗄️ Relational Database Schema

```mermaid
erDiagram
    users ||--|| characters : owns
    users ||--o{ tasks : creates
    users ||--o{ task_history : logs
    users ||--o{ inventory : owns
    users ||--|| streaks : tracks
    items ||--o{ inventory : referenced_by

    users {
        int id PK
        string email UK
        string username UK
        string password_hash
        timestamp created_at
    }

    characters {
        int id PK
        int user_id FK
        string name
        string avatar_class
        int level
        int total_xp
        int gold
        int strength
        int intellect
        int wisdom
        int vitality
        string equipped_theme
        string equipped_badge
        string equipped_relic
    }

    tasks {
        int id PK
        int user_id FK
        string title
        string category
        string difficulty
        int xp_reward
        int gold_reward
        string attribute_reward
        int attribute_amount
        boolean is_completed
        date due_date
        timestamp created_at
    }

    items {
        int id PK
        string item_key UK
        string name
        string category
        int price
        string rarity
        jsonb attribute_bonus
    }

    inventory {
        int id PK
        int user_id FK
        int item_id FK
        boolean is_equipped
        timestamp acquired_at
    }

    streaks {
        int id PK
        int user_id FK
        int current_streak
        int max_streak
        date last_activity_date
    }
```

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ or v24+)
- [PostgreSQL](https://www.postgresql.org/) (Local service or cloud URL like Neon / Supabase)

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/yourusername/life-rpg.git
cd life-rpg

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
npm install
```

### 2. Environment Configuration
Copy the `.env.example` files:
```bash
# In backend/
cp backend/.env.example backend/.env
```

Review `backend/.env`:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/liferpg
DATABASE_SSL=false
JWT_SECRET=life_rpg_super_secret_cyber_jwt_key_2026_dev
CLIENT_ORIGIN=http://localhost:5173
```

### 3. Database Initialization & Migration
The backend includes automated scripts to bootstrap a local cluster or run migrations against an existing PostgreSQL instance:
```bash
# If using the local dedicated cluster:
npm run db:init

# Run schema migrations and catalog seed:
npm run db:migrate
```

### 4. Run the Full-Stack Application
From the project root:
```bash
npm run dev
```
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/api/health`

---

## 🧪 Automated Testing

Run the comprehensive 14-stage integration test suite:
```bash
cd backend
npm test
```

### Verified Test Cases
1. `GET /api/health` — PostgreSQL connection and uptime check
2. `POST /api/auth/register` — User creation, default character, initial 50 Gold, starter gear
3. Duplicate registration conflict rejection (`409 Conflict`)
4. `POST /api/auth/login` — Password hash comparison and JWT generation
5. `GET /api/auth/me` — Protected session verification
6. `POST /api/tasks` — Quest creation with dynamic difficulty scaling
7. `GET /api/tasks` — Category and difficulty filtering
8. `POST /api/tasks/:id/complete` — Non-linear XP calculation and Level 2 ascension
9. Duplicate completion prevention (`400 Bad Request`)
10. `GET /api/shop/items` — 17 catalog items with ownership flags
11. `POST /api/shop/buy` — Transactional Gold deduction & inventory record
12. Duplicate unique item purchase prevention
13. `PUT /api/character/equip` — Real-time theme & relic equipping
14. `GET /api/stats/dashboard` — Aggregated metrics and timeline verification

---

## 🎬 Demo Walkthrough Guide (90–180 Seconds)

To present a complete, flawless demonstration of the product:
1. **Landing Page (0–20s)**:
   - Interact with the 3D Hero Relic (rotate with cursor).
   - Scroll through **How It Works**, **Character Progression** (click Level 1, 5, 10, 20), **Quest Showcase**, **Rewards**, and **Streaks**.
2. **Character Creation (20–35s)**:
   - Click **"Start Journey"** $\rightarrow$ select **"New Character"**.
   - Input username `CyberVanguard`, choose `Cyber Knight`, and click **"Forge Character"**.
3. **Dashboard & 3D Avatar (35–55s)**:
   - Observe initial Level 1 status, 0/100 XP, 50 Gold, and interactive 3D viewport.
   - Click **"New Quest"** $\rightarrow$ Create *"Complete Graph Algorithms"* (Difficulty: `HARD` $\rightarrow$ 150 XP, 75 Gold, +15 Intellect).
4. **Quest Completion & Level-Up (55–85s)**:
   - Click **"Complete ➔"** on the quest card.
   - Experience the audio chime, XP bar surging past 100 XP, and the **LEVEL UP!** modal triggering with confetti blasts, 3D character spin, and bonus rewards.
   - Click **"Claim Glory & Continue"**.
5. **Shop & Equipment (85–120s)**:
   - Navigate to **Shop** tab. Observe updated Gold balance (225 G).
   - Purchase the **"Abyssal Void"** theme (100 G).
   - Navigate to **Inventory** tab $\rightarrow$ click **"Equip Gear"**.
   - Observe the theme update and character equipment slots update.
6. **Persistence Check (120–140s)**:
   - Refresh the page (F5) $\rightarrow$ confirm stats, equipped gear, and history remain intact.
   - Log out $\rightarrow$ log back in $\rightarrow$ confirm strict user data isolation.

---

## 🔒 Security & Data Integrity

- **Password Hashing**: Salted hashes generated via `bcryptjs`.
- **JWT Protection**: Tokens verified via middleware on all mutations.
- **SQL Injection Prevention**: 100% parameterized SQL queries (`$1, $2, ...`).
- **Server-Authoritative Economy**: XP, levels, gold, and purchases are strictly computed and verified on the server inside atomic database transactions (`BEGIN` / `COMMIT`). Client values are never trusted.

---

## 📄 License
This project is licensed under the MIT License.
