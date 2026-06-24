"use client";

import { useEffect, useMemo, useState } from "react";
import { TaskPriority } from "@prisma/client";
import SubtaskManageModal from "../list/SubtaskManageModal";
import {
  BusinessEntityPreviewModal,
  useBusinessEntityPreview,
} from "@/domains/shared/ui/business/BusinessEntityPreview";
import TaskItemRow from "./TaskItemRow";
import TaskExecutionGroup from "./TaskExecutionGroup";
import { splitExecutions } from "./taskWorkPanel.helpers";

type UserOption = {
  id: string;
  name?: string | null;
  email?: string | null;
};

type TaskItemInput = {
  taskId: string;
  title: string;
  assignedToUserId?: string | null;
  priority?: TaskPriority | null;
  dueAt?: string | null;
};

type UpdateTaskItemInput = {
  itemId: string;
  title: string;
  assignedToUserId?: string | null;
  priority?: TaskPriority | null;
  dueAt?: string | null;
};

function tempId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function findUser(users: UserOption[], id?: string | null) {
  if (!id) return null;
  return users.find((x) => x.id === id) ?? null;
}

function TaskItemCreateBar({
  task,
  users,
  pending,
  onSubmit,
}: {
  task: any;
  users: UserOption[];
  pending: boolean;
  onSubmit: (input: TaskItemInput) => Promise<void> | void;

}) {
  const [title, setTitle] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [dueAt, setDueAt] = useState("");

  async function submit() {
    const clean = title.trim();
    if (!clean || pending) return;

    await onSubmit({
      taskId: task.id,
      title: clean,
      assignedToUserId:
        selectedUserId || task.assignedToUserId || task.createdByUserId || null,
      priority,
      dueAt: dueAt || null,
    });

    setTitle("");
    setSelectedUserId("");
    setPriority(TaskPriority.MEDIUM);
    setDueAt("");
  }

  return (
    <div className="mb-3 grid gap-2 lg:grid-cols-[minmax(0,1fr)_180px_140px_150px_80px]">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            submit();
          }
        }}
        placeholder="Thêm task item..."
        className="h-10 rounded-2xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-slate-400"
      />

      <select
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
        className="h-10 rounded-2xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-400"
      >
        <option value="">Tự giao</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name || user.email}
          </option>
        ))}
      </select>

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as TaskPriority)}
        className="h-10 rounded-2xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-400"
      >
        <option value={TaskPriority.LOW}>Thấp</option>
        <option value={TaskPriority.MEDIUM}>Vừa</option>
        <option value={TaskPriority.HIGH}>Cao</option>
        <option value={TaskPriority.URGENT}>Gấp</option>
      </select>

      <input
        type="date"
        value={dueAt}
        onChange={(e) => setDueAt(e.target.value)}
        className="h-10 rounded-2xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-400"
      />

      <button
        type="button"
        disabled={pending || !title.trim()}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          submit();
        }}
        className="h-10 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-40"
      >
        Thêm
      </button>
    </div>
  );
}

export default function TaskWorkPanel({
  task,
  taskItems = [],
  executions = [],
  onAddTaskItem,
  onToggleTaskItem,
  onDeleteTaskItem,
  onUpdateTaskItem,
  onAddTaskItemChecklist,
  onToggleTaskItemChecklist,
  users = [],
  canAddTaskItem = true,
  canCancelTaskItem = true,
  onUpdateTaskItemChecklistTitle
}: {
  task: any;
  taskItems?: any[];
  executions?: any[];
  users?: UserOption[];
  canAddTaskItem?: boolean;
  canCancelTaskItem?: boolean;
  onAddTaskItem?: (input: TaskItemInput) => Promise<any> | any;
  onUpdateTaskItem?: (input: UpdateTaskItemInput) => Promise<void> | void;
  onToggleTaskItem?: (itemId: string, isDone: boolean) => Promise<void> | void;
  onDeleteTaskItem?: (itemId: string) => Promise<void> | void;
  onAddTaskItemChecklist?: (taskItemId: string, title: string) => Promise<any> | any;
  onToggleTaskItemChecklist?: (
    checklistId: string,
    isDone: boolean,
  ) => Promise<void> | void;
  onUpdateTaskItemChecklistTitle?: (
    checklistId: string,
    title: string,
  ) => Promise<void> | void;
}) {
  const previewState = useBusinessEntityPreview();

  const [pending, setPending] = useState(false);
  const [localItems, setLocalItems] = useState<any[]>(taskItems);
  const [managingItem, setManagingItem] = useState<any | null>(null);
  const [expandedItemIds, setExpandedItemIds] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    setLocalItems(taskItems);
  }, [taskItems]);

  const orphanExecutions = useMemo(
    () => splitExecutions(executions.filter((x) => !x.taskItemId)),
    [executions],
  );

  async function addTaskItem(input: TaskItemInput) {
    const id = tempId("task-item");
    const assignedToUser = findUser(users, input.assignedToUserId);

    const optimisticItem = {
      id,
      taskId: input.taskId,
      title: input.title,
      note: null,
      status: "TODO",
      isDone: false,
      priority: input.priority ?? TaskPriority.MEDIUM,
      dueAt: input.dueAt ?? null,
      assignedToUserId: input.assignedToUserId ?? null,
      assignedToUser,
      executions: [],
      checklists: [],
      __optimistic: true,
    };

    setLocalItems((prev) => [...prev, optimisticItem]);

    try {
      setPending(true);
      const result = await onAddTaskItem?.(input);
      const created = result?.item ?? result?.taskItem ?? result?.data ?? null;

      if (created?.id) {
        setLocalItems((prev) =>
          prev.map((x) => (x.id === id ? { ...optimisticItem, ...created } : x)),
        );
      }
    } catch (error) {
      setLocalItems((prev) => prev.filter((x) => x.id !== id));
      throw error;
    } finally {
      setPending(false);
    }
  }
  async function updateChecklistTitle(checklistId: string, title: string) {
    let oldTitle = "";

    setLocalItems((prev) =>
      prev.map((item) => ({
        ...item,
        checklists: (item.checklists ?? []).map((row: any) => {
          if (row.id !== checklistId) return row;
          oldTitle = row.title;
          return { ...row, title };
        }),
      })),
    );

    try {
      await onUpdateTaskItemChecklistTitle?.(checklistId, title);
    } catch (error) {
      setLocalItems((prev) =>
        prev.map((item) => ({
          ...item,
          checklists: (item.checklists ?? []).map((row: any) =>
            row.id === checklistId ? { ...row, title: oldTitle } : row,
          ),
        })),
      );

      throw error;
    }
  }
  async function toggleItem(item: any) {
    const nextDone = !Boolean(item.isDone || item.status === "DONE");
    const prevItem = item;

    setLocalItems((prev) =>
      prev.map((x) =>
        x.id === item.id
          ? {
            ...x,
            isDone: nextDone,
            status: nextDone ? "DONE" : "TODO",
          }
          : x,
      ),
    );

    try {
      await onToggleTaskItem?.(item.id, nextDone);
    } catch (error) {
      setLocalItems((prev) =>
        prev.map((x) => (x.id === item.id ? prevItem : x)),
      );
      throw error;
    }
  }

  async function deleteItem(item: any) {
    const oldItems = localItems;

    setLocalItems((prev) => prev.filter((x) => x.id !== item.id));

    if (managingItem?.id === item.id) {
      setManagingItem(null);
    }

    try {
      await onDeleteTaskItem?.(item.id);
    } catch (error) {
      setLocalItems(oldItems);
      throw error;
    }
  }

  async function updateItem(input: UpdateTaskItemInput) {
    const oldItems = localItems;

    setLocalItems((prev) =>
      prev.map((item) =>
        item.id === input.itemId
          ? {
            ...item,
            title: input.title,
            assignedToUserId: input.assignedToUserId ?? null,
            assignedToUser: findUser(users, input.assignedToUserId),
            priority: input.priority ?? item.priority,
            dueAt: input.dueAt ?? null,
          }
          : item,
      ),
    );

    try {
      await onUpdateTaskItem?.(input);
    } catch (error) {
      setLocalItems(oldItems);
      throw error;
    }
  }

  async function addChecklist(taskItemId: string, title: string) {
    const id = tempId("checklist");

    const optimisticChecklist = {
      id,
      taskItemId,
      title,
      note: null,
      isDone: false,
      doneAt: null,
      __optimistic: true,
    };

    setLocalItems((prev) =>
      prev.map((item) =>
        item.id === taskItemId
          ? {
            ...item,
            checklists: [...(item.checklists ?? []), optimisticChecklist],
          }
          : item,
      ),
    );

    setExpandedItemIds((prev) => ({ ...prev, [taskItemId]: true }));

    try {
      const result = await onAddTaskItemChecklist?.(taskItemId, title);
      const created = result?.checklist ?? result?.data ?? null;

      if (created?.id) {
        setLocalItems((prev) =>
          prev.map((item) =>
            item.id === taskItemId
              ? {
                ...item,
                checklists: (item.checklists ?? []).map((row: any) =>
                  row.id === id ? created : row,
                ),
              }
              : item,
          ),
        );
      }
    } catch (error) {
      setLocalItems((prev) =>
        prev.map((item) =>
          item.id === taskItemId
            ? {
              ...item,
              checklists: (item.checklists ?? []).filter(
                (row: any) => row.id !== id,
              ),
            }
            : item,
        ),
      );
      throw error;
    }
  }

  async function toggleChecklist(checklistId: string, isDone: boolean) {
    let oldRow: any = null;

    setLocalItems((prev) =>
      prev.map((item) => ({
        ...item,
        checklists: (item.checklists ?? []).map((row: any) => {
          if (row.id !== checklistId) return row;
          oldRow = row;
          return {
            ...row,
            isDone,
            doneAt: isDone ? new Date().toISOString() : null,
          };
        }),
      })),
    );

    try {
      await onToggleTaskItemChecklist?.(checklistId, isDone);
    } catch (error) {
      if (oldRow) {
        setLocalItems((prev) =>
          prev.map((item) => ({
            ...item,
            checklists: (item.checklists ?? []).map((row: any) =>
              row.id === checklistId ? oldRow : row,
            ),
          })),
        );
      }
      throw error;
    }
  }

  return (
    <section
      className="border-y border-l-4 border-slate-200 border-l-slate-400 bg-slate-100 px-4 py-4"
      onClick={(event) => event.stopPropagation()}
    >
      {canAddTaskItem ? (
        <TaskItemCreateBar
          task={task}
          users={users}
          pending={pending}
          onSubmit={addTaskItem}
        />
      ) : null}

      <div className="space-y-2">
        {localItems.map((item) => (
          <TaskItemRow
            key={item.id}
            item={item}
            canCancel={canCancelTaskItem}
            onManage={setManagingItem}
            onToggle={toggleItem}
            onDelete={deleteItem}
            onPreview={previewState.openPreview}
            expanded={Boolean(expandedItemIds[item.id])}
            onToggleExpand={(row) =>
              setExpandedItemIds((prev) => ({
                ...prev,
                [row.id]: !prev[row.id],
              }))
            }
            onAddTaskItemChecklist={addChecklist}
            onToggleTaskItemChecklist={toggleChecklist}
            onUpdateTaskItemChecklistTitle={updateChecklistTitle}
          />
        ))}

        <TaskExecutionGroup
          serviceRequests={orphanExecutions.serviceRequests}
          technicalIssues={orphanExecutions.technicalIssues}
          otherExecutions={orphanExecutions.otherExecutions}
          onPreview={previewState.openPreview}
        />

        {!localItems.length &&
          !orphanExecutions.serviceRequests.length &&
          !orphanExecutions.technicalIssues.length &&
          !orphanExecutions.otherExecutions.length ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-4 text-sm text-slate-400">
            Chưa có task item hoặc nghiệp vụ nào.
          </div>
        ) : null}
      </div>

      <SubtaskManageModal
        open={Boolean(managingItem)}
        task={task}
        item={managingItem}
        users={users}
        canEdit={canAddTaskItem}
        onClose={() => setManagingItem(null)}
        onSave={updateItem}
        onLinked={(execution) => {
          if (execution?.taskItemId) {
            setLocalItems((prev) =>
              prev.map((item) =>
                item.id === execution.taskItemId
                  ? {
                    ...item,
                    executions: [...(item.executions ?? []), execution],
                  }
                  : item,
              ),
            );
          }

          setManagingItem(null);
        }}
      />

      <BusinessEntityPreviewModal
        open={previewState.open}
        preview={previewState.preview}
        loading={previewState.loading}
        error={previewState.error}
        onClose={previewState.closePreview}
      />
    </section>
  );
}