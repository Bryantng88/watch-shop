import { NextResponse } from "next/server";
import {
  publishWorkflowDefinitionDraftBlueprint,
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
  { params }: { params: { id: string } },
) {
  const auth = await requirePermissionApi("TASK_VIEW");
  if (isApiResponse(auth)) return auth;

  try {
    const result = await publishWorkflowDefinitionDraftBlueprint({
      draftId: params.id,
      publishedByUserId: auth.id ?? null,
    });

    if (!result.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: result.error,
          publishPlan: result.publishPlan ?? null,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ok: true,
      version: result.version,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { ok: false, error: errorMessage(error, "Cannot publish Blueprint") },
      { status: 500 },
    );
  }
}

