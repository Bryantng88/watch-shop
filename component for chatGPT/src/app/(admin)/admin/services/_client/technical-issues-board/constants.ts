import type { BoardColumnKey } from "./types";

export const COLUMNS: Array<{
  key: BoardColumnKey;
  title: string;
  subtitle: string;
}> = [
  {
    key: "PENDING_CONFIRM",
    title: "Chờ xác nhận",
    subtitle: "Issue mới mở từ phiếu kỹ thuật",
  },
  {
    key: "READY",
    title: "Đã xác nhận",
    subtitle: "Sẵn sàng đưa vào xử lý",
  },
  {
    key: "IN_PROGRESS",
    title: "Đang xử lý",
    subtitle: "Issue đang được thực hiện",
  },
  {
    key: "DONE",
    title: "Hoàn tất",
    subtitle: "Issue đã xử lý xong",
  },
];
