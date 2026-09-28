import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('approvals'); // 'approvals' | 'properties' | 'users' | 'bookings'

  // Dashboard Stats State
  const [stats, setStats] = useState(null);
  const [pendingList, setPendingList] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // All Properties Tab State
  const [allProperties, setAllProperties] = useState([]);
  const [propFilter, setPropFilter] = useState('All');
  const [loadingProps, setLoadingProps] = useState(false);

  // User Management State
  const [users, setUsers] = useState([]);
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Bookings Tab State
  const [allBookings, setAllBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Actions Feedback State
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  // Fetch Stats & Pending Approvals
  const fetchDashboardStats = async () => {
    try {
      setLoadingStats(true);
      const res = await api.get('/admin/dashboard-stats');
      if (res.data.success) {
        setStats(res.data.stats);
        setPendingList(res.data.pendingReviewList || []);
      }
    } catch (err) {
      console.error('Failed to load admin dashboard stats:', err.message);
      setActionError(err.message || 'Failed to retrieve admin analytics');
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch All Properties
  const fetchAllProperties = async (status = propFilter) => {
    try {
      setLoadingProps(true);
      const query = status !== 'All' ? `?status=${status}` : '';
      const res = await api.get(`/admin/properties${query}`);
      if (res.data.success) {
        setAllProperties(res.data.properties || []);
      }
    } catch (err) {
      setActionError(err.message || 'Failed to fetch properties');
    } finally {
      setLoadingProps(false);
    }
  };

  // Fetch Users
  const fetchUsers = async (role = userRoleFilter) => {
    try {
      setLoadingUsers(true);
      const query = role !== 'All' ? `?role=${role}` : '';
      const res = await api.get(`/admin/users${query}`);
      if (res.data.success) {
        setUsers(res.data.users || []);
      }
    } catch (err) {
      setActionError(err.message || 'Failed to fetch users');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch Bookings
  const fetchAllBookings = async () => {
    try {
      setLoadingBookings(true);
      const res = await api.get('/admin/bookings');
      if (res.data.success) {
        setAllBookings(res.data.bookings || []);
      }
    } catch (err) {
      setActionError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'properties') fetchAllProperties(propFilter);
    if (activeTab === 'users') fetchUsers(userRoleFilter);
    if (activeTab === 'bookings') fetchAllBookings();
  }, [activeTab]);

  // Handle Property Review (Approve / Reject)
  const handleReviewProperty = async (propertyId, approvalStatus) => {
    const feedback = approvalStatus === 'Rejected'
      ? prompt('Optional: Provide reason for rejection:') || 'Listing does not meet platform criteria'
      : '';

    try {
      setProcessingId(propertyId);
      setActionSuccess('');
      setActionError('');

      const res = await api.patch(`/admin/properties/${propertyId}/review`, {
        approvalStatus,
        adminFeedback: feedback,
      });

      if (res.data.success) {
        setActionSuccess(`Property "${res.data.property.title}" has been marked as ${approvalStatus}!`);
        // Refresh lists
        fetchDashboardStats();
        if (activeTab === 'properties') fetchAllProperties();
      }
    } catch (err) {
      setActionError(err.message || 'Failed to update property status');
    } finally {
      setProcessingId(null);
    }
  };

  // Handle Delete Property
  const handleDeletePropertyAdmin = async (propertyId, title) => {
    if (!window.confirm(`Admin Action: Are you sure you want to permanently delete listing "${title}"?`)) {
      return;
    }

    try {
      setProcessingId(propertyId);
      setActionSuccess('');
      setActionError('');

      const res = await api.delete(`/admin/properties/${propertyId}`);
      if (res.data.success) {
        setActionSuccess(`Property listing removed from database.`);
        fetchDashboardStats();
        fetchAllProperties();
      }
    } catch (err) {
      setActionError(err.message || 'Failed to delete property');
    } finally {
      setProcessingId(null);
    }
  };

  // Handle User Role Change
  const handleRoleChange = async (userId, newRole) => {
    try {
      setProcessingId(userId);
      setActionSuccess('');
      setActionError('');

      const res = await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        setActionSuccess(res.data.message);
        setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
        fetchDashboardStats();
      }
    } catch (err) {
      setActionError(err.message || 'Failed to change user role');
    } finally {
      setProcessingId(null);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"? This removes their listings and bookings.`)) {
      return;
    }

    try {
      setProcessingId(userId);
      setActionSuccess('');
      setActionError('');

      const res = await api.delete(`/admin/users/${userId}`);
      if (res.data.success) {
        setActionSuccess(`User "${name}" deleted successfully.`);
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        fetchDashboardStats();
      }
    } catch (err) {
      setActionError(err.message || 'Failed to delete user');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="badge badge-status-approved px-2 py-1 rounded-pill"><i className="bi bi-check-circle me-1"></i>Approved</span>;
      case 'Pending':
        return <span className="badge badge-status-pending px-2 py-1 rounded-pill"><i className="bi bi-hourglass me-1"></i>Pending</span>;
      case 'Rejected':
        return <span className="badge badge-status-rejected px-2 py-1 rounded-pill"><i className="bi bi-x-circle me-1"></i>Rejected</span>;
      case 'Cancelled':
        return <span className="badge badge-status-cancelled px-2 py-1 rounded-pill">Cancelled</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Admin':
        return <span className="badge bg-danger text-white">Admin</span>;
      case 'Property Owner':
        return <span className="badge bg-primary text-white">Owner</span>;
      case 'Tenant':
        return <span className="badge bg-success text-white">Tenant</span>;
      default:
        return <span className="badge bg-secondary">{role}</span>;
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <span className="badge bg-danger text-white px-3 py-1 rounded-pill fw-bold mb-2">
            <i className="bi bi-shield-lock-fill me-1"></i> Super Admin Portal
          </span>
          <h2 className="fw-bold text-dark mb-1">Platform Administration</h2>
          <p className="text-muted small mb-0">System metrics, listing moderation, user management, and booking oversight</p>
        </div>
        <div className="mt-3 mt-md-0">
          <button className="btn btn-outline-secondary rounded-pill px-3" onClick={fetchDashboardStats}>
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh System Data
          </button>
        </div>
      </div>

      {actionSuccess && <AlertMessage type="success" message={actionSuccess} onClose={() => setActionSuccess('')} />}
      {actionError && <AlertMessage type="danger" message={actionError} onClose={() => setActionError('')} />}

      {/* Metrics Row */}
      {loadingStats ? (
        <LoadingSpinner message="Calculating platform metrics..." />
      ) : stats && (
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted fw-bold">TOTAL USERS</small>
                  <div className="stat-number text-primary">{stats.users.total}</div>
                  <small className="text-muted">{stats.users.tenants} Tenants / {stats.users.owners} Owners</small>
                </div>
                <div className="stat-icon bg-primary-subtle text-primary">
                  <i className="bi bi-people-fill"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted fw-bold">PROPERTIES</small>
                  <div className="stat-number text-dark">{stats.properties.total}</div>
                  <small className="text-success">{stats.properties.approved} Approved</small>
                </div>
                <div className="stat-icon bg-success-subtle text-success">
                  <i className="bi bi-building-check"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted fw-bold">PENDING APPROVALS</small>
                  <div className="stat-number text-warning">{stats.properties.pending}</div>
                  <small className="text-muted">Awaiting Admin Action</small>
                </div>
                <div className="stat-icon bg-warning-subtle text-warning">
                  <i className="bi bi-clock-history"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted fw-bold">TOTAL BOOKINGS</small>
                  <div className="stat-number text-info">{stats.bookings.total}</div>
                  <small className="text-muted">{stats.bookings.approved} Approved</small>
                </div>
                <div className="stat-icon bg-info-subtle text-info">
                  <i className="bi bi-journal-check"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
        <div className="card-header bg-white border-bottom p-0">
          <ul className="nav nav-tabs border-0 px-3 pt-2">
            <li className="nav-item">
              <button
                className={`nav-link py-3 px-4 fw-bold ${activeTab === 'approvals' ? 'active text-primary border-bottom border-primary border-3' : 'text-secondary'}`}
                onClick={() => setActiveTab('approvals')}
              >
                <i className="bi bi-shield-check me-2"></i>Pending Approvals
                {stats?.properties.pending > 0 && (
                  <span className="badge bg-warning text-dark rounded-pill ms-2">{stats.properties.pending}</span>
                )}
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link py-3 px-4 fw-bold ${activeTab === 'properties' ? 'active text-primary border-bottom border-primary border-3' : 'text-secondary'}`}
                onClick={() => setActiveTab('properties')}
              >
                <i className="bi bi-buildings me-2"></i>All Properties
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link py-3 px-4 fw-bold ${activeTab === 'users' ? 'active text-primary border-bottom border-primary border-3' : 'text-secondary'}`}
                onClick={() => setActiveTab('users')}
              >
                <i className="bi bi-people me-2"></i>User Management
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link py-3 px-4 fw-bold ${activeTab === 'bookings' ? 'active text-primary border-bottom border-primary border-3' : 'text-secondary'}`}
                onClick={() => setActiveTab('bookings')}
              >
                <i className="bi bi-calendar3 me-2"></i>All Bookings
              </button>
            </li>
          </ul>
        </div>

        <div className="card-body p-0">
          {/* TAB 1: PENDING APPROVALS */}
          {activeTab === 'approvals' && (
            <div>
              {pendingList.length === 0 ? (
                <div className="text-center py-5 px-4">
                  <i className="bi bi-check-circle-fill text-success fs-1 mb-3"></i>
                  <h5 className="fw-bold">All Listings Moderated!</h5>
                  <p className="text-muted small">There are currently no property listings waiting for admin review.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small text-secondary">
                      <tr>
                        <th scope="col" className="ps-4">Property</th>
                        <th scope="col">Owner Info</th>
                        <th scope="col">Rent (₹/mo)</th>
                        <th scope="col">Type & Specs</th>
                        <th scope="col">Submission Date</th>
                        <th scope="col" className="text-end pe-4">Moderation Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingList.map((property) => (
                        <tr key={property._id}>
                          <td className="ps-4">
                            <div className="d-flex align-items-center">
                              <img
                                src={property.images?.[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=400&q=80'}
                                alt={property.title}
                                className="rounded-3 me-3"
                                style={{ width: '65px', height: '50px', objectFit: 'cover' }}
                              />
                              <div>
                                <div className="fw-bold text-dark">{property.title}</div>
                                <div className="small text-muted">
                                  <i className="bi bi-geo-alt me-1 text-danger"></i>{property.location}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="fw-semibold text-dark">{property.owner?.name || 'Owner'}</div>
                            <div className="small text-muted">{property.owner?.email}</div>
                          </td>
                          <td>
                            <span className="fw-bold text-primary">₹{property.rent?.toLocaleString('en-IN')}</span>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border me-1">{property.propertyType}</span>
                            <span className="small text-muted">{property.bedrooms}BHK</span>
                          </td>
                          <td>
                            <span className="small text-muted">{new Date(property.createdAt).toLocaleDateString()}</span>
                          </td>
                          <td className="text-end pe-4">
                            <div className="btn-group">
                              <button
                                className="btn btn-sm btn-success fw-bold px-3"
                                disabled={processingId === property._id}
                                onClick={() => handleReviewProperty(property._id, 'Approved')}
                              >
                                <i className="bi bi-check-lg me-1"></i>Approve
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger fw-bold"
                                disabled={processingId === property._id}
                                onClick={() => handleReviewProperty(property._id, 'Rejected')}
                              >
                                <i className="bi bi-x-lg me-1"></i>Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ALL PROPERTIES */}
          {activeTab === 'properties' && (
            <div>
              {/* Filter bar */}
              <div className="p-3 bg-light border-bottom d-flex align-items-center justify-content-between">
                <span className="small fw-bold text-secondary">Filter by Approval Status:</span>
                <div className="btn-group btn-group-sm">
                  {['All', 'Approved', 'Pending', 'Rejected'].map((status) => (
                    <button
                      key={status}
                      className={`btn ${propFilter === status ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => {
                        setPropFilter(status);
                        fetchAllProperties(status);
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {loadingProps ? (
                <LoadingSpinner message="Loading all platform properties..." />
              ) : allProperties.length === 0 ? (
                <div className="text-center py-5">
                  <h6 className="text-muted">No properties found matching status '{propFilter}'.</h6>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small text-secondary">
                      <tr>
                        <th scope="col" className="ps-4">Property</th>
                        <th scope="col">Owner</th>
                        <th scope="col">Rent</th>
                        <th scope="col">Type</th>
                        <th scope="col">Approval</th>
                        <th scope="col" className="text-end pe-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allProperties.map((p) => (
                        <tr key={p._id}>
                          <td className="ps-4">
                            <div className="d-flex align-items-center">
                              <img
                                src={p.images?.[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=400&q=80'}
                                alt={p.title}
                                className="rounded-3 me-3"
                                style={{ width: '55px', height: '40px', objectFit: 'cover' }}
                              />
                              <div>
                                <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '240px' }}>
                                  {p.title}
                                </div>
                                <div className="small text-muted">{p.location}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="small fw-semibold">{p.owner?.name}</div>
                            <div className="small text-muted">{p.owner?.email}</div>
                          </td>
                          <td>
                            <span className="fw-bold text-primary">₹{p.rent?.toLocaleString('en-IN')}</span>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border">{p.propertyType}</span>
                          </td>
                          <td>{getStatusBadge(p.approvalStatus)}</td>
                          <td className="text-end pe-4">
                            <div className="btn-group">
                              {p.approvalStatus !== 'Approved' && (
                                <button
                                  className="btn btn-sm btn-outline-success"
                                  title="Approve Listing"
                                  onClick={() => handleReviewProperty(p._id, 'Approved')}
                                >
                                  <i className="bi bi-check-lg"></i>
                                </button>
                              )}
                              <button
                                className="btn btn-sm btn-outline-danger"
                                title="Delete Property Listing"
                                onClick={() => handleDeletePropertyAdmin(p._id, p.title)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div>
              {/* Role filter bar */}
              <div className="p-3 bg-light border-bottom d-flex align-items-center justify-content-between">
                <span className="small fw-bold text-secondary">Filter by User Role:</span>
                <div className="btn-group btn-group-sm">
                  {['All', 'Tenant', 'Property Owner', 'Admin'].map((role) => (
                    <button
                      key={role}
                      className={`btn ${userRoleFilter === role ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => {
                        setUserRoleFilter(role);
                        fetchUsers(role);
                      }}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {loadingUsers ? (
                <LoadingSpinner message="Loading user directory..." />
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small text-secondary">
                      <tr>
                        <th scope="col" className="ps-4">User Name</th>
                        <th scope="col">Email Address</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Current Role</th>
                        <th scope="col">Change Role</th>
                        <th scope="col" className="text-end pe-4">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td className="ps-4">
                            <div className="fw-bold text-dark">{u.name}</div>
                          </td>
                          <td>
                            <span className="text-secondary small">{u.email}</span>
                          </td>
                          <td>
                            <span className="small text-muted">{u.phone || '—'}</span>
                          </td>
                          <td>{getRoleBadge(u.role)}</td>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              style={{ width: '150px' }}
                              value={u.role}
                              disabled={processingId === u._id}
                              onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            >
                              <option value="Tenant">Tenant</option>
                              <option value="Property Owner">Property Owner</option>
                              <option value="Admin">Admin</option>
                            </select>
                          </td>
                          <td className="text-end pe-4">
                            <button
                              className="btn btn-sm btn-outline-danger"
                              disabled={processingId === u._id}
                              onClick={() => handleDeleteUser(u._id, u.name)}
                              title="Delete user account"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ALL BOOKINGS */}
          {activeTab === 'bookings' && (
            <div>
              {loadingBookings ? (
                <LoadingSpinner message="Loading platform bookings..." />
              ) : allBookings.length === 0 ? (
                <div className="text-center py-5">
                  <h6 className="text-muted">No rental bookings recorded in the system yet.</h6>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small text-secondary">
                      <tr>
                        <th scope="col" className="ps-4">Property</th>
                        <th scope="col">Tenant</th>
                        <th scope="col">Owner</th>
                        <th scope="col">Move-in Date</th>
                        <th scope="col">Status</th>
                        <th scope="col" className="text-end pe-4">Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allBookings.map((b) => (
                        <tr key={b._id}>
                          <td className="ps-4">
                            <div className="fw-bold text-dark">{b.property?.title || 'Property'}</div>
                            <div className="small text-primary">₹{b.property?.rent?.toLocaleString('en-IN')}/mo</div>
                          </td>
                          <td>
                            <div className="fw-semibold text-dark">{b.tenant?.name || 'Tenant'}</div>
                            <div className="small text-muted">{b.tenant?.email}</div>
                          </td>
                          <td>
                            <div className="fw-semibold text-dark">{b.owner?.name || 'Owner'}</div>
                            <div className="small text-muted">{b.owner?.email}</div>
                          </td>
                          <td>
                            <span className="small fw-semibold">
                              {new Date(b.moveInDate).toLocaleDateString()}
                            </span>
                          </td>
                          <td>{getStatusBadge(b.status)}</td>
                          <td className="text-end pe-4">
                            <span className="small text-muted">{new Date(b.createdAt).toLocaleDateString()}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
