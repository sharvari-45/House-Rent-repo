import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

const PropertyDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated, isTenant } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking Form State
  const [moveInDate, setMoveInDate] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/properties/${id}`);
        if (res.data.success) {
          setProperty(res.data.property);
        }
      } catch (err) {
        console.error('Failed to fetch property details:', err.message);
        setError(err.message || 'Unable to retrieve property information');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess('');

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/properties/${id}` } } });
      return;
    }

    if (!moveInDate) {
      setBookingError('Please choose your preferred move-in date');
      return;
    }

    try {
      setBookingLoading(true);
      const res = await api.post('/bookings', {
        propertyId: property._id,
        moveInDate,
        message: bookingMessage,
      });

      if (res.data.success) {
        setBookingSuccess('Booking request sent successfully! The property owner will review your request.');
        setBookingMessage('');
        setMoveInDate('');
      }
    } catch (err) {
      setBookingError(err.message || 'Failed to submit booking request');
    } finally {
      setBookingLoading(false);
    }
  };

  const getAmenityIcon = (amenity) => {
    const lower = amenity.toLowerCase();
    if (lower.includes('wifi')) return 'bi-wifi';
    if (lower.includes('air') || lower.includes('ac')) return 'bi-snow';
    if (lower.includes('park')) return 'bi-car-front-fill';
    if (lower.includes('power') || lower.includes('backup')) return 'bi-battery-charging';
    if (lower.includes('gym')) return 'bi-activity';
    if (lower.includes('swim') || lower.includes('pool')) return 'bi-water';
    if (lower.includes('secur')) return 'bi-shield-check';
    if (lower.includes('garden')) return 'bi-flower1';
    if (lower.includes('pet')) return 'bi-heart-pulse';
    return 'bi-check2-circle';
  };

  if (loading) {
    return <LoadingSpinner message="Loading property details..." />;
  }

  if (error || !property) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm p-5 border-0 rounded-4 max-w-md mx-auto" style={{ maxWidth: '500px' }}>
          <i className="bi bi-exclamation-circle text-danger fs-1 mb-3"></i>
          <h4 className="fw-bold">Property Not Found</h4>
          <p className="text-muted">{error || 'The property you are looking for is unavailable or has been removed.'}</p>
          <div className="mt-3">
            <Link to="/properties" className="btn btn-primary rounded-pill px-4">
              Return to Properties
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80'];

  const isOwnerOfProperty = user && property.owner && property.owner._id === user.id;

  return (
    <div className="container py-4">
      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/properties" className="text-decoration-none">Properties</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{property.title}</li>
        </ol>
      </nav>

      {/* Main Details Grid */}
      <div className="row g-4">
        {/* Left Column: Image Gallery, Specs, Description, Amenities */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4 bg-white">
            {/* Main Featured Photo */}
            <div className="position-relative">
              <img
                src={images[activeImageIndex]}
                alt={property.title}
                className="property-gallery-main"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <span className="badge bg-primary position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow">
                {property.propertyType}
              </span>
              <span className={`badge position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill shadow ${
                property.availability ? 'bg-success' : 'bg-danger'
              }`}>
                {property.availability ? 'Available for Rent' : 'Occupied / Rented'}
              </span>
            </div>

            {/* Thumbnails Row if multiple images */}
            {images.length > 1 && (
              <div className="p-3 bg-light border-top d-flex gap-2 overflow-auto">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className={`property-thumb ${activeImageIndex === idx ? 'active' : ''}`}
                    style={{ width: '120px' }}
                    onClick={() => setActiveImageIndex(idx)}
                  />
                ))}
              </div>
            )}

            <div className="card-body p-4">
              <div className="d-flex align-items-center text-muted small mb-2">
                <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                <span className="fw-semibold">{property.location}</span>
                <span className="mx-2">•</span>
                <span>{property.address}</span>
              </div>

              <h2 className="fw-bold text-dark mb-3">{property.title}</h2>

              {/* Specs Row */}
              <div className="row g-3 py-3 my-2 border-top border-bottom text-center">
                <div className="col-4">
                  <div className="p-2 bg-light rounded-3">
                    <i className="bi bi-door-closed fs-4 text-primary"></i>
                    <div className="fw-bold text-dark mt-1">{property.bedrooms} BHK</div>
                    <small className="text-muted">Bedrooms</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2 bg-light rounded-3">
                    <i className="bi bi-droplet fs-4 text-info"></i>
                    <div className="fw-bold text-dark mt-1">{property.bathrooms} Baths</div>
                    <small className="text-muted">Bathrooms</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2 bg-light rounded-3">
                    <i className="bi bi-building fs-4 text-success"></i>
                    <div className="fw-bold text-dark mt-1">{property.propertyType}</div>
                    <small className="text-muted">Type</small>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="my-4">
                <h5 className="fw-bold text-dark mb-3">About This Rental Property</h5>
                <p className="text-secondary" style={{ lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              <div className="my-4">
                <h5 className="fw-bold text-dark mb-3">Features & Amenities</h5>
                {property.amenities && property.amenities.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {property.amenities.map((amenity, idx) => (
                      <span key={idx} className="amenity-chip">
                        <i className={`bi ${getAmenityIcon(amenity)} text-primary`}></i>
                        {amenity}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted small">No specific amenities specified for this listing.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Booking Action Card & Owner Details */}
        <div className="col-lg-4">
          <div className="sticky-top" style={{ top: '90px' }}>
            {/* Rent & Booking Card */}
            <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
              <div className="mb-3">
                <span className="text-muted small text-uppercase fw-bold">Monthly Rental</span>
                <div className="d-flex align-items-baseline">
                  <h2 className="fw-bold text-primary mb-0">₹{property.rent?.toLocaleString('en-IN')}</h2>
                  <span className="text-muted ms-2">/ month</span>
                </div>
              </div>

              <hr className="my-3" />

              {/* Feedback messages */}
              {bookingSuccess && (
                <AlertMessage type="success" message={bookingSuccess} onClose={() => setBookingSuccess('')} />
              )}
              {bookingError && (
                <AlertMessage type="danger" message={bookingError} onClose={() => setBookingError('')} />
              )}

              {/* If user is the owner */}
              {isOwnerOfProperty ? (
                <div className="p-3 bg-light rounded-3 text-center">
                  <i className="bi bi-person-check text-primary fs-3"></i>
                  <h6 className="fw-bold mt-2">You own this listing</h6>
                  <p className="text-muted small mb-3">You can manage, edit, or adjust pricing from your dashboard.</p>
                  <Link to={`/properties/edit/${property._id}`} className="btn btn-outline-primary w-100 rounded-pill fw-semibold">
                    <i className="bi bi-pencil-square me-1"></i> Edit Property Details
                  </Link>
                </div>
              ) : property.availability === false ? (
                <div className="p-3 bg-light rounded-3 text-center">
                  <i className="bi bi-lock-fill text-secondary fs-3"></i>
                  <h6 className="fw-bold mt-2">Currently Occupied</h6>
                  <p className="text-muted small mb-0">This property is currently leased and not accepting new booking requests.</p>
                </div>
              ) : (
                /* Booking Request Form */
                <div>
                  <h6 className="fw-bold mb-3">
                    <i className="bi bi-calendar-event text-primary me-2"></i>Request a Rental Booking
                  </h6>

                  {!isAuthenticated ? (
                    <div className="text-center p-3 bg-light rounded-3">
                      <p className="small text-muted mb-3">
                        Sign in as a <strong>Tenant</strong> to request a booking for this property.
                      </p>
                      <Link to="/login" state={{ from: { pathname: `/properties/${id}` } }} className="btn btn-primary w-100 rounded-pill fw-bold">
                        Sign In to Request
                      </Link>
                    </div>
                  ) : !isTenant ? (
                    <div className="alert alert-info small mb-0">
                      <i className="bi bi-info-circle me-1"></i> You are currently signed in as an <strong>{user?.role}</strong>. Only Tenant accounts can place rental booking requests.
                    </div>
                  ) : (
                    <form onSubmit={handleBookingSubmit}>
                      <div className="mb-3">
                        <label className="form-label small fw-bold text-secondary">
                          Intended Move-In Date *
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          min={new Date().toISOString().split('T')[0]}
                          value={moveInDate}
                          onChange={(e) => setMoveInDate(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-bold text-secondary">
                          Message / Note to Landlord (Optional)
                        </label>
                        <textarea
                          rows="3"
                          className="form-control"
                          placeholder="Introduce yourself, your lease duration, or request a visit..."
                          value={bookingMessage}
                          onChange={(e) => setBookingMessage(e.target.value)}
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary w-100 py-2 fw-bold shadow-sm rounded-pill"
                        disabled={bookingLoading}
                      >
                        {bookingLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Submitting Request...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-send-check me-2"></i>Send Booking Request
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Landlord Contact Box */}
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-person-circle text-primary me-2"></i>Property Landlord
              </h6>
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}>
                  {property.owner?.name?.charAt(0) || 'O'}
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-dark">{property.owner?.name || 'Verified Landlord'}</h6>
                  <span className="badge bg-success-subtle text-success small">
                    <i className="bi bi-patch-check-fill me-1"></i>Verified Host
                  </span>
                </div>
              </div>

              {property.owner?.email && (
                <div className="d-flex align-items-center small text-secondary mb-2">
                  <i className="bi bi-envelope me-2 text-primary"></i>
                  <span>{property.owner.email}</span>
                </div>
              )}

              {property.owner?.phone && (
                <div className="d-flex align-items-center small text-secondary">
                  <i className="bi bi-telephone me-2 text-primary"></i>
                  <span>{property.owner.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
