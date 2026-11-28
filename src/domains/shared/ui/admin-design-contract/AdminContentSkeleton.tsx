/** Initial content only. Refresh keeps real content and uses one inline status. */
export function AdminContentSkeleton({ label = "Đang tải nội dung…", variant = "detail" }: { label?: string; variant?: "detail" | "form" | "list" }) {
  return <div role="status" aria-live="polite" aria-busy="true" data-admin-skeleton={variant} className="w-full py-3">
    <span className="sr-only">{label}</span>
    <div aria-hidden="true" className="space-y-4 animate-pulse motion-reduce:animate-none">
      {variant === "list" ? Array.from({ length: 3 }, (_, i) => <div key={i} className="flex items-center gap-3 py-2"><div className="h-12 w-12 shrink-0 rounded-lg bg-slate-100"/><div className="flex-1 space-y-2"><div className="h-3 w-2/3 rounded bg-slate-100"/><div className="h-2 w-1/3 rounded bg-slate-100"/></div></div>) : <>
        <div className="flex items-center gap-3"><div className="h-12 w-12 shrink-0 rounded-lg bg-slate-100"/><div className="flex-1 space-y-2"><div className="h-4 w-2/3 rounded bg-slate-100"/><div className="h-3 w-1/3 rounded bg-slate-100"/></div></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{Array.from({ length: variant === "form" ? 4 : 2 }, (_, i) => <div key={i} className="space-y-2"><div className="h-2 w-1/4 rounded bg-slate-100"/><div className="h-10 rounded-lg bg-slate-100"/></div>)}</div>
        <div className="space-y-2"><div className="h-2 w-1/4 rounded bg-slate-100"/><div className="h-20 rounded-lg bg-slate-100"/></div>
      </>}
    </div>
  </div>;
}
