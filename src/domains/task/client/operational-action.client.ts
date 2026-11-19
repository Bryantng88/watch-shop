"use client";
import { submitOperationalActionResponse } from "../actions/operational-action-response.actions";
import { OperationalActionClientError } from "../shared/operational-action-response";
export async function submitOperationalBlueprintActionAction(input: Parameters<typeof submitOperationalActionResponse>[0]) {
  try {
    const response = await submitOperationalActionResponse(input);
    if (!response.ok) throw new OperationalActionClientError(response);
    return response.value;
  } catch (error) {
    if (error instanceof OperationalActionClientError) throw error;
    throw new OperationalActionClientError({ok: false, outcome: "UNKNOWN",
      error: "Kết nối bị gián đoạn, chưa xác nhận được kết quả. Tải lại danh sách để kiểm tra trạng thái và chi phí trước khi thử lại."});
  }
}
