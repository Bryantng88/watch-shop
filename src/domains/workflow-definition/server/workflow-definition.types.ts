import type { Prisma } from "@prisma/client";

export type WorkflowTriggerType =
  | "EVENT"
  | "MANUAL"
  | "TIME"
  | "CONDITION"
  | "WEBHOOK"
  | "CUSTOM";

export type WorkflowStateDefinition = {
  key: string;
  title: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  sortOrder: number;
};

export type WorkflowTransitionDefinition = {
  fromState: string;
  toState: string;
  triggerType: WorkflowTriggerType;
  triggerValue: string | null;
  manualActionLabel: string | null;
  condition: Prisma.JsonObject | null;
  metadata: Prisma.JsonObject | null;
};

export type WorkflowDefinition = {
  key: string;
  title: string;
  description: string | null;
  states: WorkflowStateDefinition[];
  transitions: WorkflowTransitionDefinition[];
  initialState: string;
  terminalStates: string[];
  metadata: Prisma.JsonObject | null;
};
