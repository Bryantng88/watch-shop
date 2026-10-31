#!/usr/bin/env node
import { spawn } from "node:child_process";
import { mkdir, readFile, rm, lstat, access } from "node:fs/promises";
import { resolve, join, isAbsolute } from "node:path";
import { pathToFileURL } from "node:url";

const REPOSITORY = "Bryantng88/watch-shop";
const ORIGIN = `https://github.com/${REPOSITORY}.git`;
const sleep = ms => new Promise(done => setTimeout(done, ms));

export function validateWorkerConfiguration(env = process.env) {
  if (env.PERSONAL_CODEX_ENVIRONMENT !== "staging") throw new Error("STAGING_WORKER_REQUIRED");
  const app = new URL(env.PERSONAL_CODEX_APP_URL || "");
  const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(app.hostname);
  const privateIp = /^(10\.|192\.168\.|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.|172\.(1[6-9]|2\d|3[01])\.)/.test(app.hostname) || app.hostname === "watch-shop-storefront-staging-admin-app";
  if (app.username || app.password || app.search || app.hash || app.pathname !== "/" || (app.protocol !== "https:" && !(app.protocol === "http:" && (loopback || (privateIp && env.PERSONAL_CODEX_ALLOW_PRIVATE_HTTP === "1"))))) throw new Error("SECURE_STAGING_APP_URL_REQUIRED");
  if ((env.PERSONAL_CODEX_WORKER_TOKEN?.length ?? 0) < 32) throw new Error("WORKER_TOKEN_REQUIRED");
  if (!env.PERSONAL_CODEX_REPO_ROOT || !isAbsolute(env.PERSONAL_CODEX_REPO_ROOT)) throw new Error("ISOLATED_REPO_ROOT_REQUIRED");
  return { appUrl: app.origin, repoRoot: resolve(env.PERSONAL_CODEX_REPO_ROOT), workerId: env.PERSONAL_CODEX_WORKER_ID || "staging-codex-1" };
}

export function validateChangedPaths(paths) {
  for (const path of paths) {
    if (path.startsWith("/") || path.split("/").includes("..") || /(^|\/)(\.env[^/]*|\.ssh|\.codex)(\/|$)/.test(path) || /^(\.github\/workflows\/|ops\/deployment\/|AGENTS\.md$)/.test(path)) throw new Error("PROTECTED_PATH_CHANGED");
  }
}

export function codexArguments(directory, outputFile) {
  return ["--ask-for-approval", "never", "exec", "--ignore-user-config", "--sandbox", "workspace-write", "--ephemeral", "--json", "--output-last-message", outputFile, "-c", 'shell_environment_policy.inherit="none"', "-c", "sandbox_workspace_write.network_access=false", "-C", directory, "-"];
}

function childEnvironment() {
  const allowed = ["PATH", "HOME", "LANG", "LC_ALL", "TMPDIR", "SYSTEMROOT", "OPENAI_API_KEY", "CODEX_HOME", "HTTP_PROXY", "HTTPS_PROXY", "NO_PROXY", "NODE_EXTRA_CA_CERTS", "SSL_CERT_FILE", "SSL_CERT_DIR"];
  const keys = [...new Set([...allowed, ...Object.keys(process.env).filter(key => /^(OPENAI_|CODEX_|OIC_)/.test(key))])];
  return Object.fromEntries(keys.filter(key => process.env[key] !== undefined).map(key => [key, process.env[key]]));
}
function sanitized(text) {
  let value = String(text).slice(0, 8000);
  for (const [key, secret] of Object.entries(process.env)) if (/(TOKEN|SECRET|PASSWORD|API_KEY)/.test(key) && secret && secret.length >= 8) value = value.split(secret).join("[redacted]");
  return value;
}
async function command(executable, args, options = {}) {
  return new Promise((done, reject) => {
    const child = spawn(executable, args, { ...options, stdio: ["ignore", "pipe", "pipe"] });
    const timeout = setTimeout(() => child.kill("SIGKILL"), 45000);
    let output = "";
    let tooLarge = false;
    child.stdout.on("data", chunk => { output += chunk; if (output.length > 1000000) { tooLarge = true; child.kill("SIGKILL"); } });
    child.stderr.on("data", () => {}); // Remote error bodies and credentials are not logged.
    child.on("error", () => { clearTimeout(timeout); reject(new Error("COMMAND_UNAVAILABLE")); });
    child.on("close", code => { clearTimeout(timeout); if (code === 0 && !tooLarge) done(output.trim()); else reject(new Error("COMMAND_FAILED")); });
  });
}
function gitEnvironment() {
  const env = childEnvironment();
  for (const key of Object.keys(env)) if (/^(OPENAI_|CODEX_|OIC_)/.test(key)) delete env[key];
  env.GIT_TERMINAL_PROMPT = "0";
  if (process.env.GH_TOKEN) {
    env.GIT_CONFIG_COUNT = "1";
    env.GIT_CONFIG_KEY_0 = "http.https://github.com/.extraheader";
    env.GIT_CONFIG_VALUE_0 = `AUTHORIZATION: basic ${Buffer.from(`x-access-token:${process.env.GH_TOKEN}`).toString("base64")}`;
  }
  return env;
}
async function api(config, operation, body) {
  const response = await fetch(`${config.appUrl}/api/internal/personal-codex/${operation}`, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${process.env.PERSONAL_CODEX_WORKER_TOKEN}` }, body: JSON.stringify(body), signal: AbortSignal.timeout(20000), redirect: "error" });
  if (response.status === 409) return { active: false, accepted: false };
  if (!response.ok) throw new Error(`WORKER_API_${response.status}`);
  return response.json();
}

async function execute(config, run, heartbeatIntervalMs = 20000) {
  if (run.repository !== REPOSITORY || run.baseBranch !== "main" || !/^[a-zA-Z0-9-]{1,80}$/.test(run.id)) throw new Error("RUN_REPOSITORY_REJECTED");
  const branch = `codex/personal-work/${run.id}`;
  const directory = join(config.repoRoot, "..", "runs", run.id);
  const resultDirectory = join(config.repoRoot, "..", "results");
  const outputFile = join(resultDirectory, `${run.id}.txt`);
  await mkdir(resultDirectory, { recursive: true, mode: 0o700 });
  const git = (args, cwd = config.repoRoot) => command("git", args, { cwd, env: gitEnvironment() });
  const remote = await git(["remote", "get-url", "origin"]);
  if (remote !== ORIGIN) throw new Error("REPOSITORY_ORIGIN_REJECTED");
  await access(join(config.repoRoot, ".git", "personal-codex-worker"));
  await git(["fetch", "--no-tags", "origin", "main"]);
  const baseSha = await git(["rev-parse", "FETCH_HEAD"]);
  await mkdir(resolve(directory, ".."), { recursive: true });
  await git(["worktree", "add", "-b", branch, directory, baseSha]);
  let child;
  let active = true;
  let timedOut = false;
  let heartbeatPromise;
  let killTimer;
  const stop = () => {
    if (!child?.pid) return;
    try { process.kill(-child.pid, "SIGTERM"); } catch {}
    if (!killTimer) killTimer = setTimeout(() => { try { process.kill(-child.pid, "SIGKILL"); } catch {} }, 5000);
  };
  const heartbeat = () => {
    if (heartbeatPromise) return heartbeatPromise;
    heartbeatPromise = (async () => {
      try { active = Boolean((await api(config, "heartbeat", { id: run.id, leaseToken: run.leaseToken })).active); }
      catch { active = false; }
      if (!active) stop();
    })().finally(() => { heartbeatPromise = null; });
    return heartbeatPromise;
  };
  const timer = setInterval(() => void heartbeat(), heartbeatIntervalMs);
  const deadline = setTimeout(() => { timedOut = true; stop(); }, Math.min(1800, Math.max(60, run.timeoutSeconds || 900)) * 1000);
  process.once("SIGTERM", stop);
  process.once("SIGINT", stop);
  try {
    await heartbeat();
    if (!active) return;
    const exitCode = await new Promise((done, reject) => {
      child = spawn(process.env.PERSONAL_CODEX_BINARY || "codex", codexArguments(directory, outputFile), { cwd: directory, env: childEnvironment(), detached: true, stdio: ["pipe", "ignore", "ignore"] });
      child.on("error", () => reject(new Error("CODEX_EXECUTABLE_UNAVAILABLE")));
      child.on("close", done);
      child.stdin.on("error", () => {});
      child.stdin.end(`Work only in this isolated checkout of ${REPOSITORY}. Follow AGENTS.md. Do not commit, push, merge, deploy, modify production infrastructure, access credentials or contact customers. Prepare code and relevant tests for a draft PR. Do not write secrets into output. Return a concise summary with verification and limitations.\n\nTask supplied by the requesting owner:\n${run.prompt}\n`);
    });
    if (!active) return;
    if (timedOut || exitCode !== 0) {
      await api(config, "finish", { id: run.id, leaseToken: run.leaseToken, status: timedOut ? "TIMED_OUT" : "FAILED", summary: timedOut ? "Codex exceeded the configured time limit." : "Codex did not complete successfully. Review the isolated worker before retrying." });
      return;
    }
    const summary = sanitized(await readFile(outputFile, "utf8").catch(() => "Codex completed."));
    await rm(outputFile, { force: true });
    await heartbeat();
    if (!active) return;
    if (await git(["rev-parse", "HEAD"], directory) !== baseSha || await git(["branch", "--show-current"], directory) !== branch || await git(["remote", "get-url", "origin"], directory) !== ORIGIN) throw new Error("AGENT_CHANGED_GIT_IDENTITY");
    const changed = [...new Set([await git(["ls-files", "--modified", "--deleted", "--others", "--exclude-standard"], directory), await git(["diff", "--cached", "--name-only"], directory)].join("\n").split("\n").filter(Boolean))];
    validateChangedPaths(changed);
    for (const path of changed) {
      const stat = await lstat(join(directory, path)).catch(() => null);
      if (stat?.isSymbolicLink()) throw new Error("SYMLINK_CHANGE_REQUIRES_MANUAL_REVIEW");
    }
    let resultUrl = null;
    let commitSha = null;
    if (changed.length) {
      if (process.env.PERSONAL_CODEX_PUBLISH_DRAFT_PRS !== "1" || !process.env.GH_TOKEN) throw new Error("DRAFT_PR_PUBLISH_NOT_CONFIGURED");
      await git(["add", "--", ...changed], directory);
      await git(["-c", "user.name=Watch Shop Codex", "-c", "user.email=codex@users.noreply.github.com", "commit", "-m", `Prepare personal work ${run.id}`], directory);
      commitSha = await git(["rev-parse", "HEAD"], directory);
      await heartbeat(); if (!active) return;
      await git(["-c", "push.followTags=false", "push", "origin", `HEAD:refs/heads/${branch}`], directory);
      const response = await fetch(`https://api.github.com/repos/${REPOSITORY}/pulls`, { method: "POST", headers: { authorization: `Bearer ${process.env.GH_TOKEN}`, accept: "application/vnd.github+json", "content-type": "application/json", "user-agent": "watch-shop-personal-codex" }, body: JSON.stringify({ title: `Personal work ${run.id}`, head: branch, base: "main", draft: true, body: summary }), signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error("DRAFT_PR_CREATE_FAILED");
      resultUrl = (await response.json()).html_url;
    }
    await api(config, "finish", { id: run.id, leaseToken: run.leaseToken, status: "SUCCEEDED", summary, resultUrl, commitSha });
  } finally {
    clearInterval(timer); clearTimeout(deadline);
    if (killTimer) clearTimeout(killTimer);
    process.removeListener("SIGTERM", stop); process.removeListener("SIGINT", stop);
    stop();
    if (child?.pid) { try { process.kill(-child.pid, "SIGKILL"); } catch {} }
    if (killTimer) clearTimeout(killTimer);
    // Worktrees are retained for inspection. Never remove another run's data.
  }
}

export async function runWorker({ once = false, heartbeatIntervalMs = 20000 } = {}) {
  const config = validateWorkerConfiguration();
  let stopping = false;
  const requestStop = () => { stopping = true; };
  process.once("SIGTERM", requestStop);
  process.once("SIGINT", requestStop);
  try {
    while (!stopping) {
      let run;
      try {
        ({ run } = await api(config, "claim", { workerId: config.workerId }));
        if (run) await execute(config, run, heartbeatIntervalMs);
      } catch {
        if (run) await api(config, "finish", { id: run.id, leaseToken: run.leaseToken, status: "FAILED", summary: "The isolated Codex worker stopped before returning a reviewable result." }).catch(() => {});
        console.error("Codex worker request failed; inspect configuration and isolated worktree.");
      }
      if (once) break;
      await sleep(5000);
    }
  } finally {
    process.removeListener("SIGTERM", requestStop);
    process.removeListener("SIGINT", requestStop);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) runWorker({ once: process.argv.includes("--once") }).catch(() => { console.error("Invalid isolated staging Codex worker configuration."); process.exitCode = 1; });
