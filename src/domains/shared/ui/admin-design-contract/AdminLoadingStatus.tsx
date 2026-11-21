import { Loader2 } from "lucide-react";

/** Quiet inline feedback; never adds a separate panel or shifts the page shell. */
export function AdminLoadingStatus({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span role="status" aria-live="polite" className={`inline-flex items-center gap-2 text-sm text-slate-500 ${className}`}>
    <Loader2 className="h-4 w-4 shrink-0 animate-spin motion-reduce:animate-none text-slate-400" aria-hidden="true" />
    {children}
  </span>;
}
