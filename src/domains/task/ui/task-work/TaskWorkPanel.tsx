"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { TaskPriority } from "@prisma/client";
import SubtaskManageModal from "../list/SubtaskManageModal";
import {
  BusinessEntityPreviewModal,
  useBusinessEntityPreview,
} from "@/domains/shared/ui/business/BusinessEntityPreview";
import TaskItemRow from "./TaskItemRow";
import TaskTagPicker, { type TaskTagOption } from "./TaskTagPicker";
import TaskExecutionGroup from "./TaskExecutionGroup";
import MoveTaskItemModal from "./MoveTaskItemModal";
import { splitExecutions } from "./taskWorkPanel.helpers";

import TaskItemFilterBar, {
  type TaskItemChecklistFilter,
} from "./TaskItemFilterBar";

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
  tagNames?: string[];
};

type UpdateTaskItemInput = {
  itemId: string;
  title: string;
  assignedToUserId?: string | null;
  priority?: TaskPriority | null;
  dueAt?: string | null;
  tagNames?: string[];
};



const INITIAL_VISIBLE_LIMIT = 5;
const LOAD_MORE_STEP = 5;

function tempId(prefix: string) {
  return `temp-${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function findUser(users: UserOption[], id?: string | null) {
  if (!id) return null;
  return users.find((x) => x.id === id) ?? null;
}

function isTempId(id?: string | null) {
  return String(id || "").startsWith("temp-");
}

function userLabel(user?: UserOption | null) {
  return user?.name || user?.email || "Không rõ";
}

function priorityLabel(priority?: TaskPriority | null) {
  if (priority === TaskPriority.LOW) return "Thấp";
  if (priority === TaskPriority.MEDIUM) return "Vừa";
  if (priority === TaskPriority.HIGH) return "Cao";
  if (priority === TaskPriority.URGENT) return "Gấp";
  return "Không rõ";
}

function TaskItemCreateBar({
  task,
  users,
  pending,
  tagOptions,
  onSubmit,
}: {
  task: any;
  users: UserOption[];
  pending: boolean;
  tagOptions: TaskTagOption[];
  onSubmit: (input: TaskItemInput) => Promise<void> | void;
}) {
  const [title, setTitle] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [dueAt, setDueAt] = useState("");
  const [tagNames, setTagNames] = useState<string[]>([]);

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
      tagNames,
    });

    setTitle("");
    setSelectedUserId("");
    setPriority(TaskPriority.MEDIUM);
    setDueAt("");
    setTagNames([]);
  }

  return (
    <div className="mb-3 grid gap-2 xl:grid-cols-[minmax(260px,1fr)_220px_150px_120px_145px_76px]">
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
        className="h-10 min-w-0 rounded-2xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-slate-400"
      />

      <TaskTagPicker
        value={tagNames}
        options={tagOptions}
        onChange={setTagNames}
        compact
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
  onUpdateTaskItemChecklistTitle,
  onDeleteTaskItemChecklist,
  onTaskItemsChange,
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
  onAddTaskItemChecklist?: (
    taskItemId: string,
    title: string,
  ) => Promise<any> | any;
  onToggleTaskItemChecklist?: (
    checklistId: string,
    isDone: boolean,
  ) => Promise<void> | void;
  onUpdateTaskItemChecklistTitle?: (
    checklistId: string,
    title: string,
  ) => Promise<void> | void;
  onDeleteTaskItemChecklist?: (checklistId: string) => Promise<void> | void;
  onTaskItemsChange?: (taskId: string, items: any[]) => void;
}) {
  const previewState = useBusinessEntityPreview();
  const [pending, setPending] = useState(false);
  const [localItems, setLocalItems] = useState<any[]>(taskItems ?? []);
  const [managingItem, setManagingItem] = useState<any | null>(null);
  const [movingItem, setMovingItem] = useState<any | null>(null);

  const [expandedItemIds, setExpandedItemIds] = useState<
    Record<string, boolean>
  >({});
  const [tagFilter, setTagFilter] = useState("ALL");
  const [assigneeFilter, setAssigneeFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "ALL">(
    "ALL",
  );
  const [checklistFilter, setChecklistFilter] =
    useState<TaskItemChecklistFilter>("ALL");
  const [visibleLimit, setVisibleLimit] = useState(INITIAL_VISIBLE_LIMIT);
  const [showCreateBar, setShowCreateBar] = useState(false);
  const [openMenuItemId, setOpenMenuItemId] = useState<string | null>(null);
  const router = useRouter();
  const taskTagOptions = useMemo(() => {
    const map = new Map<
      string,
      TaskTagOption & {
        count: number;
      }
    >();

    for (const item of localItems) {
      for (const tag of item.tags ?? []) {
        const name = String(tag?.name || "").trim();
        if (!name) continue;

        const key = String(tag?.slug || name).toLowerCase();
        const current = map.get(key);

        map.set(key, {
          id: tag.id,
          name,
          slug: tag.slug,
          color: tag.color ?? null,
          count: (current?.count ?? 0) + 1,
        });
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.name.localeCompare(b.name);
    });
  }, [localItems]);

  function itemSignature(items: any[]) {
    return items
      .map((item) => {
        const tags = (item.tags ?? []).map((tag: any) => tag.id ?? tag.name).join(",");
        const checks = (item.checklists ?? [])
          .map((row: any) => `${row.id}:${row.isDone}:${row.title}`)
          .join(",");
        return `${item.id}:${item.title}:${item.status}:${item.isDone}:${item.dueAt}:${item.priority}:${tags}:${checks}`;
      })
      .join("|");
  }
  const taskItemsSignature = useMemo(
    () => itemSignature(taskItems ?? []),
    [taskItems],
  );

  useEffect(() => {
    setLocalItems(taskItems ?? []);
  }, [taskItemsSignature]);
  useEffect(() => {
    setVisibleLimit(INITIAL_VISIBLE_LIMIT);
  }, [assigneeFilter, priorityFilter, checklistFilter, tagFilter]);

  function commitLocalItems(updater: (prev: any[]) => any[]) {
    setLocalItems((prev) => {
      const next = updater(prev);

      if (itemSignature(prev) === itemSignature(next)) {
        return prev;
      }

      return next;
    });
  }
  const filteredItems = useMemo(() => {
    return localItems.filter((item) => {
      if (assigneeFilter === "UNASSIGNED") {
        if (item.assignedToUserId) return false;
      } else if (assigneeFilter !== "ALL") {
        if (item.assignedToUserId !== assigneeFilter) return false;
      }

      if (priorityFilter !== "ALL" && item.priority !== priorityFilter) {
        return false;
      }

      const checklistCount = Array.isArray(item.checklists)
        ? item.checklists.length
        : 0;

      if (checklistFilter === "HAS_CHECKLIST" && checklistCount <= 0) {
        return false;
      }

      if (checklistFilter === "NO_CHECKLIST" && checklistCount > 0) {
        return false;
      }
      if (tagFilter !== "ALL") {
        const hasTag = (item.tags ?? []).some(
          (tag: any) => String(tag.name || "").toLowerCase() === tagFilter,
        );

        if (!hasTag) return false;
      }
      return true;
    });
  }, [localItems, assigneeFilter, priorityFilter, checklistFilter, tagFilter]);

  const visibleItems = useMemo(
    () => filteredItems.slice(0, visibleLimit),
    [filteredItems, visibleLimit],
  );

  const hasMoreItems = visibleLimit < filteredItems.length;
  const hasCollapsedItems =
    visibleLimit > INITIAL_VISIBLE_LIMIT &&
    filteredItems.length > INITIAL_VISIBLE_LIMIT;

  const orphanExecutions = useMemo(
    () => splitExecutions(executions.filter((x) => !x.taskItemId)),
    [executions],
  );

  function resetTaskItemFilters() {
    setAssigneeFilter("ALL");
    setPriorityFilter("ALL");
    setChecklistFilter("ALL");
    setTagFilter("ALL");
    setVisibleLimit(INITIAL_VISIBLE_LIMIT);
  }

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
      tags: (input.tagNames ?? []).map((name) => ({ name })),
      _pending: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    commitLocalItems((prev) => [optimisticItem, ...prev]);

    try {
      setPending(true);

      const result = await onAddTaskItem?.(input);
      const created = result?.item ?? result?.taskItem ?? result?.data ?? null;

      if (!created?.id) {
        throw new Error("Server chưa trả task item đã tạo.");
      }

      commitLocalItems((prev) =>
        prev.map((x) =>
          x.id === id
            ? {
              ...optimisticItem,
              ...created,
              _pending: false,
            }
            : x,
        ),
      );
    } catch (error) {
      commitLocalItems((prev) => prev.filter((x) => x.id !== id));
      throw error;
    } finally {
      setPending(false);
    }
  }

  async function toggleItem(item: any) {
    if (item._pending || isTempId(item.id)) return;

    const nextDone = !Boolean(item.isDone || item.status === "DONE");
    const oldItem = item;

    commitLocalItems((prev) =>
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
      commitLocalItems((prev) =>
        prev.map((x) => (x.id === item.id ? oldItem : x)),
      );
      throw error;
    }
  }

  async function deleteItem(item: any) {
    if (item._pending || isTempId(item.id)) return;

    commitLocalItems((prev) => prev.filter((x) => x.id !== item.id));

    if (managingItem?.id === item.id) {
      setManagingItem(null);
    }

    try {
      await onDeleteTaskItem?.(item.id);
    } catch (error) {
      commitLocalItems((prev) => [...prev, item]);
      throw error;
    }
  }

  function handleMovedTaskItem(result: any) {
    const movedItemId = result?.item?.id ?? movingItem?.id;

    if (movedItemId) {
      commitLocalItems((prev) => prev.filter((x) => x.id !== movedItemId));
    }

    if (managingItem?.id === movedItemId) {
      setManagingItem(null);
    }

    setMovingItem(null);
  }

  async function updateItem(input: UpdateTaskItemInput) {
    let oldItem: any = null;

    commitLocalItems((prev) =>
      prev.map((item) => {
        if (item.id !== input.itemId) return item;

        oldItem = item;

        return {
          ...item,
          title: input.title,
          assignedToUserId: input.assignedToUserId ?? null,
          assignedToUser: findUser(users, input.assignedToUserId),
          priority: input.priority ?? item.priority,
          dueAt: input.dueAt ?? null,
          ...(input.tagNames !== undefined
            ? { tags: input.tagNames.map((name) => ({ name })) }
            : {}),
          _uiState: "updating",
        };
      }),
    );

    try {
      const result: any = await onUpdateTaskItem?.(input);
      const updated = result?.item ?? result?.data ?? null;

      commitLocalItems((prev) =>
        prev.map((item) =>
          item.id === input.itemId
            ? {
              ...item,
              ...(updated ?? {}),
              tags:
                updated?.tags ??
                (input.tagNames !== undefined
                  ? input.tagNames.map((name) => ({ name }))
                  : item.tags),
              _uiState: null,
            }
            : item,
        ),
      );
    } catch (error) {
      if (oldItem) {
        commitLocalItems((prev) =>
          prev.map((item) => (item.id === input.itemId ? oldItem : item)),
        );
      }

      throw error;
    }
  }

  async function addChecklist(taskItemId: string, title: string) {
    if (isTempId(taskItemId)) return;

    const clean = title.trim();
    if (!clean) return;

    const tempChecklistId = tempId("checklist");

    const pendingChecklist = {
      id: tempChecklistId,
      taskItemId,
      title: clean,
      note: null,
      isDone: false,
      doneAt: null,
      _uiState: "creating",
    };

    commitLocalItems((prev) =>
      prev.map((item) =>
        item.id === taskItemId
          ? {
            ...item,
            status: "TODO",
            isDone: false,
            checklists: [...(item.checklists ?? []), pendingChecklist],
          }
          : item,
      ),
    );

    setExpandedItemIds((prev) => ({ ...prev, [taskItemId]: true }));

    try {
      const result = await onAddTaskItemChecklist?.(taskItemId, clean);
      const created = result?.checklist ?? result?.data ?? null;

      if (!created?.id) {
        throw new Error("Server chưa trả checklist đã tạo.");
      }

      commitLocalItems((prev) =>
        prev.map((item) =>
          item.id === taskItemId
            ? {
              ...item,
              status: "TODO",
              isDone: false,
              checklists: (item.checklists ?? []).map((row: any) =>
                row.id === tempChecklistId
                  ? {
                    ...created,
                    _uiState: null,
                  }
                  : row,
              ),
            }
            : item,
        ),
      );

      return result;
    } catch (error) {
      commitLocalItems((prev) =>
        prev.map((item) =>
          item.id === taskItemId
            ? {
              ...item,
              checklists: (item.checklists ?? []).filter(
                (row: any) => row.id !== tempChecklistId,
              ),
            }
            : item,
        ),
      );

      throw error;
    }
  }

  async function toggleChecklist(checklistId: string, isDone: boolean) {
    if (isTempId(checklistId)) return;

    let oldRow: any = null;

    commitLocalItems((prev) =>
      prev.map((item) => ({
        ...item,
        checklists: (item.checklists ?? []).map((row: any) => {
          if (row.id !== checklistId) return row;

          oldRow = row;

          return {
            ...row,
            isDone,
            doneAt: isDone ? new Date().toISOString() : null,
            _uiState: "updating",
          };
        }),
      })),
    );

    try {
      await onToggleTaskItemChecklist?.(checklistId, isDone);

      commitLocalItems((prev) =>
        prev.map((item) => ({
          ...item,
          checklists: (item.checklists ?? []).map((row: any) =>
            row.id === checklistId
              ? {
                ...row,
                _uiState: null,
              }
              : row,
          ),
        })),
      );
    } catch (error) {
      if (oldRow) {
        commitLocalItems((prev) =>
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

  async function updateChecklistTitle(checklistId: string, title: string) {
    if (isTempId(checklistId)) return;

    const clean = title.trim();
    if (!clean) return;

    let oldRow: any = null;

    commitLocalItems((prev) =>
      prev.map((item) => ({
        ...item,
        checklists: (item.checklists ?? []).map((row: any) => {
          if (row.id !== checklistId) return row;

          oldRow = row;

          return {
            ...row,
            title: clean,
            _uiState: "updating",
          };
        }),
      })),
    );

    try {
      await onUpdateTaskItemChecklistTitle?.(checklistId, clean);

      commitLocalItems((prev) =>
        prev.map((item) => ({
          ...item,
          checklists: (item.checklists ?? []).map((row: any) =>
            row.id === checklistId
              ? {
                ...row,
                _uiState: null,
              }
              : row,
          ),
        })),
      );
    } catch (error) {
      if (oldRow) {
        commitLocalItems((prev) =>
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

  async function deleteChecklist(checklistId: string) {
    if (isTempId(checklistId)) return;

    let deletedRow: any = null;
    let deletedTaskItemId: string | null = null;

    commitLocalItems((prev) =>
      prev.map((item) => ({
        ...item,
        checklists: (item.checklists ?? []).map((row: any) => {
          if (row.id !== checklistId) return row;

          deletedRow = row;
          deletedTaskItemId = item.id;

          return {
            ...row,
            _uiState: "deleting",
          };
        }),
      })),
    );

    try {
      await onDeleteTaskItemChecklist?.(checklistId);

      commitLocalItems((prev) =>
        prev.map((item) =>
          item.id === deletedTaskItemId
            ? {
              ...item,
              checklists: (item.checklists ?? []).filter(
                (row: any) => row.id !== checklistId,
              ),
            }
            : item,
        ),
      );
    } catch (error) {
      if (deletedRow && deletedTaskItemId) {
        commitLocalItems((prev) =>
          prev.map((item) =>
            item.id === deletedTaskItemId
              ? {
                ...item,
                checklists: (item.checklists ?? []).map((row: any) =>
                  row.id === checklistId
                    ? {
                      ...deletedRow,
                      _uiState: null,
                    }
                    : row,
                ),
              }
              : item,
          ),
        );
      }

      throw error;
    }
  }

  return (
    <section
      className="border-y border-slate-200 bg-slate-100 px-4 py-4"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <TaskItemFilterBar
          users={users}
          assigneeFilter={assigneeFilter}
          priorityFilter={priorityFilter}
          checklistFilter={checklistFilter}
          total={localItems.length}
          filteredTotal={filteredItems.length}
          visibleCount={filteredItems.length}
          canAddTaskItem={canAddTaskItem}
          showCreateBar={showCreateBar}
          onToggleCreateBar={() => setShowCreateBar((prev) => !prev)}
          onAssigneeChange={setAssigneeFilter}
          onPriorityChange={setPriorityFilter}
          onChecklistChange={setChecklistFilter}
          onReset={resetTaskItemFilters}
          tagFilter={tagFilter}
          tagOptions={taskTagOptions}
          onTagChange={setTagFilter}
        />

        {showCreateBar ? (
          <div className="border-b border-slate-100 bg-slate-50 px-4 pt-3">
            <TaskItemCreateBar
              task={task}
              users={users}
              pending={pending}
              tagOptions={taskTagOptions}
              onSubmit={async (input) => {
                await addTaskItem(input);
                setShowCreateBar(false);
              }}
            />
          </div>
        ) : null}

        <div className="max-h-[430px] overflow-y-auto bg-slate-50/70 px-4 py-3">
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <TaskItemRow
                key={item.id}
                item={item}
                canCancel={canCancelTaskItem}
                onManage={setManagingItem}
                openMenuItemId={openMenuItemId}
                onOpenMenu={setOpenMenuItemId}
                onMove={(row) => {
                  setOpenMenuItemId(null);
                  setMovingItem(row);
                }}
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
                onDeleteTaskItemChecklist={deleteChecklist}
              />
            ))}

            {localItems.length > 0 && filteredItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-4 text-sm text-slate-400">
                Không có task item phù hợp với bộ lọc.
              </div>
            ) : null}

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
        </div>
      </div>

      <MoveTaskItemModal
        open={Boolean(movingItem)}
        item={movingItem}
        currentTask={task}
        onClose={() => setMovingItem(null)}
        onMoved={() => setMovingItem(null)}
      />

      <SubtaskManageModal
        onRefresh={() => router.refresh()}
        open={Boolean(managingItem)}
        task={{
          ...task,
          tagOptions: taskTagOptions,
        }}
        item={managingItem}
        users={users}
        canEdit={canAddTaskItem}
        onClose={() => setManagingItem(null)}
        onSave={updateItem}
        onLinked={(payload) => {
          const taskItemId = payload?.taskItemId;
          const executions = Array.isArray(payload?.executions)
            ? payload.executions
            : payload?.id
              ? [payload]
              : [];

          if (!taskItemId) {
            setManagingItem(null);
            return;
          }

          if (payload?.removedExecutionId) {
            commitLocalItems((prev) =>
              prev.map((item) =>
                item.id === taskItemId
                  ? {
                    ...item,
                    executions: (item.executions ?? []).filter(
                      (execution: any) =>
                        execution.id !== payload.removedExecutionId,
                    ),
                  }
                  : item,
              ),
            );

            setManagingItem(null);
            return;
          }

          if (executions.length) {
            commitLocalItems((prev) =>
              prev.map((item) =>
                item.id === taskItemId
                  ? {
                    ...item,
                    executions: [
                      ...(item.executions ?? []),
                      ...executions.filter(
                        (next: any) =>
                          !(item.executions ?? []).some(
                            (old: any) => old.id === next.id,
                          ),
                      ),
                    ],
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