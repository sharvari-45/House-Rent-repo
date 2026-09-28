import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertMessage from '../components/AlertMessage';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Tenant',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { name, email, phone, role, password, confirmPassword } = formData;

    if (!name || !email || !password) {
      setError('Please fill in all mandatory fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const res = await register({
        name,
        email,
        phone,
        role,
        password,
      });

      if (res.user.role === 'Property Owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/properties');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <div className="form-card shadow-sm">
            <div className="text-center mb-4">
              <div className="bg-primary text-white p-3 rounded-circle d-inline-flex mb-2 shadow-sm">
                <i className="bi bi-person-plus fs-3"></i>
              </div>
              <h3 className="fw-bold text-dark">Create Your Account</h3>
              <p className="text-muted small">Join House Rent as a Tenant or Property Owner</p>
            </div>

            {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">
                  <i className="bi bi-person text-primary me-1"></i> Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-7">
                  <label className="form-label">
                    <i className="bi bi-envelope text-primary me-1"></i> Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-5">
                  <label className="form-label">
                    <i className="bi bi-telephone text-primary me-1"></i> Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="mb-3">
                <label className="form-label">
                  <i className="bi bi-person-badge text-primary me-1"></i> I want to register as: *
                </label>
                <div className="row g-2">
                  <div className="col-6">
                    <label
                      className={`btn w-100 p-3 text-start border rounded-3 d-flex align-items-center gap-2 ${
                        formData.role === 'Tenant'
                          ? 'btn-outline-primary border-2 bg-primary-subtle fw-bold'
                          : 'btn-outline-secondary'
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="Tenant"
                        checked={formData.role === 'Tenant'}
                        onChange={handleChange}
                        className="form-check-input mt-0"
                      />
                      <div>
                        <div>Tenant</div>
                        <small className="text-muted fw-normal d-none d-sm-block">Find & rent homes</small>
                      </div>
                    </label>
                  </div>

                  <div className="col-6">
                    <label
                      className={`btn w-100 p-3 text-start border rounded-3 d-flex align-items-center gap-2 ${
                        formData.role === 'Property Owner'
                          ? 'btn-outline-primary border-2 bg-primary-subtle fw-bold'
                          : 'btn-outline-secondary'
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="Property Owner"
                        checked={formData.role === 'Property Owner'}
                        onChange={handleChange}
                        className="form-check-input mt-0"
                      />
                      <div>
                        <div>Property Owner</div>
                        <small className="text-muted fw-normal d-none d-sm-block">List & manage houses</small>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label">
                    <i className="bi bi-key text-primary me-1"></i> Password *
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="form-control"
                      placeholder="Min 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    <i className="bi bi-check-all text-primary me-1"></i> Confirm Password *
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-bold shadow-sm"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Account...
                  </>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </form>

            <div className="text-center mt-4 pt-2 border-top">
              <p className="text-muted small mb-0">
                Already registered?{' '}
                <Link to="/login" className="text-primary fw-bold text-decoration-none">
                  Sign In Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
