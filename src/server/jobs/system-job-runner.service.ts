import { runWorkPush } from "@/domains/notification/server/work-push.service";
import { runProjectionMaintenance } from "@/domains/projection/server/projection-maintenance.service";

export async function runSystemJobs(input?: {
    triggerSource?: string;
}) {
    void input;
    const summary: Record<string, unknown> = {};

    summary.workPush = await runWorkPush();
    summary.projection = await runProjectionMaintenance();

    return summary;
}
