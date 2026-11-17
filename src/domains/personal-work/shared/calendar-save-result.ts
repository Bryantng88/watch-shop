export type CalendarSaveResult = { ok: true; calendarSync: "SYNCED" | "NOT_LINKED" | "FAILED" };

export function personalWorkSavedMessage(result: CalendarSaveResult) {
  return result.calendarSync === "SYNCED"
    ? "Đã cập nhật công việc và Google Calendar"
    : result.calendarSync === "FAILED"
      ? "Đã lưu công việc. Chưa đồng bộ Google Calendar; bạn có thể thử lại."
      : "Đã cập nhật công việc";
}

export function personalWorkActionFailure(error: unknown) {
  if (error instanceof Error && ("digest" in error || error.message.includes("Server Components render"))) {
    return "Chưa xác nhận được kết quả xử lý. Hãy tải lại danh sách để kiểm tra trước khi lưu lại.";
  }
  return error instanceof Error ? error.message : "Không thể xử lý yêu cầu";
}
