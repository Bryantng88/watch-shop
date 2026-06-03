import type { BoardColumnKey } from "./types";

export function canMove(from: BoardColumnKey, to: BoardColumnKey) {
  if (from === to) return false;

  if (from === "PENDING_CONFIRM" && to === "READY") return true;

  // 2 case này cho phép drag, nhưng sẽ mở modal trước khi gọi API
  if (from === "READY" && to === "IN_PROGRESS") return true;
  if (from === "IN_PROGRESS" && to === "DONE") return true;

  return false;
}