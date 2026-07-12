import { NextResponse } from "next/server";
import {
  createSpaceFromPublishedBlueprintVersion,
} from "@/domains/blueprint/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

function isApiResponse(value: unknown): value is NextResponse {
  return value instanceof NextResponse;
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requirePermissionApi("TASK_VIEW");
  if (isApiResponse(auth)) return auth;

  try {
    const { id } = await params;
    const result = await createSpaceFromPublishedBlueprintVersion({
      publishedVersionId: id,
      actorUserId: auth.id ?? null,
    });

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ok: true,
      result,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error: errorMessage(error, "Cannot create Space from Blueprint"),
      },
      { status: 500 },
    );
  }
}
