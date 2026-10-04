import type {
  WatchDecisionAction,
  WatchDecisionSnapshot,
  WatchDecisionStatus,
} from "./watch-decision.types";

type SnapshotParts = Omit<WatchDecisionSnapshot, "progress" | "decision">;

const STATUS_LABEL: Record<WatchDecisionStatus, string> = {
  BLOCKED: "Đang bị chặn",
  NEEDS_SERVICE_DECISION: "Cần quyết định service",
  NEEDS_PRICING: "Cần hoàn thiện giá",
  NEEDS_MEDIA: "Cần hoàn thiện media",
  NEEDS_CONTENT: "Cần hoàn thiện content",
  WAITING_REVIEW: "Đang chờ duyệt",
  READY_TO_PUBLISH: "Sẵn sàng đăng",
  PUBLISHED: "Đã đăng storefront",
};

function action(key: string, label: string, productId: string, tone: WatchDecisionAction["tone"] = "primary") {
  return { key, label, href: `/admin/watches/${productId}/edit`, tone } satisfies WatchDecisionAction;
}

export function buildWatchDecision(parts: SnapshotParts): Pick<WatchDecisionSnapshot, "progress" | "decision"> {
  const blockers: string[] = [];
  const warnings: string[] = [];
  const actions: WatchDecisionAction[] = [];

  if (!parts.service.ready) {
    blockers.push(parts.service.requestStatus === "WAIT_APPROVAL"
      ? "Phiếu service đang chờ quyết định."
      : `Service chưa hoàn tất${parts.service.openIssueCount ? `, còn ${parts.service.openIssueCount} vấn đề mở` : ""}.`);
    actions.push(action("OPEN_SERVICE", "Xử lý service", parts.productId, "warning"));
  }

  if (!parts.pricing.ready) {
    blockers.push(!parts.pricing.salePrice ? "Chưa có giá bán." : "Chưa đủ giá vốn hoặc giá sàn để ra quyết định.");
    actions.push(action("SET_PRICE", "Hoàn thiện giá", parts.productId, "warning"));
  } else if (parts.pricing.maxDiscountAmount === 0) {
    warnings.push("Giá bán đã chạm giá sàn, không nên giảm thêm.");
  } else if (parts.pricing.canDiscount && parts.pricing.maxDiscountAmount != null) {
    warnings.push("Watch còn khoảng giảm giá trong giới hạn giá sàn.");
  }

  if (!parts.media.ready) {
    if (!parts.media.galleryCount) blockers.push("Chưa có ảnh Gallery.");
    else if (parts.media.missingCount) blockers.push(`Có ${parts.media.missingCount} ảnh media không khả dụng.`);
    else if (!parts.media.hasCover) blockers.push("Chưa có Cover storefront.");
    else blockers.push(`Hình ảnh đang ở trạng thái ${parts.media.reviewStatus}.`);
    actions.push(action("OPEN_MEDIA", "Xử lý media", parts.productId, "warning"));
  }

  if (!parts.content.ready) {
    blockers.push(!parts.content.hasContent
      ? "Chưa có nội dung bán hàng."
      : `Content đang ở trạng thái ${parts.content.reviewStatus}.`);
    actions.push(action("OPEN_CONTENT", "Xử lý content", parts.productId, "warning"));
  }

  if (parts.storefront.published && blockers.length) {
    warnings.unshift("Watch đang hiển thị trên storefront nhưng hồ sơ hiện tại chưa đủ điều kiện sẵn sàng.");
  }

  let status: WatchDecisionStatus;
  if (!parts.service.ready) status = parts.service.requestStatus === "WAIT_APPROVAL" ? "NEEDS_SERVICE_DECISION" : "BLOCKED";
  else if (!parts.pricing.ready) status = "NEEDS_PRICING";
  else if (!parts.media.galleryCount || !parts.media.hasCover || parts.media.missingCount > 0) status = "NEEDS_MEDIA";
  else if (!parts.content.hasContent) status = "NEEDS_CONTENT";
  else if (!parts.media.ready || !parts.content.ready) status = "WAITING_REVIEW";
  else if (parts.storefront.published) status = "PUBLISHED";
  else status = "READY_TO_PUBLISH";

  if (status === "READY_TO_PUBLISH") {
    actions.push(action("OPEN_STOREFRONT", "Đưa lên storefront", parts.productId));
  }

  const checks = [parts.service.ready, parts.pricing.ready, parts.media.ready, parts.content.ready];
  const progress = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  const recommendedAction = actions[0] ?? null;

  return {
    progress,
    decision: {
      status,
      label: STATUS_LABEL[status],
      summary: blockers[0] ?? (status === "PUBLISHED" ? "Watch đang hiển thị trên storefront." : "Watch đã đủ điều kiện để đăng storefront."),
      blockers,
      warnings,
      allowedActions: actions,
      recommendedAction,
    },
  };
}
