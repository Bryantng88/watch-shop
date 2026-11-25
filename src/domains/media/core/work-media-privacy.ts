import { posix } from "node:path";
import { normalizeKey } from "@/server/lib/storage-key";
/** Work bytes must only cross the owner-authorized Work Media endpoint. */
export function isWorkMediaKey(value: string) {
  const key = posix.normalize(normalizeKey(value));
  return key === "media/work" || key.startsWith("media/work/");
}
export function assertNotWorkMediaKey(value: string) {
  if (isWorkMediaKey(value)) throw new Error("Ảnh công việc chỉ được mở từ công việc có quyền truy cập.");
}
