import {
  CircleDollarSign,
  Clock3,
  GripVertical,
  Monitor,
  Zap,
} from "lucide-react";

type StageKey = "INSPECT" | "READY" | "PROCESSING" | "DONE";

type Card = {
  id: string;
  title: string;
  ref: string;
  product: string;
  area: "MOVEMENT" | "CASE" | "CRYSTAL" | "BRACELET" | "GENERAL";
  mode: "INTERNAL" | "VENDOR";
  status: string;
  priority?: "URGENT" | "NORMAL";
  cost?: string;
  time: string;
  updatedBy: {
    name: string;
    role: string;
    avatarTone: string;
  };
  imageTone: string;
};

const stages: Array<{ key: StageKey; title: string; hint: string; cards: Card[] }> = [
  {
    key: "INSPECT",
    title: "Kiểm tra",
    hint: "TI cần xác nhận hoặc phân loại.",
    cards: [
      {
        id: "ti-1",
        title: "làm lại mặt",
        ref: "SR-190726-000009",
        product: "Longines Automatic Cream/off-white Dial",
        area: "GENERAL",
        mode: "INTERNAL",
        status: "Inspect",
        priority: "URGENT",
        time: "21:00 19-07",
        updatedBy: {
          name: "Long",
          role: "Admin",
          avatarTone: "from-slate-800 to-slate-500",
        },
        cost: "Chưa có chi phí",
        imageTone: "from-amber-100 via-stone-200 to-slate-500",
      },
      {
        id: "ti-2",
        title: "kiểm dây thép",
        ref: "SR-190726-000008",
        product: "Omega constell tự động",
        area: "BRACELET",
        mode: "INTERNAL",
        status: "Inspect",
        time: "20:58 19-07",
        updatedBy: {
          name: "Mẫn",
          role: "Kỹ thuật",
          avatarTone: "from-teal-700 to-cyan-500",
        },
        cost: "Chưa có chi phí",
        imageTone: "from-zinc-100 via-stone-300 to-zinc-700",
      },
      {
        id: "ti-3",
        title: "thay kính",
        ref: "SR-190726-000006",
        product: "Seiko diver pin 36mm",
        area: "CRYSTAL",
        mode: "INTERNAL",
        status: "Inspect",
        time: "20:51 19-07",
        updatedBy: {
          name: "An",
          role: "Kỹ thuật",
          avatarTone: "from-blue-700 to-indigo-500",
        },
        cost: "Chưa có chi phí",
        imageTone: "from-sky-100 via-cyan-100 to-slate-500",
      },
    ],
  },
  {
    key: "READY",
    title: "Chờ xử lý",
    hint: "TI đã phân loại, chờ bắt đầu xử lý.",
    cards: [
      {
        id: "ti-4",
        title: "spa vỏ",
        ref: "SR-160726-000002",
        product: "Seiko LM",
        area: "CASE",
        mode: "VENDOR",
        status: "Ready",
        time: "19:27 16-07",
        updatedBy: {
          name: "Mẫn",
          role: "Vendor",
          avatarTone: "from-amber-700 to-orange-500",
        },
        cost: "Chưa có chi phí",
        imageTone: "from-blue-100 via-slate-200 to-slate-600",
      },
      {
        id: "ti-5",
        title: "Làm máy",
        ref: "SR-150726-000002",
        product: "Seiko LM vuông",
        area: "MOVEMENT",
        mode: "INTERNAL",
        status: "Ready",
        priority: "URGENT",
        time: "16:39 15-07",
        updatedBy: {
          name: "Long",
          role: "Admin",
          avatarTone: "from-slate-800 to-slate-500",
        },
        cost: "500.000đ",
        imageTone: "from-emerald-100 via-stone-200 to-slate-600",
      },
    ],
  },
  {
    key: "PROCESSING",
    title: "Xử lý",
    hint: "TI đang được kỹ thuật/vendor xử lý.",
    cards: [],
  },
  {
    key: "DONE",
    title: "Done",
    hint: "TI đã xong kỹ thuật hoặc theo dõi.",
    cards: [],
  },
];

export default function TiBoardCardV2PreviewPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-6 text-slate-950">
      <div className="mx-auto max-w-[1680px] space-y-5">
        <header className="rounded-xl border border-violet-200 bg-white px-5 py-4 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
            UI test
          </div>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-[-0.02em]">
                TI Board Card V2
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Prototype riêng: học pattern card/drag/column tốt từ board TI cũ,
                nhưng không dùng lại data flow hoặc route cũ.
              </p>
            </div>
            <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
              /admin/ui-test/ti-board-card-v2
            </div>
          </div>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 text-sm text-slate-600 lg:grid-cols-4">
            <Principle title="Accent theo nhóm kỹ thuật" text="Top bar lấy màu theo Movement, Case, Crystal, Bracelet." />
            <Principle title="Priority không phá layout" text="Gấp là ribbon chéo nhỏ, không đẩy nội dung." />
            <Principle title="Drag cảm giác thật hơn" text="Card mẫu có trạng thái nghiêng nhẹ, shadow lớn, ghost opacity." />
            <Principle title="Giữ board mới làm source" text="Preview này chỉ là UI pattern, chưa nối action/workflow." />
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-4">
          {stages.map((stage) => (
            <BoardColumn key={stage.key} stage={stage} />
          ))}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold">Drag state sample</h2>
          <p className="mt-1 text-xs text-slate-500">
            Đây là cảm giác khi đang kéo: nghiêng nhẹ, nổi shadow, card gốc có thể opacity 0.
          </p>
          <div className="mt-4 max-w-[390px]">
            <TiCard card={stages[1].cards[0]} dragging />
          </div>
        </section>
      </div>
    </main>
  );
}

function Principle({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
      <div className="font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-xs leading-5">{text}</div>
    </div>
  );
}

function BoardColumn({
  stage,
}: {
  stage: { key: StageKey; title: string; hint: string; cards: Card[] };
}) {
  const style = columnStyle(stage.key);
  const urgentCount = stage.cards.filter((card) => card.priority === "URGENT").length;

  return (
    <div className={`min-h-[560px] rounded-xl border p-3 transition ${style.wrap}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className={`text-sm font-semibold ${style.title}`}>{stage.title}</div>
          <div className="mt-1 text-xs leading-5 text-slate-500">{stage.hint}</div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {urgentCount ? (
            <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700">
              {urgentCount} gấp
            </span>
          ) : null}
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${style.badge}`}>
            {stage.cards.length}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {stage.cards.length ? (
          stage.cards.map((card) => <TiCard key={card.id} card={card} />)
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 px-3 py-9 text-center text-sm text-slate-400">
            Kéo TI vào đây.
          </div>
        )}
      </div>
    </div>
  );
}

function TiCard({ card, dragging = false }: { card: Card; dragging?: boolean }) {
  const accent = areaAccent(card.area);
  const urgent = card.priority === "URGENT";

  return (
    <article
      className={[
        "relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition",
        "hover:border-violet-200 hover:shadow-md",
        dragging ? "rotate-[1.5deg] shadow-xl ring-2 ring-violet-200" : "",
      ].join(" ")}
    >
      <div className={`h-1.5 ${accent.bar}`} />
      {urgent ? <UrgentRibbon /> : null}

      <div className={`border-b px-3 py-2.5 ${accent.headerBg} ${accent.headerBorder}`}>
        <div className="flex items-start justify-between gap-3">
          <div className={urgent ? "min-w-0 pl-4" : "min-w-0"}>
            <div className="line-clamp-1 text-sm font-semibold text-slate-950">
              {card.title}
            </div>
            <div className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">
              {areaLabel(card.area)} · {card.product}
            </div>
          </div>
          <button
            type="button"
            className="grid h-7 w-7 shrink-0 cursor-grab place-items-center rounded-md border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 active:cursor-grabbing"
            aria-label="Kéo TI"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3 p-3">
        <div className="flex items-start gap-3">
          <div className={`h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${card.imageTone}`}>
            <Monitor className="m-3 h-6 w-6 text-white/70" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-medium text-blue-700">{card.ref}</div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <Chip className={accent.chip}>{areaLabel(card.area)}</Chip>
              <Chip>{card.mode === "VENDOR" ? "Vendor" : "Nội bộ"}</Chip>
              <Chip blue>{card.status}</Chip>
            </div>
          </div>
          <button
            type="button"
            className={[
              "grid h-7 w-7 shrink-0 place-items-center rounded-md border bg-white transition",
              urgent ? "border-rose-200 text-rose-600" : "border-slate-200 text-slate-400",
            ].join(" ")}
            aria-label="Đánh dấu gấp"
          >
            <Zap className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock3 className="h-3.5 w-3.5" />
              Cập nhật
            </div>
            <div className="mt-1 font-semibold text-slate-800">{card.time}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
            <div className="flex items-center gap-1.5 text-slate-400">
              <CircleDollarSign className="h-3.5 w-3.5" />
              Chi phí
            </div>
            <div className="mt-1 font-semibold text-slate-800">{card.cost ?? "-"}</div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <div className="flex min-w-0 items-center gap-2">
            <div
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br ${card.updatedBy.avatarTone} text-[10px] font-bold text-white shadow-sm`}
            >
              {initials(card.updatedBy.name)}
            </div>
            <div className="min-w-0">
              <div className="truncate text-xs font-semibold text-slate-800">
                {card.updatedBy.name}
              </div>
              <div className="truncate text-[10px] text-slate-400">
                {card.updatedBy.role}
              </div>
            </div>
          </div>
          <div className="shrink-0 text-[10px] font-medium text-slate-400">
            cập nhật gần nhất
          </div>
        </div>
      </div>
    </article>
  );
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "U";
}

function UrgentRibbon() {
  return (
    <div className="pointer-events-none absolute -left-8 top-3 z-10 w-24 -rotate-45 bg-rose-500/70 py-0.5 text-center text-[9px] font-black uppercase tracking-wide text-white/85 shadow-sm">
      Gấp
    </div>
  );
}

function Chip({
  children,
  className = "border-slate-200 bg-slate-50 text-slate-700",
  blue,
}: {
  children: React.ReactNode;
  className?: string;
  blue?: boolean;
}) {
  return (
    <span
      className={[
        "rounded-full border px-2 py-0.5 text-[11px] font-medium",
        blue ? "border-blue-100 bg-blue-50 text-blue-700" : className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function columnStyle(stage: StageKey) {
  if (stage === "INSPECT") {
    return {
      wrap: "border-slate-200 bg-white",
      title: "text-amber-800",
      badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
    };
  }
  if (stage === "READY") {
    return {
      wrap: "border-slate-200 bg-white",
      title: "text-sky-800",
      badge: "bg-sky-50 text-sky-700 ring-1 ring-sky-100",
    };
  }
  if (stage === "PROCESSING") {
    return {
      wrap: "border-slate-200 bg-white",
      title: "text-violet-800",
      badge: "bg-violet-50 text-violet-700 ring-1 ring-violet-100",
    };
  }
  return {
    wrap: "border-slate-200 bg-white",
    title: "text-emerald-800",
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  };
}

function areaAccent(area: Card["area"]) {
  if (area === "MOVEMENT") {
    return {
      bar: "bg-blue-500",
      headerBg: "bg-blue-50",
      headerBorder: "border-blue-100",
      chip: "border-blue-100 bg-blue-50 text-blue-700",
    };
  }
  if (area === "CASE") {
    return {
      bar: "bg-cyan-500",
      headerBg: "bg-cyan-50",
      headerBorder: "border-cyan-100",
      chip: "border-cyan-100 bg-cyan-50 text-cyan-700",
    };
  }
  if (area === "CRYSTAL") {
    return {
      bar: "bg-indigo-500",
      headerBg: "bg-indigo-50",
      headerBorder: "border-indigo-100",
      chip: "border-indigo-100 bg-indigo-50 text-indigo-700",
    };
  }
  if (area === "BRACELET") {
    return {
      bar: "bg-teal-500",
      headerBg: "bg-teal-50",
      headerBorder: "border-teal-100",
      chip: "border-teal-100 bg-teal-50 text-teal-700",
    };
  }
  return {
    bar: "bg-slate-400",
    headerBg: "bg-slate-50",
    headerBorder: "border-slate-100",
    chip: "border-slate-200 bg-slate-50 text-slate-700",
  };
}

function areaLabel(area: Card["area"]) {
  if (area === "MOVEMENT") return "Máy";
  if (area === "CASE") return "Vỏ";
  if (area === "CRYSTAL") return "Kính";
  if (area === "BRACELET") return "Dây";
  return "Tổng quát";
}
