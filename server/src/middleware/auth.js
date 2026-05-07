// ──────────────────────────────────────────────
// Authentication Middleware
// ──────────────────────────────────────────────
// Extracts JWT from Authorization header, verifies it,
// and attaches the decoded user to req.user.
// Returns 401 if token is missing or invalid.

const { verifyToken } = require('../utils/jwt');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    // Attach user info to request for downstream handlers
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

module.exports = { authenticate };
