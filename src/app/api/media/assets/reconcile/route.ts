import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";
import { reconcileMediaAssets } from "@/domains/media/server";



export const dynamic = "force-dynamic";

const BodySchema = z.object({
  profile: z.string().optional().nullable(),
  prefix: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_CREATE);
  if (auth instanceof Response) return auth;

  try {
    const body = BodySchema.parse(await req.json().catch(() => ({})));
    const result = await reconcileMediaAssets({
      profile: body.profile,
      prefix: body.prefix,
    });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Không thể reconcile MediaAsset.",
      },
      { status: 400 }
    );
  }
}
