# F&B Single-Page Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Pivot the F&B Membership prototype to strictly mirror the single-page, sticky-nav scrolling layout topology utilized by `app/(store)/[id]/page.tsx`, rather than multiple routed pages.

**Architecture:** We will create `app/fnb/page.tsx`. This page will be modeled extremely closely off of `StorePage`, featuring the Hero elements, `FnbNav` sticky headers, Desktop Sidebars, Mobile specific footers, and continuous scrolling sections instead of separate file outputs.

---

### Task 1: Initialize Data and Dependencies

**Files:**
- Modify: `package.json`
- Modify: `lib/fnb-dummy-data.ts` (if needed to restore)

- [ ] **Step 1: Install QR Code Library**
```bash
npm install qrcode.react
```

- [ ] **Step 2: Generate Dummy Data Payload**
Ensure `lib/fnb-dummy-data.ts` contains the news, rewards, and outlet configuration (hours/description).

- [ ] **Step 3: Commit**
Commit dependency addition.

---

### Task 2: Port Layout & FnbNav Component

**Files:**
- Create: `components/fnb/fnb-nav.tsx`
- Create: `app/fnb/page.tsx`

- [ ] **Step 1: Create FnbNav sticky navigation**
Duplicate the structure of `VenueNav`, but supply F&B tabs:
`"news"` (News), `"rewards"` (Rewards), `"reservation"` (Reserve), `"guide"` (Guide), `"about"` (About).
Adjust the offset to mimic `VenueNav` scroll handling.

- [ ] **Step 2: Scaffold Single Page Root**
Initialize `app/fnb/page.tsx` mapping roughly to the `StorePage`.
Include the responsive Hero section rendering dummy images or gradient blocks.
Place `<FnbNav />` under the hero.
Implement the core grid layout `grid-cols-1 lg:grid-cols-[1fr_380px]`.

- [ ] **Step 3: Commit**
Commit layout foundations.

---

### Task 3: Build Scrollable Content Sections

**Files:**
- Modify: `app/fnb/page.tsx`

- [ ] **Step 1: Implement Left Column Content**
Within `<section id="news">`, map the `fnbNews` data.
Within `<section id="reservation">`, inline the mock booking form inputs.
Within `<section id="about">`, mimic the placeholder maps and opening hours snippet.
Within `<section id="guide">`, implement the vertical timeline steps styling.

- [ ] **Step 2: QR Code Reward Mechanics**
Within `<section id="rewards">`, build the reward list. Introduce a localized modal state (via `qrcode.react`) handling the voucher claim UI overlay directly within `app/fnb/page.tsx` or a subcomponent.

- [ ] **Step 3: Right Sidebar & Mobile Footer**
Embed the mock Loyalty/Points overview rendering the "Golden VIP Card" style from `StorePage`.
Bind the sticky mobile button to scroll to the `#reservation` section.

- [ ] **Step 4: Commit**
Commit final UI sections.
