import { AlertTriangle, GripVertical, Zap } from "lucide-react";

const sampleCards = [
  {
    title: "spa vỏ",
    ref: "SR-170726-000009",
    watch: "Seiko model unknown movement",
    time: "22:41 17-07",
    urgent: true,
    imageTone: "from-sky-200 via-slate-100 to-slate-500",
  },
  {
    title: "làm lại mặt",
    ref: "SR-190726-000009",
    watch: "Longines Automatic Cream/off-white Dial",
    time: "21:00 19-07",
    urgent: false,
    imageTone: "from-amber-100 via-stone-200 to-slate-500",
  },
  {
    title: "kiểm dây thép",
    ref: "SR-190726-000008",
    watch: "Omega constell tự động",
    time: "20:58 19-07",
    urgent: false,
    imageTone: "from-zinc-100 via-stone-300 to-zinc-700",
  },
];

const variants = [
  {
    key: "corner",
    title: "Option A: tam giác góc",
    note: "Đề xuất chính. Nhỏ, không chiếm dòng, nhìn thấy ngay mà không phá layout.",
    render: CornerTriangleTag,
  },
  {
    key: "fold",
    title: "Option B: góc gấp giấy",
    note: "Tinh tế hơn, hợp nếu muốn card sạch và ít đỏ.",
    render: FoldedCornerTag,
  },
  {
    key: "ribbon",
    title: "Option C: ribbon chéo",
    note: "Nổi bật nhất, nhưng dễ hơi ồn nếu nhiều item gấp.",
    render: RibbonTriangleTag,
  },
] as const;

export default function TiPriorityTagPreviewPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-6 text-slate-950">
      <div className="mx-auto max-w-[1380px] space-y-5">
        <header className="rounded-xl border border-violet-200 bg-white px-5 py-4 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
            UI test
          </div>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-[-0.02em]">
                TI priority tag proposal
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Preview riêng cho tag tam giác ưu tiên. Chưa tác động vào board thật.
              </p>
            </div>
            <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
              URL: /admin/ui-test/ti-priority-tag
            </div>
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-3">
          {variants.map((variant) => {
            const Tag = variant.render;
            return (
              <div key={variant.key} className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-4 py-3">
                  <h2 className="text-sm font-semibold">{variant.title}</h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{variant.note}</p>
                </div>
                <div className="space-y-3 p-4">
                  {sampleCards.map((card) => (
                    <TechnicalIssueCard key={`${variant.key}-${card.ref}`} card={card} Tag={Tag} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold">Đề xuất của mình</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Chọn Option A. Tag tam giác nằm ở góc trái trên, không đẩy nội dung xuống,
            đủ rõ khi scan board, và vẫn giữ nút tia sét bên phải để bật/tắt ưu tiên.
            Option C chỉ nên dùng nếu sau này cần cảnh báo cực mạnh.
          </p>
        </section>
      </div>
    </main>
  );
}

function TechnicalIssueCard({
  card,
  Tag,
}: {
  card: typeof sampleCards[number];
  Tag: React.ComponentType<{ show: boolean }>;
}) {
  return (
    <article
      className={[
        "relative overflow-hidden rounded-lg border bg-white p-3 shadow-sm transition",
        card.urgent
          ? "border-violet-200 ring-1 ring-violet-100"
          : "border-slate-200 hover:border-violet-200",
      ].join(" ")}
    >
      <Tag show={card.urgent} />
      <div className="flex items-start gap-3">
        <div className={`h-12 w-12 shrink-0 rounded-md bg-gradient-to-br ${card.imageTone}`} />
        <div className="min-w-0 flex-1">
          <div className="line-clamp-2 text-sm font-semibold">{card.title}</div>
          <div className="mt-1 truncate text-xs text-slate-500">
            {card.ref} · {card.watch}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge>Tổng quát</Badge>
            <Badge active>Inspect</Badge>
            <Badge violet>Nội bộ</Badge>
          </div>
          <div className="mt-3 text-xs text-slate-600">{card.time}</div>
          <div className="mt-0.5 text-xs font-semibold">Chưa có chi phí</div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            className={[
              "grid h-7 w-7 place-items-center rounded-md border bg-white transition",
              card.urgent
                ? "border-rose-200 text-rose-600"
                : "border-slate-200 text-slate-400",
            ].join(" ")}
            aria-label="Đánh dấu gấp"
          >
            <Zap className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="grid h-7 w-7 place-items-center rounded-md border border-slate-200 bg-white text-slate-400"
            aria-label="Kéo TI"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

function CornerTriangleTag({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="absolute left-0 top-0 h-0 w-0 border-l-[34px] border-t-[34px] border-l-rose-600 border-t-rose-600 border-r-[34px] border-r-transparent border-b-[34px] border-b-transparent">
      <AlertTriangle className="absolute -left-[30px] -top-[31px] h-3.5 w-3.5 text-white" />
    </div>
  );
}

function FoldedCornerTag({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="absolute left-0 top-0 h-10 w-10 overflow-hidden">
      <div className="absolute left-0 top-0 h-0 w-0 border-l-[40px] border-t-[40px] border-l-rose-500 border-t-rose-500 border-r-[40px] border-r-transparent border-b-[40px] border-b-transparent" />
      <div className="absolute left-[3px] top-[3px] text-[9px] font-black uppercase leading-none text-white">
        Gấp
      </div>
    </div>
  );
}

function RibbonTriangleTag({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="pointer-events-none absolute -left-7 top-3 w-24 -rotate-45 bg-rose-600 py-0.5 text-center text-[9px] font-black uppercase tracking-wide text-white shadow-sm">
      Gấp
    </div>
  );
}

function Badge({
  children,
  active,
  violet,
}: {
  children: React.ReactNode;
  active?: boolean;
  violet?: boolean;
}) {
  return (
    <span
      className={[
        "rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1",
        active
          ? "bg-blue-50 text-blue-700 ring-blue-100"
          : violet
            ? "bg-violet-50 text-violet-700 ring-violet-100"
            : "bg-slate-50 text-slate-600 ring-slate-200",
      ].join(" ")}
    >
      {children}
    </span>
  );
}
