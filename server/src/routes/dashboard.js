// ──────────────────────────────────────────────
// Dashboard Routes
// ──────────────────────────────────────────────
// GET /api/dashboard/overview – User dashboard stats

const { Router } = require('express');
const dashboardController = require('../controllers/dashboard');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.use(authenticate);
router.get('/overview', dashboardController.getOverview);

module.exports = router;
