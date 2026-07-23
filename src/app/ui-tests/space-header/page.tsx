"use client";

import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  LayoutDashboard,
  Plus,
  SlidersHorizontal,
  Sparkles,
  Workflow,
} from "lucide-react";

function StatusBadge() {
  return (
    <span className="inline-flex h-7 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 text-[11px] font-semibold text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
      Đang hoạt động
    </span>
  );
}

export default function SpaceHeaderPrototypePage() {
  return (
    <main className="min-h-screen bg-[#f6f8fb] px-5 py-8 text-slate-950">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-violet-700">
              <Sparkles className="h-3 w-3" />
              UI test · Page header
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Demo độc lập, chưa thay đổi trang vận hành hiện tại.
            </p>
          </div>
          <a
            href="/ui-tests/flow-item-list"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-violet-200 hover:text-violet-700"
          >
            Xem UI test danh sách
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <section className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-4 sm:p-6">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Phiên bản đề xuất
          </p>

          <header className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03),0_14px_40px_rgba(79,70,229,0.06)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-400 to-sky-400" />
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-100/70 blur-3xl" />
            <div className="pointer-events-none absolute right-48 top-10 h-32 w-32 rounded-full bg-sky-100/60 blur-3xl" />

            <div className="relative px-5 pb-5 pt-6 sm:px-7 sm:pb-6 sm:pt-7">
              <nav className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>Quản lý Space</span>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="font-medium text-slate-600">Vận hành Spaces</span>
              </nav>

              <div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200/70">
                    <Workflow className="h-6 w-6" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-2xl font-bold tracking-[-0.025em] text-slate-950 sm:text-[28px]">
                        Space Vận hành tuần 30
                      </h1>
                      <StatusBadge />
                    </div>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                      Theo dõi tiến độ sản xuất, phối hợp xử lý và hoàn tất các item
                      trong tuần.
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <LayoutDashboard className="h-3.5 w-3.5 text-violet-500" />
                        Media Production
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-3.5 w-3.5 text-violet-500" />
                        Tuần 30/2026
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        27 item đang hiển thị
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                        Cập nhật 15:02 hôm nay
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
                  <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:text-violet-700">
                    <SlidersHorizontal className="h-4 w-4" />
                    Tùy chỉnh dashboard
                  </button>
                  <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-700">
                    <Plus className="h-4 w-4" />
                    Workspace
                  </button>
                </div>
              </div>
            </div>
          </header>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Header hiện tại
            </p>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <nav className="text-xs text-slate-400">
                  Quản lý Space <span className="mx-1">›</span>{" "}
                  <span className="text-slate-600">Vận hành Spaces</span>
                </nav>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold">Space Vận hành tuần 30</h2>
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-[10px] font-semibold text-violet-700">
                    Đang hoạt động
                  </span>
                </div>
              </div>
              <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-semibold">
                <SlidersHorizontal className="h-4 w-4" />
                Tùy chỉnh dashboard
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-violet-200 bg-violet-50/60 p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-600">
              Ý đồ thiết kế
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                ["Nhận diện", "Icon gradient tạo điểm neo thị giác cho Space."],
                ["Ngữ cảnh", "Flow, tuần và số item được đọc ngay dưới title."],
                ["Hành động", "Action chính và phụ nằm cùng một vùng dễ tìm."],
              ].map(([title, copy], index) => (
                <div key={title} className="rounded-xl border border-violet-100 bg-white/80 p-4">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-600 text-[11px] font-bold text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-3 text-xs font-bold text-slate-900">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
