export type CoordinationContext =
  | "OPERATION"
  | "SALES"
  | "TECHNICAL"
  | "MEDIA"
  | "PAYMENT"
  | "GENERAL";

export type CoordinationWeekRange = {
  weekLabel: string;
  startDate: Date;
  endDate: Date;
  year: number;
  weekNumber: number;
  periodKey: string;
};

export type ResolveCurrentCoordinationCycleInput = {
  context: CoordinationContext;
  date?: Date;
};

export type EnsureCoordinationCycleInput = ResolveCurrentCoordinationCycleInput & {
  provisionWorkTickets?: boolean;
};

export type CoordinationCycleTask = {
  id: string;
  title: string;
  description: string | null;
  source: string;
  kind: string;
  periodType: string | null;
  periodKey: string | null;
  status: string;
};

export type CoordinationWorkTicket = {
  id: string;
  taskId: string;
  title: string;
  note: string | null;
  sortOrder: number;
  status: string;
};

export type ResolveCurrentCoordinationCycleResult = {
  task: CoordinationCycleTask;
  week: CoordinationWeekRange;
  context: CoordinationContext;
};

export type EnsureCoordinationCycleResult = ResolveCurrentCoordinationCycleResult & {
  created: boolean;
  workTickets: CoordinationWorkTicket[];
  workTicketsCreated: number;
};
