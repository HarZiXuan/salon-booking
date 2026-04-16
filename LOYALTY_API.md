# Reward & Loyalty Program API Contract

This document defines the API contract for the Reward and Loyalty Program. The frontend currently uses mock data; the backend should implement these endpoints under the same base URL and auth pattern as the [Beauty Booking API](Beauty_Booking_API_Documentation.md).

**Base:** `{{base_url}}/shops/{{shop_slug}}/rewards/...`  
**Auth:** Every request requires request signing (X-Product-Key, X-Timestamp, X-Signature). Customer-specific endpoints require `Authorization: Bearer <token>`.

---

## Endpoints

### GET `/rewards`

Returns the catalog of rewards this merchant offers, along with the eligibility status for the current customer (if authenticated).

**Headers:** `Authorization: Bearer <token>` (optional).

**Response (200):**
```json
{
    "success": true,
    "data": {
        "campaigns": [
            {
                "reward": {
                    "id": "a0d55f8d...",
                    "reward_type": "cashback_voucher",
                    "value_type": "amount",
                    "value_amount": "5.00",
                    "costs": [
                        { "cost_type": "point", "cost_value": "50.00" }
                    ]
                },
                "is_eligible": false,
                "reasons": ["Insufficient points (required 50, balance 0)"]
            }
        ]
    }
}
```

---

### GET `/rewards/balance`

Returns the current customer's points and stamps balance for this shop.

**Headers:** `Authorization: Bearer <token>` required.

**Response (200):**
```json
{
    "success": true,
    "data": {
        "customer_id": 160,
        "name": "Member Name",
        "phone": "+601...",
        "points": 49900,
        "stamps": 0
    }
}
```

---

### POST `/rewards/redeem/send-otp`

Request an OTP to authorize a reward redemption.

**Headers:** `Authorization: Bearer <token>` required.

**Body (Form-Data):**
```json
{
  "reward_id": "a0d55f8d..."
}
```

**Response (200):** Success message.

---

### POST `/rewards/redeem`

Redeem a reward using the OTP received. Deducts points/stamps and issues the reward.

**Headers:** `Authorization: Bearer <token>` required.

**Body (Form-Data):**
```json
{
  "reward_id": "a0d55f8d...",
  "otp": "993800"
}
```

**Response (200):**
```json
{
    "success": true,
    "data": {
        "redemption_id": "...",
        "status": "completed",
        "voucher_code": "VCH-260413-XYZ",
        "voucher_use_url": "...",
        "qr_code_image_base64": "..."
    }
}
```

---

### GET `/rewards/redeemed`

Returns the history of rewards redeemed by the customer.

**Headers:** `Authorization: Bearer <token>` required.

**Response (200):** List of redemption records.

---

### GET `/rewards/redeemed/{{redeemed_reward_id}}`

Fetches details for a specific redemption, including the voucher code and QR data.

**Headers:** `Authorization: Bearer <token>` required.
