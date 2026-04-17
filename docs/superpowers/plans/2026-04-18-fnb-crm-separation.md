# FNB CRM Separation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modify routing rules and environment mapping to route F&B paths to the `CRM` backend shop.

**Architecture:** We will adjust the `useCurrentSession` hook to stop treating `/fnb` as a static route so it uses `fnb` as the merchant slug. Then we will map `fnb` to `crm` in the environment so all backend logic seamlessly picks up CRM product and secret keys.

**Tech Stack:** Next.js, Typescript, Zustand

---

### Task 1: Environment Variable Update

**Files:**
- Modify: `.env.local`

- [ ] **Step 1: Write the implementation**

Open `.env.local` and add `,fnb:crm` to the `NEXT_PUBLIC_MERCHANT_TO_SHOP` key.

```env
NEXT_PUBLIC_MERCHANT_TO_SHOP=kapas-beauty-spa:service,yishun:yishun,crm:crm,fnb:crm
```

- [ ] **Step 2: Commit**

```bash
git add .env.local
git commit -m "chore: add fnb to crm mapping in environment variables"
```

### Task 2: Session Hook Route Update

**Files:**
- Modify: `hooks/use-current-session.ts:31-36`

- [ ] **Step 1: Write the implementation**

Modify `hooks/use-current-session.ts` to remove `"fnb"` from the ignored array.

```typescript
    // 2. Fall back to pathname segments
    if (!merchantSlug) {
        const firstSegment = pathname.split("/").filter(Boolean)[0] ?? null;
        // Ignore static route prefixes that aren't merchants (removed "fnb")
        if (firstSegment && !["account", "search", "login", "register"].includes(firstSegment)) {
            merchantSlug = firstSegment;
        }
    }
```

- [ ] **Step 2: Create a quick validation script**

Create a temporary script `test-fnb-env.ts` in the root:

```typescript
import { getShopSlugFromMerchantUrl } from "./lib/stores";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const slug = getShopSlugFromMerchantUrl("fnb");
if (slug === "crm") {
    console.log("PASS: fnb mapped to crm successfully!");
    process.exit(0);
} else {
    console.log("FAIL: mapped to", slug);
    process.exit(1);
}
```

- [ ] **Step 3: Run quick validation**

Run: `npx tsx test-fnb-env.ts`
Expected: `PASS: fnb mapped to crm successfully!`

- [ ] **Step 4: Cleanup**

```bash
rm test-fnb-env.ts
```

- [ ] **Step 5: Commit**

```bash
git add hooks/use-current-session.ts
git commit -m "feat: use fnb in useCurrentSession to enable crm isolation"
```
