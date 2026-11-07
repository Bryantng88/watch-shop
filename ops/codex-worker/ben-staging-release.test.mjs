import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { runRelease, validateReleaseReceipt } from './ben-staging-release.mjs';
const sha = 'a'.repeat(40),
  receipt = {
    deployedSha: sha,
    adminHealthy: true,
    workerPreserved: true,
    environmentPreserved: true,
    privateIngress: true,
    storefrontUnchanged: true,
    backupVerified: true,
  };
test('staging release uses only a fixed hash-pinned operator handler and requires verified health/preservation receipt', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'ben-release-')),
    script = join(dir, 'deploy-staging'),
    content = '#!/bin/sh\nexit 0\n';
  await writeFile(script, content, { mode: 0o700 });
  let calls = 0;
  const command = async (exe, args) => {
    calls++;
    assert.equal(exe, script);
    assert.ok(args.includes(sha));
    return JSON.stringify(receipt);
  };
  const input = {
    script,
    expectedHash: createHash('sha256').update(content).digest('hex'),
    run: { id: '12345678-1234-4234-8234-123456789abc', releaseSha: sha },
    command,
  };
  try {
    assert.equal((await runRelease(input)).deployedSha, sha);
    assert.equal(calls, 1);
    await assert.rejects(
      runRelease({ ...input, expectedHash: 'b'.repeat(64) }),
      /RELEASE_SCRIPT_CHANGED/
    );
    assert.equal(calls, 1);
    assert.throws(() =>
      validateReleaseReceipt({ ...receipt, backupVerified: false }, sha)
    );
    await assert.rejects(
      runRelease({ ...input, run: { ...input.run, releaseSha: 'main' } })
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
