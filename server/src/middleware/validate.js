// ──────────────────────────────────────────────
// Zod Validation Middleware
// ──────────────────────────────────────────────
// Factory that takes a Zod schema and returns
// Express middleware validating req.body against it.

const { ZodError } = require('zod');

/**
 * Validate req.body against a Zod schema.
 * Returns 400 with structured errors if validation fails.
 * @param {import('zod').ZodSchema} schema
 */
function validate(schema) {
  return (req, res, next) => {
    try {
      // Parse and replace body with validated + coerced data
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        return res.status(400).json({ message: 'Validation failed.', details });
      }
      next(error);
    }
  };
}

module.exports = { validate };
