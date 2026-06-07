"use client";

import SegmentTabs from "@/domains/shared/ui/list/SegmentTabs";
import type { TaskViewKey } from "../../server/task.types";

export function normalizeTaskView(value?: string | null): TaskViewKey {
  if (value === "assigned" || value === "delegated" || value === "all") return value;
  return "mine";
}

export default function TaskListViewTabs({ value, counts, canViewAll, onChange }: { value: TaskViewKey; counts: Record<string, number>; canViewAll?: boolean; onChange: (value: TaskViewKey) => void }) {
  return (
    <SegmentTabs<TaskViewKey>
      value={value}
      onChange={onChange}
      items={[
        { key: "mine", label: "Task của tôi", count: counts.mine ?? 0 },
        { key: "assigned", label: "Được giao cho tôi", count: counts.assigned ?? 0 },
        { key: "delegated", label: "Tôi đã giao", count: counts.delegated ?? 0 },
        ...(canViewAll ? [{ key: "all" as TaskViewKey, label: "Tất cả", count: counts.all ?? 0 }] : []),
      ]}
    />
  );
}
