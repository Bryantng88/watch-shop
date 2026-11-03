import { createHash, randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { prisma, type Tx } from "@/server/db/client";
import { resolveOperationSpace } from "@/domains/coordination/server/operation-space.service";
import { ensureTaskItemReferenceBinding } from "@/domains/task/server/business-binding.service";
import { recordBusinessEvent } from "@/domains/event/server/business-event.service";
import { MAX_LOOKUPS, followupDefinitions, intakePlanSchema, lookupRequestSchema, requestIntakeSchema, routingSchema, type IntakePlan, type LookupEvidence } from "../intake-schema";
import { intakeActor, validRecipient, salesIntakeReady, SalesIntakeError } from "./intake-access";
import { executeIntakeLookup } from "./intake-lookups";
import { validateIntakeEvidence } from "./evidence";

const json = (value: unknown) => JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
const publicSelect = { id: true, requestText: true, status: true, planJson: true, resultJson: true, errorCode: true, createdAt: true } as const;
const leaseSeconds = 120;
const activeStatuses = ["TODO", "IN_PROGRESS"] as const;
export const followupBusinessKey = (customerId: string, productId: string, kind: string) => createHash("sha256").update(JSON.stringify([customerId, productId, kind])).digest("hex");

async function transaction<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try { return await prisma.$transaction(fn, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 20000 }); }
    catch (error) {
      if (attempt < 3 && error instanceof Prisma.PrismaClientKnownRequestError && ["P2034", "P2002"].includes(error.code)) continue;
      throw error;
    }
  }
}
export async function listSalesIntakes(userId: string) {
  await intakeActor(prisma, userId);
  await prisma.salesCodexIntake.updateMany({ where: { requestedByUserId: userId, status: "RUNNING", leaseExpiresAt: { lt: new Date() } }, data: { status: "FAILED", errorCode: "LEASE_EXPIRED", leaseToken: null } });
  const [requests, people] = await Promise.all([
    prisma.salesCodexIntake.findMany({ where: { requestedByUserId: userId }, select: publicSelect, orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.user.findMany({ where: { isActive: true, roles: { some: { OR: [{ name: "ADMIN" }, { permissions: { some: { code: "TASK_VIEW" } } }] } } }, select: { id: true, name: true }, orderBy: { name: "asc" }, take: 200 }),
  ]);
  return { requests, people, userId };
}
export async function requestSalesIntake(userId: string, raw: unknown) {
  const input = requestIntakeSchema.parse(raw);
  return transaction(async tx => {
    await intakeActor(tx, userId);
    const existing = await tx.salesCodexIntake.findUnique({ where: { requestKey: input.requestKey } });
    if (existing) {
      if (existing.requestedByUserId !== userId || existing.requestText !== input.text || JSON.stringify(routingSchema.parse(existing.routingJson)) !== JSON.stringify(input.routing)) throw new SalesIntakeError("Mã yêu cầu đã được sử dụng.", 409);
      return { id: existing.id };
    }
    if (await tx.salesCodexIntake.count({ where: { requestedByUserId: userId, status: { in: ["QUEUED", "RUNNING"] } } }) >= 3) throw new SalesIntakeError("Bạn đang có 3 yêu cầu chờ.", 429);
    for (const id of [...new Set(Object.values(input.routing).filter((id): id is string => Boolean(id)))]) if (!await validRecipient(tx, id)) throw new SalesIntakeError("Người nhận cần hoạt động và có quyền xem công việc.");
    return tx.salesCodexIntake.create({ data: { requestedByUserId: userId, requestKey: input.requestKey, requestText: input.text, routingJson: input.routing }, select: { id: true } });
  });
}
export async function cancelSalesIntake(userId: string, id: string) {
  return transaction(async tx => {
    await intakeActor(tx, userId);
    const row = await tx.salesCodexIntake.findFirst({ where: { id, requestedByUserId: userId } });
    if (!row) throw new SalesIntakeError("Không có quyền hủy yêu cầu này.", 403);
    const result = await tx.salesCodexIntake.updateMany({ where: { id, requestedByUserId: userId, status: { in: ["QUEUED", "RUNNING"] } }, data: { status: "CANCELLED", leaseToken: null, leaseExpiresAt: null } });
    return { cancelled: result.count === 1 || row.status === "CANCELLED" };
  });
}
export async function claimSalesIntake(workerId: string) {
  if (!salesIntakeReady()) throw new SalesIntakeError("Unavailable", 503);
  if (!/^[\w.-]{1,80}$/.test(workerId)) throw new SalesIntakeError("Invalid worker");
  await prisma.salesCodexIntake.updateMany({ where: { status: "RUNNING", leaseExpiresAt: { lt: new Date() } }, data: { status: "FAILED", errorCode: "LEASE_EXPIRED", leaseToken: null } });
  return transaction(async tx => {
    const row = await tx.salesCodexIntake.findFirst({ where: { status: "QUEUED" }, orderBy: { createdAt: "asc" } });
    if (!row) return null;
    try { await intakeActor(tx, row.requestedByUserId); }
    catch { await tx.salesCodexIntake.update({ where: { id: row.id }, data: { status: "FAILED", errorCode: "REQUESTER_UNAUTHORIZED" } }); return null; }
    const leaseToken = randomUUID();
    const changed = await tx.salesCodexIntake.updateMany({ where: { id: row.id, status: "QUEUED" }, data: { status: "RUNNING", leaseToken, leaseExpiresAt: new Date(Date.now() + leaseSeconds * 1000) } });
    return changed.count ? { id: row.id, text: row.requestText, leaseToken, referenceTime: new Date().toISOString(), timeZone: "Asia/Ho_Chi_Minh" } : null;
  });
}
async function leased(tx: Tx, id: string, leaseToken: string) {
  const row = await tx.salesCodexIntake.findFirst({ where: { id, leaseToken, status: "RUNNING", leaseExpiresAt: { gt: new Date() } } });
  if (!row) throw new SalesIntakeError("Lease không còn hiệu lực.", 409);
  await intakeActor(tx, row.requestedByUserId);
  return row;
}
export async function heartbeatSalesIntake(id: string, leaseToken: string) {
  return transaction(async tx => {
    await leased(tx, id, leaseToken);
    const changed = await tx.salesCodexIntake.updateMany({ where: { id, leaseToken, status: "RUNNING", leaseExpiresAt: { gt: new Date() } }, data: { leaseExpiresAt: new Date(Date.now() + leaseSeconds * 1000) } });
    return changed.count === 1;
  });
}
export async function lookupSalesIntake(id: string, leaseToken: string, raw: unknown) {
  const request = lookupRequestSchema.parse(raw);
  return transaction(async tx => {
    const row = await leased(tx, id, leaseToken);
    const evidence = row.lookupsJson as unknown as LookupEvidence[];
    const previous = evidence.find(entry => JSON.stringify(entry.request) === JSON.stringify(request));
    if (previous) return previous;
    if (evidence.length >= MAX_LOOKUPS) throw new SalesIntakeError("Đã hết số lượt tra cứu cho yêu cầu này.");
    // Detail/open-work tools cannot enumerate arbitrary IDs unseen in this request.
    if ("productId" in request && !evidence.some(entry => entry.request.tool === "watches.search" && Array.isArray(entry.result.matches) && (entry.result.matches as { id: string }[]).some(match => match.id === request.productId))) throw new SalesIntakeError("Sản phẩm chưa được tìm trong yêu cầu.");
    if ("customerId" in request && !evidence.some(entry => entry.request.tool === "customers.search" && Array.isArray(entry.result.matches) && (entry.result.matches as { id: string }[]).some(match => match.id === request.customerId))) throw new SalesIntakeError("Khách chưa được tìm trong yêu cầu.");
    const actor = await intakeActor(tx, row.requestedByUserId);
    const accessoryAllowed = actor.roles.some(role => role.name === "ADMIN" || role.permissions.some(permission => permission.code === "ACCESSORY_VIEW"));
    const result = request.tool === "accessories.search" && !accessoryAllowed
      ? { matches: [], truncated: false, accessDenied: true, caution: "No ACCESSORY_VIEW permission. Catalog was not queried. Ask authorized staff to verify; do not infer absence or try another lookup to bypass this restriction." }
      : await executeIntakeLookup(tx, request);
    const entry: LookupEvidence = { id: randomUUID(), request, at: new Date().toISOString(), result };
    const changed = await tx.salesCodexIntake.updateMany({ where: { id, leaseToken, status: "RUNNING", leaseExpiresAt: { gt: new Date() } }, data: { lookupsJson: json([...evidence, entry]) } });
    if (!changed.count) throw new SalesIntakeError("Lease đã hết.", 409);
    return entry;
  });
}

async function freshEvidence(tx: Tx, plan: IntakePlan, evidence: LookupEvidence[]) {
  const questions: string[] = [];
  for (const lead of plan.leads) {
    const customer = await tx.customer.findUnique({ where: { id: lead.customerId! }, select: { updatedAt: true } });
    const observed = evidence.filter(entry => entry.request.tool === "customers.search").flatMap(entry => (entry.result.matches ?? []) as { id: string; version: string }[]).find(match => match.id === lead.customerId);
    const detail = [...evidence].reverse().find(entry => entry.request.tool === "watches.detail" && entry.request.productId === lead.productId);
    const now = await executeIntakeLookup(tx, { tool: "watches.detail", productId: lead.productId! });
    if (!customer || customer.updatedAt.toISOString() !== observed?.version || now.found === false || now.version !== detail?.result.version || now.watchVersion !== detail?.result.watchVersion || now.activeReservations !== detail?.result.activeReservations) questions.push(`${lead.key}: khách/sản phẩm đã thay đổi sau tra cứu; hãy gửi yêu cầu mới.`);
    const openWork = await executeIntakeLookup(tx, { tool: "work.open", customerId: lead.customerId!, productId: lead.productId! });
    const known = await tx.salesCodexFollowup.findMany({ where: { productId: lead.productId! }, select: { taskItemId: true } });
    const knownIds = new Set(known.map(item => item.taskItemId));
    for (const followup of lead.followups) {
      const previous = await tx.salesCodexFollowup.findUnique({ where: { businessKey: followupBusinessKey(lead.customerId!, lead.productId!, followup.kind) } });
      const active = previous ? await tx.taskItem.findFirst({ where: { id: previous.taskItemId, status: { in: [...activeStatuses] } }, select: { assignedToUserId: true } }) : null;
      if (active && (!active.assignedToUserId || !await validRecipient(tx, active.assignedToUserId))) questions.push(`${lead.key}: việc đang mở chưa có người phụ trách hoạt động; cần xử lý việc cũ trước.`);
    }
    if (openWork.truncated || (openWork.openWatchWork as { id: string }[]).some(item => !knownIds.has(item.id))) questions.push(`${lead.key}: đã có việc thủ công đang mở cho watch; cần kiểm tra để tránh giao trùng.`);
  }
  return questions;
}

export async function finishSalesIntake(id: string, leaseToken: string, raw: unknown, failed = false) {
  const plan = failed ? null : intakePlanSchema.parse(raw);
  return transaction(async tx => {
    const prior = await tx.salesCodexIntake.findUnique({ where: { id } });
    if (prior?.leaseToken === leaseToken && ["APPLIED", "NEEDS_INFO", "FAILED"].includes(prior.status)) return { accepted: true };
    const row = await leased(tx, id, leaseToken);
    if (!plan) {
      await tx.salesCodexIntake.update({ where: { id }, data: { status: "FAILED", errorCode: "GENERATION_FAILED", leaseExpiresAt: null } });
      return { accepted: true };
    }
    const evidence = row.lookupsJson as unknown as LookupEvidence[];
    const routing = routingSchema.parse(row.routingJson);
    const questions = [...plan.questions, ...validateIntakeEvidence(plan, evidence)];
    for (const lead of plan.leads) for (const followup of lead.followups) {
      const department = followupDefinitions[followup.kind].department;
      const recipient = routing[department];
      if (!recipient || !await validRecipient(tx, recipient)) questions.push(`Chưa có người nhận hợp lệ cho ${department}; chọn người phụ trách và gửi lại.`);
    }
    const space = await resolveOperationSpace(tx, { context: "OPERATION" });
    if (!space) questions.push("Cần khởi tạo không gian Vận hành qua giao diện trước khi tự tạo việc.");
    if (!questions.length) questions.push(...await freshEvidence(tx, plan, evidence));
    if (questions.length) {
      await tx.salesCodexIntake.update({ where: { id }, data: { status: "NEEDS_INFO", planJson: json({ ...plan, questions: [...new Set(questions)].slice(0, 10) }), resultJson: json({ tasks: [], lookups: evidence.map(entry => ({ tool: entry.request.tool, at: entry.at })) }), leaseExpiresAt: null } });
      return { accepted: true };
    }
    const locked = await tx.salesCodexIntake.updateMany({ where: { id, leaseToken, status: "RUNNING", leaseExpiresAt: { gt: new Date() } }, data: { status: "APPLYING" } });
    if (!locked.count) throw new SalesIntakeError("Lease đã hết.", 409);
    const creator = await intakeActor(tx, row.requestedByUserId);
    if (!space) throw new SalesIntakeError("Chưa có không gian Vận hành.");
    const tasks: { id: string; title: string; department: string; assignedToUserId: string; reused: boolean }[] = [];
    for (const lead of plan.leads) for (const followup of lead.followups) {
      const definition = followupDefinitions[followup.kind];
      const assignedToUserId = routing[definition.department]!;
      const key = followupBusinessKey(lead.customerId!, lead.productId!, followup.kind);
      const existing = await tx.salesCodexFollowup.findUnique({ where: { businessKey: key } });
      const open = existing ? await tx.taskItem.findFirst({ where: { id: existing.taskItemId, status: { in: [...activeStatuses] } }, select: { id: true, title: true, assignedToUserId: true } }) : null;
      if (open) {
        await tx.taskItemActivity.create({ data: { taskItemId: open.id, actorUserId: creator.id, sourceType: "SYSTEM", sourceId: id, title: "Bổ sung yêu cầu tư vấn vào việc đang mở", body: followup.description } });
        tasks.push({ ...open, assignedToUserId: open.assignedToUserId ?? assignedToUserId, department: definition.department, reused: true });
        continue;
      }
      const product = await tx.product.findUniqueOrThrow({ where: { id: lead.productId! }, select: { title: true, sku: true } });
      const title = `${definition.label}: ${product.sku || product.title}`.slice(0, 180);
      // Only these server-owned metadata lines are interpreted by coordination.
      const note = ["workTypeKey: ad-hoc-work", "blueprintKey: ad-hoc-work", "blueprintSource: REGISTRY", "workspaceKind: STANDALONE_WORKSPACE", "operationWorkspaceRole: AD_HOC_WORK", "ownerType: USER", "shareGroupKey: operation", "workspaceType: ad-hoc-work", "itemLabel: Việc phát sinh", "defaultView: items", "identityTargetType: WATCH", `requestDetail: ${followup.description.replace(/[\r\n]/g, " ")}`, `Sales intake: ${id}`, `Customer ID: ${lead.customerId}`, `Bộ phận: ${definition.department}`, "Chỉ theo dõi/xác minh; không đặt mua, giữ hàng, duyệt giá hoặc gửi tin khách."].join("\n");
      const item = await tx.taskItem.create({ data: { taskId: space.task.id, title, note, userId: creator.id, assignedToUserId, workTypeId: "ad-hoc-work" } });
      await ensureTaskItemReferenceBinding(tx, { taskId: space.task.id, taskItemId: item.id, targetType: "WATCH", targetId: lead.productId!, actionType: "LINKED", createdByUserId: creator.id, metadataJson: { source: "SALES_CODEX", salesIntakeId: id, customerId: lead.customerId!, department: definition.department, followupKind: followup.kind, workTypeKey: "ad-hoc-work", targetTitle: product.title, targetRef: product.sku, targetHref: `/admin/watches/${lead.productId}`, intakeNote: followup.description } });
      await tx.taskItemActivity.create({ data: { taskItemId: item.id, actorUserId: creator.id, sourceType: "SYSTEM", sourceId: id, title: "Tự tạo từ yêu cầu tư vấn Sale", body: followup.description } });
      const recipient = await validRecipient(tx, assignedToUserId);
      await recordBusinessEvent(tx, { eventKey: "task.item.created", targetType: "TASK_ITEM", targetId: item.id, actorUserId: creator.id, payload: { taskId: space.task.id, taskTitle: space.task.title, taskKind: space.task.kind, taskKindLabel: "Vận hành", taskItemId: item.id, taskItemTitle: title, creatorUserId: creator.id, creatorName: creator.name ?? "Sale", assignedToUserId, assignedToName: recipient?.name ?? "Nhân viên", priority: item.priority, dueAt: null, dueLabel: "-", tagNames: [], tagLabel: "", workspaceKind: "STANDALONE_WORKSPACE", operationWorkspaceRole: "AD_HOC_WORK", workTypeKey: "ad-hoc-work", businessTarget: { targetType: "WATCH", targetId: lead.productId!, title: product.title } } });
      await tx.notification.create({ data: { userId: assignedToUserId, taskId: space.task.id, type: `SALES_CODEX_${item.id}`, title: "Việc theo dõi tư vấn mới", message: title, metadata: { route: "/admin/coordination/operation?view=ad-hoc-work", taskItemId: item.id, salesIntakeId: id, department: definition.department } } });
      const data = { customerId: lead.customerId!, productId: lead.productId!, kind: followup.kind, taskItemId: item.id, intakeId: id };
      await tx.salesCodexFollowup.upsert({ where: { businessKey: key }, create: { ...data, businessKey: key }, update: data });
      tasks.push({ id: item.id, title, assignedToUserId, department: definition.department, reused: false });
    }
    const completed = await tx.salesCodexIntake.updateMany({ where: { id, leaseToken, status: "APPLYING", leaseExpiresAt: { gt: new Date() } }, data: { status: "APPLIED", planJson: json(plan), resultJson: json({ tasks, lookups: evidence.map(entry => ({ tool: entry.request.tool, at: entry.at })) }), leaseExpiresAt: null } });
    if (!completed.count) throw new SalesIntakeError("Lease đã hết khi tạo việc.", 409);
    return { accepted: true };
  });
}
