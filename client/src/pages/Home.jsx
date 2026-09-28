import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Hero search bar state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const res = await api.get('/properties?limit=6');
        if (res.data.success) {
          setFeaturedProperties(res.data.properties || []);
        }
      } catch (err) {
        console.error('Failed to load featured properties:', err.message);
        setError('Unable to load featured properties. Please check if backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (selectedCity.trim()) params.append('location', selectedCity.trim());
    if (selectedType && selectedType !== 'All') params.append('propertyType', selectedType);

    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section text-center">
        <div className="container py-4">
          <span className="badge bg-primary bg-opacity-50 text-white border border-primary-subtle px-3 py-2 rounded-pill mb-3">
            <i className="bi bi-patch-check-fill me-1"></i> Verified Rental Marketplace
          </span>
          <h1 className="hero-title display-4">Find Your Dream Rental Home</h1>
          <p className="hero-subtitle">
            Discover verified apartments, modern villas, cozy studios, and family homes in premier locations with seamless booking and transparent pricing.
          </p>

          <div className="d-flex justify-content-center gap-3 mt-4">
            <Link to="/properties" className="btn btn-primary btn-lg rounded-pill px-4 shadow">
              <i className="bi bi-houses me-2"></i> Browse All Listings
            </Link>
            <Link to="/register" className="btn btn-outline-light btn-lg rounded-pill px-4">
              <i className="bi bi-person-plus me-2"></i> List Your Property
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Search Container */}
      <div className="container">
        <div className="hero-search-box">
          <form onSubmit={handleHeroSearch}>
            <div className="row g-3 align-items-end">
              <div className="col-lg-4 col-md-6">
                <label className="form-label text-secondary small fw-bold">
                  <i className="bi bi-search text-primary me-1"></i> Keywords / Locality
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Indiranagar, Bandra, Sea View, 2BHK"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="col-lg-3 col-md-6">
                <label className="form-label text-secondary small fw-bold">
                  <i className="bi bi-geo-alt-fill text-danger me-1"></i> City / Location
                </label>
                <select
                  className="form-select"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="">All Indian Cities</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Pune">Pune</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                </select>
              </div>

              <div className="col-lg-3 col-md-6">
                <label className="form-label text-secondary small fw-bold">
                  <i className="bi bi-building text-success me-1"></i> Property Type
                </label>
                <select
                  className="form-select"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Independent House">Independent House</option>
                  <option value="Villa">Villa</option>
                  <option value="Studio">Studio</option>
                  <option value="PG/Hostel">PG / Hostel</option>
                </select>
              </div>

              <div className="col-lg-2 col-md-6">
                <button type="submit" className="btn btn-primary w-100 fw-bold py-2">
                  <i className="bi bi-search me-1"></i> Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Trust & Stats Counter */}
      <section className="container py-5 mt-4">
        <div className="row g-4 text-center">
          <div className="col-6 col-md-3">
            <div className="p-3 bg-white rounded-4 border shadow-sm">
              <i className="bi bi-shield-check text-primary fs-2"></i>
              <h3 className="fw-bold mt-2 mb-0">100%</h3>
              <p className="text-muted small mb-0">Admin Verified Listings</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 bg-white rounded-4 border shadow-sm">
              <i className="bi bi-people-fill text-success fs-2"></i>
              <h3 className="fw-bold mt-2 mb-0">5,000+</h3>
              <p className="text-muted small mb-0">Happy Tenants</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 bg-white rounded-4 border shadow-sm">
              <i className="bi bi-building-check text-info fs-2"></i>
              <h3 className="fw-bold mt-2 mb-0">1,200+</h3>
              <p className="text-muted small mb-0">Listed Properties</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 bg-white rounded-4 border shadow-sm">
              <i className="bi bi-currency-rupee text-warning fs-2"></i>
              <h3 className="fw-bold mt-2 mb-0">₹0</h3>
              <p className="text-muted small mb-0">Zero Hidden Brokerage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="container py-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <div>
            <span className="text-primary fw-bold text-uppercase small">Handpicked Homes</span>
            <h2 className="fw-bold text-dark mb-0">Featured Rental Properties</h2>
          </div>
          <Link to="/properties" className="btn btn-outline-primary rounded-pill mt-3 mt-md-0 fw-semibold">
            View All Properties <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        {error && <AlertMessage type="warning" message={error} />}

        {loading ? (
          <LoadingSpinner message="Fetching featured properties..." />
        ) : featuredProperties.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 border">
            <i className="bi bi-house-exclamation text-muted fs-1 mb-3"></i>
            <h5 className="fw-bold">No Properties Available</h5>
            <p className="text-muted">There are currently no approved rental properties listed.</p>
          </div>
        ) : (
          <div className="row g-4">
            {featuredProperties.map((property) => (
              <div key={property._id} className="col-lg-4 col-md-6">
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="container py-5">
        <div className="text-center mb-5">
          <span className="text-primary fw-bold text-uppercase small">Simple & Transparent</span>
          <h2 className="fw-bold">How House Rent Works</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
            A streamlined 3-step journey designed for both prospective tenants and property owners.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="feature-box h-100">
              <div className="feature-icon bg-primary-subtle text-primary p-3 rounded-circle d-inline-flex mb-3">
                <i className="bi bi-search fs-3"></i>
              </div>
              <h5 className="fw-bold">1. Discover & Filter</h5>
              <p className="text-muted small">
                Explore real-time listings with high-resolution imagery, detailed amenities, and transparent pricing in top localities.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="feature-box h-100">
              <div className="feature-icon bg-success-subtle text-success p-3 rounded-circle d-inline-flex mb-3">
                <i className="bi bi-calendar-check fs-3"></i>
              </div>
              <h5 className="fw-bold">2. Request Booking</h5>
              <p className="text-muted small">
                Tenants easily submit move-in date requests directly to owners without paying exorbitant broker commissions.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="feature-box h-100">
              <div className="feature-icon bg-info-subtle text-info p-3 rounded-circle d-inline-flex mb-3">
                <i className="bi bi-key-fill fs-3"></i>
              </div>
              <h5 className="fw-bold">3. Owner & Admin Approval</h5>
              <p className="text-muted small">
                Administrators audit listings for legitimacy, and owners review tenant booking requests directly through their dedicated portal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="container py-4 mb-4">
        <div className="p-5 rounded-4 text-white text-center shadow" style={{ background: 'linear-gradient(135deg, #1e3a8a, #0f172a)' }}>
          <h2 className="fw-bold mb-3">Are You a Property Owner?</h2>
          <p className="text-light mb-4 mx-auto" style={{ maxWidth: '650px' }}>
            List your house, apartment, or villa to connect with verified tenants across India. Enjoy full control over approvals, requests, and availability.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/register" className="btn btn-light btn-lg rounded-pill px-4 fw-bold text-primary">
              Register as Owner
            </Link>
            <Link to="/login" className="btn btn-outline-light btn-lg rounded-pill px-4">
              Owner Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
