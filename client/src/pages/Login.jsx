import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertMessage from '../components/AlertMessage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      // Smart redirect based on role
      if (location.state?.from?.pathname) {
        navigate(location.state.from.pathname);
      } else if (res.user.role === 'Admin') {
        navigate('/admin/dashboard');
      } else if (res.user.role === 'Property Owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/properties');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Helper for 1-Click Demo Login during B.Tech Evaluation
  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-8">
          <div className="form-card shadow-sm">
            <div className="text-center mb-4">
              <div className="bg-primary text-white p-3 rounded-circle d-inline-flex mb-2 shadow-sm">
                <i className="bi bi-box-arrow-in-right fs-3"></i>
              </div>
              <h3 className="fw-bold text-dark">Welcome Back</h3>
              <p className="text-muted small">Sign in to manage your house rentals & bookings</p>
            </div>

            {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">
                  <i className="bi bi-envelope text-primary me-1"></i> Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label d-flex justify-content-between">
                  <span><i className="bi bi-key text-primary me-1"></i> Password</span>
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
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
                    Authenticating...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Quick 1-Click Demo Accounts for College Presentation */}
            <div className="mt-4 pt-3 border-top">
              <div className="text-center mb-2">
                <span className="badge bg-secondary-subtle text-secondary px-3 py-1 rounded-pill small fw-semibold">
                  <i className="bi bi-lightning-charge-fill text-warning me-1"></i> Fast Demo Accounts (Click to Autofill)
                </span>
              </div>
              <div className="d-grid gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger text-start px-3 py-2 d-flex align-items-center justify-content-between"
                  onClick={() => handleQuickLogin('admin@houserent.com', 'admin123')}
                >
                  <span><i className="bi bi-shield-lock-fill me-2 text-danger"></i> <strong>Admin</strong> (admin@houserent.com)</span>
                  <span className="badge bg-danger text-white">Select</span>
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary text-start px-3 py-2 d-flex align-items-center justify-content-between"
                  onClick={() => handleQuickLogin('owner1@houserent.com', 'owner123')}
                >
                  <span><i className="bi bi-building me-2 text-primary"></i> <strong>Owner</strong> (owner1@houserent.com)</span>
                  <span className="badge bg-primary text-white">Select</span>
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-success text-start px-3 py-2 d-flex align-items-center justify-content-between"
                  onClick={() => handleQuickLogin('tenant1@houserent.com', 'tenant123')}
                >
                  <span><i className="bi bi-person-fill me-2 text-success"></i> <strong>Tenant</strong> (tenant1@houserent.com)</span>
                  <span className="badge bg-success text-white">Select</span>
                </button>
              </div>
            </div>

            <div className="text-center mt-4 pt-2">
              <p className="text-muted small mb-0">
                Don't have an account yet?{' '}
                <Link to="/register" className="text-primary fw-bold text-decoration-none">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
