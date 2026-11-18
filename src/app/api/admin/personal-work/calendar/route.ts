import { calendarLoadFailure } from "@/domains/personal-work/server/google-calendar-error";
import { NextResponse } from "next/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";
import { getPersonalWorkPageData } from "@/domains/personal-work/server/personal-work.service";
import { listPersonalGoogleCalendarEvents } from "@/domains/personal-work/server/google-calendar.service";

// Importing Google dates can update tasks, so synchronization is explicitly POST.
export async function POST() {
  const user = await requirePermissionApi(PERMISSIONS.TASK_VIEW);
  if (user instanceof NextResponse) return user;
  let events = null;
  let loadError: string | null = null;
  let reconnectRequired = false;
  try {
    events = await listPersonalGoogleCalendarEvents(user.id);
  } catch (error) {
    ({ loadError, reconnectRequired } = calendarLoadFailure(error));
  }
  const data = await getPersonalWorkPageData(user);
  return NextResponse.json(
    {
      events,
      items: data.items,
      lastSyncedAt: data.calendar.lastSyncedAt,
      loadError,
      reconnectRequired,
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
