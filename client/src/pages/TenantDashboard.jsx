import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

const TenantDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/bookings/my-bookings');
      if (res.data.success) {
        setBookings(res.data.bookings || []);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err.message);
      setError(err.message || 'Failed to load booking history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking request?')) {
      return;
    }

    try {
      setActionLoadingId(bookingId);
      setActionSuccess('');
      setError('');

      const res = await api.patch(`/bookings/${bookingId}/cancel`);
      if (res.data.success) {
        setActionSuccess('Booking request cancelled successfully');
        // Update state locally
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: 'Cancelled' } : b))
        );
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel booking request');
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="badge badge-status-approved px-3 py-2 rounded-pill fw-bold"><i className="bi bi-check-circle-fill me-1"></i>Approved</span>;
      case 'Pending':
        return <span className="badge badge-status-pending px-3 py-2 rounded-pill fw-bold"><i className="bi bi-hourglass-split me-1"></i>Under Review</span>;
      case 'Rejected':
        return <span className="badge badge-status-rejected px-3 py-2 rounded-pill fw-bold"><i className="bi bi-x-circle-fill me-1"></i>Rejected</span>;
      case 'Cancelled':
        return <span className="badge badge-status-cancelled px-3 py-2 rounded-pill fw-bold"><i className="bi bi-slash-circle me-1"></i>Cancelled</span>;
      default:
        return <span className="badge bg-secondary px-3 py-2 rounded-pill">{status}</span>;
    }
  };

  // Metrics calculation
  const total = bookings.length;
  const approved = bookings.filter((b) => b.status === 'Approved').length;
  const pending = bookings.filter((b) => b.status === 'Pending').length;
  const cancelled = bookings.filter((b) => b.status === 'Cancelled' || b.status === 'Rejected').length;

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <span className="badge bg-success-subtle text-success px-3 py-1 rounded-pill fw-bold mb-2">
            Tenant Hub
          </span>
          <h2 className="fw-bold text-dark mb-1">My Rental Bookings</h2>
          <p className="text-muted small mb-0">Track your house applications, move-in approvals, and landlord notes</p>
        </div>
        <div className="mt-3 mt-md-0">
          <Link to="/properties" className="btn btn-primary rounded-pill px-4 shadow-sm fw-semibold">
            <i className="bi bi-search me-2"></i>Find More Properties
          </Link>
        </div>
      </div>

      {actionSuccess && <AlertMessage type="success" message={actionSuccess} onClose={() => setActionSuccess('')} />}
      {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}

      {/* Metrics Counter Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted fw-bold">TOTAL REQUESTS</small>
                <div className="stat-number">{total}</div>
              </div>
              <div className="stat-icon bg-primary-subtle text-primary">
                <i className="bi bi-journal-bookmark-fill"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted fw-bold">APPROVED</small>
                <div className="stat-number text-success">{approved}</div>
              </div>
              <div className="stat-icon bg-success-subtle text-success">
                <i className="bi bi-patch-check-fill"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted fw-bold">UNDER REVIEW</small>
                <div className="stat-number text-warning">{pending}</div>
              </div>
              <div className="stat-icon bg-warning-subtle text-warning">
                <i className="bi bi-hourglass-bottom"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted fw-bold">CANCELLED/REJECTED</small>
                <div className="stat-number text-secondary">{cancelled}</div>
              </div>
              <div className="stat-icon bg-secondary-subtle text-secondary">
                <i className="bi bi-archive-fill"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table / List */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
        <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
          <h5 className="fw-bold mb-0 text-dark">
            <i className="bi bi-clock-history text-primary me-2"></i>Booking Application History
          </h5>
          <button className="btn btn-sm btn-outline-secondary rounded-pill" onClick={fetchBookings}>
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <LoadingSpinner message="Retrieving your bookings..." />
          ) : bookings.length === 0 ? (
            <div className="text-center py-5 px-4">
              <i className="bi bi-house-door text-muted fs-1 mb-3"></i>
              <h5 className="fw-bold">No Booking Requests Found</h5>
              <p className="text-muted small mx-auto" style={{ maxWidth: '400px' }}>
                You haven't requested any property bookings yet. Explore our verified listings and request your next home!
              </p>
              <Link to="/properties" className="btn btn-outline-primary rounded-pill px-4 mt-2">
                Browse Available Properties
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small text-secondary">
                  <tr>
                    <th scope="col" className="ps-4">Property</th>
                    <th scope="col">Location</th>
                    <th scope="col">Rent</th>
                    <th scope="col">Move-in Date</th>
                    <th scope="col">Landlord</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const prop = booking.property;
                    const image = prop?.images?.[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=400&q=80';

                    return (
                      <tr key={booking._id}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center">
                            <img
                              src={image}
                              alt={prop?.title || 'House'}
                              className="rounded-3 me-3"
                              style={{ width: '60px', height: '45px', objectFit: 'cover' }}
                            />
                            <div>
                              {prop ? (
                                <Link to={`/properties/${prop._id}`} className="fw-bold text-dark text-decoration-none">
                                  {prop.title}
                                </Link>
                              ) : (
                                <span className="text-muted">Property Listing Removed</span>
                              )}
                              <div className="small text-muted">
                                Requested on {new Date(booking.requestDate || booking.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="small fw-semibold text-secondary">
                            <i className="bi bi-geo-alt me-1 text-danger"></i>
                            {prop?.location || 'N/A'}
                          </span>
                        </td>
                        <td>
                          <span className="fw-bold text-primary">
                            ₹{prop?.rent?.toLocaleString('en-IN') || '—'}<small className="text-muted">/mo</small>
                          </span>
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
                          <div className="small">
                            <div className="fw-bold">{booking.owner?.name || 'Landlord'}</div>
                            <div className="text-muted">{booking.owner?.phone || booking.owner?.email || '—'}</div>
                          </div>
                        </td>
                        <td>{getStatusBadge(booking.status)}</td>
                        <td className="text-end pe-4">
                          {booking.status === 'Pending' ? (
                            <button
                              className="btn btn-sm btn-outline-danger rounded-pill"
                              disabled={actionLoadingId === booking._id}
                              onClick={() => handleCancelBooking(booking._id)}
                            >
                              {actionLoadingId === booking._id ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              ) : (
                                <>Cancel</>
                              )}
                            </button>
                          ) : (
                            <span className="text-muted small">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
