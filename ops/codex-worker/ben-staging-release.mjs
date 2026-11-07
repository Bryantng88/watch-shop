import { spawn } from 'node:child_process';
import { readFile, lstat, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
export function validateReleaseReceipt(receipt, sha) {
  if (
    !receipt ||
    Object.keys(receipt).sort().join(',') !==
      'adminHealthy,backupVerified,deployedSha,environmentPreserved,privateIngress,storefrontUnchanged,workerPreserved' ||
    receipt.deployedSha !== sha ||
    ![
      'adminHealthy',
      'workerPreserved',
      'environmentPreserved',
      'privateIngress',
      'storefrontUnchanged',
      'backupVerified',
    ].every((k) => receipt[k] === true)
  )
    throw Error('RELEASE_RECEIPT_REJECTED');
  return true;
}
export async function runRelease({ script, expectedHash, run, command }) {
  if (
    !/^[a-f0-9]{40}$/.test(run.releaseSha) ||
    !/^[a-f0-9-]{36}$/.test(run.id) ||
    !/^[a-f0-9]{64}$/.test(expectedHash) ||
    !script.startsWith('/') ||
    script.startsWith('/work/') ||
    script.includes('/../')
  )
    throw Error('RELEASE_CONFIG_REJECTED');
  const stat = await lstat(script);
  if (
    !stat.isFile() ||
    stat.isSymbolicLink() ||
    (stat.mode & 0o022) !== 0 ||
    createHash('sha256')
      .update(await readFile(script))
      .digest('hex') !== expectedHash
  )
    throw Error('RELEASE_SCRIPT_CHANGED');
  const output = await command(script, [
    '--repository',
    'Bryantng88/watch-shop',
    '--commit',
    run.releaseSha,
    '--request-id',
    run.id,
  ]);
  const receipt = JSON.parse(output.trim().split('\n').at(-1));
  validateReleaseReceipt(receipt, run.releaseSha);
  return receipt;
}
export async function runBenStagingRelease() {
  if (
    process.env.PERSONAL_CODEX_ENVIRONMENT !== 'staging' ||
    process.env.BEN_CODE_RELEASE_EXECUTOR !== '1'
  )
    throw Error('RELEASE_DISABLED');
  const app = new URL(process.env.BEN_CODE_RELEASE_APP_URL || '');
  if (
    !['https:', 'http:'].includes(app.protocol) ||
    app.username ||
    app.password ||
    app.pathname !== '/' ||
    app.search ||
    app.hash ||
    (app.protocol !== 'https:' &&
      !['127.0.0.1', 'watch-shop-storefront-staging-admin-app'].includes(
        app.hostname
      ))
  )
    throw Error('RELEASE_URL_REJECTED');
  const token = (
      await readFile(
        process.env.BEN_CODE_RELEASE_TOKEN_FILE || '/run/ben-release/api-token',
        'utf8'
      )
    ).trim(),
    script = resolve(
      process.env.BEN_CODE_RELEASE_SCRIPT || '/run/ben-release/deploy-staging'
    );
  if (token.length < 32) throw Error('RELEASE_TOKEN_REQUIRED');
  const journal = resolve(
    process.env.BEN_CODE_RELEASE_JOURNAL || '/var/lib/ben-releases'
  );
  await mkdir(journal, { recursive: true, mode: 0o700 });
  const api = async (op, body) => {
    const r = await fetch(app.origin + '/api/internal/ben-code/release-' + op, {
      method: 'POST',
      headers: {
        authorization: 'Bearer ' + token,
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20000),
      redirect: 'error',
    });
    if (!r.ok) throw Error('RELEASE_API_REJECTED');
    return r.json();
  };
  let stopping = false;
  process.once('SIGTERM', () => {
    stopping = true;
  });
  process.once('SIGINT', () => {
    stopping = true;
  });
  while (!stopping) {
    let run,
      timer,
      started = false;
    try {
      ({ run } = await api('claim', {}));
      if (!run) {
        await new Promise((r) => setTimeout(r, 5000));
        continue;
      }
      const key = {
        id: run.id,
        conversationId: run.conversationId,
        leaseToken: run.leaseToken,
      };
      let lease = true;
      timer = setInterval(() => {
        void api('heartbeat', key)
          .then((r) => {
            if (!r.active) lease = false;
          })
          .catch(() => {
            lease = false;
          });
      }, 20000);
      const receipt = await runRelease({
        script,
        expectedHash: run.handlerSha256,
        run,
        command: (exe, args) =>
          new Promise((done, reject) => {
            if (!lease) return reject(Error('RELEASE_LEASE_LOST'));
            started = true;
            const child = spawn(exe, args, {
              stdio: ['ignore', 'pipe', 'ignore'],
              env: {
                PATH: process.env.PATH,
                HOME: process.env.HOME,
                LANG: 'C.UTF-8',
              },
              detached: true,
            });
            let output = '';
            const timeout = setTimeout(() => {
              try {
                process.kill(-child.pid, 'SIGTERM');
              } catch {}
              reject(Error('RELEASE_TIMEOUT'));
            }, 1800000);
            child.stdout.on('data', (part) => {
              output = (output + part).slice(-16000);
            });
            child.on('error', () => {
              clearTimeout(timeout);
              reject(Error('RELEASE_COMMAND_FAILED'));
            });
            child.on('close', (code) => {
              clearTimeout(timeout);
              if (code === 0) done(output);
              else reject(Error('RELEASE_COMMAND_FAILED'));
            });
          }),
      });
      await writeFile(
        join(journal, run.id + '.json'),
        JSON.stringify({ id: run.id, sha: run.releaseSha, receipt }),
        { mode: 0o600 }
      );
      if (lease)
        await api('finish', {
          ...key,
          deployedSha: run.releaseSha,
          healthVerified: true,
        });
    } catch {
      if (run)
        await api('finish', {
          id: run.id,
          conversationId: run.conversationId,
          leaseToken: run.leaseToken,
          failed: true,
          uncertain: started,
          errorCode: 'RELEASE_NEEDS_REVIEW',
        }).catch(() => {});
      console.error(
        'Ben staging release requires review. No runtime environment or receipt contents logged.'
      );
    } finally {
      clearInterval(timer);
    }
    if (!stopping) await new Promise((r) => setTimeout(r, 2000));
  }
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
)
  runBenStagingRelease().catch(() => {
    console.error('Ben staging executor unavailable.');
    process.exitCode = 1;
  });
