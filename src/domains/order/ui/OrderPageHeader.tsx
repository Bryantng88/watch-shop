import Link from "next/link";
import type { ReactNode } from "react";

export default function OrderPageHeader({
  eyebrow = "Order domain",
  title,
  description,
  backHref,
  backLabel = "← Quay lại",
  actions,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-3">
          {backHref ? (
            <Link href={backHref} className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50">
              {backLabel}
            </Link>
          ) : null}
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{eyebrow}</div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-[30px]">{title}</h1>
            {description ? <div className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{description}</div> : null}
          </div>
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
