import { after, NextResponse } from "next/server";

import {
  getServiceOperationCounters,
  listServiceOperationSrCases,
  listServiceOperationTiStageItems,
  resolveServiceOperationScope,
  type ServiceOperationRange,
  type ServiceOperationTiListInput,
} from "@/domains/service/server/operation";
import {
  getOrCreateServiceOperationWorkspaceForWatch,
  watchIntakeWithInitialSuspicion,
} from "@/domains/service/server/watch-quick";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";

function normalizeRange(value: string | null): ServiceOperationRange {
  return value === "CURRENT_WEEK" ? "CURRENT_WEEK" : "ALL_ACTIVE";
}

function normalizeStage(value: string | null): NonNullable<ServiceOperationTiListInput["stage"]> {
  if (
    value === "INSPECT" ||
    value === "READY" ||
    value === "IN_PROGRESS" ||
    value === "DONE"
  ) {
    return value;
  }

  return "ALL";
}

function numberParam(value: string | null, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return parsed;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const range = normalizeRange(url.searchParams.get("range"));
  const anchorDate = url.searchParams.get("anchorDate") ?? null;
  const stage = normalizeStage(url.searchParams.get("stage"));
  const srPage = numberParam(url.searchParams.get("srPage"), 1);
  const srPageSize = numberParam(url.searchParams.get("srPageSize"), 20);
  const tiPage = numberParam(url.searchParams.get("tiPage"), 1);
  const tiPageSize = numberParam(url.searchParams.get("tiPageSize"), 24);

  const [srCases, tiItems, counters] = await Promise.all([
    listServiceOperationSrCases({
      q,
      range,
      anchorDate,
      page: srPage,
      pageSize: srPageSize,
    }),
    listServiceOperationTiStageItems({
      q,
      range,
      anchorDate,
      stage,
      page: tiPage,
      pageSize: tiPageSize,
    }),
    getServiceOperationCounters({ range, anchorDate }),
  ]);

  return NextResponse.json({
    ok: true,
    scope: resolveServiceOperationScope({ range, anchorDate }),
    counters,
    srCases,
    tiItems,
  });
}

function fail(error: unknown, status = 400) {
  const message = error instanceof Error ? error.message : "Cannot process Service Operation request.";
  return NextResponse.json({ ok: false, error: message }, { status });
}

function isAuthResponse(value: unknown): value is NextResponse {
  return value instanceof NextResponse;
}

export async function POST(request: Request) {
  try {
    const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
    if (isAuthResponse(auth)) return auth;

    const body = await request.json().catch(() => ({}));
    const action = String(body?.action ?? "").trim();

    if (action !== "watch_intake" && action !== "watch_intake_with_suspicion") {
      throw new Error("Unsupported Service Operation action.");
    }

    const data =
      action === "watch_intake_with_suspicion"
        ? await watchIntakeWithInitialSuspicion({
            productId: body?.productId,
            suspicion: body?.suspicion,
            actorUserId: auth.id ?? auth.userId ?? null,
            openExisting: body?.openExisting === true,
            deferConsumers: (work) => after(work),
          })
        : await getOrCreateServiceOperationWorkspaceForWatch({
            productId: body?.productId,
            actorUserId: auth.id ?? auth.userId ?? null,
            openExisting: body?.openExisting === true,
          });

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return fail(error);
  }
}
