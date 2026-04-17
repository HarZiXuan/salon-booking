# F&B Membership Logic Separation

**Goal**: Separate the F&B membership and backend logic from the default Salon path so that F&B data correctly writes to and reads from the CRM backend.

## 1. Session & Routing Update
- Modify `hooks/use-current-session.ts` so that it no longer ignores "fnb" in the `pathname` segments. 
- Remove `"fnb"` from the static array `["account", "fnb", "search", "login", "register"]` inside the `useCurrentSession` hook so that `merchantSlug` accurately captures `"fnb"`.

## 2. Environment Mapping
- Add `fnb:crm` to the `NEXT_PUBLIC_MERCHANT_TO_SHOP` variable in `.env.local`.
- This ensures that when the `merchantSlug` is `"fnb"`, the backend shop slug resolved by `getShopSlugFromMerchantUrl("fnb")` returns `"crm"`.
- By mapping to `"crm"`, the existing configuration gracefully pulls `STORE_CRM_PRODUCT_KEY` and `STORE_CRM_SECRET_KEY` for all API calls occurring in the F&B context.

## 3. Benefits / Outcomes
- **Complete Isolation**: Allows F&B consumers to have independent session states from the default default Salon path. 
- **Correct Data Destination**: Any API requests made under the `"fnb"` merchant slug will route payload requests directly into the correct CRM backend.

## 4. Future Implementation (Out of Scope for this Spec)
- Replacing the previously created dummy data inside `/fnb/wallet` and `/fnb/rewards` with live backend API queries utilizing the CRM slug.
