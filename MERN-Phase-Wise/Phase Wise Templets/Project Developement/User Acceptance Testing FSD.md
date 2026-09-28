# User Acceptance Testing (UAT) & Verification Report — House Rent

**Project Name:** House Rent Management System  
**Test Suite:** End-to-End Automated & Manual UAT  
**Test Environment:** Node.js v24, React 19, MongoDB (In-Memory / Local), Windows 11  
**Total Test Cases:** 14  
**Passed:** 14  
**Failed:** 0  
**Status:** **100% PASS — Production Ready**  

---

## 1. Test Case Execution Matrix

| Test ID | Test Scenario | Expected Outcome | Actual Outcome | Status |
| :---: | :--- | :--- | :--- | :---: |
| **TC-01** | Server Health Check (`GET /api/health`) | Returns HTTP 200 with status `"OK"` | Received HTTP 200, status OK | **PASS** |
| **TC-02** | Fetch Public Properties (`GET /api/properties`) | Returns list of approved & available properties | Received properties with 200 OK | **PASS** |
| **TC-03** | Location Filtering (`/api/properties?location=Bangalore`) | Returns only Bangalore properties | 100% matched Bangalore | **PASS** |
| **TC-04** | Admin Authentication (`POST /api/auth/login`) | Issues valid JWT with role `"Admin"` | JWT token issued, role verified | **PASS** |
| **TC-05** | Property Owner Authentication | Issues valid JWT with role `"Property Owner"` | JWT token issued, role verified | **PASS** |
| **TC-06** | Tenant Authentication | Issues valid JWT with role `"Tenant"` | JWT token issued, role verified | **PASS** |
| **TC-07** | Invalid Password Security Check | Returns HTTP 401 Unauthorized | Rejected with 401 Unauthorized | **PASS** |
| **TC-08** | Role Authorization Guard (Tenant to Admin route) | Returns HTTP 403 Forbidden | Blocked with 403 Forbidden | **PASS** |
| **TC-09** | Post Property Listing (Owner) | Saved with `approvalStatus: 'Pending'` | Property created in Pending state | **PASS** |
| **TC-10** | Admin Moderation Workflow | Admin approves property to `"Approved"` | Status updated, visible publicly | **PASS** |
| **TC-11** | Tenant Rental Booking Submission | Booking created with `status: 'Pending'` | Booking saved with move-in date | **PASS** |
| **TC-12** | Landlord Booking Approval | Owner approves booking to `"Approved"` | Status updated to Approved | **PASS** |
| **TC-13** | Admin Dashboard Analytics Aggregation | Aggregates user, property, and booking metrics | Counters matched database totals | **PASS** |
| **TC-14** | Property Deletion & Cascade Clean-up | Owner deletes listing and clears linked bookings | Removed cleanly from database | **PASS** |

---

## 2. Conclusion
All functional and role-security requirements operate in strict accordance with the SkillWallet project specifications. The system is certified ready for academic and technical demonstration.
