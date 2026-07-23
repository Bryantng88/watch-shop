import { NextResponse } from "next/server";
import { applyQueueItemManualTransitionAction } from "@/domains/task/actions/task.actions";

function clean(value: unknown) {
  return String(value ?? "").trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const bindingId = clean(body?.bindingId);
    const actionKey = clean(body?.actionKey);

    if (!bindingId || !actionKey) {
      return NextResponse.json(
        { error: "Thiếu thông tin thao tác." },
        { status: 400 },
      );
    }

    const result = await applyQueueItemManualTransitionAction({
      bindingId,
      actionKey,
    });

    return NextResponse.json({
      ok: result.ok,
      result: result.result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : "Không thể cập nhật workflow.",
      },
      { status: 500 },
    );
  }
}
