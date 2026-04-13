# F&B Membership Mobile Redesign Design Spec

## Overview
The mobile layout for the F&B Membership page (`app/(store)/fnb/page.tsx`) needs to be optimized for a more efficient customer experience. The current mobile layout dedicates too much vertical space to the hero image and merchant information context. This redesign focuses on shrinking the header, prioritizing the primary action areas via a grid, and stripping unnecessary sticky elements to clear up the viewport.

## Layout Changes

### 1. Minimized Top Header (Mobile)
- **Visual Reduction**: The large `aspect-[4/3]` hero image will be replaced by a significantly more compact header. 
- **Merchant Details**: Display the merchant's logo alongside the title and concise details (address, operating hours) in a minimal arrangement.
- **Card Removal**: Remove the large VIP Membership Card placeholder visually dominating the very top of the mobile port.

### 2. Main Navigation Action Grid
- **Placement**: Placed directly underneath the new minimized header.
- **Layout**: A responsive CSS Grid containing large tappable buttons targeting:
  - **News & Promos**
  - **Rewards**
  - **Reserve a Table** 
- **Typography Standardization**: All cards and text components inside the new grid must inherit the project's global sans-serif typography. We will intentionally remove hardcoded or custom classes like `font-serif` from the mobile redesign elements to ensure it aligns seamlessly with the unified Salon Booking theme.

### 3. Click Behavior
- Tapping on the items within the new grid will act as anchor shortcuts, smoothly shifting UI focus (scrolling) down to the existing detailed sections on the page.

### 4. Remove Sticky Mobile Footer
- The fixed "Reserve Now" footer element (`div.fixed.bottom-0.lg:hidden`) will be entirely removed from the mobile view layout.
- The reservation action now exists prominently within the Action Grid.

## Technical Scope
- **Target Component:** `app/(store)/fnb/page.tsx`
- **CSS Strategy:** Utilize existing Tailwind utility classes.
- **Safeguard:** Preserve existing desktop views; the layout changes are scoped specifically to the mobile context (`md:hidden` wrappers).
