import type { WorkTypeCoordinationContext } from "@/domains/task/server/work-type.types";

export type WorkspaceProvisioningMode = "AUTO" | "MANUAL";

export type WorkspaceProvisioningScope = "CURRENT_ACTIVE_WEEKLY_SPACE";

export type WorkspaceProvisioningTrigger =
  | "SPACE_OPENED"
  | "FIRST_INTAKE_EVENT";

export type WorkspaceProvisioningPolicy = {
  mode: WorkspaceProvisioningMode;
  scope: WorkspaceProvisioningScope;
  trigger: WorkspaceProvisioningTrigger;
};

export const MANUAL_WORKSPACE_PROVISIONING: WorkspaceProvisioningPolicy = {
  mode: "MANUAL",
  scope: "CURRENT_ACTIVE_WEEKLY_SPACE",
  trigger: "FIRST_INTAKE_EVENT",
};

export function workspaceProvisioningForWorkType(input: {
  workTypeKey: string;
  coordinationContext: WorkTypeCoordinationContext | "DRAFT";
  enabled?: boolean;
}): WorkspaceProvisioningPolicy {
  if (input.coordinationContext === "DRAFT" || !input.enabled) {
    return MANUAL_WORKSPACE_PROVISIONING;
  }

  return {
    mode: "AUTO",
    scope: "CURRENT_ACTIVE_WEEKLY_SPACE",
    trigger: "SPACE_OPENED",
  };
}

export function shouldAutoCreateOnSpaceOpened(
  provisioning: WorkspaceProvisioningPolicy | null | undefined,
) {
  return (
    provisioning?.mode === "AUTO" &&
    provisioning.scope === "CURRENT_ACTIVE_WEEKLY_SPACE" &&
    provisioning.trigger === "SPACE_OPENED"
  );
}
