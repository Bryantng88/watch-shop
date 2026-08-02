import { NextRequest, NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { prisma } from "@/server/db/client";

export async function GET(req: NextRequest) {
  const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_CREATE);
  if (auth instanceof Response) return auth;

  const q = String(req.nextUrl.searchParams.get("q") ?? "").trim();
  if (q.length < 2) return NextResponse.json({ items: [] });

  const rows = await prisma.order.findMany({
    where: {
      OR: [
        { refNo: { contains: q, mode: "insensitive" } },
        { customerName: { contains: q, mode: "insensitive" } },
        { shipPhone: { contains: q } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 12,
    select: {
      id: true,
      refNo: true,
      status: true,
      customerId: true,
      customerName: true,
      shipPhone: true,
      createdAt: true,
      orderItem: {
        where: { kind: "PRODUCT" },
        orderBy: { createdAt: "asc" },
        take: 1,
        select: { id: true, title: true },
      },
    },
  });

  return NextResponse.json({
    items: rows.map((row) => ({
      id: row.id,
      refNo: row.refNo,
      status: row.status,
      customerId: row.customerId,
      customerName: row.customerName,
      customerPhone: row.shipPhone,
      createdAt: row.createdAt,
      sourceOrderItemId: row.orderItem[0]?.id ?? null,
      productTitle: row.orderItem[0]?.title ?? null,
    })),
  });
}
