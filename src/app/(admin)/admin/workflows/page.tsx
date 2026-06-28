import WorkflowListClient from "@/domains/workflow/client/WorkflowListClient";
import { listWorkflowTemplatesAction } from "@/domains/workflow/actions/workflow.actions";

export default async function AdminWorkflowsPage() {
    const result = await listWorkflowTemplatesAction();

    return <WorkflowListClient items={result.items ?? []} />;
}