import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) throw new Error("DATABASE_URL is required");

const parsed = new URL(databaseUrl);
if (!['localhost', '127.0.0.1', '::1'].includes(parsed.hostname) || !/(test|storefront)/i.test(parsed.pathname)) {
  throw new Error("Refusing to seed sharing users outside a loopback test/storefront database");
}

const testUsers = [
  { email: "editor@system.local", name: "Local Editor" },
  { email: "viewer@system.local", name: "Local Viewer" },
];

async function main() {
  const prisma = new PrismaClient({ datasourceUrl: databaseUrl });
  try {
    const adminRole = await prisma.role.findUnique({ where: { name: "ADMIN" }, select: { id: true } });
    if (!adminRole) throw new Error("Run scripts/seed-local-admin.ts before seeding sharing users");

    for (const user of testUsers) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name,
          isActive: true,
          roles: { set: [{ id: adminRole.id }] },
        },
        create: {
          ...user,
          isActive: true,
          roles: { connect: [{ id: adminRole.id }] },
        },
      });
    }

    console.log(JSON.stringify({ ok: true, users: testUsers.map((user) => user.email) }));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
