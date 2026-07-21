import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!;
const sslUrl = url.includes("sslmode=") ? url : `${url}&sslmode=require`;
const adapter = new PrismaPg({ connectionString: sslUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.curriculum.deleteMany();
  await prisma.class.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();
  console.log("All seed data removed.");
  await prisma.$disconnect();
}
main();
