export const OPERATION_BOARD_DONE_RETENTION_DAYS = 14;

export type OperationBoardDoneRange = "14D" | "30D" | "ALL";

export function operationBoardDoneRetentionDays(
  range?: OperationBoardDoneRange | null,
) {
  if (range === "ALL") return null;
  return range === "30D" ? 30 : OPERATION_BOARD_DONE_RETENTION_DAYS;
}

export function operationBoardDoneCutoff(
  retentionDays: number | null = OPERATION_BOARD_DONE_RETENTION_DAYS,
  now = new Date(),
) {
  if (retentionDays === null) return null;
  return new Date(
    now.getTime() - retentionDays * 24 * 60 * 60 * 1_000,
  );
}
