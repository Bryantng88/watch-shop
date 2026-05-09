import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";
import { indexMediaPrefix } from "@/domains/media/server";

export const dynamic = "force-dynamic";

const BodySchema = z.object({
  profile: z.string().optional().nullable(),
  prefix: z.string().optional().nullable(),
  markMissing: z.boolean().optional(),
  recursive: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_CREATE);
  if (auth instanceof Response) return auth;

  try {
    const body = BodySchema.parse(await req.json().catch(() => ({})));
    const result = await indexMediaPrefix({
      profile: body.profile,
      prefix: body.prefix,
      markMissing: body.markMissing ?? true,
      recursive: body.recursive ?? true,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Không thể rebuild MediaAsset index.",
      },
      { status: 400 }
    );
  }
}
