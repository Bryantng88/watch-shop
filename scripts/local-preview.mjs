import { spawn } from "node:child_process";
import { randomBytes, createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const action = process.argv[2] || "start";
if (!["setup", "start", "stop", "status", "verify"].includes(action)) throw new Error("Use setup, start, stop, status, or verify");
if (process.env.NODE_ENV === "production") throw new Error("Local preview cannot run in production");
const stateDir = resolve(root, ".watch-shop-preview");
const statePath = resolve(stateDir, "state.json");
const suffix = createHash("sha256").update(root).digest("hex").slice(0, 10);
const container = `watch-shop-preview-${suffix}`;
const dbName = "watch_shop_preview_test";
let state;
if (existsSync(statePath)) {
  state = JSON.parse(readFileSync(statePath, "utf8"));
} else if (action === "setup" || action === "start" || action === "verify") {
  state = { version: 1, databasePassword: randomBytes(24).toString("hex"), adminPassword: randomBytes(24).toString("hex"), authSecret: randomBytes(32).toString("hex"), databasePort: 54329, appPort: 3000 };
  mkdirSync(stateDir, { recursive: true, mode: 0o700 });
  writeFileSync(statePath, JSON.stringify(state), { mode: 0o600, flag: "wx" });
} else {
  console.log("No preview has been configured for this checkout.");
  process.exit(0);
}
if (state.version !== 1 || ![state.databasePort, state.appPort].every(p => Number.isInteger(p) && p >= 1024 && p <= 65535) || ![state.databasePassword, state.adminPassword, state.authSecret].every(v => typeof v === "string" && /^[a-f0-9]{48,64}$/.test(v))) throw new Error("Invalid local preview state; do not replace an existing database's credentials");
const databaseUrl = `postgresql://preview:${state.databasePassword}@127.0.0.1:${state.databasePort}/${dbName}`;
const env = { ...process.env, XDG_CACHE_HOME: resolve(stateDir, "cache"), npm_config_cache: resolve(stateDir, "npm-cache"), NODE_ENV: "development", DATABASE_URL: databaseUrl, DIRECT_URL: databaseUrl, AUTH_SECRET: state.authSecret, LOCAL_ADMIN_PASSWORD: state.adminPassword, LOCAL_AUTO_LOGIN: "true", APP_URL: `http://localhost:${state.appPort}`, AUTH_COOKIE_SECURE: "false", POSTGRES_PASSWORD: state.databasePassword, GOOGLE_CALENDAR_CLIENT_ID: "", GOOGLE_CALENDAR_CLIENT_SECRET: "", GOOGLE_CALENDAR_TOKEN_KEY: "", S3_ENDPOINT: "", S3_BUCKET: "", AWS_ACCESS_KEY_ID: "", AWS_SECRET_ACCESS_KEY: "", NEXT_TELEMETRY_DISABLED: "1" };
const dockerEnv = { ...env };
for (const key of ["DOCKER_HOST", "DOCKER_CONTEXT", "DOCKER_TLS", "DOCKER_TLS_VERIFY", "DOCKER_CERT_PATH"]) delete dockerEnv[key];
const dockerPrefix = ["--host=unix:///var/run/docker.sock"];
function redact(text) {
  for (const secret of [databaseUrl, state.databasePassword, state.adminPassword, state.authSecret]) text = text.split(secret).join("[REDACTED]");
  return text;
}
function run(command, args, { docker = false, allowFailure = false, show = true } = {}) {
  return new Promise((done, reject) => {
    const child = spawn(command, args, { cwd: root, env: docker ? dockerEnv : env, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    for (const stream of [child.stdout, child.stderr]) stream.on("data", b => { output += b.toString(); });
    child.on("error", reject);
    child.on("close", code => {
      if (show && output) process.stdout.write(redact(output));
      if (code !== 0 && !allowFailure) reject(new Error(`${command} failed (exit ${code}).`));
      else done({ code, output });
    });
  });
}
const docker = (args, options = {}) => run("docker", [...dockerPrefix, ...args], { ...options, docker: true });
async function inspect() {
  const result = await docker(["inspect", container], { allowFailure: true, show: false });
  if (result.code !== 0) {
    if (!result.output.includes("No such object") && !result.output.includes("No such container")) throw new Error("Docker is unavailable. Recover the local Docker daemon before retrying.");
    return null;
  }
  const row = JSON.parse(result.output)[0];
  if (row.Config?.Labels?.["watch-shop.preview.checkout"] !== suffix) throw new Error("Container ownership mismatch; refusing to modify it");
  return row;
}
async function setup() {
  console.log("Preparing a dedicated loopback PostgreSQL preview database…");
  let row = await inspect();
  if (!row) {
    await docker(["run", "--detach", "--name", container, "--label", `watch-shop.preview.checkout=${suffix}`, "--publish", `127.0.0.1:${state.databasePort}:5432`, "--env", "POSTGRES_PASSWORD", "--env", "POSTGRES_USER=preview", "--env", `POSTGRES_DB=${dbName}`, "--volume", `${container}-data:/var/lib/postgresql/data`, "postgres:17-bookworm"]);
  } else if (!row.State.Running) await docker(["start", container]);
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt++) {
    const check = await docker(["exec", container, "pg_isready", "-U", "preview", "-d", dbName], { allowFailure: true, show: false });
    if (check.code === 0) { ready = true; break; }
    await new Promise(done => setTimeout(done, 500));
  }
  if (!ready) throw new Error("Preview PostgreSQL did not become ready");
  await run("npx", ["--no-install", "prisma", "generate", "--generator", "client"]);
  // The historical migration baseline cannot bootstrap an empty database.
  // This schema push is restricted to the database created above. No reset.
  await run("npx", ["--no-install", "prisma", "db", "push", "--skip-generate"]);
  await run("npm", ["run", "local:seed-admin"]);
  await run("npm", ["run", "local:seed-personal-work"]);
  console.log("Preview ready. Database and credentials are isolated from production.");
}
if (action === "stop") {
  const row = await inspect();
  if (row?.State.Running) await docker(["stop", container]);
  console.log("Preview database stopped; data preserved. Stop the app with Ctrl+C in its terminal.");
} else if (action === "status") {
  const row = await inspect();
  console.log(`Database: ${row?.State.Running ? "running" : "stopped"}`);
  console.log(`Local app address (when started): http://localhost:${state.appPort}/login`);
} else {
  await setup();
  if (action === "verify") {
    for (const check of ["check:personal-work-boundary", "personal-work:smoke-standalone", "personal-work:smoke-schedule", "personal-work:smoke-calendar"]) await run("npm", ["run", check]);
  }
  if (action === "start") {
    console.log(`Open http://localhost:${state.appPort}/login on the machine running this command. The existing loopback-only login opens the test admin; choose Không gian cá nhân.`);
    console.log("This is the full Watch Shop app. Google OAuth and a Codex worker are not configured. No public URL or tunnel is created.");
    const child = spawn("npm", ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", String(state.appPort)], { cwd: root, env, stdio: "inherit" });
    for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
    child.on("exit", code => { process.exitCode = code || 0; });
  }
}
