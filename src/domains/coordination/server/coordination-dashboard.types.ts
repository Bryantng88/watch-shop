export type CoordinationReportMetricDTO = {
  key: string;
  label: string;
  value: number;
};

export type CoordinationWorkTicketSummaryDTO = {
  id: string;
  title: string;
  ownerLabel: string;
  queueCount: number;
  needAttention: boolean;
  feedbackCount: number;
  lastActivity: string | null;
  lastActivityAt: string | null;
  updatedAt: string | null;
  progress: {
    queue: number;
    waiting: number;
    feedback: number;
    done: number;
  };
};

export type CoordinationDashboardDTO = {
  context: "OPERATION";
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
  workTickets: CoordinationWorkTicketSummaryDTO[];
};
