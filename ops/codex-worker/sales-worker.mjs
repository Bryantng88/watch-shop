import { spawn } from 'node:child_process';
import { mkdir, readFile, rm } from 'node:fs/promises';
import { codexArguments, validateWorkerConfiguration } from './worker.mjs';
import { runSalesIntakeConversation } from './sales-intake-protocol.mjs';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
export function salesCodexArguments(directory, output) {
  const args = codexArguments(directory, output).map(arg => arg.startsWith('permissions.staging-worker=')
    ? arg.replace('extends=":workspace"', 'extends=":read-only"').replace('filesystem={', 'filesystem={"/work/repo"="deny","/work/runs"="deny","/work/order-runs"="deny",') : arg);
  args.splice(args.length - 1, 0, '--skip-git-repo-check', '--output-schema', '/opt/worker/sales-turn-schema.json');
  return args;
}
export async function runSalesIntakeWorker() {
  const config = validateWorkerConfiguration();
  let stopping = false, child;
  const kill = () => { if (child?.pid) try { process.kill(-child.pid, 'SIGKILL'); } catch {} };
  const stop = () => { stopping = true; kill(); };
  process.once('SIGTERM', stop); process.once('SIGINT', stop);
  const api = async (operation, body) => {
    const response = await fetch(config.appUrl + '/api/internal/sales-codex/' + operation, { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + process.env.PERSONAL_CODEX_WORKER_TOKEN }, body: JSON.stringify(body), signal: AbortSignal.timeout(20000), redirect: 'error' });
    if (!response.ok) throw Error('SALES_WORKER_API_' + response.status);
    return response.json();
  };
  try {
    while (!stopping) {
      let run, heartbeat, deadline, heartbeatWork, active = true, heartbeatBusy = false, output;
      try {
        ({ run } = await api('claim', { workerId: config.workerId }));
        if (!run) { await sleep(5000); continue; }
        if (!/^[a-f0-9-]{36}$/.test(run.id)) throw Error('INVALID_SALES_RUN');
        const directory = '/work/sales-runs/' + run.id;
        output = '/work/results/sales-' + run.id + '.json';
        await mkdir(directory, { recursive: true, mode: 0o700 });
        await mkdir('/work/results', { recursive: true, mode: 0o700 });
        const assertActive = () => { if (stopping || !active) throw Error('SALES_LEASE_LOST'); };
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
            child = spawn('codex', salesCodexArguments(directory, output), { cwd: directory, env, detached: true, stdio: ['pipe', 'ignore', 'ignore'] });
            child.on('error', reject); child.on('close', resolve); child.stdin.on('error', () => {}); child.stdin.end(prompt);
          });
          child = null; assertActive();
          if (rc !== 0) throw Error('SALES_CLI_FAILED');
          const text = await readFile(output, 'utf8');
          if (text.length > 64000) throw Error('SALES_OUTPUT_TOO_LARGE');
          return JSON.parse(text);
        };
        await runSalesIntakeConversation(run, { api, execute, assertActive });
      } catch (error) {
        if (run && active && !stopping) await api('finish', { id: run.id, leaseToken: run.leaseToken, failed: true }).catch(() => {});
        const code = typeof error?.message === 'string' && /^(?:SALES_[A-Z0-9_]+|INVALID_SALES_[A-Z0-9_]+)$/.test(error.message) ? error.message : 'SALES_EXECUTION_FAILED';
        console.error('Sales intake did not complete: ' + code + '. No business text or secrets logged.');
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
