export type OperationTargetTypeOption = {
  value: string;
  label: string;
  domain: string;
  description: string;
  defaultEventKey: string;
  eventKeys: Array<{
    key: string;
    label: string;
  }>;
  defaultActionKey: string;
  defaultCommand: string;
};

export const OPERATION_TARGET_TYPE_OPTIONS: OperationTargetTypeOption[] = [
  {
    value: "WATCH",
    label: "Đồng hồ / sản phẩm",
    domain: "Watch / Media",
    description:
      "Object chính của flow media hiện tại: review nội dung, hình ảnh, photoshoot hoặc publish cho một watch.",
    defaultEventKey: "watch.media.photoshoot.requested",
    eventKeys: [
      { key: "watch.media.photoshoot.requested", label: "Yêu cầu photoshoot" },
      { key: "watch.media.photoshoot.completed", label: "Photoshoot hoàn tất" },
      { key: "watch.media.asset.attached", label: "Media asset đã gắn vào watch" },
      { key: "watch.content.submitted", label: "Gửi duyệt nội dung" },
      { key: "watch.content.approved", label: "Duyệt nội dung" },
      { key: "watch.content.rejected", label: "Trả nội dung" },
      { key: "watch.content.unapproved", label: "Hủy duyệt nội dung" },
      { key: "watch.image.submitted", label: "Gửi duyệt hình ảnh" },
      { key: "watch.image.approved", label: "Duyệt hình ảnh" },
      { key: "watch.image.rejected", label: "Trả hình ảnh" },
      { key: "watch.image.unapproved", label: "Hủy duyệt hình ảnh" },
      { key: "watch.content.modified", label: "Nội dung watch được sửa" },
      { key: "watch.media.ready_for_publish", label: "Media sẵn sàng publish" },
      { key: "watch.media.recalled", label: "Thu hồi media khỏi publish" },
      { key: "watch.publish.assets.downloaded", label: "Tải asset publish" },
      { key: "watch.saleStage.posted", label: "Watch chuyển sang posted" },
      { key: "watch.sold", label: "Watch đã bán" },
    ],
    defaultActionKey: "review_watch",
    defaultCommand: "domain.reviewWatch",
  },
  {
    value: "ORDER",
    label: "Đơn hàng",
    domain: "Order",
    description: "Đơn hàng cần theo dõi, xử lý hoặc điều phối qua Workspace.",
    defaultEventKey: "order.posted",
    eventKeys: [
      { key: "order.posted", label: "Đơn hàng được posted" },
      { key: "order.paid", label: "Đơn hàng đã thanh toán" },
      { key: "order.completed", label: "Đơn hàng hoàn tất" },
    ],
    defaultActionKey: "review_order",
    defaultCommand: "domain.reviewOrder",
  },
  {
    value: "SHIPMENT",
    label: "Vận chuyển",
    domain: "Shipment",
    description: "Shipment cần xử lý giao hàng, hoàn hàng hoặc các bước vận hành liên quan.",
    defaultEventKey: "shipment.delivered",
    eventKeys: [
      { key: "shipment.delivered", label: "Giao hàng thành công" },
      { key: "shipment.returned", label: "Shipment bị hoàn" },
    ],
    defaultActionKey: "review_shipment",
    defaultCommand: "domain.reviewShipment",
  },
  {
    value: "PAYMENT",
    label: "Thanh toán",
    domain: "Payment",
    description: "Payment cần kiểm tra, xác nhận hoặc cập nhật trạng thái thanh toán.",
    defaultEventKey: "payment.created",
    eventKeys: [
      { key: "payment.created", label: "Payment được tạo" },
      { key: "payment.paid", label: "Payment đã thanh toán" },
      { key: "payment.status_updated", label: "Cập nhật trạng thái payment" },
    ],
    defaultActionKey: "review_payment",
    defaultCommand: "domain.reviewPayment",
  },
  {
    value: "SERVICE_REQUEST",
    label: "Yêu cầu dịch vụ",
    domain: "Service",
    description: "Service request là yêu cầu sửa chữa hoặc hỗ trợ cần điều phối trong Workspace.",
    defaultEventKey: "service_request.created",
    eventKeys: [
      { key: "service_request.created", label: "Service request được tạo" },
      { key: "service_request.status_changed", label: "Service request đổi trạng thái" },
      { key: "service_request.completed", label: "Service request hoàn tất" },
    ],
    defaultActionKey: "review_service_request",
    defaultCommand: "domain.reviewServiceRequest",
  },
  {
    value: "TECHNICAL_ISSUE",
    label: "Lỗi kỹ thuật",
    domain: "Service",
    description: "Technical issue phát sinh từ service request và cần xử lý trong flow kỹ thuật.",
    defaultEventKey: "technical_issue.created",
    eventKeys: [
      { key: "technical_issue.created", label: "Technical issue được tạo" },
      { key: "technical_issue.confirmed", label: "Technical issue được xác nhận" },
      { key: "technical_issue.started", label: "Bắt đầu xử lý technical issue" },
      { key: "technical_issue.completed", label: "Technical issue hoàn tất" },
      { key: "technical_issue.reopened", label: "Technical issue mở lại" },
      { key: "technical_issue.done", label: "Technical issue done" },
    ],
    defaultActionKey: "review_technical_issue",
    defaultCommand: "domain.reviewTechnicalIssue",
  },
  {
    value: "TASK_ITEM",
    label: "Task item",
    domain: "Task",
    description: "Task item nội bộ dùng khi operation muốn vận hành trực tiếp trên việc nhỏ.",
    defaultEventKey: "task.item.created",
    eventKeys: [
      { key: "task.item.created", label: "Task item được tạo" },
      { key: "task.item.moved", label: "Task item được chuyển" },
      { key: "task.item.activity.commented", label: "Task item có bình luận" },
    ],
    defaultActionKey: "review_task_item",
    defaultCommand: "domain.reviewTaskItem",
  },
];

export const DEFAULT_OPERATION_TARGET_TYPE = "WATCH";

export function operationTargetTypeOption(
  value: string | null | undefined,
): OperationTargetTypeOption | null {
  const normalized = String(value ?? "").trim().toUpperCase();

  return (
    OPERATION_TARGET_TYPE_OPTIONS.find((option) => option.value === normalized) ?? null
  );
}

export function operationTargetTypeSelectOptions(currentValue?: string | null): string[] {
  const options = OPERATION_TARGET_TYPE_OPTIONS.map((option) => option.value);
  const current = String(currentValue ?? "").trim();

  if (!current || options.includes(current)) return options;

  return [current, ...options];
}

export function operationEventOptionsForTargetType(targetType: string | null | undefined) {
  return operationTargetTypeOption(targetType)?.eventKeys ?? [];
}
