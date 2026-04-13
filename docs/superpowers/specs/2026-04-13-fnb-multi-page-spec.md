# F&B Membership — Multi-Page Architecture Spec

**Date:** 2026-04-13  
**Status:** Approved  
**Scope:** Expand the single `app/(store)/fnb/page.tsx` into a full multi-page module with proper URL routing.

---

## Overview

The current F&B Membership experience lives entirely on one page (`/fnb`), with all modules (News, Rewards, Reservation, About) rendered as scrollable sections and modals. This spec defines the expansion into dedicated sub-pages under `/fnb/*`, using a shared layout for consistent header/navigation, and dummy data throughout.

---

## Route Structure

```
app/(store)/fnb/
├── layout.tsx              ← Shared: banner, merchant info, sticky tab nav
├── page.tsx                ← Redirects to /fnb/news (or keeps as home)
├── news/
│   └── [id]/page.tsx       ← Promo detail page
├── rewards/
│   ├── page.tsx            ← Rewards list
│   └── [id]/page.tsx       ← Reward detail + multi-step claim flow
├── reservation/
│   ├── page.tsx            ← Date/time/pax booking form
│   └── success/page.tsx    ← Booking success + reference number
├── wallet/
│   └── page.tsx            ← Wallet hub
└── about/
    └── page.tsx            ← About page
```

---

## Module Specs

### 1. Shared Layout (`fnb/layout.tsx`)

**Purpose:** Wraps all `/fnb/*` pages. Provides the consistent top header (banner + merchant info + tab nav) without duplication across pages.

**Components:**
- Full-width banner image (`aspect-[21/9]` on mobile) with overlaid circular logo (bottom-left)
- Merchant name + open status + hours in a row beneath the banner
- Sticky tab navigation bar with 5 tabs: `News`, `Rewards`, `Reserve`, `Wallet`, `About`
- Active tab detected via `usePathname()` — no manual state needed
- Tab clicks use `router.push('/fnb/<tab>')` for navigation

**Responsive:**
- Mobile: banner visible, sticky tab bar below it
- Desktop: preserve existing desktop hero layout and `FnbNav` (hidden on mobile via `md:hidden`)

---

### 2. News Detail Page (`/fnb/news/[id]`)

**What it does:** Full-page view of a single news/promo item.

**UI elements:**
- Large full-width hero image (top)
- Back button (top-left, returns to home page `/fnb/news`)
- Promo title (large, bold)
- Date / validity label (e.g., "Available till end of September")
- Long description text
- Optional CTA button: "Reserve a Table" → links to `/fnb/reservation`
- Share button (uses Web Share API)

**Data:** Looked up by `id` from `fnbNews` array in `fnb-dummy-data.ts`. If not found, show 404-style "Promo not found."

**Missing from current dummy data to add:**
- `validityEnd: string` (e.g., "30 Sep 2025")
- `ctaLabel?: string` (optional CTA button label)
- `ctaLink?: string` (optional link, e.g., `/fnb/reservation`)

---

### 3. Rewards Module

#### 3a. Rewards List (`/fnb/rewards`)

**UI elements:**
- Section heading "Rewards"
- Grid of reward cards (1 col mobile, 2 col desktop)
- Each card: thumbnail image, reward name, points badge (e.g., "500 pts"), availability tag ("Available" / "Out of stock"), tapping navigates to `/fnb/rewards/[id]`

**Missing from current dummy data to add:**
- `thumbnail: string` (image URL for card)
- `availability: "available" | "unavailable"`

#### 3b. Reward Detail + Claim Flow (`/fnb/rewards/[id]`)

Single page that manages a **4-step claim flow** via local `step` state:

**Step 0 — Detail view:**
- Full hero image
- Reward name, points cost badge
- Description / benefits
- Expiry info
- Terms & Conditions (collapsible)
- "Claim Reward" button at bottom

**Step 1 — Points gate (auto-checked on button tap):**
- If points sufficient → advance to Step 2
- If insufficient → show "Not Enough Points" screen:
  - Current balance: X pts
  - Required: Y pts
  - Shortfall: Z pts
  - Tips box: "Earn more by visiting & dining, celebrating birthdays, referring friends"
  - Button: "Back to Rewards"

**Step 2 — Confirm claim:**
- Summary: reward name, thumbnail, points cost
- "Your balance after: X pts"
- Two buttons: "Confirm" (→ Step 3) and "Cancel" (→ Step 0)

**Step 3 — QR code screen:**
- Unique QR string: `REDEEM-{rewardId}-{timestamp}`
- 15-minute countdown timer displayed prominently
- QR code rendered (using existing `qrcode.react` dependency)
- 4-step guide below: Visit → Tap Claims → Show QR → Enjoy
- "Done" button → Step 4

**Step 4 — Post-redemption:**
- "Reward Claimed! ✓" confirmation icon
- Updated dummy balance shown (deducted)
- "Back to Rewards" button

**Dummy user points balance:** 1,200 pts (hardcoded for now, not from auth store).

---

### 4. Reservation Module

#### 4a. Booking Form (`/fnb/reservation`)

**UI elements:**
- Date picker (native `<input type="date">`)
- Time slot grid: clickable time-slot buttons (e.g., 12:00, 13:00, 18:30, 19:00, 20:00) replacing the old `<select>`. Available slots are hardcoded dummy data.
- Pax (guest count) stepper: `−` / `+` buttons with number display, min 1 / max 20
- Special notes textarea (optional field)
- "Review Booking" button → navigates to `/fnb/reservation/confirm` (passing form data via URL params or state)

#### 4b. Booking Success (`/fnb/reservation/success`)

**UI elements:**
- Green checkmark animation
- "Booking Requested!" heading
- Mock booking reference: `BK-{timestamp-last-6-digits}`
- Summary card: date, time, pax, outlet name
- Two buttons: "View My Bookings" (→ `/fnb/wallet`) and "Back to Home" (→ `/fnb/news`)

---

### 5. Wallet Page (`/fnb/wallet`)

**Purpose:** The loyalty hub. Customers return here to check their status and history.

**UI structure:**

**Top section — Points card:**
- Gold gradient card (reuses existing style)
- Tier badge: Bronze (0–499), Silver (500–1199), Gold (1200+) — hardcoded based on dummy balance
- Current points balance prominently displayed
- Progress bar: shows pts earned toward next tier milestone
- e.g., "800 more points to Gold tier"

**Middle section — Two tabs:**
- "Earn History" tab: list of dummy earn transactions
  - Each item: date, description (e.g., "Dined at YDT"), points earned (+X pts)
- "Redemption History" tab: list of dummy redemptions
  - Each item: date, reward name, outlet, points spent (−X pts)

**Bottom section — My Bookings shortcut:**
- Card showing upcoming booking (if any), "Make a Reservation" CTA if none

**Dummy data to add to `fnb-dummy-data.ts`:**
- `fnbEarnHistory`: array of 5 earn transactions
- `fnbRedemptionHistory`: array of 2 redemption records
- `fnbUserPoints`: number (1200)
- `fnbUserTier`: "Gold"

---

### 6. About Page (`/fnb/about`)

**UI elements:**
- Opening hours table (7 rows, day + hours)
- Map embed (Google Maps iframe, full-clickable overlay)
- "Get Directions" button
- Contact section: phone (WhatsApp link), email (if applicable)
- Social links: Instagram, Facebook icons
- Outlet selector: single outlet for now (placeholder for future multi-outlet)

**Data:** All from existing `fnbOutlet` object. Add `instagram`, `facebook` string fields to dummy data.

---

## Data Changes to `lib/fnb-dummy-data.ts`

| Field | Where | Type | Notes |
|-------|-------|-------|-------|
| `validityEnd` | `FnbNews` | `string` | e.g., "30 Sep 2025" |
| `ctaLabel` | `FnbNews` | `string?` | optional |
| `ctaLink` | `FnbNews` | `string?` | optional |
| `thumbnail` | `FnbReward` | `string` | image URL |
| `availability` | `FnbReward` | `"available" \| "unavailable"` | |
| `fnbEarnHistory` | new export | array | 5 items |
| `fnbRedemptionHistory` | new export | array | 2 items |
| `fnbUserPoints` | new export | number | 1200 |
| `fnbUserTier` | new export | string | "Gold" |
| `instagram` | `fnbOutlet` | `string` | URL |
| `facebook` | `fnbOutlet` | `string` | URL |

---

## Navigation Changes

The existing `fnb/page.tsx` home (all sections on one scroll page) is replaced by:
- `/fnb` → redirect to `/fnb/news` (the default landing tab)
- `/fnb/news` → the news list (extracted from current home page)

The tab nav in `layout.tsx` replaces both the current mobile sticky nav and the desktop `FnbNav` component.

---

## Technical Constraints

- **Framework:** Next.js App Router (file-based routing)
- **Styling:** Tailwind CSS (existing classes, no new dependencies)
- **Data:** All dummy — no API calls
- **Auth:** Not required — dummy user points hardcoded
- **Dependencies:** `qrcode.react` already installed
- **Responsive:** Mobile-first; all pages must work on 375px viewport

---

## Out of Scope

- Real backend API integration
- Authentication / login gating
- Push notifications for booking confirmation
- Multi-outlet support (placeholder only)
- Booking cancellation flow
