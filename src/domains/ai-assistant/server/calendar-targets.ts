import type { DB } from "@/server/db/client";
import { benCalendarCandidates, type BenCalendarTarget } from "@/domains/personal-work/shared/ben-calendar-sync";

export async function benCalendarTargets(db: DB, ownerId: string, assigneeId: string | null | undefined, dueAt: string | null): Promise<BenCalendarTarget[]> {
  // An undated task must not silently become an event for today.
  if (!dueAt) return [];
  const candidates = benCalendarCandidates(ownerId, assigneeId);
  const connections = await db.googleCalendarConnection.findMany({
    where: { userId: { in: candidates }, user: { isActive: true } },
    select: { userId: true, user: { select: { name: true } } },
  });
  return candidates.flatMap(userId => {
    const connection = connections.find(c => c.userId === userId);
    return connection ? [{ userId, name: connection.user.name }] : [];
  });
}
