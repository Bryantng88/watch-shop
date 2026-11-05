import assert from "node:assert/strict";
import { test } from "node:test";
import { codexExecutionReadiness, validateCodexResult } from "./codex-config";
import { googleCalendarReadiness } from "../google-calendar-config";
const staging = { PERSONAL_CODEX_ENABLED: "1", PERSONAL_CODEX_ENVIRONMENT: "staging", PERSONAL_CODEX_WORKER_TOKEN: "synthetic-worker-token-for-tests-only-123456", DATABASE_URL: "postgresql://test@staging-db/watch_shop_storefront_staging" };

test("Codex fails closed outside the explicitly configured staging database", () => {
  assert.ok(codexExecutionReadiness(staging).ready);
  assert.equal(codexExecutionReadiness({ ...staging, PERSONAL_CODEX_ENVIRONMENT: "production" }).ready, false);
  assert.equal(codexExecutionReadiness({ ...staging, DATABASE_URL: "postgresql://test@db/watch_shop_production" }).ready, false);
  assert.equal(codexExecutionReadiness({ ...staging, PERSONAL_CODEX_WORKER_TOKEN: "short" }).ready, false);
  assert.equal(codexExecutionReadiness({ ...staging, PERSONAL_CODEX_ENABLED: "0" }).ready, false);
  assert.ok(codexExecutionReadiness({ ...staging, DATABASE_URL: "postgresql://test@127.0.0.1/personal_codex_test" }).ready);
  assert.equal(codexExecutionReadiness({ ...staging, DATABASE_URL: "postgresql://test@remote/personal_codex_test" }).ready, false);
});
test("results are confined to draft PRs in the configured repository", () => {
  assert.equal(validateCodexResult({ resultUrl: "https://github.com/Bryantng88/watch-shop/pull/123", commitSha: "a".repeat(40) }).commitSha, "a".repeat(40));
  for (const resultUrl of ["javascript:alert(1)", "https://github.com/other/project/pull/1", "https://github.com/Bryantng88/watch-shop/actions/1", "https://github.com/Bryantng88/watch-shop/pull/1?token=secret"]) assert.throws(() => validateCodexResult({ resultUrl }));
  assert.throws(() => validateCodexResult({ commitSha: "main" }));
});
test("Google OAuth supports a real HTTPS staging origin or a local tunnel, never an HTTP LAN callback", () => {
  const oauth = { GOOGLE_CALENDAR_CLIENT_ID: "synthetic-id", GOOGLE_CALENDAR_CLIENT_SECRET: "synthetic-secret", AUTH_SECRET: "synthetic-state-secret", GOOGLE_CALENDAR_TOKEN_KEY: "synthetic-encryption-key", APP_URL: "https://admin-staging.example.com" };
  assert.equal(googleCalendarReadiness(oauth).redirectUri, "https://admin-staging.example.com/api/admin/personal-work/google/callback");
  assert.ok(googleCalendarReadiness({ ...oauth, APP_URL: "http://localhost:18089" }).ready);
  assert.equal(googleCalendarReadiness({ ...oauth, APP_URL: "http://192.168.1.253:18089" }).ready, false);
  assert.equal(googleCalendarReadiness({ ...oauth, GOOGLE_CALENDAR_REDIRECT_URI: "https://other.example.com/api/admin/personal-work/google/callback" }).ready, false);
  assert.equal(googleCalendarReadiness({ ...oauth, GOOGLE_CALENDAR_CLIENT_SECRET: "" }).ready, false);
});
