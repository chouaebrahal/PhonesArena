// lib/prisma.ts
import { PrismaClient } from "@prisma/client";


declare global {
  // Add prisma to global, optional because it might not exist yet
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}
// Use a global variable to avoid multiple instances during development (Next.js hot reload)
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

export default prisma;
