import { runProjectionMaintenance } from "@/domains/projection/server/projection-maintenance.service";

export async function runSystemJobs(input?: {
    triggerSource?: string;
}) {
    void input;
    const summary: Record<string, unknown> = {};

    summary.projection = await runProjectionMaintenance();

    return summary;
}
