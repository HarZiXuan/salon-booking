# Fix Featured Offers Title Clipping Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow "Featured Offers" titles to display in full by removing fixed height and text truncation.

**Architecture:** Modify the UI component in `app/(store)/fnb/news/page.tsx` to use dynamic height and remove line-clamping on titles.

**Tech Stack:** React, Next.js, Tailwind CSS

---

### Task 1: Modify Featured Offers Card Layout

**Files:**
- Modify: `app/(store)/fnb/news/page.tsx`

- [ ] **Step 1: Remove height restriction and title truncation**

Modify the card container to use `min-h-[8rem]` instead of `h-32`, and remove `line-clamp-2` from the `<h3>` tag.

```tsx
// app/(store)/fnb/news/page.tsx

// From:
<button
    key={news.id}
    onClick={() => router.push(`/fnb/news/${news.id}`)}
    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all flex flex-row h-32 text-left w-full"
>
    <div
        className="w-28 flex-shrink-0 bg-slate-200 bg-cover bg-center"
        style={{ backgroundImage: `url(${news.image})` }}
    />
    <div className="p-4 flex flex-col flex-1 min-w-0 justify-center">
        <h3 className="text-base font-bold text-slate-800 line-clamp-2 leading-snug">{news.title}</h3>
        <p className="text-xs text-amber-600 font-medium mt-1">{news.date}</p>
        <p className="text-[13px] text-slate-500 mt-1 line-clamp-2">{news.description}</p>
    </div>
    <div className="flex items-center pr-3 text-slate-300 flex-shrink-0">
        <i className="ri-arrow-right-s-line text-2xl" />
    </div>
</button>

// To:
<button
    key={news.id}
    onClick={() => router.push(`/fnb/news/${news.id}`)}
    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all flex flex-row min-h-[8rem] text-left w-full"
>
    <div
        className="w-28 flex-shrink-0 bg-slate-200 bg-cover bg-center self-stretch"
        style={{ backgroundImage: `url(${news.image})` }}
    />
    <div className="p-4 flex flex-col flex-1 min-w-0 justify-center">
        <h3 className="text-base font-bold text-slate-800 leading-snug">{news.title}</h3>
        <p className="text-xs text-amber-600 font-medium mt-1">{news.date}</p>
        <p className="text-[13px] text-slate-500 mt-1 line-clamp-2">{news.description}</p>
    </div>
    <div className="flex items-center pr-3 text-slate-300 flex-shrink-0">
        <i className="ri-arrow-right-s-line text-2xl" />
    </div>
</button>
```

- [ ] **Step 2: Verify visually using browser**

Use the browser subagent to navigate to `http://localhost:3000/fnb/news` and take a screenshot to confirm that the title "New Launch: Mango Pomelo Sago" is fully visible.

- [ ] **Step 3: Commit**

```bash
git add app/(store)/fnb/news/page.tsx
git commit -m "fix: show full title in featured offers cards"
```
