import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container py-5 text-center my-auto">
      <div className="card shadow-sm p-5 border-0 rounded-4 mx-auto" style={{ maxWidth: '500px' }}>
        <h1 className="display-1 fw-bold text-primary mb-2">404</h1>
        <h4 className="fw-bold text-dark mb-2">Page Not Found</h4>
        <p className="text-muted mb-4">
          The rental page or resource you are looking for doesn't exist or has been relocated.
        </p>
        <div>
          <Link to="/" className="btn btn-primary rounded-pill px-4 shadow-sm fw-semibold">
            <i className="bi bi-house me-1"></i> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
