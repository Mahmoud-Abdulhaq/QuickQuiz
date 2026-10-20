# Cozy Quiz — Visual Theme & Design Spec

**Version:** 1.0 · **Date:** October 20, 2026

---

## 1. Overview

**Cozy Quiz** is a general-trivia quiz app for adults and casual trivia fans. The design should feel like a relaxed game night on the sofa — warm, bookish, and low-pressure — never like a game-show arena.

### Design pillars

| Pillar | Description |
|---|---|
| Cozy & friendly | Warm colors, soft edges, no visual harshness |
| Bookish | Serif headings evoke a well-loved living room library |
| Low-pressure | Gentle feedback, calm motion, encouraging tone |
| Typography-led | No photography or illustration; type and doodle accents carry the identity |

---

## 2. Audience & Content

- **Primary audience:** Adults, casual trivia fans
- **Quiz content:** General trivia (mixed/multi-topic)
- **Tone of voice:** Warm, conversational, encouraging — "Nice one!" rather than "CORRECT!"

---

## 3. Color System

### 3.1 Light mode (default)

| Role | Direction |
|---|---|
| Background | Soft beige base |
| Surfaces/cards | Warm gray, slightly lighter/darker than background |
| Primary accent | Muted lavender |
| Correct answer | Soft green tint |
| Wrong answer | Soft red tint |
| Text | Warm charcoal (near-black, not pure black) |

### 3.2 Warm dark mode

| Role | Direction |
|---|---|
| Background | Warm charcoal (not pure black) |
| Text | Cream (not pure white) |
| Accent | Muted lavender, slightly lightened for contrast |
| Feedback | Same soft green/red tints, desaturated further |

### 3.3 Feedback rules

- Correct/wrong answers use **soft tints**, never saturated red/green fills
- No harsh flashing, shaking, or alarm-like color changes
- Feedback appears with a subtle fade (see Motion)

---

## 4. Typography

| Level | Style |
|---|---|
| Headings / question text | Classic serif (e.g., Lora, Merriweather, or Playfair Display) |
| Body, buttons, UI | Clean sans-serif (e.g., Inter, Source Sans, or Work Sans) |

**Rules**

- Serif is reserved for headings and question text to preserve the bookish feel
- Sans handles everything interactive for readability and clarity
- Minimum body size 16px; question text scales larger (20–24px)
- No imagery anywhere — the serif/sans contrast carries visual interest

---

## 5. Visual Style & Accents

- **Hand-drawn doodle accents and icons:** sparse, subtle touches — e.g., a hand-drawn asterisk next to the logo, small doodle icons for category chips or the score counter
- **No photography, illustrations, or full imagery** of any kind
- **Surfaces:** soft rounded cards (generous corner radii, e.g., 12–16px)
- **Borders:** thin, warm-toned; avoid hard black outlines

---

## 6. Motion & Animations

| Interaction | Motion |
|---|---|
| Answer feedback | Subtle fade-in of green/red tint |
| Screen transitions | Gentle fades and slides |
| Button presses | Slight opacity/press-down, no bounce |
| Score changes | Soft fade/slide of the number |

**Rules**

- Duration: 200–300ms, ease-out
- No bounces, spins, confetti, or attention-grabbing motion
- Respect reduced-motion preferences: replace all transitions with instant state changes

---

## 7. Component Notes

- **Question card:** serif question text on a warm-gray rounded card
- **Answer buttons:** sans-serif, rounded, beige/charcoal surface with lavender hover state; soft tint on correct/wrong
- **Progress indicator:** thin, muted-lavender bar or doodle-style dots
- **Results screen:** warm, encouraging copy; serif headline with final score
- **Navigation:** minimal — a few large, obvious touch targets

---

## 8. Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Soft tints and warm neutrals | Saturated colors, neon accents |
| Serif headings + sans body | Mixing many typefaces |
| Subtle fades and slides | Bounces, confetti, harsh feedback |
| Sparse hand-drawn doodle accents | Photos, illustrations, stock imagery |
| Cream text on warm charcoal (dark mode) | Pure black background, pure white text |

---

## 9. Plain-Language Version (Bedwars Edition)

**The idea:** Cozy Quiz should feel like a chill Bedwars lobby game with friends — not a sweaty ranked 1v1 against a clan tryhard.

- **Colors = your base choice.** Light mode is soft beige and warm gray — like picking white or gray wool, nothing loud. Muted lavender is your dyed-wool trim. Dark mode is cozy charcoal with cream text — obsidian warmth, not a pure black void, lit like glowstone. Right/wrong answers never scream: no "bed broken" alarm flashes, just a gentle heads-up tint.
- **Fonts = HUD readability.** Questions use a classic serif, like the fancy text in a Minecraft book. Buttons and UI use a clean sans-serif, like hotbar text: easy to read at a glance.
- **Doodles = map decorations.** No big splash art — just a few sparse hand-drawn touches, like a map maker's small decorative builds near spawn. Subtle, never blocking the bridge.
- **Motion = no knockback into the void.** Everything is soft fades and slides (200–300ms). No bounces, no confetti, no screen shake — the opposite of a TNT blast. If the device asks for reduced motion (low-FPS settings), animations turn off instantly, like particles off.
- **Components = your kit.** The question card is your island: a cozy rounded safe zone. Answer buttons are wool blocks: big, obvious, easy to place; hover glows lavender, answers tint soft green/red. The progress bar is your bed-health indicator: a thin lavender strip.

> **One-line rule:** if tryhard Bedwars energy is "neon, fast, loud, sweaty," Cozy Quiz is the opposite — warm, slow, soft, and friendly. Build it like a cozy base, not a rushing kit.
