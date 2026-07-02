import type { CoordinationContext } from "./coordination-cycle.types";

export type CoordinationWorkTypeDefinition = {
  key: string;
  title: string;
  context: CoordinationContext;
  sortOrder: number;
  aliases?: string[];
};

const WORK_TYPES: Record<CoordinationContext, CoordinationWorkTypeDefinition[]> = {
  OPERATION: [
    { key: "publish", title: "Đăng bài", context: "OPERATION", sortOrder: 10 },
    {
      key: "review-content",
      title: "Review Content",
      context: "OPERATION",
      sortOrder: 20,
      aliases: ["content-review"],
    },
    {
      key: "review-image",
      title: "Review Image",
      context: "OPERATION",
      sortOrder: 30,
      aliases: ["image-review"],
    },
    { key: "photo-shoot", title: "Chụp hình", context: "OPERATION", sortOrder: 40 },
    { key: "strap-change", title: "Thay dây", context: "OPERATION", sortOrder: 50 },
    { key: "other", title: "Khác", context: "OPERATION", sortOrder: 999 },
  ],
  SALES: [
    { key: "quote", title: "Báo giá", context: "SALES", sortOrder: 10 },
    { key: "price-adjustment", title: "Điều chỉnh giá", context: "SALES", sortOrder: 20 },
    { key: "sale", title: "Sale", context: "SALES", sortOrder: 30 },
    { key: "marketing", title: "Marketing", context: "SALES", sortOrder: 40 },
    { key: "other", title: "Khác", context: "SALES", sortOrder: 999 },
  ],
  TECHNICAL: [
    { key: "inspection", title: "Kiểm tra", context: "TECHNICAL", sortOrder: 10 },
    { key: "repair", title: "Sửa chữa", context: "TECHNICAL", sortOrder: 20 },
    { key: "warranty", title: "Bảo hành", context: "TECHNICAL", sortOrder: 30 },
    { key: "other", title: "Khác", context: "TECHNICAL", sortOrder: 999 },
  ],
  GENERAL: [
    { key: "other", title: "Khác", context: "GENERAL", sortOrder: 999 },
  ],
};

export function listWorkTypes(context: CoordinationContext) {
  return [...WORK_TYPES[context]].sort((left, right) => left.sortOrder - right.sortOrder);
}

export function listAllWorkTypes() {
  return Object.values(WORK_TYPES).flatMap((items) => items);
}

export function getWorkTypeDefinition(
  context: CoordinationContext,
  key: string,
) {
  const normalized = normalizeWorkTypeKey(key);

  return listWorkTypes(context).find((workType) => {
    const aliases = workType.aliases ?? [];

    return (
      workType.key === normalized ||
      aliases.map(normalizeWorkTypeKey).includes(normalized)
    );
  }) ?? null;
}

export function normalizeWorkTypeKey(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
