// ──────────────────────────────────────────────
// Dashboard Service
// ──────────────────────────────────────────────
// Aggregates stats for the current user's dashboard.

const prisma = require('../lib/prisma');

/**
 * Get dashboard overview for a user:
 * - Total tasks assigned
 * - Counts by status (TODO, IN_PROGRESS, DONE)
 * - Overdue tasks
 * - Recent projects
 * - Upcoming tasks
 */
async function getOverview(userId) {
  // Tasks assigned to the user
  const allTasks = await prisma.task.findMany({
    where: { assigneeId: userId },
    include: {
      project: { select: { id: true, name: true } },
    },
    orderBy: { dueDate: 'asc' },
  });

  const now = new Date();

  // Count by status
  const statusCounts = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
  let overdueCount = 0;
  const overdueTasks = [];
  const upcomingTasks = [];

  for (const task of allTasks) {
    statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;

    // Overdue: has a due date in the past and is not DONE
    if (task.dueDate && task.dueDate < now && task.status !== 'DONE') {
      overdueCount++;
      overdueTasks.push(task);
    }

    // Upcoming: has a due date in the future and is not DONE
    if (task.dueDate && task.dueDate >= now && task.status !== 'DONE') {
      upcomingTasks.push(task);
    }
  }

  // Recent projects (last 5 the user is a member of)
  const recentProjects = await prisma.projectMember.findMany({
    where: { userId },
    include: {
      project: {
        include: {
          _count: { select: { members: true, tasks: true } },
        },
      },
    },
    orderBy: { project: { updatedAt: 'desc' } },
    take: 5,
  });

  return {
    totalTasks: allTasks.length,
    statusCounts,
    overdueCount,
    overdueTasks: overdueTasks.slice(0, 5),
    upcomingTasks: upcomingTasks.slice(0, 10),
    recentProjects: recentProjects.map((m) => m.project),
  };
}

module.exports = { getOverview };
