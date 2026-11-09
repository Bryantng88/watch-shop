import { prisma } from '../src/server/db/client';
import { createAuthToken } from '../src/server/auth/auth-token';
import { writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
async function main() {
  const db = new URL(process.env.DATABASE_URL || '');
  if (
    !['127.0.0.1', 'localhost'].includes(db.hostname) ||
    db.pathname !== '/personal_codex_test'
  )
    throw Error('Loopback personal_codex_test required');
  const email = `ben-pwa-${randomUUID()}@example.invalid`,
    password = 'synthetic-pwa-password';
  const role = await prisma.role.findUniqueOrThrow({
    where: { name: 'ADMIN' },
  });
  const user = await prisma.user.create({
    data: {
      email,
      name: 'Ben PWA Test',
      passwordHash: await bcrypt.hash(password, 10),
      roles: { connect: { id: role.id } },
    },
  });
  await writeFile(
    process.env.BEN_PWA_FIXTURE_FILE || '/tmp/ben-pwa-fixture.json',
    JSON.stringify({
      id: user.id,
      email,
      password,
      token: createAuthToken(user.id),
    }),
    { mode: 0o600 }
  );
}
main().finally(() => prisma.$disconnect());
