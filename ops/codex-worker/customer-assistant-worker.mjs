import { pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';
import { mkdir, readFile, rm } from 'node:fs/promises';
import { codexArguments, validateWorkerConfiguration } from './worker.mjs';
import { runCustomerConversation } from './customer-assistant-protocol.mjs';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
export function customerCodexArguments(directory, output) {
  const args = codexArguments(directory, output).map(arg => arg.startsWith('permissions.staging-worker=')
    ? arg.replace('extends=":workspace"', 'extends=":read-only"').replace('filesystem={', 'filesystem={"/work/repo"="deny","/work/runs"="deny","/work/order-runs"="deny","/work/sales-runs"="deny",') : arg);
  args.splice(args.length - 1, 0, '--skip-git-repo-check', '--output-schema', '/opt/worker/customer-turn-schema.json');
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
    while (!stopping) {
      let run, heartbeat, deadline, heartbeatWork, active = true, heartbeatBusy = false, output;
      try {
        ({ run } = await api('claim', { workerId: config.workerId }));
        if (!run) { await sleep(5000); continue; }
        if (!/^[a-f0-9-]{36}$/.test(run.id)) throw Error('INVALID_CUSTOMER_RUN');
        const directory = '/work/customer-runs/' + run.id;
        output = '/work/results/customer-' + run.id + '.json';
        await mkdir(directory, { recursive: true, mode: 0o700 });
        await mkdir('/work/results', { recursive: true, mode: 0o700 });
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
            child = spawn('codex', customerCodexArguments(directory, output), { cwd: directory, env, detached: true, stdio: ['pipe', 'ignore', 'ignore'] });
            child.on('error', reject); child.on('close', resolve); child.stdin.on('error', () => {}); child.stdin.end(prompt);
          });
          child = null; assertActive();
          if (rc !== 0) throw Error('CUSTOMER_CLI_FAILED');
          const text = await readFile(output, 'utf8');
          if (text.length > 64000) throw Error('CUSTOMER_OUTPUT_TOO_LARGE');
          return JSON.parse(text);
        };
        await runCustomerConversation(run, { api, execute, assertActive });
      } catch (error) {
        if (run && active && !stopping) await api('finish', { id: run.id, leaseToken: run.leaseToken, failed: true }).catch(() => {});
        const code = typeof error?.message === 'string' && /^(?:CUSTOMER_[A-Z0-9_]+|INVALID_CUSTOMER_[A-Z0-9_]+)$/.test(error.message) ? error.message : 'CUSTOMER_EXECUTION_FAILED';
        console.error('Customer assistant did not complete: ' + code + '. No business text or secrets logged.');
      } finally {
        clearInterval(heartbeat); clearTimeout(deadline);
        await heartbeatWork?.catch(() => {});
        kill(); child = null;
        if (output) await rm(output, { force: true }).catch(() => {});
      }
      if (!stopping) await sleep(5000);
    }
  } finally { process.removeListener('SIGTERM', stop); process.removeListener('SIGINT', stop); stop(); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runCustomerAssistantWorker().catch(() => {
    console.error('Customer assistant worker could not start.');
    process.exitCode = 1;
  });
}
