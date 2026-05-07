// ──────────────────────────────────────────────
// JWT Utility Functions
// ──────────────────────────────────────────────
// Signs and verifies JSON Web Tokens for auth.

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Sign a JWT containing the user's id, email, and role.
 * @param {{ id: string, email: string, role: string }} payload
 * @returns {string} Signed JWT
 */
function signToken(payload) {
  return jwt.sign(
    { id: payload.id, email: payload.email, role: payload.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Verify and decode a JWT.
 * @param {string} token
 * @returns {{ id: string, email: string, role: string }} Decoded payload
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { signToken, verifyToken };
