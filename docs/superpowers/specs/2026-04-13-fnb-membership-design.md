# Design & Architecture Specification: F&B Membership Module

## Overview
This specification details the frontend architecture for the F&B Membership application. Following feedback, the layout will **strictly mirror the existing Salon Booking Layout** architecture (Single-Page Scrolling), adapting only the internal sections (navigation targets) structure to fit the F&B use case. Instead of multiple pages loaded via a bottom navbar, it will be a unified page leveraging the project's existing Hero/Sticky-Nav components with dummy data.

## Integration Architecture
*   **Location:** `app/fnb/page.tsx` (Unified single-page interface).
*   **Design Language:** Directly models `app/(store)/[id]/page.tsx`.
*   **Core UI Engine:** Tailwind CSS + Existing Salon Components.

## Core Layout Components (From Salon)
1. **Hero Banner:** Mobile/Desktop responsive hero section showing open/closed status, share button, and dynamic gradients.
2. **Sticky Navigation (`FnbNav`):** Adapted from `VenueNav`. Will stick to the top on scroll, directing users to different anchored `<section>` blocks on the page.
3. **Sticky Sidebar (Desktop) / Footer (Mobile):** Prominent placement for "Reserve Now" action and Points/Voucher claim overview.
4. **Content Sections:** Left-aligned full-width/two-column split.

## Single Page Sections (Connected to FnbNav)
The `FnbNav` will scroll smoothly to the following sections:

### 1. News & Promotions (`#news`)
*   **Purpose:** Display ongoing outlet activities.
*   **UI Structure:** Grid or list of prominent news cards with image backgrounds and overlay text.

### 2. Rewards (`#rewards`)
*   **Purpose:** Allow users to view what they can claim using their points.
*   **UI Structure:** List of reward vouchers. Selecting "Redeem" triggers a Modal exhibiting a **Scannable QR Code** representing the redemption.

### 3. Reservation (`#reservation`)
*   **Purpose:** Dummy request interface for booking a table.
*   **UI Structure:** Simple inline form simulating table booking (date, time, guests), validating and throwing a success mark upon mock submission.

### 4. Rewards Guide (`#guide`)
*   **Purpose:** Step-by-step instructions.
*   **UI Structure:** Vertical numbered timeline:
    *   **Step 1:** Visit the outlet.
    *   **Step 2:** Choose an item and click Redeem to reveal your QR.
    *   **Step 3:** Let our staff scan the QR code.
    *   **Step 4:** Enjoy!

### 5. About & Info (`#about`)
*   **Purpose:** Outlet Location and Hours.
*   **UI Structure:** A placeholder map and a list of structured opening hours matching the salon's footer sections.

## Data Strategy
**Location:** `lib/fnb-dummy-data.ts`
To maintain isolation from the `actions/shop` backend queries, all data arrays (news, rewards, outlet profile) will be hydrated statically via this file.

## Required Dependencies
*   `qrcode.react`: Standard React package to generate the SVG QR overlay during the redemption flow.

## Implementation Standard
*   **TDD Workflow:** Standard exceptions apply for UI prototypes using purely mock static data without integrated API hooks. Visual verification driven.
