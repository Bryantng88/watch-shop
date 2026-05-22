import type {
  AdminDashboardData,
  DashboardPipelineItem,
  DashboardRecentItem,
} from "../shared";
import { getDashboardOverviewRepo } from "./dashboard.repo";

function num(map: Map<string, number>, key: string) {
  return map.get(String(key).toUpperCase()) ?? 0;
}

function iso(value?: Date | string | null) {
  if (!value) return undefined;
  return new Date(value).toISOString();
}

function orderProcessingCount(map: Map<string, number>) {
  return num(map, "POSTED") + num(map, "PROCESSING") + num(map, "PAID") + num(map, "SHIPPED") + num(map, "RESERVED");
}

function buildRecentItems(input: Awaited<ReturnType<typeof getDashboardOverviewRepo>>): DashboardRecentItem[] {
  const orders: DashboardRecentItem[] = input.recentOrders.map((row) => ({
    id: `order-${row.id}`,
    type: "ORDER",
    title: row.refNo || row.id,
    subtitle: `${row.customerName || "Khách hàng"} · ${row.status || "-"}`,
    href: `/admin/orders/${row.id}`,
    updatedAt: iso(row.updatedAt),
  }));

  const shipments: DashboardRecentItem[] = input.recentShipments.map((row) => ({
    id: `shipment-${row.id}`,
    type: "SHIPMENT",
    title: row.refNo || row.id,
    subtitle: `${row.customerName || row.orderRefNo || "Shipment"} · ${row.status || "-"}`,
    href: "/admin/shipments",
    updatedAt: iso(row.updatedAt),
  }));

  const watches: DashboardRecentItem[] = input.recentWatches.map((row) => ({
    id: `watch-${row.id}`,
    type: "WATCH",
    title: row.product?.title || row.product?.sku || row.productId,
    subtitle: `Watch · ${row.saleStage || "-"}`,
    href: `/admin/watches/${row.productId}/edit`,
    updatedAt: iso(row.updatedAt),
  }));

  const acquisitions: DashboardRecentItem[] = input.recentAcquisitions.map((row) => ({
    id: `acquisition-${row.id}`,
    type: "ACQUISITION",
    title: row.refNo || row.id,
    subtitle: `${row.vendor?.name || "Nguồn hàng"} · ${row.accquisitionStt || "-"}`,
    href: "/admin/acquisitions",
    updatedAt: iso(row.updatedAt),
  }));

  return [...orders, ...shipments, ...watches, ...acquisitions]
    .sort((a, b) => new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime())
    .slice(0, 10);
}

export async function getAdminDashboardService(): Promise<AdminDashboardData> {
  const data = await getDashboardOverviewRepo();

  const watchTotal = Array.from(data.watchStageMap.values()).reduce((sum, value) => sum + value, 0);
  const shipmentTotal = Array.from(data.shipmentStatusMap.values()).reduce((sum, value) => sum + value, 0);
  const acquisitionTotal = Array.from(data.acquisitionStatusMap.values()).reduce((sum, value) => sum + value, 0);

  const orderNeedAction = num(data.orderStatusMap, "DRAFT") + num(data.orderStatusMap, "POSTED") + num(data.orderStatusMap, "RESERVED");

  const watchPipeline: DashboardPipelineItem[] = [
    { key: "draft", label: "Draft", value: num(data.watchStageMap, "DRAFT"), href: "/admin/watches?view=draft", tone: "slate" },
    { key: "processing", label: "Processing", value: num(data.watchStageMap, "PROCESSING"), href: "/admin/watches?view=processing", tone: "amber" },
    { key: "ready", label: "Ready", value: num(data.watchStageMap, "READY"), href: "/admin/watches?view=ready", tone: "blue" },
    { key: "hold", label: "Hold", value: num(data.watchStageMap, "HOLD"), href: "/admin/watches?view=hold", tone: "violet" },
    { key: "sold", label: "Sold", value: num(data.watchStageMap, "SOLD"), href: "/admin/watches?view=sold", tone: "emerald" },
  ];

  const orderPipeline: DashboardPipelineItem[] = [
    { key: "draft", label: "Nháp", value: num(data.orderStatusMap, "DRAFT"), href: "/admin/orders?view=need_action", tone: "amber" },
    { key: "processing", label: "Đang xử lý", value: orderProcessingCount(data.orderStatusMap), href: "/admin/orders?view=processing", tone: "blue" },
    { key: "completed", label: "Hoàn tất", value: num(data.orderStatusMap, "COMPLETED"), href: "/admin/orders?view=completed", tone: "emerald" },
    { key: "cancelled", label: "Đã huỷ", value: num(data.orderStatusMap, "CANCELLED"), href: "/admin/orders?view=cancelled", tone: "slate" },
  ];

  const shipmentPipeline: DashboardPipelineItem[] = [
    { key: "ready", label: "Chờ giao", value: num(data.shipmentStatusMap, "READY"), href: "/admin/shipments?view=ready", tone: "blue" },
    { key: "shipped", label: "Đang giao", value: num(data.shipmentStatusMap, "SHIPPED"), href: "/admin/shipments?view=shipped", tone: "amber" },
    { key: "delivered", label: "Đã giao", value: num(data.shipmentStatusMap, "DELIVERED"), href: "/admin/shipments?view=delivered", tone: "emerald" },
    { key: "returned", label: "Hoàn trả", value: num(data.shipmentStatusMap, "RETURNED"), href: "/admin/shipments?view=returned", tone: "rose" },
  ];

  const acquisitionPipeline: DashboardPipelineItem[] = [
    { key: "draft", label: "Draft", value: num(data.acquisitionStatusMap, "DRAFT"), href: "/admin/acquisitions?view=draft", tone: "slate" },
    { key: "posted", label: "Posted", value: num(data.acquisitionStatusMap, "POSTED"), href: "/admin/acquisitions?view=posted", tone: "emerald" },
    { key: "cancelled", label: "Canceled", value: num(data.acquisitionStatusMap, "CANCELED") + num(data.acquisitionStatusMap, "CANCELLED"), href: "/admin/acquisitions?view=canceled", tone: "rose" },
  ];

  return {
    generatedAt: new Date().toISOString(),
    metrics: [
      { key: "watch-ready", label: "Watch ready", value: num(data.watchStageMap, "READY"), helper: "Sẵn sàng bán", href: "/admin/watches?view=ready", tone: "blue" },
      { key: "order-action", label: "Đơn cần xử lý", value: orderNeedAction, helper: "Nháp, đã post hoặc đang giữ", href: "/admin/orders?view=need_action", tone: "amber" },
      { key: "shipment-active", label: "Shipment active", value: num(data.shipmentStatusMap, "READY") + num(data.shipmentStatusMap, "SHIPPED"), helper: "Chờ giao + đang giao", href: "/admin/shipments", tone: "blue" },
      { key: "remaining", label: "Còn phải thu", value: data.finance.remainingAmount, helper: "Ước tính theo payment đã ghi nhận", href: "/admin/orders?view=processing", tone: "rose", format: "money" },
    ],
    watch: {
      total: watchTotal,
      pipeline: watchPipeline,
      readiness: [
        { key: "missing-content", label: "Thiếu content", value: data.watchReview.missingContent, href: "/admin/watches?view=processing&subFilter=MISSING_CONTENT", tone: "amber" },
        { key: "missing-image", label: "Thiếu ảnh", value: data.watchReview.missingImage, href: "/admin/watches?view=processing&subFilter=MISSING_IMAGE", tone: "amber" },
        { key: "submitted", label: "Chờ duyệt", value: data.watchReview.submitted, href: "/admin/watches?view=ready&subFilter=REVIEW_SUBMITTED", tone: "amber" },
        { key: "partial", label: "Duyệt 1 phần", value: data.watchReview.partialApproved, href: "/admin/watches?view=ready&subFilter=PARTIAL_APPROVED", tone: "blue" },
        { key: "approved", label: "Đã duyệt", value: data.watchReview.approved, href: "/admin/watches?view=ready&subFilter=APPROVED", tone: "emerald" },
        { key: "posted", label: "Đã đăng", value: data.watchReview.posted, href: "/admin/watches?view=ready&subFilter=POSTED", tone: "violet" },
      ],
    },
    order: {
      total: data.orderTotal,
      pipeline: orderPipeline,
      actions: [
        { key: "need-action", label: "Đơn cần xử lý", value: orderNeedAction, href: "/admin/orders?view=need_action", tone: "amber" },
        { key: "processing", label: "Đơn đang xử lý", value: orderProcessingCount(data.orderStatusMap), href: "/admin/orders?view=processing", tone: "blue" },
        { key: "remaining", label: "Còn phải thu", value: data.finance.remainingAmount, helper: "Tổng tiền còn thu ước tính", href: "/admin/orders?view=processing&subFilter=remaining_payment", tone: "rose", format: "money" },
      ],
    },
    shipment: {
      total: shipmentTotal,
      pipeline: shipmentPipeline,
      actions: [
        { key: "no-tracking", label: "Thiếu tracking", value: data.shipmentOps.noTracking, href: "/admin/shipments", tone: "amber" },
        { key: "cod-pending", label: "COD cần xác nhận", value: data.shipmentOps.codPending, href: "/admin/shipments?view=delivered", tone: "rose" },
      ],
    },
    acquisition: {
      total: acquisitionTotal,
      pipeline: acquisitionPipeline,
    },
    finance: data.finance,
    recent: buildRecentItems(data),
  };
}
