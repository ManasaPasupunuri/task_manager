// ──────────────────────────────────────────────
// Auth Service
// ──────────────────────────────────────────────
// Business logic for user registration and login.

const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const { signToken } = require('../utils/jwt');

const SALT_ROUNDS = 12;

/**
 * Register a new user.
 * @param {{ name: string, email: string, password: string }} data
 * @returns {{ user: object, token: string }}
 */
async function signup({ name, email, password }) {
  // Check if email is already taken
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Email is already registered.');
    err.statusCode = 409;
    throw err;
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user with default MEMBER role
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: 'MEMBER' },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const token = signToken({ id: user.id, email: user.email, role: user.role });

  return { user, token };
}

/**
 * Authenticate a user by email and password.
 * @param {{ email: string, password: string }} data
 * @returns {{ user: object, token: string }}
 */
async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token,
  };
}

/**
 * Get current user profile by ID.
 * @param {string} userId
 */
async function getMe(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  if (!user) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }
  return user;
}

module.exports = { signup, login, getMe };
