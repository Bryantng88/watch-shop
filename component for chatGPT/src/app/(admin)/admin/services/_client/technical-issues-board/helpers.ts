export function fmtDT(s?: string | null) {
  if (!s) return "-";
  const d = new Date(s);
  if (!Number.isFinite(d.getTime())) return "-";
  return d.toLocaleString("vi-VN");
}

export function fmtMoney(v?: number | null) {
  if (v == null || !Number.isFinite(Number(v))) return "0đ";
  return `${Number(v).toLocaleString("vi-VN")}đ`;
}

export function areaLabel(area?: string | null) {
  const raw = String(area || "").toUpperCase();
  if (raw === "MOVEMENT") return "Máy";
  if (raw === "CASE") return "Vỏ";
  if (raw === "CRYSTAL") return "Kính";
  if (raw === "DIAL") return "Mặt số";
  if (raw === "CROWN") return "Núm";
  return raw || "-";
}

export function actionModeLabel(mode?: string | null) {
  const raw = String(mode || "").toUpperCase();
  if (raw === "INTERNAL" || raw === "INHOUSE") return "Nội bộ";
  if (raw === "VENDOR") return "Vendor";
  return raw || "-";
}

export function statusLabel(status?: string | null) {
  const raw = String(status || "").toUpperCase();
  if (raw === "OPEN") return "Đang mở";
  if (raw === "IN_PROGRESS") return "Đang xử lý";
  if (raw === "DONE" || raw === "COMPLETED") return "Hoàn tất";
  if (raw === "CANCELED" || raw === "CANCELLED") return "Đã hủy";
  return raw || "-";
}

export function normalizeText(v: unknown) {
  return String(v ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}
