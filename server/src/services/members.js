// ──────────────────────────────────────────────
// Members Service
// ──────────────────────────────────────────────
// Business logic for managing project members.

const prisma = require('../lib/prisma');

/**
 * List all members of a project.
 */
async function listMembers(projectId) {
  return prisma.projectMember.findMany({
    where: { projectId },
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
    },
    orderBy: { role: 'asc' }, // ADMINs first
  });
}

/**
 * Add a user to a project by email.
 * Only project admins can do this (enforced by middleware).
 */
async function addMember(projectId, email, role = 'MEMBER') {
  // Find the user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err = new Error('No user found with that email address.');
    err.statusCode = 404;
    throw err;
  }

  // Check if already a member
  const existing = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: user.id } },
  });
  if (existing) {
    const err = new Error('User is already a member of this project.');
    err.statusCode = 409;
    throw err;
  }

  // Add the member
  const membership = await prisma.projectMember.create({
    data: { projectId, userId: user.id, role },
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
    },
  });

  return membership;
}

/**
 * Remove a user from a project.
 */
async function removeMember(projectId, userId) {
  const membership = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });

  if (!membership) {
    const err = new Error('User is not a member of this project.');
    err.statusCode = 404;
    throw err;
  }

  await prisma.projectMember.delete({
    where: { id: membership.id },
  });

  return { message: 'Member removed successfully.' };
}

module.exports = { listMembers, addMember, removeMember };
