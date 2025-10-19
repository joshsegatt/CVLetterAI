import { PrismaClient } from '@prisma/client';
import { dbOptimizer } from './performance/database';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Create optimized Prisma client with performance monitoring
const createPrismaClient = () => {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
    
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  // Wrap with performance monitoring
  return dbOptimizer.wrapPrismaClient(client);
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
