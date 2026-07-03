import { NextResponse } from "next/server";
import {
  archiveWorkflowDefinitionDraft,
  getWorkflowDefinitionDraft,
  updateWorkflowDefinitionDraft,
} from "@/domains/workflow-definition/server/workflow-definition-draft.service";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

function isApiResponse(value: unknown): value is NextResponse {
  return value instanceof NextResponse;
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const auth = await requirePermissionApi("TASK_VIEW");
  if (isApiResponse(auth)) return auth;

  const draft = await getWorkflowDefinitionDraft(params.id);
  if (!draft) {
    return NextResponse.json(
      { ok: false, error: "Workflow draft not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, draft });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const auth = await requirePermissionApi("TASK_VIEW");
  if (isApiResponse(auth)) return auth;

  try {
    const body = await request.json().catch(() => ({}));
    const draft = await updateWorkflowDefinitionDraft(params.id, {
      key: body?.key,
      workspaceTemplateKey: body?.workspaceTemplateKey,
      workTypeKey: body?.workTypeKey,
      name: body?.name,
      description: body?.description,
      blueprintJson: body?.blueprintJson,
      definitionJson: body?.definitionJson,
      updatedByUserId: auth.id ?? null,
    });

    if (!draft) {
      return NextResponse.json(
        { ok: false, error: "Workflow draft not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, draft });
  } catch (error: unknown) {
    return NextResponse.json(
      { ok: false, error: errorMessage(error, "Cannot update workflow draft") },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const auth = await requirePermissionApi("TASK_VIEW");
  if (isApiResponse(auth)) return auth;

  const draft = await archiveWorkflowDefinitionDraft(params.id, auth.id ?? null);
  if (!draft) {
    return NextResponse.json(
      { ok: false, error: "Workflow draft not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, draft });
}
