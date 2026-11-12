import Link from "next/link";
import type { ReactNode } from "react";
import { ADMIN_UI } from "@/domains/shared/ui/admin-design-contract";

export default function OrderPageHeader({ eyebrow = "BÁN HÀNG / ĐƠN HÀNG", title, description, backHref, backLabel = "← Danh sách", actions }: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
}) {
  return <header className="flex flex-wrap items-end justify-between gap-3">
    <div className="min-w-0">
      <p className={ADMIN_UI.eyebrow}>{eyebrow}</p>
      <h1 className={ADMIN_UI.pageTitle}>{title}</h1>
      {description && <div className={ADMIN_UI.pageDescription}>{description}</div>}
    </div>
    <div className="flex flex-wrap items-center gap-2">
      {backHref && <Link href={backHref} className="inline-flex h-8 items-center rounded-md px-2 text-xs text-slate-500 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200">{backLabel}</Link>}
      {actions}
    </div>
  </header>;
}
