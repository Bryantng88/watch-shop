"use client";

type Props = {
    selectedCount: number;
};

export default function WatchListToolbar({ selectedCount }: Props) {
    return (
        <div className="flex flex-col gap-4 px-1 py-1 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-slate-950">
                        Danh sách watch
                    </h1>
                </div>

                <p className="mt-2 text-sm text-slate-500">
                    Quản lý domain watch riêng, nhưng giữ đúng cảm giác thao tác nhanh như list sản phẩm cũ.
                </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 self-start">
                <div className="inline-flex h-12 items-center gap-3 rounded-2xl bg-slate-50 px-4">
                    <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                        Đã chọn
                    </div>
                    <div className="text-xl font-semibold leading-none text-slate-950">
                        {selectedCount}
                    </div>
                </div>
            </div>
        </div>
    );
}
