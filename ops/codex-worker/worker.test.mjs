import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateWorkerConfiguration, validateChangedPaths, codexArguments } from './worker.mjs';
const env = { PERSONAL_CODEX_ENVIRONMENT: 'staging', PERSONAL_CODEX_APP_URL: 'https://staging.example.com', PERSONAL_CODEX_WORKER_TOKEN: 'synthetic-token-for-test-at-least-32-characters', PERSONAL_CODEX_REPO_ROOT: '/worker/repo' };
test('worker configuration requires isolation, staging and protected transport', () => {
 assert.equal(validateWorkerConfiguration(env).repoRoot, '/worker/repo');
 assert.throws(() => validateWorkerConfiguration({...env, PERSONAL_CODEX_ENVIRONMENT:'production'}));
 assert.throws(() => validateWorkerConfiguration({...env, PERSONAL_CODEX_APP_URL:'http://public.example.com'}));
 assert.throws(() => validateWorkerConfiguration({...env, PERSONAL_CODEX_REPO_ROOT:'relative'}));
 assert.equal(validateWorkerConfiguration({...env, PERSONAL_CODEX_APP_URL:'http://127.0.0.1:18089'}).appUrl, 'http://127.0.0.1:18089');
});
test('worker never stages credentials or production workflows even if the agent changed them', () => {
 validateChangedPaths(['src/app/page.tsx','docs/testing/new-check.md']);
 for (const path of ['.env.production','sub/.env.local','.ssh/key','.github/workflows/deploy-production.yml','ops/deployment/deploy-production-runner.sh','AGENTS.md','../outside','/etc/passwd']) assert.throws(() => validateChangedPaths([path]));
});
test('Codex invocation preserves sandboxing and never inherits the worker credential environment', () => {
 const args=codexArguments('/worker/run','/worker/result.txt');
 assert.ok(args.includes('workspace-write'));
 assert.ok(args.includes('shell_environment_policy.inherit="none"'));
 assert.equal(args.some(arg=>arg.includes('dangerously-bypass')),false);
});
