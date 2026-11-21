import { AdminWorkspaceNavigation } from "@/domains/shared/ui/admin-design-contract/AdminWorkspaceNavigation";
import SystemWorkspace from "@/domains/system/client/SystemWorkspace";
import { systemEntries } from "@/domains/shared/ui/navigation/section-navigation";
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
  const user = await requirePermission(PERMISSIONS.ACTIVITY_READ);
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

  const periodHref = (value: string) => {
    const query = new URLSearchParams(Object.entries(params).flatMap(([key, value]) => Array.isArray(value) ? value.map(item => [key, item]) : value == null ? [] : [[key, value]]));
    query.delete("page"); query.set("period", value);
    return `/admin/activity?${query.toString()}`;
  };
  const periodEntries = [{ value: "TODAY", label: "Hôm nay" }, { value: "7D", label: "7 ngày qua" }, { value: "30D", label: "30 ngày qua" }, { value: "ALL", label: "Toàn bộ" }].map(entry => ({ href: periodHref(entry.value), label: entry.label }));
  return <SystemWorkspace entries={systemEntries(user)} selected="/admin/activity" extraNavigation={<AdminWorkspaceNavigation compact label="Khoảng thời gian" entries={periodEntries} selected={periodHref(period)} />}><GlobalActivityPage data={data} embedded /></SystemWorkspace>;
}
