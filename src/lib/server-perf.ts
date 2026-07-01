export function perfNow() {
  return Date.now();
}

export function perfLog(scope: string, label: string, startedAt: number) {
  if (process.env.NODE_ENV === "production") return;
  console.log(`[perf:${scope}] ${label}=${Date.now() - startedAt}ms`);
}

export async function perfStep<T>(
  scope: string,
  label: string,
  run: () => Promise<T>,
) {
  const startedAt = perfNow();
  try {
    return await run();
  } finally {
    perfLog(scope, label, startedAt);
  }
}
