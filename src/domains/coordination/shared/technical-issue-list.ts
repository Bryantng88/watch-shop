import type {
  CoordinationTechnicalIssueBoardItemDTO as Item,
  CoordinationBoardColumnPaginationDTO,
} from "../server/coordination-dashboard.types";
export type TechnicalIssueListSort = "PRIORITY" | "UPDATED" | "DUE";
export type TechnicalIssueListStage = Item["stage"];
export type TechnicalIssueListScope = "OPEN" | TechnicalIssueListStage;
export type TechnicalIssueListAttention =
  | "ALL"
  | "OVERDUE"
  | "URGENT"
  | "MENTIONED";
export type TechnicalIssueListState = {
  scope: TechnicalIssueListScope;
  sort: TechnicalIssueListSort;
  attention: TechnicalIssueListAttention;
  page: number;
};
export const DEFAULT_TI_LIST_STATE: TechnicalIssueListState = {
  scope: "OPEN",
  sort: "PRIORITY",
  attention: "ALL",
  page: 1,
};
export const TECHNICAL_LIST_STAGES: {
  key: TechnicalIssueListStage;
  label: string;
}[] = [
  { key: "INSPECT", label: "Kiểm tra" },
  { key: "READY", label: "Chờ xử lý" },
  { key: "PROCESSING", label: "Đang xử lý" },
  { key: "DONE", label: "Đã xong" },
];
export function technicalIssueMatches(item: Item, query: string) {
  const fold = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLocaleLowerCase("vi");
  const text = fold(
    [
      item.summary,
      item.serviceRequest.refNo,
      item.serviceRequest.productTitle,
      item.serviceRequest.sku,
      item.vendorName,
      ...item.processingDetails,
    ]
      .filter(Boolean)
      .join(" "),
  );
  return fold(query)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => text.includes(term));
}
export function technicalIssueListRows(
  items: Item[],
  scope: TechnicalIssueListScope,
  sort: TechnicalIssueListSort,
  attention: TechnicalIssueListAttention = "ALL",
) {
  const time = (value: string | null, fallback: number) => {
    const parsed = value ? Date.parse(value) : NaN;
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  return items
    .filter(
      (item) =>
        (scope === "OPEN" ? item.stage !== "DONE" : item.stage === scope) &&
        (attention === "OVERDUE"
          ? item.stage !== "DONE" && (item.overdueDays ?? 0) > 0
          : attention === "URGENT"
            ? item.priority?.toUpperCase() === "URGENT"
            : attention === "MENTIONED"
              ? item.unreadMentionCount > 0
              : true),
    )
    .sort((a, b) => {
      if (sort === "PRIORITY") {
        const urgent =
          Number(b.priority?.toUpperCase() === "URGENT") -
          Number(a.priority?.toUpperCase() === "URGENT");
        if (urgent) return urgent;
      }
      if (sort === "DUE") {
        const due =
          time(a.expectedCompletionAt, Infinity) -
          time(b.expectedCompletionAt, Infinity);
        if (due && !Number.isNaN(due)) return due;
      }
      return (
        time(b.updatedAt, 0) - time(a.updatedAt, 0) || a.id.localeCompare(b.id)
      );
    });
}
export function technicalIssueListStages(scope: TechnicalIssueListScope) {
  return TECHNICAL_LIST_STAGES.filter((stage) =>
    scope === "OPEN" ? stage.key !== "DONE" : stage.key === scope,
  );
}
export function technicalIssueListLoadTarget(
  scope: TechnicalIssueListScope,
  pagination: CoordinationBoardColumnPaginationDTO,
) {
  return (
    technicalIssueListStages(scope).find(
      (stage) =>
        pagination[stage.key]?.hasMore &&
        pagination[stage.key].nextPage != null,
    )?.key ?? null
  );
}
export function technicalIssuePrimaryMove(
  stage: TechnicalIssueListStage,
  options: { stage: TechnicalIssueListStage; label: string }[],
) {
  const order = TECHNICAL_LIST_STAGES.map((column) => column.key);
  return (
    options
      .filter((option) => order.indexOf(option.stage) > order.indexOf(stage))
      .sort((a, b) => order.indexOf(a.stage) - order.indexOf(b.stage))[0] ??
    null
  );
}
export function technicalIssueLayoutUrl(
  href: string,
  layout: "board" | "list",
) {
  const url = new URL(href);
  if (layout === "list") url.searchParams.set("tiLayout", "list");
  else url.searchParams.delete("tiLayout");
  return url.toString();
}

export function technicalIssueViewSelection(flowKey: string, value: string) {
  return flowKey === "technical-issue-flow" &&
    (value === "TI_BOARD" || value === "LIST")
    ? {
        engine: "TI_BOARD" as const,
        layout: value === "LIST" ? ("list" as const) : ("board" as const),
      }
    : null;
}
