import { Prisma } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import { MEDIA_OPERATION_BOARD_PROJECTION_KEY as MEDIA, MEDIA_OPERATION_BOARD_PROJECTION_VERSION as MV } from "@/domains/projection/server/media-operation-board.projection";
import { TECHNICAL_ISSUE_BOARD_PROJECTION_KEY as TECH, TECHNICAL_ISSUE_BOARD_PROJECTION_VERSION as TV } from "@/domains/projection/server/technical-issue-board.projection";
import type { OperationsDashboardAttentionItem } from "../shared";
import { selectAttentionItems } from "./attention-selection";

const text = (value: unknown) => typeof value === "string" && value.trim() ? value.trim() : null;
const record = (value: unknown): Record<string, unknown> => value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const days = (value: Date, now: Date) => Math.max(0, Math.floor((now.getTime() - value.getTime()) / 86400000));

/** Full-source, bounded candidate selection; independent of paginated board data. */
export async function queryDashboardAttention(db: DB, now: Date): Promise<OperationsDashboardAttentionItem[]> {
  const client = dbOrTx(db);
  const select = { id: true, reference: true, customerName: true, status: true, assignedUserId: true, updatedAt: true, followUpAt: true, assignedUser: { select: { name: true, email: true, avatarUrl: true } } } as const;
  const [projectionRows, overdueRequests, unassignedRequests] = await Promise.all([
    client.$queryRaw<Array<{ projectionKey: string; entityId: string; status: string; dataJson: Prisma.JsonValue; activityAt: Date; overdueAt: Date | null }>>(Prisma.sql`
      WITH latest AS (
        SELECT DISTINCT ON ("projectionKey", "entityId") "projectionKey", "entityId", "status", "dataJson", "updatedAt"
        FROM "ProjectionRecord"
        WHERE (("projectionKey" = ${MEDIA} AND "projectionVersion" = ${MV})
          OR ("projectionKey" = ${TECH} AND "projectionVersion" = ${TV})) AND "entityId" IS NOT NULL
        ORDER BY "projectionKey", "entityId", "updatedAt" DESC
      ), dated AS (
        SELECT *, COALESCE(NULLIF("dataJson"->>'updatedAt', '')::timestamptz, "updatedAt") AS "activityAt",
          NULLIF("dataJson"->>'expectedCompletionAt', '')::timestamptz AS "overdueAt"
        FROM latest
      ), eligible AS (
        SELECT *, ROW_NUMBER() OVER (PARTITION BY "projectionKey" ORDER BY
          CASE WHEN "projectionKey" = ${TECH} THEN "overdueAt" ELSE "activityAt" END, "entityId") AS priority
        FROM dated
        WHERE ("projectionKey" = ${MEDIA} AND "status" IN ('PHOTOGRAPHY','MEDIA_PROCESSING','PUBLISH') AND "activityAt" <= ${new Date(now.getTime() - 3 * 86400000)})
           OR ("projectionKey" = ${TECH} AND "status" IN ('INSPECT','READY','PROCESSING') AND "overdueAt" < ${now}
               AND COALESCE("dataJson"->>'executionStatus', '') NOT IN ('CANCELED','DONE','COMPLETED'))
      )
      SELECT "projectionKey", "entityId", "status", "dataJson", "activityAt", "overdueAt" FROM eligible WHERE priority <= 6
    `),
    client.purchaseRequest.findMany({ where: { status: { in: ["WAITING", "PROCESSING"] }, followUpAt: { lt: now } }, orderBy: [{ followUpAt: "asc" }, { id: "asc" }], take: 6, select }),
    client.purchaseRequest.findMany({ where: { status: { in: ["WAITING", "PROCESSING"] }, assignedUserId: null }, orderBy: [{ updatedAt: "asc" }, { id: "asc" }], take: 6, select }),
  ]);
  const items: OperationsDashboardAttentionItem[] = [];
  for (const row of projectionRows) {
    const data = record(row.dataJson), service = record(data.serviceRequest);
    const age = days(row.activityAt, now);
    const media = row.projectionKey === MEDIA;
    const id = encodeURIComponent(row.entityId);
    const productId = text(data.productId), serviceId = text(data.serviceRequestId);
    const stage = row.status.toLowerCase().replaceAll("_", "-");
    const href = media ? (productId ? `/admin/watches/${encodeURIComponent(productId)}/edit?mode=media&focus=image` : text(data.targetType) === "MEDIA_POST" ? `/admin/media-posts/${id}` : `/admin/coordination/operation?view=media-production-flow&flowStage=${stage}&flowQuery=${encodeURIComponent(text(data.sku) ?? row.entityId)}`)
      : serviceId ? `/admin/services/${encodeURIComponent(serviceId)}` : `/admin/coordination/operation?view=technical-issue-flow&flowStage=${stage}&flowQuery=${encodeURIComponent(text(service.refNo) ?? row.entityId)}`;
    items.push({ id: `${media ? "media" : "technical"}-${row.entityId}`, domain: media ? "MEDIA" : "TECHNICAL", title: (media ? text(data.title) : text(service.productTitle) ?? text(data.summary)) ?? (media ? "Media cần kiểm tra" : "Phiếu kỹ thuật"), reference: (media ? text(data.sku) : text(service.refNo)), imageUrl: (media ? text(data.imageUrl) : text(service.imageUrl)), reason: media ? `Không cập nhật ${age} ngày` : `Kỹ thuật quá hạn ${Math.max(1, days(row.overdueAt ?? row.activityAt, now))} ngày`, ageLabel: age === 0 ? "Hôm nay" : `${age} ngày`, ageDays: age, ownerLabel: "Chưa có thông tin người phụ trách", actionLabel: media ? "Mở xử lý media" : "Mở phiếu kỹ thuật", href, tone: media ? "violet" : "blue", severity: !media || age >= 30 ? "risk" : "attention" });
  }
  for (const request of [...overdueRequests, ...unassignedRequests]) {
    const overdue = request.followUpAt && request.followUpAt < now;
    const age = days(request.updatedAt, now);
    items.push({ id: `pr-${request.id}`, domain: "PURCHASE_REQUEST", title: request.customerName || "Yêu cầu mua hàng", reference: request.reference, reason: overdue ? `Follow-up quá hạn ${Math.max(1, days(request.followUpAt!, now))} ngày` : "Chưa có người nhận", ageLabel: age === 0 ? "Hôm nay" : `${age} ngày`, ageDays: age, ownerLabel: request.assignedUser?.name || request.assignedUser?.email || "Chưa có người nhận", avatarUser: request.assignedUser, actionLabel: "Xem yêu cầu", href: `/admin/coordination/operation?view=purchase-request-operation-flow&flowStage=purchase-request-${request.status.toLowerCase()}&flowQuery=${encodeURIComponent(request.reference)}`, tone: "rose", severity: overdue ? "risk" : "attention" });
  }
  return selectAttentionItems(items);
}
