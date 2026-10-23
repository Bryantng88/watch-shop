import {
  ClipboardCheck,
  CalendarDays,
  Images,
  ShoppingBag,
  Stethoscope,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type OperationalDomain = "order" | "purchase-request" | "media" | "technical" | "personal-work" | "general";

export type OperationalDomainPresentation = {
  domain: OperationalDomain;
  label: string;
  icon: LucideIcon;
  accentClassName: string;
  softClassName: string;
  actionClassName: string;
};

const DOMAINS: Record<OperationalDomain, OperationalDomainPresentation> = {
  order: { domain: "order", label: "Đơn hàng", icon: ShoppingBag, accentClassName: "bg-slate-950 text-white", softClassName: "bg-slate-100 text-slate-700", actionClassName: "bg-slate-200/70 text-slate-800 hover:bg-slate-200 focus-visible:ring-slate-300" },
  "purchase-request": { domain: "purchase-request", label: "Yêu cầu mua hàng", icon: ClipboardCheck, accentClassName: "bg-amber-500 text-white", softClassName: "bg-amber-50 text-amber-700", actionClassName: "bg-amber-100/70 text-amber-800 hover:bg-amber-100 focus-visible:ring-amber-200" },
  media: { domain: "media", label: "Media", icon: Images, accentClassName: "bg-violet-600 text-white", softClassName: "bg-violet-50 text-violet-700", actionClassName: "bg-violet-100/70 text-violet-800 hover:bg-violet-100 focus-visible:ring-violet-200" },
  technical: { domain: "technical", label: "Technical", icon: Stethoscope, accentClassName: "bg-blue-600 text-white", softClassName: "bg-blue-50 text-blue-700", actionClassName: "bg-blue-100/70 text-blue-800 hover:bg-blue-100 focus-visible:ring-blue-200" },
  "personal-work": { domain: "personal-work", label: "Việc cá nhân", icon: CalendarDays, accentClassName: "bg-slate-700 text-white", softClassName: "bg-slate-100 text-slate-700", actionClassName: "bg-slate-200/70 text-slate-800 hover:bg-slate-200 focus-visible:ring-slate-300" },
  general: { domain: "general", label: "Vận hành", icon: Workflow, accentClassName: "bg-slate-700 text-white", softClassName: "bg-slate-100 text-slate-700", actionClassName: "bg-slate-200/70 text-slate-800 hover:bg-slate-200 focus-visible:ring-slate-300" },
};

function resolveDomain(value?: string | null): OperationalDomain {
  const key = String(value ?? "").trim().toLowerCase();
  if (key.includes("purchase-request")) return "purchase-request";
  if (key.includes("media")) return "media";
  if (key.includes("technical") || key.includes("service")) return "technical";
  if (key.includes("personal")) return "personal-work";
  if (key.includes("order")) return "order";
  return "general";
}

export function operationalDomainPresentation(value?: string | null) {
  return DOMAINS[resolveDomain(value)];
}
