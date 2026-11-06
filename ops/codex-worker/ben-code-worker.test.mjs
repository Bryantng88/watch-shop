import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  validateCodeRun,
  validateCodePaths,
  validateCodeContent,
  codeSandboxArguments,
  codeModelArguments,
  executeCodeJob,
  mergeCodeJob,
} from './ben-code-worker.mjs';
const base = 'a'.repeat(40),
  head = 'b'.repeat(40),
  prBase = 'c'.repeat(40),
  run = {
    id: '12345678-1234-4234-8234-123456789abc',
    baseRef: 'staging',
    baseSha: base,
    prBase: 'main',
    title: 'Fix list state',
    request: 'Remember filters after reload.',
  };
run.branch = 'codex/ben-code/' + run.id;
test('code worker confines repository/ref/paths and denies model access to credentials or other jobs', () => {
  assert.doesNotThrow(() => validateCodeRun(run));
  assert.throws(() => validateCodeRun({ ...run, branch: 'main' }));
  assert.throws(() => validateCodeRun({ ...run, baseRef: '--upload-pack=sh' }));
  for (const path of [
    '.env.local',
    '.github/workflows/deploy.yml',
    'package.json',
    'tsconfig.json',
    'ops/worker.mjs',
    'prisma/schema.prisma',
    'Dockerfile',
    '.gitignore',
    'scripts/deploy-production.ps1',
    '-x',
  ])
    assert.throws(() => validateCodePaths([path]));
  const args = codeModelArguments(
    '/work/ben-code/jobs/x',
    '/work/ben-code/results/x.txt'
  ).join(' ');
  assert.ok(args.includes('network'));
  assert.ok(args.includes('/proc'));
  assert.ok(args.includes('/run/worker'));
  assert.ok(args.includes('/work'));
  assert.equal(args.includes('dangerously-bypass'), false);
  assert.throws(() => validateCodeContent('ghp_' + 'x'.repeat(30)));
  assert.throws(() =>
    validateCodeContent('const password = \"a-private-password\";')
  );
  assert.equal(
    codeSandboxArguments('/work/ben-code/jobs/x', ['npm', 'run', 'build'])[0],
    'sandbox'
  );
});
test('code edit checks complete before commit/push/PR, and lost lease prevents publication', async () => {
  const root = await mkdtemp(join(tmpdir(), 'ben-code-'));
  const repo = join(root, 'repo');
  await mkdir(join(repo, '.git'), { recursive: true });
  await writeFile(join(repo, '.git', 'ben-code-worker'), 'dedicated');
  const events = [];
  let committed = false;
  const command = async (exe, args) => {
    events.push([exe, args]);
    if (exe === 'codex')
      return args.some((a) => a.includes('BEN_NODE_PROBE'))
        ? 'BEN_NODE_PROBE'
        : '';
    const a = args.slice(4);
    if (a[0] === 'remote')
      return 'https://github.com/Bryantng88/watch-shop.git';
    if (a[0] === 'fetch') return '';
    if (a[0] === 'rev-parse')
      return a[1] === 'FETCH_HEAD' ? base : committed ? head : base;
    if (a[0] === 'branch') return run.branch;
    if (a[0] === 'worktree') {
      const dir = a.includes('--detach') ? a[3] : a[4];
      await mkdir(join(dir, 'docs'), { recursive: true });
      await writeFile(join(dir, 'docs', 'change.md'), 'fixture');
      await writeFile(join(dir, '.git'), 'gitdir: trusted-fixture');
      await writeFile(join(dir, 'next-env.d.ts'), 'fixture');
      await writeFile(
        join(dir, 'next.config.ts'),
        'const nextConfig: NextConfig = {'
      );
      return '';
    }
    if (a[0] === 'write-tree') return 'd'.repeat(40);
    if (a[0] === 'show') return 'fixture';
    if (a[0] === 'ls-files')
      return a.includes('--stage')
        ? '100644 hash 0\tdocs/change.md'
        : 'docs/change.md';
    if (a[0] === 'diff') return '';
    if (a.includes('commit')) committed = true;
    return '';
  };
  const github = async (method, path) => {
    events.push(['github', path]);
    return {
      number: 7,
      head: { sha: head, ref: run.branch },
      base: { ref: 'main', sha: prBase },
    };
  };
  try {
    const result = await executeCodeJob({ root, repo }, run, {
      command,
      github,
      api: async () => ({ active: true }),
    });
    assert.equal(result.headSha, head);
    assert.equal(result.checks.filter((c) => c.status === 'PASSED').length, 4);
    const publication = events.findIndex(
      (e) => e[0] === 'git' && e[1].includes('push')
    );
    const build = events.findIndex(
      (e) => e[0] === 'codex' && e[1].slice(-3).join(' ') === 'npm run build'
    );
    assert.ok(build >= 0 && publication > build);
    committed = false;
    events.length = 0;
    await assert.rejects(
      executeCodeJob({ root, repo }, run, {
        command,
        github,
        api: async () => {
          throw Error('lost lease');
        },
      })
    );
    assert.equal(
      events.some((e) => e[0] === 'git' && e[1].includes('push')),
      false
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
test('merge verifies PR identity and green checks, marks ready only on explicit request, and supplies exact SHA', async () => {
  const calls = [];
  const github = async (method, path, body) => {
    calls.push([method, path, body]);
    if (path === 'pulls/7')
      return {
        node_id: 'PR-fixture',
        draft: true,
        state: 'open',
        head: {
          sha: head,
          ref: run.branch,
          repo: { full_name: 'Bryantng88/watch-shop' },
        },
        base: { sha: prBase, ref: 'main' },
      };
    if (path.endsWith('/status')) return { state: 'success', statuses: [{}] };
    if (path.endsWith('/check-runs'))
      return { check_runs: [{ status: 'completed', conclusion: 'success' }] };
    return { merged: true, sha: 'd'.repeat(40) };
  };
  const result = await mergeCodeJob(
    { ...run, headSha: head, prBaseSha: prBase, prNumber: 7 },
    { github, api: async () => ({ active: true }) }
  );
  assert.equal(result.mergedSha, 'd'.repeat(40));
  assert.ok(calls.some((c) => c[1] === 'graphql-ready'));
  assert.deepEqual(calls.find((c) => c[0] === 'PUT')[2], {
    sha: head,
    merge_method: 'merge',
  });
  await assert.rejects(
    mergeCodeJob(
      { ...run, headSha: 'e'.repeat(40), prBaseSha: prBase, prNumber: 7 },
      { github, api: async () => ({ active: true }) }
    ),
    /CODE_PR_CHANGED/
  );
});
