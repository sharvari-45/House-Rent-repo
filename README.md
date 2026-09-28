# House Rent — Full-Stack MERN Rental Management System

> **A complete, production-grade House Rental Management Platform built for B.Tech Academic Project & SkillWallet Evaluation.**

[![MERN Stack](https://img.shields.io/badge/Stack-MongoDB%20%7C%20Express%20%7C%20React%20%7C%20Node.js-green)](https://reactjs.org/)
[![Bootstrap 5](https://img.shields.io/badge/Styling-Bootstrap%205-purple)](https://getbootstrap.com/)
[![JWT Auth](https://img.shields.io/badge/Auth-JWT%20%2B%20Bcrypt-blue)](https://jwt.io/)
[![Zero-Config Demo](https://img.shields.io/badge/Database-Instant%20Demo%20Fallback-orange)](https://github.com/)

---

## 1. Project Introduction & Overview

**House Rent** is a modern, responsive full-stack web application that streamlines the rental housing ecosystem. It eliminates opaque middleman brokerage fees by enabling direct interaction between **Tenants** looking for rental homes, **Property Owners (Landlords)** listing residential spaces, and **Platform Administrators** who audit property authenticity, oversee user roles, and monitor rental transactions.

The project is developed using the industry-standard **MERN (MongoDB, Express.js, React.js, Node.js)** stack adhering strictly to clean modular architecture, RESTful API principles, JWT role-based access control, and responsive UI design with Bootstrap 5.

---

## 2. Key Objectives

1. **Direct Tenant-Landlord Connection:** Provide prospective tenants with transparent, verified housing discovery without paying middleman fees.
2. **Role-Based Security:** Strict authorization enforcement across 3 separate user roles: **Tenant**, **Property Owner**, and **Admin**.
3. **Admin Moderation & Quality Control:** Prevent fraudulent listings by requiring all owner-submitted properties to be reviewed and approved by an administrator before becoming publicly visible.
4. **Interactive Rental Booking Workflow:** Enable tenants to request leases with custom move-in dates and messages, allowing landlords to review, approve, or reject booking requests in real-time.
5. **Zero-Friction Evaluation:** Built-in auto-seeding and automatic fallback to an in-memory MongoDB server so examiners and mentors can run and evaluate the project immediately without external database dependencies.

---

## 3. Technology Stack

### Frontend
- **React.js 18/19:** Modern functional component architecture with React Hooks.
- **React Router DOM v6:** Client-side SPA routing and protected route guards.
- **Bootstrap 5 & Bootstrap Icons:** Mobile-responsive design, modern grid, badges, and modal components.
- **Axios:** REST API integration with automatic JWT Authorization header injection and response interceptors.
- **Custom CSS:** Polished hero banner, subtle card hover animations, and metric cards.

### Backend
- **Node.js & Express.js:** Modular MVC backend with controllers, services, middleware, and route handlers.
- **JSON Web Tokens (JWT):** Stateless bearer token authentication.
- **bcryptjs:** Salted password hashing (passwords are never stored in plain text).
- **CORS & Morgan:** Cross-origin request handling and HTTP request logging.
- **Centralized Error Handler:** Consistent JSON error envelopes for client clarity.

### Database
- **MongoDB & Mongoose ODM:** Schema validation, indexing, referential integrity (`ref: 'User'`, `ref: 'Property'`), and compound text searching.
- **Multi-Database Support:**
  - Local MongoDB (`mongodb://127.0.0.1:27017/house_rent`)
  - MongoDB Atlas Cloud Database
  - In-Memory MongoDB Server (`mongodb-memory-server`) automatic fallback for effortless zero-config offline demonstration.

---

## 4. User Roles & Capabilities

| Feature / Permission | Tenant | Property Owner | Admin |
| :--- | :---: | :---: | :---: |
| Browse & Search Approved Properties | ✅ | ✅ | ✅ |
| Filter by City, Type, Price, Bedrooms | ✅ | ✅ | ✅ |
| Submit Rental Booking Request | ✅ | ❌ | ❌ |
| View Personal Booking History & Status | ✅ | ❌ | ❌ |
| Cancel Own Pending Booking | ✅ | ❌ | ❌ |
| Add New Property Listing | ❌ | ✅ | ✅ |
| Edit / Delete Own Properties | ❌ | ✅ | ✅ (Any) |
| Toggle Property Availability (Available/Rented) | ❌ | ✅ | ✅ |
| Review Tenant Booking Requests (Approve/Reject) | ❌ | ✅ | ✅ |
| Access Admin Dashboard & Platform Analytics | ❌ | ❌ | ✅ |
| Moderate Listings (Approve/Reject with Feedback) | ❌ | ❌ | ✅ |
| Manage User Accounts & Role Permissions | ❌ | ❌ | ✅ |
| View System-Wide Bookings & Audits | ❌ | ❌ | ✅ |

---

## 5. System Architecture & Folder Structure

```
House-Rent/
├── client/                     # Frontend React SPA
│   ├── public/
│   ├── src/
│   │   ├── assets/             # Logos and static media
│   │   ├── components/         # Reusable UI components
│   │   │   ├── AlertMessage.jsx    # Alert and notification banners
│   │   │   ├── Footer.jsx          # Professional footer
│   │   │   ├── LoadingSpinner.jsx  # Loader spinner
│   │   │   ├── Navbar.jsx          # Responsive navigation bar with role badges
│   │   │   ├── PropertyCard.jsx    # Property card with tags, pricing, specs
│   │   │   └── ProtectedRoute.jsx  # Route guard for role-based authorization
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global authentication state (JWT + User)
│   │   ├── pages/
│   │   │   ├── AddEditProperty.jsx # Add / Edit property form
│   │   │   ├── AdminDashboard.jsx  # Admin analytics & moderation portal
│   │   │   ├── Home.jsx            # Landing page with hero search & featured listings
│   │   │   ├── Login.jsx           # Sign in with 1-click Demo Accounts
│   │   │   ├── NotFound.jsx        # 404 handler
│   │   │   ├── OwnerDashboard.jsx  # Landlord inventory & booking requests
│   │   │   ├── PropertyDetails.jsx # Image gallery, amenities, & booking form
│   │   │   ├── PropertyListings.jsx# Multi-faceted search and filter catalog
│   │   │   ├── Register.jsx        # Sign up (Tenant or Property Owner)
│   │   │   └── TenantDashboard.jsx # Tenant booking applications & history
│   │   ├── services/
│   │   │   └── api.js              # Configured Axios instance with interceptors
│   │   ├── styles/
│   │   │   └── custom.css          # Bootstrap custom enhancements
│   │   ├── App.jsx                 # Routing configuration
│   │   └── main.jsx                # Application root entry
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend REST API
│   ├── config/
│   │   └── db.js                   # Mongoose connection with in-memory fallback
│   ├── controllers/
│   │   ├── adminController.js      # Platform stats, approval & user moderation
│   │   ├── authController.js       # Register, login, profile management
│   │   ├── bookingController.js    # Rental booking requests & landlord actions
│   │   └── propertyController.js   # Property CRUD, availability, & search
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT protect & role authorize guards
│   │   └── errorHandler.js         # Centralized Express error handler
│   ├── models/
│   │   ├── Booking.js              # Booking Mongoose schema
│   │   ├── Property.js             # Property Mongoose schema
│   │   └── User.js                 # User Mongoose schema with bcrypt hashing
│   ├── routes/
│   │   ├── adminRoutes.js          # /api/admin endpoints
│   │   ├── authRoutes.js           # /api/auth endpoints
│   │   ├── bookingRoutes.js        # /api/bookings endpoints
│   │   └── propertyRoutes.js       # /api/properties endpoints
│   ├── utils/
│   │   ├── seed.js                 # Realistic seed data generator
│   │   └── test-workflow.js        # 14-step automated validation test suite
│   ├── .env                        # Active environment variables
│   ├── .env.example                # Environment variables template
│   ├── package.json
│   └── server.js                   # Express server entry point
│
├── .gitignore
├── .env.example
└── README.md
```

---

## 6. Pre-Configured Demo Accounts (Ready for Presentation)

On the **Login** page (`/login`), three **1-Click Quick Demo Login** buttons are provided to instantly log in as any role without typing:

| Role | Email Address | Password | Demonstration Scope |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@houserent.com` | `admin123` | Moderate pending properties, view system analytics, manage users, delete listings |
| **Property Owner** | `owner1@houserent.com` | `owner123` | Post new listings, edit own properties, toggle availability, approve/reject tenant bookings |
| **Tenant** | `tenant1@houserent.com` | `tenant123` | Explore homes, submit move-in booking requests, view rental history, cancel requests |

*(Additional accounts created: Owner 2: `owner2@houserent.com` / `owner123`, Tenant 2: `tenant2@houserent.com` / `tenant123`)*

---

## 7. Step-by-Step Installation & Running Guide

### Prerequisites
- **Node.js** (v18.x, v20.x, or v22+)
- **npm** (v9+ or v10+)
- *(Optional)* Local **MongoDB** or **MongoDB Atlas** URI. If you do not have MongoDB installed, the application will automatically initialize an In-Memory MongoDB Server with all sample data preloaded!

---

### Step 1: Clone or Navigate to the Project

Open your terminal or PowerShell and navigate to the project directory:
```bash
cd House-Rent
```

---

### Step 2: Start the Backend Server

```bash
cd server
npm install
node server.js
```
*(Alternative watch mode: `npm run dev`)*

**Terminal Output Confirmation:**
```
====================================================
🚀 House Rent Management Server is LIVE on port 5000
📡 Base API URL: http://localhost:5000/api
💡 Health Check: http://localhost:5000/api/health
====================================================
[MongoDB] In-Memory MongoDB connected successfully at mongodb://127.0.0.1:xxxxx/
[Seed] Seeding sample data into database...
[Seed] Created default users (Admin, 2 Owners, 2 Tenants)
[Seed] Created 8 realistic property listings.
[Seed] Created 3 sample booking requests.
[Seed] Database seeding completed successfully!
```

---

### Step 3: Start the Frontend Client

Open a **new terminal tab or window**:
```bash
cd House-Rent/client
npm install
npm run dev
```

**Output:**
```
  VITE v5.4.x  ready in 300 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser and visit: **`http://localhost:5173`**

---

## 8. REST API Reference

### Authentication Endpoints (`/api/auth`)
- `POST /api/auth/register` — Register a new account (`name`, `email`, `password`, `role`, `phone`).
- `POST /api/auth/login` — Sign in and obtain JWT token.
- `GET /api/auth/me` — Retrieve current authenticated user profile *(Protected)*.
- `PUT /api/auth/profile` — Update user profile details *(Protected)*.

### Properties Endpoints (`/api/properties`)
- `GET /api/properties` — List approved & available properties with search queries (`search`, `location`, `minPrice`, `maxPrice`, `propertyType`, `bedrooms`, `sort`).
- `GET /api/properties/:id` — View full details of a specific property.
- `GET /api/properties/owner/my-properties` — Get all properties owned by logged-in user *(Owner only)*.
- `POST /api/properties` — Add a new property (starts in `Pending` approval status) *(Owner only)*.
- `PUT /api/properties/:id` — Edit an existing property listing *(Owner only)*.
- `DELETE /api/properties/:id` — Delete a property listing *(Owner / Admin)*.
- `PATCH /api/properties/:id/availability` — Toggle between Available and Rented *(Owner only)*.

### Booking Endpoints (`/api/bookings`)
- `POST /api/bookings` — Submit a rental booking request (`propertyId`, `moveInDate`, `message`) *(Tenant only)*.
- `GET /api/bookings/my-bookings` — Get all bookings submitted by the logged-in tenant *(Tenant only)*.
- `PATCH /api/bookings/:id/cancel` — Cancel a pending booking request *(Tenant only)*.
- `GET /api/bookings/owner-requests` — Get all incoming booking requests for owned properties *(Owner only)*.
- `PATCH /api/bookings/:id/status` — Approve or Reject a booking request *(Owner only)*.

### Administrator Endpoints (`/api/admin`)
- `GET /api/admin/dashboard-stats` — System overview counts (Users, Properties, Approvals, Bookings) *(Admin only)*.
- `GET /api/admin/properties` — View all system listings with status filter *(Admin only)*.
- `PATCH /api/admin/properties/:id/review` — Approve or Reject a listing with optional feedback *(Admin only)*.
- `DELETE /api/admin/properties/:id` — Force delete any listing *(Admin only)*.
- `GET /api/admin/users` — Directory of all registered users *(Admin only)*.
- `PATCH /api/admin/users/:id/role` — Update a user's role *(Admin only)*.
- `DELETE /api/admin/users/:id` — Delete user and cascade delete their records *(Admin only)*.
- `GET /api/admin/bookings` — View all booking requests across the platform *(Admin only)*.

---

## 9. Automated Testing & Verification Suite

An automated end-to-end verification script is included to test all modules:

```bash
cd server
node utils/test-workflow.js
```

**Test Execution Results:**
```
========================================================
🧪 Starting End-to-End Automated Validation for House Rent
========================================================
✅ [PASS] Server Health Check
✅ [PASS] Public Properties retrieval
✅ [PASS] Filter Properties by Location (Bangalore)
✅ [PASS] Admin Login
✅ [PASS] Owner Login
✅ [PASS] Tenant Login
✅ [PASS] Rejection of invalid password credentials
✅ [PASS] Forbidden 403 for Tenant attempting Admin route
✅ [PASS] Owner posts property (status set to Pending for admin review)
✅ [PASS] Admin approves pending property listing
✅ [PASS] Tenant submits booking request for approved property
✅ [PASS] Owner approves tenant booking request
✅ [PASS] Admin Dashboard analytics aggregation
✅ [PASS] Owner deletes property listing
========================================================
📊 Test Results: 14 Passed, 0 Failed
========================================================
🎉 ALL SYSTEM MODULES & ROLES FUNCTIONING 100% PERFECTLY!
```

---

## 10. Troubleshooting & FAQs

#### Q1: Do I need to install MongoDB on my PC?
**No.** If MongoDB is not installed locally on your system, the server automatically boots an in-memory MongoDB server (`mongodb-memory-server`) and pre-seeds realistic sample properties, users, and bookings. If you prefer to use your own MongoDB Atlas cluster, simply paste your connection string into `server/.env` as `MONGO_URI`.

#### Q2: How do I test the Admin Approval workflow?
1. Log in as **Owner** (`owner1@houserent.com`).
2. Click **"Post Property"** and fill out the form. The status will be **Pending**.
3. Sign out and log in as **Admin** (`admin@houserent.com`).
4. Go to **Admin Portal**, view the property under **"Pending Approvals"**, and click **"Approve"**.
5. Log out or browse **"Explore Properties"** — the listing is now publicly visible to all tenants!

#### Q3: How do I test the Tenant Booking workflow?
1. Log in as **Tenant** (`tenant1@houserent.com`).
2. Click on any property card to view its details.
3. Select your intended move-in date and click **"Send Booking Request"**.
4. Check **"My Bookings"** to see your application in `Under Review` status.
5. Log in as the property **Owner** (`owner1@houserent.com`).
6. Go to **Owner Dashboard** > **"Tenant Booking Requests"** and click **"Approve"**!

---

## 11. Academic Evaluation & Submission Details
- **Project Title:** House Rent Management System
- **Specification:** SkillWallet Full-Stack Web Development Project
- **Mentor:** Himanshu Mishra
- **Candidate Stack:** React.js, Node.js, Express.js, MongoDB (MERN)
