import { NextRequest, NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
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

    if (!published) {
      const product = await prisma.product.update({
        where: { id },
        data: { publishedAt: null },
        select: { publishedAt: true, priceVisibility: true, slug: true },
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

    const product = await prisma.product.update({
      where: { id },
      data: {
        publishedAt: new Date(),
        priceVisibility: body?.showPrice === false ? "HIDE" : "SHOW",
      },
      select: { publishedAt: true, priceVisibility: true, slug: true },
    });

    return NextResponse.json({ ok: true, data: product });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không thể đưa Watch lên storefront." },
      { status: 400 },
    );
  }
}
