import Link from "next/link";
import {
    Activity,
    BadgeDollarSign,
    Camera,
    Check,
    ChevronRight,
    Circle,
    Clock3,
    FileText,
    History,
    ImageIcon,
    MoreHorizontal,
    NotebookPen,
    Pencil,
    ReceiptText,
    Save,
    Settings2,
    Sparkles,
    Star,
    TrendingUp,
    WalletCards,
    Wrench,
} from "lucide-react";

const metadata = [
    { label: "Brand", value: "Grand Seiko" },
    { label: "Model", value: "9F Quartz" },
    { label: "Reference", value: "SBGX263" },
    { label: "Vendor", value: "Nhật" },
    { label: "Năm SX", value: "~1990s" },
    { label: "Bộ máy", value: "9F62" },
];

const progress = [
    { label: "Gallery", detail: "Hoàn tất", date: "12/07/2026", state: "done" },
    { label: "Content", detail: "Đang xử lý", date: "15/07/2026", state: "active" },
    { label: "Pricing", detail: "Hoàn tất", date: "16/07/2026", state: "done" },
    { label: "Service", detail: "Chưa có", date: "", state: "idle" },
] as const;

const tabs = [
    { label: "Tổng quan", icon: Sparkles },
    { label: "Spec & Chi tiết", icon: Settings2 },
    { label: "Media", icon: ImageIcon },
    { label: "Service (0)", icon: Wrench },
    { label: "Lịch sử", icon: History },
    { label: "Activity", icon: Activity },
    { label: "Ghi chú", icon: NotebookPen },
];

function ActionButton({ children }: { children: React.ReactNode }) {
    return (
        <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
            {children}
        </button>
    );
}

export default function WatchHeaderUiTestPage() {
    return (
        <main className="mx-auto w-full max-w-[1440px] space-y-4 px-4 py-5 lg:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5">
                <p className="text-xs text-violet-800"><b>UI test:</b> Watch Detail Header V2 — dữ liệu mẫu, chưa tác động màn hình thật.</p>
                <Link href="/admin/watches" className="text-xs font-semibold text-violet-700 hover:text-violet-950">Quay lại danh sách Watch</Link>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <nav className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500" aria-label="Breadcrumb">
                    <Link href="/admin/watches" className="hover:text-slate-900">Danh sách watch</Link>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                    <span className="truncate font-semibold text-slate-800">Grand Seiko pin tròn mặt trắng máy 9F</span>
                </nav>
                <div className="flex items-center gap-2">
                    <ActionButton><Wrench className="h-4 w-4" />Mở Service Board</ActionButton>
                    <button type="button" aria-label="Thao tác khác" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50">
                        <MoreHorizontal className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_310px]">
                <div className="min-w-0 space-y-4">
                    <section className="grid overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-[0_10px_30px_rgba(15,23,42,0.04)] md:grid-cols-[260px_minmax(0,1fr)]">
                        <div className="relative grid min-h-[250px] place-items-center overflow-hidden rounded-lg bg-[radial-gradient(circle_at_50%_38%,#fff_0%,#e2e8f0_48%,#94a3b8_100%)]">
                            <div className="relative grid h-40 w-40 place-items-center rounded-full border-[12px] border-slate-800 bg-gradient-to-br from-white to-slate-100 shadow-[0_18px_35px_rgba(15,23,42,0.34)]">
                                <Clock3 className="h-24 w-24 text-slate-700" strokeWidth={1} />
                                <span className="absolute top-11 text-[9px] font-bold tracking-widest text-slate-500">GRAND SEIKO</span>
                            </div>
                            <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                <button type="button" className="inline-flex h-8 items-center gap-2 rounded-lg bg-slate-950/90 px-3 text-[11px] font-semibold text-white backdrop-blur">
                                    <Camera className="h-3.5 w-3.5" />Xem gallery
                                </button>
                                <span className="rounded-lg bg-slate-950/75 px-2.5 py-2 text-[10px] font-semibold text-white backdrop-blur">12 ảnh</span>
                            </div>
                        </div>

                        <div className="flex min-w-0 flex-col justify-between gap-6 p-4 md:p-5">
                            <div>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <span className="inline-flex rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-bold text-violet-700 ring-1 ring-violet-100">WATCH-CMEJ00610</span>
                                        <h1 className="mt-4 text-[25px] font-semibold leading-tight tracking-[-0.025em] text-slate-950">Grand Seiko pin tròn mặt trắng máy 9F</h1>
                                        <p className="mt-2 text-sm text-slate-500">Thiết kế thanh lịch với bộ máy quartz 9F chính xác cao.</p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2">
                                        {[Star, Pencil, MoreHorizontal].map((Icon, index) => (
                                            <button key={index} type="button" aria-label={["Theo dõi", "Chỉnh sửa", "Thao tác khác"][index]} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
                                                <Icon className="h-4 w-4" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-7 grid grid-cols-2 border-y border-slate-100 sm:grid-cols-3 xl:grid-cols-6">
                                    {metadata.map((item) => (
                                        <div key={item.label} className="min-w-0 border-r border-slate-100 px-3 py-3 first:pl-0 last:border-r-0">
                                            <div className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">{item.label}</div>
                                            <div className="mt-1 truncate text-xs font-semibold text-slate-900">{item.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100">● IN STOCK</span>
                                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-bold text-blue-700 ring-1 ring-blue-100">Sẵn sàng bán</span>
                                <span className="inline-flex rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-200">SKU: GS-SBGX263-WT</span>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.035)]">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">Chuẩn bị đăng bán</h2>
                                <p className="mt-1 text-xs text-slate-400">Tiến độ hoàn thiện hồ sơ Watch.</p>
                            </div>
                            <ActionButton>Xem timeline</ActionButton>
                        </div>

                        <div className="mt-7 grid grid-cols-2 gap-y-7 md:grid-cols-4">
                            {progress.map((item, index) => {
                                const done = item.state === "done";
                                const active = item.state === "active";
                                return (
                                    <div key={item.label} className="relative px-4 first:pl-0 last:pr-0">
                                        {index < progress.length - 1 ? <div className={`absolute left-[34px] right-[-18px] top-2 h-px ${done ? "bg-emerald-400" : active ? "bg-amber-300" : "bg-slate-200"}`} /> : null}
                                        <div className={`relative z-10 grid h-4 w-4 place-items-center rounded-full ${done ? "bg-emerald-500 text-white" : active ? "bg-white text-amber-500 ring-2 ring-amber-400" : "bg-white text-slate-300 ring-1 ring-slate-300"}`}>
                                            {done ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : active ? <Circle className="h-2 w-2 fill-current" /> : null}
                                        </div>
                                        <div className={`mt-3 text-xs font-semibold ${done ? "text-emerald-700" : active ? "text-amber-700" : "text-slate-600"}`}>{item.label}</div>
                                        <div className="mt-1 text-[11px] text-slate-500">{item.detail}</div>
                                        {item.date ? <div className="mt-0.5 text-[10px] text-slate-400">{item.date}</div> : null}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>

                <aside className="space-y-4">
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Giá bán hiện tại</div>
                        <div className="mt-4 text-[25px] font-semibold tracking-[-0.04em] text-slate-950">20.000.000 VND</div>
                        <div className="mt-2 text-[11px] leading-5 text-slate-500">Cập nhật gần nhất: 10:35, 17/07/2026</div>
                        <a href="#pricing" className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-violet-300 text-xs font-semibold text-violet-700 hover:bg-violet-50">
                            <BadgeDollarSign className="h-4 w-4" />Chỉnh sửa giá
                        </a>
                    </section>

                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                        <div className="flex items-center justify-between gap-3">
                            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Health sản phẩm</div>
                            <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">Tốt</span>
                        </div>
                        <div className="mt-5 text-xl font-semibold text-emerald-700">Gần sẵn sàng bán</div>
                        <div className="mt-1 text-xs font-medium text-slate-600">3/4 nhóm dữ liệu hoàn tất</div>

                        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3">
                            <div className="flex items-start gap-2">
                                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                                <div>
                                    <div className="text-xs font-semibold text-amber-900">Còn một điểm cần xử lý</div>
                                    <p className="mt-1 text-[11px] leading-5 text-amber-800">Nội dung đang chờ hoàn thiện trước khi Watch có thể đăng bán.</p>
                                </div>
                            </div>
                        </div>

                        <button type="button" className="mt-4 h-9 w-full rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50">Xem chi tiết</button>
                    </section>
                </aside>
            </div>

            <div className="flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
                {tabs.map(({ label, icon: Icon }, index) => (
                    <button key={label} type="button" className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-semibold ${index === 0 ? "bg-violet-50 text-violet-700 ring-1 ring-violet-200" : "text-slate-600 hover:bg-slate-50"}`}>
                        <Icon className="h-3.5 w-3.5" />{label}
                    </button>
                ))}
            </div>

            <section id="pricing" className="scroll-mt-5 rounded-xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
                    <div className="flex items-start gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-700 ring-1 ring-violet-100">
                            <WalletCards className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-slate-950">Giá & Cost Ledger</h2>
                            <p className="mt-1 text-xs text-slate-500">Giá bán, giá vốn và các chi phí vận hành của Watch.</p>
                        </div>
                    </div>
                    <button type="button" className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-950 px-4 text-xs font-semibold text-white shadow-sm hover:bg-slate-800">
                        <Save className="h-4 w-4" />Lưu thay đổi
                    </button>
                </div>

                <div className="grid gap-5 p-5 xl:grid-cols-[310px_minmax(0,1fr)]">
                    <div className="space-y-4">
                        <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-600">Giá bán đề xuất</span>
                                <TrendingUp className="h-4 w-4 text-violet-500" />
                            </div>
                            <div className="mt-4 text-[28px] font-semibold tracking-[-0.04em] text-slate-950">20.000.000 VND</div>
                            <p className="mt-2 text-[11px] leading-5 text-slate-500">Tính từ giá vốn, chi phí hiện tại và biên lợi nhuận mục tiêu.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-xl border border-slate-200 p-4">
                                <div className="text-[10px] font-semibold uppercase text-slate-400">Giá vốn</div>
                                <div className="mt-2 text-base font-semibold text-slate-900">12.500.000</div>
                            </div>
                            <div className="rounded-xl border border-slate-200 p-4">
                                <div className="text-[10px] font-semibold uppercase text-slate-400">Lợi nhuận dự kiến</div>
                                <div className="mt-2 text-base font-semibold text-emerald-700">7.000.000</div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 p-4">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-medium text-slate-500">Biên lợi nhuận</span>
                                <b className="text-emerald-700">35%</b>
                            </div>
                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                                <div className="h-full w-[35%] rounded-full bg-emerald-500" />
                            </div>
                        </div>
                    </div>

                    <div className="min-w-0 space-y-5">
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <PriceField label="Giá vốn" value="12.500.000" suffix="VND" muted />
                            <PriceField label="Phí Service" value="500.000" suffix="VND" />
                            <PriceField label="Lợi nhuận mục tiêu" value="7.000.000" suffix="VND" />
                            <PriceField label="Giá bán" value="20.000.000" suffix="VND" emphasized />
                        </div>

                        <div className="overflow-hidden rounded-xl border border-slate-200">
                            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-4 py-3">
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                                    <ReceiptText className="h-4 w-4 text-slate-500" />Cost ledger
                                </div>
                                <span className="text-[10px] font-medium text-slate-400">3 khoản chi</span>
                            </div>
                            <div className="divide-y divide-slate-100">
                                <LedgerRow source="Acquisition payment OUT" detail="PN-270526-000005 · Mẫn" amount="12.000.000" status="Đã thanh toán" />
                                <LedgerRow source="Service payment OUT" detail="Bảo dưỡng, kiểm tra máy và vệ sinh" amount="500.000" status="Đã ghi nhận" />
                                <LedgerRow source="Shipment / logistics OUT" detail="Chưa phát sinh chi phí" amount="—" status="Chưa có" muted />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                            <p className="text-[11px] leading-5 text-amber-900">Giá ở header là projection chỉ đọc. Sau khi lưu thành công, card giá sẽ cập nhật mà không tải lại toàn bộ Watch.</p>
                            <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-200">Chưa có thay đổi</span>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

function PriceField({
    label,
    value,
    suffix,
    muted = false,
    emphasized = false,
}: {
    label: string;
    value: string;
    suffix: string;
    muted?: boolean;
    emphasized?: boolean;
}) {
    return (
        <label className="block">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</span>
            <span className={`mt-2 flex h-11 items-center rounded-lg border px-3 ${emphasized ? "border-violet-300 bg-violet-50/50 ring-1 ring-violet-100" : "border-slate-200 bg-white"}`}>
                <input readOnly value={value} className={`min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none ${muted ? "text-slate-500" : "text-slate-900"}`} />
                <span className="ml-2 text-[10px] font-medium text-slate-400">{suffix}</span>
            </span>
        </label>
    );
}

function LedgerRow({ source, detail, amount, status, muted = false }: { source: string; detail: string; amount: string; status: string; muted?: boolean }) {
    return (
        <div className="grid items-center gap-3 px-4 py-3 text-xs sm:grid-cols-[minmax(0,1fr)_110px_110px]">
            <div className="min-w-0">
                <div className="truncate font-semibold text-slate-800">{source}</div>
                <div className="mt-1 truncate text-[11px] text-slate-500">{detail}</div>
            </div>
            <div className={`font-semibold sm:text-right ${muted ? "text-slate-400" : "text-slate-900"}`}>{amount}</div>
            <div className={`text-[10px] font-semibold sm:text-right ${muted ? "text-slate-400" : "text-emerald-600"}`}>{status}</div>
        </div>
    );
}
