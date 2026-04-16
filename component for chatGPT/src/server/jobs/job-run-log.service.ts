import * as repo from "./job-run-log.repo";

export async function getRecentJobRunLogs(limit = 50) {
    const safeLimit = Math.max(1, Math.min(limit, 100));
    return repo.findRecentJobRunLogs(safeLimit);
}