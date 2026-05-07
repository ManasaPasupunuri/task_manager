// ──────────────────────────────────────────────
// Projects Service
// ──────────────────────────────────────────────
// Business logic for project CRUD operations.

const prisma = require('../lib/prisma');

/**
 * List all projects the user is a member of.
 */
async function listUserProjects(userId) {
  const memberships = await prisma.projectMember.findMany({
    where: { userId },
    include: {
      project: {
        include: {
          _count: { select: { members: true, tasks: true } },
          createdBy: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { project: { updatedAt: 'desc' } },
  });

  return memberships.map((m) => ({
    ...m.project,
    myRole: m.role,
  }));
}

/**
 * Create a new project. The creator automatically becomes a project ADMIN.
 */
async function createProject({ name, description, userId }) {
  const project = await prisma.project.create({
    data: {
      name,
      description,
      createdById: userId,
      members: {
        create: { userId, role: 'ADMIN' },
      },
    },
    include: {
      _count: { select: { members: true, tasks: true } },
      createdBy: { select: { id: true, name: true } },
    },
  });

  return { ...project, myRole: 'ADMIN' };
}

/**
 * Get a single project by ID with members count and task stats.
 */
async function getProjectById(projectId) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      _count: { select: { members: true, tasks: true } },
    },
  });

  if (!project) {
    const err = new Error('Project not found.');
    err.statusCode = 404;
    throw err;
  }

  // Get task status counts
  const taskStats = await prisma.task.groupBy({
    by: ['status'],
    where: { projectId },
    _count: true,
  });

  return { ...project, taskStats };
}

/**
 * Update project name and/or description.
 */
async function updateProject(projectId, { name, description }) {
  return prisma.project.update({
    where: { id: projectId },
    data: { name, description },
    include: {
      createdBy: { select: { id: true, name: true } },
      _count: { select: { members: true, tasks: true } },
    },
  });
}

/**
 * Delete a project and all associated data (cascades).
 */
async function deleteProject(projectId) {
  return prisma.project.delete({ where: { id: projectId } });
}

module.exports = { listUserProjects, createProject, getProjectById, updateProject, deleteProject };
