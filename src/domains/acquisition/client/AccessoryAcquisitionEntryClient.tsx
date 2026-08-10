"use client";

import { useEffect, useState } from "react";
import { Link2, ShieldCheck, X } from "lucide-react";
import type { AcquisitionFormVendor } from "./form/acquisition-form.types";
import StrapAcquisitionFormClient from "./StrapAcquisitionFormClient";
import ClaspAcquisitionFormClient from "./ClaspAcquisitionFormClient";
import { listStrapColorsAction } from "@/domains/strap/client/strap.actions";

type Kind = "strap" | "clasp";

export default function AccessoryAcquisitionEntryClient({
  vendors,
  strapColors: initialStrapColors = [],
  initialKind = "strap",
  onClose,
}: {
  vendors: AcquisitionFormVendor[];
  strapColors?: Array<{ id: string; code: string; name: string; colorHex: string | null }>;
  initialKind?: Kind;
  onClose?: () => void;
}) {
  const [kind, setKind] = useState<Kind>(initialKind);
  const [strapColors, setStrapColors] = useState(initialStrapColors);
  useEffect(() => {
    if (strapColors.length) return;
    void listStrapColorsAction().then(setStrapColors);
  }, [strapColors.length]);
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1500px] px-6 pt-6">
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-violet-100 bg-gradient-to-r from-white to-violet-50 p-4 shadow-sm">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-600">
              Phiếu nhập phụ kiện
            </div>
            <h1 className="mt-1 text-xl font-semibold text-slate-950">
              Chọn loại phụ kiện cần nhập
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="grid grid-cols-2 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setKind("strap")}
                className={`inline-flex min-w-36 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${kind === "strap" ? "bg-violet-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}
              >
                <Link2 className="h-4 w-4" /> Dây
              </button>
              <button
                type="button"
                onClick={() => setKind("clasp")}
                className={`inline-flex min-w-36 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${kind === "clasp" ? "bg-violet-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}
              >
                <ShieldCheck className="h-4 w-4" /> Khóa
              </button>
            </div>
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                aria-label="Đóng"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </section>
      </div>
      <div className={kind === "strap" ? "" : "hidden"}>
        <StrapAcquisitionFormClient
          vendors={vendors}
          colorOptions={strapColors}
          embedded
          onCreated={onClose}
        />
      </div>
      <div className={kind === "clasp" ? "" : "hidden"}>
        <ClaspAcquisitionFormClient
          vendors={vendors}
          embedded
          onCreated={onClose}
        />
      </div>
    </main>
  );
}
