# F&B Membership Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the mobile layout of the F&B Membership page to utilize a compact header and a prominently centered action grid, while removing the sticky reservation footer.

**Architecture:** Modify `app/(store)/fnb/page.tsx` structurally. Replace the large hero layout with a clean header and a CSS grid for quick actions (News, Rewards, Reservation) placed right below it. This change specifically targets the `md:hidden` sections, ensuring it gracefully integrates without disturbing desktop views.

**Tech Stack:** Next.js, React, Tailwind CSS

---

### Task 1: Refactor Mobile Hero context to Minimized Header

**Files:**
- Modify: `app/(store)/fnb/page.tsx:45-88`

- [ ] **Step 1: Understand missing test context**
*(Note: As the project lacks a UI testing framework like Jest/RTL, and this is a strictly visual DOM structure redesign, we substitute programmatic TDD with visual layout verification checks. See steps below.)*

- [ ] **Step 2: Start local verification**
Run: `npm run dev`
*(Expected: The server handles verification on `http://localhost:3000/fnb`)*

- [ ] **Step 3: Write minimal implementation**
Replace the existing `Mobile Hero Layout` block (`{/* Mobile Hero Layout */}` up to `</div>`) with the minimized header template:

```tsx
            {/* Mobile Hero Layout (Minimized) */}
            <div className="md:hidden p-4 pb-2">
                <div className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full border border-gray-200 overflow-hidden bg-white shrink-0 shadow-sm flex items-center justify-center">
                            <span className="text-lg font-bold text-slate-800">Y</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold leading-tight text-gray-900">{fnbOutlet.name}</h1>
                            <div className="flex items-center text-[12px] text-gray-500 gap-2 font-medium mt-0.5">
                                <span className="text-green-500">Open</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span>{fnbOutlet.hours[0].hours}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
```

- [ ] **Step 4: Verify visually**
Check the mobile view physically/visually to confirm the minimized header has taken effect.

- [ ] **Step 5: Commit**
```bash
git add app/\(store\)/fnb/page.tsx
git commit -m "feat(fnb): minimize mobile hero header design"
```

### Task 2: Implement Main Navigation Grid

**Files:**
- Modify: `app/(store)/fnb/page.tsx:60-70`

- [ ] **Step 1: Write minimal implementation**
Directly under the newly added minimized header (still within the `md:hidden` wrapper or immediately following it), append the action layout grid. We will use `font-bold` allowing fallback to the standard font family (sans), strictly avoiding `font-serif`:

```tsx
            {/* Mobile Action Grid */}
            <div className="md:hidden px-4 pb-6">
                <div className="grid grid-cols-1 gap-3">
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => { const el = document.getElementById("news"); if (el) { const offset = 140; const bodyRect = document.body.getBoundingClientRect().top; const elementRect = el.getBoundingClientRect().top; window.scrollTo({ top: elementRect - bodyRect - offset, behavior: "smooth" }); } }} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                            <span className="font-bold text-[15px] text-slate-800">News</span>
                        </button>
                        <button onClick={scrollToRewards} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                            <span className="font-bold text-[15px] text-slate-800">Rewards</span>
                        </button>
                    </div>
                    <button onClick={scrollToReservation} className="bg-slate-900 rounded-xl p-4 shadow-md flex items-center justify-center hover:bg-slate-800 transition-colors">
                        <span className="font-bold text-[15px] text-white">Reserve a Table</span>
                    </button>
                </div>
            </div>
```

- [ ] **Step 2: Verify visually**
Confirm the fast-action buttons render and their scrolling mechanics are functioning properly.

- [ ] **Step 3: Commit**
```bash
git add app/\(store\)/fnb/page.tsx
git commit -m "feat(fnb): implement primary mobile action grid"
```

### Task 3: Remove Sticky Footer

**Files:**
- Modify: `app/(store)/fnb/page.tsx:302-308`

- [ ] **Step 1: Write minimal implementation**
Delete the exact block labeled `/* Mobile Sticky Footer */` which forces the Reserve block on screen:

```tsx
            {/* Mobile Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe bg-white border-t lg:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <button onClick={scrollToReservation} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-md">
                    Reserve Now
                </button>
            </div>
```

- [ ] **Step 2: Verify visually**
Observe that scrolling normally functions without the sticky footer blocking content.

- [ ] **Step 3: Commit**
```bash
git add app/\(store\)/fnb/page.tsx
git commit -m "feat(fnb): remove fix reserve now bottom navigation"
```
