import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/getCurrentUser";
import { exchangeGoogleCalendarCode, verifyGoogleCalendarState } from "@/domains/personal-work/server/google-calendar.service";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const stateUserId = verifyGoogleCalendarState(url.searchParams.get("state") || "");
  const user = await getCurrentUser();
  if (!code || !stateUserId || !user || user.id !== stateUserId) {
    return NextResponse.redirect(new URL("/admin/personal-work?calendar=invalid", url.origin));
  }
  try {
    await exchangeGoogleCalendarCode(user.id, code);
    return NextResponse.redirect(new URL("/admin/personal-work?calendar=connected", url.origin));
  } catch (error) {
    console.error("[personal-work] Google Calendar callback failed", error);
    return NextResponse.redirect(new URL("/admin/personal-work?calendar=failed", url.origin));
  }
}
