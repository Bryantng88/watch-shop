// In-memory GET coordination only. Never retry or queue a business POST here.
export class LiveReadGate {
  private current?: AbortController;
  private timeout?: ReturnType<typeof setTimeout>;

  begin(background = false) {
    if (background && this.current) return;
    this.cancel();
    const controller = new AbortController();
    this.current = controller;
    let timedOut = false;
    const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, 20000);
    this.timeout = timeout;
    return {
      signal: controller.signal,
      timedOut: () => timedOut,
      isCurrent: () => this.current === controller && !controller.signal.aborted,
      finish: () => {
        clearTimeout(timeout);
        if (this.current === controller) {
          this.current = undefined;
          this.timeout = undefined;
        }
      },
    };
  }

  cancel() {
    clearTimeout(this.timeout);
    this.timeout = undefined;
    this.current?.abort();
    this.current = undefined;
  }
}

export function livePollDelay(pending: boolean, tracking: boolean, failures: number) {
  if (failures) return Math.min(5000 * 2 ** Math.min(failures - 1, 3), 30000);
  return pending ? 2000 : tracking ? 5000 : null;
}
