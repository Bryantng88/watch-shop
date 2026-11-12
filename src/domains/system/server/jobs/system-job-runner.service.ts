import { runWorkPush } from "@/domains/notification/server/work-push.service";
import { runProjectionMaintenance } from "@/domains/projection/server/projection-maintenance.service";

export async function runSystemJobs(input?: { triggerSource?: string }) {
    void input;
    const workPush = await runWorkPush();
    const projection = await runProjectionMaintenance();

    return { projection, workPush };
}
