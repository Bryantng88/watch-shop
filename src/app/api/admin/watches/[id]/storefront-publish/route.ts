import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import { PERMISSIONS } from "@/constants/permissions";
import { prisma } from "@/server/db/client";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { rebuildWatchListProjectionRows } from "@/domains/projection/server/watch-list";

async function updateProductAndProjection(productId: string, data: Prisma.ProductUpdateInput) {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.update({
      where: { id: productId },
      data,
      select: { publishedAt: true, priceVisibility: true, slug: true },
    });
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
        watchSpecV2: true,
        product: {
          select: {
            title: true,
            slug: true,
            storefrontImageKey: true,
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

    const product = await updateProductAndProjection(id, {
      publishedAt: new Date(),
      priceVisibility: body?.showPrice === false ? "HIDE" : "SHOW",
    });

    return NextResponse.json({ ok: true, data: product });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không thể đưa Watch lên storefront." },
      { status: 400 },
    );
  }
}
