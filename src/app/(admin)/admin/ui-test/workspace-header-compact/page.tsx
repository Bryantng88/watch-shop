import {
  CalendarClock,
  CheckSquare2,
  ChevronRight,
  CircleUserRound,
  Copy,
  Folder,
  Radio,
  Send,
  Users,
} from "lucide-react";

const items = [
  ["1980s Grace Fabliau Skeleton Asymetrique", "GFX-16072026-001", "Đang xử lý"],
  ["1990s Seiko 4525 8010 Guilloche", "SEI-30052026-001", "Đang xử lý"],
  ["1970s Seiko King Quartz 9923-7000", "SEI-05072026-001", "Đang xử lý"],
  ["Citizen Bracelet Quartz 2 diamonds", "CTZ-26062026-002", "Hoàn tất"],
];

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 text-xs">
      <span className="text-slate-400">{icon}</span>
      <span className="text-slate-500">{label}</span>
      <span className="truncate font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function FlowStep({ number, title, active }: { number: number; title: string; active?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span
        className={[
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
          active ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500",
        ].join(" ")}
      >
        {number}
      </span>
      <span className={active ? "truncate text-xs font-bold text-indigo-700" : "truncate text-xs font-semibold text-slate-600"}>
        {title}
      </span>
    </div>
  );
}

export default function WorkspaceHeaderCompactTestPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-6 text-slate-900">
      <div className="mx-auto max-w-[1280px] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">UI test only</div>
            <h1 className="mt-1 text-xl font-bold">Workspace header — compact proposal</h1>
          </div>
          <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
            Không đụng UI thật
          </div>
        </div>

        <div className="text-xs text-slate-500">Space Management <span className="px-1.5">/</span> Media tuần 30 <span className="px-1.5">/</span> Đăng bài</div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 px-4 py-3.5 lg:flex-row lg:items-center">
            <div className="flex min-w-0 items-center gap-3 lg:w-[310px]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                <Send className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-lg font-bold">Đăng bài</h2>
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-200">Cần làm</span>
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">● Vừa</span>
                </div>
                <div className="mt-0.5 text-[11px] font-medium text-slate-500">Đăng bài Workspace · PX-42E6-35E3A0</div>
              </div>
            </div>

            <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-2 border-slate-100 lg:grid-cols-5 lg:border-l lg:pl-4">
              <MetaItem icon={<CircleUserRound className="h-3.5 w-3.5" />} label="Owner" value="System" />
              <MetaItem icon={<Folder className="h-3.5 w-3.5" />} label="Space" value="Media tuần 30" />
              <MetaItem icon={<CalendarClock className="h-3.5 w-3.5" />} label="Due" value="Chưa có" />
              <MetaItem icon={<CheckSquare2 className="h-3.5 w-3.5" />} label="Checklist" value="0/0" />
              <MetaItem icon={<Users className="h-3.5 w-3.5" />} label="Shared" value="2 người" />
            </div>

            <button type="button" className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              <Copy className="h-3.5 w-3.5" />
              Copy ref
            </button>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-4 py-2.5 lg:flex-row lg:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto">
              <FlowStep number={1} title="Photoshoot" />
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
              <FlowStep number={2} title="Xử lý Media" />
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
              <FlowStep number={3} title="Đăng bài" active />
            </div>
            <div className="flex shrink-0 items-center gap-2 rounded-lg bg-white px-3 py-1.5 ring-1 ring-slate-200">
              <Radio className="h-4 w-4 text-indigo-600" />
              <b className="text-base">6</b>
              <span className="text-xs font-semibold text-slate-600">Đăng bài Items</span>
            </div>
          </div>
        </section>

        <div className="flex h-11 items-end gap-5 border-b border-slate-200 px-2 text-xs font-medium text-slate-500">
          <span className="pb-3">Tổng quan</span>
          <span className="pb-3">Workflow</span>
          <span className="pb-3">Hoạt động</span>
          <span className="border-b-2 border-indigo-600 pb-3 font-semibold text-indigo-700">Đăng bài Items · 6</span>
          <span className="pb-3">Thông tin</span>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-bold">Đăng bài Items</div>
            <div className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">6 items</div>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            {items.map(([title, ref, status]) => (
              <div key={ref} className="grid grid-cols-[1fr_120px_100px] items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{title}</div>
                  <div className="mt-0.5 text-[11px] text-slate-500">{ref}</div>
                </div>
                <span className={status === "Hoàn tất" ? "text-xs font-semibold text-emerald-700" : "text-xs font-semibold text-blue-700"}>{status}</span>
                <button type="button" className="h-8 rounded-lg border border-slate-200 text-xs font-semibold">Đã đăng bài</button>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-xl border border-dashed border-indigo-200 bg-indigo-50/60 px-4 py-3 text-xs leading-5 text-indigo-800">
          Header đề xuất cao khoảng 132px gồm cả pipeline, thay cho khối hiện tại khoảng 270px. Owner, Space, Due date, Checklist và Shared vẫn nhìn thấy ngay; ref và thời gian tạo có thể chuyển vào popover “Thông tin” nếu cần giảm thêm.
        </div>
      </div>
    </main>
  );
}
