import type { BusinessListDashboardData } from "@/domains/shared/ui/business-list";
import { prisma } from "@/server/db/client";

function normalizeStatus(value: unknown) {
    return String(value ?? "DRAFT").trim().toUpperCase();
}

function statusLabel(status: string) {
    switch (status) {
        case "DRAFT":
            return "Nháp";
        case "POSTED":
            return "Đã nhập kho";
        case "CANCELED":
        case "CANCELLED":
            return "Đã hủy";
        default:
            return status;
    }
}

export async function getAcquisitionListDashboard(
    audienceSegment?: "MEN" | "WOMEN",
): Promise<BusinessListDashboardData> {
    const rows = await prisma.acquisition.findMany({
        where: audienceSegment ? { audienceSegment } : undefined,
        orderBy: { updatedAt: "desc" },
        select: {
            id: true,
            refNo: true,
            accquisitionStt: true,
            totalAmount: true,
            updatedAt: true,
            vendor: { select: { name: true } },
        },
    });

    const counts = new Map<string, number>();
    let totalValue = 0;

    for (const row of rows) {
        const status = normalizeStatus(row.accquisitionStt);
        counts.set(status, (counts.get(status) ?? 0) + 1);
        totalValue += Number(row.totalAmount ?? 0);
    }

    const canceled = counts.get("CANCELED") ?? 0;
    const open = rows.length - (counts.get("POSTED") ?? 0) - canceled;
    const breakdownItems = [
        { key: "draft", label: "Nháp", value: counts.get("DRAFT") ?? 0, tone: "slate" as const },
        { key: "posted", label: "Đã nhập kho", value: counts.get("POSTED") ?? 0, tone: "emerald" as const },
        { key: "canceled", label: "Đã hủy", value: canceled, tone: "rose" as const },
    ];

    return {
        generatedAt: new Date().toISOString(),
        periodLabel: "Toàn bộ",
        metrics: [
            { key: "all", label: "Phiếu nhập", value: rows.length },
            { key: "open", label: "Đang mở", value: Math.max(0, open) },
            { key: "posted", label: "Đã nhập kho", value: counts.get("POSTED") ?? 0 },
            { key: "canceled", label: "Đã hủy", value: canceled },
        ],
        inventoryValue: {
            label: "Giá trị nhập",
            value: totalValue,
            currency: "VND",
            helper: "Tổng giá trị các phiếu nhập",
            trend: rows
                .slice(0, 12)
                .reverse()
                .map((row) => Number(row.totalAmount ?? 0)),
        },
        breakdown: {
            label: "Theo trạng thái phiếu",
            total: rows.length,
            items: breakdownItems,
        },
        activities: {
            label: "Cập nhật gần đây",
            items: rows.slice(0, 3).map((row) => {
                const status = normalizeStatus(row.accquisitionStt);
                return {
                    id: row.id,
                    title: row.refNo || "Phiếu nhập",
                    description: `${row.vendor?.name ?? "Chưa có vendor"} · ${statusLabel(status)}`,
                    occurredAt: row.updatedAt.toISOString(),
                    href: `/admin/acquisitions/${row.id}/edit`,
                    kind: "updated" as const,
                };
            }),
        },
    };
}
