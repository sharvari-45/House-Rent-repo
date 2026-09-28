import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="custom-footer mt-auto">
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-primary text-white p-2 rounded-3 me-2 d-flex align-items-center justify-content-center" style={{ width: '34px', height: '34px' }}>
                <i className="bi bi-house-heart-fill"></i>
              </div>
              <h5 className="text-white mb-0 fw-bold">House Rent</h5>
            </div>
            <p className="text-secondary small">
              A comprehensive Full-Stack MERN house rental management platform. Empowering tenants with transparent property discovery, enabling owners to easily list residences, and streamlining admin approvals.
            </p>
            <div className="d-flex gap-3 fs-5 text-secondary">
              <a href="#github" className="footer-link"><i className="bi bi-github"></i></a>
              <a href="#linkedin" className="footer-link"><i className="bi bi-linkedin"></i></a>
              <a href="#globe" className="footer-link"><i className="bi bi-globe"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-3">Quick Navigation</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/properties" className="footer-link">Explore Listings</Link></li>
              <li><Link to="/login" className="footer-link">Sign In</Link></li>
              <li><Link to="/register" className="footer-link">Join as Tenant / Owner</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Platform Portals</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link to="/my-bookings" className="footer-link">Tenant Rental Portal</Link></li>
              <li><Link to="/owner/dashboard" className="footer-link">Property Owner Hub</Link></li>
              <li><Link to="/owner/add-property" className="footer-link">Post Rental Home</Link></li>
              <li><Link to="/admin/dashboard" className="footer-link">Admin Oversight & Approvals</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Project Specifications</h6>
            <div className="p-3 rounded-3" style={{ background: '#1e293b' }}>
              <span className="badge bg-primary mb-2">SkillWallet Project</span>
              <p className="text-secondary small mb-1">
                <strong>Project:</strong> House Rent Management
              </p>
              <p className="text-secondary small mb-1">
                <strong>Stack:</strong> React.js, Express, Node.js, MongoDB
              </p>
              <p className="text-secondary small mb-0">
                <strong>Evaluation:</strong> B.Tech Final Demonstration
              </p>
            </div>
          </div>
        </div>

        <hr className="border-secondary opacity-25" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-secondary pt-2">
          <div>
            &copy; {new Date().getFullYear()} House Rent Management System. Built with MERN Stack.
          </div>
          <div className="mt-2 mt-md-0">
            <span>SkillWallet House Hunt Implementation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
