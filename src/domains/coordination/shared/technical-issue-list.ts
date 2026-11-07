import type { CoordinationTechnicalIssueBoardItemDTO } from "../server/coordination-dashboard.types";

export type TechnicalIssueListSort = "PRIORITY" | "UPDATED" | "DUE";
export type TechnicalIssueListStage = CoordinationTechnicalIssueBoardItemDTO["stage"];
export const TECHNICAL_LIST_STAGES: { key: TechnicalIssueListStage; label: string }[] = [
  { key: "INSPECT", label: "Kiểm tra" },
  { key: "READY", label: "Chờ xử lý" },
  { key: "PROCESSING", label: "Xử lý" },
  { key: "DONE", label: "Done" },
];

export function technicalIssueListRows(items: CoordinationTechnicalIssueBoardItemDTO[], stage: TechnicalIssueListStage, sort: TechnicalIssueListSort) {
  const time = (value: string | null, fallback: number) => {
    const parsed = value ? Date.parse(value) : NaN;
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  return items.filter(item => item.stage === stage).sort((a, b) => {
    if (sort === "PRIORITY") {
      const urgent = Number(b.priority?.toUpperCase() === "URGENT") - Number(a.priority?.toUpperCase() === "URGENT");
      if (urgent) return urgent;
    }
    if (sort === "DUE") {
      const due = time(a.expectedCompletionAt, Infinity) - time(b.expectedCompletionAt, Infinity);
      if (due && !Number.isNaN(due)) return due;
    }
    return time(b.updatedAt, 0) - time(a.updatedAt, 0) || a.id.localeCompare(b.id);
  });
}
