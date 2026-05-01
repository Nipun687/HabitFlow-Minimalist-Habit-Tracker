# 🌿 HabitFlow — Minimalist Habit Tracker

> A mobile-first, calming habit tracker built for daily consistency. Designed with exceptional UX, smooth micro-interactions, and a focus on accessibility.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://habitflow.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![PWA](https://img.shields.io/badge/PWA-ready-5A0FC8)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ Features

### Core
- ✅ Add, edit, delete habits with emoji icons and categories
- 🔥 Daily streak tracking with best-streak history
- 📊 Progress visualization (area charts, bar charts, week grids)
- 🏷️ Category tagging (Health, Mind, Work, Body, Social)
- 🌙 Dark / Light mode with smooth transitions
- 📱 Mobile-first, fully responsive (440px optimal)
- 💾 Local storage persistence with Zustand

### Advanced
- ✨ Micro-interactions — hover, tap, completion animations (Framer Motion)
- 🎉 Confetti burst on habit completion
- 🔔 Smart reminder system (browser notifications)
- 📲 PWA — installable, offline-capable
- ⌨️ Full keyboard navigation + ARIA labels
- ⚡ Code splitting, lazy loading (React.lazy + Suspense)
- 🎨 CSS variables theming, accessible color contrast

---

## 🗂️ Project Structure

```
habitflow/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── favicon.svg
│   └── icons/                 # PWA icons
├── src/
│   ├── components/
│   │   ├── Layout.jsx         # Navigation + shell
│   │   ├── HabitCard.jsx      # Animated habit row
│   │   ├── HabitModal.jsx     # Add/Edit bottom drawer
│   │   └── StatsRow.jsx       # Stats summary cards
│   ├── hooks/
│   │   └── index.js           # useLocalStorage, useSmartReminder, useKeyboardShortcuts
│   ├── pages/
│   │   ├── TodayPage.jsx      # Main daily view
│   │   ├── ProgressPage.jsx   # Charts + analytics
│   │   └── AllHabitsPage.jsx  # Full habit management
│   ├── store/
│   │   └── useHabitStore.js   # Zustand store + selectors
│   ├── styles/
│   │   └── globals.css        # CSS variables + Tailwind
│   ├── utils/
│   │   └── index.js           # Pure helpers
│   ├── App.jsx                # Routing
│   └── main.jsx               # Entry point
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+ or yarn

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/habitflow.git
cd habitflow

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# App runs at http://localhost:5173
```

### Build for production

```bash
npm run build
# Output in /dist
```

### Preview production build

```bash
npm run preview
```

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts — zero config needed
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) for automatic deployments.

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

Add `public/_redirects` with:
```
/*    /index.html   200
```

---

## 🎨 Design System

| Token | Dark | Light |
|-------|------|-------|
| `--bg` | `#0e0f11` | `#f5f4f0` |
| `--surface` | `#16181c` | `#ffffff` |
| `--accent` | `#a8e6cf` | `#2d9b72` |
| `--text` | `#f0f0ee` | `#1a1b1e` |

Fonts: **DM Serif Display** (headings) + **DM Sans** (body)

---

## 🔮 Future Improvements

- [ ] **Firebase backend** — sync across devices
- [ ] **Google OAuth** — user accounts
- [ ] **Habit scheduling** — specific days of week
- [ ] **Habit notes** — add context/reflections
- [ ] **Export data** — CSV / JSON download
- [ ] **Widgets** — iOS/Android home screen widgets
- [ ] **Social streaks** — share with friends
- [ ] **Habit templates** — curated starter packs
- [ ] **Analytics dashboard** — weekly/monthly reports
- [ ] **Gentle AI nudges** — LLM-powered encouragement

---

## 🤝 Contributing

Pull requests welcome. Please open an issue first to discuss changes.

---

## 📄 License

MIT © 2025 — Built with 🌿 by [Your Name](https://github.com/yourusername)

---

*"We are what we repeatedly do. Excellence, then, is not an act, but a habit." — Aristotle*
