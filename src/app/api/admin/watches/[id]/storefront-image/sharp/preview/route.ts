import { NextRequest, NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { previewWatchCoverWithSharpApplication } from "@/domains/watch/application";
import {
  DEFAULT_PHOTOROOM_ADJUSTMENT,
  type PhotoRoomAdjustment,
} from "@/domains/watch/shared/photoroom-adjustment";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

export const maxDuration = 30;

function parseAdjustment(value: unknown): PhotoRoomAdjustment | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  const pick = <T extends string>(candidate: unknown, allowed: readonly T[], fallback: T): T =>
    allowed.includes(candidate as T) ? candidate as T : fallback;
  const number = (candidate: unknown, min: number, max: number, fallback: number) => {
    const parsed = Number(candidate);
    return Number.isFinite(parsed) ? Math.max(min, Math.min(max, Math.round(parsed))) : fallback;
  };
  const legacyOffset = (numeric: unknown, legacy: unknown) => {
    const parsed = Number(numeric);
    if (Number.isFinite(parsed)) return Math.max(-20, Math.min(20, Math.round(parsed)));
    return legacy === "negative" ? -6 : legacy === "positive" ? 6 : 0;
  };
  const orientation = Number(input.orientationDegrees);
  return {
    horizontalAlignment: pick(input.horizontalAlignment, ["left", "center", "right"], DEFAULT_PHOTOROOM_ADJUSTMENT.horizontalAlignment),
    verticalAlignment: pick(input.verticalAlignment, ["top", "center", "bottom"], DEFAULT_PHOTOROOM_ADJUSTMENT.verticalAlignment),
    subjectSize: pick(input.subjectSize, ["small", "default", "large", "xlarge"], DEFAULT_PHOTOROOM_ADJUSTMENT.subjectSize),
    zoomPercent: number(input.zoomPercent, 40, 200, DEFAULT_PHOTOROOM_ADJUSTMENT.zoomPercent),
    horizontalOffsetPercent: legacyOffset(input.horizontalOffsetPercent, input.horizontalOffset),
    verticalOffsetPercent: legacyOffset(input.verticalOffsetPercent, input.verticalOffset),
    shadowMode: pick(input.shadowMode, ["none", "soft", "hard", "floating"], DEFAULT_PHOTOROOM_ADJUSTMENT.shadowMode),
    backgroundMode: pick(input.backgroundMode, ["white", "transparent"], DEFAULT_PHOTOROOM_ADJUSTMENT.backgroundMode),
    enhanceMetal: input.enhanceMetal === true,
    flipHorizontal: input.flipHorizontal === true,
    orientationDegrees: [-90, 0, 90, 180].includes(orientation) ? orientation as PhotoRoomAdjustment["orientationDegrees"] : 0,
    rotationDegrees: number(input.rotationDegrees, -15, 15, 0),
  };
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
  if (auth instanceof Response) return auth;
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const bytes = await previewWatchCoverWithSharpApplication({
      productId: id,
      storageKey: String(body?.storageKey ?? "").trim(),
      adjustment: parseAdjustment(body?.adjustment),
      baseAdjustment: parseAdjustment(body?.baseAdjustment),
    });
    return new NextResponse(new Uint8Array(bytes), {
      headers: { "Content-Type": "image/png", "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Không thể tạo preview Sharp." }, { status: 502 });
  }
}
