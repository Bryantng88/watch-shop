'use strict';
const http = require('node:http');
const { setTimeout: delay } = require('node:timers/promises');

function dockerApi(method, path, body) {
  return new Promise((resolve, reject) => {
    const request = http.request({ socketPath: '/var/run/docker.sock', method, path,
      headers: body ? { 'Content-Type': 'application/json' } : {} }, response => {
      let text = '';
      response.on('data', chunk => { text += chunk; });
      response.on('end', () => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error('Docker operation failed (' + response.statusCode + ')'));
          return;
        }
        try { resolve(text ? JSON.parse(text) : null); } catch { reject(new Error('Invalid Docker response')); }
      });
    });
    request.setTimeout(60000, () => request.destroy(new Error('Docker operation timed out')));
    request.on('error', reject);
    request.end(body ? JSON.stringify(body) : undefined);
  });
}

async function reattach(api = dockerApi, pause = delay, workerImage = process.env.BEN_WORKER_IMAGE) {
  if (workerImage && !/^sha256:[0-9a-f]{64}$/.test(workerImage)) throw new Error('Worker image must be an immutable digest');
  const name = 'watch-shop-production-ben-worker';
  const app = await api('GET', '/containers/watch-shop-app-1/json');
  const worker = await api('GET', '/containers/' + name + '/json');
  if (!app.State.Running || app.State.Health?.Status !== 'healthy') throw new Error('App must be healthy');
  if (worker.Config.Labels?.['codex.scope'] !== 'ben-production-205789f6') throw new Error('Unexpected Ben worker');
  const network = 'container:' + app.Id;
  let target = worker.Id;
  let candidate;
  let renamed = false;
  let promoted = false;
  try {
    if (worker.HostConfig.NetworkMode !== network || (workerImage && worker.Image !== workerImage)) {
      const config = { ...worker.Config, Image: workerImage || worker.Image,
        HostConfig: { ...worker.HostConfig, NetworkMode: network } };
      delete config.Hostname;
      delete config.Domainname;
      candidate = await api('POST', '/containers/create?name=' + name + '-candidate-' + app.Id.slice(0, 12), config);
      if (worker.State.Running) await api('POST', '/containers/' + worker.Id + '/stop?t=20');
      await api('POST', '/containers/' + worker.Id + '/rename?name=' + name + '-previous-' + worker.Id.slice(0, 12));
      renamed = true;
      await api('POST', '/containers/' + candidate.Id + '/rename?name=' + name);
      promoted = true;
      target = candidate.Id;
    }
    const before = await api('GET', '/containers/' + target + '/json');
    if (!before.State.Running) await api('POST', '/containers/' + target + '/start');
    await pause(4000);
    const running = await api('GET', '/containers/' + target + '/json');
    if (!running.State.Running || running.RestartCount !== before.RestartCount) throw new Error('Ben worker did not stay running');
    const exec = await api('POST', '/containers/' + target + '/exec', {
      AttachStdout: false, AttachStderr: false,
      Cmd: ['node', '-e', "fetch('http://127.0.0.1:3000/api/health',{signal:AbortSignal.timeout(5000)}).then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"],
    });
    await api('POST', '/exec/' + exec.Id + '/start', { Detach: true });
    let result;
    for (let attempt = 0; attempt < 12; attempt++) {
      result = await api('GET', '/exec/' + exec.Id + '/json');
      if (!result.Running) break;
      await pause(500);
    }
    if (result.Running || result.ExitCode !== 0) throw new Error('Ben cannot reach current app');
  } catch (error) {
    if (candidate) {
      await api('DELETE', '/containers/' + candidate.Id + '?force=true').catch(() => {});
      if (renamed) {
        await api('POST', '/containers/' + worker.Id + '/rename?name=' + name);
        if (worker.State.Running) await api('POST', '/containers/' + worker.Id + '/start');
      }
    }
    throw error;
  }
  if (candidate && promoted) {
    await api('DELETE', '/containers/' + worker.Id).catch(() => {
      console.warn('[deploy] Previous stopped Ben worker retained for inspection');
    });
  }
  console.log('[deploy] Ben worker attached to healthy current app; connectivity verified');
}
module.exports = { reattach };
if (require.main === module) reattach().catch(() => {
  console.error('[deploy] Ben worker attachment or connectivity check failed');
  process.exitCode = 1;
});
