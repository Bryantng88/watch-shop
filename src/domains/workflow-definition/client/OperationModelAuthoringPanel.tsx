"use client";

import type {
  OperationalBlueprintAction,
  OperationalBlueprintContract,
  OperationalBlueprintCoreFlow,
  OperationalBlueprintEventRoute,
  OperationalBlueprintObjectType,
  OperationalBlueprintProjectionSubscription,
  OperationalBlueprintTemplate,
  OperationalBlueprintWorkspaceRole,
  OperationalBlueprintWorkflow,
} from "@/domains/blueprint/shared/operational-blueprint";
import { validateOperationalBlueprintContract } from "@/domains/blueprint/shared/operational-blueprint";
import {
  appendOperationActionField,
  appendOperationListItem,
  buildStarterOperationalBlueprintContract,
  patchOperationActionField,
  patchOperationListItem,
  patchOperationRoot,
  removeOperationActionField,
  removeOperationListItem,
  retargetOperationObjectType,
} from "@/domains/blueprint/shared/operation-authoring";
import {
  DEFAULT_OPERATION_TARGET_TYPE,
  OPERATION_TARGET_TYPE_OPTIONS,
  operationEventOptionsForTargetType,
  operationTargetTypeOption,
  operationTargetTypeSelectOptions,
} from "@/domains/blueprint/shared/operation-target-types";

type ParsedOperationEditor = {
  ok: boolean;
  error: string;
};

type Props = {
  operation: OperationalBlueprintContract | null;
  operationEditorText: string;
  parsedOperationEditor: ParsedOperationEditor;
  templates: OperationalBlueprintTemplate[];
  sourceOperation: OperationalBlueprintContract | null;
  onOperationChange: (operation: OperationalBlueprintContract | null) => void;
  onOperationEditorTextChange: (text: string) => void;
  onTemplateSelect: (template: OperationalBlueprintTemplate) => void;
};

function validationTone(valid: boolean) {
  return valid
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-rose-200 bg-rose-50 text-rose-700";
}

function csv(value: string[]) {
  return value.join(", ");
}

function parseCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function nextKey(prefix: string, count: number) {
  return `${prefix}_${count + 1}`;
}

function objectTypeTemplate(count: number): OperationalBlueprintObjectType {
  const option =
    OPERATION_TARGET_TYPE_OPTIONS[count % OPERATION_TARGET_TYPE_OPTIONS.length] ??
    operationTargetTypeOption(DEFAULT_OPERATION_TARGET_TYPE);

  return {
    targetType: option?.value ?? DEFAULT_OPERATION_TARGET_TYPE,
    label: option?.label ?? "Business object",
    role: "ITEM",
    description:
      option?.description ?? "Mô tả business object mà domain đang quản lý.",
  };
}

function workspaceRoleTemplate(count: number): OperationalBlueprintWorkspaceRole {
  return {
    key: nextKey("WORKSPACE_ROLE", count),
    label: "Vai trò Workspace mới",
    cardinality: "SINGLE_PER_ACTIVE_CYCLE",
    identityTargetType: null,
    itemTargetTypes: [],
    description: "Mô tả Workspace này dùng để làm gì trong operation.",
  };
}

function eventRouteTemplate(count: number): OperationalBlueprintEventRoute {
  const targetOption = operationTargetTypeOption(DEFAULT_OPERATION_TARGET_TYPE);

  return {
    eventKey: targetOption?.defaultEventKey ?? `domain.event_${count + 1}`,
    targetType: targetOption?.value ?? DEFAULT_OPERATION_TARGET_TYPE,
    workspaceRole: "WORKSPACE_ROLE",
    effect: "BIND_ITEM",
    description: "Mô tả event này đưa việc vào Workspace như thế nào.",
  };
}

function actionTemplate(count: number): OperationalBlueprintAction {
  const targetOption = operationTargetTypeOption(DEFAULT_OPERATION_TARGET_TYPE);

  return {
    key: targetOption?.defaultActionKey ?? nextKey("action", count).toLowerCase(),
    label: "Thao tác mới",
    workspaceRole: "WORKSPACE_ROLE",
    targetType: targetOption?.value ?? DEFAULT_OPERATION_TARGET_TYPE,
    command: targetOption?.defaultCommand ?? "domain.command",
    fields: [],
    emits: [],
    description: "Mô tả lệnh domain mà action này sẽ gọi.",
  };
}

function coreFlowTemplate(count: number): OperationalBlueprintCoreFlow {
  return {
    key: nextKey("core_flow", count).toLowerCase(),
    label: "Luồng chính",
    description: "Mô tả thứ tự đi qua các Workspace.",
    steps: [],
  };
}

function workflowTemplate(count: number): OperationalBlueprintWorkflow {
  return {
    key: nextKey("workflow", count).toLowerCase(),
    workspaceRole: "WORKSPACE_ROLE",
    states: ["READY"],
    transitions: [],
  };
}

function projectionTemplate(
  count: number,
): OperationalBlueprintProjectionSubscription {
  return {
    projectionKey: nextKey("projection", count).toLowerCase(),
    eventKeys: [],
    resolvesToTargetType: DEFAULT_OPERATION_TARGET_TYPE,
    description: "Mô tả vì sao projection này cần làm mới dữ liệu.",
  };
}

function starterOperationFrom(
  operation: OperationalBlueprintContract,
): OperationalBlueprintContract {
  return buildStarterOperationalBlueprintContract(operation);
}

function stepsToText(flow: OperationalBlueprintCoreFlow) {
  return flow.steps.map((step) => step.workspaceRole).join(", ");
}

function textToSteps(
  value: string,
  currentSteps: OperationalBlueprintCoreFlow["steps"],
) {
  const roles = parseCsv(value);

  return roles.map((workspaceRole, index) => {
    const existing =
      currentSteps.find((step) => step.workspaceRole === workspaceRole) ??
      currentSteps[index];

    return {
      workspaceRole,
      label: existing?.label ?? workspaceRole,
      description: existing?.description ?? `Bước trong luồng cho ${workspaceRole}.`,
      isEntry: index === 0,
      isTerminal: index === roles.length - 1,
    };
  });
}

function transitionsToText(workflow: OperationalBlueprintWorkflow) {
  return workflow.transitions
    .map(
      (transition) =>
        `${transition.from} -> ${transition.to} | ${transition.actionKey} | ${transition.eventKey}`,
    )
    .join("\n");
}

function textToTransitions(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [statePart = "", actionKey = "", eventKey = ""] = line
        .split("|")
        .map((item) => item.trim());
      const [from = "", to = ""] = statePart.split("->").map((item) => item.trim());

      return {
        from,
        to,
        actionKey,
        eventKey,
      };
    });
}

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1 text-xs font-medium text-slate-600">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border border-slate-200 px-2 py-1.5 text-sm font-normal text-slate-900 outline-none focus:border-slate-400"
      />
    </label>
  );
}

function TextAreaInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1 text-xs font-medium text-slate-600">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-20 resize-y border border-slate-200 px-2 py-1.5 text-sm font-normal text-slate-900 outline-none focus:border-slate-400"
      />
    </label>
  );
}

type SelectOption = string | { value: string; label: string };

function SelectInput({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1 text-xs font-medium text-slate-600">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border border-slate-200 px-2 py-1.5 text-sm font-normal text-slate-900 outline-none focus:border-slate-400"
      >
        {options.map((option) => (
          <option
            key={typeof option === "string" ? option : option.value}
            value={typeof option === "string" ? option : option.value}
          >
            {typeof option === "string" ? option : option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function targetTypeOptions(currentValue: string) {
  return operationTargetTypeSelectOptions(currentValue).map((value) => {
    const option = operationTargetTypeOption(value);

    return {
      value,
      label: option ? `${option.label} (${option.value})` : `${value} (chưa có trong registry)`,
    };
  });
}

const WORKSPACE_CARDINALITY_OPTIONS: SelectOption[] = [
  {
    value: "SINGLE_PER_ACTIVE_CYCLE",
    label: "Tạo sẵn 1 Workspace khi tạo Space",
  },
  {
    value: "ONE_PER_BUSINESS_OBJECT",
    label: "Tạo 1 Workspace cho mỗi object/event",
  },
  {
    value: "MANY_PER_ACTIVE_CYCLE",
    label: "Tạo thủ công nhiều Workspace khi cần",
  },
];

function workspaceCardinalityHelp(
  value: OperationalBlueprintWorkspaceRole["cardinality"],
) {
  if (value === "SINGLE_PER_ACTIVE_CYCLE") {
    return "Dùng khi Space luôn cần sẵn Workspace này ngay từ đầu. Ví dụ: Workspace chính của flow media.";
  }

  if (value === "ONE_PER_BUSINESS_OBJECT") {
    return "Dùng khi mỗi business object/event sẽ mở một Workspace riêng. Ví dụ: mỗi Service Request có một workspace xử lý riêng.";
  }

  return "Dùng khi người vận hành cần tự tạo nhiều Workspace cùng loại theo năng lực hoặc ca làm việc. Bước tạo Space runtime sẽ không tự tạo loại này.";
}

const EVENT_EFFECT_OPTIONS: SelectOption[] = [
  {
    value: "CREATE_WORKSPACE",
    label: "Tạo Workspace mới từ event",
  },
  {
    value: "BIND_ITEM",
    label: "Đưa object vào Workspace có sẵn",
  },
  {
    value: "MOVE_ITEM",
    label: "Chuyển object sang Workspace khác",
  },
  {
    value: "WRITE_ACTIVITY",
    label: "Ghi hoạt động vào Workspace",
  },
];

function eventEffectHelp(value: OperationalBlueprintEventRoute["effect"]) {
  if (value === "CREATE_WORKSPACE") {
    return "Event này mở một Workspace mới cho object. Dùng với role tạo theo từng object/event.";
  }

  if (value === "BIND_ITEM") {
    return "Event này thêm object thành item trong Workspace đã có. Đây là kiểu phổ biến cho Workspace tạo sẵn.";
  }

  if (value === "MOVE_ITEM") {
    return "Event này chuyển item/object từ bước Workspace này sang bước Workspace khác trong flow.";
  }

  return "Event này chỉ ghi log/hoạt động vào Workspace, không tạo hoặc chuyển item.";
}

function routeTargetOptions(operation: OperationalBlueprintContract, currentValue: string) {
  const options = operation.objectTypes.map((objectType) => ({
    value: objectType.targetType,
    label: `${objectType.label || objectType.targetType} (${objectType.targetType})`,
  }));

  if (currentValue && !options.some((option) => option.value === currentValue)) {
    options.push({
      value: currentValue,
      label: `${currentValue} (đang lệch, nên đổi)`,
    });
  }

  return options.length ? options : targetTypeOptions(currentValue);
}

function workspaceRoleOptions(operation: OperationalBlueprintContract, currentValue: string) {
  const options = operation.workspaceRoles.map((role) => ({
    value: role.key,
    label: `${role.label || role.key} (${role.key})`,
  }));

  if (currentValue && !options.some((option) => option.value === currentValue)) {
    options.unshift({
      value: currentValue,
      label: `${currentValue} (chưa khớp vai trò Workspace)`,
    });
  }

  return options;
}

function objectReferenceOptions(
  operation: OperationalBlueprintContract,
  currentValue: string | null | undefined,
  emptyLabel: string,
) {
  const current = String(currentValue ?? "").trim();
  const options: SelectOption[] = [
    {
      value: "",
      label: emptyLabel,
    },
    ...operation.objectTypes.map((objectType) => ({
      value: objectType.targetType,
      label: `${objectType.label || objectType.targetType} (${objectType.targetType})`,
    })),
  ];

  if (current && !options.some((option) => typeof option !== "string" && option.value === current)) {
    options.unshift({
      value: current,
      label: `${current} (chưa khớp object domain)`,
    });
  }

  return options;
}

function workspaceRoleSummary(role: OperationalBlueprintWorkspaceRole) {
  const itemTargets = role.itemTargetTypes.length
    ? role.itemTargetTypes.join(", ")
    : "chưa nhận item";
  const identityTarget = role.identityTargetType || "không có object định danh riêng";

  return `${workspaceCardinalityHelp(role.cardinality)} Workspace này nhận item: ${itemTargets}. Định danh: ${identityTarget}.`;
}

function flowStepLabel(
  operation: OperationalBlueprintContract,
  workspaceRole: string,
) {
  const role = operation.workspaceRoles.find((item) => item.key === workspaceRole);

  return role ? `${role.label} (${role.key})` : `${workspaceRole} (chưa khớp Workspace)`;
}

function normalizeFlowSteps(flow: OperationalBlueprintCoreFlow) {
  return flow.steps.map((step, index) => ({
    ...step,
    isEntry: index === 0,
    isTerminal: index === flow.steps.length - 1,
  }));
}

function appendFlowStep(
  operation: OperationalBlueprintContract,
  flow: OperationalBlueprintCoreFlow,
  workspaceRole: string,
) {
  if (flow.steps.some((step) => step.workspaceRole === workspaceRole)) {
    return normalizeFlowSteps(flow);
  }

  const role = operation.workspaceRoles.find((item) => item.key === workspaceRole);
  const steps = [
    ...flow.steps,
    {
      workspaceRole,
      label: role?.label ?? workspaceRole,
      description: role
        ? `Đi qua ${role.label}.`
        : `Bước trong luồng cho ${workspaceRole}.`,
      isEntry: false,
      isTerminal: false,
    },
  ];

  return normalizeFlowSteps({
    ...flow,
    steps,
  });
}

function removeFlowStep(flow: OperationalBlueprintCoreFlow, stepIndex: number) {
  return normalizeFlowSteps({
    ...flow,
    steps: flow.steps.filter((_, index) => index !== stepIndex),
  });
}

function dedupeFlowSteps(flow: OperationalBlueprintCoreFlow) {
  const seen = new Set<string>();

  return normalizeFlowSteps({
    ...flow,
    steps: flow.steps.filter((step) => {
      if (seen.has(step.workspaceRole)) return false;
      seen.add(step.workspaceRole);
      return true;
    }),
  });
}

function hasDuplicateFlowSteps(flow: OperationalBlueprintCoreFlow) {
  const seen = new Set<string>();

  return flow.steps.some((step) => {
    if (seen.has(step.workspaceRole)) return true;
    seen.add(step.workspaceRole);
    return false;
  });
}

function flowStepOptions(
  operation: OperationalBlueprintContract,
  flow: OperationalBlueprintCoreFlow,
): SelectOption[] {
  const usedRoles = new Set(flow.steps.map((step) => step.workspaceRole));

  return [
    {
      value: "",
      label: "Thêm Workspace vào luồng...",
    },
    ...operation.workspaceRoles
      .filter((role) => !usedRoles.has(role.key))
      .map((role) => ({
        value: role.key,
        label: `${role.label || role.key} (${role.key})`,
      })),
  ];
}

function eventKeyOptions(targetType: string, currentValue: string) {
  const targetOption = operationTargetTypeOption(targetType);
  const options = operationEventOptionsForTargetType(targetType).map((event) => ({
    value: event.key,
    label: `${event.key} - ${event.label}`,
  }));

  if (currentValue && !options.some((option) => option.value === currentValue)) {
    options.push({
      value: currentValue,
      label: `${currentValue} (đang lệch, nên đổi)`,
    });
  }

  if (options.length) return options;

  return targetOption
    ? [
        {
          value: targetOption.defaultEventKey,
          label: `${targetOption.defaultEventKey} - ${targetOption.label}`,
        },
      ]
    : [];
}

function syncOperationRouteTarget(
  operation: OperationalBlueprintContract,
  routeIndex: number,
): OperationalBlueprintContract {
  const primaryObject = operation.objectTypes[0];
  if (!primaryObject) return operation;

  const targetOption = operationTargetTypeOption(primaryObject.targetType);
  const nextEventKey = targetOption?.defaultEventKey;

  return patchOperationListItem(operation, "eventRoutes", routeIndex, {
    targetType: primaryObject.targetType,
    eventKey: nextEventKey ?? operation.eventRoutes[routeIndex]?.eventKey,
  });
}

function syncOperationActionTarget(
  operation: OperationalBlueprintContract,
  actionIndex: number,
): OperationalBlueprintContract {
  const primaryObject = operation.objectTypes[0];
  if (!primaryObject) return operation;

  const targetOption = operationTargetTypeOption(primaryObject.targetType);

  return patchOperationListItem(operation, "actions", actionIndex, {
    targetType: primaryObject.targetType,
    key: targetOption?.defaultActionKey ?? operation.actions[actionIndex]?.key,
    command: targetOption?.defaultCommand ?? operation.actions[actionIndex]?.command,
    emits: targetOption?.defaultEventKey
      ? [targetOption.defaultEventKey]
      : operation.actions[actionIndex]?.emits ?? [],
  });
}

function actionSummary(
  operation: OperationalBlueprintContract,
  action: OperationalBlueprintAction,
) {
  const workspaceLabel = flowStepLabel(operation, action.workspaceRole);
  const targetLabel =
    operation.objectTypes.find((objectType) => objectType.targetType === action.targetType)
      ?.label ?? action.targetType;
  const emittedEvent = action.emits[0] || "chưa phát event";

  return `Nút này nằm ở ${workspaceLabel}, xử lý ${targetLabel}, gọi ${action.command}, rồi phát ${emittedEvent}.`;
}

function workflowSummary(
  operation: OperationalBlueprintContract,
  workflow: OperationalBlueprintWorkflow,
) {
  const workspaceLabel = flowStepLabel(operation, workflow.workspaceRole);
  const states = workflow.states.length ? workflow.states.join(" -> ") : "chưa có trạng thái";

  return `Workflow này quản lý trạng thái trong ${workspaceLabel}. Các trạng thái chính: ${states}.`;
}

function stateOptions(workflow: OperationalBlueprintWorkflow, currentValue: string) {
  const options = workflow.states.map((state) => ({
    value: state,
    label: state,
  }));

  if (currentValue && !options.some((option) => option.value === currentValue)) {
    options.push({
      value: currentValue,
      label: `${currentValue} (chưa có trong danh sách trạng thái)`,
    });
  }

  return options;
}

function workflowActionOptions(
  operation: OperationalBlueprintContract,
  currentValue: string,
) {
  const options = operation.actions.map((action) => ({
    value: action.key,
    label: `${action.label || action.key} (${action.key})`,
  }));

  if (currentValue && !options.some((option) => option.value === currentValue)) {
    options.push({
      value: currentValue,
      label: `${currentValue} (chưa khớp action)`,
    });
  }

  return options;
}

function workflowEventOptions(
  operation: OperationalBlueprintContract,
  currentValue: string,
) {
  const knownEvents = new Map<string, string>();

  operation.eventRoutes.forEach((route) => {
    knownEvents.set(route.eventKey, route.eventKey);
  });
  operation.actions.forEach((action) => {
    action.emits.forEach((eventKey) => {
      knownEvents.set(eventKey, eventKey);
    });
  });

  const options = Array.from(knownEvents.keys()).map((eventKey) => ({
    value: eventKey,
    label: eventKey,
  }));

  if (currentValue && !options.some((option) => option.value === currentValue)) {
    options.push({
      value: currentValue,
      label: `${currentValue} (chưa khớp event)`,
    });
  }

  return options;
}

function patchWorkflowTransition(
  workflow: OperationalBlueprintWorkflow,
  transitionIndex: number,
  patch: Partial<OperationalBlueprintWorkflow["transitions"][number]>,
) {
  return workflow.transitions.map((transition, index) =>
    index === transitionIndex ? { ...transition, ...patch } : transition,
  );
}

function defaultWorkflowTransition(
  operation: OperationalBlueprintContract,
  workflow: OperationalBlueprintWorkflow,
): OperationalBlueprintWorkflow["transitions"][number] {
  const firstAction = operation.actions[0];

  return {
    from: workflow.states[0] ?? "READY",
    to: workflow.states[1] ?? workflow.states[0] ?? "DONE",
    actionKey: firstAction?.key ?? "",
    eventKey: firstAction?.emits[0] ?? operation.eventRoutes[0]?.eventKey ?? "",
  };
}

function validationMessage(code: string) {
  if (code === "missing_object_type") {
    return "Chưa có business object. Hãy dựng model khởi đầu hoặc thêm object.";
  }
  if (code === "missing_workspace_role") {
    return "Có phần đang trỏ tới Workspace chưa tồn tại. Hãy dựng model khởi đầu hoặc chọn lại vai trò Workspace.";
  }
  if (code === "missing_core_flow") {
    return "Chưa có luồng Workspace. Hãy dựng model khởi đầu hoặc thêm luồng.";
  }
  if (code === "unknown_object_target") {
    return "Có phần đang trỏ tới loại object chưa khai báo.";
  }
  if (code === "unrepresented_object_target") {
    return "Object đã khai báo nhưng chưa được Workspace nào dùng.";
  }
  if (code === "missing_action") {
    return "Workflow đang trỏ tới action chưa tồn tại.";
  }
  if (code === "empty_projection_events") {
    return "Projection chưa có event nào để làm mới dữ liệu.";
  }
  if (code === "duplicate_key") {
    return "Có mã bị trùng. Hãy đổi mã để mỗi dòng là duy nhất.";
  }

  return "Cần kiểm tra lại cấu hình operation này.";
}

function OperationTemplatePicker({
  templates,
  onSelect,
}: {
  templates: OperationalBlueprintTemplate[];
  onSelect: (template: OperationalBlueprintTemplate) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="border border-slate-200 bg-slate-50 p-3">
        <div className="text-sm font-semibold text-slate-900">
          Bắt đầu dựng Operation Model
        </div>
        <div className="mt-1 text-sm text-slate-600">
          Chọn template có sẵn hoặc bắt đầu bằng bản trống. Mọi thay đổi chỉ
          nằm trong draft này cho tới khi bạn publish.
        </div>
      </div>
      <div className="space-y-2">
        {templates.map((template) => {
          const operation = template.contract;
          const validation = validateOperationalBlueprintContract(operation);

          return (
            <button
              key={template.key}
              type="button"
              onClick={() => onSelect(template)}
              className="w-full border border-slate-200 bg-white p-3 text-left hover:border-slate-400 hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-950">
                    {template.label}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {operation.key} / {operation.context} / v{operation.version}
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium ${validationTone(validation.ok)}`}
                >
                  {validation.ok ? "Hợp lệ" : `${validation.errors.length} lỗi`}
                </span>
              </div>
              <div className="mt-2 text-sm text-slate-600">
                {template.description}
              </div>
              <div className="mt-3 flex flex-wrap gap-1 text-[11px]">
                <span className="border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-700">
                  {operation.workspaceRoles.length} vai trò
                </span>
                <span className="border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-700">
                  {operation.eventRoutes.length} events
                </span>
                <span className="border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-700">
                  {operation.actions.length} actions
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function OperationModelAuthoringPanel({
  operation,
  operationEditorText,
  parsedOperationEditor,
  templates,
  sourceOperation,
  onOperationChange,
  onOperationEditorTextChange,
  onTemplateSelect,
}: Props) {
  const validation = operation
    ? validateOperationalBlueprintContract(operation)
    : null;

  function updateOperation(next: OperationalBlueprintContract) {
    onOperationChange(next);
  }

  const emptyModel =
    operation &&
    operation.objectTypes.length === 0 &&
    operation.workspaceRoles.length === 0 &&
    operation.eventRoutes.length === 0 &&
    operation.actions.length === 0;

  return (
    <div className="space-y-3">
      {!operation ? (
        <OperationTemplatePicker templates={templates} onSelect={onTemplateSelect} />
      ) : null}
      {sourceOperation && !operation ? (
        <button
          type="button"
          onClick={() =>
            onTemplateSelect({
              key: sourceOperation.key,
              label: "Source Operation",
              description:
                "Sao chép operation contract từ Blueprint gốc của draft này.",
              contract: sourceOperation,
            })
          }
          className="w-full border border-slate-900 bg-slate-950 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Sao chép operation gốc
        </button>
      ) : null}

      {operation ? (
        <div className="space-y-3">
          <div className="border border-slate-200 bg-white p-3">
            <div className="text-sm font-semibold text-slate-950">
              Bắt đầu ở đây
            </div>
            <div className="mt-2 grid gap-2 text-xs text-slate-600">
              <div className="border border-slate-100 bg-slate-50 p-2">
                <span className="font-semibold text-slate-900">1. Dựng model</span>{" "}
                để mô tả operation cần business object và Workspace nào.
              </div>
              <div className="border border-slate-100 bg-slate-50 p-2">
                <span className="font-semibold text-slate-900">2. Xem kế hoạch</span>{" "}
                để biết hệ thống sẽ tạo Workspace nào.
              </div>
              <div className="border border-slate-100 bg-slate-50 p-2">
                <span className="font-semibold text-slate-900">3. Publish</span>{" "}
                để lưu một version cố định cho runtime.
              </div>
              <div className="border border-slate-100 bg-slate-50 p-2">
                <span className="font-semibold text-slate-900">4. Tạo Space</span>{" "}
                để tạo Space/Workspace thật từ version đã publish.
              </div>
            </div>
            {emptyModel ? (
              <button
                type="button"
                onClick={() => updateOperation(starterOperationFrom(operation))}
                className="mt-3 w-full bg-slate-950 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Dựng operation đầu tiên
              </button>
            ) : null}
          </div>

          {!validation?.ok ? (
            <div className="border border-amber-200 bg-amber-50 p-3">
              <div className="text-sm font-semibold text-amber-950">
                Chưa sẵn sàng
              </div>
              <div className="mt-1 text-sm text-amber-800">
                Model cần object, vai trò Workspace, event route, action và
                workflow khớp với nhau trước khi có thể tạo Space thật.
              </div>
              <button
                type="button"
                onClick={() => updateOperation(starterOperationFrom(operation))}
                className="mt-3 w-full bg-amber-950 px-3 py-2 text-sm font-medium text-white hover:bg-amber-900"
              >
                Tự tạo model khởi đầu hợp lệ
              </button>
              <div className="mt-3 space-y-1 text-xs text-amber-800">
                {validation?.errors.slice(0, 4).map((error) => (
                  <div key={`${error.path}:${error.code}`}>
                    {validationMessage(error.code)}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              Operation Model đã hợp lệ về cấu trúc. Bạn có thể đổi tên, chỉnh
              event/action, rồi publish khi phần adapter đã ổn.
            </div>
          )}

          <details open className="border border-slate-200 p-3">
            <summary className="cursor-pointer text-sm font-semibold text-slate-900">
              Thông tin operation
            </summary>
            <div className="mt-3 grid gap-2">
              <TextInput
                label="Mã operation"
                value={operation.key}
                onChange={(value) =>
                  updateOperation(patchOperationRoot(operation, { key: value }))
                }
              />
              <TextInput
                label="Version"
                value={String(operation.version)}
                onChange={(value) =>
                  updateOperation(
                    patchOperationRoot(operation, {
                      version: Number.parseInt(value, 10) || 1,
                    }),
                  )
                }
              />
              <SelectInput
                label="Ngữ cảnh"
                value={operation.context}
                options={["DRAFT", "TECHNICAL", "PAYMENT", "OPERATION", "SALES", "MEDIA", "GENERAL"]}
                onChange={(value) =>
                  updateOperation(
                    patchOperationRoot(operation, {
                      context: value as OperationalBlueprintContract["context"],
                    }),
                  )
                }
              />
              <TextAreaInput
                label="Tóm tắt"
                value={operation.summary}
                onChange={(value) =>
                  updateOperation(patchOperationRoot(operation, { summary: value }))
                }
              />
            </div>
          </details>

          <details className="border border-slate-200 p-3">
            <summary className="cursor-pointer text-sm font-semibold text-slate-900">
              Business object
            </summary>
            <div className="mt-3 space-y-3">
              {operation.objectTypes.map((objectType, index) => (
                <div key={`${objectType.targetType}:${index}`} className="border border-slate-200 p-3">
                  <div className="grid gap-2">
                    <SelectInput
                      label="Object domain"
                      value={objectType.targetType}
                      options={targetTypeOptions(objectType.targetType)}
                      onChange={(value) =>
                        updateOperation(
                          retargetOperationObjectType(operation, index, value),
                        )
                      }
                    />
                    <div className="border border-slate-100 bg-slate-50 p-2 text-xs font-normal text-slate-600">
                      {operationTargetTypeOption(objectType.targetType)?.description ??
                        "Object này chưa có trong registry domain. Hãy chọn một object domain thật để Space biết nó đang xử lý dữ liệu nào."}
                    </div>
                    <TextInput
                      label="Tên hiển thị"
                      value={objectType.label}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "objectTypes", index, {
                            label: value,
                          }),
                        )
                      }
                    />
                    <SelectInput
                      label="Vai trò"
                      value={objectType.role}
                      options={["WORKSPACE_IDENTITY", "ITEM"]}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "objectTypes", index, {
                            role: value as OperationalBlueprintObjectType["role"],
                          }),
                        )
                      }
                    />
                    <TextAreaInput
                      label="Mô tả"
                      value={objectType.description}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "objectTypes", index, {
                            description: value,
                          }),
                        )
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateOperation(removeOperationListItem(operation, "objectTypes", index))
                    }
                    className="mt-2 text-xs font-medium text-rose-700"
                  >
                    Xóa object
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  updateOperation(
                    appendOperationListItem(
                      operation,
                      "objectTypes",
                      objectTypeTemplate(operation.objectTypes.length),
                    ),
                  )
                }
                className="w-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Thêm object
              </button>
            </div>
          </details>

          <details className="border border-slate-200 p-3">
            <summary className="cursor-pointer text-sm font-semibold text-slate-900">
              Vai trò Workspace
            </summary>
            <div className="mt-3 space-y-3">
              {operation.workspaceRoles.map((role, index) => (
                <div key={`${role.key}:${index}`} className="border border-slate-200 p-3">
                  <div className="grid gap-2">
                    <div className="border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                      {workspaceRoleSummary(role)}
                    </div>
                    <TextInput
                      label="Mã vai trò"
                      value={role.key}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "workspaceRoles", index, {
                            key: value,
                          }),
                        )
                      }
                    />
                    <TextInput
                      label="Tên hiển thị"
                      value={role.label}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "workspaceRoles", index, {
                            label: value,
                          }),
                        )
                      }
                    />
                    <SelectInput
                      label="Cách tạo Workspace"
                      value={role.cardinality}
                      options={WORKSPACE_CARDINALITY_OPTIONS}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "workspaceRoles", index, {
                            cardinality:
                              value as OperationalBlueprintWorkspaceRole["cardinality"],
                          }),
                        )
                      }
                    />
                    <div className="border border-slate-100 bg-slate-50 p-2 text-xs font-normal text-slate-600">
                      {workspaceCardinalityHelp(role.cardinality)}
                    </div>
                    <SelectInput
                      label="Object định danh Workspace"
                      value={role.identityTargetType ?? ""}
                      options={objectReferenceOptions(
                        operation,
                        role.identityTargetType,
                        "Không dùng object riêng để định danh Workspace",
                      )}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "workspaceRoles", index, {
                            identityTargetType: value || null,
                          }),
                        )
                      }
                    />
                    <SelectInput
                      label="Object hiển thị thành item"
                      value={role.itemTargetTypes[0] ?? ""}
                      options={objectReferenceOptions(
                        operation,
                        role.itemTargetTypes[0],
                        "Chưa nhận item từ object nào",
                      )}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "workspaceRoles", index, {
                            itemTargetTypes: value ? [value] : [],
                          }),
                        )
                      }
                    />
                    <TextAreaInput
                      label="Mô tả"
                      value={role.description}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "workspaceRoles", index, {
                            description: value,
                          }),
                        )
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateOperation(removeOperationListItem(operation, "workspaceRoles", index))
                    }
                    className="mt-2 text-xs font-medium text-rose-700"
                  >
                    Xóa vai trò Workspace
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  updateOperation(
                    appendOperationListItem(
                      operation,
                      "workspaceRoles",
                      workspaceRoleTemplate(operation.workspaceRoles.length),
                    ),
                  )
                }
                className="w-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Thêm vai trò Workspace
              </button>
            </div>
          </details>

          <details className="border border-slate-200 p-3">
            <summary className="cursor-pointer text-sm font-semibold text-slate-900">
              Event đưa việc vào Workspace
            </summary>
            <div className="mt-3 space-y-3">
              <div className="border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                Mỗi dòng nghĩa là: khi event domain xảy ra, hệ thống lấy object
                của event đó và đưa vào Workspace đã chọn. Đây là cách Space tự
                nhận việc mới thay vì người dùng phải tạo item thủ công.
              </div>
              {operation.eventRoutes.map((route, index) => (
                <div key={`${route.eventKey}:${route.targetType}:${index}`} className="border border-slate-200 p-3">
                  <div className="grid gap-2">
                    <SelectInput
                      label="Mã event"
                      value={route.eventKey}
                      options={eventKeyOptions(route.targetType, route.eventKey)}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "eventRoutes", index, {
                            eventKey: value,
                          }),
                        )
                      }
                    />
                    <SelectInput
                      label="Loại object"
                      value={route.targetType}
                      options={routeTargetOptions(operation, route.targetType)}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "eventRoutes", index, {
                            targetType: value,
                            eventKey:
                              operationTargetTypeOption(value)?.defaultEventKey ??
                              route.eventKey,
                          }),
                        )
                      }
                    />
                    {!operation.objectTypes.some(
                      (objectType) => objectType.targetType === route.targetType,
                    ) ? (
                      <div className="border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
                        Route này đang trỏ tới object cũ `{route.targetType}`. Object
                        domain hiện tại là `{operation.objectTypes[0]?.targetType ?? "chưa có"}`.
                        <button
                          type="button"
                          onClick={() =>
                            updateOperation(syncOperationRouteTarget(operation, index))
                          }
                          className="mt-2 block w-full border border-amber-900 bg-amber-950 px-2 py-1.5 text-xs font-semibold text-white hover:bg-amber-900"
                        >
                          Đồng bộ route này theo object domain
                        </button>
                      </div>
                    ) : null}
                    <SelectInput
                      label="Đưa vào Workspace"
                      value={route.workspaceRole}
                      options={workspaceRoleOptions(operation, route.workspaceRole)}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "eventRoutes", index, {
                            workspaceRole: value,
                          }),
                        )
                      }
                    />
                    <SelectInput
                      label="Tác động"
                      value={route.effect}
                      options={EVENT_EFFECT_OPTIONS}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "eventRoutes", index, {
                            effect: value as OperationalBlueprintEventRoute["effect"],
                          }),
                        )
                      }
                    />
                    <div className="border border-slate-100 bg-slate-50 p-2 text-xs font-normal text-slate-600">
                      {eventEffectHelp(route.effect)}
                    </div>
                    <TextAreaInput
                      label="Mô tả"
                      value={route.description}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "eventRoutes", index, {
                            description: value,
                          }),
                        )
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateOperation(removeOperationListItem(operation, "eventRoutes", index))
                    }
                    className="mt-2 text-xs font-medium text-rose-700"
                  >
                    Xóa event route
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  updateOperation(
                    appendOperationListItem(
                      operation,
                      "eventRoutes",
                      eventRouteTemplate(operation.eventRoutes.length),
                    ),
                  )
                }
                className="w-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Thêm event route
              </button>
            </div>
          </details>

          <details className="border border-slate-200 p-3">
            <summary className="cursor-pointer text-sm font-semibold text-slate-900">
              Luồng Workspace
            </summary>
            <div className="mt-3 space-y-3">
              {operation.coreFlows.map((flow, index) => (
                <div key={`${flow.key}:${index}`} className="border border-slate-200 p-3">
                  <div className="grid gap-2">
                    <TextInput
                      label="Mã luồng"
                      value={flow.key}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "coreFlows", index, {
                            key: value,
                          }),
                        )
                      }
                    />
                    <TextInput
                      label="Tên hiển thị"
                      value={flow.label}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "coreFlows", index, {
                            label: value,
                          }),
                        )
                      }
                    />
                    <div className="grid gap-2">
                      <div className="text-xs font-medium text-slate-600">
                        Thứ tự Workspace
                      </div>
                      <div className="border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                        Luồng này mô tả người dùng đi qua Workspace nào trước,
                        Workspace nào sau. Flow đơn giản chỉ có một bước.
                      </div>
                      {hasDuplicateFlowSteps(flow) ? (
                        <div className="border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                          Luồng này đang có bước trùng Workspace. Nhiều bước cùng
                          là `Workspace chính` không tạo thêm ý nghĩa vận hành.
                          <button
                            type="button"
                            onClick={() =>
                              updateOperation(
                                patchOperationListItem(operation, "coreFlows", index, {
                                  steps: dedupeFlowSteps(flow),
                                }),
                              )
                            }
                            className="mt-2 block w-full border border-amber-900 bg-amber-950 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-900"
                          >
                            Gộp các bước trùng
                          </button>
                        </div>
                      ) : null}
                      <div className="space-y-2">
                        {flow.steps.length ? (
                          flow.steps.map((step, stepIndex) => (
                            <div
                              key={`${step.workspaceRole}:${stepIndex}`}
                              className="flex items-center justify-between gap-3 border border-slate-200 bg-white px-3 py-2"
                            >
                              <div>
                                <div className="text-sm font-medium text-slate-900">
                                  {stepIndex + 1}. {flowStepLabel(operation, step.workspaceRole)}
                                </div>
                                <div className="mt-0.5 text-xs text-slate-500">
                                  {step.isEntry ? "Bắt đầu" : "Bước tiếp theo"}
                                  {step.isTerminal ? " / Kết thúc" : ""}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  updateOperation(
                                    patchOperationListItem(operation, "coreFlows", index, {
                                      steps: removeFlowStep(flow, stepIndex),
                                    }),
                                  )
                                }
                                className="text-xs font-medium text-rose-700"
                              >
                                Xóa bước
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="border border-dashed border-slate-300 bg-white p-3 text-sm text-slate-500">
                            Chưa có Workspace nào trong luồng.
                          </div>
                        )}
                      </div>
                      <SelectInput
                        label="Thêm Workspace vào luồng"
                        value=""
                        options={flowStepOptions(operation, flow)}
                        onChange={(value) => {
                          if (!value) return;

                          updateOperation(
                            patchOperationListItem(operation, "coreFlows", index, {
                              steps: appendFlowStep(operation, flow, value),
                            }),
                          );
                        }}
                      />
                    </div>
                    <TextAreaInput
                      label="Mô tả"
                      value={flow.description}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "coreFlows", index, {
                            description: value,
                          }),
                        )
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateOperation(removeOperationListItem(operation, "coreFlows", index))
                    }
                    className="mt-2 text-xs font-medium text-rose-700"
                  >
                    Xóa luồng
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  updateOperation(
                    appendOperationListItem(
                      operation,
                      "coreFlows",
                      coreFlowTemplate(operation.coreFlows.length),
                    ),
                  )
                }
                className="w-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Thêm luồng
              </button>
            </div>
          </details>

          <details className="border border-slate-200 p-3">
            <summary className="cursor-pointer text-sm font-semibold text-slate-900">
              Action người dùng bấm
            </summary>
            <div className="mt-3 space-y-3">
              {operation.actions.map((action, actionIndex) => (
                <div key={`${action.key}:${actionIndex}`} className="border border-slate-200 p-3">
                  <div className="grid gap-2">
                    <div className="border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                      {actionSummary(operation, action)}
                    </div>
                    <TextInput
                      label="Mã action"
                      value={action.key}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "actions", actionIndex, {
                            key: value,
                          }),
                        )
                      }
                    />
                    <TextInput
                      label="Tên hiển thị"
                      value={action.label}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "actions", actionIndex, {
                            label: value,
                          }),
                        )
                      }
                    />
                    <SelectInput
                      label="Action nằm ở Workspace"
                      value={action.workspaceRole}
                      options={workspaceRoleOptions(operation, action.workspaceRole)}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "actions", actionIndex, {
                            workspaceRole: value,
                          }),
                        )
                      }
                    />
                    <SelectInput
                      label="Loại object"
                      value={action.targetType}
                      options={routeTargetOptions(operation, action.targetType)}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "actions", actionIndex, {
                            targetType: value,
                            key:
                              operationTargetTypeOption(value)?.defaultActionKey ??
                              action.key,
                            command:
                              operationTargetTypeOption(value)?.defaultCommand ??
                              action.command,
                            emits: operationTargetTypeOption(value)?.defaultEventKey
                              ? [operationTargetTypeOption(value)!.defaultEventKey]
                              : action.emits,
                          }),
                        )
                      }
                    />
                    {!operation.objectTypes.some(
                      (objectType) => objectType.targetType === action.targetType,
                    ) ? (
                      <div className="border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
                        Action này đang trỏ tới object cũ `{action.targetType}`.
                        Object domain hiện tại là `{operation.objectTypes[0]?.targetType ?? "chưa có"}`.
                        <button
                          type="button"
                          onClick={() =>
                            updateOperation(syncOperationActionTarget(operation, actionIndex))
                          }
                          className="mt-2 block w-full border border-amber-900 bg-amber-950 px-2 py-1.5 text-xs font-semibold text-white hover:bg-amber-900"
                        >
                          Đồng bộ action này theo object domain
                        </button>
                      </div>
                    ) : null}
                    <TextInput
                      label="Lệnh domain"
                      value={action.command}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "actions", actionIndex, {
                            command: value,
                          }),
                        )
                      }
                    />
                    <SelectInput
                      label="Event phát ra"
                      value={action.emits[0] ?? ""}
                      options={eventKeyOptions(action.targetType, action.emits[0] ?? "")}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "actions", actionIndex, {
                            emits: value ? [value] : [],
                          }),
                        )
                      }
                    />
                    <TextAreaInput
                      label="Mô tả"
                      value={action.description}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "actions", actionIndex, {
                            description: value,
                          }),
                        )
                      }
                    />
                  </div>
                  <div className="mt-3 border border-slate-100 p-2">
                    <div className="text-xs font-semibold text-slate-700">Trường nhập liệu</div>
                    <div className="mt-2 space-y-2">
                      {action.fields.map((field, fieldIndex) => (
                        <div
                          key={`${action.key}:${field.key}:${fieldIndex}`}
                          className="grid gap-2 border border-slate-100 p-2"
                        >
                          <TextInput
                            label="Mã field"
                            value={field.key}
                            onChange={(value) =>
                              updateOperation(
                                patchOperationActionField(
                                  operation,
                                  actionIndex,
                                  fieldIndex,
                                  { key: value },
                                ),
                              )
                            }
                          />
                          <TextInput
                            label="Tên field"
                            value={field.label}
                            onChange={(value) =>
                              updateOperation(
                                patchOperationActionField(
                                  operation,
                                  actionIndex,
                                  fieldIndex,
                                  { label: value },
                                ),
                              )
                            }
                          />
                          <SelectInput
                            label="Kiểu field"
                            value={field.kind}
                            options={["text", "textarea", "select", "money", "boolean", "date"]}
                            onChange={(value) =>
                              updateOperation(
                                patchOperationActionField(
                                  operation,
                                  actionIndex,
                                  fieldIndex,
                                  {
                                    kind: value as OperationalBlueprintAction["fields"][number]["kind"],
                                  },
                                ),
                              )
                            }
                          />
                          <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(event) =>
                                updateOperation(
                                  patchOperationActionField(
                                    operation,
                                    actionIndex,
                                    fieldIndex,
                                    { required: event.target.checked },
                                  ),
                                )
                              }
                            />
                            Bắt buộc
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              updateOperation(
                                removeOperationActionField(
                                  operation,
                                  actionIndex,
                                  fieldIndex,
                                ),
                              )
                            }
                            className="text-left text-xs font-medium text-rose-700"
                          >
                            Xóa field
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          updateOperation(
                            appendOperationActionField(operation, actionIndex, {
                              key: nextKey("field", action.fields.length).toLowerCase(),
                              label: "New field",
                              kind: "text",
                              required: false,
                            }),
                          )
                        }
                        className="w-full border border-slate-200 px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Thêm field
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateOperation(removeOperationListItem(operation, "actions", actionIndex))
                    }
                    className="mt-2 text-xs font-medium text-rose-700"
                  >
                    Xóa action
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  updateOperation(
                    appendOperationListItem(
                      operation,
                      "actions",
                      actionTemplate(operation.actions.length),
                    ),
                  )
                }
                className="w-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Thêm action
              </button>
            </div>
          </details>

          <details className="border border-slate-200 p-3">
            <summary className="cursor-pointer text-sm font-semibold text-slate-900">
              Workflow của Workspace
            </summary>
            <div className="mt-3 space-y-3">
              {operation.workflows.map((workflow, index) => (
                <div key={`${workflow.key}:${index}`} className="border border-slate-200 p-3">
                  <div className="grid gap-2">
                    <div className="border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                      {workflowSummary(operation, workflow)}
                    </div>
                    <TextInput
                      label="Mã workflow"
                      value={workflow.key}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "workflows", index, {
                            key: value,
                          }),
                        )
                      }
                    />
                    <SelectInput
                      label="Workflow thuộc Workspace"
                      value={workflow.workspaceRole}
                      options={workspaceRoleOptions(operation, workflow.workspaceRole)}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "workflows", index, {
                            workspaceRole: value,
                          }),
                        )
                      }
                    />
                    <TextInput
                      label="Trạng thái (cách nhau bằng dấu phẩy)"
                      value={csv(workflow.states)}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(operation, "workflows", index, {
                            states: parseCsv(value),
                          }),
                        )
                      }
                    />
                    <div className="grid gap-2">
                      <div className="text-xs font-medium text-slate-600">
                        Chuyển trạng thái
                      </div>
                      <div className="border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                        Mỗi dòng nghĩa là: khi Workspace đang ở trạng thái A,
                        user bấm action, action phát event, rồi Workspace chuyển
                        sang trạng thái B.
                      </div>
                      <div className="space-y-2">
                        {workflow.transitions.length ? (
                          workflow.transitions.map((transition, transitionIndex) => (
                            <div
                              key={`${transition.from}:${transition.to}:${transitionIndex}`}
                              className="grid gap-2 border border-slate-200 bg-white p-3 md:grid-cols-2"
                            >
                              <SelectInput
                                label="Từ trạng thái"
                                value={transition.from}
                                options={stateOptions(workflow, transition.from)}
                                onChange={(value) =>
                                  updateOperation(
                                    patchOperationListItem(operation, "workflows", index, {
                                      transitions: patchWorkflowTransition(
                                        workflow,
                                        transitionIndex,
                                        { from: value },
                                      ),
                                    }),
                                  )
                                }
                              />
                              <SelectInput
                                label="Sang trạng thái"
                                value={transition.to}
                                options={stateOptions(workflow, transition.to)}
                                onChange={(value) =>
                                  updateOperation(
                                    patchOperationListItem(operation, "workflows", index, {
                                      transitions: patchWorkflowTransition(
                                        workflow,
                                        transitionIndex,
                                        { to: value },
                                      ),
                                    }),
                                  )
                                }
                              />
                              <SelectInput
                                label="Khi bấm action"
                                value={transition.actionKey}
                                options={workflowActionOptions(operation, transition.actionKey)}
                                onChange={(value) =>
                                  updateOperation(
                                    patchOperationListItem(operation, "workflows", index, {
                                      transitions: patchWorkflowTransition(
                                        workflow,
                                        transitionIndex,
                                        { actionKey: value },
                                      ),
                                    }),
                                  )
                                }
                              />
                              <SelectInput
                                label="Event xác nhận"
                                value={transition.eventKey}
                                options={workflowEventOptions(operation, transition.eventKey)}
                                onChange={(value) =>
                                  updateOperation(
                                    patchOperationListItem(operation, "workflows", index, {
                                      transitions: patchWorkflowTransition(
                                        workflow,
                                        transitionIndex,
                                        { eventKey: value },
                                      ),
                                    }),
                                  )
                                }
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  updateOperation(
                                    patchOperationListItem(operation, "workflows", index, {
                                      transitions: workflow.transitions.filter(
                                        (_, itemIndex) => itemIndex !== transitionIndex,
                                      ),
                                    }),
                                  )
                                }
                                className="text-left text-xs font-medium text-rose-700 md:col-span-2"
                              >
                                Xóa chuyển trạng thái
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="border border-dashed border-slate-300 bg-white p-3 text-sm text-slate-500">
                            Chưa có chuyển trạng thái nào.
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updateOperation(
                            patchOperationListItem(operation, "workflows", index, {
                              transitions: [
                                ...workflow.transitions,
                                defaultWorkflowTransition(operation, workflow),
                              ],
                            }),
                          )
                        }
                        className="w-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Thêm chuyển trạng thái
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateOperation(removeOperationListItem(operation, "workflows", index))
                    }
                    className="mt-2 text-xs font-medium text-rose-700"
                  >
                    Xóa workflow
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  updateOperation(
                    appendOperationListItem(
                      operation,
                      "workflows",
                      workflowTemplate(operation.workflows.length),
                    ),
                  )
                }
                className="w-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Thêm workflow
              </button>
            </div>
          </details>

          <details className="border border-slate-200 p-3">
            <summary className="cursor-pointer text-sm font-semibold text-slate-900">
              Projection cần làm mới
            </summary>
            <div className="mt-3 space-y-3">
              {operation.projectionSubscriptions.map((subscription, index) => (
                <div key={`${subscription.projectionKey}:${index}`} className="border border-slate-200 p-3">
                  <div className="grid gap-2">
                    <TextInput
                      label="Mã projection"
                      value={subscription.projectionKey}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(
                            operation,
                            "projectionSubscriptions",
                            index,
                            { projectionKey: value },
                          ),
                        )
                      }
                    />
                    <TextInput
                      label="Event làm mới"
                      value={csv(subscription.eventKeys)}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(
                            operation,
                            "projectionSubscriptions",
                            index,
                            { eventKeys: parseCsv(value) },
                          ),
                        )
                      }
                    />
                    <TextInput
                      label="Đọc dữ liệu cho object"
                      value={subscription.resolvesToTargetType}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(
                            operation,
                            "projectionSubscriptions",
                            index,
                            { resolvesToTargetType: value },
                          ),
                        )
                      }
                    />
                    <TextAreaInput
                      label="Mô tả"
                      value={subscription.description}
                      onChange={(value) =>
                        updateOperation(
                          patchOperationListItem(
                            operation,
                            "projectionSubscriptions",
                            index,
                            { description: value },
                          ),
                        )
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateOperation(
                        removeOperationListItem(
                          operation,
                          "projectionSubscriptions",
                          index,
                        ),
                      )
                    }
                    className="mt-2 text-xs font-medium text-rose-700"
                  >
                    Xóa projection
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  updateOperation(
                    appendOperationListItem(
                      operation,
                      "projectionSubscriptions",
                      projectionTemplate(operation.projectionSubscriptions.length),
                    ),
                  )
                }
                className="w-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Thêm projection
              </button>
            </div>
          </details>
        </div>
      ) : null}

      <details open className="border border-slate-200 p-3">
        <summary className="cursor-pointer text-sm font-semibold text-slate-900">
          JSON kỹ thuật
        </summary>
        <textarea
          value={operationEditorText}
          spellCheck={false}
          onChange={(event) => onOperationEditorTextChange(event.target.value)}
          className="mt-3 h-[360px] w-full resize-y border border-slate-300 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-100 outline-none"
        />
        {!parsedOperationEditor.ok ? (
          <div className="mt-2 text-sm text-rose-700">
            {parsedOperationEditor.error}
          </div>
        ) : null}
        <div className="mt-2 text-xs text-slate-500">
          Phần này dành cho kiểm tra kỹ thuật. Người dùng thường chỉ cần các
          mục ở phía trên.
        </div>
      </details>
    </div>
  );
}
