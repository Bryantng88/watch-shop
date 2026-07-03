import WorkflowAdminClient from "@/domains/workflow-definition/client/WorkflowAdminClient";
import { listBlueprintLibraryItems } from "@/domains/blueprint/server";
import { listBusinessEventCatalog } from "@/domains/event/server/business-event-catalog.service";
import { listWorkflowDefinitionDrafts } from "@/domains/workflow-definition/server/workflow-definition-draft.service";
import { requirePermission } from "@/server/auth/requirePermission";

export default async function SystemWorkflowAdminPage() {
  await requirePermission("TASK_VIEW");

  const blueprints = await listBlueprintLibraryItems();
  const businessEvents = listBusinessEventCatalog();
  const drafts = await listWorkflowDefinitionDrafts();

  return (
    <WorkflowAdminClient
      blueprints={blueprints}
      businessEvents={businessEvents}
      initialDrafts={drafts}
    />
  );
}
