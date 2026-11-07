import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canRequestProduction } from '../production-release';
import { publishProductionTag } from './production-release';

const sha = 'a'.repeat(40);
const tagObject = 'b'.repeat(40);

test('production requires the configured Long with ADMIN and an explicit release flag', () => {
  const env = {
    CUSTOMER_AI_PERMISSION_CONTACT_USER_ID: 'long',
    BEN_REPOSITORY_READ_ENABLED: '1',
    BEN_REPOSITORY_COMMIT: sha,
    BEN_GITHUB_READ_TOKEN: 'read-fixture',
    BEN_PRODUCTION_GITHUB_TOKEN: 'release-fixture',
    BEN_PRODUCTION_RELEASE_ENABLED: '1',
    BEN_PRODUCTION_REQUIRED_CHECKS: 'CI',
  };
  for (const [key, value] of Object.entries(env)) process.env[key] = value;
  assert.equal(canRequestProduction({ id: 'long', admin: true }), true);
  assert.equal(canRequestProduction({ id: 'other', admin: true }), false);
  assert.equal(canRequestProduction({ id: 'long', admin: false }), false);
  process.env.BEN_PRODUCTION_RELEASE_ENABLED = '0';
  assert.equal(canRequestProduction({ id: 'long', admin: true }), false);
});

test('approved SHA publishes one annotated tag, while retries and failing checks make no new release', async () => {
  process.env.BEN_PRODUCTION_REQUIRED_CHECKS = 'CI';
  process.env.BEN_PRODUCTION_GITHUB_TOKEN = 'release-fixture';
  let created = false;
  let green = false;
  const writes: string[] = [];
  const github: typeof fetch = async (input, init) => {
    const path = new URL(String(input)).pathname;
    assert.ok(path.startsWith('/repos/Bryantng88/watch-shop/'));
    if (path.endsWith('/commits/main'))
      return Response.json({
        sha,
        commit: { committer: { date: '2026-11-07T10:00:00Z' } },
      });
    if (path.includes('/git/ref/tags/'))
      return created
        ? Response.json({ object: { type: 'tag', sha: tagObject } })
        : new Response(null, { status: 404 });
    if (path.endsWith('/check-runs'))
      return Response.json({
        total_count: 1,
        check_runs: [
          {
            name: 'CI',
            app: { slug: 'github-actions' },
            status: 'completed',
            conclusion: green ? 'success' : 'failure',
          },
        ],
      });
    if (path.endsWith('/git/tags')) {
      assert.equal(init?.method, 'POST');
      assert.equal(JSON.parse(String(init?.body)).object, sha);
      writes.push('annotation');
      return Response.json({ sha: tagObject }, { status: 201 });
    }
    if (path.endsWith('/git/refs')) {
      assert.equal(init?.method, 'POST');
      assert.deepEqual(JSON.parse(String(init?.body)), {
        ref: `refs/tags/production-20261107-ben-${sha}`,
        sha: tagObject,
      });
      writes.push('reference');
      created = true;
      return Response.json({}, { status: 201 });
    }
    if (path.endsWith('/git/tags/' + tagObject))
      return Response.json({ object: { type: 'commit', sha } });
    throw Error('Unexpected GitHub request');
  };
  const allow = async () => {};
  await assert.rejects(
    publishProductionTag(
      sha,
      async () => {
        throw Error('Denied');
      },
      github,
    ),
    /Denied/,
  );
  await assert.rejects(
    publishProductionTag(sha, allow, github),
    /kiểm tra bắt buộc/,
  );
  assert.deepEqual(writes, []);
  green = true;
  const result = await publishProductionTag(sha, allow, github);
  assert.match(result.workflowUrl, /deploy-production\.yml/);
  assert.deepEqual(await publishProductionTag(sha, allow, github), result);
  assert.deepEqual(writes, ['annotation', 'reference']);
});
