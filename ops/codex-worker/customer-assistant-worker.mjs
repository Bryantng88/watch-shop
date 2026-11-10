import { pathToFileURL } from 'node:url';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { codexArguments, validateWorkerConfiguration } from './worker.mjs';
import { runCustomerConversation } from './customer-assistant-protocol.mjs';
import { pollCustomerQueue } from './customer-queue.mjs';

export function customerCodexArguments(directory, output, imagePath) {
  const args = codexArguments(directory, output).map(arg => arg.startsWith('permissions.staging-worker=')
    ? arg.replace('extends=":workspace"', 'extends=":read-only"').replace('filesystem={', 'filesystem={"/work/repo"="deny","/work/runs"="deny","/work/order-runs"="deny","/work/sales-runs"="deny",') : arg);
  args.splice(args.length - 1, 0, '--skip-git-repo-check', '--output-schema', '/opt/worker/customer-turn-schema.json');
  if (imagePath) args.splice(args.length - 1, 0, "--image", imagePath, "--");
  return args;
}
export async function runCustomerAssistantWorker() {
  const production = process.env.BEN_CUSTOMER_ENVIRONMENT === 'production';
  let token = process.env.PERSONAL_CODEX_WORKER_TOKEN;
  let config;
  if (production) {
    token = (await readFile('/run/worker/ben-customer-production-token', 'utf8')).trim();
    if (token.length < 32) throw Error('CUSTOMER_WORKER_TOKEN_REQUIRED');
    config = { appUrl: 'http://127.0.0.1:3000', workerId: 'production-ben' };
  } else {
    config = validateWorkerConfiguration();
  }
  let stopping = false, child;
  const kill = () => { if (child?.pid) try { process.kill(-child.pid, 'SIGKILL'); } catch {} };
  const stop = () => { stopping = true; kill(); };
  process.once('SIGTERM', stop); process.once('SIGINT', stop);
  const api = async (operation, body) => {
    const response = await fetch(config.appUrl + '/api/internal/customer-assistant/' + operation, { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + token }, body: JSON.stringify(body), signal: AbortSignal.timeout(20000), redirect: 'error' });
    if (!response.ok) throw Error('CUSTOMER_WORKER_API_' + response.status);
    return response.json();
  };
  try {
    await pollCustomerQueue({ stopped: () => stopping, runOnce: async () => {
      let run, heartbeat, deadline, heartbeatWork, active = true, heartbeatBusy = false, output, imagePath;
      try {
        ({ run } = await api('claim', { workerId: config.workerId, imageInput: true }));
        if (!run) return 'idle';
        if (!/^[a-f0-9-]{36}$/.test(run.id)) throw Error('INVALID_CUSTOMER_RUN');
        const directory = '/work/customer-runs/' + run.id;
        output = '/work/results/customer-' + run.id + '.json';
        await mkdir(directory, { recursive: true, mode: 0o700 });
        await mkdir('/work/results', { recursive: true, mode: 0o700 });
        if (run.imageBase64 !== undefined) {
          const encoded = run.imageBase64;
          if (typeof encoded !== 'string' || encoded.length > Math.ceil((512 * 1024) / 3) * 4 || !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded))
            throw Error('CUSTOMER_IMAGE_INVALID');
          const bytes = Buffer.from(encoded, 'base64');
          if (bytes.length > 512 * 1024 || bytes.length < 4 || bytes[0] !== 255 || bytes[1] !== 216 || bytes.toString('base64') !== encoded)
            throw Error('CUSTOMER_IMAGE_INVALID');
          const path = '/work/results/customer-image-' + randomUUID() + '.jpg';
          await writeFile(path, bytes, { mode: 0o600, flag: 'wx' });
          imagePath = path;
        }
        const assertActive = () => { if (stopping || !active) throw Error('CUSTOMER_LEASE_LOST'); };
        heartbeat = setInterval(() => {
          if (heartbeatBusy) return;
          heartbeatBusy = true;
          heartbeatWork = (async () => {
            try { active = Boolean((await api('heartbeat', { id: run.id, leaseToken: run.leaseToken })).active); } catch { active = false; }
            finally { heartbeatBusy = false; }
            if (!active) kill();
          })();
        }, 20000);
        deadline = setTimeout(() => { active = false; kill(); }, 900000);
        const execute = async prompt => {
          assertActive(); await rm(output, { force: true });
          const env = Object.fromEntries(['PATH', 'HOME', 'CODEX_HOME', 'LANG', 'LC_ALL', 'TMPDIR', 'SSL_CERT_FILE', 'SSL_CERT_DIR', 'NODE_EXTRA_CA_CERTS'].filter(key => process.env[key]).map(key => [key, process.env[key]]));
          const rc = await new Promise((resolve, reject) => {
            child = spawn('codex', customerCodexArguments(directory, output, imagePath), { cwd: directory, env, detached: true, stdio: ['pipe', 'ignore', 'ignore'] });
            child.on('error', reject); child.on('close', resolve); child.stdin.on('error', () => {}); child.stdin.end(prompt);
          });
          child = null; assertActive();
          if (rc !== 0) throw Error('CUSTOMER_CLI_FAILED');
          const text = await readFile(output, 'utf8');
          if (text.length > 64000) throw Error('CUSTOMER_OUTPUT_TOO_LARGE');
          return JSON.parse(text);
        };
        await runCustomerConversation(run, { api, execute, assertActive });
        return 'processed';
      } catch (error) {
        if (run && active && !stopping) await api('finish', { id: run.id, leaseToken: run.leaseToken, failed: true }).catch(() => {});
        const code = typeof error?.message === 'string' && /^(?:CUSTOMER_[A-Z0-9_]+|INVALID_CUSTOMER_[A-Z0-9_]+)$/.test(error.message) ? error.message : 'CUSTOMER_EXECUTION_FAILED';
        console.error('Customer assistant did not complete: ' + code + '. No business text or secrets logged.');
        return 'failed';
      } finally {
        clearInterval(heartbeat); clearTimeout(deadline);
        await heartbeatWork?.catch(() => {});
        kill(); child = null;
        if (imagePath) await rm(imagePath, { force: true }).catch(() => {});
        if (output) await rm(output, { force: true }).catch(() => {});
      }
    } });
  } finally { process.removeListener('SIGTERM', stop); process.removeListener('SIGINT', stop); stop(); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runCustomerAssistantWorker().catch(() => {
    console.error('Customer assistant worker could not start.');
    process.exitCode = 1;
  });
}
