# Design: Fix Featured Offers Title Clipping

## Problem
The "Featured Offers" section on the F&B News page (`app/(store)/fnb/news/page.tsx`) uses a fixed height of `h-32` and `line-clamp-2` for titles. For longer titles like "New Launch: Mango Pomelo Sago", the text is cut off or truncated, preventing users from seeing the full name of the offer.

## Requirements
- Show the full title of all featured offers.
- Maintain a clean and consistent mobile-first UI.
- Ensure the card layout doesn't break when content expands.

## Proposed Changes

### 1. Update `app/(store)/fnb/news/page.tsx`
- **Container**: Change the card `<button>` from `h-32` to `min-h-[8rem]`.
- **Title**: Remove `line-clamp-2` from the `<h3>` title tag.
- **Description**: Keep `line-clamp-2` for now to prevent the card from becoming too large if the description is very long, but since the container is `min-h`, it will accommodate the full title.

## Verification Plan
1. **Visual Test**: Manually verify on `http://localhost:3000/fnb/news` that the "Mango Pomelo Sago" title is fully visible.
2. **Regression Test**: Ensure other news items still look good.
3. **Responsive Test**: Ensure the cards look correct across different screen widths.
