// ──────────────────────────────────────────────
// Seed Script
// ──────────────────────────────────────────────
// Creates sample data for development:
//   - 1 Admin user (admin@example.com / Admin123!)
//   - 1 Member user (member@example.com / Member123!)
//   - 2 projects with members
//   - 6 sample tasks

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // ── Create Users ──────────────────────────
  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const memberPassword = await bcrypt.hash('Member123!', 12);

  const admin = await prisma.user.create({
    data: {
      name: 'Alex Admin',
      email: 'admin@example.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  const member = await prisma.user.create({
    data: {
      name: 'Morgan Member',
      email: 'member@example.com',
      passwordHash: memberPassword,
      role: 'MEMBER',
    },
  });

  console.log('✅ Created users: admin@example.com, member@example.com');

  // ── Create Projects ───────────────────────
  const project1 = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Redesign the company website with a modern look and improved UX.',
      createdById: admin.id,
      members: {
        create: [
          { userId: admin.id, role: 'ADMIN' },
          { userId: member.id, role: 'MEMBER' },
        ],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile App MVP',
      description: 'Build the first version of our mobile application for iOS and Android.',
      createdById: admin.id,
      members: {
        create: [
          { userId: admin.id, role: 'ADMIN' },
          { userId: member.id, role: 'MEMBER' },
        ],
      },
    },
  });

  console.log('✅ Created projects: Website Redesign, Mobile App MVP');

  // ── Create Tasks ──────────────────────────
  const now = new Date();
  const inTwoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const inFiveDays = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const inSevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);

  await prisma.task.createMany({
    data: [
      {
        title: 'Design homepage mockup',
        description: 'Create a Figma mockup for the new homepage layout.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: inTwoDays,
        projectId: project1.id,
        assigneeId: member.id,
      },
      {
        title: 'Set up CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment.',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: inFiveDays,
        projectId: project1.id,
        assigneeId: admin.id,
      },
      {
        title: 'Write API documentation',
        description: 'Document all REST API endpoints with examples.',
        status: 'TODO',
        priority: 'LOW',
        dueDate: inSevenDays,
        projectId: project1.id,
        assigneeId: null,
      },
      {
        title: 'Fix login page bug',
        description: 'The login button is not responsive on mobile devices.',
        status: 'TODO',
        priority: 'HIGH',
        dueDate: yesterday, // This will be overdue
        projectId: project1.id,
        assigneeId: admin.id,
      },
      {
        title: 'Design app onboarding flow',
        description: 'Create wireframes for the user onboarding experience.',
        status: 'DONE',
        priority: 'HIGH',
        dueDate: yesterday,
        projectId: project2.id,
        assigneeId: member.id,
      },
      {
        title: 'Set up React Native project',
        description: 'Initialize the React Native project with navigation and state management.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: inTwoDays,
        projectId: project2.id,
        assigneeId: admin.id,
      },
    ],
  });

  console.log('✅ Created 6 sample tasks');
  console.log('\n🎉 Seed complete!');
  console.log('   Login as admin:  admin@example.com / Admin123!');
  console.log('   Login as member: member@example.com / Member123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
