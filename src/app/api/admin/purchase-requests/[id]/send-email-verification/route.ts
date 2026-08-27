import { after, NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { sendPurchaseRequestVerificationEmail } from "@/domains/storefront/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requirePermissionApi(PERMISSIONS.ORDER_UPDATE);
  if (auth instanceof Response) return auth;
  try {
    const result = await sendPurchaseRequestVerificationEmail((await context.params).id, {
      actorUserId: auth.id,
      fallbackOrigin: request.url,
      deferConsumers: (work) => after(work),
    });
    return NextResponse.json(result);
  } catch (error) {
    const code = error instanceof Error ? error.message : "EMAIL_VERIFICATION_SEND_FAILED";
    const status = code === "EMAIL_VERIFICATION_RESEND_TOO_SOON" || code === "EMAIL_VERIFICATION_DAILY_LIMIT_REACHED" ? 429 : 400;
    return NextResponse.json({ error: code }, { status });
  }
}
