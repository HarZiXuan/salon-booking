# Missing Backend API Integrations

Currently, the Zaloon/Salon Booking frontend has fully built UI layouts for various customer account pages. However, the data inside them is either mocked, read-only from the login token, or uses temporary browser local storage. 

Before launching the complete customer portal, the following Backend APIs need to be created and linked to the frontend.

---

## 1. User Profile Management (`/account/profile`)
Currently, the profile page only reads the user's name, email, and phone from the `userStore` (which comes from the JWT payload during login). 

**Missing Endpoints needed:**
- **`GET /api/v1/customers/profile`**
  - **Purpose**: Fetch the latest user details on page load rather than relying on stale token data.
  - **Response**: Name, phone, email, gender, birthday, and avatar image link.
- **`PUT /api/v1/customers/profile`**
  - **Purpose**: To allow the user to click "Save Changes" and update their name, email, or phone number in the database.
- **`POST /api/v1/customers/avatar`** (Optional)
  - **Purpose**: For uploading a profile photo.

## 2. Appointments History (`/account/appointments`)
Currently, the appointments page looks at the browser's `localStorage` (`my-bookings`) to see what venues the user booked at, and then blindly performs a `GET` request to each venue separately. 

**Missing Endpoints needed:**
- **`GET /api/v1/customers/bookings`**
  - **Purpose**: A single unified endpoint that returns the authenticated customer's entire booking history across *all* merchants.
  - **Response**: List of bookings including status (Pending, Confirmed, Completed, Cancelled), Total Amount, Start Time, Service Name, and Merchant/Venue details. 

## 3. Memberships & Loyalty Centralization (`/account/membership` & `/account/wallet`)
Right now, the membership page scans `localStorage` for merchants the user visited, and fires off multiple API calls (`getPoints`, `getMyVouchers`) for every single merchant. 

**Missing Endpoints needed:**
- **`GET /api/v1/customers/memberships`**
  - **Purpose**: Return a single payload of all memberships the user has unlocked across all merchants, including their point balances, tier level (Silver/Gold), and claimed voucher count without having to query each shop one by one.

## 4. Product Orders (`/account/orders`)
The orders layout exists, but no logic relies on a backend yet.

**Missing Endpoints needed:**
- **`GET /api/v1/customers/orders`**
  - **Purpose**: If merchants sell physical products/e-commerce goods, this endpoint will return the purchase history, tracking status, and receipts.

## 5. Account Settings & Security (`/account/settings`)
The settings page has UI toggles for Email/SMS notifications and a button to change passwords.

**Missing Endpoints needed:**
- **`PUT /api/v1/customers/settings`**
  - **Purpose**: Save user preferences like `email_notifications: true`, `sms_reminders: false`.
- **`POST /api/v1/customers/change-password`**
  - **Purpose**: Allows the user to provide their old password and securely set a new one.

---

### Summary Checklist for Backend Developers:
- [ ] `GET /customers/profile`
- [ ] `PUT /customers/profile`
- [ ] `GET /customers/bookings`
- [ ] `GET /customers/memberships`
- [ ] `GET /customers/orders`
- [ ] `PUT /customers/settings`
- [ ] `POST /customers/change-password`

*Once these APIs are available and accept the standard MD5 signature/Token Auth headers, the frontend `app/actions` files can be updated to point to them!*
