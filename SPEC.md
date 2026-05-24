# EV RangeWise — Full Product Spec

> Built for Australians, by Australians. Real-world ranges, real conditions. No sales spin.

## 1. Brand & Design Tokens

### Logo
- **Wordmark:** EV RangeWise
- "E" in ink black (#0f0f0e), "V" in brand green (#3ecf72), space, then "RangeWise" in ink black
- On dark backgrounds: E and "RangeWise" become white (#fff); V stays green
- Font weight 700, letter-spacing -0.02em, font-size 18px

### Colour Palette

| Token | Hex | Use |
|---|---|---|
| --ink | #0f0f0e | Primary text, dark hero, buttons |
| --ink-secondary | #6b6b68 | Body copy, sub-labels |
| --ink-tertiary | #a0a09d | Hints, mono labels |
| --surface | #f7f7f5 | App background (warm off-white) |
| --surface-raised | #ffffff | Cards |
| --surface-subtle | #f0f0ee | Secondary buttons, info blocks |
| --border | #e4e4e1 | Hairlines, card outlines |
| --green | #3ecf72 | Brand / primary CTA |
| --green-light | #d4f5e2 | Selected states, match badges (high), tag |
| --green-dark | #1a8a42 | High-match badge text, ✓ marks |
| --blue | #c2dff7 | Info tag, mid-match badge bg |
| --yellow | #f5e87a | Value tag, "best value" |
| --red-light | #fde8e8 | Reserved for errors / range fail |

### Typography
- **Sans:** Geist Sans — weights 400, 500, 600, 700
- **Mono:** Geist Mono — for numbers, micro-labels, "QUOTE-LIKE" tags
- **Scale:** H1 34/700, H2 26/700, body 14-16/400-500, micro-label 11-12/600 uppercase tracked 0.06-0.08em

### Radii
- --r-sm: 10px (chips, small badges)
- --r-md: 16px (inputs, info blocks)
- --r-lg: 20px (buttons, cards)
- --r-xl: 28px (reserved)

### Shadows
- **sm:** 0 1px 3px rgba(0,0,0,.07), 0 1px 2px rgba(0,0,0,.05) — cards at rest
- **md:** 0 4px 12px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.04) — raised cards
- **lg:** 0 12px 32px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.06) — drawer
- **Primary button glow:** 0 2px 12px rgba(62,207,114,.3)

### Motion
- Screen transitions: 350ms cubic-bezier(.4,0,.2,1), slide-right forward / slide-left back
- Drawer: 320ms, translateX from 105% to 0
- Buttons: 120ms scale to 0.97 on press, opacity 0.9
- Progress bar fill: 400ms cubic-bezier(.4,0,.2,1)

---

## 2. Global Components

### Status Bar (mobile chrome)
- 50px tall, time left, dynamic island notch centred (120x34, rounded bottom 20px), signal/wifi/battery right
- Adapts dark/light via prop

### Top Bar
- 56px, padded 0 20px, logo left, hamburger icon-button right
- Hamburger icon: 3 horizontal bars descending in length (18, 14, 10px wide)
- Dark variant on home, light on inner pages

### Buttons
- **Primary:** green, full-width, 17px, 16/24px padding, rounded 20px, ink-black text, green glow
- **Secondary:** surface-subtle bg, 16px, light border, full-width
- **Ghost:** transparent, 15px, light-border
- **Icon:** 40x40px, 12px rounded, semi-transparent bg
- All: press feedback (scale .97, opacity .9), no tap highlight

### Tag Pills
- 4x10px padding, 12px font, weight 500, rounded full
- Variants: green / blue / yellow with matched bg + tint text

### Match Badge
- 14px mono, weight 700, 5x10px padding, 10px rounded
- High (≥90%): green-light bg / green-dark text
- Mid (80-89%): light blue bg / dark blue text
- Low (<80%): subtle bg / secondary text

### Option Card (quiz select)
- White bg, 2px border, 16px rounded, 14x16 padding
- Layout: emoji (26px) → label + sub stacked → checkbox right
- Selected: ink border, green-light bg, ink-filled checkbox

### Range Slider
- 6px track, ink fill via gradient, 24px white thumb with ring + shadow
- Min/max labels mono below

### Progress Bar
- 4px tall, full-width, ink fill, animated width

### Car Image Placeholder
- 90px tall, light gradient (#f0f0ee → #e4e4e1), centred "CAR PHOTO" caption

### Input Field
- 14x16 padding, 2px border, 16px rounded, 16px font
- Focus: ink border; placeholder: tertiary grey

---

## 3. Screens

### A. Home
- **Dark hero** (--ink bg): "BUILT FOR AUSTRALIA" pill, H1 "The EV shortlist made for you.", subhead, z-stacked teaser cards (blurred, offset, opacity gradient), "Get my shortlist →" CTA
- **Trust strip:** 3 columns: "Free, always" / "No sign-up" / "2 min quiz" with ✓ marks
- **How it works:** 3 numbered steps with icon + title + body
- **More tools grid:** 2x2 cards (Range estimator, Compare, News, EV 101)

### B. Quiz Step 1 — Daily kms
- Progress 33%, "1/3"
- H2 + sub, live km readout (72px mono), dynamic tag per km range
- Slider 5-200km, step 5
- Quick-pick chips: 20, 40, 60, 100, 150 km

### C. Quiz Step 2 — Charging
- Progress 66%, "2/3"
- Multi-select: Home / Work / Public / Not sure
- "Next →" disabled until ≥1 selected

### D. Quiz Step 3 — Budget
- Progress 100%, "3/3"
- Single-select: Under $40k / $40-55k / $55-75k / Over $75k

### E. Results
- Filter summary bar with green/blue/yellow tags + "Change →" link
- Ranked cards (3): match badge, spec strip (range/charge/price), reasons list, "Full details" + "Test drive" buttons
- Top card has ink border + "TOP PICK" header band
- "Compare top 2" bottom CTA

### F. Range Estimator
- From/To inputs with vertical connector
- "Check range →" CTA
- Per-car results: ✅ comfortably / ⚠️ top-up / ❌ no

### G. Compare
- 2-column car headers
- Spec rows with winner highlighting (green-light fill + bold)
- "Bottom line" plain-English summary

### H. Drawer
- Slides from right, 82% width, rounded-left 44px
- Backdrop: black 50% + 2px blur
- Menu: Find my EV, Range estimator, Compare, News, EV 101, Book test drive
- Footer: trust statement

---

## 4. State Model

```typescript
type Screen = 'home' | 'quiz-1' | 'quiz-2' | 'quiz-3' | 'results' | 'range' | 'compare';

type Answers = {
  km?: number;           // 5-200, default 45
  charge?: string[];     // ['home','work','public','unsure']
  budget?: 'u40' | '40-55' | '55-75' | 'o75';
};

state: { screen: Screen; drawerOpen: boolean; answers: Answers; }
```

Quiz answers persist across navigation. Stored in Zustand + URL search params.

---

## 5. Match Algorithm

Weighted scoring per vehicle:

- **Range fit (km vs range):** 50% weight
- **Budget bucket fit:** 30% weight  
- **Charging-style fit:** 20% weight

Cap at 99%. Sort descending. Top 3 shown.

---

## 6. Tech Stack

- **Framework:** Next.js 16 (App Router, server components)
- **Styling:** Tailwind 4 with @theme tokens
- **UI:** shadcn/ui primitives (Button, Slider, Sheet/Drawer, Card, Badge, Progress, Input, RadioGroup, Checkbox)
- **Motion:** Framer Motion (AnimatePresence, layoutId)
- **State:** Zustand + URL search params
- **Fonts:** Geist Sans + Geist Mono (next/font/google)
- **Data:** Static JSON with 200+ Australian-spec EVs
- **Prices:** Drive-away AUD
- **Ranges:** Real-world (EVDB), not WLTP

---

## 7. Accessibility

- Every emoji has `aria-hidden="true"`
- Every interactive control has a label
- Focus rings use ink at 40% offset
- Keyboard navigable
- Respects `prefers-reduced-motion`

---

*Spec version 1.0 — Last updated 2026-05-24*
