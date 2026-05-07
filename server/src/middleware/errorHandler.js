// ──────────────────────────────────────────────
// Centralized Error Handler
// ──────────────────────────────────────────────
// Catches all unhandled errors from routes/middleware
// and returns a consistent JSON error response.

function errorHandler(err, req, res, next) {
  console.error('Unhandled error:', err.message || err);

  // Prisma known request errors (e.g. unique constraint violation)
  if (err.code === 'P2002') {
    return res.status(409).json({
      message: 'A record with that value already exists.',
      details: err.meta,
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      message: 'Record not found.',
    });
  }

  // Default to 500 Internal Server Error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal server error.',
  });
}

module.exports = { errorHandler };
