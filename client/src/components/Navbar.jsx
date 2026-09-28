import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isOwner, isAdmin, isTenant, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-danger text-white';
      case 'Property Owner':
        return 'bg-primary text-white';
      case 'Tenant':
        return 'bg-success text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top custom-navbar">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div className="bg-primary text-white p-2 rounded-3 me-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '38px', height: '38px' }}>
            <i className="bi bi-house-heart-fill fs-5"></i>
          </div>
          <div>
            <span className="brand-text">House Rent</span>
            <span className="brand-badge d-none d-sm-inline">MERN</span>
          </div>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Items */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link fw-semibold px-3 ${isActive ? 'text-primary' : 'text-secondary'}`} to="/">
                <i className="bi bi-house me-1"></i> Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link fw-semibold px-3 ${isActive ? 'text-primary' : 'text-secondary'}`} to="/properties">
                <i className="bi bi-search me-1"></i> Browse Properties
              </NavLink>
            </li>

            {/* Tenant Links */}
            {isAuthenticated && isTenant && (
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link fw-semibold px-3 ${isActive ? 'text-primary' : 'text-secondary'}`} to="/my-bookings">
                  <i className="bi bi-calendar-check me-1"></i> My Bookings
                </NavLink>
              </li>
            )}

            {/* Owner Links */}
            {isAuthenticated && isOwner && (
              <>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link fw-semibold px-3 ${isActive ? 'text-primary' : 'text-secondary'}`} to="/owner/dashboard">
                    <i className="bi bi-speedometer2 me-1"></i> Owner Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link fw-semibold px-3 ${isActive ? 'text-primary' : 'text-secondary'}`} to="/owner/add-property">
                    <i className="bi bi-plus-circle me-1"></i> Post Property
                  </NavLink>
                </li>
              </>
            )}

            {/* Admin Links */}
            {isAuthenticated && isAdmin && (
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link fw-semibold px-3 ${isActive ? 'text-primary' : 'text-secondary'}`} to="/admin/dashboard">
                  <i className="bi bi-shield-lock me-1"></i> Admin Portal
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right Authentication Controls */}
          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2 rounded-pill px-3 py-1 shadow-sm"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', fontSize: '0.85rem' }}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="fw-semibold text-dark">{user?.name}</span>
                  <span className={`badge rounded-pill ${getRoleBadgeClass(user?.role)} ms-1`} style={{ fontSize: '0.7rem' }}>
                    {user?.role}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2 rounded-3" aria-labelledby="userDropdown">
                  <li className="dropdown-header text-muted">
                    <small>Signed in as</small>
                    <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '180px' }}>{user?.email}</div>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  {isTenant && (
                    <li>
                      <Link className="dropdown-item py-2" to="/my-bookings">
                        <i className="bi bi-journal-text me-2 text-primary"></i> Rental History
                      </Link>
                    </li>
                  )}
                  {isOwner && (
                    <li>
                      <Link className="dropdown-item py-2" to="/owner/dashboard">
                        <i className="bi bi-building me-2 text-primary"></i> My Listings
                      </Link>
                    </li>
                  )}
                  {isAdmin && (
                    <li>
                      <Link className="dropdown-item py-2" to="/admin/dashboard">
                        <i className="bi bi-gear me-2 text-danger"></i> Administration
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-primary px-3 rounded-pill fw-semibold">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Log In
                </Link>
                <Link to="/register" className="btn btn-primary px-3 rounded-pill fw-semibold shadow-sm">
                  <i className="bi bi-person-plus me-1"></i> Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
