# Press Start

A self-contained, single-file **game & music trivia arcade** — quiz worlds, coins, crates, collectible 8-bit controllers, and a 777 spinner casino. No frameworks, no dependencies, no build step.

**Play it live:** https://mahmoud-abdulhaq.github.io/QuickQuiz/press-start.html

---

## What's in the box

- **PRESS START splash menu** — the arcade boots up before you can play
- **10 trivia worlds** in a 3x3 grid — 4 game categories (Retro Arcade, Consoles & Hardware, Modern Games, Game Soundtracks) and 5 music categories (Rock & Metal, Pop & Hip-Hop, Music Theory, Classical & Jazz, Electronic & Dance), with 56 built-in questions
- **Build & Request Quizzes** — a floating tile over the world grid to create your own quiz packs or request new ones
- **Coins** — earn up to 5 coins per quiz based on your score (100% = 5, 90% = 4, 80% = 3, 70% = 2, 60% = 1)
- **Crate shop** — 5 crates from Bronze to Exotic, with an animated unboxing roll
- **Collection index** — 43 collectible 8-bit controllers across 8 rarity tiers: Common, Uncommon, Rare, Epic, Legendary, Mythic, Exotic, Secret (locked items show as ??? silhouettes)
- **777 Spinner casino** — three animated reels; 777 pays an 8x jackpot
- **Leaderboard** — lifetime finished quizzes, correct answers, and quizzes passed (pass mark: 60%)
- **Feedback section** — feedback entries and quiz requests in one place
- **6 color themes** — Red, Blue, Green, Purple, Pink, and Orange (each on black), all with an animated glitch background
- **PIN-protected admin panel** — owner-only coin and progress controls

## Notes

- Everything is saved locally in the browser via `localStorage` — no accounts, no server
- Fully offline-capable: download `press-start.html` and open it anywhere
- Reduced-motion preferences are respected throughout

## Deploy

The file deploys automatically to GitHub Pages on every push to `main`:

- Standalone game: https://mahmoud-abdulhaq.github.io/QuickQuiz/press-start.html
- React app (original QuickQuiz engine): https://mahmoud-abdulhaq.github.io/QuickQuiz/

## History

This repo started as a React + Vite quiz app ("QuickQuiz"). `press-start.html` is the current, fully standalone arcade version; the React app remains in the repo as the original engine.
