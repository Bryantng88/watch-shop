import { WorkflowActionType } from "@prisma/client";

export type WorkflowEventTargetType =
  | "WATCH"
  | "ORDER"
  | "SHIPMENT"
  | "PAYMENT"
  | "SERVICE_REQUEST"
  | "TECHNICAL_ISSUE"
  | "ACQUISITION"
  | "WORK_CASE"
  | "GENERAL";

export type WorkflowEventDefinition = {
  key: string;
  label: string;
  targetType: WorkflowEventTargetType;
  group: string;
  description?: string;
};

export const WORKFLOW_EVENTS: WorkflowEventDefinition[] = [
  {
    key: "watch.content.approved",
    label: "Watch đã duyệt nội dung",
    targetType: "WATCH",
    group: "Watch",
  },
  {
    key: "watch.image.approved",
    label: "Watch đã duyệt hình ảnh",
    targetType: "WATCH",
    group: "Watch",
  },
  {
    key: "watch.content.modified",
    label: "Watch đã sửa nội dung",
    targetType: "WATCH",
    group: "Watch",
  },
  {
    key: "watch.ready",
    label: "Watch sẵn sàng bán",
    targetType: "WATCH",
    group: "Watch",
  },
  {
    key: "watch.saleStage.posted",
    label: "Watch đã post",
    targetType: "WATCH",
    group: "Watch",
  },
  {
    key: "watch.sold",
    label: "Watch đã bán",
    targetType: "WATCH",
    group: "Watch",
  },
  {
    key: "order.posted",
    label: "Order đã post",
    targetType: "ORDER",
    group: "Order",
  },
  {
    key: "order.paid",
    label: "Order đã thanh toán",
    targetType: "ORDER",
    group: "Order",
  },
  {
    key: "order.completed",
    label: "Order hoàn tất",
    targetType: "ORDER",
    group: "Order",
  },
  {
    key: "shipment.delivered",
    label: "Shipment đã giao thành công",
    targetType: "SHIPMENT",
    group: "Shipment",
  },
  {
    key: "shipment.returned",
    label: "Shipment đã hoàn trả",
    targetType: "SHIPMENT",
    group: "Shipment",
  },
  {
    key: "payment.paid",
    label: "Payment đã thanh toán",
    targetType: "PAYMENT",
    group: "Payment",
  },
  {
    key: "service_request.completed",
    label: "Service request hoàn tất",
    targetType: "SERVICE_REQUEST",
    group: "Service",
  },
  {
    key: "technical_issue.done",
    label: "Technical issue hoàn tất",
    targetType: "TECHNICAL_ISSUE",
    group: "Service",
  },
];

export const WORKFLOW_ACTIONS = [
  {
    key: WorkflowActionType.COMPLETE_TASK_ITEM,
    label: "Hoàn tất Task Item",
    description: "Đánh dấu Task Item là DONE khi workflow đủ điều kiện.",
  },
];

export function normalizeWorkflowEventKey(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
}

export function getWorkflowEventDefinition(key: unknown) {
  const normalized = normalizeWorkflowEventKey(key);
  return WORKFLOW_EVENTS.find((event) => event.key === normalized) ?? null;
}
