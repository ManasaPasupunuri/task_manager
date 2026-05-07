// ──────────────────────────────────────────────
// Task Routes
// ──────────────────────────────────────────────
// GET    /api/projects/:projectId/tasks  – List tasks (with filters)
// POST   /api/projects/:projectId/tasks  – Create task
// GET    /api/tasks/:id                  – Get single task
// PUT    /api/tasks/:id                  – Update task
// DELETE /api/tasks/:id                  – Delete task (admin only)

const { Router } = require('express');
const { z } = require('zod');
const tasksController = require('../controllers/tasks');
const { authenticate } = require('../middleware/auth');
const { requireProjectRole } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');
const prisma = require('../lib/prisma');

// Router for project-scoped task routes (/api/projects/:projectId/tasks)
const projectTasksRouter = Router({ mergeParams: true });

const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required.').max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: z.string().optional().nullable(),
  assigneeId: z.string().uuid().optional().nullable(),
});

projectTasksRouter.use(authenticate);
projectTasksRouter.get('/', requireProjectRole(), tasksController.listTasks);
projectTasksRouter.post('/', requireProjectRole(), validate(createTaskSchema), tasksController.createTask);

// Router for standalone task routes (/api/tasks/:id)
const taskRouter = Router();

const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: z.string().optional().nullable(),
  assigneeId: z.string().uuid().optional().nullable(),
});

taskRouter.use(authenticate);

// Middleware: look up the task's project and verify membership
async function resolveTaskProject(req, res, next) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      select: { projectId: true },
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    // Set projectId so requireProjectRole can find it
    req.params.projectId = task.projectId;
    next();
  } catch (err) {
    next(err);
  }
}

taskRouter.get('/:id', resolveTaskProject, requireProjectRole(), tasksController.getTask);
taskRouter.put('/:id', resolveTaskProject, requireProjectRole(), validate(updateTaskSchema), tasksController.updateTask);
taskRouter.delete('/:id', resolveTaskProject, requireProjectRole('ADMIN'), tasksController.deleteTask);

module.exports = { projectTasksRouter, taskRouter };
