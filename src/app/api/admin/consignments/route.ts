import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { prisma } from "@/server/db/client";
import { requireAnyPermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS as P } from "@/constants/permissions";
import {
  canReadConsignmentMoney,
  consignmentReadPermissions,
  ConsignmentError,
  consignmentCapabilities,
} from "@/domains/consignment/server/access";
import {
  commandConsignment,
  createConsignment,
  listConsignments,
} from "@/domains/consignment/server/service";
import { readConsignment } from "@/domains/consignment/shared/contract";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
export async function GET(request: NextRequest) {
  const auth = await requireAnyPermissionApi(consignmentReadPermissions);
  if (auth instanceof Response) return auth;
  try {
    const q = request.nextUrl.searchParams;
    if (q.has("lookup")) {
      const text = (q.get("q") || "").trim().slice(0, 100);
      const [vendors, watches] = await Promise.all([
        prisma.vendor.findMany({
          where: {
            isActive: true,
            ...(text
              ? { name: { contains: text, mode: "insensitive" as const } }
              : {}),
          },
          select: { id: true, name: true },
          take: 100,
          orderBy: { name: "asc" },
        }),
        prisma.watch.findMany({
          where: {
            ...(q.get("productId") && !text
              ? { productId: q.get("productId")! }
              : {}),
            stockStage: "IN_STOCK",
            saleStage: { in: ["DRAFT", "PROCESSING", "READY"] },
            product: {
              status: { in: ["AVAILABLE", "IN_SERVICE"] },
              ...(text
                ? {
                    OR: [
                      {
                        title: { contains: text, mode: "insensitive" as const },
                      },
                      { sku: { contains: text, mode: "insensitive" as const } },
                    ],
                  }
                : {}),
            },
          },
          select: {
            id: true,
            productId: true,
            product: {
              select: { title: true, sku: true, primaryImageUrl: true },
            },
          },
          take: 50,
          orderBy: { updatedAt: "desc" },
        }),
      ]);
      return NextResponse.json({ vendors, watches }, { headers });
    }
    if (q.has("saleOrders")) {
      if (!canReadConsignmentMoney(auth))
        throw new ConsignmentError("Không có quyền xem tài chính.", 403);
      const doc = await prisma.acquisition.findUnique({
        where: { id: q.get("saleOrders")! },
        select: { consignment: true },
      });
      const metadata = readConsignment(doc?.consignment);
      if (!metadata) throw new ConsignmentError("Không tìm thấy hồ sơ.", 404);
      const orders = await prisma.orderItem.findMany({
        where: {
          productId: metadata.productId,
          quantity: 1,
          order: {
            status: {
              in: ["POSTED", "PAID", "PROCESSING", "SHIPPED", "COMPLETED"],
            },
          },
        },
        select: {
          orderId: true,
          subtotal: true,
          order: { select: { refNo: true } },
        },
        take: 20,
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(
        {
          orders: orders.map((item) => ({
            id: item.orderId,
            label: item.order.refNo || item.orderId,
            amount: Number(item.subtotal),
          })),
        },
        { headers },
      );
    }
    const data = await listConsignments(auth, {
      direction: q.get("direction") || undefined,
      status: q.get("status") || undefined,
      q: q.get("q") || undefined,
      page: Math.max(1, Math.min(100000, Number(q.get("page")) || 1)),
      id: q.get("id") || undefined,
    });
    return NextResponse.json(
      { ...data, capabilities: consignmentCapabilities(auth) },
      { headers },
    );
  } catch (error) {
    return failure(error);
  }
}
export async function POST(request: NextRequest) {
  const auth = await requireAnyPermissionApi([
    P.WATCH_ACQUISITION_CREATE,
    P.ACQUISITION_CREATE_ALL,
    P.WATCH_ACQUISITION_UPDATE,
    P.ACQUISITION_UPDATE_ALL,
    P.WATCH_ACQUISITION_APPROVE,
    P.ACQUISITION_APPROVE_ALL,
    P.WATCH_ACQUISITION_DELETE,
    P.ACQUISITION_DELETE_ALL,
  ]);
  if (auth instanceof Response) return auth;
  try {
    const origin = request.headers.get("origin");
    if (
      request.headers.get("sec-fetch-site") === "cross-site" ||
      (origin &&
        new URL(origin).host !==
          (request.headers.get("host") || request.nextUrl.host))
    )
      throw new ConsignmentError("Yêu cầu không cùng nguồn.", 403);
    const raw = await request.text();
    if (raw.length > 16000) throw new ConsignmentError("Yêu cầu quá lớn.", 413);
    const body = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new ConsignmentError("Dữ liệu không hợp lệ.");
    const result =
      body.action === "CREATE"
        ? await createConsignment(body, auth)
        : await commandConsignment(body, auth);
    return NextResponse.json({ ok: true, ...result }, { headers });
  } catch (error) {
    return failure(error);
  }
}
function failure(error: unknown) {
  if (error instanceof SyntaxError)
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ." },
      { status: 400, headers },
    );
  if (error instanceof ZodError)
    return NextResponse.json(
      { error: error.issues[0]?.message || "Dữ liệu không hợp lệ." },
      { status: 400, headers },
    );
  if (error instanceof ConsignmentError)
    return NextResponse.json(
      { error: error.message },
      { status: error.status, headers },
    );
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    ["P2034", "P2002"].includes(error.code)
  )
    return NextResponse.json(
      { error: "Hồ sơ vừa thay đổi. Vui lòng tải lại." },
      { status: 409, headers },
    );
  return NextResponse.json(
    { error: "Không thể xử lý ký gửi. Vui lòng tải lại và thử lại." },
    { status: 500, headers },
  );
}
