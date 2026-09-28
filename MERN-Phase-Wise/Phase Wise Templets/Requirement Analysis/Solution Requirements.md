# Software Requirements Specification (SRS) — House Rent Management System

## 1. Functional Requirements

### 1.1 Authentication & Authorization
* **FR-01:** System shall permit registration with name, email, password, phone, and role selection (`Tenant`, `Property Owner`).
* **FR-02:** System shall securely hash passwords with `bcryptjs` before persisting to MongoDB.
* **FR-03:** System shall verify credentials during login and generate a signed JWT bearer token.
* **FR-04:** Private routes must reject unauthenticated requests with HTTP 401 and unauthorized roles with HTTP 403.

### 1.2 Property Catalog & Search
* **FR-05:** System shall display all properties that are both `approvalStatus === 'Approved'` and `availability === true`.
* **FR-06:** System shall filter properties dynamically by city/location, property type, bedroom count, and minimum/maximum monthly rent.
* **FR-07:** System shall sort properties by rent (Low to High, High to Low) and newest arrival.
* **FR-08:** Property details page shall render image carousel, specifications, verified host information, and complete amenities.

### 1.3 Property Management (Owner)
* **FR-09:** Property owners can post new property listings with title, description, location, rent, specs, amenities, and photos.
* **FR-10:** New properties must initialize in `approvalStatus: 'Pending'` until reviewed by an administrator.
* **FR-11:** Owners can modify details, delete listings, and toggle occupancy status (`Available` vs `Rented`).

### 1.4 Booking Workflow
* **FR-12:** Tenants can submit lease requests with preferred move-in date and notes.
* **FR-13:** Landlords can view incoming requests for their properties and update status to `Approved` or `Rejected`.
* **FR-14:** Tenants can monitor their booking history and cancel pending requests.

### 1.5 Administrative Moderation
* **FR-15:** Admins can view platform metrics (Total Users, Total Properties, Pending Approvals, Total Bookings).
* **FR-16:** Admins can review pending property submissions and Approve or Reject with feedback.
* **FR-17:** Admins can manage registered user accounts and modify permissions.

---

## 2. Non-Functional Requirements
* **Security:** OWASP compliance, salted password storage, zero exposure of `.env` secrets, role-guarded REST APIs.
* **Performance:** Sub-100ms response times on indexed MongoDB queries; Vite optimized SPA bundle (<500 KB gzip).
* **Usability:** Responsive Bootstrap 5 interface supporting mobile, tablet, and desktop viewports.
* **Reliability:** Automated In-Memory MongoDB Server fallback ensuring 100% test and evaluation uptime.
