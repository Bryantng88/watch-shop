import { NextResponse } from "next/server";
import {
  createWorkflowDefinitionDraft,
  listWorkflowDefinitionDrafts,
} from "@/domains/workflow-definition/server/workflow-definition-draft.service";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

function isApiResponse(value: unknown): value is NextResponse {
  return value instanceof NextResponse;
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export async function GET() {
  const auth = await requirePermissionApi("TASK_VIEW");
  if (isApiResponse(auth)) return auth;

  try {
    const drafts = await listWorkflowDefinitionDrafts();

    return NextResponse.json({ ok: true, drafts });
  } catch (error: unknown) {
    return NextResponse.json(
      { ok: false, error: errorMessage(error, "Cannot load workflow drafts") },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const auth = await requirePermissionApi("TASK_VIEW");
  if (isApiResponse(auth)) return auth;

  try {
    const body = await request.json().catch(() => ({}));
    const draft = await createWorkflowDefinitionDraft({
      sourceRegistryKey: body?.sourceRegistryKey ?? null,
      definitionJson: body?.definitionJson ?? null,
      blueprintJson: body?.blueprintJson ?? null,
      createdByUserId: auth.id ?? null,
    });

    return NextResponse.json({ ok: true, draft });
  } catch (error: unknown) {
    return NextResponse.json(
      { ok: false, error: errorMessage(error, "Cannot create workflow draft") },
      { status: 400 },
    );
  }
}
