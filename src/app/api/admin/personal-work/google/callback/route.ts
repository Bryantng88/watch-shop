import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/getCurrentUser";
import { exchangeGoogleCalendarCode, verifyGoogleCalendarState } from "@/domains/personal-work/server/google-calendar.service";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const appOrigin = process.env.APP_URL?.trim().replace(/\/$/, "") || url.origin;
  const redirectTo = (status: "invalid" | "connected" | "failed") =>
    NextResponse.redirect(new URL(`/admin/personal-work?calendar=${status}`, appOrigin));
  const code = url.searchParams.get("code");
  const stateUserId = verifyGoogleCalendarState(url.searchParams.get("state") || "");
  const user = await getCurrentUser();
  if (!code || !stateUserId || !user || user.id !== stateUserId) {
    return redirectTo("invalid");
  }
  try {
    await exchangeGoogleCalendarCode(user.id, code);
    return redirectTo("connected");
  } catch {
    console.error("[personal-work] Google Calendar callback failed; inspect OAuth configuration and consent settings");
    return redirectTo("failed");
  }
}
