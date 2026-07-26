import { runAcquisitionSpecProcessorNow } from "./acquisition-spec.processor";
import { runProjectionMaintenance } from "@/domains/projection/server/projection-maintenance.service";

export async function runSystemJobs(input?: { triggerSource?: string }) {
    const triggerSource = input?.triggerSource ?? "system";

    const [projection, acquisitionSpec] = await Promise.all([
        runProjectionMaintenance(),
        runAcquisitionSpecProcessorNow({
            triggerSource,
            includeFailed: false,
        }),
    ]);

    return { projection, acquisitionSpec };
}
