// ──────────────────────────────────────────────
// Member Routes
// ──────────────────────────────────────────────
// GET    /api/projects/:id/members           – List members
// POST   /api/projects/:id/members           – Add member (admin only)
// DELETE /api/projects/:id/members/:userId   – Remove member (admin only)

const { Router } = require('express');
const { z } = require('zod');
const membersController = require('../controllers/members');
const { authenticate } = require('../middleware/auth');
const { requireProjectRole } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');

const router = Router({ mergeParams: true }); // mergeParams to access :id from parent

const addMemberSchema = z.object({
  email: z.string().email('Invalid email address.'),
  role: z.enum(['ADMIN', 'MEMBER']).optional().default('MEMBER'),
});

// All routes require authentication
router.use(authenticate);

router.get('/', requireProjectRole(), membersController.listMembers);
router.post('/', requireProjectRole('ADMIN'), validate(addMemberSchema), membersController.addMember);
router.delete('/:userId', requireProjectRole('ADMIN'), membersController.removeMember);

module.exports = router;
