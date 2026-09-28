import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Checking authentication session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm p-5 max-w-lg mx-auto border-0" style={{ maxWidth: '500px' }}>
          <div className="text-danger mb-3">
            <i className="bi bi-shield-x fs-1"></i>
          </div>
          <h3 className="fw-bold">Access Denied</h3>
          <p className="text-muted">
            Your role <strong>({user?.role})</strong> is not permitted to access this page.
          </p>
          <div className="mt-3">
            <a href="/" className="btn btn-primary rounded-pill px-4">
              Return to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
