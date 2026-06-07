"use client";

import { ClipboardList } from "lucide-react";
import type { RowAction } from "@/domains/shared/ui/list/RowActions";
import type { TaskQuickCreateContext } from "./TaskQuickCreateModal";

export function buildTaskRowAction<T>(getContext: (row: T) => TaskQuickCreateContext, openTaskModal: (context: TaskQuickCreateContext) => void): RowAction<T> {
  return {
    key: "create-task",
    label: "Tạo task",
    icon: <ClipboardList className="h-4 w-4" />,
    onClick: (row) => openTaskModal(getContext(row)),
  };
}
