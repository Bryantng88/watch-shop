import { after, NextRequest, NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { processWatchCoverWithPhotoRoomApplication } from "@/domains/watch/application";
import {
  DEFAULT_PHOTOROOM_ADJUSTMENT,
  type PhotoRoomAdjustment,
} from "@/domains/watch/shared/photoroom-adjustment";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

export const maxDuration = 120;

function parseAdjustment(value: unknown): PhotoRoomAdjustment | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  const pick = <T extends string>(candidate: unknown, allowed: readonly T[], fallback: T): T =>
    allowed.includes(candidate as T) ? candidate as T : fallback;
  const rawRotation = Number(input.rotationDegrees);
  const rotationDegrees = Number.isFinite(rawRotation)
    ? Math.max(-15, Math.min(15, Math.round(rawRotation)))
    : DEFAULT_PHOTOROOM_ADJUSTMENT.rotationDegrees;
  const rawOrientation = Number(input.orientationDegrees);
  const orientationDegrees = [-90, 0, 90, 180].includes(rawOrientation)
    ? rawOrientation as PhotoRoomAdjustment["orientationDegrees"]
    : DEFAULT_PHOTOROOM_ADJUSTMENT.orientationDegrees;
  const rawZoom = Number(input.zoomPercent);
  const zoomPercent = Number.isFinite(rawZoom)
    ? Math.max(40, Math.min(200, Math.round(rawZoom)))
    : DEFAULT_PHOTOROOM_ADJUSTMENT.zoomPercent;

  return {
    horizontalAlignment: pick(input.horizontalAlignment, ["left", "center", "right"], DEFAULT_PHOTOROOM_ADJUSTMENT.horizontalAlignment),
    verticalAlignment: pick(input.verticalAlignment, ["top", "center", "bottom"], DEFAULT_PHOTOROOM_ADJUSTMENT.verticalAlignment),
    subjectSize: pick(input.subjectSize, ["small", "default", "large", "xlarge"], DEFAULT_PHOTOROOM_ADJUSTMENT.subjectSize),
    zoomPercent,
    horizontalOffset: pick(input.horizontalOffset, ["negative", "none", "positive"], DEFAULT_PHOTOROOM_ADJUSTMENT.horizontalOffset),
    verticalOffset: pick(input.verticalOffset, ["negative", "none", "positive"], DEFAULT_PHOTOROOM_ADJUSTMENT.verticalOffset),
    shadowMode: pick(input.shadowMode, ["none", "soft", "hard", "floating"], DEFAULT_PHOTOROOM_ADJUSTMENT.shadowMode),
    backgroundMode: pick(input.backgroundMode, ["white", "transparent"], DEFAULT_PHOTOROOM_ADJUSTMENT.backgroundMode),
    enhanceMetal: input.enhanceMetal === true,
    orientationDegrees,
    rotationDegrees,
  };
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
  if (auth instanceof Response) return auth;

  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    const result = await processWatchCoverWithPhotoRoomApplication({
      productId: id,
      storageKey: String(body?.storageKey ?? "").trim(),
      adjustment: parseAdjustment(body?.adjustment),
      actorUserId: auth.id,
      processingKind: body?.processingKind === "REPROCESS" ? "REPROCESS" : "INITIAL",
      deferConsumers: (work) => after(work),
    });
    return NextResponse.json({ ok: true, data: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Không thể xử lý ảnh bằng PhotoRoom.";
    const status = message.includes("PHOTOROOM_API_KEY") ? 503 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
