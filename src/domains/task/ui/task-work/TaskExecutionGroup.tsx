"use client";

import { PackageCheck, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BusinessEntityPreview } from "@/domains/shared/business/business-entity.types";
import {
  businessStageTone,
  getBusinessStatus,
  getExecutionTitle,
  isTrackingExecution,
  statusTone,
  targetLabel,
} from "../execution";
import { executionToPreview } from "./taskWorkPanel.helpers";

function ExecutionRow({
  item,
  children,
  onPreview,
}: {
  item: any;
  children?: React.ReactNode;
  onPreview: (preview: BusinessEntityPreview) => void;
}) {
  const status = getBusinessStatus(item);
  const tracking = isTrackingExecution(item);

  return (
    <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-100">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100">
            {item.targetType === "SERVICE_REQUEST" || item.targetType === "TECHNICAL_ISSUE" ? (
              <Wrench className="h-3.5 w-3.5" />
            ) : (
              <PackageCheck className="h-3.5 w-3.5" />
            )}
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-950">{getExecutionTitle(item)}</span>

              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1",
                  tracking ? "bg-blue-50 text-blue-700 ring-blue-100" : "bg-slate-50 text-slate-500 ring-slate-200",
                )}
              >
                {tracking ? "Theo dõi" : "Thông tin"}
              </span>

              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1",
                  item.businessStageTone ? businessStageTone(item.businessStageTone) : statusTone(status),
                )}
              >
                {status}
              </span>
            </div>

            <div className="mt-1 text-xs text-slate-400">{targetLabel(item.targetType)}</div>
          </div>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onPreview(executionToPreview(item));
          }}
          className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
        >
          Mở
        </button>
      </div>

      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}

function TechnicalIssueChildList({ items }: { items: any[] }) {
  if (!items.length) return null;

  return (
    <div className="space-y-2 border-l border-slate-200 pl-4">
      {items.map((ti) => {
        const status = getBusinessStatus(ti);

        return (
          <div
            key={`${ti.targetType}:${ti.targetId}`}
            className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100"
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-800">{getExecutionTitle(ti)}</div>
              <div className="mt-0.5 text-xs text-slate-400">Khu vực: {ti.technicalIssue?.area || "-"}</div>
            </div>

            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1",
                ti.businessStageTone ? businessStageTone(ti.businessStageTone) : statusTone(status),
              )}
            >
              {status}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function TaskExecutionGroup({
  serviceRequests,
  technicalIssues,
  otherExecutions,
  onPreview,
}: {
  serviceRequests: any[];
  technicalIssues: any[];
  otherExecutions: any[];
  onPreview: (preview: BusinessEntityPreview) => void;
}) {
  return (
    <>
      {serviceRequests.map((sr) => (
        <ExecutionRow key={`${sr.targetType}:${sr.targetId}`} item={sr} onPreview={onPreview}>
          <TechnicalIssueChildList items={technicalIssues} />
        </ExecutionRow>
      ))}

      {!serviceRequests.length && technicalIssues.length ? (
        <ExecutionRow
          item={{
            targetType: "SERVICE_REQUEST",
            targetId: "technical-issues",
            targetTitle: "Technical Issues",
            targetStatus: "UPDATED",
            metadataJson: { linkMode: "TRACKING" },
          }}
          onPreview={onPreview}
        >
          <TechnicalIssueChildList items={technicalIssues} />
        </ExecutionRow>
      ) : null}

      {otherExecutions.map((item) => (
        <ExecutionRow key={`${item.targetType}:${item.targetId}`} item={item} onPreview={onPreview} />
      ))}
    </>
  );
}
