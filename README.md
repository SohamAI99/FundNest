
# FundNest

**“Nest Your Dreams, Fund Your Future”**

FundNest is a full-stack web platform that connects **startups** and **investors** via AI-powered matchmaking, real-time messaging, KYC verification, and subscription gating. Built with Vite + React (JSX), Node.js + Express, and PostgreSQL, it’s designed to be production-ready, responsive across devices, and extensible into AI features.

---

## 📦 Features

- Role-based onboarding: Startup, Investor, Admin  
- KYC / identity verification during signup (file upload)  
- AI integration placeholders:
  - Pitch review  
  - Match scoring  
  - Valuation estimator  
  - Chat assistant  
- Real-time messaging with Socket.io  
- Subscription gating (Free vs Pro) – control who can message / download pitches  
- Profile pages, dashboards, settings, and admin panel  
- Responsive UI for mobile / tablet / desktop  
- Seed data for initial demo of startups, investors, matches, and messages  
- Secure authentication with JWT + bcrypt  
- Local file uploads (e.g., KYC docs) stored under `/server/uploads`

---

## 📁 Project Structure

```

/client
├─ public/
├─ src/
│   ├─ pages/            # React route pages (Landing, Login, Signup, etc.)
│   ├─ components/       # Reusable UI components (Navbar, Cards, Buttons, etc.)
│   ├─ services/         # API, auth, socket, AI service stubs
│   ├─ App.jsx
│   ├─ main.jsx
│   └─ index.css
├─ tailwind.config.cjs
├─ postcss.config.cjs
└─ package.json

/server
├─ server.js             # Entry point for Express server
├─ config/
│   └─ db.js             # PostgreSQL pool setup
├─ routes/               # API route modules (auth, kyc, users, messages, etc.)
├─ middleware/           # Auth, role checks, multer file upload config, validation
├─ uploads/               # Directory for storing uploaded files (KYC docs, etc.)
├─ migrations/
│   └─ 001_create_tables.sql
├─ seeds/
│   └─ seed.sql
├─ package.json
└─ .env.example

````

---

## 🛠️ Setup & Running Locally

### Prerequisites

- Node.js (v16+)
- PostgreSQL (ensure a database is running and accessible)
- `npm` or `yarn` package manager

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/SohamAI99/FundNest.git
   cd FundNest
````

2. **Backend setup**

   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env to include your DATABASE_URL, JWT_SECRET, etc.
   npm run migrate      # run the SQL migrations
   npm run seed         # seed sample data
   npm run start        # e.g. node server.js or nodemon
   ```

3. **Frontend setup**

   ```bash
   cd ../client
   npm install
   npm run dev
   ```

4. **Access the app**

   * Client at: [http://localhost:5173](http://localhost:5173)
   * Backend API at: [http://localhost:8080](http://localhost:8080) (or whichever port in your .env)

---

## 🎯 Environment Variables (.env)

Use `.env.example` as template and configure values:

```
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/FUNDNEST_DB
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_key (optional for later)
PORT=8080
```

---

## 🧱 Database Schema & Migrations

The `migrations/001_create_tables.sql` file creates the following core tables:

* `users` (stores user info, roles, KYC status, is_pro, etc.)
* `kyc_documents` (stores file path, status, admin notes)
* `startups`
* `investors`
* `subscriptions`
* `messages`
* `matches`

The `seeds/seed.sql` file inserts sample users (startups, investors, admin), sample profiles, match records, and messages to help you test out dashboards and flows.

---

## 🔐 Authentication & Authorization

* Users sign up with email + password. Passwords are salted and hashed using bcrypt.
* JWT tokens are issued on login and used to access protected API endpoints.
* Middleware ensures:

  * Authenticated access (`authMiddleware`)
  * Role-based access (`roleMiddleware`) (e.g. only admins can approve KYC)
  * Subscription gating (some API actions restricted to Pro users)

---

## 📡 Real-Time & Messaging

* Uses **Socket.io** (both client & server)
* Clients authenticate via JWT on socket connection
* Events:

  * `send_message` → server persists in `messages` table, then emits to receiver if online
  * `receive_message` → delivered to client
  * Notifications: e.g. KYC approval, match updates

---

## 🤖 AI Integration (Mock / Placeholder)

* API routes under `/api/ai/` currently return **mock JSON responses**
* UI is wired to consume them as though real AI
* Future integration: in `server/services/openaiService.js` call OpenAI API using `OPENAI_API_KEY`
* Endpoints include:

  * `/api/ai/pitch-review`
  * `/api/ai/match`
  * `/api/ai/valuation`
  * `/api/ai/assistant`

---

## 📦 Usage Workflow

1. Visitor lands on homepage → explores features → signs up / logs in.
2. After signup, user directed to **KYC Page** to verify identity.
3. KYC review status shown on **KYC Status Page** (pending / approved / reject).
4. Once approved, user lands in their **dashboard** (startup or investor).
5. Dashboards offer AI match suggestions, upload pitches, browse profiles, send messages (if Pro).
6. **Messaging Page** enables real-time chat with proper gating.
7. **Subscription Page** allows upgrading to Pro to unlock features.
8. **Settings Page** for user preferences, password changes, profile edits.
9. **Admin Panel** allows platform admin to review KYC requests and manage users.

---

## 🧪 Testing & Development Tips

* Use seed data for initial login (admin, some Pro users)
* Test KYC flows: upload docs, approve via admin panel, see redirections
* Test role gating: attempt investor-only or startup-only pages
* Test messaging: Pro → Pro, Free → blocked, see real-time delivery
* Use browser dev tools to test responsiveness (mobile, tablet sizes)
* Monitor console / logs for errors in API calls or socket connections

---

## 🎬 Future Enhancements

* Replace mock AI endpoints with real OpenAI / other LLM calls
* Integrate OAuth (Google, LinkedIn) for faster onboarding
* Use cloud storage (AWS S3, Cloudinary) instead of local `/uploads`
* Add email verification, password reset flows
* Add analytics dashboards (growth trends, match success rates)
* Add push notifications for mobile/web
* Add role “Mentor” or “Advisor” to enrich ecosystem
* Add advanced filters, investor portfolios, valuation history

---

## ✉️ Contact & Support

* Maintainer / Author: *SohamAI99*
* Project hosted: [GitHub – FundNest](https://github.com/SohamAI99/FundNest)
* Live deployment (if available): [fund-nest-india.vercel.app](https://fund-nest-india.vercel.app)

---

Thank you for exploring FundNest! 🚀
Please report issues / feature requests via the GitHub Issues tab.

```

::contentReference[oaicite:0]{index=0}
```
