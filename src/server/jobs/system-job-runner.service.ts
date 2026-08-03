import { getJobControl } from "./job-control.repo";
import { createJobRunLog, finishJobRunLog } from "./job-run-log.repo";
import { processQueuedAcquisitionSpecJobs } from "@/domains/acquisition/server/acquisition-spec-job.service";
import { runProjectionMaintenance } from "@/domains/projection/server/projection-maintenance.service";

export async function runSystemJobs(input?: {
    triggerSource?: string;
}) {
    const triggerSource = input?.triggerSource ?? "manual";
    const summary: Record<string, unknown> = {};

    summary.projection = await runProjectionMaintenance();

    const acquisitionSpecControl = await getJobControl("acquisition_spec");

    if (acquisitionSpecControl?.enabled) {
        const startedLog = await createJobRunLog({
            processorKey: "acquisition_spec",
            triggerSource,
            status: "RUNNING",
            detail: {
                batchSize: acquisitionSpecControl.batchSize ?? 6,
            },
        });

        try {
            const result = await processQueuedAcquisitionSpecJobs({
                limit: acquisitionSpecControl.batchSize ?? 6,
                includeFailed: false,
            });

            await finishJobRunLog(startedLog.id, {
                status: "DONE",
                processedCount: result.processed ?? 0,
                errorCount: 0,
                detail: {
                    batchSize: acquisitionSpecControl.batchSize ?? 6,
                    processed: result.processed ?? 0,
                },
            });

            summary.acquisitionSpec = {
                enabled: true,
                processed: result.processed ?? 0,
            };
        } catch (error) {
            await finishJobRunLog(startedLog.id, {
                status: "FAILED",
                processedCount: 0,
                errorCount: 1,
                note: error instanceof Error ? error.message : String(error),
            });

            summary.acquisitionSpec = {
                enabled: true,
                processed: 0,
                error: error instanceof Error ? error.message : String(error),
            };
        }
    } else {
        summary.acquisitionSpec = {
            enabled: false,
            processed: 0,
            reason: acquisitionSpecControl?.pausedReason ?? null,
        };
    }

    return summary;
}
