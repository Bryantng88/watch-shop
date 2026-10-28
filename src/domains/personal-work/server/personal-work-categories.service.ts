import { randomUUID } from "node:crypto";
import { AppTagOwnerType, AppTagTargetType } from "@prisma/client";
import { setTargetTagsRepo } from "@/domains/task/server/core/task.repo";
import { hydrateTaskItemsWithTagsRepo } from "@/domains/task/server/tag/task-tag.repo";
import { prisma } from "@/server/db/client";
import { getAuthUserId } from "@/domains/task/server/core/task.service";
import {
  PERSONAL_WORK_DOMAINS,
  PERSONAL_WORK_COLORS,
  type PersonalWorkCategory,
  type PersonalWorkDomain,
} from "../shared/personal-work.types";

export function defaultPersonalCategories(): PersonalWorkCategory[] {
  return PERSONAL_WORK_DOMAINS.map(({ key, label }) => ({
    key,
    label,
    color: PERSONAL_WORK_COLORS[key],
    domain: key,
    isDefault: true,
  }));
}

export function categoryFromRow(row: {
  key: string;
  label: string;
  color: string;
}): PersonalWorkCategory {
  const fallback = defaultPersonalCategories().find((c) => c.key === row.key);
  return {
    ...(fallback ?? {
      key: row.key,
      label: row.label,
      domain: "GENERAL" as const,
      isDefault: false,
    }),
    color: row.color,
  };
}

function authId(auth: unknown) {
  const id = getAuthUserId(auth);
  if (!id) throw new Error("Không xác định được người dùng");
  return id;
}

export async function listPersonalCategories(userId: string) {
  const [rows, globalColors] = await Promise.all([
    prisma.personalWorkCategory.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    }),
    prisma.personalWorkDefaultColor.findMany(),
  ]);
  return mergePersonalCategories(rows, globalColors);
}

export async function canManageDefaultCategories(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isActive: true, roles: { select: { name: true } } },
  });
  return Boolean(
    user?.isActive && user.roles.some((role) => role.name === "ADMIN"),
  );
}

export function mergePersonalCategories(
  rows: { key: string; label: string; color: string }[],
  globalColors: { key: string; color: string }[] = [],
) {
  const defaults = defaultPersonalCategories().map((c) => ({
    ...c,
    color: globalColors.find((r) => r.key === c.key)?.color ?? c.color,
  }));
  return [
    ...defaults,
    ...rows
      .filter((r) => !defaults.some((c) => c.key === r.key))
      .map(categoryFromRow),
  ];
}

export async function resolvePersonalCategory(userId: string, key: string) {
  const defaultCategory = defaultPersonalCategories().find(
    (c) => c.key === key,
  );
  if (defaultCategory) return { domain: defaultCategory.domain, id: null };
  const row = await prisma.personalWorkCategory.findUnique({
    where: { userId_key: { userId, key } },
  });
  if (!row)
    throw new Error(
      "Loại công việc không tồn tại hoặc không thuộc danh mục của chủ công việc",
    );
  return { domain: "GENERAL" as PersonalWorkDomain, id: row.id };
}

export async function savePersonalCategory(
  input: { key?: string; label: string; color: string },
  auth: unknown,
) {
  const userId = authId(auth);
  const label = input.label.trim();
  if (!label || label.length > 60)
    throw new Error("Tên loại công việc phải từ 1 đến 60 ký tự");
  if (!/^#[0-9a-f]{6}$/i.test(input.color)) throw new Error("Màu không hợp lệ");
  const key = input.key || `CUSTOM_${randomUUID()}`;
  const defaultCategory = defaultPersonalCategories().find(
    (c) => c.key === key,
  );
  if (defaultCategory) {
    if (!(await canManageDefaultCategories(userId)))
      throw new Error("Chỉ admin được đổi màu loại công việc mặc định");
    await prisma.personalWorkDefaultColor.upsert({
      where: { key },
      create: {
        key,
        color: input.color.toLowerCase(),
        updatedByUserId: userId,
      },
      update: { color: input.color.toLowerCase(), updatedByUserId: userId },
    });
    return;
  }
  if (input.key) await resolvePersonalCategory(userId, key);
  const duplicates = await listPersonalCategories(userId);
  if (
    duplicates.some(
      (c) =>
        c.key !== key &&
        c.label.toLocaleLowerCase() === label.toLocaleLowerCase(),
    )
  )
    throw new Error("Tên loại công việc đã tồn tại");
  await prisma.personalWorkCategory.upsert({
    where: { userId_key: { userId, key } },
    create: {
      userId,
      key,
      label,
      color: input.color.toLowerCase(),
    },
    update: {
      label,
      color: input.color.toLowerCase(),
    },
  });
}

export async function deletePersonalCategory(
  input: { key: string; replacementKey: string },
  auth: unknown,
) {
  const userId = authId(auth);
  if (defaultPersonalCategories().some((c) => c.key === input.key))
    throw new Error("Không thể xóa loại mặc định");
  if (input.key === input.replacementKey)
    throw new Error("Hãy chọn loại thay thế khác");
  await prisma.$transaction(async (tx) => {
    const row = await tx.personalWorkCategory.findUnique({
      where: { userId_key: { userId, key: input.key } },
    });
    if (!row) throw new Error("Không tìm thấy loại công việc");
    const defaultReplacement = defaultPersonalCategories().find(
      (c) => c.key === input.replacementKey,
    );
    const replacement = defaultReplacement
      ? null
      : await tx.personalWorkCategory.findUnique({
          where: { userId_key: { userId, key: input.replacementKey } },
        });
    if (!defaultReplacement && !replacement)
      throw new Error("Loại thay thế không tồn tại");
    const affected = await tx.taskItem.findMany({
      where: { personalCategoryId: row.id },
      select: { id: true, taskId: true },
    });
    const tagged = await hydrateTaskItemsWithTagsRepo(tx, affected);
    const defaultKeys = new Set<string>(
      PERSONAL_WORK_DOMAINS.map((c) => c.key),
    );
    for (const item of tagged) {
      await setTargetTagsRepo(tx, {
        ownerType: AppTagOwnerType.TASK,
        ownerId: item.taskId,
        targetType: AppTagTargetType.TASK_ITEM,
        targetId: item.id,
        names: [
          defaultReplacement?.domain ?? "GENERAL",
          ...item.tags
            .map((t) => t.name)
            .filter((name) => !defaultKeys.has(name.toUpperCase())),
        ],
      });
    }
    await tx.taskItem.updateMany({
      where: { personalCategoryId: row.id },
      data: { personalCategoryId: replacement?.id ?? null },
    });
    await tx.personalWorkCategory.delete({ where: { id: row.id } });
  });
}
