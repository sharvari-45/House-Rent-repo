# Proposed Solution & User Interface Flow — House Rent

## 1. System Modules
The proposed solution comprises five tightly integrated subsystems:
1. **Authentication & Session Subsystem:** User registration, bcrypt password hashing, JWT stateless bearer token validation, and role identification.
2. **Catalog & Search Subsystem:** High-speed catalog search with multi-parameter filtering (Location, Min/Max Price, Property Type, Bedroom count, Newest/Price sort).
3. **Landlord Inventory Subsystem:** Property management dashboard allowing owners to list, modify, remove, and toggle availability of their homes.
4. **Booking & Lease Request Subsystem:** Tenant booking application pipeline with move-in date picker and notes.
5. **Administrative Governance Subsystem:** Moderation queue for review of new properties, platform statistics reporting, and user account management.

---

## 2. User Journey Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Tenant as Prospective Tenant
    actor Owner as Property Owner
    actor Admin as System Admin
    participant System as House Rent Web App
    participant DB as MongoDB Database

    Note over Owner,System: Listing Phase
    Owner->>System: Submit new property details
    System->>DB: Save listing (status: 'Pending')
    System-->>Owner: Confirmation: Awaiting Admin Approval

    Note over Admin,System: Moderation Phase
    Admin->>System: Review pending listings
    Admin->>System: Approve Property
    System->>DB: Update property (status: 'Approved')
    
    Note over Tenant,System: Discovery & Booking Phase
    Tenant->>System: Search & filter approved properties
    System-->>Tenant: Render verified property cards
    Tenant->>System: Submit lease request (move-in date)
    System->>DB: Save booking (status: 'Pending')

    Note over Owner,System: Decision Phase
    Owner->>System: View incoming rental requests
    Owner->>System: Approve Tenant Request
    System->>DB: Update booking (status: 'Approved')
    System-->>Tenant: Dashboard displays 'Approved' status
```
