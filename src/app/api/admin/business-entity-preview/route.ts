import { NextRequest, NextResponse } from "next/server";

import type { BusinessEntityType } from "@/domains/shared/business/business-entity.types";
import { getBusinessEntityPreviewAction } from "@/domains/shared/business/business-entity-preview.actions";
import { addTaskItemDiscussionAction } from "@/domains/task/actions/task.actions";

const BUSINESS_ENTITY_TYPES = new Set<BusinessEntityType>([
  "WATCH",
  "ORDER",
  "SHIPMENT",
  "SERVICE",
  "TECHNICAL_ISSUE",
  "PAYMENT",
  "ACQUISITION",
]);

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type") as BusinessEntityType | null;
  const id = request.nextUrl.searchParams.get("id")?.trim() ?? "";
  const activityMode = request.nextUrl.searchParams.get("activityMode") === "DISCUSSION"
    ? "DISCUSSION"
    : "ALL";
  if (!type || !BUSINESS_ENTITY_TYPES.has(type) || !id) {
    return NextResponse.json({ error: "Ngữ cảnh xem nhanh không hợp lệ." }, { status: 400 });
  }

  try {
    const preview = await getBusinessEntityPreviewAction({ type, id, activityMode });
    return NextResponse.json({ preview });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không thể tải xem nhanh." },
      { status: 400 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    const result = await addTaskItemDiscussionAction({
      taskItemId: String(input.taskItemId ?? ""),
      targetType: String(input.targetType ?? ""),
      targetId: String(input.targetId ?? ""),
      body: String(input.body ?? ""),
      mentionedUserIds: Array.isArray(input.mentionedUserIds)
        ? input.mentionedUserIds.map(String)
        : [],
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không thể gửi trao đổi." },
      { status: 400 },
    );
  }
}
