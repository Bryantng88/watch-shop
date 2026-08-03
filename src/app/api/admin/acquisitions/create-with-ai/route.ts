import { NextResponse } from "next/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";

export async function POST() {
  const auth = await requirePermissionApi(PERMISSIONS.ACQUISITION_CREATE);
  if (auth instanceof Response) return auth;

  return NextResponse.json(
    {
      error:
        "Legacy create-with-ai endpoint is retired. Create the acquisition first and use the acquisition spec job.",
    },
    { status: 410 },
  );
}
