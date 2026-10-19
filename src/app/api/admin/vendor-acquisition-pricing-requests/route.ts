import { after, NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { PERMISSIONS } from "@/constants/permissions";
import { createVendorPricingRequest } from "@/domains/acquisition/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

const BodySchema = z.object({
  vendorId: z.string().min(1),
  currency: z.string().trim().min(1).max(8).default("VND"),
  notes: z.string().max(2000).nullish(),
  expiresInDays: z.number().int().min(1).max(30).default(7),
  items: z.array(z.object({
    title: z.string().max(300).nullish(),
    audienceSegment: z.enum(["MEN", "WOMEN"]).default("MEN"),
    imageStorageKey: z.string().max(1000).nullish(),
  })).min(1).max(100),
});

export async function POST(request: NextRequest) {
  const auth = await requirePermissionApi(PERMISSIONS.WATCH_ACQUISITION_CREATE);
  if (auth instanceof Response) return auth;
  try {
    const body = BodySchema.parse(await request.json());
    const result = await createVendorPricingRequest({
      ...body,
      createdByUserId: auth.id ?? null,
      publicOrigin: process.env.VENDOR_PORTAL_ORIGIN?.trim() || request.nextUrl.origin,
      expiresAt: new Date(Date.now() + body.expiresInDays * 24 * 60 * 60 * 1_000),
      deferConsumers: (work) => after(work),
    });
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Không thể tạo link báo giá." }, { status: 400 });
  }
}
