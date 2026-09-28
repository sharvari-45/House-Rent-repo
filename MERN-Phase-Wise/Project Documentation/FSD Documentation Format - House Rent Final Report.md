# Full-Stack Development (FSD) Final Project Report — House Rent

**Project Title:** House Rent Management System  
**Track:** Full-Stack Web Development (MERN Stack)  
**Student:** Sharvari  
**Mentor:** Himanshu Mishra (himanshu+mentor@thesmartbridge.com)  
**Platform:** SkillWallet (TheSmartBridge)  
**GitHub Repository:** [https://github.com/sharvari-45/House-Rent-repo](https://github.com/sharvari-45/House-Rent-repo)  

---

## Executive Summary
**House Rent** is an end-to-end full-stack web application engineered using MongoDB, Express.js, React.js, and Node.js. The platform bridges the gap between prospective tenants and residential property owners by providing transparent, broker-free real estate listings, multi-criteria search filters, automated administrative moderation, and interactive lease booking workflows.

---

## Table of Contents
1. Introduction & Problem Statement
2. Objectives & Project Scope
3. Technology Stack & Architecture
4. System Features & Role-Based Workflows
5. Database Design & Schema Models
6. REST API Specification
7. Testing, Security & Verification
8. Conclusion & Future Enhancements

---

## 1. Introduction & Problem Statement
Finding housing in urban centers like Bangalore, Mumbai, Pune, and Hyderabad has historically been plagued by exorbitant broker fees, unverified listings, and lack of accountability. House Rent solves this through a verified, transparent, and direct tenant-landlord marketplace backed by administrative quality gates.

---

## 2. Objectives & Project Scope
* Create responsive React web application with Bootstrap 5.
* Enforce 3 distinct roles: **Tenant**, **Property Owner**, and **Administrator**.
* Protect sensitive endpoints with bcrypt password hashing and JWT token middleware.
* Require administrator approval for all new property listings before public broadcast.
* Provide an interactive rental request pipeline with real-time status management.

---

## 3. Technology Stack & Architecture
* **Frontend:** React.js, Bootstrap 5, Bootstrap Icons, Axios, React Router v6.
* **Backend:** Node.js, Express.js, RESTful APIs, JWT, bcryptjs, CORS, Morgan.
* **Database:** MongoDB, Mongoose ODM, with MongoMemoryServer for instant zero-config evaluation.

---

## 4. System Features & Roles

### 4.1 Tenant Role
* Search and filter verified homes by city, property type, price, and bedrooms.
* View complete property galleries, specifications, amenities, and host contact.
* Submit rental booking requests with custom move-in dates and messages.
* Monitor personal booking history and cancel pending requests.

### 4.2 Property Owner Role
* List houses, apartments, villas, and PGs with photo URLs and amenity tags.
* Toggle property occupancy (`Available` vs `Rented`).
* Review incoming tenant booking applications and mark them as `Approved` or `Rejected`.
* Edit or delete own properties from the dedicated Landlord Dashboard.

### 4.3 Administrator Role
* Moderate newly submitted properties in an approval queue.
* Inspect platform-wide user directory and change user roles.
* Audit all booking transactions across the platform.
* Monitor live metrics (Users, Properties, Approvals, Bookings).

---

## 5. Database Schema
* **Users Collection:** `name`, `email` (unique), `password` (hashed), `role` (`Tenant | Property Owner | Admin`), `phone`, `timestamps`.
* **Properties Collection:** `owner` (ref: User), `title`, `description`, `location`, `address`, `rent`, `propertyType`, `bedrooms`, `bathrooms`, `amenities`, `images`, `availability`, `approvalStatus` (`Pending | Approved | Rejected`), `timestamps`.
* **Bookings Collection:** `tenant` (ref: User), `property` (ref: Property), `owner` (ref: User), `moveInDate`, `message`, `status` (`Pending | Approved | Rejected | Cancelled`), `timestamps`.

---

## 6. Testing & Security
* Automated integration test suite passed 14/14 test cases covering registration, login, role authorization, property CRUD, admin approval, and booking lifecycles.
* Zero exposure of sensitive `.env` credentials in source control.
