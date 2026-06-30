import { listBusinessFeedbacks } from "../server/business-feedback.repo";

function formatDate(value?: Date | string | null) {
    if (!value) return "-";
    return new Date(value).toLocaleString("vi-VN");
}

export default async function BusinessFeedbackBox({
    targetType,
    targetId,
    title = "Feedback",
}: {
    targetType: string;
    targetId: string;
    title?: string;
}) {
    const items = await listBusinessFeedbacks({
        targetType,
        targetId,
        limit: 10,
    });

    if (!items.length) return null;

    return (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3">
            <div className="mb-2 text-sm font-semibold text-amber-800">{title}</div>

            <div className="space-y-2">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="rounded-xl bg-white/70 px-3 py-2 text-sm text-amber-900 ring-1 ring-amber-100"
                    >
                        <div className="whitespace-pre-wrap">{item.message}</div>
                        <div className="mt-1 text-[11px] text-amber-600">
                            {formatDate(item.createdAt)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}