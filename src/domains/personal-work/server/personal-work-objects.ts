import type { DB } from "@/server/db/client";
import { expandPermissions } from "@/server/auth/permission-implications";
import type {
  PersonalWorkItem,
  PersonalWorkTarget,
} from "../shared/personal-work.types";
// Run AFTER checklist-only projection so hidden parent/entry objects are never hydrated.
const inlineSelect = {
  where: { role: "INLINE" as const },
  orderBy: [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }],
  take: 1,
  select: { fileKey: true },
};
const previewImage = (
  product:
    | { primaryImageUrl: string | null; productImage: { fileKey: string }[] }
    | null
    | undefined,
) => product?.productImage[0]?.fileKey || product?.primaryImageUrl || null;
export async function hydratePersonalWorkObjects(
  db: DB,
  userId: string,
  items: PersonalWorkItem[],
): Promise<PersonalWorkItem[]> {
  const user = await db.user.findFirst({
    where: { id: userId, isActive: true },
    select: {
      roles: {
        select: { name: true, permissions: { select: { code: true } } },
      },
    },
  });
  const admin = user?.roles.some((role) => role.name === "ADMIN");
  const permissions = new Set(
    expandPermissions(
      user?.roles.flatMap((role) => role.permissions.map((p) => p.code)) ?? [],
    ),
  );
  const canWatch = !!admin || permissions.has("PRODUCT_VIEW"),
    canService = !!admin || permissions.has("SERVICE_VIEW");
  const watchIds = canWatch
    ? [
        ...new Set(
          items.flatMap((item) =>
            item.targets.filter((t) => t.type === "WATCH").map((t) => t.id),
          ),
        ),
      ]
    : [];
  const productIds = canWatch
    ? [
        ...new Set(
          items.flatMap((item) =>
            item.checklist.flatMap((entry) =>
              entry.mediaContext?.productId
                ? [entry.mediaContext.productId]
                : [],
            ),
          ),
        ),
      ]
    : [];
  const serviceIds = canService
    ? [
        ...new Set(
          items.flatMap((item) =>
            item.targets
              .filter((t) => t.type === "SERVICE_REQUEST")
              .map((t) => t.id),
          ),
        ),
      ]
    : [];
  const [watches, services] = await Promise.all([
    watchIds.length || productIds.length
      ? db.watch.findMany({
          where: {
            OR: [{ id: { in: watchIds } }, { productId: { in: productIds } }],
          },
          select: {
            id: true,
            productId: true,
            product: {
              select: {
                title: true,
                sku: true,
                primaryImageUrl: true,
                productImage: inlineSelect,
              },
            },
          },
        })
      : [],
    serviceIds.length
      ? db.serviceRequest.findMany({
          where: { id: { in: serviceIds } },
          select: {
            id: true,
            product: {
              select: { primaryImageUrl: true, productImage: inlineSelect },
            },
          },
        })
      : [],
  ]);
  const byWatch = new Map(watches.map((watch) => [watch.id, watch])),
    byProduct = new Map(watches.map((watch) => [watch.productId, watch]));
  const serviceImages = new Map(
    services.map((service) => [service.id, previewImage(service.product)]),
  );
  return items.map((item) => ({
    ...item,
    targets: item.targets.map((target) => {
      // Ignore stored/client-supplied image URLs; current authorized records own the preview.
      const { imageUrl: _ignored, ...plain } = target;
      void _ignored;
      return {
        ...plain,
        imageUrl:
          target.type === "WATCH"
            ? previewImage(byWatch.get(target.id)?.product)
            : target.type === "SERVICE_REQUEST"
              ? (serviceImages.get(target.id) ?? null)
              : null,
      };
    }),
    checklist: item.checklist.map((entry) => {
      const watch = entry.mediaContext?.productId
        ? byProduct.get(entry.mediaContext.productId)
        : undefined;
      const object: PersonalWorkTarget | undefined = watch
        ? {
            type: "WATCH",
            id: watch.id,
            label: watch.product.title,
            secondary: watch.product.sku,
            imageUrl: previewImage(watch.product),
            href: entry.mediaContext!.href,
          }
        : undefined;
      return { ...entry, object };
    }),
  }));
}
