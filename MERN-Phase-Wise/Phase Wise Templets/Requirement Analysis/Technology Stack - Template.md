# Technology Stack Specification — House Rent Management System

| Layer | Assigned Technology | Rationale & Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **React.js (v18/v19) with Vite** | Component-driven Single Page Application (SPA), lightning-fast hot module reloading, declarative state management with Hooks (`useState`, `useEffect`, `useContext`). |
| **Routing** | **React Router DOM v6** | Declarative client-side routing, protected routes (`ProtectedRoute.jsx`), and smooth transition between dashboards. |
| **UI Styling** | **Bootstrap 5 & Bootstrap Icons** | Responsive mobile-first grid, customizable CSS variables, utility classes, and accessible modal/card designs. |
| **API Client** | **Axios** | Promise-based HTTP client with request interceptors for automatic JWT injection and centralized response error parsing. |
| **Backend Runtime** | **Node.js (v20/v24)** | High-performance non-blocking asynchronous event-driven JavaScript runtime. |
| **Web Framework** | **Express.js (v4.21)** | Minimalist, robust web framework for creating RESTful API endpoints, request validation, and middleware integration. |
| **Security & Auth** | **JSON Web Tokens (JWT) & bcryptjs** | Salted SHA-256 password hashing and stateless authorization token issuance for role-based route protection. |
| **Database** | **MongoDB with Mongoose ODM (v8)** | Flexible document schema model with schema validation, indexes (`{ approvalStatus: 1, availability: 1, location: 1 }`), and automatic timestamps. |
| **Zero-Config Database** | **MongoMemoryServer** | Automated in-memory database fallback ensuring flawless local demonstration even if a local MongoDB service is uninstalled. |
| **Development Tools** | **Git & GitHub** | Distributed version control, branch management (`main`), and remote code hosting. |
