export function formatDateTime(value?: string | Date | null) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) return "-";
  return date.toLocaleString("vi-VN");
}

export function formatCurrency(value: number) {
  return `${new Intl.NumberFormat("vi-VN").format(Number(value || 0))}đ`;
}

export function normalizeText(value?: string | null) {
  return String(value || "").trim();
}

export function serviceStatusLabel(status?: string | null) {
  const normalized = String(status || "").toUpperCase();
  const map: Record<string, string> = {
    COMPLETED: "Hoàn tất",
    DELIVERED: "Đã giao",
    IN_PROGRESS: "Đang xử lý",
    DIAGNOSING: "Đang đánh giá",
    WAIT_APPROVAL: "Chờ duyệt",
    PENDING: "Chờ xử lý",
    OPEN: "Đang mở",
    DRAFT: "Nháp",
    CANCELED: "Đã hủy",
  };
  return map[normalized] || normalized || "-";
}

export function serviceScopeLabel(scope?: string | null) {
  const normalized = String(scope || "").toUpperCase();
  const map: Record<string, string> = {
    WITH_PURCHASE: "Kèm mua hàng",
    CUSTOMER_OWNED: "Khách gửi",
    INTERNAL: "Nội bộ",
  };
  return map[normalized] || scope || "-";
}

export function buildServiceImageSrc(value?: string | null) {
  const key = String(value || "").trim();
  if (!key) return null;
  if (key.startsWith("http://") || key.startsWith("https://") || key.startsWith("/")) return key;
  return `/api/media/sign?key=${encodeURIComponent(key)}`;
}

export function buildCompletedSummaryPoints(args: {
  assessment?: any;
  technicalIssues?: any[];
  movementStatus?: string | null;
}) {
  const points: string[] = [];
  const issues = args.technicalIssues ?? [];

  const movementIssues = issues.filter(
    (x) =>
      String(x.area || "").toUpperCase() === "MOVEMENT" &&
      String(x.executionStatus || "").toUpperCase() !== "CANCELED",
  );

  const otherIssues = issues.filter(
    (x) =>
      String(x.area || "").toUpperCase() !== "MOVEMENT" &&
      String(x.executionStatus || "").toUpperCase() !== "CANCELED",
  );

  if (String(args.movementStatus || "").toUpperCase() === "GOOD" && movementIssues.length === 0) {
    points.push("Bộ máy được đánh giá hoạt động tốt, không phát sinh hạng mục xử lý.");
  } else if (movementIssues.length > 0) {
    const labels = movementIssues
      .map((x) => normalizeText(x.summary) || normalizeText(x.note))
      .filter(Boolean)
      .slice(0, 2);
    points.push(labels.length ? `Bộ máy đã được xử lý: ${labels.join(", ")}.` : "Bộ máy đã được ghi nhận issue và xử lý theo phiếu kỹ thuật.");
  }

  const groupedByArea = new Map<string, string[]>();
  for (const issue of otherIssues) {
    const area = String(issue.area || "").toUpperCase();
    const label = normalizeText(issue.summary) || normalizeText(issue.note);
    if (!groupedByArea.has(area)) groupedByArea.set(area, []);
    if (label) groupedByArea.get(area)!.push(label);
  }

  const areaMap: Record<string, string> = {
    CASE: "Vỏ",
    CRYSTAL: "Kính",
    DIAL: "Mặt số",
    CROWN: "Núm",
  };

  for (const [area, labels] of groupedByArea.entries()) {
    if (labels.length) points.push(`${areaMap[area] || area} đã được đánh giá/xử lý: ${labels.slice(0, 2).join(", ")}.`);
  }

  if (!normalizeText(args.assessment?.conclusion) && points.length === 0) {
    points.push("Phiếu service đang ở chế độ xem thông tin. Mở quản lý issue để xử lý nghiệp vụ kỹ thuật.");
  }

  return points;
}
