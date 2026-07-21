import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Copy,
  FolderKanban,
  Send,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";

const rows = [
  ["1980s Grace Fabliau Skeleton Asymetrique", "GFX-16072026-001", "Gent · Vintic", "Đang xử lý", "0/6"],
  ["1990s Seiko 4525 8010 Guilloche Automatic", "SEI-30052026-001", "Vintic", "Đang xử lý", "0/1"],
  ["1970s Seiko King Quartz 9923-7000", "SEI-05072026-001", "Gent · Vintic", "Đang xử lý", "0/1"],
  ["1980s Longines Classique Vendome", "LNG-19072026-001", "Vintic", "Hoàn tất", "0/2"],
];

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2.5 border-l border-slate-200 px-3.5 py-1 first:border-l-0">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center text-slate-400">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</div>
        <div className="mt-0.5 truncate text-xs font-bold text-slate-800">{value}</div>
      </div>
    </div>
  );
}

function Step({
  number,
  title,
  subtitle,
  state,
}: {
  number: number;
  title: string;
  subtitle: string;
  state: "done" | "current" | "next";
}) {
  const current = state === "current";
  const done = state === "done";

  return (
    <div className={[
      "flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-2.5",
      current ? "bg-white shadow-sm ring-1 ring-indigo-100" : "",
    ].join(" ")}>
      <div className={[
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
        current ? "bg-indigo-600 text-white" : done ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500",
      ].join(" ")}>
        {done ? <CheckCircle2 className="h-4 w-4" /> : number}
      </div>
      <div className="min-w-0">
        <div className={current ? "truncate text-xs font-bold text-indigo-700" : "truncate text-xs font-bold text-slate-700"}>{title}</div>
        <div className="mt-0.5 truncate text-[10px] text-slate-400">{subtitle}</div>
      </div>
    </div>
  );
}

export default function WorkspaceHeaderBalancedTestPage() {
  return (
    <main className="min-h-screen bg-[#f6f8fc] px-5 py-6 text-slate-900">
      <div className="mx-auto max-w-[1480px] space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>Space Management</span><span>/</span><span>Media tuần 30</span><span>/</span><b className="text-slate-800">Đăng bài</b>
            </div>
            <h1 className="mt-2 text-xl font-bold">Workspace header · Balanced</h1>
          </div>
          <div className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">UI test B</div>
        </div>

        <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-gradient-to-br from-white via-white to-indigo-50/40 shadow-[0_14px_45px_rgba(30,41,59,0.08)]">
          <div className="grid gap-5 px-5 py-5 xl:grid-cols-[350px_minmax(0,1fr)_210px] xl:items-center">
            <div className="flex min-w-0 items-center gap-4">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-700 ring-1 ring-emerald-200">
                <Send className="h-7 w-7" />
                <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-blue-500" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-indigo-600">
                  <Sparkles className="h-3.5 w-3.5" /> Đăng bài Workspace
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-2xl font-black tracking-tight">Đăng bài</h2>
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 ring-1 ring-amber-200">Cần làm</span>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">● Vừa</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-4 md:grid-cols-4">
              <Metric icon={<UserRound className="h-4 w-4" />} label="Owner" value="System" />
              <Metric icon={<CalendarDays className="h-4 w-4" />} label="Due date" value="Chưa có" />
              <Metric icon={<ClipboardCheck className="h-4 w-4" />} label="Checklist" value="0 / 0" />
              <Metric icon={<FolderKanban className="h-4 w-4" />} label="Space" value="Media tuần 30" />
            </div>

            <div className="border-l border-slate-200 py-1 pl-5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Workspace ref</div>
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <code className="truncate text-sm font-bold text-slate-900">PX-42E6-35E3A0</code>
                <button type="button" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-indigo-600 hover:bg-indigo-50">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-slate-100 bg-slate-50/75 px-5 py-3.5 lg:grid-cols-[minmax(0,1fr)_230px] lg:items-center">
            <div className="flex min-w-0 items-center">
              <Step number={1} title="Photoshoot" subtitle="Đã chuyển bước" state="done" />
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
              <Step number={2} title="Xử lý Media" subtitle="Đã duyệt media" state="done" />
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
              <Step number={3} title="Đăng bài" subtitle="Current workspace" state="current" />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3">
              <div>
                <div className="text-2xl font-black leading-none text-indigo-700">6</div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-indigo-500">Items trong workspace</div>
              </div>
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full border-2 border-white bg-amber-200" />
                <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-300" />
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-white text-slate-500"><UsersRound className="h-3.5 w-3.5" /></div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex h-12 items-end gap-6 border-b border-slate-200 px-3 text-xs font-medium text-slate-500">
          <span className="pb-3.5">Tổng quan</span><span className="pb-3.5">Workflow</span><span className="pb-3.5">Hoạt động</span><span className="pb-3.5">Checklist</span>
          <span className="border-b-2 border-indigo-600 pb-3.5 font-bold text-indigo-700">Đăng bài Items <b className="ml-1 rounded-full bg-indigo-50 px-1.5 py-0.5">6</b></span>
          <span className="pb-3.5">Thông tin</span>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold">Đăng bài Items</div>
              <div className="flex gap-1 rounded-lg bg-slate-100 p-1 text-[11px] font-semibold text-slate-500"><span className="rounded-md bg-white px-2.5 py-1 text-indigo-700 shadow-sm">All</span><span className="px-2.5 py-1">In progress</span><span className="px-2.5 py-1">Done</span></div>
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              {rows.map(([title, ref, channels, status, activity]) => (
                <div key={ref} className="grid grid-cols-[minmax(0,1fr)_120px_80px_112px] items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-0">
                  <div className="min-w-0"><div className="truncate text-xs font-bold">{title}</div><div className="mt-1 text-[10px] text-slate-400">{ref} · {channels}</div></div>
                  <span className={status === "Hoàn tất" ? "w-fit rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700" : "w-fit rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700"}>{status}</span>
                  <span className="text-xs font-semibold text-slate-500">{activity}</span>
                  <button type="button" className="h-8 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-700">Đã đăng bài</button>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="text-xs font-bold">Shared with</div><div className="mt-3 flex items-center justify-between"><div className="flex -space-x-2"><div className="h-9 w-9 rounded-full border-2 border-white bg-amber-200" /><div className="h-9 w-9 rounded-full border-2 border-white bg-slate-300" /></div><button className="rounded-lg border border-indigo-200 px-3 py-1.5 text-xs font-bold text-indigo-600">+ Thêm</button></div></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="text-xs font-bold">Thông tin nhanh</div><dl className="mt-3 space-y-2 text-xs"><div className="flex justify-between"><dt className="text-slate-500">Ref</dt><dd className="font-semibold">2026-W30</dd></div><div className="flex justify-between"><dt className="text-slate-500">Tạo lúc</dt><dd className="font-semibold">15:24 20/7/26</dd></div><div className="flex justify-between"><dt className="text-slate-500">Cập nhật</dt><dd className="font-semibold">18:14 20/7/26</dd></div></dl></div>
          </aside>
        </div>

        <div className="rounded-xl border border-dashed border-violet-200 bg-violet-50/60 px-4 py-3 text-xs leading-5 text-violet-800">
          Bản Balanced giữ độ thoáng và phân cấp thị giác tốt hơn bản Compact: header khoảng 180–195px, vẫn tiết kiệm đáng kể so với production nhưng không tạo cảm giác bị nén. Header phủ toàn chiều ngang; phần danh sách mới chia hai cột với sidebar.
        </div>
      </div>
    </main>
  );
}
