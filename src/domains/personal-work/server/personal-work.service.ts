import {checklistMomentLabel, checklistScheduleRange, validateChecklistSchedule} from "../shared/checklist-schedule";
import { personalWorkTransition } from "../shared/personal-work-lifecycle";
import { isContinuousWork, assertContinuousSchedule, assertContinuousUpdate } from "../shared/continuous-work";
import { runBusinessEventTransaction } from "@/domains/event/server/business-event-transaction";
import type { RecordedBusinessEvent } from "@/domains/event/server/business-event.service";
import { recordPersonalWorkCreated, recordPersonalChecklistCreated } from "./personal-work-events";
import { hydratePersonalWorkObjects } from "./personal-work-objects";
import { mediaChecklistContext, mediaDayToday } from "../shared/media-daily";
import {checklistOnlyWork} from "../shared/checklist-share-projection";
import { queueWorkNotification, queuePersonalChange } from "@/domains/notification/server/work-push.service";
import { workRoute, newShareRecipients } from "@/domains/notification/server/work-push-policy";
import {isPersonalEvent} from "../shared/personal-event";
import { publicRunSelect } from "./codex/personal-codex.service";
import { codexExecutionReadiness } from "./codex/codex-config";
import { googleCalendarReadiness } from "./google-calendar-config";
import {
  AppTagTargetType,
  PersonalTaskShareAccess,
  TaskStatus,
  TaskProgressMode,
  Prisma,
  type TaskPriority,
} from "@prisma/client";
import { prisma, withDbTransaction, type DB } from "@/server/db/client";
import { getAuthUserId } from "@/server/auth/auth-user-id";
import { hydrateTaskItemsWithTagsRepo, setTargetTagsRepo } from "@/domains/task/server/tag/task-tag.repo";
import { personalWorkScopeWhere, personalWorkListAccessWhere, isPersonalWorkOwner, personalWorkTagOwner } from "./personal-work-access";
import { isGoogleCalendarConfigured } from "./google-calendar.service";
import { reconcilePersonalWorkBindings } from "./personal-work-bindings";
import { validatePersonalSchedule } from "../shared/personal-work-schedule";
import { categoryFromRow, listPersonalCategories, resolvePersonalCategory, defaultPersonalCategories, mergePersonalCategories, canManageDefaultCategories } from "./personal-work-categories.service";
import {
  PERSONAL_WORK_DOMAINS,
  PERSONAL_WORK_TYPES,
  type PersonalWorkItem,
  type PersonalWorkDomain,
  type PersonalWorkPageData,
  type PersonalWorkTarget,
  type PersonalWorkTargetType,
} from "../shared/personal-work.types";

const domainKeys = new Set<string>(PERSONAL_WORK_DOMAINS.map((item) => item.key));

type PersonalWorkInput = {
  reminderMinutes?: number | null;
  title: string;
  note?: string | null;
  dueAt?: string | null;
  scheduledEndAt?: string | null;
  estimatedDays?: number;
  priority?: TaskPriority;
  domain?: PersonalWorkDomain;
  categoryKey?: string;
  workType?: string | null;
  targets?: PersonalWorkTarget[];
  tags?: string[];
};

type ShareInput = { userId: string; accessLevel: PersonalTaskShareAccess };

export async function assertPersonalWorkAccess(
  taskItemId: string,
  auth: unknown,
  required: "VIEW" | "EDIT" | "OWNER" = "VIEW",
  db: DB = prisma,
  allowCancelled = false,
) {
  const userId = getAuthUserId(auth);
  if (!userId) throw Object.assign(new Error("Không xác định được người dùng"), { status: 403 });
  const item = await db.taskItem.findFirst({
    where: { id: taskItemId, ...personalWorkScopeWhere },
    select: {
      id: true,
      taskId: true,
      personalOwnerUserId: true,
      status: true,
      progressMode: true,
      startedAt: true,
      personalCategoryId: true,
      checklistLockedAt: true,
      workTypeId: true,
      dueAt: true,
      scheduledEndAt: true,
      estimatedDays: true,
      task: { select: { kind: true, createdByUserId: true, assignedToUserId: true } },
      personalShares: { where: { userId }, select: { accessLevel: true }, take: 1 },
    },
  });
  if (!item) throw Object.assign(new Error("Không tìm thấy công việc cá nhân"), { status: 403 });
  const owned = isPersonalWorkOwner(item, userId);
  const sharedAccess = item.personalShares[0]?.accessLevel;
  if (required === "OWNER" && !owned) throw Object.assign(new Error("Chỉ chủ sở hữu mới có thể thực hiện thao tác này"), { status: 403 });
  if (required === "EDIT" && !owned && sharedAccess !== PersonalTaskShareAccess.EDITOR)
    throw Object.assign(new Error("Bạn chỉ có quyền xem công việc này"), { status: 403 });
  if (required === "VIEW" && !owned && !sharedAccess) throw Object.assign(new Error("Bạn không có quyền truy cập công việc này"), { status: 403 });
  if(required!=="VIEW"&&item.status==="CANCELLED"&&!allowCancelled)throw new Error("Công việc đã hủy chỉ được xem; hãy mở lại trước khi chỉnh sửa.");
  return {
    ...item,
    userId,
    access: owned
      ? ("OWNER" as const)
      : sharedAccess === PersonalTaskShareAccess.EDITOR
        ? ("EDITOR" as const)
        : ("VIEWER" as const),
  };
}

function normalizeWorkType(value: unknown, domain: PersonalWorkDomain) {
  const key = String(value || "")
    .trim()
    .toUpperCase();
  if (key === "EVENT" || isContinuousWork(key)) return key;
  return PERSONAL_WORK_TYPES[domain].some(item => item.key === key) ? key : null;
}

function bindingMetadata(target: PersonalWorkTarget): Prisma.InputJsonValue {
  return {
    source: "PERSONAL_WORK",
    targetLabel: target.label,
    targetSecondary: target.secondary,
    targetHref: target.href,
  };
}

function targetFromExecution(execution: {
  targetType: string;
  targetId: string;
  metadataJson: Prisma.JsonValue | null;
}): PersonalWorkTarget | null {
  const metadata =
    execution.metadataJson && typeof execution.metadataJson === "object" && !Array.isArray(execution.metadataJson)
      ? (execution.metadataJson as Prisma.JsonObject)
      : null;
  if (metadata?.source !== "PERSONAL_WORK") return null;
  return {
    type: execution.targetType as PersonalWorkTargetType,
    id: execution.targetId,
    label: String(metadata.targetLabel || execution.targetId),
    secondary: metadata.targetSecondary ? String(metadata.targetSecondary) : null,
    href: String(metadata.targetHref || "#"),
  };
}

const allowedTargets: Record<PersonalWorkDomain, PersonalWorkTargetType[]> = {
  WATCHSHOP: [],
  CODEX_WORK: [],
  GENERAL: [],
  WORK: [],
  MEDIA: ["WATCH"],
  TECHNICAL: ["WATCH", "SERVICE_REQUEST"],
  SALES: ["WATCH", "PURCHASE_REQUEST"],
  ORDER: ["ORDER"],
  ACQUISITION: ["ACQUISITION"],
};

async function resolvePersonalWorkTarget(
  domain: PersonalWorkDomain,
  target: PersonalWorkTarget | null | undefined,
): Promise<PersonalWorkTarget | null> {
  if (!target) return null;
  if (!allowedTargets[domain].includes(target.type)) throw new Error("Đối tượng liên kết không phù hợp với nghiệp vụ");
  const id = String(target.id || "").trim();
  if (!id) throw new Error("Thiếu đối tượng nghiệp vụ cần liên kết");

  if (target.type === "WATCH") {
    const row = await prisma.watch.findUnique({
      where: { id },
      select: { id: true, productId: true, product: { select: { title: true, sku: true, primaryImageUrl: true, productImage: { where: { role: "INLINE" }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], take: 1, select: { fileKey: true } } } } },
    });
    if (!row) throw new Error("Không tìm thấy Watch đã chọn");
    return {
      type: "WATCH",
      id: row.id,
      label: row.product.title,
      secondary: row.product.sku,
      imageUrl: row.product.productImage[0]?.fileKey || row.product.primaryImageUrl,
      href: `/admin/watches/${row.productId}`,
    };
  }
  if (target.type === "ORDER") {
    const row = await prisma.order.findUnique({
      where: { id },
      select: { id: true, refNo: true, customerName: true, shipPhone: true },
    });
    if (!row) throw new Error("Không tìm thấy đơn hàng đã chọn");
    return {
      type: "ORDER",
      id: row.id,
      label: row.refNo || row.customerName || "Đơn hàng",
      secondary: row.customerName || row.shipPhone,
      href: `/admin/orders/${row.id}`,
    };
  }
  if (target.type === "PURCHASE_REQUEST") {
    const row = await prisma.purchaseRequest.findUnique({
      where: { id },
      select: { id: true, reference: true, customerName: true },
    });
    if (!row) throw new Error("Không tìm thấy yêu cầu mua hàng đã chọn");
    return {
      type: "PURCHASE_REQUEST",
      id: row.id,
      label: row.customerName,
      secondary: row.reference,
      href: "/admin/coordination/operation?view=purchase-request-operation-flow",
    };
  }
  if (target.type === "ACQUISITION") {
    const row = await prisma.acquisition.findUnique({
      where: { id },
      select: { id: true, refNo: true, vendor: { select: { name: true } } },
    });
    if (!row) throw new Error("Không tìm thấy phiếu nhập đã chọn");
    return {
      type: "ACQUISITION",
      id: row.id,
      label: row.refNo || row.vendor?.name || "Phiếu nhập",
      secondary: row.vendor?.name || null,
      href: `/admin/acquisitions/${row.id}/edit`,
    };
  }
  const row = await prisma.serviceRequest.findUnique({
    where: { id },
    select: { id: true, refNo: true, skuSnapshot: true, modelSnapshot: true },
  });
  if (!row) throw new Error("Không tìm thấy yêu cầu kỹ thuật đã chọn");
  return {
    type: "SERVICE_REQUEST",
    id: row.id,
    label: row.refNo || row.modelSnapshot || "Yêu cầu kỹ thuật",
    secondary: row.skuSnapshot,
    href: `/admin/services/issues-board?serviceRequestId=${encodeURIComponent(row.id)}`,
  };
}

export function normalizePersonalDomain(value: unknown): PersonalWorkDomain {
  const domain = String(value || "GENERAL")
    .trim()
    .toUpperCase() as PersonalWorkDomain;
  return domainKeys.has(domain) ? domain : "GENERAL";
}

export async function getPersonalWorkPageData(auth: unknown, options: {summary?: boolean; ids?: string[]; row?: boolean; context?: PersonalWorkPageData} = {}): Promise<PersonalWorkPageData> {
  const userId = getAuthUserId(auth);
  if (!userId) throw new Error("Không xác định được người dùng");
  const context = options.context;
  if(context && context.currentUserId !== userId) throw new Error("Ngữ cảnh người dùng không hợp lệ.");
  const [items, connection, availableUsers, categories, canManageDefaults] = await Promise.all([
    prisma.taskItem.findMany({
      where: {
        ...personalWorkListAccessWhere(userId),
        ...(options.ids ? {id: {in: options.ids.slice(0, 30)}} : {}),
      },
      include: {
        mergedSources:{take: options.summary || options.row ? 0 : undefined,select:{id:true,title:true}},
        assignedToUser: { select: { id: true, name: true } },
        personalCategory: true,
        codexRuns: { orderBy: { createdAt: "desc" }, take: options.summary || options.row ? 0 : 5, select: publicRunSelect },
        personalOwner: { select: { id: true, name: true, email: true, avatarUrl: true } },
        task: {
          select: {
            kind: true,
            createdByUserId: true,
            assignedToUserId: true,
            createdByUser: { select: { id: true, name: true, email: true, avatarUrl: true } },
            assignedToUser: { select: { id: true, name: true, email: true, avatarUrl: true } },
          },
        },
        personalShares: {
          include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
          orderBy: { createdAt: "asc" },
        },
        calendarLinks: { where: { userId }, take: 1 },
        executions: {
          take: options.summary ? 0 : undefined,
          where: { actionType: { not: "CANCELLED" } },
          select: { targetType: true, targetId: true, metadataJson: true },
          orderBy: { createdAt: "desc" },
        },
        activities: {
          include: { actorUser: { select: { id: true, name: true, email: true, avatarUrl: true } } },
          orderBy: { occurredAt: "desc" },
          take: options.summary ? 0 : options.row ? 1 : 20,
        },
        checklists: { where: options.summary ? {personalShares:{some:{userId}}} : undefined, orderBy: { sortOrder: "asc" },include:{personalShares:{include:{user:{select:{id:true,name:true,email:true,avatarUrl:true}}}}} },
      },
      orderBy: [{ isDone: "asc" }, { dueAt: "asc" }, { createdAt: "desc" }],
    }),
    context ? null : prisma.googleCalendarConnection.findUnique({ where: { userId } }),
    context ? context.availableUsers : prisma.user.findMany({
      where: { isActive: true, id: { not: userId } },
      select: { id: true, name: true, email: true, avatarUrl: true },
      orderBy: [{ name: "asc" }, { email: "asc" }],
    }),
    context ? context.categories : listPersonalCategories(userId),
    context ? context.canManageDefaultCategories : canManageDefaultCategories(userId),
  ]);
  // One bounded result per visible entry; do not depend on the parent's 20 recent activities.
  const updateEntryIds=options.summary||options.row?[]:items.flatMap(item=>{
    const full=isPersonalWorkOwner(item,userId)||item.personalShares.some(share=>share.userId===userId);
    return item.checklists.filter(entry=>full||entry.personalShares.some(share=>share.userId===userId)).map(entry=>entry.id);
  });
  const entryUpdates=updateEntryIds.length?await prisma.$queryRaw<{checklistItemId:string;body:string;occurredAt:Date}[]>(Prisma.sql`
    SELECT DISTINCT ON ("metadataJson"->>'checklistItemId') "metadataJson"->>'checklistItemId' AS "checklistItemId", "body", "occurredAt"
    FROM "TaskItemActivity" WHERE "taskItemId" IN (${Prisma.join(items.map(item=>item.id))})
      AND "metadataJson"->>'checklistItemId' IN (${Prisma.join(updateEntryIds)})
      AND "title" LIKE 'Cập nhật đầu việc%' AND "body" IS NOT NULL
    ORDER BY "metadataJson"->>'checklistItemId', "occurredAt" DESC, "id" DESC
  `):[];
  const entryUpdateMap=new Map(entryUpdates.map(row=>[row.checklistItemId,{body:row.body,occurredAt:row.occurredAt.toISOString()}]));
  const tagged = await hydrateTaskItemsWithTagsRepo(prisma, items);
  const ownerIds = [...new Set(items.map(item => item.personalOwnerUserId || item.task?.createdByUserId || item.task?.assignedToUserId).filter((id): id is string => Boolean(id)))];
  const ownerCategoryRows = await prisma.personalWorkCategory.findMany({ where: { userId: { in: ownerIds } } });
  const ownerCategories = new Map(ownerIds.map(id => [id, mergePersonalCategories(ownerCategoryRows.filter(row => row.userId === id), categories.filter(c => c.isDefault))]));
  const data: PersonalWorkPageData = {
    canManageDefaultCategories: canManageDefaults,
    categories,
    items: tagged.map((item) => {
      const names = item.tags.map((tag) => tag.name);
      const domain = item.personalCategory ? categoryFromRow(item.personalCategory).domain : normalizePersonalDomain(names.find((name) => domainKeys.has(name.toUpperCase())));
      const calendar = item.calendarLinks[0];
      const owned = isPersonalWorkOwner(item, userId);
      const share = item.personalShares.find((entry) => entry.userId === userId);
      const owner = item.personalOwner || item.task?.createdByUser || item.task?.assignedToUser;
      if (!owner) throw new Error("Công việc cá nhân chưa có chủ sở hữu");
      const result: PersonalWorkItem = {
        detailsLoaded: !options.summary && !options.row,
        mergeSources:item.mergedSources,
        id: item.id,
        personalWorkNumber: item.personalWorkNumber,
        assignedToMe: item.assignedToUserId === userId,
        assignee: item.assignedToUser || null,
        codexRuns: item.codexRuns.map(run => ({ ...run, notBefore:run.notBefore?.toISOString()??null, createdAt: run.createdAt.toISOString(), startedAt: run.startedAt?.toISOString() ?? null, finishedAt: run.finishedAt?.toISOString() ?? null })),
        codexRun: item.codexRuns[0] ? { ...item.codexRuns[0], notBefore:item.codexRuns[0].notBefore?.toISOString()??null, createdAt: item.codexRuns[0].createdAt.toISOString(), startedAt: item.codexRuns[0].startedAt?.toISOString() ?? null, finishedAt: item.codexRuns[0].finishedAt?.toISOString() ?? null } : null,
        title: item.title,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        note: options.summary || options.row ? null : item.note,
        status: item.status,
        priority: item.priority,
        dueAt: item.dueAt?.toISOString() ?? null,
        scheduledEndAt: item.scheduledEndAt?.toISOString() ?? null,
        reminderMinutes: item.reminderMinutes,
        estimatedDays: item.estimatedDays,
        completedAt: item.completedAt?.toISOString() ?? null,
        cancelledAt:item.cancelledAt?.toISOString()??null,
        cancelledBy:item.status==="CANCELLED"?item.activities.find(a=>(a.metadataJson as Prisma.JsonObject|null)?.status==="CANCELLED")?.actorUser??null:null,
        cancellationReason:item.status==="CANCELLED"?item.activities.find(a=>(a.metadataJson as Prisma.JsonObject|null)?.status==="CANCELLED")?.body??null:null,
        domain,
        category: item.personalCategory ? categoryFromRow(item.personalCategory) : (ownerCategories.get(owner.id)?.find(c => c.key === domain) ?? defaultPersonalCategories().find(c => c.key === domain)!),
        workType: item.workTypeId,
        targets: item.executions
          .map(targetFromExecution)
          .filter((target): target is PersonalWorkTarget => Boolean(target)),
        progressPercent: item.progressPercent,
        progressMode: item.progressMode,
        checklistLockedAt: item.checklistLockedAt?.toISOString() || null,
        activities: item.activities.map((activity) => ({
          id: activity.id,
          title: activity.title,
          body: activity.body,
          occurredAt: activity.occurredAt.toISOString(),
          actor: activity.actorUser,
        })),
        checklist: item.checklists.map((entry) => ({ id: entry.id, title: entry.title, isDone: entry.isDone, updatedAt:entry.updatedAt.toISOString(), latestUpdate:entryUpdateMap.get(entry.id)??null, startAt:entry.startAt?.toISOString()??null, deadlineAt:entry.deadlineAt?.toISOString()??null, mediaContext: options.row ? undefined : mediaChecklistContext(entry.note),
          access:owned?"OWNER":share?.accessLevel === "EDITOR"?"EDITOR":entry.personalShares.find(s=>s.userId===userId)?.accessLevel??"VIEWER",
          sharedWith:owned?entry.personalShares.map(s=>({user:s.user,accessLevel:s.accessLevel})):[],
        })),
        tags: names.filter((name) => !domainKeys.has(name.toUpperCase())),
        calendar: {
          synced: Boolean(calendar)&&item.status!=="CANCELLED"&&calendar?.syncHash!=="CANCELLED_PENDING_DELETE",
          htmlLink: calendar?.eventHtmlLink ?? null,
          lastSyncedAt: calendar?.lastSyncedAt.toISOString() ?? null,
        },
        access: owned
          ? ("OWNER" as const)
          : share?.accessLevel === PersonalTaskShareAccess.EDITOR
            ? ("EDITOR" as const)
            : ("VIEWER" as const),
        owner,
        sharedWith: item.personalShares.map((entry) => ({ user: entry.user, accessLevel: entry.accessLevel })),
      };
      if (!owned && !share) {
        const visibleIds=new Set(item.checklists.filter(e=>e.personalShares.some(s=>s.userId===userId)).map(e=>e.id));
        const updated=item.checklists.filter(e=>visibleIds.has(e.id)).reduce((latest,e)=>e.updatedAt>latest?e.updatedAt:latest,item.createdAt);
        return checklistOnlyWork(result,result.checklist.filter(e=>visibleIds.has(e.id)),updated.toISOString());
      }
      return result;
    }),
    codex: context?.codex ?? { ...codexExecutionReadiness(), canDispatch: Boolean(await prisma.user.findFirst({ where: { id: userId, isActive: true, roles: { some: { name: "ADMIN" } } }, select: { id: true } })) },
    currentUserId: userId,
    availableUsers,
    calendar: context ? context.calendar : {
      configured: isGoogleCalendarConfigured(),
      configurationIssue: googleCalendarReadiness().reason,
      connected: Boolean(connection),
      accountEmail: connection?.googleAccountEmail ?? null,
      lastSyncedAt: connection?.lastSyncedAt?.toISOString() ?? null,
      events: [],
      loadError: null,
    },
  };
  if(options.ids) return {...data, items: await hydratePersonalWorkObjects(prisma,userId,data.items)};
  const visibleOriginIds=items.flatMap(row=>row.checklists.filter(e=>e.personalShares.some(s=>s.userId===userId)).flatMap(e=>e.mergedFromTaskItemId?[e.mergedFromTaskItemId]:[]));
  const merged=await prisma.taskItem.findMany({where:{mergedIntoTaskItemId:{not:null},OR:[{personalOwnerUserId:userId},{personalShares:{some:{userId}}},{id:{in:visibleOriginIds}}]},select:{id:true,mergedIntoTaskItemId:true}});
  for(let depth=0;depth<50;depth++){
    const loaded=new Set(merged.map(row=>row.id));
    const missing=[...new Set(merged.flatMap(row=>row.mergedIntoTaskItemId&&!loaded.has(row.mergedIntoTaskItemId)?[row.mergedIntoTaskItemId]:[]))];
    if(!missing.length)break;
    const ancestors=await prisma.taskItem.findMany({where:{id:{in:missing},mergedIntoTaskItemId:{not:null}},select:{id:true,mergedIntoTaskItemId:true}});
    if(!ancestors.length)break;merged.push(...ancestors);
  }
  const edges=new Map(merged.map(row=>[row.id,row.mergedIntoTaskItemId!]));
  const visible=new Set(data.items.filter(row=>!row.checklistOnly).map(row=>row.id));
  const partialSources=new Set(items.flatMap(row=>row.checklists.filter(e=>e.personalShares.some(s=>s.userId===userId)).flatMap(e=>e.mergedFromTaskItemId?[e.mergedFromTaskItemId]:[])));
  for(const id of [...partialSources]){let root=id;const seen=new Set<string>();while(edges.has(root)&&!seen.has(root)){seen.add(root);partialSources.add(root);root=edges.get(root)!;}}
  const redirects:Record<string,string>={};
  for(const row of merged){let root=row.id;const seen=new Set<string>();while(edges.has(root)&&!seen.has(root)){seen.add(root);root=edges.get(root)!;}if(visible.has(root)||partialSources.has(row.id))redirects[row.id]=root;}
  return {...data, pagination: Boolean(options.summary), mergedWorkRedirects:redirects,items: options.summary ? data.items : await hydratePersonalWorkObjects(prisma,userId,data.items)};
}

export async function createPersonalWorkItem(input: PersonalWorkInput, auth: unknown, db: DB = prisma, identity?: { systemId?: string; actorUserId?: string; assignedToUserId?: string; eventTargets?: PersonalWorkTarget[]; onEvent?: (event:RecordedBusinessEvent)=>void; deferConsumers?: (work:()=>Promise<void>)=>void }): Promise<import("@prisma/client").TaskItem> {
  if(db===prisma)return runBusinessEventTransaction((tx,delivery)=>createPersonalWorkItem(input,auth,tx,{...identity,deferConsumers:undefined,onEvent:event=>delivery.track(event)}),{deferConsumers:identity?.deferConsumers});
  const userId = getAuthUserId(auth);
  if (!userId) throw new Error("Không xác định được người dùng");
  const title = input.title.trim();
  if (!title) throw new Error("Vui lòng nhập nội dung công việc");
  if (input.reminderMinutes !== undefined && ![null,0,10,15,30,60].includes(input.reminderMinutes)) throw new Error("Thời gian nhắc không hợp lệ");
  if(isContinuousWork(input.workType))assertContinuousSchedule(input);
  const schedule = validatePersonalSchedule(input.dueAt, input.scheduledEndAt);
  const category = await resolvePersonalCategory(userId, input.categoryKey || normalizePersonalDomain(input.domain));
  const domain = category.domain;
  const workType = isPersonalEvent(input.workType) ? "EVENT" : isContinuousWork(input.workType) ? "CONTINUOUS" : category.id ? null : normalizeWorkType(input.workType, domain);
  if (isPersonalEvent(workType) && !schedule.dueAt) throw new Error("Sự kiện cần ngày diễn ra");
  if (isPersonalEvent(workType) && input.tags?.some(t=>t.trim().toLowerCase()==="codex")) throw new Error("Sự kiện không gửi cho Codex thực hiện");
  const resolvedTargets = await Promise.all(
    (input.targets || []).map((target) => resolvePersonalWorkTarget(domain, target)),
  );
  const targets = [
    ...new Map(
      resolvedTargets
        .filter((target): target is PersonalWorkTarget => Boolean(target))
        .map((target) => [`${target.type}:${target.id}`, target]),
    ).values(),
  ];
  return withDbTransaction(db, async (tx) => {
    const item = await tx.taskItem.create({
      data: {
        ...(identity ? { id: identity.systemId } : {}),
        reminderMinutes: input.reminderMinutes,
        title, note: input.note?.trim() || null,
        personalOwnerUserId: userId, assignedToUserId: identity?.assignedToUserId??userId,
        ...(isContinuousWork(workType)?{status:TaskStatus.IN_PROGRESS,startedAt:new Date(),reminderMinutes:null}:{}),
        priority: input.priority || "MEDIUM", workTypeId: workType,
        personalCategoryId: category.id, dueAt: schedule.dueAt, scheduledEndAt: schedule.scheduledEndAt,
        estimatedDays: schedule.estimatedDays ?? Math.max(1, Math.min(365, Math.round(input.estimatedDays ?? 1))),
      },
    });
    if(isContinuousWork(workType))await tx.taskItemActivity.create({data:{taskItemId:item.id,sourceType:"SYSTEM",actorUserId:identity?.actorUserId??userId,title:"Bắt đầu duy trì",body:"Một việc liên tục, không hạn chót và không sinh bản sao hằng ngày.",metadataJson:{source:"CONTINUOUS_WORK"}}});
    await setTargetTagsRepo(tx, {
      ...personalWorkTagOwner(item),
      targetType: AppTagTargetType.TASK_ITEM,
      targetId: item.id,
      names: [domain, ...(input.tags || [])],
    });
    for (const target of targets) {
      await tx.taskExecution.create({ data: {
        taskId: null,
        taskItemId: item.id,
        targetType: target.type,
        targetId: target.id,
        metadataJson: bindingMetadata(target),
        createdByUserId: userId, actionType: "LINKED",
      } });
    }
    const event=await recordPersonalWorkCreated(tx,{item,ownerUserId:userId,actorUserId:identity?.actorUserId??userId,assignedToUserId:item.assignedToUserId??userId,domain,tags:input.tags??[],targets:identity?.eventTargets??targets},{deferConsumers:identity?.deferConsumers});identity?.onEvent?.(event);
    return item;
  });
}

export async function searchPersonalWorkTargets(input: {
  type: PersonalWorkTargetType;
  query?: string | null;
}): Promise<PersonalWorkTarget[]> {
  const query = String(input.query || "").trim();
  const contains = query ? { contains: query, mode: "insensitive" as const } : undefined;

  if (input.type === "WATCH") {
    const rows = await prisma.watch.findMany({
      where: query ? { product: { OR: [{ title: contains }, { sku: contains }] } } : undefined,
      select: { id: true, productId: true, product: { select: { title: true, sku: true, primaryImageUrl: true, productImage: { where: { role: "INLINE" }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], take: 1, select: { fileKey: true } } } } },
      orderBy: { updatedAt: "desc" },
      take: 12,
    });
    return rows.map((row) => ({
      type: "WATCH",
      id: row.id,
      label: row.product.title,
      secondary: row.product.sku,
      imageUrl: row.product.productImage[0]?.fileKey || row.product.primaryImageUrl,
      href: `/admin/watches/${row.productId}`,
    }));
  }
  if (input.type === "ORDER") {
    const rows = await prisma.order.findMany({
      where: query ? { OR: [{ refNo: contains }, { customerName: contains }, { shipPhone: contains }] } : undefined,
      select: { id: true, refNo: true, customerName: true, shipPhone: true },
      orderBy: { updatedAt: "desc" },
      take: 12,
    });
    return rows.map((row) => ({
      type: "ORDER",
      id: row.id,
      label: row.refNo || row.customerName || "Đơn hàng",
      secondary: row.customerName || row.shipPhone,
      href: `/admin/orders/${row.id}`,
    }));
  }
  if (input.type === "PURCHASE_REQUEST") {
    const rows = await prisma.purchaseRequest.findMany({
      where: query ? { OR: [{ reference: contains }, { customerName: contains }, { phone: contains }] } : undefined,
      select: { id: true, reference: true, customerName: true },
      orderBy: { updatedAt: "desc" },
      take: 12,
    });
    return rows.map((row) => ({
      type: "PURCHASE_REQUEST",
      id: row.id,
      label: row.customerName,
      secondary: row.reference,
      href: "/admin/coordination/operation?view=purchase-request-operation-flow",
    }));
  }
  if (input.type === "ACQUISITION") {
    const rows = await prisma.acquisition.findMany({
      where: query ? { OR: [{ refNo: contains }, { vendor: { name: contains } }] } : undefined,
      select: { id: true, refNo: true, vendor: { select: { name: true } } },
      orderBy: { updatedAt: "desc" },
      take: 12,
    });
    return rows.map((row) => ({
      type: "ACQUISITION",
      id: row.id,
      label: row.refNo || row.vendor?.name || "Phiếu nhập",
      secondary: row.vendor?.name || null,
      href: `/admin/acquisitions/${row.id}/edit`,
    }));
  }
  const rows = await prisma.serviceRequest.findMany({
    where: query ? { OR: [{ refNo: contains }, { skuSnapshot: contains }, { modelSnapshot: contains }] } : undefined,
    select: { id: true, refNo: true, skuSnapshot: true, modelSnapshot: true },
    orderBy: { updatedAt: "desc" },
    take: 12,
  });
  return rows.map((row) => ({
    type: "SERVICE_REQUEST",
    id: row.id,
    label: row.refNo || row.modelSnapshot || "Yêu cầu kỹ thuật",
    secondary: row.skuSnapshot,
    href: `/admin/services/issues-board?serviceRequestId=${encodeURIComponent(row.id)}`,
  }));
}

export async function updatePersonalWorkItem(
  input: {
    reminderMinutes?: number | null;
    id: string;
    title?: string;
    note?: string | null;
    dueAt?: string | null;
    scheduledEndAt?: string | null;
    workType?: string | null;
    estimatedDays?: number;
    priority?: TaskPriority;
    status?: TaskStatus;
    domain?: PersonalWorkDomain;
    categoryKey?: string;
    tags?: string[];
    targets?: PersonalWorkTarget[];
    progressPercent?: number;
    progressMode?: TaskProgressMode;
    updateBody?: string | null;
    updateChecklistItemId?: string | null;
    confirmRunning?: boolean;
    restoreCancelled?: boolean;
  },
  auth: unknown,
  db: DB = prisma,
) {
  if (input.reminderMinutes !== undefined && ![null,0,10,15,30,60].includes(input.reminderMinutes)) throw new Error("Thời gian nhắc không hợp lệ");
  const current = await assertPersonalWorkAccess(input.id, auth, "EDIT", db, true);
  personalWorkTransition(current,input,current.access==="OWNER");
  assertContinuousUpdate(current.workTypeId,input,current.access==="OWNER");
  if(current.id.startsWith("media-daily-")) {
    const receipt=await db.taskItemActivity.findFirst({where:{taskItemId:current.id,metadataJson:{path:["source"],equals:"WATCH_MEDIA_DAILY"}},orderBy:{createdAt:"asc"},select:{metadataJson:true}});
    const day=(receipt?.metadataJson as Prisma.JsonObject|null)?.day;
    if(typeof day!=="string" || input.dueAt!==undefined && (!input.dueAt || mediaDayToday(new Date(input.dueAt))!==day) || input.scheduledEndAt && mediaDayToday(new Date(input.scheduledEndAt))!==day)throw new Error("Việc media được gom cố định theo người phụ trách và ngày; không chuyển việc ngày này sang ngày khác.");
    if(input.categoryKey!==undefined && input.categoryKey!=="WATCHSHOP" || input.domain!==undefined && input.domain!=="WATCHSHOP")throw new Error("Việc media trong ngày thuộc nhóm WatchShop.");
  }
  const event = isPersonalEvent(current.workTypeId);
  if(input.workType!==undefined && isPersonalEvent(input.workType)!==event)throw new Error("Không đổi qua lại giữa công việc và sự kiện; hãy tạo mục mới.");
  if(event && ((input.status && input.status!==TaskStatus.CANCELLED && !(current.status==="CANCELLED"&&input.status==="TODO"))||input.progressMode!==undefined||input.progressPercent!==undefined))throw new Error("Sự kiện không có trạng thái hoàn thành hoặc tiến độ");
  if(event && input.tags?.some(t=>t.trim().toLowerCase()==="codex"))throw new Error("Sự kiện không gửi cho Codex thực hiện");
  if (input.title !== undefined && !input.title.trim()) throw new Error("Tên công việc không được để trống");
  const needsContext = input.categoryKey !== undefined || input.domain !== undefined || input.tags !== undefined || input.targets !== undefined || input.workType !== undefined;
  const [tagged] = needsContext ? await hydrateTaskItemsWithTagsRepo(db, [current]) : [];
  const currentDomain = current.personalCategoryId ? "GENERAL" : normalizePersonalDomain(tagged?.tags.find(tag => domainKeys.has(tag.name.toUpperCase()))?.name);
  const retainedTags = tagged?.tags.filter(tag => !domainKeys.has(tag.name.toUpperCase())).map(tag => tag.name) ?? [];
  const scheduleChanged = input.dueAt !== undefined || input.scheduledEndAt !== undefined;
  const nextStart = input.dueAt === undefined ? current.dueAt : input.dueAt;
  const nextEnd = input.scheduledEndAt !== undefined ? input.scheduledEndAt :
    input.dueAt !== undefined && current.scheduledEndAt && current.dueAt && nextStart
      ? new Date(new Date(nextStart).getTime() + current.scheduledEndAt.getTime() - current.dueAt.getTime())
      : nextStart ? current.scheduledEndAt : null;
  const hasChecklist=await db.taskItemChecklist.count({where:{taskItemId:input.id}})>0;
  const schedule = hasChecklist ? {dueAt:current.dueAt,scheduledEndAt:current.scheduledEndAt,estimatedDays:current.estimatedDays} : validatePersonalSchedule(nextStart, nextEnd);
  if(event && !schedule.dueAt)throw new Error("Sự kiện cần ngày diễn ra");
  const ownerId = current.personalOwnerUserId || current.task?.createdByUserId || current.task?.assignedToUserId;
  const category = input.categoryKey !== undefined
    ? await resolvePersonalCategory(ownerId || current.userId, input.categoryKey)
    : input.domain !== undefined ? await resolvePersonalCategory(ownerId || current.userId, normalizePersonalDomain(input.domain)) : undefined;
  const status = input.status;
  if (status === TaskStatus.DONE && current.progressMode === TaskProgressMode.CHECKLIST && !current.checklistLockedAt) {
    throw new Error("Hãy hoàn thành toàn bộ đầu việc và xác nhận hoàn thành");
  }
  const estimatedDays = schedule.estimatedDays !== undefined ? schedule.estimatedDays : input.estimatedDays === undefined
    ? undefined
    : Math.max(1, Math.min(365, Math.round(input.estimatedDays)));
  const progressPercent = input.progressPercent === undefined
    ? undefined
    : Math.max(0, Math.min(100, Math.round(input.progressPercent)));
  const resolvedTargets = input.targets
    ? [
        ...new Map(
          (await Promise.all(
            input.targets.map((target) => resolvePersonalWorkTarget(category?.domain ?? currentDomain, target)),
          ))
            .filter((target): target is PersonalWorkTarget => Boolean(target))
            .map((target) => [`${target.type}:${target.id}`, target]),
        ).values(),
      ]
    : null;
  if (input.updateChecklistItemId && (event || !input.updateBody?.trim())) throw new Error("Chọn đầu việc cần kèm nội dung cập nhật cho công việc.");
  const transaction=<T>(fn:(tx:Prisma.TransactionClient)=>Promise<T>)=>db===prisma?prisma.$transaction(fn,{timeout:30000}):withDbTransaction(db,fn);
  const mutate=()=>transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id" FROM "TaskItem" WHERE "id"=${input.id} FOR UPDATE`;
    const locked=await assertPersonalWorkAccess(input.id, auth, "EDIT", tx, true);
    const transition=personalWorkTransition(locked,input,locked.access==="OWNER");
    if(transition.duplicate)return;
    if(transition.cancelling){
      await tx.$queryRaw`SELECT "id" FROM "PersonalCodexRun" WHERE "taskItemId"=${input.id} AND "status" IN ('QUEUED','RUNNING') FOR UPDATE`;
      const running=await tx.personalCodexRun.count({where:{taskItemId:input.id,status:"RUNNING"}});
      if(running&&!input.confirmRunning)throw new Error("Có tác vụ Codex đang chạy. Xác nhận dừng tác vụ trước khi hủy việc.");
      await tx.personalCodexRun.updateMany({where:{taskItemId:input.id,status:{in:["QUEUED","RUNNING"]}},data:{status:"CANCELLED",activeTaskItemId:null,leaseToken:null,leaseExpiresAt:null,finishedAt:new Date(),errorCode:"TASK_CANCELLED"}});
      await tx.workPushDelivery.updateMany({where:{taskItemId:input.id,deliveredAt:null,kind:{in:["REMINDER","ASSIGNED","SHARED","CHANGED"]}},data:{deliveredAt:new Date(),leaseUntil:null}});
    }
    let updateEntry: { id: string; title: string } | null = null;
    if (input.updateChecklistItemId) {
      await tx.$queryRaw`SELECT "id" FROM "TaskItem" WHERE "id"=${input.id} FOR UPDATE`;
      await assertPersonalWorkAccess(input.id, auth, "EDIT", tx);
      await assertPersonalChecklistEdit(input.id, input.updateChecklistItemId, auth, tx);
      updateEntry = await tx.taskItemChecklist.findFirst({ where: { id: input.updateChecklistItemId, taskItemId: input.id }, select: { id: true, title: true } });
      if (!updateEntry) throw new Error("Đầu việc không còn tồn tại. Chọn lại mục cập nhật.");
    }
    const lockedHasChecklist=await tx.taskItemChecklist.count({where:{taskItemId:input.id}})>0;
    await tx.taskItem.update({
      where: { id: input.id },
      data: {
      ...(input.reminderMinutes !== undefined ? {reminderMinutes:input.reminderMinutes} : {}),
      ...(scheduleChanged && !lockedHasChecklist ? { dueAt: schedule.dueAt, scheduledEndAt: schedule.scheduledEndAt } : {}),
      ...(category ? { personalCategoryId: category.id } : {}),
      ...(category || input.workType !== undefined ? { workTypeId: event ? "EVENT" : isContinuousWork(current.workTypeId) ? "CONTINUOUS" : (category ? category.id : current.personalCategoryId) ? null : normalizeWorkType(input.workType ?? current.workTypeId, category?.domain ?? currentDomain) } : {}),
      ...(input.title !== undefined ? { title: input.title.trim() } : {}),
      ...(input.note !== undefined ? { note: input.note?.trim() || null } : {}),
      ...(estimatedDays !== undefined && !lockedHasChecklist ? { estimatedDays } : {}),
      ...(input.priority ? { priority: input.priority } : {}),
      ...(progressPercent !== undefined ? { progressPercent } : {}),
      ...(input.progressMode ? { progressMode: input.progressMode } : {}),
      ...(status
        ? {
            status,
            isDone: status === TaskStatus.DONE,
            completedAt: status === TaskStatus.DONE ? new Date() : null,
            cancelledAt: status === TaskStatus.CANCELLED ? new Date() : null,
            startedAt: status === TaskStatus.IN_PROGRESS ? current.startedAt || new Date() : undefined,
          }
        : {}),
      },
    });
    if (input.updateBody?.trim() || status || progressPercent !== undefined) {
      await tx.taskItemActivity.create({
        data: {
          taskItemId: input.id,
          sourceType: "DISCUSSION",
          actorUserId: current.userId,
          title: transition.cancelling?"Hủy công việc":transition.restoring?"Mở lại công việc":isContinuousWork(current.workTypeId)&&status==="CANCELLED"?"Dừng duy trì":isContinuousWork(current.workTypeId)&&status==="IN_PROGRESS"&&current.status==="CANCELLED"?"Tiếp tục duy trì":updateEntry ? `Cập nhật đầu việc · ${updateEntry.title}` : event?"Cập nhật sự kiện":input.updateBody?.trim() ? "Cập nhật tiến độ" : "Cập nhật công việc",
          body: input.updateBody?.trim() || null,
          metadataJson: {
            ...(updateEntry ? { checklistItemId: updateEntry.id, checklistTitle: updateEntry.title } : {}),
            ...(status ? { status, previousStatus:locked.status } : {}),
            ...(progressPercent !== undefined ? { progressPercent } : {}),
          },
        },
      });
    }
    if (resolvedTargets) {
      const existingBindings = await tx.taskExecution.findMany({
        where: {
          taskItemId: input.id,
          actionType: { not: "CANCELLED" },
          metadataJson: { path: ["source"], equals: "PERSONAL_WORK" },
        },
        select: { id: true, targetType: true, targetId: true },
      });
      const { added, removed } = reconcilePersonalWorkBindings(existingBindings, resolvedTargets);

      if (removed.length) {
        await tx.taskExecution.updateMany({
          where: { id: { in: removed.map((binding) => binding.id) } },
          data: { actionType: "CANCELLED" },
        });
      }
      for (const target of added) {
        await tx.taskExecution.create({ data: {
          taskId: current.taskId,
          taskItemId: current.id,
          targetType: target.type,
          targetId: target.id,
          metadataJson: bindingMetadata(target),
          createdByUserId: current.userId, actionType: "LINKED",
        } });
      }
      if (added.length || removed.length) {
        await tx.taskItemActivity.create({
          data: {
            taskItemId: input.id,
            sourceType: "DISCUSSION",
            actorUserId: current.userId,
            title: "Cập nhật đối tượng liên kết",
            metadataJson: {
              added: added.map((target) => ({ targetType: target.type, targetId: target.id })),
              removed: removed.map((binding) => ({
                targetType: binding.targetType,
                targetId: binding.targetId,
              })),
            },
          },
        });
      }
    }
    if (transition.cancelling||transition.restoring||scheduleChanged) await queuePersonalChange(tx,input.id,current.userId,transition.cancelling?"CANCELLED":transition.restoring?"RESTORED":"CHANGED",input.updateBody?.trim());
    if (input.domain || input.tags || category) {
      await setTargetTagsRepo(tx, {
        ...personalWorkTagOwner(current),
        targetType: AppTagTargetType.TASK_ITEM,
        targetId: current.id,
        names: [category?.domain ?? currentDomain, ...(input.tags ?? retainedTags)],
      });
    }
  });
  for(let attempt=0;;attempt++){try{await mutate();break;}catch(error){
    if(db===prisma&&input.status&&attempt<2&&error instanceof Prisma.PrismaClientKnownRequestError&&(error.code==="P2034"||error.code==="P2010"&&["40001","40P01"].includes(String(error.meta?.code))))continue;
    throw error;
  }}
}

function checklistProgress(total: number, done: number) {
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

async function updateChecklistProgress(tx: Prisma.TransactionClient, taskItemId: string) {
  const [total, done, item] = await Promise.all([
    tx.taskItemChecklist.count({ where: { taskItemId } }),
    tx.taskItemChecklist.count({ where: { taskItemId, isDone: true } }),
    tx.taskItem.findUniqueOrThrow({ where: { id: taskItemId }, select: { status: true, startedAt: true } }),
  ]);
  const progressPercent = checklistProgress(total, done);
  await tx.taskItem.update({
    where: { id: taskItemId },
    data: {
      progressMode: TaskProgressMode.CHECKLIST,
      progressPercent,
      ...(progressPercent > 0 && item.status === TaskStatus.TODO
        ? { status: TaskStatus.IN_PROGRESS, startedAt: item.startedAt || new Date() }
        : {}),
    },
  });
  return { total, done, progressPercent };
}

function assertChecklistOpen(item: { status: TaskStatus; checklistLockedAt: Date | null; workTypeId?:string|null }) {
  if(isPersonalEvent(item.workTypeId))throw new Error("Sự kiện không có đầu việc hay xác nhận hoàn thành");
  if (item.status === TaskStatus.DONE || item.checklistLockedAt) {
    throw new Error("Danh sách đầu việc đã được khóa sau khi hoàn thành");
  }
  if (item.status === TaskStatus.CANCELLED) throw new Error("Công việc đã bị hủy");
}

export async function addPersonalWorkChecklistItem(taskItemId: string, title: string, auth: unknown) {
  const current = await assertPersonalWorkAccess(taskItemId, auth, "EDIT");
  assertChecklistOpen(current);
  const normalizedTitle = title.trim();
  if (!normalizedTitle) throw new Error("Vui lòng nhập tên đầu việc");
  if (normalizedTitle.length > 500) throw new Error("Tên đầu việc không được vượt quá 500 ký tự");
  return runBusinessEventTransaction(async (tx,delivery) => {
    await tx.$queryRaw`SELECT "id" FROM "TaskItem" WHERE "id"=${taskItemId} FOR UPDATE`;
    const locked=await assertPersonalWorkAccess(taskItemId, auth, "EDIT", tx);
    assertChecklistOpen(locked);
    const last = await tx.taskItemChecklist.findFirst({
      where: { taskItemId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });
    const checklist = await tx.taskItemChecklist.create({
      data: { taskItemId, title: normalizedTitle, sortOrder: (last?.sortOrder || 0) + 1, ...(!last?{startAt:locked.dueAt,deadlineAt:locked.scheduledEndAt||locked.dueAt}:{}) },
    });
    await updateChecklistProgress(tx, taskItemId);
    await recomputePersonalChecklistSchedule(tx, taskItemId);
    await tx.taskItemActivity.create({data:{taskItemId,actorUserId:current.userId,sourceType:"DISCUSSION",title:"Thêm đầu việc",body:normalizedTitle}});
    delivery.track(await recordPersonalChecklistCreated(tx,{taskItemId,id:checklist.id,title:checklist.title,actorUserId:current.userId}));
    return checklist;
  });
}

export async function assertPersonalChecklistAccess(taskItemId:string,checklistItemId:string,auth:unknown,required:"VIEW"|"EDIT"="VIEW",db:DB=prisma) {
  const userId=getAuthUserId(auth);
  if(!userId)throw Object.assign(new Error("Không xác định được người dùng"), { status: 403 });
  const item=await db.taskItem.findFirst({where:{id:taskItemId,...personalWorkScopeWhere},include:{task:true,personalShares:{where:{userId}},checklists:{where:{id:checklistItemId},include:{personalShares:{where:{userId}}}}}});
  if(!item || !item.checklists.length)throw Object.assign(new Error("Không tìm thấy đầu việc"), { status: 403 });
  const canEdit=isPersonalWorkOwner(item,userId)||item.personalShares.some(s=>s.accessLevel==="EDITOR")||item.checklists[0].personalShares.some(s=>s.accessLevel==="EDITOR");
  const allowed=required === "EDIT" ? canEdit : isPersonalWorkOwner(item,userId)||item.personalShares.length>0||item.checklists[0].personalShares.length>0;
  if(!allowed)throw Object.assign(new Error("Bạn không có quyền cập nhật đầu việc này"), { status: 403 });
  if(required==="EDIT"&&item.status==="CANCELLED")throw new Error("Công việc đã hủy chỉ được xem.");
  return {...item,userId,canEdit};
}

async function assertPersonalChecklistEdit(taskItemId:string,checklistItemId:string,auth:unknown,db:DB=prisma) {
  return assertPersonalChecklistAccess(taskItemId,checklistItemId,auth,"EDIT",db);
}

export async function replacePersonalChecklistShares(taskItemId:string,checklistItemId:string,shares:ShareInput[],auth:unknown) {
  return prisma.$transaction(async tx=>{
    await tx.$queryRaw`SELECT "id" FROM "TaskItem" WHERE "id"=${taskItemId} FOR UPDATE`;
    const current=await assertPersonalWorkAccess(taskItemId,auth,"OWNER",tx);
    const entry=await tx.taskItemChecklist.findFirst({where:{id:checklistItemId,taskItemId},include:{personalShares:true}});
    if(!entry)throw new Error("Không tìm thấy đầu việc");
    const unique=new Map(shares.filter(s=>s.userId!==current.userId).map(s=>[s.userId,s.accessLevel]));
    if(unique.size>20||[...unique.values()].some(v=>!["VIEWER","EDITOR"].includes(v)))throw new Error("Danh sách chia sẻ không hợp lệ");
    const users=await tx.user.findMany({where:{id:{in:[...unique.keys()]},isActive:true},select:{id:true}});
    if(users.length!==unique.size)throw new Error("Người nhận không còn hoạt động hoặc không tồn tại");
    await tx.personalChecklistShare.deleteMany({where:{checklistItemId,userId:{notIn:[...unique.keys()]}}});
    for(const [userId,accessLevel] of unique)await tx.personalChecklistShare.upsert({where:{checklistItemId_userId:{checklistItemId,userId}},create:{checklistItemId,userId,accessLevel,sharedByUserId:current.userId},update:{accessLevel}});
    const task=await tx.taskItem.findUniqueOrThrow({where:{id:taskItemId},select:{title:true}});
    for(const userId of newShareRecipients(entry.personalShares.map(s=>s.userId),[...unique.keys()],current.userId))await queueWorkNotification(tx,{
      key:`work:checklist-share:${checklistItemId}:${userId}:${crypto.randomUUID()}`,userId,actorId:current.userId,taskItemId,checklistItemId,kind:"SHARED",title:`${task.title} · ${entry.title}`,route:workRoute(taskItemId,true)});
  });
}

export async function renamePersonalWorkChecklistItem(taskItemId: string, checklistItemId: string, title: string, auth: unknown) {
  const normalized = title.trim();
  if (!normalized || normalized.length > 500) throw new Error("Tên đầu việc cần từ 1 đến 500 ký tự");
  return prisma.$transaction(async tx => {
    await tx.$queryRaw`SELECT "id" FROM "TaskItem" WHERE "id"=${taskItemId} FOR UPDATE`;
    const current = await assertPersonalChecklistEdit(taskItemId, checklistItemId, auth, tx);
    assertChecklistOpen(current);
    const entry = await tx.taskItemChecklist.findFirst({where:{id:checklistItemId,taskItemId}});
    if (!entry) throw new Error("Không tìm thấy đầu việc");
    if (entry.title === normalized) return entry;
    const updated = await tx.taskItemChecklist.update({where:{id:entry.id},data:{title:normalized}});
    await tx.taskItem.update({where:{id:taskItemId},data:{updatedAt:new Date()}});
    await tx.taskItemActivity.create({data:{taskItemId,actorUserId:current.userId,sourceType:"DISCUSSION",title:"Sửa đầu việc",body:`${entry.title} → ${normalized}`}});
    return updated;
  });
}

export async function setPersonalWorkChecklistItemDone(
  taskItemId: string,
  checklistItemId: string,
  isDone: boolean,
  auth: unknown,
) {
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id" FROM "TaskItem" WHERE "id"=${taskItemId} FOR UPDATE`;
    const current = await assertPersonalChecklistEdit(taskItemId,checklistItemId,auth,tx);
    assertChecklistOpen(current);
    const result = await tx.taskItemChecklist.updateMany({
      where: { id: checklistItemId, taskItemId },
      data: { isDone, doneAt: isDone ? new Date() : null },
    });
    if (!result.count) throw new Error("Không tìm thấy đầu việc");
    const entry = await tx.taskItemChecklist.findUniqueOrThrow({where:{id:checklistItemId}});
    await tx.taskItemActivity.create({data:{taskItemId,actorUserId:current.userId,sourceType:"DISCUSSION",title:isDone?"Hoàn thành đầu việc":"Mở lại đầu việc",body:entry.title,metadataJson:{checklistItemId:entry.id,checklistTitle:entry.title}}});
    return updateChecklistProgress(tx, taskItemId);
  });
}

export async function deletePersonalWorkChecklistItem(taskItemId: string, checklistItemId: string, auth: unknown) {
  const current = await assertPersonalWorkAccess(taskItemId, auth, "EDIT");
  assertChecklistOpen(current);
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id" FROM "TaskItem" WHERE "id"=${taskItemId} FOR UPDATE`;
    assertChecklistOpen(await assertPersonalWorkAccess(taskItemId, auth, "EDIT", tx));
    const entry = await tx.taskItemChecklist.findFirst({where:{id:checklistItemId,taskItemId}});
    if (!entry) throw new Error("Không tìm thấy đầu việc");
    const result = await tx.taskItemChecklist.deleteMany({ where: { id: checklistItemId, taskItemId } });
    await tx.taskItemActivity.create({data:{taskItemId,actorUserId:current.userId,sourceType:"DISCUSSION",title:"Xóa đầu việc",body:entry.title}});
    if (!result.count) throw new Error("Không tìm thấy đầu việc");
    await recomputePersonalChecklistSchedule(tx, taskItemId);
    return updateChecklistProgress(tx, taskItemId);
  });
}

export async function finalizePersonalWorkChecklist(taskItemId: string, auth: unknown) {
  const current = await assertPersonalWorkAccess(taskItemId, auth, "EDIT");
  if(isContinuousWork(current.workTypeId))throw Error("Việc duy trì không có thao tác hoàn thành.");
  assertChecklistOpen(current);
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id" FROM "TaskItem" WHERE "id"=${taskItemId} FOR UPDATE`;
    assertChecklistOpen(await assertPersonalWorkAccess(taskItemId, auth, "EDIT", tx));
    const [total, done] = await Promise.all([
      tx.taskItemChecklist.count({ where: { taskItemId } }),
      tx.taskItemChecklist.count({ where: { taskItemId, isDone: true } }),
    ]);
    if (total === 0) throw new Error("Hãy thêm ít nhất một đầu việc trước khi hoàn thành");
    if (done !== total) throw new Error(`Còn ${total - done} đầu việc chưa hoàn thành`);
    const completedAt = new Date();
    await tx.taskItem.update({
      where: { id: taskItemId },
      data: {
        status: TaskStatus.DONE,
        isDone: true,
        progressMode: TaskProgressMode.CHECKLIST,
        progressPercent: 100,
        completedAt,
        checklistLockedAt: completedAt,
      },
    });
    await tx.taskItemActivity.create({
      data: {
        taskItemId,
        sourceType: "DISCUSSION",
        actorUserId: current.userId,
        title: "Xác nhận hoàn thành",
        body: `Đã hoàn thành ${total}/${total} đầu việc và khóa danh sách.`,
        metadataJson: { status: TaskStatus.DONE, progressPercent: 100, checklistLocked: true },
      },
    });
    return { total, done };
  });
}

export async function replacePersonalWorkShares(taskItemId: string, shares: ShareInput[], auth: unknown) {
  const current = await assertPersonalWorkAccess(taskItemId, auth, "OWNER");
  const unique = new Map(
    shares.filter((share) => share.userId !== current.userId).map((share) => [share.userId, share.accessLevel]),
  );
  const users = await prisma.user.findMany({
    where: { id: { in: [...unique.keys()] }, isActive: true },
    select: { id: true },
  });
  if (users.length !== unique.size) throw new Error("Có người nhận không còn hoạt động hoặc không tồn tại");
  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id" FROM "TaskItem" WHERE "id"=${taskItemId} FOR UPDATE`;
    await assertPersonalWorkAccess(taskItemId, auth, "OWNER", tx);
    const previous = await tx.personalTaskShare.findMany({where:{taskItemId},select:{userId:true}});
    const item = await tx.taskItem.findUniqueOrThrow({where:{id:taskItemId}});
    await tx.personalTaskShare.deleteMany({ where: { taskItemId } });
    if (unique.size) {
      await tx.personalTaskShare.createMany({
        data: [...unique].map(([userId, accessLevel]) => ({
          taskItemId,
          userId,
          accessLevel,
          sharedByUserId: current.userId,
        })),
      });
    }
    for (const userId of newShareRecipients(previous.map(s=>s.userId), [...unique.keys()], current.userId)) {
      await queueWorkNotification(tx, {key:`work:share:${taskItemId}:${userId}:${crypto.randomUUID()}`, userId, actorId:current.userId,
        taskItemId,kind:"SHARED",title:item.title,route:workRoute(taskItemId,true)});
    }
  });
}

export async function recomputePersonalChecklistSchedule(tx: Prisma.TransactionClient, taskItemId: string) {
  const entries = await tx.taskItemChecklist.findMany({where:{taskItemId},select:{startAt:true,deadlineAt:true}});
  const task = await tx.taskItem.findUniqueOrThrow({where:{id:taskItemId},select:{workTypeId:true}});
  const range = checklistScheduleRange(entries);
  await tx.taskItem.update({where:{id:taskItemId},data:isContinuousWork(task.workTypeId)?{dueAt:null,scheduledEndAt:null}:{dueAt:range.dueAt,scheduledEndAt:range.scheduledEndAt,
    estimatedDays:range.dueAt&&range.scheduledEndAt?Math.max(1,Math.ceil((Date.parse(range.scheduledEndAt)-Date.parse(range.dueAt))/86400000)):1}});
  return range;
}
export async function editPersonalChecklist(input:{taskItemId:string;checklistItemId:string;title:string;startAt:string|null;deadlineAt:string|null;updateBody?:string;expectedUpdatedAt?:string},auth:unknown) {
  const title=input.title.trim(), body=input.updateBody?.trim();
  if(!title||title.length>500)throw new Error("Tên đầu việc cần từ 1 đến 500 ký tự");
  if(body&&body.length>10000)throw new Error("Nội dung cập nhật tối đa 10.000 ký tự");
  const schedule=validateChecklistSchedule(input.startAt,input.deadlineAt);
  return prisma.$transaction(async tx=>{
    await tx.$queryRaw`SELECT "id" FROM "TaskItem" WHERE "id"=${input.taskItemId} FOR UPDATE`;
    const current=await assertPersonalChecklistEdit(input.taskItemId,input.checklistItemId,auth,tx);
    assertChecklistOpen(current);
    const entry=current.checklists[0];
    if(input.expectedUpdatedAt&&entry.updatedAt.toISOString()!==input.expectedUpdatedAt)throw new Error("Đầu việc đã được người khác sửa. Đóng và mở lại trước khi cập nhật.");
    const changed=entry.title!==title||entry.startAt?.toISOString()!==schedule.startAt?.toISOString()||entry.deadlineAt?.toISOString()!==schedule.deadlineAt?.toISOString();
    if(!changed&&!body)return;
    await tx.taskItemChecklist.update({where:{id:entry.id},data:{title,...schedule}});
    if(changed)await tx.taskItemActivity.create({data:{taskItemId:current.id,actorUserId:current.userId,sourceType:"DISCUSSION",title:`Sửa đầu việc · ${title}`,body:[entry.title!==title?`${entry.title} → ${title}`:null,`Bắt đầu: ${checklistMomentLabel(entry.startAt)} → ${checklistMomentLabel(schedule.startAt)}`,`Hạn chót: ${checklistMomentLabel(entry.deadlineAt)} → ${checklistMomentLabel(schedule.deadlineAt)}`].filter(Boolean).join("\n"),
      metadataJson:{checklistItemId:entry.id,previousStartAt:entry.startAt?.toISOString()??null,previousDeadlineAt:entry.deadlineAt?.toISOString()??null,startAt:input.startAt,deadlineAt:input.deadlineAt}}});
    if(body)await tx.taskItemActivity.create({data:{taskItemId:current.id,actorUserId:current.userId,sourceType:"DISCUSSION",title:`Cập nhật đầu việc · ${title}`,body,metadataJson:{checklistItemId:entry.id,checklistTitle:title}}});
    await recomputePersonalChecklistSchedule(tx,current.id);
  });
}
export async function personalChecklistHistory(taskItemId:string,checklistItemId:string,auth:unknown) {
  await assertPersonalChecklistAccess(taskItemId,checklistItemId,auth);
  const rows=await prisma.taskItemActivity.findMany({where:{taskItemId,metadataJson:{path:["checklistItemId"],equals:checklistItemId}},orderBy:[{occurredAt:"desc"},{id:"desc"}],take:30,include:{actorUser:{select:{id:true,name:true,email:true,avatarUrl:true}}}});
  return rows.map(row=>({id:row.id,title:row.title,body:row.body,occurredAt:row.occurredAt.toISOString(),actor:row.actorUser}));
}
