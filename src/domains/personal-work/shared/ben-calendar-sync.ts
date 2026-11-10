export type BenCalendarTarget = { userId: string; name: string | null };
export type BenCalendarResult = BenCalendarTarget & { status: "SYNCED" | "FAILED" };

export function benCalendarCandidates(ownerId: string, assigneeId?: string | null) {
  // View-only shares are never calendar recipients. Self-assignment is one event.
  return [...new Set([ownerId, assigneeId].filter((id): id is string => !!id))];
}

export async function syncBenCalendars(
  targets: BenCalendarTarget[],
  itemId: string,
  sync: (userId: string, itemId: string) => Promise<unknown>,
): Promise<BenCalendarResult[]> {
  return Promise.all(targets.map(async target => {
    try {
      await sync(target.userId, itemId);
      return { ...target, status: "SYNCED" as const };
    } catch {
      // One account failing never rolls back the task or prevents the other sync.
      return { ...target, status: "FAILED" as const };
    }
  }));
}

export function benCalendarStatus(results: BenCalendarResult[]) {
  return !results.length ? "NONE" as const : results.some(r => r.status === "FAILED") ? "FAILED" as const : "SYNCED" as const;
}

export function benCalendarResultLabel(results: BenCalendarResult[]) {
  return results.map(r => `${r.name || "Tài khoản"}: ${r.status === "SYNCED" ? "đã đồng bộ lịch" : "chưa đồng bộ lịch"}`).join(" · ");
}
