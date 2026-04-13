# F&B Merchant Membership Site Design Specification

## Overview
A new frontend customer interface for a Food & Beverage (F&B) merchant focusing on a loyalty/membership program. The application will leverage the existing `salon-booking` Next.js repository, adhering to its design language, generic UI components, and overall styling (e.g., slate/near-navy themes) while remaining fully decoupled from the salon-specific backend. 

All data will be loaded from a static mock data file to allow immediate UI development without backend integration.

## Architecture & Routing
The site will be encapsulated within a new Next.js Route Group to prevent layout bleeding with the main salon application. 

**Root Layout Location:** `app/(fnb)/layout.tsx`
**Base URL Path:** `/fnb/*`

### Sub-routes:
1. `/fnb/news` - News & Promotions (Default Landing Tab)
2. `/fnb/rewards` - Claimable Rewards List
3. `/fnb/reservation` - Table/Outlet Reservation Screen
4. `/fnb/about` - About the Merchant (including Opening Hours)
5. `/fnb/guide` - Step-by-step Rewards Redemption Guide

## Navigation & Layout
The F&B layout will employ a mobile-first PWA approach consisting of:
1. **Top Header:** Persistent sticky top bar showing the merchant name ("F&B Rewards") and a mock user points indicator.
2. **Bottom Navigation Bar:** A fixed 5-item bottom bar displaying icons and labels for: News, Rewards, Reserve, About, Guide.

## Core Pages & Components

### 1. News & Promotions (`app/(fnb)/news/page.tsx`)
*   **Purpose:** The default view upon opening the app.
*   **UI Structure:** A vertically scrolling feed of cards showing current F&B promotions (e.g., "1-for-1 Lunch Deal", "Happy Hour"). 
*   **Card Design:** Edge-to-edge images with bold promotion titles and validity dates.

### 2. Rewards (`app/(fnb)/rewards/page.tsx`)
*   **Purpose:** Allow users to view what they can claim using their points.
*   **UI Structure:** Grid or list of reward vouchers (e.g., "Free Coffee", "$10 Off Total Bill"). Clicking "Redeem" on a voucher triggers a modal displaying a scannable QR Code and a confirmation identifier.
*   **Card Design:** Will heavily borrow from existing `components/loyalty/voucher-card.tsx` design patterns. Each card shows the required points cost to redeem it.

### 3. Reservation (`app/(fnb)/reservation/page.tsx`)
*   **Purpose:** Form to allow users to book a table at the outlet.
*   **UI Structure:** A simple, unlinked form featuring fields for Date, Time, Pax (Number of Guests), and a generic 'Confirm Reservation' button.

### 4. About (`app/(fnb)/about/page.tsx`)
*   **Purpose:** Outlet information.
*   **UI Structure:** A standard text and list layout containing a mock outlet description, address, map placeholder, and an un-ordered list showing Opening Hours for Monday-Sunday.

### 5. Rewards Guide (`app/(fnb)/guide/page.tsx`)
*   **Purpose:** Instructional flow for redeeming rewards.
*   **UI Structure:** A bold, stepped list/timeline component:
    *   **Step 1:** Visit the outlet.
    *   **Step 2:** Choose an item and tap "Redeem". A unique QR code will be generated on your screen.
    *   **Step 3:** Show the QR code to our staff for them to scan.
    *   **Step 4:** Enjoy your reward!

## Data Strategy
**Location:** `lib/fnb-dummy-data.ts`
This file will export mock arrays and objects for:
*   `newsFeed` (Array of promotions)
*   `rewardsList` (Array of redeemable vouchers)
*   `outletInfo` (Object with description and hours)

This completely negates the need for any backend integration in this iteration.
