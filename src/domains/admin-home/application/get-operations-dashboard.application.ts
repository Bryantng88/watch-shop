import { prisma } from "@/server/db/client";
import { queryOrderListProjection } from "@/domains/projection/server/order-list.projection";
import { queryMediaOperationBoardProjection } from "@/domains/projection/server/media-operation-board.projection";
import { listTechnicalIssueBoardWorkspaceProjection } from "@/domains/projection/server/technical-issue-board.projection";
import { ensureProjectionReady } from "@/domains/projection/server/projection-read.service";
import type {
  OperationsDashboardAttentionItem,
  OperationsDashboardData,
  OperationsDashboardMetric,
  OperationsDashboardQueue,
} from "../shared/operations-dashboard.types";

function count(map: Map<string, number>, key: string) {
  return map.get(key) ?? 0;
}

function ageInDays(value: string | Date | null | undefined, now: Date) {
  if (!value) return 0;
  return Math.max(0, Math.floor((now.getTime() - new Date(value).getTime()) / 86_400_000));
}

function ageLabel(days: number) {
  if (days <= 0) return "Hôm nay";
  return `${days} ngày`;
}

export async function getOperationsDashboardApplication(): Promise<OperationsDashboardData> {
  await Promise.all([
    ensureProjectionReady(prisma, "order-list"),
    ensureProjectionReady(prisma, "media-operation-board"),
    ensureProjectionReady(prisma, "technical-issue-board"),
  ]);

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86_400_000);
  const [orders, processingOrders, purchaseRequestCounts, purchaseRequests, overdueRequestCount, unassignedRequestCount, media, technical, completedOrders, acquisitionPayables] = await Promise.all([
    queryOrderListProjection(prisma, { view: "all", subFilter: "", paymentType: "", sort: "updatedDesc", page: 1, pageSize: 1 }),
    queryOrderListProjection(prisma, { view: "processing", subFilter: "", paymentType: "", sort: "updatedDesc", page: 1, pageSize: 100 }),
    prisma.purchaseRequest.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.purchaseRequest.findMany({
      where: { status: { in: ["WAITING", "PROCESSING"] } },
      orderBy: [{ followUpAt: "asc" }, { updatedAt: "asc" }],
      take: 20,
      select: { id: true, reference: true, customerName: true, status: true, assignedUserId: true, assignedUser: { select: { name: true } }, followUpAt: true, createdAt: true, updatedAt: true },
    }),
    prisma.purchaseRequest.count({ where: { status: { in: ["WAITING", "PROCESSING"] }, followUpAt: { lt: now } } }),
    prisma.purchaseRequest.count({ where: { status: { in: ["WAITING", "PROCESSING"] }, assignedUserId: null } }),
    queryMediaOperationBoardProjection(prisma, { page: 1, pageSize: 100 }),
    listTechnicalIssueBoardWorkspaceProjection(prisma, { page: 1, pageSize: 100 }),
    prisma.order.count({ where: { status: "COMPLETED", updatedAt: { gte: sevenDaysAgo } } }),
    prisma.payment.groupBy({
      by: ["acquisition_id"],
      where: { type: "ACQUISITION", direction: "OUT", status: "UNPAID", acquisition_id: { not: null } },
      _sum: { amount: true },
    }),
  ]);

  const mediaActiveRows = media.rows.filter((row) => row.stage !== "DONE");
  const mediaNotStarted = mediaActiveRows.filter((row) => !row.mediaWorkProgress || row.mediaWorkProgress.completed <= 0).length;
  const mediaStale = mediaActiveRows.filter((row) => ageInDays(row.updatedAt, now) >= 7).length;
  const mediaVeryStale = mediaActiveRows.filter((row) => ageInDays(row.updatedAt, now) >= 30).length;
  const technicalOverdue = technical.rows.filter((row) => Number(row.overdueDays ?? 0) > 0).length;
  const overdueRequests = purchaseRequests.filter((request) => request.followUpAt && request.followUpAt < now);

  const purchase = new Map(purchaseRequestCounts.map((row) => [String(row.status), row._count._all]));
  const orderCounts = orders.counts;
  const queues: OperationsDashboardQueue[] = [
    {
      key: "orders",
      label: "Đơn hàng cần theo dõi",
      description: "Đơn cần xử lý, còn tiền phải thu hoặc đang chờ giao.",
      href: "/admin/orders?view=need_action",
      activeCount: Number(orderCounts.need_action ?? 0) + Number(orderCounts.processing ?? 0),
      actionLabel: "Xử lý đơn hàng",
      insights: [
        { key: "remaining-payment", label: "Còn phải thu", count: Number(orderCounts.processingSub?.remaining_payment ?? 0) + Number(orderCounts.processingSub?.delivered_remaining ?? 0), href: "/admin/orders?view=processing&subFilter=remaining_payment", severity: "risk" },
        { key: "awaiting-shipment", label: "Chờ tạo/giao hàng", count: Number(orderCounts.processingSub?.awaiting_shipment ?? 0), href: "/admin/orders?view=processing&subFilter=awaiting_shipment", severity: "attention" },
      ],
      stages: [
        { key: "need-action", label: "Cần xử lý", actionLabel: "Xử lý", count: Number(orderCounts.need_action ?? 0), href: "/admin/orders?view=need_action" },
        { key: "remaining-payment", label: "Còn phải thu", actionLabel: "Thu tiền", count: Number(orderCounts.processingSub?.remaining_payment ?? 0), href: "/admin/orders?view=processing&subFilter=remaining_payment" },
        { key: "awaiting-shipment", label: "Chờ giao", actionLabel: "Giao hàng", count: Number(orderCounts.processingSub?.awaiting_shipment ?? 0), href: "/admin/orders?view=processing&subFilter=awaiting_shipment" },
      ],
    },
    {
      key: "purchase-requests",
      label: "Yêu cầu xử lý đơn hàng",
      description: "Yêu cầu từ storefront đang chờ tiếp nhận hoặc đang được tư vấn.",
      href: "/admin/coordination/operation?view=purchase-request-operation-flow&flowStage=purchase-request-waiting",
      activeCount: count(purchase, "WAITING") + count(purchase, "PROCESSING"),
      actionLabel: "Xử lý yêu cầu",
      insights: [
        { key: "overdue", label: "Follow-up quá hạn", count: overdueRequestCount, href: "/admin/coordination/operation?view=purchase-request-operation-flow&flowStage=purchase-request-processing", severity: "risk" },
        { key: "unassigned", label: "Chưa có người nhận", count: unassignedRequestCount, href: "/admin/coordination/operation?view=purchase-request-operation-flow&flowStage=purchase-request-waiting", severity: "attention" },
      ],
      stages: [
        { key: "waiting", label: "Chờ xử lý", actionLabel: "Phân công", count: count(purchase, "WAITING"), href: "/admin/coordination/operation?view=purchase-request-operation-flow&flowStage=purchase-request-waiting" },
        { key: "processing", label: "Đang xử lý", actionLabel: "Tiếp tục", count: count(purchase, "PROCESSING"), href: "/admin/coordination/operation?view=purchase-request-operation-flow&flowStage=purchase-request-processing" },
      ],
    },
    {
      key: "media",
      label: "Watch trong Media",
      description: "Watch còn nằm trong quy trình chụp, xử lý ảnh hoặc xuất bản.",
      href: "/admin/coordination/operation?view=media-production-flow&flowStage=photography",
      activeCount: count(media.totals, "PHOTOGRAPHY") + count(media.totals, "MEDIA_PROCESSING") + count(media.totals, "PUBLISH"),
      actionLabel: "Xử lý Media",
      insights: [
        { key: "not-started", label: "Chưa bắt đầu", count: mediaNotStarted, href: "/admin/coordination/operation?view=media-production-flow&flowStage=media-processing", severity: "attention" },
        { key: "stale", label: "Im quá 7 ngày", count: mediaStale, href: "/admin/coordination/operation?view=media-production-flow&flowStage=media-processing", severity: "attention" },
        { key: "very-stale", label: "Kẹt quá 30 ngày", count: mediaVeryStale, href: "/admin/coordination/operation?view=media-production-flow&flowStage=media-processing", severity: "risk" },
      ],
      stages: [
        { key: "photography", label: "Photography", actionLabel: "Chụp ảnh", count: count(media.totals, "PHOTOGRAPHY"), href: "/admin/coordination/operation?view=media-production-flow&flowStage=photography" },
        { key: "media-processing", label: "Media Processing", actionLabel: "Xử lý ảnh", count: count(media.totals, "MEDIA_PROCESSING"), href: "/admin/coordination/operation?view=media-production-flow&flowStage=media-processing" },
        { key: "publish", label: "Publish", actionLabel: "Xuất bản", count: count(media.totals, "PUBLISH"), href: "/admin/coordination/operation?view=media-production-flow&flowStage=publish" },
      ],
    },
    {
      key: "technical",
      label: "Watch trong Technical",
      description: "Hạng mục kỹ thuật cần kiểm tra, xác nhận hoặc đang thực hiện.",
      href: "/admin/coordination/operation?view=technical-issue-flow&flowStage=inspect",
      activeCount: count(technical.totals, "INSPECT") + count(technical.totals, "READY") + count(technical.totals, "PROCESSING"),
      actionLabel: "Xử lý kỹ thuật",
      insights: [
        { key: "overdue", label: "Đã quá hạn", count: technicalOverdue, href: "/admin/coordination/operation?view=technical-issue-flow&flowStage=processing", severity: "risk" },
        { key: "waiting-inspect", label: "Chờ kiểm tra", count: count(technical.totals, "INSPECT"), href: "/admin/coordination/operation?view=technical-issue-flow&flowStage=inspect", severity: "attention" },
      ],
      stages: [
        { key: "inspect", label: "Kiểm tra", actionLabel: "Kiểm tra", count: count(technical.totals, "INSPECT"), href: "/admin/coordination/operation?view=technical-issue-flow&flowStage=inspect" },
        { key: "ready", label: "Sẵn sàng xử lý", actionLabel: "Bắt đầu", count: count(technical.totals, "READY"), href: "/admin/coordination/operation?view=technical-issue-flow&flowStage=ready" },
        { key: "processing", label: "Đang xử lý", actionLabel: "Tiếp tục", count: count(technical.totals, "PROCESSING"), href: "/admin/coordination/operation?view=technical-issue-flow&flowStage=processing" },
      ],
    },
  ];

  const receivable = processingOrders.items.reduce((sum, order) => sum + Math.max(0, Number(order.remainingAmount ?? 0)), 0);
  const receivableOrderCount = processingOrders.items.filter((order) => Number(order.remainingAmount ?? 0) > 0).length;
  const payable = acquisitionPayables.reduce((sum, row) => sum + Number(row._sum.amount ?? 0), 0);
  const payableAcquisitionCount = acquisitionPayables.length;
  const metrics: OperationsDashboardMetric[] = [
    { key: "receivable", label: "Tiền còn phải thu", value: receivable, valueType: "currency", helper: `${receivableOrderCount} đơn còn số dư cần đối soát`, href: "/admin/orders?view=processing&subFilter=remaining_payment", tone: "rose" },
    { key: "payable", label: "Tiền cần phải trả", value: payable, valueType: "currency", helper: `${payableAcquisitionCount} phiếu nhập chưa thanh toán đủ`, href: "/admin/acquisitions?view=posted", tone: "amber" },
    { key: "overdue", label: "Follow-up quá hạn", value: overdueRequestCount, valueType: "count", helper: "Yêu cầu khách hàng đã qua lịch hẹn", href: "/admin/coordination/operation?view=purchase-request-operation-flow&flowStage=purchase-request-processing", tone: "amber" },
    { key: "unassigned", label: "Chưa có người nhận", value: unassignedRequestCount, valueType: "count", helper: "Yêu cầu mua hàng đang mở", href: "/admin/coordination/operation?view=purchase-request-operation-flow&flowStage=purchase-request-waiting", tone: "violet" },
    { key: "completed", label: "Hoàn tất 7 ngày", value: completedOrders, valueType: "count", helper: "Đơn hàng đã hoàn tất gần đây", href: "/admin/orders?view=completed", tone: "emerald" },
  ];

  const attention: OperationsDashboardAttentionItem[] = [];
  for (const request of overdueRequests.slice(0, 3)) {
    const overdueDays = Math.max(1, ageInDays(request.followUpAt, now));
    attention.push({ id: `pr-${request.id}`, domain: "PURCHASE_REQUEST", title: request.customerName || "Yêu cầu mua hàng", reference: request.reference, reason: `Follow-up quá hạn ${overdueDays} ngày`, ageLabel: ageLabel(ageInDays(request.updatedAt, now)), ownerLabel: request.assignedUser?.name || "Chưa phân công", actionLabel: "Mở yêu cầu", href: `/admin/coordination/operation?view=purchase-request-operation-flow&flowStage=purchase-request-${String(request.status).toLowerCase()}`, tone: "rose" });
  }
  for (const item of technical.rows.filter((row) => Number(row.overdueDays ?? 0) > 0).slice(0, 2)) {
    attention.push({ id: `technical-${item.id}`, domain: "TECHNICAL", title: item.serviceRequest.productTitle || item.summary, reference: item.serviceRequest.refNo, reason: `Kỹ thuật quá hạn ${item.overdueDays} ngày`, ageLabel: ageLabel(ageInDays(item.updatedAt, now)), ownerLabel: "Chưa phân công", actionLabel: "Kiểm tra kỹ thuật", href: `/admin/coordination/operation?view=technical-issue-flow&flowStage=${item.stage.toLowerCase()}`, tone: "rose" });
  }
  for (const item of media.rows.filter((row) => row.stage !== "DONE" && ageInDays(row.updatedAt, now) >= 3).slice(0, 3)) {
    attention.push({ id: `media-${item.id}`, domain: "MEDIA", title: item.title, reference: item.sku, reason: `Không cập nhật ${ageInDays(item.updatedAt, now)} ngày`, ageLabel: ageLabel(ageInDays(item.updatedAt, now)), ownerLabel: "Chưa phân công", actionLabel: item.stage === "MEDIA_PROCESSING" ? "Xử lý ảnh" : "Mở Media", href: `/admin/coordination/operation?view=media-production-flow&flowStage=${item.stage.toLowerCase().replace("_", "-")}`, tone: "amber" });
  }

  const allStages = queues.flatMap((queue) => queue.stages.map((stage) => ({ ...stage, queueLabel: queue.label })));
  const largestStage = allStages.reduce<(typeof allStages)[number] | null>((largest, stage) => !largest || stage.count > largest.count ? stage : largest, null);
  const totalActive = queues.reduce((sum, queue) => sum + queue.activeCount, 0);
  const bottleneck = largestStage && largestStage.count > 0 ? {
    label: largestStage.label,
    count: largestStage.count,
    queueLabel: largestStage.queueLabel,
    href: largestStage.href,
    share: totalActive > 0 ? Math.round((largestStage.count / totalActive) * 100) : 0,
  } : null;

  const visibleAttention = attention.slice(0, 6);
  return { generatedAt: now.toISOString(), totalActive, metrics, bottleneck, attention: visibleAttention, priorityAction: visibleAttention[0] ?? null, queues };
}
