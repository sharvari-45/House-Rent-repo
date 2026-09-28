import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PropertyListings from './pages/PropertyListings';
import PropertyDetails from './pages/PropertyDetails';
import TenantDashboard from './pages/TenantDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AddEditProperty from './pages/AddEditProperty';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/properties" element={<PropertyListings />} />
              <Route path="/properties/:id" element={<PropertyDetails />} />

              {/* Protected Tenant Routes */}
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute allowedRoles={['Tenant', 'Admin']}>
                    <TenantDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tenant/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['Tenant', 'Admin']}>
                    <TenantDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Owner Routes */}
              <Route
                path="/owner/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['Property Owner', 'Admin']}>
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/add-property"
                element={
                  <ProtectedRoute allowedRoles={['Property Owner', 'Admin']}>
                    <AddEditProperty />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/properties/add"
                element={
                  <ProtectedRoute allowedRoles={['Property Owner', 'Admin']}>
                    <AddEditProperty />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/properties/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={['Property Owner', 'Admin']}>
                    <AddEditProperty />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
