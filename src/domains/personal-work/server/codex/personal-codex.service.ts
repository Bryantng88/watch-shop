import {
  codexReadyWhere,
  personalCodexPrompt,
  personalCodexFingerprint,
} from "./codex-schedule";
import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { prisma, type DB } from "@/server/db/client";
import { getAuthUserId } from "@/server/auth/auth-user-id";
import {
  personalWorkOwnerAccessWhere,
  personalWorkScopeWhere,
} from "../personal-work-access";
import { hydrateTaskItemsWithTagsRepo } from "@/domains/task/server/tag/task-tag.repo";
import {
  CODEX_LEASE_SECONDS,
  CODEX_MAX_ATTEMPTS,
  CODEX_REPOSITORY,
  codexExecutionReadiness,
  validateCodexResult,
} from "./codex-config";

const publicRunSelect = {
  id: true,
  status: true,
  attempt: true,
  summary: true,
  errorCode: true,
  resultUrl: true,
  commitSha: true,
  createdAt: true,
  startedAt: true,
  finishedAt: true,
  notBefore: true,
} as const;
export { publicRunSelect };

async function ownerItem(taskItemId: string, userId: string, db: DB = prisma) {
  return db.taskItem.findFirst({
    where: {
      id: taskItemId,
      AND: [personalWorkScopeWhere, personalWorkOwnerAccessWhere(userId)],
    },
    include: { checklists: { orderBy: { sortOrder: "asc" } } },
  });
}
async function hasCodexTag(taskItemId: string, db: DB = prisma) {
  const [item] = await hydrateTaskItemsWithTagsRepo(db, [{ id: taskItemId }]);
  return item.tags.some((tag) => tag.name.trim().toLowerCase() === "codex");
}
async function eligibleRequester(userId: string, db: DB = prisma) {
  return db.user.findFirst({
    where: { id: userId, isActive: true, roles: { some: { name: "ADMIN" } } },
    select: { id: true },
  });
}
function requireReady() {
  if (!codexExecutionReadiness().ready) throw new Error("CODEX_NOT_CONFIGURED");
}

export async function requestPersonalCodexRun(
  taskItemId: string,
  auth: unknown,
  retry = false,
  options: { notBefore?: string | null; db?: DB } = {},
) {
  const db = options.db ?? prisma;
  const notBefore = options.notBefore ? new Date(options.notBefore) : null;
  if (notBefore && !Number.isFinite(notBefore.getTime()))
    throw new Error("CODEX_INVALID_START_TIME");
  requireReady();
  const userId = getAuthUserId(auth);
  if (!userId || !(await eligibleRequester(userId, db)))
    throw new Error("CODEX_ADMIN_REQUIRED");
  const item = await ownerItem(taskItemId, userId, db);
  if (!item || !["TODO", "IN_PROGRESS"].includes(item.status))
    throw new Error("CODEX_OWNER_ACTIVE_TASK_REQUIRED");
  if (item.workTypeId === "EVENT")
    throw new Error("CODEX_EVENT_NOT_EXECUTABLE");
  if (!(await hasCodexTag(taskItemId, db)))
    throw new Error("CODEX_TAG_REQUIRED");
  const prompt = personalCodexPrompt(item);
  if (prompt.length > 24000) throw new Error("CODEX_TASK_TOO_LONG");
  const fingerprint = personalCodexFingerprint(prompt);
  const previous = await db.personalCodexRun.findFirst({
    where: { taskItemId },
    orderBy: { createdAt: "desc" },
  });
  if (
    previous &&
    (["QUEUED", "RUNNING"].includes(previous.status) ||
      (!retry && previous.fingerprint === fingerprint))
  )
    return db.personalCodexRun.findUniqueOrThrow({
      where: { id: previous.id },
      select: publicRunSelect,
    });
  try {
    return await db.personalCodexRun.create({
      data: {
        taskItemId,
        requestedByUserId: userId,
        activeTaskItemId: taskItemId,
        fingerprint,
        prompt,
        repository: CODEX_REPOSITORY,
        notBefore,
      },
      select: publicRunSelect,
    });
  } catch (error) {
    if (
      !(error instanceof Prisma.PrismaClientKnownRequestError) ||
      error.code !== "P2002"
    )
      throw error;
    return db.personalCodexRun.findUniqueOrThrow({
      where: { activeTaskItemId: taskItemId },
      select: publicRunSelect,
    });
  }
}

export async function cancelPersonalCodexRun(runId: string, auth: unknown) {
  const userId = getAuthUserId(auth);
  const run = await prisma.personalCodexRun.findUnique({
    where: { id: runId },
  });
  if (!userId || !run || !(await ownerItem(run.taskItemId, userId)))
    throw new Error("CODEX_OWNER_REQUIRED");
  await prisma.personalCodexRun.updateMany({
    where: { id: runId, status: { in: ["QUEUED", "RUNNING"] } },
    data: {
      status: "CANCELLED",
      activeTaskItemId: null,
      leaseToken: null,
      leaseExpiresAt: null,
      finishedAt: new Date(),
      errorCode: "CANCELLED_BY_OWNER",
    },
  });
}

export async function claimPersonalCodexRun(workerIdInput: string) {
  requireReady();
  const workerId = String(workerIdInput).trim();
  if (!/^[a-zA-Z0-9_.-]{1,80}$/.test(workerId))
    throw new Error("INVALID_WORKER_ID");
  const now = new Date();
  // Never run the same abandoned attempt again concurrently. Expiry is terminal;
  // an owner can explicitly retry after checking the old worker has stopped.
  await prisma.personalCodexRun.updateMany({
    where: { status: "RUNNING", leaseExpiresAt: { lt: now } },
    data: {
      status: "TIMED_OUT",
      activeTaskItemId: null,
      leaseToken: null,
      finishedAt: now,
      errorCode: "LEASE_EXPIRED",
    },
  });
  for (let index = 0; index < 10; index++) {
    const candidate = await prisma.personalCodexRun.findFirst({
      where: codexReadyWhere(now),
      orderBy: { createdAt: "asc" },
    });
    if (!candidate) return null;
    const ownedItem = candidate.requestedByUserId
      ? await ownerItem(candidate.taskItemId, candidate.requestedByUserId)
      : null;
    if (
      !ownedItem ||
      ownedItem.workTypeId === "EVENT" ||
      !["TODO", "IN_PROGRESS"].includes(ownedItem.status) ||
      !candidate.requestedByUserId ||
      !(await eligibleRequester(candidate.requestedByUserId)) ||
      !(await hasCodexTag(candidate.taskItemId))
    ) {
      await prisma.personalCodexRun.updateMany({
        where: { id: candidate.id, status: "QUEUED" },
        data: {
          status: "CANCELLED",
          activeTaskItemId: null,
          finishedAt: now,
          errorCode: "ELIGIBILITY_CHANGED",
        },
      });
      continue;
    }
    if (
      personalCodexFingerprint(personalCodexPrompt(ownedItem)) !==
      candidate.fingerprint
    ) {
      await prisma.personalCodexRun.updateMany({
        where: { id: candidate.id, status: "QUEUED" },
        data: {
          status: "CANCELLED",
          activeTaskItemId: null,
          finishedAt: now,
          errorCode: "TASK_CHANGED",
        },
      });
      continue;
    }
    const leaseToken = randomUUID();
    const changed = await prisma.personalCodexRun.updateMany({
      where: {
        id: candidate.id,
        ...codexReadyWhere(now),
        attempt: { lt: CODEX_MAX_ATTEMPTS },
        taskItem: { status: { in: ["TODO", "IN_PROGRESS"] } },
      },
      data: {
        status: "RUNNING",
        attempt: { increment: 1 },
        leaseToken,
        workerId,
        startedAt: now,
        leaseExpiresAt: new Date(now.getTime() + CODEX_LEASE_SECONDS * 1000),
      },
    });
    if (!changed.count) continue;
    return {
      id: candidate.id,
      taskItemId: candidate.taskItemId,
      prompt: candidate.prompt,
      repository: candidate.repository,
      baseBranch: candidate.baseBranch,
      leaseToken,
      timeoutSeconds: 900,
    };
  }
  return null;
}

export async function heartbeatPersonalCodexRun(
  runId: string,
  leaseToken: string,
) {
  const run = await prisma.personalCodexRun.findFirst({
    where: {
      id: runId,
      leaseToken,
      status: "RUNNING",
      leaseExpiresAt: { gt: new Date() },
    },
  });
  if (!run) return false;
  const item = run.requestedByUserId
    ? await ownerItem(run.taskItemId, run.requestedByUserId)
    : null;
  if (
    !item ||
    item.workTypeId === "EVENT" ||
    !["TODO", "IN_PROGRESS"].includes(item.status) ||
    !run.requestedByUserId ||
    !(await eligibleRequester(run.requestedByUserId)) ||
    !(await hasCodexTag(run.taskItemId)) ||
    personalCodexFingerprint(personalCodexPrompt(item)) !== run.fingerprint
  ) {
    await prisma.personalCodexRun.updateMany({
      where: { id: runId, leaseToken, status: "RUNNING" },
      data: {
        status: "CANCELLED",
        activeTaskItemId: null,
        leaseToken: null,
        finishedAt: new Date(),
        errorCode: "ELIGIBILITY_CHANGED",
      },
    });
    return false;
  }
  const result = await prisma.personalCodexRun.updateMany({
    where: {
      id: runId,
      leaseToken,
      status: "RUNNING",
      leaseExpiresAt: { gt: new Date() },
    },
    data: { leaseExpiresAt: new Date(Date.now() + CODEX_LEASE_SECONDS * 1000) },
  });
  return result.count === 1;
}

export async function finishPersonalCodexRun(input: {
  id: string;
  leaseToken: string;
  status: "SUCCEEDED" | "FAILED" | "TIMED_OUT";
  summary?: string;
  resultUrl?: string | null;
  commitSha?: string | null;
}) {
  if (!["SUCCEEDED", "FAILED", "TIMED_OUT"].includes(input.status))
    throw new Error("INVALID_STATUS");
  const result = validateCodexResult(input);
  if (!(await heartbeatPersonalCodexRun(input.id, input.leaseToken)))
    return false;
  return prisma.$transaction(async (tx) => {
    const run = await tx.personalCodexRun.findFirst({
      where: {
        id: input.id,
        leaseToken: input.leaseToken,
        status: "RUNNING",
        leaseExpiresAt: { gt: new Date() },
      },
    });
    if (!run) return false;
    const changed = await tx.personalCodexRun.updateMany({
      where: {
        id: run.id,
        leaseToken: input.leaseToken,
        status: "RUNNING",
        leaseExpiresAt: { gt: new Date() },
      },
      data: {
        ...result,
        status: input.status,
        activeTaskItemId: null,
        finishedAt: new Date(),
        leaseToken: null,
        leaseExpiresAt: null,
        errorCode:
          input.status === "SUCCEEDED"
            ? null
            : input.status === "TIMED_OUT"
              ? "EXECUTION_TIMEOUT"
              : "EXECUTOR_FAILED",
      },
    });
    if (!changed.count) return false;
    await tx.taskItemActivity.create({
      data: {
        taskItemId: run.taskItemId,
        actorUserId: run.requestedByUserId,
        sourceType: "SYSTEM",
        sourceId: run.id,
        title:
          input.status === "SUCCEEDED"
            ? "Codex đã trả kết quả"
            : "Lượt chạy Codex đã dừng",
        body: [result.summary, result.resultUrl].filter(Boolean).join("\n"),
      },
    });
    // A successful run is a reviewable result, not approval to mark the task done.
    return true;
  });
}
