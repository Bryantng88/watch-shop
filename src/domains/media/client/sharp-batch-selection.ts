export type SharpBatchState = { status: "idle" | "processing" | "done" | "error" };

export function resolveSharpBatchSelection(
  selected: Iterable<string>,
  states: Record<string, SharpBatchState | undefined>,
) {
  const selectedKeys = Array.from(selected);
  const readyKeys = selectedKeys.filter((key) => states[key]?.status === "done");
  const incompleteKeys = selectedKeys.filter((key) => states[key]?.status !== "done");
  return {
    selectedKeys,
    readyKeys,
    incompleteKeys,
    allSelectedReady: selectedKeys.length > 0 && incompleteKeys.length === 0,
  };
}
