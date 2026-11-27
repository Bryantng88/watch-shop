import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import { getPersonalWorkPageData } from "@/domains/personal-work";
import { PersonalWorkClient } from "@/domains/personal-work/ui/PersonalWorkClient";
import {getWorkListPage} from "@/domains/personal-work/server/work-list-page";
import {scheduleDate} from "@/domains/personal-work/shared/personal-work-schedule";
import type {WorkListQuery} from "@/domains/personal-work/shared/work-list-query";

export const dynamic = "force-dynamic";

export default async function PersonalWorkPage({searchParams}: {searchParams: Promise<Record<string, string | string[] | undefined>>}) {
  const user = await requirePermission(PERMISSIONS.TASK_VIEW);
  const [data, params] = await Promise.all([getPersonalWorkPageData(user, {summary: true}), searchParams]);
  const query: WorkListQuery = {view: params.view === "list" ? "ALL" : "TODAY", scope: "ALL", domain: "ALL", day: scheduleDate(new Date())};
  try {
    const page = await getWorkListPage(query, user, data);
    return <PersonalWorkClient data={{...data, initialList: {query, page}}} />;
  } catch {
    // Keep the authorized overview available; the list owns a single retry state.
    return <PersonalWorkClient data={data} />;
  }
}
