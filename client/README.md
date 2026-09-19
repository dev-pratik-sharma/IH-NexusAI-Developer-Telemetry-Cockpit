# Nexus AI Engine — Client Framework

A premium, hardware-accelerated productivity cockpit tailored for agile developer workflows. This subsystem serves as **Task 1: Modern Frontend Development** for the Innovation Hacks Internship Program.

## 🚀 Core Visual Architecture

- **WebGL 3D Core Layer:** Powered by `Three.js` and `Vanta.js` to render a high-fidelity, interactive network linkage backdrop canvas directly on the viewport container loop.
- **High-Contrast Glassmorphism:** Custom compiled visual frames mapping a strict linear dark tint gradient (`rgba(15, 23, 42, 0.75)`) with a strong backdrop blur (`16px`) ensuring clean text readability over moving animation nodes.
- **Adaptive Layout Structure:** Full 100% viewport alignment routing that switches instantly between a fixed left dashboard drawer (desktop view grids) and a sticky utility bottom panel (mobile devices).

## 🛠️ Installed Dependencies

- **React 19 & Vite:** Next-gen core compilation layer.
- **Tailwind CSS v4:** High-performance, declarative style plugin engine.
- **Three.js & Vanta:** Real-time hardware-accelerated 3D coordinate graphing.
- **Lucide React:** Lightweight, vector icon component matrix.

## 📂 Component Map

- `src/context/`: Contains the centralized state module (`AppContext.jsx`) managing mock authentication variables, text query search filters, and checklist items.
- `src/components/`: Houses stateless UI presentation atomic primitives (`Navbar`, `Sidebar`, `VantaBg`, `ProjectCard`, `TaskCard`).
- `src/views/`: Contains page view setups including the premium `LandingPage` marketing node framework, main operational metrics workspace (`Dashboard`), and `MockAI` algorithm testing suite.

## 💻 Native Execution Setup

To initialize development servers locally:

```bash
# 1. Step into the client directory
cd client

# 2. Install required package nodes
npm install

# 3. Fire up the local hot-reloading pipeline
npm run dev
```
