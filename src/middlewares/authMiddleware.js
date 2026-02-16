const { verifyAccessToken } = require("../utils/jwtHelper");
const Users = require("../Models/User");

const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header first (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    // Fallback to cookies
    if (!token && req.cookies) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
        success: false,
      });
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid or expired token. Please login again.",
        success: false,
      });
    }

    // Verify user still exists in database and the token matches (Single Session Control)
    const user = await Users.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user || user.token !== token) {
      return res.status(401).json({
        message: "Session expired or invalid token. Please login again.",
        success: false,
      });
    }

    // Attach user info to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      userType: decoded.userType,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({
      message: "Authentication failed",
      success: false,
    });
  }
};

/**
 * Role-based Authorization Middleware
 * @param  {...string} allowedRoles - Roles that are allowed to access the route
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
        success: false,
      });
    }

    // Convert to uppercase for case-insensitive comparison
    const userRole = req.user.userType?.toUpperCase();
    const allowed = allowedRoles.map((role) => role.toUpperCase());

    if (!allowed.includes(userRole)) {
      return res.status(403).json({
        message:
          "Access denied. You do not have permission to perform this action.",
        success: false,
      });
    }

    next();
  };
};

/**
 * Optional Authentication Middleware
 * Attaches user to request if token is valid, but doesn't block if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    if (!token && req.cookies) {
      token = req.cookies.accessToken;
    }

    if (token) {
      const decoded = verifyAccessToken(token);
      if (decoded) {
        req.user = {
          id: decoded.id,
          email: decoded.email,
          userType: decoded.userType,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
        };
      }
    }

    next();
  } catch (error) {
    // Continue without user data
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
};
