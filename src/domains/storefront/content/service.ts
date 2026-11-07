import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { mediaStorage } from "@/domains/media/storage";
import { mapPublicWatchCard } from "../server/public-catalog.service";
import { publicWatchEligibilityWhere, publicWatchListSelect } from "../server/public-catalog.repo";
import {
  articleSchema,
  homeSchema,
  defaultHome,
  defaultArticle,
  contentImages,
  type ContentKind,
  type ContentRecord,
  type HomeContent,
} from "./contract";

export class ContentConflict extends Error {}
export async function readHome(draft = false): Promise<HomeContent> {
  const row = await prisma.storefrontDocument.findUnique({ where: { id: "home" } });
  return homeSchema.parse((draft ? row?.draft : row?.published) ?? defaultHome());
}
export async function selectedWatches(ids: string[], fallback = false) {
  if (!ids.length && !fallback) return [];
  const rows = await prisma.product.findMany({
    where: {
      AND: [
        publicWatchEligibilityWhere(),
        ...(ids.length ? [{ id: { in: ids } }] : [{ status: "AVAILABLE" as const }]),
      ],
    },
    select: publicWatchListSelect,
    take: ids.length || 4,
    orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
  });
  const cards = rows.map(mapPublicWatchCard);
  return ids.length ? ids.flatMap((id) => cards.filter((c) => c.productId === id)) : cards;
}
export async function listArticles(draft = false) {
  const rows = await prisma.storefrontDocument.findMany({
    where: { kind: "ARTICLE", ...(draft ? {} : { publishedAt: { not: null } }) },
    orderBy: draft ? { updatedAt: "desc" } : { publishedAt: "desc" },
    take: 100,
  });
  return rows.flatMap((row) => {
    const parsed = articleSchema.safeParse(draft ? row.draft : row.published);
    return parsed.success
      ? [{ id: row.id, content: parsed.data, publishedAt: row.publishedAt?.toISOString() ?? null }]
      : [];
  });
}
export async function getArticle(idOrSlug: string, draft = false) {
  const row = draft
    ? await prisma.storefrontDocument.findFirst({ where: { id: idOrSlug, kind: "ARTICLE" } })
    : await prisma.storefrontDocument.findFirst({
        where: {
          kind: "ARTICLE",
          publishedAt: { not: null },
          OR: [{ id: idOrSlug }, { published: { path: ["slug"], equals: idOrSlug } }],
        },
      });
  const parsed = articleSchema.safeParse(draft ? row?.draft : row?.published);
  return row && parsed.success
    ? { id: row.id, content: parsed.data, publishedAt: row.publishedAt?.toISOString() ?? null }
    : null;
}
export async function getEditorRecord(id: string): Promise<ContentRecord | null> {
  const row = await prisma.storefrontDocument.findUnique({ where: { id } });
  if (!row)
    return id === "home"
      ? { id, kind: "HOME", draft: defaultHome(), revision: 0, updatedAt: null, publishedAt: null }
      : null;
  return {
    id: row.id,
    kind: row.kind as ContentKind,
    draft: (row.kind === "HOME" ? homeSchema : articleSchema).parse(row.draft),
    revision: row.revision,
    updatedAt: row.updatedAt.toISOString(),
    publishedAt: row.publishedAt?.toISOString() ?? null,
  };
}
export async function createArticle(userId: string) {
  const id = randomUUID();
  await prisma.storefrontDocument.create({
    data: {
      id,
      kind: "ARTICLE",
      draft: { ...defaultArticle(), slug: `bai-viet-${id.slice(0, 8)}` },
      updatedBy: userId,
    },
  });
  return getEditorRecord(id);
}
export async function saveContent(
  input: {
    id: string;
    revision: number;
    action: "save" | "publish" | "unpublish";
    content?: unknown;
  },
  userId: string,
) {
  return prisma.$transaction(
    async (tx) => {
      // Serialize editors before checking revision; publishing never races a draft save.
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`storefront:${input.id}`}))`;
      const row = await tx.storefrontDocument.findUnique({ where: { id: input.id } });
      if ((row?.revision ?? 0) !== input.revision)
        throw new ContentConflict(
          "Nội dung đã được thay đổi ở phiên khác. Hãy tải lại trước khi lưu.",
        );
      if (!row && input.id !== "home") throw new Error("Không tìm thấy bài viết.");
      const kind = row?.kind ?? "HOME";
      const content = (kind === "HOME" ? homeSchema : articleSchema).parse(
        input.content ?? row?.draft ?? defaultHome(),
      );
      if (input.action === "publish") {
        if (kind === "ARTICLE" && !("body" in content && content.body.trim()))
          throw new Error("Bài viết cần nội dung trước khi xuất bản.");
        if (kind === "ARTICLE" && !contentImages(kind, content).cover.key)
          throw new Error("Chọn ảnh bìa trước khi xuất bản bài viết.");
        for (const image of Object.values(contentImages(kind, content))) {
          if (image.key && !(await mediaStorage.stat(image.key)))
            throw new Error("Một ảnh đã mất khỏi kho. Vui lòng chọn lại.");
        }
        if (kind === "HOME") {
          const home = content as HomeContent;
          if (home.sections.some((s) => s.id === "hero" && s.enabled) && !home.hero.image.key)
            throw new Error("Chọn ảnh Hero trước khi xuất bản.");
          if (
            home.journal.articleId &&
            !(await tx.storefrontDocument.findFirst({
              where: { id: home.journal.articleId, kind: "ARTICLE", publishedAt: { not: null } },
            }))
          )
            throw new Error("Bài nổi bật phải được xuất bản trước.");
          const selectedIds = [...new Set(home.featured.productIds)];
          if (
            selectedIds.length &&
            (await tx.product.count({
              where: { AND: [publicWatchEligibilityWhere(), { id: { in: selectedIds } }] },
            })) !== selectedIds.length
          )
            throw new Error("Một đồng hồ đã chọn không còn đủ điều kiện public. Hãy chọn lại.");
        }
      }
      const data = {
        draft: content as Prisma.InputJsonValue,
        updatedBy: userId,
        revision: { increment: 1 },
        ...(input.action === "publish"
          ? { published: content as Prisma.InputJsonValue, publishedAt: new Date() }
          : input.action === "unpublish"
            ? { published: Prisma.DbNull, publishedAt: null }
            : {}),
      };
      if (row) await tx.storefrontDocument.update({ where: { id: row.id }, data });
      else
        await tx.storefrontDocument.create({
          data: {
            id: "home",
            kind: "HOME",
            draft: content as Prisma.InputJsonValue,
            updatedBy: userId,
            ...(input.action === "publish"
              ? { published: content as Prisma.InputJsonValue, publishedAt: new Date() }
              : {}),
          },
        });
    },
    { timeout: 30000 },
  );
}
export async function resolveImages(id: string, kind: string, content: unknown, preview = false) {
  return Object.fromEntries(
    await Promise.all(
      Object.entries(contentImages(kind, content)).map(async ([slot, img]) => [
        slot,
        {
          ...img,
          url: img.key
            ? preview
              ? await mediaStorage.sign(img.key, 600)
              : `/api/public/storefront/media/${encodeURIComponent(id)}/${slot}`
            : "",
        },
      ]),
    ),
  );
}
