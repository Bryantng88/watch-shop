import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import { PERMISSIONS } from "@/constants/permissions";
import { prisma } from "@/server/db/client";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { rebuildWatchListProjectionRows } from "@/domains/projection/server/watch-list";
import { findStorefrontEligibleProductIds } from "@/domains/storefront/server/public-catalog.repo";

async function updateProductAndProjection(
  productId: string,
  data: Prisma.ProductUpdateInput,
  options: { requireEligible?: boolean } = {},
) {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.update({
      where: { id: productId },
      data,
      select: { publishedAt: true, priceVisibility: true, slug: true },
    });
    if (options.requireEligible) {
      const eligibleIds = await findStorefrontEligibleProductIds(tx, [productId]);
      if (!eligibleIds.includes(productId)) {
        throw new Error("Watch chưa đạt đầy đủ điều kiện hiển thị storefront.");
      }
    }
    await rebuildWatchListProjectionRows(tx, { productIds: [productId], limit: 1 });
    return product;
  }, { timeout: 15_000 });
}

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

    if (body?.visibilityOnly === true && typeof body?.showPrice === "boolean") {
      const product = await updateProductAndProjection(id, {
        priceVisibility: body.showPrice ? "SHOW" : "HIDE",
      });
      return NextResponse.json({ ok: true, data: product });
    }

    if (!published) {
      const product = await updateProductAndProjection(id, {
        publishedAt: null,
        ...(typeof body?.showPrice === "boolean"
          ? { priceVisibility: body.showPrice ? "SHOW" : "HIDE" }
          : {}),
      });
      return NextResponse.json({ ok: true, data: product });
    }

    const watch = await prisma.watch.findUnique({
      where: { productId: id },
      select: {
        audienceSegment: true,
        watchSpecV2: true,
        product: {
          select: {
            title: true,
            slug: true,
            storefrontImageKey: true,
            productImage: {
              where: { role: { in: ["COVER", "GALLERY"] }, isForStorefront: true },
              select: { role: true },
            },
          },
        },
      },
    });

    if (!watch) throw new Error("Không tìm thấy Watch.");
    if (!watch.product.title.trim()) throw new Error("Cần có title trước khi đưa lên storefront.");
    if (!watch.product.slug?.trim()) throw new Error("Cần có đường dẫn storefront trước khi đăng.");
    const hasCover = Boolean(watch.product.storefrontImageKey)
      || watch.product.productImage.some((image) => image.role === "COVER");
    const hasWomenGalleryFallback = watch.audienceSegment === "WOMEN"
      && watch.product.productImage.some((image) => image.role === "GALLERY");
    if (!hasCover && !hasWomenGalleryFallback) {
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

    const product = await updateProductAndProjection(id, {
      publishedAt: new Date(),
      priceVisibility: body?.showPrice === false ? "HIDE" : "SHOW",
    }, { requireEligible: true });

    return NextResponse.json({ ok: true, data: product });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không thể đưa Watch lên storefront." },
      { status: 400 },
    );
  }
}
