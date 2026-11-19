import type { ReactNode } from "react";
import { AlertCircle, Info } from "lucide-react";

/** Persistent, actionable feedback near the affected region; never a success toast. */
export function PageNotice({ tone = "error", title, children, action }: {
  tone?: "error" | "info";
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  const Icon = tone === "error" ? AlertCircle : Info;
  return <section role={tone === "error" ? "alert" : "status"}
    className={`flex min-w-0 flex-wrap items-start gap-3 rounded-lg px-4 py-3 ${tone === "error" ? "bg-rose-50 text-rose-800" : "bg-blue-50 text-blue-800"}`}>
    <Icon className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
    <div className="min-w-0 flex-1"><p className="m-0 text-sm font-semibold leading-5">{title}</p>
      {children && <div className="mt-1 break-words text-sm leading-5">{children}</div>}
    </div>
    {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
  </section>;
}

/** Ongoing editing state only; success is announced once by the shared toast. */
export function PageEditingState({ dirty, saving = false, uploading = false }: {
  dirty: boolean; saving?: boolean; uploading?: boolean;
}) {
  if (!dirty && !saving && !uploading) return null;
  return <span role="status" aria-live="polite" className="text-xs leading-4 text-slate-500">
    {uploading ? "Đang tải ảnh…" : saving ? "Đang lưu…" : dirty ? "Có thay đổi chưa lưu" : null}
  </span>;
}
