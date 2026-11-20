/** Parse API responses without exposing browser JSON/parser diagnostics to users. */
export async function readUiResponse(response: Response, fallback = "Không thể xử lý yêu cầu. Vui lòng thử lại.") {
  let value: unknown;
  try { value = await response.json(); }
  catch { throw new Error(fallback); }
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(fallback);
  const result = value as Record<string, unknown>;
  if (!response.ok) {
    const message = result.error || result.message;
    throw new Error(typeof message === "string" && message.trim() && !/unexpected|syntaxerror|failed to execute|<html/i.test(message) ? message : fallback);
  }
  return result;
}

export function uiFeedbackMessage(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : "";
  return message && !/unexpected|syntaxerror|failed to|fetch failed|networkerror|json|<html/i.test(message) ? message : fallback;
}

