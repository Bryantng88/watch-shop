import type { BoardColumnKey } from "./types";

export function canMove(from: BoardColumnKey, to: BoardColumnKey) {
  if (from === to) return false;
  if (from === "PENDING_CONFIRM" && to === "READY") return true;
  if (from === "READY" && to === "IN_PROGRESS") return true;
  // Không kéo thả trực tiếp sang Hoàn tất.
  // Issue phải được mở modal và nhập đủ "Kết luận kỹ thuật" trước khi hoàn tất.
  if (from === "IN_PROGRESS" && to === "DONE") return false;
  return false;
}
