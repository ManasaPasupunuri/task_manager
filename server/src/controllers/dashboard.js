// ──────────────────────────────────────────────
// Dashboard Controller
// ──────────────────────────────────────────────

const dashboardService = require('../services/dashboard');

async function getOverview(req, res, next) {
  try {
    const overview = await dashboardService.getOverview(req.user.id);
    res.json(overview);
  } catch (err) {
    next(err);
  }
}

module.exports = { getOverview };
