import type { Prisma } from "@prisma/client";
import type { WorkflowDefinition } from "@/domains/workflow-definition/server/workflow-definition.types";
import type { WorkspaceProvisioningPolicy } from "@/domains/blueprint/shared/workspace-provisioning";

export type WorkTypeCoordinationContext =
  | "OPERATION"
  | "SALES"
  | "TECHNICAL"
  | "MEDIA"
  | "PAYMENT"
  | "GENERAL";

export type WorkTypeDefinition = {
  key: string;
  title: string;
  coordinationContext: WorkTypeCoordinationContext;
  icon: string | null;
  defaultOwnerRole: string | null;
  defaultParticipants: string[];
  workflowKey: string | null;
  routingKeys: string[];
  enabled: boolean;
  provisioning?: WorkspaceProvisioningPolicy;
  sortOrder: number;
  metadata: Prisma.JsonObject | null;
};

export type WorkTypeWithWorkflowDefinition = WorkTypeDefinition & {
  workflowDefinition: WorkflowDefinition | null;
  workflowMissing: boolean;
};
