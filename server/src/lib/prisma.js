// ──────────────────────────────────────────────
// Prisma Client Singleton
// ──────────────────────────────────────────────
// Prevents multiple Prisma Client instances during
// hot-reload in development (Node --watch).

const { PrismaClient } = require('@prisma/client');

/** @type {PrismaClient} */
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In development, reuse the client across hot-reloads
  if (!global.__prisma) {
    global.__prisma = new PrismaClient();
  }
  prisma = global.__prisma;
}

module.exports = prisma;
