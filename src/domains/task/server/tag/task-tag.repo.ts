import {
  AppTagOwnerType,
  AppTagScope,
  AppTagTargetType,
  Prisma,
} from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";

export type AppTagPayload = {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  scope: AppTagScope;
  ownerType: AppTagOwnerType | null;
  ownerId: string | null;
};

export function normalizeTagName(value: unknown) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

export function tagSlug(value: unknown) {
  return normalizeTagName(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanTagNames(values?: string[] | null) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values ?? []) {
    const name = normalizeTagName(value);
    const slug = tagSlug(name);
    if (!name || !slug || seen.has(slug)) continue;
    seen.add(slug);
    result.push(name);
  }

  return result;
}

export async function listOwnerTagsRepo(
  db: DB,
  input: { ownerType: AppTagOwnerType; ownerId: string },
) {
  const client = dbOrTx(db);

  return client.appTag.findMany({
    where: {
      scope: AppTagScope.OWNER,
      ownerType: input.ownerType,
      ownerId: input.ownerId,
    },
    orderBy: [{ name: "asc" }],
  });
}

export async function ensureOwnerTagsRepo(
  db: DB,
  input: {
    ownerType: AppTagOwnerType;
    ownerId: string;
    names: string[];
    color?: string | null;
  },
) {
  const client = dbOrTx(db);
  const names = cleanTagNames(input.names);

  const tags: AppTagPayload[] = [];

  for (const name of names) {
    const slug = tagSlug(name);

    const tag = await client.appTag.upsert({
      where: {
        slug_scope_ownerType_ownerId: {
          slug,
          scope: AppTagScope.OWNER,
          ownerType: input.ownerType,
          ownerId: input.ownerId,
        },
      },
      update: {
        name,
        ...(input.color !== undefined ? { color: input.color } : {}),
      },
      create: {
        name,
        slug,
        color: input.color ?? null,
        scope: AppTagScope.OWNER,
        ownerType: input.ownerType,
        ownerId: input.ownerId,
      },
    });

    tags.push(tag);
  }

  return tags;
}

export async function setTargetTagsRepo(
  db: DB,
  input: {
    ownerType: AppTagOwnerType;
    ownerId: string;
    targetType: AppTagTargetType;
    targetId: string;
    names: string[];
  },
) {
  const client = dbOrTx(db);
  const tags = await ensureOwnerTagsRepo(db, {
    ownerType: input.ownerType,
    ownerId: input.ownerId,
    names: input.names,
  });

  const nextTagIds = tags.map((tag) => tag.id);

  await client.appTagLink.deleteMany({
    where: {
      targetType: input.targetType,
      targetId: input.targetId,
      tag: {
        ownerType: input.ownerType,
        ownerId: input.ownerId,
      },
      ...(nextTagIds.length ? { tagId: { notIn: nextTagIds } } : {}),
    },
  });

  for (const tagId of nextTagIds) {
    await client.appTagLink.upsert({
      where: {
        tagId_targetType_targetId: {
          tagId,
          targetType: input.targetType,
          targetId: input.targetId,
        },
      },
      update: {},
      create: {
        tagId,
        targetType: input.targetType,
        targetId: input.targetId,
      },
    });
  }

  return listTargetTagsRepo(db, {
    targetType: input.targetType,
    targetId: input.targetId,
  });
}

export async function listTargetTagsRepo(
  db: DB,
  input: { targetType: AppTagTargetType; targetId: string },
) {
  const client = dbOrTx(db);

  const rows = await client.appTagLink.findMany({
    where: {
      targetType: input.targetType,
      targetId: input.targetId,
    },
    include: {
      tag: true,
    },
    orderBy: [{ createdAt: "asc" }],
  });

  return rows.map((row) => row.tag);
}

export async function hydrateTaskItemsWithTagsRepo<T extends { id: string }>(
  db: DB,
  items: T[],
): Promise<Array<T & { tags: AppTagPayload[] }>> {
  if (!items.length) return items.map((item) => ({ ...item, tags: [] }));

  const client = dbOrTx(db);
  const ids = items.map((item) => item.id);

  const links = await client.appTagLink.findMany({
    where: {
      targetType: AppTagTargetType.TASK_ITEM,
      targetId: { in: ids },
    },
    include: { tag: true },
    orderBy: [{ createdAt: "asc" }],
  });

  const byTarget = new Map<string, AppTagPayload[]>();
  for (const link of links) {
    const next = byTarget.get(link.targetId) ?? [];
    next.push(link.tag);
    byTarget.set(link.targetId, next);
  }

  return items.map((item) => ({
    ...item,
    tags: byTarget.get(item.id) ?? [],
  }));
}

export async function hydrateTasksWithTaskItemTagsRepo<T extends { taskItems?: any[] }>(
  db: DB,
  tasks: T[],
): Promise<T[]> {
  const allItems = tasks.flatMap((task) => task.taskItems ?? []);
  if (!allItems.length) return tasks;

  const hydratedItems = await hydrateTaskItemsWithTagsRepo(db, allItems);
  const byId = new Map(hydratedItems.map((item) => [item.id, item]));

  return tasks.map((task) => ({
    ...task,
    taskItems: (task.taskItems ?? []).map((item) => byId.get(item.id) ?? item),
  }));
}
