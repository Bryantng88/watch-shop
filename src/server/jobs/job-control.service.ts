import * as repo from "./job-control.repo";

export async function getSystemJobControlsOverview() {
    const [controls, pending, failed] = await Promise.all([
        repo.listJobControls(),
        repo.countAcquisitionSpecPendingJobs(),
        repo.countAcquisitionSpecFailedJobs(),
    ]);

    return {
        controls,
        stats: {
            acquisitionSpec: {
                pending,
                failed,
            },
        },
    };
}

export async function getSystemJobControlDetail(key: string) {
    return repo.getJobControl(key);
}

export async function updateSystemJobControl(
    key: string,
    input: {
        enabled?: boolean;
        batchSize?: number;
        pausedReason?: string | null;
        metadata?: any;
        updatedBy?: string | null;
    }
) {
    const normalized = {
        ...input,
        batchSize:
            input.batchSize != null
                ? Math.max(1, Math.min(input.batchSize, 10))
                : undefined,
    };

    return repo.updateJobControlByKey(key, normalized);
}