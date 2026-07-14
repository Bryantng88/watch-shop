import { notFound } from "next/navigation";
import TaskItemDetailClient from "@/domains/task/client/TaskItemDetailClient";
import { getTaskItemDetailPageRepo } from "@/domains/task/server/core/task-item-detail.repo";
import { authorizeTaskItemDetail } from "@/domains/task/server/core/task-item-detail.service";
import { listAssignableUsersRepo } from "@/domains/task/server/core/task.repo";
import { getVendorList } from "@/domains/vendor/server/vendor.service";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";
import { perfLog, perfNow, perfStep } from "@/lib/server-perf";

type PageProps = {
  params: Promise<{ id: string }>;
};

function serialize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export default async function AdminTaskItemDetailPage(props: PageProps) {
  const totalStartedAt = perfNow();
  const { id } = await props.params;
  const authPromise = perfStep("task-item-detail-page", "requirePermission", () =>
    requirePermission("TASK_VIEW"),
  );
  const itemPromise = perfStep("task-item-detail-page", "loadDetail", () =>
    getTaskItemDetailPageRepo(prisma, id),
  );
  const usersPromise = perfStep("task-item-detail-page", "loadUsers", () =>
    listAssignableUsersRepo(prisma),
  );
  const vendorsPromise = perfStep("task-item-detail-page", "loadVendors", () =>
    getVendorList(),
  );

  const [auth, item, users, vendors] = await Promise.all([
    authPromise,
    itemPromise,
    usersPromise,
    vendorsPromise,
  ]);

  if (!item) notFound();

  const authorizedItem = authorizeTaskItemDetail(item, auth);
  perfLog("task-item-detail-page", "totalBeforeRender", totalStartedAt);

  return (
    <TaskItemDetailClient
      item={serialize(authorizedItem)}
      users={serialize(users)}
      vendors={serialize(vendors)}
      currentUser={serialize({
        id: auth.id,
        name: auth.name ?? null,
        email: auth.email ?? null,
        avatarUrl: auth.avatarUrl ?? null,
        roles: Array.isArray(auth.roles) ? auth.roles : [],
        permissions: Array.isArray(auth.permissions) ? auth.permissions : [],
      })}
    />
  );
}
