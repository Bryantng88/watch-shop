import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PERMISSIONS } from "../src/constants/permissions";

const databaseUrl = process.env.DATABASE_URL?.trim();
const password = process.env.LOCAL_ADMIN_PASSWORD?.trim();
if (!databaseUrl || !password) throw new Error("DATABASE_URL and LOCAL_ADMIN_PASSWORD are required");
const parsed = new URL(databaseUrl);
if (!["localhost", "127.0.0.1", "::1"].includes(parsed.hostname) || !/(test|storefront)/i.test(parsed.pathname)) {
  throw new Error("Refusing to seed admin outside a loopback test/storefront database");
}

async function main() {
  const prisma = new PrismaClient({ datasourceUrl: databaseUrl });
  try {
    const permissionCodes = [...new Set(Object.values(PERMISSIONS))];
    await prisma.$transaction(async (tx) => {
      for (const code of permissionCodes) {
        await tx.permission.upsert({
          where: { code },
          update: {},
          create: { code, description: `Local development permission: ${code}` },
        });
      }
      const role = await tx.role.upsert({
        where: { name: "ADMIN" },
        update: { permissions: { set: permissionCodes.map((code) => ({ code })) } },
        create: {
          name: "ADMIN",
          description: "Local development administrator",
          permissions: { connect: permissionCodes.map((code) => ({ code })) },
        },
      });
      await tx.user.upsert({
        where: { email: "admin@system.local" },
        update: {
          name: "Local Admin",
          isActive: true,
          passwordHash: await bcrypt.hash(password, 10),
          roles: { set: [{ id: role.id }] },
        },
        create: {
          email: "admin@system.local",
          name: "Local Admin",
          isActive: true,
          passwordHash: await bcrypt.hash(password, 10),
          roles: { connect: [{ id: role.id }] },
        },
      });
    });
    console.log(JSON.stringify({ ok: true, email: "admin@system.local", permissions: permissionCodes.length }));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
