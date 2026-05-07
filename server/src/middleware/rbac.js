// ──────────────────────────────────────────────
// Role-Based Access Control Middleware
// ──────────────────────────────────────────────
// Two middleware factories:
//   1. requireGlobalRole  — checks the user's global role (ADMIN/MEMBER)
//   2. requireProjectRole — checks the user's role within a specific project
//
// Both assume `authenticate` middleware has already run and req.user exists.

const prisma = require('../lib/prisma');

/**
 * Restrict access to users with one of the specified global roles.
 * @param {...string} allowedRoles – e.g. 'ADMIN', 'MEMBER'
 */
function requireGlobalRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden. Insufficient global role.' });
    }
    next();
  };
}

/**
 * Restrict access to members of a project. Optionally require a specific project role.
 * Reads :id or :projectId from route params.
 * Attaches req.projectMembership with the user's membership record.
 *
 * @param {...string} allowedProjectRoles – e.g. 'ADMIN'. If empty, any project member is allowed.
 */
function requireProjectRole(...allowedProjectRoles) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required.' });
      }

      const projectId = req.params.id || req.params.projectId;
      if (!projectId) {
        return res.status(400).json({ message: 'Project ID is required.' });
      }

      // Look up the user's membership in this project
      const membership = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId,
            userId: req.user.id,
          },
        },
      });

      if (!membership) {
        return res.status(403).json({ message: 'You are not a member of this project.' });
      }

      // If specific project roles are required, check them
      if (allowedProjectRoles.length > 0 && !allowedProjectRoles.includes(membership.role)) {
        return res.status(403).json({ message: 'Forbidden. Insufficient project role.' });
      }

      // Attach membership info for downstream use
      req.projectMembership = membership;
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { requireGlobalRole, requireProjectRole };
