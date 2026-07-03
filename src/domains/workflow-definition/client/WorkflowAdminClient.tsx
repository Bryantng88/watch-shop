"use client";

import { useMemo, useState, useTransition } from "react";
import type {
  BusinessEventCatalogItem,
} from "@/domains/event/server/business-event-catalog.service";
import type {
  BlueprintCapability,
  BlueprintExperience,
  BlueprintLibraryItem,
  BlueprintWorkspaceDefinition,
} from "@/domains/blueprint/server";
import type {
  WorkflowDefinition,
  WorkflowDefinitionDraft,
  WorkflowStateDefinition,
  WorkflowTransitionDefinition,
} from "@/domains/workflow-definition/server";

type Props = {
  blueprints: BlueprintLibraryItem[];
  businessEvents: BusinessEventCatalogItem[];
  initialDrafts: WorkflowDefinitionDraft[];
};

type DetailTab = "purpose" | "workspace" | "capabilities" | "workflow" | "developer";

function triggerTone(triggerType: string) {
  if (triggerType === "MANUAL") return "border-sky-200 bg-sky-50 text-sky-700";
  if (triggerType === "EVENT") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (triggerType === "CONDITION") return "border-amber-200 bg-amber-50 text-amber-700";

  return "border-slate-200 bg-slate-50 text-slate-700";
}

function validationTone(valid: boolean) {
  return valid
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-rose-200 bg-rose-50 text-rose-700";
}

function capabilityTone(status: BlueprintCapability["status"]) {
  return status === "ACTIVE"
    ? "border-slate-900 bg-slate-950 text-white"
    : "border-slate-200 bg-slate-50 text-slate-600";
}

function capabilityStatusLabel(status: BlueprintCapability["status"]) {
  return status === "ACTIVE" ? "Đang bật" : "Sau này";
}

function draftStatusLabel(status: WorkflowDefinitionDraft["status"]) {
  if (status === "VALIDATED") return "Đã validate";
  if (status === "ARCHIVED") return "Đã lưu trữ";
  return "Draft";
}

function fmtJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function actionKeyFromLabel(label: string | null | undefined, index: number) {
  const key = String(label ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return key || `manual-action-${index + 1}`;
}

function parseJson(value: string) {
  try {
    return { ok: true as const, value: JSON.parse(value), error: "" };
  } catch (error: unknown) {
    return {
      ok: false as const,
      value: null,
      error: error instanceof Error ? error.message : "JSON không hợp lệ",
    };
  }
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function workflowCounts(definition: WorkflowDefinition | null) {
  const transitions = definition?.transitions ?? [];

  return {
    states: definition?.states.length ?? 0,
    transitions: transitions.length,
    manual: transitions.filter((item) => item.triggerType === "MANUAL").length,
    event: transitions.filter((item) => item.triggerType === "EVENT").length,
    condition: transitions.filter((item) => item.triggerType === "CONDITION").length,
  };
}

function workflowSummary(definition: WorkflowDefinition | null) {
  const counts = workflowCounts(definition);

  if (!definition) return "Chưa gắn capability Workflow.";

  return [
    `${counts.states} bước trạng thái`,
    `${counts.transitions} cách chuyển việc`,
    `${counts.manual} thao tác thủ công`,
    `${counts.event} trigger BusinessEvent`,
    `${counts.condition} điều kiện`,
  ].join(", ");
}

function draftExperience(
  draft: WorkflowDefinitionDraft,
  sourceBlueprint: BlueprintLibraryItem | null,
): BlueprintExperience {
  if (draft.blueprintJson) {
    const fallback = draftExperience(
      { ...draft, blueprintJson: null },
      sourceBlueprint,
    );

    return {
      ...fallback,
      purpose: draft.blueprintJson.purpose,
      ownerLabel: draft.blueprintJson.ownerLabel,
      typicalUsage: draft.blueprintJson.typicalUsage,
      expectedResult: draft.blueprintJson.expectedResult,
      workspaceType: draft.blueprintJson.workspaceDefinition.workspaceType,
      workspacePreview: {
        ...fallback.workspacePreview,
        workspaceType: draft.blueprintJson.workspaceDefinition.workspaceType,
        itemLabel: draft.blueprintJson.workspaceDefinition.itemLabel,
      },
    };
  }

  const name = draft.name || draft.definitionJson.title || "Blueprint Draft";
  const workspaceType = sourceBlueprint?.experience.workspaceType ?? `${name} Workspace`;

  return {
    purpose:
      draft.description ||
      sourceBlueprint?.experience.purpose ||
      "Thiết kế một cách vận hành chuẩn cho Workspace trong tương lai.",
    ownerLabel: "System Admin",
    typicalUsage:
      sourceBlueprint?.experience.typicalUsage ||
      "Dùng khi đang định nghĩa operating model trước khi Blueprint sẵn sàng để tạo Workspace.",
    expectedResult:
      sourceBlueprint?.experience.expectedResult ||
      "Một Blueprint draft đã validate, sau này có thể trở thành lựa chọn tạo Workspace.",
    workspaceType,
    workspacePreview: {
      workspaceType,
      itemLabel: `${name} Items`,
      activityLabel: "Lịch sử Activity",
      discussionLabel: "Discussion",
      steps: [
        "Admin chọn hoặc tạo Blueprint draft này.",
        "Admin chỉnh capability Workflow và validate định nghĩa.",
        "Bước publish/version trong tương lai sẽ làm Blueprint sẵn sàng để tạo Workspace.",
        "Runtime của Workspace vẫn bắt đầu sau đó trên Item, không chạy trong Blueprint.",
      ],
    },
    capabilities: [
      {
        key: "workflow",
        label: "Workflow",
        status: "ACTIVE",
        description: "Định nghĩa các bước trạng thái và cách Item di chuyển sau khi Workspace được tạo.",
        summary: workflowSummary(draft.definitionJson),
      },
      {
        key: "permissions",
        label: "Permissions",
        status: "FUTURE",
        description: "Sau này dùng để định nghĩa ai được xem, tham gia và thao tác trong Workspace.",
        summary: null,
      },
      {
        key: "notifications",
        label: "Notifications",
        status: "FUTURE",
        description: "Sau này dùng để thông báo khi Workspace có thay đổi quan trọng.",
        summary: null,
      },
      {
        key: "automation",
        label: "Automation",
        status: "FUTURE",
        description: "Sau này dùng để định nghĩa phản ứng tự động khi platform có automation engine.",
        summary: null,
      },
      {
        key: "layout",
        label: "Layout",
        status: "FUTURE",
        description: "Sau này dùng để định nghĩa cách operator nhìn và tổ chức thông tin trong Workspace.",
        summary: null,
      },
      {
        key: "metrics",
        label: "Metrics",
        status: "FUTURE",
        description: "Sau này dùng để định nghĩa các chỉ số admin cần đo cho loại Workspace này.",
        summary: null,
      },
    ],
  };
}

function draftWorkspaceDefinition(
  draft: WorkflowDefinitionDraft,
  experience: BlueprintExperience,
): BlueprintWorkspaceDefinition {
  if (draft.blueprintJson?.workspaceDefinition) {
    return draft.blueprintJson.workspaceDefinition;
  }

  return {
    defaultName: experience.workspaceType,
    defaultDescription:
      draft.description ||
      `Workspace được tạo từ Blueprint draft ${draft.name}.`,
    workspaceType: experience.workspaceType,
    itemLabel: experience.workspacePreview.itemLabel,
    defaultView: "items",
    enabledCapabilities: {
      workflow: true,
      items: true,
      activity: true,
      discussion: true,
      attachments: false,
      checklist: false,
      dueDate: false,
      assignee: false,
      priority: true,
    },
    instantiationNotes:
      "Ở V1, Workspace Definition của draft được derive và chưa publish cho runtime.",
  };
}

function draftBlueprintJson(
  draft: WorkflowDefinitionDraft,
  experience: BlueprintExperience,
  workspaceDefinition: BlueprintWorkspaceDefinition,
) {
  return (
    draft.blueprintJson ?? {
      purpose: experience.purpose,
      businessContext: "DRAFT",
      typicalUsage: experience.typicalUsage,
      expectedResult: experience.expectedResult,
      ownerLabel: experience.ownerLabel,
      workspaceDefinition,
    }
  );
}

function workspaceCapabilityCards(
  workspaceDefinition: BlueprintWorkspaceDefinition,
): BlueprintCapability[] {
  const capabilities = workspaceDefinition.enabledCapabilities;

  return [
    {
      key: "workflow",
      label: "Workflow",
      status: capabilities.workflow ? "ACTIVE" : "FUTURE",
      description: "Đưa Item đi qua các bước vận hành của Workspace.",
      summary: capabilities.workflow ? "Đang bật cho Item runtime." : null,
    },
    {
      key: "items",
      label: "Items",
      status: capabilities.items ? "ACTIVE" : "FUTURE",
      description: `Người dùng quản lý ${workspaceDefinition.itemLabel} trong Workspace này.`,
      summary: capabilities.items ? "Đối tượng cốt lõi của Workspace." : null,
    },
    {
      key: "activity",
      label: "Activity",
      status: capabilities.activity ? "ACTIVE" : "FUTURE",
      description: "Ghi nhận lịch sử quan trọng từ Item và các bước di chuyển của Workflow.",
      summary: capabilities.activity ? "Hiển thị trong lịch sử Workspace." : null,
    },
    {
      key: "discussion",
      label: "Discussion",
      status: capabilities.discussion ? "ACTIVE" : "FUTURE",
      description: "Giữ trao đổi cộng tác xoay quanh công việc trong Workspace.",
      summary: capabilities.discussion ? "Đang bật cho cộng tác." : null,
    },
    {
      key: "attachments",
      label: "Attachments",
      status: capabilities.attachments ? "ACTIVE" : "FUTURE",
      description: "Sau này dùng để quản lý file trong công việc của Workspace.",
      summary: null,
    },
    {
      key: "checklist",
      label: "Checklist",
      status: capabilities.checklist ? "ACTIVE" : "FUTURE",
      description: "Sau này dùng cho các bước checklist lặp lại trong Workspace.",
      summary: null,
    },
    {
      key: "dueDate",
      label: "Due Date",
      status: capabilities.dueDate ? "ACTIVE" : "FUTURE",
      description: "Sau này dùng để định nghĩa thời hạn kỳ vọng cho Workspace hoặc Item.",
      summary: null,
    },
    {
      key: "assignee",
      label: "Assignee",
      status: capabilities.assignee ? "ACTIVE" : "FUTURE",
      description: "Sau này dùng để gán trách nhiệm ở mức chi tiết hơn trong Workspace.",
      summary: null,
    },
    {
      key: "priority",
      label: "Priority",
      status: capabilities.priority ? "ACTIVE" : "FUTURE",
      description: "Đánh dấu mức quan trọng khi tạo và theo dõi Workspace.",
      summary: capabilities.priority ? "Có thể dùng priority mặc định khi tạo." : null,
    },
  ];
}

function summarizeDiff(
  draft: WorkflowDefinitionDraft | null,
  source: WorkflowDefinition | null,
) {
  if (!draft || !source) return ["Chưa chọn definition gốc từ registry."];

  const definition = draft.definitionJson;
  const diffs: string[] = [];

  if (definition.title !== source.title) diffs.push("Tiêu đề đã thay đổi.");
  if (definition.description !== source.description) diffs.push("Mô tả đã thay đổi.");
  if (definition.initialState !== source.initialState) diffs.push("Bước khởi tạo đã thay đổi.");
  if (definition.states.length !== source.states.length) {
    diffs.push(`Số bước trạng thái ${source.states.length} -> ${definition.states.length}.`);
  }
  if (definition.transitions.length !== source.transitions.length) {
    diffs.push(
      `Số cách chuyển việc ${source.transitions.length} -> ${definition.transitions.length}.`,
    );
  }

  return diffs.length ? diffs : ["Chưa thấy khác biệt nhẹ nào."];
}

function TriggerSummary({ definition }: { definition: WorkflowDefinition | null }) {
  const counts = workflowCounts(definition);

  return (
    <div className="flex flex-wrap gap-2">
      <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${triggerTone("MANUAL")}`}>
        Thao tác thủ công {counts.manual}
      </span>
      <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${triggerTone("EVENT")}`}>
        BusinessEvent {counts.event}
      </span>
      <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${triggerTone("CONDITION")}`}>
        Điều kiện {counts.condition}
      </span>
    </div>
  );
}

function BlueprintList({
  blueprints,
  selectedKey,
  onSelect,
  onDuplicate,
  busy,
}: {
  blueprints: BlueprintLibraryItem[];
  selectedKey: string;
  onSelect: (key: string) => void;
  onDuplicate: (key: string) => void;
  busy: boolean;
}) {
  return (
    <div className="space-y-2">
      {blueprints.map((blueprint) => {
        const selected = selectedKey === blueprint.key;
        const valid = Boolean(blueprint.workflow.validation?.valid);

        return (
          <div
            key={blueprint.key}
            className={`border p-3 ${selected ? "border-slate-900 bg-white" : "border-slate-200 bg-white"}`}
          >
            <button
              type="button"
              onClick={() => onSelect(blueprint.key)}
              className="block w-full text-left"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-950">
                    {blueprint.name}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {blueprint.businessContext} / {blueprint.key}
                  </div>
                  <div className="mt-2 text-xs text-slate-600">
                    {blueprint.experience.workspaceType}
                  </div>
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs font-medium ${validationTone(valid)}`}
                >
                  {valid ? "Hợp lệ" : "Có lỗi"}
                </span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => onDuplicate(blueprint.workflow.workflowKey ?? "")}
              disabled={busy || !blueprint.workflow.workflowKey}
              className="mt-3 w-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
            >
              Nhân bản thành Blueprint Draft
            </button>
          </div>
        );
      })}
    </div>
  );
}

function DraftList({
  drafts,
  selectedId,
  onSelect,
}: {
  drafts: WorkflowDefinitionDraft[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      {drafts.length === 0 ? (
        <div className="border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
          Chưa có Blueprint draft.
        </div>
      ) : null}

      {drafts.map((draft) => {
        const selected = selectedId === draft.id;
        const valid = Boolean(draft.validationJson?.valid);

        return (
          <button
            key={draft.id}
            type="button"
            onClick={() => onSelect(draft.id)}
            className={`block w-full border p-3 text-left ${selected ? "border-slate-900 bg-white" : "border-slate-200 bg-white"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-950">
                  {draft.name}
                </div>
                <div className="mt-0.5 text-xs text-slate-500">{draft.key}</div>
                <div className="mt-2 text-xs text-slate-600">
                  {draft.definitionJson.title || "Blueprint draft cho Workspace"}
                </div>
              </div>
              <span
                className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                  draft.status === "ARCHIVED"
                    ? "border-slate-200 bg-slate-100 text-slate-600"
                    : validationTone(valid)
                }`}
              >
                {draftStatusLabel(draft.status)}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function WorkflowAdminClient({
  blueprints,
  businessEvents,
  initialDrafts,
}: Props) {
  const registryBlueprints = useMemo(
    () => blueprints.filter((blueprint) => blueprint.source === "REGISTRY"),
    [blueprints],
  );
  const [drafts, setDrafts] = useState(initialDrafts);
  const [selectedBlueprintKey, setSelectedBlueprintKey] = useState(
    registryBlueprints[0]?.key ?? "",
  );
  const [selectedDraftId, setSelectedDraftId] = useState(initialDrafts[0]?.id ?? "");
  const [editorText, setEditorText] = useState(
    initialDrafts[0] ? fmtJson(initialDrafts[0].definitionJson) : "",
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busyKey, setBusyKey] = useState("");
  const [detailTab, setDetailTab] = useState<DetailTab>("purpose");
  const [, startTransition] = useTransition();

  const selectedBlueprint = useMemo(
    () =>
      registryBlueprints.find((item) => item.key === selectedBlueprintKey) ??
      registryBlueprints[0] ??
      null,
    [selectedBlueprintKey, registryBlueprints],
  );
  const selectedDraft = useMemo(
    () => drafts.find((draft) => draft.id === selectedDraftId) ?? null,
    [drafts, selectedDraftId],
  );
  const sourceBlueprint = useMemo(() => {
    if (!selectedDraft?.sourceRegistryKey) return null;

    return (
      registryBlueprints.find(
        (item) => item.workflow.workflowKey === selectedDraft.sourceRegistryKey,
      ) ?? null
    );
  }, [selectedDraft, registryBlueprints]);
  const sourceDefinition = sourceBlueprint?.workflow.definition ?? null;
  const parsedEditor = useMemo(() => parseJson(editorText), [editorText]);
  const detailDefinition = selectedDraft
    ? selectedDraft.definitionJson
    : selectedBlueprint?.workflow.definition ?? null;
  const detailExperience = selectedDraft
    ? draftExperience(selectedDraft, sourceBlueprint)
    : selectedBlueprint?.experience ?? null;
  const detailWorkspaceDefinition =
    selectedDraft && detailExperience
      ? draftWorkspaceDefinition(selectedDraft, detailExperience)
      : selectedBlueprint?.workspaceDefinition ?? null;
  const detailBlueprintJson =
    selectedDraft && detailExperience && detailWorkspaceDefinition
      ? draftBlueprintJson(
          selectedDraft,
          detailExperience,
          detailWorkspaceDefinition,
        )
      : null;
  const detailTitle = selectedDraft
    ? selectedDraft.name
    : selectedBlueprint?.name ?? "Blueprint";
  const detailKey = selectedDraft
    ? selectedDraft.key
    : selectedBlueprint?.key ?? "";
  const detailStatus = selectedDraft
    ? draftStatusLabel(selectedDraft.status)
    : selectedBlueprint?.workflow.validation?.valid
      ? "Registry hợp lệ"
      : "Registry có lỗi";
  const counts = workflowCounts(detailDefinition);
  const validRegistryCount = registryBlueprints.filter(
    (blueprint) => blueprint.workflow.validation?.valid,
  ).length;
  const validDraftCount = drafts.filter((draft) => draft.validationJson?.valid).length;
  const eventKeys = new Set(businessEvents.map((event) => event.eventKey));

  function replaceDraft(next: WorkflowDefinitionDraft) {
    setDrafts((current) => {
      const index = current.findIndex((draft) => draft.id === next.id);
      if (index < 0) return [next, ...current];

      const copy = [...current];
      copy[index] = next;
      return copy.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    });
    setSelectedDraftId(next.id);
    setEditorText(fmtJson(next.definitionJson));
    setDetailTab("purpose");
  }

  async function createDraft(sourceRegistryKey?: string) {
    setBusyKey(sourceRegistryKey ? `duplicate:${sourceRegistryKey}` : "create");
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/system/workflows/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceRegistryKey: sourceRegistryKey ?? null }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Không thể tạo draft");
      }

      replaceDraft(data.draft);
      setMessage("Đã tạo Blueprint draft.");
    } catch (err: unknown) {
      setError(errorMessage(err, "Không thể tạo draft"));
    } finally {
      setBusyKey("");
    }
  }

  async function saveDraft(validateOnly = false) {
    if (!selectedDraft) return;
    if (!parsedEditor.ok) {
      setError(parsedEditor.error);
      return;
    }

    setBusyKey(validateOnly ? "validate" : "save");
    setError("");
    setMessage("");

    try {
      const definitionJson = parsedEditor.ok
        ? parsedEditor.value
        : selectedDraft.definitionJson;
      const response = await fetch(
        `/api/admin/system/workflows/drafts/${selectedDraft.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: selectedDraft.key,
            name: selectedDraft.name,
            description: selectedDraft.description,
            blueprintJson: selectedDraft.blueprintJson,
            definitionJson,
          }),
        },
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Không thể lưu draft");
      }

      replaceDraft(data.draft);
      setMessage(validateOnly ? "Blueprint draft đã validate." : "Blueprint draft đã lưu và validate.");
    } catch (err: unknown) {
      setError(errorMessage(err, "Không thể lưu draft"));
    } finally {
      setBusyKey("");
    }
  }

  async function archiveDraft() {
    if (!selectedDraft) return;
    setBusyKey("archive");
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/system/workflows/drafts/${selectedDraft.id}`,
        { method: "DELETE" },
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Không thể lưu trữ draft");
      }

      replaceDraft(data.draft);
      setMessage("Blueprint draft đã lưu trữ.");
    } catch (err: unknown) {
      setError(errorMessage(err, "Không thể lưu trữ draft"));
    } finally {
      setBusyKey("");
    }
  }

  function patchSelectedDraft(
    patch: Partial<WorkflowDefinitionDraft>,
  ) {
    if (!selectedDraft) return;

    const next: WorkflowDefinitionDraft = {
      ...selectedDraft,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    setDrafts((current) =>
      current.map((draft) => (draft.id === selectedDraft.id ? next : draft)),
    );
    setEditorText(fmtJson(next.definitionJson));
  }

  function patchDefinition(patch: Partial<WorkflowDefinition>) {
    if (!selectedDraft) return;

    patchSelectedDraft({
      definitionJson: {
        ...selectedDraft.definitionJson,
        ...patch,
      },
    });
  }

  function patchBlueprintJson(
    patch: Partial<NonNullable<WorkflowDefinitionDraft["blueprintJson"]>>,
  ) {
    if (!selectedDraft || !detailBlueprintJson) return;

    patchSelectedDraft({
      blueprintJson: {
        ...detailBlueprintJson,
        ...patch,
      },
    });
  }

  function patchWorkspaceDefinition(
    patch: Partial<BlueprintWorkspaceDefinition>,
  ) {
    if (!selectedDraft || !detailBlueprintJson) return;

    patchBlueprintJson({
      workspaceDefinition: {
        ...detailBlueprintJson.workspaceDefinition,
        ...patch,
      },
    });
  }

  function patchWorkspaceCapabilities(
    patch: Partial<BlueprintWorkspaceDefinition["enabledCapabilities"]>,
  ) {
    if (!detailWorkspaceDefinition) return;

    patchWorkspaceDefinition({
      enabledCapabilities: {
        ...detailWorkspaceDefinition.enabledCapabilities,
        ...patch,
      },
    });
  }

  function nextStageKey(title: string) {
    const base = title.trim().toUpperCase().replace(/[^A-Z0-9]+/g, "_");
    return base || `STAGE_${(detailDefinition?.states.length ?? 0) + 1}`;
  }

  function addStage() {
    if (!selectedDraft) return;
    const title = "Bước mới";
    const state: WorkflowStateDefinition = {
      key: nextStageKey(title),
      title,
      description: null,
      color: "gray",
      icon: "circle",
      sortOrder: selectedDraft.definitionJson.states.length * 10 + 10,
    };

    patchDefinition({
      states: [...selectedDraft.definitionJson.states, state],
    });
  }

  function updateStage(index: number, patch: Partial<WorkflowStateDefinition>) {
    if (!selectedDraft) return;

    patchDefinition({
      states: selectedDraft.definitionJson.states.map((state, stateIndex) =>
        stateIndex === index ? { ...state, ...patch } : state,
      ),
    });
  }

  function deleteStage(index: number) {
    if (!selectedDraft) return;
    const state = selectedDraft.definitionJson.states[index];
    if (!state) return;

    patchDefinition({
      states: selectedDraft.definitionJson.states.filter(
        (_, stateIndex) => stateIndex !== index,
      ),
      transitions: selectedDraft.definitionJson.transitions.filter(
        (transition) =>
          transition.fromState !== state.key && transition.toState !== state.key,
      ),
      terminalStates: selectedDraft.definitionJson.terminalStates.filter(
        (key) => key !== state.key,
      ),
      initialState:
        selectedDraft.definitionJson.initialState === state.key
          ? selectedDraft.definitionJson.states.find((_, stateIndex) => stateIndex !== index)?.key ?? ""
          : selectedDraft.definitionJson.initialState,
    });
  }

  function addTransition() {
    if (!selectedDraft) return;
    const firstState = selectedDraft.definitionJson.states[0]?.key ?? "";
    const secondState =
      selectedDraft.definitionJson.states[1]?.key ?? firstState;
    const manualActionLabel = "Thao tác mới";
    const transition: WorkflowTransitionDefinition = {
      fromState: firstState,
      toState: secondState,
      triggerType: "MANUAL",
      triggerValue: actionKeyFromLabel(
        manualActionLabel,
        selectedDraft.definitionJson.transitions.length,
      ),
      manualActionLabel,
      condition: null,
      metadata: null,
    };

    patchDefinition({
      transitions: [...selectedDraft.definitionJson.transitions, transition],
    });
  }

  function updateTransition(
    index: number,
    patch: Partial<WorkflowTransitionDefinition>,
  ) {
    if (!selectedDraft) return;

    patchDefinition({
      transitions: selectedDraft.definitionJson.transitions.map(
        (transition, transitionIndex) =>
          transitionIndex === index ? { ...transition, ...patch } : transition,
      ),
    });
  }

  function deleteTransition(index: number) {
    if (!selectedDraft) return;

    patchDefinition({
      transitions: selectedDraft.definitionJson.transitions.filter(
        (_, transitionIndex) => transitionIndex !== index,
      ),
    });
  }

  if (!detailExperience || !detailWorkspaceDefinition) {
    return (
      <div className="p-6">
        <div className="border border-dashed border-slate-200 bg-white p-8 text-sm text-slate-500">
          Chưa có Blueprint khả dụng.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <section className="border-b border-slate-200 pb-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              System Admin / Thư viện Blueprint
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              Thư viện Blueprint
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Blueprint là thư viện các cách vận hành chuẩn của business.
              Blueprint định nghĩa Workspace nên vận hành thế nào; Workspace
              chạy từ snapshot và Item vẫn sở hữu Workflow Runtime.
            </p>
          </div>

          <button
            type="button"
            onClick={() => startTransition(() => void createDraft())}
            disabled={Boolean(busyKey)}
            className="w-fit bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {busyKey === "create" ? "Đang tạo..." : "Tạo Blueprint Draft"}
          </button>
        </div>
      </section>

      {error ? (
        <div className="border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      <section className="grid gap-3 md:grid-cols-4">
        <div className="border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium uppercase text-slate-500">
            Blueprint Registry
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-950">
            {registryBlueprints.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">{validRegistryCount} hợp lệ</div>
        </div>
        <div className="border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium uppercase text-slate-500">
            Blueprint Draft
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-950">
            {drafts.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">{validDraftCount} hợp lệ</div>
        </div>
        <div className="border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium uppercase text-slate-500">
            Catalog sự kiện
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-950">
            {businessEvents.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">Không scan log</div>
        </div>
        <div className="border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium uppercase text-slate-500">
            Nguồn runtime
          </div>
          <div className="mt-2 text-lg font-semibold text-slate-950">STATIC</div>
          <div className="mt-1 text-xs text-slate-500">Blueprint không chạy runtime</div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <div>
            <h2 className="mb-2 text-sm font-semibold text-slate-900">
              Danh sách Blueprint
            </h2>
            <BlueprintList
              blueprints={registryBlueprints}
              selectedKey={selectedBlueprint?.key ?? ""}
              onSelect={(key) => {
                setSelectedBlueprintKey(key);
                setSelectedDraftId("");
                setDetailTab("purpose");
              }}
              onDuplicate={(key) => void createDraft(key)}
              busy={Boolean(busyKey)}
            />
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold text-slate-900">
              Blueprint Draft
            </h2>
            <DraftList
              drafts={drafts}
              selectedId={selectedDraftId}
              onSelect={(id) => {
                const draft = drafts.find((item) => item.id === id);
                setSelectedDraftId(id);
                setEditorText(draft ? fmtJson(draft.definitionJson) : "");
                setDetailTab("purpose");
              }}
            />
          </div>
        </aside>

        <article className="border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-950">
                  {detailTitle}
                </h2>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {detailKey}
                </span>
              </div>
              <p className="mt-1 max-w-3xl text-sm text-slate-600">
                {detailExperience.purpose}
              </p>
              <p className="mt-2 text-xs font-medium uppercase text-slate-500">
                {detailExperience.workspaceType} / {detailStatus}
              </p>
            </div>

            {selectedDraft ? (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void saveDraft(false)}
                  disabled={Boolean(busyKey) || !parsedEditor.ok}
                  className="bg-slate-950 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {busyKey === "save" ? "Đang lưu..." : "Lưu"}
                </button>
                <button
                  type="button"
                  onClick={() => void saveDraft(true)}
                  disabled={Boolean(busyKey) || !parsedEditor.ok}
                  className="border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                  {busyKey === "validate" ? "Đang validate..." : "Validate"}
                </button>
                <button
                  type="button"
                  onClick={() => void archiveDraft()}
                  disabled={Boolean(busyKey) || selectedDraft.status === "ARCHIVED"}
                  className="border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                >
                  Lưu trữ
                </button>
              </div>
            ) : (
              <div className="border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                Blueprint từ registry chỉ đọc. Hãy nhân bản để tạo draft.
              </div>
            )}
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-4">
            <div className="border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs text-slate-500">Loại Workspace</div>
              <div className="mt-1 text-sm font-semibold text-slate-950">
                {detailExperience.workspaceType}
              </div>
            </div>
            <div className="border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs text-slate-500">Bước trạng thái</div>
              <div className="mt-1 text-lg font-semibold text-slate-950">
                {counts.states}
              </div>
            </div>
            <div className="border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs text-slate-500">Cách chuyển việc</div>
              <div className="mt-1 text-lg font-semibold text-slate-950">
                {counts.transitions}
              </div>
            </div>
            <div className="border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs text-slate-500">Trigger</div>
              <div className="mt-2">
                <TriggerSummary definition={detailDefinition} />
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-b border-slate-200">
            {[
              ["purpose", "Mục đích"],
              ["workspace", "Workspace Definition"],
              ["capabilities", "Capability"],
              ["workflow", "Workflow"],
              ["developer", "Developer"],
            ].map(([tab, label]) => (
              <button
                key={tab}
                type="button"
                onClick={() => setDetailTab(tab as DetailTab)}
                className={`border-b-2 px-3 py-2 text-sm font-medium ${
                  detailTab === tab
                    ? "border-slate-950 text-slate-950"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {detailTab === "purpose" ? (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="border border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Định danh Blueprint
                </h3>
                <dl className="mt-3 space-y-3 text-sm">
                  <div>
                    <dt className="text-slate-500">Tên Blueprint</dt>
                    <dd className="font-medium text-slate-900">
                      {selectedDraft ? (
                        <input
                          value={selectedDraft.name}
                          onChange={(event) =>
                            patchSelectedDraft({
                              name: event.target.value,
                              key:
                                event.target.value
                                  .trim()
                                  .toLowerCase()
                                  .replace(/[^a-z0-9]+/g, "-")
                                  .replace(/^-|-$/g, "") || selectedDraft.key,
                              definitionJson: {
                                ...selectedDraft.definitionJson,
                                title: event.target.value,
                              },
                            })
                          }
                          className="mt-1 w-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                        />
                      ) : (
                        detailTitle
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Mô tả</dt>
                    <dd className="text-slate-700">
                      {selectedDraft ? (
                        <textarea
                          value={selectedDraft.description ?? ""}
                          onChange={(event) =>
                            patchSelectedDraft({
                              description: event.target.value || null,
                              definitionJson: {
                                ...selectedDraft.definitionJson,
                                description: event.target.value || null,
                              },
                            })
                          }
                          className="mt-1 min-h-20 w-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                        />
                      ) : (
                        selectedBlueprint?.description ?? "-"
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Mục đích</dt>
                    <dd className="font-medium text-slate-900">
                      {selectedDraft && detailBlueprintJson ? (
                        <textarea
                          value={detailBlueprintJson.purpose}
                          onChange={(event) =>
                            patchBlueprintJson({ purpose: event.target.value })
                          }
                          className="mt-1 min-h-20 w-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                        />
                      ) : (
                        detailExperience.purpose
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Business Context</dt>
                    <dd className="text-slate-700">
                      {selectedDraft && detailBlueprintJson ? (
                        <input
                          value={detailBlueprintJson.businessContext}
                          onChange={(event) =>
                            patchBlueprintJson({
                              businessContext: event.target.value,
                            })
                          }
                          className="mt-1 w-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                        />
                      ) : (
                        selectedBlueprint?.businessContext
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Người phụ trách</dt>
                    <dd className="text-slate-700">
                      {selectedDraft && detailBlueprintJson ? (
                        <input
                          value={detailBlueprintJson.ownerLabel ?? ""}
                          onChange={(event) =>
                            patchBlueprintJson({
                              ownerLabel: event.target.value || null,
                            })
                          }
                          className="mt-1 w-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                        />
                      ) : (
                        detailExperience.ownerLabel || "Chưa gán"
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="border border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Ngữ cảnh sử dụng
                </h3>
                <dl className="mt-3 space-y-3 text-sm">
                  <div>
                    <dt className="text-slate-500">Khi nào dùng</dt>
                    <dd className="text-slate-700">
                      {selectedDraft && detailBlueprintJson ? (
                        <textarea
                          value={detailBlueprintJson.typicalUsage}
                          onChange={(event) =>
                            patchBlueprintJson({
                              typicalUsage: event.target.value,
                            })
                          }
                          className="mt-1 min-h-20 w-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                        />
                      ) : (
                        detailExperience.typicalUsage
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Kết quả mong đợi</dt>
                    <dd className="text-slate-700">
                      {selectedDraft && detailBlueprintJson ? (
                        <textarea
                          value={detailBlueprintJson.expectedResult}
                          onChange={(event) =>
                            patchBlueprintJson({
                              expectedResult: event.target.value,
                            })
                          }
                          className="mt-1 min-h-20 w-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                        />
                      ) : (
                        detailExperience.expectedResult
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          ) : null}

          {detailTab === "workspace" ? (
            <div className="mt-4 space-y-4">
              <div className="grid gap-3 md:grid-cols-4">
                {[
                  ["defaultName", "Tên mặc định", detailWorkspaceDefinition.defaultName],
                  ["workspaceType", "Loại Workspace", detailWorkspaceDefinition.workspaceType],
                  ["itemLabel", "Tên gọi Item", detailWorkspaceDefinition.itemLabel],
                ].map(([field, label, value]) => (
                  <div key={label} className="border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-medium uppercase text-slate-500">
                      {label}
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-950">
                      {selectedDraft ? (
                        <input
                          value={value}
                          onChange={(event) =>
                            patchWorkspaceDefinition({
                              [field]: event.target.value,
                            })
                          }
                          className="w-full border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-slate-400"
                        />
                      ) : (
                        value
                      )}
                    </div>
                  </div>
                ))}
                <div className="border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-medium uppercase text-slate-500">
                    View mặc định
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-950">
                    {selectedDraft ? (
                      <select
                        value={detailWorkspaceDefinition.defaultView}
                        onChange={(event) =>
                          patchWorkspaceDefinition({
                            defaultView: event.target.value as BlueprintWorkspaceDefinition["defaultView"],
                          })
                        }
                        className="w-full border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-slate-400"
                      >
                        <option value="items">Items</option>
                        <option value="activity">Activity</option>
                        <option value="workflow">Workflow</option>
                      </select>
                    ) : (
                      detailWorkspaceDefinition.defaultView
                    )}
                  </div>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Mô tả Workspace mặc định
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {selectedDraft ? (
                      <textarea
                        value={detailWorkspaceDefinition.defaultDescription ?? ""}
                        onChange={(event) =>
                          patchWorkspaceDefinition({
                            defaultDescription: event.target.value || null,
                          })
                        }
                        className="min-h-24 w-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                      />
                    ) : (
                      detailWorkspaceDefinition.defaultDescription || "Chưa có mô tả mặc định."
                    )}
                  </p>
                </div>
                <div className="border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Ghi chú khi tạo Workspace
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {selectedDraft ? (
                      <textarea
                        value={detailWorkspaceDefinition.instantiationNotes ?? ""}
                        onChange={(event) =>
                          patchWorkspaceDefinition({
                            instantiationNotes: event.target.value || null,
                          })
                        }
                        className="min-h-24 w-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                      />
                    ) : (
                      detailWorkspaceDefinition.instantiationNotes || "Chưa có ghi chú khi tạo Workspace."
                    )}
                  </p>
                </div>
              </div>
              <div className="border border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Blueprint này trở thành công việc như thế nào
                </h3>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {detailExperience.workspacePreview.steps.map((step, index) => (
                    <div key={step} className="border border-slate-200 p-3 text-sm text-slate-700">
                      <span className="mr-2 font-semibold text-slate-950">
                        {index + 1}.
                      </span>
                      {step}
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  Blueprint chỉ định nghĩa. Workspace mới là nơi thực thi. Item
                  runtime vẫn sở hữu trạng thái Workflow.
                </p>
              </div>
            </div>
          ) : null}

          {detailTab === "capabilities" ? (
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {workspaceCapabilityCards(detailWorkspaceDefinition).map((capability) => (
                <div key={capability.key} className="border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {selectedDraft &&
                      capability.key in detailWorkspaceDefinition.enabledCapabilities ? (
                        <input
                          type="checkbox"
                          checked={
                            detailWorkspaceDefinition.enabledCapabilities[
                              capability.key as keyof BlueprintWorkspaceDefinition["enabledCapabilities"]
                            ]
                          }
                          onChange={(event) =>
                            patchWorkspaceCapabilities({
                              [capability.key]: event.target.checked,
                            })
                          }
                          className="h-4 w-4"
                        />
                      ) : null}
                      <h3 className="text-sm font-semibold text-slate-900">
                        {capability.label}
                      </h3>
                    </div>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${capabilityTone(capability.status)}`}
                    >
                      {capabilityStatusLabel(capability.status)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {capability.description}
                  </p>
                  {capability.summary ? (
                    <p className="mt-3 text-sm font-medium text-slate-900">
                      {capability.summary}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}

          {detailTab === "workflow" ? (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Các bước trạng thái
                  </h3>
                  {selectedDraft ? (
                    <button
                      type="button"
                      onClick={addStage}
                      className="border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Thêm stage
                    </button>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  Các bước trạng thái mô tả tiến độ nhìn thấy được của Item trong Workspace.
                </p>
                <div className="mt-3 space-y-2">
                  {(detailDefinition?.states ?? []).map((state, index) => (
                    <div key={state.key} className="border border-slate-200 p-2">
                      {selectedDraft ? (
                        <div className="space-y-2">
                          <input
                            value={state.title}
                            onChange={(event) =>
                              updateStage(index, { title: event.target.value })
                            }
                            className="w-full border border-slate-200 px-2 py-1.5 text-sm font-medium outline-none focus:border-slate-400"
                          />
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-slate-500">{state.key}</span>
                            <button
                              type="button"
                              onClick={() => deleteStage(index)}
                              disabled={(detailDefinition?.states.length ?? 0) <= 1}
                              className="text-xs font-medium text-rose-700 disabled:text-slate-300"
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="text-sm font-medium text-slate-900">
                            {state.title}
                          </div>
                          <div className="text-xs text-slate-500">{state.key}</div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Cách công việc chuyển bước
                  </h3>
                  {selectedDraft ? (
                    <button
                      type="button"
                      onClick={addTransition}
                      className="border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Thêm transition
                    </button>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  Công việc có thể chuyển bước bằng thao tác thủ công, phản ứng từ BusinessEvent hoặc điều kiện.
                </p>
                <div className="mt-3 space-y-2">
                  {(detailDefinition?.transitions ?? []).map((transition, index) => (
                    <div
                      key={`${transition.fromState}-${transition.toState}-${index}`}
                      className="border border-slate-200 p-2"
                    >
                      {selectedDraft ? (
                        <div className="space-y-2">
                          <div className="grid gap-2 md:grid-cols-2">
                            <select
                              value={transition.fromState}
                              onChange={(event) =>
                                updateTransition(index, {
                                  fromState: event.target.value,
                                })
                              }
                              className="border border-slate-200 px-2 py-1.5 text-sm"
                            >
                              {(detailDefinition?.states ?? []).map((state) => (
                                <option key={state.key} value={state.key}>
                                  Từ: {state.title}
                                </option>
                              ))}
                            </select>
                            <select
                              value={transition.toState}
                              onChange={(event) =>
                                updateTransition(index, {
                                  toState: event.target.value,
                                })
                              }
                              className="border border-slate-200 px-2 py-1.5 text-sm"
                            >
                              {(detailDefinition?.states ?? []).map((state) => (
                                <option key={state.key} value={state.key}>
                                  Đến: {state.title}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="grid gap-2 md:grid-cols-2">
                            <select
                              value={transition.triggerType}
                              onChange={(event) => {
                                const triggerType = event.target.value as WorkflowTransitionDefinition["triggerType"];
                                const manualActionLabel =
                                  transition.manualActionLabel ?? "Thao tác mới";

                                updateTransition(index, {
                                  triggerType,
                                  triggerValue:
                                    triggerType === "MANUAL"
                                      ? actionKeyFromLabel(manualActionLabel, index)
                                      : null,
                                  manualActionLabel:
                                    triggerType === "MANUAL"
                                      ? manualActionLabel
                                      : null,
                                });
                              }}
                              className="border border-slate-200 px-2 py-1.5 text-sm"
                            >
                              <option value="MANUAL">Manual action</option>
                              <option value="EVENT">BusinessEvent</option>
                              <option value="CONDITION">Condition</option>
                            </select>
                            {transition.triggerType === "EVENT" ? (
                              <select
                                value={transition.triggerValue ?? ""}
                                onChange={(event) =>
                                  updateTransition(index, {
                                    triggerValue: event.target.value || null,
                                  })
                                }
                                className="border border-slate-200 px-2 py-1.5 text-sm"
                              >
                                <option value="">Chọn BusinessEvent</option>
                                {businessEvents.map((event) => (
                                  <option key={event.eventKey} value={event.eventKey}>
                                    {event.label}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                value={
                                  transition.triggerType === "MANUAL"
                                    ? transition.manualActionLabel ?? ""
                                    : transition.triggerValue ?? ""
                                }
                                onChange={(event) =>
                                  updateTransition(
                                    index,
                                    transition.triggerType === "MANUAL"
                                      ? {
                                          manualActionLabel:
                                            event.target.value || null,
                                          triggerValue: actionKeyFromLabel(
                                            event.target.value,
                                            index,
                                          ),
                                        }
                                      : { triggerValue: event.target.value || null },
                                  )
                                }
                                placeholder={
                                  transition.triggerType === "MANUAL"
                                    ? "Tên thao tác"
                                    : "Condition key"
                                }
                                className="border border-slate-200 px-2 py-1.5 text-sm"
                              />
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteTransition(index)}
                            className="text-xs font-medium text-rose-700"
                          >
                            Xóa transition
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-slate-900">
                              {transition.fromState} {"->"} {transition.toState}
                            </span>
                            <span
                              className={`rounded-full border px-2 py-0.5 text-xs font-medium ${triggerTone(transition.triggerType)}`}
                            >
                              {transition.triggerType}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {transition.manualActionLabel ||
                              transition.triggerValue ||
                              "Chưa có trigger value"}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {detailTab === "developer" ? (
            <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Definition JSON
                  </h3>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                      selectedDraft
                        ? parsedEditor.ok
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-rose-200 bg-rose-50 text-rose-700"
                        : "border-slate-200 bg-slate-50 text-slate-600"
                    }`}
                  >
                    {selectedDraft ? (parsedEditor.ok ? "JSON ok" : "JSON lỗi") : "Chỉ đọc"}
                  </span>
                </div>
                {selectedDraft ? (
                  <>
                    <textarea
                      value={editorText}
                      readOnly
                      spellCheck={false}
                      className="h-[620px] w-full resize-y border border-slate-300 bg-slate-950 p-4 font-mono text-xs leading-5 text-slate-100 outline-none"
                    />
                    {!parsedEditor.ok ? (
                      <div className="mt-2 text-sm text-rose-700">
                        {parsedEditor.error}
                      </div>
                    ) : null}
                  </>
                ) : (
                  <pre className="max-h-[620px] overflow-auto border border-slate-300 bg-slate-950 p-4 font-mono text-xs leading-5 text-slate-100">
                    {fmtJson({
                      identity: {
                        key: detailKey,
                        name: detailTitle,
                        status: detailStatus,
                      },
                      workspaceDefinition: detailWorkspaceDefinition,
                      workflow: detailDefinition,
                      experience: detailExperience,
                    })}
                  </pre>
                )}
              </div>

              <div className="space-y-4">
                <div className="border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Validation
                  </h3>
                  <div className="mt-2">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${validationTone(
                        Boolean(
                          selectedDraft
                            ? selectedDraft.validationJson?.valid
                            : selectedBlueprint?.workflow.validation?.valid,
                        ),
                      )}`}
                    >
                      {(selectedDraft
                        ? selectedDraft.validationJson?.valid
                        : selectedBlueprint?.workflow.validation?.valid)
                        ? "Hợp lệ"
                        : "Có lỗi"}
                    </span>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    {((selectedDraft
                      ? selectedDraft.validationJson?.issues
                      : selectedBlueprint?.workflow.validation?.issues) ?? []).length ? (
                      ((selectedDraft
                        ? selectedDraft.validationJson?.issues
                        : selectedBlueprint?.workflow.validation?.issues) ?? []).map((issue) => (
                        <div key={issue} className="text-rose-700">
                          {issue}
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-500">Không có lỗi chặn.</div>
                    )}
                  </div>
                </div>

                <div className="border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Nguồn registry
                  </h3>
                  <div className="mt-3 space-y-1 text-sm text-slate-600">
                    {selectedDraft ? (
                      summarizeDiff(selectedDraft, sourceDefinition).map((line) => (
                        <div key={line}>{line}</div>
                      ))
                    ) : (
                      <div>{selectedBlueprint?.registrySource ?? "Registry"}</div>
                    )}
                  </div>
                </div>

                <div className="border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Catalog BusinessEvent
                  </h3>
                  <div className="mt-3 max-h-[260px] space-y-2 overflow-auto">
                    {businessEvents.map((event) => (
                      <div key={event.eventKey} className="border border-slate-200 p-2">
                        <div className="text-xs font-medium text-slate-900">
                          {event.label}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-500">
                          {event.eventKey}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Workspace Definition JSON
                  </h3>
                  <pre className="mt-3 max-h-[220px] overflow-auto border border-slate-200 bg-slate-50 p-3 font-mono text-xs leading-5 text-slate-700">
                    {fmtJson(detailWorkspaceDefinition)}
                  </pre>
                </div>

                <div className="border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Metadata
                  </h3>
                  <div className="mt-2 text-sm text-slate-600">
                    Movement dạng EVENT phải dùng một trong {eventKeys.size} key của catalog.
                    Event không xác định sẽ làm draft không hợp lệ.
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </article>
      </section>
    </div>
  );
}
