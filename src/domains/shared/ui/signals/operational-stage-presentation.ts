import type { VisualStatusTone } from "./VisualStatusSignal";
import { Camera, CheckCircle2, CircleDot, CirclePlay, LoaderCircle, Search, Send, SlidersHorizontal, type LucideIcon } from "lucide-react";

export type OperationalStageSignal =
  | "queued"
  | "active"
  | "ready"
  | "attention"
  | "risk"
  | "done";

export type OperationalStagePresentation = {
  signal: OperationalStageSignal;
  tone: VisualStatusTone;
  dotClassName: string;
  barClassName: string;
};

const PRESENTATION: Record<OperationalStageSignal, OperationalStagePresentation> = {
  queued: { signal: "queued", tone: "slate", dotClassName: "bg-slate-400", barClassName: "bg-slate-400" },
  active: { signal: "active", tone: "blue", dotClassName: "bg-blue-500", barClassName: "bg-blue-500" },
  ready: { signal: "ready", tone: "violet", dotClassName: "bg-violet-500", barClassName: "bg-violet-500" },
  attention: { signal: "attention", tone: "amber", dotClassName: "bg-amber-500", barClassName: "bg-amber-500" },
  risk: { signal: "risk", tone: "rose", dotClassName: "bg-rose-500", barClassName: "bg-rose-500" },
  done: { signal: "done", tone: "emerald", dotClassName: "bg-emerald-500", barClassName: "bg-emerald-500" },
};

function normalize(value?: string | null) {
  return String(value ?? "").trim().toUpperCase().replace(/[\s-]+/g, "_");
}

export function operationalStageSignal(value?: string | null): OperationalStageSignal {
  const stage = normalize(value);

  if (["DONE", "COMPLETED", "APPROVED", "PUBLISHED", "DELIVERED", "SETTLED"].includes(stage)) return "done";
  if (["REJECTED", "FAILED", "ERROR", "CANCELLED", "CANCELED", "OVERDUE", "REMAINING_PAYMENT", "DELIVERED_REMAINING"].includes(stage)) return "risk";
  if (["NEED_ACTION", "NEEDS_REWORK", "RETURNED", "FEEDBACK", "PENDING_REVIEW", "WAITING_REVIEW"].includes(stage)) return "attention";
  if (["PROCESSING", "IN_PROGRESS", "ACTIVE", "MEDIA_PROCESSING", "SHIPPING", "SHIPPED"].includes(stage)) return "active";
  if (["READY", "PUBLISH", "READY_TO_PUBLISH", "READY_TO_POST"].includes(stage)) return "ready";
  return "queued";
}

export function operationalStagePresentation(value?: string | null) {
  return PRESENTATION[operationalStageSignal(value)];
}

export function operationalStageIcon(value?: string | null): LucideIcon {
  const stage = normalize(value);
  if (stage === "PHOTOGRAPHY") return Camera;
  if (stage === "MEDIA_PROCESSING") return SlidersHorizontal;
  if (["PUBLISH", "READY_TO_PUBLISH", "READY_TO_POST"].includes(stage)) return Send;
  if (stage === "INSPECT") return Search;
  if (stage === "READY") return CirclePlay;
  if (["PROCESSING", "IN_PROGRESS", "ACTIVE"].includes(stage)) return LoaderCircle;
  if (["DONE", "COMPLETED", "APPROVED", "PUBLISHED"].includes(stage)) return CheckCircle2;
  return CircleDot;
}
