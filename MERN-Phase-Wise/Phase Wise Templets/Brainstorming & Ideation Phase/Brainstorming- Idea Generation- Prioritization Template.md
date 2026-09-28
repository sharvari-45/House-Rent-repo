# Brainstorming, Idea Generation & Feature Prioritization — House Rent

## 1. Brainstormed Feature Ideas
1. Multi-role authentication (Tenant, Landlord, Admin) using JSON Web Tokens.
2. Direct rental booking request system with custom move-in date picker.
3. Multi-faceted property catalog search (City, Rent range, Property Type, Bedrooms, Sorting).
4. Administrator review queue ensuring quality moderation before listings go live.
5. In-Memory database fallback for instant local demonstration without external database setup.
6. Real-time availability toggling (Available / Rented) directly from the Owner Dashboard.
7. Landlord contact card display with verified badges.

---

## 2. MoSCoW Prioritization Matrix

### Must Have (P0 — Core MVP)
* User Registration and Login with role assignment (`Tenant`, `Property Owner`, `Admin`).
* Salted password encryption using `bcryptjs` and stateless session handling via JWT.
* Full CRUD for Properties by verified owners.
* Admin Listing Moderation workflow (`Pending` ➔ `Approved` / `Rejected`).
* Tenant rental booking submission and cancellation workflow.
* Landlord request approval / rejection portal.

### Should Have (P1 — Enhanced User Experience)
* Multi-criteria search and filter engine (City, Price min/max, Bed count, Sorting).
* Dynamic metric cards on Owner and Admin Dashboards.
* High-resolution image galleries with thumbnail selection.
* Centralized Express error handler and toast notification banners.

### Could Have (P2 — Future Iterations)
* Automated email notifications for lease approval.
* Google Maps API geolocation integration.
* In-app chat messaging between tenant and host.

### Won't Have (Out of Scope for Initial Release)
* Online rent payment gateway transactions (due to financial compliance).
* Physical key handover scheduling.
