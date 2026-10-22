export const ADMIN_UI = {
  page: "min-h-screen bg-white px-6 py-5",
  pageFlow: "space-y-4",
  eyebrow: "text-xs font-semibold uppercase tracking-[0.18em] text-blue-600",
  pageTitle: "mt-1 text-2xl font-bold text-slate-950",
  pageDescription: "mt-1 text-sm text-slate-500",
  sectionTitle: "text-sm font-bold text-slate-950",
  sectionDescription: "mt-0.5 text-xs text-slate-500",
  rowTitle: "text-sm font-semibold text-slate-900",
  metadata: "text-xs text-slate-500",
  metricValue: "font-bold tabular-nums text-slate-950",
  toolbar: "rounded-xl border border-slate-200/80 bg-slate-50/60 p-2",
  flatSurface: "rounded-xl bg-slate-50/70",
  raisedSurface: "rounded-xl bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_7px_20px_rgba(15,23,42,0.035)]",
  divider: "border-slate-100",
  row: "transition-colors hover:bg-violet-50/70",
  interactiveSurface: "transition-colors hover:bg-violet-50/70 focus-visible:bg-violet-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-200/80",
  modal: "rounded-2xl bg-white p-5 shadow-2xl shadow-slate-950/15",
  primaryAction: "rounded-lg bg-slate-950 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50",
  secondaryAction: "rounded-lg font-semibold text-slate-600 transition hover:bg-slate-100",
  compactAction: "h-8 rounded-lg px-3 text-xs font-semibold transition",
  statusBadge: "inline-flex items-center rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide",
  input: "rounded-lg border border-slate-200 bg-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100",
} as const;

export const ADMIN_DOMAIN_TONE = {
  GENERAL: { soft: "bg-slate-100 text-slate-700", dot: "bg-slate-500" },
  WORK: { soft: "bg-indigo-50 text-indigo-700", dot: "bg-indigo-500" },
  MEDIA: { soft: "bg-violet-50 text-violet-700", dot: "bg-violet-500" },
  TECHNICAL: { soft: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  SALES: { soft: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  ORDER: { soft: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  ACQUISITION: { soft: "bg-rose-50 text-rose-700", dot: "bg-rose-500" },
} as const;

export type AdminDomainTone = keyof typeof ADMIN_DOMAIN_TONE;
