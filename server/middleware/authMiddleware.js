const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes: verify JWT Bearer token and attach user to req.user
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'house_rent_jwt_secret_dev_key');

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'The user belonging to this token no longer exists.',
        });
      }

      return next();
    } catch (error) {
      console.error('[AuthMiddleware] Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized! Token is invalid or expired.',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized! No authentication token provided.',
    });
  }
};

// Grant access to specific roles (e.g. 'Admin', 'Property Owner', 'Tenant')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user ? req.user.role : 'Guest'}' is not authorized to access this resource. Required: [${roles.join(', ')}]`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
