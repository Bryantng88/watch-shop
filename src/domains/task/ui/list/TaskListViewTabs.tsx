"use client";

import SegmentTabs from "@/domains/shared/ui/list/SegmentTabs";
import type { TaskViewKey } from "../../server/task.types";

export function normalizeTaskView(value?: string | null): TaskViewKey {
  if (value === "mine") return "mine";
  if (value === "assigned") return "assigned";
  if (value === "delegated") return "delegated";
  return "all";
}

export default function TaskListViewTabs({
  value,
  counts,
  canViewAll,
  onChange,
}: {
  value: TaskViewKey;
  counts: Record<string, number>;
  canViewAll?: boolean;
  onChange: (value: TaskViewKey) => void;
}) {
  const items = [
    ...(canViewAll
      ? [{ key: "all" as TaskViewKey, label: "Tất cả", count: counts.all ?? 0 }]
      : []),
    { key: "mine" as TaskViewKey, label: "Task của tôi", count: counts.mine ?? 0 },
    { key: "assigned" as TaskViewKey, label: "Được giao cho tôi", count: counts.assigned ?? 0 },
    { key: "delegated" as TaskViewKey, label: "Tôi đã giao", count: counts.delegated ?? 0 },
  ];

  return <SegmentTabs<TaskViewKey> value={value} onChange={onChange} items={items} />;
}