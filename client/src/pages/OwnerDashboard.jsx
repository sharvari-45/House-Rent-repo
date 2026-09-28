import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('properties'); // 'properties' | 'requests'

  // Properties state
  const [properties, setProperties] = useState([]);
  const [propStats, setPropStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0, available: 0 });
  const [loadingProps, setLoadingProps] = useState(true);

  // Bookings state
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Status updates
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const fetchOwnerProperties = async () => {
    try {
      setLoadingProps(true);
      const res = await api.get('/properties/owner/my-properties');
      if (res.data.success) {
        setProperties(res.data.properties || []);
        if (res.data.stats) setPropStats(res.data.stats);
      }
    } catch (err) {
      console.error('Failed to load owner properties:', err.message);
      setActionError(err.message || 'Failed to retrieve your property listings');
    } finally {
      setLoadingProps(false);
    }
  };

  const fetchOwnerBookings = async () => {
    try {
      setLoadingBookings(true);
      const res = await api.get('/bookings/owner-requests');
      if (res.data.success) {
        setBookings(res.data.bookings || []);
      }
    } catch (err) {
      console.error('Failed to load booking requests:', err.message);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchOwnerProperties();
    fetchOwnerBookings();
  }, []);

  const handleToggleAvailability = async (propertyId) => {
    try {
      setProcessingId(propertyId);
      setActionSuccess('');
      setActionError('');

      const res = await api.patch(`/properties/${propertyId}/availability`);
      if (res.data.success) {
        setActionSuccess(res.data.message);
        setProperties((prev) =>
          prev.map((p) => (p._id === propertyId ? { ...p, availability: res.data.availability } : p))
        );
      }
    } catch (err) {
      setActionError(err.message || 'Failed to update property availability');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteProperty = async (propertyId, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete listing "${title}"?`)) {
      return;
    }

    try {
      setProcessingId(propertyId);
      setActionSuccess('');
      setActionError('');

      const res = await api.delete(`/properties/${propertyId}`);
      if (res.data.success) {
        setActionSuccess(`Property "${title}" deleted successfully.`);
        setProperties((prev) => prev.filter((p) => p._id !== propertyId));
        fetchOwnerProperties(); // update counts
      }
    } catch (err) {
      setActionError(err.message || 'Failed to delete property listing');
    } finally {
      setProcessingId(null);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      setProcessingId(bookingId);
      setActionSuccess('');
      setActionError('');

      const res = await api.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      if (res.data.success) {
        setActionSuccess(`Booking request marked as ${newStatus}`);
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
        );
      }
    } catch (err) {
      setActionError(err.message || 'Failed to update booking status');
    } finally {
      setProcessingId(null);
    }
  };

  const getApprovalBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="badge badge-status-approved px-2 py-1 rounded-pill"><i className="bi bi-check-circle me-1"></i>Approved</span>;
      case 'Pending':
        return <span className="badge badge-status-pending px-2 py-1 rounded-pill"><i className="bi bi-hourglass me-1"></i>Pending Review</span>;
      case 'Rejected':
        return <span className="badge badge-status-rejected px-2 py-1 rounded-pill"><i className="bi bi-x-circle me-1"></i>Rejected</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const getBookingBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="badge badge-status-approved px-2 py-1 rounded-pill">Approved</span>;
      case 'Pending':
        return <span className="badge badge-status-pending px-2 py-1 rounded-pill">Pending</span>;
      case 'Rejected':
        return <span className="badge badge-status-rejected px-2 py-1 rounded-pill">Rejected</span>;
      case 'Cancelled':
        return <span className="badge badge-status-cancelled px-2 py-1 rounded-pill">Cancelled</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const pendingBookingsCount = bookings.filter((b) => b.status === 'Pending').length;

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <span className="badge bg-primary-subtle text-primary px-3 py-1 rounded-pill fw-bold mb-2">
            Property Landlord Portal
          </span>
          <h2 className="fw-bold text-dark mb-1">Owner Dashboard</h2>
          <p className="text-muted small mb-0">Manage your rental inventory, availability, and tenant booking requests</p>
        </div>
        <div className="mt-3 mt-md-0">
          <Link to="/owner/add-property" className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold">
            <i className="bi bi-plus-lg me-2"></i>Post New Property
          </Link>
        </div>
      </div>

      {actionSuccess && <AlertMessage type="success" message={actionSuccess} onClose={() => setActionSuccess('')} />}
      {actionError && <AlertMessage type="danger" message={actionError} onClose={() => setActionError('')} />}

      {/* Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted fw-bold">TOTAL LISTINGS</small>
                <div className="stat-number">{propStats.total}</div>
              </div>
              <div className="stat-icon bg-primary-subtle text-primary">
                <i className="bi bi-buildings"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted fw-bold">LIVE / APPROVED</small>
                <div className="stat-number text-success">{propStats.approved}</div>
              </div>
              <div className="stat-icon bg-success-subtle text-success">
                <i className="bi bi-check2-all"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted fw-bold">PENDING APPROVAL</small>
                <div className="stat-number text-warning">{propStats.pending}</div>
              </div>
              <div className="stat-icon bg-warning-subtle text-warning">
                <i className="bi bi-hourglass-split"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted fw-bold">NEW BOOKINGS</small>
                <div className="stat-number text-info">{pendingBookingsCount}</div>
              </div>
              <div className="stat-icon bg-info-subtle text-info">
                <i className="bi bi-envelope-open-fill"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
        <div className="card-header bg-white border-bottom p-0">
          <ul className="nav nav-tabs border-0 px-3 pt-2">
            <li className="nav-item">
              <button
                className={`nav-link py-3 px-4 fw-bold ${activeTab === 'properties' ? 'active text-primary border-bottom border-primary border-3' : 'text-secondary'}`}
                onClick={() => setActiveTab('properties')}
              >
                <i className="bi bi-house-door me-2"></i>My Listed Properties ({properties.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link py-3 px-4 fw-bold ${activeTab === 'requests' ? 'active text-primary border-bottom border-primary border-3' : 'text-secondary'}`}
                onClick={() => setActiveTab('requests')}
              >
                <i className="bi bi-inbox me-2"></i>Tenant Booking Requests ({bookings.length})
                {pendingBookingsCount > 0 && (
                  <span className="badge bg-danger rounded-pill ms-2">{pendingBookingsCount} new</span>
                )}
              </button>
            </li>
          </ul>
        </div>

        <div className="card-body p-0">
          {/* TAB 1: PROPERTIES */}
          {activeTab === 'properties' && (
            <div>
              {loadingProps ? (
                <LoadingSpinner message="Loading your properties..." />
              ) : properties.length === 0 ? (
                <div className="text-center py-5 px-4">
                  <i className="bi bi-house-add text-muted fs-1 mb-3"></i>
                  <h5 className="fw-bold">No Properties Listed Yet</h5>
                  <p className="text-muted small mx-auto" style={{ maxWidth: '400px' }}>
                    You haven't added any house or apartment listings yet. Click below to add your first property.
                  </p>
                  <Link to="/owner/add-property" className="btn btn-primary rounded-pill px-4 mt-2">
                    <i className="bi bi-plus-lg me-1"></i> Add Property
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small text-secondary">
                      <tr>
                        <th scope="col" className="ps-4">Property</th>
                        <th scope="col">Type & Specs</th>
                        <th scope="col">Rent (₹/mo)</th>
                        <th scope="col">Moderation</th>
                        <th scope="col">Availability</th>
                        <th scope="col" className="text-end pe-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((property) => (
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
                                <Link to={`/properties/${property._id}`} className="fw-bold text-dark text-decoration-none">
                                  {property.title}
                                </Link>
                                <div className="small text-muted">
                                  <i className="bi bi-geo-alt me-1 text-danger"></i>{property.location}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border me-1">{property.propertyType}</span>
                            <span className="small text-muted">{property.bedrooms}B / {property.bathrooms}Ba</span>
                          </td>
                          <td>
                            <span className="fw-bold text-primary">₹{property.rent?.toLocaleString('en-IN')}</span>
                          </td>
                          <td>
                            {getApprovalBadge(property.approvalStatus)}
                            {property.adminFeedback && (
                              <div className="small text-danger mt-1" title={property.adminFeedback}>
                                <i className="bi bi-info-circle me-1"></i>{property.adminFeedback}
                              </div>
                            )}
                          </td>
                          <td>
                            <button
                              type="button"
                              className={`btn btn-sm ${property.availability ? 'btn-outline-success' : 'btn-outline-secondary'} rounded-pill`}
                              disabled={processingId === property._id}
                              onClick={() => handleToggleAvailability(property._id)}
                              title="Click to toggle availability"
                            >
                              <i className={`bi ${property.availability ? 'bi-toggle-on text-success' : 'bi-toggle-off'} me-1 fs-6`}></i>
                              {property.availability ? 'Available' : 'Rented'}
                            </button>
                          </td>
                          <td className="text-end pe-4">
                            <div className="btn-group">
                              <Link
                                to={`/properties/edit/${property._id}`}
                                className="btn btn-sm btn-outline-primary"
                                title="Edit Property"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                title="Delete Property"
                                disabled={processingId === property._id}
                                onClick={() => handleDeleteProperty(property._id, property.title)}
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

          {/* TAB 2: BOOKING REQUESTS */}
          {activeTab === 'requests' && (
            <div>
              {loadingBookings ? (
                <LoadingSpinner message="Loading booking requests..." />
              ) : bookings.length === 0 ? (
                <div className="text-center py-5 px-4">
                  <i className="bi bi-inbox text-muted fs-1 mb-3"></i>
                  <h5 className="fw-bold">No Booking Requests Received</h5>
                  <p className="text-muted small">When tenants apply to rent your properties, requests will appear here for your approval.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small text-secondary">
                      <tr>
                        <th scope="col" className="ps-4">Tenant</th>
                        <th scope="col">Property Applied</th>
                        <th scope="col">Move-In Date</th>
                        <th scope="col">Tenant Message</th>
                        <th scope="col">Status</th>
                        <th scope="col" className="text-end pe-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="ps-4">
                            <div className="fw-bold text-dark">{booking.tenant?.name || 'Prospective Tenant'}</div>
                            <div className="small text-muted">
                              <i className="bi bi-envelope me-1"></i>{booking.tenant?.email}
                            </div>
                            {booking.tenant?.phone && (
                              <div className="small text-muted">
                                <i className="bi bi-telephone me-1"></i>{booking.tenant?.phone}
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="fw-bold text-dark">{booking.property?.title || 'Property'}</div>
                            <div className="small text-primary">₹{booking.property?.rent?.toLocaleString('en-IN')}/mo</div>
                          </td>
                          <td>
                            <span className="small fw-semibold">
                              {new Date(booking.moveInDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </td>
                          <td>
                            <p className="small text-secondary mb-0 text-truncate" style={{ maxWidth: '200px' }} title={booking.message}>
                              {booking.message || 'No additional note'}
                            </p>
                          </td>
                          <td>{getBookingBadge(booking.status)}</td>
                          <td className="text-end pe-4">
                            {booking.status === 'Pending' ? (
                              <div className="btn-group">
                                <button
                                  className="btn btn-sm btn-success fw-semibold"
                                  disabled={processingId === booking._id}
                                  onClick={() => handleUpdateBookingStatus(booking._id, 'Approved')}
                                  title="Approve Tenant Request"
                                >
                                  <i className="bi bi-check-lg me-1"></i>Approve
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger fw-semibold"
                                  disabled={processingId === booking._id}
                                  onClick={() => handleUpdateBookingStatus(booking._id, 'Rejected')}
                                  title="Reject Request"
                                >
                                  <i className="bi bi-x-lg me-1"></i>Reject
                                </button>
                              </div>
                            ) : (
                              <span className="small text-muted">Resolved</span>
                            )}
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

export default OwnerDashboard;
