"use client";

import { useMemo, useState, useTransition } from "react";
import type {
  BusinessEventCatalogItem,
} from "@/domains/event/server/business-event-catalog.service";
import type {
  BlueprintCapability,
  BlueprintExperience,
  BlueprintLibraryItem,
} from "@/domains/blueprint/server";
import type {
  WorkflowDefinition,
  WorkflowDefinitionDraft,
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

function fmtJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function parseJson(value: string) {
  try {
    return { ok: true as const, value: JSON.parse(value), error: "" };
  } catch (error: unknown) {
    return {
      ok: false as const,
      value: null,
      error: error instanceof Error ? error.message : "Invalid JSON",
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

  if (!definition) return "No Workflow capability is attached yet.";

  return [
    `${counts.states} stages`,
    `${counts.transitions} ways work moves forward`,
    `${counts.manual} manual actions`,
    `${counts.event} BusinessEvent triggers`,
    `${counts.condition} conditions`,
  ].join(", ");
}

function draftExperience(
  draft: WorkflowDefinitionDraft,
  sourceBlueprint: BlueprintLibraryItem | null,
): BlueprintExperience {
  const name = draft.name || draft.definitionJson.title || "Blueprint Draft";
  const workspaceType = sourceBlueprint?.experience.workspaceType ?? `${name} Workspace`;

  return {
    purpose:
      draft.description ||
      sourceBlueprint?.experience.purpose ||
      "Design a standardized way a future Workspace should operate.",
    ownerLabel: "System Admin",
    typicalUsage:
      sourceBlueprint?.experience.typicalUsage ||
      "Use while defining the operating model before it becomes an available Workspace Blueprint.",
    expectedResult:
      sourceBlueprint?.experience.expectedResult ||
      "A validated Blueprint draft that can later become a Workspace creation option.",
    workspaceType,
    workspacePreview: {
      workspaceType,
      itemLabel: `${name} Items`,
      activityLabel: "Activity history",
      discussionLabel: "Discussion",
      steps: [
        "Admin selects or creates this Blueprint draft.",
        "Admin adjusts the Workflow capability and validates the definition.",
        "A future publish/version step can make the Blueprint available for Workspace creation.",
        "Workspace runtime still starts later on Items, not inside the Blueprint.",
      ],
    },
    capabilities: [
      {
        key: "workflow",
        label: "Workflow",
        status: "ACTIVE",
        description: "Defines the stages and movements Items use after a Workspace is created.",
        summary: workflowSummary(draft.definitionJson),
      },
      {
        key: "permissions",
        label: "Permissions",
        status: "FUTURE",
        description: "Will define who can see, join, and operate the Workspace.",
        summary: null,
      },
      {
        key: "notifications",
        label: "Notifications",
        status: "FUTURE",
        description: "Will define when people are informed about important workspace changes.",
        summary: null,
      },
      {
        key: "automation",
        label: "Automation",
        status: "FUTURE",
        description: "Will define automated reactions after the platform has an automation engine.",
        summary: null,
      },
      {
        key: "layout",
        label: "Layout",
        status: "FUTURE",
        description: "Will define how operators see and organize Workspace information.",
        summary: null,
      },
      {
        key: "metrics",
        label: "Metrics",
        status: "FUTURE",
        description: "Will define what administrators measure for this Workspace type.",
        summary: null,
      },
    ],
  };
}

function summarizeDiff(
  draft: WorkflowDefinitionDraft | null,
  source: WorkflowDefinition | null,
) {
  if (!draft || !source) return ["No source registry definition selected."];

  const definition = draft.definitionJson;
  const diffs: string[] = [];

  if (definition.title !== source.title) diffs.push("Title changed.");
  if (definition.description !== source.description) diffs.push("Description changed.");
  if (definition.initialState !== source.initialState) diffs.push("Initial stage changed.");
  if (definition.states.length !== source.states.length) {
    diffs.push(`Stage count ${source.states.length} -> ${definition.states.length}.`);
  }
  if (definition.transitions.length !== source.transitions.length) {
    diffs.push(
      `Movement count ${source.transitions.length} -> ${definition.transitions.length}.`,
    );
  }

  return diffs.length ? diffs : ["No lightweight diff detected."];
}

function TriggerSummary({ definition }: { definition: WorkflowDefinition | null }) {
  const counts = workflowCounts(definition);

  return (
    <div className="flex flex-wrap gap-2">
      <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${triggerTone("MANUAL")}`}>
        Manual actions {counts.manual}
      </span>
      <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${triggerTone("EVENT")}`}>
        BusinessEvents {counts.event}
      </span>
      <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${triggerTone("CONDITION")}`}>
        Conditions {counts.condition}
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
                  {valid ? "Valid" : "Issues"}
                </span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => onDuplicate(blueprint.workflow.workflowKey ?? "")}
              disabled={busy || !blueprint.workflow.workflowKey}
              className="mt-3 w-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
            >
              Duplicate Blueprint Draft
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
          No blueprint drafts yet.
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
                  {draft.definitionJson.title || "Draft Workspace Blueprint"}
                </div>
              </div>
              <span
                className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                  draft.status === "ARCHIVED"
                    ? "border-slate-200 bg-slate-100 text-slate-600"
                    : validationTone(valid)
                }`}
              >
                {draft.status}
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
  const detailTitle = selectedDraft
    ? selectedDraft.name
    : selectedBlueprint?.name ?? "Blueprint";
  const detailKey = selectedDraft
    ? selectedDraft.key
    : selectedBlueprint?.key ?? "";
  const detailStatus = selectedDraft
    ? selectedDraft.status
    : selectedBlueprint?.workflow.validation?.valid
      ? "REGISTRY VALID"
      : "REGISTRY ISSUES";
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
        throw new Error(data?.error || "Cannot create draft");
      }

      replaceDraft(data.draft);
      setMessage("Blueprint draft created.");
    } catch (err: unknown) {
      setError(errorMessage(err, "Cannot create draft"));
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
      const response = await fetch(
        `/api/admin/system/workflows/drafts/${selectedDraft.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ definitionJson: parsedEditor.value }),
        },
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Cannot save draft");
      }

      replaceDraft(data.draft);
      setMessage(validateOnly ? "Blueprint draft validated." : "Blueprint draft saved and validated.");
    } catch (err: unknown) {
      setError(errorMessage(err, "Cannot save draft"));
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
        throw new Error(data?.error || "Cannot archive draft");
      }

      replaceDraft(data.draft);
      setMessage("Blueprint draft archived.");
    } catch (err: unknown) {
      setError(errorMessage(err, "Cannot archive draft"));
    } finally {
      setBusyKey("");
    }
  }

  if (!detailExperience) {
    return (
      <div className="p-6">
        <div className="border border-dashed border-slate-200 bg-white p-8 text-sm text-slate-500">
          No Blueprint available.
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
              System Admin / Blueprint Library
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              Blueprint Library
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Blueprint is the library of standardized ways the business operates.
              It defines how a Workspace should behave; Workspaces execute from
              snapshots and Items still own Workflow Runtime.
            </p>
          </div>

          <button
            type="button"
            onClick={() => startTransition(() => void createDraft())}
            disabled={Boolean(busyKey)}
            className="w-fit bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {busyKey === "create" ? "Creating..." : "Create Blueprint Draft"}
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
            Registry Blueprints
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-950">
            {registryBlueprints.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">{validRegistryCount} valid</div>
        </div>
        <div className="border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium uppercase text-slate-500">
            Blueprint Drafts
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-950">
            {drafts.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">{validDraftCount} valid</div>
        </div>
        <div className="border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium uppercase text-slate-500">
            Event Catalog
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-950">
            {businessEvents.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">No log scan</div>
        </div>
        <div className="border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium uppercase text-slate-500">
            Runtime Source
          </div>
          <div className="mt-2 text-lg font-semibold text-slate-950">STATIC</div>
          <div className="mt-1 text-xs text-slate-500">Blueprints never execute</div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <div>
            <h2 className="mb-2 text-sm font-semibold text-slate-900">
              Blueprint List
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
              Blueprint Drafts
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
                  {busyKey === "save" ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => void saveDraft(true)}
                  disabled={Boolean(busyKey) || !parsedEditor.ok}
                  className="border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                  {busyKey === "validate" ? "Validating..." : "Validate"}
                </button>
                <button
                  type="button"
                  onClick={() => void archiveDraft()}
                  disabled={Boolean(busyKey) || selectedDraft.status === "ARCHIVED"}
                  className="border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                >
                  Archive
                </button>
              </div>
            ) : (
              <div className="border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                Registry Blueprint is read-only. Duplicate it to create a draft.
              </div>
            )}
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-4">
            <div className="border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs text-slate-500">Workspace Type</div>
              <div className="mt-1 text-sm font-semibold text-slate-950">
                {detailExperience.workspaceType}
              </div>
            </div>
            <div className="border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs text-slate-500">Stages</div>
              <div className="mt-1 text-lg font-semibold text-slate-950">
                {counts.states}
              </div>
            </div>
            <div className="border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs text-slate-500">Ways Work Moves</div>
              <div className="mt-1 text-lg font-semibold text-slate-950">
                {counts.transitions}
              </div>
            </div>
            <div className="border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs text-slate-500">Triggers</div>
              <div className="mt-2">
                <TriggerSummary definition={detailDefinition} />
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-b border-slate-200">
            {[
              ["purpose", "Purpose"],
              ["workspace", "Workspace Preview"],
              ["capabilities", "Capabilities"],
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
                  Blueprint Identity
                </h3>
                <dl className="mt-3 space-y-3 text-sm">
                  <div>
                    <dt className="text-slate-500">Purpose</dt>
                    <dd className="font-medium text-slate-900">
                      {detailExperience.purpose}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Business Context</dt>
                    <dd className="text-slate-700">
                      {selectedDraft ? "Draft / future Workspace Blueprint" : selectedBlueprint?.businessContext}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Owner</dt>
                    <dd className="text-slate-700">
                      {detailExperience.ownerLabel || "Not assigned yet"}
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="border border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Business Fit
                </h3>
                <dl className="mt-3 space-y-3 text-sm">
                  <div>
                    <dt className="text-slate-500">Typical Usage</dt>
                    <dd className="text-slate-700">{detailExperience.typicalUsage}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Expected Result</dt>
                    <dd className="text-slate-700">{detailExperience.expectedResult}</dd>
                  </div>
                </dl>
              </div>
            </div>
          ) : null}

          {detailTab === "workspace" ? (
            <div className="mt-4 space-y-4">
              <div className="grid gap-3 md:grid-cols-4">
                {[
                  ["Workspace", detailExperience.workspacePreview.workspaceType],
                  ["Items", detailExperience.workspacePreview.itemLabel],
                  ["Activity", detailExperience.workspacePreview.activityLabel],
                  ["Discussion", detailExperience.workspacePreview.discussionLabel],
                ].map(([label, value]) => (
                  <div key={label} className="border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-medium uppercase text-slate-500">
                      {label}
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-950">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  How This Blueprint Becomes Work
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
                  Blueprint defines. Workspace executes. Item runtime remains the
                  owner of Workflow state.
                </p>
              </div>
            </div>
          ) : null}

          {detailTab === "capabilities" ? (
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {detailExperience.capabilities.map((capability) => (
                <div key={capability.key} className="border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {capability.label}
                    </h3>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${capabilityTone(capability.status)}`}
                    >
                      {capability.status}
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
                <h3 className="text-sm font-semibold text-slate-900">
                  Work Stages
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Stages describe the visible progress of Items inside the Workspace.
                </p>
                <div className="mt-3 space-y-2">
                  {(detailDefinition?.states ?? []).map((state) => (
                    <div key={state.key} className="border border-slate-200 p-2">
                      <div className="text-sm font-medium text-slate-900">
                        {state.title}
                      </div>
                      <div className="text-xs text-slate-500">{state.key}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Ways Work Moves Forward
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Movements can be manual actions, BusinessEvent reactions, or conditions.
                </p>
                <div className="mt-3 space-y-2">
                  {(detailDefinition?.transitions ?? []).map((transition, index) => (
                    <div
                      key={`${transition.fromState}-${transition.toState}-${index}`}
                      className="border border-slate-200 p-2"
                    >
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
                          "No trigger value"}
                      </div>
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
                    {selectedDraft ? (parsedEditor.ok ? "JSON ok" : "JSON error") : "Read only"}
                  </span>
                </div>
                {selectedDraft ? (
                  <>
                    <textarea
                      value={editorText}
                      onChange={(event) => setEditorText(event.target.value)}
                      spellCheck={false}
                      className="h-[620px] w-full resize-y border border-slate-300 bg-slate-950 p-4 font-mono text-xs leading-5 text-slate-100 outline-none focus:border-slate-500"
                    />
                    {!parsedEditor.ok ? (
                      <div className="mt-2 text-sm text-rose-700">
                        {parsedEditor.error}
                      </div>
                    ) : null}
                  </>
                ) : (
                  <pre className="max-h-[620px] overflow-auto border border-slate-300 bg-slate-950 p-4 font-mono text-xs leading-5 text-slate-100">
                    {fmtJson(detailDefinition)}
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
                        ? "Valid"
                        : "Has Issues"}
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
                      <div className="text-slate-500">No blocking issues.</div>
                    )}
                  </div>
                </div>

                <div className="border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Registry Source
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
                    BusinessEvent Catalog
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
                    Metadata
                  </h3>
                  <div className="mt-2 text-sm text-slate-600">
                    EVENT movements must use one of {eventKeys.size} catalog keys.
                    Unknown events make the draft invalid.
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
