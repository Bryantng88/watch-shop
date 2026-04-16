import type { ProductRow } from "./types";

export function fmtMoney(n?: number | null) {
  if (n == null) return "-";
  return new Intl.NumberFormat("vi-VN").format(Number(n));
}

export function fmtDT(s?: string | null) {
  if (!s) return "-";
  const d = new Date(s);
  if (!Number.isFinite(d.getTime())) return "-";
  return d.toLocaleString("vi-VN");
}

export function hasValidPrice(p: ProductRow) {
  const price = Number(p.minPrice ?? 0);
  return Number.isFinite(price) && price > 0;
}

export function hasValidImage(p: ProductRow) {
  const count = Number(p.imagesCount ?? 0);
  if (Number.isFinite(count) && count > 0) return true;
  return typeof p.primaryImageUrl === "string" && p.primaryImageUrl.trim().length > 0;
}

export function hasMissingImageReadiness(p: ProductRow) {
  if ((p.publishMissing ?? []).includes("images")) return true;
  return !hasValidImage(p);
}

export function hasMissingCoreReadinessInfo(p: ProductRow) {
  const missing = new Set(p.publishMissing ?? []);
  if (missing.size > 0) {
    for (const key of missing) if (key !== "images") return true;
    return false;
  }
  return !hasValidPrice(p) || !p.isInfoComplete;
}

export function getCategoryKey(product: ProductRow) {
  const raw =
    typeof product.category === "string"
      ? product.category
      : product.category?.code ?? product.category?.slug ?? product.category?.name ?? null;

  return String(raw || "").trim().toUpperCase();
}

export function isWomenWatch(product: ProductRow) {
  const key = getCategoryKey(product);
  return key === "WOMEN_WATCH" || key === "LADIES_WATCH" || key === "NU_WATCH";
}

export function getDetailedPublishMissing(product: ProductRow) {
  const known = new Set(["images", "brandId", "variant", "watchSpec"]);
  return (product.publishMissing ?? []).filter((item) => !known.has(item));
}

export function getQuickFixHints(p: ProductRow) {
  const hints: string[] = [];
  const missing = new Set(p.publishMissing ?? []);

  if (missing.has("images") || (!p.publishMissing && !hasValidImage(p))) {
    hints.push("Bổ sung đủ ảnh sản phẩm ở cột ảnh bên trái hoặc trong trang edit.");
  }
  if (missing.has("brandId")) {
    hints.push("Chọn thương hiệu trong trang chỉnh sửa sản phẩm.");
  }
  if (missing.has("variant") || (!p.publishMissing && !hasValidPrice(p))) {
    hints.push("Cập nhật giá bán, trạng thái kho hoặc tồn kho của variant.");
  }
  if ((p.publishMissing ?? []).some((field) => !["images", "brandId", "variant"].includes(field)) || !p.isInfoComplete) {
    hints.push("Bổ sung đầy đủ watch spec / variant trong trang chỉnh sửa sản phẩm.");
  }

  return Array.from(new Set(hints));
}

export function getProductInventoryStatusText(status?: string | null) {
  switch (String(status || "").toUpperCase()) {
    case "AVAILABLE": return "Available";
    case "HOLD": return "Giữ hàng";
    case "SOLD": return "Đã bán";
    case "IN_SERVICE": return "In Service";
    case "CONSIGNED_TO": return "Gửi đối tác";
    case "CONSIGNED_FROM": return "Ký gửi";
    case "DRAFT": return "Nháp";
    default: return status || "-";
  }
}

export function getInventoryStatusTextClass(status?: string | null) {
  const s = String(status || "").toUpperCase();
  switch (s) {
    case "AVAILABLE": return "text-sm font-medium text-emerald-700";
    case "IN_SERVICE": return "text-sm font-medium text-amber-700";
    case "HOLD": return "text-sm font-medium text-slate-600";
    case "SOLD": return "text-sm font-medium text-rose-700";
    case "CONSIGNED_TO":
    case "CONSIGNED_FROM": return "text-sm font-medium text-violet-700";
    case "DRAFT": return "text-sm font-medium text-slate-500";
    default: return "text-sm font-medium text-slate-500";
  }
}

export function getContentStatusBadgeValue(p: ProductRow) {
  const current = String(p.contentStatus ?? "").toUpperCase();
  if (current === "PUBLISHED") return "POSTED";
  if (current === "ARCHIVED") return "ARCHIVED";
  return "DRAFT";
}

export function getServiceLabel(p: ProductRow) {
  const current = p.openServiceStatus ?? p.latestServiceStatus ?? null;
  switch (current) {
    case "DRAFT": return { label: "Cần service", tone: "orange" as const };
    case "DIAGNOSING":
    case "WAIT_APPROVAL":
    case "IN_PROGRESS": return { label: "Đang service", tone: "blue" as const };
    case "COMPLETED":
    case "DELIVERED": return { label: "Đã service", tone: "green" as const };
    case "CANCELED": return { label: "Đã hủy service", tone: "gray" as const };
    default: return null;
  }
}

export function getPostReadinessState(product: ProductRow) {
  if (isWomenWatch(product)) return { label: "Post thủ công", tone: "orange" as const };
  if (hasMissingCoreReadinessInfo(product)) return { label: "Missing Info", tone: "orange" as const };
  if (hasMissingImageReadiness(product)) return { label: "Missing Image", tone: "orange" as const };
  return { label: "Ready to post", tone: "green" as const };
}
