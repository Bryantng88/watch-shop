import { NextResponse } from "next/server";

/**
 * Compatibility boundary for browser bundles cached before list dashboards
 * were removed. New clients must use the consolidated reports surface.
 */
export function GET() {
  return NextResponse.json(
    {
      ok: false,
      error: "Dashboard danh sách đã được chuyển sang mục Báo cáo.",
      href: "/admin/reports/overview",
    },
    { status: 410 },
  );
}
