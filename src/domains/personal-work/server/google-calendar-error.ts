export type CalendarFailureCode = "RECONNECT_REQUIRED" | "CONFIGURATION" | "TEMPORARY";

export class GoogleCalendarConnectionError extends Error {
  constructor(readonly code: CalendarFailureCode, readonly status?: number) {
    super(code === "RECONNECT_REQUIRED"
      ? "Quyền truy cập Google Calendar đã hết hạn hoặc bị thu hồi. Hãy kết nối lại."
      : code === "CONFIGURATION"
        ? "Cấu hình Google Calendar không còn hợp lệ. Cần quản trị viên kiểm tra."
        : "Google Calendar tạm thời chưa phản hồi. Vui lòng thử lại.");
  }
}

export async function calendarRefreshFailure(response: Response) {
  const body = await response.json().catch(() => null) as { error?: string } | null;
  const code = body?.error;
  return new GoogleCalendarConnectionError(
    code === "invalid_grant" || code === "invalid_token" ? "RECONNECT_REQUIRED"
      : code === "invalid_client" || code === "unauthorized_client" ? "CONFIGURATION" : "TEMPORARY",
    response.status,
  );
}

/** Only actionable, sanitized messages cross the API boundary. Never return Google payloads. */
export function calendarLoadFailure(error: unknown) {
  return {
    loadError: error instanceof GoogleCalendarConnectionError
      ? error.message + " Công việc trong ứng dụng vẫn được giữ nguyên."
      : "Không thể tải dữ liệu mới từ Google Calendar. Các công việc trong ứng dụng vẫn có thể xem và chỉnh sửa.",
    reconnectRequired: error instanceof GoogleCalendarConnectionError && error.code === "RECONNECT_REQUIRED",
  };
}
