import { z } from 'zod';
import { canReadRepository } from './repository-access';
export const codePlanSchema = z
  .object({
    title: z.string().trim().min(5).max(160),
    request: z.string().trim().min(20).max(4000),
  })
  .strict()
  .refine(
    (p) =>
      !/-----BEGIN [A-Z ]*PRIVATE KEY-----|\b(?:gh[pousr]_[a-zA-Z0-9]{20,}|github_pat_[a-zA-Z0-9_]{20,}|sk-[a-zA-Z0-9_-]{20,})/.test(
        p.title + '\n' + p.request
      ),
    'Không đưa credential vào yêu cầu code.'
  );
export type CodePlan = z.infer<typeof codePlanSchema>;
export type CodeDraft = CodePlan & {
  revision: number;
  baseSha: string;
  baseRef: string;
  prBase: string;
};
export const gitSha = z.string().regex(/^[a-f0-9]{40}$/);
export const gitRef = z
  .string()
  .regex(/^[a-zA-Z0-9][a-zA-Z0-9/_-]{0,119}$/)
  .refine((s) => !s.endsWith('/') && !s.includes('//'));
export function codeEnabled(
  actor: { id?: string; admin: boolean },
  env: Readonly<Record<string, string | undefined>> = process.env
) {
  return (
    canReadRepository(actor, env) &&
    env.BEN_CODE_ENABLED === '1' &&
    (env.BEN_CODE_WORKER_TOKEN?.length || 0) >= 32 &&
    env.BEN_CODE_WORKER_TOKEN !== env.PERSONAL_CODEX_WORKER_TOKEN &&
    env.BEN_CODE_WORKER_TOKEN !== env.BEN_CODE_RELEASE_TOKEN &&
    gitRef.safeParse(env.BEN_CODE_BASE_REF).success &&
    gitRef.safeParse(env.BEN_CODE_PR_BASE || 'main').success
  );
}
export type CodeCheck = {
  name: string;
  status: 'PASSED' | 'FAILED' | 'SKIPPED';
};
export const codeChecks = z
  .array(
    z
      .object({
        name: z.enum([
          'install',
          'generate',
          'typecheck',
          'lint',
          'tests',
          'build',
        ]),
        status: z.enum(['PASSED', 'FAILED', 'SKIPPED']),
      })
      .strict()
  )
  .max(6);
export function checksPassed(checks: CodeCheck[]) {
  return (
    ['install', 'generate', 'typecheck', 'build'].every(
      (name) =>
        checks.filter((c) => c.name === name && c.status === 'PASSED')
          .length === 1
    ) &&
    ['lint', 'tests'].every(
      (name) =>
        checks.filter(
          (c) => c.name === name && ['PASSED', 'SKIPPED'].includes(c.status)
        ).length === 1
    ) &&
    new Set(checks.map((c) => c.name)).size === checks.length
  );
}
export type CodeJob = CodeDraft & {
  id: string;
  status: string;
  branch: string;
  leaseToken?: string;
  leaseExpiresAt?: string;
  approvedAt: string;
  mergeApprovedAt?: string;
  deployApprovedAt?: string;
  checks?: CodeCheck[];
  resultUrl?: string;
  prNumber?: number;
  headSha?: string;
  prBaseSha?: string;
  mergedSha?: string;
  releaseSha?: string;
  leaseAction?: 'code' | 'merge' | 'release';
  errorCode?: string;
  summary?: string;
};
export function publicCodeJob(job: CodeJob) {
  const clean = { ...job };
  delete clean.leaseToken;
  delete clean.leaseExpiresAt;
  return clean;
}
