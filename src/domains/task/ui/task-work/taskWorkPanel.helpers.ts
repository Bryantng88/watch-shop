import type { BusinessEntityPreview } from "@/domains/shared/business/business-entity.types";
import {
  getExecutionTitle,
  isTrackingExecution,
  targetHref,
  targetLabel,
} from "../execution";

export function isBusinessDone(item: any) {
  return Boolean(item.isBusinessDone);
}

export function groupByTarget(items: any[]) {
  const map = new Map<string, any>();

  for (const item of items) {
    const key = `${item.targetType}:${item.targetId}`;

    if (!map.has(key)) {
      map.set(key, {
        ...item,
        events: [item],
        latestAt: item.createdAt,
      });
      continue;
    }

    const group = map.get(key);
    group.events.push(item);

    if (new Date(item.createdAt).getTime() > new Date(group.latestAt).getTime()) {
      group.latestAt = item.createdAt;
      group.actionType = item.actionType;
      group.note = item.note;
      group.targetStatus = item.targetStatus;
      group.status = item.status;
      group.serviceRequest = item.serviceRequest ?? group.serviceRequest;
      group.technicalIssue = item.technicalIssue ?? group.technicalIssue;
      group.metadataJson = item.metadataJson ?? group.metadataJson;
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(b.latestAt).getTime() - new Date(a.latestAt).getTime(),
  );
}

export function splitExecutions(executions: any[]) {
  const grouped = groupByTarget(executions);

  return {
    grouped,
    serviceRequests: grouped.filter((x) => x.targetType === "SERVICE_REQUEST"),
    technicalIssues: grouped.filter((x) => x.targetType === "TECHNICAL_ISSUE"),
    otherExecutions: grouped.filter(
      (x) => x.targetType !== "SERVICE_REQUEST" && x.targetType !== "TECHNICAL_ISSUE",
    ),
  };
}

export function executionModeLabel(execution: any) {
  return isTrackingExecution(execution) ? "Theo dõi" : "Thông tin";
}

export function executionPreviewType(targetType: string): BusinessEntityPreview["type"] {
  if (targetType === "SERVICE_REQUEST") return "SERVICE";
  return targetType as BusinessEntityPreview["type"];
}

export function executionToPreview(item: any): BusinessEntityPreview {
  return {
    type: executionPreviewType(item.targetType),
    id: item.targetId,
    refNo: item.targetRefNo || null,
    title: getExecutionTitle(item),
    subtitle: `${executionModeLabel(item)} · ${targetLabel(item.targetType)}`,
    status: item.targetStatus || item.businessStage || null,
    href: targetHref(item.targetType, item.targetId),
  } as BusinessEntityPreview;
}
