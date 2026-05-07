// ──────────────────────────────────────────────
// Auth Routes
// ──────────────────────────────────────────────
// POST /api/auth/signup  – Register
// POST /api/auth/login   – Login
// GET  /api/auth/me      – Current user profile

const { Router } = require('express');
const { z } = require('zod');
const authController = require('../controllers/auth');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = Router();

// Validation schemas
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
