import { readFile } from 'node:fs/promises';
process.env.PERSONAL_CODEX_WORKER_TOKEN = (await readFile('/run/worker/api-token', 'utf8')).trim();
process.env.GH_TOKEN = await readFile('/run/worker/gh-token', 'utf8').then(value => value.trim()).catch(() => undefined);
if (process.env.PERSONAL_CODEX_PUBLISH_DRAFT_PRS === '1' && !process.env.GH_TOKEN) {
  console.error('Dedicated worker GitHub credential is required before activation.');
  process.exit(1);
}
const { runWorker } = await import('./worker.mjs');
console.log('Isolated staging Codex worker started.');
const loops=[runWorker()];
if(process.env.ORDER_CODEX_WORKER==='1'){const {runOrderWorkflowWorker}=await import('./order-worker.mjs');loops.push(runOrderWorkflowWorker());}
if(process.env.SALES_CODEX_WORKER==='1'){const {runSalesIntakeWorker}=await import('./sales-worker.mjs');loops.push(runSalesIntakeWorker());}
if(process.env.CUSTOMER_AI_WORKER==='1'){const {runCustomerAssistantWorker}=await import('./customer-assistant-worker.mjs');loops.push(runCustomerAssistantWorker());}
await Promise.all(loops);
