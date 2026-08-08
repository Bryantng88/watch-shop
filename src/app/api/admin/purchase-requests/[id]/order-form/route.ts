import { NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { getQuickOrderProductForOrderForm, getServiceCatalogOptions } from "@/domains/order/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { prisma } from "@/server/db/client";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requirePermissionApi(PERMISSIONS.ORDER_CREATE);
  if (auth instanceof Response) return auth;

  try {
    const purchaseRequest = await prisma.purchaseRequest.findUnique({
      where: { id: (await context.params).id },
      include: { items: { orderBy: { createdAt: "asc" } }, order: { select: { id: true } } },
    });
    if (!purchaseRequest) return NextResponse.json({ error: "Không tìm thấy yêu cầu mua hàng." }, { status: 404 });
    if (purchaseRequest.order) return NextResponse.json({ error: "Yêu cầu đã được chuyển thành đơn hàng." }, { status: 409 });
    if (purchaseRequest.status !== "PROCESSING") {
      return NextResponse.json({ error: "Cần tiếp nhận yêu cầu trước khi lập đơn hàng." }, { status: 409 });
    }

    const [services, products] = await Promise.all([
      getServiceCatalogOptions(),
      Promise.all(purchaseRequest.items.map((item) => getQuickOrderProductForOrderForm(item.productId))),
    ]);
    if (products.some((product) => !product)) {
      return NextResponse.json({ error: "Có sản phẩm không còn đủ điều kiện lập đơn hàng." }, { status: 409 });
    }

    const productById = new Map(products.filter(Boolean).map((product) => [product!.id, product!]));
    return NextResponse.json({
      services,
      initialData: {
        customerName: purchaseRequest.customerName,
        shipPhone: purchaseRequest.phone,
        hasShipment: Boolean(purchaseRequest.address),
        shipAddress: purchaseRequest.address ?? "",
        shipCity: purchaseRequest.city ?? "",
        shipDistrict: purchaseRequest.district ?? "",
        shipWard: purchaseRequest.ward ?? "",
        paymentMethod: "BANK_TRANSFER",
        notes: [purchaseRequest.customerNote, `Tạo từ yêu cầu ${purchaseRequest.reference}`].filter(Boolean).join("\n"),
        items: purchaseRequest.items.map((item) => {
          const product = productById.get(item.productId)!;
          return {
            kind: "PRODUCT",
            productId: product.id,
            variantId: product.variantId ?? null,
            title: product.title,
            sku: product.sku ?? null,
            quantity: 1,
            listPrice: Number(item.listPriceSnapshot),
            unitPriceAgreed: Number(item.listPriceSnapshot),
            img: product.primaryImageUrl ?? null,
            imageKey: product.imageKey ?? null,
            source: "STANDARD",
            availabilityStatus: product.availabilityStatus ?? null,
            productStatus: product.productStatus ?? null,
          };
        }),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Không thể tải form lập đơn hàng." }, { status: 400 });
  }
}
