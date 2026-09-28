import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';

const COMMON_AMENITIES = [
  'WiFi',
  'Air Conditioning',
  'Power Backup',
  'Car Parking',
  'Gym',
  'Swimming Pool',
  'Furnished',
  '24x7 Security',
  'Water Supply',
  'Elevator',
  'Terrace Garden',
  'Pet Friendly',
];

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
];

const AddEditProperty = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: 'Bangalore',
    address: '',
    rent: '',
    propertyType: 'Apartment',
    bedrooms: '2',
    bathrooms: '2',
    amenities: ['WiFi', 'Power Backup', '24x7 Security'],
    images: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    availability: true,
  });

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchProperty = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/properties/${id}`);
          if (res.data.success) {
            const p = res.data.property;
            setFormData({
              title: p.title,
              description: p.description,
              location: p.location,
              address: p.address,
              rent: p.rent,
              propertyType: p.propertyType,
              bedrooms: p.bedrooms,
              bathrooms: p.bathrooms,
              amenities: p.amenities || [],
              images: Array.isArray(p.images) ? p.images.join(', ') : p.images,
              availability: p.availability,
            });
          }
        } catch (err) {
          setError(err.message || 'Failed to retrieve property for editing');
        } finally {
          setLoading(false);
        }
      };

      fetchProperty();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => {
      const current = prev.amenities;
      if (current.includes(amenity)) {
        return { ...prev, amenities: current.filter((a) => a !== amenity) };
      } else {
        return { ...prev, amenities: [...current, amenity] };
      }
    });
  };

  const handleAddPresetImage = (url) => {
    setFormData((prev) => {
      const currentImages = prev.images.trim();
      if (!currentImages) return { ...prev, images: url };
      if (currentImages.includes(url)) return prev;
      return { ...prev, images: `${currentImages}, ${url}` };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Process image URLs
    const imageList = formData.images
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (imageList.length === 0) {
      setError('Please provide at least one valid image URL');
      return;
    }

    const payload = {
      ...formData,
      rent: Number(formData.rent),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      images: imageList,
    };

    try {
      setSaving(true);
      if (isEditMode) {
        const res = await api.put(`/properties/${id}`, payload);
        if (res.data.success) {
          setSuccess('Property updated successfully!');
          setTimeout(() => navigate('/owner/dashboard'), 1200);
        }
      } else {
        const res = await api.post('/properties', payload);
        if (res.data.success) {
          setSuccess('Property listing created successfully! It is now pending admin approval.');
          setTimeout(() => navigate('/owner/dashboard'), 1500);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to save property listing');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading property details..." />;
  }

  return (
    <div className="container py-4">
      {/* Header & Back link */}
      <div className="mb-4">
        <Link to="/owner/dashboard" className="text-secondary small text-decoration-none mb-2 d-inline-block">
          <i className="bi bi-arrow-left me-1"></i> Back to Owner Dashboard
        </Link>
        <h2 className="fw-bold text-dark">
          {isEditMode ? 'Edit Rental Property' : 'List a New Rental Property'}
        </h2>
        <p className="text-muted small">
          {isEditMode
            ? 'Update specifications, pricing, amenities, or availability'
            : 'Fill in details below. New listings will undergo admin approval before appearing publicly.'}
        </p>
      </div>

      {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="form-card shadow-sm">
            <form onSubmit={handleSubmit}>
              {/* Basic Info */}
              <h5 className="fw-bold text-primary mb-3">1. Basic Property Details</h5>
              <div className="mb-3">
                <label className="form-label">Property Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="e.g. Spacious 3BHK Apartment with Balcony"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label">Property Type *</label>
                  <select
                    name="propertyType"
                    className="form-select"
                    value={formData.propertyType}
                    onChange={handleChange}
                    required
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Independent House">Independent House</option>
                    <option value="Villa">Villa</option>
                    <option value="Studio">Studio</option>
                    <option value="PG/Hostel">PG / Hostel</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Monthly Rent (₹) *</label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      name="rent"
                      className="form-control"
                      placeholder="e.g. 25000"
                      min="500"
                      value={formData.rent}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-2">
                  <label className="form-label">Bedrooms *</label>
                  <input
                    type="number"
                    name="bedrooms"
                    className="form-control"
                    min="1"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-2">
                  <label className="form-label">Bathrooms *</label>
                  <input
                    type="number"
                    name="bathrooms"
                    className="form-control"
                    min="1"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <h5 className="fw-bold text-primary mb-3 mt-4">2. Location & Address</h5>
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label">City / Region *</label>
                  <select
                    name="location"
                    className="form-select"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  >
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                  </select>
                </div>

                <div className="col-md-8">
                  <label className="form-label">Complete Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    placeholder="e.g. Flat 402, Sunshine Towers, 12th Main, Indiranagar"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="form-label">Detailed Property Description *</label>
                <textarea
                  name="description"
                  rows="4"
                  className="form-control"
                  placeholder="Describe your property, furnishings, proximity to tech parks/schools, ventilation, and lease conditions..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              {/* Amenities */}
              <h5 className="fw-bold text-primary mb-3 mt-4">3. Amenities & Facilities</h5>
              <div className="row g-2 mb-4">
                {COMMON_AMENITIES.map((amenity) => {
                  const isSelected = formData.amenities.includes(amenity);
                  return (
                    <div key={amenity} className="col-6 col-md-3">
                      <div
                        className={`p-2 border rounded-3 text-center small fw-semibold user-select-none ${
                          isSelected ? 'bg-primary text-white border-primary' : 'bg-light text-secondary'
                        }`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleAmenityToggle(amenity)}
                      >
                        <i className={`bi ${isSelected ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
                        {amenity}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Images */}
              <h5 className="fw-bold text-primary mb-3 mt-4">4. Property Photos (Image URLs)</h5>
              <div className="mb-3">
                <label className="form-label small text-secondary">
                  Image URLs (Separate multiple with commas)
                </label>
                <input
                  type="text"
                  name="images"
                  className="form-control"
                  placeholder="https://images.unsplash.com/..., https://..."
                  value={formData.images}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Quick Preset Photos */}
              <div className="mb-4 p-3 bg-light rounded-3">
                <label className="small fw-bold text-secondary mb-2 d-block">
                  Click to add high-resolution sample photos:
                </label>
                <div className="d-flex gap-2 flex-wrap">
                  {PRESET_IMAGES.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="preset"
                      className="rounded border"
                      style={{ width: '80px', height: '55px', objectFit: 'cover', cursor: 'pointer' }}
                      title="Click to add this image"
                      onClick={() => handleAddPresetImage(img)}
                    />
                  ))}
                </div>
              </div>

              {/* Availability Status */}
              <div className="form-check form-switch mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="availabilitySwitch"
                  name="availability"
                  checked={formData.availability}
                  onChange={handleChange}
                />
                <label className="form-check-label fw-semibold" htmlFor="availabilitySwitch">
                  Mark Property as Currently Available for Rent
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="d-flex gap-3 justify-content-end pt-3 border-top">
                <Link to="/owner/dashboard" className="btn btn-outline-secondary px-4 rounded-pill">
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary px-5 rounded-pill fw-bold shadow-sm"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving Listing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-cloud-arrow-up-fill me-2"></i>
                      {isEditMode ? 'Update Property' : 'Submit for Admin Approval'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditProperty;
