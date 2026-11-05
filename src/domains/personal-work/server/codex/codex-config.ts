import { createHash, timingSafeEqual } from "node:crypto";

export const CODEX_REPOSITORY = "Bryantng88/watch-shop";
export const CODEX_LEASE_SECONDS = 120;
export const CODEX_MAX_ATTEMPTS = 3;

export function codexExecutionReadiness(env: Readonly<Record<string, string | undefined>> = process.env) {
  if (env.PERSONAL_CODEX_ENABLED !== "1") return { ready: false, reason: "Chưa bật worker Codex trên staging" };
  if (env.PERSONAL_CODEX_ENVIRONMENT !== "staging") return { ready: false, reason: "Codex chỉ được bật cho staging" };
  try {
    const database = new URL(env.DATABASE_URL ?? "");
    const localTest = ["127.0.0.1", "localhost", "[::1]"].includes(database.hostname) && database.pathname === "/personal_codex_test";
    if (database.pathname !== "/watch_shop_storefront_staging" && !localTest) throw new Error("Wrong database");
  } catch { return { ready: false, reason: "Chưa xác nhận database staging cho Codex" }; }
  if ((env.PERSONAL_CODEX_WORKER_TOKEN?.length ?? 0) < 32) return { ready: false, reason: "Chưa cấu hình khóa xác thực worker Codex" };
  return { ready: true, reason: null };
}

export function authenticateCodexWorker(authorization: string | null) {
  const expected = process.env.PERSONAL_CODEX_WORKER_TOKEN ?? "";
  const actual = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!codexExecutionReadiness().ready || !actual || !expected) return false;
  return timingSafeEqual(createHash("sha256").update(expected).digest(), createHash("sha256").update(actual).digest());
}

export function validateCodexResult(input: { resultUrl?: string | null; summary?: string; commitSha?: string | null }) {
  const resultUrl = input.resultUrl?.trim() || null;
  if (resultUrl && !/^https:\/\/github\.com\/Bryantng88\/watch-shop\/pull\/[1-9]\d*$/.test(resultUrl)) throw new Error("INVALID_RESULT_URL");
  const commitSha = input.commitSha?.trim() || null;
  if (commitSha && !/^[0-9a-f]{40}$/.test(commitSha)) throw new Error("INVALID_COMMIT_SHA");
  return { resultUrl, commitSha, summary: String(input.summary ?? "").slice(0, 8000) };
}
