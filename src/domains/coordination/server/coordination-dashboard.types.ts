import type { CoordinationContext } from "./coordination-cycle.types";
import type {
  BlueprintSource,
  BlueprintWorkspaceDefinition,
} from "@/domains/blueprint/server";

export type CoordinationReportMetricDTO = {
  key: string;
  label: string;
  value: number;
};

export type QueueSummaryDTO = {
  ready: number;
  review: number;
  feedback: number;
  done: number;
};

export type CoordinationWorkTicketSummaryDTO = {
  id: string;
  title: string;
  ownerLabel: string;
  owner: {
    label: string;
    avatarUrl: string | null;
    isSystem: boolean;
  };
  queueSummary: QueueSummaryDTO;
  needAttention: boolean;
  feedbackCount: number;
  lastActivity: string | null;
  lastActivityAt: string | null;
  updatedAt: string | null;
};

export type CoordinationDashboardDTO = {
  context: CoordinationContext;
  contextLabel: string;
  spaceLabel: string;
  spacesLabel: string;
  title: string;
  week: {
    label: string;
    periodKey: string;
    startDate: string;
    endDate: string;
    weekNumber: number;
    year: number;
  };
  cycle: {
    id: string;
    title: string;
    created: boolean;
  };
  filters: {
    selectedDate: string;
    weekOptions: Array<{
      label: string;
      value: string;
      date: string;
    }>;
  };
  report: CoordinationReportMetricDTO[];
  blueprints: Array<{
    selectionKey: string;
    key: string;
    name: string;
    description: string | null;
    workflowKey: string | null;
    businessContext: CoordinationContext | "DRAFT";
    source: BlueprintSource;
    status: string | null;
    workspaceDefinition: BlueprintWorkspaceDefinition;
    snapshotNote: string;
  }>;
  workTickets: CoordinationWorkTicketSummaryDTO[];
};
