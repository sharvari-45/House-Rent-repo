import React from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  if (!property) return null;

  const {
    _id,
    title,
    location,
    rent,
    propertyType,
    bedrooms,
    bathrooms,
    images,
    availability,
  } = property;

  const displayImage =
    images && images.length > 0
      ? images[0]
      : 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80';

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'Villa':
        return 'bg-purple text-white';
      case 'Apartment':
        return 'bg-primary text-white';
      case 'Independent House':
        return 'bg-success text-white';
      case 'Studio':
        return 'bg-info text-dark';
      case 'PG/Hostel':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary text-white';
    }
  };

  return (
    <div className="property-card shadow-sm h-100">
      <div className="property-img-wrapper">
        <img
          src={displayImage}
          alt={title}
          className="property-img"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        <span className={`property-tag ${getTypeBadgeClass(propertyType)} shadow-sm`}>
          {propertyType}
        </span>
        <div className="property-rent-badge shadow-sm">
          ₹{rent?.toLocaleString('en-IN')}<small className="fs-6 fw-normal"> /mo</small>
        </div>
      </div>

      <div className="card-body p-3 d-flex flex-column">
        <div className="d-flex align-items-center text-muted small mb-2">
          <i className="bi bi-geo-alt-fill text-danger me-1"></i>
          <span className="text-truncate fw-semibold">{location}</span>
          <span className="mx-2">•</span>
          <span className={`badge ${availability ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
            {availability ? 'Available Now' : 'Currently Rented'}
          </span>
        </div>

        <h5 className="card-title fw-bold text-dark mb-2 text-truncate" title={title}>
          {title}
        </h5>

        <div className="d-flex align-items-center justify-content-between text-secondary small py-2 my-2 border-top border-bottom border-light-subtle">
          <div className="d-flex align-items-center gap-1">
            <i className="bi bi-door-closed text-primary"></i>
            <span>{bedrooms} {bedrooms === 1 ? 'Bed' : 'Beds'}</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <i className="bi bi-droplet text-primary"></i>
            <span>{bathrooms} {bathrooms === 1 ? 'Bath' : 'Baths'}</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <i className="bi bi-shield-check text-success"></i>
            <span>Verified</span>
          </div>
        </div>

        <div className="mt-auto pt-2">
          <Link to={`/properties/${_id}`} className="btn btn-outline-primary w-100 rounded-pill fw-semibold">
            View Details <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
