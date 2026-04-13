import { getJobControl } from "./job-control.repo";
import { createJobRunLog, finishJobRunLog } from "./job-run-log.repo";
import { processQueuedAcquisitionSpecJobs } from "@/app/(admin)/admin/acquisitions/_server/ai/acquisition-spec-job.service";

export async function runSystemJobs(input?: {
    triggerSource?: string;
}) {
    const triggerSource = input?.triggerSource ?? "manual";
    const summary: Record<string, any> = {};

    const acquisitionSpecControl = await getJobControl("acquisition_spec");

    if (acquisitionSpecControl?.enabled) {
        const startedLog = await createJobRunLog({
            processorKey: "acquisition_spec",
            triggerSource,
            status: "RUNNING",
            detail: {
                batchSize: acquisitionSpecControl.batch_size ?? 6,
            },
        });

        try {
            const result = await processQueuedAcquisitionSpecJobs({
                limit: acquisitionSpecControl.batch_size ?? 6,
                includeFailed: false,
            });

            await finishJobRunLog(startedLog.id, {
                status: "DONE",
                processedCount: result.processed ?? 0,
                errorCount: 0,
                detail: {
                    batchSize: acquisitionSpecControl.batch_size ?? 6,
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
            reason: acquisitionSpecControl?.paused_reason ?? null,
        };
    }

    return summary;
}