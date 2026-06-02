import type { BoardColumnKey } from "./types";

export function canMove(from: BoardColumnKey, to: BoardColumnKey) {
  if (from === to) return false;

  // Cho phép xác nhận nhanh bằng kéo thả.
  if (from === "PENDING_CONFIRM" && to === "READY") return true;

  // READY -> IN_PROGRESS và IN_PROGRESS -> DONE phải mở drawer/modal
  // để nhập Chi tiết kỹ thuật / Kết luận kỹ thuật, không kéo thả thẳng.
  return false;
}
