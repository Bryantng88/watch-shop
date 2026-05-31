"use client";

type Props = {
    total: number;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export default function ServiceRequestPagination({ total, page, totalPages, onPageChange }: Props) {
    return (
        <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
            <div>
                Tổng: <b>{total}</b> · Trang <b>{page}</b>/<b>{totalPages}</b>
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="rounded-2xl border border-slate-200 px-4 py-2 font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={page <= 1}
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                >
                    ← Trước
                </button>
                <button
                    type="button"
                    className="rounded-2xl border border-slate-200 px-4 py-2 font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                >
                    Sau →
                </button>
            </div>
        </div>
    );
}
