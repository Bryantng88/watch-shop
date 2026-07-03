import { NextResponse } from "next/server";
import { validateWorkflowDefinitionDraft } from "@/domains/workflow-definition/server/workflow-definition-draft.service";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

function isApiResponse(value: unknown): value is NextResponse {
  return value instanceof NextResponse;
}

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const auth = await requirePermissionApi("TASK_VIEW");
  if (isApiResponse(auth)) return auth;

  const draft = await validateWorkflowDefinitionDraft(params.id);
  if (!draft) {
    return NextResponse.json(
      { ok: false, error: "Workflow draft not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ok: true,
    draft,
    validation: draft.validationJson,
  });
}
