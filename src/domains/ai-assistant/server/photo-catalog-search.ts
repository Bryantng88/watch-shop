import type { DB } from "@/server/db/client";

export async function searchPhotoCatalog(db: DB, query: string) {
  const select = { id: true, title: true, sku: true, updatedAt: true } as const;
  const exact = await db.product.findMany({
    where: { type: "WATCH", OR: [{ id: query }, { sku: { equals: query, mode: "insensitive" } }] },
    select,
    take: 7,
    orderBy: { id: "asc" },
  });
  if (exact.length) return { matches: exact.slice(0, 6), truncated: exact.length > 6 };

  const terms = query.split(/[^\p{L}\p{N}]+/u).filter(term => term.length >= 2).slice(0, 8);
  if (!terms.length) return { matches: [], truncated: false };

  const rows = await db.product.findMany({
    where: {
      type: "WATCH",
      AND: terms.map(term => ({
        OR: [{ title: { contains: term, mode: "insensitive" } }, { sku: { contains: term, mode: "insensitive" } }],
      })),
    },
    select,
    take: 7,
    orderBy: { id: "asc" },
  });
  return { matches: rows.slice(0, 6), truncated: rows.length > 6 };
}
