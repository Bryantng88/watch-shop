import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import {
  listGlobalActivity,
  type GlobalActivityQuery,
} from "@/domains/activity/server/global-activity.service";
import GlobalActivityPage from "@/domains/activity/ui/GlobalActivityPage";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ActivityPage({ searchParams }: Props) {
  await requirePermission(PERMISSIONS.ACTIVITY_READ);
  const params = await searchParams;
  const periodValue = first(params.period);
  const period: GlobalActivityQuery["period"] =
    periodValue === "TODAY" || periodValue === "30D" || periodValue === "ALL"
      ? periodValue
      : "7D";

  const data = await listGlobalActivity({
    query: first(params.q),
    targetType: first(params.targetType),
    eventKey: first(params.eventKey),
    actorUserId: first(params.actorUserId),
    period,
    page: Number(first(params.page) ?? 1),
    pageSize: Number(first(params.pageSize) ?? 50),
  });

  return <GlobalActivityPage data={data} />;
}
