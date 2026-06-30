export type BusinessEventTargetType =
    | "WATCH"
    | "ORDER"
    | "SHIPMENT"
    | "PAYMENT"
    | "SERVICE_REQUEST"
    | "TECHNICAL_ISSUE"
    | "ACQUISITION"
    | "WORK_CASE"
    | "TASK"
    | "TASK_ITEM"
    | "GENERAL";

export type BusinessEventDefinition = {
    key: string;
    label: string;
    targetType: BusinessEventTargetType;
    group: string;
    description?: string;
};

export const BUSINESS_EVENTS: BusinessEventDefinition[] = [
    {
        key: "watch.content.submitted",
        label: "Watch content submitted",
        targetType: "WATCH",
        group: "Watch",
    },
    {
        key: "watch.image.submitted",
        label: "Watch image submitted",
        targetType: "WATCH",
        group: "Watch",
    },
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
    {
        key: "task.item.created",
        label: "Task item được tạo",
        targetType: "GENERAL",
        group: "Task",
    }
];

export function normalizeBusinessEventKey(value: unknown) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9.]+/g, ".")
        .replace(/^\.+|\.+$/g, "");
}

export function getBusinessEventDefinition(key: unknown) {
    const normalized = normalizeBusinessEventKey(key);
    return BUSINESS_EVENTS.find((event) => event.key === normalized) ?? null;
}
