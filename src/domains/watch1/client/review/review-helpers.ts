export type ReviewStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";

export function normalizeReviewStatus(status?: string | null): ReviewStatus {
    const value = String(status ?? "DRAFT").toUpperCase();

    if (
        value === "SUBMITTED" ||
        value === "APPROVED" ||
        value === "REJECTED"
    ) {
        return value;
    }

    return "DRAFT";
}

export function getOverallReviewStatus(input: {
    contentStatus?: string | null;
    imageStatus?: string | null;
}) {
    const content = normalizeReviewStatus(input.contentStatus);
    const image = normalizeReviewStatus(input.imageStatus);

    if (content === "REJECTED" || image === "REJECTED") return "REJECTED";
    if (content === "SUBMITTED" || image === "SUBMITTED") return "SUBMITTED";
    if (content === "APPROVED" && image === "APPROVED") return "APPROVED";

    if (content === "APPROVED" || image === "APPROVED") return "PARTIAL";

    return "DRAFT";
}

export function getOverallReviewLabel(status: string) {
    if (status === "SUBMITTED") return "Chờ duyệt";
    if (status === "APPROVED") return "Sẵn sàng";
    if (status === "REJECTED") return "Cần chỉnh";
    if (status === "PARTIAL") return "Duyệt một phần";
    return "Draft";
}