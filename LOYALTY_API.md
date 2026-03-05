# Loyalty Program API Contract

This document defines the API contract for the Customer Loyalty Program (CLP). The frontend currently uses mock data; the backend should implement these endpoints under the same base URL and auth pattern as the [Beauty Booking API](Beauty_Booking_API_Documentation.md).

**Base:** `{{base_url}}/shops/{{shop_slug}}/...`  
**Auth:** All loyalty customer endpoints require `Authorization: Bearer <token>` (same as `/customers/me`). Request signing (X-Product-Key, X-Timestamp, X-Signature) applies to every request.

---

## Endpoints

### GET `/loyalty/points`

Returns the current customer's points balance for this shop.

**Headers:** `Authorization: Bearer <token>` required.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "points": 150,
    "merchantName": "Kapas Beauty Spa"
  }
}
```

---

### GET `/loyalty/vouchers`

Returns the catalog of vouchers this merchant offers. Optionally filter to only the customer's claimed vouchers.

**Headers:** `Authorization: Bearer <token>` optional for catalog; required when `customer_claimed=1`.

**Query parameters (optional):**
- `customer_claimed=1` – return only vouchers claimed by the current customer for this shop.

**Response (200) – catalog:**
```json
{
  "success": true,
  "data": {
    "vouchers": [
      {
        "id": "v1",
        "name": "RM10 Off",
        "description": "RM10 off your next visit",
        "pointsCost": 100,
        "type": "fixed",
        "value": "10"
      }
    ]
  }
}
```

**Response (200) – my vouchers:** Same shape but each item may include `code`, `validUntil`, `claimedAt` (i.e. claimed voucher format).

---

### POST `/loyalty/redeem`

Redeem points for a voucher. Deducts points and issues one voucher instance to the customer.

**Headers:** `Authorization: Bearer <token>` required.

**Body (JSON):**
```json
{
  "voucher_id": "v1"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "voucherCode": "SPA-XYZ-123",
    "validUntil": "2026-12-31",
    "voucher": {
      "id": "v1",
      "name": "RM10 Off",
      "description": "RM10 off your next visit",
      "pointsCost": 100,
      "type": "fixed",
      "value": "10",
      "code": "SPA-XYZ-123",
      "validUntil": "2026-12-31",
      "claimedAt": "2026-03-05T10:00:00Z"
    }
  }
}
```

**Error (400):** Insufficient points or invalid `voucher_id`.

---

## Types reference

- **Voucher type:** `fixed` (e.g. RM off), `percent` (e.g. 10% off), `free_service` (free item/service).
- **value:** Optional; e.g. "10" for RM10, "15" for 15%.
- **validUntil:** ISO date or datetime string for voucher expiry.

---

## Optional (for later)

- `POST /loyalty/points/earn` or backend auto-awards points on booking completion.
- `GET /loyalty/me` – returns both points and claimed vouchers in one call.
