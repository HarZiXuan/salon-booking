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
    *   *Note: If there are parameters, the `body` is a JSON string of all query and body parameters merged and sorted alphabetically by key. If there are no parameters, the `body` is treated as an empty string.*
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
* **Login**
  * **Method:** `POST`
  * **Endpoint:** `{{base_url}}/shops/{{shop_slug}}/customers/login`
  * **Body (Form-Data):** `contact` (phone number), `password`, `email` (optional).
  * **Returns:** A bearer token used for the endpoints below.
* **Register**
  * **Method:** `POST`
  * **Endpoint:** `{{base_url}}/shops/{{shop_slug}}/customers/register`
  * **Body (Form-Data):** `contact`, `password`, `password_confirmation`, `name` (optional), `email` (optional), `gender` (optional), `birthday` (optional).
* **Customer Info** *(Requires Bearer Token Auth)*
  * **Method:** `GET`
  * **Endpoint:** `{{base_url}}/shops/{{shop_slug}}/customers/me`
  * **Description:** Fetches profile information for the currently logged-in customer.
* **Logout** *(Requires Bearer Token Auth)*
  * **Method:** `POST`
  * **Endpoint:** `{{base_url}}/shops/{{shop_slug}}/customers/logout`
  * **Description:** Logs out the currently authenticated user.
