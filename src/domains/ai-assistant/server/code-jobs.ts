import { randomUUID, timingSafeEqual } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma, type Tx } from '@/server/db/client';
import { assistantActor, AssistantError } from './access';
import {
  codeEnabled,
  codeChecks,
  checksPassed,
  gitSha,
  publicCodeJob,
  type CodeJob,
  type CodeDraft,
} from '../code-contract';
export type CodeState = {
  codeDraft?: CodeDraft;
  codeJob?: CodeJob;
  codeJobHistory?: CodeJob[];
  [key: string]: unknown;
};
const json = (s: unknown) =>
  JSON.parse(JSON.stringify(s)) as Prisma.InputJsonValue;
export function codeTokenMatches(token: string | null, release = false) {
  const expected =
    process.env[release ? 'BEN_CODE_RELEASE_TOKEN' : 'BEN_CODE_WORKER_TOKEN'];
  return (
    !!expected &&
    expected !== process.env.PERSONAL_CODEX_WORKER_TOKEN &&
    expected !==
      process.env[
        release ? 'BEN_CODE_WORKER_TOKEN' : 'BEN_CODE_RELEASE_TOKEN'
      ] &&
    expected.length >= 32 &&
    !!token &&
    Buffer.byteLength(token) === Buffer.byteLength(expected) &&
    timingSafeEqual(Buffer.from(token), Buffer.from(expected))
  );
}
async function transaction<T>(fn: (tx: Tx) => Promise<T>) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await prisma.$transaction(fn, {
        isolationLevel: 'Serializable',
        timeout: 15000,
      });
    } catch (e) {
      if (
        attempt < 3 &&
        e instanceof Prisma.PrismaClientKnownRequestError &&
        (e.code === 'P2034' ||
          (e.code === 'P2010' &&
            ['40001', '40P01'].includes(String(e.meta?.code))))
      )
        continue;
      throw e;
    }
  }
}
async function row(tx: Tx, id: string, userId?: string) {
  await tx.$queryRaw`SELECT "id" FROM "CustomerAssistantConversation" WHERE "id"=${id} FOR UPDATE`;
  const r = await tx.customerAssistantConversation.findFirst({
    where: { id, ...(userId ? { ownerId: userId } : {}) },
  });
  if (!r) throw new AssistantError('Không có quyền truy cập.', 403);
  return r;
}
async function authority(tx: Tx, userId: string) {
  const actor = await assistantActor(tx, userId);
  if (!codeEnabled(actor))
    throw new AssistantError(
      'Luồng sửa code chưa được bật cho tài khoản Long.',
      403
    );
  return actor;
}
async function save(tx: Tx, id: string, s: CodeState) {
  await tx.customerAssistantConversation.update({
    where: { id },
    data: { state: json(s) },
  });
}
export async function codeCommand(
  userId: string,
  id: string,
  action: 'approve' | 'cancel' | 'merge' | 'deploy',
  input: { revision?: number; jobId?: string; sha?: string }
) {
  return transaction(async (tx) => {
    await authority(tx, userId);
    const r = await row(tx, id, userId),
      s = r.state as CodeState,
      j = s.codeJob;
    if (action === 'approve') {
      if (j && j.revision === input.revision) return publicCodeJob(j);
      const d = s.codeDraft;
      if (!d || d.revision !== r.revision || d.revision !== input.revision)
        throw new AssistantError('Bản đề xuất đã đổi. Hãy xem lại.', 409);
      if (
        d.baseSha !== process.env.BEN_REPOSITORY_COMMIT ||
        d.baseRef !== process.env.BEN_CODE_BASE_REF ||
        d.prBase !== (process.env.BEN_CODE_PR_BASE || 'main')
      )
        throw new AssistantError('Nền code đã đổi; cần phân tích lại.', 409);
      if (
        j &&
        [
          'QUEUED',
          'RUNNING',
          'MERGE_QUEUED',
          'MERGING',
          'DEPLOY_QUEUED',
          'DEPLOYING',
          'RECONCILE_REQUIRED',
        ].includes(j.status)
      )
        throw new AssistantError('Yêu cầu trước đang chạy.', 409);
      if (j) s.codeJobHistory = [...(s.codeJobHistory || []), j];
      const job: CodeJob = {
        ...d,
        id: randomUUID(),
        status: 'QUEUED',
        branch: '',
        approvedAt: new Date().toISOString(),
      };
      job.branch = `codex/ben-code/${job.id}`;
      s.codeJob = job;
      delete s.codeDraft;
      await save(tx, id, s);
      return publicCodeJob(job);
    }
    if (!j || j.id !== input.jobId)
      throw new AssistantError('Không tìm thấy lượt chạy.', 409);
    if (action === 'cancel') {
      if (['MERGING', 'DEPLOYING'].includes(j.status))
        throw new AssistantError(
          'Thao tác đã bắt đầu; cần đối chiếu kết quả thay vì hứa hoàn tác.',
          409
        );
      if (
        ['QUEUED', 'RUNNING', 'MERGE_QUEUED', 'DEPLOY_QUEUED'].includes(
          j.status
        )
      ) {
        j.status =
          j.status === 'MERGE_QUEUED'
            ? 'PR_OPEN'
            : j.status === 'DEPLOY_QUEUED'
              ? j.mergedSha ? 'MERGED' : 'PR_OPEN'
              : 'CANCELLED';
        delete j.leaseToken;
        delete j.leaseExpiresAt;
        await save(tx, id, s);
      }
      return publicCodeJob(j);
    }
    if (!input.sha || !gitSha.safeParse(input.sha).success)
      throw new AssistantError('Cần commit cụ thể.');
    if (action === 'merge') {
      if (j.status === 'MERGED' && j.headSha === input.sha)
        return publicCodeJob(j);
      if (j.status === 'MERGE_QUEUED' && j.headSha === input.sha)
        return publicCodeJob(j);
      if (
        j.status !== 'PR_OPEN' ||
        j.headSha !== input.sha ||
        !j.prNumber ||
        !checksPassed(j.checks || [])
      )
        throw new AssistantError('PR/commit hoặc kiểm tra chưa hợp lệ.', 409);
      if (process.env.BEN_CODE_MERGE_ENABLED !== '1')
        throw new AssistantError('Merge chưa được bật.', 503);
      j.status = 'MERGE_QUEUED';
      j.mergeApprovedAt = new Date().toISOString();
    } else {
      if (j.status === 'DEPLOYED' && j.releaseSha === input.sha)
        return publicCodeJob(j);
      if (j.status === 'DEPLOY_QUEUED' && j.releaseSha === input.sha)
        return publicCodeJob(j);
      if (
        !['PR_OPEN', 'MERGED', 'DEPLOY_FAILED', 'DEPLOYED'].includes(
          j.status
        ) ||
        input.sha !== (j.mergedSha || j.headSha) ||
        !checksPassed(j.checks || [])
      )
        throw new AssistantError('Commit staging chưa hợp lệ.', 409);
      if (
        !process.env.BEN_CODE_RELEASE_TOKEN ||
        process.env.BEN_CODE_RELEASE_TOKEN.length < 32 ||
        process.env.BEN_CODE_RELEASE_ENABLED !== '1' ||
        !process.env.BEN_CODE_RELEASE_HANDLER_SHA256?.match(/^[a-f0-9]{64}$/)
      )
        throw new AssistantError('Runner staging chưa được cấu hình.', 503);
      j.releaseSha = input.sha;
      j.status = 'DEPLOY_QUEUED';
      j.deployApprovedAt = new Date().toISOString();
    }
    delete j.errorCode;
    delete j.leaseToken;
    delete j.leaseExpiresAt;
    await save(tx, id, s);
    return publicCodeJob(j);
  });
}
export async function codeWorker(
  operation: string,
  body: Record<string, unknown>,
  release = false
) {
  return transaction(async (tx) => {
    if (operation === 'claim') {
      if (release && process.env.BEN_CODE_RELEASE_ENABLED !== '1')
        return { run: null };
      const expired = await tx.customerAssistantConversation.findMany({
        where: {
          OR: ['RUNNING', 'MERGING', 'DEPLOYING'].map((status) => ({
            state: { path: ['codeJob', 'status'], equals: status },
          })),
        },
        take: 20,
      });
      for (const old of expired) {
        const locked = await row(tx, old.id),
          state = locked.state as CodeState,
          job = state.codeJob;
        if (
          job?.leaseExpiresAt &&
          Date.parse(job.leaseExpiresAt) < Date.now()
        ) {
          job.status =
            job.leaseAction === 'code' ? 'FAILED' : 'RECONCILE_REQUIRED';
          job.errorCode = 'LEASE_EXPIRED';
          delete job.leaseToken;
          delete job.leaseExpiresAt;
          await save(tx, locked.id, state);
        }
      }
      if (release) {
        await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext('ben-staging-release'))::text`;
        const busy = await tx.customerAssistantConversation.findFirst({
          where: {
            OR: [
              { state: { path: ['codeJob', 'status'], equals: 'DEPLOYING' } },
              {
                AND: [
                  {
                    state: {
                      path: ['codeJob', 'status'],
                      equals: 'RECONCILE_REQUIRED',
                    },
                  },
                  {
                    state: {
                      path: ['codeJob', 'leaseAction'],
                      equals: 'release',
                    },
                  },
                ],
              },
            ],
          },
        });
        if (busy) return { run: null };
      }
      const statuses = release ? ['DEPLOY_QUEUED'] : ['QUEUED', 'MERGE_QUEUED'];
      const candidates = await tx.customerAssistantConversation.findMany({
        where: {
          OR: statuses.map((status) => ({
            state: { path: ['codeJob', 'status'], equals: status },
          })),
        },
        take: 10,
        orderBy: { updatedAt: 'asc' },
      });
      for (const candidate of candidates) {
        const r = await row(tx, candidate.id),
          s = r.state as CodeState,
          j = s.codeJob;
        if (!j || !statuses.includes(j.status)) continue;
        try {
          await authority(tx, r.ownerId);
        } catch {
          j.status = 'CANCELLED';
          await save(tx, r.id, s);
          continue;
        }
        const action = release
          ? 'release'
          : j.status === 'QUEUED'
            ? 'code'
            : 'merge';
        if (action === 'merge' && process.env.BEN_CODE_MERGE_ENABLED !== '1') {
          j.status = 'PR_OPEN';
          j.errorCode = 'MERGE_DISABLED';
          await save(tx, r.id, s);
          continue;
        }
        j.status = release
          ? 'DEPLOYING'
          : action === 'code'
            ? 'RUNNING'
            : 'MERGING';
        j.leaseAction = action;
        j.leaseToken = randomUUID();
        j.leaseExpiresAt = new Date(Date.now() + 120000).toISOString();
        await save(tx, r.id, s);
        return {
          run: {
            ...j,
            conversationId: r.id,
            handlerSha256: release
              ? process.env.BEN_CODE_RELEASE_HANDLER_SHA256
              : undefined,
          },
        };
      }
      return { run: null };
    }
    const id = String(body.conversationId || ''),
      token = String(body.leaseToken || '');
    const r = await row(tx, id),
      s = r.state as CodeState,
      j = s.codeJob;
    if (
      !j ||
      j.id !== body.id ||
      j.leaseToken !== token ||
      !j.leaseExpiresAt ||
      Date.parse(j.leaseExpiresAt) < Date.now() ||
      !['RUNNING', 'MERGING', 'DEPLOYING'].includes(j.status) ||
      (release ? j.leaseAction !== 'release' : j.leaseAction === 'release')
    )
      throw new AssistantError('Lượt chạy hết hiệu lực.', 409);
    try {
      await authority(tx, r.ownerId);
    } catch {
      j.status = 'CANCELLED';
      delete j.leaseToken;
      delete j.leaseExpiresAt;
      await save(tx, id, s);
      return { active: false, accepted: false };
    }
    if (operation === 'heartbeat') {
      j.leaseExpiresAt = new Date(Date.now() + 120000).toISOString();
      await save(tx, id, s);
      return { active: true };
    }
    if (operation !== 'finish') throw new AssistantError('Lệnh không hợp lệ.');
    if (body.failed === true) {
      j.status =
        body.uncertain === true
          ? 'RECONCILE_REQUIRED'
          : release
            ? 'DEPLOY_FAILED'
            : j.leaseAction === 'merge'
              ? 'PR_OPEN'
              : 'FAILED';
      if (body.checks) j.checks = codeChecks.parse(body.checks);
      j.errorCode =
        typeof body.errorCode === 'string' &&
        /^[A-Z_0-9]{1,60}$/.test(body.errorCode)
          ? body.errorCode
          : 'EXECUTOR_FAILED';
    } else if (j.leaseAction === 'code') {
      const checks = codeChecks.parse(body.checks);
      if (
        !checksPassed(checks) ||
        !gitSha.safeParse(body.headSha).success ||
        !gitSha.safeParse(body.prBaseSha).success ||
        !Number.isSafeInteger(body.prNumber) ||
        Number(body.prNumber) < 1
      )
        throw new AssistantError('Kết quả code chưa hợp lệ.');
      j.checks = checks;
      j.headSha = String(body.headSha);
      j.prBaseSha = String(body.prBaseSha);
      j.prNumber = Number(body.prNumber);
      j.resultUrl = `https://github.com/Bryantng88/watch-shop/pull/${j.prNumber}`;
      j.status = 'PR_OPEN';
      j.summary =
        typeof body.summary === 'string'
          ? body.summary.slice(0, 2000)
          : 'Đã mở draft PR.';
    } else if (j.leaseAction === 'merge') {
      if (
        !gitSha.safeParse(body.mergedSha).success ||
        body.headSha !== j.headSha
      )
        throw new AssistantError('Commit merge không hợp lệ.');
      j.mergedSha = String(body.mergedSha);
      j.status = 'MERGED';
    } else {
      if (body.deployedSha !== j.releaseSha || body.healthVerified !== true)
        throw new AssistantError('Chưa xác nhận được staging.');
      j.status = 'DEPLOYED';
    }
    delete j.leaseToken;
    delete j.leaseExpiresAt;
    await save(tx, id, s);
    return { accepted: true };
  });
}
