const assert = require('node:assert/strict');
const esbuild = require('esbuild');
const vm = require('node:vm');

(async () => {
  const activities = [], events = [];
  const bundle = await esbuild.build({
    stdin: { contents: "export * from './src/domains/watch/server/media-work/withdraw-watch-media.service'; export * from './src/domains/watch/server/media-work/watch-media-withdrawal-state';", loader: 'ts', resolveDir: process.cwd() },
    bundle: true, platform: 'node', format: 'cjs', write: false,
    plugins: [{ name: 'database-ports', setup(build) {
      build.onResolve({ filter: /^@\/server\/db\/client$|^@\/domains\/task\/server\/activity$|^@\/domains\/event\/server\/business-event.service$/ }, args => ({ path: args.path, namespace: 'ports' }));
      build.onLoad({ filter: /.*/, namespace: 'ports' }, args => ({ contents:
        args.path.includes('/db/') ? 'export const prisma={}; export const withDbTransaction=(db,work)=>db.$transaction(work);' :
        args.path.includes('/activity') ? 'export const createSystemActivity=(input)=>globalThis.activities.push(input);' :
        'export const recordBusinessEvent=async(db,event)=>{globalThis.events.push(event);return {projectionDeliveryKey:"delivery"}};', loader: 'js' }));
      build.onResolve({ filter: /^@prisma\/client$/ }, () => ({ path: '@prisma/client', external: true }));
    } }],
  });
  const mod = { exports: {} };
  vm.runInNewContext(bundle.outputFiles[0].text, { module: mod, exports: mod.exports, require, activities, events });
  const { withdrawWatchFromMedia, isMediaEventBeforeWithdrawal } = mod.exports;
  const row = (id, workType, targetId = 'watch') => ({ id, actionType: 'LINKED', targetId, taskItemId: 'shared-' + workType, taskItem: { note: 'workTypeKey: ' + workType }, metadataJson: { progress: 'retained' } });
  let rows = [row('photo', 'photography'), row('process', 'media-processing'), row('publish', 'publish'), row('unrelated', 'technical'), row('other-watch', 'media-processing', 'other')];
  const db = {
    watch: { findUnique: async ({ where }) => where.productId === 'product' ? { id: 'watch', productId: 'product' } : null },
    $queryRaw: async () => [],
    taskExecution: {
      findMany: async ({ where }) => rows.filter(r => r.targetId === where.targetId && (!where.actionType || r.actionType === where.actionType)),
      update: async ({ where, data }) => Object.assign(rows.find(r => r.id === where.id), data),
    },
    $transaction: async (work) => {
      const before = structuredClone(rows);
      try { return await work(db); } catch (e) { rows = before; throw e; }
    },
  };
  const input = { productId: 'product', bindingId: 'process', actorUserId: 'vi' };
  await assert.rejects(withdrawWatchFromMedia({ ...input, bindingId: 'other-watch' }, db), /watch/);
  assert.equal(events.length, 0);
  const result = await withdrawWatchFromMedia(input, db);
  assert.equal(result.skipped, false);
  assert.equal(rows.filter(r => r.actionType === 'CANCELLED').length, 3);
  assert.equal(rows.find(r => r.id === 'unrelated').actionType, 'LINKED');
  assert.equal(rows.find(r => r.id === 'other-watch').actionType, 'LINKED');
  assert.equal(rows.find(r => r.id === 'process').metadataJson.progress, 'retained');
  assert.equal(activities.length, 1);
  assert.equal(events[0].eventKey, 'watch.media.withdrawn');
  assert.equal((await withdrawWatchFromMedia(input, db)).skipped, true);
  assert.equal(events.length, 1);
  assert.equal(await isMediaEventBeforeWithdrawal(db, 'watch', '2000-01-01'), true);
  assert.equal(await isMediaEventBeforeWithdrawal(db, 'watch', null), true);
  assert.equal(await isMediaEventBeforeWithdrawal(db, 'watch', '2100-01-01'), false);
  rows.push(row('new-intake', 'media-processing'));
  await withdrawWatchFromMedia(input, db);
  assert.equal(rows.find(r => r.id === 'new-intake').actionType, 'LINKED');
  await withdrawWatchFromMedia({ ...input, bindingId: 'new-intake' }, db);
  assert.equal(rows.find(r => r.id === 'new-intake').actionType, 'CANCELLED');
  console.log('PASS media withdrawal: all media stages retired; shared workspace/other Watch/non-media untouched; metadata retained; target mismatch rejected; idempotent old modal; delayed events rejected; new intake can be withdrawn separately. Database/event ports are synthetic.');
})().catch(error => { console.error(error); process.exitCode = 1; });
