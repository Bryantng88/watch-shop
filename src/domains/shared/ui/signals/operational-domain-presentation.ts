import {
  ClipboardCheck,
  Images,
  ShoppingBag,
  Stethoscope,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type OperationalDomain = "order" | "purchase-request" | "media" | "technical" | "general";

export type OperationalDomainPresentation = {
  domain: OperationalDomain;
  label: string;
  icon: LucideIcon;
  accentClassName: string;
  softClassName: string;
};

const DOMAINS: Record<OperationalDomain, OperationalDomainPresentation> = {
  order: { domain: "order", label: "Đơn hàng", icon: ShoppingBag, accentClassName: "bg-slate-950 text-white", softClassName: "bg-slate-100 text-slate-700" },
  "purchase-request": { domain: "purchase-request", label: "Yêu cầu mua hàng", icon: ClipboardCheck, accentClassName: "bg-amber-500 text-white", softClassName: "bg-amber-50 text-amber-700" },
  media: { domain: "media", label: "Media", icon: Images, accentClassName: "bg-violet-600 text-white", softClassName: "bg-violet-50 text-violet-700" },
  technical: { domain: "technical", label: "Technical", icon: Stethoscope, accentClassName: "bg-blue-600 text-white", softClassName: "bg-blue-50 text-blue-700" },
  general: { domain: "general", label: "Vận hành", icon: Workflow, accentClassName: "bg-slate-700 text-white", softClassName: "bg-slate-100 text-slate-700" },
};

function resolveDomain(value?: string | null): OperationalDomain {
  const key = String(value ?? "").trim().toLowerCase();
  if (key.includes("purchase-request")) return "purchase-request";
  if (key.includes("media")) return "media";
  if (key.includes("technical") || key.includes("service")) return "technical";
  if (key.includes("order")) return "order";
  return "general";
}

export function operationalDomainPresentation(value?: string | null) {
  return DOMAINS[resolveDomain(value)];
}
