import { prisma } from "@/server/db/client";
import { processQueuedAcquisitionSpecJobs } from "@/domains/acquisition/server/ai/acquisition-spec-job.service";
import { createSystemJobRunLog } from "./system-job-log.service";
import { getSystemJobControlDetail } from "./system-job-control.service";

const PROCESSOR_KEY = "acquisition_spec";

export async function runAcquisitionSpecProcessorNow(input?: {
    triggerSource?: string;
    includeFailed?: boolean;
    limit?: number;
}) {
    const triggerSource = input?.triggerSource ?? "manual";
    const control = await getSystemJobControlDetail(PROCESSOR_KEY);

    if (!control?.enabled) {
        const log = await createSystemJobRunLog({
            processorKey: PROCESSOR_KEY,
            triggerSource,
            status: "SKIPPED",
            processedCount: 0,
            errorCount: 0,
            note: control?.pausedReason || "Processor is disabled",
            startedAt: new Date(),
            finishedAt: new Date(),
        });

        return {
            control,
            result: {
                total: 0,
                processed: 0,
                failed: 0,
                errors: [],
            },
            log,
        };
    }

    const startedAt = new Date();

    try {
        const result = await processQueuedAcquisitionSpecJobs({
            limit:
                typeof input?.limit === "number" && input.limit > 0
                    ? input.limit
                    : control.batchSize || 3,
            includeFailed: input?.includeFailed ?? false,
        });

        const status =
            result.failed > 0
                ? result.processed > 0
                    ? "PARTIAL"
                    : "FAILED"
                : "DONE";

        const log = await createSystemJobRunLog({
            processorKey: PROCESSOR_KEY,
            triggerSource,
            status,
            processedCount: result.processed,
            errorCount: result.failed,
            note:
                result.failed > 0
                    ? `Có ${result.failed} job lỗi`
                    : `Đã xử lý ${result.processed} job`,
            detail: result.errors,
            startedAt,
            finishedAt: new Date(),
        });

        return {
            control,
            result,
            log,
        };
    } catch (error: any) {
        const log = await createSystemJobRunLog({
            processorKey: PROCESSOR_KEY,
            triggerSource,
            status: "FAILED",
            processedCount: 0,
            errorCount: 1,
            note: error?.message || "Run acquisition spec failed",
            detail: {
                error: error?.message || "Run acquisition spec failed",
            },
            startedAt,
            finishedAt: new Date(),
        });

        throw Object.assign(new Error(error?.message || "Run acquisition spec failed"), {
            log,
        });
    }
}