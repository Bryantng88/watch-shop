import { processQueuedAcquisitionSpecJobs } from "@/domains/acquisition/server/acquisition-spec-job.service";
import { createSystemJobRunLog } from "./system-job-log.service";
import { getSystemJobControlDetail } from "./system-job-control.service";

const PROCESSOR_KEY = "acquisition_spec";

function statusFromResult(result: { processed: number; failed: number }) {
    if (result.failed > 0 && result.processed > 0) return "PARTIAL";
    if (result.failed > 0) return "FAILED";
    return "DONE";
}

export async function runAcquisitionSpecProcessorNow(input?: {
    triggerSource?: string;
    includeFailed?: boolean;
    limit?: number;
}) {
    const triggerSource = input?.triggerSource ?? "manual";
    const control = await getSystemJobControlDetail(PROCESSOR_KEY);
    const startedAt = new Date();

    if (!control?.enabled) {
        const log = await createSystemJobRunLog({
            processorKey: PROCESSOR_KEY,
            triggerSource,
            status: "SKIPPED",
            processedCount: 0,
            errorCount: 0,
            note: control?.pausedReason || "Processor is disabled",
            detail: { reason: control?.pausedReason || "Processor is disabled" },
            startedAt,
            finishedAt: new Date(),
        });

        return {
            control,
            result: { total: 0, processed: 0, failed: 0, errors: [] },
            log,
        };
    }

    try {
        const result = await processQueuedAcquisitionSpecJobs({
            limit:
                typeof input?.limit === "number" && input.limit > 0
                    ? input.limit
                    : control.batchSize || 3,
            includeFailed: input?.includeFailed ?? false,
        });

        const status = statusFromResult(result);
        const note =
            result.total === 0
                ? "Không có job nào cần xử lý"
                : result.failed > 0
                  ? `Đã xử lý ${result.processed}/${result.total}, lỗi ${result.failed}`
                  : `Đã xử lý ${result.processed} job`;

        const log = await createSystemJobRunLog({
            processorKey: PROCESSOR_KEY,
            triggerSource,
            status,
            processedCount: result.processed,
            errorCount: result.failed,
            note,
            detail: {
                total: result.total,
                processed: result.processed,
                failed: result.failed,
                errors: result.errors,
                includeFailed: Boolean(input?.includeFailed),
            },
            startedAt,
            finishedAt: new Date(),
        });

        return { control, result, log };
    } catch (error: any) {
        const message = error?.message || "Run acquisition spec failed";

        const log = await createSystemJobRunLog({
            processorKey: PROCESSOR_KEY,
            triggerSource,
            status: "FAILED",
            processedCount: 0,
            errorCount: 1,
            note: message,
            detail: { error: message, stack: error?.stack ?? null },
            startedAt,
            finishedAt: new Date(),
        });

        throw Object.assign(new Error(message), { log });
    }
}
