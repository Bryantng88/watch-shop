import { unstable_cache } from "next/cache";
import { WatchSaleStage } from "@prisma/client";

import { getWeeklyWatchSpaceComparison } from "@/domains/coordination/server";
import type { BusinessListDashboardData } from "@/domains/shared/ui/business-list";
import { prisma } from "@/server/db/client";

const WATCH_ACTIVITY_LABELS: Record<string, string> = {
    "watch.created": "Đã tạo watch",
    "watch.content.modified": "Đã cập nhật nội dung",
    "watch.content.submitted": "Đã gửi duyệt nội dung",
    "watch.content.approved": "Đã duyệt nội dung",
    "watch.content.rejected": "Đã từ chối nội dung",
    "watch.content.unapproved": "Đã thu hồi duyệt nội dung",
    "watch.image.submitted": "Đã gửi duyệt hình ảnh",
    "watch.image.approved": "Đã duyệt hình ảnh",
    "watch.image.rejected": "Đã từ chối hình ảnh",
    "watch.image.unapproved": "Đã thu hồi duyệt hình ảnh",
    "watch.spec.updated": "Đã cập nhật thông số",
    "watch.price.updated": "Đã cập nhật giá",
    "watch.media.photoshoot.requested": "Đã gửi sang chụp ảnh",
    "watch.media.photoshoot.completed": "Đã hoàn tất chụp ảnh",
    "watch.media.asset.attached": "Đã gắn media vào watch",
    "watch.media.ready_for_publish": "Đã hoàn tất xử lý media",
    "watch.media.recalled": "Đã thu hồi media để xử lý lại",
    "watch.publish.assets.downloaded": "Đã tải tài nguyên đăng bán",
};

function watchActivityKind(eventKey: string) {
    if (eventKey === "watch.created") return "created" as const;
    if (eventKey.includes(".downloaded")) return "downloaded" as const;
    if (eventKey.includes(".rejected") || eventKey.includes(".unapproved")) {
        return "rejected" as const;
    }
    if (eventKey.includes(".approved") || eventKey.includes(".completed") || eventKey.includes("ready_for_publish")) {
        return "approved" as const;
    }
    if (eventKey.includes(".submitted") || eventKey.includes(".requested")) {
        return "submitted" as const;
    }
    if (eventKey.includes(".media.")) return "media" as const;
    return "updated" as const;
}

function metadataRecord(value: unknown) {
    return value && typeof value === "object" && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {};
}

function metadataText(value: unknown, key: string) {
    const text = String(metadataRecord(value)[key] ?? "").trim();
    return text || null;
}

function metricDelta(
    current: number,
    previous: number,
    showComparisonLabel = false,
) {
    const delta = current - previous;
    return {
        helper: `${delta >= 0 ? "+" : ""}${delta}`,
        helperSuffix: showComparisonLabel ? "so với tuần trước" : undefined,
        helperTone:
            delta > 0
                ? "positive" as const
                : delta < 0
                  ? "negative" as const
                  : "neutral" as const,
    };
}

const getCachedWatchListDashboard = unstable_cache(
    async (): Promise<BusinessListDashboardData> => {
        const twelveDaysAgo = new Date();
        twelveDaysAgo.setDate(twelveDaysAgo.getDate() - 11);

        const [saleStageGroups, serviceCount, missingImageCount, inventoryValue, recentEvents, recentTrendRows, weeklySpaces] =
            await Promise.all([
                prisma.watch.groupBy({
                    by: ["saleStage"],
                    _count: { _all: true },
                }),
                prisma.watch.count({ where: { serviceStage: "IN_SERVICE" } }),
                prisma.watch.count({
                    where: { product: { productImage: { none: {} } } },
                }),
                prisma.watchPrice.aggregate({
                    where: { watch: { saleStage: { not: WatchSaleStage.SOLD } } },
                    _sum: { salePrice: true },
                }),
                prisma.businessEventLog.findMany({
                    where: {
                        targetType: "WATCH",
                        eventKey: { in: Object.keys(WATCH_ACTIVITY_LABELS) },
                    },
                    take: 4,
                    orderBy: { createdAt: "desc" },
                    select: {
                        id: true,
                        eventKey: true,
                        targetId: true,
                        metadataJson: true,
                        createdAt: true,
                    },
                }),
                prisma.watch.findMany({
                    where: { createdAt: { gte: twelveDaysAgo } },
                    select: { createdAt: true },
                }),
                getWeeklyWatchSpaceComparison({ db: prisma }),
            ]);

        const counts = new Map(
            saleStageGroups.map((item) => [item.saleStage, item._count._all]),
        );
        const total = saleStageGroups.reduce((sum, item) => sum + item._count._all, 0);
        const ready = counts.get(WatchSaleStage.READY) ?? 0;
        const sold = counts.get(WatchSaleStage.SOLD) ?? 0;
        const hold = counts.get(WatchSaleStage.HOLD) ?? 0;
        const processing =
            (counts.get(WatchSaleStage.DRAFT) ?? 0) +
            (counts.get(WatchSaleStage.PROCESSING) ?? 0);
        const trend = Array.from({ length: 12 }, (_, index) => {
            const day = new Date(twelveDaysAgo);
            day.setDate(day.getDate() + index);
            return recentTrendRows.filter((row) => {
                const created = row.createdAt;
                return (
                    created.getFullYear() === day.getFullYear() &&
                    created.getMonth() === day.getMonth() &&
                    created.getDate() === day.getDate()
                );
            }).length;
        });
        const inventoryDelta =
            weeklySpaces.current.inventoryValue -
            weeklySpaces.previous.inventoryValue;
        const inventoryPercent =
            weeklySpaces.previous.inventoryValue > 0
                ? (inventoryDelta / weeklySpaces.previous.inventoryValue) * 100
                : undefined;

        return {
            generatedAt: new Date().toISOString(),
            periodLabel: "7 ngày qua",
            metrics: [
                {
                    key: "total",
                    label: "Tổng số watch",
                    value: total,
                    ...metricDelta(
                        weeklySpaces.current.total,
                        weeklySpaces.previous.total,
                        true,
                    ),
                    tone: "violet",
                },
                { key: "ready", label: "Sẵn sàng bán", value: ready, ...metricDelta(weeklySpaces.current.ready, weeklySpaces.previous.ready), tone: "blue" },
                { key: "service", label: "Đang service", value: serviceCount, ...metricDelta(weeklySpaces.current.service, weeklySpaces.previous.service), tone: "amber" },
                { key: "missing-image", label: "Chưa có ảnh", value: missingImageCount, ...metricDelta(weeklySpaces.current.missingImage, weeklySpaces.previous.missingImage), tone: "rose" },
            ],
            inventoryValue: {
                label: "Giá trị hàng hóa",
                value: Number(inventoryValue._sum.salePrice ?? 0),
                currency: "VND",
                helper: "Tổng giá bán của watch chưa bán",
                trend,
                change:
                    inventoryPercent === undefined
                        ? "—"
                        : `${inventoryPercent >= 0 ? "+" : ""}${inventoryPercent.toLocaleString("vi-VN", { maximumFractionDigits: 1 })}%`,
                changeTone:
                    inventoryDelta === 0
                        ? "neutral"
                        : inventoryDelta > 0
                          ? "positive"
                          : "negative",
                changeSuffix:
                    inventoryPercent === undefined
                        ? "tuần trước chưa có giá trị"
                        : "so với tuần trước",
            },
            breakdown: {
                label: "Theo trạng thái bán",
                total,
                items: [
                    { key: "sold", label: "Đã bán", value: sold, tone: "emerald" },
                    { key: "ready", label: "Sẵn sàng", value: ready, tone: "blue" },
                    { key: "processing", label: "Đang xử lý", value: processing, tone: "violet" },
                    { key: "hold", label: "Giữ hàng", value: hold, tone: "amber" },
                ],
            },
            activities: {
                label: "Hoạt động gần đây",
                items: recentEvents.map((event) => {
                    const title =
                        metadataText(event.metadataJson, "title") ??
                        metadataText(event.metadataJson, "watchTitle") ??
                        metadataText(event.metadataJson, "sku") ??
                        "Watch";
                    const productId = metadataText(event.metadataJson, "productId");

                    return {
                        id: event.id,
                        title,
                        description:
                            WATCH_ACTIVITY_LABELS[event.eventKey] ??
                            "Đã cập nhật watch",
                        occurredAt: event.createdAt.toISOString(),
                        href: productId
                            ? `/admin/watches/${productId}`
                            : undefined,
                        tone: "slate",
                        kind: watchActivityKind(event.eventKey),
                    };
                }),
            },
        };
    },
    ["watch-list-dashboard-v8"],
    { revalidate: 60 },
);

export async function getWatchListDashboard() {
    return getCachedWatchListDashboard();
}
