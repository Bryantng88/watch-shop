import { TaskKind, TaskStatus, type Prisma } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import type { TaskViewKey } from "../task.types";
import { buildAccessWhere, buildViewWhere } from "./task.repo.shared";

type CountScope = { userId: string; canViewAll?: boolean };

export async function countTaskViewsRepo(db: DB, input: CountScope & { kind?: TaskKind | "ALL" }) {
  const client = dbOrTx(db);
  const scope: Prisma.TaskWhereInput = {
    AND: [buildAccessWhere(input.userId, Boolean(input.canViewAll)),
      { status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] } },
      input.kind && input.kind !== "ALL" ? { kind: input.kind } : {}],
  };
  const views = ["mine", "assigned", "delegated", "all"] as const;
  const [mine, assigned, delegated, all] = await Promise.all(views.map(view => client.task.count({
    where: { AND: [scope, buildViewWhere(view, input.userId)] },
  })));
  return { mine, assigned, delegated, all };
}

export async function countTaskKindsRepo(db: DB, input: CountScope & { view?: TaskViewKey }) {
  const rows = await dbOrTx(db).task.groupBy({
    by: ["kind"],
    where: { AND: [buildAccessWhere(input.userId, Boolean(input.canViewAll)),
      buildViewWhere(input.view || "all", input.userId),
      { status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] } }] },
    _count: { _all: true },
  });
  const counts = new Map(rows.map(row => [row.kind, row._count._all]));
  return {
    kind_ALL: rows.reduce((sum, row) => sum + row._count._all, 0),
    kind_OPERATION: counts.get(TaskKind.OPERATION) ?? 0,
    kind_BUSINESS: counts.get(TaskKind.BUSINESS) ?? 0,
    kind_SERVICE: counts.get(TaskKind.SERVICE) ?? 0,
    kind_PERSONAL: 0,
    kind_FREE: counts.get(TaskKind.FREE) ?? 0,
  };
}
