import { NextRequest, NextResponse } from "next/server";

import {
  getCoordinationBoard,
  type CoordinationBoardKey,
} from "@/domains/coordination/server/coordination-dashboard.service";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { prisma } from "@/server/db/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BOARD_KEYS = new Set<CoordinationBoardKey>([
  "technical-issue",
  "media-operation",
]);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ boardKey: string }> },
) {
  const auth = await requirePermissionApi("TASK_VIEW");
  if (auth instanceof NextResponse) return auth;

  const { boardKey: rawBoardKey } = await context.params;
  const boardKey = rawBoardKey as CoordinationBoardKey;
  if (!BOARD_KEYS.has(boardKey)) {
    return NextResponse.json(
      { ok: false, error: "Board không được hỗ trợ." },
      { status: 404 },
    );
  }

  try {
    const board = await getCoordinationBoard({
      db: prisma,
      boardKey,
      taskId: request.nextUrl.searchParams.get("taskId") ?? "",
      auth,
      stage: request.nextUrl.searchParams.get("stage"),
      page: Number(request.nextUrl.searchParams.get("page") ?? 1),
      pageSize: Number(request.nextUrl.searchParams.get("pageSize") ?? 10),
    });
    return NextResponse.json(
      { ok: true, boardKey, board },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Không thể tải board.",
      },
      { status: 500 },
    );
  }
}
