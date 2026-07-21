import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!;
  const sslUrl = url.includes("sslmode=") ? url : `${url}&sslmode=require`;
  const adapter = new PrismaPg({ connectionString: sslUrl });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
