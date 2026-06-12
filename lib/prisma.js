import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

// Provide a non-empty object to satisfy strict validation if needed
export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
