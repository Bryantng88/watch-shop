/** Bound the entire POST including response parsing. Never retry a potentially mutating command. */
export async function boundedAssistantRequest<T>(
  work: (signal: AbortSignal) => Promise<T>,
  timeoutMs = 60_000,
): Promise<T> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error("Chưa xác nhận được kết quả vì kết nối chờ quá lâu. Hãy tải lại cuộc trao đổi để kiểm tra trước khi gửi lại."));
      controller.abort();
    }, timeoutMs);
  });
  try { return await Promise.race([work(controller.signal), deadline]); }
  finally { clearTimeout(timer); }
}
