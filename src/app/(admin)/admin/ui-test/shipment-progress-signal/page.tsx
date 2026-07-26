import {
  Ban,
  Check,
  Package,
  PackageX,
  RotateCcw,
  Truck,
} from "lucide-react";

type ShipmentPreviewStatus =
  | "NO_SHIPMENT"
  | "WAITING"
  | "SHIPPING"
  | "DELIVERED"
  | "RETURNING"
  | "RETURNED"
  | "CANCELLED";

const samples: Array<{
  order: string;
  customer: string;
  amount: string;
  status: ShipmentPreviewStatus;
  note: string;
}> = [
  { order: "OD-240726-000001", customer: "Nguyễn Hữu Nhân", amount: "8.800.000 VND", status: "NO_SHIPMENT", note: "Khách nhận tại cửa hàng" },
  { order: "OD-230726-000004", customer: "Sĩ Tuyền Phạm Tiến", amount: "900.000 VND", status: "WAITING", note: "Chờ bàn giao đơn vị vận chuyển" },
  { order: "OD-210726-000003", customer: "On Gia Bảo", amount: "1.800.000 VND", status: "SHIPPING", note: "Đang giao · GHTK" },
  { order: "OD-210726-000002", customer: "Nguyễn Đức Tâm", amount: "3.000.000 VND", status: "DELIVERED", note: "Đã giao lúc 15:43" },
  { order: "OD-190726-000003", customer: "Mẫn", amount: "24.000.000 VND", status: "RETURNING", note: "Đang chuyển hoàn" },
  { order: "OD-180726-000002", customer: "Thái Anh", amount: "2.000.000 VND", status: "RETURNED", note: "Đã nhận hàng hoàn" },
  { order: "OD-170726-000007", customer: "Khôi", amount: "18.000.000 VND", status: "CANCELLED", note: "Shipment đã hủy" },
];

const stages = [
  { key: "WAITING", icon: Package, label: "Chờ giao" },
  { key: "SHIPPING", icon: Truck, label: "Đang giao" },
  { key: "DELIVERED", icon: Check, label: "Đã giao" },
] as const;

function ShipmentProgressSignal({
  status,
}: {
  status: ShipmentPreviewStatus;
}) {
  if (status === "NO_SHIPMENT") {
    return (
      <span
        title="Không giao hàng"
        className="grid h-6 w-6 place-items-center rounded-md border border-slate-200 bg-slate-50 text-slate-400"
      >
        <PackageX className="h-3.5 w-3.5" strokeWidth={1.7} />
      </span>
    );
  }

  if (status === "CANCELLED") {
    return (
      <span
        title="Shipment đã hủy"
        className="grid h-6 w-6 place-items-center rounded-md border border-rose-100 bg-rose-50 text-rose-500"
      >
        <Ban className="h-3.5 w-3.5" strokeWidth={1.7} />
      </span>
    );
  }

  if (status === "RETURNING" || status === "RETURNED") {
    const returned = status === "RETURNED";
    return (
      <div className="inline-flex items-center gap-1.5" title={returned ? "Đã nhận hàng hoàn" : "Đang chuyển hoàn"}>
        <span className={`grid h-6 w-6 place-items-center rounded-md border ${
          returned
            ? "border-amber-200 bg-amber-50 text-amber-600"
            : "border-violet-100 bg-violet-50 text-violet-600"
        }`}>
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.7} />
        </span>
        <span className="text-[11px] font-semibold text-slate-500">
          {returned ? "Đã hoàn" : "Đang hoàn"}
        </span>
      </div>
    );
  }

  const activeIndex =
    status === "DELIVERED" ? 2 : status === "SHIPPING" ? 1 : 0;

  return (
    <div className="inline-flex items-center" aria-label={stages[activeIndex].label}>
      {stages.map((stage, index) => {
        const Icon = stage.icon;
        const completed = index < activeIndex || status === "DELIVERED";
        const active = index === activeIndex && status !== "DELIVERED";
        return (
          <div key={stage.key} className="flex items-center">
            {index > 0 ? (
              <span
                className={`h-px w-5 ${
                  index <= activeIndex ? "bg-emerald-300" : "bg-slate-200"
                }`}
              />
            ) : null}
            <span
              title={stage.label}
              className={[
                "grid h-6 w-6 place-items-center rounded-md border transition-colors",
                completed
                  ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                  : active
                    ? "border-violet-200 bg-violet-50 text-violet-600 shadow-[0_1px_3px_rgba(124,58,237,0.08)]"
                    : "border-slate-200 bg-slate-50 text-slate-300",
              ].join(" ")}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={1.7} />
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ShipmentJourneyCapsule({
  status,
}: {
  status: ShipmentPreviewStatus;
}) {
  if (status === "NO_SHIPMENT") {
    return (
      <span className="inline-flex h-8 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 text-[11px] font-semibold text-slate-500">
        <PackageX className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.7} />
        Không giao hàng
      </span>
    );
  }

  if (status === "CANCELLED") {
    return (
      <span className="inline-flex h-8 items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-2.5 text-[11px] font-semibold text-rose-600">
        <Ban className="h-3.5 w-3.5" strokeWidth={1.7} />
        Đã hủy shipment
      </span>
    );
  }

  if (status === "RETURNING" || status === "RETURNED") {
    const returned = status === "RETURNED";
    return (
      <span className="inline-flex h-8 items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-2.5 text-[11px] font-semibold text-amber-700">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-amber-600 ring-1 ring-amber-200">
          {returned
            ? <Check className="h-3 w-3" strokeWidth={2} />
            : <RotateCcw className="h-3 w-3" strokeWidth={1.8} />}
        </span>
        {returned ? "Đã nhận hàng hoàn" : "Đang chuyển hoàn"}
      </span>
    );
  }

  const activeIndex =
    status === "DELIVERED" ? 2 : status === "SHIPPING" ? 1 : 0;

  return (
    <div className="inline-flex h-8 items-center rounded-full border border-slate-200 bg-slate-50/80 p-1 shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)]">
      {stages.map((stage, index) => {
        const Icon = stage.icon;
        const completed = index < activeIndex;
        const active = index === activeIndex;
        return (
          <div key={stage.key} className="flex items-center">
            {index > 0 ? (
              <span className={`h-px w-2 ${index <= activeIndex ? "bg-emerald-300" : "bg-slate-200"}`} />
            ) : null}
            {active ? (
              <span className={`inline-flex h-6 items-center gap-1.5 rounded-full px-2 text-[10px] font-bold ${
                status === "DELIVERED"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-violet-100 text-violet-700"
              }`}>
                <Icon className="h-3 w-3" strokeWidth={1.9} />
                {stage.label}
              </span>
            ) : completed ? (
              <span
                title={stage.label}
                className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-emerald-600 ring-1 ring-inset ring-emerald-200"
              >
                <Check className="h-2.5 w-2.5" strokeWidth={2.2} />
              </span>
            ) : (
              <span
                title={stage.label}
                className="grid h-5 w-5 place-items-center rounded-full text-slate-300"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ShipmentLiveRoute({
  status,
}: {
  status: ShipmentPreviewStatus;
}) {
  if (!["WAITING", "SHIPPING", "DELIVERED"].includes(status)) {
    return <ShipmentJourneyCapsule status={status} />;
  }

  const delivered = status === "DELIVERED";
  const shipping = status === "SHIPPING";
  const MarkerIcon = delivered ? Check : shipping ? Truck : Package;
  const label = delivered ? "Đã đến nơi" : shipping ? "Đang trên đường" : "Chờ xuất phát";

  return (
    <div className="inline-flex flex-col">
      <div className="relative h-8 w-36">
        <div className="absolute inset-x-2 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-slate-200">
          <div
            className={[
              "h-full rounded-full bg-gradient-to-r from-violet-300 to-emerald-300 transition-[width]",
              delivered ? "w-full" : shipping ? "w-1/2" : "w-0",
            ].join(" ")}
          />
        </div>
        <span className="absolute left-1.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-white bg-violet-300 ring-1 ring-violet-200" />
        <span className={`absolute right-1.5 top-1/2 grid h-3.5 w-3.5 -translate-y-1/2 place-items-center rounded-full border-2 border-white ring-1 ${
          delivered
            ? "bg-emerald-400 ring-emerald-200"
            : "bg-slate-200 ring-slate-200"
        }`}>
          {delivered ? <Check className="h-2 w-2 text-white" strokeWidth={2.4} /> : null}
        </span>
        <span
          className={[
            "absolute top-1/2 z-10 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full border-2 border-white shadow-[0_3px_9px_rgba(15,23,42,0.14)] transition-all",
            delivered
              ? "right-0.5 bg-emerald-500 text-white"
              : shipping
                ? "left-1/2 -translate-x-1/2 bg-violet-600 text-white"
                : "left-0.5 bg-violet-100 text-violet-700",
          ].join(" ")}
        >
          <MarkerIcon className="h-3.5 w-3.5" strokeWidth={1.9} />
        </span>
      </div>
      <div className={`mt-0.5 text-center text-[10px] font-semibold ${
        delivered ? "text-emerald-600" : "text-violet-600"
      }`}>
        {label}
      </div>
    </div>
  );
}

export default function ShipmentProgressSignalPreviewPage() {
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
                Shipment Progress Signal
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Prototype độc lập cho cột Giao hàng. Chưa áp dụng vào danh sách đơn hàng thật.
              </p>
            </div>
            <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
              /admin/ui-test/shipment-progress-signal
            </div>
          </div>
        </header>

        <section className="grid gap-3 md:grid-cols-3">
          <Principle title="Cùng ngôn ngữ icon" text="Node 24px, nền mềm, viền mảnh và nét icon 1.7 như bộ trạng thái hiện tại." />
          <Principle title="Vẫn đọc được tiến trình" text="Đường nối chỉ chuyển màu ở phần đã đi qua; bước hiện tại dùng tím, bước hoàn tất dùng xanh." />
          <Principle title="Không biểu đạt sai" text="Không shipment, chuyển hoàn và hủy có tín hiệu riêng; không giả làm trạng thái đã giao." />
        </section>

        <section className="rounded-xl border border-violet-200 bg-gradient-to-br from-white to-violet-50/40 p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-600">
                Đề xuất mới
              </div>
              <h2 className="mt-1 text-base font-semibold">Journey Capsule</h2>
              <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">
                Bước hiện tại mở rộng thành nhãn; bước đã qua thu thành checkpoint; bước sắp tới lùi thành chấm mờ.
                Nhìn được trạng thái ngay nhưng chiều ngang vẫn thay đổi rất ít.
              </p>
            </div>
            <span className="rounded-full border border-violet-100 bg-white px-3 py-1.5 text-[10px] font-bold text-violet-600">
              Recommended
            </span>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {samples.slice(0, 4).map((sample) => (
              <div key={`capsule-${sample.order}`} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  {sample.status.replaceAll("_", " ")}
                </div>
                <div className="mt-3">
                  <ShipmentJourneyCapsule status={sample.status} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-900 bg-slate-950 text-white shadow-[0_14px_36px_rgba(15,23,42,0.14)]">
          <div className="grid gap-6 p-5 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.5fr)] lg:items-center">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-300">
                Experimental
              </div>
              <h2 className="mt-2 text-lg font-semibold">Live Route Signal</h2>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Không lặp ba icon. Một marker duy nhất di chuyển từ điểm xuất phát đến điểm nhận,
                tạo cảm giác shipment thực sự đang đi trên một tuyến đường.
              </p>
              <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold text-slate-300">
                Vị trí = tiến độ · Icon = trạng thái
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {(["WAITING", "SHIPPING", "DELIVERED"] as const).map((status) => (
                <div key={`route-${status}`} className="rounded-xl border border-white/10 bg-white p-4 text-slate-950">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    {status}
                  </div>
                  <div className="mt-4 flex min-h-12 items-center justify-center">
                    <ShipmentLiveRoute status={status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold">Preview trong ngữ cảnh bảng đơn hàng</h2>
            <p className="mt-1 text-xs text-slate-500">Di chuột lên từng node để xem tên bước.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] table-fixed text-sm">
              <colgroup>
                <col className="w-[34%]" />
                <col className="w-[22%]" />
                <col className="w-[24%]" />
                <col className="w-[20%]" />
              </colgroup>
              <thead className="bg-slate-50/80 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-5 py-3">Đơn hàng</th>
                  <th className="px-5 py-3">Khách hàng</th>
                  <th className="px-5 py-3">Giao hàng</th>
                  <th className="px-5 py-3 text-right">Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                {samples.map((sample) => (
                  <tr key={sample.order} className="border-t border-slate-100 hover:bg-slate-50/40">
                    <td className="px-5 py-4">
                      <div className="font-semibold">{sample.order}</div>
                      <div className="mt-1 text-xs text-slate-400">{sample.note}</div>
                    </td>
                    <td className="px-5 py-4 font-medium">{sample.customer}</td>
                    <td className="px-5 py-4">
                      <ShipmentJourneyCapsule status={sample.status} />
                    </td>
                    <td className="px-5 py-4 text-right font-semibold">{sample.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Phương án nền
            </div>
            <h2 className="mt-1 text-sm font-semibold">Classic Progress Rail</h2>
            <p className="mt-1 text-xs text-slate-500">
              Giữ lại để so sánh trực tiếp với Journey Capsule, chưa áp dụng vào production.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-6">
            {(["WAITING", "SHIPPING", "DELIVERED"] as const).map((status) => (
              <div key={status} className="space-y-2">
                <div className="text-[10px] font-semibold text-slate-400">{status}</div>
                <ShipmentProgressSignal status={status} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Principle({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-xs font-bold text-slate-800">{title}</h2>
      <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
    </article>
  );
}
