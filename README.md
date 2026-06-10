# VitSleep 🌙

**A free, privacy-first lucid dreaming journal and training app.**  
Inspired by Oniri & Lucidity — rebuilt from scratch, completely offline, no paywalls, no accounts.

---

## What's inside

| Feature | Details |
|---------|---------|
| 🌙 Dream Journal | Full CRUD — title, content, mood, lucidity level, tags, dream signs, characters, locations |
| ✨ AI Analysis | Jungian dream interpretation via OpenRouter (bring your own API key) |
| 🎓 7-Day Program | Guided course from zero to first lucid dream |
| 🤚 Reality Checks | Reminders with configurable interval & hours |
| ⏰ WBTB | Wake Back to Bed alarm calculator with browser notification |
| 👂 SSILD Timer | Guided 6-cycle sensory timer |
| 📊 Statistics | Heatmap, line chart, mood distribution, dream sign cloud |
| 🔍 Search & Filter | Full-text search across all dream fields, filter by lucidity/mood/favorite |
| 🔒 100% Local | All data in IndexedDB — no server, no account, no tracking |
| 📱 PWA | Installable on Android, iOS, desktop — works offline |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run dev server (hot reload)
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

Open `http://localhost:5173` in your browser.  
For PWA install: open in Chrome/Edge → address bar → Install icon.

---

## AI Analysis Setup

VitSleep uses [OpenRouter](https://openrouter.ai/) as the AI gateway.

1. Create a free account at [openrouter.ai](https://openrouter.ai/)
2. Generate an API key at [openrouter.ai/keys](https://openrouter.ai/keys)
3. Open VitSleep → Settings → AI Analysis → paste your key

Recommended model: **Claude 3.5 Sonnet** (best dream analysis quality)  
Budget option: **Gemini Flash 1.5** (~$0.001 per analysis)

Your key is stored locally in your browser — never sent anywhere except OpenRouter.

---

## Tech Stack

- **React 18** + **Vite** — fast builds, instant HMR
- **Zustand** — lightweight state management
- **IndexedDB** (via `idb`) — offline-first storage
- **Recharts** — statistics charts
- **date-fns** — date formatting
- **vite-plugin-pwa** — PWA + Service Worker
- **DM Serif Display + DM Sans** — typography

---

## Project Structure

```
src/
├── App.jsx                 # Router + nav shell
├── index.css               # Design system (CSS variables, components)
├── main.jsx                # Entry point
│
├── data/
│   └── content.js          # All 7 lessons, techniques, tips, dream signs
│
├── store/
│   └── index.js            # Zustand stores (dreams, RC, settings, onboarding, toast)
│
├── utils/
│   └── db.js               # IndexedDB wrapper (idb)
│
├── pages/
│   ├── Dashboard.jsx       # Home screen
│   ├── Journal.jsx         # Dream list + search + filter
│   ├── DreamForm.jsx       # Create / edit dream
│   ├── DreamDetail.jsx     # Dream viewer + AI analysis
│   ├── Techniques.jsx      # Technique library
│   ├── TechniqueDetail.jsx # Detail + SSILD timer + WBTB + RC settings
│   ├── Statistics.jsx      # Heatmap, charts, symbols
│   ├── SettingsPage.jsx    # All settings
│   └── OnboardingPage.jsx  # 7-day program
│
└── components/
    └── dashboard/
        ├── StreakCard.jsx
        ├── RealityCheckWidget.jsx
        └── OnboardingBanner.jsx
```

---

## Design Philosophy

VitSleep uses a **black & white, dream-driven** aesthetic:
- Dark background (`#0a0a0f`) with pure white text
- `DM Serif Display` for headings — literary, dreamy
- `DM Sans` for body — clean, modern
- Animations at 150–380ms with `cubic-bezier(0.16, 1, 0.3, 1)` easing
- No color except lucidity level indicators (grey → blue → purple → white)

---

## Browser Support

| Browser | Status |
|---------|--------|
| Chrome 90+ | ✅ Full PWA support |
| Firefox 88+ | ✅ Full support |
| Safari 15+ | ✅ PWA installable |
| Edge 90+ | ✅ Full PWA support |

---

## Privacy

- Zero telemetry
- Zero external requests (except OpenRouter when you explicitly trigger AI analysis)
- All data in `localStorage` (settings) and `IndexedDB` (dreams, progress)
- Export your data anytime as JSON from Settings

---

## License

MIT — do whatever you want with it.

---

*Built with care for everyone who envies a friend's natural lucid dreaming gift  
and decided to earn their own wings instead.*
