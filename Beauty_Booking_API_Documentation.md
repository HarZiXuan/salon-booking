# Beauty Booking API Documentation

## 1. Base Setup & Variables
The API uses variables in the URL paths. Before making requests, you will need to replace these placeholders:
*   **`{{base_url}}`**: The base URL of the API. In the collection, it defaults to: `http://localhost/erptw_laravel11/public/api/v1`
*   **`{{shop_slug}}`**: The identifier for the specific shop. In the collection, it defaults to: `beauty`

Most endpoints follow this base structure: `{{base_url}}/shops/{{shop_slug}}/...`

## 2. Required Authentication & Headers (Crucial!)
The API uses a **custom signature authentication mechanism** that must be included in the headers for **every** request. According to the `prerequest` script in the Postman collection, you need a `productKey` and a `secretKey`.

For every request, you must compute an MD5 signature and include the following headers:
*   `X-Product-Key`: Your product key.
*   `X-Timestamp`: The current UNIX timestamp in seconds (e.g., `1704614400`).
*   `X-Signature`: An MD5 hash string.
    *   **How it's generated:** `MD5(productKey + secretKey + timestamp + body)`
    *   *Note: If there are parameters, the `body` is a JSON string of all query and body parameters merged and sorted alphabetically by key. **Crucially, if there are no parameters, the `body` must be an empty string `""` (not `"{}"`).***
*   `Accept`: `application/json` (Standard header)

For **Customer** endpoints (like viewing your profile or logging out), you also need a standard Bearer Token in the headers after logging in:
*   `Authorization`: `Bearer <your_token>`

---

## 3. Available Endpoints

Here is the list of all available endpoints grouped by their function:

### **Shop Information**
* **Get Shop Info**
  * **Method:** `GET`
  * **Endpoint:** `{{base_url}}/shops/{{shop_slug}}`
  * **Description:** Retrieves shop information including name, address, map URLs, and working hours.

### **Services & Categories**
* **Get Services List**
  * **Method:** `GET`
  * **Endpoint:** `{{base_url}}/shops/{{shop_slug}}/services`
  * **Description:** Retrieves a list of available spa services.
  * **Query Parameters (Optional):** `category` (e.g., `?category=1221`).
* **Get Category**
  * **Method:** `GET`
  * **Endpoint:** `{{base_url}}/shops/{{shop_slug}}/categories`
  * **Description:** Retrieves a list of service categories.

### **Specialists (Staff)**
* **Get All Specialists**
  * **Method:** `GET`
  * **Endpoint:** `{{base_url}}/shops/{{shop_slug}}/specialists/all`
  * **Description:** Retrieves a list of all specialists working at the shop.
* **Get Specialists for a specific Service**
  * **Method:** `POST`
  * **Endpoint:** `{{base_url}}/shops/{{shop_slug}}/specialists`
  * **Description:** Retrieves available specialists who provide the selected service.
  * **Body (Form-Data):**
    * `service_id` (required, e.g., "76")
    * `gender` (e.g., "Female")

### **Availability**
* **Get Available Timeslots**
  * **Method:** `POST`
  * **Endpoint:** `{{base_url}}/shops/{{shop_slug}}/availability/timeslots`
  * **Description:** Get available timeslots for a specific date, service, and specialist.
  * **Body (Form-Data):**
    * `service_id` (required)
    * `specialist_id` (required)
    * `date` (format: `YYYY-MM-DD`, e.g., "2026-01-09")

### **Bookings**
* **Create Booking**
  * **Method:** `POST`
  * **Endpoint:** `{{base_url}}/shops/{{shop_slug}}/bookings`
  * **Description:** Creates a new booking.
  * **Body (Form-Data):**
    * `service_id`
    * `staff_id`
    * `date` (format: `YYYY-MM-DD`)
    * `start_time` (format: `HH:mm`)
    * `name` (customer name)
    * `number` (customer phone number)
    * `gender`
    * `notes` (optional)
    * `email` (optional)
* **Get Booking Details**
  * **Method:** `GET`
  * **Endpoint:** `{{base_url}}/shops/{{shop_slug}}/bookings/{{booking_id}}`
  * **Description:** Retrieve details of a specific booking using its ID.

### **Customer / User Authentication**

#### 1. Request Registration OTP
> Call this **before** `Register` to verify the customer's phone number.

* **Method:** `POST`
* **Endpoint:** `{{base_url}}/shops/{{shop_slug}}/customers/register/send-otp`
* **Auth required:** No (standard signing headers only)
* **Body (Form-Data):**

  | Field | Type | Required | Description |
  |-------|------|----------|-------------|
  | `contact` | string | ✅ | Full phone number with country code, e.g. `+60123456789` or `+6591234567` |

* **Success Response (200):**
  ```json
  { "success": true, "message": "OTP sent successfully" }
  ```
* **Error Responses:**

  | HTTP | Condition | Example message |
  |------|-----------|-----------------|
  | 422 | `contact` missing or invalid format | `"The contact field is required."` |
  | 429 | Rate limit exceeded (60 req/min) | `"Too Many Attempts."` |

* **Frontend behaviour:** After a successful call, the **Send OTP** button is disabled for **30 seconds** (client-side cooldown) to prevent accidental spam.

---

#### 2. Register
> Submit after the user has received and entered their OTP.

* **Method:** `POST`
* **Endpoint:** `{{base_url}}/shops/{{shop_slug}}/customers/register`
* **Auth required:** No (standard signing headers only)
* **Body (Form-Data):**

  | Field | Type | Required | Description |
  |-------|------|----------|-------------|
  | `contact` | string | ✅ | Same number used to request the OTP |
  | `password` | string | ✅ | Min 6 characters |
  | `password_confirmation` | string | ✅ | Must match `password` |
  | `otp` | string | ✅ | 4–8 digit code received via SMS |
  | `name` | string | — | Customer display name |
  | `email` | string | — | Valid email address |
  | `gender` | string | — | `male` / `female` |
  | `birthday` | string | — | `YYYY-MM-DD` |

* **Success Response (200):**
  ```json
  {
    "success": true,
    "data": {
      "token": "<bearer_token>",
      "customer": { "id": 160, "name": "John", "contact": "+60123456789" }
    }
  }
  ```
* **Error Responses:**

  | HTTP | Condition | Example message |
  |------|-----------|-----------------|
  | 422 | OTP invalid or expired | `"The OTP is invalid."` |
  | 422 | Validation failed | `"The contact has already been taken."` |

---

#### 3. Login
* **Method:** `POST`
* **Endpoint:** `{{base_url}}/shops/{{shop_slug}}/customers/login`
* **Body (Form-Data):** `contact` (phone number with country code), `password`, `email` (optional).
* **Returns:** A bearer token used for authenticated endpoints.

---

#### 4. Customer Info *(Requires Bearer Token)*
* **Method:** `GET`
* **Endpoint:** `{{base_url}}/shops/{{shop_slug}}/customers/me`
* **Description:** Fetches profile information for the currently logged-in customer.

---

#### 5. Logout *(Requires Bearer Token)*
* **Method:** `POST`
* **Endpoint:** `{{base_url}}/shops/{{shop_slug}}/customers/logout`
* **Description:** Invalidates the current bearer token.

### **Reward & Loyalty Program**
These endpoints handle points, vouchers, and redemptions.

* **Get Available Rewards**
  * **Method:** `GET`
  * **Endpoint:** `{{base_url}}/shops/{{shop_slug}}/rewards`
  * **Description:** Retrieves the catalog of rewards and their eligibility for the current user.
* **Get Point Balance** *(Requires Bearer Token Auth)*
  * **Method:** `GET`
  * **Endpoint:** `{{base_url}}/shops/{{shop_slug}}/rewards/balance`
  * **Description:** Fetches the customer's current point and stamp balance.
* **Send Reward Redemption OTP** *(Requires Bearer Token Auth)*
  * **Method:** `POST`
  * **Endpoint:** `{{base_url}}/shops/{{shop_slug}}/rewards/redeem/send-otp`
  * **Body (Form-Data):** `reward_id` (required).
  * **Description:** Sends an OTP to the customer's phone to authorize a reward redemption.
* **Redeem Reward** *(Requires Bearer Token Auth)*
  * **Method:** `POST`
  * **Endpoint:** `{{base_url}}/shops/{{shop_slug}}/rewards/redeem`
  * **Body (Form-Data):** `reward_id` (required), `otp` (required).
  * **Description:** Authorizes the redemption of a reward using an OTP.
* **Get Redemption History** *(Requires Bearer Token Auth)*
  * **Method:** `GET`
  * **Endpoint:** `{{base_url}}/shops/{{shop_slug}}/rewards/redeemed`
  * **Description:** Retrieves a list of all rewards previously redeemed by the customer.
* **Get Redeemed Reward Details** *(Requires Bearer Token Auth)*
  * **Method:** `GET`
  * **Endpoint:** `{{base_url}}/shops/{{shop_slug}}/rewards/redeemed/{{redeemed_reward_id}}`
  * **Description:** Fetches detailed information (including voucher codes and QR images) for a specific redemption.
