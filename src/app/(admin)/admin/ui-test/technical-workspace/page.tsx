import Link from "next/link";
import {
    Activity,
    ArrowRight,
    CheckSquare2,
    ChevronDown,
    ChevronRight,
    Circle,
    Clock3,
    Filter,
    Info,
    LayoutList,
    MoreHorizontal,
    Plus,
    Search,
    Settings2,
    SlidersHorizontal,
    UserRound,
    Workflow,
    Wrench,
} from "lucide-react";

const stages = [
    { index: 1, label: "Inspect", detail: "Technical inspection and classification", state: "idle" },
    { index: 2, label: "Processing", detail: "Technical processing workspace", state: "current" },
    { index: 3, label: "Done / Follow-up", detail: "Completion, payment follow-up and monitoring", state: "idle" },
] as const;

const items = [
    { title: "Kiểm tra máy", ref: "SR-170726-000007", watch: "Corum", status: "Chờ xử lý", progress: "1 / 3", percent: 33, assignee: "Mẫn", activity: "3 / 5" },
    { title: "Spa vỏ", ref: "SR-160726-000002", watch: "Seiko LM", status: "Chờ xử lý", progress: "2 / 3", percent: 66, assignee: "Nhật", activity: "2 / 4" },
    { title: "Xử lý lume", ref: "SR-140726-000002", watch: "Bulova", status: "Done", progress: "3 / 3", percent: 100, assignee: "Long", activity: "5 / 5" },
] as const;

const tabs = [
    { label: "Tổng quan", icon: SlidersHorizontal },
    { label: "Items", icon: LayoutList, count: 15 },
    { label: "Workflow", icon: Workflow },
    { label: "Hoạt động", icon: Activity },
    { label: "Checklist", icon: CheckSquare2, count: 3 },
    { label: "Thông tin", icon: Info },
];

export default function TechnicalWorkspaceUiTestPage() {
    return (
        <main className="mx-auto w-full max-w-[1500px] space-y-4 px-4 py-5 lg:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5">
                <p className="text-xs text-violet-800"><b>UI test:</b> Technical Workspace V2 — dữ liệu mẫu, chưa thay đổi màn hình thật.</p>
                <Link href="/admin/coordination" className="text-xs font-semibold text-violet-700 hover:text-violet-950">Quay lại Coordination</Link>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <nav className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500" aria-label="Breadcrumb">
                    <span>Quản lý Space</span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                    <span>Space Kỹ thuật tuần 29</span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                    <b className="truncate text-slate-900">Bàn xử lý kỹ thuật</b>
                </nav>
                <button type="button" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50" aria-label="Thao tác khác">
                    <MoreHorizontal className="h-4 w-4" />
                </button>
            </div>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                <div className="flex flex-wrap items-start justify-between gap-5">
                    <div className="flex min-w-0 items-start gap-4">
                        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                            <Wrench className="h-9 w-9" strokeWidth={1.7} />
                        </div>
                        <div className="min-w-0 pt-1">
                            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-600">Technical Workspace</div>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-slate-950">Bàn xử lý kỹ thuật</h1>
                                <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-700 ring-1 ring-amber-100">Cần làm</span>
                                <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-700 ring-1 ring-blue-100">Tuần 29/2026</span>
                            </div>
                            <p className="mt-2 text-sm text-slate-500">Tiếp nhận, phân loại và điều phối toàn bộ Technical Issue trong tuần.</p>
                        </div>
                    </div>

                    <div className="min-w-[230px] rounded-xl border border-violet-200 bg-gradient-to-br from-white to-violet-50 p-4">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Workspace ref</div>
                        <div className="mt-2 font-mono text-base font-bold text-slate-900">TECH-W29-2026</div>
                    </div>
                </div>

                <div className="mt-6 grid overflow-hidden rounded-xl border border-slate-200 lg:grid-cols-[minmax(0,1fr)_310px]">
                    <div className="grid grid-cols-1 sm:grid-cols-3">
                        {stages.map((stage, index) => {
                            const current = stage.state === "current";
                            return (
                                <div key={stage.label} className={`relative flex min-h-[96px] items-center gap-3 border-b border-r border-slate-100 px-5 py-4 sm:border-b-0 ${current ? "m-2 rounded-lg border border-violet-300 bg-violet-50/40 px-3 py-2" : ""}`}>
                                    <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold ${current ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"}`}>
                                        {stage.index}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <b className={`truncate text-sm ${current ? "text-indigo-700" : "text-slate-900"}`}>{stage.label}</b>
                                            {current ? <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[9px] font-bold text-violet-700">Current</span> : null}
                                        </div>
                                        <div className="mt-1 truncate text-[11px] text-slate-500">{stage.detail}</div>
                                    </div>
                                    {index < stages.length - 1 ? <ChevronRight className="absolute right-2 h-4 w-4 text-slate-300" /> : null}
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-4 border-t border-slate-100 bg-white px-6 py-4 lg:border-l lg:border-t-0">
                        <div className="grid h-11 w-11 place-items-center rounded-full bg-violet-50 text-violet-600 ring-1 ring-violet-100"><Workflow className="h-5 w-5" /></div>
                        <div className="flex items-baseline gap-2"><b className="text-2xl text-slate-950">5</b><div className="text-xs font-bold text-slate-900">Technical Issue Operation<div className="mt-1 font-normal text-slate-500">trong Workspace này</div></div></div>
                    </div>
                </div>

                <div className="mt-5 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Meta icon={UserRound} label="Owner" value="System" />
                    <Meta icon={Settings2} label="Space" value="Kỹ thuật tuần 29" />
                    <Meta icon={Circle} label="Ưu tiên" value="Trung bình" amber />
                    <Meta icon={Clock3} label="Cập nhật" value="15:37 17/07/2026" />
                </div>
            </section>

            <div className="flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2">
                {tabs.map(({ label, icon: Icon, count }, index) => (
                    <button key={label} type="button" className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-semibold ${index === 1 ? "bg-violet-50 text-violet-700 ring-1 ring-violet-200" : "text-slate-600 hover:bg-slate-50"}`}>
                        <Icon className="h-3.5 w-3.5" />{label}{count ? <span className="rounded-full bg-white px-1.5 py-0.5 text-[9px] ring-1 ring-slate-200">{count}</span> : null}
                    </button>
                ))}
            </div>

            <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_310px]">
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.035)]">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4">
                        <div><h2 className="text-sm font-semibold text-slate-950">Technical Items</h2><p className="mt-1 text-[11px] text-slate-500">Danh sách item thuộc Bàn xử lý kỹ thuật.</p></div>
                        <div className="flex flex-wrap items-center gap-2">
                            <label className="flex h-9 w-52 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs text-slate-500"><Search className="h-4 w-4" /><input className="min-w-0 flex-1 outline-none" placeholder="Tìm kiếm item..." /></label>
                            <button type="button" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500"><Filter className="h-4 w-4" /></button>
                            <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg border border-violet-300 px-3 text-xs font-semibold text-violet-700"><Plus className="h-4 w-4" />Thêm item<ChevronDown className="h-3.5 w-3.5" /></button>
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto border-b border-slate-100 px-4 py-3">
                        {["Tất cả", "Kiểm tra", "Chờ xử lý", "Đang xử lý", "Done"].map((label, index) => <button key={label} type="button" className={`h-8 shrink-0 rounded-lg border px-3 text-[11px] font-semibold ${index === 0 ? "border-violet-300 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600"}`}>{label}</button>)}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] text-left">
                            <thead className="bg-slate-50/70 text-[9px] uppercase tracking-[0.1em] text-slate-500"><tr><th className="w-10 px-4 py-3"><input type="checkbox" /></th><th className="px-3 py-3">Item</th><th className="px-3 py-3">Trạng thái</th><th className="px-3 py-3">Tiến độ</th><th className="px-3 py-3">Bước tiếp theo</th><th className="px-3 py-3">Phụ trách</th><th className="px-3 py-3">Hoạt động</th></tr></thead>
                            <tbody className="divide-y divide-slate-100">
                                {items.map((item) => <ItemRow key={item.ref} item={item} />)}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center border-t border-slate-100 p-4"><button className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">Xem tất cả 18 items<ArrowRight className="h-4 w-4" /></button></div>
                </section>

                <aside className="space-y-4">
                    <section className="rounded-xl border border-slate-200 bg-white p-5">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600">Chi tiết Workspace</h3>
                        <div className="mt-4 space-y-3">
                            <Detail label="Workspace ref" value="TECH-W29-2026" />
                            <Detail label="Space" value="Kỹ thuật tuần 29" />
                            <Detail label="Workspace type" value="Technical Operation" />
                            <Detail label="Default view" value="Items" />
                            <Detail label="Tuần" value="29/2026" />
                        </div>
                        <button type="button" className="mt-5 h-9 w-full rounded-lg bg-violet-50 text-xs font-semibold text-violet-700 ring-1 ring-violet-100">Chỉnh sửa thông tin</button>
                    </section>

                    <section className="rounded-xl border border-slate-200 bg-white p-5">
                        <div className="flex items-center justify-between"><h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600">Hoạt động gần nhất</h3><button className="text-[10px] font-semibold text-violet-700">Xem tất cả</button></div>
                        <div className="relative mt-5 space-y-5 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-slate-200">
                            <ActivityItem text="Mẫn đã phân loại item Spa vỏ" time="15:37 17/07/2026" />
                            <ActivityItem text="System đã chuyển 3 item sang Chờ xử lý" time="15:10 17/07/2026" />
                            <ActivityItem text="Long đã hoàn tất item Xử lý lume" time="14:45 17/07/2026" />
                        </div>
                    </section>
                </aside>
            </div>
        </main>
    );
}

function Meta({ icon: Icon, label, value, amber = false }: { icon: typeof UserRound; label: string; value: string; amber?: boolean }) {
    return <div className="flex items-center gap-3"><Icon className="h-4 w-4 text-slate-400" /><div><div className="text-[10px] text-slate-400">{label}</div><div className="mt-1 flex items-center gap-2 text-xs font-semibold text-slate-800">{amber ? <span className="h-2 w-2 rounded-full bg-amber-500" /> : null}{value}</div></div></div>;
}

function ItemRow({ item }: { item: typeof items[number] }) {
    const done = item.percent === 100;
    return <tr className="text-xs"><td className="px-4 py-4"><input type="checkbox" /></td><td className="px-3 py-4"><div className="font-semibold text-slate-900">{item.title}</div><div className="mt-1 text-[10px] text-slate-500">{item.ref} · {item.watch}</div></td><td className="px-3 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${done ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>{item.status}</span></td><td className="px-3 py-4"><div className="flex items-center justify-between text-[10px]"><b className={done ? "text-emerald-600" : "text-blue-600"}>{item.progress}</b><span>{item.percent}%</span></div><div className="mt-2 h-1.5 w-32 rounded-full bg-slate-100"><div style={{ width: `${item.percent}%` }} className={`h-full rounded-full ${done ? "bg-emerald-500" : "bg-blue-500"}`} /></div></td><td className="px-3 py-4"><button className="inline-flex h-8 items-center gap-2 rounded-lg border border-slate-200 px-3 text-[10px] font-semibold text-slate-600">Xử lý kỹ thuật<ChevronRight className="h-3 w-3" /></button></td><td className="px-3 py-4"><span className="grid h-8 w-8 place-items-center rounded-full bg-slate-800 text-[10px] font-bold text-white">{item.assignee.slice(0, 1)}</span></td><td className="px-3 py-4 font-semibold text-slate-600">{item.activity}</td></tr>;
}

function Detail({ label, value }: { label: string; value: string }) {
    return <div className="flex items-start justify-between gap-4 text-[11px]"><span className="text-slate-500">{label}</span><b className="text-right text-slate-800">{value}</b></div>;
}

function ActivityItem({ text, time }: { text: string; time: string }) {
    return <div className="relative flex gap-3"><span className="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-4 border-white bg-violet-500 ring-1 ring-violet-200" /><div><div className="text-[11px] font-medium leading-5 text-slate-700">{text}</div><div className="mt-0.5 text-[9px] text-slate-400">{time}</div></div></div>;
}
