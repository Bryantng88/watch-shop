export async function getAcquisitionSpecLogs(input: {
    jobId?: string;
    itemId?: string;
    take?: number;
}) {
    const params = new URLSearchParams();

    if (input.jobId) params.set("jobId", input.jobId);
    if (input.itemId) params.set("itemId", input.itemId);
    if (input.take) params.set("take", String(input.take));

    const res = await fetch(
        `/api/admin/system/jobs/acquisition-spec-logs?${params.toString()}`,
        {
            method: "GET",
            cache: "no-store",
        }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Không thể tải logs");
    }

    return data.items as Array<{
        id: string;
        acquisitionSpecJobId: string;
        acquisitionItemId: string;
        acquisitionId?: string | null;
        productId?: string | null;
        stage: string;
        level: string;
        message: string;
        payload?: any;
        createdAt: string;
    }>;
}