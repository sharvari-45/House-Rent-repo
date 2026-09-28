import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

const PropertyListings = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  // Filter states initialized from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') || 'All');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  // Fetch properties whenever searchParams change
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError('');

        const queryString = searchParams.toString();
        const res = await api.get(`/properties?${queryString}`);

        if (res.data.success) {
          setProperties(res.data.properties || []);
          setTotalCount(res.data.total || 0);
        }
      } catch (err) {
        console.error('Failed to fetch properties:', err.message);
        setError(err.message || 'Failed to fetch rental listings');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams]);

  // Apply filters and update URL search params
  const applyFilters = (e) => {
    if (e) e.preventDefault();

    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (location.trim()) params.set('location', location.trim());
    if (propertyType && propertyType !== 'All') params.set('propertyType', propertyType);
    if (bedrooms && bedrooms !== 'All') params.set('bedrooms', bedrooms);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sort && sort !== 'newest') params.set('sort', sort);

    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearch('');
    setLocation('');
    setPropertyType('All');
    setBedrooms('All');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold text-dark">Explore Rental Homes</h2>
        <p className="text-muted">
          Showing verified homes available for lease across India ({totalCount} {totalCount === 1 ? 'property' : 'properties'} found)
        </p>
      </div>

      {/* Filter Sidebar & Results Grid */}
      <div className="row g-4">
        {/* Filters Panel */}
        <div className="col-lg-3">
          <div className="card shadow-sm border-0 rounded-4 p-4 sticky-top" style={{ top: '90px' }}>
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <h5 className="fw-bold mb-0">
                <i className="bi bi-funnel-fill text-primary me-2"></i>Filters
              </h5>
              <button
                type="button"
                className="btn btn-sm btn-link text-decoration-none text-muted p-0"
                onClick={handleResetFilters}
              >
                Reset All
              </button>
            </div>

            <form onSubmit={applyFilters}>
              {/* Keyword / Locality */}
              <div className="mb-3">
                <label className="form-label text-secondary small fw-bold">Keywords / Locality</label>
                <div className="input-group">
                  <span className="input-group-text bg-white text-muted"><i className="bi bi-search"></i></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Indiranagar, Balcony"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* City / Location */}
              <div className="mb-3">
                <label className="form-label text-secondary small fw-bold">City / Location</label>
                <select
                  className="form-select"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">All Cities</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Pune">Pune</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                </select>
              </div>

              {/* Property Type */}
              <div className="mb-3">
                <label className="form-label text-secondary small fw-bold">Property Type</label>
                <select
                  className="form-select"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Independent House">Independent House</option>
                  <option value="Villa">Villa</option>
                  <option value="Studio">Studio</option>
                  <option value="PG/Hostel">PG / Hostel</option>
                </select>
              </div>

              {/* Bedrooms */}
              <div className="mb-3">
                <label className="form-label text-secondary small fw-bold">Bedrooms</label>
                <select
                  className="form-select"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                >
                  <option value="All">Any Bedrooms</option>
                  <option value="1">1 BHK / 1 Room</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4+ BHK</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-3">
                <label className="form-label text-secondary small fw-bold">Monthly Rent (₹)</label>
                <div className="row g-2">
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="Min ₹"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="Max ₹"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-4">
                <label className="form-label text-secondary small fw-bold">Sort By</label>
                <select
                  className="form-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary w-100 fw-bold shadow-sm">
                Apply Filters
              </button>
            </form>
          </div>
        </div>

        {/* Listings Section */}
        <div className="col-lg-9">
          {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}

          {loading ? (
            <LoadingSpinner message="Searching properties matching your criteria..." />
          ) : properties.length === 0 ? (
            <div className="card shadow-sm border-0 rounded-4 text-center py-5 px-4 bg-white">
              <div className="text-muted mb-3">
                <i className="bi bi-search fs-1"></i>
              </div>
              <h4 className="fw-bold">No Matching Properties Found</h4>
              <p className="text-muted mx-auto" style={{ maxWidth: '400px' }}>
                We couldn't find any approved properties that match your search filters. Try broadening your criteria or reset filters.
              </p>
              <div className="mt-2">
                <button className="btn btn-outline-primary rounded-pill px-4" onClick={handleResetFilters}>
                  Clear All Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {properties.map((property) => (
                <div key={property._id} className="col-md-6 col-xl-4">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyListings;
