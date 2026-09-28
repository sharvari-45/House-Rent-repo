# Data Flow Diagrams (DFD) & Agile User Stories — House Rent

## 1. Agile User Stories

### User Story 1: Property Discovery
> **As a** prospective tenant,  
> **I want to** search for rental properties by city and price range,  
> **So that** I can find houses that meet my budget without visiting brokers in person.

### User Story 2: Listing Residential Space
> **As a** property landlord,  
> **I want to** post my flat with amenities, photos, and rent,  
> **So that** genuine tenants can discover my property directly.

### User Story 3: Admin Moderation
> **As an** administrator,  
> **I want to** audit newly submitted properties in a moderation queue,  
> **So that** only legitimate, verified listings appear publicly on the platform.

### User Story 4: Rental Application & Approval
> **As a** tenant,  
> **I want to** submit a lease booking with my desired move-in date,  
> **So that** the landlord can review my application and approve my stay.

---

## 2. Data Flow Diagram (DFD) Level 0 (Context Level)

```mermaid
flowchart TD
    Tenant(["Tenant"]) -->|"1. Registration / Login credentials"| System["House Rent System (MERN Web App)"]
    Tenant -->|"2. Browse filters & Booking Request"| System
    System -->|"3. Rental listings & Booking Status updates"| Tenant

    Owner(["Property Owner"]) -->|"4. Post Property & Manage Availability"| System
    Owner -->|"5. Approve / Reject Booking Requests"| System
    System -->|"6. Tenant applications & Property Status"| Owner

    Admin(["Administrator"]) -->|"7. Approve / Reject Listings & Manage Users"| System
    System -->|"8. Platform Analytics & Pending Review Queue"| Admin
```

---

## 3. Data Flow Diagram (DFD) Level 1

```mermaid
flowchart TD
    User(["Client / Browser"]) -->|"HTTP POST /api/auth/login"| P1["1.0 Auth Controller"]
    P1 -->|"Query & Password Verification"| D1[("User Collection")]
    P1 -->|"Return JWT Bearer Token"| User

    Owner(["Property Owner"]) -->|"POST /api/properties"| P2["2.0 Property Controller"]
    P2 -->|"Create listing (status: Pending)"| D2[("Property Collection")]

    Admin(["Administrator"]) -->|"PATCH /api/admin/properties/:id/review"| P3["3.0 Admin Moderation"]
    P3 -->|"Update status to Approved"| D2

    Tenant(["Tenant"]) -->|"POST /api/bookings"| P4["4.0 Booking Controller"]
    P4 -->|"Create booking record (status: Pending)"| D3[("Booking Collection")]
    Owner -->|"PATCH /api/bookings/:id/status"| P4
    P4 -->|"Update booking status to Approved"| D3
```
