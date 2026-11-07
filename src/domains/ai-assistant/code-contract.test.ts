import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  codePlanSchema,
  codeEnabled,
  checksPassed,
  publicCodeJob,
  type CodeJob,
} from './code-contract';
test('code drafts cannot select shell/repo/release settings; execution is separately opt-in', () => {
  const plan = {
    title: 'Fix the list',
    request: 'Remember filters after reloading the list.',
  };
  assert.ok(codePlanSchema.safeParse(plan).success);
  for (const key of ['command', 'repo', 'sha', 'deploy'])
    assert.equal(
      codePlanSchema.safeParse({ ...plan, [key]: 'untrusted' }).success,
      false
    );
  const env = {
    BEN_REPOSITORY_READ_ENABLED: '1',
    BEN_REPOSITORY_COMMIT: 'a'.repeat(40),
    BEN_GITHUB_READ_TOKEN: 'fixture',
    CUSTOMER_AI_PERMISSION_CONTACT_USER_ID: 'long',
    BEN_CODE_ENABLED: '1',
    BEN_CODE_WORKER_TOKEN: 'w'.repeat(32),
    BEN_CODE_BASE_REF: 'staging',
  };
  assert.equal(codeEnabled({ id: 'long', admin: true }, env), true);
  assert.equal(codeEnabled({ id: 'other', admin: true }, env), false);
  assert.equal(
    codeEnabled({ id: 'long', admin: true }, { ...env, BEN_CODE_ENABLED: '0' }),
    false
  );
});
test('merge eligibility requires unique independent checks, never a model success sentence', () => {
  const checks = [
    'install',
    'generate',
    'typecheck',
    'lint',
    'tests',
    'build',
  ].map((name) => ({ name, status: 'PASSED' as const }));
  assert.equal(checksPassed(checks), true);
  assert.equal(checksPassed(checks.filter((c) => c.name !== 'build')), false);
  assert.equal(checksPassed([...checks, checks[0]]), false);
  assert.equal(
    checksPassed(
      checks.map((c) =>
        c.name === 'typecheck' ? { ...c, status: 'FAILED' } : c
      )
    ),
    false
  );
  const job = {
    leaseToken: 'private',
    leaseExpiresAt: 'private',
    id: 'id',
  } as CodeJob;
  assert.equal(publicCodeJob(job).leaseToken, undefined);
  assert.equal(publicCodeJob(job).leaseExpiresAt, undefined);
});
