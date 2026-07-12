import { TaskKind, TaskPriority, TaskSource, TaskStatus } from "@prisma/client";
import { dbOrTx, prisma, withDbTransaction, type DB } from "@/server/db/client";
import type {
  BlueprintPublishedVersion,
} from "./blueprint-published-version.types";
import {
  listBlueprintPublishedVersionRecords,
  getBlueprintPublishedVersionRecord,
  type BlueprintPublishedVersionStoreOptions,
} from "./blueprint-published-version.store";
import type {
  OperationWorkspaceCreationPlanItem,
} from "@/domains/blueprint/shared/operation-space-plan";

export type PublishedBlueprintSpaceCreationResult = {
  ok: true;
  taskId: string;
  created: boolean;
  createdWorkspaceCount: number;
  skippedWorkspaceCount: number;
  deferredWorkspaceCount: number;
  manualWorkspaceCount: number;
  version: {
    id: string;
    blueprintKey: string;
    blueprintName: string;
    version: number;
  };
};

export type PublishedBlueprintSpaceCreationFailure = {
  ok: false;
  error: string;
};

export type PublishedBlueprintSpaceCreationResponse =
  | PublishedBlueprintSpaceCreationResult
  | PublishedBlueprintSpaceCreationFailure;

export type DeferredPublishedBlueprintWorkspaceResult = {
  taskId: string;
  taskItemId: string;
  created: boolean;
  publishedVersion: BlueprintPublishedVersion;
  workspacePlan: OperationWorkspaceCreationPlanItem;
  workspaceRole: string;
};

function versionMarker(versionId: string) {
  return `publishedBlueprintVersionId: ${versionId}`;
}

function spaceDescription(version: BlueprintPublishedVersion) {
  return [
    `Space created from published Blueprint ${version.blueprintName} v${version.version}.`,
    versionMarker(version.id),
    `blueprintKey: ${version.blueprintKey}`,
    `operationKey: ${version.operationKey}`,
    `snapshotMode: ${version.snapshotMode}`,
  ].join("\n");
}

function workspaceNote(input: {
  version: BlueprintPublishedVersion;
  snapshotNote: string;
}) {
  return [
    input.snapshotNote,
    `publishedBlueprintVersionId: ${input.version.id}`,
    `publishedBlueprintVersion: ${input.version.version}`,
  ].join("\n");
}

function deferredWorkspaceNote(input: {
  version: BlueprintPublishedVersion;
  snapshotNote: string;
  targetType: string;
  targetId: string;
  eventKey: string;
}) {
  return [
    workspaceNote({
      version: input.version,
      snapshotNote: input.snapshotNote,
    }),
    `deferredWorkspaceTargetType: ${input.targetType}`,
    `deferredWorkspaceTargetId: ${input.targetId}`,
    `deferredWorkspaceEventKey: ${input.eventKey}`,
  ].join("\n");
}

async function findExistingSpace(db: DB, versionId: string) {
  const client = dbOrTx(db);

  return client.task.findFirst({
    where: {
      description: {
        contains: versionMarker(versionId),
      },
      status: {
        not: TaskStatus.CANCELLED,
      },
    },
    select: {
      id: true,
      taskItems: {
        select: { id: true },
      },
    },
  });
}

export async function createSpaceFromPublishedBlueprintVersion(input: {
  publishedVersionId: string;
  actorUserId?: string | null;
  store?: BlueprintPublishedVersionStoreOptions;
  db?: DB;
}): Promise<PublishedBlueprintSpaceCreationResponse> {
  const version = await getBlueprintPublishedVersionRecord(
    input.publishedVersionId,
    input.store,
  );

  if (!version) {
    return { ok: false, error: "Published Blueprint version was not found." };
  }

  if (!version.creationPlan.ok) {
    return { ok: false, error: "Published Blueprint creation plan is blocked." };
  }

  return withDbTransaction(input.db ?? prisma, async (tx) => {
    const existing = await findExistingSpace(tx, version.id);
    if (existing) {
      return {
        ok: true,
        taskId: existing.id,
        created: false,
        createdWorkspaceCount: 0,
        skippedWorkspaceCount: existing.taskItems.length,
        deferredWorkspaceCount: version.creationPlan.deferredWorkspaces.length,
        manualWorkspaceCount: version.creationPlan.manualWorkspaces.length,
        version: {
          id: version.id,
          blueprintKey: version.blueprintKey,
          blueprintName: version.blueprintName,
          version: version.version,
        },
      };
    }

    const task = await tx.task.create({
      data: {
        title: version.creationPlan.spaceTitle,
        description: spaceDescription(version),
        source: TaskSource.MANUAL,
        kind: TaskKind.FREE,
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
        createdByUserId: input.actorUserId ?? null,
        assignedToUserId: input.actorUserId ?? null,
      },
      select: { id: true },
    });

    let sortOrder = 0;
    for (const workspace of version.creationPlan.initialWorkspaces) {
      await tx.taskItem.create({
        data: {
          taskId: task.id,
          title: workspace.title,
          note: workspaceNote({
            version,
            snapshotNote: workspace.snapshotNote,
          }),
          status: TaskStatus.TODO,
          priority: TaskPriority.MEDIUM,
          assignedToUserId: null,
          sortOrder,
        },
      });
      sortOrder += 1;
    }

    return {
      ok: true,
      taskId: task.id,
      created: true,
      createdWorkspaceCount: version.creationPlan.initialWorkspaces.length,
      skippedWorkspaceCount: 0,
      deferredWorkspaceCount: version.creationPlan.deferredWorkspaces.length,
      manualWorkspaceCount: version.creationPlan.manualWorkspaces.length,
      version: {
        id: version.id,
        blueprintKey: version.blueprintKey,
        blueprintName: version.blueprintName,
        version: version.version,
      },
    };
  });
}

export async function ensureDeferredWorkspaceFromPublishedBlueprintEvent(input: {
  db?: DB;
  eventKey: string;
  targetType: string;
  targetId: string;
  workTypeKey?: string | null;
  store?: BlueprintPublishedVersionStoreOptions;
}): Promise<DeferredPublishedBlueprintWorkspaceResult | null> {
  const eventKey = String(input.eventKey ?? "").trim().toLowerCase();
  const targetType = String(input.targetType ?? "").trim().toUpperCase();
  const targetId = String(input.targetId ?? "").trim();
  const workTypeKey = String(input.workTypeKey ?? "").trim().toLowerCase();

  if (!eventKey || !targetType || !targetId) return null;

  const versions = await listBlueprintPublishedVersionRecords(input.store);
  const client = dbOrTx(input.db ?? prisma);

  for (const version of versions) {
    const operationKey = String(version.operation.key ?? "").trim().toLowerCase();
    if (workTypeKey && operationKey !== workTypeKey) continue;

    const eventRoute = version.operation.eventRoutes.find(
      (route) =>
        route.eventKey.toLowerCase() === eventKey &&
        route.targetType.toUpperCase() === targetType,
    );
    if (!eventRoute) continue;

    const role = version.operation.workspaceRoles.find(
      (workspaceRole) => workspaceRole.key === eventRoute.workspaceRole,
    );
    if (role?.cardinality !== "ONE_PER_BUSINESS_OBJECT") continue;

    const workspacePlan = version.creationPlan.deferredWorkspaces.find(
      (item) => item.workspaceRole === role.key,
    );
    if (!workspacePlan) continue;

    const space = await client.task.findFirst({
      where: {
        description: { contains: versionMarker(version.id) },
        status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
      },
      select: {
        id: true,
      },
      orderBy: { createdAt: "asc" },
    });
    if (!space) continue;

    const existingBinding = await client.taskExecution.findFirst({
      where: {
        taskId: space.id,
        targetType,
        targetId,
        actionType: { not: "CANCELLED" },
        taskItemId: { not: null },
      },
      select: {
        taskItemId: true,
      },
      orderBy: { createdAt: "desc" },
    });
    if (existingBinding?.taskItemId) {
      return {
        taskId: space.id,
        taskItemId: existingBinding.taskItemId,
        created: false,
        publishedVersion: version,
        workspacePlan,
        workspaceRole: role.key,
      };
    }

    const existingWorkspace = await client.taskItem.findFirst({
      where: {
        taskId: space.id,
        note: {
          contains: `deferredWorkspaceTargetId: ${targetId}`,
        },
      },
      select: {
        id: true,
      },
      orderBy: { createdAt: "desc" },
    });
    if (existingWorkspace) {
      return {
        taskId: space.id,
        taskItemId: existingWorkspace.id,
        created: false,
        publishedVersion: version,
        workspacePlan,
        workspaceRole: role.key,
      };
    }

    const taskItem = await client.taskItem.create({
      data: {
        taskId: space.id,
        title: `${workspacePlan.label} - ${targetId.slice(0, 8)}`,
        note: deferredWorkspaceNote({
          version,
          snapshotNote: workspacePlan.snapshotNote,
          targetType,
          targetId,
          eventKey,
        }),
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        assignedToUserId: null,
      },
      select: {
        id: true,
      },
    });

    return {
      taskId: space.id,
      taskItemId: taskItem.id,
      created: true,
      publishedVersion: version,
      workspacePlan,
      workspaceRole: role.key,
    };
  }

  return null;
}
