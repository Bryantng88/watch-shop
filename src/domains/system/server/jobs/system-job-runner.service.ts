import { runProjectionMaintenance } from "@/domains/projection/server/projection-maintenance.service";

export async function runSystemJobs(input?: { triggerSource?: string }) {
    void input;
    const projection = await runProjectionMaintenance();

    return { projection };
}
