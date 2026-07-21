import { PrismaPg } from "@prisma/adapter-pg";

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!;
const sslUrl = url.includes("sslmode=") ? url : `${url}&sslmode=require`;

export const adapter = new PrismaPg({ connectionString: sslUrl });
