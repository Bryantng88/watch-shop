import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { prisma as p } from '../src/server/db/client';
import {
  codeCommand,
  codeWorker,
} from '../src/domains/ai-assistant/server/code-jobs';
import {
  sendAssistant,
  listAssistant,
  assistantWorker,
} from '../src/domains/ai-assistant/server/service';
async function main() {
  const db = new URL(process.env.DATABASE_URL || '');
  assert.equal(db.hostname, '127.0.0.1');
  assert.equal(db.pathname, '/personal_codex_test');
  const role = await p.role.findUniqueOrThrow({ where: { name: 'ADMIN' } }),
    suffix = randomUUID(),
    long = await p.user.create({
      data: {
        name: 'Long',
        email: `ben-code-${suffix}@example.invalid`,
        roles: { connect: { id: role.id } },
      },
    }),
    other = await p.user.create({
      data: {
        name: 'Long',
        email: `ben-code-other-${suffix}@example.invalid`,
        roles: { connect: { id: role.id } },
      },
    });
  process.env.CUSTOMER_AI_PERMISSION_CONTACT_USER_ID = long.id;
  process.env.BEN_REPOSITORY_READ_ENABLED = '1';
  process.env.BEN_REPOSITORY_COMMIT = 'a'.repeat(40);
  process.env.BEN_GITHUB_READ_TOKEN = 'fixture';
  process.env.BEN_CODE_ENABLED = '1';
  process.env.BEN_CODE_WORKER_TOKEN = 'w'.repeat(32);
  process.env.BEN_CODE_RELEASE_TOKEN = 'r'.repeat(32);
  process.env.BEN_CODE_BASE_REF = 'staging';
  process.env.BEN_CODE_PR_BASE = 'main';
  process.env.BEN_CODE_MERGE_ENABLED = '1';
  process.env.BEN_CODE_RELEASE_ENABLED = '1';
  process.env.BEN_CODE_RELEASE_HANDLER_SHA256 = 'f'.repeat(64);
  const original = globalThis.fetch;
  globalThis.fetch = async (input) =>
    Response.json(
      String(input).includes('commits/')
        ? { sha: 'a'.repeat(40), tree: { sha: 'b'.repeat(40) } }
        : String(input).includes('trees/' + 'b'.repeat(40))
          ? {
              tree: [
                {
                  path: 'src',
                  type: 'tree',
                  mode: '040000',
                  sha: 'c'.repeat(40),
                },
              ],
            }
          : String(input).includes('trees/')
            ? {
                tree: [
                  {
                    path: 'example.ts',
                    type: 'blob',
                    mode: '100644',
                    sha: 'd'.repeat(40),
                    size: 30,
                  },
                ],
              }
            : {
                encoding: 'base64',
                content: Buffer.from('export const example = true;').toString(
                  'base64'
                ),
                size: 30,
              }
    );
  try {
    const before = [await p.order.count(), await p.taskItem.count()];
    const sent = await sendAssistant(long.id, {
      requestKey: randomUUID(),
      text: 'Sửa giao diện và kiểm thử bộ lọc danh sách',
    });
    const claimed = (await assistantWorker('claim', {})) as {
      run: { id: string; leaseToken: string };
    };
    assert.equal(claimed.run.id, sent.id);
    await assistantWorker('lookup', {
      ...claimed.run,
      lookup: { tool: 'repository.file', query: 'src/example.ts' },
    });
    await assistantWorker('finish', {
      ...claimed.run,
      reply: 'Đề xuất',
      plan: null,
      codePlan: {
        title: 'Remember list filters',
        request:
          'Persist the chosen filters after reloading the list and test it.',
      },
    });
    const preview = (await listAssistant(long.id, sent.id)).conversations[0];
    assert.ok(preview.codeDraft);
    assert.equal(preview.codeJob, undefined);
    await assert.rejects(
      codeCommand(other.id, sent.id, 'approve', { revision: preview.revision })
    );
    await assert.rejects(
      codeCommand(long.id, sent.id, 'approve', {
        revision: preview.revision! - 1,
      })
    );
    const approved = await Promise.all([
      codeCommand(long.id, sent.id, 'approve', { revision: preview.revision }),
      codeCommand(long.id, sent.id, 'approve', { revision: preview.revision }),
    ]);
    assert.equal(approved[0].id, approved[1].id);
    const code = (await codeWorker('claim', {})) as {
      run: { id: string; conversationId: string; leaseToken: string };
    };
    assert.equal(code.run.id, approved[0].id);
    assert.equal(
      (await listAssistant(long.id, sent.id)).conversations[0].codeJob
        ?.leaseToken,
      undefined
    );
    const checks = [
      'install',
      'generate',
      'typecheck',
      'lint',
      'tests',
      'build',
    ].map((name) => ({ name, status: 'PASSED' }));
    await assert.rejects(
      codeWorker('finish', {
        ...code.run,
        headSha: 'e'.repeat(40),
        prNumber: 9,
        prBaseSha: 'd'.repeat(40),
        checks: [],
      })
    );
    await codeWorker('finish', {
      ...code.run,
      headSha: 'e'.repeat(40),
      prNumber: 9,
      prBaseSha: 'd'.repeat(40),
      checks,
    });
    await assert.rejects(
      codeCommand(long.id, sent.id, 'merge', {
        jobId: code.run.id,
        sha: 'f'.repeat(40),
      })
    );
    await codeCommand(long.id, sent.id, 'merge', {
      jobId: code.run.id,
      sha: 'e'.repeat(40),
    });
    const merge = (await codeWorker('claim', {})) as { run: typeof code.run };
    await codeWorker('finish', {
      ...merge.run,
      headSha: 'e'.repeat(40),
      mergedSha: 'f'.repeat(40),
    });
    await codeCommand(long.id, sent.id, 'deploy', {
      jobId: code.run.id,
      sha: 'f'.repeat(40),
    });
    const release = (await codeWorker('claim', {}, true)) as {
      run: typeof code.run;
    };
    assert.ok(release.run);
    assert.equal(
      ((await codeWorker('claim', {}, true)) as { run: unknown }).run,
      null
    );
    await assert.rejects(
      codeCommand(long.id, sent.id, 'cancel', { jobId: code.run.id })
    );
    await assert.rejects(
      codeWorker(
        'finish',
        { ...release.run, deployedSha: 'e'.repeat(40), healthVerified: true },
        true
      )
    );
    await codeWorker(
      'finish',
      { ...release.run, deployedSha: 'f'.repeat(40), healthVerified: true },
      true
    );
    assert.equal(
      (await listAssistant(long.id, sent.id)).conversations[0].codeJob?.status,
      'DEPLOYED'
    );
    assert.deepEqual([await p.order.count(), await p.taskItem.count()], before);
    console.log(
      'PASS code workflow: no run before approval, verified Long, concurrent replay, leases, hidden tokens, checks gate, exact merge/release SHAs, serialized staging release, no business writes. Executors/GitHub simulated.'
    );
  } finally {
    globalThis.fetch = original;
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => p.$disconnect());
