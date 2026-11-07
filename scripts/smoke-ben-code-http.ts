import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { prisma as p } from '../src/server/db/client';
import { createAuthToken } from '../src/server/auth/auth-token';
const base = 'http://127.0.0.1:3003';
async function main() {
  const db = new URL(process.env.DATABASE_URL || '');
  assert.equal(db.hostname, '127.0.0.1');
  assert.equal(db.pathname, '/personal_codex_test');
  assert.equal(process.env.APP_URL, base);
  const suffix = randomUUID(),
    role = await p.role.findUniqueOrThrow({ where: { name: 'ADMIN' } }),
    long = await p.user.create({
      data: {
        name: 'Long',
        email: `code-http-${suffix}@example.invalid`,
        roles: { connect: { id: role.id } },
      },
    }),
    other = await p.user.create({
      data: {
        name: 'Long',
        email: `code-http-other-${suffix}@example.invalid`,
        roles: { connect: { id: role.id } },
      },
    });
  const source = 'a'.repeat(40),
    draft = {
      title: 'Fix UI filters',
      request: 'Remember filters after browser reload and verify them.',
      revision: 1,
      baseRef: 'staging',
      baseSha: source,
      prBase: 'main',
    };
  const conversation = await p.customerAssistantConversation.create({
    data: {
      ownerId: long.id,
      firstRequestKey: randomUUID(),
      status: 'NEEDS_INFO',
      state: {
        messages: [],
        steps: [],
        tasks: [],
        approved: false,
        codeDraft: draft,
      },
    },
  });
  const apiToken = 'w'.repeat(32),
    releaseToken = 'r'.repeat(32),
    legacy = 'p'.repeat(32);
  const child = spawn(
    process.execPath,
    [
      'node_modules/next/dist/bin/next',
      'start',
      '--hostname',
      '127.0.0.1',
      '--port',
      '3003',
    ],
    {
      env: {
        PATH: process.env.PATH,
        HOME: process.env.HOME,
        NODE_ENV: 'production',
        DATABASE_URL: process.env.DATABASE_URL,
        DIRECT_URL: process.env.DATABASE_URL,
        AUTH_SECRET: process.env.AUTH_SECRET,
        APP_URL: base,
        PERSONAL_CODEX_ENABLED: '1',
        PERSONAL_CODEX_ENVIRONMENT: 'staging',
        PERSONAL_CODEX_WORKER_TOKEN: legacy,
        CUSTOMER_AI_ENABLED: '1',
        CUSTOMER_AI_PERMISSION_CONTACT_USER_ID: long.id,
        BEN_REPOSITORY_READ_ENABLED: '1',
        BEN_REPOSITORY_COMMIT: source,
        BEN_GITHUB_READ_TOKEN: 'fixture',
        BEN_CODE_ENABLED: '1',
        BEN_CODE_BASE_REF: 'staging',
        BEN_CODE_WORKER_TOKEN: apiToken,
        BEN_CODE_RELEASE_TOKEN: releaseToken,
        BEN_CODE_RELEASE_ENABLED: '1',
        BEN_CODE_RELEASE_HANDLER_SHA256: 'f'.repeat(64),
      },
      stdio: 'ignore',
      detached: true,
    }
  );
  try {
    let ready = false;
    for (let i = 0; i < 80; i++) {
      try {
        if ((await fetch(base + '/api/health')).ok) {
          ready = true;
          break;
        }
      } catch {}
      await new Promise((r) => setTimeout(r, 250));
    }
    assert.ok(ready, 'compiled app ready');
    async function call(body: unknown, user = long.id, origin = base) {
      return fetch(base + '/api/admin/ben-code', {
        method: 'POST',
        headers: {
          ...(user ? { cookie: 'auth_token=' + createAuthToken(user) } : {}),
          origin,
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    }
    async function worker(op: string, body: unknown, token = apiToken) {
      return fetch(base + '/api/internal/ben-code/' + op, {
        method: 'POST',
        headers: {
          authorization: 'Bearer ' + token,
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    }
    const approve = { action: 'approve', id: conversation.id, revision: 1 };
    assert.equal((await call(approve, '')).status, 401);
    assert.equal(
      (await call(approve, long.id, 'https://wrong.invalid')).status,
      403
    );
    assert.equal((await call(approve, other.id)).status, 403);
    assert.equal(
      (await call({ ...approve, command: 'not allowed' })).status,
      400
    );
    const approved = await call(approve);
    assert.equal(approved.status, 200);
    const job = await approved.json();
    assert.equal((await (await call(approve)).json()).id, job.id);
    assert.equal((await worker('claim', {}, legacy)).status, 401);
    assert.equal((await worker('claim', {}, releaseToken)).status, 401);
    assert.equal((await worker('release-claim', {}, apiToken)).status, 401);
    const response = await worker('claim', {});
    assert.equal(response.status, 200);
    const run = (await response.json()).run;
    assert.equal(run.id, job.id);
    assert.ok(run.leaseToken);
    const read = await fetch(
      base + '/api/admin/customer-assistant?id=' + conversation.id,
      { headers: { cookie: 'auth_token=' + createAuthToken(long.id) } }
    );
    assert.equal(read.status, 200);
    assert.equal(
      (await read.json()).conversations[0].codeJob.leaseToken,
      undefined
    );
    assert.equal(
      (await call({ action: 'cancel', id: conversation.id, jobId: job.id }))
        .status,
      200
    );
    assert.equal(
      (await worker('finish', { ...run, failed: true })).status,
      409
    );
    console.log(
      'PASS compiled HTTP: auth, exact Long, origin/strict input, idempotent approval, distinct private tokens, hidden lease, cancel/late finish fencing. No GitHub/NAS writes.'
    );
  } finally {
    try {
      process.kill(-child.pid!, 'SIGTERM');
    } catch {}
    await p.user.updateMany({
      where: { id: { in: [long.id, other.id] } },
      data: { isActive: false },
    });
  }
}
main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : 'HTTP failure');
    process.exitCode = 1;
  })
  .finally(() => p.$disconnect());
