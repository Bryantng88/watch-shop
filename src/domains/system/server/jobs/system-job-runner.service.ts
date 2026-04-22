import { runAcquisitionSpecProcessorNow } from "./acquisition-spec.processor";

export async function runSystemJobs(input?: {
    triggerSource?: string;
}) {
    const triggerSource = input?.triggerSource ?? "system";

    const acquisitionSpec = await runAcquisitionSpecProcessorNow({
        triggerSource,
        includeFailed: false,
    });

    return {
        acquisitionSpec,
    };
}