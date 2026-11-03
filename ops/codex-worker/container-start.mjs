import { readFile } from 'node:fs/promises';
process.env.PERSONAL_CODEX_WORKER_TOKEN = (await readFile('/run/worker/api-token', 'utf8')).trim();
process.env.GH_TOKEN = await readFile('/run/worker/gh-token', 'utf8').then(value => value.trim()).catch(() => undefined);
if (process.env.PERSONAL_CODEX_PUBLISH_DRAFT_PRS === '1' && !process.env.GH_TOKEN) {
  console.error('Dedicated worker GitHub credential is required before activation.');
  process.exit(1);
}
const { runWorker } = await import('./worker.mjs');
console.log('Isolated staging Codex worker started.');
await runWorker();
