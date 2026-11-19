export type OperationalActionFailure = {ok: false; outcome: "REJECTED" | "UNKNOWN"; error: string; reference?: string};
// Only fixed business messages may cross the production action boundary.
const businessMessages = new Set([
  "Vui lòng nhập chi phí thực tế hợp lệ. Chi phí có thể bằng 0.",
  "Không tìm thấy issue.",
  "Issue chưa có chi tiết kỹ thuật. Vui lòng bắt đầu xử lý đúng luồng trước khi hoàn tất.",
  "Chi phí đang chờ duyệt. Vui lòng duyệt chi phí trước khi hoàn tất Technical Issue.",
  "Phiếu đã hoàn tất. Tải lại danh sách để kiểm tra chi phí và khoản thanh toán; không cần hoàn tất lại.",
  "Phiếu đã hủy, không thể hoàn tất xử lý.",
]);
export function operationalActionFailure(error: unknown, reference: string): OperationalActionFailure {
  const message = error instanceof Error ? error.message : "";
  if (businessMessages.has(message)) return {ok: false, outcome: "REJECTED", error: message};
  if (message === "FORBIDDEN") return {ok: false, outcome: "REJECTED", error: "Bạn chưa có quyền thực hiện thao tác này."};
  return {ok: false, outcome: "UNKNOWN", reference,
    error: `Chưa xác nhận được kết quả xử lý. Tải lại danh sách để kiểm tra trạng thái và chi phí trước khi thử lại. Mã kiểm tra: ${reference}.`};
}
export class OperationalActionClientError extends Error {
  readonly outcome: OperationalActionFailure["outcome"];
  readonly reference?: string;
  constructor(failure: OperationalActionFailure) {
    super(failure.error); this.name = "OperationalActionClientError";
    this.outcome = failure.outcome; this.reference = failure.reference;
  }
}
export function isUnknownOperationalAction(error: unknown) {
  return error instanceof OperationalActionClientError && error.outcome === "UNKNOWN";
}
