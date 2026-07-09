import { NextResponse } from "next/server";

import {
  getServiceOperationCounters,
  listServiceOperationSrCases,
  listServiceOperationTiStageItems,
  resolveServiceOperationScope,
  type ServiceOperationRange,
  type ServiceOperationTiListInput,
} from "@/domains/service/server/operation";

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
