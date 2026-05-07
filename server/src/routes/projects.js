// ──────────────────────────────────────────────
// Project Routes
// ──────────────────────────────────────────────
// GET    /api/projects      – List user's projects
// POST   /api/projects      – Create project
// GET    /api/projects/:id  – Get project details
// PUT    /api/projects/:id  – Update project (admin only)
// DELETE /api/projects/:id  – Delete project (admin only)

const { Router } = require('express');
const { z } = require('zod');
const projectsController = require('../controllers/projects');
const { authenticate } = require('../middleware/auth');
const { requireProjectRole } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');

const router = Router();

const createSchema = z.object({
  name: z.string().min(1, 'Project name is required.').max(100, 'Name must be under 100 characters.'),
  description: z.string().max(2000, 'Description must be under 2000 characters.').optional(),
});

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(2000).optional(),
});

// All routes require authentication
router.use(authenticate);

router.get('/', projectsController.listProjects);
router.post('/', validate(createSchema), projectsController.createProject);
router.get('/:id', requireProjectRole(), projectsController.getProject);
router.put('/:id', requireProjectRole('ADMIN'), validate(updateSchema), projectsController.updateProject);
router.delete('/:id', requireProjectRole('ADMIN'), projectsController.deleteProject);

module.exports = router;
