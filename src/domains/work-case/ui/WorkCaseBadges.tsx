import type { TaskPriority, WorkCaseScope, WorkCaseStatus } from "@prisma/client";
import { WORK_CASE_PRIORITY_LABEL, WORK_CASE_SCOPE_LABEL, WORK_CASE_STATUS_LABEL, workCasePriorityTone, workCaseStatusTone } from "../utils/work-case-labels";

function Badge({ children, className }: { children: React.ReactNode; className: string }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${className}`}>{children}</span>;
}

export function WorkCaseStatusBadge({ status }: { status: WorkCaseStatus }) {
  return <Badge className={workCaseStatusTone(status)}>{WORK_CASE_STATUS_LABEL[status]}</Badge>;
}

export function WorkCasePriorityBadge({ priority }: { priority: TaskPriority }) {
  return <Badge className={workCasePriorityTone(priority)}>{WORK_CASE_PRIORITY_LABEL[priority]}</Badge>;
}

export function WorkCaseScopeBadge({ scope }: { scope: WorkCaseScope }) {
  return <Badge className="bg-slate-50 text-slate-700 ring-slate-200">{WORK_CASE_SCOPE_LABEL[scope]}</Badge>;
}
