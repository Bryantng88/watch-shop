import type {
    BulkPostFailedItem,
    BulkPostResponse,
    PostAcquisitionResult,
} from "./post-acquisition.types";

function buildFailedMessage(failed: BulkPostFailedItem[]) {
    if (!failed.length) return "";

    return failed
        .map((item) => `• ${item.id}: ${item.error || "Lỗi không xác định"}`)
        .join("\n");
}

function buildMessage(data: BulkPostResponse | null, fallback: string) {
    if (!data) return fallback;

    if (data.error) return data.error;

    if (data.failed?.length) {
        return buildFailedMessage(data.failed);
    }

    return fallback;
}

export async function postAcquisitions(
    acquisitionIds: string[]
): Promise<PostAcquisitionResult> {
    const ids = acquisitionIds.filter(
        (x): x is string => typeof x === "string" && x.trim().length > 0
    );

    if (!ids.length) {
        return {
            kind: "error",
            posted: [],
            failed: [],
            message: "Thiếu acquisitionIds",
        };
    }

    const res = await fetch("/api/admin/acquisitions/bulk-post", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            acquisitionIds: ids,
        }),
    });

    const data = (await res.json().catch(() => null)) as BulkPostResponse | null;

    if (res.status === 207) {
        return {
            kind: "partial",
            posted: data?.posted ?? [],
            failed: data?.failed ?? [],
            message: buildMessage(data, "Có phiếu duyệt lỗi"),
        };
    }

    if (!res.ok) {
        return {
            kind: "error",
            posted: data?.posted ?? [],
            failed: data?.failed ?? [],
            message: buildMessage(data, "Duyệt phiếu thất bại"),
        };
    }

    return {
        kind: "success",
        posted: data?.posted ?? ids,
        failed: [],
        message:
            ids.length === 1
                ? "Duyệt phiếu thành công"
                : `Đã duyệt ${ids.length} phiếu`,
    };
}