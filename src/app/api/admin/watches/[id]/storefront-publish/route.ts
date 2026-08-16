import { after, NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import { PERMISSIONS } from "@/constants/permissions";
import { runBusinessEventTransaction } from "@/domains/event/server/business-event-transaction";
import {
  emitWatchStorefrontPriceVisibilityChangedEvent,
  emitWatchStorefrontVisibilityChangedEvent,
} from "@/domains/watch/server/events";
import { prisma } from "@/server/db/client";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
  if (auth instanceof Response) return auth;

  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const published = body?.published !== false;
    const nextPriceVisibility = body?.showPrice === false ? "HIDE" : "SHOW";
    const actionId = randomUUID();

    const watch = await prisma.watch.findUnique({
      where: { productId: id },
      select: {
        id: true,
        watchSpecV2: true,
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
            storefrontImageKey: true,
            storefrontVisible: true,
            publishedAt: true,
            priceVisibility: true,
            productImage: {
              where: { role: "COVER", isForStorefront: true },
              select: { id: true },
              take: 1,
            },
          },
        },
      },
    });

    if (!watch) throw new Error("Không tìm thấy Watch.");
    if (published) {
      if (!watch.product.title.trim()) throw new Error("Cần có title trước khi đưa lên storefront.");
      if (!watch.product.slug?.trim()) throw new Error("Cần có đường dẫn storefront trước khi đăng.");
      if (!watch.product.storefrontImageKey && watch.product.productImage.length === 0) {
        throw new Error("Cần xác nhận Cover trước khi đưa lên storefront.");
      }

      const spec = watch.watchSpecV2;
      const hasSpec = spec && [
        spec.model,
        spec.referenceNumber,
        spec.caseShape,
        spec.caseSizeMM,
        spec.dialColor,
        spec.primaryCaseMaterial,
        spec.calibre,
      ].some((value) => value != null && String(value).trim() !== "");
      if (!hasSpec) throw new Error("Cần có ít nhất một thông tin spec trước khi đăng.");
    }

    const product = await runBusinessEventTransaction(async (tx, delivery) => {
      const publishedAt = published ? new Date() : null;
      const updated = await tx.product.update({
        where: { id },
        data: published
          ? { publishedAt, storefrontVisible: true, priceVisibility: nextPriceVisibility }
          : { publishedAt: null, storefrontVisible: false },
        select: { publishedAt: true, storefrontVisible: true, priceVisibility: true, slug: true },
      });

      if (watch.product.storefrontVisible !== published) {
        delivery.track(await emitWatchStorefrontVisibilityChangedEvent(tx, {
          watch: { id: watch.id, productId: watch.product.id },
          actorUserId: auth.id,
          actionId: `${actionId}:visibility`,
          before: watch.product.storefrontVisible,
          after: published,
          publishedAt,
          source: "QUICK_PUBLISH",
        }));
      }
      if (published && watch.product.priceVisibility !== nextPriceVisibility) {
        delivery.track(await emitWatchStorefrontPriceVisibilityChangedEvent(tx, {
          watch: { id: watch.id, productId: watch.product.id },
          actorUserId: auth.id,
          actionId: `${actionId}:price-visibility`,
          before: watch.product.priceVisibility,
          after: nextPriceVisibility,
          source: "QUICK_PUBLISH",
        }));
      }

      return updated;
    }, { deferConsumers: (work) => after(work) });

    return NextResponse.json({ ok: true, data: product });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không thể đưa Watch lên storefront." },
      { status: 400 },
    );
  }
}
