# Nexus AI — Intelligent Full-Stack Developer Teleboard Cockpit

Nexus AI is an enterprise-grade, multi-user SaaS project management teleboard designed to combat developer cognitive overload. Built on a secured **PERN Stack** architecture (PostgreSQL, Express, React, Node.js) with custom glassmorphic aesthetics, it isolates user workspace parameters, delivers real-time data metrics via hardware-accelerated graphs, and leverages the **Google Gemini AI Engine** to compute localized text summaries of active workflows.

---

## 🚀 Key Engineering Upgrades & Core Capabilities

### 1. Cryptographic Authentication & True Workspace Isolation
* **Secure Hashing Matrix:** Implements `bcryptjs` passcode salting protocols on the backend to secure developer registration and login credentials.
* **Bearer Token Gates:** Route pipelines (`/api/projects` and `/api/tasks`) are tightly restricted via an intercepting JSON Web Token (JWT) verification middleware.
* **Multi-User Isolation:** Database lookup queries filter fields explicitly using `user_id` tokens, guaranteeing a completely empty, private cockpit for brand-new users.

### 2. Localized Google Gemini AI Processing Hub
* **Real API Synchronization:** Integrated with the official `@google/genai` SDK driving the responsive `gemini-2.5-flash` model.
* **Contextual Comprehension:** The engine queries the active user's tasks from the PostgreSQL cluster, transforms rows into formatted semantic vectors, and returns crisp, technical executive summaries and actionable bottleneck analysis.

### 3. Deep Multitier Scoped Route Dashboards
* **Project Dedicated Spaces:** Built with `react-router-dom` to offer dedicated dashboard pages for individual project cards with real-time route pathing (`/project/:id`).
* **Localized Analytics:** Implements hardware-accelerated `Recharts` (Pie Charts and Bar Charts) that dynamically parse parameters matching *only* the specific project being viewed.
* **Cross-Navigation Purging & Task Injections:** Features an explicit scoped task injector on sub-dashboards as well as alternative project side-carousels capable of triggering cascading relational database deletes from anywhere in the app.

### 4. Advanced System UX Guard Rails
* **Interception Filters:** Overrides hardware back-arrow key presses (`window.onpopstate`) and sidebar actions to launch custom, unified glassmorphic modal confirmation boxes instead of classic browser alert boxes.
* **Persistent Sessions & Smart Alerts:** An app-boot check polls local memory for existing signed JWT keys to automatically restore authorization parameters. The real-time notification bell aggregates high-priority backlog alerts.

---

## 🛠️ Repository Architecture & Workspace Flow

```text
IH-NexusAI-Developer-Telemetry-Cockpit/
├── client/              # React 18 Frontend Workspace Application
└── server/              # Node.js & Express REST API Server
```

## 📦 Architecture Local Setup Trace

### 1. Setup the Backend API Server Node
```bash
cd server
npm install
npm run dev
```

### 2. Setup the Frontend Client Shell
```bash
cd ../client
npm install
npm run dev
```
Open your browser tab to `http://localhost:5173` to explore the workspace live.
