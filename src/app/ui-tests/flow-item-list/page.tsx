"use client";

import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Filter,
  LayoutGrid,
  List,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type StageKey = "ALL" | "REVIEW" | "SETTLED";
type ViewMode = "board" | "list";

const ITEMS = [
  { id: "PM-230726-000001", owner: "PN-230726-000001", party: "Nhật", purpose: "Nhập 5 watch", direction: "OUT", amount: 26000000, status: "UNPAID", stage: "REVIEW", updated: "2 phút trước" },
  { id: "PM-220726-000018", owner: "ORD-220726-000042", party: "Nguyễn Minh", purpose: "Thanh toán đơn hàng", direction: "IN", amount: 18500000, status: "UNPAID", stage: "REVIEW", updated: "18 phút trước" },
  { id: "PM-220726-000017", owner: "SR-220726-000008", party: "WatchCare", purpose: "Chi phí service", direction: "OUT", amount: 2200000, status: "UNPAID", stage: "REVIEW", updated: "35 phút trước" },
  { id: "PM-220726-000016", owner: "ORD-210726-000039", party: "Trần Hoàng", purpose: "Thu COD", direction: "IN", amount: 7300000, status: "PAID", stage: "SETTLED", updated: "1 giờ trước" },
  { id: "PM-210726-000015", owner: "PN-210726-000004", party: "Duy Xuyên", purpose: "Thanh toán phiếu nhập", direction: "OUT", amount: 42000000, status: "PAID", stage: "SETTLED", updated: "Hôm qua" },
  { id: "PM-210726-000014", owner: "ORD-210726-000034", party: "Lê Hải", purpose: "Đặt cọc đơn hàng", direction: "IN", amount: 5000000, status: "CANCELED", stage: "SETTLED", updated: "Hôm qua" },
] as const;

const STAGES: Array<{ key: StageKey; label: string; hint: string }> = [
  { key: "ALL", label: "Tất cả item", hint: "Toàn bộ flow" },
  { key: "REVIEW", label: "Review", hint: "Kiểm tra & đối soát" },
  { key: "SETTLED", label: "Settled / Exception", hint: "Đã xử lý" },
];

function money(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function MiniMetric({ label, value, detail, tone = "slate" }: { label: string; value: string; detail: string; tone?: "slate" | "emerald" | "rose" | "violet" }) {
  const tones = {
    slate: "text-slate-950",
    emerald: "text-emerald-600",
    rose: "text-rose-600",
    violet: "text-violet-600",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className={`mt-3 text-xl font-bold ${tones[tone]}`}>{value}</p>
      <p className="mt-1 text-xs text-slate-400">{detail}</p>
    </div>
  );
}

export default function FlowItemListPrototypePage() {
  const [view, setView] = useState<ViewMode>("list");
  const [stage, setStage] = useState<StageKey>("ALL");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ITEMS.filter((item) => {
      if (stage !== "ALL" && item.stage !== stage) return false;
      if (!q) return true;
      return [item.id, item.owner, item.party, item.purpose].some((value) => value.toLowerCase().includes(q));
    });
  }, [query, stage]);

  const counts = useMemo(() => ({
    ALL: ITEMS.length,
    REVIEW: ITEMS.filter((item) => item.stage === "REVIEW").length,
    SETTLED: ITEMS.filter((item) => item.stage === "SETTLED").length,
  }), []);
  const visibleIds = filtered.map((item) => item.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id));

  function toggleAll() {
    setSelected((current) =>
      allVisibleSelected
        ? current.filter((id) => !visibleIds.includes(id))
        : Array.from(new Set([...current, ...visibleIds])),
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-5 py-7 text-slate-900">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-700">UI test</span>
              <span className="text-xs text-slate-400">Dữ liệu giả · Không nối mutation</span>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight">Space Vận hành tuần 30</h1>
            <p className="mt-1 text-sm text-slate-500">Thử nghiệm List mới theo business item thay vì Workspace.</p>
          </div>
          <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold shadow-sm">
            <SlidersHorizontal className="h-4 w-4" /> Tùy chỉnh dashboard
          </button>
        </div>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MiniMetric label="Item trong flow" value="209" detail="19 cần xử lý · 190 đã xong" />
          <MiniMetric label="Tổng thu" value="4.800.000 VND" detail="Tuần này" tone="emerald" />
          <MiniMetric label="Tổng chi" value="1.757.600.000 VND" detail="Tuần này" tone="rose" />
          <MiniMetric label="Cần phản hồi" value="0" detail="Không có item bị chặn" tone="violet" />
        </section>

        <section className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-sky-50/80 to-violet-50/50 px-5 py-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold">Payment Collection</h2>
                  <span className="rounded-full border border-violet-200 bg-white px-2 py-0.5 text-[10px] font-bold text-violet-700">Core flow</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Board cho từng item · List cho thao tác hàng loạt</p>
              </div>
              <button className="ml-2 inline-flex h-10 min-w-44 items-center justify-between gap-3 rounded-xl border border-violet-200 bg-white px-3 text-xs font-semibold text-violet-800">
                Thanh toán <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            <div className="flex rounded-xl border border-slate-200 bg-white p-1 text-xs font-semibold shadow-sm">
              <button onClick={() => setView("board")} className={`inline-flex h-8 items-center gap-2 rounded-lg px-3 ${view === "board" ? "bg-slate-900 text-white" : "text-slate-500"}`}>
                <LayoutGrid className="h-3.5 w-3.5" /> Board
              </button>
              <button onClick={() => setView("list")} className={`inline-flex h-8 items-center gap-2 rounded-lg px-3 ${view === "list" ? "bg-violet-600 text-white" : "text-slate-500"}`}>
                <List className="h-3.5 w-3.5" /> List
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-3">
            <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold">
              Week 30/2026 <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <label className="flex h-10 min-w-64 flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm text-slate-400 focus-within:border-violet-300">
              <Search className="h-4 w-4" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent outline-none" placeholder="Tìm payment, phiếu, vendor..." />
              {query ? <button type="button" onClick={() => setQuery("")}><X className="h-3.5 w-3.5" /></button> : null}
            </label>
            <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold">
              <Filter className="h-3.5 w-3.5" /> Bộ lọc
            </button>
          </div>

          {view === "list" ? (
            <>
              <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-4">
                <div className="grid gap-2 md:grid-cols-[1fr_auto_1fr] md:items-center">
                  {STAGES.map((item, index) => (
                    <div key={item.key} className="contents">
                      <button
                        type="button"
                        onClick={() => setStage(item.key)}
                        className={`group flex min-w-0 items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${stage === item.key ? "border-violet-300 bg-white shadow-sm ring-2 ring-violet-100" : "border-slate-200 bg-white/60 hover:bg-white"}`}
                      >
                        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-bold ${stage === item.key ? "bg-violet-600 text-white" : item.key === "SETTLED" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                          {item.key === "SETTLED" ? <Check className="h-4 w-4" /> : counts[item.key]}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-bold">{item.label}</span>
                          <span className="mt-0.5 block truncate text-[10px] text-slate-400">{item.hint} · {counts[item.key]} item mẫu</span>
                        </span>
                      </button>
                      {index < STAGES.length - 1 ? <ArrowRight className="mx-1 hidden h-4 w-4 text-slate-300 md:block" /> : null}
                    </div>
                  ))}
                </div>
              </div>

              {selected.length ? (
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-violet-100 bg-violet-50 px-5 py-3">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="grid h-7 min-w-7 place-items-center rounded-lg bg-violet-600 px-2 font-bold text-white">{selected.length}</span>
                    <span className="font-semibold text-violet-900">item đã chọn</span>
                    <button onClick={() => setSelected([])} className="text-violet-600 hover:underline">Bỏ chọn</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-violet-200 bg-white px-3 text-xs font-semibold text-violet-800"><ArrowRight className="h-3.5 w-3.5" /> Chuyển bước</button>
                    <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-violet-200 bg-white px-3 text-xs font-semibold text-violet-800"><UserRound className="h-3.5 w-3.5" /> Giao người xử lý</button>
                    <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white"><Check className="h-3.5 w-3.5" /> Đánh dấu hoàn tất</button>
                  </div>
                </div>
              ) : null}

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1120px] border-collapse">
                  <thead className="bg-white text-left text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                    <tr>
                      <th className="w-12 px-5 py-3"><input type="checkbox" checked={allVisibleSelected} onChange={toggleAll} className="h-4 w-4 rounded border-slate-300 accent-violet-600" /></th>
                      <th className="min-w-64 px-3 py-3">Payment / đối tượng</th>
                      <th className="min-w-44 px-3 py-3">Bước hiện tại</th>
                      <th className="min-w-40 px-3 py-3">Đối tác</th>
                      <th className="px-3 py-3">Thu / Chi</th>
                      <th className="px-3 py-3 text-right">Giá trị</th>
                      <th className="px-3 py-3">Trạng thái</th>
                      <th className="px-3 py-3">Cập nhật</th>
                      <th className="w-16 px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item) => {
                      const checked = selected.includes(item.id);
                      return (
                        <tr key={item.id} className={`border-t border-slate-100 transition hover:bg-violet-50/30 ${checked ? "bg-violet-50/60" : ""}`}>
                          <td className="px-5 py-3"><input type="checkbox" checked={checked} onChange={() => setSelected((current) => checked ? current.filter((id) => id !== item.id) : [...current, item.id])} className="h-4 w-4 rounded border-slate-300 accent-violet-600" /></td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-3">
                              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-violet-100 bg-violet-50 text-violet-600"><WalletCards className="h-4 w-4" /></span>
                              <div><p className="text-xs font-bold text-slate-900">{item.id}</p><p className="mt-1 text-[11px] text-slate-400">{item.owner} · {item.purpose}</p></div>
                            </div>
                          </td>
                          <td className="px-3 py-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${item.stage === "REVIEW" ? "bg-amber-50 text-amber-700 ring-1 ring-amber-100" : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"}`}>{item.stage === "REVIEW" ? "Review" : "Settled / Exception"}</span></td>
                          <td className="px-3 py-3 text-xs font-semibold">{item.party}</td>
                          <td className="px-3 py-3"><span className={`inline-flex items-center gap-1.5 text-[11px] font-bold ${item.direction === "IN" ? "text-emerald-600" : "text-rose-600"}`}>{item.direction === "IN" ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}{item.direction}</span></td>
                          <td className="px-3 py-3 text-right text-xs font-bold tabular-nums">{money(item.amount)} <span className="font-medium text-slate-400">VND</span></td>
                          <td className="px-3 py-3"><span className={`text-[11px] font-bold ${item.status === "PAID" ? "text-emerald-600" : item.status === "CANCELED" ? "text-slate-400" : "text-amber-600"}`}>{item.status}</span></td>
                          <td className="px-3 py-3"><span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500"><Clock3 className="h-3.5 w-3.5 text-slate-300" />{item.updated}</span></td>
                          <td className="px-5 py-3 text-right"><button className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><MoreHorizontal className="h-4 w-4" /></button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {!filtered.length ? <div className="grid min-h-52 place-items-center text-sm text-slate-400">Không có item phù hợp bộ lọc.</div> : null}
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-[11px] text-slate-400"><span>Hiển thị {filtered.length} / {ITEMS.length} item mẫu</span><span>UI test · Bulk action chưa nối nghiệp vụ</span></div>
            </>
          ) : (
            <div className="p-5">
              <div className="grid gap-4 md:grid-cols-2">
                {["Payment Collection - Review", "Payment Collection - Settled / Exception"].map((title, index) => (
                  <div key={title} className="min-h-64 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between"><h3 className="text-sm font-bold">{title}</h3><span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-slate-500 shadow-sm">{index ? 190 : 19} item</span></div>
                    <div className="mt-4 space-y-2">
                      {ITEMS.filter((item) => item.stage === (index ? "SETTLED" : "REVIEW")).slice(0, 3).map((item) => (
                        <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"><p className="text-xs font-bold">{item.id}</p><p className="mt-1 text-[11px] text-slate-400">{item.party} · {money(item.amount)} VND</p></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-dashed border-violet-200 bg-violet-50/50 p-4 text-center text-xs text-violet-700">Board chỉ được mô phỏng để so sánh. Phạm vi prototype chính là List.</div>
            </div>
          )}
        </section>

        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
          <CircleDollarSign className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
          <p><strong className="text-slate-800">Giả thuyết cần kiểm chứng:</strong> người dùng hiểu flow qua thanh bước, nhưng table vẫn ưu tiên việc quét và chọn nhiều business item. Workspace không còn xuất hiện như một dòng dữ liệu trong List.</p>
        </div>
      </div>
    </main>
  );
}
