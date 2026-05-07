// ──────────────────────────────────────────────
// Tasks Service
// ──────────────────────────────────────────────
// Business logic for task CRUD with filtering.

const prisma = require('../lib/prisma');

/**
 * List tasks for a project with optional filters.
 * @param {string} projectId
 * @param {{ status?: string, assigneeId?: string, overdue?: string }} filters
 */
async function listTasks(projectId, filters = {}) {
  const where = { projectId };

  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.assigneeId) {
    where.assigneeId = filters.assigneeId;
  }
  if (filters.overdue === 'true') {
    where.dueDate = { lt: new Date() };
    where.status = { not: 'DONE' };
  }

  return prisma.task.findMany({
    where,
    include: {
      assignee: { select: { id: true, name: true, email: true } },
    },
    orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }],
  });
}

/**
 * Create a new task in a project.
 */
async function createTask({ title, description, status, priority, dueDate, projectId, assigneeId }) {
  return prisma.task.create({
    data: {
      title,
      description,
      status: status || 'TODO',
      priority: priority || 'MEDIUM',
      dueDate: dueDate ? new Date(dueDate) : null,
      projectId,
      assigneeId: assigneeId || null,
    },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
    },
  });
}

/**
 * Get a single task by ID.
 */
async function getTaskById(taskId) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      project: { select: { id: true, name: true } },
    },
  });

  if (!task) {
    const err = new Error('Task not found.');
    err.statusCode = 404;
    throw err;
  }

  return task;
}

/**
 * Update a task's fields.
 */
async function updateTask(taskId, data) {
  const updateData = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  if (data.assigneeId !== undefined) updateData.assigneeId = data.assigneeId || null;

  return prisma.task.update({
    where: { id: taskId },
    data: updateData,
    include: {
      assignee: { select: { id: true, name: true, email: true } },
    },
  });
}

/**
 * Delete a task.
 */
async function deleteTask(taskId) {
  return prisma.task.delete({ where: { id: taskId } });
}

module.exports = { listTasks, createTask, getTaskById, updateTask, deleteTask };
