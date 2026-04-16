import type { BoardColumnKey } from "./types";

export function canMove(from: BoardColumnKey, to: BoardColumnKey) {
  if (from === to) return false;
  if (from === "PENDING_CONFIRM" && to === "READY") return true;
  if (from === "READY" && to === "IN_PROGRESS") return true;
  if (from === "IN_PROGRESS" && to === "DONE") return true;
  return false;
}
